import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, RollingNumber, WordReveal, Vignette, Particles } from './brand';

// Test: FLUX-Bild als Hintergrund (Option B — die Stimme redet über das Bild "Geldbaum").
// Thema: passives Einkommen. ~12s, vertikal.
export const PassivTest: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Ken-Burns aufs Bild
  const scale = lerpF(f, 1.08, 1.26, 0, sec(12), E.inOut);
  const ty = lerpF(f, 0, -50, 0, sec(12), E.inOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* FLUX-Bild als Hintergrund */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile('test/geldbaum.png')} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translateY(${ty}px)`,
        }} />
        {/* dunkler Scrim für Lesbarkeit */}
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, ${a(C.bg,0.85)} 0%, ${a(C.bg,0.25)} 30%, ${a(C.bg,0.45)} 60%, ${a(C.bg,0.95)} 100%)`,
        }} />
      </AbsoluteFill>

      <Particles width={width} height={height} color={C.gold} n={24} />

      {/* Beat 1 · Hook (0-4.5s) */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(4.8), 12), paddingTop: 220, alignItems: 'center' }}>
        <div style={{ width: '100%', paddingInline: 70, textAlign: 'center' }}>
          <WordReveal text="Stell dir vor, dein Geld wächst von alleine." start={sec(0.4)} perWord={6} size={72}
            highlight={['wächst', 'alleine.']} highlightColor={C.accent} />
        </div>
      </AbsoluteFill>

      {/* Beat 2 · Counter passives Einkommen (4.8-9s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(4.8), sec(9), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: C.white,
            opacity: prog(f, sec(5.0), sec(5.5)) }}>Passives Einkommen</div>
          <div style={{ marginTop: 12 }}>
            <RollingNumber to={400} start={sec(5.4)} end={sec(7.6)} size={170} color={C.gold} suffix=" €" />
          </div>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: C.gray, marginTop: 8,
            opacity: prog(f, sec(7.4), sec(8.0)) }}>jeden Monat — ohne zu arbeiten</div>
        </div>
      </AbsoluteFill>

      {/* Beat 3 · Aussage (9-12s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(9), sec(12), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', paddingInline: 60 }}>
          <div style={{ fontFamily: FONT.title, fontSize: 96, color: C.white, lineHeight: 1.05,
            opacity: prog(f, sec(9.2), sec(9.7)), transform: `scale(${0.85 + prog(f, sec(9.2), sec(9.7), E.spring) * 0.15})` }}>
            Das ist der<br/><span style={{ color: C.accent, textShadow: `0 0 50px ${a(C.accent,0.6)}` }}>Geldbaum-Effekt</span>
          </div>
        </div>
      </AbsoluteFill>

      <Vignette />
      {/* Fortschritt */}
      <div style={{ position: 'absolute', top: 0, left: 0, height: 6,
        width: Math.min((f / sec(12)) * width, width),
        background: `linear-gradient(90deg, ${C.gold}, ${C.accent})`, zIndex: 100 }} />
    </AbsoluteFill>
  );
};
