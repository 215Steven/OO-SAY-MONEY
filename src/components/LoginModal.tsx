import { Ic } from "@/src/components/Icons";

export const LoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: (role: string) => void }) => (
  <div className="fixed inset-0 bg-slate-900/60 flex items-end z-[200]" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-t-[20px] pt-7 px-5 pb-10 w-full animate-slideUp">
      <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
      <div className="text-[18px] font-extrabold text-slate-900 mb-1.5">選擇你的身份</div>
      <div className="text-[13px] text-slate-500 mb-6">LINE 登入後，選擇你的身份以獲得最適合的內容</div>
      {[
        { role:"newMember", label:"新會員",   sub:"想了解理財規劃的朋友", accentClass:"text-indigo-600", bgAccentClass:"bg-indigo-50", borderAccentClass:"border-indigo-100", icon:"user" },
        { role:"client",    label:"現有客戶", sub:"已在規劃中的客戶",      accentClass:"text-indigo-400", bgAccentClass:"bg-indigo-50/50", borderAccentClass:"border-indigo-100", icon:"star" },
        { role:"peer",      label:"同業夥伴", sub:"金融從業人員",          accentClass:"text-indigo-500", bgAccentClass:"bg-indigo-50", borderAccentClass:"border-indigo-100", icon:"gear" },
      ].map(item => (
        <div key={item.role} onClick={() => onLogin(item.role)} className={`bg-slate-50 border ${item.borderAccentClass} rounded-2xl py-4 px-4.5 mb-3 flex items-center gap-3.5 cursor-pointer shadow-sm transition-transform hover:scale-102`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.bgAccentClass} ${item.accentClass}`}>
            <Ic n={item.icon} size={22} color="currentColor" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-slate-900">{item.label}</div>
            <div className="text-[12px] text-slate-500 mt-0.5">{item.sub}</div>
          </div>
          <div className="text-slate-300">
             <Ic n="arrow" size={18} color="currentColor" />
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      .animate-slideUp { animation: slideUp 0.3s ease; }
      .hover\\:scale-102:hover { transform: scale(1.02); }
    `}</style>
  </div>
);
