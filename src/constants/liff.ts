import liff from "@line/liff";

// LIFF ID 依入口路徑對應（LINE 選單各按鈕使用不同 LIFF app）
// LIFF ID 為公開識別碼（會出現在網址中），非機密。
const LIFF_ID_BY_PATH: Array<{ match: string[]; id: string }> = [
  { match: ["/story", "/about-us"], id: "2007659354-YydM9mE0" },
  { match: ["/quiz"], id: "2007659354-EofSbRGu" },
  { match: ["/unlock"], id: "2007659354-ktfXFigk" },
  { match: ["/appointment"], id: "2007659354-okKabZ27" },
];

const DEFAULT_LIFF_ID = "2007659354-RMhoJzrA"; // fallback（解鎖更多）

/**
 * 取得本次 session 使用的 LIFF ID。
 * 首次進站依路徑決定並存入 sessionStorage，之後 SPA 切頁維持一致。
 */
export function getLiffIdForPath(): string {
  const saved = sessionStorage.getItem("currentLiffId");
  if (saved) return saved;

  const path = window.location.pathname;
  const matched =
    LIFF_ID_BY_PATH.find((e) => e.match.some((m) => path.includes(m)))?.id ||
    DEFAULT_LIFF_ID;

  sessionStorage.setItem("currentLiffId", matched);
  return matched;
}

/** 已登入時回傳 LIFF access token，供呼叫後端 API 驗證身分使用 */
export function getLiffAccessToken(): string | null {
  try {
    return liff.isLoggedIn() ? liff.getAccessToken() : null;
  } catch {
    return null;
  }
}

/** 呼叫後端 API 時附上的驗證 header */
export function authHeaders(): Record<string, string> {
  const token = getLiffAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
