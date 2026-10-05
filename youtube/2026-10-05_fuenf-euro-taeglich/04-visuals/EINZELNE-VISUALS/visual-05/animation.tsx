import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'today-versus-repetition';
export const VISUAL_TECHNIQUE_ID = 'single-number-to-dot-field';
export const COMPOSITION_FAMILY_ID = 'macro-to-micro';
export const ANIMATION_NARRATIVE = {
  START: 'Groß im Zentrum steht nur der heutige Betrag: 5 €.',
  MECHANISM: 'Die Zahl wird kleiner und ein Feld aus vielen einzelnen Tagen wird sichtbar.',
  RESULT: 'Der Zuschauer erkennt, dass die Summe aus vielen kleinen Wiederholungen entsteht.',
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [22, 82], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const scale = 1 - 0.58 * reveal;
  return (
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', alignItems:'center', justifyContent:'center'}}>
      <div style={{fontSize:180, fontWeight:800, transform:`scale(${scale}) translateY(${-260*reveal}px)`}}>5 €</div>
      <div style={{position:'absolute', top:390, width:1320, display:'grid', gridTemplateColumns:'repeat(25, 1fr)', gap:9, opacity:reveal}}>
        {Array.from({length:125}).map((_,i)=><div key={i} style={{height:16, borderRadius:8, background:i%7===0?'#E7C56A':'#444'}} />)}
      </div>
      <div style={{position:'absolute', bottom:120, fontSize:48, opacity:reveal, color:'#A7A7A7'}}>Du siehst heute 5 € – nicht alle Wiederholungen gleichzeitig.</div>
    </AbsoluteFill>
  );
};
