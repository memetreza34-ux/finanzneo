import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "broker-order-routing";
export const VISUAL_TECHNIQUE_ID = "order-slip-market-match";
export const COMPOSITION_FAMILY_ID = "document-motion";
export const ANIMATION_NARRATIVE = {START:"buy order enters", MECHANISM:"seller quote matches", RESULT:"ETF share moves to investor"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual02Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,85],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,justifyContent:'center',alignItems:'center'}}><div style={{display:'flex',alignItems:'center',gap:110}}><div style={{width:430,height:500,borderRadius:30,background:'#F0EBDD',transform:'translateX('+(80*p)+'px) rotate('+(-4+4*p)+'deg)',padding:50,color:'#111',fontSize:45,fontWeight:800}}>KAUFAUFTRAG<div style={{marginTop:70,fontSize:74,color:'#125B42'}}>100 €</div></div><div style={{fontSize:90,color:C.gold,opacity:p}}>→</div><div style={{width:430,height:500,borderRadius:30,background:'#17231F',border:'3px solid '+C.green,transform:'translateX('+(-80*(1-p))+'px)',display:'grid',placeItems:'center',fontSize:64,fontWeight:900,color:C.white}}>ETF</div></div><div style={{position:'absolute',bottom:90,fontSize:44,color:C.mint}}>Show a concrete buy order becoming a matched ETF trade.</div></AbsoluteFill>};
