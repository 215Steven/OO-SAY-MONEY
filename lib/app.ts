import express, { type Request, type Response } from "express";
import { CONFIG } from "./config.js";
import { notion, resolveDataSourceId, findMembersByLineUserId } from "./notion.js";
import { lineClient, verifyWebhookSignature, getVerifiedUserId } from "./line.js";
import { isValidEmail, upsertMailerliteSubscriber } from "./mailerlite.js";
import {
  getMemberRichMenuId,
  getCurrentRichMenuDefinition,
  applyRichMenuAreaUpdates,
} from "./richmenu.js";
import { RICHMENU_ADMIN_HTML } from "./richmenuAdminHtml.js";
import {
  isValidQuizType,
  pushQuizResultMessage,
  stashPendingQuizResult,
  getPendingQuizResult,
  buildQuizResultFlex,
  QUIZ_RESULT_TRIGGER_TEXT,
} from "./quiz.js";

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

        // 測驗結果觸發：QuizPage 用 liff.sendMessages() 送出這句話換一個
        // 免費的 replyToken，這裡查回剛才暫存的結果並用 reply 回精美結果卡
        // （不計入官方帳號每月推播則數）。跟會員身分無關，要在下面的會員
        // 檢查「之前」處理完並 return，避免被會員檢查攔截、回錯訊息。
        if (isText && text === QUIZ_RESULT_TRIGGER_TEXT) {
          const pending = await getPendingQuizResult(userId).catch(() => null);
          if (pending) {
            await lineClient
              .replyMessage({
                replyToken: event.replyToken,
                messages: [buildQuizResultFlex(pending.winner, pending.subType) as any],
              })
              .catch((e) => console.error("Quiz result reply failed:", e));
          }
          return;
        }

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
// 3c. 測驗結果回傳到 LINE 對話（見 lib/quiz.ts）
// 優先走免費管道：前端先呼叫這支 API 把結果暫存起來，再嘗試
// liff.sendMessages() 觸發 webhook 換免費的 reply；只有在那個管道不可用
// （例如非一對一聊天室情境開啟）時，前端才會帶 wantPush:true 再呼叫一次，
// 這裡才會用 pushMessage（計入每月推播則數）當備援送出。
// ---------------------------------------------------------------------------
app.post("/api/quiz-result", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    const { winner, subType, wantPush } = req.body || {};
    if (!isValidQuizType(winner)) {
      res.status(400).json({ error: "winner 參數不正確" });
      return;
    }
    const validSub = isValidQuizType(subType) ? subType : null;

    await stashPendingQuizResult(userId, winner, validSub).catch((e) =>
      console.warn("暫存測驗結果失敗：", e?.message || e)
    );

    let sent = false;
    if (wantPush) {
      sent = await pushQuizResultMessage(userId, winner, validSub);
    }

    res.json({ status: "ok", sent });
  } catch (error) {
    serverError(res, "/api/quiz-result", error);
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
//
// Notion「保單」資料庫實際欄位（曾用暫時性除錯端點確認過，非猜測）：
// 每一列代表「一位家庭成員」，不是一張保單。核心欄位：
//   姓名（title，格式like「Steven - 本人」）、成員姓名（該成員本名）、
//   稱謂（本人／配偶／子女）、年齡、負責顧問、最後更新、LINE UserID。
// 另外四大類保障，各自有「狀態／說明／備註」三欄：
//   壽險狀態／壽險說明／壽險備註
//   醫療狀態／醫療說明／醫療備註
//   投資狀態／投資說明／投資備註（＋投資教育_標題）
//   產險狀態／產險說明／產險_備註（注意備註欄位名稱底線位置不一致，是資料庫既有欄位，不可自行更名）
// ---------------------------------------------------------------------------
const INSURANCE_CATEGORIES = [
  { key: "life", label: "壽險", statusProp: "壽險狀態", descProp: "壽險說明", noteProp: "壽險備註" },
  { key: "medical", label: "醫療", statusProp: "醫療狀態", descProp: "醫療說明", noteProp: "醫療備註" },
  { key: "invest", label: "投資", statusProp: "投資狀態", descProp: "投資說明", noteProp: "投資備註" },
  { key: "property", label: "產險", statusProp: "產險狀態", descProp: "產險說明", noteProp: "產險_備註" },
] as const;

function richText(page: any, prop: string): string {
  return page.properties?.[prop]?.rich_text?.[0]?.plain_text || "";
}
function selectValue(page: any, prop: string): string {
  return page.properties?.[prop]?.select?.name || "";
}

function mapInsuranceRow(page: any) {
  return {
    id: page.id,
    name: richText(page, "成員姓名") || page.properties?.["姓名"]?.title?.[0]?.plain_text || "",
    relation: selectValue(page, "稱謂"),
    age: page.properties?.["年齡"]?.number ?? null,
    advisor: richText(page, "負責顧問"),
    lastUpdated: page.properties?.["最後更新"]?.date?.start || "",
    categories: INSURANCE_CATEGORIES.map((c) => ({
      key: c.key,
      label: c.label,
      status: selectValue(page, c.statusProp),
      desc: richText(page, c.descProp),
      note: richText(page, c.noteProp),
    })),
  };
}

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
      filter: { property: "LINE UserID", rich_text: { equals: userId } },
    });

    const data = response.results
      .filter((p: any) => !p.archived && !p.in_trash)
      .map(mapInsuranceRow);

    res.json({ status: "ok", data });
  } catch (error) {
    serverError(res, "/api/insurance", error);
  }
});

