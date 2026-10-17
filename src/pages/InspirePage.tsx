import { Eyebrow, Reveal, SPRING } from "@/src/components/ui";
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
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <div className="px-6 pt-8 flex items-center justify-between">
        <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800">OO SAY MONEY</div>
        <Eyebrow>Inspiration</Eyebrow>
      </div>

      <header className="px-6 pt-14 pb-8">
        <h1 className="font-serif leading-[1.12] tracking-[-0.01em]">
          <motion.span className="block text-[46px] font-semibold text-warm-gray-800" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 }}>理財</motion.span>
          <motion.span className="block text-[46px] font-light italic text-brass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.15 }}>靈感。</motion.span>
        </h1>
        <p className="mt-5 text-[15px] leading-[1.9] text-warm-gray-600 max-w-[19rem]">VCCT 基金排行榜 TOP 10，快速掌握市場配息與報酬表現。</p>
      </header>

      <div className="px-6">
        {/* Tabs：底線式 */}
        <div className="flex border-b border-warm-gray-300 mb-2" role="tablist">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
              className={`relative flex-1 py-3.5 text-[13px] tracking-[0.1em] cursor-pointer transition-colors outline-none focus-visible:bg-warm-gray-100 ${activeTab === t.key ? "text-warm-gray-800 font-medium" : "text-warm-gray-500 hover:text-warm-gray-800"}`}
            >
              {t.label}
              {activeTab === t.key && <motion.span layoutId="inspire-tab" className="absolute left-0 right-0 -bottom-px h-[2px] bg-brass" transition={SPRING} />}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto w-24 h-px bg-warm-gray-200 relative overflow-hidden mb-4">
              <motion.span className="absolute inset-y-0 w-10 bg-brass" initial={{ x: -40 }} animate={{ x: 96 }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <div className="text-[12px] text-warm-gray-500 tracking-[0.2em]">讀取排行榜資料中</div>
          </div>
        )}

        {!loading && failed && (
          <div className="py-14">
            <div className="font-serif text-[22px] font-semibold text-warm-gray-800 mb-3">暫時無法讀取排行榜</div>
            <p className="text-[14px] text-warm-gray-600 leading-[1.9]">資料來源暫時無法連線，請稍後再試一次。</p>
            <button onClick={() => window.location.reload()} className="mt-6 text-[13px] tracking-[0.18em] text-forest border-b border-forest pb-0.5 cursor-pointer">重新整理</button>
          </div>
        )}

        {!loading && !failed && (
          <AnimatePresence mode="wait">
            <motion.ol
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="list-none p-0 m-0"
            >
              {rows.map((row, i) => {
                const { clean, warning } = splitFundName(row.name);
                const metric = row[activeTabMeta.metricKey];
                return (
                  <li key={row.code + i} className="py-6 border-b border-warm-gray-300">
                    <div className="flex items-start gap-4">
                      <div className={`font-display tnum shrink-0 w-10 leading-none ${i < 3 ? "text-[36px] font-light text-brass" : "text-[26px] font-light text-warm-gray-400"}`}>
                        {String(row.rank).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-warm-gray-800 leading-[1.6]">{clean}</div>
                        <div className="mt-2 text-[11px] text-warm-gray-500 tracking-[0.08em]">{row.cur} · {row.rr} · {row.freq}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display text-[22px] font-medium text-forest tnum leading-none">{fmtPct(metric)}</div>
                        <div className="mt-1.5 text-[10px] text-warm-gray-500 tracking-[0.14em]">{activeTabMeta.metricLabel}</div>
                      </div>
                    </div>
                    <div className="mt-4 ml-14 flex gap-5 text-[11px] text-warm-gray-500 tnum">
                      <span>六月 {fmtPct(row.ret6m)}</span>
                      <span>一年 {fmtPct(row.ret1y)}</span>
                      <span>三年 {fmtPct(row.ret3y)}</span>
                    </div>
                    {warning && (
                      <div className="mt-3 ml-14 text-[11px] text-alert-orange border-l-2 border-alert-orange/50 pl-3 leading-[1.8]">注意：{warning}</div>
                    )}
                  </li>
                );
              })}
            </motion.ol>
          </AnimatePresence>
        )}

        {data && (
          <div className="mt-6 text-[11px] text-warm-gray-500 tracking-wide">資料來源：VCCT 配息工具 · 更新於 {data.generatedAt || data.fetchedAt}</div>
        )}

        <p className="mt-6 text-[11px] text-warm-gray-500 leading-[1.9] tracking-wide">
          以上排行僅供參考，過去績效不代表未來表現，投資前請詳閱公開說明書。配息可能來自本金，投資人於獲配息時應注意基金淨值同時降低之可能性。
        </p>
      </div>

      <Reveal className="px-6 pt-12">
        <section className="grain relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative z-10 font-serif text-[26px] leading-[1.3] font-semibold">想聊聊怎麼配置？</h2>
          <p className="relative z-10 mt-3 text-[14px] leading-[1.9] text-white/70">排行榜只是參考起點，適合你的配置需要專屬分析。</p>
          <motion.button onClick={() => window.open("https://line.me/R/ti/p/@oosaymoney", "_blank")} whileTap={{ scale: 0.97 }} className="relative z-10 mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
            加入 LINE 聯繫顧問
          </motion.button>
          <p className="relative z-10 mt-4 text-[11px] text-white/45 tracking-wide text-center">免費諮詢 · 無推銷壓力</p>
        </section>
      </Reveal>
      <div className="pb-10" />
    </div>
  );
};
