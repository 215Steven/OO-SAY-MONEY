import { motion } from "motion/react";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { getLiffIdForPath, authHeaders } from "@/src/constants/liff";
import { TopBar, PageHeader, SectionLabel, CtaBlock, Reveal } from "@/src/components/ui";
import { openLine, LINE_BOOK_URL } from "@/src/constants/links";

// 保障狀態的顯示樣式與友善文字（對應 Notion「保單」資料庫四大類的狀態欄位，
// 目前看到的值有 ok / gap / none / na，其餘未知值一律顯示原始文字＋中性樣式）
const STATUS_MAP: Record<string, { label: string; textColor: string; bg: string; border: string }> = {
  ok: { label: "已足夠", textColor: "text-forest", bg: "bg-teal-soft/50", border: "border-teal-soft" },
  gap: { label: "待補強", textColor: "text-brass", bg: "bg-brass-soft/40", border: "border-brass/30" },
  none: { label: "尚未規劃", textColor: "text-alert-red", bg: "bg-alert-red/5", border: "border-alert-red/25" },
  na: { label: "不適用", textColor: "text-warm-gray-500", bg: "bg-warm-gray-100", border: "border-warm-gray-200" },
};
function statusStyle(status: string) {
  return STATUS_MAP[status] || { label: status || "未知", textColor: "text-warm-gray-500", bg: "bg-warm-gray-100", border: "border-warm-gray-200" };
}

// 一般文字輸入欄位（姓名／生日／手機都是文字，不能用財管家那種只收數字的 InputBox）
const TextField = ({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (e: any) => void }) => (
  <label className="block border-b border-warm-gray-300 focus-within:border-forest transition-colors pb-2">
    <span className="block text-[12px] font-medium tracking-[0.2em] text-warm-gray-600">{label}</span>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={hint}
      className="w-full border-0 outline-none bg-transparent text-[17px] text-warm-gray-800 placeholder:text-warm-gray-400 tracking-wide mt-1.5 py-1"
    />
  </label>
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

  const bookConsult = () => openLine(LINE_BOOK_URL);

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

  const canVerify = !!verifyName.trim() && !!verifyBirthday.trim() && !!verifyPhone.trim();
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <TopBar />
      <PageHeader eyebrow="My protection" line1="我的" line2="保障。" desc="你與家人的保障總覽，資料由顧問團隊為你維護更新。" />

      <div className="px-6">
        {loading && (
          <div className="py-12" role="status">
            <div className="w-24 h-px bg-warm-gray-200 relative overflow-hidden mb-4">
              <motion.span className="absolute inset-y-0 w-10 bg-brass" initial={{ x: -40 }} animate={{ x: 96 }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <div className="text-[13px] text-warm-gray-500 tracking-[0.2em]">讀取保單資料中</div>
          </div>
        )}

        {!loading && loadFailed && (
          <div className="py-10 border-t border-warm-gray-800/80">
            <div className="font-serif text-[22px] font-semibold text-warm-gray-800 mb-3">暫時無法讀取</div>
            <p className="text-[14px] text-warm-gray-600 leading-[1.9]">請確認已完成 LINE 登入，或稍後再試一次。若問題持續發生，歡迎直接聯繫顧問。</p>
          </div>
        )}

        {!loading && !loadFailed && members && members.length === 0 && (
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="border-t border-warm-gray-800/80 pt-8">
            <h2 className="font-serif text-[24px] font-semibold text-warm-gray-800">查不到你的保障資料</h2>
            <p className="mt-3 text-[14px] text-warm-gray-600 leading-[1.9]">填入以下資訊核對身份，我們會比對顧問建檔的資料。</p>

            <div className="mt-8 flex flex-col gap-6">
              <TextField label="姓名" hint="與顧問登記的姓名一致" value={verifyName} onChange={(e: any) => setVerifyName(e.target.value)} />
              <TextField label="生日" hint="例：1990-01-01" value={verifyBirthday} onChange={(e: any) => setVerifyBirthday(e.target.value)} />
              <TextField label="手機" hint="例：0912345678" value={verifyPhone} onChange={(e: any) => setVerifyPhone(e.target.value)} />
            </div>

            {verifyResult === "notfound" && (
              <div role="alert" className="mt-6 border-l-2 border-alert-red pl-4 text-[13px] text-alert-red leading-[1.9]">
                查無符合的資料，請確認姓名／生日／手機是否與顧問登記的一致，或直接聯繫顧問協助確認。
              </div>
            )}

            <motion.button
              onClick={submitVerify}
              disabled={verifying || !canVerify}
              whileTap={{ scale: canVerify ? 0.97 : 1 }}
              className="mt-8 w-full bg-forest text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-cyan-base transition-colors disabled:opacity-35 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50"
            >
              {verifying ? "核對中…" : "核對身份"}
            </motion.button>
            <p className="mt-4 text-[12px] text-warm-gray-500 tracking-wide leading-[1.9] text-center">核對成功後，之後登入會自動顯示你的保障資料，不需要再次核對。</p>
            <button onClick={bookConsult} className="mt-6 w-full text-[13px] tracking-[0.15em] text-warm-gray-600 hover:text-warm-gray-800 border-b border-warm-gray-300 pb-1 cursor-pointer">找不到資料？直接聯繫顧問</button>
          </motion.div>
        )}

        {!loading && !loadFailed && members && members.length > 0 && (
          <div>
            <SectionLabel>家庭保障總覽 · 共 {members.length} 位成員</SectionLabel>
            <div className="border-t border-warm-gray-800/80">
              {members.map((m, i) => (
                <Reveal key={m.id || i} delay={i * 0.04}>
                  <div className="py-8 border-b border-warm-gray-300">
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="font-serif text-[26px] font-semibold text-warm-gray-800">{m.name || "未命名"}</span>
                      {m.relation && <span className="text-[12px] tracking-[0.18em] text-brass border border-brass/40 px-2 py-0.5 rounded-full">{m.relation}</span>}
                      {m.age !== null && <span className="ml-auto text-[13px] text-warm-gray-500 tnum">{m.age} 歲</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {m.categories.map((c, j) => {
                        const st = statusStyle(c.status);
                        return (
                          <div key={j} className={`p-4 rounded-2xl border ${st.border} ${st.bg}`}>
                            <div className="text-[13px] font-medium text-warm-gray-800 tracking-wide">{c.label}</div>
                            <div className={`mt-1 text-[13px] font-medium tracking-wide ${st.textColor}`}>{st.label}</div>
                            {c.desc && <div className="mt-2 text-[13px] text-warm-gray-600 leading-[1.7]">{c.desc}</div>}
                            {c.note && <div className="mt-1 text-[12px] text-warm-gray-500 leading-[1.7]">{c.note}</div>}
                          </div>
                        );
                      })}
                    </div>

                    {(m.advisor || m.lastUpdated) && (
                      <div className="flex justify-between text-[12px] text-warm-gray-500 tracking-wide mt-5">
                        {m.advisor && <span>負責顧問：{m.advisor}</span>}
                        {m.lastUpdated && <span>更新於 {m.lastUpdated}</span>}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>

      <CtaBlock
        title="有保單相關問題？"
        desc="想調整保障、確認理賠，或單純想聊聊現況，直接在 LINE 跟我們說。"
        primary="在 LINE 跟我們聊聊"
        onPrimary={bookConsult}
        note="免費諮詢 · 無推銷壓力"
      />
      <p className="px-8 mt-8 pb-10 text-[12px] text-warm-gray-500 text-center tracking-wide leading-relaxed">保障內容以保單條款與保險公司核定為準。</p>
    </div>
  );
};
