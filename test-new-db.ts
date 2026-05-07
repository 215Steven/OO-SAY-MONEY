import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function run() {
  try {
    const res = await notion.dataSources.retrieve({ data_source_id: "b0b467b3-324b-4df3-93c3-aa7a638aa069" });
    console.log(JSON.stringify(res.properties, null, 2));
  } catch(e) {
    console.error(e.message);
  }
}
run();
