import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [_, navigate] = useLocation();
  
  return (
  <div className="pb-10 min-h-[100dvh] bg-transparent flex flex-col items-center">
    <div className="pt-7 px-5 pb-8 relative overflow-hidden flex flex-col items-center w-full max-w-sm">
      
      <div className="flex w-full mb-6">
        <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-12 h-12 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95 relative z-10">
          <Ic n="back" color="#9333ea" size={24} />
        </button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 text-center w-full">
        <div className="inline-flex items-center gap-2 bg-[#fdf4ff]/80 backdrop-blur-md border border-[#f5d0fe] rounded-full px-4 py-1.5 mb-5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#d946ef] shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
          <span className="text-[12px] font-black text-[#c026d3] tracking-widest uppercase">免費 · 2分鐘</span>
        </div>
        <div className="text-[36px] font-black text-slate-800 leading-tight tracking-tight mb-4">
          你的錢，<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm">都去哪了？</span>
        </div>
        <div className="text-[16px] text-slate-500 leading-relaxed font-bold bg-white/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white inline-block shadow-sm">
          先了解你的財務心理類型，<br/>再看清你的財務真實數字。
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 relative z-20 flex flex-col gap-6 w-full max-w-sm">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white group hover:bg-white/80 transition-colors">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            <span className="text-[20px] font-black text-white">1</span>
          </div>
          <div className="text-[20px] font-black text-slate-800 tracking-wide">你的理財類型？</div>
        </div>
        <div className="text-[15px] text-slate-500 leading-relaxed mb-6 font-semibold">
          8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大、還是策略進化型？
        </div>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {[
            { label:"穩健累積型", color:"text-[#10b981]", bg:"bg-[#dcfce7]", border:"border-white" },
            { label:"成長放大型", color:"text-[#eab308]", bg:"bg-[#fef3c7]", border:"border-white" },
            { label:"起步探索型", color:"text-[#c084fc]", bg:"bg-[#f3e8ff]", border:"border-white" },
            { label:"策略進化型", color:"text-[#10b981]", bg:"bg-[#dcfce7]", border:"border-white" },
          ].map((t, i) => (
            <span key={i} className={`text-[13px] font-black ${t.color} ${t.bg} border ${t.border} rounded-[10px] px-3.5 py-2 shadow-sm`}>
              {t.label}
            </span>
          ))}
        </div>
        <button onClick={() => navigate("/quiz")} className="w-full bg-gradient-to-r from-[#c084fc] to-[#9333ea] text-white border-0 rounded-[20px] py-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_25px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
          開始測驗 <Ic n="trend" size={20} color="currentColor" />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white group hover:bg-white/80 transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-[18px] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-inner">
            <span className="text-[20px] font-black text-slate-400">2</span>
          </div>
          <div className="text-[20px] font-black text-slate-800 tracking-wide">看清真實數字</div>
          <span className="text-[12px] font-black text-[#f59e0b] bg-[#fef3c7] border border-white rounded-[10px] px-3 py-1.5 ml-auto shadow-sm tracking-wider">需登入</span>
        </div>
        <div className="flex gap-4 mb-6">
          {[
            { label:"淨資產",   val:"1,600萬", color:"text-[#10b981]", bg:"bg-[#dcfce7]" },
            { label:"儲蓄率",   val:"33%",     color:"text-[#9333ea]", bg:"bg-[#f3e8ff]" },
            { label:"財務分數", val:"78分",    color:"text-[#3b82f6]", bg:"bg-[#dbeafe]" },
          ].map((c, i) => (
            <div key={i} className={`flex-1 rounded-[20px] py-5 px-1 text-center border border-white shadow-sm ${c.bg} transition-transform hover:-translate-y-1`}>
              <div className="text-[12px] text-slate-500 font-extrabold tracking-widest mb-2">{c.label}</div>
              <div className={`text-[18px] font-black tracking-tighter ${c.color}`}>{c.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[14px] text-slate-500 font-semibold leading-relaxed bg-white/80 rounded-[20px] p-5 border border-white shadow-inner">
          儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次全看清，並產生優先行動清單。
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 text-center shadow-[0_15px_40px_rgba(147,51,234,0.3)] relative overflow-hidden border border-[#e9d5ff]">
        <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[120px] h-[120px] bg-[#fdf4ff]/40 rounded-full blur-[30px] pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="text-[22px] font-black text-white mb-3 tracking-wide text-shadow-sm">解鎖完整財務工具</div>
          <div className="text-[14px] text-[#faf5ff] font-semibold mb-8 leading-relaxed">
            加入會員，免費使用財管家所有功能<br/>不再讓記帳變成半途而廢
          </div>
          <button onClick={onLogin} className="w-full bg-white text-[#9333ea] border-0 rounded-[20px] py-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            加入會員，立即開始 <Ic n="arrowRight" size={18} color="currentColor" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
