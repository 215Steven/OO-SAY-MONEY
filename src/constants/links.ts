// 對外連結集中管理。預約改為直接在 LINE 官方帳號對話，不再有獨立預約頁。
export const LINE_OA_ID = "@oosaymoney";
/** 開啟與官方帳號的聊天室 */
export const LINE_CHAT_URL = `https://line.me/R/ti/p/${LINE_OA_ID}`;
/** 開啟聊天室並預填一句話，使用者只要按送出 */
export const lineMessageUrl = (text: string) =>
  `https://line.me/R/oaMessage/${LINE_OA_ID}/?${encodeURIComponent(text)}`;
export const LINE_BOOK_URL = lineMessageUrl("我想預約聊聊");
export const openLine = (url: string = LINE_CHAT_URL) => window.open(url, "_blank");
