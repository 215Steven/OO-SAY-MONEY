import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

const SERVICES = [
  {
    icon: "shield",
    label: "財務防線建立",
    desc: "系統性評估保障缺口，從壽險、醫療到意外，幫你補足第一道防線。",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: "trend",
    label: "財務成長規劃",
    desc: "依據你的目標設計儲蓄與投資路徑，讓資產穩健增長、早日財務自由。",
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    icon: "money",
    label: "收支健康管理",
    desc: "找出金錢的漏洞，建立收入–支出–儲蓄的正向循環結構。",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: "calendar",
    label: "一對一酧問諮詢",
    desc: "30 分鐘免費面談，釐清你現在最需要處理的財務課題。",
    color: "#64748b",
    bg: "#f8fafc",
  },
];

const VALUES = [
  { label: "不賣產品", desc: "以你的利益為優先，提供客觀建議" },
  { label: "數字說話", desc: "一切以真實數據為基礎，不憑感覺" },
  { label: "長期陪伴", desc: "不只是一次諮詢，而是持續的夥伴關係" },
];

export const AboutPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">

    {/* ── 頂部標題帶（全寬、無圓角） ── */}
    <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-5">
      {onBack && (
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center mb-3 -ml-1">
          <Ic n="back" size={18} color="#64748b" />
        </button>
      )}
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-1">
        認識我們
      </div>
      <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.025em]">
        OO SAY MONEY
      </h1>
      <p className="text-[13px] text-slate-500 mt-1">
        讓你的財務有方向，每一分錢都有意義。
      </p>
    </div>

    <div className="px-5 pt-5 flex flex-col gap-4">

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-amber-50 border border-amber-100 rounded-xl p-5"
      >
        <div className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">
          使命
        </div>
        <p className="text-[14px] font-bold text-slate-800 leading-relaxed">
          我們相信，每個人都值得擁有清晰的財務全貌。不是因為你有多少錢，而是讓你知道如何讓錢為你工作。
        </p>
      </motion.div>

      {/* 服務項目 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          我們能幫你什麼
        </div>
        <div className="flex flex-col gap-3">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 shadow-sm">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.bg }}
              >
                <Ic n={s.icon} size={18} color={s.color} />
              </div>
              <div>
                <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{s.label}</div>
                <div className="text-[12px] text-slate-500 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 核心理念 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18 }}
        className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
      >
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          我們的理念
        </div>
        {VALUES.map((v, i) => (
          <div key={i} className={`flex gap-4 ${i < VALUES.length - 1 ? "mb-4 pb-4 border-b border-slate-100" : ""}`}>
            <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{v.label}</div>
              <div className="text-[12px] text-slate-500">{v.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      {onJoin && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.26 }}
        >
          <button
            onClick={onJoin}
            className="w-full bg-amber-400 text-slate-900 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer active:scale-[0.98] transition-transform"
          >
            加入會員，與我們合作
          </button>
        </motion.div>
      )}
    </div>
  </div>
);
