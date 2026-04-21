import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";

export const RegisterPage = ({ onBack, onTerms, onSubmitSuccess }: { onBack: () => void, onTerms: () => void, onSubmitSuccess: () => void }) => {
  // Use session storage to persist data during redirects (like LINE login)
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

  // Auto-save form data to prevent loss during accidental refresh or OAuth redirect
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
    // Simulate LINE API OAuth redirect delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        lineUserId: `mock_line_uid_${Math.random().toString(36).substr(2, 9)}`,
        lineDisplayName: `${formData.name || '理財好朋友'}`,
        linePictureUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b15f48'
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
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm border-b border-slate-100 flex flex-col items-center relative z-10">
        <button type="button" onClick={handlePrev} className="absolute left-5 top-6 bg-slate-100 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer transition-colors hover:bg-slate-200">
          <Ic n="back" color="#475569" size={18} />
        </button>
        <h1 className="text-[20px] font-extrabold text-slate-800 text-center tracking-tight mb-4">會員註冊</h1>
        
        {/* Progress Bar */}
        <div className="w-full max-w-[280px] flex items-center justify-center gap-2">
          {[1, 2, 3].map(i => (
             <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step >= i ? 'bg-[#b15f48]' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-8 max-w-[430px] w-full mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
               <h2 className="text-[22px] font-black text-slate-800 mb-2">步驟 1：選擇身份</h2>
               <p className="text-[14px] text-slate-500 font-medium mb-8">請告訴我們您的身份，讓我們為您提供最適合的專屬服務。</p>
               
               <div className="flex flex-col gap-4 mb-10">
                 {['同儕', '思穎', '社會大眾'].map((opt) => (
                   <div key={opt} onClick={() => setFormData({...formData, identity: opt})} className={`flex items-center justify-between p-5 rounded-[16px] border-2 cursor-pointer transition-all ${formData.identity === opt ? 'border-[#b15f48] bg-orange-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                     <span className="text-[16px] text-slate-800 font-bold">{opt}</span>
                     <div className={`w-[22px] h-[22px] rounded-full border-[2px] flex items-center justify-center transition-colors ${formData.identity === opt ? 'border-[#b15f48] bg-[#b15f48]' : 'border-slate-300 bg-white'}`}>
                       {formData.identity === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-auto">
                 <button type="button" onClick={handleNext} className="w-full bg-[#b15f48] hover:bg-[#a1543d] active:scale-[0.98] text-white font-extrabold text-[16px] py-4 rounded-[12px] shadow-sm transition-all cursor-pointer border border-[#9b513d]">
                   下一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
               <h2 className="text-[22px] font-black text-slate-800 mb-2">步驟 2：聯絡資訊</h2>
               <p className="text-[14px] text-slate-500 font-medium mb-8">請留下您的基本聯絡方式，以便未來為您提供更確實的服務與保障。</p>
               
               <div className="flex flex-col gap-6 mb-10">
                  <div>
                    <label className="block text-[13.5px] font-extrabold text-slate-800 mb-2.5">姓名 <span className="text-rose-500">*</span></label>
                    <input type="text" required placeholder="您的真實姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3.5 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b15f48] focus:ring-1 focus:ring-[#b15f48] transition-all shadow-sm" />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-extrabold text-slate-800 mb-2.5">手機 <span className="text-rose-500">*</span></label>
                    <input type="tel" required placeholder="例如：0912345678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3.5 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b15f48] focus:ring-1 focus:ring-[#b15f48] transition-all shadow-sm" />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-extrabold text-slate-800 mb-2.5">生日 (民國年) <span className="text-rose-500">*</span></label>
                    <input type="text" required placeholder="例：0820105 (代表82年1月5日)" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3.5 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b15f48] focus:ring-1 focus:ring-[#b15f48] transition-all shadow-sm" />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-extrabold text-slate-800 mb-2.5">電子郵件 <span className="text-rose-500">*</span></label>
                    <input type="email" required placeholder="name@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3.5 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b15f48] focus:ring-1 focus:ring-[#b15f48] transition-all shadow-sm" />
                  </div>
               </div>

               <div className="mt-auto">
                 <button type="button" onClick={handleNext} className="w-full bg-[#b15f48] hover:bg-[#a1543d] active:scale-[0.98] text-white font-extrabold text-[16px] py-4 rounded-[12px] shadow-sm transition-all cursor-pointer border border-[#9b513d]">
                   下一步
                 </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
               <h2 className="text-[22px] font-black text-slate-800 mb-2">最後一步：資料確認與綁定</h2>
               <p className="text-[14px] text-slate-500 font-medium mb-6">請確認您的報名資訊，並點擊下方按鈕進行 LINE 帳號綁定以開通六格專屬選單。</p>
               
               {/* Data Confirmation Summary */}
               <div className="bg-slate-100 rounded-[16px] p-5 mb-6 border border-slate-200">
                 <h3 className="text-[14px] font-black text-slate-800 mb-4 flex items-center justify-between">
                   <span>已填寫資訊</span>
                   <button type="button" onClick={() => setStep(1)} className="text-[#b15f48] text-[13px] hover:underline bg-transparent border-none p-0 cursor-pointer">修改</button>
                 </h3>
                 <div className="space-y-3">
                   <div className="flex justify-between text-[14px]">
                     <span className="text-slate-500">身份</span>
                     <span className="font-bold text-slate-800">{formData.identity}</span>
                   </div>
                   <div className="flex justify-between text-[14px]">
                     <span className="text-slate-500">姓名</span>
                     <span className="font-bold text-slate-800">{formData.name}</span>
                   </div>
                   <div className="flex justify-between text-[14px]">
                     <span className="text-slate-500">手機</span>
                     <span className="font-bold text-slate-800">{formData.phone}</span>
                   </div>
                   <div className="flex justify-between text-[14px]">
                     <span className="text-slate-500">信箱</span>
                     <span className="font-bold text-slate-800">{formData.email}</span>
                   </div>
                 </div>
               </div>

               {/* REAL LINE Login Block */}
               <div className={`bg-white border ${formData.lineUserId ? 'border-[#b15f48] ring-1 ring-[#b15f48]/10' : 'border-[#00B900]'} shadow-sm rounded-[16px] p-4 flex items-center justify-between mb-8 transition-all`}>
                 <div className="flex items-center gap-3">
                   {formData.linePictureUrl ? (
                     <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                       <img src={formData.linePictureUrl} alt="LINE Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     </div>
                   ) : (
                     <div className="w-11 h-11 bg-[#00B900]/10 rounded-full flex items-center justify-center text-[#00B900] shrink-0">
                        <Ic n="user" size={20} color="#00B900" />
                     </div>
                   )}
                   
                   <div>
                     {formData.lineUserId ? (
                       <>
                         <div className="text-[15px] font-extrabold text-slate-800 tracking-[-0.01em]">{formData.lineDisplayName}</div>
                         <div className="text-[12.5px] text-[#00B900] mt-0.5 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#00B900] rounded-full inline-block" /> 已成功綁定</div>
                       </>
                     ) : (
                       <>
                         <div className="text-[15px] font-extrabold text-slate-800 tracking-[-0.01em]">尚未綁定 LINE</div>
                         <div className="text-[12.5px] text-slate-500 mt-0.5 font-medium">請點擊右邊按鈕授權</div>
                       </>
                     )}
                   </div>
                 </div>
                 
                 {!formData.lineUserId ? (
                   <button type="button" onClick={mockLineLogin} disabled={isLineLoading} className="bg-[#00B900] text-white text-[13px] font-bold px-4 py-2 rounded-full border border-[#009900] hover:bg-[#00A000] active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-wait">
                     {isLineLoading ? '連線中...' : 'LINE 綁定'}
                   </button>
                 ) : (
                   <div className="text-[#b15f48] text-[13px] font-bold px-3 py-1 bg-[#b15f48]/10 rounded-full">
                     ✓ 完成
                   </div>
                 )}
               </div>

               <div className="flex flex-col gap-4 mb-10 bg-white p-5 rounded-[16px] border border-slate-200 shadow-sm">
                 <div onClick={() => setFormData({...formData, newsletter: !formData.newsletter})} className="flex items-start gap-3 cursor-pointer group">
                   <div className={`mt-0.5 w-[22px] h-[22px] rounded-[6px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${formData.newsletter ? 'border-[#b15f48] bg-[#b15f48]' : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'}`}>
                     {formData.newsletter && (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     )}
                   </div>
                   <div className="flex flex-col pt-0.5">
                     <span className="text-[15px] text-slate-800 font-extrabold leading-relaxed">我願意收到會員電子報</span>
                     <span className="text-[13px] text-slate-500 font-medium mt-1">取得第一手的理財資訊、文章與官方最新活動通知。</span>
                   </div>
                 </div>
                 
                 <div className="h-px bg-slate-100 w-full my-1" />

                 <div onClick={() => setFormData({...formData, terms: !formData.terms})} className="flex items-start gap-3 cursor-pointer group">
                   <div className={`mt-0.5 w-[22px] h-[22px] rounded-[6px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${formData.terms ? 'border-[#b15f48] bg-[#b15f48]' : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'}`}>
                     {formData.terms && (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     )}
                   </div>
                   <div className="flex flex-col pt-0.5">
                     <span className="text-[15px] text-slate-800 font-extrabold leading-relaxed">我已閱讀並同意服務條款</span>
                     <span className="text-[13px] text-slate-500 font-medium mt-1">
                       點擊查看 <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTerms(); }} className="text-[#b15f48] underline font-black bg-transparent border-none p-0 cursor-pointer outline-none">服務條款與隱私權政策</button>，繼續送出代表您同意內容。
                     </span>
                   </div>
                 </div>
               </div>

               <div className="mt-auto">
                 <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={submitting || !formData.lineUserId} 
                  className={`w-full font-extrabold text-[16px] py-4 rounded-[12px] shadow-sm transition-all flex justify-center items-center ${
                    formData.lineUserId 
                      ? 'bg-[#b15f48] hover:bg-[#a1543d] active:scale-[0.98] text-white cursor-pointer border border-[#9b513d]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                 >
                    {submitting ? '載入中...' : (!formData.lineUserId ? '請先完成上方 LINE 綁定' : '確認無誤，送出資料')}
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
