import { Ic } from "@/src/components/Icons";

export const TemplatePage = ({ title, desc, onBack }: { title: string, desc: string, onBack: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-[#f8f5ff] font-sans pb-6">
      {/* Background Orbs */}
      <div className="fixed top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#d8b4fe]/30 rounded-full blur-[80px] z-0 pointer-events-none" />
      <div className="fixed top-[150px] right-[-100px] w-[250px] h-[250px] bg-[#c084fc]/15 rounded-full blur-[60px] z-0 pointer-events-none" />

      {/* Header */}
      <div className="pt-12 pb-6 px-6 relative z-10 w-full max-w-sm mx-auto flex items-center justify-between">
        <button onClick={onBack} className="bg-white/60 backdrop-blur-md rounded-full w-11 h-11 flex items-center justify-center border border-white shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <Ic n="back" color="#64748b" size={20} />
        </button>
        <div className="text-[14px] font-black text-slate-800 tracking-tight">{title}</div>
        <div className="w-11" />
      </div>

      <div className="p-5 text-center mt-12 relative z-10 w-full max-w-sm mx-auto">
        <div className="w-[80px] h-[80px] bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner border border-white">
          <Ic n="star" size={36} color="#9333ea" />
        </div>
        <div className="text-[20px] font-black text-slate-800 mb-2 tracking-tight">{title}</div>
        <div className="text-[14px] text-slate-500 font-semibold mb-8">{desc}</div>
        
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-[20px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] inline-flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse" />
          <div className="text-[14px] font-black text-[#9333ea] tracking-wider uppercase">此頁面正在建置中，敬請期待</div>
          <div className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
