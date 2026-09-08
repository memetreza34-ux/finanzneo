import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "diversification-risk-comparison";
export const VISUAL_TECHNIQUE_ID = "single-vs-broad-weight-grid";
export const COMPOSITION_FAMILY_ID = "data-viz";
export const ANIMATION_NARRATIVE = {START:"single company concentration", MECHANISM:"many smaller holdings", RESULT:"broad market shock affects the group"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual12Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const values=[0.28,0.48,0.68,0.86];return <AbsoluteFill style={{background:C.bg,padding:'150px 210px'}}><div style={{fontSize:54,fontWeight:900,color:C.white,marginBottom:70}}>Contrast single-stock concentration with diversified holdings and then demonstrate common market risk.</div><div style={{display:'flex',height:520,alignItems:'flex-end',gap:70}}>{values.map((v,i)=><div key={i} style={{width:190,height:460*v*p,borderRadius:'28px 28px 8px 8px',background:i===values.length-1?C.gold:C.green,boxShadow:'0 0 45px rgba(34,224,138,.18)'}}/>)}</div><div style={{position:'absolute',bottom:100,left:210,right:210,height:4,background:'#313735'}}/></AbsoluteFill>};
