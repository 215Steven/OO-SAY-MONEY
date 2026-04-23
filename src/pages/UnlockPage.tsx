import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const UnlockPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] pb-10 flex flex-col relative overflow-hidden bg-transparent items-center">
    
    <div className="relative pt-6 px-5 pb-8 flex flex-col items-center w-full max-w-sm">
      
      <div className="flex items-center justify-start w-full mb-6 relative z-10">
        <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-12 h-12 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
          <Ic n="back" color="#9333ea" size={24} />
        </button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 text-center w-full">
        <div className="inline-block text-[12px] font-black text-[#9333ea] tracking-[0.15em] mb-4 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white uppercase drop-shadow-sm">
          MEMBERSHIP
        </div>
        <div className="text-[36px] font-black text-slate-800 leading-tight tracking-tight mb-4">
          解鎖更多，<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm">走向財務自由</span>
        </div>
        <div className="text-[15px] text-slate-500 leading-relaxed font-bold px-5 py-2.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white inline-block shadow-sm">
          加入會員，獲得專屬工具、知識與一對一諮詢機會
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 relative z-20 flex flex-col gap-4 w-full max-w-sm">
      {[
        { icon:"chart",    title:"財管家完整版",  desc:"儲蓄率、保障缺口、財務自由進度——數字化你的財務全貌", color:"#10b981", bg:"#dcfce7" },
        { icon:"book",     title:"理財靈感庫",    desc:"精選文章、知識卡片、定期更新的理財觀點", color:"#3b82f6", bg:"#dbeafe" },
        { icon:"calendar", title:"預約聊聊",      desc:"一對一免費初談，找到適合你的財務規劃起點", color:"#c084fc", bg:"#f3e8ff" },
        { icon:"shield",   title:"財務防線健檢",  desc:"保障缺口分析，確認你的風險防護是否足夠", color:"#f59e0b", bg:"#fef3c7" },
        { icon:"map",      title:"啟富藍圖",      desc:"從現況到目標，規劃你的財務自由路線", color:"#0ea5e9", bg:"#e0f2fe" },
        { icon:"star",     title:"最新動態",      desc:"市場資訊、財務規劃建議、即時通知", color:"#ef4444", bg:"#fee2e2" },
      ].map((item, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 + 0.1 }}
          key={item.title} 
          className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 flex items-start gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white transition-all hover:bg-white hover:shadow-[0_15px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 hover:border-[#e9d5ff] group"
        >
          <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform" style={{ backgroundColor: item.bg, color: item.color }}>
            <Ic n={item.icon} size={28} color="currentColor" />
          </div>
          <div className="pt-0.5">
            <div className="text-[17px] font-black text-slate-800 tracking-wide mb-1.5">{item.title}</div>
            <div className="text-[14px] text-slate-500 leading-relaxed font-semibold">{item.desc}</div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 mt-4 text-center shadow-[0_15px_40px_rgba(147,51,234,0.3)] relative overflow-hidden border border-[#e9d5ff]">
        <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[120px] h-[120px] bg-[#fdf4ff]/40 rounded-full blur-[30px] pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="text-[20px] font-black text-white mb-2 tracking-wide text-shadow-sm">免費加入，立即開始</div>
          <div className="text-[14px] text-[#faf5ff] font-semibold mb-6 leading-relaxed">
            透過 LINE 授權註冊，選擇您的身份<br/>即刻解鎖完整會員功能
          </div>
          <button onClick={onJoin} className="w-full bg-white text-[#9333ea] border-0 rounded-[20px] py-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            登入 / 註冊會員 <Ic n="arrowRight" size={18} color="currentColor" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);
