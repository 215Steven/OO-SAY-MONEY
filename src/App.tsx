import { useState, useEffect, lazy, Suspense, ReactNode, ComponentType, Component } from "react";
import { useLocation, Route, Switch } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { THEMES, ROLE_META } from "@/src/constants/roles";
import { LoginModal } from "@/src/components/LoginModal";
import { useLiff } from "@/src/hooks/useLiff";

type EBState = { hasError: boolean };
class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.error("頁面渲染錯誤，已攔截避免白屏:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center min-h-[100dvh] flex flex-col items-center justify-center gap-4">
          <h2 className="text-[18px] font-serif font-bold text-warm-gray-800">頁面發生問題</h2>
          <p className="text-[13px] text-warm-gray-500">請重新整理或稍後再試一次</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="mt-2 py-3 px-6 bg-teal-base text-white cursor-pointer font-medium tracking-widest text-[13px] uppercase rounded-2xl"
          >
            重新整理
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 頁面採 lazy 載入做 code splitting，改善 LIFF 首屏載入速度
const lazyPage = <T extends Record<string, any>>(
  loader: () => Promise<T>,
  name: keyof T
) => lazy(() => loader().then((m) => ({ default: m[name] as ComponentType<any> })));

const PublicGrid = lazyPage(() => import("@/src/pages/PublicGrid"), "PublicGrid");
const AboutPage = lazyPage(() => import("@/src/pages/AboutPage"), "AboutPage");
const MoneyLanding = lazyPage(() => import("@/src/pages/MoneyLanding"), "MoneyLanding");
const UnlockPage = lazyPage(() => import("@/src/pages/UnlockPage"), "UnlockPage");
const AppointmentPage = lazyPage(() => import("@/src/pages/AppointmentPage"), "AppointmentPage");
const RoleHome = lazyPage(() => import("@/src/pages/RoleHome"), "RoleHome");
const MoneyTool = lazyPage(() => import("@/src/pages/MoneyTool"), "MoneyTool");
const TemplatePage = lazyPage(() => import("@/src/pages/TemplatePage"), "TemplatePage");
const QuizPage = lazyPage(() => import("@/src/pages/QuizPage"), "QuizPage");
const DefensePage = lazyPage(() => import("@/src/pages/DefensePage"), "DefensePage");
const BlueprintPage = lazyPage(() => import("@/src/pages/BlueprintPage"), "BlueprintPage");
const RegisterPage = lazyPage(() => import("@/src/pages/RegisterPage"), "RegisterPage");
const TermsPage = lazyPage(() => import("@/src/pages/TermsPage"), "TermsPage");

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="w-full min-h-[100dvh] bg-[#f8f8f6]"
  >
    {children}
  </motion.div>
);

const RouteWithRegister = ({ component: Component, goBack, navigate, handleLogin, ...props }: any) => {
  const [showReg, setShowReg] = useState(false);

  if (showReg) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-[100dvh]">
        <RegisterPage
          onBack={() => { window.scrollTo(0, 0); setShowReg(false); }}
          onTerms={() => navigate("/terms")}
          onSubmitSuccess={() => { setShowReg(false); handleLogin("newMember"); }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-[100dvh]">
       <Component
         onBack={goBack}
         {...props}
         onJoin={() => { window.scrollTo(0, 0); setShowReg(true); }}
         onComplete={() => { window.scrollTo(0, 0); setShowReg(true); }}
         onLogin={() => { window.scrollTo(0, 0); setShowReg(true); }}
       />
    </motion.div>
  );
};

