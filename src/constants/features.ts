// 功能開關：還沒規劃好的功能先關閉，程式碼與路由都保留。
// 之後要重新開放時，只要把對應的值改成 true 並重新部署即可。
//
// membership：會員註冊與登入入口（首頁、故事起點、測驗結果、財管家介紹、解鎖更多）。
//   關閉時，原本「加入會員」的按鈕改成「在 LINE 聊聊」「訂閱電子報」或直接開工具。
// protection：「我的保障」保單查詢頁。
//   前端關閉入口；後端 /api/insurance* 另外受 Vercel 環境變數 PROTECTION_ENABLED 控制，
//   兩邊都要打開才會真的能查詢。
export const FEATURES = {
  membership: false,
  protection: false,
} as const;
