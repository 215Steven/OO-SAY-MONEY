import { useState, useEffect } from "react";

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface UseLiffReturn {
  profile: LiffProfile | null;
  loading: boolean;
  isDemo: boolean;
}

// ── 設定區 ───────────────────────────────────────────
const LIFF_ID = import.meta.env.VITE_LIFF_ID ?? "YOUR_LIFF_ID_HERE";

// 本機開發時自動啟用 demo 身分（hostname 是 localhost 才會用）
const IS_DEV = typeof window !== "undefined" && window.location.hostname === "localhost";

const DEMO_PROFILE: LiffProfile = {
  userId:      "Udemo_steven_001",
  displayName: "Steven（測試）",
  pictureUrl:  undefined,
};
// ────────────────────────────────────────────────────

export function useLiff(): UseLiffReturn {
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 本機開發 → 直接用 demo 身分，跳過 LIFF
    if (IS_DEV) {
      setProfile(DEMO_PROFILE);
      setLoading(false);
      return;
    }

    // 生產環境 → 用 LIFF SDK
    const init = async () => {
      try {
        const liff = (window as any).liff;
        if (!liff) throw new Error("LIFF SDK not loaded");

        await liff.init({ liffId: LIFF_ID });

        if (liff.isLoggedIn()) {
          const p = await liff.getProfile();
          setProfile({
            userId:      p.userId,
            displayName: p.displayName,
            pictureUrl:  p.pictureUrl,
          });
        }
      } catch (err) {
        console.warn("[useLiff] 初始化失敗，袪客模式：", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return { profile, loading, isDemo: IS_DEV };
}
