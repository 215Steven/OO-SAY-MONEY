import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function test() {
  const dbId = process.env.NOTION_DATABASE_ID_MEMBERS || "b0b467b3-324b-4df3-93c3-aa7a638aa069";
  console.log("Using dsId:", dbId);
  try {
    const res = await notion.dataSources.retrieve({ 
      data_source_id: dbId
    });
    console.log(Object.keys(res.properties));
    
    console.log("Now testing create with parent: { data_source_id: dbId }...");
    await notion.pages.create({
      parent: { data_source_id: dbId },
      properties: {
        "LINE 名稱": { title: [{ text: { content: "Test User" } }] }
      }
    });
    console.log("Create success!");
  } catch (e) {
    console.error("error:", e.message);
  }
}
test();
