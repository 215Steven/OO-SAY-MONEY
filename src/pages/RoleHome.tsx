import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META, THEMES } from "@/src/constants/roles";
import { motion } from "motion/react";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  const t = THEMES[ROLE_META[role].theme];
  
  return (
    <div className="min-h-[100dvh] pb-10 flex flex-col relative w-full items-center">
      
      {/* Background Orbs (matching other pages) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-[#e0e7ff] rounded-full blur-[80px] pointer-events-none opacity-60 mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-[#f3e8ff] rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-multiply" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-[#dbeafe] rounded-full blur-[80px] pointer-events-none opacity-50 mix-blend-multiply" />

      <div className="w-full max-w-sm px-6 pt-10 pb-6 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-white shadow-sm mb-3">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <div className="text-[12px] font-black tracking-wider text-[#9333ea] uppercase">
                {ROLE_META[role].label} · 已登入
              </div>
            </div>
            <div className="text-[28px] font-black tracking-[-0.03em] text-slate-800">
              {config.title}
            </div>
          </div>
          <button onClick={onLogout} 
            className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] px-4 py-2.5 text-[13px] font-black cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95 flex items-center gap-1.5 text-[#ef4444]"
          >
            登出 <Ic n="arrowRight" size={14} color="currentColor" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm px-5 relative z-10 flex-1">
        <div className="grid grid-cols-2 gap-3 pb-8">
          {config.items.map((item: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: i * 0.05 }}
              key={item.key} 
              onClick={() => onSelect(item.key, role)} 
              className="group px-3 py-6 rounded-[24px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white hover:bg-white hover:shadow-[0_15px_40px_rgba(147,51,234,0.1)] hover:border-[#e9d5ff]"
            >
              <div className="w-[56px] h-[56px] rounded-[20px] flex items-center justify-center relative shadow-inner transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${item.accent}15, ${item.accent}30)` }}>
                <Ic n={item.icon} size={28} color={item.accent} />
              </div>
              <div className="text-center">
                <div className="text-[15px] font-black tracking-wide text-slate-800 mb-1">
                  {item.label}
                </div>
                <div className="text-[11.5px] font-bold text-slate-400">
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
