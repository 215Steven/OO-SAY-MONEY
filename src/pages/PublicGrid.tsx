import { Ic } from "@/src/components/Icons";
import { motion } from "motion/react";

export const PublicGrid = ({ onSelect }: { onSelect: (k: string) => void }) => {
  const items = [
    { key:"about",  label:"認識我們", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"info",  sub:"財務規劃的起點" },
    { key:"money",  label:"錢都去哪", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"money", sub:"2分鐘財務測驗" },
    { key:"unlock", label:"解鎖更多", bg:"bg-[#F9F9F8]", text:"text-[#2D2D2A]", icon:"star",  sub:"會員專屬資源" },
  ];
  return (
    <div className="min-h-[100dvh] pb-12 flex flex-col relative bg-[#F8F8F6] items-center">
      
      {/* Header Greeting */}
      <div className="pt-8 px-6 pb-6 flex flex-col items-center w-full max-w-sm">
        <div className="w-[64px] h-[64px] bg-[#FFFFFF] border border-[#EAEAE6] mx-auto flex items-center justify-center mb-6">
           <Ic n="star" size={24} color="#2D2D2A" />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center w-full">
          <div className="text-[28px] font-serif font-bold text-[#2D2D2A] leading-[1.4] tracking-wider mb-4">
            你好，歡迎來到<br/>
            OO SAY MONEY
          </div>
          <div className="text-[13px] text-[#2D2D2A] leading-loose font-normal px-5 tracking-widest inline-block border-l px-4 border-[#D6D3D1]">
            加入會員，解鎖專屬理財資源與工具。
          </div>
        </motion.div>
      </div>
      
      {/* 3-Grid Actions */}
      <div className="px-5 flex flex-col gap-4 w-full max-w-sm pt-4">
        {items.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
            key={item.key} onClick={() => onSelect(item.key)} 
            className="bg-[#FFFFFF] p-6 flex items-start gap-5 border border-[#EAEAE6] hover:bg-[#F9F9F8] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 border border-[#EAEAE6] bg-[#F2F2F0] flex items-center justify-center shrink-0 group-hover:bg-[#FFFFFF] transition-colors">
              <Ic n={item.icon} size={20} color="#2D2D2A" />
            </div>
            <div className="pt-0.5 flex-1">
              <div className="text-[16px] font-serif font-bold text-[#2D2D2A] tracking-wider mb-2">{item.label}</div>
              <div className="text-[13px] text-[#8B8A88] leading-loose font-normal tracking-wide">{item.sub}</div>
            </div>
            <div className="pt-2">
              <div className="w-6 h-6 flex items-center justify-center text-[#8B8A88] group-hover:text-[#2D2D2A] transition-colors">
                <Ic n="arrowRight" size={16} color="currentColor" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Registration CTA */}
      <div className="px-5 flex flex-col gap-4 w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-[#2D2D2A] p-10 mt-6 text-center">
          <h3 className="text-[18px] font-serif font-bold text-[#FFFFFF] mb-3 tracking-widest">開始專屬理財旅程</h3>
          <p className="text-[13px] text-[#AFAEA9] font-normal mb-8 leading-relaxed tracking-wide">紀錄財務、一對一顧問諮詢<br/>與您的客製化理財藍圖。</p>
          <button onClick={() => onSelect("login")} className="w-full bg-[#FFFFFF] text-[#2D2D2A] border border-[#FFFFFF] py-4 text-[13px] font-medium tracking-widest uppercase cursor-pointer hover:bg-[#EAEAE6] transition-colors flex justify-center items-center gap-2">
             前往註冊 / 登入 <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
