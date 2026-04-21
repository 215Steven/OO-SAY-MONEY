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
    name: '穩健累積型', icon: 'shield', color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500', border: 'border-blue-200',
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
    name: '成長放大型', icon: 'trend', color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-500', border: 'border-orange-200',
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
    name: '起步探索型', icon: 'info', color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500', border: 'border-purple-200',
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
    name: '策略進化型', icon: 'map', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500', border: 'border-emerald-200',
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
    { t: "正在分析你的財務性格…", s: "根據你的 8 個選擇，我們正在比對最適合的類型" },
    { t: "分析完成", s: "正在為你準備個人化洞察…" },
    { t: "即將揭曉！", s: "你的財務性格結果出爐了" }
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="p-5 pt-8">
      <div className="w-[72px] h-[72px] bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
        <Ic n="user" size={34} color="#059669" />
      </div>
      <h1 className="text-[30px] font-extrabold text-slate-900 leading-tight mb-4 text-center tracking-[-0.02em]">
        你的<span className="text-emerald-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600/30">財務性格</span><br/>是哪一型？
      </h1>
      <p className="text-[15px] text-slate-500 leading-relaxed text-center mb-8">
        很多人不是不努力，是用錯方式在理財。<br/>用直覺選就好，不用想太多。
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-600/10 px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5">
          <Ic n="check" size={14} /> 約 90 秒
        </span>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-600/10 px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5">
          <Ic n="shield" size={14} /> 僅供您查看
        </span>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-600/10 px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5">
          <Ic n="chart" size={14} /> 主副類型分析
        </span>
      </div>

      <button onClick={() => setStep(1)} className="w-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-xl py-4 text-[16px] font-extrabold shadow-xl shadow-emerald-600/30 transition-transform active:scale-95 flex justify-center items-center gap-2">
        <Ic n="trend" size={20} /> 開始測驗
      </button>
    </motion.div>
  );

  const renderQuestion = () => {
    const qIdx = step - 1;
    const q = QUESTIONS[qIdx];
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 px-6 pt-6 pb-5 relative">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[12px] font-bold text-white/70 tracking-widest flex items-center gap-2">
              <button onClick={onBack} className="p-0 bg-transparent border-0 opacity-70 hover:opacity-100 cursor-pointer"><Ic n="back" size={16} color="white"/></button>
              財務性格測驗
            </div>
            <div className="text-[12px] font-bold text-white"><span className="opacity-70">第 {step} 題 /</span> 8</div>
          </div>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative`}>
                {i < qIdx && <div className="absolute inset-0 bg-white" />}
                {i === qIdx && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="absolute inset-0 bg-white/90" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {q.hint && (
             <div className="text-[13px] font-bold text-emerald-600/80 mb-3 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-emerald-600/50 rounded-full" />{q.hint}
             </div>
          )}
          <h2 className="text-[20px] font-extrabold text-slate-900 leading-[1.4] mb-6 tracking-[-0.02em]">
            {q.q}
          </h2>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
                {q.opts.map((o, i) => {
                  const isSelected = answers[qIdx] === o.type;
                  return (
                    <button key={i} onClick={() => handleSelect(qIdx, o.type)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 text-[14.5px] leading-relaxed cursor-pointer font-sans
                        ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-[inset_4px_0_0_#10b981]' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-[inset_4px_0_0_#6ee7b7]'}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center min-h-[100dvh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-emerald-500 mb-6" />
      <motion.h2 key={"t"+loadMsg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[20px] font-extrabold text-slate-900 mb-2">{MSGS[loadMsg].t}</motion.h2>
      <motion.p key={"s"+loadMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-slate-500">{MSGS[loadMsg].s}</motion.p>
    </motion.div>
  );

  const renderResult = () => {
    const { winner, subType, counts } = calculateResult();
    const main = TYPES[winner];
    const sub = subType ? TYPES[subType] : null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`min-h-full pb-8 ${main.bg}`}>
        <div className="pt-10 px-6 text-center">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider mb-5 ${main.color} ${main.border} border bg-white/50`}>
            <Ic n="trend" size={14} /> 你的財務性格
          </div>
          <div className="relative mb-3">
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center bg-white shadow-xl ${main.color}`}>
               <Ic n={main.icon} size={36} color="currentColor" />
             </motion.div>
          </div>
          <div className={`text-[28px] font-extrabold tracking-[-0.04em] mb-1.5 ${main.color.replace('text-', 'text-gray-900 ')} text-slate-900`}>
            {main.name}
          </div>
          {sub && (
            <div className={`text-[13px] font-bold ${main.color} opacity-85 mb-1.5`}>
              （副：{sub.name}）
            </div>
          )}
          <div className="text-[14px] text-slate-500 mb-4">{main.tagline}</div>
          
          {sub && main.subDescs[subType!] && (
            <div className="bg-white/60 border border-slate-200/50 rounded-xl p-3.5 mx-auto max-w-[320px] text-[13px] text-slate-600 text-left leading-relaxed">
              {main.subDescs[subType!]}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">你是這樣的人</div>
            <div className="text-[14.5px] text-slate-700 leading-[1.75]">{main.desc}</div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-4 shadow-sm shadow-amber-500/10">
            <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Ic n="info" size={14} /> 你可能不知道
            </div>
            <div className="text-[14px] text-amber-900 leading-[1.75] opacity-90">{main.insight}</div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">你可以從這裡開始</div>
            <div className="text-[14.5px] text-slate-700 leading-[1.75]">{main.nextStep}</div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mt-2 shadow-xl shadow-slate-900/10 text-white text-center">
            <div className="text-[16px] font-extrabold mb-2">你的結果，可以變成實際計劃</div>
            <div className="text-[13px] text-slate-300 leading-relaxed mb-6">{main.ctaNote}</div>
            
            <div className="bg-white/10 border border-white/10 rounded-xl p-3.5 flex items-start gap-3 text-left mb-6">
              <div className="shrink-0 mt-0.5"><Ic n="gift" size={16} /></div>
              <div className="text-[12.5px] text-slate-200 leading-relaxed">
                預約諮詢後，我會為你整理一份<strong className="text-white">專屬資產配置方向圖</strong>。
              </div>
            </div>

            <button onClick={onComplete} className="w-full bg-emerald-500 text-white rounded-xl py-4 text-[15px] font-extrabold shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 outline-none border-0 cursor-pointer">
              立即預約免費諮詢
            </button>
            <div className="mt-4"><button onClick={() => setStep(0)} className="bg-transparent border-0 text-slate-400 text-[12px] underline cursor-pointer">重新測驗</button></div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans">
      {step === 0 && renderWelcome()}
      {step > 0 && step <= 8 && renderQuestion()}
      {step === 9 && renderLoading()}
      {step === 10 && renderResult()}
    </div>
  );
};
