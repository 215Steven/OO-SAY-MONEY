import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  const items = [
    { key:"about",  label:"認識我們", bg:"bg-indigo-600", icon:"info",  sub:"財務規劃的起點" },
    { key:"money",  label:"錢都去哪", bg:"bg-emerald-600", icon:"money", sub:"2分鐘財務測驗" },
    { key:"unlock", label:"解鎖更多", bg:"bg-amber-500", icon:"star",  sub:"會員專屬資源" },
  ];
  return (
    <div className="min-h-full pb-6 bg-slate-50">
      <div className="pt-10 px-6 pb-6 relative overflow-hidden bg-white border-b border-slate-100 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl" />
        <div className="text-[26px] font-extrabold text-slate-900 tracking-[-0.03em] leading-[1.25] relative z-10">
          你好，歡迎來到<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">OO SAY MONEY</span>
        </div>
        <div className="text-[14px] text-slate-500 mt-3 font-medium relative z-10">
          加入會員，解鎖專屬理財資源與工具
        </div>
      </div>
      
      <div className="px-5 pt-6 grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
            key={item.key} onClick={() => onSelect(item.key)} 
            className="group px-2 py-6 flex flex-col items-center gap-3 cursor-pointer bg-white rounded-[20px] shadow-sm shadow-slate-200/50 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 active:scale-95"
          >
            <div className={`w-[48px] h-[48px] rounded-[16px] ${item.bg} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105`}>
              <Ic n={item.icon} size={24} color="#fff" />
            </div>
            <div className="text-center">
              <div className="text-[13px] font-extrabold text-slate-900 tracking-[0.02em]">{item.label}</div>
              <div className="text-[10px] font-medium text-slate-500 mt-1 px-1">{item.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="pt-6 px-5">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[20px] p-6 flex flex-col justify-center items-center shadow-xl shadow-slate-900/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[16px] font-extrabold text-white mb-1">立即加入我們的會員</div>
            <div className="text-[13px] text-slate-400 mb-5">解鎖專屬財務工具與一對一諮詢服務</div>
            <button onClick={() => onSelect("login")} className="w-full bg-indigo-600 text-white border-0 rounded-xl px-4 py-3.5 text-[15px] font-extrabold cursor-pointer shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 hover:bg-indigo-500 flex justify-center items-center gap-2">
              LINE 登入 <Ic n="arrowRight" size={16} color="#fff" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
