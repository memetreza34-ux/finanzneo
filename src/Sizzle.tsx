import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, E,
  AuroraBG, Particles, RollingNumber, AreaPremium, MaskReveal, WordStagger,
  Emphasis, Confetti, Vignette, PercentRing,
} from './brand';

// "Sizzle" — polierte Best-of-Animation. ~17s, vertikal.
export const Sizzle: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AuroraBG colors={[C.accent, C.blue, C.accentDk]} />
      <Particles color={C.gold} n={26} />

      {/* 1 · Intro · MaskReveal Logo (0-3.2s) */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(3.4), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <MaskReveal at={sec(0.3)} dur={20} size={150} color={C.white} style={{ fontFamily: FONT.title }}>
            FINANZ<span style={{ color: C.accent }}>NEO</span>
          </MaskReveal>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.gray, letterSpacing: 6,
            marginTop: 24, opacity: prog(f, sec(1.4), sec(2.0)),
            transform: `translateY(${lerpF(f, 20, 0, sec(1.4), sec(2.0))}px)` }}>
            DEIN GELD. DEIN WACHSTUM.
          </div>
        </div>
      </AbsoluteFill>

      {/* 2 · Riesen-Counter mit Push-In (3.4-7.4s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(3.4), sec(7.6), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', transform: `scale(${lerpF(f, 1, 1.08, sec(3.4), sec(7.6), E.inOut)})` }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: C.white,
            opacity: prog(f, sec(3.7), sec(4.2)) }}>In 30 Jahren möglich</div>
          <div style={{ marginTop: 16 }}>
            <RollingNumber to={847000} start={sec(4.0)} end={sec(6.6)} size={150} color={C.gold} />
          </div>
        </div>
      </AbsoluteFill>

      {/* 3 · Premium-Chart zeichnet sich (7.6-11.6s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(7.6), sec(11.8), 12) }}>
        <div style={{ position: 'absolute', top: 320, width: '100%', textAlign: 'center',
          fontFamily: FONT.title, fontSize: 78, color: C.white, opacity: prog(f, sec(7.9), sec(8.4)) }}>
          EXPONENTIELLES WACHSTUM
        </div>
        <div style={{ position: 'absolute', top: 560, left: 20, right: 20 }}>
          <AreaPremium width={width - 40} height={760} drawStart={sec(8.2)} drawEnd={sec(10.8)}
            color={C.accent}
            data={[
              { x: '0J', y: 0 }, { x: '10J', y: 90000 }, { x: '20J', y: 320000 },
              { x: '25J', y: 540000 }, { x: '30J', y: 847000 },
            ]} />
        </div>
      </AbsoluteFill>

      {/* 4 · Kinetic Text + Emphasis (11.8-14.6s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(11.8), sec(14.8), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', paddingInline: 60 }}>
          <WordStagger text="Nur durch" start={sec(12.0)} perWord={5} size={64} color={C.white} />
          <div style={{ marginTop: 20 }}>
            <Emphasis at={sec(12.6)} color={C.accent} size={130}>Geduld</Emphasis>
          </div>
          <div style={{ marginTop: 20 }}>
            <WordStagger text="und Zeit." start={sec(13.2)} perWord={5} size={64} color={C.white} />
          </div>
        </div>
      </AbsoluteFill>

      {/* 5 · Finale + Konfetti (14.8-17s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(14.8), sec(17), 10), alignItems: 'center', justifyContent: 'center' }}>
        <Confetti width={width} height={height} at={sec(15.1)} n={70} />
        <div style={{ textAlign: 'center', transform: `scale(${prog(f, sec(14.9), sec(15.4), E.spring)})` }}>
          <div style={{ fontFamily: FONT.title, fontSize: 120, color: C.accent,
            textShadow: `0 0 70px ${a(C.accent,0.6)}` }}>FANG HEUTE AN</div>
          <div style={{ fontSize: 90, marginTop: 10 }}>🚀</div>
        </div>
      </AbsoluteFill>

      <Vignette />
    </AbsoluteFill>
  );
};
