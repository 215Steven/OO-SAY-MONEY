import React from 'react';

export const InputBox = ({ id, label, hint, unit="萬", onChange }: any) => (
  <div className="bg-white/80 backdrop-blur-md border border-white rounded-[20px] p-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] focus-within:border-[#c084fc] focus-within:shadow-[0_4px_15px_rgba(168,85,247,0.15)] transition-all">
    <div className="text-[11px] font-black text-slate-700 tracking-tight mb-0.5">{label}</div>
    {hint && <div className="text-[10px] text-slate-400 font-medium mb-1.5">{hint}</div>}
    <div className="flex items-center gap-1.5 mt-2">
      <input type="number" min="0" placeholder="0" onChange={onChange} 
        className="no-spinner w-full border-0 outline-none font-inherit text-[20px] font-black text-slate-900 bg-transparent placeholder:text-slate-300" />
      <span className="text-[12px] text-slate-500 font-bold shrink-0">{unit}</span>
    </div>
  </div>
);
