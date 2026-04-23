import { Ic } from "@/src/components/Icons";

export const LoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: (role: string) => void }) => (
  <div className="fixed inset-0 bg-[#d8b4fe]/20 backdrop-blur-md flex items-end z-[200]" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-white/90 backdrop-blur-xl border-t border-white rounded-t-[32px] pt-4 px-6 pb-12 w-full animate-slideUp shadow-[0_-10px_40px_rgba(147,51,234,0.15)] flex flex-col max-w-md mx-auto">
      <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
      <div className="text-[22px] font-black text-slate-800 mb-2 tracking-tight">選擇您的身份</div>
      <div className="text-[14px] text-slate-500 font-semibold mb-8">模擬登入後，選擇身份以獲得專屬體驗</div>
      {[
        { role:"newMember", label:"新會員",   sub:"想了解理財規劃的您", accentClass:"text-[#9333ea]", bgAccentClass:"bg-[#f3e8ff]", borderAccentClass:"border-white", icon:"user" },
        { role:"client",    label:"現有客戶", sub:"已在進行專屬規劃",      accentClass:"text-[#c084fc]", bgAccentClass:"bg-[#faf5ff]", borderAccentClass:"border-white", icon:"star" },
        { role:"peer",      label:"保險同業", sub:"金融傳承與創新",          accentClass:"text-[#a855f7]", bgAccentClass:"bg-[#f3e8ff]", borderAccentClass:"border-white", icon:"gear" },
      ].map(item => (
        <div key={item.role} onClick={() => onLogin(item.role)} className={`bg-white/60 backdrop-blur-sm border ${item.borderAccentClass} rounded-[24px] p-4 mb-4 flex items-center gap-4 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all hover:scale-[1.02] hover:bg-white`}>
          <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${item.bgAccentClass} ${item.accentClass}`}>
            <Ic n={item.icon} size={24} color="currentColor" />
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-black text-slate-800 tracking-tight">{item.label}</div>
            <div className="text-[13px] text-slate-500 font-medium mt-0.5">{item.sub}</div>
          </div>
          <div className={`w-8 h-8 rounded-full ${item.bgAccentClass} flex items-center justify-center text-[#c084fc]`}>
             <Ic n="arrowRight" size={16} color="currentColor" />
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes slideUp { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `}</style>
  </div>
);
