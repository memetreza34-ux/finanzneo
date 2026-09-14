import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'emergency-deplete-rebuild';
export const VISUAL_TECHNIQUE_ID = 'reserve-breathing-cycle';
export const COMPOSITION_FAMILY_ID = 'material-transformation';
export const ANIMATION_NARRATIVE = {START:'Reserve ist gefüllt', MECHANISM:'Echte Reparatur senkt den Puffer, regelmäßige Einzahlungen starten erneut', RESULT:'Notgroschen wird planmäßig wieder aufgebaut'};

export const YouTubeVisual26Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const depletion=interpolate(frame,[18,58],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const rebuild=interpolate(frame,[66,126],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const level=100-55*depletion+45*rebuild;
  return <MotionStage>
    <Panel style={{position:'absolute',left:300,top:180,width:600,height:720,padding:55,borderColor:COLORS.green}}><div style={{fontSize:42,fontWeight:900}}>Notgroschen</div><div style={{position:'absolute',left:80,right:80,bottom:70,height:510,borderRadius:34,border:`4px solid ${COLORS.line}`,overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${level}%`,backgroundColor:COLORS.green}}/></div></Panel>
    <Panel style={{position:'absolute',right:260,top:300,width:560,height:220,padding:45,borderColor:COLORS.red,opacity:interpolate(frame,[12,34],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><div style={{fontSize:42,fontWeight:900}}>Reparatur bezahlt</div><div style={{fontSize:28,color:COLORS.gray,marginTop:22}}>dafür ist die Reserve da</div></Panel>
    <div style={{position:'absolute',right:290,top:620,fontSize:40,fontWeight:900,color:COLORS.green,opacity:rebuild}}>↻ wieder auffüllen</div>
  </MotionStage>;
};
