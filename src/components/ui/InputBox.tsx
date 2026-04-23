import React from 'react';

export const InputBox = ({ id, label, hint, unit="萬", onChange }: any) => (
  <div className="bg-[#F9F9F8] border border-[#EAEAE6] p-4 transition-colors focus-within:border-[#2D2D2A] focus-within:bg-[#FFFFFF]">
    <div className="text-[11px] font-medium text-[#2D2D2A] tracking-widest uppercase mb-1">{label}</div>
    {hint && <div className="text-[10px] text-[#8B8A88] font-normal tracking-wide">{hint}</div>}
    <div className="flex items-center gap-2 mt-3 border-b border-[#EAEAE6] pb-1">
      <input type="number" min="0" placeholder="0" onChange={onChange} 
        className="no-spinner w-full border-0 outline-none font-serif text-[18px] font-bold text-[#2D2D2A] bg-transparent placeholder:text-[#D6D3D1] tracking-wider" />
      <span className="text-[11px] text-[#AFAEA9] font-normal shrink-0 tracking-widest uppercase">{unit}</span>
    </div>
  </div>
);
