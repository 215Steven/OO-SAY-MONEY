const fs = require('fs');
const file = 'src/pages/AppointmentPage.tsx';
let data = fs.readFileSync(file, 'utf8');

// replace lines 7 to 15
const replacement = `const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const TOPICS_LIST = ["🏥 醫療保險", "📈 投資規劃", "📋 理賠服務", "🔄 保險變更", "🚗 汽機車險", "✈️ 旅遊保險"];
const SLOTS_LIST = [
  { time: "10:30 – 11:30", label: "上午場" },
  { time: "12:00 – 13:30", label: "午間場" },
  { time: "14:00 – 15:30", label: "下午場" },
  { time: "19:00 – 20:30", label: "晚間場" },
  { time: "🤝 其他時段", label: "請在備註說明方便時間", isOther: true }
];`;

const lines = data.split('\n');
lines.splice(6, 9, replacement);

const data2 = lines.join('\n');
const fixed2 = data2.replace(/è¼‰å…¥ä¸­â€¦/g, '載入中…')
  .replace(/ï¼ˆ\$\{WEEKDAYS/g, '（${WEEKDAYS')
  .replace(/\}ï¼‰/g, '}）')
  .replace(/ðŸ“…/g, '📅')
  .replace(/ðŸ• /g, '🕒')
  .replace(/ðŸ“ /g, '📝');

fs.writeFileSync(file, fixed2);
console.log("Done");
