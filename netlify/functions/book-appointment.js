import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dbId = process.env.NOTION_APPOINTMENTS_DB_ID; // bce5fceaf85f4152867606e73919dfda

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { lineUserId, date, timeSlot, topic, contactName, phone, notes } = body;

  if (!lineUserId || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "lineUserId and date are required" }),
    };
  }

  const topicArray = Array.isArray(topic)
    ? topic
    : (topic || "一般諮詢").split(/[,，、]/).map((s) => s.trim()).filter(Boolean);

  try {
    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        "LINE 名稱": {
          title: [{ text: { content: contactName || "" } }],
        },
        "LINE UserID": {
          rich_text: [{ text: { content: lineUserId } }],
        },
        "手機號碼": {
          phone_number: phone || null,
        },
        "預約日期": {
          date: { start: date },
        },
        "預約時段": {
          select: { name: timeSlot || "其他時段" },
        },
        "諮詢主題": {
          multi_select: topicArray.map((t) => ({ name: t })),
        },
        "狀態": {
          select: { name: "待確認" },
        },
        "備註": {
          rich_text: [{ text: { content: notes || "" } }],
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
