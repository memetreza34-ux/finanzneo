import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {HybridShell, HYBRID_IMAGE_FRAME, HYBRID_LABEL} from './HybridShell';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const nodes = [
  {x: 206, y: 238, label: 'Industrie', dx: -22, dy: -58},
  {x: 602, y: 250, label: 'Konsum', dx: -4, dy: -58},
  {x: 626, y: 562, label: 'Gesundheit', dx: -8, dy: 34},
  {x: 190, y: 596, label: 'Technologie', dx: -34, dy: 34},
];

export const EtfHybrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <HybridShell title="Ein ETF verteilt dein Risiko" icon="chart-up" tone="positive" caption="Das Geld fließt nicht nur in einen Wert, sondern in mehrere Bereiche.">
      <div style={HYBRID_IMAGE_FRAME}>
        <Img src={staticFile('experiments/image-world-consistency-v1/hybrid-test-v1/etf-diversifikation.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <svg viewBox="0 0 800 800" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3}}>
          {nodes.map((node, index) => {
            const start = 18 + index * 18;
            const progress = interpolate(frame, [start, start + 32], [0, 1], clamp);
            const pulse = spring({frame: Math.max(0, frame - (start + 24)), fps: 30, config: {damping: 14, stiffness: 140}});
            return <g key={node.label}><path d={`M400 420 C400 420 ${(400 + node.x) / 2} ${(420 + node.y) / 2} ${node.x} ${node.y}`} fill="none" stroke="rgba(57,255,167,0.88)" strokeWidth="11" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} /><circle cx={node.x} cy={node.y} r={11 + pulse * 9} fill={C.accentLt} opacity={progress} /></g>;
          })}
          <circle cx="400" cy="420" r="28" fill="rgba(57,255,167,0.92)" opacity={interpolate(frame, [8, 24], [0, 1], clamp)} />
        </svg>
        {nodes.map((node, index) => <div key={node.label} style={{...HYBRID_LABEL, left: node.x + node.dx, top: node.y + node.dy, padding: '9px 13px', fontSize: 22, background: 'rgba(3,35,22,0.84)', color: C.accentLt, opacity: interpolate(frame, [46 + index * 18, 64 + index * 18], [0, 1], clamp)}}>{node.label}</div>)}
      </div>
    </HybridShell>
  );
};
