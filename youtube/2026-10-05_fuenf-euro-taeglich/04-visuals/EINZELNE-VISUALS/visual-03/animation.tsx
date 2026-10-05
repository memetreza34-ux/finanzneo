import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'five-euro-thirty-day-month';
export const VISUAL_TECHNIQUE_ID = 'calendar-fill-counter';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {
  START: 'Der Monat startet bei 0 €.',
  MECHANISM: '30 Tagesfelder füllen sich, während der Betrag um jeweils 5 € steigt.',
  RESULT: 'Ein 30-Tage-Monat endet bei 150 €.',
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const day = Math.round(interpolate(frame, [8, 94], [0,30], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}));
  const amount = day * 5;
  return (
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', padding:'110px 150px'}}>
      <div style={{fontSize:42, color:'#A7A7A7'}}>30-Tage-Beispiel</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:14, width:1160, marginTop:52}}>
        {Array.from({length:30}).map((_,i) => <div key={i} style={{height:72, borderRadius:14, background:i<day?'#2FCB8B':'#1B1B1B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:i<day?'#071B12':'#777'}}>{i+1}</div>)}
      </div>
      <div style={{position:'absolute', right:150, top:350, textAlign:'right'}}>
        <div style={{fontSize:34, color:'#A7A7A7'}}>Tag {day}</div>
        <div style={{fontSize:104, fontWeight:800}}>{amount} €</div>
      </div>
    </AbsoluteFill>
  );
};
