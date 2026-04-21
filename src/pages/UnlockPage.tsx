import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const UnlockPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] pb-6 bg-slate-50">
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 pt-10 px-6 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[30px] -right-[20px] w-[140px] h-[140px] rounded-full bg-indigo-500/5 blur-3xl" />
      
      <button onClick={onBack} className="bg-transparent border-0 cursor-pointer mb-6 p-0 block transition-opacity hover:opacity-75 relative z-10">
        <Ic n="back" color="rgba(255,255,255,.9)" size={24} />
      </button>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
        <div className="inline-block text-[10px] font-bold text-indigo-300 tracking-[0.14em] uppercase mb-2 border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 rounded-md">
          MEMBERSHIP
        </div>
        <div className="text-[28px] font-extrabold text-white leading-[1.25] tracking-[-0.03em] mb-3">
          解鎖更多，<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">走向財務自由</span>
        </div>
        <div className="text-[14px] text-slate-300/90 leading-relaxed font-medium">
          加入會員，獲得專屬工具、知識與一對一諮詢機會
        </div>
      </motion.div>
    </div>
    
    <div className="pt-4 px-5 -mt-8 relative z-20">
      {[
        { icon:"chart",    title:"財管家完整版",  desc:"儲蓄率、保障缺口、財務自由進度——數字化你的財務全貌" },
        { icon:"book",     title:"理財靈感庫",    desc:"精選文章、知識卡片、定期更新的理財觀點" },
        { icon:"calendar", title:"預約聊聊",      desc:"一對一免費初談，找到適合你的財務規劃起點" },
        { icon:"shield",   title:"財務防線健檢",  desc:"保障缺口分析，確認你的風險防護是否足夠" },
        { icon:"map",      title:"啟富藍圖",      desc:"從現況到目標，規劃你的財務自由路線" },
        { icon:"star",     title:"最新動態",      desc:"市場資訊、財務規劃建議、即時通知" },
      ].map((item, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 + 0.1 }}
          key={item.title} 
          className="bg-white rounded-[20px] p-4 mb-3 flex items-start gap-4 shadow-sm border border-slate-100 transition-shadow hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-[14px] bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50">
            <Ic n={item.icon} size={22} color="#4f46e5" />
          </div>
          <div className="pt-0.5">
            <div className="text-[15px] font-bold text-slate-900 tracking-[-0.01em]">{item.title}</div>
            <div className="text-[13px] text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[20px] p-6 mt-5 text-center shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[17px] font-extrabold text-white mb-2 tracking-[-0.01em]">免費加入，立即開始</div>
          <div className="text-[13px] text-indigo-100/80 mb-5 leading-relaxed">
            LINE 登入，選擇身份，解鎖所有功能
          </div>
          <button onClick={onJoin} className="w-full bg-white text-indigo-600 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer shadow-lg shadow-black/10 transition-transform active:scale-[0.98]">
            加入會員 →
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);
