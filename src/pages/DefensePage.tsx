import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import liff from '@line/liff';

const DEFENSE_SECTIONS = [

  {
    id: "life",
    icon: "user",
    title: "å£½éª Â· æå¤éª",
    desc: "å®¶äººçæå¾ä¸éé²ç·",
    points: [
      "å£½éªæä¾èº«æä¿éï¼ç¢ºä¿è¬ä¸ç¼çæå¤ï¼å®¶äººççæ´»ä¸æå æ­¤å´©æ½°",
      "æå¤éªéå°æå¤å·äº¡ãå¤±è½æä¾ä¿éï¼ä¿è²»ç¸å°ä½å»ä½ä¿é¡é«",
      "å®æå£½éª vs çµèº«å£½éªï¼å¹´è¼æç¨å®æå£½éªä»¥ä½ä¿è²»æé«ä¿é¡ï¼æ¯æåç®çé¸æ",
      "å¤±è½æ¶å©éªè¿å¹´éæ±å¤§å¢ï¼é·æå¤±è½å¸¶ä¾çè²¡åè¡æå¾å¾æ¯æ­»äº¡æ´å¤§"
    ],
    highlightLabel: "Steven & Annie çè§é»",
    highlight: "æå®¶åº­è² æçäººï¼å£½éªä¿é¡è³å°è¦è½è¦è 5â10 å¹´çå®¶åº­æ¯åºï¼æç®çæ­£æä¿éã"
  },
  {
    id: "medical",
    icon: "trend",
    title: "é«çéª Â· éå¤§ç¾ç",
    desc: "å¥è®ççæå®è²¡å",
    points: [
      "å¯¦æ¯å¯¦ä»é«çéªï¼ä½é¢ãæè¡è²»ç¨ç´æ¥çè³ ï¼æ¯ç¾ä»£é«çä¿éçæ ¸å¿",
      "éå¤§å·çéªï¼ä¸æ¦ç¢ºè¨ºéå¤§å·çï¼ç´æ¥ä¸æ¬¡çµ¦ä»ï¼è®ä½ å°å¿æ²»çä¸å¿æå¿è²»ç¨",
      "ççéªï¼å°ç£ççç¼ççé«ï¼èªè²»æ°è¥ãæ¨é¶æ²»çåè¼ç¾è¬ï¼ççéªæ¯ä¸å¯æç¼ºçè£å",
      "æ¥é¡å vs å¯¦æ¯åï¼å¯¦æ¯åéå¸¸æ´å¯¦ç¨ï¼æ¥é¡åå¯ä½çºé¡å¤çæ´»è£è²¼"
    ],
    highlightLabel: "å¸¸è¦èª¤å",
    highlight: "åªæå¥ä¿ä¸å¤ ãå¥ä¿çµ¦ä»æ¯åºæ¬æ¬¾ï¼èªè²»é ç®éå¹´å¢å ï¼æ²æè£åé«çéªï¼ä½ä¸æ¬¡é¢å¯è½å°±æç©ºå²èã"
  },
  {
    id: "investment",
    icon: "chart",
    title: "æè³åä¿å®",
    desc: "ä¿éèçè²¡å¼é¡§ï¼ä½è¦çæ¸æ¥",
    points: [
      "æè³åä¿å®å¼å·å£½éªä¿éèæè³åè½ï¼ä¿è²»åçºä¿éè²»ç¨èæè³å¸³æ¶å©é¨å",
      "è®é¡å£½éªï¼æè³æ¨çé£çµåºéï¼å ±é¬æµ®åï¼é©åé¡ææ¿æé¢¨éªãé·ææè³çäºº",
      "å©çè®ååå£½éªï¼å®£åå©çé«æ¼å®å­ï¼é©åè¿½æ±ç©©å¥æ¶ççä¿å®åæè³äºº",
      "æ³¨æè²»ç¨çµæ§ï¼åç½®è²»ç¨ãä¿å®ç®¡çè²»ãå±éªä¿è²»æå½±é¿å¯¦éå ±é¬ï¼è¦çæ¸æ¥"
    ],
    highlightLabel: "æåçå»ºè­°",
    highlight: "æè³åä¿å®ä¸æ¯ææäººé½é©åï¼è¦åç¢ºä¿åºç¤ä¿éå°ä½ï¼åèæ®æ¯å¦ç´å¥è³ç¢éç½®ã"
  },
  {
    id: "property",
    icon: "shield",
    title: "ç¢éª Â· è»éª Â· æééª",
    desc: "æ¥å¸¸çæ´»çé¢¨éªè½ç§»",
    points: [
      "å¼·å¶éªæ¯æ³å®æä½éæª»ï¼ç¬¬ä¸äººè²¬ä»»éªææ¯çæ­£ä¿è­·ä½ è·åçééµ",
      "è»é«éªï¼ç²å¼ï¼å¨éªï¼ãä¹å¼ãä¸å¼åæé©ç¨æå¢ï¼ä¸æ¯è¶è²´è¶å¥½",
      "æéå¹³å®éªï¼åºåå¿åï¼é«çè²»ç¨ãç·æ¥æ¤é¢è²»ç¨åè¼æ¸åè¬ï¼ä¸è½ç",
      "ç«éª / ä½å®ç¶åéªï¼æ¿è²¸æéå¸¸åªä¿éè¡è¦æ±çç«éªï¼å®¤å§è£æ½¢ãå®¶å·å¦éè£å"
    ],
    highlightLabel: "åºç¼åè¨å¾",
    highlight: "ä¿¡ç¨å¡éè´çæééªä¿éæéï¼ä¸éå·å¡è³¼è²·æ©ç¥¨æçæãåºååç¢ºèªä¿éå§å®¹ï¼ä¸è¦ç­å°åºäºæç¼ç¾æ²ä¿å°ã"
  }
];

