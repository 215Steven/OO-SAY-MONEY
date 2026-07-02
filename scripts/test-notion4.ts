import { Client } from "@notionhq/client";
const notion = new Client({ auth: "test" });
console.log('view:', Object.keys(notion.views || {}));
console.log('dataSources:', Object.keys(notion.dataSources || {}));
