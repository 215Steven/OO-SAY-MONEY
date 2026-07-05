import { useState, useEffect } from "react";
import { Ic } from "@/src/components/Icons";
import { InputBox } from "@/src/components/ui/InputBox";
import { motion } from "motion/react";
import { fmt } from "@/src/utils/formatters";

// 欄位值允許 number（demo 預設值）或 string（使用者輸入中，
// 包含小數點打到一半的狀態），計算時一律以 Number() 轉換
type MoneyForm = Record<
  | 'a_cash' | 'a_invest' | 'a_property'
  | 'l_mortgage' | 'l_other'
  | 'i_active' | 'i_passive'
  | 'e_living' | 'e_housing' | 'e_debt' | 'e_insurance' | 'e_dca',
  number | string
>;

interface MoneyToolProps {
  onBack: () => void;
  onBook: () => void;
}

// 範例資料與空白資料完全分開管理，避免使用者忘記清除示例數據，
// 就用假資料產生一份看起來很正式的「健檢報告」。
const DEMO_DATA: MoneyForm = {
  a_cash: 80, a_invest: 30, a_property: 0,
  l_mortgage: 0, l_other: 5,
  i_active: 75000, i_passive: 5000,
  e_living: 20000, e_housing: 18000, e_debt: 3000, e_insurance: 4000,
  e_dca: 10000
};
const EMPTY_DATA: MoneyForm = {
  a_cash: '', a_invest: '', a_property: '',
  l_mortgage: '', l_other: '',
  i_active: '', i_passive: '',
  e_living: '', e_housing: '', e_debt: '', e_insurance: '',
  e_dca: ''
};
const WIZARD_TITLES = ["資產與負債", "每月收入", "每月支出", "定期定額與總覽"];

// 草稿只在「真實填寫」流程中自動存到本機（demo 資料不需要），
// 讓使用者填到一半離開，回來還能接著填，避免長表單的中途流失。
const DRAFT_KEY = "oosaymoney_moneytool_draft_v1";
function loadDraft(): { data: MoneyForm; wizardStep: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.data) return null;
    return parsed;
  } catch {
    return null;
  }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

// 「萬」單位的資產／負債欄位，若填入數字大到不合理（例如把「元」打成「萬」），
// 提醒使用者確認單位，避免算出離譜的健檢結果卻沒發現。
const WAN_FIELDS: Array<{ key: keyof MoneyForm; label: string }> = [
  { key: "a_cash", label: "現金存款" },
  { key: "a_invest", label: "投資部位" },
  { key: "a_property", label: "房地產估值" },
  { key: "l_mortgage", label: "房貸餘額" },
  { key: "l_other", label: "其他負債" },
];
const isImplausibleWan = (v: number | string) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 100000;
};

