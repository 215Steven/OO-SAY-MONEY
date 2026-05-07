// util
import { Client } from "@notionhq/client";

export async function resolveDataSourceId(notion: Client, providedId: string): Promise<string> {
  try {
    // Check if it's a new "database"/view that has a data_source
    const db = await notion.databases.retrieve({ database_id: providedId }) as any;
    if (db?.data_sources && db.data_sources.length > 0) {
      return db.data_sources[0].id; // Resolve to true data source
    }
  } catch (e) {
    // Ignore as it might be an old school database or direct data source id
  }
  return providedId;
}
