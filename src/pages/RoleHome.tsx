import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META, THEMES } from "@/src/constants/roles";
import { motion } from "motion/react";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  const t = THEMES[ROLE_META[role].theme];
  
  return (
    <div className="min-h-[100dvh] pb-10 flex flex-col relative w-full items-center bg-warm-gray-50">

      <div className="w-full max-w-sm px-6 pt-10 pb-6 relative z-10 border-b border-warm-gray-200 bg-white shadow-sm mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-teal-base mb-4 bg-white">
              <div className="w-1.5 h-1.5 bg-teal-base" />
              <div className="text-[10px] font-medium tracking-[0.2em] text-warm-gray-800 uppercase">
                {ROLE_META[role].label} · 已登入
              </div>
            </div>
            <div className="text-[24px] font-serif font-bold tracking-widest text-warm-gray-800">
              {config.title}
            </div>
          </div>
          <button onClick={onLogout} 
            className="border-b border-[#AFAEA9] pb-0.5 text-[11px] font-normal tracking-widest uppercase cursor-pointer transition-colors hover:text-warm-gray-800 hover:border-teal-base text-warm-gray-600"
          >
            登出
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm px-5 relative z-10 flex-1">
        <div className="grid grid-cols-2 gap-3 pb-8">
          {config.items.map((item: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: i * 0.05 }}
              key={item.key} 
              onClick={() => onSelect(item.key, role)} 
              className="group px-4 py-8 flex flex-col items-center justify-center gap-5 cursor-pointer transition-colors bg-white border border-warm-gray-200 hover:bg-warm-gray-100 hover:border-warm-gray-300 rounded-2xl"
            >
              <div className="w-12 h-12 flex items-center justify-center text-warm-gray-800">
                <Ic n={item.icon} size={28} color="currentColor" />
              </div>
              <div className="text-center">
                <div className="text-[14px] font-medium tracking-widest text-warm-gray-800 mb-2 uppercase">
                  {item.label}
                </div>
                <div className="text-[11px] font-normal text-warm-gray-600 tracking-widest italic">
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
