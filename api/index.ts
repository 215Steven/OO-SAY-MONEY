// @ts-nocheck
import express from "express";
import { Client } from "@notionhq/client";
import { messagingApi, middleware as lineMiddleware } from "@line/bot-sdk";
import cors from "cors";

const { MessagingApiClient } = messagingApi;
const app = express();

app.use(cors());

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "mock_token",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "mock_secret"
};

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const lineClient = new MessagingApiClient(lineConfig);

// 1. LINE Webhook Endpoint
app.post("/api/webhook", lineMiddleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    for (const event of events) {
      if ((event.type === 'message' && event.message.type === 'text') || event.type === 'postback') {
         const text = event.type === 'message' ? event.message.text : event.postback?.data || '';
         const userId = event.source.userId;
         
         if (userId) {
           // [自動化機制] 檢查使用者是否還在 Notion 會員資料庫中
           const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
           let isMember = true;
           let resultsCount = 0;
           
           if (process.env.NOTION_API_KEY && dbId) {
             let dataSourceId = dbId;
             try {
               const dbResponse: any = await notion.databases.retrieve({ database_id: dbId });
               if (dbResponse.data_sources && dbResponse.data_sources.length > 0) {
                 dataSourceId = dbResponse.data_sources[0].id;
               }
             } catch (e) {
               // Fallback: assume dbId is already a valid data_source_id or old DB.
             }
             try {
               const response = await notion.dataSources.query({
                 data_source_id: dataSourceId,
                 filter: { property: "LINE User ID", rich_text: { equals: userId } }
               });
               
               const validMembers = response.results.filter((res: any) => !res.archived && !(res.in_trash));
               resultsCount = validMembers.length;
               isMember = resultsCount > 0;
               
               // Debug message to user if needed
               // console.log("Notion results:", validMembers.length);
             } catch (e: any) {
               console.error("Notion check failed:", e);
               await lineClient.replyMessage({
                 replyToken: event.replyToken,
                 messages: [{ type: 'text', text: `查詢會員失敗: ${e.message}` }]
               }).catch(console.error);
               continue;
             }
           }

           // 如果發現已經不在資料庫，自動解除綁定並通知
           if (!isMember) {
             try {
               await lineClient.unlinkRichMenuIdFromUser(userId);
             } catch (unlinkErr) {
               console.error("Unlink failed:", unlinkErr);
             }

             try {
               await lineClient.replyMessage({
                 replyToken: event.replyToken,
                 messages: [{ type: 'text', text: '系統通知：您的會員身分已更新，已切換回訪客選單 (如果選單未變，請將LINE應用程式重新開啟)。如需重啟服務請再次註冊！' }]
               });
             } catch (e) {
               console.error("reply failed:", e);
             }
             continue; // 結束這個事件的處理
           }

           // 原本的關鍵字回應邏輯
           if (text === '查詢我的保險') {
              await lineClient.replyMessage({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: '您的專屬保險資料正在準備中，請稍候。' }]
              });
           } else if (text) {
              await lineClient.replyMessage({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: `您好！系統確認您目前是「專屬會員」身分。\n(Notion中找到 ${resultsCount} 筆包含您LINE ID的資料。如果您已經在Notion刪除，可能是之前測試時重複註冊綁定了多筆，請回 Notion 檢查是否有其他名稱/ID重複的資料，並將重複的資料都刪除！)` }]
              }).catch(e => console.error("reply err", e));
           }
         }
      }
    }
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

app.use(express.json());

