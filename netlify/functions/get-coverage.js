const { Client } = require("@notionhq/client");

exports.handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const lineUserId = event.queryStringParameters && event.queryStringParameters.lineUserId;
  const key = process.env.NOTION_API_KEY;
  const coverageDbId = process.env.NOTION_COVERAGE_DB_ID;

  // Mock fallback (no env vars or no userId)
  if (!key || !coverageDbId || !lineUserId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ _mock: true, name: "示範用戶", advisor: "Steven & Annie", updated: "2026/04/15", members: [] })
    };
  }

  try {
    const notion = new Client({ auth: key });

    // Query coverage DB by LINE User ID
    const res = await notion.databases.query({
      database_id: coverageDbId,
      filter: {
        property: "LINE User ID",
        rich_text: { equals: lineUserId }
      },
      page_size: 1
    });

    if (res.results.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ _notFound: true, name: "", advisor: "Steven & Annie", updated: "", members: [] })
      };
    }

    const page = res.results[0];
    const props = page.properties;

    const getText = (p) => p && p.rich_text && p.rich_text[0] ? p.rich_text[0].plain_text : "";
    const getTitle = (p) => p && p.title && p.title[0] ? p.title[0].plain_text : "";
    const getDate = (p) => p && p.date ? p.date.start : "";

    // Parse coverage JSON stored in Notion
    let members = [];
    const rawJson = getText(props["Coverage JSON"]);
    if (rawJson) {
      try { members = JSON.parse(rawJson); } catch (e) { members = []; }
    }

    const data = {
      name:    getTitle(props["Name"]) || getText(props["Name"]),
      advisor: getText(props["Advisor"]) || "Steven & Annie",
      updated: getDate(props["Updated"]) || getText(props["Updated Text"]),
      members
    };

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    console.error("get-coverage error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};