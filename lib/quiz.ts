import { lineClient } from "./line.js";
import { getSetting, setSetting } from "./richmenu.js";

export type QuizTypeKey = "guard" | "enjoy" | "anxiety" | "plan";

// 使用者做完測驗後，前端會用 liff.sendMessages() 送出這句話（顯示在使用者
// 自己的對話泡泡），藉此觸發一個真正的 webhook message 事件、換到免費的
// replyToken，我們再用 reply 回一張結果卡（不計入官方帳號每月推播則數）。
// 這個常數同時也寫死在 src/pages/QuizPage.tsx，兩邊要保持一致。
export const QUIZ_RESULT_TRIGGER_TEXT = "我做完了 90 秒財務性格測驗！";

// 這兩個連結對應 src/constants/liff.ts 裡 /quiz、/appointment 的 LIFF ID，
// 沿用前端 QuizPage.tsx 既有的分享連結，維持單一事實來源的精神
// （若日後 LIFF ID 變動，這裡跟前端都要一起改）。
const QUIZ_LIFF_URL = "https://liff.line.me/2007659354-EofSbRGu";
const APPOINTMENT_LIFF_URL = "https://liff.line.me/2007659354-okKabZ27";

// 內容以後端為準（只保留組訊息需要的欄位），不接受前端傳自由文字，
// 避免有心人士拿官方帳號的推播權限發送未經檢查的內容。
const QUIZ_TYPES: Record<
  QuizTypeKey,
  { name: string; color: string; bg: string; tagline: string; hook: string }
> = {
  guard: {
    name: "穩健累積型",
    color: "#2E86AB",
    bg: "#E8F4F9",
    tagline: "重視安全感，其實這是優勢",
    hook: "太保守的問題不是賺不到，而是錢一直在縮水。找到一個本金不減、還有配息的設計，安全感和成長可以同時兼顧。",
  },
  enjoy: {
    name: "成長放大型",
    color: "#E85D04",
    bg: "#FFF0E8",
    tagline: "你有機會走得比別人快",
    hook: "進攻型最常見的問題是追高殺低，不是判斷差，是缺一個系統。有策略的進攻，和衝動的進攻，結果差很多。",
  },
  anxiety: {
    name: "起步探索型",
    color: "#7B2D8B",
    bg: "#F3E8F9",
    tagline: "你不是做不到，只是少了一個開始的方式",
    hook: "先把「我每個月需要多少現金流」算出來，再往回推第一步。模糊的擔憂變成看得見的目標，就不會再拖了。",
  },
  plan: {
    name: "策略進化型",
    color: "#2A9068",
    bg: "#EDF7F2",
    tagline: "你已經在正確路上，差的是一個整合策略",
    hook: "同樣的資金，不同的配置方式，10 年後的結果可以差非常多，值得做一次策略校準。",
  },
};

export function isValidQuizType(key: unknown): key is QuizTypeKey {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(QUIZ_TYPES, key);
}

function buildResultUrl(winner: QuizTypeKey, subType?: QuizTypeKey | null): string {
  const r = subType ? `${winner}-${subType}` : winner;
  return `${QUIZ_LIFF_URL}?r=${encodeURIComponent(r)}`;
}

export function buildQuizResultFlex(winner: QuizTypeKey, subType?: QuizTypeKey | null) {
  const main = QUIZ_TYPES[winner];
  const sub = subType ? QUIZ_TYPES[subType] : null;

  const bodyContents: any[] = [
    { type: "text", text: "💡 90 秒財務性格測驗", size: "xs", weight: "bold", color: "#8B8A88" },
    { type: "separator", margin: "md", color: "#E5E0DA" },
    { type: "text", text: "你的財務性格是", size: "xs", color: "#8B8A88", margin: "lg" },
    { type: "text", text: main.name, size: "xxl", weight: "bold", color: main.color, margin: "sm" },
    { type: "text", text: main.tagline, size: "sm", color: "#555555", margin: "sm", wrap: true },
  ];
  if (sub) {
    bodyContents.push({
      type: "text",
      text: `副屬性格：${sub.name}`,
      size: "xs",
      color: "#777777",
      margin: "md",
    });
  }
  bodyContents.push({
    type: "box",
    layout: "vertical",
    margin: "lg",
    paddingAll: "12px",
    backgroundColor: "#FFFFFF",
    cornerRadius: "12px",
    contents: [
      { type: "text", text: "你可能不知道", size: "xxs", weight: "bold", color: main.color },
      { type: "text", text: main.hook, size: "xs", color: "#555555", wrap: true, margin: "sm" },
    ],
  });

  return {
    type: "flex" as const,
    altText: `你的財務性格是「${main.name}」，完整結果已送達`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        backgroundColor: main.bg,
        contents: bodyContents,
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: main.color,
            action: { type: "uri", label: "查看完整結果", uri: buildResultUrl(winner, subType) },
          },
          {
            type: "button",
            style: "link",
            action: { type: "uri", label: "預約免費財務健診", uri: APPOINTMENT_LIFF_URL },
          },
        ],
      },
    },
  };
}

/**
 * 把測驗結果推播到使用者與官方帳號的對話中（Flex Message）。
 * 注意：這走的是 push message，會計入官方帳號每月訊息則數（免費方案目前
 * 每月 200 則），不是走 webhook 的 reply（reply 不計費，但需要即時
 * replyToken，這裡的測驗完成時機不在 webhook 事件當下，沒有可用的
 * replyToken，所以只能用 push）。失敗只記 log，不影響前端結果頁顯示。
 */
export async function pushQuizResultMessage(
  userId: string,
  winner: QuizTypeKey,
  subType?: QuizTypeKey | null
): Promise<boolean> {
  try {
    const flex = buildQuizResultFlex(winner, subType);
    await lineClient.pushMessage({ to: userId, messages: [flex as any] });
    return true;
  } catch (e: any) {
    console.warn("推播測驗結果訊息失敗：", e?.message || e);
    return false;
  }
}

/**
 * 暫存「這個使用者最新一次的測驗結果」，供 webhook 收到
 * QUIZ_RESULT_TRIGGER_TEXT 觸發訊息時查回來用免費的 reply 回覆。
 * 沿用既有的 Notion 設定資料庫（OOSAYMONEY_AppSettings）當簡易 KV store。
 */
export async function stashPendingQuizResult(
  userId: string,
  winner: QuizTypeKey,
  subType?: QuizTypeKey | null
): Promise<void> {
  await setSetting(`quizResult:${userId}`, subType ? `${winner}-${subType}` : winner);
}

export async function getPendingQuizResult(
  userId: string
): Promise<{ winner: QuizTypeKey; subType: QuizTypeKey | null } | null> {
  const raw = await getSetting(`quizResult:${userId}`);
  if (!raw) return null;
  const [w, s] = raw.split("-");
  if (!isValidQuizType(w)) return null;
  return { winner: w, subType: isValidQuizType(s) ? s : null };
}
