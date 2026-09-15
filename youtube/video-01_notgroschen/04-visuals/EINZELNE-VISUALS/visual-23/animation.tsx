import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'savings-rate-timefield';
export const VISUAL_TECHNIQUE_ID = 'rate-speed-comparison';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {START:'Drei mögliche Beispielraten', MECHANISM:'Alle bewegen sich auf dasselbe Ziel mit unterschiedlicher Geschwindigkeit', RESULT:'Passende Rate beeinflusst Tempo, nicht die Funktion'};

export const YouTubeVisual23Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const rows=[{label:'50 €',speed:0.55,y:300},{label:'100 €',speed:0.78,y:510},{label:'200 €',speed:1,y:720}];
  return <MotionStage>
    <div style={{position:'absolute',left:180,top:120,fontSize:44,fontWeight:900}}>Beispielraten – keine davon ist „die richtige“</div>
    {rows.map((row)=>{const p=interpolate(frame,[10,110/row.speed],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={row.label}><div style={{position:'absolute',left:200,top:row.y-20,fontSize:42,fontWeight:900,width:160}}>{row.label}</div><div style={{position:'absolute',left:400,top:row.y,width:1180,height:24,borderRadius:12,backgroundColor:COLORS.line}}/><div style={{position:'absolute',left:400,top:row.y,width:1180*p,height:24,borderRadius:12,backgroundColor:COLORS.green}}/><div style={{position:'absolute',left:400+1180*p-22,top:row.y-10,width:44,height:44,borderRadius:22,backgroundColor:COLORS.gold}}/><div style={{position:'absolute',left:1610,top:row.y-22,fontSize:30,color:p>=0.99?COLORS.green:COLORS.gray}}>Ziel</div></div>;})}
  </MotionStage>;
};
