import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'reserve-separation-behavior';
export const VISUAL_TECHNIQUE_ID = 'spending-contamination-vs-separation';
export const COMPOSITION_FAMILY_ID = 'simulation';
export const ANIMATION_NARRATIVE = {START:'Monatsbudget und Reserve wirken wie ein gemeinsamer Topf', MECHANISM:'Freiwillige Ausgaben ziehen am gemischten Bereich', RESULT:'Nach Trennung bleibt der Notgroschen sichtbar geschützt'};

export const YouTubeVisual20Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const spend=interpolate(frame,[10,55],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const separate=interpolate(frame,[58,94],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage transparent>
    <div style={{position:'absolute',left:120,top:150,width:780,height:760,borderRadius:50,border:`5px solid rgba(255,107,74,${0.25+0.5*spend})`}} />
    <div style={{position:'absolute',left:210,bottom:190,width:560,height:56,borderRadius:28,backgroundColor:COLORS.line,overflow:'hidden'}}><div style={{height:'100%',width:`${100-52*spend}%`,backgroundColor:COLORS.red}}/></div>
    <div style={{position:'absolute',left:250,bottom:110,fontSize:30,color:COLORS.red,opacity:spend}}>Konsum zieht am gemeinsamen Betrag</div>
    <div style={{position:'absolute',right:110,top:145,width:800,height:770,borderRadius:50,border:`5px solid rgba(45,216,129,${0.2+0.8*separate})`,boxShadow:`0 0 ${60*separate}px rgba(45,216,129,0.18)`}} />
    <div style={{position:'absolute',right:250,bottom:125,fontSize:32,fontWeight:800,color:COLORS.green,opacity:separate}}>Notgroschen bleibt getrennt</div>
    <div style={{position:'absolute',left:930,top:125,width:4,height:820,backgroundColor:`rgba(255,255,255,${0.12*separate})`}}/>
  </MotionStage>;
};
