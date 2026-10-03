import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'terminal-value-gap-reveal-v1';
export const VISUAL_TECHNIQUE_ID = 'react-counter-bars-v1';
export const COMPOSITION_FAMILY_ID = 'comparison';

export const ANIMATION_NARRATIVE = {
  START: 'Zwei gleich breite Vermögenssäulen stehen bei null.',
  MECHANISM: 'Beide Säulen wachsen mit unterschiedlichen Endwerten, während die Zahlen synchron hochzählen.',
  RESULT: 'Eine Klammer zwischen den Endständen enthüllt den Unterschied von rund 74.000 Euro.',
};

const formatEuro = (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`;

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const growth = interpolate(frame, [0, 105], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const reveal = interpolate(frame, [92, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lowValue = 410135 * growth;
  const highValue = 336289 * growth;
  const maxHeight = 520;

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 170, height: 700, position: 'relative'}}>
        <div style={{width: 360, textAlign: 'center'}}>
          <div style={{color: '#F4F1E8', fontSize: 40, fontWeight: 800, marginBottom: 18}}>{formatEuro(lowValue)}</div>
          <div style={{color: '#A7AAA8', fontSize: 28, marginBottom: 18}}>0,2 % Kosten</div>
          <div style={{height: maxHeight * growth, backgroundColor: '#1ED79B', borderRadius: '30px 30px 10px 10px', boxShadow: '0 20px 60px rgba(30,215,155,0.22)'}} />
        </div>
        <div style={{width: 360, textAlign: 'center'}}>
          <div style={{color: '#F4F1E8', fontSize: 40, fontWeight: 800, marginBottom: 18}}>{formatEuro(highValue)}</div>
          <div style={{color: '#A7AAA8', fontSize: 28, marginBottom: 18}}>1,2 % Kosten</div>
          <div style={{height: maxHeight * growth * (336289 / 410135), backgroundColor: '#FF6B45', borderRadius: '30px 30px 10px 10px', boxShadow: '0 20px 60px rgba(255,107,69,0.20)'}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 120,
            width: 150,
            color: '#F4F1E8',
            fontSize: 36,
            fontWeight: 800,
            opacity: reveal,
            textAlign: 'center',
          }}
        >
          ≈ 74.000 €<br />Differenz
        </div>
      </div>
    </AbsoluteFill>
  );
};
