import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {C,FONT,a,euro} from '../../design-system';
import {ETF_COST_COPY,ETF_COST_MODEL} from './config';
import {GoldCoin,LabelPill,SceneShell} from './layout';

const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const phase=(f:number,d:number,s:number,e:number)=>interpolate(f,[d*s,d*e],[0,1],CLAMP);
const loop=(v:number)=>v-Math.floor(v);
const fv=(monthly:number,annual:number,months:number)=>{if(months<=0)return 0;const r=annual/12;return monthly*((Math.pow(1+r,months)-1)/r)};

const Tank:React.FC<{x:number;fill:number;value:number;label:string;color:string}>=({x,fill,value,label,color})=><div style={{position:'absolute',left:x,top:225,width:330,height:650,borderRadius:48,border:`3px solid ${a(color,.58)}`,background:a(C.white,.035),overflow:'hidden'}}><div style={{position:'absolute',left:15,right:15,bottom:15,height:Math.max(10,620*fill),borderRadius:34,background:`linear-gradient(180deg,${C.goldLt},${C.gold})`,boxShadow:`0 0 42px ${a(C.gold,.25)}`}}/><div style={{position:'absolute',left:0,right:0,top:24,textAlign:'center'}}><div style={{fontFamily:FONT.body,fontWeight:900,fontSize:25,color}}>{label}</div><div style={{marginTop:8,fontFamily:FONT.title,fontSize:46,color:C.white}}>{euro(value)}</div></div></div>;

export const ThirtyYearGrowthRaceAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
 const frame=useCurrentFrame();
 const progress=phase(frame,durationInFrames,.04,.90);
 const months=Math.floor(progress*ETF_COST_MODEL.months);
 const low=fv(ETF_COST_MODEL.monthlyContribution,ETF_COST_MODEL.lowNetModelRate,months);
 const high=fv(ETF_COST_MODEL.monthlyContribution,ETF_COST_MODEL.highNetModelRate,months);
 const year=Math.min(30,months/12);
 return <SceneShell copy={ETF_COST_COPY[5]}>
  <div style={{position:'absolute',top:38,left:390,width:300,textAlign:'center'}}><div style={{fontFamily:FONT.body,fontWeight:850,fontSize:24,color:C.gray}}>ZEIT</div><div style={{fontFamily:FONT.title,fontSize:68,color:C.goldLt}}>{year.toFixed(year<10?1:0)} JAHRE</div></div>
  <Tank x={150} fill={low/ETF_COST_MODEL.lowEndValue} value={low} label="0,2 % KOSTENMODELL" color={C.accentLt}/>
  <Tank x={600} fill={high/ETF_COST_MODEL.lowEndValue} value={high} label="1,5 % KOSTENMODELL" color={C.negativeLt}/>
  {Array.from({length:7}).map((_,i)=>{const t=loop(progress*5+i/7);return <React.Fragment key={i}><div style={{position:'absolute',left:260,top:120+t*100,opacity:progress}}><GoldCoin size={27}/></div><div style={{position:'absolute',left:710,top:120+t*100,opacity:progress}}><GoldCoin size={27}/></div></React.Fragment>})}
  {Array.from({length:5}).map((_,i)=>{const t=loop(progress*3+i/5);return <div key={i} style={{position:'absolute',left:910+t*70,top:430+i*56,opacity:progress*.72}}><GoldCoin size={20} opacity={.55}/><div style={{position:'absolute',inset:-5,borderRadius:'50%',border:`2px solid ${a(C.negative,.7)}`}}/></div>})}
  <div style={{position:'absolute',left:424,top:900,width:232,textAlign:'center',opacity:phase(frame,durationInFrames,.75,.92)}}><LabelPill kind="gold">GLEICHER INPUT</LabelPill></div>
 </SceneShell>;
};
