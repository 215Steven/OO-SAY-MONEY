const { Client } = require("@notionhq/client");

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { identity, name, phone, birthday, email, newsletter, lineUserId } = data;
    
    const key = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_DATABASE_ID;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineRichMenuId6 = process.env.LINE_RICH_MENU_ID_6;

    // 1. Submit to Notion
    if (!key || !dbId) {
      console.log("Mocking Notion submission (missing API key/DB ID):", data);
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
            'Content-Type': 'application/json'
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

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" })
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
