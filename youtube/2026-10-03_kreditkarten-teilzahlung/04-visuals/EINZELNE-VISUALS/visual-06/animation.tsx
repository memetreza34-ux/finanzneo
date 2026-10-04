import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'repayment-path-fork';
export const VISUAL_TECHNIQUE_ID = 'split-timeline-comparison';
export const COMPOSITION_FAMILY_ID = 'scenario-comparison';
export const ANIMATION_NARRATIVE = {
  START: 'Beide Pfade starten mit 2.000 €',
  MECHANISM: 'Vollzahlung endet beim nächsten Termin, Teilzahlung läuft über 24 Monate',
  RESULT: 'Laufzeitunterschied wird direkt sichtbar',
};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const short = interpolate(frame, [0, 35], [0, 330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const long = interpolate(frame, [0, 90], [0, 1320], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const markers = Math.floor(interpolate(frame, [25, 90], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', padding: 120, justifyContent: 'center'}}>
      <div style={{fontSize: 42, marginBottom: 50}}>Gleicher Startsaldo: 2.000 €</div>
      <div style={{fontSize: 34, marginBottom: 16}}>Vollzahlung 100 %</div>
      <div style={{height: 26, width: short, background: '#2FCB8B', borderRadius: 13}} />
      <div style={{fontSize: 34, marginTop: 70, marginBottom: 16}}>Teilzahlung im Beispiel</div>
      <div style={{height: 26, width: long, background: '#E65B42', borderRadius: 13, position: 'relative'}}>
        {Array.from({length: markers}).map((_, i) => <span key={i} style={{position: 'absolute', left: 110 + i * 140, top: -18, width: 8, height: 62, background: '#F4F0E8'}} />)}
      </div>
      <div style={{marginTop: 26, fontSize: 34, opacity: long / 1320}}>24 Monate</div>
    </AbsoluteFill>
  );
};
