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
      <div className="min-h-[100dvh] bg-[#F8F8F6] font-sans pb-10 relative overflow-x-hidden">

        <div className="bg-[#FFFFFF] border-b border-[#EAEAE6] pt-12 pb-8 px-6 text-[#2D2D2A] mb-8 relative z-10 shrink-0">
          <div className="w-full max-w-sm mx-auto">
            <button onClick={onBack} className="bg-[#FFFFFF] border border-[#EAEAE6] rounded-none w-8 h-8 flex items-center justify-center cursor-pointer mb-6 transition-colors hover:bg-[#F9F9F8]">
              <Ic n="back" color="#2D2D2A" size={16}/>
            </button>
            <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B8A88] mb-2 uppercase">整體財務分數</div>
            <div className="flex items-end gap-4">
              <span className="text-[56px] font-serif font-bold text-[#2D2D2A] leading-none tracking-wider">{overallScore}</span>
              <div className="pb-1.5">
                <div className="text-[14px] font-medium tracking-widest uppercase">{overallScore>=80?"財務健全":overallScore>=60?"尚有提升空間":"需要立即規劃"}</div>
                <div className="text-[10px] text-[#AFAEA9] font-normal tracking-widest mt-1">滿分 100 分</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-5 w-full max-w-sm mx-auto relative z-10">
          <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-6 mb-6">
            <div className="text-[12px] font-medium text-[#2D2D2A] mb-6 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 五維度健檢
            </div>
            <div className="pb-6">
               <SvgRadar data={radarData}/>
            </div>
            <div className="flex flex-col gap-5 mt-2">
              {metrics.map(m=>(
                <div key={m.label}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[12px] font-normal text-[#555] tracking-widest">{m.label}</span>
                    <span className={`text-[13px] font-medium tracking-wide ${m.score >= 70 ? 'text-[#2D2D2A]' : m.score >= 40 ? 'text-[#8B8A88]' : 'text-[#AFAEA9]'}`}>{m.val}</span>
                  </div>
                  <div className="h-[2px] bg-[#EAEAE6] overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${m.score >= 70 ? 'bg-[#2D2D2A]' : m.score >= 40 ? 'bg-[#8B8A88]' : 'bg-[#AFAEA9]'}`} style={{ width: `${m.score}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F9F9F8] border border-[#EAEAE6] p-8 mb-6 relative overflow-hidden">
            <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B8A88] mb-6 uppercase flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-[#2D2D2A]" /> 財務自由進度
            </div>
            <div className="flex justify-between mb-6">
              <div>
                <div className="text-[10px] text-[#8B8A88] font-normal mb-1 tracking-widest">目前被動收入</div>
                <div className="text-[20px] font-serif font-bold text-[#2D2D2A] tracking-wide">{fmt(Math.round(passiveIncome))}<span className="text-[10px] font-normal text-[#8B8A88] ml-2 tracking-widest">元/月</span></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8B8A88] font-normal mb-1 tracking-widest">目標（月支出）</div>
                <div className="text-[20px] font-serif font-bold text-[#2D2D2A] tracking-wide">{fmt(monthExpense)}<span className="text-[10px] font-normal text-[#8B8A88] ml-2 tracking-widest">元/月</span></div>
              </div>
            </div>
            <div className="h-[2px] bg-[#EAEAE6] overflow-hidden mb-3">
              <div className="h-full bg-[#2D2D2A] transition-all duration-1000" style={{ width: `${freedomPct}%` }}/>
            </div>
            <div className="text-[11px] text-[#2D2D2A] font-medium text-right tracking-widest">{freedomPct}% 達成</div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#EAEAE6] p-6 mb-8">
            <div className="text-[12px] font-medium text-[#2D2D2A] mb-6 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 優先行動清單
            </div>
            <div className="flex flex-col gap-5">
              {actions.slice(0,3).map((a,i)=>(
                <div key={i} className={`flex gap-5 items-start pb-5 ${i<2 ? 'border-b border-[#EAEAE6]' : ''}`}>
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-serif font-bold text-[14px]
                    ${a.level==="high" ? 'bg-[#2D2D2A] text-[#FFFFFF]' : a.level==="med" ? 'bg-[#F2F2F0] text-[#2D2D2A] border border-[#EAEAE6]' : 'bg-transparent text-[#2D2D2A] border border-[#D6D3D1]'}
                  `}>
                    {i+1}
                  </div>
                  <div className="flex-[1] pt-1">
                    <div className="text-[13px] font-medium text-[#2D2D2A] tracking-wider mb-1.5">{a.title}</div>
                    <div className="text-[12px] text-[#555] font-normal leading-loose tracking-wide">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={onBook} className="w-full bg-[#2D2D2A] text-[#FFFFFF] border border-transparent py-4 text-[13px] font-medium cursor-pointer transition-colors hover:bg-[#49405E] flex justify-center items-center gap-3 mb-8 tracking-widest uppercase">
            預約免費諮詢評估 <Ic n="arrowRight" size={16} color="currentColor" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[100dvh] bg-[#F8F8F6] font-sans pb-10 relative overflow-x-hidden">

      <div className="bg-[#FFFFFF] border-b border-[#EAEAE6] pt-12 pb-8 px-6 text-[#2D2D2A] mb-8 shrink-0 relative z-10">
         <div className="w-full max-w-sm mx-auto">
            <button onClick={step===0?onBack:()=>setStep((s: number)=>s-1)} className="bg-[#FFFFFF] border border-[#EAEAE6] rounded-none px-3 h-8 flex items-center justify-center gap-2 cursor-pointer mb-8 transition-colors hover:bg-[#F9F9F8] w-fit">
              <Ic n="back" size={14} color="#2D2D2A"/>
              <span className="text-[11px] font-normal tracking-widest text-[#2D2D2A] uppercase pr-1">{step===0?"返回":"上一步"}</span>
            </button>
            <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B8A88] uppercase mb-4">
              {step===0?"第一層 · 財務現況":"第二層 · 保障檢視"}
            </div>
            <div className="text-[24px] font-serif font-bold leading-relaxed tracking-wider text-[#2D2D2A]">
              {step===0?<>先看清楚，<br/><span className="border-b-2 border-[#2D2D2A] pb-1">你有什麼、欠什麼</span></>:<>保障是<span className="border-b-2 border-[#2D2D2A] pb-1">地基</span>，<br/>蓋好才能往上走</>}
            </div>
            <div className="flex gap-3 mt-10">
              {[0,1].map((i: number)=><div key={i} className={`h-[2px] flex-1 transition-all duration-300 ${i<=step ? 'bg-[#2D2D2A]' : 'bg-[#EAEAE6]'}`}/>)}
            </div>
         </div>
      </div>
      
      <div className="px-5 w-full max-w-sm mx-auto relative z-10">
        {step===0&&(
          <div className="flex flex-col gap-6">
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#2D2D2A] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 資產（萬元）
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{k:"a_cash",label:"現金與存款",hint:"活存、定存、外幣"},{k:"a_invest",label:"投資理財",hint:"基金、ETF、股票"},{k:"a_property",label:"房地產",hint:"市值（自住或投資）"},{k:"a_insval",label:"保單現值",hint:"儲蓄型保單解約金"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#555] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#8B8A88]" /> 負債（萬元）
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{k:"l_mortgage",label:"房貸餘額"},{k:"l_loans",label:"信貸 / 學貸"},{k:"l_car",label:"車貸餘額"},{k:"l_cc",label:"信用卡未繳"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#2D2D2A] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 每月收入（元）
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{k:"i_salary",label:"月薪",hint:"本薪 + 津貼",unit:"元"},{k:"i_bonus",label:"年終月均",hint:"年終 ÷ 12",unit:"元"},{k:"i_other",label:"其他收入",hint:"投資、租金、副業",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#555] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#8B8A88]" /> 每月支出（元）
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{k:"e_living",label:"生活費",hint:"飲食、治裝",unit:"元"},{k:"e_housing",label:"房貸 / 租金",unit:"元"},{k:"e_transport",label:"交通 / 車貸",unit:"元"},{k:"e_insurance",label:"保費月繳",unit:"元"},{k:"e_invest",label:"投資月存",hint:"定期定額、儲蓄",unit:"元"},{k:"e_other",label:"其他支出",hint:"稅、教育、醫療",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <div className="grid grid-cols-3 bg-[#F9F9F8] border border-[#EAEAE6] py-5 px-2">
              {[{label:"月收入",val:fmt(monthIncome)+"元",color:"text-[#2D2D2A]"},{label:"月支出",val:fmt(monthExpense)+"元",color:"text-[#2D2D2A]"},{label:"儲蓄率",val:savingsRate+"%",color:scoreColor(srScore).split(' ')[0]}].map((s, idx)=>(
                <div key={s.label} className={`text-center ${idx !== 2 ? 'border-r border-[#EAEAE6]' : ''}`}>
                  <div className="text-[10px] text-[#8B8A88] font-normal tracking-[0.2em] uppercase mb-2">{s.label}</div>
                  <div className={`text-[15px] font-serif font-bold tracking-wider ${s.color.replace('text-', 'text-')}`}>{s.val}</div>
                </div>
              ))}
            </div>
            
            <div className="pb-8">
              <button onClick={()=>setStep(1)} className="w-full bg-[#2D2D2A] text-[#FFFFFF] border border-transparent py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-[#49405E] flex justify-center items-center gap-3">
                進入保障檢視 <Ic n="arrowRight" size={16} color="currentColor" />
              </button>
            </div>
          </div>
        )}
        
        {step===1&&(
          <div className="flex flex-col gap-6">
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#2D2D2A] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 現有保障額度（萬元）
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{k:"cov_life",label:"壽險保額",target:`建議 ${lifeTarget}萬+`},{k:"cov_med",label:"醫療實支",target:"建議 100萬/次"},{k:"cov_acc",label:"意外保障",target:"建議 500萬+"},{k:"cov_crit",label:"重大傷病",target:"建議 200萬+"},{k:"cov_dis",label:"失能保障",target:`建議 ${disTarget}萬+`}].map(f=><InputBox key={f.k} {...f} hint={f.target} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
              
              <div className="border-t border-[#EAEAE6] pt-6">
                {[{label:"壽險",score:lifeScore,cur:data.cov_life,tgt:lifeTarget},{label:"醫療",score:medScore,cur:data.cov_med,tgt:100},{label:"意外",score:accScore,cur:data.cov_acc,tgt:500},{label:"重疾",score:critScore,cur:data.cov_crit,tgt:200},{label:"失能",score:disScore,cur:data.cov_dis,tgt:disTarget}].map((m, idx)=>(
                  <div key={m.label} className={`bg-[#F9F9F8] p-4 border border-[#EAEAE6] ${idx !== 4 ? 'mb-4' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[13px] font-medium text-[#2D2D2A] tracking-wider">{m.label}保障</span>
                      <span className={`text-[10px] font-medium tracking-widest uppercase px-2 py-1 ${m.score>=100 ? 'bg-[#2D2D2A] text-[#FFFFFF]' : m.score>=60 ? 'bg-[#EAEAE6] text-[#2D2D2A]' : 'border border-[#2D2D2A] text-[#2D2D2A]'}`}>{m.score>=100?"✓ 充足":m.score>=60?"⚠ 不足":"✗ 嚴重不足"}</span>
                    </div>
                    <div className="h-[2px] bg-[#D6D3D1] overflow-hidden mb-3">
                      <div className={`h-full transition-all duration-700 ${m.score>=100 ? 'bg-[#2D2D2A]' : m.score>=60 ? 'bg-[#8B8A88]' : 'bg-[#555]'}`} style={{width:`${Math.min(m.score,100)}%`}}/>
                    </div>
                    <div className="text-[11px] text-[#8B8A88] font-normal tracking-wide">目前 {m.cur}萬 / 建議 {m.tgt}萬</div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-[#FFFFFF] p-6 border border-[#EAEAE6]">
              <div className="text-[12px] font-medium text-[#2D2D2A] tracking-widest mb-6 flex items-center gap-2 uppercase">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2A]" /> 資產配置（萬元）
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{k:"inv_low",label:"低風險",hint:"存款/儲蓄險"},{k:"inv_mid",label:"中風險",hint:"債券/基金"},{k:"inv_high",label:"高風險",hint:"股票/房產"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
              </div>
            </section>
            
            <div className="pb-8">
              <button onClick={()=>setStep(2)} className="w-full bg-[#2D2D2A] text-[#FFFFFF] border border-transparent py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-[#49405E] flex justify-center items-center gap-3">
                產生財務報告 <Ic n="arrowRight" size={16} color="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
