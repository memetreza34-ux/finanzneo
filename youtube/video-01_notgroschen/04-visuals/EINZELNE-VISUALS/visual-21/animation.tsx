import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'first-milestone-reframe';
export const VISUAL_TECHNIQUE_ID = 'distant-goal-to-near-step';
export const COMPOSITION_FAMILY_ID = 'camera-journey';
export const ANIMATION_NARRATIVE = {START:'Großes Sparziel wirkt weit entfernt', MECHANISM:'Kamera re-framed auf eine erste konkrete Sicherheitsstufe', RESULT:'Erster erreichbarer Puffer ist klar'};

export const YouTubeVisual21Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const reframe=interpolate(frame,[20,72],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const hit=spring({frame:frame-72,fps,config:{damping:15,stiffness:125}});
  return <MotionStage>
    <div style={{position:'absolute',inset:0,perspective:1000,transform:`translateX(${reframe*240}px) scale(${1+reframe*0.08})`}}>
      <Panel style={{position:'absolute',right:180,top:260,width:430,height:260,padding:44,opacity:1-reframe*0.72,transform:'translateZ(-250px)',fontSize:48,fontWeight:900}}>Großes Endziel</Panel>
      <Panel style={{position:'absolute',left:240,top:420,width:620,height:300,padding:50,borderColor:COLORS.green,transform:`scale(${0.82+0.18*hit})`,boxShadow:`0 0 ${55*hit}px rgba(45,216,129,0.22)`}}><div style={{fontSize:34,color:COLORS.gray}}>Erste Stufe</div><div style={{fontSize:58,fontWeight:900,marginTop:45}}>Eine typische Rechnung abfangen</div></Panel>
    </div>
    <div style={{position:'absolute',left:250,bottom:130,fontSize:32,color:COLORS.green,opacity:hit}}>Erst erreichbar. Dann weiter aufbauen.</div>
  </MotionStage>;
};
