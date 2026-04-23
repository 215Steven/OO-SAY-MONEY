import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

const STATS = [
  { label: "服務客戶", val: "200+", unit: "位" },
  { label: "從業年資", val: "8",    unit: "年" },
  { label: "客戶滿意", val: "97",   unit: "%" },
];

const CERTS = ["CFP 認證理財規劃師", "RFP 理財規劃師", "MDRT 百萬圓桌"];

const STORY_ITEMS = [
  {
    q: "為什麼我選擇這份工作？",
    a: "曾經看著身邊的人在財務迷霧中原地打轉——明明努力工作，卻不知道錢去了哪裡。我希望用清晰的數字與策略，讓每個人都能看見自己的財務全貌。",
  },
  {
    q: "我能為你做什麼？",
    a: "從保障缺口、緊急備援金到長期複利規劃，我不賣產品，我幫你建立屬於自己的財務防線，讓你的每一分錢都有方向。",
  },
];

export const StoryPage = ({ onJoin }: { onJoin: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-24">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-amber-50 border-b border-amber-100 px-5 pt-12 pb-6">
        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.14em] mb-1">
          故事起點
        </div>
        <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.2] tracking-[-0.025em]">
          讓你的錢，<br />為你工作
        </h1>
      </div>

      {/* ── 主體 ── */}
      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* 顧問簡介 card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm"
        >
          {/* 照片占位 */}
          <div className="w-16 h-16 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shrink-0 overflow-hidden">
            <Ic n="user" size={28} color="#d97706" />
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-slate-900 mb-0.5">Steven 理財顧問</div>
            <div className="text-[12px] text-amber-600 font-bold mb-2">認證理財規劃師 CFP · RFP</div>
            <div className="text-[12px] text-slate-500 leading-relaxed">
              專注協助 30–50 歲家庭建立財務防線，走向財務自由。
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="grid grid-cols-3 gap-3"
        >
          {STATS.map((s, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl py-4 text-center shadow-sm">
              <div className="text-[22px] font-extrabold text-slate-900 leading-none">
                {s.val}<span className="text-[13px] font-bold text-amber-500 ml-0.5">{s.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* 認證標籤 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="flex flex-wrap gap-2"
        >
          {CERTS.map((c, i) => (
            <span key={i} className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              {c}
            </span>
          ))}
        </motion.div>

        {/* 故事 Q&A */}
        {STORY_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 + i * 0.08 }}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-full min-h-[20px] bg-amber-400 rounded-full self-stretch" />
              <div className="text-[13px] font-extrabold text-slate-900">{item.q}</div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed pl-3 border-l border-slate-100">
              {item.a}
            </p>
          </motion.div>
        ))}

        {/* 服務對象 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.34 }}
          className="bg-slate-50 border border-slate-100 rounded-xl p-5"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">適合對象</div>
          {[
            "已有收入但不知道錢去哪了",
            "想建立保障但不知從佥開始",
            "希望讓資產穩健增長的你",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
              <div className="w-4 h-4 rounded bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                <Ic n="trend" size={10} color="#d97706" />
              </div>
              <span className="text-[13px] text-slate-600">{t}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── 底部固定 CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 z-50">
        <button
          onClick={onJoin}
          className="w-full bg-amber-400 text-slate-900 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer active:scale-[0.98] transition-transform"
        >
          加入會員，開始你的財務旅程
        </button>
        <div className="text-[10px] text-slate-400 text-center mt-1.5">免費加入 · 不收費</div>
      </div>
    </div>
  );
};
