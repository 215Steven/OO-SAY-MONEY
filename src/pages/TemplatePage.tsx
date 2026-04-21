import { Ic } from "@/src/components/Icons";

export const TemplatePage = ({ title, desc, onBack }: { title: string, desc: string, onBack: () => void }) => {
  return (
    <div className="bg-slate-50 min-h-full pb-6">
      <div className="bg-white border-b border-slate-100 py-4 px-5 flex items-center gap-3">
        <button onClick={onBack} className="bg-transparent border-0 cursor-pointer p-0 transition-opacity hover:opacity-75">
          <Ic n="back" size={22} color="#0f172a" />
        </button>
        <div className="text-[17px] font-bold text-slate-900">{title}</div>
      </div>
      <div className="p-5 text-center mt-10">
        <div className="w-[64px] h-[64px] bg-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <Ic n="star" size={32} color="#94a3b8" />
        </div>
        <div className="text-[16px] font-bold text-slate-900 mb-2">{title}</div>
        <div className="text-[13px] text-slate-500">{desc}</div>
        <div className="mt-6 text-[11px] text-slate-400 border border-slate-200 rounded-lg p-3 inline-block">
          此頁面正在建置中，敬請期待。
        </div>
      </div>
    </div>
  );
};
