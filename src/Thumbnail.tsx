import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, a } from './brand';

// FinanzNeo YouTube-Thumbnail (1280×720). Statisch — als Still rendern (Frame 0).
// "Kinetic Wealth": links Hook, rechts Monument-Zahl + Wachstumskurve.
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(70% 90% at 78% 40%, ${a(C.accent, 0.16)} 0%, transparent 55%),
                   radial-gradient(60% 80% at 10% 90%, ${a(C.accentDk, 0.18)} 0%, transparent 50%),
                   ${C.bg}`,
      overflow: 'hidden',
    }}>
      {/* feines Grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${a(C.accent, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${a(C.accent, 0.05)} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Wachstumskurve rechts hinten */}
      <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="tArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i <= 60; i++) { const t = i / 60; const x = 560 + t * 700; const y = 660 - Math.pow(t, 2.1) * 520; pts.push(`${x},${y}`); }
          return (<>
            <path d={`M 560,660 L ${pts.join(' L ')} L 1260,660 Z`} fill="url(#tArea)" />
            <path d={`M ${pts.join(' L ')}`} fill="none" stroke={C.accent} strokeWidth={8}
              style={{ filter: `drop-shadow(0 0 16px ${a(C.accent, 0.8)})` }} />
            {/* Pfeilspitze */}
            <polygon points="1245,150 1215,135 1228,170" fill={C.accent} style={{ filter: `drop-shadow(0 0 12px ${C.accent})` }} />
          </>);
        })()}
      </svg>

      {/* LINKS: Hook */}
      <div style={{ position: 'absolute', left: 70, top: 150 }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: C.gray, letterSpacing: 6 }}>NUR</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: FONT.title, fontSize: 200, color: C.gold, lineHeight: 0.9, textShadow: `0 0 50px ${a(C.gold, 0.5)}` }}>100€</span>
        </div>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 50, color: C.white, marginTop: 4 }}>im Monat</div>
        <div style={{ marginTop: 26, display: 'inline-block', padding: '12px 28px', borderRadius: 14,
          background: C.negative, color: C.white, fontFamily: FONT.title, fontSize: 56, letterSpacing: 1,
          boxShadow: `0 0 36px ${a(C.negative, 0.6)}`, transform: 'rotate(-3deg)' }}>= REICH?</div>
      </div>

      {/* RECHTS: Monument-Zahl */}
      <div style={{ position: 'absolute', right: 60, top: 250, textAlign: 'right' }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 40, color: C.accentLt, letterSpacing: 4 }}>NACH 30 JAHREN</div>
        <div style={{ fontFamily: FONT.title, fontSize: 230, color: C.accent, lineHeight: 0.85,
          textShadow: `0 0 60px ${a(C.accent, 0.6)}` }}>120.000€</div>
      </div>

      {/* Logo unten links */}
      <div style={{ position: 'absolute', left: 70, bottom: 46, display: 'flex', fontFamily: FONT.title, fontSize: 56 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>

      {/* feine Rand-Vignette */}
      <AbsoluteFill style={{ boxShadow: 'inset 0 0 200px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
