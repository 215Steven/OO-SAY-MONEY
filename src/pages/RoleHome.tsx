import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META, THEMES } from "@/src/constants/roles";
import { motion } from "motion/react";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  const t = THEMES[ROLE_META[role].theme];
  const isDark = ROLE_META[role].theme === "client" || ROLE_META[role].theme === "peer";

  return (
    <div
      className="min-h-[100dvh] pb-10 font-sans"
      style={{ background: isDark ? "#0f172a" : "#f8fafc" }}
    >

      {/* ── Header ── */}
      <div
        className="px-6 pt-10 pb-7 relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "#ffffff",
          borderBottom: isDark ? "none" : "1px solid #f1f5f9",
          boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {isDark && (
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div
              className="text-[11px] font-bold tracking-[0.12em] uppercase mb-1"
              style={{ color: isDark ? t.accent : "#f59e0b" }}
            >
              {ROLE_META[role].label} · 已炻入
            </div>
            <div
              className="text-[24px] font-extrabold tracking-[-0.025em]"
              style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
            >
              {config.title}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold cursor-pointer transition-all active:scale-95 border"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            登出 <Ic n="arrowRight" size={13} color={isDark ? "#94a3b8" : "#64748b"} />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {config.items.map((item: any, i: number) => {
            const isHero = item.span === 2;
            const isDarkCard = item.bg === "#0f172a" || item.bg === "#0ea5e9";

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.06 }}
                onClick={() => onSelect(item.key, role)}
                className={`rounded-[20px] cursor-pointer transition-all duration-200 active:scale-[0.97] border overflow-hidden ${isHero ? "col-span-2" : "col-span-1"}`}
                style={{
                  background: item.bg,
                  borderColor: isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
                  boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {isHero ? (
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <div className="text-[16px] font-extrabold mb-0.5 tracking-[-0.01em]" style={{ color: isDarkCard ? "#f8fafc" : "#0f172a" }}>
                        {item.label}
                      </div>
                      <div className="text-[12px] font-medium" style={{ color: isDarkCard ? "rgba(248,250,252,0.55)" : "#64748b" }}>
                        {item.sub}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${item.accent}22` }}>
                      <Ic n={item.icon} size={22} color={item.accent} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-3 py-6">
                    <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center" style={{ background: `${item.accent}18` }}>
                      <Ic n={item.icon} size={22} color={item.accent} />
                    </div>
                    <div className="text-center">
                      <div className="text-[13px] font-extrabold mb-0.5 tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                        {item.label}
                      </div>
                      <div className="text-[11px] font-medium leading-snug" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
