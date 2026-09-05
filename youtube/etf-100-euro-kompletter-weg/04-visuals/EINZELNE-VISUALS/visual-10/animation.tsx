import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "special-assets-separation";
export const VISUAL_TECHNIQUE_ID = "css3d-separated-custody-vaults";
export const COMPOSITION_FAMILY_ID = "css-3d";
export const ANIMATION_NARRATIVE = {START:"company and fund assets visible", MECHANISM:"company side becomes unavailable", RESULT:"fund assets remain in separate custody"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const YouTubeVisual10Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,80],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,perspective:1400,alignItems:'center',justifyContent:'center'}}><div style={{display:'flex',gap:120,transform:'rotateX('+(8-8*p)+'deg)'}}><div style={{width:520,height:360,borderRadius:32,background:'#151A18',border:'3px solid '+C.red,transform:'translateX('+(-120*p)+'px) rotateY('+(12*p)+'deg)',display:'grid',placeItems:'center',fontSize:54,fontWeight:900,color:C.white}}>Unternehmen</div><div style={{width:520,height:360,borderRadius:32,background:'#0D1B16',border:'3px solid '+C.green,transform:'translateX('+(120*p)+'px) rotateY('+(-12*p)+'deg)',display:'grid',placeItems:'center',fontSize:54,fontWeight:900,color:C.white}}>Fondsvermögen</div></div><div style={{position:'absolute',bottom:90,fontSize:42,color:C.mint}}>getrennt verwahrt</div></AbsoluteFill>};
