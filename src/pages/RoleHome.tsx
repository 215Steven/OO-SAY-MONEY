import { Ic } from "@/src/components/Icons";
import { GRIDS, ROLE_META, THEMES } from "@/src/constants/roles";
import { motion } from "motion/react";

export const RoleHome = ({ role, onSelect, onLogout }: any) => {
  const config = GRIDS[role];
  const t = THEMES[ROLE_META[role].theme];
  
  return (
    <div className="min-h-[100dvh] pb-10 flex flex-col relative w-full items-center bg-[#F8F8F6]">

      <div className="w-full max-w-sm px-6 pt-10 pb-6 relative z-10 border-b border-[#EAEAE6] bg-[#FFFFFF] shadow-sm mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#2D2D2A] mb-4 bg-[#FFFFFF]">
              <div className="w-1.5 h-1.5 bg-[#2D2D2A]" />
              <div className="text-[10px] font-medium tracking-[0.2em] text-[#2D2D2A] uppercase">
                {ROLE_META[role].label} · 已登入
              </div>
            </div>
            <div className="text-[24px] font-serif font-bold tracking-widest text-[#2D2D2A]">
              {config.title}
            </div>
          </div>
          <button onClick={onLogout} 
            className="border-b border-[#AFAEA9] pb-0.5 text-[11px] font-normal tracking-widest uppercase cursor-pointer transition-colors hover:text-[#2D2D2A] hover:border-[#2D2D2A] text-[#8B8A88]"
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
              className="group px-4 py-8 flex flex-col items-center justify-center gap-5 cursor-pointer transition-colors bg-[#FFFFFF] border border-[#EAEAE6] hover:bg-[#F2F2F0] hover:border-[#D6D3D1]"
            >
              <div className="w-12 h-12 flex items-center justify-center text-[#2D2D2A]">
                <Ic n={item.icon} size={28} color="currentColor" />
              </div>
              <div className="text-center">
                <div className="text-[14px] font-medium tracking-widest text-[#2D2D2A] mb-2 uppercase">
                  {item.label}
                </div>
                <div className="text-[11px] font-normal text-[#8B8A88] tracking-widest italic">
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
