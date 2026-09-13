import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {HybridShell, HYBRID_IMAGE_FRAME, HYBRID_LABEL} from './HybridShell';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const NotgroschenHybrid: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [22, 92], [0, 1], clamp);
  const amount = spring({frame: Math.max(0, frame - 54), fps: 30, config: {damping: 15, stiffness: 125}});
  const camera = interpolate(frame, [0, 149], [1, 1.035], clamp);
  return (
    <HybridShell title="Notgroschen fängt Reparaturen ab" icon="wallet" tone="positive" caption="Die Rechnung kommt sofort, die Reserve übernimmt die Kosten.">
      <div style={HYBRID_IMAGE_FRAME}>
        <Img src={staticFile('experiments/image-world-consistency-v1/hybrid-test-v1/notgroschen-waschmaschine.webp')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camera})`}} />
        <svg viewBox="0 0 800 800" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3}}>
          <path d="M610 555 C555 500 470 505 390 530 C315 552 258 585 190 590" fill="none" stroke="rgba(57,255,167,0.92)" strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <circle cx="610" cy="555" r={15 + amount * 5} fill={C.accentLt} opacity={draw} />
          <circle cx="190" cy="590" r={13 + amount * 4} fill={C.accentLt} opacity={draw} />
        </svg>
        <div style={{...HYBRID_LABEL, left: 86, bottom: 108, background: 'rgba(73,19,8,0.86)', color: '#FF9B66', transform: `scale(${0.88 + amount * 0.12})`}}>Reparatur 280 €</div>
        <div style={{...HYBRID_LABEL, right: 64, bottom: 118, background: 'rgba(5,52,31,0.86)', color: C.accentLt, opacity: interpolate(frame, [18, 34], [0, 1], clamp)}}>Reserve zahlt</div>
      </div>
    </HybridShell>
  );
};
