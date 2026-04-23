export const THEMES: Record<string, any> = {
  public:    { bg:"#f8f5ff", card:"rgba(255,255,255,0.6)", accent:"#9333ea", text:"#1e293b", muted:"#64748b", surface:"rgba(255,255,255,0.6)" },
  newMember: { bg:"#f8f5ff", card:"rgba(255,255,255,0.6)", accent:"#9333ea", text:"#1e293b", muted:"#64748b", surface:"rgba(255,255,255,0.6)" },
  peer:      { bg:"#f8f5ff", card:"rgba(255,255,255,0.6)", accent:"#7e22ce", text:"#1e293b", muted:"#64748b", surface:"rgba(255,255,255,0.6)" },
  client:    { bg:"#f8f5ff", card:"rgba(255,255,255,0.6)", accent:"#a855f7", text:"#1e293b", muted:"#64748b", surface:"rgba(255,255,255,0.6)" },
};

export const ROLE_META: Record<string, any> = {
  newMember: { label:"新會員",   theme:"newMember" },
  peer:      { label:"同業",     theme:"peer"      },
  client:    { label:"客戶",     theme:"client"    },
};

export const GRIDS: Record<string, any> = {
  newMember: {
    title: "你的理財空間", bg: "transparent",
    items: [
      { key:"money_tool", label:"錢都去哪了", icon:"money",    bg:"rgba(255,255,255,0.7)", accent:"#9333ea", sub:"財務診斷工具" },
      { key:"defense",    label:"財務防線",   icon:"shield",   bg:"rgba(255,255,255,0.7)", accent:"#10b981", sub:"保障缺口分析" },
      { key:"blueprint",  label:"啟富藍圖",   icon:"map",      bg:"rgba(255,255,255,0.7)", accent:"#f59e0b", sub:"理財規劃路徑" },
      { key:"inspire",    label:"理財靈感",   icon:"star",     bg:"rgba(255,255,255,0.7)", accent:"#8b5cf6", sub:"知識與文章" },
      { key:"book",       label:"預約聊聊",   icon:"calendar", bg:"rgba(255,255,255,0.7)", accent:"#3b82f6", sub:"免費初次諮詢" },
      { key:"story",      label:"故事起點",   icon:"book",     bg:"rgba(255,255,255,0.7)", accent:"#64748b", sub:"認識我們" },
    ]
  },
  client: {
    title: "我的財務中心", bg: "transparent",
    items: [
      { key:"news",       label:"最新動態",   icon:"info",     bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"最新消息" },
      { key:"plan",       label:"啟富計劃",   icon:"trend",    bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"我的財務規劃" },
      { key:"notes",      label:"理財筆記",   icon:"book",     bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"文章與資源" },
      { key:"value",      label:"核心價值",   icon:"diamond",  bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"服務理念" },
      { key:"chat",       label:"理財對談",   icon:"mail",     bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"預約諮詢" },
      { key:"protection", label:"我的保障",   icon:"shield",   bg:"rgba(255,255,255,0.7)", accent:"#a855f7", sub:"保單管理" },
    ]
  },
  peer: {
    title: "同業資源中心", bg: "transparent",
    items: [
      { key:"demo",  label:"範例操作",   icon:"gear",     bg:"rgba(255,255,255,0.7)", accent:"#7e22ce", sub:"示範流程" },
      { key:"news",  label:"最新資訊",   icon:"info",     bg:"rgba(255,255,255,0.7)", accent:"#3b82f6", sub:"市場動態" },
      { key:"config",label:"多重配置",   icon:"map",      bg:"rgba(255,255,255,0.7)", accent:"#7e22ce", sub:"資產配置方案" },
      { key:"about-us", label:"認識我們",   icon:"user",     bg:"rgba(255,255,255,0.7)", accent:"#3b82f6", sub:"品牌介紹" },
      { key:"book",  label:"預約諮詢",   icon:"calendar", bg:"rgba(255,255,255,0.7)", accent:"#7e22ce", sub:"合作洽談" },
      { key:"email", label:"訂閱電子報", icon:"mail",     bg:"rgba(255,255,255,0.7)", accent:"#3b82f6", sub:"定期資訊" },
    ]
  },
};
