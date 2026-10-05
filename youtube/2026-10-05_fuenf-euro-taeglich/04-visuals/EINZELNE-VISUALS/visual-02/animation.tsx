import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

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
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', padding:'130px 150px'}}>
      <div style={{fontSize:44, color:'#A7A7A7', marginBottom:46}}>5 € pro Tag</div>
      <div style={{display:'flex', gap:18}}>
        {days.map((day, i) => {
          const p = interpolate(frame, [10+i*11, 18+i*11], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
          return <div key={day} style={{width:205, height:250, border:'2px solid #333', borderRadius:24, padding:24, opacity:p, transform:`translateY(${(1-p)*18}px)`}}>
            <div style={{fontSize:30, color:'#A7A7A7'}}>{day}</div>
            <div style={{fontSize:58, marginTop:82, color:'#F4F0E8'}}>5 €</div>
          </div>;
        })}
      </div>
      <div style={{marginTop:64, fontSize:78, fontWeight:700, color:'#2FCB8B'}}>Woche: {total} €</div>
    </AbsoluteFill>
  );
};
