import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'dual-horizon-separation';
export const VISUAL_TECHNIQUE_ID = 'horizon-lane-split';
export const COMPOSITION_FAMILY_ID = 'timeline';
export const ANIMATION_NARRATIVE = {START:'Ein Geldbetrag ohne klare Aufgabe', MECHANISM:'Kapital teilt sich nach Zeithorizont', RESULT:'Reserve und Investment haben getrennte Rollen'};

export const YouTubeVisual17Animation: React.FC = () => {
  const frame=useCurrentFrame(); const split=interpolate(frame,[10,46],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const extend=interpolate(frame,[40,95],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    <div style={{position:'absolute',left:150,top:465,width:220,height:120,borderRadius:60,backgroundColor:COLORS.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:900}}>Geld</div>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d={`M 370 525 C 520 525, 540 360, ${650+650*extend} 360`} fill="none" stroke={COLORS.green} strokeWidth="14" opacity={split}/><path d={`M 370 525 C 520 525, 540 690, ${650+1020*extend} 690`} fill="none" stroke={COLORS.gold} strokeWidth="14" opacity={split}/></svg>
    <div style={{position:'absolute',left:670,top:270,fontSize:44,fontWeight:900,color:COLORS.green,opacity:split}}>Notgroschen</div><div style={{position:'absolute',left:670,top:330,fontSize:28,color:COLORS.gray,opacity:split}}>kurzfristig · stabil · verfügbar</div>
    <div style={{position:'absolute',left:670,top:735,fontSize:44,fontWeight:900,color:COLORS.gold,opacity:split}}>Investment</div><div style={{position:'absolute',left:670,top:795,fontSize:28,color:COLORS.gray,opacity:split}}>langfristig · schwankend · Vermögensaufbau</div>
  </MotionStage>;
};
