import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const UnlockPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-screen pb-12 flex flex-col relative bg-warm-gray-50 items-center">
    
    <div className="pt-12 px-6 pb-8 flex flex-col items-center w-full max-w-sm">
      
      <div className="flex items-center justify-start w-full mb-10">
        <button onClick={onBack} className="bg-white border border-warm-gray-200 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-warm-gray-100 transition-colors rounded-full shadow-sm">
          <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
        </button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full">
        <div className="inline-block text-[11px] font-medium text-warm-gray-800/60 tracking-[0.2em] mb-5 uppercase border border-warm-gray-200 px-4 py-1.5 bg-white rounded-full">
          MEMBERSHIP
        </div>
        <div className="text-[28px] font-serif font-bold text-warm-gray-800 leading-snug tracking-wide mb-3">
          解鎖更多
          <br/>
          走向財務自由
        </div>
        <div className="text-[14px] text-warm-gray-800/80 leading-relaxed font-normal px-6 tracking-wide">
          加入會員，獲得專屬工具、知識與諮詢
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-4 w-full max-w-sm pt-4">
      {[
        { icon:"shield",   title:"財務防線",      desc:"保障規劃是一切起點，風險防護到位，才能安心" },
        { icon:"chart",    title:"找出轉折",      desc:"財管家分析，儲蓄率與支出流向，找回現金流" },
        { icon:"calendar", title:"預約聊聊",      desc:"一對一免費初談，為您量身打造理財建議" },
        { icon:"book",     title:"理財靈感",      desc:"精選理財觀點與實用文章，定期更新" },
        { icon:"map",      title:"啟富藍圖",      desc:"月配息策略說明，規劃您的財務自由路徑" },
      ].map((item, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
          key={item.title} 
          className="bg-white p-6 flex items-center gap-5 border border-warm-gray-200 rounded-lg shadow-sm hover:border-warm-gray-800/30 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 border border-warm-gray-200 bg-warm-gray-50 rounded-full flex items-center justify-center shrink-0">
            <Ic n={item.icon} size={22} color="var(--color-warm-gold)" />
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-serif font-bold text-warm-gray-800 tracking-wide mb-0.5">{item.title}</div>
            <div className="text-[14px] text-warm-gray-800/70 leading-relaxed">{item.desc}</div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-warm-gray-800 p-8 mt-10 text-center rounded-xl shadow-lg">
        <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide">免費加入，馬上體驗</h3>
        <p className="text-[14px] text-warm-gray-200/80 font-normal mb-8 leading-relaxed">透過 LINE 授權註冊，選擇您的身份<br/>即刻解鎖完整會員功能</p>
        <button onClick={onJoin} className="w-full bg-white text-warm-gray-800 py-4 rounded-lg text-[14px] font-bold tracking-widest cursor-pointer hover:bg-white/90 transition-all">
           登入 / 註冊會員
        </button>
      </motion.div>
    </div>
  </div>
);
