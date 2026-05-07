import React from 'react';

export const InputBox = ({ id, label, hint, value, unit="萬", highlight=false, onChange }: any) => {
  const handleChange = (e: any) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    onChange({ target: { value: val } });
  };
  return (
  <div className={`border p-4 transition-colors rounded-2xl ${highlight ? 'bg-[#f5f3ff] border-[#c4b5fd] focus-within:border-[#7c3aed] focus-within:bg-white' : 'bg-warm-gray-50 border-warm-gray-200 focus-within:border-teal-base focus-within:bg-white'}`}>
    <div className={`text-[11px] font-medium tracking-widest uppercase mb-1 ${highlight ? 'text-[#7c3aed]' : 'text-warm-gray-800'}`}>{label}</div>
    {hint && <div className="text-[10px] text-warm-gray-600 font-normal tracking-wide">{hint}</div>}
    <div className={`flex items-center gap-2 mt-3 border-b pb-1 ${highlight ? 'border-[#ddd6fe]' : 'border-warm-gray-200'}`}>
      <input type="text" inputMode="decimal" placeholder="0" value={value} onChange={handleChange} 
        className={`no-spinner w-full border-0 outline-none font-serif text-[18px] font-bold bg-transparent placeholder:text-warm-gray-200 tracking-wider ${highlight ? 'text-[#7c3aed]' : 'text-warm-gray-800'}`} />
      <span className="text-[11px] text-warm-gray-400 font-normal shrink-0 tracking-widest uppercase">{unit}</span>
    </div>
  </div>
)};
