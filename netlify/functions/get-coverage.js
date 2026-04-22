/**
 * GET /.netlify/functions/get-coverage?userId=Uxxxxxx
 * 查詢 Notion 🛡️ 家庭保障記錄，回傳該用戶的家庭保障資料
 *
 * Netlify 環境變數：
 *   NOTION_TOKEN      ´ Notion Integration Token
 *   COVERAGE_DB_ID   ´ 🛡️ 家庭保障記錄 database ID
 */

const NOTION_VERSION = "2022-06-28";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300",   // CDN 快取 5 分鐘
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "userId required" }) };
  }

  const { NOTION_TOKEN, COVERAGE_DB_ID } = process.env;
  if (!NOTION_TOKEN || !COVERAGE_DB_ID) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing env vars" }) };
  }

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${COVERAGE_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { property: "LINE UserID", rich_text: { equals: userId } },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, headers, body: JSON.stringify({ error: text }) };
    }

    const data = await res.json();

    if (!data.results?.length) {
      return { statusCode: 200, headers, body: JSON.stringify({ found: false }) };
    }

    const getProp = (p, type) => {
      if (!p) return null;
      if (type === "title")     return p.title?.[0]?.plain_text ?? null;
      if (type === "rich_text") return p.rich_text?.[0]?.plain_text ?? null;
      if (type === "select")    return p.select?.name ?? null;
      if (type === "number")    return p.number ?? null;
      return null;
    };

    const members = data.results.map((page) => {
      const pr = page.properties;
      return {
        name:    getProp(pr["姓名"], "title")       ?? "—",
        label:   getProp(pr["穱謂"], "select")      ?? "本亲",
        type:    getProp(pr["類型"], "select")      ?? "adult",
        age:     getProp(pr["年齡"], "number")      ?? null,
        coverage: [
          {
            label:   "壽險・意外",
            status: getProp(pr["壽險狀態"], "select")  ?? "unknown",
            detail: getProp(pr["壽險說明"], "rich_text") ?? "—",
            note:   getProp(pr["壽險備註"], "rich_text") ?? "",
          },
          {
            label:  "醫療・重疾",
            status: getProp(pr["醫療狀態"], "select")  ?? "unknown",
            detail: getProp(pr["醫療說明"], "rich_text") ?? "—",
            note:   getProp(pr["醫療備註"], "rich_text") ?? "",
          },
          {
            label:  getProp(pr["類型"], "select") === "child" ? "教育基金" : "投資型保單",
            status: getProp(pr["投資狀態"], "select")  ?? "unknown",
            detail: getProp(pr["投資說明"], "rich_text") ?? "—",
            note:   getProp(pr["投資備註"], "rich_text") ?? "",
          },
          {
            label:  getProp(pr["類型"], "select") === "child" ? "產險" : "產險・車旅",
            status: getProp(pr["類型"], "select") === "child"
              ? "na"
              : (getProp(pr["產險狀態"], "select") ?? "unknown"),
            detail: getProp(pr["類型"], "select") === "child"
              ? "不適用"
              : (getProp(pr["產險說明"], "rich_text") ?? "—"),
            note:   "",
          },
        ],
      };
    });

    const ORDER = { 本亲: 0, 配偶: 1 };
    members.sort((a, b) => {
      const oa = ORDER[a.label] ?? 2;
      const ob = ORDER[b.label] ?? 2;
      return oa !== ob ? oa - ob : (a.age ?? 99) - (b.age ?? 99);
    });

    const firstProps = data.results[0].properties;
    const advisor = getProp(firstProps["負責顧問"], "rich_text") ?? "Steven & Annie";
    const updated = new Date(data.results[0].last_edited_time)
      .toLocaleDateString("zh-TW") + " 更新";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ found: true, advisor, updated, members }),
    };
  } catch (err) {
    console.error("get-coverage error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};