import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, sec, life, Background, Vignette, Progress,
  Title, Kicker, Counter,
  GrowthChart, Bars, NumberedSteps, CheckCards, Timeline,
  Icon, Particles,
} from './brand';

// Demo aller FinanzNeo-Bausteine.
// MUSTER: eine durchgehende Timeline, absolute Frames, jeder Beat per life()-Opacity
// ein- und ausgeblendet (kein <Sequence>, damit Bausteine konsistente Frames sehen).
export const Showcase: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background grid glow />

      {/* 1 · 0–4s · Titel + Counter + Icons */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(4), 10), alignItems: 'center' }}>
        <div style={{ marginTop: 170 }}><Kicker at={5}>FinanzNeo Baukasten</Kicker></div>
        <Title at={12} size={150} style={{ marginTop: 30, textAlign: 'center' }}>Bausteine</Title>
        <div style={{ marginTop: 50 }}>
          <Counter to={120000} start={sec(0.8)} end={sec(2.8)} size={170} />
        </div>
        <div style={{ display: 'flex', gap: 44, marginTop: 90 }}>
          {(['euro', 'chart-up', 'shield', 'rocket'] as const).map((n, i) => (
            <div key={n} style={{ opacity: life(f, sec(1.0) + i * 6, sec(4), 8) }}>
              <Icon name={n} size={94} />
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* 2 · 4–9s · Wachstumskurve */}
      <AbsoluteFill style={{ opacity: life(f, sec(4), sec(9), 12) }}>
        <div style={{ marginTop: 150, textAlign: 'center' }}><Title at={sec(4.2)} size={92}>Wachstumskurve</Title></div>
        <GrowthChart width={width} height={height}
          drawStart={sec(4.5)} drawEnd={sec(7.0)} maxX={30} maxY={120000}
          xLabels={[{ x: 10, label: '10J' }, { x: 20, label: '20J' }, { x: 30, label: '30J' }]}
          yLabels={[{ y: 60000, label: '60k€' }]}
          markers={[{ x: 30, appear: sec(7.0), label: '120.000 €', sub: 'nach 30 Jahren' }]} />
      </AbsoluteFill>

      {/* 3 · 9–13s · Balken-Vergleich */}
      <AbsoluteFill style={{ opacity: life(f, sec(9), sec(13), 12) }}>
        <div style={{ marginTop: 150, textAlign: 'center' }}><Title at={sec(9.2)} size={92}>Vergleich</Title></div>
        <Bars width={width} baseY={1520} maxBarH={780} barW={250}
          items={[
            { x: width / 2 - 320, valuePct: 1.0, color: C.accent, label: 'Sparplan', topText: '120k', appear: sec(9.6) },
            { x: width / 2 + 70, valuePct: 0.35, color: C.negative, label: 'Sparbuch', topText: '20k', appear: sec(10.4) },
          ]} />
      </AbsoluteFill>

      {/* 4 · 13–17s · Nummerierte Schritte */}
      <AbsoluteFill style={{ opacity: life(f, sec(13), sec(17), 12) }}>
        <div style={{ marginTop: 160, textAlign: 'center' }}><Title at={sec(13.2)} size={92}>3 Schritte</Title></div>
        <div style={{ position: 'absolute', top: 580, left: 130, right: 130 }}>
          <NumberedSteps steps={[
            { label: 'ETF verstehen', appear: sec(13.6), icon: 'bulb' },
            { label: 'Depot eröffnen', appear: sec(14.3), icon: 'bank' },
            { label: 'Sparplan starten', appear: sec(15.0), icon: 'rocket' },
          ]} />
        </div>
      </AbsoluteFill>

      {/* 5 · 17–21s · Check-Cards */}
      <AbsoluteFill style={{ opacity: life(f, sec(17), sec(21), 12) }}>
        <div style={{ marginTop: 160, textAlign: 'center' }}><Title at={sec(17.2)} size={88}>Probleme gelöst</Title></div>
        <div style={{ position: 'absolute', top: 560, left: 90, right: 90 }}>
          <CheckCards cards={[
            { text: 'Noch nie von ETFs gehört?', appear: sec(17.5), solve: sec(19.2) },
            { text: 'Weißt nicht, wo anfangen?', appear: sec(18.1), solve: sec(19.7) },
          ]} />
        </div>
      </AbsoluteFill>

      {/* 6 · 21–26s · Timeline + CTA + Partikel-Burst */}
      <AbsoluteFill style={{ opacity: life(f, sec(21), sec(26), 12), alignItems: 'center' }}>
        <Timeline width={width} y={640} left={150} right={width - 150}
          points={[
            { label: '2026', sub: 'Start', appear: sec(21.6) },
            { label: '2036', sub: '60k €', appear: sec(22.2) },
            { label: '2056', sub: '120k €', appear: sec(22.8) },
          ]} />
        <Particles width={width} height={height} mode="burst" burstAt={sec(24.0)} n={46} />
        <div style={{ position: 'absolute', top: 1150, width: '100%', textAlign: 'center' }}>
          <Title at={sec(24.0)} size={140} color={C.accent}>Lass uns loslegen</Title>
          <div style={{ fontSize: 120, marginTop: 14, opacity: life(f, sec(24.3), sec(26), 6) }}>🚀</div>
        </div>
      </AbsoluteFill>

      <Vignette />
      <Progress totalFrames={sec(25.5)} width={width} />
    </AbsoluteFill>
  );
};
