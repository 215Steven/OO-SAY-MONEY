import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useState } from "react";

const MONTHS = ["一月", "二月", "三月", "四月", "五月", "六月"];
const INCOME_DATA  = [62000, 62000, 65000, 62000, 68000, 70000];
const EXPENSE_DATA = [41000, 38500, 43000, 39000, 42000, 44000];

const CATEGORIES = [
  { label: "住宿房租",  pct: 32, color: "#0ea5e9",  val: "14,080" },
  { label: "餐飲飲食",  pct: 22, color: "#10b981",  val: "9,680"  },
  { label: "交通",      pct: 12, color: "#f59e0b",  val: "5,280"  },
  { label: "娛樂伙閒",  pct: 8,  color: "#8b5cf6",  val: "3,520"  },
  { label: "其他",      pct: 26, color: "#e2e8f0",  val: "11,440" },
];

export const MoneyFlowPage = ({ onBack }: { onBack?: () => void }) => {
  const [activeMonth, setActiveMonth] = useState(5);
  const income  = INCOME_DATA[activeMonth];
  const expense = EXPENSE_DATA[activeMonth];
  const savings = income - expense;
  const savingsRate = Math.round((savings / income) * 100);

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-5">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center mb-3 -ml-1">
            <Ic n="back" size={18} color="#64748b" />
          </button>
        )}
        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.14em] mb-1">
          錢的流向
        </div>
        <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.025em]">
          財務管家
        </h1>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">

        {/* 月份 tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {MONTHS.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveMonth(i)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors border ${
                activeMonth === i
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* 本月總覽 */}
        <motion.div
          key={activeMonth}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            {MONTHS[activeMonth]} 總覽
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] text-slate-400 font-bold mb-1">收入</div>
              <div className="text-[18px] font-extrabold text-slate-900">
                {income.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">元</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold mb-1">支出</div>
              <div className="text-[18px] font-extrabold text-slate-700">
                {expense.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">元</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-600 font-bold mb-1">結餘</div>
              <div className="text-[18px] font-extrabold text-emerald-600">
                {savings.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">元</div>
            </div>
          </div>
          {/* 儲蓄率進度條 */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] text-slate-500 font-bold">儲蓄率</span>
              <span className="text-[13px] font-extrabold text-emerald-600">{savingsRate}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${savingsRate}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* 支出分類 */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            支出分類
          </div>
          {CATEGORIES.map((c, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                  <span className="text-[12px] text-slate-700 font-medium">{c.label}</span>
                </div>
                <span className="text-[12px] font-bold text-slate-900">{c.val} 元</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 趨勢 */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            半年趨勢
          </div>
          <div className="flex items-end justify-between gap-1 h-16">
            {INCOME_DATA.map((inc, i) => {
              const exp = EXPENSE_DATA[i];
              const maxVal = Math.max(...INCOME_DATA);
              const incH = Math.round((inc / maxVal) * 56);
              const expH = Math.round((exp / maxVal) * 56);
              return (
                <div key={i} className="flex-1 flex gap-0.5 items-end justify-center">
                  <div className="w-3 rounded-t-sm bg-emerald-300" style={{ height: incH }} />
                  <div className="w-3 rounded-t-sm bg-amber-300" style={{ height: expH }} />
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300" />
              <span className="text-[10px] text-slate-400">收入</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-300" />
              <span className="text-[10px] text-slate-400">支出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
