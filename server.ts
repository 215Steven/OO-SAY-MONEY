import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Handle Notion Registration
  app.post("/api/register", async (req, res) => {
    try {
      const { identity, name, phone, birthday, email, newsletter } = req.body;
      const key = process.env.NOTION_API_KEY;
      const dbId = process.env.NOTION_DATABASE_ID;

      if (!key || !dbId) {
        console.log("Mocking Notion submission (missing API key/DB ID):", req.body);
        // Add fake delay for realistic UX preview
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.json({ status: "ok", simulated: true });
      }

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

      res.json({ status: "ok" });
    } catch (error: any) {
      console.error("Notion API Error:", error);
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
