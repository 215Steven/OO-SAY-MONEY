import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function test() {
  try {
    const res = await notion.dataSources.query({ 
      data_source_id: process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069",
      filter: { property: "LINE User ID", rich_text: { equals: "test" } }
    });
    console.log("Success! count:", res.results.length);
  } catch (e) {
    console.error("error:", e.message);
  }
}
test();
