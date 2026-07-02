import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function run() {
  try {
    const res = await notion.dataSources.retrieve({ data_source_id: "a0d94cef-946e-4693-9435-d05cef9f2787" });
    console.log(JSON.stringify(Object.keys(res.properties), null, 2));
  } catch(e) {
    console.error(e.message);
  }
}
run();
