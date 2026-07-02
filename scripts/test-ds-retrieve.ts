import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function test() {
  const dsId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
  try {
    const res = await notion.dataSources.retrieve({ 
      data_source_id: dsId
    });
    console.log(Object.keys(res.properties));
  } catch (e) {
    console.error("error:", e.message);
  }
}
test();
