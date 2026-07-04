import { CONFIG } from "./config.js";
import { notion, resolveDataSourceId } from "./notion.js";
import { lineClient } from "./line.js";

const LINE_API = "https://api.line.me";
const LINE_API_DATA = "https://api-data.line.me";

function authHeader() {
  return { Authorization: `Bearer ${CONFIG.lineChannelAccessToken}` };
}

async function lineApiGet(path: string): Promise<any> {
  const res = await fetch(`${LINE_API}${path}`, { headers: authHeader() });
  if (!res.ok) {
    throw new Error(`LINE API GET ${path} 失敗：${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

async function lineApiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${LINE_API}${path}`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`LINE API POST ${path} 失敗：${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

async function lineApiDelete(path: string): Promise<void> {
  const res = await fetch(`${LINE_API}${path}`, { method: "DELETE", headers: authHeader() });
  if (!res.ok) {
    throw new Error(`LINE API DELETE ${path} 失敗：${res.status} ${await res.text().catch(() => "")}`);
  }
}

// ---------------------------------------------------------------------------
// Notion 設定儲存：把「目前使用中的會員選單 ID」存進 Notion，
// 讓後台改選單後立即生效，不需要改 Vercel 環境變數、不需要重新部署。
// 找不到 / 尚未設定 Notion 時，一律 fallback 回 env（LINE_RICH_MENU_ID_6）。
// ---------------------------------------------------------------------------
const SETTINGS_DB_TITLE = "OOSAYMONEY_AppSettings";
let settingsDatabaseIdCache: string | null = null;

async function findOrCreateSettingsDatabaseId(): Promise<string> {
  if (settingsDatabaseIdCache) return settingsDatabaseIdCache;

  const search: any = await notion.search({
    query: SETTINGS_DB_TITLE,
    filter: { property: "object", value: "database" } as any,
  });
  const found = (search?.results || []).find((r: any) => r.object === "database");
  if (found) {
    settingsDatabaseIdCache = found.id;
    return found.id;
  }

  // 沒有就用「會員資料庫」的上層位置建立一個新的設定用資料庫
  const membersDb: any = await notion.databases.retrieve({ database_id: CONFIG.dbMembers });
  const created: any = await notion.databases.create({
    parent: membersDb.parent,
    title: [{ type: "text", text: { content: SETTINGS_DB_TITLE } }],
    initial_data_source: {
      properties: {
        Key: { title: {} },
        Value: { rich_text: {} },
      },
    },
  } as any);
  settingsDatabaseIdCache = created.id;
  return created.id;
}

async function getSetting(key: string): Promise<string | null> {
  if (!CONFIG.notionApiKey) return null;
  try {
    const dbId = await findOrCreateSettingsDatabaseId();
    const dsId = await resolveDataSourceId(dbId);
    const resp: any = await notion.dataSources.query({
      data_source_id: dsId,
      filter: { property: "Key", title: { equals: key } } as any,
    });
    const page = resp.results?.[0] as any;
    if (!page) return null;
    const rt = page.properties?.Value?.rich_text;
    return rt?.[0]?.plain_text || null;
  } catch (e: any) {
    console.warn(`讀取設定 ${key} 失敗，改用環境變數預設值：`, e?.message || e);
    return null;
  }
}

async function setSetting(key: string, value: string): Promise<void> {
  const dbId = await findOrCreateSettingsDatabaseId();
  const dsId = await resolveDataSourceId(dbId);
  const resp: any = await notion.dataSources.query({
    data_source_id: dsId,
    filter: { property: "Key", title: { equals: key } } as any,
  });
  const page = resp.results?.[0] as any;
  const properties: any = {
    Key: { title: [{ text: { content: key } }] },
    Value: { rich_text: [{ text: { content: value } }] },
  };
  if (page) {
    await notion.pages.update({ page_id: page.id, properties });
  } else {
    await notion.pages.create({ parent: { data_source_id: dsId } as any, properties });
  }
}

/** 目前實際使用中的會員選單 richMenuId：優先讀 Notion 設定，沒有才退回環境變數 */
export async function getMemberRichMenuId(): Promise<string> {
  const stored = await getSetting("richMenuMemberId");
  return stored || CONFIG.lineRichMenuMemberId;
}

async function setMemberRichMenuId(id: string): Promise<{ persisted: boolean }> {
  if (!CONFIG.notionApiKey) {
    console.warn(
      `未設定 NOTION_API_KEY，無法將新選單 ID 寫入 Notion，請手動更新 Vercel 環境變數 LINE_RICH_MENU_ID_6 = ${id}`
    );
    return { persisted: false };
  }
  try {
    await setSetting("richMenuMemberId", id);
    return { persisted: true };
  } catch (e: any) {
    console.warn(
      `寫入 Notion 設定失敗，請手動更新 Vercel 環境變數 LINE_RICH_MENU_ID_6 = ${id}：`,
      e?.message || e
    );
    return { persisted: false };
  }
}

// ---------------------------------------------------------------------------
// Notion 內容編輯：六格選單「各格要連去哪裡」直接在 Notion 資料庫編輯，
// 不用打開後台網頁一格一格輸入。網頁只保留兩個按鈕：
//   1) 把目前選單同步到 Notion（第一次使用 / 想重新對齊時按）
//   2) 套用 Notion 目前內容到 LINE 選單（改完 Notion 後按這個才會真的生效）
// ---------------------------------------------------------------------------
const AREA_DB_TITLE = "OOSAYMONEY_RichMenuAreas";
const LETTERS = ["A", "B", "C", "D", "E", "F"];
let areaDatabaseIdCache: string | null = null;

async function findOrCreateAreaDatabaseId(): Promise<string> {
  if (areaDatabaseIdCache) return areaDatabaseIdCache;

  const search: any = await notion.search({
    query: AREA_DB_TITLE,
    filter: { property: "object", value: "database" } as any,
  });
  const found = (search?.results || []).find((r: any) => r.object === "database");
  if (found) {
    areaDatabaseIdCache = found.id;
    return found.id;
  }

  const membersDb: any = await notion.databases.retrieve({ database_id: CONFIG.dbMembers });
  const created: any = await notion.databases.create({
    parent: membersDb.parent,
    title: [{ type: "text", text: { content: AREA_DB_TITLE } }],
    initial_data_source: {
      properties: {
        格子: { title: {} },
        類型: { select: { options: [{ name: "連結" }, { name: "文字" }] } },
        內容: { rich_text: {} },
      },
    },
  } as any);
  areaDatabaseIdCache = created.id;
  return created.id;
}

/** 把 LINE 目前選單的 6 格動作，寫進 Notion 資料庫（找不到就自動建立），回傳可打開的 Notion 網址 */
export async function syncCurrentRichMenuToNotion(): Promise<{ databaseId: string; notionUrl: string }> {
  const def = await getCurrentRichMenuDefinition();
  const dbId = await findOrCreateAreaDatabaseId();
  const dsId = await resolveDataSourceId(dbId);

  for (let i = 0; i < def.areas.length && i < LETTERS.length; i++) {
    const action: any = def.areas[i].action || {};
    const letter = LETTERS[i];
    const type = action.type === "uri" ? "連結" : "文字";
    const content = action.type === "uri" ? action.uri || "" : action.text || "";

    const existing: any = await notion.dataSources.query({
      data_source_id: dsId,
      filter: { property: "格子", title: { equals: letter } } as any,
    });
    const properties: any = {
      格子: { title: [{ text: { content: letter } }] },
      類型: { select: { name: type } },
      內容: { rich_text: [{ text: { content } }] },
    };
    const page = existing.results?.[0] as any;
    if (page) {
      await notion.pages.update({ page_id: page.id, properties });
    } else {
      await notion.pages.create({ parent: { data_source_id: dsId } as any, properties });
    }
  }

  return { databaseId: dbId, notionUrl: `https://www.notion.so/${dbId.replace(/-/g, "")}` };
}

/** 從 Notion 資料庫讀出目前 6 格的內容，轉成 LINE rich menu 的 action 格式 */
async function buildAreaUpdatesFromNotion(): Promise<Array<{ index: number; action: any }>> {
  const dbId = await findOrCreateAreaDatabaseId();
  const dsId = await resolveDataSourceId(dbId);
  const resp: any = await notion.dataSources.query({ data_source_id: dsId, page_size: 100 });

  const updates: Array<{ index: number; action: any }> = [];
  for (const page of resp.results as any[]) {
    if (page.archived || page.in_trash) continue;
    const letter = page.properties?.["格子"]?.title?.[0]?.plain_text;
    const index = LETTERS.indexOf(letter);
    if (index === -1) continue;
    const type = page.properties?.["類型"]?.select?.name;
    const content = page.properties?.["內容"]?.rich_text?.[0]?.plain_text || "";
    const action = type === "連結" ? { type: "uri", uri: content } : { type: "message", text: content };
    updates.push({ index, action });
  }

  if (updates.length === 0) {
    throw new Error("Notion 設定資料庫是空的，請先按「同步目前選單到 Notion」");
  }
  return updates;
}

// ---------------------------------------------------------------------------
// 查詢所有已註冊、有 LINE User ID 的會員（用來重新連結選單）
// ---------------------------------------------------------------------------
async function findAllMembersWithLineUserId(): Promise<string[]> {
  const dataSourceId = await resolveDataSourceId(CONFIG.dbMembers);
  const userIds: string[] = [];
  let cursor: string | undefined = undefined;
  do {
    const response: any = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "LINE User ID", rich_text: { is_not_empty: true } } as any,
      start_cursor: cursor,
      page_size: 100,
    } as any);
    for (const page of response.results as any[]) {
      if (page.archived || page.in_trash) continue;
      const rt = page.properties?.["LINE User ID"]?.rich_text;
      const id = rt?.[0]?.plain_text;
      if (id) userIds.push(id);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return userIds;
}

// ---------------------------------------------------------------------------
// 讀取目前選單的完整內容（給後台頁面顯示用）
// ---------------------------------------------------------------------------
export async function getCurrentRichMenuDefinition() {
  const richMenuId = await getMemberRichMenuId();
  if (!richMenuId) {
    throw new Error("尚未設定會員選單（環境變數 LINE_RICH_MENU_ID_6 為空）");
  }
  const def = await lineApiGet(`/v2/bot/richmenu/${richMenuId}`);
  return {
    richMenuId,
    size: def.size,
    chatBarText: def.chatBarText,
    name: def.name,
    areas: def.areas as Array<{ bounds: any; action: any }>,
  };
}

// ---------------------------------------------------------------------------
// 套用「其中幾格動作」的變更：
// LINE 圖文選單建立後無法原地編輯，只能整個重建，流程如下：
// 1. 讀取舊選單設定 + 圖片
// 2. 複製一份，只覆蓋指定 index 的 action
// 3. 建立新選單、上傳同一張圖片
// 4. 把所有已註冊會員重新連結到新選單
// 5. 把「目前使用中的選單 ID」寫回 Notion（讓下次註冊也用新的）
// 6. 刪除舊選單
// ---------------------------------------------------------------------------
export async function applyRichMenuAreaUpdates(
  areaUpdates?: Array<{ index: number; action: any }>
) {
  const updates =
    areaUpdates && areaUpdates.length > 0 ? areaUpdates : await buildAreaUpdatesFromNotion();

  const oldRichMenuId = await getMemberRichMenuId();
  if (!oldRichMenuId) {
    throw new Error("尚未設定會員選單（環境變數 LINE_RICH_MENU_ID_6 為空）");
  }

  const oldDef = await lineApiGet(`/v2/bot/richmenu/${oldRichMenuId}`);

  const newAreas = (oldDef.areas as any[]).map((area, i) => {
    const override = updates.find((u) => u.index === i);
    return override ? { bounds: area.bounds, action: override.action } : area;
  });

  const newDefBody = {
    size: oldDef.size,
    selected: oldDef.selected ?? true,
    name: String(oldDef.name || "member").slice(0, 300),
    chatBarText: String(oldDef.chatBarText || "選單").slice(0, 14),
    areas: newAreas,
  };

  const created = await lineApiPost("/v2/bot/richmenu", newDefBody);
  const newRichMenuId: string = created.richMenuId;

  // 複製圖片（讀舊圖、傳給新選單）
  const imageRes = await fetch(`${LINE_API_DATA}/v2/bot/richmenu/${oldRichMenuId}/content`, {
    headers: authHeader(),
  });
  if (!imageRes.ok) {
    throw new Error(`讀取舊選單圖片失敗：${imageRes.status}`);
  }
  const contentType = imageRes.headers.get("content-type") || "image/png";
  const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

  const uploadRes = await fetch(`${LINE_API_DATA}/v2/bot/richmenu/${newRichMenuId}/content`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": contentType },
    body: imageBuffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`上傳新選單圖片失敗：${uploadRes.status}`);
  }

  // 重新連結所有現有會員到新選單
  const memberIds = await findAllMembersWithLineUserId();
  let relinked = 0;
  const failed: string[] = [];
  for (const userId of memberIds) {
    try {
      await lineClient.linkRichMenuIdToUser(userId, newRichMenuId);
      relinked++;
    } catch {
      failed.push(userId);
    }
  }

  const { persisted } = await setMemberRichMenuId(newRichMenuId);

  let oldDeleted = true;
  try {
    await lineApiDelete(`/v2/bot/richmenu/${oldRichMenuId}`);
  } catch (e: any) {
    oldDeleted = false;
    console.warn("刪除舊選單失敗（可忽略，不影響新選單運作）：", e?.message || e);
  }

  return {
    oldRichMenuId,
    newRichMenuId,
    totalMembers: memberIds.length,
    relinked,
    failedUserIds: failed,
    settingPersistedToNotion: persisted,
    oldRichMenuDeleted: oldDeleted,
  };
}
