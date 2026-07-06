import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { getLiffIdForPath, authHeaders } from "@/src/constants/liff";

// 保單狀態文字沒有固定選項（Notion 欄位是自由文字的 Select），
// 用關鍵字粗略歸類顏色，歸不到的一律顯示中性樣式，避免誤判
function statusStyle(status: string) {
  const s = status || "";
  if (/(有效|生效|已承保|正常)/.test(s)) {
    return { textColor: "text-teal-base", bg: "bg-cyan-soft/30", border: "border-teal-soft" };
  }
  if (/(到期|停效|失效|缺|不足|待補)/.test(s)) {
    return { textColor: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" };
  }
  if (/(審核|待確認|處理中)/.test(s)) {
    return { textColor: "text-alert-orange", bg: "bg-alert-orange/10", border: "border-alert-orange/30" };
  }
  return { textColor: "text-warm-gray-600", bg: "bg-warm-gray-100", border: "border-warm-gray-200" };
}

type Policy = { id: string; policyName: string; coverage: string; status: string };

export const ProtectionPage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const liffId = getLiffIdForPath();
        if (liffId && !liff.isLoggedIn()) {
          await liff.init({ liffId });
        }
        const res = await fetch("/api/insurance", { headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setPolicies(Array.isArray(json.data) ? json.data : []);
      } catch (e: any) {
        console.warn("讀取保單資料失敗：", e?.message || e);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const bookConsult = () => window.open("https://line.me/R/ti/p/@oosaymoney", "_blank");

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10">

      <div className="pt-12 pb-10 px-6 relative z-10 w-full max-w-sm mx-auto border-b border-warm-gray-200 mb-8 shrink-0 bg-white">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full text-warm-gray-800 mb-6">
            <Ic n="shield" size={28} color="currentColor" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 tracking-wide mb-4">我的保障</h1>
          <p className="text-[14px] text-warm-gray-800/70 font-normal leading-relaxed max-w-[280px] mx-auto tracking-wide">你名下的保單總覽，資料由顧問團隊為你維護更新。</p>
        </motion.div>
      </div>

      <div className="px-5 w-full max-w-sm mx-auto relative z-10">

        {loading && (
          <div className="bg-white border border-warm-gray-200 rounded-2xl p-10 text-center shadow-sm mb-8">
            <div className="text-[13px] text-warm-gray-500 tracking-widest">讀取保單資料中…</div>
          </div>
        )}

        {!loading && loadFailed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-white border border-warm-gray-200 p-8 text-center rounded-2xl shadow-sm">
              <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-3 tracking-wide">暫時無法讀取</div>
              <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">
                請確認已完成 LINE 登入，或稍後再試一次。<br />若問題持續發生，歡迎直接聯繫顧問。
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !loadFailed && policies && policies.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-white border border-warm-gray-200 p-10 text-center relative overflow-hidden rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-warm-gray-100 flex items-center justify-center mx-auto mb-6 border border-warm-gray-200 rounded-full">
                <Ic n="shield" size={24} color="#2D2D2A" />
              </div>
              <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-4 tracking-widest">尚未有保單紀錄</div>
              <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose max-w-[240px] mx-auto tracking-wide mb-8">
                預約一次免費保障健診，我們會幫你盤點現有保單，建立專屬的保障地圖。
              </div>
              <button onClick={bookConsult} className="no-underline flex items-center justify-center gap-3 bg-teal-base text-white w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-cyan-base cursor-pointer border border-transparent uppercase rounded-2xl shadow-sm">
                <Ic n="star" size={16} color="currentColor" /> 預約免費保障健診
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !loadFailed && policies && policies.length > 0 && (
          <div className="mb-10">
            <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-6 flex items-center justify-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
              保單總覽 · 共 {policies.length} 筆
              <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
            </div>
            <div className="flex flex-col gap-3">
              {policies.map((p, i) => {
                const st = statusStyle(p.status);
                return (
                  <motion.div key={p.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="text-[14px] font-bold text-warm-gray-800 tracking-wide">{p.policyName || "未命名保單"}</div>
                      {p.status && (
                        <div className={`text-[11px] font-bold tracking-widest px-2.5 py-1 rounded shrink-0 border ${st.border} ${st.bg} ${st.textColor}`}>{p.status}</div>
                      )}
                    </div>
                    {p.coverage && (
                      <div className="text-[12px] text-warm-gray-600 leading-relaxed tracking-wide">{p.coverage}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="text-[10px] text-warm-gray-400 font-normal tracking-wide leading-relaxed mt-6 text-center">
              以上資料由顧問團隊人工維護，如有異動請直接聯繫顧問確認最新狀態。
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-sm mx-auto bg-warm-gray-50 p-10 text-center border border-warm-gray-200 relative overflow-hidden mb-10 shrink-0 rounded-2xl">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto mb-6 border border-warm-gray-200 rounded-full">
              <Ic n="user" size={24} color="#2D2D2A" />
            </div>
            <div className="text-[20px] font-serif font-bold text-warm-gray-800 mb-4 tracking-widest">有保單相關問題？</div>
            <div className="text-[13px] text-warm-gray-800/80 font-normal mb-8 leading-loose tracking-wide">
              不管是想調整保障、確認理賠，<br />或單純想聊聊現況，都歡迎找我們。
            </div>
            <button onClick={bookConsult} className="no-underline flex items-center justify-center gap-3 bg-teal-base text-white w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-cyan-base cursor-pointer border border-transparent uppercase mb-6 rounded-2xl shadow-sm">
              <Ic n="star" size={16} color="currentColor" /> 加入 LINE 聯繫顧問
            </button>
            <div className="text-[10px] text-warm-gray-600 font-normal tracking-[0.2em] uppercase">✨ 免費諮詢 · 無推銷壓力</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
