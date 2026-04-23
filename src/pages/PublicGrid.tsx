import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  const items = [
    { key:"about",  label:"認識我們", bg:"bg-[#f3e8ff]", text:"text-[#9333ea]", icon:"info",  sub:"財務規劃的起點" },
    { key:"money",  label:"錢都去哪", bg:"bg-[#dcfce7]", text:"text-[#10b981]", icon:"money", sub:"2分鐘財務測驗" },
    { key:"unlock", label:"解鎖更多", bg:"bg-[#fef3c7]", text:"text-[#f59e0b]", icon:"star",  sub:"會員專屬資源" },
  ];
  return (
    <div className="min-h-full pb-10 pt-4 flex flex-col items-center">
      
      {/* Header Greeting */}
      <div className="px-6 pb-6 relative z-10 text-center flex flex-col items-center max-w-sm w-full pt-4">
        <div className="w-20 h-20 bg-white/60 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgba(147,51,234,0.15)] flex items-center justify-center mb-6 border border-white transform rotate-3">
           <Ic n="star" size={40} color="#9333ea" />
        </div>
        <div className="text-[32px] font-black text-slate-800 tracking-tight leading-[1.25] mb-3 relative z-10">
          你好，歡迎來到<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm">OO SAY MONEY</span>
        </div>
        <div className="text-[16px] text-slate-500 font-bold max-w-[260px] mx-auto bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm inline-block">
          加入會員，解鎖專屬理財資源與工具。
        </div>
      </div>
      
      {/* 3-Grid Actions */}
      <div className="px-5 pt-2 grid grid-cols-1 gap-4 max-w-sm w-full relative z-10 pb-4">
        {items.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}
            key={item.key} onClick={() => onSelect(item.key)} 
            className="group px-5 py-5 flex items-center gap-5 cursor-pointer bg-white/60 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(147,51,234,0.1)] hover:border-[#e9d5ff] active:scale-95"
          >
            <div className={`w-[60px] h-[60px] rounded-[20px] ${item.bg} flex items-center justify-center ${item.text} shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-[-5deg] border border-white/50 shrink-0`}>
              <Ic n={item.icon} size={30} color="currentColor" />
            </div>
            <div className="text-left flex-1">
              <div className="text-[18px] font-black text-slate-800 tracking-wide mb-1">{item.label}</div>
              <div className="text-[13px] font-bold text-slate-400">{item.sub}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#f3e8ff] group-hover:text-[#9333ea] transition-colors border border-slate-100 group-hover:border-[#e9d5ff]">
              <Ic n="arrowRight" size={16} color="currentColor" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Registration CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="pt-4 px-5 w-full max-w-sm relative z-10">
        <div className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 flex flex-col justify-center items-center shadow-[0_15px_40px_rgba(147,51,234,0.3)] text-center relative overflow-hidden border border-[#e9d5ff]">
          <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[120px] h-[120px] bg-[#fdf4ff]/40 rounded-full blur-[30px] pointer-events-none" />
          
          <div className="relative z-10 w-full">
            <h3 className="text-[22px] font-black text-white mb-3 tracking-wide text-shadow-sm">開始專屬理財旅程</h3>
            <p className="text-[15px] text-[#faf5ff] font-semibold mb-8 leading-relaxed">紀錄財務、一對一顧問諮詢<br/>與您的客製化理財藍圖。</p>
            <button onClick={() => onSelect("login")} className="w-full bg-white text-[#9333ea] border-0 rounded-[20px] py-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
               前往註冊 / 登入 <Ic n="arrowRight" size={18} color="currentColor" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
