import { useState, useEffect, useRef } from "react";
import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import liff from '@line/liff';

// --- Constants ---
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const TOPICS_LIST = ["🏥 醫療保險", "📈 投資規劃", "📋 理賠服務", "🔄 保險變更", "🚗 汽機車險", "✈️ 旅遊保險"];
const SLOTS_LIST = [
  { time: "10:30 - 11:30", label: "上午場" },
  { time: "12:00 - 13:30", label: "午間場" },
  { time: "14:00 - 15:30", label: "下午場" },
  { time: "19:00 - 20:30", label: "晚間場" },
  { time: "🤝 其他時段", label: "請在備註說明方便時間", isOther: true }
];

export const AppointmentPage = ({ onBack }: { onBack: () => void }) => {
  // --- States ---
  const [step, setStep] = useState(1);
  const [toastMsg, setToastMsg] = useState('');
  
  // Profile (mock LIFF)
  const [profile, setProfile] = useState({ name: '載入中…', avatar: null });
  const [lineUserId, setLineUserId] = useState('');

  // Init LIFF and get real userId
  useEffect(() => {
    const initLiff = async () => {
      try {
        const getLiffId = () => {
          const savedLiffId = sessionStorage.getItem('currentLiffId');
          if (savedLiffId) return savedLiffId;

          const path = window.location.pathname;
          let matchedId = "2007659354-RMhoJzrA";
          if (path.includes('/story') || path.includes('/about-us')) matchedId = '2007659354-YydM9mE0';
          else if (path.includes('/quiz')) matchedId = '2007659354-EofSbRGu';
          else if (path.includes('/unlock')) matchedId = '2007659354-ktfXFigk';
          else if (path.includes('/appointment')) matchedId = '2007659354-okKabZ27';
          
          sessionStorage.setItem('currentLiffId', matchedId);
          return matchedId;
        };
        const liffId = getLiffId();
        if (!liffId) return;
        await liff.init({ liffId });
        if (liff.isLoggedIn()) {
          const p = await liff.getProfile();
          setLineUserId(p.userId || '');
          setProfile(prev => ({ ...prev, name: p.displayName || prev.name }));
        }
      } catch (e: any) {
        console.warn('LIFF init skipped:', e.message);
      }
    };
    initLiff();
  }, []);

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

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      const topicStr = Array.isArray(topics) ? topics.join(', ') : (topics || '一般諮詢');
      const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      await fetch('/.netlify/functions/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUserId,
          date: dateStr,
          timeSlot: selectedSlot || '',
          topic: topicStr,
          contactName: profile?.name || '',
          phone: phone || '',
          notes: note || ''
        })
      });
      setStep(4);
    } catch (e) {
      setToastMsg('預約失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center justify-between relative z-10 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:w-full before:h-px before:bg-warm-gray-200 before:-z-10">
        {[1, 2, 3].map((num) => {
          let statusClasses = 'bg-warm-gray-100 text-warm-gray-200 border border-warm-gray-200'; // pending
          if (step > num) statusClasses = 'bg-teal-base text-white border border-teal-base'; // done
          if (step === num) statusClasses = 'bg-white text-warm-gray-800 border border-teal-base'; // active

          return (
            <div key={num} className="flex flex-col items-center gap-2">
              <div className={`w-[28px] h-[28px] flex items-center justify-center text-[11px] font-medium transition-colors duration-300 rounded-full ${statusClasses}`}>
                {step > num ? <Ic n="check" size={14} color="#fff" /> : num}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 px-1">
        <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${step >= 1 ? 'text-warm-gray-800' : 'text-warm-gray-400'}`}>選擇時間</span>
        <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${step >= 2 ? 'text-warm-gray-800' : 'text-warm-gray-400'}`}>填寫資料</span>
        <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${step >= 3 ? 'text-warm-gray-800' : 'text-warm-gray-400'}`}>確認預約</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-gray-50 font-sans pb-10 relative overflow-hidden flex flex-col">

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity:0, y:20, x:'-50%' }} animate={{ opacity:1, y:0, x:'-50%' }} exit={{ opacity:0, y:20, x:'-50%' }}
            className="fixed bottom-8 left-1/2 bg-warm-gray-800 text-white px-5 py-3 text-[13px] font-medium tracking-wide whitespace-nowrap z-50 rounded-lg shadow-lg">
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative pt-12 px-6 pb-6 shrink-0 border-b border-warm-gray-200 bg-white">
        <div className="flex items-center justify-between mb-8 relative z-10 w-full max-w-sm mx-auto">
           <button onClick={onBack} className="bg-white border border-warm-gray-200 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-warm-gray-100 transition-colors rounded-full shadow-sm">
             <Ic n="back" color="var(--color-warm-gray-800)" size={20} />
           </button>
           <div className="text-[11px] font-medium text-warm-gray-800 tracking-[0.2em] uppercase px-3 py-1 text-center">
             OO SAY MONEY
           </div>
           <div className="w-10 h-10 shrink-0" />
        </div>
        
        <div className="text-center relative z-10 pt-2 pb-4 w-full max-w-sm mx-auto">
          <h1 className="text-[24px] font-serif font-bold text-warm-gray-800 tracking-wide mb-3">預約免費諮詢</h1>
          <p className="text-[12px] text-warm-gray-800/70 font-normal tracking-widest">專屬財務顧問 · 為您量身打造規劃</p>
        </div>
        
        {step < 4 && renderStepIndicator()}
      </div>

      {/* Forms Area / Steps Viewer */}
      <div className="px-5 relative z-20 flex-1 flex flex-col pt-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }}>
              
              <div className="bg-white p-6 mb-6 border border-warm-gray-200 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-8 tracking-wider flex items-center gap-3">
                  <div className="w-8 h-8 bg-warm-gray-100 flex items-center justify-center text-[14px] border border-warm-gray-200 rounded-full">📅</div>
                  選擇日期
                </div>
                
                <div className="flex justify-between items-center mb-8 border-b border-warm-gray-200 pb-4">
                  <button disabled={prevDisabled} onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full flex items-center justify-center border border-warm-gray-200 bg-white text-warm-gray-800 hover:bg-warm-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0">
                     <Ic n="back" size={14} />
                  </button>
                  <div className="font-serif font-bold text-[15px] text-warm-gray-800 tracking-wider">{calYear} 年 {calMonth + 1} 月</div>
                  <button disabled={nextDisabled} onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full flex items-center justify-center border border-warm-gray-200 bg-white text-warm-gray-800 hover:bg-warm-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0">
                     <Ic n="arrowRight" size={14} />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((d, i) => (
                      <div key={d} className={`text-[11px] font-medium py-2 tracking-widest ${i === 0 || i === 6 ? 'text-warm-gray-600' : 'text-warm-gray-800'}`}>{d}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(firstDayOfWeek)].map((_, i) => <div key={`empty-${i}`} />)}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const dateObj = new Date(calYear, calMonth, d);
                    const isPast = dateObj < today || dateObj > maxDate;
                    const wd = dateObj.getDay();
                    const isToday = dateObj.toDateString() === today.toDateString();
                    const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                    
                    let classes = "aspect-square flex flex-col items-center justify-center text-[13px] transition-colors cursor-pointer border border-transparent rounded-lg ";
                    
                    if (isPast) {
                      classes += "text-warm-gray-200 pointer-events-none font-normal";
                    } else if (isSelected) {
                      classes += "bg-teal-base text-white font-medium border-teal-base";
                    } else if (isToday) {
                      classes += "bg-cyan-soft font-medium text-warm-gray-800 border-cyan-soft";
                    } else {
                      classes += `bg-transparent hover:bg-warm-gray-50 hover:border-warm-gray-200 font-normal ${wd === 0 || wd === 6 ? 'text-warm-gray-800/80' : 'text-warm-gray-800'}`;
                    }

                    return (
                      <div key={d} onClick={!isPast ? () => { setSelectedDate(dateObj); setSelectedSlot(null); } : undefined} className={classes}>
                        <div className="leading-none">{d}</div>
                        {(isToday || isSelected) && <div className={`w-1 h-1 mt-1 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-base'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="bg-white p-6 mb-6 border border-warm-gray-200 overflow-hidden rounded-2xl shadow-sm">
                  <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-6 tracking-wide flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warm-gray-100 flex items-center justify-center text-[14px] border border-warm-gray-200">🕐</div>
                    {selectedDate.getMonth() + 1}/{selectedDate.getDate()} 時段
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SLOTS_LIST.map((slot, i) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <div key={i} onClick={() => setSelectedSlot(slot.time)}
                          className={`border p-4 text-center cursor-pointer transition-colors rounded-2xl ${slot.isOther ? 'col-span-2' : ''} 
                            ${isSelected ? 'bg-teal-base border-teal-base text-white' : 'bg-white border-warm-gray-200 text-warm-gray-800/80 hover:bg-warm-gray-50' }
                          `}
                        >
                          <div className={`text-[13px] font-medium tracking-widest mb-1.5 ${isSelected ? 'text-white' : 'text-warm-gray-800'}`}>{slot.time}</div>
                          <div className={`text-[11px] font-normal tracking-wide ${isSelected ? 'text-warm-gray-400' : 'text-warm-gray-600'}`}>{slot.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <button disabled={!selectedDate || !selectedSlot} onClick={goStep2} className="w-full rounded-2xl bg-teal-base text-white py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-cyan-base disabled:opacity-50 disabled:bg-warm-gray-400 flex items-center justify-center gap-2 mt-4 cursor-pointer border border-transparent shadow-md hover:shadow-lg">
                下一步：填寫資料 <Ic n="arrowRight" size={16} color="currentColor" />
              </button>

            </motion.div>
          )}

          {/* STEP 2: FORM */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }}>
              
              <div className="bg-white p-6 mb-6 border border-warm-gray-200 relative overflow-hidden rounded-2xl shadow-sm">
                <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-8 tracking-wider flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warm-gray-100 flex items-center justify-center text-[14px] border border-warm-gray-200">📝</div>
                  填寫聯絡資料
                </div>
                
                <div className="bg-warm-gray-50 border border-warm-gray-200 p-4 flex items-center gap-4 mb-8 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-teal-base text-white flex items-center justify-center font-serif font-bold text-[18px] shrink-0">
                    {profile.name === '載入中…' ? <Ic n="user" size={18} color="currentColor" /> : profile.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-warm-gray-800 tracking-wider">{profile.name}</div>
                    <div className="text-[11px] text-teal-base font-medium mt-1 tracking-widest uppercase">✓ 已綁定 LINE 帳號</div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[12px] font-medium text-warm-gray-800 mb-3 tracking-widest uppercase">聯絡手機 <span className="text-warm-gray-400">*</span></label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xxxxxxxx" maxLength={10}
                    className="w-full bg-white border-b border-warm-gray-200 px-2 py-3 text-[14px] font-medium text-warm-gray-800 outline-none focus:border-teal-base transition-colors placeholder:font-normal placeholder:text-warm-gray-200 tracking-wider" />
                </div>

                <div className="mb-8">
                  <label className="block text-[12px] font-medium text-warm-gray-800 mb-4 tracking-widest uppercase">想討論的主題 <span className="font-normal text-warm-gray-400 ml-2 tracking-wide text-[11px]">（可複選）</span></label>
                  <div className="flex flex-wrap gap-2.5">
                    {TOPICS_LIST.map(t => {
                      const active = topics.includes(t);
                      return (
                        <div key={t} onClick={() => toggleTopic(t)} className={`px-4 py-2 rounded-full text-[12px] font-medium cursor-pointer transition-colors select-none tracking-widest border
                          ${active ? 'bg-teal-base border-teal-base text-white shadow-md' : 'bg-white border-warm-gray-200 text-warm-gray-800/80 hover:bg-warm-gray-50 hover:shadow-sm'}
                        `}>
                          {t}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-warm-gray-800 mb-3 tracking-widest uppercase">備註與補充</label>
                  <textarea ref={noteRef} value={note} onChange={e=>setNote(e.target.value)} placeholder="例如：想了解未來退休金準備… 若是其他時段，請告知方便接聽時間。"
                    className="w-full rounded-2xl bg-white border border-warm-gray-200 p-4 text-[13px] font-normal text-warm-gray-800 outline-none focus:border-teal-base transition-colors placeholder:text-warm-gray-400 min-h-[120px] resize-none tracking-wide leading-loose shadow-sm" />
                </div>

              </div>

              <div className="flex flex-col gap-3">
                 <button onClick={goStep3} className="w-full rounded-2xl bg-teal-base text-white py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-cyan-base flex items-center justify-center gap-2 border border-transparent cursor-pointer shadow-md hover:shadow-lg">
                   確認資料，下一步 <Ic n="arrowRight" size={16} color="currentColor" />
                 </button>
                 <button onClick={() => setStep(1)} className="w-full bg-transparent text-warm-gray-400 py-3 text-[12px] font-normal tracking-widest uppercase transition-colors hover:text-warm-gray-800 cursor-pointer">
                   返回修改時間
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }}>
              
              <div className="bg-white p-6 mb-6 border border-warm-gray-200 rounded-2xl shadow-sm">
                <div className="text-[15px] font-serif font-bold text-warm-gray-800 mb-8 tracking-wider flex items-center gap-3 border-b border-warm-gray-200 pb-4">
                  <div className="w-8 h-8 rounded-full bg-warm-gray-50 flex items-center justify-center text-[14px] border border-warm-gray-200">✅</div>
                  確認預約資訊
                </div>

                <div className="bg-warm-gray-50 p-5 flex flex-col gap-5 border border-warm-gray-200 mb-8 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 tracking-widest uppercase">預約日期</span>
                    <span className="text-[13px] font-medium text-warm-gray-800 text-right tracking-wider">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 tracking-widest uppercase">預約時段</span>
                    <span className="text-[11px] font-medium text-warm-gray-800 text-right bg-warm-gray-100 rounded-md px-3 py-1 tracking-widest">{selectedSlot}</span>
                  </div>
                  <div className="h-px bg-warm-gray-200 my-1" />
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 tracking-widest uppercase">申請人</span>
                    <span className="text-[13px] font-medium text-warm-gray-800 text-right tracking-wider">{profile.name}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 tracking-widest uppercase">聯絡手機</span>
                    <span className="text-[13px] font-medium text-warm-gray-800 text-right tracking-wider">{phone}</span>
                  </div>
                  {topics.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 tracking-widest uppercase">討論主題</span>
                      <span className="text-[12px] font-normal text-warm-gray-800/80 text-right leading-loose tracking-wide">{topics.join('、')}</span>
                    </div>
                  )}
                  {note && (
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] font-normal text-warm-gray-600 shrink-0 mr-4 tracking-widest uppercase">備註</span>
                      <span className="text-[12px] font-normal text-warm-gray-800/80 text-right leading-loose tracking-wide max-w-[200px] break-words bg-white rounded-2xl shadow-sm p-3 border border-warm-gray-200 italic">{note}</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-normal text-warm-gray-600 leading-loose text-center tracking-widest border-t border-warm-gray-200 pt-6">
                  送出後，系統將自動推播預約摘要至您的 LINE，<br/>顧問會盡快與您確認。
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button disabled={isSubmitting} onClick={submitBooking} className="w-full rounded-2xl bg-teal-base text-white py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-cyan-base disabled:opacity-50 disabled:bg-warm-gray-400 flex items-center justify-center gap-2 border border-transparent cursor-pointer shadow-md hover:shadow-lg">
                   {isSubmitting ? <span className="w-4 h-4 border-[2px] border-white/30 border-t-white rounded-full animate-spin" /> : null}
                   {isSubmitting ? '處理中...' : '確認無誤，送出預約'}
                 </button>
                 <button disabled={isSubmitting} onClick={() => setStep(2)} className="w-full bg-transparent text-warm-gray-400 py-3 text-[12px] font-normal tracking-widest uppercase transition-colors hover:text-warm-gray-800 cursor-pointer disabled:opacity-50">
                   返回修改
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="bg-white p-10 text-center border border-warm-gray-200 relative overflow-hidden mb-6 rounded-2xl shadow-sm">
                
                <div className="w-20 h-20 rounded-full bg-warm-gray-100 mx-auto flex items-center justify-center mb-8 border border-warm-gray-200 text-teal-base">
                  <Ic n="check" size={32} color="currentColor" />
                </div>
                <h2 className="text-[20px] font-serif font-bold mb-4 tracking-widest text-warm-gray-800 relative z-10">預約申請成功</h2>
                <div className="text-[13px] font-normal text-warm-gray-800/80 leading-loose mb-10 relative z-10 tracking-wide">
                  <strong className="text-warm-gray-800 font-medium tracking-widest">{profile.name}</strong>，感謝您的預約<br/>預約摘要已傳送到您的 LINE 聊天室<br/>顧問將盡快與您聯繫。
                </div>

                <div className="bg-warm-gray-50 p-5 text-left flex flex-col gap-4 relative z-10 border border-warm-gray-200 rounded-2xl shadow-sm">
                  <div className="text-[13px] flex justify-between items-center border-b border-warm-gray-200 pb-3">
                    <span className="font-normal text-warm-gray-600 tracking-widest uppercase text-[11px]">LINE 名稱</span><span className="font-medium text-warm-gray-800 tracking-wider">{profile.name}</span>
                  </div>
                  <div className="text-[13px] flex justify-between items-center border-b border-warm-gray-200 pb-3">
                    <span className="font-normal text-warm-gray-600 tracking-widest uppercase text-[11px]">預約日期</span><span className="font-medium text-warm-gray-800 tracking-wider">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="text-[13px] flex justify-between items-center">
                     <span className="font-normal text-warm-gray-600 tracking-widest uppercase text-[11px]">預約時段</span><span className="font-medium text-warm-gray-800 tracking-widest bg-warm-gray-100 rounded-md px-2 py-0.5 text-[11px]">{selectedSlot}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={resetAll} className="w-full rounded-2xl bg-transparent border border-teal-base text-warm-gray-800 py-4 text-[13px] font-medium tracking-widest uppercase transition-colors hover:bg-teal-base hover:text-white hover:shadow-md cursor-pointer">
                回首頁
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
