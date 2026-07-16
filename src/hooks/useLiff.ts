import { useState, useEffect } from "react";
import liff from "@line/liff";
import { getLiffIdForPath, getLiffAccessToken } from "@/src/constants/liff";

/**
 * 重要：LIFF 初始化必須是全域單例。
 *
 * 之前的版本中，App.tsx 與 RegisterPage.tsx 各自呼叫一次 useLiff()，
 * 導致 liff.init() 被同一頁面呼叫兩次。切換路由（例如從 "/" 進到
 * "/register"）時，第二個 useLiff 實例會重新檢查網址、重新走一次
 * LIFF 初始化與（未登入時的）liff.login() 導頁流程，和第一個實例互相
 *干擾，在某些情境下會讓畫面卡在空白（因為又觸發了一次導向 LINE
 * 登入的重新導向，或是 SDK 對重複 init 的處理不一致）。
 *
 * 修法：把初始化狀態與流程搬到 module 層級的共用狀態，所有元件呼叫
 * useLiff() 時共用同一份初始化結果，只有第一個掛載的元件會真正執行
 * liff.init()，其餘元件僅訂閱狀態變化。
 */

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
} | null;

type SharedLiffState = {
  isReady: boolean;
  error: string | null;
  profile: LiffProfile;
  isMockMode: boolean;
};

let sharedState: SharedLiffState = {
  isReady: false,
  error: null,
  profile: null,
  isMockMode: false,
};

const listeners = new Set<(state: SharedLiffState) => void>();
let initStarted = false;

function emit(patch: Partial<SharedLiffState>) {
  sharedState = { ...sharedState, ...patch };
  listeners.forEach((listener) => listener(sharedState));
}

function mockProfile(suffix: string, label: string): LiffProfile {
  return {
    userId: `mock_line_uid_${suffix}_${Math.random().toString(36).substr(2, 9)}`,
    displayName: label,
    pictureUrl:
      "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=a855f7",
  };
}

function ensureLiffInitialized() {
  if (initStarted) return;
  initStarted = true;

  // 紀錄入口的 URL，確保 liff.login() 有合乎 LINE 後台設定的回傳網址 (Endpoint URL)。
  // 修法：這裡原本用「若尚未設定過才寫入」的方式，只在同一個 LINE 對話 session 裡
  // 記錄「第一次」進站的網址。但每次點擊 LINE 選單的不同分頁，其實都是全新的一次
  // 網頁載入（sessionStorage 卻會跨這些「各自獨立的載入」延續下來），於是後面幾次
  // 點擊時，entryUrl 一直卡在最早那一頁的網址，沒有跟著更新成「這次」使用者真正要
  // 去的分頁。如果這次載入剛好觸發 liff.login() 重新登入導頁，登入後就會被送回
  // 「舊的那一頁」，而不是這次真正要去的分頁，畫面上就會先閃過不對的頁面才跳轉。
  // 改成「每次載入都覆蓋成當下網址」：由於此時（見下方 resolveDeepLink 的同步
  // history.replaceState 邏輯）網址列已經是這次真正要去的目標頁，之後若真的需要
  // liff.login() 導頁，也才能正確地被送回「這一次」使用者要去的分頁。
  sessionStorage.setItem("entryUrl", window.location.href);

  const liffId = getLiffIdForPath();

  const initializeLiff = async () => {
    // --- If in iframe (like AI Studio preview), force mock mode to prevent LINE login block ---
    const isInIframe = window.self !== window.top;
    // --- Debug escape hatch: ?mock=1 forces mock mode even at top level, for diagnosing render issues without LINE login ---
    const forceMock = new URLSearchParams(window.location.search).get("mock") === "1";

    if (isInIframe || forceMock) {
      emit({ isMockMode: true, isReady: true });
      setTimeout(() => {
        emit({ profile: mockProfile("", "理財好朋友(預覽機)") });
      }, 800);
      return;
    }

    try {
      await liff.init({ liffId });
      emit({ isReady: true });

      if (liff.isLoggedIn()) {
        const userProfile = await liff.getProfile();
        emit({ profile: userProfile });

        // 如果有記錄登入前想去的路徑，就導向過去
        const pendingRedirect = sessionStorage.getItem("postLoginRedirect");
        if (pendingRedirect && window.location.pathname !== pendingRedirect) {
          document.body.style.opacity = "0"; // 避免畫面閃爍 (隱藏舊畫面)
          sessionStorage.removeItem("postLoginRedirect");
          window.location.replace(window.location.origin + pendingRedirect);
          return;
        }
      } else {
        // If not in iframe and not logged in, auto redirect to login
        const entryUrl = sessionStorage.getItem("entryUrl") || window.location.origin + "/";
        liff.login({ redirectUri: entryUrl });
      }
    } catch (err: any) {
      console.error("LIFF 初始化失敗", err);
      emit({ error: err.message, isMockMode: true, isReady: true });

      // Auto mock profile if init fails
      setTimeout(() => {
        emit({ profile: mockProfile("err", "理財好朋友(離線模式/出錯)") });
        alert(
          "LINE LIFF 初始化失敗，或您目前使用的是測試網址。目前已切換為「模擬帳號」！\n(註：此模擬帳號送出的資料將暫無法與您的真實 LINE 連動，請使用正確的連結於 LINE App 內開啟。)"
        );
      }, 800);
    }
  };

  initializeLiff();
}

export const useLiff = () => {
  const [state, setState] = useState<SharedLiffState>(sharedState);

  useEffect(() => {
    listeners.add(setState);
    ensureLiffInitialized();
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const login = () => {
    if (state.isMockMode) {
      setTimeout(() => {
        emit({ profile: mockProfile("", "理財好朋友") });
      }, 800);
      return;
    }

    if (!liff.isLoggedIn()) {
      // 確保登入後的 callback URL 是首次進站的 URL，因為 LINE 後台只有預設註冊那個 Endpoint URL
      const entryUrl = sessionStorage.getItem("entryUrl") || window.location.origin + "/";
      liff.login({ redirectUri: entryUrl });
    }
  };

  const logout = () => {
    if (state.isMockMode) {
      emit({ profile: null });
      return;
    }

    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  };

  /** 已登入時回傳 LIFF access token（mock 模式回傳 null） */
  const getAccessToken = () => (state.isMockMode ? null : getLiffAccessToken());

  return {
    liff,
    isReady: state.isReady,
    error: state.error,
    profile: state.profile,
    login,
    logout,
    isMockMode: state.isMockMode,
    getAccessToken,
  };
};
