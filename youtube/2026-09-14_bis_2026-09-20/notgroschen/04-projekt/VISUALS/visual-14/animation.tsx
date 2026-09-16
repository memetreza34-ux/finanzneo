import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'personal-risk-questionnaire';
export const VISUAL_TECHNIQUE_ID = 'question-to-profile-map';
export const COMPOSITION_FAMILY_ID = 'document-motion';
export const ANIMATION_NARRATIVE = {START:'Leerer Prüfrahmen', MECHANISM:'Vier Fragen werden beantwortbar gemacht', RESULT:'Individuelles Risikoprofil entsteht'};

export const YouTubeVisual14Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const qs=['Welche Notfälle können mich treffen?','Wie hoch sind notwendige Kosten?','Was brauche ich zwingend?','Wie schnell kann ich Ausgaben senken?'];
  const summary=interpolate(frame,[102,130],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    <div style={{position:'absolute',left:170,top:110,fontSize:46,fontWeight:900}}>Vier Fragen statt einer magischen Zahl</div>
    <div style={{position:'absolute',left:170,top:220,width:1120}}>{qs.map((q,i)=>{const p=interpolate(frame,[i*22,i*22+16],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={q} style={{display:'flex',alignItems:'center',gap:24,height:135,opacity:p,transform:`translateX(${(1-p)*70}px)`,borderBottom:`2px solid ${COLORS.line}`,fontSize:34}}><div style={{width:48,height:48,borderRadius:14,border:`3px solid ${COLORS.green}`,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.green,fontWeight:900}}>✓</div>{q}</div>;})}</div>
    <Panel style={{position:'absolute',right:130,top:310,width:480,height:310,padding:45,borderColor:COLORS.green,opacity:summary,transform:`scale(${0.86+summary*0.14})`}}><div style={{fontSize:30,color:COLORS.gray}}>Ergebnis</div><div style={{fontSize:52,fontWeight:900,marginTop:55}}>Dein Risikoprofil</div><div style={{height:22,borderRadius:12,backgroundColor:COLORS.green,marginTop:45,width:`${summary*100}%`}}/></Panel>
  </MotionStage>;
};