/** 確保「保單」資料庫有生日／手機欄位，沒有就自動建立（供核身比對與補寫用） */
async function ensureInsuranceIdentityFields(dataSourceId: string) {
  try {
    await (notion as any).dataSources.update({
      data_source_id: dataSourceId,
      properties: { 生日: { rich_text: {} }, 手機: { rich_text: {} } },
    });
  } catch (e: any) {
    console.warn("確保保單資料庫生日／手機欄位失敗（可能已存在或權限不足）：", e?.message || e);
  }
}

// 手機號碼比對時忽略空白、破折號等格式差異，只比對數字本身
function normalizePhone(v: string): string {
  return (v || "").replace(/\D/g, "");
}

// ---------------------------------------------------------------------------
// 5b. 核身比對：使用者填入姓名／生日／手機，找不到自己保單資料時使用。
// 核對成功後把 LINE UserID 補寫回對應保單資料（同時補上生日／手機，若原本是空的），
// 之後就能直接用 LINE UserID 查詢，不用再重複核身。
// ---------------------------------------------------------------------------
app.post("/api/insurance/verify", async (req: Request, res: Response) => {
  try {
    const userId = await requireUser(req, res);
    if (!userId) return;

    const name = String(req.body?.name || "").trim();
    const birthday = String(req.body?.birthday || "").trim();
    const phone = String(req.body?.phone || "").trim();
    if (!name || !birthday || !phone) {
      res.status(400).json({ error: "請填寫姓名、生日與手機" });
      return;
    }

    if (!CONFIG.notionApiKey) {
      res.json({ status: "ok", matched: 0 });
      return;
    }

    const dataSourceId = await resolveDataSourceId(CONFIG.dbInsurance);
    await ensureInsuranceIdentityFields(dataSourceId);

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "成員姓名", rich_text: { equals: name } },
    });

    const normalizedPhone = normalizePhone(phone);
    const candidates = response.results.filter((p: any) => {
      if (p.archived || p.in_trash) return false;
      const existingBirthday = richText(p, "生日");
      const existingPhone = richText(p, "手機");
      // 該筆資料若已填生日／手機，必須完全比對相符；若原本是空的，先允許核對通過
      // （代表顧問尚未補齊資料），核對成功後會順便補寫這兩個欄位。
      const birthdayOk = !existingBirthday || existingBirthday === birthday;
      const phoneOk = !existingPhone || normalizePhone(existingPhone) === normalizedPhone;
      return birthdayOk && phoneOk;
    });

    for (const page of candidates as any[]) {
      const props: any = {};
      props["LINE UserID"] = { rich_text: [{ text: { content: userId } }] };
      if (!richText(page, "生日")) props["生日"] = { rich_text: [{ text: { content: birthday } }] };
      if (!richText(page, "手機")) props["手機"] = { rich_text: [{ text: { content: phone } }] };
      await notion.pages.update({ page_id: page.id, properties: props });
    }

    res.json({ status: "ok", matched: candidates.length });
  } catch (error) {
    serverError(res, "/api/insurance/verify", error);
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
// 直接在網頁編輯每格動作；儲存時會自動重建選單（LINE 選單建立後無法原地
// 編輯）、複製原圖、重新連結所有現有會員，並把新選單 ID 存進 Notion（僅存
// 這一個 ID，讓下次修改立即生效、不需要改 Vercel 環境變數或重新部署）。
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

// redeploy trigger: 套用新的 ADMIN_TOKEN 環境變數
export default app;
