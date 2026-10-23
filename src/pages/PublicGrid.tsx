import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";
import { MoneyLine, Eyebrow, SPRING } from "@/src/components/ui";

// 順序：先痛點（測驗）、後信任（故事）、再轉換（解鎖更多）
const items = [
  { key: "quiz",   no: "01", label: "錢去哪了",  sub: "90 秒財務性格測驗，看見你和錢的關係", tag: "免費" },
  { key: "story",  no: "02", label: "故事起點",  sub: "認識 Steven & Annie，以及我們做事的方式" },
  { key: "unlock", no: "03", label: "解鎖更多",  sub: "會員專屬工具與一對一諮詢" },
];

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 flex flex-col">
      {/* 頂列 */}
      <div className="px-6 pt-8 flex items-center justify-between">
        <div className="font-display text-[13px] font-semibold tracking-[0.12em] text-warm-gray-800">OO SAY MONEY</div>
        <button
          onClick={() => onSelect("login")}
          className="text-[13px] tracking-[0.18em] text-warm-gray-600 border-b border-warm-gray-300 pb-0.5 hover:text-warm-gray-800 hover:border-warm-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:ring-offset-4 focus-visible:ring-offset-warm-gray-50"
        >
          會員登入
        </button>
      </div>

      {/* Hero：靠左、大字、一條會自己長出來的資產線 */}
      <div className="px-6 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 }}>
          <Eyebrow className="mb-6">Financial conversations</Eyebrow>
        </motion.div>
        <h1 className="font-serif text-warm-gray-800 leading-[1.12] tracking-[-0.01em]">
          {["你好，", "歡迎來到"].map((t, i) => (
            <motion.span key={t} className="block text-[40px] font-semibold" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.12 + i * 0.1 }}>
              {t}
            </motion.span>
          ))}
          <motion.span className="block text-[44px] font-light italic text-forest mt-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.34 }}>
            OO SAY <span className="font-semibold not-italic">MONEY</span>
          </motion.span>
        </h1>
        <motion.p className="mt-7 text-[15px] leading-[1.9] text-warm-gray-600 max-w-[17rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
          投資，是對自己最好的承諾。
        </motion.p>
        <MoneyLine className="w-full mt-9" />
        <div className="mt-3 flex justify-between text-[12px] tracking-[0.12em] text-warm-gray-500">
          <span>今天</span><span>有選擇的自由</span>
        </div>
      </div>

      {/* 索引式清單：用細線分隔，不用卡片 */}
      <nav className="px-6 mt-2" aria-label="主要入口">
        <div className="border-t border-warm-gray-800/80">
          {items.map((item, i) => (
            <motion.button
              key={item.key}
              onClick={() => onSelect(item.key)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.9 + i * 0.08 }}
              whileTap={{ scale: 0.96 }}
              className="group relative w-full text-left flex items-start gap-5 py-7 border-b border-warm-gray-300 outline-none focus-visible:bg-warm-gray-100 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-warm-gray-100 origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 ease-out" aria-hidden="true" />
              <span className="relative flex-1">
                <span className="flex items-center gap-3">
                  <span className="font-serif text-[24px] font-semibold text-warm-gray-800 tracking-wide">{item.label}</span>
                  {item.tag && <span className="text-[12px] tracking-[0.2em] text-brass border border-brass/40 px-2 py-0.5 rounded-full">{item.tag}</span>}
                </span>
                <span className="block mt-1.5 text-[13px] leading-relaxed text-warm-gray-600">{item.sub}</span>
              </span>
              <span className="relative pt-2 text-warm-gray-800 group-hover:translate-x-1.5 transition-transform duration-300">
                <Ic n="arrow" size={22} color="currentColor" />
              </span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* 轉換區塊：深色、顆粒、銅金按鈕 */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={SPRING}
        className="grain relative mx-6 mt-14 rounded-[28px] bg-forest text-white overflow-hidden px-7 pt-10 pb-8"
      >
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brass/20 blur-3xl" aria-hidden="true" />
        <Eyebrow className="!text-brass-soft/80 mb-5 relative z-10">Start here</Eyebrow>
        <h2 className="relative z-10 font-serif text-[28px] leading-[1.3] font-semibold">
          開始屬於你的<br />理財旅程
        </h2>
        <p className="relative z-10 mt-4 text-[14px] leading-[1.9] text-white/70">
          記錄財務、預約顧問，<br />取得屬於你的理財藍圖。
        </p>
        <motion.button
          onClick={() => onSelect("login")}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 mt-8 w-full bg-brass text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-[#A66B30] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
        >
          免費加入會員
        </motion.button>
        <p className="relative z-10 mt-4 text-[12px] text-white/45 tracking-wide text-center">已有帳號？同一個按鈕登入即可</p>
      </motion.section>

      <p className="px-8 mt-10 pb-12 text-[12px] text-warm-gray-500 text-center tracking-wide leading-relaxed">
        本站內容僅供參考，不構成投資建議。
      </p>
    </div>
  );
};
