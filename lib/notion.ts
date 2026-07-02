import { Client } from "@notionhq/client";
import { CONFIG } from "./config.js";

export const notion = new Client({ auth: CONFIG.notionApiKey });

// database_id → data_source_id 的解析結果快取（serverless 實例存活期間有效），
// 避免每個 request 都多打一次 Notion API。
const dataSourceCache = new Map<string, string>();

export async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceCache.get(databaseId);
  if (cached) return cached;
  try {
    const db = (await notion.databases.retrieve({
      database_id: databaseId,
    })) as any;
    if (db?.data_sources?.length > 0) {
      const id: string = db.data_sources[0].id;
      dataSourceCache.set(databaseId, id);
      return id;
    }
  } catch {
    // 可能本身已是 data_source_id 或舊版資料庫，直接沿用
  }
  dataSourceCache.set(databaseId, databaseId);
  return databaseId;
}

/** 查詢會員資料庫中符合 LINE User ID 的有效（未封存）資料 */
export async function findMembersByLineUserId(lineUserId: string) {
  const dataSourceId = await resolveDataSourceId(CONFIG.dbMembers);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "LINE User ID",
      rich_text: { equals: lineUserId },
    },
  });
  return response.results.filter(
    (r: any) => !r.archived && !r.in_trash
  ) as any[];
}
