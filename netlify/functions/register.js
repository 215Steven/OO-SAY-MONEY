const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dbId = process.env.NOTION_DATABASE_ID; // 94c20fa3caf142e9a3882f5ec54c8c6c

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { name, phone, lineUserId } = body;

  if (!lineUserId) {
    return { statusCode: 400, body: JSON.stringify({ error: "lineUserId is required" }) };
  }

  try {
    // Check if user already exists
    const existing = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "LINE UserID",
        rich_text: { equals: lineUserId },
      },
    });

    if (existing.results.length > 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, alreadyExists: true }),
      };
    }

    // Create new member record
    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        "LINE 名稱": {
          title: [{ text: { content: name || "" } }],
        },
        "LINE UserID": {
          rich_text: [{ text: { content: lineUserId } }],
        },
        "手機號碼": {
          phone_number: phone || null,
        },
        "加入日期": {
          date: { start: new Date().toISOString().split("T")[0] },
        },
        "客戶狀態": {
          select: { name: "現有客戶" },
        },
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Notion error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
