import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const DEFENSE_SECTIONS = [

  {
    id: "life",
    icon: "user",
    title: "壽險 · 意外險",
    desc: "家人的最後一道防線",
    points: [
      "壽險提供身故保障，確保萬一發生意外，家人的生活不會因此崩潰",
      "意外險針對意外傷亡、失能提供保障，保費相對低廉但保額高",
      "定期壽險 vs 終身壽險：年輕時用定期壽險以低保費換高保額，是最划算的選擇",
      "失能扶助險近年需求大增，長期失能帶來的財務衝擊往往比死亡更大"
    ],
    highlightLabel: "Steven & Annie 的觀點",
    highlight: "有家庭負擔的人，壽險保額至少要能覆蓋 5–10 年的家庭支出，才算真正有保障。"
  },
  {
    id: "medical",
    icon: "trend",
    title: "醫療險 · 重大疾病",
    desc: "別讓生病拖垮財務",
    points: [
      "實支實付醫療險：住院、手術費用直接理賠，是現代醫療保障的核心",
      "重大傷病險：一旦確診重大傷病，直接一次給付，讓你專心治療不必擔心費用",
      "癌症險：台灣癌症發生率高，自費新藥、標靶治療動輒百萬，癌症險是不可或缺的補充",
      "日額型 vs 實支型：實支型通常更實用，日額型可作為額外生活補貼"
    ],
    highlightLabel: "常見誤區",
    highlight: "只有健保不夠。健保給付是基本款，自費項目逐年增加，沒有補充醫療險，住一次院可能就掏空儲蓄。"
  },
  {
    id: "investment",
    icon: "chart",
    title: "投資型保單",
    desc: "保障與理財兼顧，但要看清楚",
    points: [
      "投資型保單兼具壽險保障與投資功能，保費分為保障費用與投資帳戶兩部分",
      "變額壽險：投資標的連結基金，報酬浮動，適合願意承擔風險、長期投資的人",
      "利率變動型壽險：宣告利率高於定存，適合追求穩健收益的保守型投資人",
      "注意費用結構：前置費用、保單管理費、危險保費會影響實際報酬，要看清楚"
    ],
    highlightLabel: "我們的建議",
    highlight: "投資型保單不是所有人都適合，要先確保基礎保障到位，再考慮是否納入資產配置。"
  },
  {
    id: "property",
    icon: "shield",
    title: "產險 · 車險 · 旅遊險",
    desc: "日常生活的風險轉移",
    points: [
      "強制險是法定最低門檻，第三人責任險才是真正保護你荷包的關鍵",
      "車體險：甲式（全險）、乙式、丙式各有適用情境，不是越貴越好",
      "旅遊平安險：出國必備，醫療費用、緊急撤離費用動輒數十萬，不能省",
      "火險 / 住宅綜合險：房貸族通常只保銀行要求的火險，室內裝潢、家具另需補充"
    ],
    highlightLabel: "出發前記得",
    highlight: "信用卡附贈的旅遊險保障有限，且需刷卡購買機票才生效。出國前確認保障內容，不要等到出事才發現沒保到。"
  }
];

const WHY_STATS = [
  { num: "1/3", text: "台灣人一生中罹患重大疾病的機率超過三分之一，醫療費用動輒百萬起跳" },
  { num: "76%", text: "上班族保險保障嚴重不足，多數人只靠勞保、健保撐著一切" },
  { num: "20年", text: "一張買錯的保單，二十年後可能讓你多花數十萬、卻什麼都沒保到" }
];

const MOCK_CLIENT_DATA = {
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
        { label: "重大疾病", detail: "足夠", status: "ok", note: "保額 200 萬" },
      ]
    },
    {
      name: "林小寶",
      label: "子女",
      type: "child",
      age: 3,
      coverage: [
        { label: "實支實付", detail: "足夠", status: "ok", note: "新生兒保單完整" },
        { label: "意外保障", detail: "足夠", status: "ok", note: "意外醫療完整" },
      ]
    }
  ]
};

