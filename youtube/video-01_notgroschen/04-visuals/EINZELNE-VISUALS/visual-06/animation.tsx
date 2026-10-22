import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'emergency-context-highlights';
export const VISUAL_TECHNIQUE_ID = 'grounded-context-spotlight-sequence';
export const COMPOSITION_FAMILY_ID = 'image-composite';
export const ANIMATION_NARRATIVE = {START:'Alle realen Notfallanker sind sichtbar', MECHANISM:'Fokus wandert von Situation zu Situation', RESULT:'Vier notwendige Notfälle sind klar unterschieden'};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const zones=[{label:'Reparatur',x:100,y:180,start:0},{label:'Rechnung',x:1020,y:140,start:32},{label:'Arbeitsweg',x:180,y:650,start:64},{label:'Weniger Einkommen',x:1040,y:650,start:96}];
  const active=Math.min(zones.length-1,Math.floor(frame/32));
  return <MotionStage transparent>
    <div style={{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,0.20)'}}/>
    {zones.map((z,i)=>{const p=interpolate(frame,[z.start,z.start+14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const isActive=i===active;return <div key={z.label} style={{position:'absolute',left:z.x,top:z.y,width:760,height:300,borderRadius:44,border:`5px solid ${isActive?COLORS.green:'rgba(255,255,255,0.18)'}`,boxShadow:isActive?`0 0 60px rgba(45,216,129,0.22)`:'none',opacity:Math.max(0.32,p)}}><div style={{position:'absolute',left:24,bottom:20,padding:'12px 20px',borderRadius:16,backgroundColor:'rgba(5,5,5,0.8)',fontSize:34,fontWeight:800}}>{z.label}</div></div>;})}
  </MotionStage>;
};
