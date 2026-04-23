import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

const TYPES = [
  { label: "穩健累積型", desc: "守護現有，穩定增長",    color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0" },
  { label: "成長放大型", desc: "積極投資，追求倍增",    color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { label: "起步探索型", desc: "剛開始，需要方向",      color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { label: "策略進化型", desc: "有基礎，精進佈局",      color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
];

const STEPS = [
  { num: "01", title: "8 個問題",  desc: "只要 2 分鐘，沒有對錯之分" },
  { num: "02", title: "即時分析",  desc: "找出你的財務心理類型" },
  { num: "03", title: "個人建議",  desc: "加入會員解鎖完整財務藍圖" },
];

export const QuizLandingPage = ({
  onStartQuiz,
  onJoin,
}: {
  onStartQuiz: () => void;
  onJoin: () => void;
}) => {
  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-28">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 pt-12 pb-6">
        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.14em] mb-1">
          財務測驗
        </div>
        <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.2] tracking-[-0.025em]">
          你的錢，<br />都去哪了？
        </h1>
        <p className="text-[13px] text-slate-500 mt-2 leading-relaxed max-w-[260px]">
          先找出你的財務心理，才能選對策略。
        </p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* 四種類型 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            你可能是哪一種？
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {TYPES.map((t, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-4 shadow-sm"
                style={{ borderColor: t.border }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-content-center mb-2"
                  style={{ background: t.bg }}>
                  <div className="w-2 h-2 rounded-full mx-auto mt-2.5" style={{ background: t.color }} />
                </div>
                <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{t.label}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: t.color }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 三步驟 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            測驗流程
          </div>
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
              <div className="text-[13px] font-extrabold text-amber-500 w-6 shrink-0 pt-0.5">{s.num}</div>
              <div>
                <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{s.title}</div>
                <div className="text-[12px] text-slate-500">{s.desc}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute w-px h-4 bg-slate-100 ml-[18px] mt-6" />
              )}
            </div>
          ))}
        </motion.div>

        {/* 社會證明 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {["#fde68a", "#a7f3d0", "#bae6fd"].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: c }}>
                <Ic n="user" size={12} color="#64748b" />
              </div>
            ))}
          </div>
          <div className="text-[12px] text-slate-600">
            <span className="font-bold text-slate-900">1,200+</span> 人已完成測驗
          </div>
        </motion.div>

        {/* 次要 CTA：先加入會員 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.24 }}
          className="bg-white border border-slate-100 rounded-xl p-5 text-center shadow-sm"
        >
          <div className="text-[13px] font-bold text-slate-900 mb-1">測驗完想看詳細解析？</div>
          <div className="text-[12px] text-slate-500 mb-4">加入會員，解鎖個人化財務建議與完整分析報告。</div>
          <button
            onClick={onJoin}
            className="w-full bg-slate-100 text-slate-700 border border-slate-200 rounded-xl py-3 text-[13px] font-bold cursor-pointer active:scale-[0.98] transition-transform"
          >
            先加入會員 →
          </button>
        </motion.div>
      </div>

      {/* ── 底部固定 CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 z-50">
        <button
          onClick={onStartQuiz}
          className="w-full bg-amber-400 text-slate-900 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          開始測驗（免費）
          <Ic n="trend" size={16} color="#0f172a" />
        </button>
        <div className="text-[10px] text-slate-400 text-center mt-1.5">2 分鐘 · 8 題 · 即時結果</div>
      </div>
    </div>
  );
};
