import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function run() {
  try {
    const res = await notion.pages.create({
      parent: { data_source_id: "a0d94cef-946e-4693-9435-d05cef9f2787" },
      properties: {
        "名字": { title: [{ text: { content: "Test Auto" } }] },
        "LINE User ID": { rich_text: [{ text: { content: "test1234" } }] }
      }
    });
    console.log("Success", res.id);
  } catch(e) {
    console.error(e.message);
  }
}
run();
