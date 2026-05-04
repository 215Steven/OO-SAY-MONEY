import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function test() {
  try {
    const dsRs = await notion.dataSources.query({
      data_source_id: "a0d94cef-946e-4693-9435-d05cef9f2787"
    });
    console.log("Query length via DS:", dsRs.results.length);

    try {
      await notion.dataSources.query({
        data_source_id: "b0b467b3-324b-4df3-93c3-aa7a638aa069"
      });
      console.log("Query via DB ID worked too!");
    } catch(e:any) {
      console.log("Query via DB ID failed:", e.message);
    }
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}
test();
