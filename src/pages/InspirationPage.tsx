import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

const FEATURED = {
  tag: "財務心理",
  title: "為什麼月薪 6 萬的人，還是存不到錢？",
  desc: "收入不是問題，支出結構才是。了解自己的消費心理，是改變的第一步。",
  readMin: 5,
  color: "#f59e0b",
  bg: "#fffbeb",
};

const ARTICLES = [
  {
    tag: "保障觀念",
    title: "30 歲前，你需要哪些保障？",
    desc: "從壽險到醫療，用數字說清楚你的保障缺口。",
    readMin: 4,
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    tag: "投資入門",
    title: "複利的力量：40 歲退休不是夢",
    desc: "一張試算表，看清每月多存 3,000 元的驚人差距。",
    readMin: 6,
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    tag: "月配息",
    title: "配息型基金：每月領息的真相",
    desc: "了解配息率、淨值侵蝕，挑對工具很重要。",
    readMin: 5,
    color: "#8b5cf6",
    bg: "#faf5ff",
  },
  {
    tag: "緊急備援",
    title: "緊急備援金要準備多少？",
    desc: "3 個月還是 6 個月？用你的職業特性來決定。",
    readMin: 3,
    color: "#64748b",
    bg: "#f8fafc",
  },
];

const TAGS = ["全部", "財務心理", "保障觀念", "投資入門", "月配息", "緊急備援"];

export const InspirationPage = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-5">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center mb-3 -ml-1">
            <Ic n="back" size={18} color="#64748b" />
          </button>
        )}
        <div className="text-[10px] font-bold text-violet-600 uppercase tracking-[0.14em] mb-1">
          理財靈感
        </div>
        <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.025em]">
          精選文章
        </h1>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">

        {/* 標籤篩選 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-5 px-5">
          {TAGS.map((tag, i) => (
            <button
              key={i}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                i === 0
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden border border-slate-100 shadow-sm"
          style={{ background: FEATURED.bg }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-md border"
                style={{
                  color: FEATURED.color,
                  background: "white",
                  borderColor: `${FEATURED.color}40`,
                }}
              >
                {FEATURED.tag}
              </span>
              <span className="text-[10px] text-slate-400">{FEATURED.readMin} 分鐘閱讀</span>
            </div>
            <h2 className="text-[16px] font-extrabold text-slate-900 leading-[1.3] mb-2 tracking-[-0.01em]">
              {FEATURED.title}
            </h2>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-3">{FEATURED.desc}</p>
            <button className="text-[12px] font-bold flex items-center gap-1" style={{ color: FEATURED.color }}>
              閱讀全文 <Ic n="arrowRight" size={12} color={FEATURED.color} />
            </button>
          </div>
        </motion.div>

        {/* Article List */}
        <div className="flex flex-col gap-3">
          {ARTICLES.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
              className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 shadow-sm cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: a.bg }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded"
                    style={{ color: a.color, background: a.bg }}
                  >
                    {a.tag}
                  </span>
                  <span className="text-[9px] text-slate-400">{a.readMin} 分鐘</span>
                </div>
                <div className="text-[13px] font-extrabold text-slate-900 leading-[1.3] mb-0.5 tracking-tight">
                  {a.title}
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed truncate">{a.desc}</div>
              </div>
              <div className="flex items-center shrink-0">
                <Ic n="arrowRight" size={14} color="#cbd5e1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
