import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'payment-split-reveal';
export const VISUAL_TECHNIQUE_ID = 'precision-split-card';
export const COMPOSITION_FAMILY_ID = 'precision-number-explainer';
export const ANIMATION_NARRATIVE = {
  START: 'Eine 100-€-Rate steht allein im Fokus',
  MECHANISM: 'Die Rate teilt sich sichtbar in Zins und Tilgung',
  RESULT: '28,33 € Zinsen und 71,67 € Tilgung sind sofort vergleichbar',
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [10, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rest = interpolate(frame, [42, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const interestX = interpolate(split, [0, 1], [0, -245]);
  const principalX = interpolate(split, [0, 1], [0, 245]);

  const card: React.CSSProperties = {
    width: 360,
    height: 190,
    borderRadius: 34,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
    border: '1px solid rgba(255,255,255,0.12)',
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 150, fontSize: 34, letterSpacing: 1.2, color: '#B9B8B2'}}>ERSTE MONATSRATE</div>
      <div style={{position: 'relative', width: 1200, height: 470, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...card, position: 'absolute', background: '#F2EEE4', color: '#111', transform: `scale(${1 - split * 0.18})`, opacity: 1 - split}}>
          <div style={{fontSize: 76, fontWeight: 700}}>100 €</div>
        </div>
        <div style={{...card, position: 'absolute', background: '#A94A37', transform: `translateX(${interestX}px)`, opacity: split}}>
          <div style={{fontSize: 56, fontWeight: 700}}>28,33 €</div>
          <div style={{fontSize: 28, marginTop: 10}}>ZINSEN</div>
        </div>
        <div style={{...card, position: 'absolute', background: '#137B5A', transform: `translateX(${principalX}px)`, opacity: split}}>
          <div style={{fontSize: 56, fontWeight: 700}}>71,67 €</div>
          <div style={{fontSize: 28, marginTop: 10}}>TILGUNG</div>
        </div>
      </div>
      <div style={{fontSize: 42, opacity: rest, transform: `translateY(${20 * (1 - rest)}px)`}}>Restschuld danach: <strong>1.928,33 €</strong></div>
    </AbsoluteFill>
  );
};
