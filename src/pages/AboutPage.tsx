import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-screen pb-12 flex flex-col relative bg-warm-gray-50">
    
    <div className="pt-12 px-6 pb-8 flex flex-col items-center">

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full max-w-sm">
        <div className="text-[32px] font-serif font-bold text-warm-gray-800 leading-tight tracking-wide mb-5">Steven & Annie</div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-6 items-center w-full">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-sm grid grid-cols-3 gap-3">
        {[
          { num: "20年",  label: "深耕財務保險" },
          { num: "300+",  label: "專屬服務家庭" },
          { num: "9位數", label: "管理資產規模" },
        ].map(s => (
          <div key={s.num} className="bg-white border border-warm-gray-200 py-5 px-1 text-center rounded-2xl shadow-sm hover:border-teal-base/20 transition-all">
            <div className="text-[20px] font-serif font-bold text-teal-base mb-1">{s.num}</div>
            <div className="text-[11px] text-warm-gray-800/60 font-medium tracking-widest">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full max-w-sm">
        <div className="bg-white p-8 border border-teal-soft/80 rounded-2xl relative hover:border-teal-base/30 transition-all shadow-sm">
          <div className="w-14 h-14 bg-cyan-soft border border-teal-soft rounded-full flex items-center justify-center mb-6">
            <Ic n="star" size={24} color="var(--color-teal-base)" />
          </div>
          <div className="text-[19px] font-serif font-bold text-warm-gray-800 mb-5 tracking-wide leading-relaxed">
            從等待，到擁有選擇的自由
          </div>
          <div className="text-[15px] space-y-4 text-warm-gray-800/80 leading-relaxed font-normal tracking-wide">
            <p>
              如果理財只是 Buy and Hold，<br />
              <span className="text-teal-base">這世界就不需要投資策略和理財書籍了。</span>
            </p>
            <p>
              曾經拼命想退休，只是為了逃離現狀；<br />
              後來才明白，真正的自由，是你隨時都有選擇的權利。
            </p>
            <p>
              很多人糾結配息有沒有意義。<br />
              但關鍵從來不是配不配，而是
              <span className="text-teal-base">你配出來的錢，最後去了哪裡！</span>
            </p>
            <p>
              我們做的不是單純選標的，而是建構一套現金流系統。<br />
              讓每個月的配息不只是消費，而是持續滾動、增長，直到多到花不完。
            </p>
            <p>
              當現金流穩定，機會來時你不需要猶豫。<br />
              <span className="text-teal-base">因為你有選擇的底氣。</span>
            </p>
            <p className="pt-2">
              這套方法已在我們管理的九位數資產規劃中反覆驗證。<br />
              協助不少人從等待未來，走向選擇人生。<br />
              與其獨自摸索， <br /> 
              <span className="text-teal-base">不如讓這套實戰系統，成為你的財務底層邏輯。</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full max-w-sm flex flex-col gap-4">
        {[
          { icon:"shield",  title:"先蓋好地基",         desc:"保障規劃是一切的起點。風險防護到位，才能安心往上走。" },
          { icon:"trend",   title:"讓錢替你工作",        desc:"資產配置 × 複利效應，加速達到財務自由的時間點。" },
          { icon:"diamond", title:"舒服走到想去的地方", desc:"不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。" },
        ].map(item => (
          <div key={item.title} className="bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start gap-4 hover:border-teal-soft group transition-all">
            <div className="w-12 h-12 border border-warm-gray-200 bg-warm-gray-50 group-hover:bg-cyan-soft group-hover:border-teal-soft/50 rounded-full flex items-center justify-center shrink-0 transition-colors">
              <Ic n={item.icon} size={22} color="currentColor" className="text-warm-gray-800 group-hover:text-teal-base transition-colors" />
            </div>
            <div className="pt-0.5">
              <div className="text-[17px] font-serif font-bold text-warm-gray-800 tracking-wide mb-2">{item.title}</div>
              <div className="text-[14px] text-warm-gray-800/70 leading-relaxed font-normal tracking-wide">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full max-w-sm bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm">
        <div className="text-[17px] font-serif font-bold text-warm-gray-800 mb-6 tracking-wide flex items-center gap-3">
           <div className="w-9 h-9 bg-warm-gray-50 border border-warm-gray-200 rounded-full flex items-center justify-center text-[15px]">🤝</div>
           跟我們在這裡見面
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/oosayhi" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-warm-gray-50 border border-warm-gray-200 py-5 px-3 text-center rounded-xl transition-all hover:border-teal-soft hover:bg-cyan-soft/50 group">
              <div className="text-[26px] mb-3 transition-all duration-300">📘</div>
              <div className="text-[13px] font-bold text-warm-gray-800 group-hover:text-teal-base tracking-widest transition-colors">FB 粉專</div>
            </div>
          </a>
          <a href="https://oosayhi.com" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-warm-gray-50 border border-warm-gray-200 py-5 px-3 text-center rounded-xl transition-all hover:border-teal-soft hover:bg-cyan-soft/50 group">
              <div className="text-[26px] mb-3 transition-all duration-300">✍️</div>
              <div className="text-[13px] font-bold text-warm-gray-800 group-hover:text-teal-base tracking-widest transition-colors">部落格</div>
            </div>
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="w-full max-w-sm mt-4 mb-10">
        <div className="bg-teal-base p-8 flex flex-col justify-center items-center text-center rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-base/20 rounded-full blur-2xl -mr-10 -mt-10" />
          <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide relative z-10">想了解更多？</h3>
          <p className="text-[14px] text-teal-soft/90 font-normal mb-8 leading-relaxed relative z-10">加入會員，解鎖讓錢為你工作的運作邏輯</p>
          <button onClick={onJoin} className="w-full bg-white text-teal-base py-4 rounded-2xl text-[14px] font-bold tracking-widest cursor-pointer hover:bg-teal-soft transition-all flex justify-center items-center gap-2 shadow-sm relative z-10">
             前往註冊
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

