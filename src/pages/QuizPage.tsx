import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";

const QUESTIONS = [
  {
    hint: '先從一個很生活的問題開始',
    q: '發薪水後，你第一件事是？',
    opts: [
      { text: '先轉固定金額到存款，剩的才花', type: 'plan' },
      { text: '先付帳單和固定支出，花錢很謹慎', type: 'guard' },
      { text: '想買什麼就買，剩的才想到存', type: 'enjoy' },
      { text: '很擔心不夠用，但不知道怎麼分配', type: 'anxiety' },
    ]
  },
  {
    hint: '這題很多人會卡住',
    q: '看到很想買的東西，你通常？',
    opts: [
      { text: '列進清單，確認預算夠再下手', type: 'plan' },
      { text: '猶豫很久，怕花錯錢或太衝動', type: 'guard' },
      { text: '喜歡就買，人生就是要享受', type: 'enjoy' },
      { text: '糾結好久，買了之後還是會後悔', type: 'anxiety' },
    ]
  },
  {
    hint: '回到理財本身',
    q: '你現在在理財上，比較接近哪一種狀態？',
    opts: [
      { text: '有在投資，想讓配置更穩定、更有效率', type: 'plan' },
      { text: '每個月有存，但不太敢投資，怕虧本', type: 'guard' },
      { text: '想開始，但生活比較忙，一直沒行動', type: 'enjoy' },
      { text: '有點焦慮，不知道自己到底差多少', type: 'anxiety' },
    ]
  },
  {
    hint: '這題不用完美回答',
    q: '上個月的錢花到哪去，你清楚嗎？',
    opts: [
      { text: '清楚，我有記帳或定期檢視', type: 'plan' },
      { text: '大概知道，我花錢向來很謹慎', type: 'guard' },
      { text: '不太清楚，反正花在值得的地方就好', type: 'enjoy' },
      { text: '不太清楚，有點擔心但沒認真追蹤', type: 'anxiety' },
    ]
  },
  {
    hint: '先不考慮現實限制',
    q: '如果理財只能達成一個目標，你最希望是？',
    opts: [
      { text: '每個月有穩定現金流進來，生活不擔心', type: 'guard' },
      { text: '有一套清楚策略，讓每一塊錢都有效率', type: 'plan' },
      { text: '早點財務自由，時間用在自己想做的事', type: 'enjoy' },
      { text: '先搞清楚自己目前差多少、從哪開始', type: 'anxiety' },
    ]
  },
  {
    hint: '這個場景應該不陌生',
    q: '朋友揪出遊，費用超出你的預算，你通常？',
    opts: [
      { text: '調整其他預算，這種體驗值得', type: 'enjoy' },
      { text: '先婉拒，或提議換個平價選擇', type: 'guard' },
      { text: '去，但回來後會重新檢視預算', type: 'plan' },
      { text: '糾結很久，去了也有點愧疚', type: 'anxiety' },
    ]
  },
  {
    hint: '如果有人幫你規劃',
    q: '你比較安心的方式是？',
    opts: [
      { text: '保守穩定，本金安全比什麼都重要', type: 'guard' },
      { text: '有策略地穩中帶成長，長期慢慢推進', type: 'plan' },
      { text: '可以接受波動，報酬率比較重要', type: 'enjoy' },
      { text: '先幫我看清楚現況和缺口，再一起決定', type: 'anxiety' },
    ]
  },
  {
    hint: '最後一題',
    q: '如果年終意外多了一個月薪水，你會？',
    opts: [
      { text: '按比例分配：儲蓄、投資、生活改善', type: 'plan' },
      { text: '全部存起來，多一點安全感', type: 'guard' },
      { text: '犒賞自己，買一直想要的東西', type: 'enjoy' },
      { text: '先放著不動，不確定怎麼用才對', type: 'anxiety' },
    ]
  },
];

