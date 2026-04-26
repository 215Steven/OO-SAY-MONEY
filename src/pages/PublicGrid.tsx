import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  const items = [
    { key:"story",  label:"故事起點", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"info",  sub:"自我介紹" },
    { key:"quiz",   label:"錢去哪了", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"money", sub:"測驗" },
    { key:"unlock", label:"解鎖更多", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"star",  sub:"簡述會員頁的六格網頁" },
  ];
  return (
    <div className="min-h-screen pb-12 flex flex-col relative bg-warm-gray-50 items-center">
      
      {/* Header Greeting */}
      <div className="pt-12 px-6 pb-8 flex flex-col items-center w-full max-w-sm">
        <div className="w-[72px] h-[72px] bg-white border border-warm-gray-200 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm">
           <Ic n="star" size={28} color="var(--color-warm-gray-800)" />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full">
          <div className="text-[28px] font-serif font-bold text-warm-gray-800 leading-snug tracking-wide mb-3">
            你好，歡迎來到
            <br/>
            OO SAY MONEY
          </div>
          <div className="text-[14px] text-warm-gray-800/80 leading-relaxed font-normal px-6 tracking-wide">
             投資，是對自己最好的承諾。
          </div>
        </motion.div>
      </div>
      
      {/* 3-Grid Actions */}
      <div className="px-5 flex flex-col gap-4 w-full max-w-sm pt-4">
        {items.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
            key={item.key} onClick={() => onSelect(item.key)} 
            className="bg-white p-6 flex items-center gap-5 border border-teal-soft/80 rounded-2xl hover:border-teal-base/30 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 border border-teal-soft bg-cyan-soft/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-cyan-soft transition-colors">
              <Ic n={item.icon} size={22} color="var(--color-teal-base)" />
            </div>
            <div className="flex-1">
              <div className="text-[17px] font-serif font-bold text-warm-gray-800 tracking-wide mb-0.5">{item.label}</div>
              <div className="text-[14px] text-warm-gray-800/70 leading-relaxed">{item.sub}</div>
            </div>
            <div className="text-teal-base/40 group-hover:text-alert-orange transition-colors">
               <Ic n="arrow" size={20} color="currentColor" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Registration CTA */}
      <div className="px-5 flex flex-col gap-4 w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-teal-base p-8 mt-10 text-center rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-base/20 rounded-full blur-2xl -mr-10 -mt-10" />
          <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide relative z-10">開始專屬理財旅程</h3>
          <p className="text-[14px] text-teal-soft/90 font-normal mb-8 leading-relaxed relative z-10">紀錄財務、顧問諮詢<br/>與您的客製化理財藍圖。</p>
          <button onClick={() => onSelect("login")} className="w-full bg-white text-teal-base py-4 rounded-xl text-[14px] font-bold tracking-widest cursor-pointer hover:bg-teal-soft transition-all flex justify-center items-center gap-2 relative z-10 shadow-sm">
             前往註冊 / 登入
          </button>
        </motion.div>
      </div>
    </div>
  );
};
