import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { motion } from "motion/react";

export const MoneyLanding = ({ onBack, onLogin }: any) => {
  const [_, navigate] = useLocation();

  return (
    <div className="pb-10 min-h-[100dvh] bg-slate-50 font-sans">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-10 px-5 pb-14 relative overflow-hidden rounded-b-[32px] mb-6 shadow-sm">
        {/* 極細的 amber 光暈，取代過度鮮豔的漸層球 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onBack}
          className="bg-white/10 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer mb-8 transition-colors hover:bg-white/20 relative z-10"
        >
          <Ic n="back" color="rgba(255,255,255,.9)" size={18} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          {/* 品牌標籤 — Amber，只在這裡點一次 */}
          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-1 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 tracking-[0.12em] uppercase">免費 · 2 分鐘</span>
          </div>

          <h1 className="text-[28px] font-extrabold text-white leading-[1.2] tracking-[-0.03em] mb-3">
            你的錢，<br />
            <span className="text-amber-300">都去哪了？</span>
          </h1>
          <p className="text-[14px] text-slate-300/80 font-medium leading-relaxed max-w-[280px]">
            先了解你的財務心理類型，再看清財務真實數字。
          </p>
        </motion.div>
      </div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <div className="px-5 flex flex-col gap-4">

        {/* 步驟 1 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="bg-white rounded-[20px] p-5 shadow-sm shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-extrabold text-white">1</span>
            </div>
            <div className="text-[16px] font-extrabold text-slate-900 tracking-[-0.01em]">你是哪種理財類型？</div>
          </div>

          <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
            8 個問題，找出你對金錢的底層邏輯——穩健累積、成長放大、還是策略進化型？
          </p>

          {/* 類型標籤：全部用 slate 系，移除 purple */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { label: "穩健累積型", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
              { label: "成長放大型", color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200"  },
              { label: "起步探索型", color: "text-slate-600",   bg: "bg-slate-100",  border: "border-slate-200"   },
              { label: "策略進化型", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
            ].map((t, i) => (
              <span
                key={i}
                className={`text-[11px] font-bold ${t.color} ${t.bg} border ${t.border} rounded-md px-2.5 py-1`}
              >
                {t.label}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate("/quiz")}
            className="w-full bg-slate-900 text-white border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer shadow-md shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            開始測驗 <Ic n="trend" size={16} color="#f59e0b" />
          </button>
        </motion.div>

        {/* 步驟 2 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="bg-white rounded-[20px] p-5 shadow-sm shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
              <span className="text-[13px] font-extrabold text-slate-400">2</span>
            </div>
            <div className="text-[16px] font-extrabold text-slate-900 tracking-[-0.01em]">看清財務真實數字</div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5 ml-auto">需登入</span>
          </div>

          {/* 數字指標：amber 取代 indigo */}
          <div className="flex gap-2.5 mb-4">
            {[
              { label: "淨資產",   val: "1,600萬", color: "text-emerald-600", bg: "bg-emerald-50/60" },
              { label: "儲蓄率",   val: "33%",     color: "text-amber-600",   bg: "bg-amber-50/60"   },
              { label: "財務分數", val: "78分",    color: "text-slate-700",   bg: "bg-slate-50"      },
            ].map((c, i) => (
              <div key={i} className={`flex-1 rounded-xl py-3 px-1 text-center border border-slate-100 ${c.bg}`}>
                <div className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">{c.label}</div>
                <div className={`text-[16px] font-extrabold ${c.color}`}>{c.val}</div>
              </div>
            ))}
          </div>

          <p className="text-[12px] text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
            儲蓄率、負債比、緊急金、保障缺口、財務自由進度——一次全看清。
          </p>
        </motion.div>

        {/* CTA — 深色 + Amber，不用靛藍 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 text-center relative overflow-hidden shadow-xl shadow-slate-900/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Ic n="user" size={24} color="#fcd34d" />
            </div>
            <div className="text-[18px] font-extrabold text-white mb-2 tracking-[-0.02em]">
              解鎖完整財務工具
            </div>
            <p className="text-[13px] text-slate-400 mb-5 leading-relaxed">
              不再盲目記帳，加入會員取得<br />個人化財務分析與顧問支援
            </p>
            <button
              onClick={onLogin}
              className="w-full bg-amber-400 text-slate-900 border-0 rounded-[16px] py-4 text-[15px] font-extrabold cursor-pointer shadow-lg shadow-amber-400/20 transition-transform active:scale-[0.98] mb-3"
            >
              加入會員，立即開始
            </button>
            <div className="text-[11px] text-slate-500 font-medium">
              ✦ 免費使用 · 不收任何費用
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
