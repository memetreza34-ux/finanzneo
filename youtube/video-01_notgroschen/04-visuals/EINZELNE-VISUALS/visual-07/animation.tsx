import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'liquidity-priority-shift';
export const VISUAL_TECHNIQUE_ID = 'priority-weight-transfer';
export const COMPOSITION_FAMILY_ID = 'material-transformation';
export const ANIMATION_NARRATIVE = {START:'Rendite wirkt zunächst attraktiv', MECHANISM:'Visuelles Gewicht wandert zur Liquidität', RESULT:'Reserve ist stabil und sofort verfügbar'};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const shift=interpolate(frame,[20,70],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const access=interpolate(frame,[70,105],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    <Panel style={{position:'absolute',left:170,top:300,width:650,height:360,padding:50,opacity:1-shift*0.72,transform:`scale(${1-shift*0.14})`}}><div style={{fontSize:52,fontWeight:900}}>Rendite</div><div style={{fontSize:110,color:COLORS.gold,marginTop:45}}>↗︎</div><div style={{fontSize:28,color:COLORS.gray}}>langfristig relevant</div></Panel>
    <Panel style={{position:'absolute',right:170,top:260,width:700,height:440,padding:50,borderColor:COLORS.green,transform:`scale(${0.9+shift*0.1})`,boxShadow:`0 0 ${60*shift}px rgba(45,216,129,0.25)`}}><div style={{fontSize:52,fontWeight:900}}>Notgroschen</div><div style={{marginTop:55,height:100,borderRadius:24,backgroundColor:COLORS.green,width:`${35+access*60}%`}}/><div style={{fontSize:30,marginTop:34,color:COLORS.green,opacity:access}}>sofort verfügbar → Rechnung</div></Panel>
  </MotionStage>;
};
