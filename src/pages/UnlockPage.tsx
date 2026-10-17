import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";
import { Reveal, Eyebrow, SPRING } from "@/src/components/ui";

const features = [
  { icon: "shield",   title: "財務防線",  desc: "保障是起點，風險顧好，才能安心往前走" },
  { icon: "chart",    title: "財務健檢",  desc: "用財管家初步檢視你的財務分數" },
  { icon: "calendar", title: "預約聊聊",  desc: "直接在 LINE 對話，一句話就能約" },
  { icon: "book",     title: "理財靈感",  desc: "基金排行與精選理財觀點，定期更新" },
  { icon: "map",      title: "啟富藍圖",  desc: "月配息策略說明，試算你的財務自由路徑" },
];

export const UnlockPage = ({ onBack, onJoin }: any) => {
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <div className="px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} aria-label="返回" className="flex items-center gap-1 text-[12px] tracking-[0.18em] text-warm-gray-600 hover:text-warm-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">
          <Ic n="back" size={16} /> 返回
        </button>
        <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800">OO SAY MONEY</div>
      </div>

      <header className="px-6 pt-14 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          <Eyebrow className="mb-6">Members only</Eyebrow>
        </motion.div>
        <h1 className="font-serif leading-[1.12] tracking-[-0.01em]">
          <motion.span className="block text-[46px] font-semibold text-warm-gray-800" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.08 }}>解鎖</motion.span>
          <motion.span className="block text-[46px] font-light italic text-brass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.18 }}>更多。</motion.span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.9] text-warm-gray-600 max-w-[18rem]">加入會員，使用專屬工具、閱讀精選內容、預約顧問。</p>
      </header>

      <section className="px-6">
        <div className="border-t border-warm-gray-800/80">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.04}>
              <div className="flex items-start gap-5 py-6 border-b border-warm-gray-300">
                <span className="font-display text-[13px] tnum text-brass pt-1 w-6 shrink-0">0{i + 1}</span>
                <div className="flex-1">
                  <div className="font-serif text-[21px] font-semibold text-warm-gray-800 tracking-wide">{f.title}</div>
                  <p className="mt-1.5 text-[13px] leading-[1.8] text-warm-gray-600">{f.desc}</p>
                </div>
                <span className="pt-1 text-brass"><Ic n={f.icon} size={20} color="currentColor" /></span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="px-6 pt-14">
        <section className="grain relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">免費加入會員</h2>
          <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">加入後即可使用以上功能。</p>
          <motion.button onClick={onJoin} whileTap={{ scale: 0.97 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
            加入會員
          </motion.button>
          <button onClick={() => openLine(LINE_BOOK_URL)} className="relative z-10 mt-2 w-full py-3 text-[13px] tracking-[0.15em] text-white/75 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">
            想先聊聊？直接在 LINE 跟我們說
          </button>
        </section>
      </Reveal>
    </div>
  );
};
