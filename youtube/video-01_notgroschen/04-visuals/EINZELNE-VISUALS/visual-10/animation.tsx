import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'reserve-month-multiplication';
export const VISUAL_TECHNIQUE_ID = 'stacked-month-volume-build';
export const COMPOSITION_FAMILY_ID = 'spatial-3d';
export const ANIMATION_NARRATIVE = {START:'Ein Sicherheitsmonat = 1.500 €', MECHANISM:'Monatsblöcke duplizieren sich in die Tiefe', RESULT:'Drei Monate = 4.500 €'};

export const YouTubeVisual10Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const p2=spring({frame:frame-34,fps,config:{damping:16,stiffness:110}}); const p3=spring({frame:frame-68,fps,config:{damping:16,stiffness:110}});
  const count=frame<34?1:frame<68?2:3; const total=count*1500;
  const blocks=[1,p2,p3];
  return <MotionStage>
    <div style={{position:'absolute',left:220,top:220,width:1050,height:600,perspective:1100}}>{blocks.map((p,i)=><div key={i} style={{position:'absolute',left:120+i*220,top:120-i*45,width:520,height:300,borderRadius:36,backgroundColor:i===0?COLORS.green:'#1D6F49',border:'3px solid rgba(255,255,255,0.18)',transform:`translateZ(${i*45}px) scale(${0.84+p*0.16})`,opacity:p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,fontWeight:900}}>{i+1}. Monat</div>)}</div>
    <div style={{position:'absolute',right:170,top:370,fontSize:42,color:COLORS.gray}}>{count} Monat{count>1?'e':''}</div><div style={{position:'absolute',right:170,top:440,fontSize:96,fontWeight:900,color:COLORS.white}}>{total.toLocaleString('de-DE')} €</div>
  </MotionStage>;
};
