import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ic } from "@/src/components/Icons";
import { useLocation } from "wouter";
import { Eyebrow, Reveal, SPRING } from "@/src/components/ui";
import liff from "@line/liff";
import { authHeaders } from "@/src/constants/liff";

// 測驗的 LIFF 永久連結（分享給朋友用）
const QUIZ_LIFF_URL = "https://liff.line.me/2007659354-EofSbRGu";

// 做完測驗時送出這句話換免費的 replyToken，用來觸發後端回覆結果卡
// （不計入官方帳號每月推播則數）。這個字串同時寫死在 lib/quiz.ts，
// 兩邊要保持一致。
const QUIZ_RESULT_TRIGGER_TEXT = "我做完了 90 秒財務性格測驗！";

/** 分享測驗結果給朋友（LINE 內用 shareTargetPicker，其他環境複製連結） */
async function shareQuizResult(mainName: string, subName: string, color: string) {
  const flexMessage = {
    type: "flex" as const,
    altText: `我的財務性格是「${mainName}」！你也來測測看`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: "💡 90 秒財務性格測驗", weight: "bold", size: "sm", color: "#888888", align: "center" },
          { type: "separator", margin: "md" },
          { type: "text", text: "我的財務性格是", size: "xs", color: "#aaaaaa", margin: "lg", align: "center" },
          { type: "text", text: mainName || "？", size: "xl", weight: "bold", color: color || "#14b8a6", align: "center", margin: "sm" },
          ...(subName ? [{ type: "text", text: `副屬性格：${subName}`, size: "sm", color: "#666666", align: "center", margin: "sm" }] : []),
          { type: "text", text: "每個人適合的節奏不同，你也來看清自己的財務輪廓", size: "xs", color: "#999999", wrap: true, align: "center", margin: "lg" }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#0d9488",
            action: { type: "uri", label: "我也要測", uri: QUIZ_LIFF_URL }
          }
        ]
      }
    }
  };

  try {
    if (liff.isApiAvailable && liff.isApiAvailable("shareTargetPicker")) {
      await liff.shareTargetPicker([flexMessage as any]);
      return;
    }
  } catch {
    // 使用者取消分享或 API 不可用，改用複製連結
  }
  try {
    await navigator.clipboard.writeText(`我的財務性格是「${mainName}」！你也來測測看：${QUIZ_LIFF_URL}`);
    alert("已複製測驗連結，貼給朋友吧！");
  } catch {
    alert(`分享連結：${QUIZ_LIFF_URL}`);
  }
}

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
    name: '穩健累積型', icon: 'shield',
    color: '#2e86ab', bg: '#e8f4f9', text: '#1a5374',
    tagline: '重視安全感，其實這是優勢',
    desc: '你重視本金安全，不喜歡不確定性。很多人以為這是缺點，但其實穩健才是長期走得下去的基礎。你缺的不是勇氣，是一個「夠穩、還能慢慢長大」的方式。',
    insight: '太保守的問題不是賺不到，而是錢一直在縮水。通貨膨脹每年吃掉 2%，存在帳戶裡的錢其實在虧損。找到一個「本金不減、還有配息」的設計，安全感和成長可以同時兼顧。',
    nextStep: '從「月配息」工具切入是最適合你的第一步。每個月有現金流進來，你看得見、摸得著，不需要冒險，安全感和收益可以一起有。',
    ctaNote: '我們會和你介紹穩健累積型的現金流規劃，不賣你不需要的冒險。',
    subDescs: {
      plan: '你想穩，但其實也不想太慢。你在等的是一個夠穩、又合理有效率的方式。',
      enjoy: '表面保守，但內心其實有進攻慾望，只是還沒找到足夠的安全感。',
      anxiety: '保守加上還沒找到方向，你需要的是一個清楚、可以馬上開始的起點。',
    },
  },
  enjoy: {
    name: '成長放大型', icon: 'trend',
    color: '#e85d04', bg: '#fff0e8', text: '#8b2500',
    tagline: '你有機會走得比別人快',
    desc: '你有行動力，不怕嘗試，也願意承擔一定風險。這是做財務規劃最好的性格之一。你需要的不是「被說服要開始」，而是一個方向清楚、有爆發力的配置方式。',
    insight: '進攻型的人最常見的問題是追高殺低，不是因為判斷差，而是缺一個系統。有策略的進攻，和衝動的進攻，結果差很多。風險控制做好，成長才會很明顯。',
    nextStep: '適合建立「成長配息雙軌」配置，一部分穩定產生現金流，一部分追求放大。讓你的進攻有底氣，不怕市場波動打亂節奏。',
    ctaNote: '我們會和你一起設計一個有方向、有彈性、可以把機會放大的個人規劃。',
    subDescs: {
      guard: '你想衝，但也知道不能亂衝。這種組合很好規劃，可以同時成長又不失控。',
      plan: '你不只是想賺，是想用對方法賺。有策略的進攻，效率差很多。',
      anxiety: '你有動力，但還缺一套方法。把方向確定，你的執行力才有地方放。',
    },
  },
  anxiety: {
    name: '起步探索型', icon: 'info',
    color: '#7b2d8b', bg: '#f3e8f9', text: '#4a1a5a',
    tagline: '你不是做不到，只是少了一個開始的方式',
    desc: '你知道應該要做，心裡也有一點焦慮，但一直找不到一個清楚的起點。這不是懶，也不是沒能力，是從來沒有人幫你把第一步講清楚。其實大多數人都在這個階段。',
    insight: '起步探索型的人，行動後改變往往是最大的。因為你在意，才會焦慮。在意的人，一旦方向清楚了，執行力反而很強。你只差一個「簡單可執行的第一步」。',
    nextStep: '先把「我每個月需要多少現金流」這個數字算出來，再往回推第一步怎麼做。把模糊的擔憂變成看得見的目標，就不會再拖了。',
    ctaNote: '我們會陪你從零開始，把複雜的問題拆解成你可以馬上做的第一步。',
    subDescs: {
      guard: '你想穩定，但還不知道怎麼開始。從最低風險的第一步切入最適合你。',
      enjoy: '你想快，但還沒有方向。把目標先釐清，行動力自然就會出來。',
      plan: '你其實想得很清楚，只是一直沒有動。你需要的是有人幫你推第一步。',
    },
  },
  plan: {
    name: '策略進化型', icon: 'map',
    color: '#2a9068', bg: '#edf7f2', text: '#0e5234',
    tagline: '你已經在正確路上，差的是一個整合策略',
    desc: '你有清晰的財務意識，也有實際在執行記帳或投資。你不需要被說服要規劃，你需要的是讓現有的努力發揮最大效益的方式。',
    insight: '有在執行的人，最常見的問題不是努力不夠，而是策略有沒有放在最有效率的位置。同樣的資金，不同的配置方式，10 年後的結果可以差非常多。',
    nextStep: '適合做一次「策略校準」，把保障、現金流、成長三層放到最有效率的位置，讓你已有的執行力不只是在累積，而是每一塊錢都開始幫你工作。',
    ctaNote: '我們會和你檢視現有規劃，找出讓執行力更快轉換成現金流的最短路徑。',
    subDescs: {
      guard: '執行力強但偏保守，稍微調整配置比例，整體效率會差很多。',
      enjoy: '策略加上進攻慾，你可以做到的上限比現在高很多。',
      anxiety: '想得清楚但還沒整合。把現有行動收攏成一套策略，是你的下一步。',
    },
  },
};

