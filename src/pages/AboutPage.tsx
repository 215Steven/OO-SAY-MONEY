import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] pb-10 flex flex-col relative overflow-hidden bg-transparent">
    
    <div className="relative pt-6 px-5 pb-8 flex flex-col items-center">
      {/* Header Area */}
      <div className="flex items-center justify-start w-full max-w-sm mb-6 relative z-10">
        <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-12 h-12 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
          <Ic n="back" color="#9333ea" size={24} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 text-center mb-6 w-full max-w-sm">
        <div className="inline-block text-[12px] font-black text-[#9333ea] tracking-[0.15em] mb-3 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white uppercase drop-shadow-sm">
          OO SAY MONEY
        </div>
        <div className="text-[36px] font-black text-slate-800 leading-tight tracking-tight mb-3">Steven & Annie</div>
        <div className="text-[15px] text-slate-500 font-bold px-4 leading-relaxed bg-white/40 backdrop-blur-md rounded-2xl py-2 border border-white inline-block shadow-sm">
          深耕財務保險規劃 20 年<br/>300+ 服務家庭 · 九位數資產管理
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 relative z-10 flex flex-col gap-5 items-center w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="w-full max-w-sm">
        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group hover:bg-white/80 transition-colors">
          <div className="w-14 h-14 bg-gradient-to-br from-[#c084fc] to-[#a855f7] rounded-[20px] flex items-center justify-center mb-5 shadow-inner">
            <Ic n="star" size={28} color="#fff" />
          </div>
          <div className="text-[20px] font-black text-slate-800 mb-4 tracking-wide">十五年前，我們跟你一樣</div>
          <div className="text-[15px] text-slate-600 leading-[1.8] font-semibold">
            剛出社會那幾年，心裡一直有個念頭——<br/><strong className="text-[#9333ea] text-[18px] font-black bg-white/50 px-2 py-0.5 rounded-lg inline-block my-1 shadow-sm border border-white">「好想退休。」</strong>
            <br/><br/>
            後來才慢慢想清楚：原來我們不是想退休，而是想掌握人生的選擇權。不想只有自己一個人在拼，而錢卻躺著睡覺。
            <br/><br/>
            從那一刻起，我們開始認真研究怎麼讓資產動起來。這套思路後來幫了很多人——從月光族、單身頂客，到高資產家庭，目前協助管理的規模已達九位數。
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="w-full max-w-sm grid grid-cols-3 gap-3">
        {[
          { num: "20年",  label: "深耕財務保險" },
          { num: "300+",  label: "專屬服務家庭" },
          { num: "9位數", label: "管理資產規模" },
        ].map(s => (
          <div key={s.num} className="bg-white/60 backdrop-blur-md rounded-[24px] py-6 px-1 text-center border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1 hover:bg-white">
            <div className="text-[22px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm mb-1.5">{s.num}</div>
            <div className="text-[12px] text-slate-500 font-bold leading-tight px-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="w-full max-w-sm flex flex-col gap-3">
        {[
          { icon:"shield",  title:"先蓋好地基",         desc:"保障規劃是一切的起點。風險防護到位，才能安心往上走。", color:"#10b981", bg:"#dcfce7" },
          { icon:"trend",   title:"讓錢替你工作",        desc:"資產配置 × 複利效應，加速達到財務自由的時間點。", color:"#3b82f6", bg:"#dbeafe" },
          { icon:"diamond", title:"舒服走到想去的地方", desc:"不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。", color:"#f59e0b", bg:"#fef3c7" },
        ].map(item => (
          <div key={item.title} className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 flex items-start gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white transition-all hover:bg-white hover:border-[#e9d5ff] hover:-translate-y-1 group">
            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`} style={{ backgroundColor: item.bg, color: item.color }}>
              <Ic n={item.icon} size={28} color="currentColor" />
            </div>
            <div className="pt-0.5">
              <div className="text-[17px] font-black text-slate-800 tracking-wide mb-1.5">{item.title}</div>
              <div className="text-[14px] text-slate-500 leading-relaxed font-semibold">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="w-full max-w-sm bg-white/60 backdrop-blur-md rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white mt-2">
        <div className="text-[17px] font-black text-slate-800 mb-5 px-1 tracking-wide flex items-center gap-2">
           <div className="w-8 h-8 rounded-[12px] bg-[#f3e8ff] flex items-center justify-center text-[16px] shadow-inner text-[#9333ea]">🤝</div>
           跟我們在這裡見面
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/oosayhi" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-white/80 rounded-[24px] py-5 px-3 text-center border border-white shadow-sm transition-all hover:border-[#bae6fd] hover:shadow-md hover:-translate-y-1 group">
              <div className="text-[32px] mb-3 drop-shadow-sm group-hover:scale-110 transition-transform">📘</div>
              <div className="text-[15px] font-black text-[#0369a1] mb-1 tracking-wide">粉專</div>
              <div className="text-[12px] text-[#0ea5e9] font-bold">OO SAY HI</div>
            </div>
          </a>
          <a href="https://oosayhi.com" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-white/80 rounded-[24px] py-5 px-3 text-center border border-white shadow-sm transition-all hover:border-[#fef08a] hover:shadow-md hover:-translate-y-1 group">
              <div className="text-[32px] mb-3 drop-shadow-sm group-hover:scale-110 transition-transform">✍️</div>
              <div className="text-[15px] font-black text-[#a16207] mb-1 tracking-wide">部落格</div>
              <div className="text-[12px] text-[#eab308] font-bold">oosayhi.com</div>
            </div>
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="w-full max-w-sm mt-6 mb-4">
        <div className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 flex flex-col justify-center items-center shadow-[0_15px_40px_rgba(147,51,234,0.3)] text-center relative overflow-hidden border border-[#e9d5ff]">
          <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[120px] h-[120px] bg-[#fdf4ff]/40 rounded-full blur-[30px] pointer-events-none" />
          
          <div className="relative z-10 w-full">
            <h3 className="text-[20px] font-black text-white mb-2 tracking-wide text-shadow-sm">想了解更多？</h3>
            <p className="text-[14px] text-[#faf5ff] font-semibold mb-8">加入會員，解鎖專屬理財工具與諮詢服務</p>
            <button onClick={onJoin} className="w-full bg-white text-[#9333ea] border-0 rounded-[20px] py-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
               前往註冊 <Ic n="arrowRight" size={18} color="currentColor" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
