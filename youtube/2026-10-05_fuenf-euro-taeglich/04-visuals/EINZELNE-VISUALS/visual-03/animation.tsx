import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

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
    <YouTubeSectionFrame title="Der 30-Tage-Effekt" icon="calendar">
      <AbsoluteFill style={{color:'#F4F0E8', fontFamily:'Arial', padding:'48px 56px', boxSizing:'border-box'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:11, width:'68%', marginTop:18}}>
          {Array.from({length:30}).map((_,i) => <div key={i} style={{height:56, borderRadius:12, background:i<day?'#2FCB8B':'#1B1B1B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:i<day?'#071B12':'#777'}}>{i+1}</div>)}
        </div>
        <div style={{position:'absolute', right:58, top:205, textAlign:'right'}}>
          <div style={{fontSize:28, color:'#A7A7A7'}}>Tag {day}</div>
          <div style={{fontSize:92, fontWeight:800}}>{amount} €</div>
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
