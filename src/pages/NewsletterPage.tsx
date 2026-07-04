import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";
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
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10 flex flex-col relative overflow-hidden">
      {/* Header Area */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-center mb-8 border-b border-warm-gray-200 bg-white">
        <button
          type="button"
          onClick={onBack}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-warm-gray-200 cursor-pointer hover:bg-warm-gray-100 transition-colors shrink-0 shadow-sm"
        >
          <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-[14px] font-serif font-bold text-warm-gray-800 tracking-[0.2em] uppercase">電子報訂閱</h1>
        </div>
        <div className="w-10 h-10 shrink-0" />
      </div>

      <div className="flex-1 px-6 max-w-[430px] w-full mx-auto relative z-10 flex flex-col pt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-1 pb-10"
        >
          {done ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-cyan-soft/40 flex items-center justify-center">
                <Ic n="mail" size={28} color="var(--color-teal-base)" />
              </div>
              <h2 className="text-[20px] font-serif font-bold text-warm-gray-800 tracking-widest">訂閱申請已送出</h2>
              <p className="text-[13px] text-warm-gray-600 tracking-wide leading-relaxed max-w-[280px]">
                我們寄了一封確認信到 {email}，請至信箱點擊確認連結，就能開始收到理財快訊與電子報囉！
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-4 py-3 px-8 bg-teal-base text-white cursor-pointer font-medium tracking-widest text-[13px] uppercase rounded-2xl shadow-sm hover:bg-cyan-base transition-colors"
              >
                回上一頁
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">加入 OO SAY MONEY 電子報</h2>
                <p className="text-[14px] text-warm-gray-600 font-normal tracking-wide">留下 Email，訂閱理財快訊與電子報</p>
              </div>

              <div className="bg-white border border-warm-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
                <div className="flex items-center px-4 py-1">
                  <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3">
                    <Ic n="user" size={18} color="currentColor" />
                  </div>
                  <input
                    type="text"
                    placeholder="稱呼（選填）"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none px-3 py-4 text-[16px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide"
                  />
                </div>
                <div className="h-px bg-warm-gray-200 w-full" />
                <div className="flex items-center px-4 py-1">
                  <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3">
                    <Ic n="mail" size={18} color="currentColor" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email（接收電子報用）"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none px-3 py-4 text-[16px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide"
                  />
                </div>
              </div>

              <div className="mt-auto">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full font-medium text-[14px] py-4 transition-colors flex justify-center items-center uppercase tracking-widest rounded-2xl shadow-sm ${
                    canSubmit
                      ? "bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white cursor-pointer border border-teal-base"
                      : "bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed border border-transparent"
                  }`}
                >
                  {submitting ? "處理中..." : "訂閱電子報"}
                </button>
                <p className="text-center text-[12px] text-warm-gray-500 mt-4 tracking-wide">送出後會收到確認信，點擊信中連結才算完成訂閱</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
