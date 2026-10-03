import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'three-checks-sequential';
export const VISUAL_TECHNIQUE_ID = 'open-checkline-reveal';
export const COMPOSITION_FAMILY_ID = 'action-checklist-motion';
export const ANIMATION_NARRATIVE = {
  START: 'Eine große neutrale Kreditkarte steht als einziges Objekt im Bild',
  MECHANISM: 'Drei Prüfzeilen erscheinen nacheinander ohne Cards oder Panels',
  RESULT: 'Vollzahlung, Zinssatz und Teilzahlung sind als drei klare Handlungen sichtbar',
};

const checks = ['Vollzahlung 100 %', 'Zinssatz prüfen', 'Teilzahlung deaktivieren'];

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif'}}>
      <div
        style={{
          position: 'absolute',
          left: 170,
          top: 300,
          width: 600,
          height: 370,
          borderRadius: 46,
          background: 'linear-gradient(145deg, #243A33, #111A17)',
          boxShadow: '0 34px 90px rgba(0,0,0,0.52)',
          border: '1px solid rgba(255,255,255,0.12)',
          transform: `perspective(1100px) rotateY(-12deg) translateX(${40 * (1 - cardIn)}px)`,
          opacity: cardIn,
        }}
      >
        <div style={{position: 'absolute', left: 48, top: 52, width: 78, height: 58, borderRadius: 12, backgroundColor: '#8A8F88'}} />
        <div style={{position: 'absolute', left: 48, bottom: 52, width: 250, height: 12, borderRadius: 8, backgroundColor: '#67766F'}} />
      </div>

      <div style={{position: 'absolute', left: 900, top: 270, width: 800}}>
        {checks.map((label, index) => {
          const start = 18 + index * 20;
          const p = interpolate(frame, [start, start + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={label} style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 74, opacity: p, transform: `translateX(${46 * (1 - p)}px)`}}>
              <div style={{fontSize: 44, fontWeight: 800, color: '#52C997'}}>✓</div>
              <div style={{fontSize: 52, fontWeight: 700}}>{label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
