import { ReactNode } from "react";
import { CountUp } from "@/src/components/ui";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";

/** 對方的訊息泡泡 */
const Bubble = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`self-start max-w-[88%] bg-white border border-warm-gray-200 rounded-[18px_18px_18px_4px] px-4 py-3 text-[15px] leading-[1.75] text-warm-gray-800 ${className}`}>
    {children}
  </div>
);

/** 你的回覆（按鈕） */
const Reply = ({ children, onClick, primary = false }: { children: ReactNode; onClick: () => void; primary?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className={`self-end rounded-[18px_18px_4px_18px] px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50 active:scale-[0.96] ${
      primary
        ? "bg-brass text-white hover:bg-[#9A3412]"
        : "bg-transparent text-forest border border-forest hover:bg-forest hover:text-white"
    }`}
  >
    {children}
  </button>
);

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col">
      <header className="px-6 pt-8 flex items-center justify-between">
        <div className="font-display text-[13px] font-medium tracking-[0.08em] text-warm-gray-800">OO SAY MONEY</div>
        <button
          onClick={() => onSelect("login")}
          className="text-[14px] text-warm-gray-600 border-b border-warm-gray-300 pb-0.5 hover:text-warm-gray-800 hover:border-warm-gray-800 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50"
        >
          會員登入
        </button>
      </header>

      <main className="flex-1 px-6 pt-10 pb-8 flex flex-col gap-3 max-w-md w-full mx-auto">
        {/* 第一則：整頁唯一的亮點，一個大數字 */}
        <Bubble className="!max-w-[94%] !px-5 !py-5">
          <div className="text-[14px] text-warm-gray-600">每個月多出來的錢</div>
          <div className="mt-1 flex items-baseline gap-2">
            <CountUp to={5000} className="inline-block min-w-[4ch] font-display text-[56px] leading-none font-medium text-brass" />
            <span className="text-[16px] text-warm-gray-800">元</span>
          </div>
          <div className="mt-2 text-[15px] text-warm-gray-800">
            一年就是 <span className="font-display tnum">60,000</span> 元。
          </div>
          <p className="mt-3 text-[13px] text-warm-gray-500">示意數字，實際依個人狀況而定。</p>
        </Bubble>

        <Bubble>嗨，我們是 Steven 和 Annie。</Bubble>
        <Bubble>薪水每個月都花完，是不是常有的事？先花 90 秒，看看錢都去哪了。</Bubble>

        <div className="mt-3 flex flex-col gap-2.5">
          <Reply onClick={() => onSelect("quiz")}>開始測驗（免費）</Reply>
          <Reply onClick={() => onSelect("story")}>先認識你們</Reply>
          <Reply primary onClick={() => openLine(LINE_BOOK_URL)}>想先聊聊</Reply>
        </div>

        <Bubble className="mt-6">
          想用更多工具，可以免費加入會員，之後也能直接在 LINE 跟我們說。
        </Bubble>
        <div className="flex flex-col gap-2.5">
          <Reply onClick={() => onSelect("unlock")}>會員有什麼</Reply>
          <Reply onClick={() => onSelect("login")}>免費加入會員</Reply>
        </div>
      </main>

      <p className="px-8 pb-12 text-[13px] text-warm-gray-500 text-center leading-relaxed">
        本站內容僅供參考，不構成投資建議。
      </p>
    </div>
  );
};
