import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "dividend-routing";
export const VISUAL_TECHNIQUE_ID = "company-cashflow-to-fund-simulation";
export const COMPOSITION_FAMILY_ID = "simulation";
export const ANIMATION_NARRATIVE = {START:"companies generate dividends", MECHANISM:"payments converge on fund", RESULT:"fund income pool increases"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual14Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const starts=[[260,250],[260,500],[260,750]];return <AbsoluteFill style={{background:C.bg}}>{starts.map(([sx,sy],i)=>{const x=sx+(1080-sx)*p;const y=sy+(500-sy)*p;return <div key={i} style={{position:'absolute',left:x,top:y,width:90,height:90,borderRadius:'50%',background:i===1?C.gold:C.green,boxShadow:'0 0 35px rgba(34,224,138,.25)'}}/>})}<div style={{position:'absolute',left:1050,top:350,width:500,height:300,borderRadius:40,border:'4px solid '+C.mint,display:'grid',placeItems:'center',fontSize:58,fontWeight:900,color:C.white}}>ETF-FONDS</div><div style={{position:'absolute',bottom:80,width:'100%',textAlign:'center',fontSize:46,color:C.white}}>Route dividends from multiple companies into the ETF fund pool before any investor-level decision.</div></AbsoluteFill>};
