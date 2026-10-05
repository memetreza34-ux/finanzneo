import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'seven-day-small-spend-audit';
export const VISUAL_TECHNIQUE_ID = 'variable-expense-ledger-reveal';
export const COMPOSITION_FAMILY_ID = 'document-motion';
export const ANIMATION_NARRATIVE = {
  START: 'Eine leere 7-Tage-Liste wartet auf Einträge.',
  MECHANISM: 'Sieben unterschiedliche kleine Ausgaben erscheinen nacheinander.',
  RESULT: 'Die Woche wird zu einer klaren Summe von 35 €.',
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [['Mo','5 €'],['Di','4 €'],['Mi','6 €'],['Do','3 €'],['Fr','7 €'],['Sa','5 €'],['So','5 €']];
  return (
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', padding:'110px 330px'}}>
      <div style={{fontSize:54, fontWeight:700, marginBottom:36}}>7 Tage nur sammeln</div>
      {rows.map(([d,v],i)=>{
        const p=interpolate(frame,[10+i*10,18+i*10],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        return <div key={d} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #333', padding:'17px 10px', fontSize:36, opacity:p, transform:`translateX(${(1-p)*24}px)`}}><span>{d}</span><span>{v}</span></div>;
      })}
      <div style={{display:'flex', justifyContent:'space-between', marginTop:32, fontSize:56, fontWeight:800, color:'#2FCB8B', opacity:interpolate(frame,[82,96],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><span>Summe</span><span>35 €</span></div>
    </AbsoluteFill>
  );
};