const Confetti = ({ colors }: { colors: string[] }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10px]"
          initial={{ y: 0, x: `${Math.random() * 100}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: "100vh", opacity: 0, rotate: 720, scale: 0.5 }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: "linear",
          }}
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export const QuizPage = ({ onBack, onComplete }: any) => {
  const [step, setStep] = useState(0); // 0: welcome, 1-8: questions, 9: loading, 10: result
  const [answers, setAnswers] = useState<string[]>([]);
  const [loadMsg, setLoadMsg] = useState(0);
  // 從 LINE 推播的「查看完整結果」連結（?r=guard-plan）打開時，
  // 直接還原當時的結果，不必重新作答一次。
  const [resultOverride, setResultOverride] = useState<{ winner: string; subType?: string } | null>(null);
  const sentResultRef = useRef(false);

  const MSGS = [
    { t: "正在分析您的財務性格…", s: "根據您的 8 個選擇，\n我們正在比對最適合的方向" },
    { t: "分析完成", s: "正在為您準備個人化洞察…" },
    { t: "即將揭曉！", s: "您的財務性格結果出爐了" }
  ];

  // 讀取分享／推播連結帶入的結果（?r=主屬性 或 ?r=主屬性-副屬性）
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("r");
    if (!r) return;
    const [w, s] = r.split("-");
    if (TYPES[w]) {
      sentResultRef.current = true; // 這是回看結果，不是剛完成測驗，不需要再推播一次
      setResultOverride({ winner: w, subType: TYPES[s] ? s : undefined });
      setStep(10);
    }
  }, []);

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

  // 測驗真正完成、進到結果頁時，把結果送回使用者與官方帳號的對話中
  // （只做一次；若是透過分享連結直接開啟結果頁，上面已把 ref 標記過，不會重複觸發）
  //
  // 優先順序：
  // 1. 先呼叫後端把結果暫存起來（不論哪種送法都需要）
  // 2. 嘗試 liff.sendMessages() 送出觸發句：這是免費的，但只有 LIFF 是從
  //    一對一聊天室情境（utou，例如點選單開啟）才可用
  // 3. 上面失敗或不支援時，退回會計入官方帳號每月推播則數的 push，
  //    確保無論如何使用者都拿得到結果
  useEffect(() => {
    if (step !== 10 || sentResultRef.current) return;
    sentResultRef.current = true;
    const { winner, subType } = calculateResult();
    const body = { winner, subType: subType || null };

    const postQuizResult = (extra: Record<string, unknown>) =>
      fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...body, ...extra }),
      }).catch(() => {
        // 失敗不影響結果頁顯示，安靜失敗即可
      });

    (async () => {
      await postQuizResult({ wantPush: false }); // 先暫存，讓等一下的免費 reply 查得到

      try {
        const ctx = liff.isInClient() && typeof (liff as any).getContext === "function"
          ? (liff as any).getContext()
          : null;
        if (ctx?.type !== "utou") throw new Error("非一對一聊天室情境，跳過免費管道");
        await liff.sendMessages([{ type: "text", text: QUIZ_RESULT_TRIGGER_TEXT }]);
      } catch {
        // 免費管道不可用：退回付費 push，確保結果一定送得到
        await postQuizResult({ wantPush: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSelect = (idx: number, type: string) => {
    const newAns = [...answers];
    newAns[idx] = type;
    setAnswers(newAns);
    setTimeout(() => setStep(step + 1), 300);
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { guard: 0, enjoy: 0, anxiety: 0, plan: 0 };

    // 透過分享／推播連結直接開啟結果頁：沒有真實作答紀錄，直接還原當時的結果
    if (resultOverride) {
      return { winner: resultOverride.winner, subType: resultOverride.subType, counts };
    }

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="px-6 pt-10 pb-8 relative z-10 flex flex-col min-h-[100dvh]">
      <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800">OO SAY MONEY</div>

      <div className="flex-1 flex flex-col justify-center py-10">
        <Eyebrow className="mb-6">Money personality · 8 questions</Eyebrow>
        <h1 className="font-serif text-warm-gray-800 leading-[1.18] tracking-[-0.01em]">
          {["看見你", "和錢的"].map((t, i) => (
            <motion.span key={t} className="block text-[44px] font-semibold" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 + i * 0.1 }}>{t}</motion.span>
          ))}
          <motion.span className="block text-[44px] font-light italic text-brass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.27 }}>關係。</motion.span>
        </h1>
        <p className="mt-7 text-[15px] leading-[1.95] text-warm-gray-600 max-w-[19rem]">
          每個人適合的節奏不同。透過 8 個簡單情境，快速看清你的財務輪廓。
        </p>

        <div className="mt-10 border-t border-warm-gray-800/80">
          {[
            { n: "01", t: "約 90 秒完成", d: "8 題，每題憑直覺選就好" },
            { n: "02", t: "結果只有你看得到", d: "不會公開，也不需要先留資料" },
          ].map((r) => (
            <div key={r.n} className="flex gap-5 py-5 border-b border-warm-gray-300">
              <span className="font-display text-[13px] tnum text-brass pt-0.5 w-6 shrink-0">{r.n}</span>
              <div>
                <div className="font-serif text-[17px] font-semibold text-warm-gray-800">{r.t}</div>
                <div className="mt-1 text-[13px] text-warm-gray-600">{r.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        onClick={() => setStep(1)}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50"
      >
        開始測驗 <Ic n="arrow" size={16} color="currentColor" />
      </motion.button>
    </motion.div>
  );

  const renderQuestion = () => {
    const qIdx = step - 1;
    const q = QUESTIONS[qIdx];
    const letters = ["A", "B", "C", "D", "E"];
    return (
      <div className="flex-1 flex flex-col pt-10 px-6 relative z-10 pb-8 min-h-[100dvh]">
        <div className="flex items-end justify-between mb-5">
          <div className="font-display text-warm-gray-800 leading-none">
            <span className="text-[44px] font-light tnum">{String(step).padStart(2, "0")}</span>
            <span className="text-[14px] text-warm-gray-500 ml-1.5 tnum">/ 08</span>
          </div>
          <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800 pb-1.5">OO SAY MONEY</div>
        </div>

        <div className="flex gap-1.5 mb-10 w-full" role="progressbar" aria-valuemin={1} aria-valuemax={8} aria-valuenow={step}>
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-[2px] flex-1 bg-warm-gray-200 overflow-hidden relative">
              {i <= qIdx && <motion.div initial={{ scaleX: i === qIdx ? 0 : 1 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute inset-0 bg-brass" />}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center w-full">
          {q.hint && (
            <div className="text-[12px] tracking-[0.12em] text-brass mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-brass" />{q.hint}
            </div>
          )}
          <h2 className="text-[25px] font-serif font-semibold text-warm-gray-800 leading-[1.55] mb-9 tracking-wide">
            {q.q}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3 pb-6">
              {q.opts.map((o, i) => {
                const isSelected = answers[qIdx] === o.type;
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(qIdx, o.type)}
                    whileTap={{ scale: 0.985 }}
                    aria-pressed={isSelected}
                    className={`group text-left flex items-start gap-4 px-5 py-5 text-[15px] leading-[1.7] cursor-pointer tracking-wide border rounded-2xl transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brass/60
                      ${isSelected ? "border-forest bg-forest text-white" : "border-warm-gray-300 bg-transparent text-warm-gray-800 hover:border-warm-gray-800/50 hover:bg-warm-gray-100"}`}
                  >
                    <span className={`font-display text-[13px] pt-0.5 w-4 shrink-0 ${isSelected ? "text-brass-soft" : "text-brass"}`}>{letters[i]}</span>
                    <span className="flex-1">{o.text}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center px-8 min-h-[100dvh] relative z-10">
      <Eyebrow className="mb-8">Analyzing</Eyebrow>
      <svg viewBox="0 0 320 60" fill="none" className="w-full mb-10" style={{ overflow: "visible" }} aria-hidden="true">
        <motion.path d="M2 48 C 50 46, 70 40, 104 34 S 160 30, 190 22 S 260 18, 318 6" stroke="var(--color-brass)" strokeWidth="1.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
      <motion.h2 key={"t" + loadMsg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-[26px] font-semibold text-warm-gray-800 leading-snug mb-3">{MSGS[loadMsg].t}</motion.h2>
      <motion.p key={"s" + loadMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-warm-gray-600 leading-[1.9] whitespace-pre-line">{MSGS[loadMsg].s}</motion.p>
    </motion.div>
  );

  const renderResult = () => {
    const { winner, subType, counts } = calculateResult();
    const main = TYPES[winner];
    const sub = subType ? TYPES[subType] : null;
    
    const pctMap: Record<string, number> = {};
    Object.keys(counts).forEach(k => {
      pctMap[k] = Math.round((counts[k] / 8) * 100);
    });

    const barColors: Record<string, string> = { guard: '#2e86ab', enjoy: '#e85d04', anxiety: '#7b2d8b', plan: '#2a9068' };
    const barLabels: Record<string, string> = { guard: '穩健累積', enjoy: '成長放大', anxiety: '起步探索', plan: '策略進化' };

    const confettiColorsMap: Record<string, string[]> = {
      guard:   ['#2e86ab','#74c2e1','#a8d8ea'],
      enjoy:   ['#e85d04','#f4a261','#ffd6a5'],
      anxiety: ['#7b2d8b','#b46fc7','#d8a9e5'],
      plan:    ['#2a9068','#52b788','#b7e4c7'],
    };

    return (
      <div className="min-h-[100dvh] relative z-10 flex flex-col items-center bg-warm-gray-50">
        <Confetti colors={['#B8793A', '#E9D6BC', '#0F3D33']} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="w-full max-w-[480px]">
          {/* Header：名字當主視覺，靠左 */}
          <div className="pt-10 px-6 pb-8">
            <div className="flex items-center justify-between mb-10">
              <Eyebrow>Your money personality</Eyebrow>
              <div className="font-display text-[12px] font-semibold tracking-[0.22em] text-warm-gray-800">OO SAY MONEY</div>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center border border-warm-gray-300 bg-white mb-6" style={{ color: main.color }}>
              <Ic n={main.icon} size={26} color="currentColor" />
            </div>
            <h2 className="font-serif text-[48px] font-semibold leading-[1.1] tracking-[-0.01em] text-forest">
              {main.name}
            </h2>
            {sub && (
              <div className="mt-3 text-[13px] tracking-[0.12em] text-brass">副：{sub.name}</div>
            )}
            <p className="mt-5 text-[16px] text-warm-gray-600 leading-[1.9] max-w-[22rem]">
              {main.tagline}
            </p>
            {sub && main.subDescs[subType!] && (
              <div className="text-[13px] text-warm-gray-600 border-l-2 border-brass-soft pl-4 mt-5 leading-[1.9]">
                {main.subDescs[subType!]}
              </div>
            )}
          </div>

          {/* Body：細線分段，不用卡片 */}
          <div className="px-6 pb-6">
            <div className="border-t border-warm-gray-800/80">
              {[
                { k: "01", label: "你是這樣的人", body: main.desc },
                { k: "02", label: "你可能不知道", body: main.insight, accent: true },
                { k: "03", label: "你可以從這裡開始", body: main.nextStep },
              ].map((sec, i) => (
                <Reveal key={sec.k} delay={i * 0.05}>
                  <div className={`py-7 border-b border-warm-gray-300 ${sec.accent ? "bg-warm-gray-100/70 -mx-6 px-6" : ""}`}>
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-display text-[13px] tnum text-brass">{sec.k}</span>
                      <span className="text-[11px] font-medium tracking-[0.24em] uppercase text-warm-gray-600">{sec.label}</span>
                    </div>
                    <div className="text-[15px] leading-[1.95] text-warm-gray-800 pl-[2.1rem]">{sec.body}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* 從分享／推播連結直接開啟結果頁時沒有真實作答紀錄，性格分佈圖沒有意義，先隱藏 */}
            {!resultOverride && (
              <Reveal>
                <div className="pt-9">
                  <Eyebrow className="mb-5">你的性格分佈</Eyebrow>
                  <div className="flex flex-col gap-4">
                    {Object.keys(barColors).map(k => (
                      <div key={k} className="flex items-center gap-3">
                        <div className={`text-[12px] w-[64px] shrink-0 tracking-wide ${k === winner ? "text-warm-gray-800 font-medium" : "text-warm-gray-500"}`}>{barLabels[k]}</div>
                        <div className="flex-1 h-px bg-warm-gray-300 relative">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: (pctMap[k] || 0) / 100 }}
                            style={{ originX: 0 }}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className={`absolute left-0 -top-[1px] h-[3px] w-full rounded-full ${k === winner ? "bg-brass" : "bg-warm-gray-400"}`}
                          />
                        </div>
                        <div className="font-display text-[13px] tnum text-warm-gray-600 w-[36px] text-right shrink-0">{pctMap[k] || 0}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* CTA Zone */}
          <div className="px-5 pb-8 mt-2">
            <div className="bg-teal-base p-8 flex flex-col justify-center items-center text-center rounded-[28px] relative overflow-hidden grain">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brass/20 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <div className="text-[14px] text-teal-soft/90 font-bold mb-2 tracking-wide relative z-10">恭喜你完成測驗</div>
              <h3 className="text-[16px] font-serif font-bold text-brass-soft mb-3 tracking-wide relative z-10">你的結果，可以變成一個實際的計劃</h3>
              <p className="text-[14px] text-white/90 font-normal mb-3 leading-relaxed relative z-10">
                {main.ctaNote}
              </p>
              {!resultOverride && (
                <p className="text-[12px] text-teal-soft/80 font-normal mb-5 leading-relaxed relative z-10 flex items-center gap-1.5">
                  <Ic n="check" size={12} color="currentColor" /> 結果已同步傳送到你與我們的 LINE 對話
                </p>
              )}
              
              <div className="w-16 h-[1px] bg-white/20 mb-8 relative z-10" />

              <h3 className="text-[20px] font-serif font-bold text-white mb-3 tracking-wide relative z-10">想了解更多？</h3>
              <p className="text-[14px] text-teal-soft/90 font-normal mb-8 leading-relaxed relative z-10">
                加入會員，解鎖更多理財工具與案例解析
              </p>

              <button onClick={() => {
                const res = calculateResult();
                const m = TYPES[res.winner] || {};
                const s = res.subType ? TYPES[res.subType] : null;
                localStorage.setItem('pendingQuizResult', JSON.stringify({
                  mainName: m.name,
                  mainIcon: m.icon,
                  subName: s ? s.name : '',
                  color: m.color
                }));
                onComplete();
              }} className="w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] active:scale-[0.98] transition-all flex justify-center items-center gap-2 relative z-10">
                 免費加入會員
              </button>

              <button onClick={() => {
                const res = calculateResult();
                const m = TYPES[res.winner] || {};
                const s = res.subType ? TYPES[res.subType] : null;
                shareQuizResult(m.name || '', s ? s.name : '', m.color || '');
              }} className="w-full mt-3 bg-transparent text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer border border-white/30 hover:bg-white/10 transition-all flex justify-center items-center gap-2 relative z-10">
                 分享結果給朋友
              </button>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => {
                // 清掉分享連結帶入的舊結果與網址參數，重新測驗才會用新答案算結果、也才會再次推播
                setResultOverride(null);
                sentResultRef.current = false;
                setAnswers([]);
                window.history.replaceState({}, "", window.location.pathname);
                setStep(0);
              }} className="text-warm-gray-400 text-[12px] underline font-normal hover:text-warm-gray-600 transition-colors">
                重新測驗
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col relative overflow-hidden">
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
