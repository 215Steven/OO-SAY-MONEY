import { CONFIG } from "./config.js";

/** 簡單的 email 格式檢查（嚴格驗證交給 MailerLite double opt-in 確認信） */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * 將訂閱者加入 MailerLite（upsert：已存在則更新）。
 * MailerLite 後台開啟 double opt-in 後，新訂閱者會自動收到確認信，
 * 點擊確認才會轉為 active——這就是信箱正確性的最終驗證。
 * 失敗只記 log，不影響註冊流程。
 */
export async function upsertMailerliteSubscriber(
  email: string,
  name: string
): Promise<boolean> {
  if (!CONFIG.mailerliteApiKey) {
    console.warn("MAILERLITE_API_KEY 未設定，略過電子報訂閱同步");
    return false;
  }
  try {
    const body: any = {
      email,
      fields: { name: name || "" },
    };
    if (CONFIG.mailerliteGroupId) {
      body.groups = [CONFIG.mailerliteGroupId];
    }

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${CONFIG.mailerliteApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`MailerLite 訂閱失敗 (${res.status}):`, errText.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("MailerLite API 呼叫失敗:", e);
    return false;
  }
}
