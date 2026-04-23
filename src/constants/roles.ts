// ── 色彩系統 ────────────────────────────────────────────────────
// Accent : Amber  #f59e0b
// Light bg: Slate-50  #f8fafc  ← 全站淺色主體
// Dark txt: Slate-900 #0f172a
// 完整移除 indigo / violet / purple
// ────────────────────────────────────────────────────────────────

// 公開三格選單：每格對應一個獨立路由
export const PUBLIC_GRID = [
  {
    key: "story",
    label: "故事起點",
    sub: "顧問背景與理念",
    icon: "user",
    accent: "#f59e0b",
    route: "/story",
  },
  {
    key: "quiz",
    label: "錢去哪了",
    sub: "8 題財務心理測驗",
    icon: "trend",
    accent: "#10b981",
    route: "/quiz",
  },
  {
    key: "unlock",
    label: "解鎖更多",
    sub: "會員六大功能預覽",
    icon: "star",
    accent: "#0ea5e9",
    route: "/unlock",
  },
];

// 會員六格選單：每格對應一個獨立路由
export const MEMBER_GRID = [
  {
    key: "defense",
    label: "財務防線",
    sub: "保障缺口分析",
    icon: "shield",
    accent: "#f59e0b",
    route: "/defense",
  },
  {
    key: "money-flow",
    label: "錢的流向",
    sub: "收支與財務管家",
    icon: "money",
    accent: "#10b981",
    route: "/money-flow",
  },
  {
    key: "appointment",
    label: "預約聊聊",
    sub: "顧問面談預約",
    icon: "calendar",
    accent: "#0ea5e9",
    route: "/appointment",
  },
  {
    key: "about",
    label: "認識我們",
    sub: "我們能幫你什麼",
    icon: "info",
    accent: "#64748b",
    route: "/about",
  },
  {
    key: "inspiration",
    label: "理財靈感",
    sub: "精選財務文章",
    icon: "book",
    accent: "#8b5cf6",
    route: "/inspiration",
  },
  {
    key: "blueprint",
    label: "起富藍圖",
    sub: "月配息策略說明",
    icon: "map",
    accent: "#f59e0b",
    route: "/blueprint",
  },
];

// 舊有 THEMES / ROLE_META / GRIDS 保留以向下相容
export const THEMES: Record<string, any> = {
  public:    { bg: "#f8fafc", card: "#ffffff", accent: "#f59e0b", text: "#0f172a", muted: "#64748b", surface: "#ffffff" },
  newMember: { bg: "#f8fafc", card: "#ffffff", accent: "#f59e0b", text: "#0f172a", muted: "#64748b", surface: "#ffffff" },
  peer:      { bg: "#f8fafc", card: "#ffffff", accent: "#0ea5e9", text: "#0f172a", muted: "#64748b", surface: "#ffffff" },
  client:    { bg: "#f8fafc", card: "#ffffff", accent: "#f59e0b", text: "#0f172a", muted: "#64748b", surface: "#ffffff" },
};

export const ROLE_META: Record<string, any> = {
  newMember: { label: "新會員",  theme: "newMember" },
  peer:      { label: "同業",    theme: "peer"      },
  client:    { label: "客戶",    theme: "client"    },
};

export const GRIDS: Record<string, any> = {
  newMember: {
    title: "你的財務探索旅程",
    bg: "#f8fafc",
    items: [
      { key: "money_tool",  label: "理財工具",   icon: "money",    bg: "#ffffff", accent: "#f59e0b", sub: "財務分析工具",  span: 1 },
      { key: "defense",     label: "財務防線",   icon: "shield",   bg: "#ffffff", accent: "#10b981", sub: "保障缺口分析",  span: 1 },
      { key: "blueprint",   label: "財務藍圖",   icon: "map",      bg: "#ffffff", accent: "#0ea5e9", sub: "財務規劃路徑",  span: 1 },
      { key: "inspire",     label: "理財靈感",   icon: "star",     bg: "#ffffff", accent: "#64748b", sub: "案例與文章",    span: 1 },
      { key: "book",        label: "預約免費諮詢", icon: "calendar", bg: "#0f172a", accent: "#f59e0b", sub: "30 分鐘，一對一深度對談", span: 2 },
    ],
  },
  client: {
    title: "我的財務中心",
    bg: "#f8fafc",
    items: [
      { key: "protection",  label: "我的保障",   icon: "shield",   bg: "#ffffff", accent: "#f59e0b", sub: "保障 · 缺口 · 已有保障", span: 2 },
      { key: "plan",        label: "財務規劃",   icon: "trend",    bg: "#ffffff", accent: "#10b981", sub: "我的財務路徑",  span: 1 },
      { key: "notes",       label: "財務筆記",   icon: "book",     bg: "#ffffff", accent: "#94a3b8", sub: "顧問建議紀錄",  span: 1 },
      { key: "news",        label: "最新消息",   icon: "info",     bg: "#ffffff", accent: "#94a3b8", sub: "最新資訊",      span: 1 },
      { key: "chat",        label: "預約諮詢",   icon: "mail",     bg: "#ffffff", accent: "#0ea5e9", sub: "即時顧問服務",  span: 1 },
    ],
  },
  peer: {
    title: "同業夥伴中心",
    bg: "#f8fafc",
    items: [
      { key: "demo",        label: "示範工具",   icon: "gear",     bg: "#ffffff", accent: "#0ea5e9", sub: "客製展示素材",  span: 1 },
      { key: "config",      label: "客製方案",   icon: "map",      bg: "#ffffff", accent: "#0ea5e9", sub: "方案配置模板",  span: 1 },
      { key: "news",        label: "最新資訊",   icon: "info",     bg: "#ffffff", accent: "#94a3b8", sub: "市場動態",      span: 1 },
      { key: "about-us",    label: "認識我方",   icon: "user",     bg: "#ffffff", accent: "#94a3b8", sub: "公司介紹",      span: 1 },
      { key: "book",        label: "預約諮詢",   icon: "calendar", bg: "#0ea5e9", accent: "#ffffff", sub: "快速合作",      span: 2 },
    ],
  },
};
