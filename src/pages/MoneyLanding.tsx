import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [_, navigate] = useLocation();
  
  return (
  <div className="pb-12 min-h-[100dvh] bg-warm-gray-50 flex flex-col items-center">
    <div className="pt-8 px-6 pb-6 relative overflow-hidden flex flex-col items-center w-full max-w-sm">
      

      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 text-center w-full">
        <div className="inline-flex items-center gap-2 bg-white border border-warm-gray-200 px-3 py-1 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-base" />
          <span className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] uppercase">免費 · 2分鐘</span>
        </div>
        <div className="text-[28px] font-serif font-bold text-warm-gray-800 leading-[1.4] tracking-wider mb-5">
          你的錢，<br/>都去哪了？
        </div>
        <div className="text-[13px] text-warm-gray-800 leading-loose font-normal px-5 tracking-widest inline-block border-l px-4 border-warm-gray-300">
          先了解你的財務心理類型，<br/>再看清你的財務真實數字。
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 relative z-20 flex flex-col gap-6 w-full max-w-sm pt-4">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white p-8 border border-teal-soft/80 group hover:border-teal-base/30 hover:shadow-md transition-all rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 border border-teal-soft bg-cyan-soft flex items-center justify-center shrink-0 rounded-full">
            <span className="text-[16px] font-serif font-bold text-teal-base">1</span>
          </div>
          <div className="text-[18px] font-serif font-bold text-warm-gray-800 tracking-wider">你的理財類型？</div>
        </div>
        <div className="text-[13px] text-warm-gray-800/80 leading-loose mb-6 font-normal tracking-wide">
          8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大、還是策略進化型？
        </div>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {[
            { label:"穩健累積型", color:"text-cyan-base", bg:"bg-cyan-soft", border:"border-cyan-soft" },
            { label:"成長放大型", color:"text-teal-base", bg:"bg-teal-soft", border:"border-teal-soft" },
            { label:"起步探索型", color:"text-warm-gray-800", bg:"bg-warm-gray-50", border:"border-warm-gray-200" },
            { label:"策略進化型", color:"text-warm-gray-800", bg:"bg-warm-gray-50", border:"border-warm-gray-200" },
          ].map((t, i) => (
            <span key={i} className={`text-[11px] font-medium tracking-widest ${t.color} ${t.bg} border ${t.border} px-3 py-1.5 rounded-full`}>
              {t.label}
            </span>
          ))}
        </div>
        <button onClick={() => navigate("/quiz")} className="w-full bg-teal-base text-white border border-teal-base py-4 rounded-2xl text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-cyan-base transition-colors flex items-center justify-center gap-2 shadow-sm">
          開始測驗 <Ic n="trend" size={16} color="currentColor" />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white p-8 border border-warm-gray-200 group hover:border-warm-gray-800/20 hover:shadow-md transition-all rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 border border-warm-gray-200 bg-white flex items-center justify-center shrink-0 rounded-full">
            <span className="text-[16px] font-serif font-bold text-warm-gray-200">2</span>
          </div>
          <div className="text-[18px] font-serif font-bold text-warm-gray-800 tracking-wider">看清真實數字</div>
          <span className="text-[10px] font-medium text-alert-orange border border-alert-orange/30 bg-alert-orange/5 px-2 py-1 ml-auto tracking-widest rounded-full">需登入</span>
        </div>
        <div className="flex gap-3 mb-6">
          {[
            { label:"淨資產",   val:"1,600萬", color:"text-warm-gray-800", bg:"bg-warm-gray-50", b:"border-warm-gray-200" },
            { label:"儲蓄率",   val:"33%",     color:"text-cyan-base", bg:"bg-cyan-soft/50", b:"border-cyan-soft" },
            { label:"財務分數", val:"78分",    color:"text-teal-base", bg:"bg-teal-soft/50", b:"border-teal-soft" },
          ].map((c, i) => (
            <div key={i} className={`flex-1 py-5 px-1 text-center border ${c.b} rounded-xl ${c.bg} transition-colors`}>
              <div className="text-[11px] text-warm-gray-800/60 font-medium tracking-widest mb-2">{c.label}</div>
              <div className={`text-[16px] font-serif font-bold tracking-wider ${c.color}`}>{c.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-warm-gray-800/80 font-normal tracking-wide leading-loose bg-warm-gray-50 rounded-xl p-5 border border-warm-gray-200">
          儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次全看清，並產生優先行動清單。
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-cyan-base p-10 mt-2 text-center rounded-2xl mb-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-base/50 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="relative z-10 w-full">
          <div className="text-[18px] font-serif font-bold text-white mb-3 tracking-widest">解鎖完整財務工具</div>
          <div className="text-[13px] text-cyan-soft font-normal mb-8 leading-relaxed tracking-wide">
            加入會員，免費使用財管家所有功能<br/>不再讓記帳變成半途而廢
          </div>
          <button onClick={onLogin} className="w-full bg-white text-cyan-base border border-white py-4 rounded-2xl text-[13px] font-bold tracking-widest uppercase cursor-pointer hover:bg-cyan-soft transition-colors flex items-center justify-center gap-2 shadow-sm">
            加入會員，立即開始 <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
