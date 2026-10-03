import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'paid-versus-open-reveal';
export const VISUAL_TECHNIQUE_ID = 'scene-anchored-number-contrast';
export const COMPOSITION_FAMILY_ID = 'hybrid-document-overlay';
export const ANIMATION_NARRATIVE = {
  START: 'Die gerenderte Papier-/Abrechnungsszene steht ohne Zahlenoverlay',
  MECHANISM: '1.200 € gezahlt erscheint zuerst, danach 1.069,72 € offen als Gegenwert',
  RESULT: 'Der Widerspruch viel gezahlt und trotzdem hohe Restschuld ist präzise sichtbar',
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const paid = interpolate(frame, [10, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const open = interpolate(frame, [34, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const divider = interpolate(frame, [26, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', fontFamily: 'Arial, sans-serif', color: '#F2EEE4'}}>
      <div style={{position: 'absolute', left: 125, bottom: 118, opacity: paid, transform: `translateY(${24 * (1 - paid)}px)`}}>
        <div style={{fontSize: 28, letterSpacing: 2, color: '#A9A8A2'}}>NACH 12 MONATEN</div>
        <div style={{fontSize: 72, fontWeight: 800, marginTop: 8}}>1.200 € <span style={{fontSize: 32, color: '#7FCDAA'}}>GEZAHLT</span></div>
      </div>

      <div style={{position: 'absolute', left: 935, bottom: 112, width: 3, height: 120 * divider, backgroundColor: '#4B5A54', transformOrigin: 'bottom'}} />

      <div style={{position: 'absolute', right: 125, bottom: 118, textAlign: 'right', opacity: open, transform: `translateY(${24 * (1 - open)}px)`}}>
        <div style={{fontSize: 28, letterSpacing: 2, color: '#D19384'}}>NOCH OFFEN</div>
        <div style={{fontSize: 76, fontWeight: 800, color: '#D65A42', marginTop: 8}}>1.069,72 €</div>
      </div>
    </AbsoluteFill>
  );
};
