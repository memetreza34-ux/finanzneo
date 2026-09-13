import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {HybridShell, HYBRID_IMAGE_FRAME, HYBRID_LABEL} from './HybridShell';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const WaterDamageHybrid: React.FC = () => {
  const frame = useCurrentFrame();
  const damage = interpolate(frame, [14, 34, 62], [0, 1, 0.22], clamp);
  const cover = interpolate(frame, [54, 84, 118], [0, 1, 0.48], clamp);
  const transfer = interpolate(frame, [56, 106], [0, 1], clamp);
  return (
    <HybridShell title="Versicherung begrenzt den Schaden" icon="shield" tone="positive" caption="Der Schaden bleibt real, aber die Versicherung begrenzt die finanzielle Belastung.">
      <div style={HYBRID_IMAGE_FRAME}>
        <Img src={staticFile('experiments/image-world-consistency-v1/hybrid-test-v1/wasserschaden.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 60, bottom: 105, width: 365, height: 310, borderRadius: '50%', border: `${5 + damage * 7}px solid rgba(255,125,67,${0.18 + damage * 0.60})`, boxShadow: `0 0 ${30 + damage * 75}px rgba(255,100,48,${0.12 + damage * 0.32})`, opacity: 0.35 + damage * 0.65}} />
        <div style={{position: 'absolute', right: 58, top: 78, width: 285, height: 190, borderRadius: 28, border: `${4 + cover * 7}px solid rgba(57,255,167,${0.18 + cover * 0.66})`, boxShadow: `0 0 ${24 + cover * 70}px rgba(57,255,167,${0.10 + cover * 0.30})`}} />
        <svg viewBox="0 0 800 800" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3}}>
          <path d="M310 565 C385 520 425 420 470 340 C525 245 575 205 642 174" fill="none" stroke="rgba(57,255,167,0.88)" strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - transfer} opacity={transfer} />
        </svg>
        <div style={{...HYBRID_LABEL, left: 70, bottom: 66, background: 'rgba(73,19,8,0.84)', color: '#FF9B66', opacity: damage}}>Schaden</div>
        <div style={{...HYBRID_LABEL, right: 68, top: 46, background: 'rgba(4,52,30,0.88)', color: C.accentLt, opacity: cover}}>Deckung</div>
      </div>
    </HybridShell>
  );
};
