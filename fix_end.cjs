const fs = require('fs');
const file = 'src/pages/AppointmentPage.tsx';
let t = fs.readFileSync(file, 'utf8');

// The corrupted arrays:
t = t.replace(/const WEEKDAYS = \[(.|\n)*?\];/, `const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];`);
t = t.replace(/const TOPICS_LIST = \[(.|\n)*?\];/, `const TOPICS_LIST = ["🏥 醫療保險", "📈 投資規劃", "📋 理賠服務", "🔄 保險變更", "🚗 汽機車險", "✈️ 旅遊保險"];`);
t = t.replace(/const SLOTS_LIST = \[\s*\{ time: "10(.|\n)*?\];/, `const SLOTS_LIST = [
  { time: "10:30 - 11:30", label: "上午場" },
  { time: "12:00 - 13:30", label: "午間場" },
  { time: "14:00 - 15:30", label: "下午場" },
  { time: "19:00 - 20:30", label: "晚間場" },
  { time: "🤝 其他時段", label: "請在備註說明方便時間", isOther: true }
];`);
t = t.replace(/'  1W\\f'/g, "'預約失敗，請稍後再試'");
t = t.replace(/setToastMsg\('  1W\\f'\);/g, "setToastMsg('預約失敗，請稍後再試');");
t = t.replace(/setToastMsg\('.*?f'\);/g, "setToastMsg('預約失敗，請稍後再試');");
t = t.replace(/\(' ,b'\)/g, "('一般諮詢')");

// Fix some specific bg-[#EAEAE6] that my script missed
t = t.replace(/bg-\[\#EAEAE6\]/g, 'bg-warm-gray-100');

fs.writeFileSync(file, t);
console.log("Fixed manually");
