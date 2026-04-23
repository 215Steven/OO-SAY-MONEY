import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const UnlockPage = ({ onBack, onJoin }: any) => (
  <div className="min-h-[100dvh] pb-12 flex flex-col relative bg-[#F8F8F6] items-center">
    
    <div className="pt-8 px-6 pb-6 flex flex-col items-center w-full max-w-sm">
      
      <div className="flex items-center justify-start w-full mb-8">
        <button onClick={onBack} className="bg-[#FFFFFF] border border-[#EAEAE6] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#F2F2F0] transition-colors">
          <Ic n="back" color="#2D2D2A" size={20} />
        </button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center w-full">
        <div className="inline-block text-[10px] font-medium text-[#8B8A88] tracking-[0.2em] mb-4 uppercase border border-[#EAEAE6] px-3 py-1 bg-[#FFFFFF]">
          MEMBERSHIP
        </div>
        <div className="text-[28px] font-serif font-bold text-[#2D2D2A] leading-[1.4] tracking-wider mb-4">
          解鎖更多，<br/>走向財務自由
        </div>
        <div className="text-[13px] text-[#2D2D2A] leading-loose font-normal px-5 tracking-widest inline-block border-l px-4 border-[#D6D3D1]">
          加入會員，獲得專屬工具、知識與一對一諮詢機會
        </div>
      </motion.div>
    </div>
    
    <div className="px-5 flex flex-col gap-4 w-full max-w-sm pt-4">
      {[
        { icon:"chart",    title:"財管家完整版",  desc:"儲蓄率、保障缺口、財務自由進度——數字化你的財務全貌" },
        { icon:"book",     title:"理財靈感庫",    desc:"精選文章、知識卡片、定期更新的理財觀點" },
        { icon:"calendar", title:"預約聊聊",      desc:"一對一免費初談，找到適合你的財務規劃起點" },
        { icon:"shield",   title:"財務防線健檢",  desc:"保障缺口分析，確認你的風險防護是否足夠" },
        { icon:"map",      title:"啟富藍圖",      desc:"從現況到目標，規劃你的財務自由路線" },
        { icon:"star",     title:"最新動態",      desc:"市場資訊、財務規劃建議、即時通知" },
      ].map((item, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
          key={item.title} 
          className="bg-[#FFFFFF] p-6 flex items-start gap-5 border border-[#EAEAE6] hover:bg-[#F9F9F8] transition-colors"
        >
          <div className="w-10 h-10 border border-[#EAEAE6] bg-[#F2F2F0] flex items-center justify-center shrink-0">
            <Ic n={item.icon} size={20} color="#2D2D2A" />
          </div>
          <div className="pt-0.5">
            <div className="text-[16px] font-serif font-bold text-[#2D2D2A] tracking-wider mb-2">{item.title}</div>
            <div className="text-[13px] text-[#8B8A88] leading-loose font-normal tracking-wide">{item.desc}</div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-[#2D2D2A] p-10 mt-6 text-center">
        <h3 className="text-[18px] font-serif font-bold text-[#FFFFFF] mb-3 tracking-widest">免費加入，馬上體驗</h3>
        <p className="text-[13px] text-[#AFAEA9] font-normal mb-8 leading-relaxed tracking-wide">透過 LINE 授權註冊，選擇您的身份<br/>即刻解鎖完整會員功能</p>
        <button onClick={onJoin} className="w-full bg-[#FFFFFF] text-[#2D2D2A] border border-[#FFFFFF] py-4 text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-[#EAEAE6] transition-colors flex justify-center items-center gap-2">
           登入 / 註冊會員 <Ic n="arrowRight" size={16} color="currentColor" />
        </button>
      </motion.div>
    </div>
  </div>
);
