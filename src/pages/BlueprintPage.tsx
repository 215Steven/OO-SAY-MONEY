import { motion, AnimatePresence } from "motion/react";
import { TopBar, PageHeader, SectionLabel, CtaBlock, Reveal, SPRING } from "@/src/components/ui";
import { openLine, LINE_BOOK_URL } from "@/src/constants/links";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// -- Computation Logic --
function getChartData(p: number, r: number, m: number, mo: number) {
  const data = [];
  const divRate = r / 100;
  
  let a100 = p * 10000;
  let a50 = p * 10000;
  let a30 = p * 10000;
  let a0 = p * 10000;

  data.push({ 
    year: 0, yearStr: '第0年', 
    p100: a100 * divRate / 12, 
    p50: a50 * divRate / 12, 
    p30: a30 * divRate / 12, 
    p0: a0 * divRate / 12 
  });

  for (let y = 1; y <= 20; y++) {
    for (let month = 1; month <= 12; month++) {
      const globalMonth = (y - 1) * 12 + month;
      const add = globalMonth <= mo ? m : 0;
      
      const div100 = a100 * divRate / 12;
      const div50 = a50 * divRate / 12;
      const div30 = a30 * divRate / 12;
      const div0 = a0 * divRate / 12;

      a100 += div100 * 1.0 + add;
      a50 += div50 * 0.5 + add;
      a30 += div30 * 0.3 + add;
      a0 += div0 * 0.0 + add;
    }
    data.push({ 
      year: y, yearStr: `第${y}年`, 
      p100: a100 * divRate / 12, 
      p50: a50 * divRate / 12, 
      p30: a30 * divRate / 12, 
      p0: a0 * divRate / 12 
    });
  }
  return data;
}

function calcZeroPoint(principalWan: number, monthlyAdd: number, rate: number) {
  if (!monthlyAdd || monthlyAdd <= 0) return null;
  let asset = principalWan * 10000;
  const divRate = rate / 100;
  for (let m = 1; m <= 600; m++) {
    const div = asset * divRate / 12;
    if (div >= monthlyAdd) return m;
    asset += div;
  }
  return null;
}

function fmtFull(n: number) {
  n = Math.round(n);
  if (n >= 100000000) return '$' + (n/100000000).toFixed(1) + '億';
  if (n >= 10000) return '$' + (n/10000).toFixed(n>=1000000?1:0) + '萬';
  return '$' + n.toLocaleString();
}

