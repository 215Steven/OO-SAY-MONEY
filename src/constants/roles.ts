export const THEMES: Record<string, any> = {
  public:    { bg:"#f8fafc", card:"#0f172a", accent:"#4f46e5", text:"#ffffff", muted:"#94a3b8", surface:"#ffffff" },
  newMember: { bg:"#f8fafc", card:"#ffffff", accent:"#4f46e5", text:"#0f172a", muted:"#64748b", surface:"#ffffff" },
  peer:      { bg:"#0f172a", card:"#1e293b", accent:"#6366f1", text:"#f8fafc", muted:"#94a3b8", surface:"#1e293b" },
  client:    { bg:"#1e293b", card:"#334155", accent:"#818cf8", text:"#f8fafc", muted:"#94a3b8", surface:"#334155" },
};

export const ROLE_META: Record<string, any> = {
  newMember: { label:"新會員",   theme:"newMember" },
  peer:      { label:"同業",     theme:"peer"      },
  client:    { label:"客戶",     theme:"client"    },
};

export const GRIDS: Record<string, any> = {
  newMember: {
    title: "你的理財空間", bg: "#f8fafc",
    items: [
      { key:"money_tool", label:"錢都去哪了", icon:"money",    bg:"#ffffff", accent:"#4f46e5", sub:"財務診斷工具" },
      { key:"defense",    label:"財務防線",   icon:"shield",   bg:"#ffffff", accent:"#10b981", sub:"保障缺口分析" },
      { key:"blueprint",  label:"啟富藍圖",   icon:"map",      bg:"#ffffff", accent:"#f59e0b", sub:"理財規劃路徑" },
      { key:"inspire",    label:"理財靈感",   icon:"star",     bg:"#ffffff", accent:"#8b5cf6", sub:"知識與文章" },
      { key:"book",       label:"預約聊聊",   icon:"calendar", bg:"#ffffff", accent:"#3b82f6", sub:"免費初次諮詢" },
      { key:"story",      label:"故事起點",   icon:"book",     bg:"#ffffff", accent:"#64748b", sub:"認識我們" },
    ]
  },
  client: {
    title: "我的財務中心", bg: "#0f172a",
    items: [
      { key:"news",       label:"最新動態",   icon:"info",     bg:"#1e293b", accent:"#818cf8", sub:"最新消息" },
      { key:"plan",       label:"啟富計劃",   icon:"trend",    bg:"#1e293b", accent:"#818cf8", sub:"我的財務規劃" },
      { key:"notes",      label:"理財筆記",   icon:"book",     bg:"#1e293b", accent:"#818cf8", sub:"文章與資源" },
      { key:"value",      label:"核心價值",   icon:"diamond",  bg:"#1e293b", accent:"#818cf8", sub:"服務理念" },
      { key:"chat",       label:"理財對談",   icon:"mail",     bg:"#1e293b", accent:"#818cf8", sub:"預約諮詢" },
      { key:"protection", label:"我的保障",   icon:"shield",   bg:"#1e293b", accent:"#818cf8", sub:"保單管理" },
    ]
  },
  peer: {
    title: "同業資源中心", bg: "#0f172a",
    items: [
      { key:"demo",  label:"範例操作",   icon:"gear",     bg:"#1e293b", accent:"#6366f1", sub:"示範流程" },
      { key:"news",  label:"最新資訊",   icon:"info",     bg:"#1e293b", accent:"#3b82f6", sub:"市場動態" },
      { key:"config",label:"多重配置",   icon:"map",      bg:"#1e293b", accent:"#6366f1", sub:"資產配置方案" },
      { key:"about-us", label:"認識我們",   icon:"user",     bg:"#1e293b", accent:"#3b82f6", sub:"品牌介紹" },
      { key:"book",  label:"預約諮詢",   icon:"calendar", bg:"#1e293b", accent:"#6366f1", sub:"合作洽談" },
      { key:"email", label:"訂閱電子報", icon:"mail",     bg:"#1e293b", accent:"#3b82f6", sub:"定期資訊" },
    ]
  },
};
