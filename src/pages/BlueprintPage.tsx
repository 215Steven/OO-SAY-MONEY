import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useState } from "react";

const ROADMAP = [
  { phase: "P1", label: "打好地基",   desc: "建立緊急備援金 + 完整保障",        months: "1–6 個月",  color: "#10b981" },
  { phase: "P2", label: "穩定現金流", desc: "規律儲蓄 + 月配息資產累積",         months: "6–18 個月", color: "#f59e0b" },
  { phase: "P3", label: "放大資產",   desc: "投資組合擴大 + 稅務優化",           months: "18–36 個月", color: "#0ea5e9" },
  { phase: "P4", label: "財務自由",   desc: "被動收入 ≥ 月支出，開始享受生活",   months: "長期目標",   color: "#8b5cf6" },
];

const PRODUCTS = [
  {
    label: "月月配息型基金",
    rate: "年化約 4–6%",
    min: "3 萬起",
    highlight: "每月領息，現金流穩定",
    tag: "入門首選",
    tagColor: "#10b981",
  },
  {
    label: "季配息平衡型",
    rate: "年化約 6–8%",
    min: "10 萬起",
    highlight: "股債平衡，波動較小",
    tag: "穩健成長",
    tagColor: "#f59e0b",
  },
  {
    label: "年配息成長型",
    rate: "年化約 8–12%",
    min: "20 萬起",
    highlight: "長期複利，兼顧成長",
    tag: "進階佈局",
    tagColor: "#0ea5e9",
  },
];

export const BlueprintPage = ({ onBack, onAppointment }: any) => {
  const [activeTab, setActiveTab] = useState<"roadmap" | "products">("roadmap");

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-0">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center mb-3 -ml-1">
            <Ic n="back" size={18} color="#64748b" />
          </button>
        )}
        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.14em] mb-1">
          起富藍圖
        </div>
        <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.025em] mb-4">
          月配息策略
        </h1>
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(["roadmap", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[13px] font-bold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-amber-400 text-slate-900"
                  : "border-transparent text-slate-400"
              }`}
            >
              {tab === "roadmap" ? "財務自由路線" : "月配息說明"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">

        {activeTab === "roadmap" ? (
          <>
            {/* 路線圖 */}
            <div className="text-[11px] text-slate-400 leading-relaxed mb-1">
              從零開始，一步一步走向財務自由的具體路徑。
            </div>
            {ROADMAP.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.07 }}
                className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 shadow-sm"
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                    style={{ background: r.color }}
                  >
                    {r.phase}
                  </div>
                  {i < ROADMAP.length - 1 && (
                    <div className="w-px flex-1 bg-slate-100" style={{ minHeight: 16 }} />
                  )}
                </div>
                <div className="pb-2">
                  <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{r.label}</div>
                  <div className="text-[12px] text-slate-500 leading-relaxed mb-1">{r.desc}</div>
                  <div
                    className="text-[10px] font-bold px-2 py-0.5 rounded inline-block"
                    style={{ color: r.color, background: `${r.color}15` }}
                  >
                    {r.months}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {/* 月配息說明 */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-[12px] text-amber-800 leading-relaxed">
              月配息商品讓你每月領取固定現金流，適合用來補充生活費或加速再投資。以下是適合不同階段的配置建議。
            </div>
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.07 }}
                className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[14px] font-extrabold text-slate-900">{p.label}</div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 shrink-0"
                    style={{ color: p.tagColor, background: `${p.tagColor}15` }}
                  >
                    {p.tag}
                  </span>
                </div>
                <div className="flex gap-4 mb-3">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">年化報酬</div>
                    <div className="text-[13px] font-extrabold" style={{ color: p.tagColor }}>{p.rate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">起始金額</div>
                    <div className="text-[13px] font-extrabold text-slate-700">{p.min}</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-2.5">
                  {p.highlight}
                </div>
              </motion.div>
            ))}

            <div className="text-[10px] text-slate-400 text-center leading-relaxed px-4">
              以上數字僅供參考，實際報酬依市場狀況而定。<br />
              建議透過顧問諮詢後再進行配置。
            </div>
          </>
        )}

        {/* CTA */}
        {onAppointment && (
          <button
            onClick={onAppointment}
            className="w-full bg-amber-400 text-slate-900 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer active:scale-[0.98] transition-transform mt-2"
          >
            預約諮詢，討論適合我的配置
          </button>
        )}
      </div>
    </div>
  );
};