app.get("/api/check-member", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
    const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

    let isMember = false;
    let debugInfo: any = { status: "init" };

    if (!process.env.NOTION_API_KEY) {
      debugInfo.error = "Missing NOTION_API_KEY";
    } else if (!dbId) {
      debugInfo.error = "Missing NOTION_DATABASE_ID_MEMBERS";
    } else {
      let dataSourceId = dbId;
      try {
        const dbResponse: any = await notion.databases.retrieve({ database_id: dbId });
        if (dbResponse.data_sources && dbResponse.data_sources.length > 0) {
          dataSourceId = dbResponse.data_sources[0].id;
        }
      } catch (e) {
        // Fallback
      }

      try {
        const response = await notion.dataSources.query({
          data_source_id: dataSourceId,
          filter: { property: "LINE User ID", rich_text: { equals: userId } }
        });
        
        const validMembers = response.results.filter((res: any) => !res.archived && !res.in_trash);
        isMember = validMembers.length > 0;
        debugInfo = {
          databaseId: dbId,
          queriedUserId: userId,
          rawResultsCount: response.results.length,
          validMembersCount: validMembers.length,
          // Extract some basic info to debug without leaking full objects
          firstResultProperties: response.results.length > 0 ? (response.results[0] as any).properties : null
        };
      } catch (e: any) {
        console.error("Notion check failed in /api/check-member:", e);
        debugInfo = { error: e.message, code: e.code, name: e.name };
      }
    }

    if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
      if (isMember && lineRichMenuId6) {
        try {
          await lineClient.linkRichMenuIdToUser(userId, lineRichMenuId6);
        } catch (linkErr) {
          console.error("Link menu failed:", linkErr);
        }
      } else {
        try {
          await lineClient.unlinkRichMenuIdFromUser(userId);
        } catch (unlinkErr) {
          console.error("Unlink menu failed:", unlinkErr);
        }
      }
    }

    res.json({ status: "ok", isMember, debugInfo });
  } catch (error: any) {
    console.error("API Error in check-member:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { identity, name, phone, birthday, email, newsletter, lineUserId } = req.body;
    const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
    const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

    if (process.env.NOTION_API_KEY && dbId) {
      let dataSourceId = dbId;
      try {
        const dbResponse: any = await notion.databases.retrieve({ database_id: dbId });
        if (dbResponse.data_sources && dbResponse.data_sources.length > 0) {
          dataSourceId = dbResponse.data_sources[0].id;
        }
      } catch (e) {
         // Fallback
      }

      // Check if user already exists
      const existing = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: "LINE User ID", rich_text: { equals: lineUserId } }
      });
      const validMembers = existing.results.filter((res: any) => !res.archived && !(res.in_trash));
      
      const properties = {
          "名字": { title: [{ text: { content: name || "" } }] },
          "LINE User ID": { rich_text: [{ text: { content: lineUserId || "" } }] },
          "手機號碼": { rich_text: [{ text: { content: phone || "" } }] },
          "生日": { rich_text: [{ text: { content: birthday || "" } }] },
          "email": { email: email || null },
          "客戶來源": { select: { name: identity || "其他" } },
          "訂閱電子報": { checkbox: !!newsletter }
      };
      
      if (validMembers.length > 0) {
        // Update existing instead of creating duplicate
        await notion.pages.update({
          page_id: validMembers[0].id,
          properties: properties
        });
      } else {
        // Create new
        await notion.pages.create({
          parent: { data_source_id: dataSourceId },
          properties: properties
        });
      }
    }

    if (lineUserId && process.env.LINE_CHANNEL_ACCESS_TOKEN && lineRichMenuId6) {
      await lineClient.linkRichMenuIdToUser(lineUserId, lineRichMenuId6);
    }

    res.json({ status: "ok" });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const { lineUserId, date, time, serviceType, notes } = req.body;
    const dbId = process.env.NOTION_DATABASE_ID_RESERVATIONS || "443b7fca-94e0-4fce-b685-7cde16cc8ddf";

    if (process.env.NOTION_API_KEY && dbId) {
      let dataSourceId = dbId;
      try {
        const dbResponse: any = await notion.databases.retrieve({ database_id: dbId });
        if (dbResponse.data_sources && dbResponse.data_sources.length > 0) {
          dataSourceId = dbResponse.data_sources[0].id;
        }
      } catch (e) {
        // Fallback
      }

      await notion.pages.create({
        parent: { data_source_id: dataSourceId },
        properties: {
          "Title": { title: [{ text: { content: `${serviceType} - ${date}` } }] },
          "LineUserID": { rich_text: [{ text: { content: lineUserId || "" } }] },
          "Date": { date: { start: date } },
          "Time": { rich_text: [{ text: { content: time || "" } }] },
          "ServiceType": { select: { name: serviceType } },
          "Notes": { rich_text: [{ text: { content: notes || "" } }] }
        }
      });
    }
    res.json({ status: "ok" });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/unlink/:lineUserId", async (req, res) => {
  try {
    const { lineUserId } = req.params;
    await lineClient.unlinkRichMenuIdFromUser(lineUserId);
    res.send(`<h1>✅ 成功解除綁定！</h1><p>User ID: ${lineUserId} 已恢復為預設訪客選單。</p><p>請關閉此視窗。</p>`);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(`<h1>❌ 解除綁定失敗</h1><p>${err.message}</p>`);
  }
});

app.get("/api/insurance/:lineUserId", async (req, res) => {
  try {
    const { lineUserId } = req.params;
    const dbId = process.env.NOTION_DATABASE_ID_INSURANCE || "9cefb2321c8e47989a00b85a4a3b53b6";

    if (process.env.NOTION_API_KEY && dbId) {
      // Note: Notion query uses data_source_id in the newer API, so we resolve it dynamically.
      let dataSourceId = dbId;
      try {
        const dbResponse: any = await notion.databases.retrieve({ database_id: dbId });
        if (dbResponse.data_sources && dbResponse.data_sources.length > 0) {
          dataSourceId = dbResponse.data_sources[0].id;
        }
      } catch (e: any) {
        console.warn("Could not retrieve database to find its data_source, using raw ID for query fallback.", e.message);
      }

      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: "LineUserID", rich_text: { equals: lineUserId } }
      });

      const insuranceData = response.results.map((page: any) => ({
        id: page.id,
        policyName: page.properties["PolicyName"]?.title[0]?.text?.content || "",
        coverage: page.properties["Coverage"]?.rich_text[0]?.text?.content || "",
        status: page.properties["Status"]?.select?.name || "",
      }));

      return res.json({ status: "ok", data: insuranceData });
    }

    res.json({ status: "ok", data: [{ id: '1', policyName: 'Mock 醫療險', coverage: '住院日額 2000', status: '有效' }] });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
