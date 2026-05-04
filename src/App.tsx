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
import { RegisterPage } from "@/src/pages/RegisterPage";
import { TermsPage } from "@/src/pages/TermsPage";

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

export default function MainApp() {
  const [location, navigate] = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  // MOCK LIFF Init: Read ?role=xxx or ?path=xxx from URL to simulate deep link from LINE Rich Menu
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
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Switch location={location} key={location}>
            <Route path="/">
              <PageTransition><PublicGrid onSelect={handlePublic} /></PageTransition>
            </Route>
            <Route path="/about">
              <PageTransition><AboutPage onBack={goBack} onJoin={() => navigate("/register")} /></PageTransition>
            </Route>
            <Route path="/money">
              <PageTransition><MoneyLanding onBack={goBack} onLogin={() => navigate("/register")} /></PageTransition>
            </Route>
            <Route path="/quiz">
              <PageTransition><QuizPage onBack={goBack} onComplete={() => navigate("/register")} /></PageTransition>
            </Route>
            <Route path="/unlock">
              <PageTransition><UnlockPage onBack={goBack} onJoin={() => navigate("/register")} /></PageTransition>
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
              <PageTransition><AboutPage onBack={goBack} onJoin={() => navigate("/register")} /></PageTransition>
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
      </div>

      {modal && <LoginModal onClose={() => setModal(false)} onLogin={handleLogin} />}
    </div>
  );
}
