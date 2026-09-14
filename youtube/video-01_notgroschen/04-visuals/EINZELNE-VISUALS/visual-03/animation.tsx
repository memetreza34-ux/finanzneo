import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'consequence-routing';
export const VISUAL_TECHNIQUE_ID = 'branching-finance-path';
export const COMPOSITION_FAMILY_ID = 'network-simulation';
export const ANIMATION_NARRATIVE = {START:'Offene Rechnung ohne Reserve', MECHANISM:'Drei mögliche Auswege werden geprüft', RESULT:'Dispo, Kredit und Depotverkauf werden als belastende Notlösungen sichtbar'};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const nodes = [{name:'Dispo',y:220,start:18},{name:'Kredit',y:455,start:42},{name:'Depot verkaufen',y:690,start:66}];
  return <MotionStage>
    <Panel style={{position:'absolute',left:150,top:420,width:360,height:170,padding:38,borderColor:COLORS.white}}><div style={{fontSize:42,fontWeight:800}}>Rechnung</div><div style={{fontSize:28,color:COLORS.red}}>muss bezahlt werden</div></Panel>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
      {nodes.map((node) => {const p=interpolate(frame,[node.start,node.start+24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const endX=1280; const endY=node.y+70; return <line key={node.name} x1="510" y1="505" x2={510+(endX-510)*p} y2={505+(endY-505)*p} stroke={COLORS.red} strokeWidth="8" strokeLinecap="round"/>;})}
    </svg>
    {nodes.map((node)=>{const opacity=interpolate(frame,[node.start+12,node.start+30],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <Panel key={node.name} style={{position:'absolute',left:1280,top:node.y,width:450,height:140,padding:'42px 38px',opacity,borderColor:COLORS.red,fontSize:38,fontWeight:800}}>{node.name}</Panel>;})}
  </MotionStage>;
};
