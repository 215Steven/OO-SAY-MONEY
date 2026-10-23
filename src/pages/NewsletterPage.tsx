import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TopBar, PageHeader, Eyebrow, SPRING } from "@/src/components/ui";
import { useLiff } from "@/src/hooks/useLiff";
import { authHeaders } from "@/src/constants/liff";

export const NewsletterPage = ({ onBack }: { onBack: () => void }) => {
  const { profile } = useLiff();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // 有 LINE 資料時預先帶入名稱，使用者仍可自行修改
  useEffect(() => {
    if (profile?.displayName && !name) {
      setName(profile.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.displayName]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const canSubmit = isValidEmail(email) && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Email 格式不正確，請重新確認");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`訂閱失敗：${errJson.error || "請檢查網路連線或稍後再試。"}`);
      }
    } catch (err) {
      console.error(err);
      alert("發生無預期的錯誤");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <TopBar onBack={onBack} />
      {done ? (
        <div className="px-6 pt-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            <Eyebrow className="mb-6">Almost there</Eyebrow>
            <h1 className="font-serif text-[40px] leading-[1.15] font-semibold text-warm-gray-800">請到信箱<br /><span className="font-light italic text-brass">確認訂閱。</span></h1>
            <p className="mt-6 text-[15px] leading-[1.95] text-warm-gray-600">我們寄了一封確認信到 <span className="text-warm-gray-800 font-medium break-all">{email}</span>。點擊信中的確認連結後，就會開始收到電子報。若沒看到，請檢查垃圾郵件匣。</p>
            <motion.button type="button" onClick={onBack} whileTap={{ scale: 0.96 }} className="mt-10 w-full bg-forest text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-cyan-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50">回上一頁</motion.button>
          </motion.div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <PageHeader eyebrow="Newsletter" line1="加入" line2="電子報。" desc="留下 Email，訂閱理財快訊與電子報。" />
          <div className="px-6 flex flex-col gap-7">
            <label className="block border-b border-warm-gray-300 focus-within:border-forest transition-colors pb-2">
              <span className="block text-[12px] font-medium tracking-[0.2em] text-warm-gray-600">稱呼（選填）</span>
              <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="怎麼稱呼你" className="w-full bg-transparent border-none outline-none text-[17px] text-warm-gray-800 placeholder-warm-gray-400 tracking-wide mt-1.5 py-1" />
            </label>
            <label className="block border-b border-warm-gray-300 focus-within:border-forest transition-colors pb-2">
              <span className="block text-[12px] font-medium tracking-[0.2em] text-warm-gray-600">Email</span>
              <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="接收電子報用" className="w-full bg-transparent border-none outline-none text-[17px] text-warm-gray-800 placeholder-warm-gray-400 tracking-wide mt-1.5 py-1" />
            </label>
          </div>
          <div className="px-6 pt-10">
            <motion.button type="submit" disabled={!canSubmit} whileTap={{ scale: canSubmit ? 0.96 : 1 }}
              className={`w-full py-4 rounded-full text-[14px] font-medium tracking-[0.2em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50 ${canSubmit ? "bg-brass text-white hover:bg-[#A66B30] cursor-pointer" : "bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed"}`}>
              {submitting ? "處理中…" : "訂閱電子報"}
            </motion.button>
            <p className="mt-5 text-[13px] text-warm-gray-500 tracking-wide leading-[1.9] text-center">送出後會收到確認信，點擊信中連結才算完成訂閱。<br />Email 只用於寄送電子報，可隨時退訂。</p>
          </div>
        </form>
      )}
    </div>
  );
};
