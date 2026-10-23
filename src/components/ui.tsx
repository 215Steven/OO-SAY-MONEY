import { motion, useInView, animate } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useEffect, useRef, useState, ReactNode, Attributes } from "react";

// 共用動效與小元件（設計系統 v2）
export const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

/** 進入視窗時淡入上移；用 transform/opacity，行動裝置也順 */
export const Reveal = ({ children, delay = 0, className = "", y = 18 }: Attributes & { children: ReactNode; delay?: number; className?: string; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    transition={{ ...SPRING, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/** 數字滾動：進入視窗才開始，吃 prefers-reduced-motion */
export const CountUp = ({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(to); return; }
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={`tnum ${className}`}>{val}{suffix}</span>;
};

/** 品牌簽名：一條緩緩上升的資產曲線，線條自己畫出來 */
export const MoneyLine = ({ className = "", stroke = "var(--color-brass)" }: { className?: string; stroke?: string }) => (
  <svg viewBox="-6 -6 332 102" fill="none" className={className} style={{ overflow: "visible" }} aria-hidden="true">
    <motion.path
      d="M2 78 C 40 74, 62 70, 92 62 S 140 58, 168 44 S 224 40, 252 22 S 296 12, 318 6"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
    />
    <motion.circle
      cx="318" cy="6" r="3.5" fill={stroke}
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.4, ...SPRING }}
    />
  </svg>
);

export const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`text-[13px] font-medium tracking-[0.12em] text-warm-gray-600 ${className}`}>{children}</div>
);

/** 載入畫面：品牌字樣加一條緩緩移動的細線 */
export const Loading = () => (
  <div className="min-h-[60dvh] flex flex-col items-center justify-center gap-5" role="status" aria-label="載入中">
    <div className="font-display text-[13px] font-semibold tracking-[0.3em] text-warm-gray-800">OO SAY MONEY</div>
    <div className="relative w-24 h-px bg-warm-gray-200 overflow-hidden">
      <motion.span className="absolute inset-y-0 w-10 bg-brass" initial={{ x: -40 }} animate={{ x: 96 }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  </div>
);

/** 頁面頂列：返回（可選）＋品牌字樣 */
export const TopBar = ({ onBack, right }: { onBack?: () => void; right?: ReactNode }) => (
  <div className="px-6 pt-8 flex items-center justify-between">
    {onBack ? (
      <button onClick={onBack} aria-label="返回" className="flex items-center gap-1 text-[13px] tracking-[0.18em] text-warm-gray-600 hover:text-warm-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">
        <Ic n="back" size={16} /> 返回
      </button>
    ) : (
      <div className="font-display text-[13px] font-semibold tracking-[0.12em] text-warm-gray-800">OO SAY MONEY</div>
    )}
    {right ?? (onBack ? <div className="font-display text-[13px] font-semibold tracking-[0.12em] text-warm-gray-800">OO SAY MONEY</div> : null)}
  </div>
);

/** 頁面主標：兩行，第二行為銅金斜體 */
export const PageHeader = ({ eyebrow, line1, line2, desc }: { eyebrow: string; line1: string; line2?: string; desc?: ReactNode }) => (
  <header className="px-6 pt-14 pb-10">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
      <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
    </motion.div>
    <h1 className="font-serif leading-[1.12] tracking-[-0.01em]">
      <motion.span className="block text-[44px] font-semibold text-warm-gray-800" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.08 }}>{line1}</motion.span>
      {line2 && <motion.span className="block text-[44px] font-normal text-brass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.18 }}>{line2}</motion.span>}
    </h1>
    {desc && <p className="mt-6 text-[15px] leading-[1.95] text-warm-gray-600 max-w-[19rem]">{desc}</p>}
  </header>
);

/** 小節標題：編號＋大寫小標 */
export const SectionLabel = ({ no, children }: { no?: string; children: ReactNode }) => (
  <div className="flex items-baseline gap-4 mb-5">
    {no && <span className="font-display text-[13px] tnum text-brass">{no}</span>}
    <span className="text-[13px] font-medium tracking-[0.12em] text-warm-gray-600">{children}</span>
  </div>
);

/** 深色轉換區塊 */
export const CtaBlock = ({ title, desc, primary, onPrimary, secondary, onSecondary, note }: {
  title: string; desc?: ReactNode; primary: string; onPrimary: () => void; secondary?: string; onSecondary?: () => void; note?: string;
}) => (
  <Reveal className="px-6 pt-14">
    <section className="grain relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
      <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">{title}</h2>
      {desc && <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">{desc}</p>}
      <motion.button onClick={onPrimary} whileTap={{ scale: 0.96 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
        {primary}
      </motion.button>
      {secondary && onSecondary && (
        <button onClick={onSecondary} className="relative z-10 mt-2 w-full py-3 text-[13px] tracking-[0.15em] text-white/75 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">{secondary}</button>
      )}
      {note && <p className="relative z-10 mt-4 text-[12px] text-white/45 tracking-wide text-center">{note}</p>}
    </section>
  </Reveal>
);
