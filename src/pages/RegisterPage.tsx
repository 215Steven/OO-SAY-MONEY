import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useLiff } from "@/src/hooks/useLiff";
import { authHeaders } from "@/src/constants/liff";

export const RegisterPage = ({ onBack, onTerms, onSubmitSuccess }: { onBack: () => void, onTerms: () => void, onSubmitSuccess: () => void }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('registerData');
    return saved ? JSON.parse(saved) : {
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

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10 flex flex-col relative overflow-hidden">

      {/* Header Area */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-center mb-8 border-b border-warm-gray-200 bg-white">
        <button type="button" onClick={onBack} className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-warm-gray-200 cursor-pointer hover:bg-warm-gray-100 transition-colors shrink-0 shadow-sm">
          <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-[14px] font-serif font-bold text-warm-gray-800 tracking-[0.2em] uppercase">會員註冊</h1>
        </div>
        <div className="w-10 h-10 shrink-0" />
      </div>

      <div className="flex-1 px-6 max-w-[430px] w-full mx-auto relative z-10 flex flex-col pt-2">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 pb-10">

          <div className="text-center mb-8">
            <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">加入會員</h2>
            <p className="text-[14px] text-warm-gray-600 font-normal tracking-wide">確認 LINE 帳號並選擇身分，一步完成</p>
          </div>

          {/* LINE Login Block */}
          <div className="mb-8" onClick={handleLineLogin}>
            <div className="bg-white px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm border border-warm-gray-200">
               <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-warm-gray-200">
                   {formData.linePictureUrl ? (
                      <img src={formData.linePictureUrl} alt="LINE Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setFormData({...formData, linePictureUrl: ''})} />
                   ) : (
                      <div className="w-full h-full bg-warm-gray-50 flex items-center justify-center text-warm-gray-800/40">
                        <Ic n="user" size={18} color="currentColor" />
                      </div>
                   )}
               </div>
               {formData.lineUserId ? (
                 <div className="font-serif font-bold text-[15px] text-warm-gray-800 tracking-wide pr-2">{formData.lineDisplayName}</div>
               ) : (
                 <div className="font-serif font-bold text-[14px] text-warm-gray-800/60 tracking-wide pr-2 animate-pulse">
                   {isReady ? '請稍候，驗證中...' : '與 LINE 連線中...'}
                 </div>
               )}
            </div>
          </div>

          {/* Identity Selection */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold text-warm-gray-800 tracking-wider mb-3">請問您怎麼認識 Steven&Annie？ <span className="text-red-500">*</span></h3>
            <div className="flex flex-col gap-3">
              {['親朋好友', '網路社群', '其他管道'].map((opt) => (
                <div
                   key={opt}
                   onClick={() => {
                     setFormData({...formData, identity: opt});
                   }}
                   className={`group flex items-center p-4 border cursor-pointer transition-all duration-300 rounded-2xl shadow-sm ${formData.identity === opt ? 'border-teal-base bg-cyan-soft/30' : 'border-warm-gray-200 bg-white hover:border-teal-soft/80 hover:bg-cyan-soft/10'}`}
                >
                  <span className={`text-[15px] font-medium flex-1 tracking-wider transition-colors ml-2 ${formData.identity === opt ? 'text-teal-base':'text-warm-gray-800'}`}>{opt}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${formData.identity === opt ? 'bg-teal-base' : 'bg-white border border-warm-gray-200'}`}>
                    {formData.identity === opt && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter / Email / Terms */}
          <div className="bg-white border border-warm-gray-200 p-0 rounded-2xl overflow-hidden shadow-sm mb-8">
            <div onClick={() => setFormData({...formData, newsletter: !formData.newsletter})} className="flex items-center p-5 cursor-pointer hover:bg-warm-gray-50 transition-colors group">
              <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all mr-4 border rounded ${formData.newsletter ? 'bg-teal-base border-teal-base' : 'bg-transparent border-warm-gray-200'}`}>
                {formData.newsletter && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span className="text-[13px] text-warm-gray-800 font-medium tracking-wide">我願意收到理財快訊與電子報</span>
            </div>

            {formData.newsletter && (
              <>
                <div className="h-px bg-warm-gray-200 w-full" />
                <div className="flex items-center px-4 py-1 bg-warm-gray-50/50">
                  <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="mail" size={18} color="currentColor"/></div>
                  <input type="email" placeholder="Email（接收電子報用）" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[16px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide" />
                </div>
              </>
            )}

            <div className="h-px bg-warm-gray-200 w-full" />

            <div onClick={() => setFormData({...formData, terms: !formData.terms})} className="flex items-center p-5 cursor-pointer hover:bg-warm-gray-50 transition-colors group">
              <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all mr-4 border rounded ${formData.terms ? 'bg-teal-base border-teal-base' : 'bg-transparent border-warm-gray-200'}`}>
                {formData.terms && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-warm-gray-800 font-medium tracking-wide">同意服務約定與隱私政策 <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-warm-gray-800/60 font-normal mt-1 tracking-wider">點擊 <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTerms(); }} className="text-teal-base font-bold bg-transparent outline-none cursor-pointer p-0 border-b border-teal-base/30 hover:border-teal-base">查看條款內容</button></span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
             type="button"
             onClick={handleSubmit}
             disabled={submitting}
             className={`w-full font-medium text-[14px] py-4 transition-colors flex justify-center items-center uppercase tracking-widest rounded-2xl shadow-sm ${
               canSubmit
                 ? 'bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white cursor-pointer border border-teal-base'
                 : 'bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed border border-transparent'
             }`}
            >
               {submitting ? '處理中...' : '完成加入'}
            </button>
            <p className="text-center text-[12px] text-warm-gray-500 mt-4 tracking-wide">送出後專屬圖文選單即開通，聯絡資料可日後補填</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
