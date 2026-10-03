import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'payment-stream-split';
export const VISUAL_TECHNIQUE_ID = 'open-path-number-split';
export const COMPOSITION_FAMILY_ID = 'precision-flow-graphic';
export const ANIMATION_NARRATIVE = {
  START: '100 € Monatsrate steht als ein Betrag im Zentrum',
  MECHANISM: 'Ein roter Zinsanteil zweigt sichtbar ab, der Tilgungsanteil läuft weiter',
  RESULT: '28,33 € Zinsen und 71,67 € Tilgung sind ohne Karten oder Boxen exakt lesbar',
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [10, 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labels = interpolate(frame, [28, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rest = interpolate(frame, [52, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const leftDash = 360 * (1 - split);
  const rightDash = 520 * (1 - split);

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 108, textAlign: 'center', fontSize: 30, letterSpacing: 2, color: '#AAA9A4'}}>
        ERSTE MONATSRATE
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontSize: 106, fontWeight: 800, letterSpacing: -3}}>
        100 €
      </div>

      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <path d="M960 455 C900 540 760 560 570 640" fill="none" stroke="#D65A42" strokeWidth="18" strokeLinecap="round" strokeDasharray="360" strokeDashoffset={leftDash} />
        <path d="M960 455 C1030 535 1180 555 1420 640" fill="none" stroke="#2A9B70" strokeWidth="18" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={rightDash} />
        <circle cx="960" cy="455" r="15" fill="#F2EEE4" opacity={split} />
      </svg>

      <div style={{position: 'absolute', left: 320, top: 650, width: 520, opacity: labels, transform: `translateY(${22 * (1 - labels)}px)`}}>
        <div style={{fontSize: 78, fontWeight: 800, color: '#D65A42'}}>28,33 €</div>
        <div style={{fontSize: 30, letterSpacing: 2, color: '#D98B78'}}>ZINSEN</div>
      </div>

      <div style={{position: 'absolute', right: 250, top: 650, width: 560, textAlign: 'right', opacity: labels, transform: `translateY(${22 * (1 - labels)}px)`}}>
        <div style={{fontSize: 78, fontWeight: 800, color: '#58BF94'}}>71,67 €</div>
        <div style={{fontSize: 30, letterSpacing: 2, color: '#88CDB0'}}>TILGUNG</div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 112, textAlign: 'center', opacity: rest, transform: `translateY(${18 * (1 - rest)}px)`}}>
        <span style={{fontSize: 28, color: '#A9A8A2'}}>RESTSCHULD DANACH </span>
        <span style={{fontSize: 48, fontWeight: 800}}>1.928,33 €</span>
      </div>
    </AbsoluteFill>
  );
};
