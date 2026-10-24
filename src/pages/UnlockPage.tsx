import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { useLocation } from "wouter";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";
import { FEATURES } from "@/src/constants/features";
import { Reveal, SPRING } from "@/src/components/ui";

// to：會員功能關閉時，每一列直接開對應頁面（這頁變成「免費工具目錄」）
const features = [
  { icon: "chart",    title: "財務健檢",  desc: "用財管家初步檢視你的財務分數", to: "/tool" },
  { icon: "map",      title: "啟富藍圖",  desc: "月配息策略說明，試算你的財務自由路徑", to: "/blueprint" },
  { icon: "shield",   title: "財務防線",  desc: "保障是起點，風險顧好，才能安心往前走", to: "/defense" },
  { icon: "book",     title: "理財靈感",  desc: "基金排行與精選理財觀點，定期更新", to: "/inspire" },
  { icon: "mail",     title: "電子報",    desc: "定期收到我們整理的理財觀念", to: "/newsletter" },
];

export const UnlockPage = ({ onBack, onJoin }: any) => {
  const [, navigate] = useLocation();
  const open = !FEATURES.membership;

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <div className="px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} aria-label="返回" className="flex items-center gap-1 text-[14px] text-warm-gray-600 hover:text-warm-gray-800 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50">
          <Ic n="back" size={16} /> 返回
        </button>
        <div className="font-display text-[13px] font-medium tracking-[0.08em] text-warm-gray-800">OO SAY MONEY</div>
      </div>

      <header className="px-6 pt-14 pb-10">
        <h1 className="font-serif leading-[1.15]">
          <motion.span className="block text-[44px] font-semibold text-warm-gray-800" initial={false} animate={{ opacity: 1, y: 0 }} transition={SPRING}>{open ? "免費工具" : "解鎖"}</motion.span>
          <motion.span className="block text-[44px] font-medium text-brass" initial={false} animate={{ opacity: 1, y: 0 }} transition={SPRING}>{open ? "都在這裡。" : "更多。"}</motion.span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.9] text-warm-gray-600 max-w-[19rem]">
          {open ? "不用註冊，點了就能用。有問題隨時在 LINE 問我們。" : "加入會員，使用專屬工具、閱讀精選內容、預約顧問。"}
        </p>
      </header>

      <section className="px-6">
        <div className="border-t border-warm-gray-800/80">
          {features.map((f) => {
            const body = (
              <>
                <div className="flex-1">
                  <div className="font-serif text-[20px] font-semibold text-warm-gray-800">{f.title}</div>
                  <p className="mt-1.5 text-[14px] leading-[1.8] text-warm-gray-600">{f.desc}</p>
                </div>
                <span className="pt-1 text-brass"><Ic n={open ? "arrow" : f.icon} size={20} color="currentColor" /></span>
              </>
            );
            return open ? (
              <button
                key={f.title}
                type="button"
                onClick={() => navigate(f.to)}
                className="w-full text-left flex items-start gap-5 py-6 border-b border-warm-gray-300 cursor-pointer hover:bg-warm-gray-100 transition-colors outline-none focus-visible:bg-warm-gray-100"
              >
                {body}
              </button>
            ) : (
              <div key={f.title} className="flex items-start gap-5 py-6 border-b border-warm-gray-300">{body}</div>
            );
          })}
        </div>
      </section>

      <Reveal className="px-6 pt-14">
        <section className="relative rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8">
          <h2 className="font-serif text-[26px] leading-[1.3] font-semibold">{open ? "想直接聊聊？" : "免費加入會員"}</h2>
          <p className="mt-3 text-[14px] leading-[1.9] text-white/75">{open ? "在 LINE 說一聲，一句話就能約。" : "加入後即可使用以上功能。"}</p>
          <motion.button
            onClick={open ? () => openLine(LINE_BOOK_URL) : onJoin}
            whileTap={{ scale: 0.96 }}
            className="mt-7 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#9A3412] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          >
            {open ? "在 LINE 聊聊" : "加入會員"}
          </motion.button>
          {!open && (
            <button onClick={() => openLine(LINE_BOOK_URL)} className="mt-2 w-full py-3 text-[14px] text-white/80 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">
              想先聊聊？直接在 LINE 跟我們說
            </button>
          )}
        </section>
      </Reveal>
    </div>
  );
};
