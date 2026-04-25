import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dbId = process.env.NOTION_COVERAGE_DB_ID; // 9cefb2321c8e47989a00b85a4a3b53b6

function mapRowToCoverage(props) {
  const categories = [
    {
      label: "壽險 & 意外",
      statusField: "壽險意外_狀態",
      noteField: "壽險意外_說明",
    },
    {
      label: "醫療 & 重疾",
      statusField: "醫療重疾_狀態",
      noteField: "醫療重疾_說明",
    },
    {
      label: "投資 & 教育",
      statusField: "投資教育_狀態",
      noteField: "投資教育_說明",
    },
    {
      label: "產險",
      statusField: "產險_狀態",
      noteField: "產險_說明",
    },
  ];

  return categories.map(({ label, statusField, noteField }) => {
    const statusProp = props[statusField];
    const noteProp = props[noteField];
    const status =
      statusProp?.select?.name ||
      statusProp?.rich_text?.[0]?.plain_text ||
      "未填寫";
    const note =
      noteProp?.rich_text?.[0]?.plain_text ||
      noteProp?.select?.name ||
      "";
    return { category: label, status, note };
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const lineUserId = event.queryStringParameters?.lineUserId;
  if (!lineUserId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "lineUserId is required" }),
    };
  }

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "LINE UserID",
        rich_text: { equals: lineUserId },
      },
    });

    if (response.results.length === 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: [] }),
      };
    }

    const members = response.results.map((page) => {
      const props = page.properties;
      const memberName =
        props["成員姓名"]?.rich_text?.[0]?.plain_text ||
        props["記錄名稱"]?.title?.[0]?.plain_text ||
        "未知";
      const identity = props["成員身分"]?.select?.name || "本人";
      const age = props["年齡"]?.number ?? null;
      const coverage = mapRowToCoverage(props);
      return { name: memberName, identity, age, coverage };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members }),
    };
  } catch (err) {
    console.error("Notion error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
