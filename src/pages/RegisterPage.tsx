import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";

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
  const [isLineLoading, setIsLineLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('registerData', JSON.stringify(formData));
    sessionStorage.setItem('registerStep', step.toString());
  }, [formData, step]);

  const handleNext = () => {
    if (step === 1 && !formData.identity) return alert('請先選擇您的身份');
    if (step === 2 && (!formData.name || !formData.phone || !formData.birthday || !formData.email)) return alert('請填寫完整聯絡資訊');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem('registerData');
    sessionStorage.removeItem('registerStep');
  };

  const mockLineLogin = () => {
    setIsLineLoading(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        lineUserId: `mock_line_uid_${Math.random().toString(36).substr(2, 9)}`,
        lineDisplayName: `${formData.name || '理財好朋友'}`,
        linePictureUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=a855f7'
      }));
      setIsLineLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        alert('註冊成功！為您啟動專屬會員面板。');
        clearSession();
        onSubmitSuccess();
      } else {
        alert('提交失敗，請檢查網路連線或稍後再試。');
      }
    } catch (err) {
      console.error(err);
      alert('發生無預期的錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8f5ff] font-sans pb-10 flex flex-col relative overflow-hidden">
      {/* Decorative Blur Orbs for seamless background */}
      <div className="fixed top-0 left-0 w-full h-[350px] bg-gradient-to-b from-[#e9d8fd] to-transparent z-0 pointer-events-none" />
      <div className="fixed top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#d8b4fe]/40 rounded-full blur-[80px] z-0 pointer-events-none" />
      <div className="fixed top-[150px] right-[-100px] w-[250px] h-[250px] bg-[#c084fc]/20 rounded-full blur-[60px] z-0 pointer-events-none" />
      <div className="fixed bottom-[-50px] left-[50px] w-[200px] h-[200px] bg-[#fef08a]/20 rounded-full blur-[60px] z-0 pointer-events-none" />

      {/* Header Area */}
      <div className="relative z-10 px-6 pt-8 pb-4 flex items-center mb-4">
        <button type="button" onClick={handlePrev} className="bg-white/60 backdrop-blur-md rounded-[14px] w-10 h-10 flex items-center justify-center border border-white/80 shadow-[0_4px_10px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:bg-white shrink-0">
          <Ic n="back" color="#6b7280" size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center -ml-10">
            <h1 className="text-[18px] font-extrabold text-[#4c1d95] tracking-wide">會員註冊</h1>
        </div>
      </div>

      <div className="flex-1 px-6 max-w-[430px] w-full mx-auto relative z-10 flex flex-col">
        {/* Soft Bubble Progress Indicator */}
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/50 shadow-[0_2px_15px_rgba(139,92,246,0.05)]">
              {[1, 2, 3].map(i => (
                 <div key={i} className={`h-2 rounded-full transition-all duration-500 ease-out ${step === i ? 'bg-[#9333ea] w-6 shadow-[0_0_10px_rgba(147,51,234,0.4)]' : step > i ? 'bg-[#d8b4fe] w-2' : 'bg-white w-2'}`} />
              ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -15, transition:{duration:0.15} }} transition={{ duration: 0.3 }} className="flex flex-col flex-1">
               <div className="text-center mb-8">
                 <h2 className="text-[26px] font-black text-slate-800 mb-2">選擇您的身份</h2>
                 <p className="text-[14px] text-slate-500 font-medium">讓我們為您量身打造專屬服務。</p>
               </div>
               
               <div className="flex flex-col gap-4 mb-4">
                 {['同儕', '家庭', '社會大眾'].map((opt) => (
                   <div key={opt} onClick={() => setFormData({...formData, identity: opt})} className={`group flex items-center p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-300 ${formData.identity === opt ? 'border-[#c084fc] bg-white shadow-[0_10px_30px_rgba(168,85,247,0.15)] transform scale-[1.02]' : 'border-white bg-white/60 hover:bg-white hover:shadow-[0_4px_15px_rgba(0,0,0,0.02)] backdrop-blur-sm'}`}>
                     <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mr-4 transition-colors ${formData.identity === opt ? 'bg-[#f3e8ff] text-[#9333ea]' : 'bg-slate-100 text-slate-400 group-hover:bg-[#f3e8ff]/50'}`}>
                       <Ic n="user" size={24} color="currentColor" />
                     </div>
                     <span className={`text-[17px] font-bold flex-1 transition-colors ${formData.identity === opt ? 'text-[#7e22ce]':'text-slate-700'}`}>{opt}</span>
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${formData.identity === opt ? 'bg-[#a855f7] shadow-[0_2px_8px_rgba(168,85,247,0.4)]' : 'border-2 border-slate-200 bg-white'}`}>
                       {formData.identity === opt && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-8">
                 <button type="button" onClick={handleNext} className="w-full bg-[#9333ea] hover:bg-[#7e22ce] active:scale-[0.98] text-white font-bold text-[16px] py-4 rounded-[20px] shadow-[0_8px_25px_rgba(147,51,234,0.3)] transition-all cursor-pointer">
                   繼續下一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15, transition:{duration:0.15} }} transition={{ duration: 0.3 }} className="flex flex-col flex-1">
               <div className="text-center mb-8">
                 <h2 className="text-[26px] font-black text-slate-800 mb-2">基本聯絡資訊</h2>
                 <p className="text-[14px] text-slate-500 font-medium">確保未來能收到專屬財務通知。</p>
               </div>
               
               <div className="flex flex-col gap-4 bg-white/60 backdrop-blur-md p-2 rounded-[28px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center px-4 py-2 bg-white rounded-[20px]">
                    <div className="w-8 shrink-0 text-slate-400 flex justify-center"><Ic n="user" size={18} color="currentColor"/></div>
                    <input type="text" required placeholder="您的真實姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-none px-3 py-3 text-[15px] font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0" />
                  </div>
                  <div className="h-px bg-slate-100 mx-6" />

                  <div className="flex items-center px-4 py-2 bg-white rounded-[20px]">
                    <div className="w-8 shrink-0 text-slate-400 flex justify-center"><Ic n="list" size={18} color="currentColor"/></div>
                    <input type="tel" required placeholder="手機號碼 (09...)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-none px-3 py-3 text-[15px] font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0" />
                  </div>
                  <div className="h-px bg-slate-100 mx-6" />

                  <div className="flex items-center px-4 py-2 bg-white rounded-[20px]">
                    <div className="w-8 shrink-0 text-slate-400 flex justify-center"><Ic n="calendar" size={18} color="currentColor"/></div>
                    <input type="text" required placeholder="生日 例：820105 (民國)" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full bg-transparent border-none px-3 py-3 text-[15px] font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0" />
                  </div>
                  <div className="h-px bg-slate-100 mx-6" />

                  <div className="flex items-center px-4 py-2 bg-white rounded-[20px]">
                    <div className="w-8 shrink-0 text-slate-400 flex justify-center"><Ic n="mail" size={18} color="currentColor"/></div>
                    <input type="email" required placeholder="電子郵件" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none px-3 py-3 text-[15px] font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0" />
                  </div>
               </div>

               <div className="mt-auto pt-8">
                 <button type="button" onClick={handleNext} className="w-full bg-[#9333ea] hover:bg-[#7e22ce] active:scale-[0.98] text-white font-bold text-[16px] py-4 rounded-[20px] shadow-[0_8px_25px_rgba(147,51,234,0.3)] transition-all cursor-pointer">
                   核對最後一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15, transition:{duration:0.15} }} transition={{ duration: 0.3 }} className="flex flex-col flex-1">
               <div className="text-center mb-8">
                 <h2 className="text-[26px] font-black text-slate-800 mb-2">開通專屬選單</h2>
                 <p className="text-[14px] text-slate-500 font-medium">點擊下方進行 LINE 帳號授權綁定。</p>
               </div>
               
               {/* REAL LINE Login Block - Floating UI */}
               <div className={`relative overflow-hidden mb-6 transition-all duration-500 ${formData.lineUserId ? 'bg-[#f0fdf4] border-2 border-[#10b981] shadow-[0_10px_30px_rgba(16,185,129,0.15)]' : 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white'} rounded-[28px] p-2 flex flex-col`}>
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center gap-4">
                     {formData.linePictureUrl ? (
                       <div className="w-[52px] h-[52px] rounded-[18px] overflow-hidden shadow-md shrink-0 border-2 border-white">
                         <img src={formData.linePictureUrl} alt="LINE Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       </div>
                     ) : (
                       <div className="w-[52px] h-[52px] bg-[#f0fdf4] rounded-[18px] flex items-center justify-center text-[#10b981] shrink-0 border border-[#10b981]/20">
                          <Ic n="user" size={26} color="#10b981" />
                       </div>
                     )}
                     
                     <div className="flex flex-col justify-center">
                       {formData.lineUserId ? (
                         <>
                           <div className="text-[17px] font-black text-slate-800 mb-0.5">{formData.lineDisplayName}</div>
                           <div className="text-[13px] text-[#10b981] font-bold flex items-center gap-1.5"><span className="w-2 h-2 bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.8)] rounded-full inline-block" /> 綁定成功</div>
                         </>
                       ) : (
                         <>
                           <div className="text-[17px] font-black text-slate-800 mb-0.5">LINE 身份</div>
                           <div className="text-[13px] text-slate-400 font-medium tracking-wide">尚未登入授權</div>
                         </>
                       )}
                     </div>
                   </div>
                   
                   <div className="pr-1">
                     {!formData.lineUserId ? (
                       <button type="button" onClick={mockLineLogin} disabled={isLineLoading} className="bg-[#00B900] text-white text-[13px] font-bold px-5 py-3 rounded-full shadow-[0_4px_12px_rgba(0,185,0,0.25)] hover:bg-[#00A000] active:scale-95 transition-all outline-none cursor-pointer disabled:opacity-70 flex">
                         {isLineLoading ? '連線中' : '連動'}
                       </button>
                     ) : (
                       <div className="flex justify-center items-center h-8 text-[#10b981] pr-2">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               {/* Subscription / Terms List */}
               <div className="bg-white/60 backdrop-blur-md rounded-[28px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-2">
                 <div onClick={() => setFormData({...formData, newsletter: !formData.newsletter})} className="flex items-center p-4 cursor-pointer rounded-[20px] hover:bg-white transition-colors group">
                   <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all mr-4 border-2 ${formData.newsletter ? 'bg-[#9333ea] border-[#9333ea] shadow-[0_2px_8px_rgba(147,51,234,0.4)]' : 'bg-transparent border-slate-200 group-hover:border-[#d8b4fe]'}`}>
                     {formData.newsletter && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                   </div>
                   <span className="text-[15px] text-slate-700 font-bold">我願意收到理財快訊與電子報</span>
                 </div>
                 
                 <div className="h-px bg-slate-100 mx-6" />

                 <div onClick={() => setFormData({...formData, terms: !formData.terms})} className="flex items-center p-4 cursor-pointer rounded-[20px] hover:bg-white transition-colors group">
                   <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all mr-4 border-2 ${formData.terms ? 'bg-[#9333ea] border-[#9333ea] shadow-[0_2px_8px_rgba(147,51,234,0.4)]' : 'bg-transparent border-slate-200 group-hover:border-[#d8b4fe]'}`}>
                     {formData.terms && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[15px] text-slate-700 font-bold">同意服務約定與隱私政策</span>
                     <span className="text-[12px] text-slate-400 font-medium mt-0.5">點擊 <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTerms(); }} className="text-[#9333ea] bg-transparent outline-none cursor-pointer p-0 border-0 underline">查看條款內容</button></span>
                   </div>
                 </div>
               </div>

               <div className="mt-auto pt-8">
                 <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={submitting || !formData.lineUserId} 
                  className={`w-full font-bold text-[16px] py-4 rounded-[20px] transition-all flex justify-center items-center ${
                    formData.lineUserId 
                      ? 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white cursor-pointer shadow-[0_8px_25px_rgba(15,23,42,0.2)]' 
                      : 'bg-white/50 text-slate-400 cursor-not-allowed border-2 border-white/80 shadow-none backdrop-blur-sm'
                  }`}
                 >
                    {submitting ? '載入中...' : (!formData.lineUserId ? '等待 LINE 綁定完成' : '確認無誤，送出')}
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
