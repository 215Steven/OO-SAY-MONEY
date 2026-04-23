// ── 全站色彩系統 ─────────────────────────────────────────────
// 主色調：Amber（#f59e0b）· 底色：Slate-50（#f8fafc）
// 文字：Slate-900（#0f172a）· 移除所有 indigo / violet / purple
// ──────────────────────────────────────────────────────────────

export const THEMES: Record<string, any> = {
  public:    { bg: "#f8fafc", card: "#0f172a", accent: "#f59e0b", text: "#ffffff", muted: "#94a3b8", surface: "#ffffff" },
  newMember: { bg: "#f8fafc", card: "#ffffff", accent: "#f59e0b", text: "#0f172a", muted: "#64748b", surface: "#ffffff" },
  peer:      { bg: "#0f172a", card: "#1e293b", accent: "#0ea5e9", text: "#f8fafc", muted: "#94a3b8", surface: "#1e293b" },
  client:    { bg: "#0f172a", card: "#1e293b", accent: "#f59e0b", text: "#f8fafc", muted: "#94a3b8", surface: "#1e293b" },
};

export const ROLE_META: Record<string, any> = {
  newMember: { label: "新會員",  theme: "newMember" },
  peer:      { label: "同業",    theme: "peer"      },
  client:    { label: "客戶",    theme: "client"    },
};

// span: 1 = 半格, 2 = 全格（Bento 不對稱排版用）
export const GRIDS: Record<string, any> = {
  newMember: {
    title: "你的理財空間",
    bg: "#f8fafc",
    items: [
      { key: "money_tool",  label: "錢都去哪了", icon: "money",    bg: "#ffffff", accent: "#f59e0b", sub: "財務診斷工具", span: 1 },
      { key: "defense",     label: "財務防線",   icon: "shield",   bg: "#ffffff", accent: "#10b981", sub: "保障缺口分析", span: 1 },
      { key: "blueprint",   label: "啟富藍圖",   icon: "map",      bg: "#ffffff", accent: "#0ea5e9", sub: "理財規劃路徑", span: 1 },
      { key: "inspire",     label: "理財靈感",   icon: "star",     bg: "#ffffff", accent: "#64748b", sub: "知識與文章",   span: 1 },
      // Hero CTA — 全寬暗色卡
      { key: "book",        label: "預約免費諮詢", icon: "calendar", bg: "#0f172a", accent: "#f59e0b", sub: "30 分鐘，一次說清楚", span: 2 },
    ],
  },

  client: {
    title: "我的財務中心",
    bg: "#0f172a",
    items: [
      // Hero — 全寬，客戶最重要的功能
      { key: "protection",  label: "我的保障",   icon: "shield",   bg: "#1e293b", accent: "#f59e0b", sub: "保單 · 缺口 · 即時狀態", span: 2 },
      { key: "plan",        label: "啟富計劃",   icon: "trend",    bg: "#1e293b", accent: "#10b981", sub: "我的財務規劃", span: 1 },
      { key: "notes",       label: "理財筆記",   icon: "book",     bg: "#1e293b", accent: "#94a3b8", sub: "文章與資源",   span: 1 },
      { key: "news",        label: "最新動態",   icon: "info",     bg: "#1e293b", accent: "#94a3b8", sub: "最新消息",     span: 1 },
      { key: "chat",        label: "預約對談",   icon: "mail",     bg: "#1e293b", accent: "#0ea5e9", sub: "與顧問諮詢",   span: 1 },
    ],
  },

  peer: {
    title: "同業資源中心",
    bg: "#0f172a",
    items: [
      { key: "demo",        label: "範例操作",   icon: "gear",     bg: "#1e293b", accent: "#0ea5e9", sub: "示範流程",    span: 1 },
      { key: "config",      label: "多槅配置",   icon: "map",      bg: "#1e293b", accent: "#0ea5e9", sub: "資產配置方楈", span: 1 },
      { key: "news",        label: "最新戳誊",   icon: "info",     bg: "#1e293b", accent: "#94a3b8", sub: "市場動態",     span: 1 },
      { key: "about-us",    label: "認識我們",   icon: "user",     bg: "#1e293b", accent: "#94a3b8", sub: "品牌介紹",     span: 1 },
      // Hero CTA
      { key: "book",        label: "預約諮詢",   icon: "calendar", bg: "#0ea5e9", accent: "#ffffff", sub: "合作洽談",     span: 2 },
    ],
  },
};
