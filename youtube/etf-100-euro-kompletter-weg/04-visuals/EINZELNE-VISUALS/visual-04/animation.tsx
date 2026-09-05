import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "creation-redemption-bridge";
export const VISUAL_TECHNIQUE_ID = "dual-market-basket-exchange";
export const COMPOSITION_FAMILY_ID = "comparison";
export const ANIMATION_NARRATIVE = {START:"investor trades existing share", MECHANISM:"AP assembles securities basket", RESULT:"basket and ETF units exchange with fund"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual04Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,85],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,flexDirection:'row'}}><div style={{width:'50%',display:'grid',placeItems:'center',borderRight:'2px solid #36433D'}}><div style={{textAlign:'center',transform:'translateY('+(30*(1-p))+'px)',opacity:p}}><div style={{fontSize:54,fontWeight:900,color:C.green}}>SEKUNDÄRMARKT</div><div style={{fontSize:72,marginTop:50,color:C.white}}>ANLEGER ↔ ETF</div></div></div><div style={{width:'50%',display:'grid',placeItems:'center'}}><div style={{textAlign:'center',transform:'translateY('+(-30*(1-p))+'px)',opacity:p}}><div style={{fontSize:54,fontWeight:900,color:C.gold}}>PRIMÄRMARKT</div><div style={{fontSize:72,marginTop:50,color:C.white}}>KORB ↔ ETF</div></div></div><div style={{position:'absolute',bottom:70,width:'100%',textAlign:'center',fontSize:42,color:C.white}}>Explain secondary market versus primary market and the basket-for-shares exchange.</div></AbsoluteFill>};
