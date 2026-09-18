import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'rule-of-thumb-band';
export const VISUAL_TECHNIQUE_ID = 'salary-band-build';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {START:'Ein Monatsgehalt als Referenz', MECHANISM:'Zweiter und dritter Monatsblock bauen sich auf', RESULT:'2–3 wird ausdrücklich als Daumenregel markiert'};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const starts=[8,34,60];
  return <MotionStage>
    <div style={{position:'absolute',top:215,width:'100%',textAlign:'center',fontSize:46,fontWeight:800}}>Verbraucherzentrale: Orientierung</div>
    <div style={{position:'absolute',left:260,right:260,top:420,display:'flex',gap:70}}>{starts.map((s,i)=>{const p=spring({frame:frame-s,fps,config:{damping:16,stiffness:120}});return <div key={s} style={{flex:1,height:190,borderRadius:30,backgroundColor:i===0?COLORS.gray:COLORS.green,opacity:0.25+p*0.75,transform:`translateY(${(1-p)*70}px)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:900}}>{i+1} Monat{i>0?'e':''}</div>;})}</div>
    <div style={{position:'absolute',left:775,top:665,width:885,height:70,borderLeft:`5px solid ${COLORS.green}`,borderRight:`5px solid ${COLORS.green}`,borderBottom:`5px solid ${COLORS.green}`,opacity:interpolate(frame,[78,96],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}} />
    <div style={{position:'absolute',left:775,top:760,width:885,textAlign:'center',fontSize:38,fontWeight:800,color:COLORS.green,opacity:interpolate(frame,[90,108],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>Daumenregel – keine Pflicht</div>
  </MotionStage>;
};
