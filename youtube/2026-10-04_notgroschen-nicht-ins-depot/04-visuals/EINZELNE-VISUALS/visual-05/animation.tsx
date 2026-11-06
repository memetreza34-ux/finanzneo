import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'reserve-rule-range';
export const VISUAL_TECHNIQUE_ID = 'two-to-three-month-band';
export const COMPOSITION_FAMILY_ID = 'precision-range-graphic';
export const ANIMATION_NARRATIVE = {
  START: 'Ein Monatsgehalt als Bezugsgröße',
  MECHANISM: 'Die Faustregel spannt sich auf zwei bis drei Monatsgehälter auf',
  RESULT: 'Die Zielhöhe bleibt eine individuelle Reserve und keine starre Pflichtzahl',
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const two = interpolate(frame, [10, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const three = interpolate(frame, [34, 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const note = interpolate(frame, [62, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 1180}}>
        <div style={{fontSize: 42, color: '#B9B5AE'}}>FAUSTREGEL VERBRAUCHERZENTRALE</div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, marginTop: 54, height: 360}}>
          <div style={{width: 250, height: 130, borderRadius: 28, background: '#2A2A2A', display: 'grid', placeItems: 'center', fontSize: 44}}>1 Monat</div>
          <div style={{width: 280, height: 130 + 150 * two, borderRadius: 28, background: '#173B31', border: '3px solid #2FCB8B', display: 'grid', placeItems: 'center', fontSize: 50, opacity: 0.35 + 0.65 * two}}>2 Monate</div>
          <div style={{width: 280, height: 130 + 220 * three, borderRadius: 28, background: '#173B31', border: '3px solid #2FCB8B', display: 'grid', placeItems: 'center', fontSize: 50, opacity: 0.35 + 0.65 * three}}>3 Monate</div>
        </div>
        <div style={{fontSize: 44, marginTop: 52, opacity: note}}>Wie viel du wirklich brauchst, hängt von deiner Situation ab.</div>
      </div>
    </AbsoluteFill>
  );
};
