import React from 'react';
import {interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,FONT,a} from '../../design-system';
import {ETF_COST_COPY} from './config';
import {GoldCoin,LabelPill,SceneShell} from './layout';

const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const phase=(frame:number,duration:number,start:number,end:number)=>interpolate(frame,[duration*start,duration*end],[0,1],CLAMP);
const loop=(value:number)=>value-Math.floor(value);

const Pipe:React.FC<{x:number;y:number;h:number;color?:string;opacity?:number}>=({x,y,h,color=C.accentLt,opacity=1})=><div style={{position:'absolute',left:x-7,top:y,width:14,height:h,borderRadius:10,opacity,background:`linear-gradient(180deg,${a(color,.2)},${color},${a(color,.22)})`,boxShadow:`0 0 24px ${a(color,.25)}`}}/>;

const Reservoir:React.FC<{x:number;y:number;w:number;h:number;fill:number;label:string;accent?:string}>=({x,y,w,h,fill,label,accent=C.gold})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:34,border:`3px solid ${a(C.white,.22)}`,background:a(C.white,.035),overflow:'hidden',boxShadow:`inset 0 0 40px ${a(accent,.08)}`}}><div style={{position:'absolute',left:10,right:10,bottom:10,height:Math.max(0,(h-20)*fill),borderRadius:24,background:`linear-gradient(180deg,${C.goldLt},${C.gold})`,boxShadow:`0 0 36px ${a(C.gold,.25)}`}}/><div style={{position:'absolute',left:0,right:0,bottom:16,textAlign:'center',fontFamily:FONT.body,fontWeight:900,fontSize:24,color:C.bgDeep,textShadow:'0 1px 2px rgba(255,255,255,.15)'}}>{label}</div></div>;

export const SameSavingsTwoCostPathsAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const intro=spring({frame,fps,config:{damping:18,stiffness:140}});
  const split=phase(frame,durationInFrames,.08,.30);
  const flow=phase(frame,durationInFrames,.22,.88);
  const gate=phase(frame,durationInFrames,.32,.48);
  const settle=phase(frame,durationInFrames,.72,.94);
  const lanes=[{x:300,cost:'0,2 %',kind:'green' as const,fill:.88,fee:1},{x:780,cost:'1,5 %',kind:'red' as const,fill:.68,fee:5}];
  return <SceneShell copy={ETF_COST_COPY[1]}>
    <div style={{position:'absolute',left:420,top:46,width:240,textAlign:'center',transform:`scale(${.8+.2*intro})`,opacity:intro}}><LabelPill kind="gold">200 € / MONAT</LabelPill></div>
    <svg width="1080" height="1020" style={{position:'absolute',inset:0}}>
      <path d="M540 122 L540 230" stroke={C.gold} strokeWidth="14" strokeLinecap="round" opacity={split}/>
      <path d="M540 230 C540 280 300 260 300 345" fill="none" stroke={C.gold} strokeWidth="14" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>
      <path d="M540 230 C540 280 780 260 780 345" fill="none" stroke={C.gold} strokeWidth="14" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>
    </svg>
    {lanes.map((lane,li)=><React.Fragment key={lane.x}>
      <Pipe x={lane.x} y={340} h={470} color={C.gold}/>
      <div style={{position:'absolute',left:lane.x-92,top:380,width:184,height:96,borderRadius:26,border:`3px solid ${a(C.negativeLt,.75)}`,background:a(C.negative,.15),display:'grid',placeItems:'center',opacity:gate,transform:`scale(${.82+.18*gate})`}}><div style={{fontFamily:FONT.title,fontSize:38,color:C.negativeLt}}>{lane.cost}</div><div style={{position:'absolute',bottom:8,fontFamily:FONT.body,fontWeight:800,fontSize:18,color:C.white}}>KOSTEN</div></div>
      {Array.from({length:7}).map((_,i)=>{const t=loop(flow*2.1+i/7);const y=300+t*500;return <div key={i} style={{position:'absolute',left:lane.x-17,top:y,opacity:flow*.95}}><GoldCoin size={34}/></div>})}
      {Array.from({length:lane.fee}).map((_,i)=>{const pop=phase(frame,durationInFrames,.42+i*.035,.56+i*.035);return <div key={i} style={{position:'absolute',left:lane.x+58+pop*(65+i*9),top:426+i*24,opacity:pop*(1-settle*.25),transform:`scale(${.6+.4*pop})`}}><GoldCoin size={24} opacity={.75}/><div style={{position:'absolute',inset:-5,borderRadius:'50%',boxShadow:`0 0 24px ${a(C.negative,.7)}`,border:`2px solid ${a(C.negative,.8)}`}}/></div>})}
      <Reservoir x={lane.x-125} y={744} w={250} h={220} fill={lane.fill*settle} label={li===0?'MEHR BLEIBT':'MEHR GEHT AB'}/>
      <div style={{position:'absolute',left:lane.x-88,top:680,width:176,textAlign:'center',opacity:gate}}><LabelPill kind={lane.kind}>{li===0?'ETF-MODELL':'FONDS-MODELL'}</LabelPill></div>
    </React.Fragment>)}
  </SceneShell>;
};

