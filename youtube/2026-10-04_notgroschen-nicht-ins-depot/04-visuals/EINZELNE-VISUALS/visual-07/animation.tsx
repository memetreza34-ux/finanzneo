import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'separate-money-jobs';
export const VISUAL_TECHNIQUE_ID = 'savings-stream-fork';
export const COMPOSITION_FAMILY_ID = 'financial-process-flow';
export const ANIMATION_NARRATIVE = {
  START: 'Ein gemeinsamer monatlicher Sparbetrag',
  MECHANISM: 'Der Geldstrom teilt sich nach Zweck in liquide Reserve und langfristiges Investieren',
  RESULT: 'Notgroschen bleibt stabil erreichbar; langfristiges Geld darf ins Depot',
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const stream = interpolate(frame, [6, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const split = interpolate(frame, [26, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const settle = interpolate(frame, [50, 78], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="1300" height="700" viewBox="0 0 1300 700">
        <text x="650" y="100" fill="#F4F0E8" fontSize="58" textAnchor="middle" fontWeight="800">SPARGELD</text>
        <path d="M650 135 L650 300" stroke="#F4F0E8" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-stream} />
        <path d="M650 300 C580 360 470 390 360 480" stroke="#2FCB8B" strokeWidth="18" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split} />
        <path d="M650 300 C720 360 830 390 940 480" stroke="#D9B86C" strokeWidth="18" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split} />
        <rect x="170" y="480" width="380" height="150" rx="28" fill="#173B31" stroke="#2FCB8B" strokeWidth="3" opacity={0.25 + 0.75*settle} />
        <rect x="750" y="480" width="380" height="150" rx="28" fill="#2B281E" stroke="#D9B86C" strokeWidth="3" opacity={0.25 + 0.75*settle} />
        <text x="360" y="545" fill="#F4F0E8" fontSize="42" textAnchor="middle">NOTGROSCHEN</text>
        <text x="360" y="595" fill="#2FCB8B" fontSize="30" textAnchor="middle">liquide Reserve</text>
        <text x="940" y="545" fill="#F4F0E8" fontSize="42" textAnchor="middle">LANGFRISTIG</text>
        <text x="940" y="595" fill="#D9B86C" fontSize="30" textAnchor="middle">Depot</text>
      </svg>
    </AbsoluteFill>
  );
};
