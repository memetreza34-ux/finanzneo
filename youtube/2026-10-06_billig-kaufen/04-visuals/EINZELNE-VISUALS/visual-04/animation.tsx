import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';
export const MECHANIC_ID='three-buying-questions';
export const VISUAL_TECHNIQUE_ID='question-cards-reveal';
export const COMPOSITION_FAMILY_ID='decision-framework';
export const ANIMATION_NARRATIVE={"START":"nur Preis","MECHANISM":"drei Fragen","RESULT":"Nutzung, Ersatz, Reparatur"};

export const YouTubeVisual04Animation:React.FC=()=>{const f=useCurrentFrame();const q=['Wie oft nutze ich es?','Muss ich es ersetzen?','Kann ich es reparieren?'];return <YouTubeSectionFrame title="Drei bessere Fragen" icon="list"><AbsoluteFill style={{padding:'62px 86px',boxSizing:'border-box',fontFamily:'Arial',color:'#F4F0E8',justifyContent:'center'}}>{q.map((t,i)=>{const p=interpolate(f,[12+i*24,24+i*24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={t} style={{fontSize:45,fontWeight:700,padding:'24px 30px',marginBottom:18,border:'2px solid #333',borderRadius:22,opacity:p,transform:`translateX(${(1-p)*34}px)`}}><span style={{color:'#2FCB8B',marginRight:22}}>{i+1}</span>{t}</div>})}</AbsoluteFill></YouTubeSectionFrame>};
