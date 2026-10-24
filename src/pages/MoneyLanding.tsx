import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";
import { Reveal, Eyebrow, SPRING } from "@/src/components/ui";
import { FEATURES } from "@/src/constants/features";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";

const types = ["穩健累積型", "成長放大型", "起步探索型", "策略進化型"];

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <div className="px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} aria-label="返回" className="flex items-center gap-1 text-[13px] tracking-[0.18em] text-warm-gray-600 hover:text-warm-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">
          <Ic n="back" size={16} /> 返回
        </button>
        <div className="font-display text-[13px] font-semibold tracking-[0.12em] text-warm-gray-800">OO SAY MONEY</div>
      </div>

      <header className="px-6 pt-14 pb-10">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          <Eyebrow className="mb-6">Free · about 90 seconds</Eyebrow>
        </motion.div>
        <h1 className="font-serif leading-[1.14] tracking-[-0.01em]">
          <motion.span className="block text-[44px] font-semibold text-warm-gray-800" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.08 }}>你的錢，</motion.span>
          <motion.span className="block text-[44px] font-medium text-brass" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.18 }}>都去哪了？</motion.span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.95] text-warm-gray-600 max-w-[19rem]">先了解你的財務心理類型，<br />再看清你的財務真實數字。</p>
      </header>

      <section className="px-6">
        <div className="border-t border-warm-gray-800/80">
          {/* 步驟 1 */}
          <Reveal>
            <div className="py-8 border-b border-warm-gray-300">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-display text-[13px] tnum text-brass">01</span>
                <h2 className="font-serif text-[24px] font-semibold text-warm-gray-800">你的理財類型？</h2>
              </div>
              <p className="text-[14px] leading-[1.95] text-warm-gray-600 pl-[2.1rem]">8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大，還是策略進化型？</p>
              <div className="flex flex-wrap gap-2 mt-5 pl-[2.1rem]">
                {types.map((t) => (
                  <span key={t} className="text-[13px] tracking-[0.1em] text-warm-gray-800 border border-warm-gray-300 px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
              <motion.button onClick={() => navigate("/quiz")} whileTap={{ scale: 0.96 }} className="mt-7 ml-[2.1rem] w-[calc(100%-2.1rem)] bg-forest text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-cyan-base transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50">
                開始測驗 <Ic n="arrow" size={16} color="currentColor" />
              </motion.button>
            </div>
          </Reveal>

          {/* 步驟 2 */}
          <Reveal delay={0.05}>
            <div className="py-8 border-b border-warm-gray-300">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-display text-[13px] tnum text-brass">02</span>
                <h2 className="font-serif text-[24px] font-semibold text-warm-gray-800">看清真實數字</h2>
                <span className="ml-auto text-[12px] tracking-[0.2em] text-brass border border-brass/40 px-2 py-0.5 rounded-full">{FEATURES.membership ? "需登入" : "免費"}</span>
              </div>
              <div className="pl-[2.1rem]">
                <div className="text-[12px] text-warm-gray-500 tracking-wide mb-3">報告範例（示意數字）</div>
                <div className="grid grid-cols-3 border-y border-warm-gray-300 divide-x divide-warm-gray-300">
                  {[
                    { label: "淨資產", val: "1,600萬" },
                    { label: "儲蓄率", val: "33%" },
                    { label: "財務分數", val: "78分" },
                  ].map((c, i) => (
                    <div key={c.label} className={`py-4 ${i === 0 ? "pr-3" : "px-3"}`}>
                      <div className="text-[12px] text-warm-gray-500 tracking-[0.1em] mb-1.5">{c.label}</div>
                      <div className="font-display text-[20px] font-medium text-forest tnum">{c.val}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[14px] leading-[1.95] text-warm-gray-600">儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次看清，並產生優先行動清單。</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal className="px-6 pt-14">
        <section className="grain relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
          {FEATURES.membership ? (
            <>
            <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">解鎖完整財務工具</h2>
            <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">免費加入會員，即可使用財管家，<br />用數字看清自己的財務狀況。</p>
            <motion.button onClick={onLogin} whileTap={{ scale: 0.96 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#9A3412] transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
              加入會員，立即開始 <Ic n="arrow" size={16} color="currentColor" />
            </motion.button>
            </>
          ) : (
            <>
              <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">看清自己的數字</h2>
              <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">財管家免費使用，填完就有一份財務健檢報告。</p>
              <motion.button onClick={() => navigate("/tool")} whileTap={{ scale: 0.96 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#9A3412] transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
                開始財務健檢 <Ic n="arrow" size={16} color="currentColor" />
              </motion.button>
              <button onClick={() => openLine(LINE_BOOK_URL)} className="relative z-10 mt-2 w-full py-3 text-[14px] text-white/80 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">
                想直接聊聊？在 LINE 跟我們說
              </button>
            </>
          )}
        </section>
      </Reveal>
    </div>
  );
};