export const FeeCompoundingDragAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame();
  const grow=phase(frame,durationInFrames,.05,.42);
  const cut=phase(frame,durationInFrames,.28,.52);
  const ghost=phase(frame,durationInFrames,.48,.82);
  const end=phase(frame,durationInFrames,.74,.96);
  return <SceneShell copy={ETF_COST_COPY[2]}>
    <svg width="1080" height="1020" style={{position:'absolute',inset:0}}>
      <path d="M120 600 C280 600 320 520 430 520 C560 520 620 390 900 300" fill="none" stroke={C.gold} strokeWidth="20" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-grow}/>
      <path d="M430 520 C535 600 610 720 900 790" fill="none" stroke={a(C.goldLt,.38)} strokeWidth="11" strokeDasharray="22 18" strokeLinecap="round" pathLength="1" strokeDashoffset={1-ghost}/>
    </svg>
    {Array.from({length:9}).map((_,i)=>{const t=phase(frame,durationInFrames,.08+i*.035,.28+i*.035);const x=110+i*94;const y=610-i*32;return <div key={i} style={{position:'absolute',left:x,top:y,opacity:t,transform:`scale(${.6+.4*t})`}}><GoldCoin size={36}/></div>})}
    <div style={{position:'absolute',left:390,top:474,opacity:cut,transform:`translate(${cut*120}px,${cut*110}px) scale(${.7+.3*cut})`}}><GoldCoin size={46}/><div style={{position:'absolute',inset:-8,borderRadius:'50%',border:`3px solid ${C.negativeLt}`,boxShadow:`0 0 34px ${a(C.negative,.55)}`}}/></div>
    <div style={{position:'absolute',left:495,top:590,opacity:cut}}><LabelPill kind="red">KOSTEN</LabelPill></div>
    {Array.from({length:6}).map((_,i)=>{const t=phase(frame,durationInFrames,.52+i*.045,.70+i*.045);return <div key={i} style={{position:'absolute',left:585+i*56,top:680+i*17,opacity:t*.38,transform:`scale(${.6+.5*t})`}}><GoldCoin size={26+i*3} opacity={.4}/></div>})}
    <div style={{position:'absolute',left:610,top:828,opacity:ghost}}><LabelPill kind="red">ENTGANGENES WACHSTUM</LabelPill></div>
    <div style={{position:'absolute',left:790,top:205,opacity:end,transform:`scale(${.78+.22*end})`}}><div style={{fontFamily:FONT.title,fontSize:74,color:C.goldLt}}>WACHSTUM</div><div style={{marginTop:8,fontFamily:FONT.body,fontWeight:800,fontSize:28,color:C.white}}>nur auf Kapital, das noch da ist</div></div>
  </SceneShell>;
};

export const ModelReturnSplitAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame();
  const source=phase(frame,durationInFrames,.04,.24);
  const split=phase(frame,durationInFrames,.18,.42);
  const fees=phase(frame,durationInFrames,.36,.62);
  const result=phase(frame,durationInFrames,.58,.88);
  const paths=[{x:300,cost:'−0,2 %',out:'5,8 %',kind:'green' as const},{x:780,cost:'−1,5 %',out:'4,5 %',kind:'red' as const}];
  return <SceneShell copy={ETF_COST_COPY[4]}>
    <div style={{position:'absolute',left:380,top:45,width:320,height:150,borderRadius:38,border:`3px solid ${a(C.goldLt,.7)}`,background:a(C.gold,.12),display:'grid',placeItems:'center',opacity:source,transform:`scale(${.8+.2*source})`}}><div style={{textAlign:'center'}}><div style={{fontFamily:FONT.title,fontSize:82,color:C.goldLt}}>6,0 %</div><div style={{fontFamily:FONT.body,fontWeight:900,fontSize:23,color:C.white}}>MODELL VOR KOSTEN</div></div></div>
    <svg width="1080" height="1020" style={{position:'absolute',inset:0}}>
      <path d="M540 195 L540 280" stroke={C.gold} strokeWidth="16" opacity={split}/>
      <path d="M540 280 C540 340 300 330 300 430" fill="none" stroke={C.gold} strokeWidth="16" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>
      <path d="M540 280 C540 340 780 330 780 430" fill="none" stroke={C.gold} strokeWidth="16" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>
    </svg>
    {paths.map((path,i)=><React.Fragment key={path.x}>
      <div style={{position:'absolute',left:path.x-92,top:410,width:184,height:108,borderRadius:26,border:`3px solid ${a(C.negativeLt,.7)}`,background:a(C.negative,.14),display:'grid',placeItems:'center',opacity:fees,transform:`translateY(${(1-fees)*30}px)`}}><div style={{fontFamily:FONT.title,fontSize:40,color:C.negativeLt}}>{path.cost}</div><div style={{position:'absolute',bottom:9,fontFamily:FONT.body,fontWeight:850,fontSize:18,color:C.white}}>LAUFENDE KOSTEN</div></div>
      <Pipe x={path.x} y={518} h={190} color={i===0?C.accentLt:C.gold}/>
      <div style={{position:'absolute',left:path.x-130,top:705,width:260,height:190,borderRadius:36,border:`3px solid ${a(i===0?C.accentLt:C.goldLt,.6)}`,background:a(i===0?C.accent:C.gold,.11),display:'grid',placeItems:'center',opacity:result,transform:`scale(${.78+.22*result})`}}><div style={{textAlign:'center'}}><div style={{fontFamily:FONT.title,fontSize:78,color:i===0?C.accentLt:C.goldLt}}>{path.out}</div><div style={{fontFamily:FONT.body,fontWeight:900,fontSize:21,color:C.white}}>MODELL NACH KOSTEN</div></div></div>
      <div style={{position:'absolute',left:path.x-82,top:920,opacity:result}}><LabelPill kind={path.kind}>{i===0?'PFAD A':'PFAD B'}</LabelPill></div>
    </React.Fragment>)}
  </SceneShell>;
};
