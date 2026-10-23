import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { Fragment } from "react";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";
import { Reveal, CountUp, Eyebrow, SPRING } from "@/src/components/ui";

const principles = [
  { icon: "shield",  title: "先蓋好地基",         desc: "保障規劃是一切的起點。風險防護到位，才能安心往上走。" },
  { icon: "trend",   title: "讓錢替你工作",        desc: "資產配置 × 複利效應，加速達到財務自由的時間點。" },
  { icon: "diamond", title: "舒服走到想去的地方", desc: "不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。" },
];

export const AboutPage = ({ onBack, onJoin }: any) => {
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      {/* 頂列 */}
      <div className="px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} aria-label="返回" className="flex items-center gap-1 text-[13px] tracking-[0.18em] text-warm-gray-600 hover:text-warm-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">
          <Ic n="back" size={16} /> 返回
        </button>
        <div className="font-display text-[13px] font-semibold tracking-[0.12em] text-warm-gray-800">OO SAY MONEY</div>
      </div>

      {/* 名字當主視覺 */}
      <header className="px-6 pt-14 pb-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          <Eyebrow className="mb-6">Our story</Eyebrow>
        </motion.div>
        <h1 className="font-serif leading-[1.02] tracking-[-0.02em] text-forest">
          <motion.span className="block text-[56px] font-light italic" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.1 }}>Steven</motion.span>
          <motion.span className="block text-[56px] font-semibold pl-10 -mt-1" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.2 }}>
            <span className="font-light italic text-brass mr-2">&amp;</span>Annie
          </motion.span>
        </h1>
      </header>

      {/* 數字：細線分欄，不用卡片 */}
      <Reveal>
        <div className="mx-6 grid grid-cols-3 border-y border-warm-gray-800/80 divide-x divide-warm-gray-300">
          {[
            { node: <CountUp to={20} suffix="年" />, label: "深耕財務保險" },
            { node: <CountUp to={300} suffix="+" />, label: "專屬服務家庭" },
            { node: <span className="tnum">9 位數</span>, label: "管理資產規模" },
          ].map((s, i) => (
            <div key={i} className="py-6 px-3 first:pl-0">
              <div className="font-display text-[28px] font-medium text-forest leading-none">{s.node}</div>
              <div className="mt-2 text-[12px] tracking-[0.12em] text-warm-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 宣言：大字、逐段浮現 */}
      <section className="px-6 pt-16">
        <Reveal><Eyebrow className="mb-6">Manifesto</Eyebrow></Reveal>
        <Reveal>
          <h2 className="font-serif text-[30px] leading-[1.35] font-semibold text-warm-gray-800">
            從等待，<br />到擁有<span className="text-brass">選擇</span>的自由
          </h2>
        </Reveal>
        <div className="mt-10 space-y-8 text-[16px] leading-[2] text-warm-gray-600 max-w-[22rem]">
          <Reveal><p>如果理財只是 Buy and Hold，<span className="text-warm-gray-800">這世界就不需要投資策略和理財書籍了。</span></p></Reveal>
          <Reveal><p>真正的自由，不是逃離現狀，而是當機會來臨時，<span className="text-warm-gray-800">你有選擇的底氣。</span></p></Reveal>
          <Reveal><p>我們做的不是單純選標的，而是建構一套能持續滾動、增長的<span className="text-warm-gray-800">現金流系統。</span></p></Reveal>
          <Reveal><p>這套歷經九位數資產驗證的實戰方法，已經協助許多人從等待走向選擇人生。與其獨自摸索，不如讓它成為你的<span className="text-warm-gray-800">財務底層邏輯。</span></p></Reveal>
        </div>
      </section>

      {/* 三個做法：編號清單 */}
      <section className="px-6 pt-20">
        <Reveal><Eyebrow className="mb-4">How we work</Eyebrow></Reveal>
        <div className="border-t border-warm-gray-800/80">
          {principles.map((p, i) => (
            <Fragment key={p.title}><Reveal delay={i * 0.05}>
              <div className="flex gap-5 py-7 border-b border-warm-gray-300">
                <div>
                  <div className="font-serif text-[21px] font-semibold text-warm-gray-800 tracking-wide">{p.title}</div>
                  <p className="mt-2 text-[14px] leading-[1.9] text-warm-gray-600">{p.desc}</p>
                </div>
              </div>
            </Reveal></Fragment>
          ))}
        </div>
      </section>

      {/* 連結 */}
      <Reveal className="px-6 pt-16">
        <Eyebrow className="mb-4">Find us</Eyebrow>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "https://www.facebook.com/oosayhi", label: "FB 粉專", icon: "user" },
            { href: "https://oosayhi.com", label: "部落格", icon: "book" },
          ].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="group no-underline flex items-center justify-between rounded-2xl border border-warm-gray-300 px-4 py-4 hover:bg-warm-gray-100 hover:border-warm-gray-800/40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50">
              <span className="flex items-center gap-2.5 text-[14px] font-medium text-warm-gray-800 tracking-wide"><Ic n={l.icon} size={18} color="var(--color-brass)" />{l.label}</span>
              <span className="text-warm-gray-500 group-hover:translate-x-1 transition-transform"><Ic n="arrow" size={16} color="currentColor" /></span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="px-6 pt-16">
        <section className="grain relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">想了解更多？</h2>
          <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">加入會員，了解讓錢替你工作的做法。</p>
          <motion.button onClick={onJoin} whileTap={{ scale: 0.96 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
            免費加入會員
          </motion.button>
          <button onClick={() => openLine(LINE_BOOK_URL)} className="relative z-10 mt-2 w-full py-3 text-[13px] tracking-[0.15em] text-white/75 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">
            想先聊聊？直接在 LINE 跟我們說
          </button>
        </section>
      </Reveal>

      <p className="px-8 mt-10 pb-10 text-[12px] text-warm-gray-500 text-center tracking-wide leading-relaxed">
        以上為過往服務經驗，不代表未來結果，內容不構成投資建議。
      </p>
    </div>
  );
};
