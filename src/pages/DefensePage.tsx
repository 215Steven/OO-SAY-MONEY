import { Ic } from "@/src/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { TopBar, PageHeader, SectionLabel, CtaBlock, Reveal, SPRING } from "@/src/components/ui";
import { LINE_BOOK_URL, openLine } from "@/src/constants/links";
import { useState } from "react";

const DEFENSE_SECTIONS = [

  {
    id: "life",
    icon: "user",
    title: "壽險 · 意外險",
    desc: "家人的最後一道防線",
    points: [
      "壽險提供身故保障，確保萬一發生意外，家人的生活不會因此崩潰",
      "意外險針對意外傷亡、失能提供保障，保費相對低廉但保額高",
      "定期壽險 vs 終身壽險：年輕時用定期壽險以低保費換高保額，是最划算的選擇",
      "失能扶助險近年需求大增，長期失能帶來的財務衝擊往往比死亡更大"
    ],
    highlightLabel: "Steven & Annie 的觀點",
    highlight: "有家庭負擔的人，壽險保額至少要能覆蓋 5–10 年的家庭支出，才算真正有保障。"
  },
  {
    id: "medical",
    icon: "trend",
    title: "醫療險 · 重大疾病",
    desc: "別讓生病拖垮財務",
    points: [
      "實支實付醫療險：住院、手術費用直接理賠，是現代醫療保障的核心",
      "重大傷病險：一旦確診重大傷病，直接一次給付，讓你專心治療不必擔心費用",
      "癌症險：台灣癌症發生率高，自費新藥、標靶治療動輒百萬，癌症險是不可或缺的補充",
      "日額型 vs 實支型：實支型通常更實用，日額型可作為額外生活補貼"
    ],
    highlightLabel: "常見誤區",
    highlight: "只有健保不夠。健保給付是基本款，自費項目逐年增加，沒有補充醫療險，住一次院可能就掏空儲蓄。"
  },
  {
    id: "investment",
    icon: "chart",
    title: "投資型保單",
    desc: "保障與理財兼顧，但要看清楚",
    points: [
      "投資型保單兼具壽險保障與投資功能，保費分為保障費用與投資帳戶兩部分",
      "變額壽險：投資標的連結基金，報酬浮動，適合願意承擔風險、長期投資的人",
      "利率變動型壽險：宣告利率高於定存，適合追求穩健收益的保守型投資人",
      "注意費用結構：前置費用、保單管理費、危險保費會影響實際報酬，要看清楚"
    ],
    highlightLabel: "我們的建議",
    highlight: "投資型保單不是所有人都適合，要先確保基礎保障到位，再考慮是否納入資產配置。"
  },
  {
    id: "property",
    icon: "shield",
    title: "產險 · 車險 · 旅遊險",
    desc: "日常生活的風險轉移",
    points: [
      "強制險是法定最低門檻，第三人責任險才是真正保護你荷包的關鍵",
      "車體險：甲式（全險）、乙式、丙式各有適用情境，不是越貴越好",
      "旅遊平安險：出國必備，醫療費用、緊急撤離費用動輒數十萬，不能省",
      "火險 / 住宅綜合險：房貸族通常只保銀行要求的火險，室內裝潢、家具另需補充"
    ],
    highlightLabel: "出發前記得",
    highlight: "信用卡附贈的旅遊險保障有限，且需刷卡購買機票才生效。出國前確認保障內容，不要等到出事才發現沒保到。"
  }
];

const WHY_STATS = [
  { num: "1/3", text: "台灣人一生中罹患重大疾病的機率超過三分之一，醫療費用動輒百萬起跳" },
  { num: "76%", text: "上班族保險保障嚴重不足，多數人只靠勞保、健保撐著一切" },
  { num: "20年", text: "一張買錯的保單，二十年後可能讓你多花數十萬、卻什麼都沒保到" }
];

// 這頁是給所有人看的通用保險衛教內容，不涉及任何個人資料。
// 若要查自己名下的實際保單，請到「我的保障」（/protection），
// 那頁會依登入者身分抓 Notion 裡的真實保單資料。
export const DefensePage = ({ onBack }: { onBack: () => void }) => {
  const [openSection, setOpenSection] = useState<string | null>("life");
  const toggleSection = (id: string) => setOpenSection(prev => (prev === id ? null : id));

  return (
    <div className="min-h-[100dvh] bg-warm-gray-50 pb-6">
      <TopBar />
      <PageHeader eyebrow="Protection basics" line1="財務" line2="防線。" desc="用對的保險守住你最重要的東西，避免突發事件拖垮財務。" />

      {/* 為什麼需要保險：大數字清單 */}
      <section className="px-6">
        <SectionLabel>為什麼需要保險</SectionLabel>
        <div className="border-t border-warm-gray-800/80">
          {WHY_STATS.map((stat, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="flex items-start gap-5 py-6 border-b border-warm-gray-300">
                <div className="font-display text-[34px] font-light text-brass tnum leading-none w-[84px] shrink-0">{stat.num}</div>
                <p className="text-[14px] text-warm-gray-600 leading-[1.9] pt-0.5">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 保險地圖：手風琴 */}
      <section className="px-6 pt-16">
        <SectionLabel>保險地圖</SectionLabel>
        <div className="border-t border-warm-gray-800/80">
          {DEFENSE_SECTIONS.map((section, i) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="border-b border-warm-gray-300">
                <button
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start gap-5 py-6 text-left cursor-pointer outline-none focus-visible:bg-warm-gray-100"
                >
                  <span className="flex-1">
                    <span className="block font-serif text-[21px] font-semibold text-warm-gray-800 tracking-wide">{section.title}</span>
                    <span className="block mt-1 text-[13px] text-warm-gray-600">{section.desc}</span>
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={SPRING} className="pt-1.5 text-warm-gray-800">
                    <Ic n="arrow" size={20} color="currentColor" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="pl-11 pb-8">
                        <ul className="list-none p-0 m-0 flex flex-col gap-4">
                          {section.points.map((pt, j) => (
                            <li key={j} className="flex gap-3 text-[14px] text-warm-gray-600 leading-[1.9]">
                              <span className="w-1 h-1 rounded-full bg-brass shrink-0 mt-[0.85rem]" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 border-l-2 border-brass pl-4">
                          <div className="text-[12px] tracking-[0.2em] text-brass mb-2">{section.highlightLabel}</div>
                          <p className="text-[14px] text-warm-gray-800 leading-[1.9]">{section.highlight}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBlock
        title="免費保障健診"
        desc="不確定自己保了什麼、缺了什麼？直接在 LINE 跟我們說，20 分鐘幫你看清楚。"
        primary="在 LINE 預約聊聊"
        onPrimary={() => openLine(LINE_BOOK_URL)}
        note="免費諮詢 · 無推銷壓力"
      />
      <p className="px-8 mt-8 pb-10 text-[12px] text-warm-gray-500 text-center tracking-wide leading-relaxed">內容為一般性保險說明，不構成購買建議，實際保障以保單條款為準。</p>
    </div>
  );
};
