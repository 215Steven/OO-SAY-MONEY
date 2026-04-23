import { Ic, IconName } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useLiff } from "@/src/hooks/useLiff";

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

// 覆蓋資料型別
interface CoverageItem { label: string; detail: string; status: string; note?: string; }
interface Member { name: string; label: string; type: string; age?: number; coverage: CoverageItem[]; }
interface ClientData { name: string; advisor: string; updated: string; members: Member[]; }

const STATUS_MAP: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
  ok: { icon: "✓", textColor: "text-emerald-600", bgClass: "bg-emerald-100", borderClass: "border-emerald-500" },
  gap: { icon: "!", textColor: "text-amber-500", bgClass: "bg-amber-100", borderClass: "border-amber-400" },
  none: { icon: "✕", textColor: "text-rose-500", bgClass: "bg-rose-100", borderClass: "border-rose-400" },
  unknown: { icon: "?", textColor: "text-slate-400", bgClass: "bg-slate-200", borderClass: "border-slate-300" }
};

export const DefensePage = ({ onBack, role }: { onBack: () => void, role?: string | null }) => {
  const { profile: liffProfile, loading: liffLoading } = useLiff();
  const [openSection, setOpenSection] = useState<string | null>("life");
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [coverageLoading, setCoverageLoading] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  // 有 userId 才查 Notion
  useEffect(() => {
    if (!liffProfile?.userId) return;
    setCoverageLoading(true);
    fetch(`/.netlify/functions/get-coverage?userId=${encodeURIComponent(liffProfile.userId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.found && data.members?.length) {
          setClientData({
            name:    data.members[0].name ?? liffProfile.displayName,
            advisor: data.advisor ?? "",
            updated: data.updated ?? "",
            members: data.members,
          });
        }
      })
      .catch(() => {})
      .finally(() => setCoverageLoading(false));
  }, [liffProfile?.userId]);

  const isClient = role === "client" || !!clientData;
  const activeMember = clientData?.members[activeMemberIdx];

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">
      {/* Header and Hero - Modern Sleek Style */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 px-6 pt-10 pb-12 relative overflow-hidden rounded-b-[32px] shadow-sm mb-6">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-[40px] -right-[40px] w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <button onClick={onBack} className="bg-white/10 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer transition-colors hover:bg-white/20">
            <Ic n="back" color="#fff" size={18} />
          </button>
          <div className="text-[11px] font-bold text-amber-400/80 tracking-[0.14em] uppercase">OO SAY MONEY</div>
          <div className="w-9" />
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
               <Ic n="shield" size={20} color="#fff" />
            </div>
            <h1 className="text-[26px] font-extrabold text-white tracking-[-0.03em]">財務防線</h1>
          </div>
          <p className="text-[14px] text-indigo-100/80 font-medium leading-relaxed max-w-[280px]">用對的保險，守住你最重要的東西，避免突發事件拖垮財務。</p>
        </motion.div>
      </div>

      <div className="px-5">
        
        {/* Loading skeleton */}
        {(liffLoading || coverageLoading) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm mb-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse space-y-2">
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Client coverage view */}
        {isClient && !coverageLoading && !liffLoading && clientData && activeMember && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[20px] p-5 shadow-lg shadow-indigo-900/10 text-white mb-6 border border-indigo-800">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-indigo-950 font-extrabold text-[20px] shadow-sm shrink-0">
                   {clientData.name.charAt(0)}
                 </div>
                 <div>
                   <div className="font-extrabold text-[17px] tracking-[-0.01em]">{clientData.name}，你好 👋</div>
                   <div className="text-[13px] text-indigo-200/80 mt-0.5 font-medium">家庭共 {clientData.members.length} �成員的保障狀況</div>
                 </div>
               </div>
            </div>

            <div className="text-[12px] font-extrabold text-slate-400 tracking-[0.1em] mb-4 flex items-center gap-2 uppercase">
               <span className="w-1 h-3 bg-emerald-500 rounded-full" />
               家庭保障總覽
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {clientData.members.map((m, i) => (
                 <button key={i} onClick={() => setActiveMemberIdx(i)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full whitespace-nowrap transition-all border ${activeMemberIdx === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm shadow-indigo-500/10 scale-[1.02]' : 'border-slate-200 bg-white text-slate-500 font-medium hover:bg-slate-50 active:scale-95'}`}
                 >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${activeMemberIdx === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                       {m.name.charAt(0)}
                    </div>
                    <span className="text-[13px] tracking-tight">{m.label}</span>
                    {m.type === 'child' && (
                       <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ml-1 ${activeMemberIdx === i ? 'bg-indigo-200 text-indigo-800' : 'bg-purple-100 text-purple-600'}`}>{m.age}歲</span>
                    )}
                 </button>
              ))}
            </div>

            <div className="bg-white rounded-[24px] p-4 shadow-sm shadow-slate-200/50 border border-slate-100">
              <div className="grid grid-cols-2 gap-3 mb-4">
                 {activeMember.coverage.map((item, i) => {
                    const status = STATUS_MAP[item.status] ?? STATUS_MAP.unknown;
                    return (
                       <div key={i} className={`rounded-xl p-3 border-l-[3px] bg-slate-50/50 ${status.borderClass}`}>
                          <div className="text-[11px] font-bold text-slate-400/80 mb-1.5 tracking-wide">{item.label}</div>
                          <div className={`text-[14px] font-extrabold flex items-center gap-1.5 ${status.textColor}`}>
                            <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-bold leading-none ${status.bgClass} ${status.textColor}`}>{status.icon}</span>
                            {item.detail}
                          </div>
                          {item.note && <div className="text-[11px] text-slate-500 mt-1.5 leading-snug font-medium line-clamp-2">{item.note}</div>}
                       </div>
                    )
                 })}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                 <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-500 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100/50">
                    <div className="flex items-center gap-1.5">負責顧問: <span className="text-amber-600 font-extrabold">{clientData.advisor}</span></div>
                 </div>
                 <div className="text-right text-[10px] text-slate-300 font-medium tracking-wider uppercase">
                   最後更新: {clientData.updated}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guest View Notice */}
        {!isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
             <div className="bg-white border border-slate-100 shadow-sm shadow-slate-200/50 rounded-[20px] p-6 text-center">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Ic n="user" size={20} color="#4f46e5" />
                </div>
                <div className="text-[16px] font-extrabold text-slate-900 mb-1.5 tracking-tight">了解你的保障缺口</div>
                <div className="text-[13px] text-slate-500 font-medium leading-relaxed">
                  透過下方保險說明了解你可能缺少什麼，<br/>再預約免費諮詢讓我們幫你分析。
                </div>
             </div>
          </motion.div>
        )}

        {/* Why matters section */}
        <div className="mb-8">
          <div className="text-[12px] font-extrabold text-slate-400 tracking-[0.1em] mb-4 flex items-center gap-2 uppercase">
             <span className="w-1 h-3 bg-indigo-500 rounded-full" />
             為什麼需要保險
          </div>
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm shadow-slate-200/50">
            {WHY_STATS.map((stat, i) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-start gap-4 py-3.5 ${i !== WHY_STATS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="text-[24px] font-extrabold text-indigo-600 tracking-[-0.04em] shrink-0 w-[52px] leading-none pt-0.5">{stat.num}</div>
                <div className="text-[13px] text-slate-600 leading-relaxed font-medium">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insurance Map */}
        <div className="mb-8">
          <div className="text-[12px] font-extrabold text-slate-400 tracking-[0.1em] mb-4 flex items-center gap-2 uppercase">
            <span className="w-1 h-3 bg-amber-500 rounded-full" />
            保險地圖
          </div>
          
          <div className="flex flex-col gap-3">
            {DEFENSE_SECTIONS.map((section, i) => {
              const isOpen = openSection === section.id;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={section.id} 
                  className={`bg-white rounded-[20px] shadow-sm transition-all duration-300 overflow-hidden border ${isOpen ? 'border-indigo-200 shadow-indigo-100' : 'border-slate-100 hover:border-slate-200 shadow-slate-200/50'}`}
                >
                  <div onClick={() => toggleSection(section.id)} className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50/50'}`}>
                        <Ic n={section.icon} size={20} color={isOpen ? "#4f46e5" : "#64748b"} />
                      </div>
                      <div>
                        <div className={`text-[15px] font-extrabold tracking-[-0.01em] transition-colors ${isOpen ? 'text-indigo-900' : 'text-slate-900'}`}>{section.title}</div>
                        <div className="text-[12px] text-slate-500 font-medium mt-0.5">{section.desc}</div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50' : 'bg-slate-50'}`}>
                       <Ic n="arrowRight" size={12} color={isOpen ? "#4f46e5" : "#cbd5e1"} />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50"
                      >
                        <div className="p-5 pt-2 border-t border-slate-100">
                           <div className="flex flex-col gap-3 mb-5">
                             {section.points.map((pt, j) => (
                               <div key={j} className="flex gap-2.5 items-start text-[13px] text-slate-600 leading-relaxed font-medium">
                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                                 <span>{pt}</span>
                               </div>
                             ))}
                           </div>
                           
                           <div className="bg-indigo-50/80 border border-indigo-100/60 rounded-xl p-3.5 relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                             <div className="text-[12px] font-extrabold text-indigo-800 mb-1 pl-1">💡 {section.highlightLabel}</div>
                             <div className="text-[13px] text-indigo-900/80 leading-relaxed pl-1 font-medium">{section.highlight}</div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[24px] p-6 text-center border border-indigo-900/50 relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
             <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ic n="user" size={24} color="#fcd34d" />
             </div>
             <div className="text-[18px] font-extrabold text-white mb-2 tracking-[-0.02em]">免費保障健診</div>
             <div className="text-[13px] text-indigo-200/80 font-medium mb-5 leading-relaxed">
               不確定自己保了什麼、缺了什麼？<br/>與我們預約，20分鐘幫你看清楚
             </div>
             
             <a href="https://line.me/R/ti/p/@oosaymoney" target="_blank" rel="noopener noreferrer" className="no-underline flex items-center justify-center gap-2 bg-[#06C755] text-white w-full py-4 rounded-[16px] text-[15px] font-extrabold shadow-lg shadow-[#06C755]/20 transition-transform active:scale-[0.98] mb-3">
               <Ic n="star" size={16} color="#fff" /> 加入 LINE 聯繫顧問
             </a>
             <div className="text-[11px] text-indigo-300/60 font-medium">✨ 免費諮詢 · 無任何推銷壓力</div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};
