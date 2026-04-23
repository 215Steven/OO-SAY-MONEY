import { motion } from "motion/react";
import { Ic } from "@/src/components/Icons";

export const TermsPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-[100dvh] bg-[#F8F8F6] font-sans pb-10">

      <div className="pt-12 pb-6 px-6 relative z-10 w-full max-w-sm mx-auto flex items-center justify-center border-b border-[#EAEAE6]">
        <h1 className="text-[16px] font-serif font-bold text-[#2D2D2A] tracking-widest pb-2">服務條款與隱私權政策</h1>
      </div>

      <div className="px-6 py-8 max-w-[430px] mx-auto text-[#2D2D2A] relative z-10">
        <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-8 mb-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D6D3D1]"></div>
          <h3 className="text-[15px] font-serif font-bold text-[#2D2D2A] mb-5 tracking-widest uppercase">
            服務條款
          </h3>
          <ul className="list-disc pl-4 mb-0 space-y-4 text-[13px] leading-loose font-normal text-[#555] tracking-wide marker:text-[#D6D3D1]">
            <li>會員綁定 LINE 官方帳號後，即可享有專屬服務，並同意提供正確、完整且最新的個人資料。</li>
            <li>會員應妥善保管 LINE 帳號密碼，不得轉讓、出借他人或將本帳號用於任何非法或侵權行為。</li>
            <li>平台有權審核、暫停或終止會員資格或服務內容，並得依法令、LINE 官方政策與平台營運需求隨時修訂條款，修訂後經公告或通知即生效力。</li>
            <li>若違反本條款或 LINE 官方規範，平台得立即取消資格或限制帳號權限。</li>
          </ul>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-8 mb-10 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D6D3D1]"></div>
          <h3 className="text-[15px] font-serif font-bold text-[#2D2D2A] mb-5 tracking-widest uppercase">
            隱私權政策 (含第三方條款)
          </h3>
          <ul className="list-disc pl-4 mb-0 space-y-4 text-[13px] leading-loose font-normal text-[#555] tracking-wide marker:text-[#D6D3D1]">
            <li>在 LINE 會員綁定、登入與互動時，平台僅為會員管理、行銷與客服等目的，蒐集 LINE 帳號資訊 (如 LINE ID、暱稱等) 及平台內互動紀錄。</li>
            <li>會員資料可能在合法且必要範圍內，提供給 LINE 官方平台與本公司合作夥伴 (如技術維運、行銷外包團隊等)，僅限於協助服務、技術支援、訊息推播等特定目的。</li>
            <li>所有合作夥伴均須遵守資訊安全措施及個人資料保護法規。</li>
            <li>除法律規定或經會員明示同意外，資料不得揭露予第三人或合作夥伴、或逾越原定服務目的之使用。</li>
            <li>若第三方系統 (如 LINE 模組/API) 處理個資，亦應遵守其相關政策並予公開。</li>
            <li>會員可隨時依平台程序申請查詢、更正或刪除個資，並保留拒絕推播或後續行銷的權利。</li>
          </ul>
        </div>

        <div className="text-center text-[10px] text-[#8B8A88] font-medium mb-10 uppercase tracking-[0.2em]">
          © 2026 OO SAY MONEY
        </div>

        <button onClick={onBack} className="w-full bg-[#2D2D2A] hover:bg-[#49405E] active:scale-[0.98] cursor-pointer text-[#FFFFFF] font-medium text-[13px] py-4 shadow-sm transition-colors flex justify-center items-center gap-3 tracking-widest uppercase border border-[#2D2D2A]">
           <Ic n="back" color="#FFFFFF" size={16} /> 返回註冊頁面
        </button>
      </div>
    </div>
  )
}
