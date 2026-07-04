import express, { type Request, type Response } from "express";
import { CONFIG } from "./config.js";
import { notion, resolveDataSourceId, findMembersByLineUserId } from "./notion.js";
import { lineClient, verifyWebhookSignature, getVerifiedUserId } from "./line.js";
import { isValidEmail, upsertMailerliteSubscriber } from "./mailerlite.js";
import {
  getMemberRichMenuId,
  getCurrentRichMenuDefinition,
  applyRichMenuAreaUpdates,
  syncCurrentRichMenuToNotion,
} from "./richmenu.js";
import { RICHMENU_ADMIN_HTML } from "./richmenuAdminHtml.js";

export const app = express();

// 保留 raw body 供 webhook 簽章驗證使用
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

/** 統一的錯誤回應：細節只寫 log，不回傳給呼叫端 */
function serverError(res: Response, context: string, error: unknown) {
  console.error(`API Error in ${context}:`, error);
  res.status(500).json({ error: "Internal server error" });
}

/** 需要登入的端點共用前置：驗證 LIFF token，失敗回 401 */
async function requireUser(req: Request, res: Response): Promise<string | null> {
  const userId = await getVerifiedUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized: invalid or missing LINE access token" });
  }
  return userId;
}

/** 管理端點共用前置：驗證 ADMIN_TOKEN，失敗回 403 */
function requireAdmin(req: Request, res: Response): boolean {
  const token = (req.query.token as string) || req.get("x-admin-token") || "";
  if (!CONFIG.adminToken || token !== CONFIG.adminToken) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// 1. LINE Webhook
// ---------------------------------------------------------------------------
app.post("/api/webhook", async (req: Request, res: Response) => {
  try {
    if (!verifyWebhookSignature(req)) {
      res.status(401).send("Invalid signature");
      return;
    }

    const events: any[] = req.body?.events || [];
    await Promise.all(
      events.map(async (event) => {
        const isText = event.type === "message" && event.message?.type === "text";
        const isPostback = event.type === "postback";
        if (!isText && !isPostback) return;

        const text: string = isText ? event.message.text : event.postback?.data || "";
        const userId: string | undefined = event.source?.userId;
        if (!userId) return;

        // [自動化機制] 檢查使用者是否還在 Notion 會員資料庫中
        let isMember = true;
        if (CONFIG.notionApiKey) {
          try {
            const members = await findMembersByLineUserId(userId);
            isMember = members.length > 0;
          } catch (e) {
            console.error("Notion member check failed:", e);
            return; // 查詢失敗時不變更使用者狀態
          }
        }

        // 已不在資料庫：解除 rich menu 綁定並通知
        if (!isMember) {
          await lineClient.unlinkRichMenuIdFromUser(userId).catch((e) =>
            console.error("Unlink failed:", e)
          );
          await lineClient
            .replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: "text",
                  text: "系統通知：您的會員身分已更新，已切換回訪客選單（如果選單未變，請重新開啟 LINE）。如需重啟服務請再次註冊！",
                },
              ],
            })
            .catch((e) => console.error("Reply failed:", e));
          return;
        }

        // 關鍵字回應
        if (text === "查詢我的保險") {
          await lineClient
            .replyMessage({
              replyToken: event.replyToken,
              messages: [
                { type: "text", text: "您的專屬保險資料正在準備中，請稍候。" },
              ],
            })
            .catch((e) => console.error("Reply failed:", e));
        }
      })
    );

    res.status(200).end();
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).end();
  }
});

// ---------------------------------------------------------------------------
// 2. 會員驗證（依 LIFF token 判斷身分，並同步 rich menu）
// ---------------------------------------------------------------------------
app.get("/api/check-member", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    let isMember = false;
    if (CONFIG.notionApiKey) {
      const members = await findMembersByLineUserId(userId);
      isMember = members.length > 0;
    }

    if (CONFIG.lineChannelAccessToken) {
      const richMenuId = await getMemberRichMenuId();
      if (isMember && richMenuId) {
        await lineClient
          .linkRichMenuIdToUser(userId, richMenuId)
          .catch((e) => console.error("Link menu failed:", e));
      } else {
        await lineClient
          .unlinkRichMenuIdFromUser(userId)
          .catch((e) => console.error("Unlink menu failed:", e));
      }
    }

    res.json({ status: "ok", isMember });
  } catch (error) {
    serverError(res, "/api/check-member", error);
  }
});

