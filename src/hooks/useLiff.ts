import { useState, useEffect } from "react";
import liff from "@line/liff";

export const useLiff = () => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const getLiffId = () => {
      const path = window.location.pathname;
      if (path.includes('/story') || path.includes('/about-us')) return '2007659354-YydM9mE0';
      if (path.includes('/quiz')) return '2007659354-EofSbRGu';
      if (path.includes('/unlock')) return '2007659354-ktfXFigk';
      if (path.includes('/appointment')) return '2007659354-okKabZ27';
      return import.meta.env.VITE_LIFF_ID || "2007659354-RMhoJzrA";
    };

    const liffId = getLiffId();

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
