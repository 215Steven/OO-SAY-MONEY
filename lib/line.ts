import type { Request } from "express";
import { messagingApi, validateSignature } from "@line/bot-sdk";
import { CONFIG } from "./config.js";

const { MessagingApiClient } = messagingApi;

export const lineClient = new MessagingApiClient({
  channelAccessToken: CONFIG.lineChannelAccessToken || "mock_token",
});

/**
 * 驗證 LINE Webhook 簽章。
 * 優先使用 raw body；若執行環境（如 Vercel helper）已先解析 body 而拿不到
 * raw bytes，退而用 re-serialize 的 JSON 驗證。
 */
export function verifyWebhookSignature(req: Request): boolean {
  if (!CONFIG.lineChannelSecret) {
    // 沒有 secret 無從驗證：保留原行為避免服務中斷，但大聲警告。
    console.warn(
      "[SECURITY] LINE_CHANNEL_SECRET 未設定，跳過 webhook 簽章驗證！請盡快到 Vercel 補上。"
    );
    return true;
  }
  const signature = req.get("x-line-signature");
  if (!signature) return false;

  const rawBody: Buffer | undefined = (req as any).rawBody;
  if (rawBody && validateSignature(rawBody, CONFIG.lineChannelSecret, signature)) {
    return true;
  }
  // Fallback：LINE 送出的 JSON 為 compact 格式，多數情況 re-serialize 後位元組相同
  const reserialized = JSON.stringify(req.body);
  return validateSignature(reserialized, CONFIG.lineChannelSecret, signature);
}

/**
 * 從 Authorization: Bearer <LIFF access token> 驗證並取得真實的 LINE userId。
 * 一律以 LINE 平台驗證結果為準，不信任前端自行傳入的 userId。
 */
export async function getVerifiedUserId(req: Request): Promise<string | null> {
  const auth = req.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;

  try {
    const verifyRes = await fetch(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(token)}`
    );
    if (!verifyRes.ok) return null;
    const verified: any = await verifyRes.json();
    if (!verified.expires_in || verified.expires_in <= 0) return null;
    // 若有設定 LINE_CHANNEL_ID，進一步確認 token 是簽發給本服務的
    if (CONFIG.lineChannelId && verified.client_id !== CONFIG.lineChannelId) {
      console.warn("Token client_id mismatch:", verified.client_id);
      return null;
    }

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok) return null;
    const profile: any = await profileRes.json();
    return profile.userId || null;
  } catch (e) {
    console.error("LIFF token 驗證失敗:", e);
    return null;
  }
}
