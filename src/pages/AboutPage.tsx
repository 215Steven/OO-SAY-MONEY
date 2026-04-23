import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] pb-12 flex flex-col relative bg-[#F8F8F6]">
    
    <div className="pt-8 px-6 pb-6 flex flex-col items-center">
      {/* Header Area */}
      <div className="flex items-center justify-start w-full max-w-sm mb-8">
        <button onClick={onBack} className="bg-[#FFFFFF] border border-[#EAEAE6] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#F2F2F0] transition-colors">
          <Ic n="back" color="#2D2D2A" size={20} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-4 w-full max-w-sm">
        <div className="inline-block text-[10px] font-medium text-[#8B8A88] tracking-[0.2em] mb-4 uppercase border border-[#EAEAE6] px-3 py-1 bg-[#FFFFFF]">
          OO SAY MONEY
        </div>
        <div className="text-[32px] font-serif font-bold text-[#2D2D2A] leading-tight tracking-wider mb-4">Steven & Annie</div>
        <div className="text-[13px] text-[#2D2D2A] font-normal px-4 leading-relaxed tracking-widest inline-block border-l px-4 border-[#D6D3D1]">
          深耕財務保險規劃 20 年<br/>300+ 服務家庭 · 九位數資產管理
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-5 items-center w-full">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-sm">
        <div className="bg-[#FFFFFF] p-8 border border-[#EAEAE6] relative group hover:bg-[#F9F9F8] transition-colors">
          <div className="w-12 h-12 bg-[#F2F2F0] border border-[#EAEAE6] flex items-center justify-center mb-6">
            <Ic n="star" size={20} color="#2D2D2A" />
          </div>
          <div className="text-[18px] font-serif font-bold text-[#2D2D2A] mb-4 tracking-wider">十五年前，我們跟你一樣</div>
          <div className="text-[14px] text-[#555] leading-loose font-normal tracking-wide">
            剛出社會那幾年，心裡一直有個念頭——<br/><strong className="text-[#2D2D2A] text-[15px] font-serif font-bold inline-block my-2 border-b border-[#D6D3D1]">「好想退休。」</strong>
            <br/><br/>
            後來才慢慢想清楚：原來我們不是想退休，而是想掌握人生的選擇權。不想只有自己一個人在拼，而錢卻躺著睡覺。
            <br/><br/>
            從那一刻起，我們開始認真研究怎麼讓資產動起來。這套思路後來幫了很多人——從月光族、單身頂客，到高資產家庭，目前協助管理的規模已達九位數。
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-sm grid grid-cols-3 gap-3">
        {[
          { num: "20年",  label: "深耕財務保險" },
          { num: "300+",  label: "專屬服務家庭" },
          { num: "9位數", label: "管理資產規模" },
        ].map(s => (
          <div key={s.num} className="bg-[#FFFFFF] border border-[#EAEAE6] py-5 px-1 text-center hover:bg-[#F2F2F0] transition-colors">
            <div className="text-[20px] font-serif font-bold text-[#2D2D2A] mb-1">{s.num}</div>
            <div className="text-[11px] text-[#8B8A88] font-normal tracking-widest">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full max-w-sm flex flex-col gap-3">
        {[
          { icon:"shield",  title:"先蓋好地基",         desc:"保障規劃是一切的起點。風險防護到位，才能安心往上走。" },
          { icon:"trend",   title:"讓錢替你工作",        desc:"資產配置 × 複利效應，加速達到財務自由的時間點。" },
          { icon:"diamond", title:"舒服走到想去的地方", desc:"不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。" },
        ].map(item => (
          <div key={item.title} className="bg-[#FFFFFF] border border-[#EAEAE6] p-6 flex flex-col sm:flex-row items-start gap-5 hover:bg-[#F9F9F8] transition-colors">
            <div className="w-10 h-10 border border-[#EAEAE6] bg-[#F2F2F0] flex items-center justify-center shrink-0">
              <Ic n={item.icon} size={20} color="#2D2D2A" />
            </div>
            <div className="pt-0.5">
              <div className="text-[16px] font-serif font-bold text-[#2D2D2A] tracking-wider mb-2">{item.title}</div>
              <div className="text-[13px] text-[#8B8A88] leading-loose font-normal tracking-wide">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full max-w-sm bg-[#FFFFFF] border border-[#EAEAE6] p-6 mt-2">
        <div className="text-[16px] font-serif font-bold text-[#2D2D2A] mb-5 tracking-wider flex items-center gap-3">
           <div className="w-8 h-8 bg-[#F2F2F0] border border-[#EAEAE6] flex items-center justify-center text-[14px] text-[#2D2D2A]">🤝</div>
           跟我們在這裡見面
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/oosayhi" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-[#F8F8F6] border border-[#EAEAE6] py-5 px-3 text-center transition-colors hover:border-[#D6D3D1] hover:bg-[#F2F2F0] group">
              <div className="text-[24px] mb-3 text-[#2D2D2A] grayscale group-hover:grayscale-0 transition-all duration-300">📘</div>
              <div className="text-[13px] font-medium text-[#2D2D2A] tracking-widest mb-1">FB 粉專</div>
            </div>
          </a>
          <a href="https://oosayhi.com" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-[#F8F8F6] border border-[#EAEAE6] py-5 px-3 text-center transition-colors hover:border-[#D6D3D1] hover:bg-[#F2F2F0] group">
              <div className="text-[24px] mb-3 text-[#2D2D2A] grayscale group-hover:grayscale-0 transition-all duration-300">✍️</div>
              <div className="text-[13px] font-medium text-[#2D2D2A] tracking-widest mb-1">部落格</div>
            </div>
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full max-w-sm mt-6 mb-8">
        <div className="bg-[#2D2D2A] p-10 flex flex-col justify-center items-center text-center">
          <h3 className="text-[18px] font-serif font-bold text-[#FFFFFF] mb-3 tracking-widest">想了解更多？</h3>
          <p className="text-[13px] text-[#AFAEA9] font-normal mb-8 leading-relaxed tracking-wide">加入會員，解鎖專屬理財工具與諮詢服務</p>
          <button onClick={onJoin} className="w-full bg-[#FFFFFF] text-[#2D2D2A] border border-[#FFFFFF] py-4 text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-[#EAEAE6] transition-colors flex justify-center items-center gap-2">
             前往註冊 <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);