export const MoneyTool = ({ onBack, onBook }: MoneyToolProps) => {
  // screen：choice（先選看範例還是自己填）→ wizard（分 4 步填寫）→ report（健檢結果，維持單頁滑動）
  const [screen, setScreen] = useState<"choice" | "wizard" | "report">("choice");
  const [wizardStep, setWizardStep] = useState(0); // 0~3，共 4 步
  const [isDemo, setIsDemo] = useState(false);
  const [data, setData] = useState<MoneyForm>(EMPTY_DATA);
  const [hasDraft, setHasDraft] = useState<boolean>(() => !!loadDraft());

  const set = (k: string, v: string) => {
    setData(d => ({ ...d, [k]: v }));
  };

  // 進入 wizard 且非 demo 時，每次資料變動就同步存一份草稿到本機
  useEffect(() => {
    if (screen !== "wizard" || isDemo) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, wizardStep }));
      setHasDraft(true);
    } catch {}
  }, [data, wizardStep, screen, isDemo]);

  const startDemo = () => {
    setIsDemo(true);
    setData(DEMO_DATA);
    setScreen("report");
  };
  const startReal = () => {
    clearDraft();
    setHasDraft(false);
    setIsDemo(false);
    setData(EMPTY_DATA);
    setWizardStep(0);
    setScreen("wizard");
  };
  const continueDraft = () => {
    const draft = loadDraft();
    if (!draft) return;
    setIsDemo(false);
    setData(draft.data);
    setWizardStep(draft.wizardStep || 0);
    setScreen("wizard");
  };
  const nextWizardStep = () => {
    window.scrollTo(0, 0);
    if (wizardStep >= WIZARD_TITLES.length - 1) {
      clearDraft();
      setHasDraft(false);
      setScreen("report");
      return;
    }
    setWizardStep(s => s + 1);
  };
  const prevWizardStep = () => {
    window.scrollTo(0, 0);
    if (wizardStep <= 0) { setScreen("choice"); return; }
    setWizardStep(s => s - 1);
  };

  const cash = Number(data.a_cash) || 0;
  const invest = Number(data.a_invest) || 0;
  const property = Number(data.a_property) || 0;
  const mortgage = Number(data.l_mortgage) || 0;
  const lOther = Number(data.l_other) || 0;

  const totalAssets = cash + invest + property;
  const totalLiab = mortgage + lOther;
  const netWorth = totalAssets - totalLiab;

  // 資料填寫完整度：共 12 項欄位，空白欄位計算時視為 0，
  // 讓使用者知道報告的精準度跟自己填了多少有關
  const TOTAL_FIELDS = 12;
  const filledFieldsCount = Object.values(data).filter(v => v !== "" && v !== null && v !== undefined).length;

  // 資產／負債欄位若出現不合理的大數字，提醒可能把「元」誤填成「萬」
  const wanWarnFields = WAN_FIELDS.filter(f => isImplausibleWan(data[f.key]));

  const active = Number(data.i_active) || 0;
  const passive = Number(data.i_passive) || 0;
  const income = active + passive;
  const living = Number(data.e_living) || 0;
  const housing = Number(data.e_housing) || 0;
  const debt = Number(data.e_debt) || 0;
  const insurance = Number(data.e_insurance) || 0;
  const dca = Number(data.e_dca) || 0;

  const fixedExp = living + housing + debt + insurance;
  const surplus = income - fixedExp;
  const idle = surplus - dca;
  const savRate = income > 0 ? Math.round((surplus / income) * 100) : 0;
  const dcaRate = surplus > 0 ? Math.round((dca / surplus) * 100) : 0;

  const efMonths = fixedExp > 0 ? (cash * 10000) / fixedExp : 0;
  const liabRatio = totalAssets > 0 ? (totalLiab / totalAssets) : (totalLiab > 0 ? 1 : 0);
  const investRatio = totalAssets > 0 ? (invest / totalAssets) : 0;

  // 償還債務率：每月負債還款 / 月收入，是「流量」指標，跟負債比（總負債/總資產，
  // 「存量」指標）互補——負債比健康的人，也可能每月被高利率負債壓得喘不過氣
  const debtSvcRatio = income > 0 ? (debt / income) : (debt > 0 ? 1 : 0);
  const debtSvcPct = Math.round(debtSvcRatio * 100);

  const passivePct = fixedExp > 0 ? Math.round((passive / fixedExp) * 100) : 0;
  const cappedPassivePct = Math.min(passivePct, 100);

  let passiveColor, passiveTitle, passiveMsg, passiveBg, passiveMsgColor;
  if (passive === 0) {
    passiveColor = 'text-warm-gray-400';
    passiveBg = 'bg-warm-gray-100';
    passiveTitle = '被動收入 vs 固定支出';
    passiveMsg = '目前完全依賴主動收入。建立被動收入來源，是財務自由的核心第一步。';
    passiveMsgColor = 'text-warm-gray-600';
  } else if (fixedExp === 0) {
    passiveColor = 'text-teal-base';
    passiveBg = 'bg-cyan-soft/30';
    passiveTitle = '已有被動收入 🎉';
    passiveMsg = `每月被動收入 ${fmt(passive)} 元。填入固定支出後可計算財務自由進度。`;
    passiveMsgColor = 'text-teal-800';
  } else if (passivePct >= 100) {
    passiveColor = 'text-teal-base';
    passiveBg = 'bg-cyan-soft/30';
    passiveTitle = '🎉 已達財務自由基礎！';
    passiveMsg = `被動收入（${fmt(passive)} 元）已超過固定支出（${fmt(fixedExp)} 元）。主動收入可以完全轉為財富累積，恭喜！`;
    passiveMsgColor = 'text-teal-800';
  } else if (passivePct >= 75) {
    passiveColor = 'text-teal-base';
    passiveBg = 'bg-cyan-soft/30';
    passiveTitle = `財務自由進度 ${passivePct}% — 接近門檻`;
    passiveMsg = `被動收入每月 ${fmt(passive)} 元，再補足 ${fmt(fixedExp - passive)} 元 / 月，就能達成「被動 ≥ 支出」的財務自由基礎。`;
    passiveMsgColor = 'text-teal-800';
  } else if (passivePct >= 50) {
    passiveColor = 'text-teal-base';
    passiveBg = 'bg-cyan-soft/30';
    passiveTitle = `財務自由進度 ${passivePct}% — 過了一半`;
    passiveMsg = `被動收入已覆蓋固定支出的 ${passivePct}%，進度不錯！距目標（${fmt(fixedExp)} 元 / 月）還差 ${fmt(fixedExp - passive)} 元。`;
    passiveMsgColor = 'text-teal-800';
  } else if (passivePct >= 20) {
    passiveColor = 'text-alert-orange';
    passiveBg = 'bg-alert-orange/10';
    passiveTitle = `財務自由進度 ${passivePct}%`;
    passiveMsg = `被動收入 ${fmt(passive)} 元，約覆蓋支出的 ${passivePct}%。持續累積股息或租金收入，讓數字慢慢靠近 100%。`;
    passiveMsgColor = 'text-amber-800';
  } else {
    passiveColor = 'text-alert-orange';
    passiveBg = 'bg-alert-orange/10';
    passiveTitle = `財務自由進度 ${passivePct}% — 剛起步`;
    passiveMsg = `被動收入 ${fmt(passive)} 元，覆蓋率 ${passivePct}%。財務自由的核心目標：讓被動收入 ≥ 固定支出（${fmt(fixedExp)} 元 / 月）。`;
    passiveMsgColor = 'text-amber-800';
  }

  const expRatio = income > 0 ? fixedExp / income : 1;
  const expRatePct = Math.round(expRatio * 100);

  const expScore = Math.max(0, Math.min(30, Math.round((0.9 - expRatio) * 60)));
  const efScore = Math.min((efMonths / 12) * 25, 25);
  const liabScore = Math.max(0, Math.min((1 - liabRatio) * 20, 20));
  const invScore = Math.min((investRatio / 0.3) * 25, 25);
  const score = Math.round(expScore + efScore + liabScore + invScore);

  let status, sub, colorClass, borderClass, bgClass;
  if (score >= 80) { status = '✅ 財務體質良好'; colorClass = 'text-teal-base'; borderClass = 'border-teal-soft'; bgClass = 'bg-cyan-soft/30'; sub = '整體結構穩健。深度諮詢可找到下一個成長機會'; }
  else if (score >= 60) { status = '📊 有優化空間'; colorClass = 'text-alert-orange'; borderClass = 'border-alert-orange/30'; bgClass = 'bg-alert-orange/5'; sub = '投資動能待啟動，被動收入尚未建立'; }
  else { status = '⚠️ 建議優先改善'; colorClass = 'text-rose-500'; borderClass = 'border-rose-200'; bgClass = 'bg-rose-50'; sub = '財務結構需要調整，越早規劃空間越大'; }

  const insRate = income > 0 ? Math.round((insurance / income) * 100) : 0;
  // 標準化指標達成率（0~1），1 代表達標，用於篩選最需要關注的項目
  const mExp = Math.max(0, Math.min(1, (0.75 - expRatio) / 0.15)); // 0.6 以下為 1，0.75 以上為 0
  const mEf = Math.min(1, efMonths / 6); // 6個月為 1
  const mLiab = Math.max(0, Math.min(1, (0.6 - liabRatio) / 0.2)); // 0.4 以下為 1，0.6 以上為 0
  const mInv = Math.min(1, investRatio / 0.2); // 20% 為 1
  const mDebtSvc = Math.max(0, Math.min(1, (0.6 - debtSvcRatio) / 0.2)); // 0.4 以下為 1，0.6 以上為 0

  const metricsList = [
    { pct: mExp, icon: '💸', name: '收支比', weak: `固定支出佔收入 ${expRatePct}%，偏高。每月可動用空間不足`, strong: `收支結構健康，固定支出控制得宜` },
    { pct: mEf, icon: '🛡️', name: '緊急預備金', weak: `緊急預備金約 ${Math.round(efMonths * 10) / 10} 個月，建議補足至 6 個月`, strong: `緊急預備金充足。可以開始思考如何讓資金更積極配置` },
    { pct: mLiab, icon: '📉', name: '負債比', weak: `負債比 ${Math.round(liabRatio * 100)}%，偏高。優先降低高利率負債`, strong: `負債比健康。財務彈性佳，適合進一步規劃資產配置` },
    { pct: mInv, icon: '📈', name: '投資比例', weak: `投資佔總資產 ${Math.round(investRatio * 100)}%，偏低。資金複利效果尚未啟動`, strong: `投資比例不錯。進一步優化配置結構可放大報酬` },
    { pct: mDebtSvc, icon: '💳', name: '償還債務率', weak: `每月負債還款佔收入 ${debtSvcPct}%，偏高。若含信用卡或信用貸款等高利率負債，建議優先償還`, strong: `每月還款壓力健康，財務彈性佳` },
  ];
  if (insRate > 15) metricsList.push({ pct: Math.max(0, 1 - (insRate - 15) / 10), icon: '🔍', name: '保費比例', weak: `保費佔收入 ${insRate}%，偏高。建議檢視是否有重疊保單`, strong: '' });
  else if (insRate <= 0 && insurance === 0) metricsList.push({ pct: 0.2, icon: '🛡️', name: '保費', weak: `尚未填寫保險狀態。保障缺口是最常被忽略的風險`, strong: '' });

  const weakest = metricsList.reduce((a, b) => a.pct < b.pct ? a : b);
  const isWeakGood = weakest.pct >= 0.85;

  let momTxt, momPct;
  if (income === 0) {
    momTxt = '填入月收入後，這裡會顯示你每月結餘的使用狀況。'; momPct = '—';
  } else if (surplus <= 0) {
    momTxt = '目前固定支出已超過月收入，建議優先審視各項支出結構。'; momPct = '⚠️';
  } else if (dca === 0) {
    momTxt = `你每月有 ${fmt(surplus)} 元的結餘，但目前沒有定期投資計畫。這筆錢是否有更好的去處？`; momPct = '0%';
  } else if (idle < 0) {
    momTxt = `定時定額（${fmt(dca)} 元）已超過月結餘，需要調整支出或投資金額。`; momPct = '⚠️';
  } else {
    momTxt = `每月結餘 ${fmt(surplus)} 元，其中 ${fmt(dca)} 元（${dcaRate}%）已在定時定額，剩餘 ${fmt(idle)} 元閒置。${idle > 5000 ? '這筆閒置還有配置空間。' : '配置比例不錯！'}`;
    momPct = dcaRate + '%';
  }

  const METRICS = [
    {
      name: '收支比', desc: '固定支出 / 月收入，建議低於 60%',
      val: expRatePct, format: (v:any) => v + '%', target: 60, ok: 60, warn: 75, isReverse: true,
      bands: '綠燈 ≤60%．黃燈 60–75%．紅燈 ＞75%',
      note: (v:any) => v <= 50 ? '支出結構健康，每月有充裕結餘' : v <= 60 ? `支出比 ${v}%，尚可，仍有空間` : v <= 75 ? `支出比 ${v}%，偏高，建議檢視可調整項目` : `支出比 ${v}%，過高，收支平衡需優先處理`,
    },
    {
      name: '緊急預備金', desc: '建議至少 6 個月固定支出',
      val: Math.round(efMonths * 10) / 10, format: (v:any) => v + ' 個月', target: 6, ok: 6, warn: 3, isReverse: false,
      bands: '綠燈 ≥6 個月．黃燈 3–6 個月．紅燈 ＜3 個月',
      note: (v:any) => v >= 6 ? '充足，能應對突發收入中斷' : v >= 3 ? `約 ${v} 個月，建議補足至 6 個月` : `約 ${v} 個月，偏低，優先補強`,
    },
    {
      name: '負債比', desc: '負債 / 總資產，建議低於 40%',
      val: Math.round(liabRatio * 100), format: (v:any) => v + '%', target: 40, ok: 40, warn: 60, isReverse: true,
      bands: '綠燈 ≤40%．黃燈 40–60%．紅燈 ＞60%',
      note: (v:any) => v <= 40 ? '負債比健康，財務彈性佳' : v <= 60 ? `負債比 ${v}%，中等，留意還款壓力` : `負債比 ${v}%，偏高，建議優先降低`,
    },
    {
      name: '償還債務率',
      desc: '每月負債還款 / 月收入，建議低於 40%（與負債比互補的流量指標）',
      val: debtSvcPct, format: (v:any) => v + '%', target: 40, ok: 40, warn: 60, isReverse: true,
      bands: '綠燈 ≤40%．黃燈 40–60%．紅燈 ＞60%',
      note: (v:any) => v <= 40 ? '每月還款壓力在合理範圍內' : v <= 60 ? `每月還款佔收入 ${v}%，偏高，留意是否有信用卡或信用貸款等高利率負債` : `每月還款佔收入 ${v}%，過高，建議優先檢視並償還高利率負債（如信用卡、信貸）`,
    },
    {
      name: '投資比例',
      desc: property > 0
        ? '投資資產 / 總資產，建議 20% 以上（房地產計入總資產，但不計入投資部位，有房產者數值會偏低）'
        : '投資資產 / 總資產，建議 20% 以上',
      val: Math.round(investRatio * 100), format: (v:any) => v + '%', target: 20, ok: 20, warn: 10, isReverse: false,
      bands: '綠燈 ≥20%．黃燈 10–20%．紅燈 ＜10%',
      note: (v:any) => v >= 20 ? '投資比例良好，複利累積中' : v >= 10 ? `投資比 ${v}%，尚可，逐步提高` : v === 0 ? '資金全在現金，複利未啟動' : `投資比 ${v}%，建議啟動配置`,
    },
  ];

  let t1=60, t2=30, t3=10, tier="月入 4–8萬";
  const m = income / 10000;
  if (m < 4) { t1 = 70; t2 = 20; tier = '月入 4萬以下'; }
  else if (m < 8) { t1 = 60; t2 = 30; tier = '月入 4–8萬'; }
  else if (m < 12) { t1 = 55; t2 = 35; tier = '月入 8–12萬'; }
  else if (m < 20) { t1 = 50; t2 = 40; tier = '月入 12–20萬'; }
  else { t1 = 45; t2 = 45; tier = '月入 20萬+'; }

  const a1 = income>0 ? Math.round((fixedExp / income) * 100) : 0;
  const a2 = income>0 ? Math.round((dca / income) * 100) : 0;
  const a3 = income>0 ? Math.round((insurance / income) * 100) : 0;

  const msgs = [];
  if (a1 > t1 + 5) msgs.push({ icon: '⚠️', text: `生活必需支出佔收入 ${a1}%，建議控制在 ${t1}% 以內`, color: 'text-alert-orange' });
  if (a2 < t2 * 0.6) msgs.push({ icon: '📉', text: `儲蓄理財比例 ${a2}%，建議提升至 ${t2}%，這是財富成長的關鍵`, color: 'text-alert-orange' });
  if (a2 >= t2) msgs.push({ icon: '✅', text: `儲蓄理財比例 ${a2}%，已達建議標準，繼續保持`, color: 'text-teal-base' });
  if (a3 > 15) msgs.push({ icon: '🔍', text: `保費佔收入 ${a3}%，偏高。建議檢視是否有重疊保單`, color: 'text-rose-500' });
  else if (a3 < 8 && insurance > 0) msgs.push({ icon: '🛡️', text: `保費佔收入 ${a3}%，偏低。現有保障是否足夠值得確認`, color: 'text-alert-orange' });
  else if (a3 >= 8 && a3 <= 15) msgs.push({ icon: '✅', text: `保費比例 ${a3}%，落在合理範圍`, color: 'text-teal-base' });
  else if (a3 === 0) msgs.push({ icon: '🛡️', text: `尚未填入保費。建議確認現有保障是否完整`, color: 'text-warm-gray-600' });

  if (msgs.length === 0) msgs.push({ icon: '✅', text: `整體配比接近建議水準，結構不錯`, color: 'text-teal-base' });

  let insightQ = '', insightCta = '';
  if (surplus <= 0) {
    insightQ = '你的固定支出已超過月收入。每個月都在消耗過去積累的資產。財務自由只會越來越遠。現在是認真檢視的時候了。';
    insightCta = '幫我看一下支出結構';
  } else if (dca === 0 && surplus > 0) {
    insightQ = `你每月有 ${fmt(surplus)} 元的結餘，但全部都停在帳戶裡。放著不動的錢，每年被通膨吃掉 2–3%。讓錢開始工作，才是第一步。`;
    insightCta = '尋找適合的定時定額';
  } else if (idle > 10000) {
    insightQ = `你每月有 ${fmt(idle)} 元的結餘在定時定額之外閒置。這筆錢現在在替你工作嗎？還是只是躺在帳戶等待機會？`;
    insightCta = '聊聊閒置資金配置';
  } else if (passive === 0 && surplus > 0) {
    insightQ = `你的收入，目前 100% 依賴自己的時間換來的。一旦停止工作，收入歸零。讓資產開始替你賺錢，才是真正的財務自由。`;
    insightCta = '聊聊開始建立被動收入';
  } else if (savRate < 15) {
    insightQ = `儲蓄率只有 ${savRate}%，賺 100 元只留 ${savRate} 元。支出結構有沒有可以調整的地方？通常第一步是找出最大的支出項目。`;
    insightCta = '幫我分析支出結構';
  } else if (efMonths < 3) {
    insightQ = `緊急預備金只剩約 ${Math.round(efMonths * 10) / 10} 個月。如果明天出現突發狀況，能撐多久？在投資之前，這個安全網應該優先補強。`;
    insightCta = '規劃緊急預備金策略';
  } else {
    insightQ = `你的財務結構有一定基礎。但錢放在哪裡、怎麼配置，決定了 10 年後你跟別人的財富差距。你的資產現在夠有效率嗎？`;
    insightCta = '聊聊如何讓資產更有效率';
  }

  const _shareText = [
    `📊 我的財務健檢｜OO SAY MONEY`,
    `━━━━━━━━━━━━━━━`,
    `整體評分：${score} 分（${status.replace(/^[^\s]+\s/, '')}）`,
    `淨資產：${fmt(netWorth)} 萬（總資產 ${fmt(totalAssets)} 萬－總負債 ${fmt(totalLiab)} 萬）`,
    `　現金 ${fmt(cash)} 萬｜投資 ${fmt(invest)} 萬｜房地產 ${fmt(property)} 萬`,
    `主動收入：${fmt(active)} 元／月`,
    `被動收入：${fmt(passive)} 元／月（覆蓋固定支出 ${passivePct}%）`,
    `每月固定支出：${fmt(fixedExp)} 元`,
    `每月定期定額：${fmt(dca)} 元`,
    `緊急預備金：${Math.round(efMonths*10)/10} 個月`,
    `負債比：${Math.round(liabRatio*100)}%`,
    `投資比例：${Math.round(investRatio*100)}%`,
    `━━━━━━━━━━━━━━━`,
    `想預約免費諮詢，請回覆此訊息 🙌`
  ].join('\n');

  const sendToLineOA = () => {
    const encoded = encodeURIComponent(_shareText);
    window.open(`https://line.me/R/oaMessage/@oosaymoney/?${encoded}`, '_blank');
  };

  if (screen === "choice") {
    return (
      <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col items-center justify-center pb-20 px-5 relative">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-cyan-soft/50 border border-teal-soft/80 px-4 py-1.5 rounded-full">
            <Ic n="trend" size={14} color="#0d9488" />
            <span className="text-[11px] font-bold text-teal-base tracking-widest uppercase">財務健康評估</span>
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 leading-snug tracking-wider">您的錢，<br/><span className="text-teal-base">有在替您工作嗎？</span></h1>
          <p className="text-[13px] text-warm-gray-800/80 tracking-wide font-normal">分 4 個步驟填入大概數字，就能產生個人化財務健檢報告。<br/>估算即可，不需要精確數字。</p>

          <div className="w-full flex flex-col gap-3 mt-2">
            {hasDraft && (
              <button onClick={continueDraft} className="w-full bg-cyan-soft/40 text-teal-base border border-teal-soft py-4 rounded-2xl text-[13px] font-bold tracking-widest cursor-pointer hover:bg-cyan-soft/60 transition-colors flex items-center justify-center gap-2">
                繼續上次填到一半的健檢 <Ic n="arrowRight" size={16} color="currentColor" />
              </button>
            )}
            <button onClick={startReal} className="w-full bg-teal-base text-white border border-teal-base py-5 rounded-2xl text-[14px] font-bold tracking-widest uppercase cursor-pointer hover:bg-cyan-base transition-colors flex items-center justify-center gap-2 shadow-md">
              {hasDraft ? "重新開始填寫" : "開始填寫我的健檢"} <Ic n="arrowRight" size={18} color="currentColor" />
            </button>
            <button onClick={startDemo} className="w-full bg-white text-warm-gray-700 border border-warm-gray-200 py-4 rounded-2xl text-[13px] font-medium tracking-widest cursor-pointer hover:bg-warm-gray-100 transition-colors">
              先看看範例報告長什麼樣子
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "wizard") {
    return (
      <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col items-center pb-28 relative">
        <div className="bg-white border-b border-warm-gray-200 w-full pt-12 pb-6 px-6 sticky top-0 z-30 shrink-0">
          <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
            <div className="text-[12px] font-medium tracking-widest text-warm-gray-800 bg-warm-gray-50 rounded-2xl border border-warm-gray-200 px-4 py-2">
              第 {wizardStep + 1} 步 <span className="text-warm-gray-300 mx-1">/</span> {WIZARD_TITLES.length} · {WIZARD_TITLES[wizardStep]}
            </div>
            <div className="flex gap-2 w-full">
              {WIZARD_TITLES.map((_, i) => (
                <div key={i} className={`h-[3px] flex-1 rounded-full overflow-hidden relative ${i < wizardStep ? 'bg-teal-base' : 'bg-[#D6D3D1]'}`}>
                  {i === wizardStep && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-teal-base" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 w-full max-w-sm mx-auto relative z-10 pt-6 flex flex-col gap-6">

          {wizardStep === 0 && (
            <div className="bg-white border border-warm-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-warm-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider">第一部分 · 資產概況</div>
                </div>
                <div className="text-[12px] text-warm-gray-600 font-normal">填入大約金額（單位：萬元）</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="text-[12px] font-bold tracking-widest text-teal-base uppercase pb-1 border-b border-warm-gray-100 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-base"/> 資產</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputBox label="現金存款" hint="活存、定存" value={data.a_cash} onChange={(e:any)=>set("a_cash",e.target.value)} unit="萬" />
                  <InputBox label="投資部位" hint="股票、基金" value={data.a_invest} onChange={(e:any)=>set("a_invest",e.target.value)} unit="萬" />
                  <div className="col-span-2">
                    <InputBox label="房地產估值" hint="自住與投資市值" value={data.a_property} onChange={(e:any)=>set("a_property",e.target.value)} unit="萬" />
                  </div>
                </div>

                <div className="text-[12px] font-bold tracking-widest text-rose-500 uppercase pb-1 border-b border-warm-gray-100 flex items-center gap-2 mt-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"/> 負債</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputBox label="房貸餘額" value={data.l_mortgage} onChange={(e:any)=>set("l_mortgage",e.target.value)} unit="萬" />
                  <InputBox label="其他負債" hint="信貸、信卡" value={data.l_other} onChange={(e:any)=>set("l_other",e.target.value)} unit="萬" />
                </div>

                <div className="flex bg-warm-gray-50 rounded-xl p-4 gap-4 mt-2">
                  <div className="flex-1">
                    <div className="text-[10px] tracking-widest text-warm-gray-600 mb-1 font-medium">淨資產</div>
                    <div className={`text-[18px] font-serif font-bold ${netWorth>=0?'text-teal-base':'text-rose-500'}`}>{fmt(netWorth)}<span className="text-[11px] font-normal ml-1">萬</span></div>
                  </div>
                </div>

                {wanWarnFields.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed">
                    ⚠️「{wanWarnFields.map(f => f.label).join('、')}」填入的數字看起來非常大，這裡的單位是「萬元」，是否不小心把「元」當成「萬」填了？請確認一下。
                  </div>
                )}
              </div>
            </div>
          )}

          {wizardStep === 1 && (
            <div className="bg-white border border-warm-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-warm-gray-200">
                <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider">第二部分 · 每月收入</div>
                <div className="text-[12px] text-warm-gray-600 font-normal mt-2">薪水、股息、租金等（單位：元）</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputBox label="主動收入" hint="薪水、獎金等" value={data.i_active} onChange={(e:any)=>set("i_active",e.target.value)} unit="元" />
                  <InputBox label="被動收入" hint="股息、租金等" value={data.i_passive} onChange={(e:any)=>set("i_passive",e.target.value)} unit="元" highlight />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="bg-white border border-warm-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-warm-gray-200">
                <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider">第三部分 · 每月固定支出</div>
                <div className="text-[12px] text-warm-gray-600 font-normal mt-2">每個月固定要付的錢（單位：元）</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="text-[12px] font-bold tracking-widest text-alert-orange uppercase pb-1 border-b border-warm-gray-100 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-alert-orange"/> 固定支出</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputBox label="生活費" hint="飲食、娛樂" value={data.e_living} onChange={(e:any)=>set("e_living",e.target.value)} unit="元" />
                  <InputBox label="住居費" hint="房租/房貸" value={data.e_housing} onChange={(e:any)=>set("e_housing",e.target.value)} unit="元" />
                  <InputBox label="債務月付" hint="車、信貸" value={data.e_debt} onChange={(e:any)=>set("e_debt",e.target.value)} unit="元" />
                  <InputBox label="保費" hint="年繳÷12" value={data.e_insurance} onChange={(e:any)=>set("e_insurance",e.target.value)} unit="元" />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="bg-white border border-warm-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-warm-gray-200">
                <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider">第四部分 · 定期定額與總覽</div>
                <div className="text-[12px] text-warm-gray-600 font-normal mt-2">最後一步，順便看看目前的收支總覽</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col bg-cyan-soft/10 border border-teal-soft/80 p-4 rounded-xl">
                  <div className="text-[12px] font-bold tracking-widest text-[#7c3aed] uppercase pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"/> 定時定額 / 投資存錢
                  </div>
                  <InputBox label="每月投資" hint="基金、ETF定存" value={data.e_dca} onChange={(e:any)=>set("e_dca",e.target.value)} unit="元" highlight />
                </div>

                <div className="bg-white border-2 border-warm-gray-100 rounded-2xl p-5 mt-2 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-warm-gray-50">
                    <span className="text-[13px] font-medium text-warm-gray-800 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-base" />主動收入</span>
                    <span className="text-[14px] font-serif font-bold text-teal-base">+ {fmt(active)} 元</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-warm-gray-50">
                    <span className="text-[13px] font-medium text-warm-gray-800 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />被動收入</span>
                    <span className={`text-[14px] font-serif font-bold ${passive > 0 ? 'text-[#7c3aed]' : 'text-warm-gray-400'}`}>{passive > 0 ? `+ ${fmt(passive)} 元` : '尚未填入'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-cyan-soft/40 px-3 py-2 rounded-lg -mx-1">
                    <span className="text-[12px] font-bold text-warm-gray-600">月收入合計</span>
                    <span className="text-[15px] font-serif font-bold text-teal-base">+ {fmt(income)} 元</span>
                  </div>

                  <div className="h-1" />

                  <div className="flex justify-between items-center pb-2 border-b border-warm-gray-50">
                    <span className="text-[13px] font-medium text-warm-gray-800 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-alert-orange" />固定支出合計</span>
                    <span className="text-[14px] font-serif font-bold text-alert-orange">- {fmt(fixedExp)} 元</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 pb-3 border-b-2 border-warm-gray-100">
                    <span className="text-[14px] font-bold text-warm-gray-800">月結餘</span>
                    <span className={`text-[18px] font-serif font-bold ${surplus>=0?'text-teal-base':'text-rose-500'}`}>{surplus>=0?'':'-'}{fmt(Math.abs(surplus))} 元 <span className={`text-[13px] font-bold ml-1 ${surplus>=0?'text-teal-base':'text-rose-500'}`}>({savRate}%)</span></span>
                  </div>

                  <div className="h-2" />

                  <div className="flex justify-between items-center bg-[#f5f3ff] px-3 py-2 rounded-lg -mx-1">
                    <span className="text-[12px] font-bold text-[#7c3aed] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />定時定額 (從結餘撥出) <span className="bg-[#ede9fe] text-[#7c3aed] px-1.5 py-0.5 rounded text-[10px] font-bold ml-1 hidden sm:inline-block">主動理財</span>
                    </span>
                    <span className={`text-[14px] font-serif font-bold ${dca > 0 ? 'text-[#7c3aed]' : 'text-warm-gray-400'}`}>{dca > 0 ? `- ${fmt(dca)} 元` : '尚未設定'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[13px] font-medium text-warm-gray-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warm-gray-300" />閒置結餘 (尚未配置)</span>
                    <span className={`text-[14px] font-serif font-bold ${idle>=0?'text-warm-gray-500':'text-rose-500'}`}>{idle>=0 ? `${fmt(idle)} 元` : `⚠️ 超支 ${fmt(Math.abs(idle))} 元`}</span>
                  </div>
                </div>

                {/* 理財動能卡 */}
                <div className="bg-[#f5f3ff] border border-[#d8b4fe] rounded-2xl p-5 mt-2 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-[80px] -mt-6">📈</div>
                  <div className="flex items-center gap-4 relative z-10 w-full">
                    <div className="text-[28px] shrink-0">📈</div>
                    <div className="flex-1 text-left">
                      <div className="text-[13px] font-bold text-[#7c3aed] mb-1">理財動能</div>
                      <div className="text-[12px] text-[#6d28d9] leading-relaxed">{momTxt}</div>
                    </div>
                    <div className="text-[26px] font-serif font-bold text-[#7c3aed] tracking-tight whitespace-nowrap shrink-0">{momPct}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-gray-200 px-5 py-4 flex gap-3 max-w-[430px] mx-auto z-40">
          <button onClick={prevWizardStep} className="flex-1 bg-white text-warm-gray-700 border border-warm-gray-200 py-4 rounded-2xl text-[13px] font-bold tracking-widest uppercase cursor-pointer hover:bg-warm-gray-50 transition-colors">
            上一步
          </button>
          <button onClick={nextWizardStep} className="flex-[2] bg-teal-base text-white border border-teal-base py-4 rounded-2xl text-[13px] font-bold tracking-widest uppercase cursor-pointer hover:bg-cyan-base transition-colors flex items-center justify-center gap-2">
            {wizardStep === WIZARD_TITLES.length - 1 ? '產生健檢報告' : '下一步'} <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  // --- 健檢結果（screen === "report"，維持單頁滑動閱讀，不拆步驟） ---
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col items-center pb-20 relative">
      <div className="bg-white border-b border-warm-gray-200 w-full pt-12 pb-6 px-6 sticky top-0 z-30 shrink-0 shadow-sm">
        <div className="max-w-sm mx-auto flex items-center justify-center">
          <div className="text-[14px] font-medium tracking-widest text-warm-gray-800 uppercase">財務健檢結果</div>
        </div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10 pt-6 flex flex-col gap-6">

        {isDemo && (
          <div className="bg-[#0369a1] text-white p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
            <div className="text-[12px] font-medium leading-relaxed">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-widest mr-2 uppercase">範例報告</span>
              以下顯示的是「月薪 8 萬」的示例數據，不是您的真實狀況。
            </div>
            <button onClick={startReal} className="bg-white text-[#0284c7] font-bold text-[12px] py-2.5 px-4 rounded-xl shadow-sm text-center tracking-widest uppercase cursor-pointer hover:bg-cyan-50">
              填入我的數字，產生真實報告
            </button>
          </div>
        )}

        {/* Floating / Hero Score */}
        <div className="bg-white border border-warm-gray-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-md relative overflow-hidden">
          <div className="text-[11px] font-bold text-warm-gray-600 tracking-widest uppercase mb-1">初步財務健康評估</div>
          <div className={`text-[64px] font-serif font-bold leading-none tracking-tight mb-2 ${colorClass}`}>
            {score}
          </div>
          <div className="text-[11px] text-warm-gray-500 font-medium tracking-widest mb-6 border-b border-warm-gray-100 pb-4">估算區間 {Math.max(0,score-8)} - {Math.min(100,score+8)}</div>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[13px] tracking-widest border ${borderClass} ${bgClass} ${colorClass} mb-2`}>
            {status}
          </div>
          <div className="text-[12px] text-warm-gray-600 font-normal tracking-wide leading-relaxed">{sub}</div>

          <div className="text-[10px] text-warm-gray-400 font-normal tracking-wide leading-relaxed mt-4 pt-4 border-t border-warm-gray-100 w-full">
            評分由「收支比、緊急預備金、負債比、投資比例」四項加權估算，僅供初步參考，不構成正式財務或投資建議。
          </div>
        </div>

        {/* 資產總覽 */}
        <div className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-warm-gray-500 font-medium mb-1 tracking-wide">總資產</div>
            <div className="text-[15px] font-serif font-bold text-warm-gray-800">{fmt(totalAssets)}<span className="text-[10px] font-normal ml-0.5">萬</span></div>
          </div>
          <div className="border-x border-warm-gray-100">
            <div className="text-[10px] text-warm-gray-500 font-medium mb-1 tracking-wide">總負債</div>
            <div className="text-[15px] font-serif font-bold text-warm-gray-800">{fmt(totalLiab)}<span className="text-[10px] font-normal ml-0.5">萬</span></div>
          </div>
          <div>
            <div className="text-[10px] text-warm-gray-500 font-medium mb-1 tracking-wide">淨資產</div>
            <div className={`text-[15px] font-serif font-bold ${netWorth>=0?'text-teal-base':'text-rose-500'}`}>{fmt(netWorth)}<span className="text-[10px] font-normal ml-0.5">萬</span></div>
          </div>
        </div>

        {!isDemo && filledFieldsCount < TOTAL_FIELDS && (
          <div className="bg-warm-gray-100 border border-warm-gray-200 rounded-xl px-4 py-3 text-[11px] text-warm-gray-600 leading-relaxed">
            已填寫 {filledFieldsCount} / {TOTAL_FIELDS} 項資料，其餘欄位計算時以 0 處理，實際狀況可能有落差。
          </div>
        )}

        {/* 弱點提示 */}
        <div className={`border ${isWeakGood ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-[#fffdf5]'} rounded-xl p-5 flex items-start gap-4 shadow-sm`}>
          <div className="text-[20px] pt-0.5">{weakest.icon}</div>
          <div>
            <div className="text-[11px] font-bold text-warm-gray-600 uppercase tracking-widest mb-1.5">最值得關注</div>
            <div className="text-[13px] font-medium text-warm-gray-800 leading-relaxed">{isWeakGood ? weakest.strong : weakest.weak}</div>
          </div>
        </div>

        {/* 健檢結果 GRID */}
        <div>
          <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider mb-4 pl-2">您的財務體質</div>
          <div className="flex flex-col gap-3">
            {METRICS.map((m: any, i: number) => {
              const val = m.val;
              const isR = m.isReverse;
              const isOk = isR ? val <= m.ok : val >= m.ok;
              const isWarn = isR ? val <= m.warn : val >= m.warn;
              const c = isOk ? 'teal-base' : isWarn ? 'alert-orange' : 'rose-500';
              const bg = isOk ? 'bg-cyan-soft/30' : isWarn ? 'bg-alert-orange/10' : 'bg-rose-50';
              const textC = isOk ? 'text-teal-base' : isWarn ? 'text-alert-orange' : 'text-rose-500';
              const lbl = isOk ? '良好' : isWarn ? '注意' : '警示';
              const barPct = isR ? Math.max(0, Math.min(100, 100 - (val/80*100))) : Math.min(100, val/(m.ok*1.5)*100);

              return (
                <div key={i} className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[14px] font-bold text-warm-gray-800 mb-0.5">{m.name}</div>
                      <div className="text-[11px] text-warm-gray-500 tracking-wide">{m.desc}</div>
                    </div>
                    <div className={`text-[11px] font-bold tracking-widest px-2.5 py-1 rounded border border-${c}/30 ${bg} ${textC}`}>{lbl}</div>
                  </div>
                  <div className="h-1.5 w-full bg-warm-gray-100 rounded-full mb-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 bg-${c}`} style={{width:`${barPct}%`}} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[11px] text-warm-gray-500">目前：<span className={`font-bold ${textC} text-[13px] ml-1`}>{m.format(val)}</span></div>
                    <div className={`text-[10px] font-medium tracking-wide text-right w-[160px] ${textC}`}>{m.note(val)}</div>
                  </div>
                  {m.bands && (
                    <div className="text-[9px] text-warm-gray-400 tracking-wide mt-2 pt-2 border-t border-warm-gray-50 text-right">{m.bands}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 建議配比 */}
        <div className="bg-white border border-warm-gray-200 rounded-2xl p-6 shadow-sm mt-2">
          <div className="inline-flex items-center gap-1.5 border border-warm-gray-200 px-3 py-1 rounded uppercase tracking-widest text-[10px] font-bold text-warm-gray-600 mb-4">
            收支配比
          </div>
          <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider mb-2">收入應該怎麼分配？</div>
          <div className="text-[12px] text-warm-gray-600 leading-loose mb-6">根據您的收入水準，自動推薦最適配比。為動態調整，並非固定 631 原則。</div>
          
          <div className="text-[11px] font-bold tracking-widest text-warm-gray-500 mb-2 uppercase">{tier} 建議</div>
          <div className="h-2.5 flex rounded-full overflow-hidden mb-4">
            <div className="bg-teal-base flex items-center justify-center text-[9px] text-white font-bold" style={{width:`${t1}%`}}>{t1}%</div>
            <div className="bg-[#0284c7] flex items-center justify-center text-[9px] text-white font-bold" style={{width:`${t2}%`}}>{t2}%</div>
            <div className="bg-[#7c3aed] flex items-center justify-center text-[9px] text-white font-bold" style={{width:`${t3}%`}}>{t3}%</div>
          </div>
          <div className="flex gap-4 flex-wrap mb-4">
            <div className="text-[11px] text-warm-gray-600 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-base"/>生活 {t1}% ≈ {income>0?fmt(Math.round(income*t1/100)):0}</div>
            <div className="text-[11px] text-warm-gray-600 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0284c7]"/>理財 {t2}% ≈ {income>0?fmt(Math.round(income*t2/100)):0}</div>
            <div className="text-[11px] text-warm-gray-600 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#7c3aed]"/>保費 {t3}% ≈ {income>0?fmt(Math.round(income*t3/100)):0}</div>
          </div>

          <div className="bg-warm-gray-50 border border-warm-gray-200 p-4 rounded-xl">
             <div className="text-[11px] font-bold text-warm-gray-800 tracking-widest mb-3 uppercase border-b border-warm-gray-200 pb-2">檢視您的配比</div>
             <div className="flex flex-col gap-2.5">
               {msgs.map((m,i)=>(
                 <div key={i} className={`flex items-start gap-2.5 text-[12px] font-medium tracking-wide ${m.color}`}>
                   <span className="shrink-0">{m.icon}</span> <span>{m.text}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* 財務自由指標 */}
        <div className="bg-white border border-warm-gray-200 rounded-2xl p-6 shadow-sm mt-2">
          <div className="flex items-center justify-between space-y-0 pb-2 mb-4">
            <div>
              <div className="text-[11px] font-bold text-warm-gray-500 uppercase tracking-widest mb-1">財務自由指標</div>
              <div className="text-[16px] font-serif font-bold text-warm-gray-800">{passiveTitle}</div>
            </div>
            <div className={`text-[28px] font-serif font-bold tracking-tight ${passiveColor}`}>{passivePct}%</div>
          </div>
          
          <div className="h-2.5 bg-warm-gray-100 rounded-full overflow-hidden mb-3 relative">
            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-black/10 z-10" />
            <div className="h-full rounded-full transition-all duration-700 bg-current" style={{width: `${cappedPassivePct}%`, color: passiveColor.replace('text-', '') === 'warm-gray-400' ? '#9ca3af' : passiveColor.replace('text-', '') === 'teal-base' ? '#0d9488' : '#d97706'}} />
          </div>
          
          <div className="flex justify-between text-[10px] text-warm-gray-500 mb-4">
            <span>0%</span>
            <span className="font-bold text-teal-base tracking-wide">目標 100%（財務自由基礎）</span>
          </div>
          
          <div className={`text-[12px] font-medium leading-relaxed p-3 rounded-xl ${passiveBg} ${passiveMsgColor}`}>
            {passiveMsg}
          </div>
        </div>

        {/* 顧問觀察 Insight Card */}
        <div className="bg-gradient-to-br from-[#0c2b27] to-[#134e4a] rounded-3xl p-8 relative overflow-hidden mt-4 shadow-lg text-white">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#6ee7b7] border border-[#6ee7b7]/30 px-3 py-1 rounded uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7]" /> 顧問觀察
          </div>
          <div className="text-[15px] font-medium leading-loose tracking-wide mb-8">
            {insightQ}
          </div>
          <button onClick={() => window.open('https://line.me/R/ti/p/@oosaymoney', '_blank')} className="bg-[#14b8a6] hover:bg-[#6ee7b7] text-[#0c2b27] transition-colors py-3.5 px-6 rounded-xl text-[13px] font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-sm w-full justify-center">
            {insightCta} <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>

        {/* Locked Modules */}
        <div>
          <div className="text-[16px] font-serif font-bold text-warm-gray-800 tracking-wider mb-4 pl-2 mt-4">預約完整諮詢，解鎖更多分析</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
              <div className="absolute inset-0 bg-warm-gray-50/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4">
                <div className="text-[20px] mb-2">🛡️</div>
                <div className="text-[12px] font-bold text-warm-gray-800 mb-1">保障缺口分析</div>
                <div className="text-[10px] text-warm-gray-600 leading-relaxed">醫療、失能保障夠嗎？完整評估。</div>
              </div>
            </div>
            <div className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
               <div className="absolute inset-0 bg-warm-gray-50/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4">
                <div className="text-[20px] mb-2">📊</div>
                <div className="text-[12px] font-bold text-warm-gray-800 mb-1">資產配置建議</div>
                <div className="text-[10px] text-warm-gray-600 leading-relaxed">根據您的風險屬性，量身規劃比例。</div>
              </div>
            </div>
          </div>
        </div>

        {/* 傳送財務資料給顧問 */}
        <div className="bg-white border border-warm-gray-200 rounded-2xl p-6 shadow-sm mt-4 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-teal-base uppercase tracking-widest mb-1.5">傳送財務資料給顧問</div>
            <div className="text-[13px] text-warm-gray-800 leading-relaxed mb-4">
              按下按鈕，LINE 對話會直接開啟，<strong>健檢摘要已預填好</strong>——您只需按一下「送出」，顧問就能在預約前先了解您的狀況。
            </div>
            <button onClick={sendToLineOA} className="bg-[#06c755] hover:bg-[#04a847] text-white transition-all transform hover:-translate-y-0.5 py-3 px-6 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(6,199,85,0.25)] flex items-center gap-2">
              <Ic n="arrowRight" size={16} color="currentColor" />一鍵傳送財務摘要
            </button>
          </div>
          <div className="flex-1 md:max-w-xs">
             <div className="text-[11px] font-bold text-warm-gray-500 uppercase tracking-widest mb-2">傳送內容預覽</div>
             <pre className="bg-warm-gray-50 border border-warm-gray-200 rounded-xl p-4 text-[11px] text-warm-gray-500 max-h-[160px] overflow-y-auto whitespace-pre-wrap font-mono leading-loose">
               {_shareText}
             </pre>
          </div>
        </div>
        
        <div className="h-4" />
      </div>
    </div>
  );
};
