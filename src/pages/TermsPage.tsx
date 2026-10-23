import { TopBar, PageHeader, SectionLabel, Reveal } from "@/src/components/ui";
import { motion } from "motion/react";

const TERMS = [
  "會員綁定 LINE 官方帳號後，即可享有專屬服務，並同意提供正確、完整且最新的個人資料。",
  "會員應妥善保管 LINE 帳號密碼，不得轉讓、出借他人或將本帳號用於任何非法或侵權行為。",
  "平台有權審核、暫停或終止會員資格或服務內容，並得依法令、LINE 官方政策與平台營運需求隨時修訂條款，修訂後經公告或通知即生效力。",
  "若違反本條款或 LINE 官方規範，平台得立即取消資格或限制帳號權限。",
];

const PRIVACY = [
  "在 LINE 會員綁定、登入與互動時，平台僅為會員管理、行銷與客服等目的，蒐集 LINE 帳號資訊 (如 LINE ID、暱稱等) 及平台內互動紀錄。",
  "會員資料可能在合法且必要範圍內，提供給 LINE 官方平台與本公司合作夥伴 (如技術維運、行銷外包團隊等)，僅限於協助服務、技術支援、訊息推播等特定目的。",
  "所有合作夥伴均須遵守資訊安全措施及個人資料保護法規。",
  "除法律規定或經會員明示同意外，資料不得揭露予第三人或合作夥伴、或逾越原定服務目的之使用。",
  "若第三方系統 (如 LINE 模組/API) 處理個資，亦應遵守其相關政策並予公開。",
  "會員可隨時依平台程序申請查詢、更正或刪除個資，並保留拒絕推播或後續行銷的權利。",
];

const List = ({ items }: { items: string[] }) => (
  <ol className="list-none p-0 m-0 border-t border-warm-gray-800/80">
    {items.map((t, i) => (
      <li key={i} className="flex gap-5 py-5 border-b border-warm-gray-300">
        <span className="font-display text-[13px] tnum text-brass pt-1 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
        <p className="text-[14px] leading-[1.95] text-warm-gray-600">{t}</p>
      </li>
    ))}
  </ol>
);

export const TermsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
    <TopBar onBack={onBack} />
    <PageHeader eyebrow="Terms & privacy" line1="服務條款與" line2="隱私權政策。" />
    <section className="px-6">
      <Reveal><SectionLabel>服務條款</SectionLabel><List items={TERMS} /></Reveal>
    </section>
    <section className="px-6 pt-14">
      <Reveal><SectionLabel>隱私權政策（含第三方條款）</SectionLabel><List items={PRIVACY} /></Reveal>
    </section>
    <div className="px-6 pt-12">
      <motion.button onClick={onBack} whileTap={{ scale: 0.96 }} className="w-full bg-forest text-white py-4 rounded-full text-[14px] font-medium tracking-[0.2em] cursor-pointer hover:bg-cyan-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-gray-50">
        關閉條款
      </motion.button>
    </div>
    <p className="mt-10 pb-10 text-center text-[12px] text-warm-gray-500 tracking-[0.2em]">© 2026 OO SAY MONEY</p>
  </div>
);
