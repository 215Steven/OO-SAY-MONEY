import { useState, useRef } from "react";
import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useLiff } from "@/src/hooks/useLiff";

// ── 設定區（部署前填入）──────────────────────────────
const TG_BOT_TOKEN  = import.meta.env.VITE_TG_BOT_TOKEN  ?? "";
const TG_CHAT_ID    = import.meta.env.VITE_TG_CHAT_ID    ?? "";
const MAKE_WEBHOOK  = import.meta.env.VITE_MAKE_WEBHOOK  ?? "";
// ────────────────────────────────────────────────────

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
  // --- LIFF Profile ---
  const { profile: liffProfile, loading: liffLoading } = useLiff();

  // --- States ---
  const [step, setStep] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

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

  const displayName = liffProfile?.displayName ?? (liffLoading ? '載入中…' : '訪客');

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
    if (isSubmitting) return;       // 防重複送出
    setIsSubmitting(true);

    const payload = {
      line_name:   displayName,
      line_userid: liffProfile?.userId ?? "unknown",
      phone,
      date:        selectedDate?.toISOString() ?? "",
      slot:        selectedSlot ?? "",
      topics,
      note,
      status:      "待確認",
    };

    try {
      // ① Telegram 通知
      if (TG_BOT_TOKEN && TG_CHAT_ID) {
        const tgText =
          `📅 新預約申請\n👤 ${payload.line_name}\n📱 ${payload.phone}\n` +
          `🗓 ${formatDate(selectedDate!)} ${payload.slot}\n` +
          `📌 主題：${topics.join("、") || "未選擇"}\n` +
          `📝 備註：${note || "無"}`;
        await fetch(
          `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: tgText }),
          }
        ).catch(() => {}); // TG 失敗不中斷主流程
      }

      // ② Make.com → Notion
      if (MAKE_WEBHOOK) {
        await fetch(MAKE_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      // ③ LINE sendMessages（若在 LINE 環境內）
      const liff = (window as any).liff;
      if (liff?.isInClient?.()) {
        await liff.sendMessages([{
          type: "text",
          text:
            `✅ 預約申請已送出！\n` +
            `日期：${formatDate(selectedDate!)} ${payload.slot}\n` +
            `顧問將盡快與您確認，感謝！`,
        }]).catch(() => {});
      }

      setStep(4);
    } catch (err) {
      console.error("submitBooking error:", err);
      showToast("送出失敗，請稍後再試");
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
    <div className="pt-4 pb-2 px-5 max-w-sm mx-auto">
      <div className="flex items-center justify-between relative z-10 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:w-full before:h-0.5 before:bg-indigo-900/40 before:-z-10">
        {[1, 2, 3].map((num) => {
          let statusClasses = 'bg-indigo-900/60 text-indigo-300 border-2 border-indigo-900/40'; // pending
          if (step > num) statusClasses = 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-md shadow-emerald-500/20'; // done
          if (step === num) statusClasses = 'bg-indigo-500 text-white border-2 border-indigo-400 shadow-lg shadow-indigo-500/30'; // active

          return (
            <div key={num} className="flex flex-col items-center gap-2">
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-extrabold transition-all duration-300 ${statusClasses}`}>
                {step > num ? <Ic n="check" size={14} color="#fff" /> : num}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className={`text-[10px] font-bold ${step >= 1 ? 'text-indigo-200' : 'text-indigo-400/50'}`}>選擇時間</span>
        <span className={`text-[10px] font-bold ${step >= 2 ? 'text-indigo-200' : 'text-indigo-400/50'}`}>填寫資料</span>
        <span className={`text-[10px] font-bold ${step >= 3 ? 'text-indigo-200' : 'text-indigo-400/50'}`}>確認預約</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-10 relative">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity:0, y:20, x:'-50%' }} animate={{ opacity:1, y:0, x:'-50%' }} exit={{ opacity:0, y:20, x:'-50%' }}
            className="fixed bottom-8 left-1/2 bg-red-500 text-white px-5 py-3 rounded-[14px] shadow-xl text-[14px] font-bold whitespace-nowrap z-50">
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 px-5 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <button onClick={onBack} className="bg-white/10 rounded-full w-8 h-8 flex items-center justify-center border-0 cursor-pointer transition-opacity hover:bg-white/20 active:scale-95">
            <Ic n="back" color="#fff" size={18} />
          </button>
          <div className="text-[12px] font-bold text-indigo-300 tracking-[0.1em] uppercase">OO SAY MONEY</div>
          <div className="w-8" />
        </div>
        
        <div className="text-center relative z-10 pt-2 pb-6 border-b border-indigo-500/20">
          <h1 className="text-[24px] font-extrabold text-white tracking-[-0.02em] mb-1">預約免費諮詢</h1>
          <p className="text-[13px] text-indigo-200/80 font-medium">專屬財務顧問 · 為您量身打造規劃</p>
        </div>
        
        {step < 4 && renderStepIndicator()}
      </div>

      {/* Forms Area / Steps Viewer */}
      <div className="px-4 -mt-8 relative z-20">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              
              <div className="bg-white rounded-[24px] p-5 mb-4 shadow-lg shadow-slate-200/50 border border-slate-100/80">
                <div className="text-[16px] font-extrabold text-slate-900 mb-4 tracking-[-0.02em] flex items-center gap-2">
                  <span className="text-[18px]">📅</span> 選擇日期
                </div>
                
                <div className="flex justify-between items-center mb-4 bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                  <button disabled={prevDisabled} onClick={() => changeMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all text-[18px] leading-none">‹</button>
                  <div className="font-extrabold text-[15px] text-slate-900">{calYear} 年 {calMonth + 1} 月</div>
                  <button disabled={nextDisabled} onClick={() => changeMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all text-[18px] leading-none">›</button>
                </div>

                <div className="text-center mb-2">
                  <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((d, i) => (
                      <div key={d} className={`text-[12px] font-extrabold py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-400'}`}>{d}</div>
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
                    
                    let classes = "aspect-square flex flex-col items-center justify-center rounded-[12px] text-[14px] transition-all cursor-pointer border-2 border-transparent ";
                    if (isPast) {
                      classes += "text-slate-300 pointer-events-none font-medium";
                    } else if (isSelected) {
                      classes += "bg-indigo-900 text-white font-extrabold shadow-md shadow-indigo-900/30 ring-2 ring-indigo-900 ring-offset-1 scale-105";
                    } else if (isToday) {
                      classes += "bg-indigo-50 font-extrabold text-indigo-900 hover:border-indigo-200";
                    } else {
                      classes += `hover:bg-slate-50 hover:border-slate-200 font-bold ${wd === 0 ? 'text-red-500' : wd === 6 ? 'text-blue-600' : 'text-slate-700'}`;
                    }

                    return (
                      <div key={d} onClick={!isPast ? () => { setSelectedDate(dateObj); setSelectedSlot(null); } : undefined} className={classes}>
                        <div className="leading-none">{d}</div>
                        {(isToday || isSelected) && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-amber-400' : 'bg-indigo-400'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="bg-white rounded-[24px] p-5 mb-4 shadow-lg shadow-slate-200/50 border border-slate-100/80 overflow-hidden">
                  <div className="text-[16px] font-extrabold text-slate-900 mb-4 tracking-[-0.02em] flex items-center gap-2">
                    <span className="text-[18px]">🕐</span> {selectedDate.getMonth() + 1}/{selectedDate.getDate()} 時段
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SLOTS_LIST.map((slot, i) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <div key={i} onClick={() => setSelectedSlot(slot.time)}
                          className={`rounded-xl border-2 p-3 text-center cursor-pointer transition-all active:scale-[0.98] ${slot.isOther ? 'col-span-2' : ''} 
                            ${isSelected ? 'bg-indigo-900 border-indigo-900 text-white shadow-md shadow-indigo-900/20' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50' }
                          `}
                        >
                          <div className={`text-[14px] font-extrabold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{slot.time}</div>
                          <div className={`text-[11px] font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{slot.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <button disabled={!selectedDate || !selectedSlot} onClick={goStep2} className="w-full bg-indigo-600 text-white rounded-[16px] py-4 text-[15px] font-extrabold shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2">
                下一步：填寫資料 <Ic n="arrowRight" size={16} color="#fff" />
              </button>

            </motion.div>
          )}

          {/* STEP 2: FORM */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              
              <div className="bg-white rounded-[24px] p-5 mb-4 shadow-lg shadow-slate-200/50 border border-slate-100/80">
                <div className="text-[16px] font-extrabold text-slate-900 mb-5 tracking-[-0.02em] flex items-center gap-2">
                  <span className="text-[18px]">📝</span> 填寫聯絡資料
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-[16px] shrink-0">
                    {displayName === '載入中…' ? <Ic n="trend" size={16} /> : displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-emerald-800">{displayName}</div>
                    <div className="text-[11px] text-emerald-600/80 font-bold mt-0.5">已綁定 LINE 帳號</div>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-extrabold text-slate-700 mb-2">聯絡手機 <span className="text-red-500">*</span></label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xxxxxxxx" maxLength={10}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-[15px] font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:font-medium placeholder:text-slate-400" />
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-extrabold text-slate-700 mb-2">想討論的主題 <span className="font-medium text-slate-400">（可複選）</span></label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS_LIST.map(t => {
                      const active = topics.includes(t);
                      return (
                        <div key={t} onClick={() => toggleTopic(t)} className={`px-3.5 py-2.5 rounded-xl border-2 text-[13px] font-bold cursor-pointer transition-all select-none
                          ${active ? 'bg-indigo-900 border-indigo-900 text-white shadow-md shadow-indigo-900/20' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50 hover:text-slate-700'}
                        `}>
                          {t}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-extrabold text-slate-700 mb-2">備註與補充</label>
                  <textarea ref={noteRef} value={note} onChange={e=>setNote(e.target.value)} placeholder="例如：目前30歲，想了解未來退休金準備… 如果是其他時段，請告知方便接聽的時段。"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 min-h-[90px] resize-none" />
                </div>

              </div>

              <button onClick={goStep3} className="w-full bg-indigo-600 text-white rounded-[16px] py-4 text-[15px] font-extrabold shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] mb-3">
                確認資料，下一步 →
              </button>
              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-600 border border-slate-200 rounded-[16px] py-4 text-[14px] font-extrabold transition-all hover:bg-slate-50 active:scale-[0.98]">
                ← 回上一步修改時間
              </button>
            </motion.div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              
              <div className="bg-white rounded-[24px] p-5 mb-4 shadow-lg shadow-slate-200/50 border border-slate-100/80">
                <div className="text-[16px] font-extrabold text-slate-900 mb-5 tracking-[-0.02em] flex items-center gap-2 border-b border-slate-100 pb-4">
                  <span className="text-[18px]">✅</span> 確認預約資訊
                </div>

                <div className="bg-indigo-50/50 rounded-[16px] p-4 flex flex-col gap-3.5 border border-indigo-100/50 mb-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-slate-500 shrink-0">預約日期</span>
                    <span className="text-[14px] font-extrabold text-slate-900 text-right">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-slate-500 shrink-0">預約時段</span>
                    <span className="text-[14px] font-extrabold text-indigo-700 text-right">{selectedSlot}</span>
                  </div>
                  <div className="h-px bg-slate-200/60 my-0.5" />
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-slate-500 shrink-0">申請人</span>
                    <span className="text-[14px] font-extrabold text-slate-900 text-right">{displayName}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-slate-500 shrink-0">聯絡手機</span>
                    <span className="text-[14px] font-extrabold text-slate-900 text-right">{phone}</span>
                  </div>
                  {topics.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-[13px] font-bold text-slate-500 shrink-0">討論主題</span>
                      <span className="text-[13px] font-bold text-slate-700 text-right leading-relaxed">{topics.join('、')}</span>
                    </div>
                  )}
                  {note && (
                    <div className="flex justify-between items-start">
                      <span className="text-[13px] font-bold text-slate-500 shrink-0 mr-4">備註</span>
                      <span className="text-[13px] font-medium text-slate-600 text-right leading-relaxed max-w-[200px] break-words">{note}</span>
                    </div>
                  )}
                </div>

                <div className="text-[12px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  送出後，系統將自動推播預約摘要至您的 LINE，顧問會盡快與您確認。
                </div>
              </div>

              <button disabled={isSubmitting} onClick={submitBooking} className="w-full bg-slate-900 text-white rounded-[16px] py-4 text-[15px] font-extrabold shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mb-3">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : null}
                {isSubmitting ? '處理中...' : '確認無誤，送出預約'}
              </button>
              <button disabled={isSubmitting} onClick={() => setStep(2)} className="w-full bg-white text-slate-600 border border-slate-200 rounded-[16px] py-4 text-[14px] font-extrabold transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50">
                ← 返回修改
              </button>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: "spring" }}>
              <div className="bg-white rounded-[24px] p-6 text-center shadow-xl shadow-slate-200/50 border border-slate-100 text-slate-900 relative overflow-hidden mb-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl pointer-events-none" />
                <div className="w-[72px] h-[72px] bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 relative z-10">
                  <Ic n="check" size={32} color="#fff" />
                </div>
                <h2 className="text-[22px] font-extrabold mb-2 tracking-[-0.02em] relative z-10">預約申請已送出！</h2>
                <div className="text-[14px] font-medium text-slate-500 leading-relaxed mb-6">
                  <strong className="text-emerald-700">{displayName}</strong>，感謝您的預約！<br/>預約摘要已傳送到您的 LINE 聊天室<br/>顧問將盡快與您確認通知。
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-[16px] p-4 text-left flex flex-col gap-2 relative z-10">
                  <div className="text-[13px] flex justify-between">
                    <span className="font-bold text-emerald-800/60">LINE 名稱</span><span className="font-extrabold text-emerald-900">{displayName}</span>
                  </div>
                  <div className="text-[13px] flex justify-between">
                    <span className="font-bold text-emerald-800/60">預約日期</span><span className="font-extrabold text-emerald-900">{selectedDate ? formatDate(selectedDate) : ''}</span>
                  </div>
                  <div className="text-[13px] flex justify-between">
                     <span className="font-bold text-emerald-800/60">預約時段</span><span className="font-extrabold text-emerald-900">{selectedSlot}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={resetAll} className="w-full bg-slate-900 text-white rounded-[16px] py-4 text-[15px] font-extrabold shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-[0.98]">
                回到第一步重新預約
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
