import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { TopBar, PageHeader } from "@/src/components/ui";
import { useLiff } from "@/src/hooks/useLiff";
import { authHeaders } from "@/src/constants/liff";

export const RegisterPage = ({ onBack, onTerms, onSubmitSuccess }: { onBack: () => void, onTerms: () => void, onSubmitSuccess: () => void }) => {
  const defaultFormData = {
    identity: '',
    name: '',
    phone: '',
    birthday: '',
    email: '',
    newsletter: false,
    terms: false,
    lineUserId: '',
    lineDisplayName: '',
    linePictureUrl: ''
  };

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('registerData');
      if (!saved) return defaultFormData;
      const parsed = JSON.parse(saved);
      // 舊版資料格式可能缺少欄位或型別不符，與預設值合併避免下游操作出錯
      return { ...defaultFormData, ...parsed };
    } catch (e) {
      // 舊資料損毀（非合法 JSON）時不應讓整頁白屏，清除後改用預設值
      console.error("讀取本地註冊資料失敗，已重置", e);
      localStorage.removeItem('registerData');
      return defaultFormData;
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const { liff, isReady, profile, login } = useLiff();

  // 記錄註冊來源（從哪個頁面進入註冊），首次進站的路徑為準
  const [registerSource] = useState(() => {
    const saved = sessionStorage.getItem('registerSource');
    if (saved) return saved;
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    sessionStorage.setItem('registerSource', path);
    return path;
  });

  useEffect(() => {
    localStorage.setItem('registerData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => {
        if (prev.lineUserId !== profile.userId || prev.linePictureUrl !== profile.pictureUrl) {
          return {
            ...prev,
            lineUserId: profile.userId,
            lineDisplayName: profile.displayName,
            linePictureUrl: profile.pictureUrl || ''
          };
        }
        return prev;
      });
    }
  }, [profile]);

  const clearSession = () => {
    localStorage.removeItem('registerData');
    localStorage.removeItem('registerStep');
  };

  const handleLineLogin = () => {
    if (isReady && !profile) {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
      login();
    }
  };

  const canSubmit =
    formData.lineUserId &&
    formData.identity &&
    formData.terms &&
    (!formData.newsletter || formData.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lineUserId) return alert('LINE 帳號尚未連線完成，請稍候再試。');
    if (!formData.identity) return alert('請選擇您怎麼認識我們');
    if (formData.newsletter && !formData.email) return alert('請填寫 Email 以接收電子報');
    if (formData.newsletter && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) return alert('Email 格式不正確，請重新確認');
    if (!formData.terms) return alert('請確認服務條款與隱私權政策');

    // 姓名以 LINE 顯示名稱記錄，其他聯絡資料日後補填
    const finalName = formData.name || formData.lineDisplayName || '';

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        // 身分由後端依 access token 驗證，不信任前端傳的 lineUserId
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...formData, name: finalName, registerSource })
      });
      if (res.ok) {
        if (liff && liff.isInClient && liff.isInClient()) {
          const messages: any[] = [];
          const pendingQuizStr = localStorage.getItem('pendingQuizResult');

          if (pendingQuizStr) {
            try {
              const quizResult = JSON.parse(pendingQuizStr);
              messages.push({
                type: "flex",
                altText: "【財務性格測驗結果】",
                contents: {
                  type: "bubble",
                  size: "kilo",
                  direction: "ltr",
                  body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                       {
                         type: "text",
                         text: "🎊 財務性格測驗結果 🎊",
                         weight: "bold",
                         size: "md",
                         color: quizResult.color || "#14b8a6",
                         align: "center",
                         margin: "none"
                       },
                       {
                         type: "separator",
                         margin: "md"
                       },
                       {
                         type: "text",
                         text: "主要性格",
                         size: "xs",
                         color: "#aaaaaa",
                         margin: "md"
                       },
                       {
                         type: "text",
                         text: quizResult.mainName || "未知",
                         size: "xl",
                         weight: "bold",
                         color: "#333333",
                         wrap: true
                       },
                       {
                         type: "text",
                         text: "副屬性格： " + (quizResult.subName || "無"),
                         size: "sm",
                         color: "#666666",
                         margin: "sm",
                         wrap: true
                       }
                    ]
                  }
                }
              });
              // 記錄後即清除
              localStorage.removeItem('pendingQuizResult');
            } catch (e) {
               console.error("quiz result parse error", e);
            }
          }

          // 透過送出關鍵字，讓聊天機器人自動切換使用者的圖文選單
          messages.push({
            type: "text",
            text: "已完成註冊開啟會員選單"
          });

          try {
            await liff.sendMessages(messages);
            alert("註冊成功！資料驗證中，即將關閉視窗");
            liff.closeWindow();
          } catch (err: any) {
            console.error("sendMessages error", err);
            alert("發送訊息失敗，請檢查 LIFF 是否有開啟 chat_message.write 權限。\n錯誤訊息：" + err.message);
            liff.closeWindow();
          }
        } else {
          localStorage.removeItem('pendingQuizResult');
          alert("註冊成功！系統已記錄您的資料，請回到 LINE 聊天室查看。");
        }

        clearSession();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`提交失敗: ${errJson.error || '請檢查網路連線或稍後再試。'}\n(請確認是否已將會員資料庫右上角「•••」->「連結」-> 與 OOSAYHI 應用程式連結)`);
      }
    } catch (err) {
      console.error(err);
      alert('發生無預期的錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  const Check = ({ on }: { on: boolean }) => (
    <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center border transition-colors ${on ? "bg-forest border-forest" : "border-warm-gray-400"}`}>
      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
    </span>
  );

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <TopBar onBack={onBack} />
      <PageHeader eyebrow="Membership" line1="加入" line2="會員。" desc="確認 LINE 帳號並選擇身分，一步完成。" />

      <div className="px-6 flex flex-col gap-12">
        {/* LINE 帳號 */}
        <div onClick={handleLineLogin} className="flex items-center gap-4 border-y border-warm-gray-300 py-5">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-warm-gray-300 bg-warm-gray-100">
            {formData.linePictureUrl ? (
              <img src={formData.linePictureUrl} alt="LINE 大頭貼" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setFormData({ ...formData, linePictureUrl: "" })} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-warm-gray-500"><Ic n="user" size={20} color="currentColor" /></div>
            )}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] text-warm-gray-500 mb-1">LINE 帳號</div>
            {formData.lineUserId ? (
              <div className="font-serif text-[18px] font-semibold text-warm-gray-800">{formData.lineDisplayName}</div>
            ) : (
              <div className="text-[14px] text-warm-gray-500 animate-pulse">{isReady ? "請稍候，驗證中…" : "與 LINE 連線中…"}</div>
            )}
          </div>
        </div>

        {/* 身分 */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="font-serif text-[20px] font-semibold text-warm-gray-800 mb-5 leading-[1.5]">你怎麼認識 Steven &amp; Annie？<span className="text-alert-red ml-1">*</span></legend>
          <div className="border-t border-warm-gray-800/80">
            {["親朋好友", "網路社群", "其他管道"].map((opt) => {
              const on = formData.identity === opt;
              return (
                <button key={opt} type="button" role="radio" aria-checked={on} onClick={() => setFormData({ ...formData, identity: opt })}
                  className="w-full flex items-center gap-4 py-5 border-b border-warm-gray-300 text-left cursor-pointer outline-none focus-visible:bg-warm-gray-100">
                  <Check on={on} />
                  <span className={`text-[16px] tracking-wide transition-colors ${on ? "text-forest font-medium" : "text-warm-gray-800"}`}>{opt}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 電子報 / 條款 */}
        <div className="border-t border-warm-gray-800/80">
          <button type="button" role="checkbox" aria-checked={formData.newsletter} onClick={() => setFormData({ ...formData, newsletter: !formData.newsletter })} className="w-full flex items-center gap-4 py-5 border-b border-warm-gray-300 text-left cursor-pointer outline-none focus-visible:bg-warm-gray-100">
            <Check on={formData.newsletter} />
            <span className="text-[15px] text-warm-gray-800 tracking-wide">我願意收到理財快訊與電子報</span>
          </button>
          {formData.newsletter && (
            <label className="block py-4 border-b border-warm-gray-300 focus-within:border-forest transition-colors">
              <span className="block text-[11px] font-medium tracking-[0.2em] text-warm-gray-600">Email</span>
              <input type="email" inputMode="email" autoComplete="email" placeholder="接收電子報用" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-none outline-none text-[17px] text-warm-gray-800 placeholder-warm-gray-400 tracking-wide mt-1.5 py-1" />
            </label>
          )}
          <div className="flex items-start gap-4 py-5 border-b border-warm-gray-300">
            <button type="button" role="checkbox" aria-checked={formData.terms} aria-label="同意服務約定與隱私政策" onClick={() => setFormData({ ...formData, terms: !formData.terms })} className="mt-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded-full"><Check on={formData.terms} /></button>
            <div>
              <span className="text-[15px] text-warm-gray-800 tracking-wide">同意服務約定與隱私政策<span className="text-alert-red ml-1">*</span></span>
              <div className="mt-1.5 text-[12px] text-warm-gray-500">
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTerms(); }} className="text-forest border-b border-forest/40 hover:border-forest cursor-pointer bg-transparent p-0">查看條款內容</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <motion.button type="button" onClick={handleSubmit} disabled={submitting} whileTap={{ scale: canSubmit ? 0.97 : 1 }}
            className={`w-full py-4 rounded-full text-[14px] font-medium tracking-[0.2em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50 ${canSubmit ? "bg-brass text-white hover:bg-[#A66B30] cursor-pointer" : "bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed"}`}>
            {submitting ? "處理中…" : "完成加入"}
          </motion.button>
          <p className="mt-5 text-[12px] text-warm-gray-500 tracking-wide leading-[1.9] text-center">送出後專屬圖文選單即開通，聯絡資料可日後補填。</p>
        </div>
      </div>
      <div className="pb-10" />
    </div>
  );
};
