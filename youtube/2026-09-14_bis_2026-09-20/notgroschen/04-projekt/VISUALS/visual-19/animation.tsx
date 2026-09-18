import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'deposit-protection-threshold';
export const VISUAL_TECHNIQUE_ID = 'protected-cap-envelope';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {START:'Bankguthaben beginnt klein', MECHANISM:'Guthaben und Schutzrahmen steigen gemeinsam', RESULT:'Standardgrenze 100.000 € wird klar markiert'};

export const YouTubeVisual19Animation: React.FC = () => {
  const frame=useCurrentFrame(); const p=interpolate(frame,[8,92],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); const value=Math.round(100000*p);
  return <MotionStage>
    <div style={{position:'absolute',left:250,top:212,fontSize:46,fontWeight:900}}>Gesetzliche Einlagensicherung</div>
    <div style={{position:'absolute',left:420,top:280,width:360,height:610,borderRadius:40,border:`5px solid ${COLORS.green}`,overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${p*100}%`,backgroundColor:'rgba(45,216,129,0.30)'}}/><div style={{position:'absolute',left:0,right:0,bottom:`${p*100}%`,height:8,backgroundColor:COLORS.green}}/></div>
    <div style={{position:'absolute',left:900,top:360,fontSize:92,fontWeight:900}}>{value.toLocaleString('de-DE')} €</div>
    <Panel style={{position:'absolute',left:900,top:530,width:700,height:170,padding:'42px',borderColor:COLORS.green,opacity:interpolate(frame,[78,98],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><div style={{fontSize:42,fontWeight:900,color:COLORS.green}}>bis 100.000 €</div><div style={{fontSize:26,color:COLORS.gray,marginTop:12}}>grundsätzlich pro Person und Bank</div></Panel>
    <div style={{position:'absolute',left:900,top:750,fontSize:26,color:COLORS.gray}}>Anbieter und konkrete Sicherung prüfen.</div>
  </MotionStage>;
};
