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
    { label: "🌱 小資啟動", p: 50, r: 8, m: 3000, mo: 96, t: 10000 },
    { label: "💼 中階穩健", p: 150, r: 8, m: 7000, mo: 96, t: 20000 },
    { label: "🎯 高規資產", p: 300, r: 8, m: 15000, mo: 96, t: 50000 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setP(preset.p); setR(preset.r); setM(preset.m); setMo(preset.mo); setT(preset.t);
  };

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 font-sans pb-10 relative overflow-hidden flex flex-col items-center">
        
      {/* Header and Hero */}
      <div className="w-full relative z-10 pt-12 px-6 pb-10 flex flex-col items-center border-b border-warm-gray-200 mb-8 shrink-0 bg-warm-gray-50">
        <div className="flex items-center justify-between w-full max-w-sm mb-8">
          <button onClick={onBack} className="bg-white border border-warm-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors hover:bg-warm-gray-50">
            <Ic n="back" color="#2D2D2A" size={16} />
          </button>
          <div className="text-[10px] font-medium text-warm-gray-600 tracking-[0.2em] uppercase">OO SAY MONEY</div>
          <div className="w-8" />
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center w-full max-w-sm">
          <div className="inline-block text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-6 bg-white px-4 py-2 border border-warm-gray-200 uppercase rounded-2xl">
            打造現金流雙引擎
          </div>
          <h1 className="text-[32px] font-serif font-bold text-warm-gray-800 leading-tight tracking-widest mb-6 text-center">
            花不完，<br/>
            只會越來越多。
          </h1>
          <div className="text-[13px] text-warm-gray-800/80 leading-loose font-normal px-6 py-5 bg-white border border-warm-gray-200 inline-block tracking-wide rounded-2xl">
            投資從來不是數學考試，而是一場心理戰。透過「本金 + 定期定額 + 配息再投入」，建立一套能讓你安心睡覺的被動收入系統。
          </div>
        </motion.div>
      </div>

      <div className="px-5 space-y-8 mt-2 relative z-20 w-full max-w-sm">
        
        {/* Interactive Calculator Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-warm-gray-200 rounded-2xl">
           <div className="bg-warm-gray-50 px-6 py-5 border-b border-warm-gray-200">
             <h2 className="text-[13px] font-medium text-warm-gray-800 flex items-center gap-3 tracking-[0.2em] uppercase">
                <div className="text-warm-gray-800"><Ic n="trend" size={16} color="currentColor" /></div> 現金流雙引擎試算
             </h2>
             <p className="text-[11px] text-warm-gray-600 font-normal mt-3 tracking-widest">尋找你的財富轉折點，建立不怕波動的系統</p>
           </div>
           
           <div className="px-6 pt-6 pb-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-warm-gray-200">
             {presets.map((pr, i) => (
                <button key={i} onClick={() => applyPreset(pr)} className="shrink-0 px-4 py-2 border border-warm-gray-200 rounded-full bg-white text-[11px] font-medium text-warm-gray-800/80 hover:bg-warm-gray-100 hover:text-warm-gray-800 transition-colors cursor-pointer tracking-widest uppercase shadow-sm">
                  {pr.label}
                </button>
             ))}
           </div>

           <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col gap-3">
                <div className="text-[11px] font-medium text-warm-gray-600 flex justify-between tracking-widest uppercase">初始本金 <span className="text-warm-gray-800 font-bold font-serif">{p} 萬</span></div>
                <input type="range" min="0" max="1000" step="10" value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-[#2D2D2A]" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-[11px] font-medium text-warm-gray-600 flex justify-between tracking-widest uppercase">年化配息率 <span className="text-warm-gray-800 font-bold font-serif">{r}%</span></div>
                <input type="range" min="1" max="15" step="0.5" value={r} onChange={e => setR(Number(e.target.value))} className="w-full accent-[#2D2D2A]" />
              </div>
              <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-medium text-warm-gray-600 flex justify-between tracking-widest uppercase">每月定額 <span className="text-warm-gray-800 font-bold font-serif">{m.toLocaleString()} 元</span></div>
                <input type="range" min="0" max="100000" step="1000" value={m} onChange={e => setM(Number(e.target.value))} className="w-full accent-[#2D2D2A]" />
              </div>
              <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-medium text-warm-gray-600 flex justify-between tracking-widest uppercase">持續期數 <span className="text-warm-gray-800 font-bold font-serif">{mo} 月</span></div>
                <input type="range" min="0" max="240" step="12" value={mo} onChange={e => setMo(Number(e.target.value))} className="w-full accent-[#2D2D2A]" />
              </div>
              <div className="flex flex-col gap-3 col-span-2 pt-6 border-t border-warm-gray-200">
                <div className="text-[11px] font-medium text-warm-gray-600 flex justify-between tracking-widest uppercase">目標月配息 <span className="text-warm-gray-800 font-bold font-serif">{t.toLocaleString()} 元</span></div>
                <input type="range" min="5000" max="200000" step="5000" value={t} onChange={e => setT(Number(e.target.value))} className="w-full accent-[#2D2D2A]" />
              </div>
           </div>

           <div className="bg-teal-base px-6 py-6 grid grid-cols-2 gap-6">
             <div>
               <div className="text-[10px] font-normal text-warm-gray-400 mb-2 tracking-[0.2em] uppercase">總投入本金</div>
               <div className="text-[18px] font-serif font-bold text-white tracking-wider">{fmtFull(totalInvest)}</div>
             </div>
             <div>
               <div className="text-[10px] font-normal text-warm-gray-400 mb-2 tracking-[0.2em] uppercase">首月配息預估</div>
               <div className="text-[18px] font-serif font-bold text-white tracking-wider">{fmtFull(firstMonth)}</div>
             </div>
           </div>

           {zeroPoint && m > 0 && (
             <div className="bg-warm-gray-50 px-6 py-5 text-[12px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">
               <span className="font-serif">＊</span> 若配息全額再投入，<strong>在{zYear > 0 ? ` 第 ${zYear} 年` : ''}{zMonth > 0 ? ` ${zMonth} 個月` : ''}</strong> 時，每月配息將超過 {m.toLocaleString()} 元。屆時可直接用配息支付定期定額。
             </div>
           )}
        </motion.div>

        {/* Chart Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm">
           <div className="text-[13px] font-medium text-warm-gray-800 tracking-[0.1em] mb-5 flex items-center justify-between">
              20 年月配息成長曲線
           </div>
           
           <div className="flex flex-wrap gap-x-5 gap-y-3 mb-8 pb-4 border-b border-warm-gray-200">
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-teal-base" /><span className="text-[10px] font-medium text-warm-gray-800/80 tracking-widest uppercase">100%投入</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-[#8B8A88]" /><span className="text-[10px] font-medium text-warm-gray-800/80 tracking-widest uppercase">50%投入</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-[#AFAEA9]" /><span className="text-[10px] font-medium text-warm-gray-800/80 tracking-widest uppercase">30%投入</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-[#EAEAE6]" /><span className="text-[10px] font-medium text-warm-gray-800/80 tracking-widest uppercase">0%投入</span></div>
              <div className="flex items-center gap-2"><span className="w-4 h-0 border-t border-dashed border-teal-base" /><span className="text-[10px] font-medium text-warm-gray-800 tracking-widest uppercase">目標</span></div>
           </div>

           <div className="h-[240px] w-full mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F0" />
                 <XAxis dataKey="yearStr" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8B8A88', fontWeight: 400 }} minTickGap={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8B8A88', fontWeight: 400 }} tickFormatter={(v) => v >= 10000 ? `$${v/10000}w` : `$${v}`} />
                 <Tooltip 
                   formatter={(value: number, name: string) => [`$${Math.round(value).toLocaleString()}`, name]}
                   labelStyle={{ fontSize: 11, fontWeight: 500, color: '#2D2D2A', marginBottom: 6, letterSpacing: '0.1em' }}
                   itemStyle={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.05em' }}
                   contentStyle={{ borderRadius: 0, border: '1px solid #EAEAE6', boxShadow: 'none', backgroundColor: '#FFFFFF', padding: '12px' }}
                 />
                 <ReferenceLine y={t} stroke="#2D2D2A" strokeDasharray="4 4" strokeWidth={1} />
                 <Line type="monotone" dataKey="p100" name="100%" stroke="#2D2D2A" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="p50" name="50%" stroke="#8B8A88" strokeWidth={1.5} dot={false} />
                 <Line type="monotone" dataKey="p30" name="30%" stroke="#AFAEA9" strokeWidth={1.5} dot={false} />
                 <Line type="monotone" dataKey="p0" name="0%" stroke="#EAEAE6" strokeWidth={1.5} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           <div className="bg-warm-gray-50 border border-warm-gray-200 p-5 flex gap-4">
             <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-normal text-warm-gray-600 mb-2 uppercase tracking-widest">100%投入</div>
                <div className="text-[13px] font-serif font-bold text-warm-gray-800">{fmtFull(finalVals.p100)}</div>
             </div>
             <div className="w-[1px] bg-[#EAEAE6]" />
             <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-normal text-warm-gray-600 mb-2 uppercase tracking-widest">50%投入</div>
                <div className="text-[13px] font-serif font-bold text-warm-gray-800/80">{fmtFull(finalVals.p50)}</div>
             </div>
             <div className="w-[1px] bg-[#EAEAE6]" />
              <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-normal text-warm-gray-600 mb-2 uppercase tracking-widest">30%投入</div>
                <div className="text-[13px] font-serif font-bold text-warm-gray-600">{fmtFull(finalVals.p30)}</div>
              </div>
            </div>
         </motion.div>
      
      {/* Phase 01: Core Logic */}
      <div className="mt-14 mb-14 w-full max-w-sm mx-auto">
           <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-4 flex items-center justify-center gap-2 uppercase">
             <span className="w-1.5 h-1.5 rounded-full bg-teal-base" />
             心理學與現金流
             <span className="w-1.5 h-1.5 rounded-full bg-teal-base" />
           </div>
           <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 leading-tight mb-5 tracking-widest text-center">人不是機器，<br/>投資需要心理學</h2>
           <p className="text-[13px] text-warm-gray-800/80 font-normal leading-loose mb-8 text-center tracking-wide">只要月配息能覆蓋生活支出，你就從「被迫工作」變成「選擇工作」。配息能讓人感覺資產真的在幫自己工作。</p>
           
           <div className="flex flex-col gap-5">
              <div className="bg-white p-6 border border-warm-gray-200 rounded-2xl shadow-sm relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-base" />
                 <div className="text-[10px] font-medium text-warm-gray-800 mb-3 tracking-[0.2em] uppercase ml-2">01 · 現金流的地板</div>
                 <div className="text-[15px] font-medium text-warm-gray-800 mb-3 ml-2 tracking-wider">無論漲跌，每月穩定入帳</div>
                 <div className="text-[13px] text-warm-gray-600 font-normal leading-loose ml-2 tracking-wide">這份確定性就是最大的資產。帳戶每月看到現金，就算市場大跌，心理也有底。</div>
              </div>
              <div className="bg-white p-6 border border-warm-gray-200 rounded-2xl shadow-sm relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B8A88]" />
                 <div className="text-[10px] font-medium text-warm-gray-800/80 mb-3 tracking-[0.2em] uppercase ml-2">02 · 行為模式改變</div>
                 <div className="text-[15px] font-medium text-warm-gray-800 mb-3 ml-2 tracking-wider">從被動轉化為主動存錢</div>
                 <div className="text-[13px] text-warm-gray-600 font-normal leading-loose ml-2 tracking-wide">每當配息入帳就觸發再投入的習慣，加速資產累積，形成正向飛輪。</div>
              </div>
           </div>
        </div>

        {/* Phase 02: Friction Cost */}
        <div className="mb-14 w-full max-w-sm mx-auto p-8 bg-warm-gray-50 border border-warm-gray-200 rounded-2xl">
           <h2 className="text-[18px] font-serif font-bold text-warm-gray-800 mb-5 tracking-widest flex items-center gap-3"><Ic n="trend" size={18} color="currentColor" /> 投資的摩擦成本</h2>
           <p className="text-[13px] text-warm-gray-800/80 font-normal leading-loose mb-8 tracking-wide">能夠讓你長期抱得住、睡得著的投資，是需要付出摩擦成本的。</p>
           
           <div className="grid grid-cols-1 gap-5">
              <div className="bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm relative">
                 <div className="text-[10px] font-medium text-warm-gray-600 uppercase tracking-[0.2em] mb-2">極致現金流型</div>
                 <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-3 tracking-wider">殖利率 8–10%+</div>
                 <p className="text-[12px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">例如高股息 ETF。用最快速度達到轉折點，滿足每月開銷，但多頭市場時總報酬可能落後。</p>
              </div>
              <div className="bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm relative">
                 <div className="text-[10px] font-medium text-warm-gray-600 uppercase tracking-[0.2em] mb-2">總報酬成長型</div>
                 <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-3 tracking-wider">殖利率 3–6%</div>
                 <p className="text-[12px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">例如市值型 ETF。配息來自企業獲利，淨值長期向上，但初期現金流較少。</p>
              </div>
           </div>
        </div>

        {/* Phase 03: Reinvest Logic */}
        <div className="mb-14 w-full max-w-sm mx-auto">
           <div className="bg-teal-base p-8 text-white text-center shrink-0 rounded-2xl shadow-sm">
              <div className="text-[10px] font-medium text-warm-gray-600 tracking-[0.2em] uppercase mb-4">現金流雪球公式</div>
              <div className="text-[15px] font-serif font-bold leading-loose tracking-wider">
                 (本金 <span className="text-warm-gray-600 font-sans">+</span> 持續定額)<br/> 
                 <span className="text-warm-gray-600 font-sans">×</span> 配息率 <span className="text-warm-gray-600 font-sans">×</span> 再投入比例
              </div>
           </div>
           
           <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-4 p-6 bg-white border border-warm-gray-200 rounded-2xl">
                 <div className="text-[18px] font-serif font-bold text-warm-gray-800 w-12 shrink-0 pt-0.5">100%</div>
                 <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide"><span className="font-bold text-warm-gray-800">全數滾入：</span>累積期首選，讓雪球呈指數型爆發的唯一路徑。</div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white border border-warm-gray-200 rounded-2xl">
                 <div className="text-[18px] font-serif font-bold text-warm-gray-600 w-12 shrink-0 pt-0.5">30%</div>
                 <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide"><span className="font-bold text-warm-gray-800">部分滾入：</span>兼顧當下與未來，部分改善生活，部分把雪球做大。</div>
              </div>
           </div>
        </div>

        {/* Phase 05: FAQ */}
        <div className="mb-16 w-full max-w-sm mx-auto">
           <h2 className="text-[20px] font-serif font-bold text-warm-gray-800 mb-8 tracking-widest text-center">常見迷思破解</h2>
           <div className="bg-white border border-warm-gray-200 rounded-2xl overflow-hidden shadow-sm">
             {[
               { q: "為什麼規劃都先抓8年？", a: "經歷一次完整的經濟循環約需 7 到 10 年，8 年能讓複利效應穩定發揮，平滑短期波動，是檢視「現金流成長」最理想的區間。" },
                { q: "配息只是左手換右手？", a: "數學上是，但心理學上不是。現金流提供極大安全感，讓你市場大跌時不會恐慌賣出。" },
               { q: "通膨會不會吃掉配息？", a: "會，所以強烈建議「至少將 30% 配息再投入」，讓本金跟著長大，未來配息就能抵抗通膨。" },
               { q: "遇到股災大跌怎麼辦？", a: "股災時淨值跌，但只要企業獲利，配息依然發放。這時定期定額能買到更多便宜單位數，加速累積。" }
             ].map((faq, i) => {
               const isOpen = openFaq === i;
               return (
                 <div key={i} className="border-b border-warm-gray-200 last:border-0">
                   <div className="px-6 py-6 flex items-center justify-between cursor-pointer hover:bg-warm-gray-50 transition-colors" onClick={() => setOpenFaq(isOpen ? null : i)}>
                     <div className={`text-[14px] font-medium pr-4 transition-colors tracking-widest ${isOpen ? 'text-warm-gray-800' : 'text-warm-gray-800'}`}>{faq.q}</div>
                     <div className={`text-[16px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-warm-gray-800' : 'text-warm-gray-600'}`}>+</div>
                   </div>
                   <AnimatePresence>
                     {isOpen && (
                       <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-warm-gray-50">
                         <div className="px-6 pb-6 pt-2 text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">
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
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-sm mx-auto bg-warm-gray-50 border border-warm-gray-200 p-10 text-center relative overflow-hidden shrink-0">
          <div className="relative z-10">
             <div className="text-[10px] font-medium text-warm-gray-600 tracking-[0.2em] uppercase mb-4">結論與行動</div>
             <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-5 tracking-widest">「花不完」是紀律的產物</div>
             <div className="text-[13px] text-warm-gray-800/80 font-normal mb-8 leading-loose tracking-wide">
               不用等存夠大筆錢，設定好每月投入計畫，選定會成長的標的，讓複利開始計時。
             </div>
             
             <button onClick={() => window.open('https://line.me/R/ti/p/@oosaymoney', '_blank')} className="no-underline flex items-center justify-center gap-3 bg-teal-base text-white w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-cyan-base cursor-pointer border border-transparent uppercase rounded-2xl">
               <Ic n="star" size={16} color="currentColor" /> 設定我的現金流引擎
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
