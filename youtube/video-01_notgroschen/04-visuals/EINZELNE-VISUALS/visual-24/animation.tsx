import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'recurring-month-cycle';
export const VISUAL_TECHNIQUE_ID = 'calendar-reserve-cycle';
export const COMPOSITION_FAMILY_ID = 'timeline';
export const ANIMATION_NARRATIVE = {START:'Erster Monat', MECHANISM:'Jeder Monatswechsel löst denselben Transfer aus', RESULT:'Reserve wächst durch Routine'};

export const YouTubeVisual24Animation: React.FC = () => {
  const frame=useCurrentFrame(); const phase=Math.min(4,Math.floor(frame/28)+1); const local=(frame%28)/28;
  return <MotionStage>
    <div style={{position:'absolute',left:170,top:120,fontSize:46,fontWeight:900}}>Einmal einstellen. Monat für Monat wiederholen.</div>
    <Panel style={{position:'absolute',left:220,top:300,width:520,height:360,padding:50,borderColor:COLORS.white}}><div style={{fontSize:34,color:COLORS.gray}}>Kalender</div><div style={{fontSize:120,fontWeight:900,marginTop:55}}>Monat {phase}</div><div style={{height:8,backgroundColor:COLORS.green,width:`${local*100}%`,marginTop:45}}/></Panel>
    <div style={{position:'absolute',left:860,top:470,width:240,height:28,borderRadius:14,backgroundColor:COLORS.line}}><div style={{width:`${local*100}%`,height:'100%',borderRadius:14,backgroundColor:COLORS.gold}}/></div>
    <Panel style={{position:'absolute',right:200,top:260,width:560,height:470,padding:50,borderColor:COLORS.green}}><div style={{fontSize:40,fontWeight:900}}>Notgroschen</div><div style={{position:'absolute',left:55,right:55,bottom:55,height:300,borderRadius:26,border:`3px solid ${COLORS.line}`,overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${Math.min(100,(phase-1+local)*25)}%`,backgroundColor:COLORS.green}}/></div></Panel>
  </MotionStage>;
};
