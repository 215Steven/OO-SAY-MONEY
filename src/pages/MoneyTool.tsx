import { useState } from "react";
import { Ic } from "@/src/components/Icons";
import { SvgRadar } from "@/src/components/SvgRadar";
import { InputBox } from "@/src/components/ui/InputBox";
import { fmt } from "@/src/utils/formatters";

export const MoneyTool = ({ onBack, onBook }: any) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    a_cash:0,a_invest:0,a_property:0,a_insval:0,
    l_mortgage:0,l_loans:0,l_car:0,l_cc:0,
    i_salary:0,i_bonus:0,i_other:0,
    e_living:0,e_housing:0,e_transport:0,e_insurance:0,e_invest:0,e_other:0,
    cov_life:0,cov_med:0,cov_acc:0,cov_crit:0,cov_dis:0,
    inv_low:0,inv_mid:0,inv_high:0,
  });
  const set = (k: string, v: string) => setData(d=>({...d,[k]:parseFloat(v)||0}));
  
  const totalAssets=data.a_cash+data.a_invest+data.a_property+data.a_insval;
  const totalLiab=data.l_mortgage+data.l_loans+data.l_car+data.l_cc;
  const netWorth=totalAssets-totalLiab;
  const monthIncome=data.i_salary+data.i_bonus+data.i_other;
  const monthExpense=data.e_living+data.e_housing+data.e_transport+data.e_insurance+data.e_invest+data.e_other;
  const savings=monthIncome-monthExpense;
  const savingsRate=monthIncome>0?Math.round((savings/monthIncome)*100):0;
  const debtRatio=totalAssets>0?Math.round((totalLiab/totalAssets)*100):0;
  const emergency=monthExpense>0?parseFloat((data.a_cash*10000/monthExpense).toFixed(1)):0;
  const annualIncome=monthIncome*12;
  const lifeTarget=Math.round(annualIncome*10/10000);
  const disTarget=Math.round(annualIncome*5/10000);
  
  const lifeScore=data.cov_life>=lifeTarget?100:Math.round((data.cov_life/lifeTarget)*100)||0;
  const medScore=data.cov_med>=100?100:Math.round((data.cov_med/100)*100)||0;
  const accScore=data.cov_acc>=500?100:Math.round((data.cov_acc/500)*100)||0;
  const critScore=data.cov_crit>=200?100:Math.round((data.cov_crit/200)*100)||0;
  const disScore=data.cov_dis>=disTarget?100:Math.round((data.cov_dis/Math.max(disTarget,1))*100)||0;
  const insScore=Math.round((lifeScore+medScore+accScore+critScore+disScore)/5);
  
  const srScore=savingsRate>=20?100:Math.round((savingsRate/20)*100);
  const emScore=emergency>=6?100:Math.round((emergency/6)*100);
  const drScore=debtRatio<=30?100:debtRatio>=80?0:Math.round(((80-debtRatio)/50)*100);
  const totalInv=data.inv_low+data.inv_mid+data.inv_high;
  const invScore=totalInv>0?Math.min(100,Math.round((totalInv/Math.max(netWorth*0.3,1))*60)):0;
  
  const overallScore=Math.round((srScore*0.25+emScore*0.2+drScore*0.2+insScore*0.2+invScore*0.15));
  const passiveIncome=(data.inv_low*0.03+data.inv_mid*0.06+data.inv_high*0.09)*10000/12;
  const freedomPct=monthExpense>0?Math.min(100,Math.round((passiveIncome/monthExpense)*100)):0;
  
  const scoreColor=(s: number)=>s>=70?"text-emerald-500 bg-emerald-500" : s>=40?"text-amber-500 bg-amber-500" : "text-rose-500 bg-rose-500";
  const metrics=[
    {label:"儲蓄率",val:savingsRate+"%",score:srScore,target:"目標 20%+"},
    {label:"緊急預備金",val:emergency+"個月",score:emScore,target:"目標 6個月"},
    {label:"負債比",val:debtRatio+"%",score:drScore,target:"目標 <30%"},
    {label:"保障指數",val:insScore+"%",score:insScore,target:"綜合保障"},
  ];
  const actions=[];
  if(emScore<70) actions.push({title:"建立緊急預備金",desc:`目前 ${emergency} 個月，先從 1 個月開始。`,level:"high"});
  if(srScore<70) actions.push({title:"提高儲蓄率至 20%",desc:`目前 ${savingsRate}%，每月多存一點點。`,level:"high"});
  if(drScore<70) actions.push({title:"優先還高利率負債",desc:`負債比 ${debtRatio}%，先處理信用卡循環。`,level:"high"});
  if(insScore<70) actions.push({title:"補足保障缺口",desc:`整體保障指數 ${insScore}%，定期壽險保費低。`,level:"med"});
  if(invScore<70) actions.push({title:"開始定期定額投資",desc:"ETF 定期定額，每月 3,000 起步即可。",level:"med"});
  if(actions.length===0) actions.push({title:"財務狀態全面優秀",desc:"繼續保持現有策略！",level:"low"});
  
  if(step===2){
    const radarData=[
      {s:"儲蓄",v:srScore},{s:"預備金",v:emScore},{s:"負債",v:drScore},{s:"保障",v:insScore},{s:"投資",v:invScore}
    ];
    return (
      <div className="min-h-[100dvh] bg-[#f8f5ff] font-sans pb-10 relative overflow-x-hidden">
        {/* Background Orbs */}
        <div className="fixed top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#d8b4fe]/30 rounded-full blur-[80px] z-0 pointer-events-none" />
        <div className="fixed top-[150px] right-[-100px] w-[250px] h-[250px] bg-[#c084fc]/15 rounded-full blur-[60px] z-0 pointer-events-none" />

        <div className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-b-[40px] pt-12 pb-8 px-6 text-white shadow-[0_10px_30px_rgba(147,51,234,0.2)] mb-6 relative z-10 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/20 rounded-full blur-[40px] pointer-events-none" />
          <div className="w-full max-w-sm mx-auto">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/30 cursor-pointer mb-5 transition-transform active:scale-95">
              <Ic n="back" color="#fff" size={18}/>
            </button>
            <div className="text-[12px] font-black tracking-widest text-[#f3e8ff] mb-1 uppercase">整體財務分數</div>
            <div className="flex items-end gap-3">
              <span className="text-[64px] font-black text-white leading-[0.85] tracking-tighter drop-shadow-md">{overallScore}</span>
              <div className="pb-1">
                <div className="text-[18px] font-black tracking-tight">{overallScore>=80?"財務健全":overallScore>=60?"尚有提升空間":"需要立即規劃"}</div>
                <div className="text-[12px] text-[#e9d5ff] font-semibold mt-0.5">滿分 100 分</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-5 w-full max-w-sm mx-auto relative z-10">
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 mb-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white">
            <div className="text-[15px] font-black text-[#9333ea] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9333ea]" /> 五維度健檢
            </div>
            <div className="pb-4">
               <SvgRadar data={radarData}/>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {metrics.map(m=>(
                <div key={m.label}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[13px] font-bold text-slate-700">{m.label}</span>
                    <span className={`text-[14px] font-black ${scoreColor(m.score).split(' ')[0]} ${scoreColor(m.score).replace('text-', 'text-').replace('bg-', '')}`}>{m.val}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-1000 ${scoreColor(m.score).split(' ')[1].replace('bg-emerald-500', 'bg-gradient-to-r from-emerald-400 to-emerald-500').replace('bg-amber-500', 'bg-gradient-to-r from-amber-400 to-amber-500').replace('bg-rose-500', 'bg-gradient-to-r from-rose-400 to-rose-500')}`} style={{ width: `${m.score}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#9333ea] to-[#7e22ce] rounded-[32px] p-6 mb-5 text-white shadow-[0_15px_40px_rgba(147,51,234,0.3)] border border-[#e9d5ff] relative overflow-hidden">
            <div className="absolute -top-[50px] -right-[50px] w-[150px] h-[150px] bg-white/20 rounded-full blur-[30px] pointer-events-none" />
            <div className="text-[12px] font-black tracking-widest text-[#e9d5ff] mb-5 uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[#e9d5ff]" /> 財務自由進度
            </div>
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-[12px] text-[#f3e8ff] font-semibold mb-0.5">目前被動收入</div>
                <div className="text-[24px] font-black text-white">{fmt(Math.round(passiveIncome))}<span className="text-[12px] font-bold text-[#e9d5ff] ml-1">元/月</span></div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#f3e8ff] font-semibold mb-0.5">目標（月支出）</div>
                <div className="text-[24px] font-black text-white">{fmt(monthExpense)}<span className="text-[12px] font-bold text-[#e9d5ff] ml-1">元/月</span></div>
              </div>
            </div>
            <div className="h-3 rounded-full bg-black/20 overflow-hidden mb-2 shadow-inner p-0.5">
              <div className="h-full bg-gradient-to-r from-[#fcd34d] to-[#f59e0b] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${freedomPct}%` }}/>
            </div>
            <div className="text-[13px] text-[#f3e8ff] font-bold text-right tracking-wide">{freedomPct}% 達成</div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white">
            <div className="text-[15px] font-black text-[#9333ea] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9333ea]" /> 優先行動清單
            </div>
            <div className="flex flex-col gap-4">
              {actions.slice(0,3).map((a,i)=>(
                <div key={i} className={`flex gap-4 items-start pb-4 ${i<2 ? 'border-b border-white' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm
                    ${a.level==="high" ? 'bg-[#ffe4e6] text-[#f43f5e]' : a.level==="med" ? 'bg-[#fef3c7] text-[#f59e0b]' : 'bg-[#d1fae5] text-[#10b981]'}
                  `}>
                    <span className="text-[14px] font-black">{i+1}</span>
                  </div>
                  <div className="flex-[1] pt-0.5">
                    <div className="text-[14px] font-black text-slate-800 tracking-tight">{a.title}</div>
                    <div className="text-[13px] text-slate-500 font-semibold mt-1 leading-relaxed">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={onBook} className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white border border-[#06C755] rounded-[20px] p-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition-transform active:scale-95 flex justify-center items-center gap-2 mb-6">
            <Ic n="star" size={20} color="#fff" /> 預約免費諮詢評估
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[100dvh] bg-[#f8f5ff] font-sans pb-10 relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#d8b4fe]/30 rounded-full blur-[80px] z-0 pointer-events-none" />
      <div className="fixed top-[150px] right-[-100px] w-[250px] h-[250px] bg-[#c084fc]/15 rounded-full blur-[60px] z-0 pointer-events-none" />

      <div className="bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-b-[40px] pt-12 pb-8 px-6 text-white shadow-[0_10px_30px_rgba(147,51,234,0.2)] mb-6 relative z-10 overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/20 rounded-full blur-[40px] pointer-events-none" />
         <div className="w-full max-w-sm mx-auto">
            <button onClick={step===0?onBack:()=>setStep((s: number)=>s-1)} className="bg-white/20 backdrop-blur-md rounded-[14px] px-3 h-10 flex items-center justify-center gap-1.5 border border-white/30 cursor-pointer mb-6 transition-transform active:scale-95 w-fit">
              <Ic n="back" size={16} color="#fff"/>
              <span className="text-[13px] font-bold text-white pr-1">{step===0?"返回":"上一步"}</span>
            </button>
            <div className="text-[11px] font-black tracking-widest text-[#f3e8ff] uppercase mb-2">
              {step===0?"第一層 · 財務現況":"第二層 · 保障檢視"}
            </div>
            <div className="text-[26px] font-black leading-tight tracking-tight drop-shadow-sm">
              {step===0?<>先看清楚，<br/><span className="text-[#fcd34d]">你有什麼、欠什麼</span></>:<>保障是<span className="text-[#fcd34d]">地基</span>，<br/>蓋好才能往上走</>}
            </div>
            <div className="flex gap-2 mt-6">
              {[0,1].map((i: number)=><div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 shadow-inner ${i<=step ? 'bg-[#fcd34d] shadow-[0_0_8px_rgba(252,211,77,0.5)]' : 'bg-black/20'}`}/>)}
            </div>
         </div>
      </div>
      
      <div className="px-5 w-full max-w-sm mx-auto relative z-10">
        {step===0&&(
          <div className="flex flex-col gap-6">
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#9333ea]" /> 資產（萬元）
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{k:"a_cash",label:"現金與存款",hint:"活存、定存、外幣"},{k:"a_invest",label:"投資理財",hint:"基金、ETF、股票"},{k:"a_property",label:"房地產",hint:"市值（自住或投資）"},{k:"a_insval",label:"保單現值",hint:"儲蓄型保單解約金"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#f59e0b] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> 負債（萬元）
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{k:"l_mortgage",label:"房貸餘額"},{k:"l_loans",label:"信貸 / 學貸"},{k:"l_car",label:"車貸餘額"},{k:"l_cc",label:"信用卡未繳"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#10b981] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> 每月收入（元）
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{k:"i_salary",label:"月薪",hint:"本薪 + 津貼",unit:"元"},{k:"i_bonus",label:"年終月均",hint:"年終 ÷ 12",unit:"元"},{k:"i_other",label:"其他收入",hint:"投資、租金、副業",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#f43f5e] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" /> 每月支出（元）
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{k:"e_living",label:"生活費",hint:"飲食、治裝",unit:"元"},{k:"e_housing",label:"房貸 / 租金",unit:"元"},{k:"e_transport",label:"交通 / 車貸",unit:"元"},{k:"e_insurance",label:"保費月繳",unit:"元"},{k:"e_invest",label:"投資月存",hint:"定期定額、儲蓄",unit:"元"},{k:"e_other",label:"其他支出",hint:"稅、教育、醫療",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <div className="grid grid-cols-3 bg-white/80 backdrop-blur-md border border-white rounded-[24px] shadow-sm py-4 px-2">
              {[{label:"月收入",val:fmt(monthIncome)+"元",color:"text-slate-800"},{label:"月支出",val:fmt(monthExpense)+"元",color:"text-slate-800"},{label:"儲蓄率",val:savingsRate+"%",color:scoreColor(srScore).split(' ')[0]}].map((s, idx)=>(
                <div key={s.label} className={`text-center ${idx !== 2 ? 'border-r border-slate-100' : ''}`}>
                  <div className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">{s.label}</div>
                  <div className={`text-[16px] font-black ${s.color.replace('text-', 'text-')}`}>{s.val}</div>
                </div>
              ))}
            </div>
            
            <div className="pb-6">
              <button onClick={()=>setStep(1)} className="w-full bg-gradient-to-br from-[#c084fc] to-[#9333ea] hover:from-[#a855f7] hover:to-[#7e22ce] text-white border border-[#e9d5ff] rounded-[20px] p-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(147,51,234,0.3)] transition-transform active:scale-95 flex justify-center items-center gap-2">
                進入保障檢視 <Ic n="arrowRight" size={16} color="#fff" />
              </button>
            </div>
          </div>
        )}
        
        {step===1&&(
          <div className="flex flex-col gap-6">
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#9333ea] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#9333ea]" /> 現有保障額度（萬元）
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[{k:"cov_life",label:"壽險保額",target:`建議 ${lifeTarget}萬+`},{k:"cov_med",label:"醫療實支",target:"建議 100萬/次"},{k:"cov_acc",label:"意外保障",target:"建議 500萬+"},{k:"cov_crit",label:"重大傷病",target:"建議 200萬+"},{k:"cov_dis",label:"失能保障",target:`建議 ${disTarget}萬+`}].map(f=><InputBox key={f.k} {...f} hint={f.target} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
              
              <div className="border-t border-white pt-5">
                {[{label:"壽險",score:lifeScore,cur:data.cov_life,tgt:lifeTarget},{label:"醫療",score:medScore,cur:data.cov_med,tgt:100},{label:"意外",score:accScore,cur:data.cov_acc,tgt:500},{label:"重疾",score:critScore,cur:data.cov_crit,tgt:200},{label:"失能",score:disScore,cur:data.cov_dis,tgt:disTarget}].map((m, idx)=>(
                  <div key={m.label} className={`bg-white/80 rounded-2xl p-4 shadow-sm border border-white ${idx !== 4 ? 'mb-3' : ''}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[14px] font-black text-slate-800 tracking-tight">{m.label}保障</span>
                      <span className={`text-[12px] font-black px-2 py-1 rounded-lg ${m.score>=100 ? 'bg-[#d1fae5] text-[#10b981]' : m.score>=60 ? 'bg-[#fef3c7] text-[#f59e0b]' : 'bg-[#ffe4e6] text-[#f43f5e]'}`}>{m.score>=100?"✓ 充足":m.score>=60?"⚠ 不足":"✗ 嚴重不足"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner mb-2">
                      <div className={`h-full rounded-full transition-all duration-700 ${scoreColor(m.score).split(' ')[1].replace('bg-emerald-500', 'bg-gradient-to-r from-emerald-400 to-emerald-500').replace('bg-amber-500', 'bg-gradient-to-r from-amber-400 to-amber-500').replace('bg-rose-500', 'bg-gradient-to-r from-rose-400 to-rose-500')}`} style={{width:`${Math.min(m.score,100)}%`}}/>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold tracking-wide">目前 {m.cur}萬 / 建議 {m.tgt}萬</div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white/60 backdrop-blur-md p-5 rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[12px] font-black text-[#c084fc] tracking-widest mb-4 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" /> 資產配置（萬元）
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{k:"inv_low",label:"低風險",hint:"存款/儲蓄險"},{k:"inv_mid",label:"中風險",hint:"債券/基金"},{k:"inv_high",label:"高風險",hint:"股票/房產"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <div className="pb-6">
              <button onClick={()=>setStep(2)} className="w-full bg-gradient-to-br from-[#c084fc] to-[#9333ea] hover:from-[#a855f7] hover:to-[#7e22ce] text-white border border-[#e9d5ff] rounded-[20px] p-4.5 text-[16px] font-black cursor-pointer shadow-[0_8px_20px_rgba(147,51,234,0.3)] transition-transform active:scale-95 flex justify-center items-center gap-2">
                產生財務報告 <Ic n="arrowRight" size={16} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
