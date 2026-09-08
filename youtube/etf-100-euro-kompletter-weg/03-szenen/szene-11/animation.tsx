import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "sector-world-reveal";
export const VISUAL_TECHNIQUE_ID = "layered-sector-camera-journey";
export const COMPOSITION_FAMILY_ID = "camera-journey";
export const ANIMATION_NARRATIVE = {START:"ETF share foreground", MECHANISM:"camera passes multiple sectors", RESULT:"wide diversified world revealed"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual11Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,105],[0,1],clamp);const stages=['100 €','BÖRSE','ETF','FONDS','UNTERNEHMEN'];return <AbsoluteFill style={{background:C.bg,overflow:'hidden'}}><div style={{position:'absolute',left:0,top:0,height:'100%',width:5000,display:'flex',alignItems:'center',gap:300,transform:'translateX('+(-3100*p)+'px) scale('+(1+0.08*p)+')'}}>{stages.map((s,i)=><div key={s} style={{width:620,height:420,borderRadius:50,border:'4px solid '+(i===0?C.gold:C.green),display:'grid',placeItems:'center',fontSize:72,fontWeight:900,color:C.white,background:'#0C1512'}}>{s}</div>)}</div><div style={{position:'absolute',bottom:70,width:'100%',textAlign:'center',fontSize:44,color:C.mint}}>Travel from one ETF share through different real-economy sectors to reveal diversification.</div></AbsoluteFill>};
