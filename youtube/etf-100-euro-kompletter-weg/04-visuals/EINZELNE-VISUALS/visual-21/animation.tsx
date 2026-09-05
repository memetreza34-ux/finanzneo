import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "market-cycle-timeline";
export const VISUAL_TECHNIQUE_ID = "calendar-market-cycle-corridor";
export const COMPOSITION_FAMILY_ID = "timeline";
export const ANIMATION_NARRATIVE = {START:"ETF enters timeline", MECHANISM:"up and down phases alternate", RESULT:"long horizon ends without guaranteed payoff"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual21Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,100],[0,1],clamp);const x=220+1480*p;return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',top:520,left:220,width:1480,height:8,background:'#35413C',borderRadius:8}}/><div style={{position:'absolute',top:465,left:x-45,width:90,height:90,borderRadius:24,background:C.green,boxShadow:'0 0 50px rgba(34,224,138,.35)'}}/><div style={{position:'absolute',top:370,left:220,fontSize:44,color:C.white}}>2026</div><div style={{position:'absolute',top:610,left:520,fontSize:44,color:C.red}}>↓ Markt</div><div style={{position:'absolute',top:380,left:880,fontSize:44,color:C.green}}>↑ Markt</div><div style={{position:'absolute',top:610,left:1240,fontSize:44,color:C.red}}>↓ Markt</div><div style={{position:'absolute',bottom:100,width:'100%',textAlign:'center',fontSize:48,fontWeight:800,color:C.white}}>Move the ETF through alternating up and down market periods over a long calendar.</div></AbsoluteFill>};