const WHY_STATS = [
  { num: "1/3", text: "å°ç£äººä¸çä¸­ç½¹æ£éå¤§ç¾ççæ©çè¶éä¸åä¹ä¸ï¼é«çè²»ç¨åè¼ç¾è¬èµ·è·³" },
  { num: "76%", text: "ä¸ç­æä¿éªä¿éå´éä¸è¶³ï¼å¤æ¸äººåªé åä¿ãå¥ä¿æèä¸å" },
  { num: "20å¹´", text: "ä¸å¼µè²·é¯çä¿å®ï¼äºåå¹´å¾å¯è½è®ä½ å¤è±æ¸åè¬ãå»ä»éº¼é½æ²ä¿å°" }
];

const MOCK_CLIENT_DATA = {
  name: "æå°è¯",
  advisor: "Steven & Annie",
  updated: "2026/04/15",
  members: [
    {
      name: "æå°è¯",
      label: "æ¬äºº",
      type: "adult",
      coverage: [
        { label: "å£½éªä¿é", detail: "è¶³å¤ ", status: "ok", note: "ä¿é¡ 1,000 è¬" },
        { label: "å¯¦æ¯å¯¦ä»", detail: "ç¼ºå£", status: "gap", note: "é¡åº¦åä½ï¼å»ºè­°è£å¼·ç¬¬äºå®¶" },
        { label: "éå¤§ç¾ç", detail: "æ¥µç¼º", status: "none", note: "å®å¨ç¡ä¿éï¼é¢¨éªæ¥µé«" },
        { label: "è»éª/ç¢éª", detail: "æªç¥", status: "unknown", note: "å°æªå¯å¥ä¿å®" }
      ]
    },
    {
      name: "çå¤§æ",
      label: "éå¶",
      type: "adult",
      coverage: [
        { label: "å£½éªä¿é", detail: "éè£è¶³", status: "gap", note: "æ¿è²¸å¢é·ï¼å»ºè­°è£å¼·å®æå£½éª" },
        { label: "å¯¦æ¯å¯¦ä»", detail: "è¶³å¤ ", status: "ok", note: "éå¯¦æ¯ä¿éå®æ´" },
        { label: "éå¤§ç¾ç", detail: "è¶³å¤ ", status: "ok", note: "ä¿é¡ 200 è¬" },
      ]
    },
    {
      name: "æå°å¯¶",
      label: "å­å¥³",
      type: "child",
      age: 3,
      coverage: [
        { label: "å¯¦æ¯å¯¦ä»", detail: "è¶³å¤ ", status: "ok", note: "æ°çåä¿å®å®æ´" },
        { label: "æå¤ä¿é", detail: "è¶³å¤ ", status: "ok", note: "æå¤é«çå®æ´" },
      ]
    }
  ]
};