const TYPES: Record<string, any> = {
  guard: {
    name: '穩健累積型', icon: 'shield', color: 'text-[#10b981]', bg: 'bg-[#dcfce7]', bar: 'bg-[#10b981]', border: 'border-white',
    tagline: '重視安全感，其實這是優勢',
    desc: '你重視本金安全，不喜歡不確定性。很多人以為這是缺點，但其實穩健才是長期走得下去的基礎。你缺的不是勇氣，是一個「夠穩、還能慢慢長大」的方式。',
    insight: '太保守的問題不是賺不到，而是錢一直在縮水。通貨膨脹每年吃掉 2%，存在帳戶裡的錢其實在虧損。找到一個「本金不減、還有配息」的設計，安全感和成長可以同時兼顧。',
    nextStep: '從「月配息」工具切入是最適合你的第一步。每個月有現金流進來，你看得見、摸得著，不需要冒險，安全感和收益可以一起有。',
    ctaNote: '為你介紹穩健累積型的現金流規劃，不賣不需要的冒險。',
    subDescs: {
      plan: '你想穩，但其實也不想太慢。你在等的是一個夠穩、又合理有效率的方式。',
      enjoy: '表面保守，但內心其實有進攻慾望，只是還沒找到足夠的安全感。',
      anxiety: '保守加上還沒找到方向，你需要的是一個清楚、可以馬上開始的起點。',
    },
  },
  enjoy: {
    name: '成長放大型', icon: 'trend', color: 'text-[#f59e0b]', bg: 'bg-[#fef3c7]', bar: 'bg-[#f59e0b]', border: 'border-white',
    tagline: '你有機會走得比別人快',
    desc: '你有行動力，不怕嘗試，也願意承擔一定風險。這是做財務規劃最好的性格之一。你需要的不是「被說服要開始」，而是一個方向清楚、有爆發力的配置方式。',
    insight: '進攻型的人最常見的問題是追高殺低，不是因為判斷差，而是缺一個系統。有策略的進攻，和衝動的進攻，結果差很多。風險控制做好，成長才會很明顯。',
    nextStep: '適合建立「成長配息雙軌」配置，一部分穩定產生現金流，一部分追求放大。讓你的進攻有底氣，不怕市場波動打亂節奏。',
    ctaNote: '我們可以設計一個有方向、有彈性、可以抓機會放大的個人規劃。',
    subDescs: {
      guard: '你想衝，但也知道不能亂衝。這種組合很好規劃，可以同時成長又不失控。',
      plan: '你不只是想賺，是想用對方法賺。有策略的進攻，效率差很多。',
      anxiety: '你有動力，但還缺一套方法。把方向確定，你的執行力才有地方放。',
    },
  },
  anxiety: {
    name: '起步探索型', icon: 'info', color: 'text-[#c084fc]', bg: 'bg-[#f3e8ff]', bar: 'bg-[#c084fc]', border: 'border-white',
    tagline: '你不是做不到，只是少了一個開始的方式',
    desc: '你知道應該要做，心裡也有一點焦慮，但一直找不到一個清楚的起點。這不是懶，也不是沒能力，是從來沒有人幫你把第一步講清楚。其實大多數人都在這個階段。',
    insight: '起步探索型的人，行動後改變往往是最大的。因為你在意，才會焦慮。在意的人，一旦方向清楚了，執行力反而很強。你只差一個「簡單可執行的第一步」。',
    nextStep: '先把「我每個月需要多少現金流」這個數字算出來，再往回推第一步怎麼做。把模糊的擔憂變成看得見的目標，就不會再拖了。',
    ctaNote: '陪你從零開始，把複雜的問題拆解成你可以馬上做的第一步。',
    subDescs: {
      guard: '你想穩定，但還不知道怎麼開始。從最低風險的第一步切入最適合你。',
      enjoy: '你想快，但還沒有方向。把目標先釐清，行動力自然就會出來。',
      plan: '你其實想得很清楚，只是一直沒有動。你需要的是有人幫你推第一步。',
    },
  },
  plan: {
    name: '策略進化型', icon: 'map', color: 'text-[#3b82f6]', bg: 'bg-[#dbeafe]', bar: 'bg-[#3b82f6]', border: 'border-white',
    tagline: '你已經在正確路上，差的是一個整合策略',
    desc: '你有清晰的財務意識，也有實際在執行記帳或投資。你不需要被說服要規劃，你需要的是讓現有的努力發揮最大效益的方式。',
    insight: '有在執行的人，最常見的問題不是努力不夠，而是策略有沒有放在最有效率的位置。同樣的資金，不同的配置方式，10 年後的結果可以差非常多。',
    nextStep: '適合做一次「策略校準」，把保障、現金流、成長三層放到最有效率的位置，讓你已有的執行力不只是在累積，而是每一塊錢都開始幫你工作。',
    ctaNote: '協助你檢視現有規劃，找出讓執行力更快轉換成現金流的最短路徑。',
    subDescs: {
      guard: '執行力強但偏保守，稍微調整配置比例，整體效率會差很多。',
      enjoy: '策略加上進攻慾，你可以做到的上限比現在高很多。',
      anxiety: '想得清楚但還沒整合。把現有行動收攏成一套策略，是你的下一步。',
    },
  },
};

