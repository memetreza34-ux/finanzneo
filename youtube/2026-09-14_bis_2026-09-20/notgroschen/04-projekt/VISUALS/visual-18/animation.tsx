import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'giro-to-tagesgeld-transfer';
export const VISUAL_TECHNIQUE_ID = 'account-depth-transfer';
export const COMPOSITION_FAMILY_ID = 'image-composite';
export const ANIMATION_NARRATIVE = {START:'Reserve liegt beim Giro', MECHANISM:'Ein Teil wird sichtbar zum Tagesgeld übertragen', RESULT:'Tagesgeld hält den Notgroschen getrennt und erreichbar'};

export const YouTubeVisual18Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const transfer=interpolate(frame,[18,78],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const settled=spring({frame:frame-76,fps,config:{damping:17,stiffness:120}});
  const x=460+(1450-460)*transfer; const y=560-80*Math.sin(transfer*Math.PI);
  return <MotionStage transparent>
    <div style={{position:'absolute',left:250,top:250,width:560,height:480,borderRadius:48,border:`4px solid rgba(255,255,255,${0.15+0.2*(1-transfer)})`}}/>
    <div style={{position:'absolute',right:210,top:230,width:610,height:520,borderRadius:48,border:`5px solid rgba(45,216,129,${0.2+0.8*settled})`,boxShadow:`0 0 ${50*settled}px rgba(45,216,129,0.2)`}}/>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d="M 460 560 C 800 400, 1120 400, 1450 560" fill="none" stroke={COLORS.green} strokeWidth="8" strokeDasharray="18 18" opacity={0.25+transfer*0.75}/></svg>
    <div style={{position:'absolute',left:x-38,top:y-38,width:76,height:76,borderRadius:38,backgroundColor:COLORS.green,boxShadow:'0 0 30px rgba(45,216,129,0.35)'}}/>
    <div style={{position:'absolute',right:350,bottom:180,fontSize:34,fontWeight:800,color:COLORS.green,opacity:settled}}>getrennt · kurzfristig erreichbar</div>
  </MotionStage>;
};
