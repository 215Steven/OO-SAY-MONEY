import { Ic } from "@/src/components/Icons";

export const LoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: (role: string) => void }) => (
  <div className="fixed inset-0 bg-[#2D2D2A]/80 flex items-end sm:items-center justify-center z-[200] p-4 font-sans" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-[#F8F8F6] border border-[#EAEAE6] rounded-t-2xl sm:rounded-2xl pt-6 px-6 pb-10 w-full animate-slideUp sm:animate-fadeIn shadow-2xl flex flex-col max-w-sm mx-auto">
      <div className="w-12 h-1 bg-[#D6D3D1] rounded-full mx-auto mb-8 sm:hidden" />
      <div className="text-[20px] font-serif font-bold text-[#2D2D2A] mb-2 tracking-widest text-center">身份識別</div>
      <div className="text-[12px] text-[#8B8A88] font-normal tracking-wide text-center mb-8">選擇身份以進入對應區域</div>
      {[
        { role:"newMember", label:"新會員",   sub:"探索理財藍圖", icon:"user" },
        { role:"client",    label:"尊爵客戶", sub:"專屬財務管理", icon:"star" },
        { role:"peer",      label:"同業夥伴", sub:"專業資源交流", icon:"gear" },
      ].map((item, i) => (
        <div key={item.role} onClick={() => onLogin(item.role)} className="bg-[#FFFFFF] border border-[#EAEAE6] p-4 mb-3 flex items-center gap-4 cursor-pointer hover:bg-[#F2F2F0] hover:border-[#D6D3D1] transition-all group relative overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${i === 0 ? 'bg-[#2D2D2A]' : i === 1 ? 'bg-[#8B8A88]' : 'bg-[#D6D3D1]'}`} />
          <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[#2D2D2A] border border-[#EAEAE6] bg-[#F9F9F8] ml-2">
            <Ic n={item.icon} size={20} color="currentColor" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-medium text-[#2D2D2A] tracking-wider mb-0.5">{item.label}</div>
            <div className="text-[12px] text-[#8B8A88] font-normal tracking-wide">{item.sub}</div>
          </div>
          <div className="w-8 h-8 flex items-center justify-center text-[#8B8A88] group-hover:text-[#2D2D2A] transition-colors">
             <Ic n="arrowRight" size={16} color="currentColor" />
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes slideUp { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes fadeIn { 0% { opacity: 0; scale: 0.95; } 100% { opacity: 1; scale: 1; } }
      .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @media (min-width: 640px) { .sm\\:animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; } }
    `}</style>
  </div>
);
