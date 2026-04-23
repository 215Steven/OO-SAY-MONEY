exports.handler = async (event, context) => {
  // 模擬從資料庫 (例如 Notion, Firebase) 取回來的保單健檢資料
  const mockData = {
    name: "林小華",
    advisor: "Steven & Annie",
    updated: "2026/04/15",
    members: [
      {
        name: "林小華",
        label: "本人",
        type: "adult",
        coverage: [
          { label: "壽險保障", detail: "足夠", status: "ok", note: "保額 1,000 萬" },
          { label: "實支實付", detail: "缺口", status: "gap", note: "額度偏低，建議補強第二家" },
          { label: "重大疾病", detail: "極缺", status: "none", note: "完全無保障，風險極高" },
          { label: "車險/產險", detail: "未知", status: "unknown", note: "尚未匯入保單" }
        ]
      },
      {
        name: "王大明",
        label: "配偶",
        type: "adult",
        coverage: [
          { label: "壽險保障", detail: "需補足", status: "gap", note: "房貸增長，建議補強定期壽險" },
          { label: "實支實付", detail: "足夠", status: "ok", note: "雙實支保障完整" },
          { label: "重大疾病", detail: "足夠", status: "ok", note: "保額 200 萬" }
        ]
      },
      {
        name: "林小寶",
        label: "子女",
        type: "child",
        coverage: [
          { label: "醫療保障", detail: "足夠", status: "ok", note: "基礎醫療齊全" }
        ]
      }
    ]
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // 視需要可鎖定特定 Domain
    },
    body: JSON.stringify(mockData)
  };
};
