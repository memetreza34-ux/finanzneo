import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {C,FONT,a} from '../../brand';
import {ETF_COST_COPY} from './config';
import {GoldCoin,LabelPill,SceneShell} from './layout';

const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const phase=(f:number,d:number,s:number,e:number)=>interpolate(f,[d*s,d*e],[0,1],CLAMP);
const loop=(v:number)=>v-Math.floor(v);

const Gate:React.FC<{x:number;y:number;label:string;active:number}>=({x,y,label,active})=><div style={{position:'absolute',left:x-115,top:y-50,width:230,height:100,borderRadius:28,border:`3px solid ${a(C.negativeLt,.65)}`,background:a(C.negative,.10),display:'grid',placeItems:'center',opacity:.35+.65*active,transform:`scale(${.93+.07*active})`,boxShadow:`0 0 ${20+26*active}px ${a(C.negative,.18)}`}}><div style={{fontFamily:FONT.body,fontWeight:900,fontSize:23,color:C.negativeLt,textAlign:'center',padding:'0 10px'}}>{label}</div></div>;

export const CostLayersJourneyAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
 const frame=useCurrentFrame();
 const journey=phase(frame,durationInFrames,.05,.92);
 const purchase=phase(frame,durationInFrames,.08,.28);
 const ongoing=phase(frame,durationInFrames,.30,.68);
 const sale=phase(frame,durationInFrames,.70,.90);
 const x=120+840*journey;
 const y=journey<.35?486:journey<.72?386:616;
 return <SceneShell copy={ETF_COST_COPY[7]}>
  <svg width="1080" height="1020" style={{position:'absolute',inset:0}}><path d="M100 520 C250 520 270 420 410 420 C560 420 560 650 700 650 C820 650 840 520 980 520" fill="none" stroke={a(C.gold,.52)} strokeWidth="16" strokeLinecap="round"/></svg>
  <div style={{position:'absolute',left:x-34,top:y,zIndex:20}}><GoldCoin size={68}/></div>
  <Gate x={230} y={520} label="ORDERENTGELT BEIM KAUF" active={purchase}/>
  <div style={{position:'absolute',left:410,top:250,width:260,height:330,borderRadius:42,border:`3px solid ${a(C.accentLt,.45)}`,background:a(C.accent,.07),opacity:ongoing}}><div style={{position:'absolute',top:24,left:0,right:0,textAlign:'center',fontFamily:FONT.body,fontWeight:900,fontSize:24,color:C.accentLt}}>IM FONDS</div><div style={{position:'absolute',left:110,top:90,width:40,height:190,borderRadius:20,background:`linear-gradient(${C.goldLt},${C.gold})`}}/>{Array.from({length:5}).map((_,i)=>{const drip=loop(ongoing*2.2+i/5);return <div key={i} style={{position:'absolute',left:180+drip*55,top:110+i*38,opacity:ongoing*.75}}><GoldCoin size={20} opacity={.65}/><div style={{position:'absolute',inset:-4,borderRadius:'50%',border:`2px solid ${a(C.negative,.7)}`}}/></div>})}<div style={{position:'absolute',bottom:22,left:0,right:0,textAlign:'center',fontFamily:FONT.body,fontWeight:850,fontSize:20,color:C.negativeLt}}>LAUFENDE KOSTEN</div></div>
  <Gate x={850} y={520} label="MÖGLICHES ORDERENTGELT BEIM VERKAUF" active={sale}/>
  <div style={{position:'absolute',left:120,top:780,opacity:phase(frame,durationInFrames,.56,.80)}}><LabelPill kind="gold">MEHRERE KOSTENSTATIONEN SIND MÖGLICH</LabelPill></div>
 </SceneShell>;
};

export const CostDifferenceRevealAnimation=CostLayersJourneyAnimation;
