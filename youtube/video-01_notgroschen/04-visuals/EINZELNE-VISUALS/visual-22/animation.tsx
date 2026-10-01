import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'salary-auto-routing';
export const VISUAL_TECHNIQUE_ID = 'payday-automatic-switch';
export const COMPOSITION_FAMILY_ID = 'physical-process';
export const ANIMATION_NARRATIVE = {START:'Gehalt kommt aufs Konto', MECHANISM:'Automatischer Schalter trennt den Sparanteil sofort ab', RESULT:'Reserve wächst bevor Alltag konsumiert'};

export const YouTubeVisual22Animation: React.FC = () => {
  const frame=useCurrentFrame(); const flow=interpolate(frame,[8,78],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const reserve=interpolate(frame,[48,94],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const mainX=170+620*Math.min(1,flow*1.35);
  return <MotionStage>
    <Panel style={{position:'absolute',left:100,top:420,width:300,height:160,padding:40,borderColor:COLORS.white}}><div style={{fontSize:42,fontWeight:900}}>Gehalt</div></Panel>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><line x1="400" y1="500" x2="920" y2="500" stroke={COLORS.white} strokeWidth="12"/><path d="M 920 500 C 1100 500, 1120 300, 1420 300" fill="none" stroke={COLORS.green} strokeWidth="12"/><path d="M 920 500 C 1100 500, 1120 700, 1420 700" fill="none" stroke={COLORS.gray} strokeWidth="12"/></svg>
    <div style={{position:'absolute',left:mainX-28,top:472,width:56,height:56,borderRadius:28,backgroundColor:COLORS.gold}}/>
    <div style={{position:'absolute',left:900,top:450,width:70,height:100,borderRadius:20,border:`4px solid ${COLORS.green}`,transform:`rotate(${reserve*32-16}deg)`,transformOrigin:'center'}}/>
    <Panel style={{position:'absolute',left:1420,top:220,width:360,height:160,padding:36,borderColor:COLORS.green,opacity:reserve}}><div style={{fontSize:38,fontWeight:900}}>Notgroschen</div></Panel>
    <Panel style={{position:'absolute',left:1420,top:620,width:360,height:160,padding:36,opacity:flow}}><div style={{fontSize:38,fontWeight:900}}>Giro-Rest</div></Panel>
  </MotionStage>;
};
