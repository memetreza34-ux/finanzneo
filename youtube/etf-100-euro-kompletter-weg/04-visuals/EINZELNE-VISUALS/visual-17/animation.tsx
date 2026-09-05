import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "bid-ask-spread";
export const VISUAL_TECHNIQUE_ID = "bid-ask-price-squeeze";
export const COMPOSITION_FAMILY_ID = "kinetic-type";
export const ANIMATION_NARRATIVE = {START:"buy and sell prices separated", MECHANISM:"spread highlighted", RESULT:"prices and gap settle"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual17Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,75],[0,1],clamp);const bid=100.00+0.08*p;const ask=100.34-0.10*p;return <AbsoluteFill style={{background:C.bg,justifyContent:'center',alignItems:'center'}}><div style={{display:'flex',gap:130,alignItems:'center'}}><div style={{fontSize:105,fontWeight:900,color:C.green}}>{bid.toFixed(2)} €</div><div style={{fontSize:46,color:C.muted}}>SPREAD</div><div style={{fontSize:105,fontWeight:900,color:C.red}}>{ask.toFixed(2)} €</div></div><div style={{height:10,width:500,background:C.gold,marginTop:60,transform:'scaleX('+(1-p*0.55)+')',borderRadius:99}}/><div style={{fontSize:44,color:C.white,marginTop:40}}>Make bid and ask prices converge visually while preserving the gap called Spread.</div></AbsoluteFill>};
