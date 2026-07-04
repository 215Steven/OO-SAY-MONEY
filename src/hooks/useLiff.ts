import { useState, useEffect } from "react";
import liff from "@line/liff";
import { getLiffIdForPath, getLiffAccessToken } from "@/src/constants/liff";

export const useLiff = () => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // 紀錄入口的 URL，確保 liff.login() 有合乎 LINE 後台設定的回傳網址 (Endpoint URL)
    if (!sessionStorage.getItem('entryUrl')) {
      sessionStorage.setItem('entryUrl', window.location.href);
    }

    const liffId = getLiffIdForPath();

    const initializeLiff = async () => {
      // --- If in iframe (like AI Studio preview), force mock mode to prevent LINE login block ---
      const isInIframe = window.self !== window.top;
      // --- Debug escape hatch: ?mock=1 forces mock mode even at top level, for diagnosing render issues without LINE login ---
      const forceMock = new URLSearchParams(window.location.search).get('mock') === '1';

      if (isInIframe || forceMock) {
        setIsMockMode(true);
        setIsReady(true);
        setTimeout(() => {
          setProfile({
            userId: `mock_line_uid_${Math.random().toString(36).substr(2, 9)}`,
            displayName: `理財好朋友(預覽機)`,
            pictureUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=a855f7'
          });
        }, 800);
        return;
      }

      try {
        await liff.init({ liffId });
        setIsReady(true);

        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          // 如果有記錄登入前想去的路徑，就導向過去
          const pendingRedirect = sessionStorage.getItem('postLoginRedirect');
          if (pendingRedirect && window.location.pathname !== pendingRedirect) {
            document.body.style.opacity = '0'; // 避免畫面閃爍 (隱藏舊畫面)
            sessionStorage.removeItem('postLoginRedirect');
            window.location.replace(window.location.origin + pendingRedirect);
            return;
          }
        } else {
          // If not in iframe and not logged in, auto redirect to login
          const entryUrl = sessionStorage.getItem('entryUrl') || (window.location.origin + '/');
          liff.login({ redirectUri: entryUrl });
        }
      } catch (err: any) {
        console.error("LIFF 初始化失敗", err);
        setError(err.message);
        setIsMockMode(true);
        setIsReady(true);

        // Auto mock profile if init fails
        setTimeout(() => {
          setProfile({
            userId: `mock_line_uid_err_${Math.random().toString(36).substr(2, 9)}`,
            displayName: `理財好朋友(離線模式/出錯)`,
            pictureUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=a855f7'
          });
          alert("LINE LIFF 初始化失敗，或您目前使用的是測試網址。目前已切換為「模擬帳號」！\n(註：此模擬帳號送出的資料將暫無法與您的真實 LINE 連動，請使用正確的連結於 LINE App 內開啟。)");
        }, 800);
      }
    };

    initializeLiff();
  }, []);

  const login = () => {
    if (isMockMode) {
      setTimeout(() => {
        setProfile({
          userId: `mock_line_uid_${Math.random().toString(36).substr(2, 9)}`,
          displayName: `理財好朋友`,
          pictureUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=a855f7'
        });
      }, 800);
      return;
    }

    if (!liff.isLoggedIn()) {
      // 確保登入後的 callback URL 是首次進站的 URL，因為 LINE 後台只有預設註冊那個 Endpoint URL
      const entryUrl = sessionStorage.getItem('entryUrl') || (window.location.origin + '/');
      liff.login({ redirectUri: entryUrl });
    }
  };

  const logout = () => {
    if (isMockMode) {
      setProfile(null);
      return;
    }

    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  };

  /** 已登入時回傳 LIFF access token（mock 模式回傳 null） */
  const getAccessToken = () => (isMockMode ? null : getLiffAccessToken());

  return { liff, isReady, error, profile, login, logout, isMockMode, getAccessToken };
};
