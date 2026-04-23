import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [_, navigate] = useLocation();
  
  return (
  <div className="pb-12 min-h-[100dvh] bg-[#F8F8F6] flex flex-col items-center">
    <div className="pt-8 px-6 pb-6 relative overflow-hidden flex flex-col items-center w-full max-w-sm">
      
      <div className="flex w-full mb-8 relative z-10">
        <button onClick={onBack} className="bg-[#FFFFFF] border border-[#EAEAE6] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#F2F2F0] transition-colors relative z-10">
          <Ic n="back" color="#2D2D2A" size={20} />
        </button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 text-center w-full">
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#EAEAE6] px-3 py-1 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" />
          <span className="text-[10px] font-medium text-[#2D2D2A] tracking-[0.2em] uppercase">免費 · 2分鐘</span>
        </div>
        <div className="text-[28px] font-serif font-bold text-[#2D2D2A] leading-[1.4] tracking-wider mb-5">
          你的錢，<br/>都去哪了？
        </div>
        <div className="text-[13px] text-[#2D2D2A] leading-loose font-normal px-5 tracking-widest inline-block border-l px-4 border-[#D6D3D1]">
          先了解你的財務心理類型，<br/>再看清你的財務真實數字。
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 relative z-20 flex flex-col gap-6 w-full max-w-sm pt-4">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-[#FFFFFF] p-8 border border-[#EAEAE6] group hover:bg-[#F9F9F8] transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 border border-[#EAEAE6] bg-[#F2F2F0] flex items-center justify-center shrink-0">
            <span className="text-[16px] font-serif font-bold text-[#2D2D2A]">1</span>
          </div>
          <div className="text-[18px] font-serif font-bold text-[#2D2D2A] tracking-wider">你的理財類型？</div>
        </div>
        <div className="text-[13px] text-[#555] leading-loose mb-6 font-normal tracking-wide">
          8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大、還是策略進化型？
        </div>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {[
            { label:"穩健累積型", color:"text-[#2D2D2A]", bg:"bg-[#F9F9F8]", border:"border-[#EAEAE6]" },
            { label:"成長放大型", color:"text-[#2D2D2A]", bg:"bg-[#F9F9F8]", border:"border-[#EAEAE6]" },
            { label:"起步探索型", color:"text-[#2D2D2A]", bg:"bg-[#F9F9F8]", border:"border-[#EAEAE6]" },
            { label:"策略進化型", color:"text-[#2D2D2A]", bg:"bg-[#F9F9F8]", border:"border-[#EAEAE6]" },
          ].map((t, i) => (
            <span key={i} className={`text-[11px] font-normal tracking-widest ${t.color} ${t.bg} border ${t.border} px-3 py-1.5`}>
              {t.label}
            </span>
          ))}
        </div>
        <button onClick={() => navigate("/quiz")} className="w-full bg-[#2D2D2A] text-[#FFFFFF] border border-[#2D2D2A] py-4 text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-[#49405E] transition-colors flex items-center justify-center gap-2">
          開始測驗 <Ic n="trend" size={16} color="currentColor" />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-[#FFFFFF] p-8 border border-[#EAEAE6] group hover:bg-[#F9F9F8] transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 border border-[#EAEAE6] bg-[#FFFFFF] flex items-center justify-center shrink-0">
            <span className="text-[16px] font-serif font-bold text-[#D6D3D1]">2</span>
          </div>
          <div className="text-[18px] font-serif font-bold text-[#2D2D2A] tracking-wider">看清真實數字</div>
          <span className="text-[10px] font-medium text-[#8B8A88] border border-[#D6D3D1] px-2 py-1 ml-auto tracking-widest">需登入</span>
        </div>
        <div className="flex gap-3 mb-6">
          {[
            { label:"淨資產",   val:"1,600萬", color:"text-[#2D2D2A]", bg:"bg-[#F8F8F6]" },
            { label:"儲蓄率",   val:"33%",     color:"text-[#2D2D2A]", bg:"bg-[#F8F8F6]" },
            { label:"財務分數", val:"78分",    color:"text-[#2D2D2A]", bg:"bg-[#F8F8F6]" },
          ].map((c, i) => (
            <div key={i} className={`flex-1 py-5 px-1 text-center border border-[#EAEAE6] ${c.bg} transition-colors`}>
              <div className="text-[11px] text-[#8B8A88] font-normal tracking-widest mb-2">{c.label}</div>
              <div className={`text-[16px] font-serif font-bold tracking-wider ${c.color}`}>{c.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-[#555] font-normal tracking-wide leading-loose bg-[#F9F9F8] p-5 border border-[#EAEAE6]">
          儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次全看清，並產生優先行動清單。
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-[#2D2D2A] p-10 mt-2 text-center">
        <div className="relative z-10 w-full">
          <div className="text-[18px] font-serif font-bold text-[#FFFFFF] mb-3 tracking-widest">解鎖完整財務工具</div>
          <div className="text-[13px] text-[#AFAEA9] font-normal mb-8 leading-relaxed tracking-wide">
            加入會員，免費使用財管家所有功能<br/>不再讓記帳變成半途而廢
          </div>
          <button onClick={onLogin} className="w-full bg-[#FFFFFF] text-[#2D2D2A] border border-[#FFFFFF] py-4 text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-[#EAEAE6] transition-colors flex items-center justify-center gap-2">
            加入會員，立即開始 <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
