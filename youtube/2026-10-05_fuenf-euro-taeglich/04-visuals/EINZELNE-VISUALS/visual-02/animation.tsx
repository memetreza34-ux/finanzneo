import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'daily-five-week-accumulation';
export const VISUAL_TECHNIQUE_ID = 'seven-day-receipt-rail';
export const COMPOSITION_FAMILY_ID = 'timeline';
export const ANIMATION_NARRATIVE = {
  START: 'Ein einzelner Tag zeigt nur 5 €.',
  MECHANISM: 'Sieben Tage erscheinen nacheinander und addieren jeweils 5 €.',
  RESULT: 'Nach einer Woche stehen 35 € sichtbar als Summe.',
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  const visible = Math.min(7, Math.floor(interpolate(frame, [8, 88], [0, 7], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})));
  const total = visible * 5;
  return (
    <YouTubeSectionFrame title="Was 5 € in einer Woche machen" icon="calendar">
      <AbsoluteFill style={{color:'#F4F0E8', fontFamily:'Arial', padding:'54px 64px', boxSizing:'border-box'}}>
        <div style={{fontSize:30, color:'#A7A7A7', marginBottom:30}}>5 € pro Tag</div>
        <div style={{display:'flex', gap:14}}>
          {days.map((day, i) => {
            const p = interpolate(frame, [10+i*11, 18+i*11], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            return <div key={day} style={{flex:1, height:190, border:'2px solid #333', borderRadius:20, padding:20, opacity:p, transform:`translateY(${(1-p)*14}px)`, boxSizing:'border-box'}}>
              <div style={{fontSize:24, color:'#A7A7A7'}}>{day}</div>
              <div style={{fontSize:46, marginTop:58, color:'#F4F0E8'}}>5 €</div>
            </div>;
          })}
        </div>
        <div style={{marginTop:42, fontSize:66, fontWeight:700, color:'#2FCB8B'}}>Woche: {total} €</div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
