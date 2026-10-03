import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'three-checks-sequential';
export const VISUAL_TECHNIQUE_ID = 'checklist-step-reveal';
export const COMPOSITION_FAMILY_ID = 'action-checklist';
export const ANIMATION_NARRATIVE = {
  START: 'Eine neutrale Kreditkarte steht im Fokus',
  MECHANISM: 'Drei konkrete Prüfungen erscheinen nacheinander',
  RESULT: 'Vollzahlung, Zinssatz und Teilzahlung sind als klare Handlungspunkte sichtbar',
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    'Vollzahlung 100 %',
    'Zinssatz prüfen',
    'Teilzahlung deaktivieren',
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif', padding: '120px 150px'}}>
      <div style={{fontSize: 34, color: '#B9B8B2', letterSpacing: 1.2}}>3 CHECKS VOR DER NUTZUNG</div>
      <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 110}}>
        <div style={{width: 560, height: 350, borderRadius: 42, background: 'linear-gradient(145deg, #19362E, #0C1714)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 75px rgba(0,0,0,0.48)', padding: 42, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{fontSize: 26, color: '#D7D1C6'}}>KREDITKARTE</div>
          <div style={{width: 92, height: 62, borderRadius: 14, background: '#C8B57A', opacity: 0.75}} />
          <div style={{fontSize: 44, letterSpacing: 8}}>•••• •••• ••••</div>
        </div>
        <div style={{width: 760, display: 'flex', flexDirection: 'column', gap: 28}}>
          {items.map((label, index) => {
            const reveal = interpolate(frame, [12 + index * 18, 28 + index * 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={label} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: reveal, transform: `translateX(${36 * (1 - reveal)}px)`}}>
                <div style={{width: 64, height: 64, borderRadius: 32, background: '#137B5A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 700}}>✓</div>
                <div style={{fontSize: 46, fontWeight: 600}}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
