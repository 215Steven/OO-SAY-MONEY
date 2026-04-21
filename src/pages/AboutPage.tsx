import { Ic } from "@/src/components/Icons";

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="pb-6">
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-7 px-5 pb-8 relative overflow-hidden">
      <div className="absolute -top-[40px] -right-[30px] w-[160px] h-[160px] rounded-full bg-white/5" />
      <div className="absolute -bottom-[20px] -left-[20px] w-[100px] h-[100px] rounded-full bg-indigo-600/10" />
      <button onClick={onBack} className="bg-transparent border-0 cursor-pointer mb-5 p-0 block transition-opacity hover:opacity-75">
        <Ic n="back" color="rgba(255,255,255,.7)" />
      </button>
      <div className="text-[10px] font-bold text-white/45 tracking-[0.12em] mb-2.5">OO SAY MONEY</div>
      <div className="text-[24px] font-extrabold text-white leading-snug mb-2.5">Steven & Annie</div>
      <div className="text-[13px] text-white/55 leading-relaxed">
        深耕財務保險規劃 20 年 · 300+ 服務家庭 · 九位數資產管理規模
      </div>
    </div>
    
    <div className="pt-5 px-5">
      <div className="bg-white rounded-2xl p-5 mb-3.5 shadow-sm border border-slate-100">
        <div className="text-[15px] font-extrabold text-slate-900 mb-3">十五年前，我們跟你一樣</div>
        <div className="text-[14px] text-slate-600 leading-[1.9]">
          剛出社會那幾年，心裡一直有個念頭——<strong className="text-slate-900">「好想退休。」</strong>
          <br/><br/>
          後來才慢慢想清楚：原來我們不是想退休，而是想掌握人生的選擇權。不想只有自己一個人在拼，而錢卻躺著睡覺。
          <br/><br/>
          從那一刻起，我們開始認真研究怎麼讓資產動起來。這套思路後來幫了很多人——從月光族、單身頂客，到高資產家庭，目前協助管理的規模已達九位數。
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-3.5">
        {[
          { num: "20年",  label: "深耕財務保險規劃" },
          { num: "300+",  label: "服務家庭" },
          { num: "9位數", label: "管理資產規模" },
        ].map(s => (
          <div key={s.num} className="bg-slate-50 rounded-xl py-3.5 px-2.5 text-center border border-slate-100">
            <div className="text-[18px] font-extrabold text-slate-900">{s.num}</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-normal">{s.label}</div>
          </div>
        ))}
      </div>

      {[
        { icon:"shield",  title:"先蓋好地基",         desc:"保障規劃是一切的起點。風險防護到位，才能安心往上走。" },
        { icon:"trend",   title:"讓錢替你工作",        desc:"資產配置 × 複利效應，加速達到財務自由的時間點。" },
        { icon:"diamond", title:"舒服走到你想去的地方", desc:"不說教、不販賣焦慮。只給你能執行、真的會抵達的路線。" },
      ].map(item => (
        <div key={item.title} className="bg-white rounded-2xl p-4 mb-2.5 flex items-start gap-3.5 shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Ic n={item.icon} size={20} color="#0f172a" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-slate-900">{item.title}</div>
            <div className="text-[13px] text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl p-4 mb-2.5 shadow-sm border border-slate-100">
        <div className="text-[13px] font-bold text-slate-900 mb-3">跟我們在這裡見面</div>
        <div className="flex gap-2.5">
          <a href="https://www.facebook.com/oosayhi" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-slate-50 rounded-xl py-3.5 px-2.5 text-center border border-slate-200 transition-colors hover:border-slate-300">
              <div className="text-[22px] mb-1.5">📘</div>
              <div className="text-[12px] font-bold text-slate-900">粉專</div>
              <div className="text-[10px] text-slate-500 mt-0.5">OO SAY HI</div>
            </div>
          </a>
          <a href="https://oosayhi.com" target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
            <div className="bg-slate-50 rounded-xl py-3.5 px-2.5 text-center border border-slate-200 transition-colors hover:border-slate-300">
              <div className="text-[22px] mb-1.5">✍️</div>
              <div className="text-[12px] font-bold text-slate-900">部落格</div>
              <div className="text-[10px] text-slate-500 mt-0.5">oosayhi.com</div>
            </div>
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 mt-4 text-center shadow-lg shadow-slate-900/10">
        <div className="text-[15px] font-extrabold text-white mb-1.5">想了解更多？</div>
        <div className="text-[12px] text-slate-400 mb-4">加入會員，解鎖專屬理財工具與諮詢服務</div>
        <button onClick={onJoin} className="w-full bg-indigo-600 text-white border-0 rounded-xl py-3 text-[14px] font-extrabold cursor-pointer shadow-md shadow-indigo-600/20 transition-transform active:scale-95">
          加入會員 →
        </button>
      </div>
    </div>
  </div>
);
