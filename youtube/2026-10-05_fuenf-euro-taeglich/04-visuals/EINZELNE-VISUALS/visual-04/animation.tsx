import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'daily-five-year-total';
export const VISUAL_TECHNIQUE_ID = 'year-progress-total-reveal';
export const COMPOSITION_FAMILY_ID = 'precision-progress';
export const ANIMATION_NARRATIVE = {
  START: 'Das Jahr beginnt mit 5 € am ersten Tag.',
  MECHANISM: 'Ein Jahresfortschritt läuft von Tag 1 bis Tag 365 und summiert 5 € pro Tag.',
  RESULT: 'Am Ende stehen exakt 1.825 €.',
};

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [6, 96], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const day = Math.max(1, Math.round(365 * progress));
  const total = day * 5;
  return (
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', alignItems:'center', justifyContent:'center'}}>
      <div style={{width:1400}}>
        <div style={{fontSize:42, color:'#A7A7A7'}}>5 € × 365 Tage</div>
        <div style={{fontSize:150, fontWeight:800, marginTop:30}}>{total.toLocaleString('de-DE')} €</div>
        <div style={{height:36, borderRadius:18, background:'#1C1C1C', marginTop:60, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${progress*100}%`, background:'#E7C56A'}} />
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:20, fontSize:30, color:'#A7A7A7'}}>
          <span>Tag 1</span><span>Tag {day}</span><span>Tag 365</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
