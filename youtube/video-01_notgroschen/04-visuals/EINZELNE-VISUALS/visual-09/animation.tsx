import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'essential-budget-assembly';
export const VISUAL_TECHNIQUE_ID = 'category-to-total-ledger';
export const COMPOSITION_FAMILY_ID = 'document-motion';
export const ANIMATION_NARRATIVE = {START:'Leeres notwendiges Monatsbudget', MECHANISM:'Kostenkategorien setzen sich zusammen', RESULT:'Beispiel-Gesamtwert 1.500 €'};

export const YouTubeVisual09Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const categories=['Miete','Lebensmittel','Strom','Versicherungen','Mobilität'];
  const visible=categories.map((_,i)=>interpolate(frame,[i*20,i*20+14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
  const total=interpolate(frame,[92,120],[0,1500],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <MotionStage>
    <div style={{position:'absolute',left:160,top:120,fontSize:42,fontWeight:800}}>Notwendige Monatsausgaben</div>
    <div style={{position:'absolute',left:160,top:250,width:900,display:'grid',gridTemplateColumns:'1fr 1fr',gap:26}}>{categories.map((name,i)=><Panel key={name} style={{height:120,padding:'36px',opacity:visible[i],transform:`translateX(${(1-visible[i])*(i%2===0?-80:80)}px)`,fontSize:34,fontWeight:800}}>{name}</Panel>)}</div>
    <Panel style={{position:'absolute',right:150,top:320,width:560,height:360,padding:55,borderColor:COLORS.green}}><div style={{fontSize:34,color:COLORS.gray}}>Beispiel gesamt</div><div style={{fontSize:100,fontWeight:900,color:COLORS.green,marginTop:70}}>{Math.round(total).toLocaleString('de-DE')} €</div></Panel>
  </MotionStage>;
};
