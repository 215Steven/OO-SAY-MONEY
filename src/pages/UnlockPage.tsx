import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { useLocation } from "wouter";

export const UnlockPage = ({ onBack, onJoin }: any) => {
  const [, navigate] = useLocation();
  return (
  <div className="min-h-screen pb-12 flex flex-col relative bg-warm-gray-50 items-center">
    
    <div className="pt-12 px-6 pb-8 flex flex-col items-center w-full max-w-sm">
      <button onClick={onBack} className="self-start mb-6 text-warm-gray-500 hover:text-warm-gray-800 transition-colors flex items-center gap-1">
        <Ic n="back" size={18} /> 返回
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full">
        <div className="text-[28px] font-serif font-bold text-warm-gray-800 leading-snug tracking-wide mb-3">
          解鎖更多
        </div>
        <div className="text-[14px] text-warm-gray-800/80 leading-relaxed font-normal px-6 tracking-wide">
          加入會員，使用專屬工具、閱讀精選內容、預約顧問
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-4 w-full max-w-sm pt-4">
      {[
        { icon:"shield",   title:"財務防線",      desc:"保障是起點，風險顧好，才能安心往前走" },
        { icon:"chart",    title:"財務健檢",      desc:"用財管家初步檢視你的財務分數" },
        { icon:"calendar", title:"預約聊聊",      desc:"一對一諮詢，依你的狀況討論" },
        { icon:"book",     title:"理財靈感",      desc:"基金排行與精選理財觀點，定期更新" },
        { icon:"map",      title:"啟富藍圖",      desc:"月配息策略說明，試算你的財務自由路徑" },
      ].map((item, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 + 0.15 }}
          key={item.title} 
          className="bg-white p-6 flex items-center gap-5 border border-teal-soft/80 rounded-2xl shadow-sm hover:border-teal-base/30 transition-all group"
        >
          <div className="w-12 h-12 border border-teal-soft bg-cyan-soft/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-cyan-soft transition-colors">
            <Ic n={item.icon} size={22} color="var(--color-teal-base)" />
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-serif font-bold text-warm-gray-800 tracking-wide mb-0.5">{item.title}</div>
            <div className="text-[14px] text-warm-gray-800/70 leading-relaxed">{item.desc}</div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-teal-base p-8 mt-10 text-center rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-base/20 rounded-full blur-2xl -mr-10 -mt-10" />
        <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide relative z-10">免費加入會員</h3>
        <p className="text-[14px] text-teal-soft/90 font-normal mb-8 leading-relaxed relative z-10">加入後即可使用以上功能</p>
        <button onClick={onJoin} className="outline-none focus-visible:ring-2 focus-visible:ring-teal-base/40 focus-visible:ring-offset-2 w-full bg-white text-teal-base py-4 rounded-2xl text-[14px] font-bold tracking-widest cursor-pointer hover:bg-teal-soft active:scale-[0.98] transition-all shadow-sm relative z-10">
           加入會員
        </button>
        <button onClick={() => navigate("/appointment")} className="outline-none focus-visible:ring-2 focus-visible:ring-teal-base/40 focus-visible:ring-offset-2 w-full mt-3 text-white/90 py-3 text-[13px] tracking-widest cursor-pointer hover:text-white transition-colors relative z-10">
           想先聊聊？預約免費諮詢
        </button>
      </motion.div>
    </div>
  </div>
);
};
