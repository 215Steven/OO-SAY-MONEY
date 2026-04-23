export const THEMES: Record<string, any> = {
  public:    { bg:"#F8F8F6", card:"#FFFFFF", accent:"#2D2D2A", text:"#2D2D2A", muted:"#8B8A88", surface:"#F2F2F0" },
  newMember: { bg:"#F8F8F6", card:"#FFFFFF", accent:"#3E4E42", text:"#2D2D2A", muted:"#8B8A88", surface:"#F2F2F0" },
  peer:      { bg:"#FFFFFF", card:"#F8F8F6", accent:"#49405E", text:"#2D2D2A", muted:"#8B8A88", surface:"#F9F9F8" },
  client:    { bg:"#F2F0EA", card:"#FFFFFF", accent:"#5B4133", text:"#2D2D2A", muted:"#8B8A88", surface:"#EAE8E3" },
};

export const ROLE_META: Record<string, any> = {
  newMember: { label:"新會員",   theme:"newMember" },
  peer:      { label:"同業夥伴", theme:"peer"      },
  client:    { label:"尊爵客戶", theme:"client"    },
};

export const GRIDS: Record<string, any> = {
  newMember: {
    title: "你的理財空間", bg: "transparent",
    items: [
      { key:"money_tool", label:"錢都去哪了", icon:"money",    bg:"#F8F8F6", accent:"#3E4E42", sub:"財務診斷工具" },
      { key:"defense",    label:"財務防線",   icon:"shield",   bg:"#F8F8F6", accent:"#3E4E42", sub:"保障缺口分析" },
      { key:"blueprint",  label:"啟富藍圖",   icon:"map",      bg:"#F8F8F6", accent:"#3E4E42", sub:"理財規劃路徑" },
      { key:"inspire",    label:"理財靈感",   icon:"star",     bg:"#F8F8F6", accent:"#3E4E42", sub:"知識與文章" },
      { key:"book",       label:"預約聊聊",   icon:"calendar", bg:"#F8F8F6", accent:"#3E4E42", sub:"免費初次諮詢" },
      { key:"story",      label:"故事起點",   icon:"book",     bg:"#F8F8F6", accent:"#3E4E42", sub:"認識我們" },
    ]
  },
  client: {
    title: "我的財務中心", bg: "transparent",
    items: [
      { key:"news",       label:"最新動態",   icon:"info",     bg:"#FFFFFF", accent:"#5B4133", sub:"最新消息" },
      { key:"plan",       label:"啟富計劃",   icon:"trend",    bg:"#FFFFFF", accent:"#5B4133", sub:"我的財務規劃" },
      { key:"notes",      label:"理財筆記",   icon:"book",     bg:"#FFFFFF", accent:"#5B4133", sub:"文章與資源" },
      { key:"value",      label:"核心價值",   icon:"diamond",  bg:"#FFFFFF", accent:"#5B4133", sub:"服務理念" },
      { key:"chat",       label:"理財對談",   icon:"mail",     bg:"#FFFFFF", accent:"#5B4133", sub:"預約諮詢" },
      { key:"protection", label:"我的保障",   icon:"shield",   bg:"#FFFFFF", accent:"#5B4133", sub:"保單管理" },
    ]
  },
  peer: {
    title: "同業資源中心", bg: "transparent",
    items: [
      { key:"demo",  label:"範例操作",   icon:"gear",     bg:"#F8F8F6", accent:"#49405E", sub:"示範流程" },
      { key:"news",  label:"最新資訊",   icon:"info",     bg:"#F8F8F6", accent:"#49405E", sub:"市場動態" },
      { key:"config",label:"多重配置",   icon:"map",      bg:"#F8F8F6", accent:"#49405E", sub:"資產配置方案" },
      { key:"about-us", label:"認識我們",   icon:"user",     bg:"#F8F8F6", accent:"#49405E", sub:"品牌介紹" },
      { key:"book",  label:"預約諮詢",   icon:"calendar", bg:"#F8F8F6", accent:"#49405E", sub:"合作洽談" },
      { key:"email", label:"訂閱電子報", icon:"mail",     bg:"#F8F8F6", accent:"#49405E", sub:"定期資訊" },
    ]
  },
};

