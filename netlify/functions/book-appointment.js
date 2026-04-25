const { Client } = require("@notionhq/client");

exports.handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  try {
    const { lineUserId, date, timeSlot, topic, contactName, phone, notes } = JSON.parse(event.body);

    const key = process.env.NOTION_API_KEY;
    const apptDbId = process.env.NOTION_APPOINTMENTS_DB_ID;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!key || !apptDbId) {
      console.log("Mock appointment:", { lineUserId, date, timeSlot, topic, contactName });
      return { statusCode: 200, headers, body: JSON.stringify({ status: "ok", mock: true }) };
    }

    const notion = new Client({ auth: key });

    await notion.pages.create({
      parent: { database_id: apptDbId },
      properties: {
        "Name":         { title: [{ text: { content: contactName || "" } }] },
        "LINE User ID": { rich_text: [{ text: { content: lineUserId || "" } }] },
        "Date":         { date: { start: date || new Date().toISOString().split("T")[0] } },
        "Time Slot":    { rich_text: [{ text: { content: timeSlot || "" } }] },
        "Topic":        { select: { name: topic || "一般諮詢" } },
        "Phone":        { rich_text: [{ text: { content: phone || "" } }] },
        "Notes":        { rich_text: [{ text: { content: notes || "" } }] },
        "Status":       { select: { name: "待確認" } },
        "Created At":   { date: { start: new Date().toISOString().split("T")[0] } }
      }
    });

    // Send LINE confirmation message
    if (lineUserId && lineToken) {
      const msg = "✅ 預約成功！\n\n📅 日期：" + date + "\n⏰ 時間：" + timeSlot + "\n📋 主題：" + topic + "\n\n我們會在 24 小時內確認您的預約。有問題歡迎直接訊息！";
      await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { "Authorization": "Bearer " + lineToken, "Content-Type": "application/json" },
        body: JSON.stringify({ to: lineUserId, messages: [{ type: "text", text: msg }] })
      }).catch(e => console.error("LINE push failed:", e));
    }

    return { statusCode: 200, headers, body: JSON.stringify({ status: "ok" }) };
  } catch (error) {
    console.error("book-appointment error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};