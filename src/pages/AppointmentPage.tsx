import { useState, useEffect, useRef } from "react";
import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";

// --- Constants ---
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const TOPICS_LIST = ['🏥 醫療保險', '📈 投資規劃', '📋 理賠服務', '🔄 保險變更', '🚗 汽機車險', '✈️ 旅遊保險'];
const SLOTS_LIST = [
  { time: '10:30 – 11:30', label: '上午場' },
  { time: '12:00 – 13:30', label: '午間場' },
  { time: '14:00 – 15:30', label: '下午場' },
  { time: '19:00 – 20:30', label: '晚間場' },
  { time: '🤝 其他時段', label: '請在備註說明方便時間', isOther: true }
];

export const AppointmentPage = ({ onBack }: { onBack: () => void }) => {
  // --- States ---
  const [step, setStep] = useState(1);
  const [toastMsg, setToastMsg] = useState('');
  
  // Profile (mock LIFF)
  const [profile, setProfile] = useState({ name: '載入中…', avatar: null });

  // Booking Data
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [note, setNote] = useState('');
  
  // Calendar View State
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Simulate fetching LINE profile
    const timer = setTimeout(() => setProfile({ name: 'LINE 使用者', avatar: null }), 600);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  // --- Navigation & Validation ---
  const goStep2 = () => {
    if (!selectedDate || !selectedSlot) return;
    setStep(2);
    if (selectedSlot.includes('其他時段')) {
      setTimeout(() => {
        noteRef.current?.focus();
        noteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  };

  const goStep3 = () => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) return showToast('請填寫手機號碼');
    if (!/^09\d{8}$/.test(trimmedPhone)) return showToast('手機格式不正確，需 09 開頭共 10 碼');
    setPhone(trimmedPhone);
    setStep(3);
  };

  const submitBooking = () => {
    setIsSubmitting(true);
    // Dummy async task
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1200);
  };

  const resetAll = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setPhone('');
    setTopics([]);
    setNote('');
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
    setStep(1);
  };

  // --- Helpers ---
  const toggleTopic = (t: string) => {
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}（${WEEKDAYS[date.getDay()]}）`;
  };

  // --- Calendar Logistics ---
  const changeMonth = (delta: number) => {
    let m = calMonth + delta;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  
  const prevDisabled = calYear < today.getFullYear() || (calYear === today.getFullYear() && calMonth <= today.getMonth());
  const nextMonthDate = new Date(calYear, calMonth + 1, 1);
  const nextDisabled = nextMonthDate > maxDate;

  // --- Render Sections ---
  const renderStepIndicator = () => (
    <div className="pt-4 pb-2 px-5 max-w-sm mx-auto relative z-10">
      <div className="flex items-center justify-between relative z-10 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:w-full before:h-1 before:bg-white/30 before:rounded-full before:-z-10">
        {[1, 2, 3].map((num) => {
          let statusClasses = 'bg-white/40 text-slate-500 border-2 border-transparent'; // pending
          if (step > num) statusClasses = 'bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white border-2 border-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'; // done
          if (step === num) statusClasses = 'bg-white text-[#9333ea] border-2 border-[#c084fc] shadow-[0_0_15px_rgba(255,255,255,0.8)]'; // active

          return (
            <div key={num} className="flex flex-col items-center gap-2">
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-black transition-all duration-300 ${statusClasses}`}>
                {step > num ? <Ic n="check" size={16} color="#fff" /> : num}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 px-1">
        <span className={`text-[11px] font-black ${step >= 1 ? 'text-[#9333ea] drop-shadow-sm' : 'text-slate-500/60'}`}>選擇時間</span>
        <span className={`text-[11px] font-black ${step >= 2 ? 'text-[#9333ea] drop-shadow-sm' : 'text-slate-500/60'}`}>填寫資料</span>
        <span className={`text-[11px] font-black ${step >= 3 ? 'text-[#9333ea] drop-shadow-sm' : 'text-slate-500/60'}`}>確認預約</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] font-sans pb-10 relative overflow-hidden flex flex-col">
      {/* Background orbs (unified with the rest of the app) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-[#e0e7ff] rounded-full blur-[80px] pointer-events-none opacity-60 mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-[#f3e8ff] rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-multiply" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-[#dbeafe] rounded-full blur-[80px] pointer-events-none opacity-50 mix-blend-multiply" />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity:0, y:20, x:'-50%' }} animate={{ opacity:1, y:0, x:'-50%' }} exit={{ opacity:0, y:20, x:'-50%' }}
            className="fixed bottom-8 left-1/2 bg-[#ef4444] text-white px-5 py-3 rounded-[16px] shadow-[0_10px_20px_rgba(239,68,68,0.3)] text-[14px] font-bold whitespace-nowrap z-50">
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative pt-6 px-5 pb-6 shrink-0">
        <div className="flex items-center justify-between mb-4 relative z-10">
           <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[14px] w-10 h-10 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
             <Ic n="back" color="#7e22ce" size={20} />
           </button>
           <div className="text-[11px] font-black text-[#9333ea] tracking-[0.15em] bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white uppercase drop-shadow-sm">
             OO SAY MONEY
           </div>
           <div className="w-10 h-10" />
        </div>
        
        <div className="text-center relative z-10 pt-2 pb-4">
          <h1 className="text-[28px] font-black text-slate-800 tracking-tight mb-2">預約免費諮詢</h1>
          <p className="text-[14px] text-slate-500 font-semibold">專屬財務顧問 · 為您量身打造規劃</p>
        </div>
        
        {step < 4 && renderStepIndicator()}
      </div>

      {/* Forms Area / Steps Viewer */}
      <div className="px-5 relative z-20 flex-1 flex flex-col pt-2">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              
              <div className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
                <div className="text-[17px] font-black text-slate-800 mb-6 tracking-wide flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-[#f3e8ff] flex items-center justify-center text-[16px] shadow-inner text-[#9333ea]">📅</div>
                  選擇日期
                </div>
                
                <div className="flex justify-between items-center mb-6 bg-white/80 rounded-[16px] p-2 border border-white shadow-sm">
                  <button disabled={prevDisabled} onClick={() => changeMonth(-1)} className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white border border-slate-100 shadow-sm text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all outline-none">
                     <Ic n="back" size={16} />
                  </button>
                  <div className="font-black text-[16px] text-slate-800 tracking-wide">{calYear} 年 {calMonth + 1} 月</div>
                  <button disabled={nextDisabled} onClick={() => changeMonth(1)} className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white border border-slate-100 shadow-sm text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all outline-none">
                     <Ic n="arrowRight" size={16} />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map((d, i) => (
                      <div key={d} className={`text-[13px] font-black py-1 tracking-wide ${i === 0 ? 'text-[#ef4444]' : i === 6 ? 'text-[#3b82f6]' : 'text-slate-400'}`}>{d}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {[...Array(firstDayOfWeek)].map((_, i) => <div key={`empty-${i}`} />)}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const dateObj = new Date(calYear, calMonth, d);
                    const isPast = dateObj < today || dateObj > maxDate;
                    const wd = dateObj.getDay();
                    const isToday = dateObj.toDateString() === today.toDateString();
                    const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                    
                    let classes = "aspect-square flex flex-col items-center justify-center rounded-[14px] text-[15px] transition-all cursor-pointer border-2 border-transparent ";
                    if (isPast) {
                      classes += "text-slate-300 pointer-events-none font-semibold";
                    } else if (isSelected) {
                      classes += "bg-gradient-to-br from-[#c084fc] to-[#a855f7] text-white font-black shadow-[0_4px_15px_rgba(168,85,247,0.4)] scale-105 border-white";
                    } else if (isToday) {
                      classes += "bg-[#f3e8ff] font-black text-[#9333ea] border-white shadow-sm";
                    } else {
                      classes += `bg-white/40 hover:bg-white hover:border-white hover:shadow-sm font-bold border border-transparent ${wd === 0 ? 'text-[#ef4444]' : wd === 6 ? 'text-[#3b82f6]' : 'text-slate-700'}`;
                    }

                    return (
                      <div key={d} onClick={!isPast ? () => { setSelectedDate(dateObj); setSelectedSlot(null); } : undefined} className={classes}>
                        <div className="leading-none">{d}</div>
                        {(isToday || isSelected) && <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shadow-sm ${isSelected ? 'bg-white' : 'bg-[#9333ea]'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
                  <div className="text-[17px] font-black text-slate-800 mb-5 tracking-wide flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[10px] bg-[#ede9fe] flex items-center justify-center text-[16px] shadow-inner text-[#8b5cf6]">🕐</div>
                    {selectedDate.getMonth() + 1}/{selectedDate.getDate()} 時段
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SLOTS_LIST.map((slot, i) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <div key={i} onClick={() => setSelectedSlot(slot.time)}
                          className={`rounded-[16px] border-2 p-4 text-center cursor-pointer transition-all active:scale-[0.98] shadow-sm ${slot.isOther ? 'col-span-2' : ''} 
                            ${isSelected ? 'bg-gradient-to-br from-[#c084fc] to-[#a855f7] border-white text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)] transform scale-[1.02]' : 'bg-white/80 border-transparent text-slate-700 hover:bg-white hover:border-[#d8b4fe]' }
                          `}
                        >
                          <div className={`text-[15px] font-black tracking-wide mb-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>{slot.time}</div>
                          <div className={`text-[12px] font-bold ${isSelected ? 'text-[#ede9fe]' : 'text-slate-500'}`}>{slot.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <button disabled={!selectedDate || !selectedSlot} onClick={goStep2} className="w-full bg-gradient-to-r from-[#a855f7] to-[#9333ea] text-white rounded-[20px] py-4.5 text-[16px] font-black shadow-[0_8px_25px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2 mt-4 cursor-pointer border-0">
                下一步：填寫資料 <Ic n="arrowRight" size={18} color="currentColor" />
              </button>

            </motion.div>
          )}

          {/* STEP 2: FORM */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              
              <div className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
                <div className="text-[17px] font-black text-slate-800 mb-6 tracking-wide flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-[#f0f9ff] flex items-center justify-center text-[16px] shadow-inner text-[#0ea5e9]">📝</div>
                  填寫聯絡資料
                </div>
                
                <div className="bg-white/80 border border-white rounded-[20px] p-4 flex items-center gap-4 mb-6 shadow-sm">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white flex items-center justify-center font-black text-[20px] shrink-0 shadow-inner">
                    {profile.name === '載入中…' ? <Ic n="user" size={20} color="currentColor" /> : profile.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[16px] font-black text-slate-800 tracking-wide">{profile.name}</div>
                    <div className="text-[12px] text-[#3b82f6] font-bold mt-1 bg-[#eff6ff] px-2 py-0.5 rounded-md inline-block shadow-sm">✓ 已綁定 LINE 帳號</div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[14px] font-black text-slate-700 mb-3 ml-1 tracking-wide">聯絡手機 <span className="text-[#ef4444]">*</span></label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xxxxxxxx" maxLength={10}
                    className="w-full bg-white/80 border-2 border-white rounded-[16px] px-5 py-4 text-[16px] font-bold text-slate-800 outline-none focus:border-[#c084fc] focus:bg-white shadow-sm transition-all placeholder:font-semibold placeholder:text-slate-400" />
                </div>

                <div className="mb-6">
                  <label className="block text-[14px] font-black text-slate-700 mb-3 ml-1 tracking-wide">想討論的主題 <span className="font-semibold text-slate-400 text-[12px]">（可複選）</span></label>
                  <div className="flex flex-wrap gap-2.5">
                    {TOPICS_LIST.map(t => {
                      const active = topics.includes(t);
                      return (
                        <div key={t} onClick={() => toggleTopic(t)} className={`px-4 py-3 rounded-[14px] border-2 text-[14px] font-bold cursor-pointer transition-all select-none shadow-sm
                          ${active ? 'bg-gradient-to-br from-[#c084fc] to-[#a855f7] border-white text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)] transform scale-[1.02]' : 'bg-white/80 border-transparent text-slate-600 hover:border-[#d8b4fe] hover:bg-white'}
                        `}>
                          {t}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-black text-slate-700 mb-3 ml-1 tracking-wide">備註與補充</label>
                  <textarea ref={noteRef} value={note} onChange={e=>setNote(e.target.value)} placeholder="例如：想了解未來退休金準備… 若是其他時段，請告知方便接聽時間。"
                    className="w-full bg-white/80 border-2 border-white rounded-[16px] px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none focus:border-[#c084fc] focus:bg-white shadow-sm transition-all placeholder:text-slate-400 min-h-[100px] resize-none leading-relaxed" />
                </div>

              </div>

              <div className="flex flex-col gap-3">
                 <button onClick={goStep3} className="w-full bg-gradient-to-r from-[#a855f7] to-[#9333ea] text-white rounded-[20px] py-4.5 text-[16px] font-black shadow-[0_8px_25px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] border-0 cursor-pointer">
                   確認資料，下一步 →
                 </button>
                 <button onClick={() => setStep(1)} className="w-full bg-white/60 backdrop-blur-sm text-[#7e22ce] border border-white shadow-sm rounded-[20px] py-4 text-[14.5px] font-black transition-all hover:bg-white active:scale-[0.98] cursor-pointer">
                   ← 回上一步修改時間
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              
              <div className="bg-white/60 backdrop-blur-md rounded-[28px] p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white">
                <div className="text-[17px] font-black text-slate-800 mb-5 tracking-wide flex items-center gap-2 border-b border-white pb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-[#dcfce7] flex items-center justify-center text-[16px] shadow-inner text-[#16a34a]">✅</div>
                  確認預約資訊
                </div>

                <div className="bg-white/80 rounded-[20px] p-5 flex flex-col gap-4 border border-white shadow-sm mb-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-slate-500 shrink-0">預約日期</span>
                    <span className="text-[15px] font-black text-slate-800 text-right">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-slate-500 shrink-0">預約時段</span>
                    <span className="text-[15px] font-black text-[#9333ea] text-right bg-[#f3e8ff] px-3 py-1.5 rounded-lg border border-white shadow-sm">{selectedSlot}</span>
                  </div>
                  <div className="h-px bg-slate-200/50 my-1" />
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-slate-500 shrink-0">申請人</span>
                    <span className="text-[15px] font-black text-slate-800 text-right">{profile.name}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-slate-500 shrink-0">聯絡手機</span>
                    <span className="text-[15px] font-black text-slate-800 text-right tracking-wider">{phone}</span>
                  </div>
                  {topics.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-[14px] font-bold text-slate-500 shrink-0">討論主題</span>
                      <span className="text-[14px] font-black text-slate-700 text-right leading-relaxed">{topics.join('、')}</span>
                    </div>
                  )}
                  {note && (
                    <div className="flex justify-between items-start">
                      <span className="text-[14px] font-bold text-slate-500 shrink-0 mr-4">備註</span>
                      <span className="text-[14px] font-semibold text-slate-600 text-right leading-relaxed max-w-[200px] break-words bg-[#f8fafc] p-3 rounded-xl border border-white shadow-sm">{note}</span>
                    </div>
                  )}
                </div>

                <div className="text-[13px] font-bold text-slate-500 leading-relaxed bg-[#f8fafc]/80 p-4 rounded-[16px] border border-white text-center shadow-inner">
                  送出後，系統將自動推播預約摘要至您的 LINE，<br/>顧問會盡快與您確認。
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button disabled={isSubmitting} onClick={submitBooking} className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-[20px] py-4.5 text-[16px] font-black shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 border-0 cursor-pointer">
                   {isSubmitting ? <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> : null}
                   {isSubmitting ? '處理中...' : '確認無誤，送出預約'}
                 </button>
                 <button disabled={isSubmitting} onClick={() => setStep(2)} className="w-full bg-white/60 backdrop-blur-sm text-[#7e22ce] border border-white shadow-sm rounded-[20px] py-4 text-[14.5px] font-black transition-all hover:bg-white active:scale-[0.98] cursor-pointer disabled:opacity-50">
                   ← 返回修改
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}>
              <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#dcfce7] rounded-full blur-[40px] pointer-events-none opacity-80" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#e0e7ff] rounded-full blur-[30px] pointer-events-none opacity-80" />
                
                <div className="w-[88px] h-[88px] bg-gradient-to-br from-[#10b981] to-[#059669] rounded-[24px] mx-auto flex items-center justify-center mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.3)] relative z-10 border-4 border-white transform rotate-3">
                  <Ic n="check" size={40} color="#fff" />
                </div>
                <h2 className="text-[26px] font-black mb-3 tracking-tight text-slate-800 relative z-10">預約申請成功！</h2>
                <div className="text-[15px] font-semibold text-slate-500 leading-relaxed mb-8 relative z-10">
                  <strong className="text-[#10b981] font-black">{profile.name}</strong>，感謝您的預約<br/>預約摘要已傳送到您的 LINE 聊天室<br/>顧問將盡快與您聯繫。
                </div>

                <div className="bg-white/90 rounded-[20px] p-5 text-left flex flex-col gap-3 relative z-10 shadow-sm border border-white">
                  <div className="text-[14px] flex justify-between items-center bg-[#f8fafc] p-3 rounded-xl border border-white shadow-sm">
                    <span className="font-bold text-slate-500">LINE 名稱</span><span className="font-black text-slate-800">{profile.name}</span>
                  </div>
                  <div className="text-[14px] flex justify-between items-center bg-[#f8fafc] p-3 rounded-xl border border-white shadow-sm">
                    <span className="font-bold text-slate-500">預約日期</span><span className="font-black text-slate-800">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="text-[14px] flex justify-between items-center bg-[#f8fafc] p-2 rounded-xl border border-white shadow-sm pl-3">
                     <span className="font-bold text-slate-500">預約時段</span><span className="font-black text-[#10b981] bg-[#dcfce7] px-3 py-1.5 rounded-lg border border-white">{selectedSlot}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={resetAll} className="w-full bg-white/80 backdrop-blur-md text-[#9333ea] rounded-[20px] py-4.5 text-[16px] font-black shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-white transition-all hover:scale-[1.02] hover:bg-white active:scale-95 cursor-pointer">
                完成並回到首頁
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};