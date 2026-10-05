import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'amortization-timeline';
export const VISUAL_TECHNIQUE_ID = 'dual-metric-front-chart';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {
  START: 'Restschuld startet bei 2.000 €',
  MECHANISM: '24 Monatszahlungen senken den Saldo, während kumulierte Zinsen steigen',
  RESULT: '0 € Restschuld und 368,38 € Gesamtzins',
};

const debt = [2000,1928.33,1855.65,1781.87,1707.12,1631.31,1554.42,1476.44,1397.36,1317.16,1235.82,1153.33,1069.72,985.01,899.02,811.76,723.26,633.51,542.49,450.17,356.55,261.60,165.31,67.65,0];

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const visible = Math.max(2, Math.floor(progress * (debt.length - 1)) + 1);
  const points = debt.slice(0, visible).map((value, index) => {
    const x = 120 + (index / 24) * 1400;
    const y = 800 - (value / 2000) * 600;
    return `${x},${y}`;
  }).join(' ');
  const month = Math.min(24, Math.round(progress * 24));
  const interest = 368.38 * progress;
  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', padding: 100}}>
      <div style={{fontSize: 46, marginBottom: 24}}>Restschuld bei 100 € Monatsrate</div>
      <svg width="1700" height="800" viewBox="0 0 1700 800">
        <line x1="120" y1="800" x2="1600" y2="800" stroke="#777" strokeWidth="3" />
        <line x1="120" y1="160" x2="120" y2="800" stroke="#777" strokeWidth="3" />
        <polyline points={points} fill="none" stroke="#F4F0E8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <text x="120" y="120" fill="#F4F0E8" fontSize="32">2.000 €</text>
        <text x="820" y="750" fill="#A8A8A8" fontSize="30">Monat {month}</text>
      </svg>
      <div style={{position: 'absolute', right: 110, top: 110, fontSize: 36, color: '#E65B42'}}>Zinsen: {interest.toFixed(2).replace('.', ',')} €</div>
    </AbsoluteFill>
  );
};
