import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
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

export const BlueprintPage = ({ onBack, role }: { onBack: () => void, role?: string | null }) => {
  const [p, setP] = useState(50);
  const [r, setR] = useState(8);
  const [m, setM] = useState(10000);
  const [mo, setMo] = useState(120);
  const [t, setT] = useState(30000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const chartData = useMemo(() => getChartData(p, r, m, mo), [p, r, m, mo]);
  const zeroPoint = useMemo(() => calcZeroPoint(p, m, r), [p, m, r]);
  
  const zYear = zeroPoint ? Math.floor(zeroPoint / 12) : 0;
  const zMonth = zeroPoint ? zeroPoint % 12 : 0;

  const totalInvest = p * 10000 + m * mo;
  const firstMonth = p * 10000 * (r / 100) / 12;

  const finalVals = chartData[chartData.length - 1];

  const presets = [
    { label: "🌱 小資起步", p: 50, r: 8, m: 10000, mo: 120, t: 30000 },
    { label: "💼 中產穩健", p: 100, r: 8, m: 0, mo: 240, t: 50000 },
    { label: "🎯 退休衝刺", p: 300, r: 8, m: 5000, mo: 120, t: 80000 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setP(preset.p); setR(preset.r); setM(preset.m); setMo(preset.mo); setT(preset.t);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">
      {/* Header and Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#1a3a5c] px-6 pt-10 pb-16 relative overflow-hidden rounded-b-[40px] shadow-sm mb-6">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-amber-500/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <button onClick={onBack} className="bg-white/10 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer transition-colors hover:bg-white/20">
            <Ic n="back" color="#fff" size={18} />
          </button>
          <div className="text-[11px] font-bold text-amber-400/80 tracking-[0.14em] uppercase">OO SAY MONEY</div>
          <div className="w-9" />
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="text-[10px] font-extrabold text-indigo-300 tracking-[0.2em] mb-3 flex items-center gap-2 uppercase">
            <span className="w-4 h-[1px] bg-indigo-300" /> 打造現金流雙引擎
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white leading-tight mb-4 tracking-[-0.02em]">
            花不完，<br/>
            <span className="text-amber-400">只會越來越多。</span>
          </h1>
          <p className="text-[14px] text-indigo-100/90 font-medium leading-relaxed max-w-[280px] mb-6">
            投資從來不是數學考試，而是一場心理戰。透過「本金 + 定期定額 + 配息再投入」，建立一套能讓你安心睡覺的被動收入系統。
          </p>
        </motion.div>
      </div>

      <div className="px-5 space-y-6 -mt-10 relative z-20">
        
        {/* Interactive Calculator Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] shadow-xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
           <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-5 border-b border-slate-100">
             <h2 className="text-[16px] font-extrabold text-slate-800 flex items-center gap-2 tracking-tight">
                <Ic n="trend" size={18} color="#4f46e5" /> 現金流引擎試算
             </h2>
             <p className="text-[12px] text-slate-500 font-medium mt-1">互動式試算：尋找你的財富轉折點</p>
           </div>
           
           <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-hide">
             {presets.map((pr, i) => (
                <button key={i} onClick={() => applyPreset(pr)} className="shrink-0 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[12px] font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                  {pr.label}
                </button>
             ))}
           </div>

           <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-slate-400 flex justify-between">初始本金 <span className="text-indigo-600 font-extrabold">{p} 萬</span></div>
                <input type="range" min="0" max="1000" step="10" value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-slate-400 flex justify-between">年化配息率 <span className="text-indigo-600 font-extrabold">{r}%</span></div>
                <input type="range" min="1" max="15" step="0.5" value={r} onChange={e => setR(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-400 flex justify-between">每月定額 <span className="text-indigo-600 font-extrabold">{m.toLocaleString()} 元</span></div>
                <input type="range" min="0" max="100000" step="1000" value={m} onChange={e => setM(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-400 flex justify-between">持續期數 <span className="text-indigo-600 font-extrabold">{mo} 月</span></div>
                <input type="range" min="0" max="240" step="12" value={mo} onChange={e => setMo(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2">
                <div className="text-[11px] font-bold text-slate-400 flex justify-between">目標月配息 <span className="text-rose-500 font-extrabold">{t.toLocaleString()} 元</span></div>
                <input type="range" min="5000" max="200000" step="5000" value={t} onChange={e => setT(Number(e.target.value))} className="w-full accent-rose-500" />
              </div>
           </div>

           <div className="bg-indigo-950 px-5 py-4 grid grid-cols-2 gap-4">
             <div>
               <div className="text-[10px] font-extrabold text-indigo-400/80 mb-1 tracking-wider uppercase">總投入本金</div>
               <div className="text-[18px] font-black text-white">{fmtFull(totalInvest)}</div>
             </div>
             <div>
               <div className="text-[10px] font-extrabold text-indigo-400/80 mb-1 tracking-wider uppercase">首月配息預估</div>
               <div className="text-[18px] font-black text-amber-400">{fmtFull(firstMonth)}</div>
             </div>
           </div>

           {zeroPoint && m > 0 && (
             <div className="bg-amber-400 px-5 py-3.5 text-[12.5px] text-amber-950 font-medium leading-relaxed">
               ✨ 若配息全額再投入，<strong>在{zYear > 0 ? ` 第 ${zYear} 年` : ''}{zMonth > 0 ? ` ${zMonth} 個月` : ''}</strong> 時，每月配息將超過 {m.toLocaleString()} 元。屆時可直接用配息支付定期定額！
             </div>
           )}
        </motion.div>

        {/* Chart Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
           <div className="text-[13px] font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-between">
              20 年月配息成長曲線
              <span className="text-[10px] font-bold text-slate-400">不同再投入比例</span>
           </div>
           
           <div className="flex flex-wrap gap-x-3 gap-y-2 mb-6">
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#4f46e5] rounded-full" /><span className="text-[10px] font-bold text-slate-500">100%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#059669] rounded-full" /><span className="text-[10px] font-bold text-slate-500">50%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#d97706] rounded-full" /><span className="text-[10px] font-bold text-slate-500">30%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#e11d48] rounded-full" /><span className="text-[10px] font-bold text-slate-500">0%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0 border-t-2 border-dashed border-rose-500" /><span className="text-[10px] font-bold text-rose-500">目標</span></div>
           </div>

           <div className="h-[220px] w-full mb-4">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="yearStr" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} minTickGap={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => v >= 10000 ? `$${v/10000}w` : `$${v}`} />
                 <Tooltip 
                   formatter={(value: number, name: string) => [`$${Math.round(value).toLocaleString()}`, name]}
                   labelStyle={{ fontSize: 11, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}
                   itemStyle={{ fontSize: 11, fontWeight: 600 }}
                   contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                 />
                 <ReferenceLine y={t} stroke="#f43f5e" strokeDasharray="4 4" strokeWidth={1.5} />
                 <Line type="monotone" dataKey="p100" name="100% 再投入" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                 <Line type="monotone" dataKey="p50" name="50% 再投入" stroke="#059669" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="p30" name="30% 再投入" stroke="#d97706" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="p0" name="0% 再投入" stroke="#e11d48" strokeWidth={2} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center divide-x divide-slate-200">
             <div>
                <div className="text-[9px] font-bold text-slate-400 mb-1">100%投入</div>
                <div className="text-[12px] font-black text-indigo-600">{fmtFull(finalVals.p100)}</div>
             </div>
             <div>
                <div className="text-[9px] font-bold text-slate-400 mb-1">50%投入</div>
                <div className="text-[12px] font-black text-emerald-600">{fmtFull(finalVals.p50)}</div>
             </div>
             <div>
                <div className="text-[9px] font-bold text-slate-400 mb-1">30%投入</div>
                <div className="text-[12px] font-black text-amber-600">{fmtFull(finalVals.p30)}</div>
             </div>
             <div>
                <div className="text-[9px] font-bold text-slate-400 mb-1">不再投入</div>
                <div className="text-[12px] font-black text-rose-500">{fmtFull(finalVals.p0)}</div>
             </div>
           </div>
        </motion.div>

        {/* Phase 01: Core Logic */}
        <div className="mt-10 mb-8">
           <div className="text-[11px] font-extrabold text-indigo-500 tracking-[0.1em] mb-2 uppercase flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
             Phase 01
           </div>
           <h2 className="text-[20px] font-black text-slate-800 leading-tight mb-4 tracking-[-0.02em]">人不是機器，<br/>投資需要心理學</h2>
           <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed mb-5">只要月配息能覆蓋生活支出，你就從「被迫工作」變成「選擇工作」。配息能讓人感覺資產真的在幫自己工作。</p>
           
           <div className="flex flex-col gap-3">
              <div className="bg-white p-4 rounded-[16px] border border-slate-100 shadow-sm">
                 <div className="text-[11px] font-black text-amber-500 mb-1 tracking-wider uppercase">01 · 現金流的地板</div>
                 <div className="text-[14px] font-bold text-slate-800 mb-1.5">無論漲跌，每月穩定入帳</div>
                 <div className="text-[12.5px] text-slate-500 font-medium leading-relaxed">這份確定性就是最大的資產。帳戶每月看到現金，就算市場大跌，心理也有底。</div>
              </div>
              <div className="bg-white p-4 rounded-[16px] border border-slate-100 shadow-sm">
                 <div className="text-[11px] font-black text-amber-500 mb-1 tracking-wider uppercase">02 · 行為模式改變</div>
                 <div className="text-[14px] font-bold text-slate-800 mb-1.5">從被動轉化為主動存錢</div>
                 <div className="text-[12.5px] text-slate-500 font-medium leading-relaxed">每當配息入帳就觸發再投入的習慣，加速資產累積，形成正向飛輪。</div>
              </div>
           </div>
        </div>

        {/* Phase 02: Friction Cost */}
        <div className="mb-8 p-6 bg-gradient-to-b from-indigo-50/50 to-white rounded-[24px] border border-indigo-100/50">
           <h2 className="text-[18px] font-black text-slate-800 mb-4 tracking-tight">投資的「摩擦成本」</h2>
           <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-5">能夠讓你長期抱得住、睡得著的投資，是需要付出摩擦成本的。</p>
           
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-400" />
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">極致現金流型</div>
                 <div className="text-[15px] font-bold text-slate-800 mb-2 pl-1">殖利率 8–10%+</div>
                 <p className="text-[12px] text-slate-500 font-medium leading-relaxed pl-1 mb-3">例如高股息 ETF。用最快速度達到轉折點，滿足每月開銷，但多頭市場時總報酬可能落後。</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500" />
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">總報酬成長型</div>
                 <div className="text-[15px] font-bold text-slate-800 mb-2 pl-1">殖利率 3–6%</div>
                 <p className="text-[12px] text-slate-500 font-medium leading-relaxed pl-1 mb-3">例如市值型 ETF。配息來自企業獲利，淨值長期向上，但初期現金流較少。</p>
              </div>
           </div>
        </div>

        {/* Phase 03: Reinvest Logic */}
        <div className="mb-10">
           <div className="bg-indigo-600 rounded-[24px] p-6 text-white text-center shadow-lg shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-[10px] font-extrabold text-indigo-300 tracking-widest uppercase mb-4">現金流雪球公式</div>
              <div className="text-[16px] font-black leading-relaxed">
                 (本金 <span className="text-indigo-300">+</span> 持續投入)<br/> 
                 <span className="text-indigo-300">×</span> 配息率 <span className="text-indigo-300">×</span> 再投入比例
              </div>
           </div>
           
           <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                 <div className="text-[18px] font-black text-indigo-600 w-12 shrink-0 pt-0.5">100%</div>
                 <div className="text-[12.5px] text-slate-600 font-medium leading-relaxed"><span className="font-bold text-slate-800">全數滾入：</span>累積期首選，讓雪球呈指數型爆發的唯一路徑。</div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                 <div className="text-[18px] font-black text-amber-500 w-12 shrink-0 pt-0.5">30%</div>
                 <div className="text-[12.5px] text-slate-600 font-medium leading-relaxed"><span className="font-bold text-slate-800">部分滾入：</span>兼顧當下與未來，部分改善生活，部分把雪球做大。</div>
              </div>
           </div>
        </div>

        {/* Phase 05: FAQ */}
        <div className="mb-12">
           <h2 className="text-[18px] font-black text-slate-800 mb-4 tracking-tight">常見迷思破解</h2>
           <div className="bg-white rounded-[20px] border border-slate-100 overflow-hidden shadow-sm">
             {[
               { q: "配息只是左手換右手？", a: "數學上是，但心理學上不是。現金流提供極大安全感，讓你市場大跌時不會恐慌賣出。" },
               { q: "通膨會不會吃掉配息？", a: "會，所以強烈建議「至少將 30% 配息再投入」，讓本金跟著長大，未來配息就能抵抗通膨。" },
               { q: "遇到股災大跌怎麼辦？", a: "股災時淨值跌，但只要企業獲利，配息依然發放。這時定期定額能買到更多便宜單位數，加速累積。" }
             ].map((faq, i) => {
               const isOpen = openFaq === i;
               return (
                 <div key={i} className="border-b border-slate-100 last:border-0">
                   <div className="px-5 py-4 flex items-center justify-between cursor-pointer" onClick={() => setOpenFaq(isOpen ? null : i)}>
                     <div className="text-[13.5px] font-bold text-slate-800 pr-4">{faq.q}</div>
                     <div className={`text-[18px] text-slate-400 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</div>
                   </div>
                   <AnimatePresence>
                     {isOpen && (
                       <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                         <div className="px-5 pb-5 text-[12.5px] text-slate-500 font-medium leading-relaxed pt-1 border-t border-slate-50">
                           {faq.a}
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               );
             })}
           </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-indigo-950 rounded-[24px] p-6 text-center border border-indigo-900/80 relative overflow-hidden mb-8 shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
             <div className="text-[12px] font-extrabold text-amber-400 tracking-widest uppercase mb-2">結論與行動</div>
             <div className="text-[18px] font-black text-white mb-3 tracking-tight">「花不完」是紀律的產物</div>
             <div className="text-[13px] text-indigo-200/80 font-medium mb-6 leading-relaxed">
               不用等存夠大筆錢，設定好每月投入計畫，選定會成長的標的，讓複利開始計時。
             </div>
             
             <a href="https://line.me/R/ti/p/@oosaymoney" target="_blank" rel="noopener noreferrer" className="no-underline flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white w-full py-4 rounded-[16px] text-[15px] font-extrabold shadow-lg shadow-[#06C755]/20 transition-all active:scale-[0.98] mb-2">
               <Ic n="star" size={16} color="#fff" /> 設定我的現金流引擎
             </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
