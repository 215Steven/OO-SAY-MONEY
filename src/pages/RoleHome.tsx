import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META } from "@/src/constants/roles";
import { motion } from "motion/react";
import { Eyebrow, SPRING } from "@/src/components/ui";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-10">
      <div className="px-6 pt-8 flex items-center justify-between">
        <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800">OO SAY MONEY</div>
        <button onClick={onLogout} className="text-[12px] tracking-[0.18em] text-warm-gray-600 border-b border-warm-gray-300 pb-0.5 hover:text-warm-gray-800 hover:border-warm-gray-800 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">登出</button>
      </div>

      <header className="px-6 pt-14 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          <Eyebrow className="mb-6">{ROLE_META[role].label} · 已登入</Eyebrow>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.1 }} className="font-serif text-[40px] leading-[1.15] font-semibold text-warm-gray-800 tracking-[-0.01em]">
          {config.title}
        </motion.h1>
      </header>

      <nav className="px-6" aria-label="會員功能">
        <div className="border-t border-warm-gray-800/80">
          {config.items.map((item: any, i: number) => (
            <motion.button
              key={item.key}
              onClick={() => onSelect(item.key, role)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 + i * 0.05 }}
              whileTap={{ scale: 0.985 }}
              className="group relative w-full text-left flex items-center gap-5 py-6 border-b border-warm-gray-300 overflow-hidden cursor-pointer outline-none focus-visible:bg-warm-gray-100"
            >
              <span className="absolute inset-0 bg-warm-gray-100 origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 ease-out" aria-hidden="true" />
              <span className="relative font-display text-[13px] tnum text-brass w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative flex-1">
                <span className="block font-serif text-[22px] font-semibold text-warm-gray-800 tracking-wide">{item.label}</span>
                <span className="block mt-1 text-[12px] text-warm-gray-600 tracking-wide">{item.sub}</span>
              </span>
              <span className="relative text-brass"><Ic n={item.icon} size={20} color="currentColor" /></span>
              <span className="relative text-warm-gray-800 group-hover:translate-x-1.5 transition-transform duration-300"><Ic n="arrow" size={20} color="currentColor" /></span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
};
