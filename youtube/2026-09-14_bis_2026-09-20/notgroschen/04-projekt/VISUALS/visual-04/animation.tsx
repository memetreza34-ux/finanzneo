import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'target-number-debate';
export const VISUAL_TECHNIQUE_ID = 'kinetic-scale-comparison';
export const COMPOSITION_FAMILY_ID = 'kinetic-type';
export const ANIMATION_NARRATIVE = {START:'1.000 € wirkt wie die Antwort', MECHANISM:'Weitere Zielgrößen konkurrieren', RESULT:'Die starre Zahl wird durch eine individuelle Frage ersetzt'};

export const YouTubeVisual04Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const options=[{text:'1.000 €',x:260,start:0},{text:'3 Monatsgehälter',x:720,start:24},{text:'mehr?',x:1370,start:48}];
  const question=interpolate(frame,[78,104],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    {options.map((o,i)=>{const p=spring({frame:frame-o.start,fps,config:{damping:14,stiffness:120}});const fade=1-question;return <div key={o.text} style={{position:'absolute',left:o.x,top:380,transform:`scale(${0.72+p*0.28}) translateY(${(1-p)*70}px)`,opacity:p*fade,fontSize:i===1?82:96,fontWeight:900,color:i===2?COLORS.gold:COLORS.white,whiteSpace:'nowrap'}}>{o.text}</div>;})}
    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:question,transform:`scale(${interpolate(question,[0,1],[0.7,1])})`,fontSize:260,fontWeight:900,color:COLORS.green}}>?</div>
    <div style={{position:'absolute',bottom:150,width:'100%',textAlign:'center',opacity:question,fontSize:46,fontWeight:700}}>Welche Höhe passt zu deinem Risiko?</div>
  </MotionStage>;
};