export const QuizPage = ({ onBack, onComplete }: any) => {
  const [step, setStep] = useState(0); // 0: welcome, 1-8: questions, 9: loading, 10: result
  const [answers, setAnswers] = useState<string[]>([]);
  const [loadMsg, setLoadMsg] = useState(0);

  const MSGS = [
    { t: "正在分析您的財務性格…", s: "根據您的選擇，我們正在比對適合的方向" },
    { t: "準備專屬洞察", s: "屬於您的理財解析即將完成…" },
    { t: "即將揭曉！", s: "您的專屬財務圖譜" }
  ];

  // Auto-progress loading screen
  useEffect(() => {
    if (step === 9) {
      setLoadMsg(0);
      const timer = setInterval(() => {
        setLoadMsg(m => {
          if (m >= 2) {
            clearInterval(timer);
            setStep(10);
            return m;
          }
          return m + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleSelect = (idx: number, type: string) => {
    const newAns = [...answers];
    newAns[idx] = type;
    setAnswers(newAns);
    setTimeout(() => setStep(step + 1), 300);
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { guard: 0, enjoy: 0, anxiety: 0, plan: 0 };
    answers.forEach(t => { if (t) counts[t]++; });

    let sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
    const topScore = counts[sorted[0]];
    let winner = sorted[0];

    // Tie breaker
    if (counts[sorted[1]] === topScore) {
      const tieTypes = sorted.filter(k => counts[k] === topScore);
      const tbVotes: Record<string, number> = {};
      tieTypes.forEach(k => tbVotes[k] = 0);
      [answers[4], answers[6]].forEach(a => { if (a && tbVotes[a] !== undefined) tbVotes[a]++; });
      
      let best = -1;
      tieTypes.forEach(k => {
        if (tbVotes[k] > best) { best = tbVotes[k]; winner = k; }
      });
      sorted = [winner, ...sorted.filter(k => k !== winner)];
    }

    const subType = sorted.find(k => k !== winner && counts[k] > 0);
    
    return { winner, subType, counts };
  };

  const renderWelcome = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="p-6 relative z-10 flex flex-col items-center justify-center min-h-[100dvh]">
      <div className="absolute top-4 left-4 z-20">
        <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-12 h-12 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
          <Ic n="back" color="#9333ea" size={24} />
        </button>
      </div>

      <div className="w-[100px] h-[100px] bg-white/60 backdrop-blur-md rounded-[28px] flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(147,51,234,0.15)] border border-white mt-8 transform rotate-3">
        <Ic n="money" size={48} color="#9333ea" />
      </div>
      <h1 className="text-[36px] font-black text-slate-800 leading-tight mb-4 text-center tracking-tight">
        探索您的<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#c084fc] drop-shadow-sm">客製化理財性格</span>
      </h1>
      <div className="text-[15px] text-slate-500 font-bold leading-relaxed text-center mb-10 px-5 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm inline-block">
        每個人適合的節奏不同。<br/>透過 8 個簡單情境，快速看清你的財務輪廓。
      </div>

      <div className="flex flex-col gap-3 mb-10 w-full max-w-[340px]">
        <div className="bg-white/60 backdrop-blur-md border border-white px-5 py-4 rounded-[20px] font-black text-slate-700 flex items-center justify-center gap-2 shadow-sm">
          <div className="bg-[#f3e8ff] p-1.5 rounded-full"><Ic n="check" size={16} color="#9333ea" /></div> 約 90 秒完成
        </div>
        <div className="bg-white/60 backdrop-blur-md border border-white px-5 py-4 rounded-[20px] font-black text-slate-700 flex items-center justify-center gap-2 shadow-sm">
          <div className="bg-[#f3e8ff] p-1.5 rounded-full"><Ic n="shield" size={16} color="#9333ea" /></div> 結果皆為隱私，請安心填寫
        </div>
      </div>

      <div className="w-full max-w-[340px] pb-4">
        <button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-[#c084fc] to-[#9333ea] text-white rounded-[24px] py-4.5 text-[17px] font-black shadow-[0_8px_25px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2 cursor-pointer border-0">
          <Ic n="trend" size={20} color="currentColor" /> 開始測驗
        </button>
      </div>
    </motion.div>
  );

  const renderQuestion = () => {
    const qIdx = step - 1;
    const q = QUESTIONS[qIdx];
    return (
      <div className="flex-1 flex flex-col pt-10 px-5 relative z-10 pb-8 min-h-[100dvh]">
        
        <div className="flex justify-between items-center mb-8 relative z-20">
          <button onClick={onBack} className="bg-white/60 backdrop-blur-md border border-white rounded-[16px] w-10 h-10 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white active:scale-95">
            <Ic n="back" color="#9333ea" size={20} />
          </button>
          <div className="text-[13px] font-black text-[#9333ea] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white">
             第 {step} 題 <span className="opacity-50 font-bold">/ 8</span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < qIdx ? 'bg-[#c084fc]' : 'bg-white/50'} overflow-hidden relative shadow-inner`}>
              {i === qIdx && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-[#d8b4fe] shadow-[0_0_8px_rgba(216,180,254,0.8)]" />}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {q.hint && (
            <div className="text-[13px] font-black text-[#9333ea] mb-4 flex items-center justify-center gap-2 bg-[#fdf4ff]/80 backdrop-blur-md self-start px-4 py-2 rounded-full shadow-sm border border-[#f5d0fe]">
              <span className="w-2 h-2 bg-[#d946ef] rounded-full shadow-[0_0_5px_rgba(217,70,239,0.8)]" />{q.hint}
            </div>
          )}
          <h2 className="text-[28px] font-black text-slate-800 leading-[1.3] mb-8 tracking-tight">
            {q.q}
          </h2>

          <div className="flex flex-col gap-4 pb-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
                {q.opts.map((o, i) => {
                  const isSelected = answers[qIdx] === o.type;
                  return (
                    <button key={i} onClick={() => handleSelect(qIdx, o.type)}
                      className={`text-left px-6 py-5 rounded-[24px] transition-all duration-300 text-[16px] cursor-pointer font-sans shadow-[0_4px_15px_rgba(0,0,0,0.02)] border-2
                        ${isSelected ? 'border-[#c084fc] bg-[#faf5ff]/90 text-[#9333ea] font-black transform scale-[1.02] shadow-[0_8px_20px_rgba(192,132,252,0.15)]' : 'border-white bg-white/60 backdrop-blur-md text-slate-700 font-bold hover:border-[#e9d5ff] hover:bg-white'}
                      `}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[100dvh] relative z-10">
      <div className="relative mb-8">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-24 h-24 rounded-[32px] border-[6px] border-white/60 border-t-[#c084fc] shadow-[0_0_40px_rgba(192,132,252,0.3)] rotate-12" />
         <div className="absolute inset-0 flex items-center justify-center text-[#9333ea]">
            <Ic n="star" size={32} color="currentColor" />
         </div>
      </div>
      <motion.h2 key={"t"+loadMsg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[26px] font-black text-slate-800 mb-3 tracking-tight drop-shadow-sm">{MSGS[loadMsg].t}</motion.h2>
      <motion.p key={"s"+loadMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[16px] font-bold text-slate-500 bg-white/60 backdrop-blur-md px-5 py-2 rounded-2xl border border-white shadow-sm inline-block">{MSGS[loadMsg].s}</motion.p>
    </motion.div>
  );

  const renderResult = () => {
    const { winner, subType } = calculateResult();
    const main = TYPES[winner];
    const sub = subType ? TYPES[subType] : null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[100dvh] pb-10 relative z-10 flex flex-col items-center">
        <div className={`pt-10 px-5 text-center mb-6 w-full max-w-sm`}>
          <div className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-black tracking-widest mb-6 ${main.color} bg-white/60 backdrop-blur-md border border-white shadow-sm`}>
            <Ic n="trend" size={18} /> 您的財務性格
          </div>
          
          <div className={`w-[100px] h-[100px] rounded-[32px] mx-auto flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-md border border-white mb-6 ${main.color} transform rotate-3`}>
             <Ic n={main.icon} size={48} color="currentColor" />
          </div>
          
          <div className={`text-[36px] font-black tracking-tight mb-2 ${main.color} drop-shadow-sm`}>
            {main.name}
          </div>
          {sub && (
            <div className={`text-[15px] font-black text-slate-500 opacity-80 mb-4`}>
              ( 副標籤：{sub.name} )
            </div>
          )}
          <div className="text-[16px] font-bold text-slate-600 mb-6 bg-white/60 backdrop-blur-md border border-white px-5 py-2.5 rounded-[20px] shadow-sm inline-block">{main.tagline}</div>
          
          {sub && main.subDescs[subType!] && (
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-[24px] p-5 mx-auto text-[15px] text-slate-600 text-left font-semibold leading-relaxed shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              {main.subDescs[subType!]}
            </div>
          )}
        </div>

        <div className="px-5 flex flex-col gap-4 w-full max-w-sm">
          <div className={`bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white`}>
            <div className={`text-[14px] font-black tracking-widest mb-4 flex items-center gap-2 ${main.color}`}>
              <span className={`w-2 h-2 rounded-full shadow-sm ${main.bar}`} /> 您是這樣的人
            </div>
            <div className="text-[16px] text-slate-700 leading-relaxed font-semibold">{main.desc}</div>
          </div>

          <div className="bg-[#fffbeb]/80 backdrop-blur-md border border-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(245,158,11,0.05)]">
            <div className="text-[14px] font-black text-[#d97706] tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shadow-sm bg-[#d97706]" /> 您可能沒發現的盲點
            </div>
            <div className="text-[15.5px] text-[#92400e] leading-[1.8] font-bold opacity-90">{main.insight}</div>
          </div>

          <div className={`bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white mb-4`}>
            <div className={`text-[14px] font-black tracking-widest mb-4 flex items-center gap-2 ${main.color}`}>
              <span className={`w-2 h-2 rounded-full shadow-sm ${main.bar}`} /> 可以從這裡開始
            </div>
            <div className="text-[16px] text-slate-700 leading-relaxed font-semibold">{main.nextStep}</div>
          </div>

          <div className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-[32px] p-8 shadow-[0_15px_40px_rgba(147,51,234,0.3)] text-white text-center relative overflow-hidden border border-[#e9d5ff]">
            <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/30 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-[20px] font-black mb-3 text-shadow-sm tracking-wide">結果化為實際行動</div>
              <div className="text-[14.5px] text-[#faf5ff] leading-relaxed mb-6 font-semibold">{main.ctaNote}</div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-[24px] p-5 flex items-start gap-4 text-left mb-8 shadow-inner">
                <div className="shrink-0 mt-0.5 text-[#fbbf24] drop-shadow-sm"><Ic n="star" size={24} color="currentColor" /></div>
                <div className="text-[14px] text-slate-50 leading-relaxed font-semibold">
                  預約諮詢後，我會為您整理一份<strong className="text-white font-black bg-white/20 px-1 py-0.5 rounded shadow-sm">專屬資產配置藍圖</strong>。
                </div>
              </div>

              <button onClick={onComplete} className="w-full bg-white text-[#9333ea] rounded-[20px] py-4.5 text-[16px] font-black shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform active:scale-95 outline-none border-0 cursor-pointer flex justify-center items-center gap-2 hover:scale-[1.02]">
                領取專屬解析指南 <Ic n="arrowRight" size={18} color="currentColor" />
              </button>
              <div className="mt-8">
                <button onClick={() => setStep(0)} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 text-white font-bold text-[14px] hover:bg-white/30 cursor-pointer active:scale-95 transition-all shadow-sm">
                  再測一次
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-[#e0e7ff] rounded-full blur-[80px] pointer-events-none opacity-60 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-[#f3e8ff] rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-multiply" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-[#dbeafe] rounded-full blur-[80px] pointer-events-none opacity-50 mix-blend-multiply" />
      
      <div className="relative z-10 w-full flex-1 flex flex-col items-center">
        <div className="w-full">
          {step === 0 && renderWelcome()}
          {step > 0 && step <= 8 && renderQuestion()}
          {step === 9 && renderLoading()}
          {step === 10 && renderResult()}
        </div>
      </div>
    </div>
  );
};
