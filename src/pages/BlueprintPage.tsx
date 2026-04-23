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
    <div className="min-h-[100dvh] bg-transparent font-sans pb-10 relative overflow-hidden flex flex-col items-center">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-[#e0e7ff] rounded-full blur-[80px] pointer-events-none opacity-60 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-[#f3e8ff] rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-multiply" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-[#dbeafe] rounded-full blur-[80px] pointer-events-none opacity-50 mix-blend-multiply" />
        
      {/* Header and Hero */}
      <div className="w-full relative z-10 pt-7 px-5 pb-8 flex flex-col items-center">
        <div className="flex items-center justify-start w-full max-w-sm mb-6">
          <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-12 h-12 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
            <Ic n="back" color="#9333ea" size={24} />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center w-full max-w-sm">
          <div className="inline-block text-[12px] font-black text-[#9333ea] tracking-[0.15em] mb-4 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white uppercase drop-shadow-sm">
            打造現金流雙引擎
          </div>
          <h1 className="text-[36px] font-black text-slate-800 leading-tight tracking-tight mb-4 text-center">
            花不完，<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm">只會越來越多。</span>
          </h1>
          <div className="text-[15px] text-slate-500 leading-relaxed font-bold px-5 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white inline-block shadow-sm">
            投資從來不是數學考試，而是一場心理戰。透過「本金 + 定期定額 + 配息再投入」，建立一套能讓你安心睡覺的被動收入系統。
          </div>
        </motion.div>
      </div>

      <div className="px-5 space-y-6 mt-2 relative z-20 w-full max-w-sm">
        
        {/* Interactive Calculator Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 backdrop-blur-md rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
           <div className="bg-gradient-to-r from-[#f3e8ff] to-white/60 px-6 py-5 border-b border-white">
             <h2 className="text-[17px] font-black text-slate-800 flex items-center gap-2 tracking-wide">
                <div className="bg-[#9333ea] text-white p-1.5 rounded-xl shadow-sm"><Ic n="trend" size={18} color="currentColor" /></div> 現金流雙引擎試算
             </h2>
             <p className="text-[13px] text-slate-500 font-semibold mt-2">尋找你的財富轉折點，建立不怕波動的系統</p>
           </div>
           
           <div className="px-5 pt-5 pb-3 flex gap-2.5 overflow-x-auto scrollbar-hide">
             {presets.map((pr, i) => (
                <button key={i} onClick={() => applyPreset(pr)} className="shrink-0 px-4 py-2 rounded-full border border-white bg-white/60 backdrop-blur-md text-[13px] font-black text-slate-600 hover:bg-[#f3e8ff] hover:text-[#9333ea] transition-all shadow-sm active:scale-95">
                  {pr.label}
                </button>
             ))}
           </div>

           <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-6">
              <div className="flex flex-col gap-2">
                <div className="text-[12px] font-bold text-slate-500 flex justify-between">初始本金 <span className="text-[#9333ea] font-black">{p} 萬</span></div>
                <input type="range" min="0" max="1000" step="10" value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-[#9333ea]" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[12px] font-bold text-slate-500 flex justify-between">年化配息率 <span className="text-[#9333ea] font-black">{r}%</span></div>
                <input type="range" min="1" max="15" step="0.5" value={r} onChange={e => setR(Number(e.target.value))} className="w-full accent-[#9333ea]" />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <div className="text-[12px] font-bold text-slate-500 flex justify-between">每月定額 <span className="text-[#9333ea] font-black">{m.toLocaleString()} 元</span></div>
                <input type="range" min="0" max="100000" step="1000" value={m} onChange={e => setM(Number(e.target.value))} className="w-full accent-[#9333ea]" />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <div className="text-[12px] font-bold text-slate-500 flex justify-between">持續期數 <span className="text-[#9333ea] font-black">{mo} 月</span></div>
                <input type="range" min="0" max="240" step="12" value={mo} onChange={e => setMo(Number(e.target.value))} className="w-full accent-[#9333ea]" />
              </div>
              <div className="flex flex-col gap-2 col-span-2 pt-2 border-t border-white">
                <div className="text-[12px] font-bold text-slate-500 flex justify-between">目標月配息 <span className="text-[#ec4899] font-black">{t.toLocaleString()} 元</span></div>
                <input type="range" min="5000" max="200000" step="5000" value={t} onChange={e => setT(Number(e.target.value))} className="w-full accent-[#ec4899]" />
              </div>
           </div>

           <div className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] px-6 py-5 grid grid-cols-2 gap-4">
             <div>
               <div className="text-[11px] font-bold text-[#f3e8ff] mb-1.5 tracking-widest uppercase">總投入本金</div>
               <div className="text-[20px] font-black text-white drop-shadow-sm">{fmtFull(totalInvest)}</div>
             </div>
             <div>
               <div className="text-[11px] font-bold text-[#f3e8ff] mb-1.5 tracking-widest uppercase">首月配息預估</div>
               <div className="text-[20px] font-black text-[#fef08a] drop-shadow-sm">{fmtFull(firstMonth)}</div>
             </div>
           </div>

           {zeroPoint && m > 0 && (
             <div className="bg-[#fef3c7] px-6 py-4 text-[13.5px] text-[#92400e] font-semibold leading-relaxed border-t border-white">
               ✨ 若配息全額再投入，<strong>在{zYear > 0 ? ` 第 ${zYear} 年` : ''}{zMonth > 0 ? ` ${zMonth} 個月` : ''}</strong> 時，每月配息將超過 {m.toLocaleString()} 元。屆時可直接用配息支付定期定額！
             </div>
           )}
        </motion.div>

        {/* Chart Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/60 backdrop-blur-md rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white p-6">
           <div className="text-[15px] font-black text-slate-800 tracking-wide mb-5 flex items-center justify-between">
              20 年月配息成長曲線
              <span className="text-[11px] font-bold text-slate-400 bg-white/60 px-2 py-1 rounded-md shadow-sm">比較再投入比例</span>
           </div>
           
           <div className="flex flex-wrap gap-x-4 gap-y-2.5 mb-6">
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#9333ea] rounded-full shadow-sm" /><span className="text-[11px] font-black text-slate-600">100%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#10b981] rounded-full shadow-sm" /><span className="text-[11px] font-black text-slate-600">50%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#f59e0b] rounded-full shadow-sm" /><span className="text-[11px] font-black text-slate-600">30%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#f43f5e] rounded-full shadow-sm" /><span className="text-[11px] font-black text-slate-600">0%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-4 h-0 border-t-[2.5px] border-dashed border-[#ec4899]" /><span className="text-[11px] font-black text-[#ec4899]">目標</span></div>
           </div>

           <div className="h-[240px] w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="yearStr" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} minTickGap={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => v >= 10000 ? `$${v/10000}w` : `$${v}`} />
                 <Tooltip 
                   formatter={(value: number, name: string) => [`$${Math.round(value).toLocaleString()}`, name]}
                   labelStyle={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}
                   itemStyle={{ fontSize: 12, fontWeight: 700 }}
                   contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
                 />
                 <ReferenceLine y={t} stroke="#ec4899" strokeDasharray="4 4" strokeWidth={2} />
                 <Line type="monotone" dataKey="p100" name="100% 再投入" stroke="#9333ea" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="p50" name="50% 再投入" stroke="#10b981" strokeWidth={2.5} dot={false} />
                 <Line type="monotone" dataKey="p30" name="30% 再投入" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                 <Line type="monotone" dataKey="p0" name="0% 再投入" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           <div className="bg-white/80 backdrop-blur-md rounded-[20px] p-4 flex gap-2 border border-white shadow-inner">
             <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">100%投入</div>
                <div className="text-[13px] font-black text-[#9333ea]">{fmtFull(finalVals.p100)}</div>
             </div>
             <div className="w-[1px] bg-slate-200/50" />
             <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">50%投入</div>
                <div className="text-[13px] font-black text-[#10b981]">{fmtFull(finalVals.p50)}</div>
             </div>
             <div className="w-[1px] bg-slate-200/50" />
              <div className="flex-1 text-center justify-between flex flex-col">
                <div className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">30%投入</div>
                <div className="text-[13px] font-black text-[#f59e0b]">{fmtFull(finalVals.p30)}</div>
              </div>
            </div>
         </motion.div>
      
      {/* Phase 01: Core Logic */}
      <div className="mt-12 mb-10 w-full max-w-sm mx-auto">
           <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-3 uppercase flex items-center justify-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#9333ea]" />
             心理學與現金流
             <span className="w-1.5 h-1.5 rounded-full bg-[#9333ea]" />
           </div>
           <h2 className="text-[24px] font-black text-slate-800 leading-tight mb-4 tracking-tight text-center">人不是機器，<br/>投資需要心理學</h2>
           <p className="text-[15px] text-slate-600 font-semibold leading-relaxed mb-6 text-center">只要月配息能覆蓋生活支出，你就從「被迫工作」變成「選擇工作」。配息能讓人感覺資產真的在幫自己工作。</p>
           
           <div className="flex flex-col gap-4">
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#9333ea]" />
                 <div className="text-[12px] font-black text-[#9333ea] mb-2 tracking-widest uppercase ml-1">01 · 現金流的地板</div>
                 <div className="text-[16px] font-bold text-slate-800 mb-2 ml-1">無論漲跌，每月穩定入帳</div>
                 <div className="text-[14px] text-slate-500 font-semibold leading-relaxed ml-1">這份確定性就是最大的資產。帳戶每月看到現金，就算市場大跌，心理也有底。</div>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#c084fc]" />
                 <div className="text-[12px] font-black text-[#c084fc] mb-2 tracking-widest uppercase ml-1">02 · 行為模式改變</div>
                 <div className="text-[16px] font-bold text-slate-800 mb-2 ml-1">從被動轉化為主動存錢</div>
                 <div className="text-[14px] text-slate-500 font-semibold leading-relaxed ml-1">每當配息入帳就觸發再投入的習慣，加速資產累積，形成正向飛輪。</div>
              </div>
           </div>
        </div>

        {/* Phase 02: Friction Cost */}
        <div className="mb-10 w-full max-w-sm mx-auto p-8 bg-gradient-to-b from-[#fdf4ff] to-white/60 backdrop-blur-md rounded-[32px] border border-white shadow-sm">
           <h2 className="text-[20px] font-black text-slate-800 mb-4 tracking-tight flex items-center gap-2"><Ic n="trend" size={20} color="#d946ef" /> 投資的「摩擦成本」</h2>
           <p className="text-[14px] text-slate-600 font-semibold leading-relaxed mb-6">能夠讓你長期抱得住、睡得著的投資，是需要付出摩擦成本的。</p>
           
           <div className="grid grid-cols-1 gap-5">
              <div className="bg-white/80 rounded-[20px] p-5 shadow-sm border border-white relative">
                 <div className="text-[11px] font-black text-[#f59e0b] uppercase tracking-widest mb-1">極致現金流型</div>
                 <div className="text-[16px] font-black text-slate-800 mb-2">殖利率 8–10%+</div>
                 <p className="text-[13.5px] text-slate-500 font-semibold leading-relaxed">例如高股息 ETF。用最快速度達到轉折點，滿足每月開銷，但多頭市場時總報酬可能落後。</p>
              </div>
              <div className="bg-white/80 rounded-[20px] p-5 shadow-sm border border-white relative">
                 <div className="text-[11px] font-black text-[#10b981] uppercase tracking-widest mb-1">總報酬成長型</div>
                 <div className="text-[16px] font-black text-slate-800 mb-2">殖利率 3–6%</div>
                 <p className="text-[13.5px] text-slate-500 font-semibold leading-relaxed">例如市值型 ETF。配息來自企業獲利，淨值長期向上，但初期現金流較少。</p>
              </div>
           </div>
        </div>

        {/* Phase 03: Reinvest Logic */}
        <div className="mb-12 w-full max-w-sm mx-auto">
           <div className="bg-gradient-to-br from-[#9333ea] to-[#7e22ce] rounded-[32px] p-8 text-white text-center shadow-[0_15px_40px_rgba(147,51,234,0.3)] relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/20 rounded-full blur-[40px] pointer-events-none" />
              <div className="text-[12px] font-black text-[#e9d5ff] tracking-widest uppercase mb-4 drop-shadow-sm">現金流雪球公式</div>
              <div className="text-[18px] font-black leading-relaxed tracking-wide">
                 (本金 <span className="text-[#e9d5ff] font-bold">+</span> 持續投入)<br/> 
                 <span className="text-[#e9d5ff] font-bold">×</span> 配息率 <span className="text-[#e9d5ff] font-bold">×</span> 再投入比例
              </div>
           </div>
           
           <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-5 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm">
                 <div className="text-[20px] font-black text-[#9333ea] w-12 shrink-0 pt-0.5">100%</div>
                 <div className="text-[14px] text-slate-600 font-semibold leading-relaxed"><span className="font-black text-slate-800">全數滾入：</span>累積期首選，讓雪球呈指數型爆發的唯一路徑。</div>
              </div>
              <div className="flex items-start gap-5 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm">
                 <div className="text-[20px] font-black text-[#f59e0b] w-12 shrink-0 pt-0.5">30%</div>
                 <div className="text-[14px] text-slate-600 font-semibold leading-relaxed"><span className="font-black text-slate-800">部分滾入：</span>兼顧當下與未來，部分改善生活，部分把雪球做大。</div>
              </div>
           </div>
        </div>

        {/* Phase 05: FAQ */}
        <div className="mb-16 w-full max-w-sm mx-auto">
           <h2 className="text-[22px] font-black text-slate-800 mb-6 tracking-tight text-center">常見迷思破解</h2>
           <div className="bg-white/60 backdrop-blur-md rounded-[28px] border border-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
             {[
               { q: "配息只是左手換右手？", a: "數學上是，但心理學上不是。現金流提供極大安全感，讓你市場大跌時不會恐慌賣出。" },
               { q: "通膨會不會吃掉配息？", a: "會，所以強烈建議「至少將 30% 配息再投入」，讓本金跟著長大，未來配息就能抵抗通膨。" },
               { q: "遇到股災大跌怎麼辦？", a: "股災時淨值跌，但只要企業獲利，配息依然發放。這時定期定額能買到更多便宜單位數，加速累積。" }
             ].map((faq, i) => {
               const isOpen = openFaq === i;
               return (
                 <div key={i} className="border-b border-white last:border-0">
                   <div className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-white/40 transition-colors" onClick={() => setOpenFaq(isOpen ? null : i)}>
                     <div className={`text-[15px] font-black pr-4 transition-colors ${isOpen ? 'text-[#9333ea]' : 'text-slate-700'}`}>{faq.q}</div>
                     <div className={`text-[20px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-[#9333ea]' : 'text-slate-400'}`}>+</div>
                   </div>
                   <AnimatePresence>
                     {isOpen && (
                       <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                         <div className="px-6 pb-6 text-[14px] text-slate-600 font-semibold leading-relaxed">
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
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 text-center border border-[#e9d5ff] relative overflow-hidden mb-10 shadow-[0_15px_40px_rgba(147,51,234,0.3)]">
          <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
          <div className="relative z-10">
             <div className="text-[12px] font-black text-[#faf5ff] tracking-widest uppercase mb-3 drop-shadow-sm">結論與行動</div>
             <div className="text-[22px] font-black text-white mb-4 tracking-tight drop-shadow-sm">「花不完」是紀律的產物</div>
             <div className="text-[14.5px] text-[#f3e8ff] font-semibold mb-8 leading-relaxed">
               不用等存夠大筆錢，設定好每月投入計畫，選定會成長的標的，讓複利開始計時。
             </div>
             
             <a href="https://line.me/R/ti/p/@oosaymoney" target="_blank" rel="noopener noreferrer" className="no-underline flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white w-full py-4.5 rounded-[20px] text-[16px] font-black shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition-transform active:scale-95 mb-2 hover:scale-[1.02]">
               <Ic n="star" size={20} color="#fff" /> 設定我的現金流引擎
             </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
