import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-screen pb-12 flex flex-col relative bg-warm-gray-50">
    
    <div className="pt-12 px-6 pb-8 flex flex-col items-center">
      {/* Header Area */}
      <div className="flex items-center justify-start w-full max-w-sm mb-10">
        <button onClick={onBack} className="bg-white border border-warm-gray-200 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-warm-gray-100 transition-colors rounded-full shadow-sm">
          <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full max-w-sm">
        <div className="text-[32px] font-serif font-bold text-warm-gray-800 leading-tight tracking-wide mb-5">Steven & Annie</div>
        <div className="text-[14px] text-warm-gray-800/80 font-normal leading-relaxed tracking-wide border-l border-warm-gray-800/20 pl-4">
          深耕財務保險規劃 20 年<br/>300+ 服務家庭 · 九位數資產管理
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-6 items-center w-full">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-sm">
        <div className="bg-white p-8 border border-warm-gray-200 rounded-xl relative hover:border-warm-gray-800/20 transition-all shadow-sm">
          <div className="w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full flex items-center justify-center mb-6">
            <Ic n="star" size={24} color="var(--color-warm-gray-800)" />
          </div>
          <div className="text-[19px] font-serif font-bold text-warm-gray-800 mb-5 tracking-wide">十五年前，我們跟你一樣</div>
          <div className="text-[15px] text-warm-gray-800/80 leading-relaxed font-normal tracking-wide">
            剛出社會那幾年，心裡一直有個念頭
            <br/>
            <strong className="text-warm-gold text-[16px] font-serif font-bold block my-3 pt-2 border-t border-warm-gray-200">「好想退休。」</strong>
            <br/>
            後來才慢慢想清楚：原來我們不是想退休，而是想掌握人生的選擇權。不想只有自己一個人在拼，而錢卻躺著睡覺。
            <br/>
            <br/>
            從那一刻起，我們開始認真研究怎麼讓資產動起來。這套思路後來幫了很多人——從月光族、單身頂客，到高資產家庭，目前協助管理的規模已達九位數。
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full max-w-sm grid grid-cols-3 gap-3">
        {[
          { num: "20年",  label: "深耕財務保險" },
          { num: "300+",  label: "專屬服務家庭" },
          { num: "9位數", label: "管理資產規模" },
        ].map(s => (
          <div key={s.num} className="bg-white border border-warm-gray-200 py-5 px-1 text-center rounded-lg shadow-sm hover:border-warm-gray-800/10 transition-all">
            <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-1">{s.num}</div>
            <div className="text-[11px] text-warm-gray-800/60 font-medium tracking-widest">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full max-w-sm flex flex-col gap-4">
        {[
          { icon:"shield",  title:"先蓋好地基",         desc:"保障規劃是一切的起點。風險防護到位，才能安心往上走。" },
          { icon:"trend",   title:"讓錢替你工作",        desc:"資產配置 × 複利效應，加速達到財務自由的時間點。" },
          { icon:"diamond", title:"舒服走到想去的地方", desc:"不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。" },
        ].map(item => (
          <div key={item.title} className="bg-white border border-warm-gray-200 p-6 flex flex-col sm:flex-row items-start gap-4 rounded-xl shadow-sm hover:border-warm-gray-800/10 transition-all">
            <div className="w-12 h-12 border border-warm-gray-200 bg-warm-gray-50 rounded-full flex items-center justify-center shrink-0">
              <Ic n={item.icon} size={22} color="var(--color-warm-gray-800)" />
            </div>
            <div className="pt-0.5">
              <div className="text-[17px] font-serif font-bold text-warm-gray-800 tracking-wide mb-2">{item.title}</div>
              <div className="text-[14px] text-warm-gray-800/70 leading-relaxed font-normal tracking-wide">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full max-w-sm bg-white border border-warm-gray-200 p-6 rounded-xl shadow-sm">
        <div className="text-[17px] font-serif font-bold text-warm-gray-800 mb-6 tracking-wide flex items-center gap-3">
           <div className="w-9 h-9 bg-warm-gray-50 border border-warm-gray-200 rounded-full flex items-center justify-center text-[15px]">🤝</div>
           跟我們在這裡見面
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/oosayhi" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-warm-gray-50 border border-warm-gray-200 py-5 px-3 text-center rounded-lg transition-all hover:border-warm-gray-400 group">
              <div className="text-[26px] mb-3 transition-all duration-300">📘</div>
              <div className="text-[13px] font-bold text-warm-gray-800 tracking-widest">FB 粉專</div>
            </div>
          </a>
          <a href="https://oosayhi.com" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-warm-gray-50 border border-warm-gray-200 py-5 px-3 text-center rounded-lg transition-all hover:border-warm-gray-400 group">
              <div className="text-[26px] mb-3 transition-all duration-300">✍️</div>
              <div className="text-[13px] font-bold text-warm-gray-800 tracking-widest">部落格</div>
            </div>
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="w-full max-w-sm mt-4 mb-10">
        <div className="bg-warm-gray-800 p-8 flex flex-col justify-center items-center text-center rounded-xl shadow-lg">
          <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide">想了解更多？</h3>
          <p className="text-[14px] text-warm-gray-200/80 font-normal mb-8 leading-relaxed">加入會員，解鎖專屬理財工具與諮詢服務</p>
          <button onClick={onJoin} className="w-full bg-white text-warm-gray-800 py-4 rounded-lg text-[14px] font-bold tracking-widest cursor-pointer hover:bg-white/90 transition-all flex justify-center items-center gap-2">
             前往註冊
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