// ---------------------------------------------------------------------------
// 3. 註冊 / 更新會員資料
// ---------------------------------------------------------------------------
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    const { identity, name, phone, birthday, email, newsletter, registerSource } =
      req.body || {};

    // 有勾電子報時檢查 email 格式（最終驗證由 MailerLite double opt-in 確認信完成）
    if (newsletter && (!email || !isValidEmail(String(email)))) {
      res.status(400).json({ error: "Email 格式不正確，請重新確認" });
      return;
    }

    if (CONFIG.notionApiKey) {
      const dataSourceId = await resolveDataSourceId(CONFIG.dbMembers);
      const existing = await findMembersByLineUserId(userId);

      const properties: any = {
        名字: { title: [{ text: { content: name || "" } }] },
        "LINE User ID": { rich_text: [{ text: { content: userId } }] },
        手機號碼: { rich_text: [{ text: { content: phone || "" } }] },
        生日: { rich_text: [{ text: { content: birthday || "" } }] },
        email: { email: email || null },
        客戶來源: { select: { name: identity || "其他" } },
        訂閱電子報: { checkbox: !!newsletter },
      };
      // 註冊來源追蹤：Notion 需有「註冊入口」select 欄位；沒有時自動略過不擋註冊
      if (registerSource) {
        properties["註冊入口"] = {
          select: { name: String(registerSource).slice(0, 50) },
        };
      }

      const saveMember = async (props: any) => {
        if (existing.length > 0) {
          // 已存在則更新，避免重複建立
          await notion.pages.update({ page_id: existing[0].id, properties: props });
        } else {
          await notion.pages.create({
            parent: { data_source_id: dataSourceId } as any,
            properties: props,
          });
        }
      };

      try {
        await saveMember(properties);
      } catch (e: any) {
        if (properties["註冊入口"] && e?.code === "validation_error") {
          // 「註冊入口」欄位可能不存在：嘗試自動建立後重試
          try {
            await (notion as any).dataSources.update({
              data_source_id: dataSourceId,
              properties: { 註冊入口: { select: {} } },
            });
            await saveMember(properties);
          } catch (schemaErr: any) {
            // 建立欄位也失敗：放棄來源追蹤，確保註冊本身成功
            console.warn("自動建立註冊入口欄位失敗，略過來源追蹤：", schemaErr?.message);
            delete properties["註冊入口"];
            await saveMember(properties);
          }
        } else {
          throw e;
        }
      }
    }

    if (CONFIG.lineChannelAccessToken) {
      const richMenuId = await getMemberRichMenuId();
      if (richMenuId) {
        await lineClient
          .linkRichMenuIdToUser(userId, richMenuId)
          .catch((e) => console.error("Link menu failed:", e));
      }
    }

    // 電子報：同步到 MailerLite（double opt-in 確認信由 MailerLite 寄出）
    if (newsletter && email) {
      await upsertMailerliteSubscriber(String(email), String(name || ""));
    }

    res.json({ status: "ok" });
  } catch (error) {
    serverError(res, "/api/register", error);
  }
});

// ---------------------------------------------------------------------------
// 3b. 電子報訂閱（獨立入口，不需要加入會員，僅同步到 MailerLite）
// ---------------------------------------------------------------------------
app.post("/api/newsletter", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body || {};

    if (!email || !isValidEmail(String(email))) {
      res.status(400).json({ error: "Email 格式不正確，請重新確認" });
      return;
    }

    const ok = await upsertMailerliteSubscriber(String(email), String(name || ""));
    if (!ok) {
      res.status(400).json({ error: "訂閱失敗，請確認 Email 或稍後再試一次" });
      return;
    }

    res.json({ status: "ok" });
  } catch (error) {
    serverError(res, "/api/newsletter", error);
  }
});

