import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [_, navigate] = useLocation();
  
  return (
  <div className="pb-6">
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 pt-7 px-5 pb-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[40px] -right-[20px] w-[160px] h-[160px] rounded-full bg-indigo-500/5 blur-3xl" />
      
      <button onClick={onBack} className="bg-transparent border-0 cursor-pointer mb-6 p-0 block transition-opacity hover:opacity-75 relative z-10">
        <Ic n="back" color="rgba(255,255,255,.9)" size={24} />
      </button>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full px-3 py-1 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
          <span className="text-[10px] font-bold text-indigo-300 tracking-wider">免費 · 2分鐘</span>
        </div>
        <div className="text-[28px] font-extrabold text-white leading-[1.25] tracking-[-0.03em] mb-3">
          你的錢，<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">都去哪了？</span>
        </div>
        <div className="text-[14px] text-slate-300/90 leading-relaxed font-medium">
          先了解你的財務心理類型，<br/>再看清你的財務真實數字。
        </div>
      </motion.div>
    </div>
    
    <div className="pt-4 px-5 -mt-6 relative z-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white rounded-[20px] p-5 mb-4 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-md shadow-slate-900/20">
            <span className="text-[14px] font-extrabold text-white">1</span>
          </div>
          <div className="text-[16px] font-extrabold text-slate-900 tracking-[-0.01em]">你是哪種理財類型？</div>
        </div>
        <div className="text-[14px] text-slate-500 leading-relaxed mb-5">
          8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大、還是策略進化型？
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label:"穩健累積型", color:"text-emerald-700", bg:"bg-emerald-50", border: "border-emerald-200" },
            { label:"成長放大型", color:"text-orange-700", bg:"bg-orange-50", border: "border-orange-200" },
            { label:"起步探索型", color:"text-purple-700", bg:"bg-purple-50", border: "border-purple-200" },
            { label:"策略進化型", color:"text-emerald-700", bg:"bg-emerald-50", border: "border-emerald-200" },
          ].map((t, i) => (
            <span key={i} className={`text-[11px] font-bold ${t.color} ${t.bg} border ${t.border} rounded-md px-2.5 py-1`}>
              {t.label}
            </span>
          ))}
        </div>
        <button onClick={() => navigate("/quiz")} className="w-full bg-slate-900 text-white border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-[0.98] flex items-center justify-center gap-2">
          開始測驗 <Ic n="trend" size={16} />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white rounded-[20px] p-5 mb-4 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            <span className="text-[14px] font-extrabold text-slate-400">2</span>
          </div>
          <div className="text-[16px] font-extrabold text-slate-900 tracking-[-0.01em]">看清財務真實數字</div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-md px-2 py-0.5 ml-auto">需登入</span>
        </div>
        <div className="flex gap-2.5 mb-5">
          {[
            { label:"淨資產",   val:"1,600萬", color:"text-emerald-600", bg:"bg-emerald-50/50" },
            { label:"儲蓄率",   val:"33%",     color:"text-indigo-600", bg:"bg-indigo-50/50" },
            { label:"財務分數", val:"78分",    color:"text-blue-600", bg:"bg-blue-50/50" },
          ].map((c, i) => (
            <div key={i} className={`flex-1 rounded-xl py-3 px-1 text-center border border-slate-100 ${c.bg}`}>
              <div className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">{c.label}</div>
              <div className={`text-[16px] font-extrabold ${c.color}`}>{c.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
          儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次全看清，並產生優先行動清單。
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[20px] p-6 text-center shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-[17px] font-extrabold text-white mb-2 tracking-[-0.01em]">解鎖完整財務工具</div>
          <div className="text-[13px] text-indigo-100/80 mb-5 leading-relaxed">
            加入會員，免費使用財管家所有功能<br/>不再讓記帳變成半途而廢
          </div>
          <button onClick={onLogin} className="w-full bg-white text-indigo-600 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer shadow-lg shadow-black/10 transition-transform active:scale-[0.98]">
            加入會員，立即開始 →
          </button>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