const Slider = ({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) => (
  <label className="block">
    <span className="flex items-baseline justify-between mb-3">
      <span className="text-[13px] tracking-[0.18em] text-warm-gray-600">{label}</span>
      <span className="font-display text-[22px] font-medium text-forest tnum">{display}</span>
    </span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#B8793A]" />
  </label>
);

export const BlueprintPage = ({ onBack, role }: { onBack: () => void, role?: string | null }) => {
  const [p, setP] = useState(50);
  const [r, setR] = useState(8);
  const [m, setM] = useState(3000);
  const [mo, setMo] = useState(96);
  const [t, setT] = useState(10000);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const chartData = useMemo(() => getChartData(p, r, m, mo), [p, r, m, mo]);
  const zeroPoint = useMemo(() => calcZeroPoint(p, m, r), [p, m, r]);
  
  const zYear = zeroPoint ? Math.floor(zeroPoint / 12) : 0;
  const zMonth = zeroPoint ? zeroPoint % 12 : 0;

  const totalInvest = p * 10000 + m * mo;
  const firstMonth = p * 10000 * (r / 100) / 12;

  const finalVals = chartData[chartData.length - 1];

  const presets = [
    { label: "小資啟動", p: 50, r: 8, m: 3000, mo: 96, t: 10000 },
    { label: "中階穩健", p: 150, r: 8, m: 7000, mo: 96, t: 20000 },
    { label: "高規資產", p: 300, r: 8, m: 15000, mo: 96, t: 50000 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setP(preset.p); setR(preset.r); setM(preset.m); setMo(preset.mo); setT(preset.t);
  };

  const [activePreset, setActivePreset] = useState(0);
  const faqs = [
    { q: "為什麼規劃都先抓8年？", a: "經歷一次完整的經濟循環約需 7 到 10 年，8 年能讓複利效應穩定發揮，平滑短期波動，是檢視「現金流成長」最理想的區間。" },
    { q: "配息只是左手換右手？", a: "數學上是，但心理學上不是。現金流提供極大安全感，讓你市場大跌時不會恐慌賣出。" },
    { q: "通膨會不會吃掉配息？", a: "會，所以強烈建議「至少將 30% 配息再投入」，讓本金跟著長大，未來配息就能抵抗通膨。" },
    { q: "遇到股災大跌怎麼辦？", a: "股災時淨值跌，但只要企業獲利，配息依然發放。這時定期定額能買到更多便宜單位數，加速累積。" },
  ];

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <TopBar />
      <PageHeader
        eyebrow="Cash-flow blueprint"
        line1="花不完，"
        line2="只會越來越多。"
        desc="投資從來不是數學考試，而是一場心理戰。用「本金 + 定期定額 + 配息再投入」，建立一套能讓你安心睡覺的被動收入系統。"
      />

      {/* 試算器 */}
      <section className="px-6">
        <SectionLabel no="01">現金流雙引擎試算</SectionLabel>
        <div className="border-t border-warm-gray-800/80 pt-6">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {presets.map((pr, i) => (
              <button key={i} onClick={() => { applyPreset(pr); setActivePreset(i); }} aria-pressed={activePreset === i}
                className={`shrink-0 px-4 py-2 rounded-full text-[13px] tracking-[0.12em] cursor-pointer border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 ${activePreset === i ? "bg-forest text-white border-forest" : "border-warm-gray-300 text-warm-gray-800 hover:bg-warm-gray-100"}`}>
                {pr.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-7">
            <Slider label="初始本金" value={p} display={`${p} 萬`} min={0} max={1000} step={10} onChange={setP} />
            <Slider label="年化配息率" value={r} display={`${r}%`} min={1} max={15} step={0.5} onChange={setR} />
            <Slider label="每月定額" value={m} display={`${m.toLocaleString()} 元`} min={0} max={100000} step={1000} onChange={setM} />
            <Slider label="持續期數" value={mo} display={`${mo} 月`} min={0} max={240} step={12} onChange={setMo} />
            <div className="pt-6 border-t border-warm-gray-300">
              <Slider label="目標月配息" value={t} display={`${t.toLocaleString()} 元`} min={5000} max={200000} step={5000} onChange={setT} />
            </div>
          </div>

          <div className="grain relative mt-9 rounded-[24px] bg-forest text-white overflow-hidden px-6 py-7 grid grid-cols-2 gap-6">
            <div className="relative z-10">
              <div className="text-[12px] tracking-[0.2em] text-white/55 mb-2">總投入本金</div>
              <div className="font-display text-[26px] font-medium tnum">{fmtFull(totalInvest)}</div>
            </div>
            <div className="relative z-10">
              <div className="text-[12px] tracking-[0.2em] text-white/55 mb-2">首月配息預估</div>
              <div className="font-display text-[26px] font-medium tnum text-brass-soft">{fmtFull(firstMonth)}</div>
            </div>
          </div>

          {zeroPoint && m > 0 && (
            <p className="mt-5 text-[13px] text-warm-gray-600 leading-[1.95] border-l-2 border-brass pl-4">
              若配息全額再投入，<strong className="text-warm-gray-800 font-medium">在{zYear > 0 ? ` 第 ${zYear} 年` : ""}{zMonth > 0 ? ` ${zMonth} 個月` : ""}</strong>時，每月配息將超過 {m.toLocaleString()} 元，屆時可直接用配息支付定期定額。
            </p>
          )}
        </div>
      </section>

      {/* 圖表 */}
      <Reveal className="px-6 pt-14">
        <SectionLabel no="02">20 年月配息成長曲線</SectionLabel>
        <div className="border-t border-warm-gray-800/80 pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-[12px] text-warm-gray-600 tracking-[0.1em]">
            <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-forest" />100% 投入</span>
            <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-brass" />50%</span>
            <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-warm-gray-400" />30%</span>
            <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-warm-gray-200" />0%</span>
            <span className="flex items-center gap-2"><span className="w-4 border-t border-dashed border-warm-gray-800" />目標</span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#DDD4C1" />
                <XAxis dataKey="yearStr" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7F7766" }} minTickGap={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7F7766" }} tickFormatter={(v) => (v >= 10000 ? `$${v / 10000}w` : `$${v}`)} />
                <Tooltip
                  formatter={(value: number, name: string) => [`$${Math.round(value).toLocaleString()}`, name]}
                  labelStyle={{ fontSize: 11, fontWeight: 500, color: "#14231E", marginBottom: 6 }}
                  itemStyle={{ fontSize: 11 }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #DDD4C1", boxShadow: "none", backgroundColor: "#F4EFE5", padding: "10px 12px" }}
                />
                <ReferenceLine y={t} stroke="#14231E" strokeDasharray="4 4" strokeWidth={1} />
                <Line type="monotone" dataKey="p100" name="100%" stroke="#0F3D33" strokeWidth={2.25} dot={false} />
                <Line type="monotone" dataKey="p50" name="50%" stroke="#B8793A" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="p30" name="30%" stroke="#A99E88" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="p0" name="0%" stroke="#DDD4C1" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-3 border-y border-warm-gray-300 divide-x divide-warm-gray-300">
            {[
              { l: "100% 投入", v: finalVals.p100, c: "text-forest" },
              { l: "50% 投入", v: finalVals.p50, c: "text-brass" },
              { l: "30% 投入", v: finalVals.p30, c: "text-warm-gray-600" },
            ].map((x, i) => (
              <div key={x.l} className={`py-4 ${i === 0 ? "pr-3" : "px-3"}`}>
                <div className="text-[12px] text-warm-gray-500 tracking-[0.1em] mb-1.5">{x.l}</div>
                <div className={`font-display text-[18px] font-medium tnum ${x.c}`}>{fmtFull(x.v)}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-warm-gray-500 leading-[1.9]">以上為依你設定的假設所做的試算，並非對未來報酬的預測或保證。</p>
        </div>
      </Reveal>

      {/* 觀念 */}
      <section className="px-6 pt-20">
        <Reveal>
          <SectionLabel no="03">心理學與現金流</SectionLabel>
          <h2 className="font-serif text-[30px] leading-[1.35] font-semibold text-warm-gray-800">人不是機器，<br />投資需要<span className="text-brass">心理學</span></h2>
          <p className="mt-5 text-[15px] leading-[1.95] text-warm-gray-600">只要月配息能覆蓋生活支出，你就從「被迫工作」變成「選擇工作」。配息能讓人感覺資產真的在幫自己工作。</p>
        </Reveal>
        <div className="mt-8 border-t border-warm-gray-800/80">
          {[
            { k: "01", t: "現金流的地板", h: "無論漲跌，每月穩定入帳", d: "這份確定性就是最大的資產。帳戶每月看到現金，就算市場大跌，心理也有底。" },
            { k: "02", t: "行為模式改變", h: "從被動轉化為主動存錢", d: "每當配息入帳就觸發再投入的習慣，加速資產累積，形成正向飛輪。" },
          ].map((x, i) => (
            <Reveal key={x.k} delay={i * 0.05}>
              <div className="py-7 border-b border-warm-gray-300">
                <div className="flex items-baseline gap-4 mb-2"><span className="font-display text-[13px] tnum text-brass">{x.k}</span><span className="text-[12px] tracking-[0.12em] text-warm-gray-600">{x.t}</span></div>
                <div className="font-serif text-[20px] font-semibold text-warm-gray-800 pl-[2.1rem]">{x.h}</div>
                <p className="mt-2 text-[14px] text-warm-gray-600 leading-[1.9] pl-[2.1rem]">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 摩擦成本 */}
      <section className="px-6 pt-20">
        <Reveal>
          <SectionLabel no="04">投資的摩擦成本</SectionLabel>
          <p className="text-[15px] leading-[1.95] text-warm-gray-600">能夠讓你長期抱得住、睡得著的投資，是需要付出摩擦成本的。</p>
        </Reveal>
        <div className="mt-6 grid gap-3">
          {[
            { t: "極致現金流型", h: "殖利率 8–10%+", d: "例如高股息 ETF。用最快速度達到轉折點，滿足每月開銷，但多頭市場時總報酬可能落後。" },
            { t: "總報酬成長型", h: "殖利率 3–6%", d: "例如市值型 ETF。配息來自企業獲利，淨值長期向上，但初期現金流較少。" },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.05}>
              <div className="rounded-3xl border border-warm-gray-300 p-6">
                <div className="text-[12px] tracking-[0.12em] text-brass mb-2">{x.t}</div>
                <div className="font-display text-[24px] font-medium text-forest mb-2">{x.h}</div>
                <p className="text-[13px] text-warm-gray-600 leading-[1.9]">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-warm-gray-500 leading-[1.9]">殖利率為情境舉例，實際配息會變動且可能來自本金，投資前請詳閱公開說明書。</p>
      </section>

      {/* 雪球公式 */}
      <Reveal className="px-6 pt-20">
        <SectionLabel no="05">現金流雪球公式</SectionLabel>
        <div className="grain relative rounded-[24px] bg-forest text-white overflow-hidden px-6 py-8 text-center">
          <div className="relative z-10 font-serif text-[20px] leading-[1.9] font-medium">
            (本金 <span className="text-brass-soft">+</span> 持續定額)<br /><span className="text-brass-soft">×</span> 配息率 <span className="text-brass-soft">×</span> 再投入比例
          </div>
        </div>
        <div className="mt-2 border-b border-warm-gray-300">
          {[
            { n: "100%", t: "全數滾入", d: "累積期首選，讓雪球呈指數型成長的路徑。" },
            { n: "30%", t: "部分滾入", d: "兼顧當下與未來，部分改善生活，部分把雪球做大。" },
          ].map((x) => (
            <div key={x.n} className="flex items-start gap-5 py-6 border-t border-warm-gray-300">
              <div className="font-display text-[28px] font-light text-brass-light tnum w-[84px] shrink-0 leading-none">{x.n}</div>
              <p className="text-[14px] text-warm-gray-600 leading-[1.9]"><span className="text-warm-gray-800 font-medium">{x.t}：</span>{x.d}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* FAQ */}
      <section className="px-6 pt-20">
        <SectionLabel no="06">常見迷思</SectionLabel>
        <div className="border-t border-warm-gray-800/80">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border-b border-warm-gray-300">
                <button onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 py-6 text-left cursor-pointer outline-none focus-visible:bg-warm-gray-100">
                  <span className="font-serif text-[18px] font-semibold text-warm-gray-800 tracking-wide">{faq.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={SPRING} className="text-[22px] text-brass leading-none">+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="pb-6 text-[14px] text-warm-gray-600 leading-[1.95]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBlock
        title="「花不完」是紀律的產物"
        desc="不用等存夠大筆錢，設定好每月投入計畫，選定會成長的標的，讓複利開始計時。"
        primary="在 LINE 設定我的現金流引擎"
        onPrimary={() => openLine(LINE_BOOK_URL)}
        note="免費諮詢 · 無推銷壓力"
      />
      <p className="px-8 mt-8 pb-10 text-[12px] text-warm-gray-500 text-center tracking-wide leading-relaxed">本頁為教育性質的情境試算，不構成投資建議。投資有風險，過去績效不代表未來表現。</p>
    </div>
  );
};