export default function MainApp() {
  const [location, navigate] = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  const { isReady, profile, isMockMode, getAccessToken } = useLiff();

  // Handle Notion validation and LINE rich menu (身分由後端依 access token 驗證)
  useEffect(() => {
    if (isReady && profile?.userId && !isMockMode) {
      const token = getAccessToken();
      if (!token) return;
      fetch("/api/check-member", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.isMember) setRole("newMember");
        })
        .catch(err => console.error("Check member error:", err));
    }
  }, [isReady, profile?.userId, isMockMode]);

  // Read ?role=xxx or ?path=xxx from URL to simulate deep link from LINE Rich Menu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    const urlPath = params.get("path");

    if (urlRole && ROLE_META[urlRole]) {
      setRole(urlRole);
      if (location === "/") navigate("/dashboard", { replace: true });
    } else if (urlPath) {
       navigate(urlPath, { replace: true });
    }
  }, [location, navigate]);

  // 修法：AnimatePresence 搭配 mode="wait" 在「頁面掛載後的第一次」路由切換時，
  // 有機率吃掉那次的進出場動畫排程，導致畫面卡在舊頁面沒有切換（使用者點擊
  // 「前往註冊 / 登入」等按鈕，網址列變了，畫面卻停在原地，看起來像沒反應
  // 或空白）。改用獨立的 useEffect 監聽 location 變化來捲動置頂，不再依賴
  // AnimatePresence 的 onExitComplete，降低對其內部排程時機的依賴。
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handlePublic = (key: string) => {
    if (key === "login") { navigate("/register"); return; } // or we can keep login modal, but new users go to register
    navigate(`/${key}`);
  };

  const handleLogin = (r: string) => {
    setRole(r);
    setModal(false);
    // Simulate updating URL so copy-pasting the link opens the correct role
    window.history.replaceState({}, "", `?role=${r}`);
    navigate("/dashboard");
  };

  const handleRoleSelect = (key: string) => {
    if (key === "money_tool") navigate("/tool");
    else if (key === "book" || key === "chat") navigate("/appointment");
    else navigate(`/${key}`); // Added fallback route for newly created pages
  };

  const goHome = () => navigate(role ? "/dashboard" : "/");
  const goBack = () => window.history.length > 1 ? window.history.back() : goHome();

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] font-sans relative flex flex-col"
      style={{
        background: role ? THEMES[ROLE_META[role]?.theme||"newMember"].bg : "#F8F8F6",
      }}
    >


      <div className="flex-1 w-full bg-[#f8f8f6]">
        <ErrorBoundary>
        <Suspense fallback={<div className="p-10 text-center text-slate-400 font-medium">載入中…</div>}>
        <AnimatePresence>
          <Switch location={location} key={location}>
            <Route path="/">
              <PageTransition><PublicGrid onSelect={handlePublic} /></PageTransition>
            </Route>
            <Route path="/about">
              <PageTransition><RouteWithRegister component={AboutPage} goBack={goBack} navigate={navigate} handleLogin={handleLogin} /></PageTransition>
            </Route>
            <Route path="/money">
              <PageTransition><RouteWithRegister component={MoneyLanding} goBack={goBack} navigate={navigate} handleLogin={handleLogin} /></PageTransition>
            </Route>
            <Route path="/quiz">
              <PageTransition><RouteWithRegister component={QuizPage} goBack={goBack} navigate={navigate} handleLogin={handleLogin} /></PageTransition>
            </Route>
            <Route path="/unlock">
              <PageTransition><RouteWithRegister component={UnlockPage} goBack={goBack} navigate={navigate} handleLogin={handleLogin} /></PageTransition>
            </Route>
            <Route path="/appointment">
              <PageTransition><AppointmentPage onBack={goBack} /></PageTransition>
            </Route>
            <Route path="/register">
              <PageTransition><RegisterPage onBack={goBack} onTerms={() => navigate("/terms")} onSubmitSuccess={() => handleLogin("newMember")} /></PageTransition>
            </Route>
            <Route path="/terms">
              <PageTransition><TermsPage onBack={goBack} /></PageTransition>
            </Route>
            <Route path="/dashboard">
              <PageTransition>
                {role ? (
                  <RoleHome role={role} onSelect={handleRoleSelect} onLogout={() => { setRole(null); window.history.replaceState({}, "", "/"); navigate("/"); }} />
                ) : (
                  <div className="p-10 text-center text-slate-500 font-medium">重定向中...</div>
                )}
              </PageTransition>
            </Route>
            <Route path="/tool">
              <PageTransition><MoneyTool onBack={goBack} onBook={() => navigate("/appointment")} /></PageTransition>
            </Route>
            <Route path="/defense"><PageTransition><DefensePage onBack={goBack} role={role} /></PageTransition></Route>
            <Route path="/blueprint"><PageTransition><BlueprintPage onBack={goBack} role={role} /></PageTransition></Route>
            <Route path="/inspire"><PageTransition><TemplatePage title="理財靈感" desc="知識與文章" onBack={goBack} /></PageTransition></Route>
            <Route path="/story">
              <PageTransition><RouteWithRegister component={AboutPage} goBack={goBack} navigate={navigate} handleLogin={handleLogin} /></PageTransition>
            </Route>
            <Route path="/news"><PageTransition><TemplatePage title="最新動態" desc="最新消息與市場動態" onBack={goBack} /></PageTransition></Route>
            <Route path="/plan"><PageTransition><TemplatePage title="啟富計劃" desc="我的財務規劃" onBack={goBack} /></PageTransition></Route>
            <Route path="/notes"><PageTransition><TemplatePage title="理財筆記" desc="文章與資源" onBack={goBack} /></PageTransition></Route>
            <Route path="/value"><PageTransition><TemplatePage title="核心價值" desc="服務理念" onBack={goBack} /></PageTransition></Route>
            <Route path="/protection"><PageTransition><TemplatePage title="我的保障" desc="保單管理" onBack={goBack} /></PageTransition></Route>
            <Route path="/demo"><PageTransition><TemplatePage title="範例操作" desc="示範流程" onBack={goBack} /></PageTransition></Route>
            <Route path="/config"><PageTransition><TemplatePage title="多重配置" desc="資產配置方案" onBack={goBack} /></PageTransition></Route>
            <Route path="/about-us"><PageTransition><TemplatePage title="認識我們" desc="品牌介紹" onBack={goBack} /></PageTransition></Route>
            <Route path="/email"><PageTransition><TemplatePage title="訂閱電子報" desc="定期資訊" onBack={goBack} /></PageTransition></Route>
            <Route>
              <PageTransition>
                <div className="p-10 text-center">
                  <h2 className="text-[20px] font-serif font-extrabold text-warm-gray-800">Page Not Found</h2>
                  <button onClick={goHome} className="mt-5 py-3 px-6 bg-teal-base text-white cursor-pointer font-medium tracking-widest text-[13px] uppercase border hover:bg-[#1A1A18] transition-colors">回到首頁</button>
                </div>
              </PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
        </Suspense>
        </ErrorBoundary>
      </div>

      {modal && <LoginModal onClose={() => setModal(false)} onLogin={handleLogin} />}
    </div>
  );
}
