import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, sec, life, Background, Vignette, Progress, Title, Kicker,
  Donut, PercentRing, PhoneMockup, AppScreenDemo,
  Typewriter, MaskReveal, WordStagger, Underline,
  slideIn, zoomIn, wipeIn, blurIn, popIn, prog,
} from './brand';

// Demo der NEUEN Bausteine: Übergänge, Handy-Mockup, Donut, Prozent-Ring, Text-FX.
export const Showcase2: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background grid glow />

      {/* 1 · Übergänge-Demo */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(5), 10), alignItems: 'center' }}>
        <div style={{ marginTop: 150 }}><Kicker at={4}>Übergänge</Kicker></div>
        <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
          <div style={{ ...slideIn(prog(f, sec(0.6), sec(1.4)), 'left'),
            fontFamily: 'Bebas Neue', fontSize: 90, color: C.white }}>SLIDE</div>
          <div style={{ ...zoomIn(prog(f, sec(1.4), sec(2.2))),
            fontFamily: 'Bebas Neue', fontSize: 90, color: C.accent }}>ZOOM</div>
          <div style={{ ...blurIn(prog(f, sec(2.2), sec(3.0))),
            fontFamily: 'Bebas Neue', fontSize: 90, color: C.gold }}>BLUR-IN</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 90, color: C.blue,
            ...wipeIn(prog(f, sec(3.0), sec(3.8)), 'left') }}>WIPE</div>
        </div>
      </AbsoluteFill>

      {/* 2 · Text-Effekte (semantische Farben) */}
      <AbsoluteFill style={{ opacity: life(f, sec(5), sec(11), 12), alignItems: 'center' }}>
        <div style={{ marginTop: 150 }}><Kicker at={sec(5.2)} color={C.blue}>Text-Effekte</Kicker></div>
        <div style={{ marginTop: 90, textAlign: 'center', paddingInline: 60 }}>
          <MaskReveal at={sec(5.6)} size={92} color={C.white}>Masken-Reveal</MaskReveal>
          <div style={{ marginTop: 50 }}>
            <Typewriter text="Tippt sich selbst..." start={sec(6.6)} size={56} color={C.accentLt} />
          </div>
          <div style={{ marginTop: 60 }}>
            <WordStagger text="Wörter springen einzeln hoch" start={sec(8.0)} size={62}
              highlight={['einzeln']} highlightColor={C.gold} />
          </div>
          <div style={{ marginTop: 60 }}>
            <Underline at={sec(9.6)} color={C.accent} size={64}>Unterstrichen</Underline>
          </div>
        </div>
      </AbsoluteFill>

      {/* 3 · Donut + Prozent-Ring */}
      <AbsoluteFill style={{ opacity: life(f, sec(11), sec(17), 12) }}>
        <div style={{ marginTop: 130, textAlign: 'center' }}><Title at={sec(11.2)} size={86}>Aufteilung & Prozent</Title></div>
        <div style={{ position: 'absolute', top: 480, left: 70 }}>
          <Donut cx={240} cy={240} radius={180} thickness={56}
            segments={[
              { value: 60, color: C.accent }, { value: 25, color: C.blue }, { value: 15, color: C.gold },
            ]} drawStart={sec(11.6)} centerLabel="100%" centerSub="Portfolio" />
        </div>
        <div style={{ position: 'absolute', top: 480, right: 70 }}>
          <PercentRing cx={210} cy={210} radius={160} thickness={26}
            percent={7.5} color={C.accent} start={sec(13.0)} end={sec(15.0)} label="Rendite p.a." />
        </div>
        <div style={{ position: 'absolute', bottom: 200, width: '100%', textAlign: 'center',
          fontFamily: 'Inter', fontSize: 40, color: C.gray, opacity: prog(f, sec(15.2), sec(16.0)) }}>
          🟢 Aktien · 🔵 Anleihen · 🟡 Gold
        </div>
      </AbsoluteFill>

      {/* 4 · Handy-Mockup */}
      <AbsoluteFill style={{ opacity: life(f, sec(17), sec(23), 12), alignItems: 'center' }}>
        <div style={{ marginTop: 130 }}><Kicker at={sec(17.2)} color={C.purple}>So sieht deine App aus</Kicker></div>
        <div style={{ marginTop: 70 }}>
          <PhoneMockup at={sec(17.6)} width={440} glowColor={C.accent}>
            <AppScreenDemo title="Dein Depot" value="12.480 €" color={C.accent} />
          </PhoneMockup>
        </div>
      </AbsoluteFill>

      <Vignette />
      <Progress totalFrames={sec(23)} width={width} />
    </AbsoluteFill>
  );
};
