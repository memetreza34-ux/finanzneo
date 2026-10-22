import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'emergency-at-market-drawdown';
export const VISUAL_TECHNIQUE_ID = 'chart-event-collision';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {START:'Depot ohne akuten Notfall', MECHANISM:'Hypothetische Kurve fällt auf -25 %, dann trifft Reparatur ein', RESULT:'Verkauf im Minus wird als Timingproblem markiert'};

export const YouTubeVisual16Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const draw=interpolate(frame,[0,70],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const event=interpolate(frame,[70,92],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const sell=interpolate(frame,[92,112],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const pathLength=900*draw;
  return <MotionStage transparent>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
      <path d="M 930 250 C 1080 230, 1150 330, 1260 360 S 1450 520, 1690 610" fill="none" stroke={COLORS.red} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${pathLength} 1200`}/>
      <line x1="1690" y1="610" x2="1690" y2="760" stroke={COLORS.red} strokeWidth="5" opacity={event}/>
    </svg>
    <div style={{position:'absolute',right:120,top:160,fontSize:44,fontWeight:900,opacity:draw}}>Beispiel: Depot <span style={{color:COLORS.red}}>-25 %</span></div>
    <div style={{position:'absolute',right:110,top:700,padding:'22px 30px',borderRadius:20,backgroundColor:'rgba(5,5,5,0.88)',border:`3px solid ${COLORS.red}`,fontSize:36,fontWeight:900,opacity:event,transform:`translateY(${(1-event)*70}px)`}}>Reparatur jetzt</div>
    <div style={{position:'absolute',right:560,top:790,fontSize:34,color:COLORS.red,opacity:sell}}>Verkauf mit Verlust</div>
  </MotionStage>;
};
