import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";
import { messagingApi, middleware as lineMiddleware } from "@line/bot-sdk";
const { MessagingApiClient } = messagingApi;
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use CORS if needed for external calls
  app.use(cors());

  // LINE Webhook needs raw body, but for simplicity we rely on body-parser from express middleware setup if used properly, 
  // or we can just use express.json() for everything EXCEPT the line webhook.
  const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "mock_token",
    channelSecret: process.env.LINE_CHANNEL_SECRET || "mock_secret"
  };

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const lineClient = new MessagingApiClient(lineConfig);

  // 1. LINE Webhook Endpoint (For auto-reply and triggers)
  app.post("/api/webhook", lineMiddleware(lineConfig), async (req, res) => {
    try {
      const events = req.body.events;
      for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
           // Provide basic echo or keyword trigger
           const text = event.message.text;
           if (text === '查詢我的保險') {
             // Query notion for this user's insurance
             const userId = event.source.userId;
             if (userId) {
                // Here you'd fetch from Notion based on line userId
                await lineClient.replyMessage({
                  replyToken: event.replyToken,
                  messages: [{
                    type: 'text',
                    text: '您的專屬保險資料正在準備中，請稍候。'
                  }]
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

  // 2. 會員資料自動存取 & 圖文選單自動變換
  app.post("/api/register", async (req, res) => {
    try {
      const { identity, name, phone, birthday, email, newsletter, lineUserId } = req.body;
      const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "db3a7c51-5cf3-4244-adde-8d8ba3b453ae"; // Changed to specific DB
      const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

      // 1. Submit to Notion
      if (process.env.NOTION_API_KEY && dbId) {
        await notion.pages.create({
          parent: { database_id: dbId },
          properties: {
            "Name": { title: [{ text: { content: name || "" } }] },
            "LineUserID": { rich_text: [{ text: { content: lineUserId || "" } }] },
            "Phone": { rich_text: [{ text: { content: phone || "" } }] },
            "Birthday": { rich_text: [{ text: { content: birthday || "" } }] },
            "Email": { email: email || null },
            "Identity": { select: { name: identity || "其他" } },
            "Newsletter": { checkbox: !!newsletter }
          }
        });
      } else {
        console.log("Mocking Notion submission (missing API key/DB ID):", req.body);
      }

      // 2. Link Custom LINE Rich Menu
      if (lineUserId && process.env.LINE_CHANNEL_ACCESS_TOKEN && lineRichMenuId6) {
        await lineClient.linkRichMenuIdToUser(lineUserId, lineRichMenuId6);
        console.log(`Successfully switched Rich Menu for LINE UID: ${lineUserId}`);
      }

      res.json({ status: "ok" });
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 3. 預約系統回報 (Save reservation to Notion)
  app.post("/api/reservations", async (req, res) => {
    try {
      const { lineUserId, date, time, serviceType, notes } = req.body;
      const dbId = process.env.NOTION_DATABASE_ID_RESERVATIONS || "8f368206-726b-4090-8798-2f19f977eb07";

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

  // 4. 保險資料對接並顯示給特定userid (Fetch Insurance from Notion)
  app.get("/api/insurance/:lineUserId", async (req, res) => {
    try {
      const { lineUserId } = req.params;
      const dbId = process.env.NOTION_DATABASE_ID_INSURANCE || "9cefb2321c8e47989a00b85a4a3b53b6";

      if (process.env.NOTION_API_KEY && dbId) {
        const response = await notion.databases.query({
          database_id: dbId,
          filter: {
            property: "LineUserID",
            rich_text: {
              equals: lineUserId
            }
          }
        });

        // format data based on your Notion columns
        const insuranceData = response.results.map((page: any) => ({
          id: page.id,
          policyName: page.properties["PolicyName"]?.title[0]?.text?.content || "",
          coverage: page.properties["Coverage"]?.rich_text[0]?.text?.content || "",
          status: page.properties["Status"]?.select?.name || "",
        }));

        return res.json({ status: "ok", data: insuranceData });
      }

      // Mock response if not configured
      res.json({ 
        status: "ok", 
        data: [
          { id: '1', policyName: 'Mock 醫療險', coverage: '住院日額 2000', status: '有效' }
        ] 
      });
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
