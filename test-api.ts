import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function test() {
  try {
    const res = await notion.databases.query({ database_id: "test" });
  } catch (e) {
    console.error("notion.databases.query:", e.message);
  }
}
test();
