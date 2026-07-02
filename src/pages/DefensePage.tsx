import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import liff from '@line/liff';
import { getLiffIdForPath, authHeaders } from "@/src/constants/liff";

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

  // Coverage data from Notion via lineUserId
  const [coverageData, setCoverageData] = useState(null);
  const [coverageLoading, setCoverageLoading] = useState(true);
  const [lineUserId, setLineUserId] = useState('');

  useEffect(() => {
    const loadCoverage = async () => {
      try {
        const liffId = getLiffIdForPath();
        if (liffId) {
          await liff.init({ liffId });
          if (liff.isLoggedIn()) {
            const p = await liff.getProfile();
            setLineUserId(p.userId || '');
          }
        }
        // 身分由後端依 access token 驗證，只回傳自己的保單
        const res = await fetch('/api/insurance', { headers: authHeaders() });
        if (res.ok) setCoverageData(await res.json());
      } catch (e: any) {
        console.warn('Coverage fetch failed:', e.message);
      } finally {
        setCoverageLoading(false);
      }
    };
    loadCoverage();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };
  
  const isClient = role === "client";
  const activeMember = MOCK_CLIENT_DATA.members[activeMemberIdx];

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10">
      
      <div className="pt-12 pb-10 px-6 relative z-10 w-full max-w-sm mx-auto border-b border-warm-gray-200 mb-8 shrink-0 bg-white">


        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full text-warm-gray-800 mb-6">
             <Ic n="shield" size={28} color="currentColor" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 tracking-wide mb-4">財務防線</h1>
          <p className="text-[14px] text-warm-gray-800/70 font-normal leading-relaxed max-w-[280px] mx-auto tracking-wide">用對的保險守住你最重要的東西，避免突發事件拖垮財務。</p>
        </motion.div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10">
        
        {isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="bg-teal-base p-6 text-white mb-8 rounded-2xl shadow-sm border border-transparent relative overflow-hidden shrink-0">
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-14 h-14 bg-white text-warm-gray-800 flex items-center justify-center font-serif font-bold text-[24px] shrink-0 border border-warm-gray-200 rounded-full">
                   {MOCK_CLIENT_DATA.name.charAt(0)}
                 </div>
                 <div>
                   <div className="font-serif font-bold text-[18px] tracking-wider">{MOCK_CLIENT_DATA.name}，你好 👋</div>
                   <div className="text-[12px] text-warm-gray-200 mt-2 font-normal tracking-widest">家庭共 {MOCK_CLIENT_DATA.members.length} 位成員的保障狀況</div>
                 </div>
               </div>
            </div>

            <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-6 flex items-center justify-center gap-2 uppercase">
               <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
               家庭保障總覽
               <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide snap-x">
              {MOCK_CLIENT_DATA.members.map((m, i) => (
                 <button key={i} onClick={() => setActiveMemberIdx(i)}
                    className={`flex items-center gap-3 px-4 py-3 whitespace-nowrap transition-colors border rounded-full snap-center cursor-pointer ${activeMemberIdx === i ? 'border-teal-base bg-teal-base text-white shadow-md' : 'border-warm-gray-200 bg-white text-warm-gray-600 hover:bg-warm-gray-50 shadow-sm'}`}
                 >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-serif font-bold transition-colors ${activeMemberIdx === i ? 'bg-white text-warm-gray-800' : 'bg-warm-gray-100 text-warm-gray-800'}`}>
                       {m.name.charAt(0)}
                    </div>
                    <span className="text-[13px] tracking-widest">{m.label}</span>
                    {m.type === 'child' && (
                       <span className={`text-[11px] px-2 py-0.5 font-medium ml-1 ${activeMemberIdx === i ? 'bg-[#49405E] text-white' : 'bg-[#EAEAE6] text-warm-gray-800/80'}`}>{m.age}歲</span>
                    )}
                 </button>
              ))}
            </div>

            <div className="bg-white p-6 border border-warm-gray-200 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-2 gap-4 mb-8">
                 {activeMember.coverage.map((item, i) => {
                    const statusMap: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
                        ok: { icon: "✓", textColor: "text-warm-gray-800", bgClass: "bg-warm-gray-100", borderClass: "border-teal-base" },
                        gap: { icon: "!", textColor: "text-warm-gray-600", bgClass: "bg-warm-gray-50", borderClass: "border-[#8B8A88]" },
                        none: { icon: "✕", textColor: "text-warm-gray-800/80", bgClass: "bg-[#EAEAE6]", borderClass: "border-[#555]" },
                        unknown: { icon: "?", textColor: "text-warm-gray-400", bgClass: "bg-white", borderClass: "border-warm-gray-200" }
                    };
                    const status = statusMap[item.status] || statusMap.unknown;
                    return (
                       <div key={i} className={`p-4 border-l-[3px] bg-warm-gray-50 ${status.borderClass}`}>
                          <div className="text-[10px] font-medium text-warm-gray-600 mb-3 tracking-[0.2em] uppercase">{item.label}</div>
                          <div className={`text-[13px] font-medium flex items-center gap-2 mb-3 tracking-wider ${status.textColor}`}>
                            {item.detail}
                          </div>
                          {item.note && <div className="text-[12px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">{item.note}</div>}
                       </div>
                    )
                 })}
              </div>
              
              <div className="flex flex-col gap-4 mt-2 border-t border-warm-gray-200 pt-6">
                 <div className="flex items-center justify-between text-[12px] font-normal text-warm-gray-600 tracking-widest uppercase">
                    <div className="flex items-center gap-2">負責顧問: <span className="text-warm-gray-800 font-medium">{MOCK_CLIENT_DATA.advisor}</span></div>
                 </div>
                 <div className="text-[10px] text-warm-gray-400 font-normal tracking-widest uppercase mt-2">
                   最後更新: {MOCK_CLIENT_DATA.updated}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guest View Notice */}
        {!isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
             <div className="bg-white border border-warm-gray-200 p-10 text-center relative overflow-hidden rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-warm-gray-100 flex items-center justify-center mx-auto mb-6 border border-warm-gray-200">
                   <Ic n="user" size={24} color="#2D2D2A" />
                </div>
                <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-4 tracking-widest">了解你的保障缺口</div>
                <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose max-w-[240px] mx-auto tracking-wide">
                  透過下方保險說明了解你可能缺少什麼，<br/>再預約免費諮詢讓我們幫你分析。
                </div>
             </div>
          </motion.div>
        )}

        {/* Why matters section */}
        <div className="mb-12">
          <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-8 flex items-center justify-center gap-2 uppercase">
             <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
             為什麼需要保險
             <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
          </div>
          <div className="bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm">
            {WHY_STATS.map((stat, i) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-start gap-6 py-6 ${i !== WHY_STATS.length - 1 ? 'border-b border-warm-gray-200' : ''}`}>
                <div className="text-[24px] font-serif font-bold text-warm-gray-800 tracking-widest shrink-0 w-[60px] leading-none pt-1">{stat.num}</div>
                <div className="text-[13px] text-warm-gray-800/80 leading-loose font-normal tracking-wide">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insurance Map */}
        <div className="mb-14">
          <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-8 flex items-center justify-center gap-2 uppercase">
            <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
            保險地圖
            <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
          </div>
          
          <div className="flex flex-col gap-4">
            {DEFENSE_SECTIONS.map((section, i) => {
              const isOpen = openSection === section.id;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={section.id} 
                  className={`bg-white rounded-2xl transition-colors duration-300 overflow-hidden border ${isOpen ? 'border-teal-base' : 'border-warm-gray-200 hover:border-warm-gray-300'}`}
                >
                  <div onClick={() => toggleSection(section.id)} className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-warm-gray-50' : 'hover:bg-warm-gray-50'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors border ${isOpen ? 'bg-teal-base text-white border-transparent' : 'bg-warm-gray-100 text-warm-gray-800 border-warm-gray-200'}`}>
                        <Ic n={section.icon} size={20} color="currentColor" />
                      </div>
                      <div>
                        <div className={`text-[14px] font-medium tracking-widest transition-colors ${isOpen ? 'text-warm-gray-800' : 'text-warm-gray-800'}`}>{section.title}</div>
                        <div className="text-[12px] text-warm-gray-600 font-normal mt-1.5 tracking-wide">{section.desc}</div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 text-warm-gray-800' : 'text-warm-gray-600'}`}>
                       <Ic n="arrowRight" size={16} color="currentColor" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-warm-gray-50"
                      >
                        <div className="p-6 pt-0 border-t border-warm-gray-200 mt-2">
                           <div className="flex flex-col gap-4 mb-8 pt-6">
                             {section.points.map((pt, j) => (
                               <div key={j} className="flex gap-4 items-start text-[13px] text-warm-gray-800/80 leading-loose font-normal tracking-wide">
                                 <div className="w-1.5 h-1.5 bg-[#AFAEA9] shrink-0 mt-2.5" />
                                 <span>{pt}</span>
                               </div>
                             ))}
                           </div>
                           
                           <div className="bg-white border border-warm-gray-200 p-5 relative overflow-hidden rounded-2xl shadow-sm">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-base" />
                             <div className="text-[10px] font-medium text-warm-gray-800 mb-3 pl-3 tracking-widest uppercase flex items-center gap-2">
                                <span className="text-[12px]">💡</span> {section.highlightLabel}
                             </div>
                             <div className="text-[13px] text-warm-gray-800/80 leading-loose pl-3 font-medium tracking-wider italic">{section.highlight}</div>
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
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full max-w-sm mx-auto bg-warm-gray-50 p-10 text-center border border-warm-gray-200 relative overflow-hidden mb-10 shrink-0">
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-6 border border-warm-gray-200 rounded-full">
                <Ic n="user" size={24} color="#2D2D2A" />
             </div>
             <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-4 tracking-widest">免費保障健診</div>
             <div className="text-[13px] text-warm-gray-800/80 font-normal mb-8 leading-loose tracking-wide">
               不確定自己保了什麼、缺了什麼？<br/>與我們預約，20分鐘幫你看清楚
             </div>
             
             <button onClick={() => window.open('https://line.me/R/ti/p/@oosaymoney', '_blank')} className="no-underline flex items-center justify-center gap-3 bg-teal-base text-white w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-cyan-base cursor-pointer border border-transparent uppercase mb-6 rounded-2xl shadow-sm">
               <Ic n="star" size={16} color="currentColor" /> 加入 LINE 聯繫顧問
             </button>
             <div className="text-[10px] text-warm-gray-600 font-normal tracking-[0.2em] uppercase">✨ 免費諮詢 · 無推銷壓力</div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};
