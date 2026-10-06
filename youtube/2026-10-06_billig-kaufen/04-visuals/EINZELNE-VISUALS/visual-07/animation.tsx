import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

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
    <YouTubeSectionFrame title="Der 7-Tage-Test" icon="list">
      <AbsoluteFill style={{color:'#F4F0E8', fontFamily:'Arial', padding:'42px 180px', boxSizing:'border-box'}}>
        {rows.map(([d,v],i)=>{
          const p=interpolate(frame,[10+i*10,18+i*10],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
          return <div key={d} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #333', padding:'13px 8px', fontSize:29, opacity:p, transform:`translateX(${(1-p)*20}px)`}}><span>{d}</span><span>{v}</span></div>;
        })}
        <div style={{display:'flex', justifyContent:'space-between', marginTop:24, fontSize:46, fontWeight:800, color:'#2FCB8B', opacity:interpolate(frame,[82,96],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><span>Summe</span><span>35 €</span></div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
