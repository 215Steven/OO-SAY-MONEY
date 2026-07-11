import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

// 資料來源：VCCT 配息工具（portfolio-dividend-tool.vercel.app 的第三方公開 API，
// 非本站自己的資料庫），每日中午 12:00 更新一次。純粹讓使用者快速瀏覽市場上
// 配息／報酬表現較佳的基金排行，屬於參考資訊，不構成投資建議，也跟本站的
// 真實客戶資料（Notion 保單資料庫等）完全無關。
const VCCT_API = "https://portfolio-dividend-tool.vercel.app/api/vcct-top10";

type FundRow = {
  rank: number;
  code: string;
  name: string;
  cur: string;
  rr: string;
  freq: string;
  nav: number;
  rate?: number | null;
  ret6m?: number | null;
  ret1y?: number | null;
  ret3y?: number | null;
  type?: string;
};

type Vcct = {
  top10Rate: FundRow[];
  top10Ret3y: FundRow[];
  top10Ret3yRR3: FundRow[];
  fetchedAt: string;
  generatedAt: string;
};

// 基金名稱裡常常包了一段警語 HTML（例如「配息來源可能為本金」），
// 這裡把「乾淨的名稱」跟「警語文字」拆開，不直接把來源的 HTML 塞進畫面。
function splitFundName(raw: string): { clean: string; warning: string | null } {
  const match = raw.match(/^(.*?)<span[^>]*>([\s\S]*?)<\/span>\s*$/);
  if (match) {
    return { clean: match[1].trim(), warning: match[2].replace(/<[^>]+>/g, "").trim() };
  }
  return { clean: raw, warning: null };
}

function fmtPct(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
}

const TABS = [
  { key: "rate", label: "年化配息率", dataKey: "top10Rate" as const, metricLabel: "年化配息率", metricKey: "rate" as const },
  { key: "ret3y", label: "三年總報酬", dataKey: "top10Ret3y" as const, metricLabel: "三年報酬", metricKey: "ret3y" as const },
  { key: "rr3", label: "RR3 三年報酬", dataKey: "top10Ret3yRR3" as const, metricLabel: "三年報酬", metricKey: "ret3y" as const },
];

export const InspirePage = ({ onBack }: { onBack: () => void }) => {
  const [data, setData] = useState<Vcct | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(TABS[0].key);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(VCCT_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        console.warn("讀取 VCCT 排行榜失敗：", e?.message || e);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeTabMeta = TABS.find(t => t.key === activeTab) || TABS[0];
  const rows: FundRow[] = data ? data[activeTabMeta.dataKey] : [];

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10">

      <div className="pt-12 pb-10 px-6 relative z-10 w-full max-w-sm mx-auto border-b border-warm-gray-200 mb-8 shrink-0 bg-white">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full text-warm-gray-800 mb-6">
            <Ic n="trend" size={28} color="currentColor" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 tracking-wide mb-4">理財靈感</h1>
          <p className="text-[14px] text-warm-gray-800/70 font-normal leading-relaxed max-w-[280px] mx-auto tracking-wide">
            VCCT 基金排行榜 TOP 10，快速掌握市場配息與報酬表現。
          </p>
        </motion.div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-warm-gray-200 rounded-2xl p-1.5 shadow-sm">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-medium tracking-wide transition-colors cursor-pointer ${
                activeTab === t.key ? "bg-teal-base text-white" : "text-warm-gray-600 hover:bg-warm-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-white border border-warm-gray-200 rounded-2xl p-10 text-center shadow-sm mb-8">
            <div className="text-[13px] text-warm-gray-500 tracking-widest">讀取排行榜資料中…</div>
          </div>
        )}

        {!loading && failed && (
          <div className="bg-white border border-warm-gray-200 p-8 text-center rounded-2xl shadow-sm mb-8">
            <div className="text-[18px] font-serif font-bold text-warm-gray-800 mb-3 tracking-wide">暫時無法讀取排行榜</div>
            <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">
              資料來源暫時無法連線，請稍後再試一次。
            </div>
          </div>
        )}

        {!loading && !failed && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 mb-6"
            >
              {rows.map((row, i) => {
                const { clean, warning } = splitFundName(row.name);
                const metric = row[activeTabMeta.metricKey];
                return (
                  <div key={row.code + i} className="bg-white border border-warm-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-serif font-bold ${
                          i < 3 ? "bg-teal-base text-white" : "bg-warm-gray-100 text-warm-gray-800 border border-warm-gray-200"
                        }`}
                      >
                        {row.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-warm-gray-800 leading-snug tracking-wide">{clean}</div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-warm-gray-500 bg-warm-gray-100 px-2 py-0.5 rounded">{row.cur}</span>
                          <span className="text-[10px] text-warm-gray-500 bg-warm-gray-100 px-2 py-0.5 rounded">{row.rr}</span>
                          <span className="text-[10px] text-warm-gray-500 bg-warm-gray-100 px-2 py-0.5 rounded">{row.freq}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[16px] font-serif font-bold text-teal-base tracking-wide">{fmtPct(metric)}</div>
                        <div className="text-[9px] text-warm-gray-400 tracking-wide uppercase mt-0.5">{activeTabMeta.metricLabel}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-warm-gray-500 tracking-wide mt-3 pt-3 border-t border-warm-gray-100">
                      <span>六月 {fmtPct(row.ret6m)}</span>
                      <span>一年 {fmtPct(row.ret1y)}</span>
                      <span>三年 {fmtPct(row.ret3y)}</span>
                    </div>

                    {warning && (
                      <div className="text-[10px] text-alert-orange bg-alert-orange/10 border border-alert-orange/30 rounded-lg px-3 py-2 mt-3 leading-relaxed">
                        ⚠️ {warning}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {data && (
          <div className="text-[10px] text-warm-gray-400 text-center tracking-wide mb-8">
            資料來源：VCCT 配息工具 · 更新於 {data.generatedAt || data.fetchedAt}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-warm-gray-100 border border-warm-gray-200 rounded-2xl p-5 mb-8">
          <div className="text-[11px] text-warm-gray-600 leading-relaxed tracking-wide">
            以上排行僅供參考，過去績效不代表未來表現，投資前請詳閱公開說明書。配息可能來自本金，投資人於獲配息時應注意基金淨值同時降低之可能性。
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-sm mx-auto bg-warm-gray-50 p-10 text-center border border-warm-gray-200 relative overflow-hidden mb-10 shrink-0 rounded-2xl">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-6 border border-warm-gray-200 rounded-full">
              <Ic n="star" size={24} color="#2D2D2A" />
            </div>
            <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-4 tracking-widest">想聊聊怎麼配置？</div>
            <div className="text-[13px] text-warm-gray-800/80 font-normal mb-8 leading-loose tracking-wide">
              排行榜只是參考起點，適合你的配置需要專屬分析。
            </div>
            <button onClick={() => window.open('https://line.me/R/ti/p/@oosaymoney', '_blank')} className="no-underline flex items-center justify-center gap-3 bg-teal-base text-white w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-cyan-base cursor-pointer border border-transparent uppercase mb-6 rounded-2xl shadow-sm">
              <Ic n="star" size={16} color="currentColor" /> 加入 LINE 聯繫顧問
            </button>
            <div className="text-[10px] text-warm-gray-600 font-normal tracking-[0.2em] uppercase">✨ 免費諮詢 · 無推銷壓力</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
