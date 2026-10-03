import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'payment-setting-switch';
export const VISUAL_TECHNIQUE_ID = 'image-overlay-selection-shift';
export const COMPOSITION_FAMILY_ID = 'image-composite';
export const ANIMATION_NARRATIVE = {
  START: 'Teilzahlung ist markiert',
  MECHANISM: 'Auswahlfokus bewegt sich zu Vollzahlung 100 %',
  RESULT: 'Vollzahlung ist sichtbar bestätigt',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [18, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const confirm = interpolate(frame, [58, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = 410 + move * 190;

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', fontFamily: 'Arial, sans-serif'}}>
      <div
        style={{
          position: 'absolute',
          left: 500,
          top: y,
          width: 920,
          height: 120,
          border: `6px solid ${move < 0.5 ? '#E65B42' : '#2FCB8B'}`,
          borderRadius: 28,
          boxShadow: `0 0 28px ${move < 0.5 ? '#E65B4233' : '#2FCB8B33'}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 620,
          top: 760,
          fontSize: 44,
          color: '#2FCB8B',
          opacity: confirm,
        }}
      >
        Vollzahlung 100 % ausgewählt
      </div>
    </AbsoluteFill>
  );
};