const STATUS_MAP: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
  ok: { icon: "✓", textColor: "text-emerald-600", bgClass: "bg-emerald-100", borderClass: "border-emerald-500" },
  gap: { icon: "!", textColor: "text-amber-500", bgClass: "bg-amber-100", borderClass: "border-amber-400" },
  none: { icon: "✕", textColor: "text-rose-500", bgClass: "bg-rose-100", borderClass: "border-rose-400" },
  unknown: { icon: "?", textColor: "text-slate-400", bgClass: "bg-slate-200", borderClass: "border-slate-300" }
};

export const DefensePage = ({ onBack, role }: { onBack: () => void, role?: string | null }) => {
  const [openSection, setOpenSection] = useState<string | null>("life");
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };
  
  const isClient = role === "client";
  const activeMember = MOCK_CLIENT_DATA.members[activeMemberIdx];

  return (
    <div className="min-h-[100dvh] bg-[#f8f5ff] font-sans pb-10">
      {/* Background Orbs */}
      <div className="fixed top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#d8b4fe]/30 rounded-full blur-[80px] z-0 pointer-events-none" />
      <div className="fixed top-[150px] right-[-100px] w-[250px] h-[250px] bg-[#c084fc]/15 rounded-full blur-[60px] z-0 pointer-events-none" />

      {/* Header and Hero - Soft Purple Glassmorphism Style */}
      <div className="pt-12 pb-10 px-6 relative z-10 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="bg-white/60 backdrop-blur-md rounded-full w-11 h-11 flex items-center justify-center border border-white shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <Ic n="back" color="#64748b" size={20} />
          </button>
          <div className="text-[12px] font-black text-[#9333ea] tracking-[0.14em] uppercase">OO SAY MONEY</div>
          <div className="w-11" />
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c084fc] to-[#9333ea] text-white shadow-[0_8px_20px_rgba(147,51,234,0.3)] mb-4">
             <Ic n="shield" size={32} color="#fff" />
          </div>
          <h1 className="text-[28px] font-black text-slate-800 tracking-tight mb-3">財務防線</h1>
          <p className="text-[15px] text-slate-600 font-semibold leading-relaxed max-w-[280px] mx-auto">用對的保險，守住你最重要的東西，避免突發事件拖垮財務。</p>
        </motion.div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10">
        
        {isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="bg-gradient-to-br from-[#9333ea] to-[#7e22ce] rounded-[32px] p-6 shadow-[0_15px_40px_rgba(147,51,234,0.3)] text-white mb-8 border border-[#e9d5ff] relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/20 rounded-full blur-[40px] pointer-events-none" />
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-[24px] shadow-sm shrink-0 border border-white/30">
                   {MOCK_CLIENT_DATA.name.charAt(0)}
                 </div>
                 <div>
                   <div className="font-black text-[18px] tracking-tight">{MOCK_CLIENT_DATA.name}，你好 👋</div>
                   <div className="text-[14px] text-[#e9d5ff] mt-1 font-semibold">家庭共 {MOCK_CLIENT_DATA.members.length} 位成員的保障狀況</div>
                 </div>
               </div>
            </div>

            <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-4 flex items-center justify-center gap-2 uppercase">
               <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
               家庭保障總覽
               <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide snap-x">
              {MOCK_CLIENT_DATA.members.map((m, i) => (
                 <button key={i} onClick={() => setActiveMemberIdx(i)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-full whitespace-nowrap transition-all border snap-center ${activeMemberIdx === i ? 'border-[#c084fc] bg-white/80 backdrop-blur-md text-[#9333ea] font-black shadow-[0_8px_20px_rgba(147,51,234,0.15)] scale-[1.02]' : 'border-white bg-white/40 backdrop-blur-md text-slate-500 font-bold hover:bg-white/60 active:scale-95'}`}
                 >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-black transition-colors ${activeMemberIdx === i ? 'bg-gradient-to-br from-[#c084fc] to-[#9333ea] text-white shadow-sm' : 'bg-white text-slate-400'}`}>
                       {m.name.charAt(0)}
                    </div>
                    <span className="text-[14px] tracking-tight">{m.label}</span>
                    {m.type === 'child' && (
                       <span className={`text-[11px] px-2 py-0.5 rounded-md font-black ml-1 ${activeMemberIdx === i ? 'bg-[#f3e8ff] text-[#9333ea]' : 'bg-white text-slate-400'}`}>{m.age}歲</span>
                    )}
                 </button>
              ))}
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
              <div className="grid grid-cols-2 gap-4 mb-5">
                 {activeMember.coverage.map((item, i) => {
                    const statusMap: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
                        ok: { icon: "✓", textColor: "text-[#10b981]", bgClass: "bg-[#d1fae5]", borderClass: "border-[#34d399]" },
                        gap: { icon: "!", textColor: "text-[#f59e0b]", bgClass: "bg-[#fef3c7]", borderClass: "border-[#fbbf24]" },
                        none: { icon: "✕", textColor: "text-[#f43f5e]", bgClass: "bg-[#ffe4e6]", borderClass: "border-[#fb7185]" },
                        unknown: { icon: "?", textColor: "text-slate-400", bgClass: "bg-slate-100", borderClass: "border-slate-300" }
                    };
                    const status = statusMap[item.status] || statusMap.unknown;
                    return (
                       <div key={i} className={`rounded-2xl p-4 border-l-[4px] bg-white/80 shadow-sm ${status.borderClass}`}>
                          <div className="text-[12px] font-black text-slate-400/90 mb-2 tracking-wide uppercase">{item.label}</div>
                          <div className={`text-[15px] font-black flex items-center gap-2 mb-2 ${status.textColor}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-black leading-none ${status.bgClass} ${status.textColor}`}>{status.icon}</span>
                            {item.detail}
                          </div>
                          {item.note && <div className="text-[12.5px] text-slate-500 font-semibold leading-snug line-clamp-2">{item.note}</div>}
                       </div>
                    )
                 })}
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                 <div className="flex items-center justify-between text-[13px] font-bold text-slate-500 bg-white/80 px-4 py-3 rounded-[16px] border border-white shadow-sm">
                    <div className="flex items-center gap-2">負責顧問: <span className="text-[#9333ea] font-black">{MOCK_CLIENT_DATA.advisor}</span></div>
                 </div>
                 <div className="text-center text-[11px] text-slate-400 font-black tracking-widest uppercase">
                   最後更新: {MOCK_CLIENT_DATA.updated}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guest View Notice */}
        {!isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
             <div className="bg-white/60 backdrop-blur-md border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[32px] p-8 text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-white">
                   <Ic n="user" size={24} color="#9333ea" />
                </div>
                <div className="text-[20px] font-black text-slate-800 mb-3 tracking-tight">了解你的保障缺口</div>
                <div className="text-[15px] text-slate-600 font-semibold leading-relaxed max-w-[240px] mx-auto">
                  透過下方保險說明了解你可能缺少什麼，<br/>再預約免費諮詢讓我們幫你分析。
                </div>
             </div>
          </motion.div>
        )}

        {/* Why matters section */}
        <div className="mb-12">
          <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-6 flex items-center justify-center gap-2 uppercase">
             <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
             為什麼需要保險
             <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            {WHY_STATS.map((stat, i) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-start gap-5 py-5 ${i !== WHY_STATS.length - 1 ? 'border-b border-white' : ''}`}>
                <div className="text-[28px] font-black text-[#c084fc] tracking-[-0.04em] shrink-0 w-[60px] leading-none pt-0.5 drop-shadow-sm">{stat.num}</div>
                <div className="text-[14px] text-slate-600 leading-relaxed font-semibold">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insurance Map */}
        <div className="mb-12">
          <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-6 flex items-center justify-center gap-2 uppercase">
            <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
            保險地圖
            <span className="w-1.5 h-1.5 bg-[#9333ea] rounded-full" />
          </div>
          
          <div className="flex flex-col gap-4">
            {DEFENSE_SECTIONS.map((section, i) => {
              const isOpen = openSection === section.id;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={section.id} 
                  className={`bg-white/60 backdrop-blur-md rounded-[28px] transition-all duration-300 overflow-hidden border ${isOpen ? 'border-[#e9d5ff] shadow-[0_10px_40px_rgba(147,51,234,0.1)]' : 'border-white hover:border-[#f3e8ff] shadow-[0_8px_30px_rgba(0,0,0,0.03)]'}`}
                >
                  <div onClick={() => toggleSection(section.id)} className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-white/40' : 'hover:bg-white/40'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors border border-white ${isOpen ? 'bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] shadow-inner' : 'bg-white shadow-sm group-hover:bg-[#f8f5ff]'}`}>
                        <Ic n={section.icon} size={24} color={isOpen ? "#9333ea" : "#94a3b8"} />
                      </div>
                      <div>
                        <div className={`text-[16px] font-black tracking-tight transition-colors ${isOpen ? 'text-[#9333ea]' : 'text-slate-800'}`}>{section.title}</div>
                        <div className="text-[13px] text-slate-500 font-semibold mt-1">{section.desc}</div>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 border border-white ${isOpen ? 'rotate-180 bg-white/80 shadow-sm' : 'bg-white shadow-sm'}`}>
                       <Ic n="arrowRight" size={16} color={isOpen ? "#9333ea" : "#cbd5e1"} />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/30"
                      >
                        <div className="p-6 pt-2 border-t border-white/50">
                           <div className="flex flex-col gap-4 mb-6">
                             {section.points.map((pt, j) => (
                               <div key={j} className="flex gap-3 items-start text-[14px] text-slate-600 leading-relaxed font-semibold">
                                 <div className="w-2 h-2 rounded-full bg-[#c084fc] shrink-0 mt-2 shadow-sm" />
                                 <span>{pt}</span>
                               </div>
                             ))}
                           </div>
                           
                           <div className="bg-gradient-to-br from-[#f8f5ff] to-white border border-[#e9d5ff] rounded-[20px] p-5 relative overflow-hidden shadow-sm">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9333ea]" />
                             <div className="text-[12px] font-black text-[#9333ea] mb-2 pl-2 tracking-widest uppercase flex items-center gap-1.5">
                                <span className="text-[14px]">💡</span> {section.highlightLabel}
                             </div>
                             <div className="text-[14px] text-slate-700 leading-relaxed pl-2 font-black tracking-tight">{section.highlight}</div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 text-center border border-[#e9d5ff] relative overflow-hidden shadow-[0_15px_40px_rgba(147,51,234,0.3)] mb-10">
          <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                <Ic n="user" size={32} color="#fff" />
             </div>
             <div className="text-[24px] font-black text-white mb-3 tracking-tight drop-shadow-sm">免費保障健診</div>
             <div className="text-[15px] text-[#f3e8ff] font-semibold mb-8 leading-relaxed">
               不確定自己保了什麼、缺了什麼？<br/>與我們預約，20分鐘幫你看清楚
             </div>
             
             <a href="https://line.me/R/ti/p/@oosaymoney" target="_blank" rel="noopener noreferrer" className="no-underline flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white w-full py-4.5 rounded-[20px] text-[16px] font-black shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition-transform active:scale-95 hover:scale-[1.02] mb-3">
               <Ic n="star" size={20} color="#fff" /> 加入 LINE 聯繫顧問
             </a>
             <div className="text-[12px] text-[#e9d5ff] font-black tracking-widest uppercase">✨ 免費諮詢 · 無任何推銷壓力</div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};
