import { motion, useInView, animate } from "motion/react";
import { useEffect, useRef, useState, ReactNode } from "react";

// 共用動效與小元件（設計系統 v2）
export const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

/** 進入視窗時淡入上移；用 transform/opacity，行動裝置也順 */
export const Reveal = ({ children, delay = 0, className = "", y = 18 }: { children: ReactNode; delay?: number; className?: string; y?: number }) => (
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
  <svg viewBox="0 0 320 90" fill="none" className={className} aria-hidden="true">
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
  <div className={`text-[11px] font-medium tracking-[0.28em] uppercase text-warm-gray-600 ${className}`}>{children}</div>
);
