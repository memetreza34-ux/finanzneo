import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'market-drop-shortfall-example';
export const VISUAL_TECHNIQUE_ID = 'number-drop-gap-reveal';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {
  START: '3.000 € Beispiel-Notgroschen im Depot',
  MECHANISM: 'Ein beispielhafter Kursrückgang von 20 % reduziert den verfügbaren Wert',
  RESULT: '2.400 € bleiben; 600 € fehlen gegenüber dem ursprünglichen Notgroschen',
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [18, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gap = interpolate(frame, [56, 78], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const value = Math.round(3000 - 600 * drop);
  const barWidth = 860 - 172 * drop;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1160}}>
        <div style={{fontSize: 34, color: '#B9B5AE'}}>RECHENBEISPIEL · KEINE PROGNOSE</div>
        <div style={{fontSize: 104, fontWeight: 900, marginTop: 24}}>{value.toLocaleString('de-DE')} €</div>
        <div style={{marginTop: 36, height: 130, width: 860, borderRadius: 28, background: '#222', overflow: 'hidden', position: 'relative'}}>
          <div style={{height: '100%', width: barWidth, background: '#2FCB8B'}} />
          <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 172 * drop, background: '#E65B42'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', width: 860, marginTop: 20, fontSize: 34}}>
          <span>Start 3.000 €</span>
          <span style={{color: '#E65B42', opacity: drop}}>−20 %</span>
        </div>
        <div style={{fontSize: 58, color: '#E65B42', marginTop: 48, opacity: gap, transform: `translateY(${18 * (1-gap)}px)`}}>600 € weniger Reserve</div>
      </div>
    </AbsoluteFill>
  );
};