const STATUS_MAP: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
  ok: { icon: "â", textColor: "text-emerald-600", bgClass: "bg-emerald-100", borderClass: "border-emerald-500" },
  gap: { icon: "!", textColor: "text-amber-500", bgClass: "bg-amber-100", borderClass: "border-amber-400" },
  none: { icon: "â", textColor: "text-rose-500", bgClass: "bg-rose-100", borderClass: "border-rose-400" },
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
        let uid = '';
        const liffId = import.meta?.env?.VITE_LIFF_ID || '';
        if (liffId) {
          await liff.init({ liffId });
          if (liff.isLoggedIn()) {
            const p = await liff.getProfile();
            uid = p.userId || '';
            setLineUserId(uid);
          }
        }
        const url = '/.netlify/functions/get-coverage' + (uid ? '?lineUserId=' + uid : '');
        const res = await fetch(url);
        if (res.ok) setCoverageData(await res.json());
      } catch (e) {
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
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="bg-white border border-warm-gray-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors hover:bg-warm-gray-100 shadow-sm">
            <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
          </button>
          <div className="text-[11px] font-medium text-warm-gray-800 tracking-[0.2em] uppercase">OO SAY MONEY</div>
          <div className="w-10" />
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full text-warm-gray-800 mb-6">
             <Ic n="shield" size={28} color="currentColor" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 tracking-wide mb-4">è²¡åé²ç·</h1>
          <p className="text-[14px] text-warm-gray-800/70 font-normal leading-relaxed max-w-[280px] mx-auto tracking-wide">ç¨å°çä¿éªå®ä½ä½ æéè¦çæ±è¥¿ï¼é¿åçªç¼äºä»¶æå®è²¡åã</p>
        </motion.div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10">
        
        {isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="bg-[#2D2D2A] p-6 text-[#FFFFFF] mb-8 border border-transparent relative overflow-hidden shrink-0">
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-14 h-14 bg-[#FFFFFF] text-[#2D2D2A] flex items-center justify-center font-serif font-bold text-[24px] shrink-0 border border-[#EAEAE6]">
                   {MOCK_CLIENT_DATA.name.charAt(0)}
                 </div>
                 <div>
                   <div className="font-serif font-bold text-[18px] tracking-wider">{MOCK_CLIENT_DATA.name}ï¼ä½ å¥½ ð</div>
                   <div className="text-[12px] text-[#D6D3D1] mt-2 font-normal tracking-widest">å®¶åº­å± {MOCK_CLIENT_DATA.members.length} ä½æå¡çä¿éçæ³</div>
                 </div>
               </div>
            </div>

            <div className="text-[10px] font-medium text-[#2D2D2A] tracking-[0.2em] mb-6 flex items-center justify-center gap-2 uppercase">
               <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
               å®¶åº­ä¿éç¸½è¦½
               <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide snap-x">
              {MOCK_CLIENT_DATA.members.map((m, i) => (
                 <button key={i} onClick={() => setActiveMemberIdx(i)}
                    className={`flex items-center gap-3 px-4 py-3 whitespace-nowrap transition-colors border snap-center cursor-pointer ${activeMemberIdx === i ? 'border-[#2D2D2A] bg-[#2D2D2A] text-[#FFFFFF]' : 'border-[#EAEAE6] bg-[#FFFFFF] text-[#8B8A88] hover:bg-[#F9F9F8]'}`}
                 >
                    <div className={`w-6 h-6 flex items-center justify-center text-[12px] font-serif font-bold transition-colors ${activeMemberIdx === i ? 'bg-[#FFFFFF] text-[#2D2D2A]' : 'bg-[#F2F2F0] text-[#2D2D2A]'}`}>
                       {m.name.charAt(0)}
                    </div>
                    <span className="text-[13px] tracking-widest">{m.label}</span>
                    {m.type === 'child' && (
                       <span className={`text-[11px] px-2 py-0.5 font-medium ml-1 ${activeMemberIdx === i ? 'bg-[#49405E] text-[#FFFFFF]' : 'bg-[#EAEAE6] text-[#555]'}`}>{m.age}æ­²</span>
                    )}
                 </button>
              ))}
            </div>

            <div className="bg-[#FFFFFF] p-6 border border-[#EAEAE6] relative overflow-hidden">
              <div className="grid grid-cols-2 gap-4 mb-8">
                 {activeMember.coverage.map((item, i) => {
                    const statusMap: Record<string, { icon: string, textColor: string, bgClass: string, borderClass: string }> = {
                        ok: { icon: "â", textColor: "text-[#2D2D2A]", bgClass: "bg-[#F2F2F0]", borderClass: "border-[#2D2D2A]" },
                        gap: { icon: "!", textColor: "text-[#8B8A88]", bgClass: "bg-[#F9F9F8]", borderClass: "border-[#8B8A88]" },
                        none: { icon: "â", textColor: "text-[#555]", bgClass: "bg-[#EAEAE6]", borderClass: "border-[#555]" },
                        unknown: { icon: "?", textColor: "text-[#AFAEA9]", bgClass: "bg-[#FFFFFF]", borderClass: "border-[#EAEAE6]" }
                    };
                    const status = statusMap[item.status] || statusMap.unknown;
                    return (
                       <div key={i} className={`p-4 border-l-[3px] bg-[#F9F9F8] ${status.borderClass}`}>
                          <div className="text-[10px] font-medium text-[#8B8A88] mb-3 tracking-[0.2em] uppercase">{item.label}</div>
                          <div className={`text-[13px] font-medium flex items-center gap-2 mb-3 tracking-wider ${status.textColor}`}>
                            {item.detail}
                          </div>
                          {item.note && <div className="text-[12px] text-[#555] font-normal leading-loose tracking-wide">{item.note}</div>}
                       </div>
                    )
                 })}
              </div>
              
              <div className="flex flex-col gap-4 mt-2 border-t border-[#EAEAE6] pt-6">
                 <div className="flex items-center justify-between text-[12px] font-normal text-[#8B8A88] tracking-widest uppercase">
                    <div className="flex items-center gap-2">è² è²¬é¡§å: <span className="text-[#2D2D2A] font-medium">{MOCK_CLIENT_DATA.advisor}</span></div>
                 </div>
                 <div className="text-[10px] text-[#AFAEA9] font-normal tracking-widest uppercase mt-2">
                   æå¾æ´æ°: {MOCK_CLIENT_DATA.updated}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guest View Notice */}
        {!isClient && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
             <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-10 text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-[#F2F2F0] flex items-center justify-center mx-auto mb-6 border border-[#EAEAE6]">
                   <Ic n="user" size={24} color="#2D2D2A" />
                </div>
                <div className="text-[20px] font-serif font-bold text-[#2D2D2A] mb-4 tracking-widest">äºè§£ä½ çä¿éç¼ºå£</div>
                <div className="text-[13px] text-[#555] font-normal leading-loose max-w-[240px] mx-auto tracking-wide">
                  ééä¸æ¹ä¿éªèªªæäºè§£ä½ å¯è½ç¼ºå°ä»éº¼ï¼<br/>åé ç´åè²»è«®è©¢è®æåå¹«ä½ åæã
                </div>
             </div>
          </motion.div>
        )}

        {/* Why matters section */}
        <div className="mb-12">
          <div className="text-[10px] font-medium text-[#2D2D2A] tracking-[0.2em] mb-8 flex items-center justify-center gap-2 uppercase">
             <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
             çºä»éº¼éè¦ä¿éª
             <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
          </div>
          <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-6">
            {WHY_STATS.map((stat, i) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-start gap-6 py-6 ${i !== WHY_STATS.length - 1 ? 'border-b border-[#EAEAE6]' : ''}`}>
                <div className="text-[24px] font-serif font-bold text-[#2D2D2A] tracking-widest shrink-0 w-[60px] leading-none pt-1">{stat.num}</div>
                <div className="text-[13px] text-[#555] leading-loose font-normal tracking-wide">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insurance Map */}
        <div className="mb-14">
          <div className="text-[10px] font-medium text-[#2D2D2A] tracking-[0.2em] mb-8 flex items-center justify-center gap-2 uppercase">
            <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
            ä¿éªå°å
            <span className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full" />
          </div>
          
          <div className="flex flex-col gap-4">
            {DEFENSE_SECTIONS.map((section, i) => {
              const isOpen = openSection === section.id;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={section.id} 
                  className={`bg-[#FFFFFF] transition-colors duration-300 overflow-hidden border ${isOpen ? 'border-[#2D2D2A]' : 'border-[#EAEAE6] hover:border-[#D6D3D1]'}`}
                >
                  <div onClick={() => toggleSection(section.id)} className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-[#F9F9F8]' : 'hover:bg-[#F9F9F8]'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 flex items-center justify-center shrink-0 transition-colors border ${isOpen ? 'bg-[#2D2D2A] text-[#FFFFFF] border-transparent' : 'bg-[#F2F2F0] text-[#2D2D2A] border-[#EAEAE6]'}`}>
                        <Ic n={section.icon} size={20} color="currentColor" />
                      </div>
                      <div>
                        <div className={`text-[14px] font-medium tracking-widest transition-colors ${isOpen ? 'text-[#2D2D2A]' : 'text-[#2D2D2A]'}`}>{section.title}</div>
                        <div className="text-[12px] text-[#8B8A88] font-normal mt-1.5 tracking-wide">{section.desc}</div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#2D2D2A]' : 'text-[#8B8A88]'}`}>
                       <Ic n="arrowRight" size={16} color="currentColor" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F9F9F8]"
                      >
                        <div className="p-6 pt-0 border-t border-[#EAEAE6] mt-2">
                           <div className="flex flex-col gap-4 mb-8 pt-6">
                             {section.points.map((pt, j) => (
                               <div key={j} className="flex gap-4 items-start text-[13px] text-[#555] leading-loose font-normal tracking-wide">
                                 <div className="w-1.5 h-1.5 bg-[#AFAEA9] shrink-0 mt-2.5" />
                                 <span>{pt}</span>
                               </div>
                             ))}
                           </div>
                           
                           <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-5 relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2D2D2A]" />
                             <div className="text-[10px] font-medium text-[#2D2D2A] mb-3 pl-3 tracking-widest uppercase flex items-center gap-2">
                                <span className="text-[12px]">ð¡</span> {section.highlightLabel}
                             </div>
                             <div className="text-[13px] text-[#555] leading-loose pl-3 font-medium tracking-wider italic">{section.highlight}</div>
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
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full max-w-sm mx-auto bg-[#F9F9F8] p-10 text-center border border-[#EAEAE6] relative overflow-hidden mb-10 shrink-0">
          <div className="relative z-10">
             <div className="w-16 h-16 bg-[#FFFFFF] flex items-center justify-center mx-auto mb-6 border border-[#EAEAE6]">
                <Ic n="user" size={24} color="#2D2D2A" />
             </div>
             <div className="text-[20px] font-serif font-bold text-[#2D2D2A] mb-4 tracking-widest">åè²»ä¿éå¥è¨º</div>
             <div className="text-[13px] text-[#555] font-normal mb-8 leading-loose tracking-wide">
               ä¸ç¢ºå®èªå·±ä¿äºä»éº¼ãç¼ºäºä»éº¼ï¼<br/>èæåé ç´ï¼20åéå¹«ä½ çæ¸æ¥
             </div>
             
             <button onClick={() => window.open('https://line.me/R/ti/p/@oosaymoney', '_blank')} className="no-underline flex items-center justify-center gap-3 bg-[#2D2D2A] text-[#FFFFFF] w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-[#49405E] cursor-pointer border border-transparent uppercase mb-6">
               <Ic n="star" size={16} color="currentColor" /> å å¥ LINE è¯ç¹«é¡§å
             </button>
             <div className="text-[10px] text-[#8B8A88] font-normal tracking-[0.2em] uppercase">â¨ åè²»è«®è©¢ Â· ç¡æ¨é·å£å</div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};
