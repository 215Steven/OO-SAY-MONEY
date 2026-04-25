import { useState, useEffect } from "react";
import liff from "@line/liff";

export const useLiff = () => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // 從環境變數讀取 LIFF ID (請確保在 Netlify 和 .env 中都有設定 VITE_LIFF_ID)
    const liffId = import.meta.env.VITE_LIFF_ID;
    
    if (!liffId) {
      console.warn("VITE_LIFF_ID 尚未設定！啟用模擬 LINE 登入模式。");
      setIsMockMode(true);
      setIsReady(true);
      return;
    }

    const initializeLiff = async () => {
      try {
        await liff.init({ liffId });
        setIsReady(true);
        
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
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
      liff.login();
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
