import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "purchase-to-fund-share";
export const VISUAL_TECHNIQUE_ID = "masked-money-to-etf-share";
export const COMPOSITION_FAMILY_ID = "image-composite";
export const ANIMATION_NARRATIVE = {START:"100 € at broker", MECHANISM:"ETF share becomes focal object", RESULT:"companies appear behind the fund layer"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual01Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);return <AbsoluteFill style={{background:'transparent'}}><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at '+(20+60*p)+'% 50%, rgba(34,224,138,.28), transparent 23%)'}}/><div style={{position:'absolute',left:180+1250*p,top:440,width:120,height:120,borderRadius:34,border:'5px solid '+C.gold,boxShadow:'0 0 40px rgba(242,198,109,.35)'}}/><div style={{position:'absolute',left:220,top:760,right:220,height:7,background:'#24342D'}}><div style={{height:'100%',width:(100*p)+'%',background:C.green}}/></div><div style={{position:'absolute',bottom:90,width:'100%',textAlign:'center',fontSize:48,fontWeight:900,color:C.white}}>Reveal the hidden ETF-share layer between the investor payment and underlying companies.</div></AbsoluteFill>};
