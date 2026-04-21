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
      <div className="bg-slate-50 min-h-full">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white flex items-center gap-4">
          <button onClick={onBack} className="bg-transparent border-0 cursor-pointer shrink-0 p-0 transition-opacity hover:opacity-75">
            <Ic n="back" color="rgba(255,255,255,.7)"/>
          </button>
          <div className="flex-1">
            <div className="text-[9px] font-bold tracking-[0.06em] text-white/60">整體財務分數</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[52px] font-extrabold text-indigo-500 leading-none">{overallScore}</span>
              <div>
                <div className="text-[16px] font-extrabold">{overallScore>=80?"財務健全":overallScore>=60?"尚有提升空間":"需要立即規劃"}</div>
                <div className="text-[11px] text-white/60">滿分 100 分</div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-2xl p-4 mb-3.5 shadow-sm border border-slate-100">
            <div className="text-[13px] font-bold text-slate-900 mb-2.5">五維度健檢</div>
            <SvgRadar data={radarData}/>
            {metrics.map(m=>(
              <div key={m.label} className="mb-2.5">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-medium text-slate-900">{m.label}</span>
                  <span className={`text-[12px] font-bold ${scoreColor(m.score).split(' ')[0]}`}>{m.val}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${scoreColor(m.score).split(' ')[1]}`} style={{ width: `${m.score}%` }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 mb-3.5 text-white shadow-lg shadow-slate-900/10">
            <div className="text-[10px] font-bold tracking-[0.06em] text-white/60 mb-2">財務自由進度</div>
            <div className="flex justify-between mb-2.5">
              <div>
                <div className="text-[11px] text-white/60">目前被動收入</div>
                <div className="text-[18px] font-extrabold text-indigo-500">{fmt(Math.round(passiveIncome))}<span className="text-[11px]"> 元/月</span></div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-white/60">目標（月支出）</div>
                <div className="text-[18px] font-extrabold text-indigo-500">{fmt(monthExpense)}<span className="text-[11px]"> 元/月</span></div>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-1.5">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${freedomPct}%` }}/>
            </div>
            <div className="text-[12px] text-white/50 text-right">{freedomPct}% 達成</div>
          </div>
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100">
            <div className="text-[13px] font-bold text-slate-900 mb-3">優先行動清單</div>
            {actions.slice(0,3).map((a,i)=>(
              <div key={i} className={`flex gap-3 items-start py-2.5 ${i<2 ? 'border-b border-slate-100' : ''}`}>
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center 
                  ${a.level==="high" ? 'bg-rose-100 text-rose-500' : a.level==="med" ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-500'}
                `}>
                  <span className="text-[12px] font-extrabold">{i+1}</span>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900">{a.title}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onBook} className="w-full bg-indigo-600 text-white border-0 rounded-2xl p-4 text-[15px] font-extrabold cursor-pointer shadow-md shadow-indigo-600/20 transition-transform active:scale-95">預約免費諮詢 →</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-50 min-h-full pb-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-5 px-4.5 text-white">
        <button onClick={step===0?onBack:()=>setStep((s: number)=>s-1)} className="bg-transparent border-0 cursor-pointer mb-3 p-0 flex items-center gap-1.5 text-white/70 transition-opacity hover:opacity-100">
          <Ic n="back" size={18} color="currentColor"/>
          <span className="text-[12px]">{step===0?"返回":"上一步"}</span>
        </button>
        <div className="text-[9px] font-bold tracking-[0.06em] text-white/60">{step===0?"第一層 · 財務現況":"第二層 · 保障檢視"}</div>
        <div className="text-[22px] font-extrabold leading-snug mt-1.5">
          {step===0?<>先看清楚，<br/><span className="text-indigo-400">你有什麼、欠什麼</span></>:<>保障是<span className="text-indigo-400">地基</span>，<br/>蓋好才能往上走</>}
        </div>
        <div className="flex gap-1.5 mt-3.5">
          {[0,1].map((i: number)=><div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i<=step ? 'bg-indigo-400' : 'bg-white/20'}`}/>)}
        </div>
      </div>
      
      {step===0&&(
        <div>
          <div className="pt-4 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">資產（萬元）</div>
          <div className="grid grid-cols-2 gap-2.5 p-2.5 px-4.5">
            {[{k:"a_cash",label:"現金與存款",hint:"活存、定存、外幣"},{k:"a_invest",label:"投資理財",hint:"基金、ETF、股票"},{k:"a_property",label:"房地產",hint:"市值（自住或投資）"},{k:"a_insval",label:"保單現值",hint:"儲蓄型保單解約金"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="pt-1 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">負債（萬元）</div>
          <div className="grid grid-cols-2 gap-2.5 p-2.5 px-4.5">
            {[{k:"l_mortgage",label:"房貸餘額"},{k:"l_loans",label:"信貸 / 學貸"},{k:"l_car",label:"車貸餘額"},{k:"l_cc",label:"信用卡未繳"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="pt-1 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">每月收入（元）</div>
          <div className="grid grid-cols-2 gap-2.5 p-2.5 px-4.5">
            {[{k:"i_salary",label:"月薪",hint:"本薪 + 津貼",unit:"元"},{k:"i_bonus",label:"年終月均",hint:"年終 ÷ 12",unit:"元"},{k:"i_other",label:"其他收入",hint:"投資、租金、副業",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="pt-1 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">每月支出（元）</div>
          <div className="grid grid-cols-2 gap-2.5 pt-2.5 px-4.5">
            {[{k:"e_living",label:"生活費",hint:"飲食、治裝",unit:"元"},{k:"e_housing",label:"房貸 / 租金",unit:"元"},{k:"e_transport",label:"交通 / 車貸",unit:"元"},{k:"e_insurance",label:"保費月繳",unit:"元"},{k:"e_invest",label:"投資月存",hint:"定期定額、儲蓄",unit:"元"},{k:"e_other",label:"其他支出",hint:"稅、教育、醫療",unit:"元"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="grid grid-cols-3 bg-white border-y border-slate-200 py-3.5 px-4.5 mt-4">
            {[{label:"月收入",val:fmt(monthIncome)+"元",color:"text-slate-900"},{label:"月支出",val:fmt(monthExpense)+"元",color:"text-slate-900"},{label:"儲蓄率",val:savingsRate+"%",color:scoreColor(srScore).split(' ')[0]}].map(s=>(
              <div key={s.label} className="text-center">
                <div className="text-[9px] text-slate-500 font-bold tracking-[0.04em]">{s.label}</div>
                <div className={`text-[17px] font-extrabold ${s.color} mt-0.5`}>{s.val}</div>
              </div>
            ))}
          </div>
          
          <div className="p-4.5">
            <button onClick={()=>setStep(1)} className="w-full bg-indigo-600 text-white border-0 rounded-2xl p-4 text-[15px] font-extrabold cursor-pointer shadow-md shadow-indigo-600/20 transition-transform active:scale-95">查看保障分析 →</button>
          </div>
        </div>
      )}
      
      {step===1&&(
        <div>
          <div className="pt-4 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">現有保障額度（萬元）</div>
          <div className="grid grid-cols-2 gap-2.5 p-2.5 px-4.5">
            {[{k:"cov_life",label:"壽險保額",target:`建議 ${lifeTarget}萬+`},{k:"cov_med",label:"醫療實支",target:"建議 100萬/次"},{k:"cov_acc",label:"意外保障",target:"建議 500萬+"},{k:"cov_crit",label:"重大傷病",target:"建議 200萬+"},{k:"cov_dis",label:"失能保障",target:`建議 ${disTarget}萬+`}].map(f=><InputBox key={f.k} {...f} hint={f.target} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="pt-4 px-4.5">
            {[{label:"壽險",score:lifeScore,cur:data.cov_life,tgt:lifeTarget},{label:"醫療",score:medScore,cur:data.cov_med,tgt:100},{label:"意外",score:accScore,cur:data.cov_acc,tgt:500},{label:"重疾",score:critScore,cur:data.cov_crit,tgt:200},{label:"失能",score:disScore,cur:data.cov_dis,tgt:disTarget}].map(m=>(
              <div key={m.label} className={`bg-white rounded-xl p-3 mb-2.5 shadow-sm border border-slate-100`}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] font-bold text-slate-900">{m.label}保障</span>
                  <span className={`text-[12px] font-bold ${scoreColor(m.score).split(' ')[0]}`}>{m.score>=100?"✓ 充足":m.score>=60?"⚠ 不足":"✗ 嚴重不足"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${scoreColor(m.score).split(' ')[1]}`} style={{width:`${Math.min(m.score,100)}%`}}/>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">目前 {m.cur}萬 / 建議 {m.tgt}萬</div>
              </div>
            ))}
          </div>
          
          <div className="pt-1 px-4.5 text-[11px] font-extrabold text-slate-500 tracking-[0.06em]">資產配置（萬元）</div>
          <div className="grid grid-cols-3 gap-2.5 p-2.5 px-4.5">
            {[{k:"inv_low",label:"低風險",hint:"存款、儲蓄險"},{k:"inv_mid",label:"中風險",hint:"債券、基金"},{k:"inv_high",label:"高風險",hint:"股票、不動產"}].map(f=><InputBox key={f.k} {...f} onChange={(e: any)=>set(f.k,e.target.value)}/>)}
          </div>
          
          <div className="p-4.5">
            <button onClick={()=>setStep(2)} className="w-full bg-indigo-600 text-white border-0 rounded-2xl p-4 text-[15px] font-extrabold cursor-pointer shadow-md shadow-indigo-600/20 transition-transform active:scale-95">查看財務報告 →</button>
          </div>
        </div>
      )}
    </div>
  );
};
