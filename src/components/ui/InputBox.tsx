import React from 'react';

export const InputBox = ({ id, label, hint, unit="萬", onChange }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
    <div className="text-[10px] font-bold text-slate-500 mb-0.5">{label}</div>
    {hint && <div className="text-[9px] text-slate-400 mb-1">{hint}</div>}
    <div className="flex items-center gap-1 mt-1">
      <input type="number" min="0" placeholder="0" onChange={onChange} 
        className="no-spinner w-full border-0 outline-none font-inherit text-[18px] font-bold text-slate-900 bg-transparent placeholder:text-slate-300" />
      <span className="text-[11px] text-slate-500 font-semibold shrink-0">{unit}</span>
    </div>
  </div>
);
