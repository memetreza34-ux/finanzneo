import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT, a } from './brand';

// FinanzNeo YouTube-Thumbnail – FLUX-Variante (1280×720). Statisch (Frame 0).
// Cinematic Münz-/Wachstums-Foto als Hintergrund, Text in Remotion drüber.
export const ThumbnailFlux: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      {/* FLUX-Hintergrund */}
      <Img src={staticFile('thumb/bg.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Scrim links (Text-Lesbarkeit) + Bottom-Vignette */}
      <AbsoluteFill style={{
        background: `linear-gradient(90deg, ${a('#04140B', 0.92)} 0%, ${a('#04140B', 0.72)} 30%, transparent 58%),
                     linear-gradient(0deg, ${a('#000000', 0.55)} 0%, transparent 35%)`,
      }} />

      {/* LINKS: Hook */}
      <div style={{ position: 'absolute', left: 64, top: 120 }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 46, color: C.gray, letterSpacing: 6 }}>NUR</div>
        <div style={{ fontFamily: FONT.title, fontSize: 200, color: C.gold, lineHeight: 0.9,
          textShadow: `0 4px 30px rgba(0,0,0,0.7), 0 0 50px ${a(C.gold, 0.5)}` }}>100€</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 52, color: C.white, marginTop: 2,
          textShadow: '0 3px 16px rgba(0,0,0,0.8)' }}>im Monat</div>
        <div style={{ marginTop: 26, display: 'inline-block', padding: '12px 30px', borderRadius: 14,
          background: C.negative, color: C.white, fontFamily: FONT.title, fontSize: 58, letterSpacing: 1,
          boxShadow: `0 8px 28px rgba(0,0,0,0.5), 0 0 36px ${a(C.negative, 0.6)}`, transform: 'rotate(-3deg)' }}>= REICH?</div>
      </div>

      {/* OBEN RECHTS: Ergebnis-Zahl über den Münzen */}
      <div style={{ position: 'absolute', right: 54, top: 36, textAlign: 'right' }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 38, color: C.white, letterSpacing: 3,
          textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>NACH 30 JAHREN</div>
        <div style={{ fontFamily: FONT.title, fontSize: 158, color: C.accent, lineHeight: 0.9,
          textShadow: `0 4px 26px rgba(0,0,0,0.85), 0 0 50px ${a(C.accent, 0.7)}` }}>120.000€</div>
      </div>

      {/* Logo unten links */}
      <div style={{ position: 'absolute', left: 64, bottom: 44, display: 'flex', fontFamily: FONT.title, fontSize: 56,
        textShadow: '0 2px 14px rgba(0,0,0,0.8)' }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>

      <AbsoluteFill style={{ boxShadow: 'inset 0 0 200px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
