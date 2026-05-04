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
         if (text === '查詢我的保險') {
           const userId = event.source.userId;
           if (userId) {
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

app.get("/api/insurance/:lineUserId", async (req, res) => {
  try {
    const { lineUserId } = req.params;
    const dbId = process.env.NOTION_DATABASE_ID_INSURANCE || "9cefb2321c8e47989a00b85a4a3b53b6";

    if (process.env.NOTION_API_KEY && dbId) {
      // Note: Notion query uses data_source_id in the newer API, so we resolve it dynamically.
      let dataSourceId = dbId;
      try {
        const dbResponse = await notion.databases.retrieve({ database_id: dbId });
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
