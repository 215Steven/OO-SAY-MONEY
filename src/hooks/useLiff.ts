import { useState, useEffect } from "react";
import liff from "@line/liff";

export const useLiff = () => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const getInitialLiffId = () => {
      // 紀錄入口的 URL，確保 liff.login() 有合乎 LINE 後台設定的回傳網址 (Endpoint URL)
      if (!sessionStorage.getItem('entryUrl')) {
        sessionStorage.setItem('entryUrl', window.location.href);
      }

      // 1. 如果有存過就直接用，確保 SPA 切換頁面時 liffId 是一致的
      const savedLiffId = sessionStorage.getItem('currentLiffId');
      if (savedLiffId) return savedLiffId;

      // 2. 根據首次載入的路徑判斷 (來自 LINE 選單的不同按鈕)
      const path = window.location.pathname;
      let matchedId = "2007659354-RMhoJzrA"; // fallback (解鎖更多)
      
      if (path.includes('/story') || path.includes('/about-us')) {
        matchedId = '2007659354-YydM9mE0';
      } else if (path.includes('/quiz')) {
        matchedId = '2007659354-EofSbRGu';
      } else if (path.includes('/unlock')) {
        matchedId = '2007659354-ktfXFigk';
      } else if (path.includes('/appointment')) {
        matchedId = '2007659354-okKabZ27';
      }

      // 3. 記住這次的 LIFF ID
      sessionStorage.setItem('currentLiffId', matchedId);
      return matchedId;
    };

    const liffId = getInitialLiffId();

    const initializeLiff = async () => {
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
        }
      } catch (err: any) {
        console.error("LIFF 初始化失敗", err);
        setError(err.message);
        setIsMockMode(true);
        setIsReady(true);
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

  return { liff, isReady, error, profile, login, logout, isMockMode };
};
