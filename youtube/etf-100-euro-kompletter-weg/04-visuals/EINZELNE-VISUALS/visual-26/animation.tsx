import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "index-rebalancing";
export const VISUAL_TECHNIQUE_ID = "svg-weight-rebalance-morph";
export const COMPOSITION_FAMILY_ID = "vector-motion";
export const ANIMATION_NARRATIVE = {START:"old index weights", MECHANISM:"index rule change", RESULT:"ETF portfolio rebalanced"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual26Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const sel=interpolate(f,[18,65],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,alignItems:'center',justifyContent:'center'}}><svg width="1500" height="650" viewBox="0 0 1500 650">{Array.from({length:18}).map((_,i)=>{const x=90+(i%9)*150;const y=120+Math.floor(i/9)*220;const chosen=i%3!==2;const tx=chosen?520+(i%6)*95:x;const ty=chosen?420+(i%2)*80:y;return <g key={i} transform={'translate('+(x+(tx-x)*sel)+' '+(y+(ty-y)*sel)+')'}><rect x={-42} y={-28} width={84} height={56} rx={14} fill={chosen?C.green:C.muted} opacity={chosen?0.9:1-sel*0.75}/></g>})}<path d="M180 320 C520 140 980 140 1320 320" fill="none" stroke={C.gold} strokeWidth={8} strokeDasharray={1400} strokeDashoffset={1400*(1-p)}/></svg><div style={{fontSize:52,fontWeight:800,color:C.white}}>Show index weights changing and the fund portfolio rebalancing to follow them.</div></AbsoluteFill>};
