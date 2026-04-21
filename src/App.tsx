import { useState, useEffect, ReactNode } from "react";
import { useLocation, Route, Switch } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { THEMES, ROLE_META } from "@/src/constants/roles";
import { PublicGrid } from "@/src/pages/PublicGrid";
import { AboutPage } from "@/src/pages/AboutPage";
import { MoneyLanding } from "@/src/pages/MoneyLanding";
import { UnlockPage } from "@/src/pages/UnlockPage";
import { AppointmentPage } from "@/src/pages/AppointmentPage";
import { RoleHome } from "@/src/pages/RoleHome";
import { MoneyTool } from "@/src/pages/MoneyTool";
import { LoginModal } from "@/src/components/LoginModal";
import { TemplatePage } from "@/src/pages/TemplatePage";
import { QuizPage } from "@/src/pages/QuizPage";
import { DefensePage } from "@/src/pages/DefensePage";
import { BlueprintPage } from "@/src/pages/BlueprintPage";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    style={{ minHeight: "100%", width: "100%" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [location, navigate] = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  // MOCK LIFF Init: Read ?role=xxx from URL to simulate deep link from LINE Rich Menu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    if (urlRole && ROLE_META[urlRole]) {
      setRole(urlRole);
      if (location === "/") navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const handlePublic = (key: string) => {
    if (key === "login") { setModal(true); return; }
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
    <div className="max-w-[430px] mx-auto min-h-[100dvh] font-sans relative overflow-x-hidden flex flex-col"
      style={{
        background: role ? THEMES[ROLE_META[role]?.theme||"newMember"].bg : "#f8fafc",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-3 px-5 text-center text-[14px] font-bold text-slate-900 tracking-wide sticky top-0 z-50 shrink-0">
        OO SAY MONEY
        {role && (
          <span className="ml-2 text-[10px] font-bold py-0.5 px-2 rounded-full"
            style={{
              background: THEMES[ROLE_META[role].theme].accent + "10",
              color: THEMES[ROLE_META[role].theme].accent,
            }}
          >
            {ROLE_META[role].label}
          </span>
        )}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            <Route path="/">
              <PageTransition><PublicGrid onSelect={handlePublic} /></PageTransition>
            </Route>
            <Route path="/about">
              <PageTransition><AboutPage onBack={goBack} onJoin={() => setModal(true)} /></PageTransition>
            </Route>
            <Route path="/money">
              <PageTransition><MoneyLanding onBack={goBack} onLogin={() => setModal(true)} /></PageTransition>
            </Route>
            <Route path="/quiz">
              <PageTransition><QuizPage onBack={goBack} onComplete={() => navigate("/appointment")} /></PageTransition>
            </Route>
            <Route path="/unlock">
              <PageTransition><UnlockPage onBack={goBack} onJoin={() => setModal(true)} /></PageTransition>
            </Route>
            <Route path="/appointment">
              <PageTransition><AppointmentPage onBack={goBack} /></PageTransition>
            </Route>
            <Route path="/dashboard">
              <PageTransition>
                {role ? (
                  <RoleHome role={role} onSelect={handleRoleSelect} onLogout={() => { setRole(null); window.history.replaceState({}, "", "/"); navigate("/"); }} />
                ) : (
                  <div className="p-10 text-center text-slate-500">重定向中...</div>
                )}
              </PageTransition>
            </Route>
            <Route path="/tool">
              <PageTransition><MoneyTool onBack={goBack} onBook={() => navigate("/appointment")} /></PageTransition>
            </Route>
            <Route path="/defense"><PageTransition><DefensePage onBack={goBack} role={role} /></PageTransition></Route>
            <Route path="/blueprint"><PageTransition><BlueprintPage onBack={goBack} role={role} /></PageTransition></Route>
            <Route path="/inspire"><PageTransition><TemplatePage title="理財靈感" desc="知識與文章" onBack={goBack} /></PageTransition></Route>
            <Route path="/story"><PageTransition><TemplatePage title="故事起點" desc="認識我們" onBack={goBack} /></PageTransition></Route>
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
                  <h2 className="text-[20px] font-extrabold text-slate-900">Page Not Found</h2>
                  <button onClick={goHome} className="mt-5 py-2 px-4 rounded-full bg-slate-900 text-white cursor-pointer font-bold border-0">回到首頁</button>
                </div>
              </PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </div>

      {modal && <LoginModal onClose={() => setModal(false)} onLogin={handleLogin} />}
    </div>
  );
}
