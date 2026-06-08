import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, sec, life, Vignette, Progress, Title, Kicker, FONT,
  RollingNumber, MoneyRain, Confetti, Sparkles, AuroraBG, PulseGrid, Shine, Emphasis,
} from './brand';

// Demo der Premium-Animationseffekte.
export const Showcase5: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Aurora als lebendiger Hintergrund */}
      <AuroraBG colors={[C.accent, C.blue, C.accentDk]} />
      <PulseGrid color={C.accent} />

      {/* 1 · Odometer-Zahl + Geld-Regen */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(5), 12), alignItems: 'center', justifyContent: 'center' }}>
        <MoneyRain width={width} height={height} n={22} />
        <Kicker at={sec(0.3)} color={C.gold}>Odometer-Zahl</Kicker>
        <div style={{ marginTop: 50 }}>
          <RollingNumber to={120000} start={sec(0.8)} end={sec(3.5)} size={170} color={C.accent} />
        </div>
      </AbsoluteFill>

      {/* 2 · Shine + Emphasis */}
      <AbsoluteFill style={{ opacity: life(f, sec(5), sec(10), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Shine at={sec(5.8)} dur={26}>
            <div style={{ fontFamily: FONT.title, fontSize: 140, color: C.white }}>GRATIS</div>
          </Shine>
          <div style={{ marginTop: 60, fontFamily: FONT.body, fontSize: 60, color: C.white }}>
            Spare bis zu <Emphasis at={sec(7.5)} color={C.gold} size={100}>2.400 €</Emphasis>
          </div>
        </div>
      </AbsoluteFill>

      {/* 3 · Sparkles + Konfetti CTA */}
      <AbsoluteFill style={{ opacity: life(f, sec(10), sec(15), 12), alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles width={width} height={height} n={16} color={C.gold} />
        <Confetti width={width} height={height} at={sec(11.0)} n={70} />
        <Title at={sec(10.4)} size={150} color={C.accent}>Geschafft!</Title>
        <div style={{ marginTop: 20, fontSize: 120 }}>🎉</div>
      </AbsoluteFill>

      <Vignette />
      <Progress totalFrames={sec(15)} width={width} />
    </AbsoluteFill>
  );
};
