import { useState, useEffect } from "react";
import liff from "@line/liff";

export const useLiff = () => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // 從環境變數讀取 LIFF ID (請確保在 Netlify 和 .env 中都有設定 VITE_LIFF_ID)
    const liffId = import.meta.env.VITE_LIFF_ID;
    
    if (!liffId) {
      console.warn("VITE_LIFF_ID 尚未設定！無法初始化 LIFF。");
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
      }
    };

    initializeLiff();
  }, []);

  const login = () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  };

  return { liff, isReady, error, profile, login, logout };
};
