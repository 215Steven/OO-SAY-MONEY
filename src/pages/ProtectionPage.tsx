import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { getLiffIdForPath, authHeaders } from "@/src/constants/liff";

// 保障狀態的顯示樣式與友善文字（對應 Notion「保單」資料庫四大類的狀態欄位，
// 目前看到的值有 ok / gap / none / na，其餘未知值一律顯示原始文字＋中性樣式）
const STATUS_MAP: Record<string, { label: string; textColor: string; bg: string; border: string }> = {
  ok: { label: "已足夠", textColor: "text-teal-base", bg: "bg-cyan-soft/30", border: "border-teal-soft" },
  gap: { label: "待補強", textColor: "text-alert-orange", bg: "bg-alert-orange/10", border: "border-alert-orange/30" },
  none: { label: "尚未規劃", textColor: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" },
  na: { label: "不適用", textColor: "text-warm-gray-400", bg: "bg-warm-gray-100", border: "border-warm-gray-200" },
};
function statusStyle(status: string) {
  return STATUS_MAP[status] || { label: status || "未知", textColor: "text-warm-gray-500", bg: "bg-warm-gray-100", border: "border-warm-gray-200" };
}

// 一般文字輸入欄位（姓名／生日／手機都是文字，不能用財管家那種只收數字的 InputBox）
const TextField = ({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (e: any) => void }) => (
  <div className="border p-4 transition-colors rounded-2xl bg-warm-gray-50 border-warm-gray-200 focus-within:border-teal-base focus-within:bg-white">
    <div className="text-[11px] font-medium tracking-widest uppercase mb-1 text-warm-gray-800">{label}</div>
    {hint && <div className="text-[10px] text-warm-gray-600 font-normal tracking-wide">{hint}</div>}
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border-0 outline-none font-medium text-[16px] bg-transparent placeholder:text-warm-gray-300 tracking-wide text-warm-gray-800 mt-2 pb-1 border-b border-warm-gray-200 focus:border-teal-base"
    />
  </div>
);

type Category = { key: string; label: string; status: string; desc: string; note: string };
type Member = {
  id: string;
  name: string;
  relation: string;
  age: number | null;
  advisor: string;
  lastUpdated: string;
  categories: Category[];
};

export const ProtectionPage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  // 核身表單狀態：查不到自己的保單資料時，用姓名／生日／手機比對顧問建檔的資料
  const [verifyName, setVerifyName] = useState("");
  const [verifyBirthday, setVerifyBirthday] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"none" | "notfound" | "matched">("none");

  const fetchInsurance = async () => {
    const res = await fetch("/api/insurance", { headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setMembers(Array.isArray(json.data) ? json.data : []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const liffId = getLiffIdForPath();
        if (liffId && !liff.isLoggedIn()) {
          await liff.init({ liffId });
        }
        await fetchInsurance();
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

  const submitVerify = async () => {
    if (!verifyName.trim() || !verifyBirthday.trim() || !verifyPhone.trim()) return;
    setVerifying(true);
    setVerifyResult("none");
    try {
      const res = await fetch("/api/insurance/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name: verifyName.trim(), birthday: verifyBirthday.trim(), phone: verifyPhone.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      if (json.matched > 0) {
        setVerifyResult("matched");
        await fetchInsurance();
      } else {
        setVerifyResult("notfound");
      }
    } catch (e: any) {
      console.warn("核身失敗：", e?.message || e);
      setVerifyResult("notfound");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10">

      <div className="pt-12 pb-10 px-6 relative z-10 w-full max-w-sm mx-auto border-b border-warm-gray-200 mb-8 shrink-0 bg-white">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-warm-gray-50 border border-warm-gray-200 rounded-full text-warm-gray-800 mb-6">
            <Ic n="shield" size={28} color="currentColor" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-warm-gray-800 tracking-wide mb-4">我的保障</h1>
          <p className="text-[14px] text-warm-gray-800/70 font-normal leading-relaxed max-w-[280px] mx-auto tracking-wide">你與家人的保障總覽，資料由顧問團隊為你維護更新。</p>
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

        {!loading && !loadFailed && members && members.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-white border border-warm-gray-200 p-8 relative overflow-hidden rounded-2xl shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-warm-gray-100 flex items-center justify-center mx-auto mb-6 border border-warm-gray-200 rounded-full">
                  <Ic n="shield" size={24} color="#2D2D2A" />
                </div>
                <div className="text-[18px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">查不到你的保障資料</div>
                <div className="text-[13px] text-warm-gray-800/80 font-normal leading-loose tracking-wide">
                  填入以下資訊核對身份，我們會比對顧問建檔的資料。
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <TextField label="姓名" hint="與顧問登記的姓名一致" value={verifyName} onChange={(e: any) => setVerifyName(e.target.value)} />
                <TextField label="生日" hint="例：1990-01-01" value={verifyBirthday} onChange={(e: any) => setVerifyBirthday(e.target.value)} />
                <TextField label="手機" hint="例：0912345678" value={verifyPhone} onChange={(e: any) => setVerifyPhone(e.target.value)} />
              </div>

              {verifyResult === "notfound" && (
                <div className="bg-rose-50 border border-rose-200 text-rose-500 text-[12px] rounded-xl p-4 mt-4 leading-relaxed">
                  查無符合的資料，請確認姓名／生日／手機是否與顧問登記的一致，或直接聯繫顧問協助確認。
                </div>
              )}

              <button
                onClick={submitVerify}
                disabled={verifying || !verifyName.trim() || !verifyBirthday.trim() || !verifyPhone.trim()}
                className="w-full bg-teal-base text-white border border-teal-base py-4 rounded-2xl text-[13px] font-bold tracking-widest uppercase cursor-pointer hover:bg-cyan-base transition-colors flex items-center justify-center gap-2 shadow-sm mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {verifying ? "核對中…" : "核對身份"}
              </button>

              <div className="text-[10px] text-warm-gray-400 font-normal tracking-wide leading-relaxed mt-4 text-center">
                核對成功後，之後登入會自動顯示你的保障資料，不需要再次核對。
              </div>
            </div>

            <button onClick={bookConsult} className="no-underline flex items-center justify-center gap-3 bg-white border border-warm-gray-200 text-warm-gray-700 w-full py-4 text-[13px] font-medium tracking-widest transition-colors hover:bg-warm-gray-100 cursor-pointer rounded-2xl shadow-sm mt-4">
              找不到資料？直接聯繫顧問
            </button>
          </motion.div>
        )}

        {!loading && !loadFailed && members && members.length > 0 && (
          <div className="mb-10">
            <div className="text-[10px] font-medium text-warm-gray-800 tracking-[0.2em] mb-6 flex items-center justify-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
              家庭保障總覽 · 共 {members.length} 位成員
              <span className="w-1.5 h-1.5 bg-teal-base rounded-full" />
            </div>
            <div className="flex flex-col gap-4">
              {members.map((m, i) => (
                <motion.div key={m.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white border border-warm-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-warm-gray-100">
                    <div className="w-10 h-10 bg-warm-gray-100 border border-warm-gray-200 rounded-full flex items-center justify-center text-[13px] font-serif font-bold text-warm-gray-800 shrink-0">
                      {(m.name || "?").charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-bold text-warm-gray-800 tracking-wide flex items-center gap-2">
                        {m.name || "未命名"}
                        {m.relation && <span className="text-[10px] font-medium text-warm-gray-500 bg-warm-gray-100 px-2 py-0.5 rounded">{m.relation}</span>}
                      </div>
                      {m.age !== null && <div className="text-[11px] text-warm-gray-500 mt-1">{m.age} 歲</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {m.categories.map((c, j) => {
                      const st = statusStyle(c.status);
                      return (
                        <div key={j} className={`p-3 rounded-xl border ${st.border} ${st.bg}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-warm-gray-700">{c.label}</span>
                            <span className={`text-[10px] font-bold ${st.textColor}`}>{st.label}</span>
                          </div>
                          {c.desc && <div className="text-[11px] text-warm-gray-700 leading-relaxed">{c.desc}</div>}
                          {c.note && <div className="text-[10px] text-warm-gray-500 leading-relaxed mt-1">{c.note}</div>}
                        </div>
                      );
                    })}
                  </div>

                  {(m.advisor || m.lastUpdated) && (
                    <div className="flex justify-between items-center text-[10px] text-warm-gray-400 tracking-wide mt-4 pt-3 border-t border-warm-gray-50">
                      {m.advisor && <span>負責顧問：{m.advisor}</span>}
                      {m.lastUpdated && <span>更新於 {m.lastUpdated}</span>}
                    </div>
                  )}
                </motion.div>
              ))}
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
