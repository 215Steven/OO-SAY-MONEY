import { Ic } from "@/src/components/Icons";

export const TemplatePage = ({ title, desc, onBack }: { title: string, desc: string, onBack: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-[#F8F8F6] font-sans pb-6">

      {/* Header */}
      <div className="pt-12 pb-6 px-6 relative z-10 w-full max-w-sm mx-auto flex items-center justify-between">
        <button onClick={onBack} className="bg-[#FFFFFF] border border-[#EAEAE6] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#F2F2F0] transition-colors">
          <Ic n="back" color="#2D2D2A" size={20} />
        </button>
        <div className="text-[13px] font-medium text-[#2D2D2A] tracking-wider uppercase border-b border-[#2D2D2A] pb-0.5">{title}</div>
        <div className="w-10" />
      </div>

      <div className="p-5 text-center mt-12 relative z-10 w-full max-w-sm mx-auto">
        <div className="w-[64px] h-[64px] bg-[#FFFFFF] border border-[#EAEAE6] mx-auto flex items-center justify-center mb-8">
          <Ic n="star" size={24} color="#2D2D2A" />
        </div>
        <div className="text-[24px] font-serif font-bold text-[#2D2D2A] mb-3 tracking-widest">{title}</div>
        <div className="text-[13px] text-[#8B8A88] font-normal mb-10 tracking-wide">{desc}</div>
        
        <div className="border border-[#EAEAE6] bg-[#FFFFFF] py-5 px-6 inline-flex items-center justify-center gap-3 w-full">
          <div className="text-[12px] font-medium text-[#2D2D2A] tracking-[0.2em] uppercase">功能建置中 敬請期待</div>
        </div>
      </div>
    </div>
  );
};