// ---------------------------------------------------------------------------
// 4. 預約
// ---------------------------------------------------------------------------
app.post("/api/reservations", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    const { date, time, serviceType, notes } = req.body || {};
    if (!date || !serviceType) {
      res.status(400).json({ error: "Missing date or serviceType" });
      return;
    }

    if (CONFIG.notionApiKey) {
      const dataSourceId = await resolveDataSourceId(CONFIG.dbReservations);
      await notion.pages.create({
        parent: { data_source_id: dataSourceId } as any,
        properties: {
          Title: { title: [{ text: { content: `${serviceType} - ${date}` } }] },
          LineUserID: { rich_text: [{ text: { content: userId } }] },
          Date: { date: { start: date } },
          Time: { rich_text: [{ text: { content: time || "" } }] },
          ServiceType: { select: { name: serviceType } },
          Notes: { rich_text: [{ text: { content: notes || "" } }] },
        } as any,
      });
    }

    res.json({ status: "ok" });
  } catch (error) {
    serverError(res, "/api/reservations", error);
  }
});

// ---------------------------------------------------------------------------
// 5. 查詢自己的保單（身分一律以 token 為準）
// ---------------------------------------------------------------------------
app.get("/api/insurance", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    if (!CONFIG.notionApiKey) {
      res.json({ status: "ok", data: [] });
      return;
    }

    const dataSourceId = await resolveDataSourceId(CONFIG.dbInsurance);
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "LineUserID", rich_text: { equals: userId } },
    });

    const data = response.results.map((page: any) => ({
      id: page.id,
      policyName: page.properties["PolicyName"]?.title?.[0]?.text?.content || "",
      coverage: page.properties["Coverage"]?.rich_text?.[0]?.text?.content || "",
      status: page.properties["Status"]?.select?.name || "",
    }));

    res.json({ status: "ok", data });
  } catch (error) {
    serverError(res, "/api/insurance", error);
  }
});

// ---------------------------------------------------------------------------
// 6. 管理端點：解除 rich menu 綁定（需 ADMIN_TOKEN）
// ---------------------------------------------------------------------------
app.get("/api/admin/unlink/:lineUserId", async (req: Request, res: Response) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { lineUserId } = req.params;
    await lineClient.unlinkRichMenuIdFromUser(lineUserId);
    res.send(
      `<h1>✅ 成功解除綁定！</h1><p>已恢復為預設訪客選單。</p><p>請關閉此視窗。</p>`
    );
  } catch (err) {
    console.error("Admin unlink error:", err);
    res.status(500).send("<h1>❌ 解除綁定失敗</h1>");
  }
});

// ---------------------------------------------------------------------------
// 7. 管理端點：會員六格選單後台（需 ADMIN_TOKEN）
// 讀取/修改目前會員選單的每格動作；儲存時會自動重建選單（LINE 選單建立後
// 無法原地編輯）、複製原圖、重新連結所有現有會員，並把新選單 ID 存進
// Notion，讓下次修改立即生效、不需要改 Vercel 環境變數或重新部署。
// ---------------------------------------------------------------------------
app.get("/api/admin/richmenu-ui", (req: Request, res: Response) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(RICHMENU_ADMIN_HTML);
});

app.get("/api/admin/richmenu", async (req: Request, res: Response) => {
  try {
    if (!requireAdmin(req, res)) return;
    const data = await getCurrentRichMenuDefinition();
    res.json({ status: "ok", ...data });
  } catch (error) {
    serverError(res, "/api/admin/richmenu", error);
  }
});

app.post("/api/admin/richmenu", async (req: Request, res: Response) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { areas } = req.body || {};
    if (!Array.isArray(areas)) {
      res.status(400).json({ error: "areas 為必填陣列" });
      return;
    }
    const result = await applyRichMenuAreaUpdates(areas);
    res.json({ status: "ok", ...result });
  } catch (error) {
    serverError(res, "/api/admin/richmenu", error);
  }
});

// 把目前選單同步到 Notion（第一次使用 / 想重新對齊真實狀態時按）
app.get("/api/admin/richmenu/sync-to-notion", async (req: Request, res: Response) => {
  try {
    if (!requireAdmin(req, res)) return;
    const result = await syncCurrentRichMenuToNotion();
    res.json({ status: "ok", ...result });
  } catch (error) {
    serverError(res, "/api/admin/richmenu/sync-to-notion", error);
  }
});

// 套用 Notion 目前內容到 LINE 選單（改完 Notion 後按這個才會真的生效）
app.post("/api/admin/richmenu/apply", async (req: Request, res: Response) => {
  try {
    if (!requireAdmin(req, res)) return;
    const result = await applyRichMenuAreaUpdates();
    res.json({ status: "ok", ...result });
  } catch (error) {
    serverError(res, "/api/admin/richmenu/apply", error);
  }
});

export default app;
