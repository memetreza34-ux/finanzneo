import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'security-gate-to-investment';
export const VISUAL_TECHNIQUE_ID = 'gate-then-growth-path';
export const COMPOSITION_FAMILY_ID = 'camera-journey';
export const ANIMATION_NARRATIVE = {START:'Sicherheitszone ist noch offen', MECHANISM:'Reserve füllt sich und verriegelt', RESULT:'Danach öffnet sich getrennt der langfristige Investmentpfad'};

export const YouTubeVisual28Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const fill=interpolate(frame,[8,65],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const gate=spring({frame:frame-62,fps,config:{damping:18,stiffness:125}}); const path=interpolate(frame,[82,132],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    <div style={{position:'absolute',left:170,top:250,width:650,height:500,borderRadius:60,border:`6px solid ${COLORS.green}`,overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${fill*100}%`,backgroundColor:'rgba(45,216,129,0.28)'}}/><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,fontWeight:900}}>Sicherheit</div></div>
    <div style={{position:'absolute',left:780,top:330,width:120,height:340,backgroundColor:COLORS.green,transform:`scaleY(${gate})`,transformOrigin:'bottom',borderRadius:20}}/>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d="M 900 500 C 1120 500, 1260 420, 1740 300" fill="none" stroke={COLORS.gold} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${1000*path} 1200`}/></svg>
    <div style={{position:'absolute',right:160,top:210,fontSize:48,fontWeight:900,color:COLORS.gold,opacity:path}}>Langfristig investieren</div><div style={{position:'absolute',right:160,top:280,fontSize:30,color:COLORS.gray,opacity:path}}>erst mit Geld, das du langfristig nicht brauchst</div>
  </MotionStage>;
};
