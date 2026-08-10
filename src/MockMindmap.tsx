import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { sec, prog, E } from './brand';

// claude-mem Mindmap — premium: kontinuierliches Schweben, fließende Linien, Glow-Puls.
export const MockMindmap: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const cx = W / 2, cy = H / 2 - 20;

  const base = [
    { label: 'Session #2', x: cx - 440, y: cy - 150, at: sec(0.9) },
    { label: 'Session #1', x: cx - 440, y: cy + 40,  at: sec(1.1) },
    { label: 'Session #3', x: cx,        y: cy - 260, at: sec(0.7) },
    { label: 'Session #4', x: cx + 440, y: cy - 150, at: sec(1.0) },
    { label: 'Session #5', x: cx + 440, y: cy + 40,  at: sec(1.2) },
  ];

  // sanftes, kontinuierliches Schweben pro Karte (eigene Phase)
  const float = (i: number) => {
    const ph = i * 1.7;
    return {
      fx: Math.sin(f * 0.028 + ph) * 20 + Math.cos(f * 0.017 + ph) * 8,
      fy: Math.cos(f * 0.023 + ph * 1.3) * 18 + Math.sin(f * 0.015 + ph) * 7,
    };
  };

  const nodes = base.map((s, i) => {
    const { fx, fy } = float(i);
    return { ...s, x: s.x + fx, y: s.y + fy };
  });

  const centerP = prog(f, sec(0.2), sec(0.5), E.spring);
  const pulse = 1 + Math.sin(f * 0.06) * 0.035;
  const glowO = 0.35 + Math.sin(f * 0.06) * 0.15;

  return (
    <AbsoluteFill style={{ background: '#ECEDEF' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {/* Verbindungen — fließende gestrichelte Linien (Daten strömen ins Zentrum) */}
        {nodes.map((s, i) => {
          const dp = prog(f, s.at - 6, s.at + 8, E.out);
          const ex = cx + (s.x - cx) * dp;
          const ey = cy + (s.y - cy) * dp;
          return (
            <line key={i} x1={ex} y1={ey} x2={cx} y2={cy}
              stroke="#AEB4BC" strokeWidth={2.5} strokeDasharray="7 9"
              strokeDashoffset={-(f * 0.9) % 16} opacity={dp * 0.9}
              strokeLinecap="round" />
          );
        })}
      </svg>

      {/* Session-Karten — schweben + leichter Schatten-Versatz */}
      {nodes.map((s, i) => {
        const p = prog(f, s.at, s.at + 14, E.spring);
        const lift = float(i).fy;
        return (
          <div key={i} style={{ position: 'absolute', left: s.x, top: s.y,
            transform: `translate(-50%,-50%) scale(${0.7 + p * 0.3})`, opacity: p,
            padding: '16px 34px', borderRadius: 16, background: '#FFFFFF',
            border: '1px solid #E3E5E8',
            boxShadow: `0 ${14 + lift * 0.4}px ${30 + Math.abs(lift)}px rgba(30,40,60,${0.10 + Math.abs(lift) * 0.002})`,
            fontFamily: 'monospace', fontSize: 32, color: '#454B54', whiteSpace: 'nowrap',
            letterSpacing: 0.5 }}>
            {s.label}
          </div>
        );
      })}

      {/* Zentraler Knoten — Glow-Ring + Puls */}
      <div style={{ position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${centerP * pulse})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 158, height: 158 }}>
          {/* Glow */}
          <div style={{ position: 'absolute', inset: -30, borderRadius: 48,
            background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)', opacity: glowO }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40,
            background: 'linear-gradient(155deg, #4F8DF7, #2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(37,99,235,0.45), inset 0 2px 0 rgba(255,255,255,0.3)' }}>
            <svg width={82} height={82} viewBox="0 0 24 24" fill="#fff">
              <path d="M7 5c-2 0-3 1.5-3 3 0 .8.3 1.4.7 2-.5.6-.9 1.4-.9 2.3 0 2 1.6 3.4 3.6 3.4.3 1.2 1.4 2 2.8 2 .9 0 1.7-.4 2.2-1 .5.6 1.3 1 2.2 1 1.4 0 2.5-.9 2.8-2 2 0 3.6-1.5 3.6-3.4 0-.9-.4-1.7-.9-2.3.4-.6.7-1.2.7-2 0-1.5-1-3-3-3-.6-1-1.7-1.6-3-1.6-.9 0-1.7.3-2.3.9-.6-.6-1.4-.9-2.3-.9-1.3 0-2.4.6-3 1.6z" />
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#363B43' }}>claude-mem</div>
      </div>
    </AbsoluteFill>
  );
};
