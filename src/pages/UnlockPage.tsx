import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

const FEATURES = [
  { key: "defense",     label: "財務防線", sub: "保障缺口分析",  icon: "shield",   color: "#f59e0b", bg: "#fffbeb" },
  { key: "money-flow",  label: "錢的流向", sub: "收支財務管家",  icon: "money",    color: "#10b981", bg: "#f0fdf4" },
  { key: "appointment", label: "預約聊聊", sub: "顧問面談預約",  icon: "calendar", color: "#0ea5e9", bg: "#f0f9ff" },
  { key: "about",       label: "認識我們", sub: "服務說明",      icon: "info",     color: "#64748b", bg: "#f8fafc" },
  { key: "inspiration", label: "理財靈感", sub: "精選文章",      icon: "book",     color: "#8b5cf6", bg: "#faf5ff" },
  { key: "blueprint",   label: "起富藍圖", sub: "月配息策略",    icon: "map",      color: "#f59e0b", bg: "#fffbeb" },
];

const BENEFITS = [
  "完全免費，無隱藏費用",
  "個人化財務分析報告",
  "顧問一對一諮詢支援",
  "保障缺口即時計算",
];

export const UnlockPage = ({ onJoin }: { onJoin: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans pb-28">

      {/* ── 頂部標題帶（全寬、無圓角） ── */}
      <div className="bg-sky-50 border-b border-sky-100 px-5 pt-12 pb-6">
        <div className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.14em] mb-1">
          會員專區
        </div>
        <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.2] tracking-[-0.025em]">
          解鎖你的<br />財務中心
        </h1>
        <p className="text-[13px] text-slate-500 mt-2">
          加入會員，六大工具全開放。
        </p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* 六格功能預覽 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            六大專屬功能
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
                className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: f.bg }}
                >
                  <Ic n={f.icon} size={18} color={f.color} />
                </div>
                <div className="text-[13px] font-extrabold text-slate-900 mb-0.5">{f.label}</div>
                <div className="text-[11px] text-slate-400">{f.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            加入後你將獲得
          </div>
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[13px] text-slate-700 font-medium">{b}</span>
            </div>
          ))}
        </motion.div>

        {/* 切換說明 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.42 }}
          className="border border-dashed border-slate-200 rounded-xl p-4 text-center"
        >
          <div className="text-[12px] text-slate-400 leading-relaxed">
            加入後 LINE 圖文選單<br />
            將自動切換為 <span className="font-bold text-slate-600">六格會員選單</span>
          </div>
        </motion.div>
      </div>

      {/* ── 底部固定 CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 z-50">
        <button
          onClick={onJoin}
          className="w-full bg-amber-400 text-slate-900 border-0 rounded-xl py-4 text-[15px] font-extrabold cursor-pointer active:scale-[0.98] transition-transform"
        >
          立即加入會員（免費）
        </button>
        <div className="text-[10px] text-slate-400 text-center mt-1.5">免費 · 3 步驟完成</div>
      </div>
    </div>
  );
};
