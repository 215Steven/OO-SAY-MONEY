# OO SAY MONEY

LINE LIFF 理財服務前端 + 會員系統後端。

技術架構：React 19 + Vite + Tailwind（前端）、Express on Vercel Serverless（後端 API）、Notion（會員／預約／保單資料庫）、LINE Messaging API + LIFF（登入與選單）。

## 專案結構

```
src/            前端（頁面採 React.lazy 分包載入）
  constants/liff.ts   LIFF ID 對應與 access token helper
lib/            後端共用模組（Vercel 與本機 dev server 共用）
  app.ts        Express 路由（webhook、會員、註冊、預約、保單、管理）
  line.ts       LINE client、webhook 簽章驗證、LIFF token 驗證
  notion.ts     Notion client、data source 解析（含快取）
  config.ts     環境變數集中管理
api/index.ts    Vercel serverless 進入點（薄轉接）
server.ts       本機開發伺服器（同一組 API + Vite middleware）
scripts/        一次性測試／工具腳本（不參與建置）
```

## 本機開發

1. `npm install`
2. 複製 `.env.example` 為 `.env` 並填入值
3. `npm run dev`（http://localhost:3000）

## 部署（Vercel）

推送後自動建置。環境變數清單見 `.env.example`，需在 Vercel Dashboard 設定；`ADMIN_TOKEN` 未設定時管理端點（`/api/admin/*`）一律拒絕存取。

## 安全設計

1. LINE webhook 驗證 `x-line-signature` 簽章。
2. 會員相關 API（check-member、register、reservations、insurance）以 `Authorization: Bearer <LIFF access token>` 驗證，後端向 LINE 平台換取真實 userId，不信任前端傳入的 ID。
3. 錯誤細節只寫 log，不回傳給呼叫端。
