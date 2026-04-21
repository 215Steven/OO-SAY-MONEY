import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META, THEMES } from "@/src/constants/roles";
import { motion } from "motion/react";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  const t = THEMES[ROLE_META[role].theme];
  
  // Decide layout background strategy according to theme
  const isDark = ROLE_META[role].theme === 'client' || ROLE_META[role].theme === 'peer';
  
  return (
    <div className={`min-h-[100dvh] pb-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`px-6 pt-10 pb-6 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-white shadow-sm border-b border-slate-100'}`}>
        
        {/* Background glow for dark mode */}
        {isDark && (
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        )}

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className={`text-[12px] font-bold tracking-wider mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {ROLE_META[role].label} · 已登入
            </div>
            <div className={`text-[24px] font-extrabold tracking-[-0.02em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {config.title}
            </div>
          </div>
          <button onClick={onLogout} 
            className={`border rounded-xl px-4 py-2 text-[12px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-sm
              ${isDark ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
            `}
          >
            登出 <Ic n="arrowRight" size={14} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {config.items.map((item: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: i * 0.05 }}
              key={item.key} 
              onClick={() => onSelect(item.key, role)} 
              className={`px-4 py-6 rounded-[20px] flex flex-col items-center gap-3.5 cursor-pointer border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95
                ${isDark ? 'bg-slate-800 border-slate-700/50 shadow-md shadow-slate-900/40 hover:border-slate-600' : 'bg-white border-slate-100 shadow-sm shadow-slate-200/50 hover:border-indigo-100' }
              `}
            >
              <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center relative overflow-hidden" style={{ background: `${item.accent}15` }}>
                <Ic n={item.icon} size={24} color={item.accent} />
              </div>
              <div className="text-center">
                <div className={`text-[14px] font-extrabold tracking-[0.02em] mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {item.label}
                </div>
                <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
