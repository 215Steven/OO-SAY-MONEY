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
      if (event.type === 'message' && event.message.type === 'text') {
         const text = event.message.text;
         const userId = event.source.userId;
         
         if (userId) {
           // [自動化機制] 檢查使用者是否還在 Notion 會員資料庫中
           const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
           let isMember = true;
           
           if (process.env.NOTION_API_KEY && dbId) {
             try {
               // @ts-ignore
               const response = await notion.databases.query({
                 database_id: dbId,
                 filter: { property: "LINE User ID", rich_text: { equals: userId } }
               });
               isMember = response.results.length > 0;
             } catch (e) {
               console.error("Notion check failed:", e);
             }
           }

           // 如果發現已經不在資料庫，自動解除綁定並通知
           if (!isMember) {
             try {
               await lineClient.unlinkRichMenuIdFromUser(userId);
               await lineClient.replyMessage({
                 replyToken: event.replyToken,
                 messages: [{ type: 'text', text: '系統通知：您的會員身分已更新，已為您切換回訪客選單。如需重新開通請再次註冊。' }]
               });
               continue; // 結束這個事件的處理
             } catch (unlinkErr) {
               console.error("Unlink failed:", unlinkErr);
             }
           }

           // 原本的關鍵字回應邏輯
           if (text === '查詢我的保險') {
              await lineClient.replyMessage({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: '您的專屬保險資料正在準備中，請稍候。' }]
              });
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

app.post("/api/register", async (req, res) => {
  try {
    const { identity, name, phone, birthday, email, newsletter, lineUserId } = req.body;
    const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
    const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

    if (process.env.NOTION_API_KEY && dbId) {
      await notion.pages.create({
        parent: { database_id: dbId },
        properties: {
          "名字": { title: [{ text: { content: name || "" } }] },
          "LINE User ID": { rich_text: [{ text: { content: lineUserId || "" } }] },
          "手機號碼": { rich_text: [{ text: { content: phone || "" } }] },
          "生日": { rich_text: [{ text: { content: birthday || "" } }] },
          "email": { email: email || null },
          "客戶來源": { select: { name: identity || "其他" } },
          "訂閱電子報": { checkbox: !!newsletter }
        }
      });
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
      await notion.pages.create({
        parent: { database_id: dbId },
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
