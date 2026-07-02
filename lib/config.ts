// 集中管理所有環境設定。
// 注意：Notion database ID 屬於識別碼而非機密，但仍建議全數改由
// Vercel 環境變數提供，設定完成後可移除這裡的 fallback 值。
export const CONFIG = {
  lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET || "",
  // LINE Login channel ID，用來確認 LIFF access token 是簽發給本服務的
  lineChannelId: process.env.LINE_CHANNEL_ID || "",
  lineRichMenuMemberId: process.env.LINE_RICH_MENU_ID_6 || "",
  // 管理端點（/api/admin/*）的存取密鑰；未設定時管理端點一律拒絕
  adminToken: process.env.ADMIN_TOKEN || "",
  notionApiKey: process.env.NOTION_API_KEY || "",
  dbMembers:
    process.env.NOTION_DATABASE_ID_MEMBERS ||
    "b0b467b3-324b-4df3-93c3-aa7a638aa069",
  dbReservations:
    process.env.NOTION_DATABASE_ID_RESERVATIONS ||
    "443b7fca-94e0-4fce-b685-7cde16cc8ddf",
  dbInsurance:
    process.env.NOTION_DATABASE_ID_INSURANCE ||
    "9cefb2321c8e47989a00b85a4a3b53b6",
};
