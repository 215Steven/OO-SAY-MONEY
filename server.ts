import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Handle Notion Registration and LINE Rich Menu Switch
  app.post("/api/register", async (req, res) => {
    try {
      const { identity, name, phone, birthday, email, newsletter, lineUserId } = req.body;
      const key = process.env.NOTION_API_KEY;
      const dbId = process.env.NOTION_DATABASE_ID || "94c20fa3caf142e9a3882f5ec54c8c6c";
      const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
      const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

      // 1. Submit to Notion
      if (!key || !dbId) {
        console.log("Mocking Notion submission (missing API key/DB ID):", req.body);
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        const notion = new Client({ auth: key });
        await notion.pages.create({
          parent: { database_id: dbId },
          properties: {
            "Name": { title: [{ text: { content: name || "" } }] },
            "Phone": { rich_text: [{ text: { content: phone || "" } }] },
            "Birthday": { rich_text: [{ text: { content: birthday || "" } }] },
            "Email": { email: email || null },
            "Identity": { select: { name: identity || "其他" } },
            "Newsletter": { checkbox: !!newsletter }
          }
        });
      }

      // 2. Link Custom LINE Rich Menu if lineUserId is present
      if (lineUserId && lineToken && lineRichMenuId6) {
        try {
          const lineRes = await fetch(`https://api.line.me/v2/bot/user/${lineUserId}/richmenu/${lineRichMenuId6}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lineToken}`,
            }
          });
          if (!lineRes.ok) {
            console.error("LINE Messaging API Error:", await lineRes.text());
          } else {
            console.log(`Successfully switched Rich Menu for LINE UID: ${lineUserId}`);
          }
        } catch (e) {
          console.error("Failed to connect to LINE API", e);
        }
      }

      res.json({ status: "ok" });
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
