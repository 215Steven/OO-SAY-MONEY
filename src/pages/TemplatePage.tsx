import { Ic } from "@/src/components/Icons";

export const TemplatePage = ({ title, desc, onBack }: { title: string, desc: string, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-6">

      {/* Header */}
      <div className="pt-12 pb-6 px-6 relative z-10 w-full max-w-sm mx-auto flex items-center justify-between">
        <button onClick={onBack} className="bg-white border border-warm-gray-200 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-warm-gray-100 transition-colors rounded-full shadow-sm">
          <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
        </button>
        <div className="text-[13px] font-medium text-warm-gray-800 tracking-wider uppercase border-b-2 border-teal-base/30 pb-0.5">{title}</div>
        <div className="w-10" />
      </div>

      <div className="p-5 text-center mt-12 relative z-10 w-full max-w-sm mx-auto">
        <div className="w-[72px] h-[72px] bg-white border border-teal-soft/80 rounded-full mx-auto flex items-center justify-center mb-8 shadow-sm relative">
          <div className="absolute inset-0 bg-cyan-soft rounded-full -z-10 scale-125 opacity-50 blur-sm" />
          <Ic n="star" size={28} color="var(--color-teal-base)" />
        </div>
        <div className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-wide">{title}</div>
        <div className="text-[14px] text-warm-gray-800/70 font-normal mb-10 tracking-wide">{desc}</div>
        
        <div className="border border-teal-soft bg-cyan-soft/30 py-5 px-6 inline-flex items-center justify-center gap-3 w-full rounded-2xl">
          <div className="text-[12px] font-medium text-teal-base tracking-[0.2em] uppercase">功能建置中 敬請期待</div>
        </div>
      </div>
    </div>
  );
};
