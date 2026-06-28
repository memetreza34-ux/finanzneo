import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, a } from './brand';

// FinanzNeo Profilbild / App-Icon (1080×1080). Flach & sauber designt — KEIN KI-Look.
// 3 Varianten: PP1 (dunkel, F weiß/N grün), PP2 (grüne Kachel), PP3 (minimal, N = Pfeil).
// Als Still rendern (Frame 0). Kreis-sicher: alles zentriert mit Rand.

// kleiner Aufwärts-Pfeil als Akzent
const UpArrow: React.FC<{ size: number; color: string; x: number; y: number }> = ({ size, color, x, y }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', left: x, top: y }}>
    <path d="M20 78 L62 36 M62 36 L40 34 M62 36 L64 58" stroke={color} strokeWidth={13}
      strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Wrap: React.FC<{ children: React.ReactNode; bg: string; radius?: number }> = ({ children, bg, radius = 0 }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 1080, height: 1080, background: bg, borderRadius: radius, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {children}
    </div>
  </AbsoluteFill>
);

// ── PP1 · dunkel, F weiß / N grün, Pfe-Akzent oben rechts ──────────────────
export const ProfilePic1: React.FC = () => (
  <Wrap bg={`radial-gradient(60% 60% at 50% 42%, ${a(C.accent, 0.22)} 0%, ${C.bg} 70%)`}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline' }}>
      <span style={{ fontFamily: FONT.title, fontSize: 560, color: C.white, lineHeight: 1 }}>F</span>
      <span style={{ fontFamily: FONT.title, fontSize: 560, color: C.accent, lineHeight: 1,
        textShadow: `0 0 40px ${a(C.accent, 0.35)}` }}>N</span>
      <UpArrow size={200} color={C.accent} x={595} y={245} />
    </div>
    <div style={{ position: 'absolute', bottom: 315, width: 320, height: 12, borderRadius: 6, background: a(C.accent, 0.9) }} />
  </Wrap>
);

// ── PP2 · grüne Kachel, FN dunkel, weißer Pfeil (kräftig, App-Icon) ─────────
export const ProfilePic2: React.FC = () => (
  <Wrap bg={`linear-gradient(150deg, ${C.accentLt} 0%, ${C.accent} 55%, ${C.accentDk} 100%)`}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline' }}>
      <span style={{ fontFamily: FONT.title, fontSize: 600, color: C.bg, lineHeight: 1 }}>F</span>
      <span style={{ fontFamily: FONT.title, fontSize: 600, color: C.bg, lineHeight: 1 }}>N</span>
      <UpArrow size={230} color={C.white} x={540} y={-130} />
    </div>
  </Wrap>
);

// ── PP3 · minimal, dunkel, FN grün, dezenter Goldpunkt (Geld) ───────────────
export const ProfilePic3: React.FC = () => (
  <Wrap bg={C.bg}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline' }}>
      <span style={{ fontFamily: FONT.title, fontSize: 600, color: C.accent, lineHeight: 1 }}>F</span>
      <span style={{ fontFamily: FONT.title, fontSize: 600, color: C.accent, lineHeight: 1 }}>N</span>
      <UpArrow size={200} color={C.gold} x={545} y={-110} />
    </div>
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 980, height: 980, borderRadius: '50%',
      border: `6px solid ${a(C.accent, 0.25)}`, transform: 'translate(-50%, -50%)' }} />
  </Wrap>
);
