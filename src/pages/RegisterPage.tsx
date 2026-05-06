import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useLiff } from "@/src/hooks/useLiff";

export const RegisterPage = ({ onBack, onTerms, onSubmitSuccess }: { onBack: () => void, onTerms: () => void, onSubmitSuccess: () => void }) => {
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('registerStep');
    const parsedStep = saved ? parseInt(saved) : 1;
    return parsedStep > 2 ? 1 : parsedStep;
  });
  
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('registerData');
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

  useEffect(() => {
    sessionStorage.setItem('registerData', JSON.stringify(formData));
    sessionStorage.setItem('registerStep', step.toString());
  }, [formData, step]);

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
    sessionStorage.removeItem('registerData');
    sessionStorage.removeItem('registerStep');
  };

  const handleLineLogin = () => {
    if (isReady && !profile) {
      sessionStorage.setItem('postLoginRedirect', window.location.pathname);
      login();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identity) return alert('請選擇您的身份');
    if (!formData.name || !formData.phone || !formData.birthday || !formData.email) return alert('請填寫完整聯絡資訊');
    if (!formData.lineUserId) return alert('請先點擊上方按鈕進行 LINE 綁定，以便開通專屬圖文選單。');
    if (!formData.terms) return alert('請確認服務條款與隱私權政策');

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (liff && liff.isInClient && liff.isInClient()) {
          // 透過送出關鍵字，讓聊天機器人自動切換使用者的圖文選單
          await liff.sendMessages([
            {
              type: "text",
              text: "已完成註冊開啟會員選單" 
            }
          ]).catch(console.error);
        }
        
        clearSession();
        setStep(2);
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
        {step === 1 ? (
          <button type="button" onClick={onBack} className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-warm-gray-200 cursor-pointer hover:bg-warm-gray-100 transition-colors shrink-0 shadow-sm">
            <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
          </button>
        ) : (
          <div className="w-10 h-10 shrink-0" />
        )}
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-[14px] font-serif font-bold text-warm-gray-800 tracking-[0.2em] uppercase ml-10">會員註冊</h1>
        </div>
        <button type="button" onClick={onSubmitSuccess} className="w-10 h-10 shrink-0 text-[11px] text-warm-gray-500 hover:text-teal-base tracking-widest font-medium flex items-center justify-center transition-colors">
          測試
        </button>
      </div>

      <div className="flex-1 px-6 max-w-[430px] w-full mx-auto relative z-10 flex flex-col pt-2">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 pb-10">
               
               <div className="text-center mb-8">
                 <h2 className="text-[20px] font-serif font-bold text-warm-gray-800 mb-2 tracking-widest">填寫會員資料</h2>
                 <p className="text-[14px] text-warm-gray-600 font-normal tracking-wide">請填寫以下資訊，一次完成註冊與綁定。</p>
               </div>

               {/* REAL LINE Login Block */}
               <div className="mb-8">
                 <h3 className="text-[14px] font-bold text-warm-gray-800 tracking-wider mb-3">1. LINE 帳號綁定 <span className="text-red-500">*</span></h3>
                 <div className="relative transition-all duration-500 bg-white border border-teal-soft p-1 flex flex-col rounded-2xl shadow-sm">
                   <div className="flex items-center justify-between p-3">
                     <div className="flex items-center gap-4">
                       {formData.linePictureUrl ? (
                         <div className="w-12 h-12 overflow-hidden shrink-0 border border-warm-gray-200 rounded-full">
                           <img 
                             src={formData.linePictureUrl} 
                             alt="LINE Profile" 
                             className="w-full h-full object-cover" 
                             referrerPolicy="no-referrer"
                             onError={() => setFormData({...formData, linePictureUrl: ''})}
                           />
                         </div>
                       ) : (
                         <div className="w-12 h-12 bg-warm-gray-50 flex items-center justify-center text-warm-gray-800/40 shrink-0 border border-warm-gray-200 rounded-full">
                            <Ic n="user" size={20} color="currentColor" />
                         </div>
                       )}
                       
                       <div className="flex flex-col justify-center">
                         {formData.lineUserId ? (
                           <>
                             <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-0.5">{formData.lineDisplayName}</div>
                             <div className="text-[11px] text-warm-gray-800/60 tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-teal-base rounded-full inline-block" /> 綁定成功</div>
                           </>
                         ) : (
                           <>
                             <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-0.5">尚未登入</div>
                             <div className="text-[11px] text-warm-gray-800/60 tracking-widest">請點擊右方按鈕</div>
                           </>
                         )}
                       </div>
                     </div>
                     
                     <div className="pr-1">
                       {!formData.lineUserId ? (
                         <button type="button" onClick={handleLineLogin} disabled={!isReady} className="bg-[#00B900] text-white text-[12px] font-medium tracking-widest px-4 py-2 hover:bg-[#00A000] rounded-xl active:scale-95 transition-all outline-none cursor-pointer disabled:opacity-70 shadow-sm">
                           {!isReady ? '連線中' : '授權連動'}
                         </button>
                       ) : (
                         <div className="flex justify-center items-center h-8 text-teal-base pr-2">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Identity Selection */}
               <div className="mb-8">
                 <h3 className="text-[14px] font-bold text-warm-gray-800 tracking-wider mb-3">2. 請問您怎麼認識 Steven&Annie？ <span className="text-red-500">*</span></h3>
                 <div className="flex flex-col gap-3">
                   {['親朋好友', '網路社群', '其他管道'].map((opt) => (
                     <div key={opt} onClick={() => setFormData({...formData, identity: opt})} className={`group flex items-center p-4 border cursor-pointer transition-all duration-300 rounded-2xl shadow-sm ${formData.identity === opt ? 'border-teal-base bg-cyan-soft/30' : 'border-warm-gray-200 bg-white hover:border-teal-soft/80 hover:bg-cyan-soft/10'}`}>
                       <span className={`text-[15px] font-medium flex-1 tracking-wider transition-colors ml-2 ${formData.identity === opt ? 'text-teal-base':'text-warm-gray-800'}`}>{opt}</span>
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${formData.identity === opt ? 'bg-teal-base' : 'bg-white border border-warm-gray-200'}`}>
                         {formData.identity === opt && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Contact Info */}
               <div className="mb-8">
                 <h3 className="text-[14px] font-bold text-warm-gray-800 tracking-wider mb-3">3. 聯絡資訊 <span className="text-red-500">*</span></h3>
                 <div className="flex flex-col bg-white border border-warm-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center px-4 py-1">
                      <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="user" size={18} color="currentColor"/></div>
                      <input type="text" required placeholder="您的真實姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                    </div>
                    <div className="h-px bg-warm-gray-200 w-full" />
  
                    <div className="flex items-center px-4 py-1 bg-warm-gray-50/50">
                      <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="list" size={18} color="currentColor"/></div>
                      <input type="tel" required placeholder="手機號碼 (09...)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                    </div>
                    <div className="h-px bg-warm-gray-200 w-full" />
  
                    <div className="flex items-center px-4 py-1">
                      <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="calendar" size={18} color="currentColor"/></div>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required placeholder="生日 例：820105 (民國)" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                    </div>
                    <div className="h-px bg-warm-gray-200 w-full" />
  
                    <div className="flex items-center px-4 py-1 bg-warm-gray-50/50">
                      <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="mail" size={18} color="currentColor"/></div>
                      <input type="email" required placeholder="接收重要通知信箱" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-300 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                    </div>
                 </div>
               </div>

               {/* Subscription / Terms List */}
               <div className="bg-white border border-warm-gray-200 p-0 rounded-2xl overflow-hidden shadow-sm mb-8">
                 <div onClick={() => setFormData({...formData, newsletter: !formData.newsletter})} className="flex items-center p-5 cursor-pointer hover:bg-warm-gray-50 transition-colors group">
                   <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all mr-4 border rounded ${formData.newsletter ? 'bg-teal-base border-teal-base' : 'bg-transparent border-warm-gray-200'}`}>
                     {formData.newsletter && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                   </div>
                   <span className="text-[13px] text-warm-gray-800 font-medium tracking-wide">我願意收到理財快訊與電子報</span>
                 </div>
                 
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
                    formData.lineUserId && formData.identity && formData.name && formData.phone && formData.birthday && formData.email && formData.terms
                      ? 'bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white cursor-pointer border border-teal-base' 
                      : 'bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed border border-transparent'
                  }`}
                 >
                    {submitting ? '處理中...' : '確認無誤，送出'}
                 </button>
                 <p className="text-center text-[12px] text-warm-gray-500 mt-4 tracking-wide">請再次確認填寫正確，送出後專屬圖文即開通</p>
               </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 items-center justify-center py-10 mt-10">
               <div className="w-16 h-16 rounded-full bg-teal-soft flex items-center justify-center text-teal-base mb-6">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </div>
               <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">開通成功</h2>
               <p className="text-[15px] text-warm-gray-600 font-normal tracking-wide text-center leading-relaxed mb-8">
                 您的會員功能已全部開通！<br/><br/>請關閉此視窗，並返回 LINE 聊天室，<br/>即可開始使用您的「專屬會員圖文選單」。
               </p>
               <button 
                 type="button" 
                 onClick={() => {
                   // @ts-ignore
                   if (window.liff && window.liff.isInClient && window.liff.isInClient()) {
                     // @ts-ignore
                     window.liff.closeWindow();
                   } else {
                     window.location.href = "https://line.me/R/ti/p/@oosaymoney";
                   }
                 }} 
                 className="w-full max-w-[200px] bg-teal-base hover:bg-cyan-base text-white font-medium text-[13px] py-4 rounded-2xl cursor-pointer uppercase tracking-widest shadow-sm">
                 關閉視窗 / 返回官方帳號
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
