import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useLiff } from "@/src/hooks/useLiff";

export const RegisterPage = ({ onBack, onTerms, onSubmitSuccess }: { onBack: () => void, onTerms: () => void, onSubmitSuccess: () => void }) => {
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('registerStep');
    return saved ? parseInt(saved) : 1;
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
        // Only update if there's a difference to avoid infinite loops
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

  const handleNext = () => {
    if (step === 1 && !formData.identity) return alert('請先選擇您的身份');
    if (step === 2 && (!formData.name || !formData.phone || !formData.birthday || !formData.email)) return alert('請填寫完整聯絡資訊');
    window.scrollTo(0, 0);
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      window.scrollTo(0, 0);
      setStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

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
    if (!formData.lineUserId) return alert('請先點擊上方按鈕進行 LINE 綁定，以便開通專屬圖文選單。');
    if (!formData.terms) return alert('請確認服務條款與隱私權政策');

    setSubmitting(true);
    try {
      // ===== 暫時使用模擬提交，避免卡住 =======
      console.log('Mocking submission for data:', formData);
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('註冊成功！將為您關閉頁面，請回到 LINE 官方帳號查看選單。');
      clearSession();
      if (liff && liff.isInClient && liff.isInClient()) {
          liff.closeWindow();
      } else {
          onSubmitSuccess();
      }
      /*
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('註冊成功！將為您關閉頁面，請回到 LINE 官方帳號查看選單。');
        clearSession();
        if (liff && liff.isInClient && liff.isInClient()) {
            liff.closeWindow();
        } else {
            onSubmitSuccess();
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`提交失敗: ${errJson.error || '請檢查網路連線或稍後再試。'}\n(請確認 Netlify 是否已設定 NOTION_API_KEY 等變數)`);
      }
      */
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
        {step > 1 ? (
          <button type="button" onClick={handlePrev} className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-warm-gray-200 cursor-pointer hover:bg-warm-gray-100 transition-colors shrink-0 shadow-sm">
            <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
          </button>
        ) : (
          <div className="w-10 h-10 shrink-0" />
        )}
        <div className="flex-1 flex flex-col items-center justify-center -ml-10">
            <h1 className="text-[14px] font-serif font-bold text-warm-gray-800 tracking-[0.2em] uppercase">會員註冊</h1>
        </div>
      </div>

      <div className="flex-1 px-6 max-w-[430px] w-full mx-auto relative z-10 flex flex-col pt-4">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map(i => (
                 <div key={i} className={`rounded-full transition-all duration-300 ease-out ${step >= i ? 'bg-teal-base w-6 h-1.5' : 'bg-[#D6D3D1] w-1.5 h-1.5'}`} />
              ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10, transition:{duration:0.15} }} transition={{ duration: 0.4 }} className="flex flex-col flex-1">
               <div className="text-center mb-10">
                 <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">身分選擇</h2>
                 <p className="text-[12px] text-warm-gray-600 font-normal tracking-wide">選擇符合您的狀態，以客製化服務內容</p>
               </div>
               
               <div className="flex flex-col gap-4 mb-6">
                 {['同儕', '家庭', '社會大眾'].map((opt) => (
                   <div key={opt} onClick={() => setFormData({...formData, identity: opt})} className={`group flex items-center p-5 border cursor-pointer transition-all duration-300 rounded-2xl shadow-sm ${formData.identity === opt ? 'border-teal-base bg-cyan-soft/30' : 'border-warm-gray-200 bg-white hover:border-teal-soft/80 hover:bg-cyan-soft/10'}`}>
                     <div className={`w-10 h-10 flex items-center justify-center mr-4 shrink-0 transition-colors rounded-full ${formData.identity === opt ? 'bg-teal-base text-white' : 'bg-warm-gray-50 text-warm-gray-800/60 border border-warm-gray-200 group-hover:bg-cyan-soft group-hover:text-cyan-base group-hover:border-teal-soft'}`}>
                       <Ic n="user" size={20} color="currentColor" />
                     </div>
                     <span className={`text-[15px] font-medium flex-1 tracking-wider transition-colors ${formData.identity === opt ? 'text-teal-base':'text-warm-gray-800'}`}>{opt}</span>
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${formData.identity === opt ? 'bg-teal-base' : 'bg-white border border-warm-gray-200'}`}>
                       {formData.identity === opt && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-8">
                 <button type="button" onClick={handleNext} className="w-full bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white font-medium text-[13px] py-4 shadow-sm transition-colors cursor-pointer uppercase tracking-widest border border-teal-base rounded-2xl">
                   繼續下一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10, transition:{duration:0.15} }} transition={{ duration: 0.4 }} className="flex flex-col flex-1">
               <div className="text-center mb-10">
                 <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">聯絡資訊</h2>
                 <p className="text-[12px] text-warm-gray-600 font-normal tracking-wide">確保未來能收到專屬財務通知。</p>
               </div>
               
               <div className="flex flex-col gap-0 bg-white border border-warm-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center px-4 py-1">
                    <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="user" size={18} color="currentColor"/></div>
                    <input type="text" required placeholder="您的真實姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-200 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                  </div>
                  <div className="h-px bg-warm-gray-200 w-full" />

                  <div className="flex items-center px-4 py-1 bg-warm-gray-50/50">
                    <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="list" size={18} color="currentColor"/></div>
                    <input type="tel" required placeholder="手機號碼 (09...)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-200 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                  </div>
                  <div className="h-px bg-warm-gray-200 w-full" />

                  <div className="flex items-center px-4 py-1">
                    <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="calendar" size={18} color="currentColor"/></div>
                    <input type="text" required placeholder="生日 例：820105 (民國)" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-200 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                  </div>
                  <div className="h-px bg-warm-gray-200 w-full" />

                  <div className="flex items-center px-4 py-1 bg-warm-gray-50/50">
                    <div className="w-10 shrink-0 text-warm-gray-800/50 flex justify-center border-r border-warm-gray-200 mr-2 pr-2 py-3"><Ic n="mail" size={18} color="currentColor"/></div>
                    <input type="email" required placeholder="電子郵件" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none px-3 py-4 text-[14px] font-medium text-warm-gray-800 placeholder-warm-gray-200 focus:outline-none focus:ring-0 tracking-wide rounded-2xl" />
                  </div>
               </div>

               <div className="mt-auto pt-8">
                 <button type="button" onClick={handleNext} className="w-full bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white font-medium text-[13px] py-4 rounded-2xl shadow-sm transition-colors cursor-pointer uppercase tracking-widest border border-teal-base">
                   核對最後一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10, transition:{duration:0.15} }} transition={{ duration: 0.4 }} className="flex flex-col flex-1">
               <div className="text-center mb-10">
                 <h2 className="text-[24px] font-serif font-bold text-warm-gray-800 mb-3 tracking-widest">開通專屬選單</h2>
                 <p className="text-[12px] text-warm-gray-600 font-normal tracking-wide">點擊下方進行 LINE 帳號授權綁定。</p>
               </div>
               
               {/* REAL LINE Login Block - Floating UI */}
               <div className="relative mb-6 transition-all duration-500 bg-white border border-teal-soft p-2 flex flex-col rounded-2xl shadow-sm">
                 <div className="flex items-center justify-between p-4">
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
                           <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-0.5">LINE 身份</div>
                           <div className="text-[11px] text-warm-gray-800/60 tracking-widest">尚未登入授權</div>
                         </>
                       )}
                     </div>
                   </div>
                   
                   <div className="pr-1">
                     {!formData.lineUserId ? (
                       <button type="button" onClick={handleLineLogin} disabled={!isReady} className="bg-[#00B900] text-white text-[12px] font-medium tracking-widest px-4 py-2.5 hover:bg-[#00A000] rounded-xl active:scale-95 transition-all outline-none cursor-pointer disabled:opacity-70 flex shadow-sm">
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

               {/* Subscription / Terms List */}
               <div className="bg-white border border-warm-gray-200 p-0 rounded-2xl overflow-hidden shadow-sm">
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
                     <span className="text-[13px] text-warm-gray-800 font-medium tracking-wide">同意服務約定與隱私政策</span>
                     <span className="text-[11px] text-warm-gray-800/60 font-normal mt-1 tracking-wider">點擊 <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTerms(); }} className="text-teal-base font-bold bg-transparent outline-none cursor-pointer p-0 border-b border-teal-base/30 hover:border-teal-base">查看條款內容</button></span>
                   </div>
                 </div>
               </div>

               <div className="mt-auto pt-8">
                 <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={submitting || !formData.lineUserId} 
                  className={`w-full font-medium text-[13px] py-4 transition-colors flex justify-center items-center uppercase tracking-widest rounded-2xl shadow-sm ${
                    formData.lineUserId 
                      ? 'bg-teal-base hover:bg-cyan-base active:scale-[0.98] text-white cursor-pointer border border-teal-base' 
                      : 'bg-warm-gray-100 text-warm-gray-800/40 cursor-not-allowed border border-warm-gray-200'
                  }`}
                 >
                    {submitting ? '處理中...' : (!formData.lineUserId ? '等待 LINE 綁定完成' : '確認無誤，送出')}
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
