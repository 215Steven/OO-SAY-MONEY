const { Client } = require("@notionhq/client");
require("dotenv").config();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function run() {
  try {
    const response = await notion.pages.create({
      parent: { database_id: "94c20fa3caf142e9a3882f5ec54c8c6c" },
      properties: {
        "名字": { title: [{ text: { content: "Test User" } }] },
        "LINE User ID": { rich_text: [{ text: { content: "U123456789" } }] },
        "手機號碼": { rich_text: [{ text: { content: "0912345678" } }] },
        "生日": { rich_text: [{ text: { content: "1990-01-01" } }] },
        "email": { email: "test@example.com" },
        "客戶來源": { select: { name: "其他" } },
        "訂閱電子報": { checkbox: true }
      }
    });
    console.log("Success:", response.id);
  } catch (err) {
    console.error("Notion API Error:", err.body || err);
  }
}
run();
