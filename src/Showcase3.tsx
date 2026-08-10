import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, sec, life, Background, Vignette, Progress, Title, Kicker, prog,
  Table, BigStat, Gauge, StatBar,
  CompareSplit, Checklist, Quote, Badge, FeatureGrid,
} from './brand';

// Demo der finanz-fokussierten Bausteine.
export const Showcase3: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background grid glow />

      {/* 1 · Riesen-Stat + Badge */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(4), 10), alignItems: 'center', justifyContent: 'center' }}>
        <BigStat value="73%" label="der Deutschen sparen falsch" at={sec(0.4)} color={C.negative} />
        <div style={{ marginTop: 50 }}><Badge text="ACHTUNG" at={sec(1.6)} color={C.negative} /></div>
      </AbsoluteFill>

      {/* 2 · Vergleich-Split */}
      <AbsoluteFill style={{ opacity: life(f, sec(4), sec(9), 12) }}>
        <div style={{ marginTop: 120, textAlign: 'center' }}><Title at={sec(4.2)} size={84}>Sparbuch vs ETF</Title></div>
        <div style={{ position: 'absolute', top: 420, left: 60, right: 60 }}>
          <CompareSplit height={720}
            left={{ title: 'Sparbuch', value: '20k', sub: 'nach 30 J.', icon: 'bank', color: C.negative, appear: sec(4.6) }}
            right={{ title: 'ETF', value: '120k', sub: 'nach 30 J.', icon: 'chart-up', color: C.accent, appear: sec(5.4) }} />
        </div>
      </AbsoluteFill>

      {/* 3 · Tabelle */}
      <AbsoluteFill style={{ opacity: life(f, sec(9), sec(14), 12) }}>
        <div style={{ marginTop: 120, textAlign: 'center' }}><Title at={sec(9.2)} size={84}>Broker-Vergleich</Title></div>
        <div style={{ position: 'absolute', top: 380, left: 70, right: 70 }}>
          <Table headers={['Broker', 'Kosten', 'Sparplan']}
            rows={[
              { cells: ['Trade Republic', '1 €', 'gratis'], appear: sec(9.8), highlight: true },
              { cells: ['Scalable', '0,99 €', 'gratis'], appear: sec(10.6) },
              { cells: ['Filialbank', '15 €', '2,5 %'], appear: sec(11.4) },
            ]} accent={C.accent} />
        </div>
      </AbsoluteFill>

      {/* 4 · Risiko-Tacho + StatBar */}
      <AbsoluteFill style={{ opacity: life(f, sec(14), sec(19), 12) }}>
        <div style={{ marginTop: 120, textAlign: 'center' }}><Title at={sec(14.2)} size={84}>Risiko & Fakten</Title></div>
        <div style={{ position: 'absolute', top: 440, left: '50%', transform: 'translateX(-50%)' }}>
          <Gauge cx={300} cy={280} radius={230} value={35} start={sec(14.6)} end={sec(16.2)} label="Risiko" />
        </div>
        <div style={{ position: 'absolute', bottom: 280, left: 140 }}>
          <StatBar percent={68} label="machen nichts" at={sec(16.6)} color={C.gold} width={800} />
        </div>
      </AbsoluteFill>

      {/* 5 · Checkliste + Feature-Grid */}
      <AbsoluteFill style={{ opacity: life(f, sec(19), sec(24), 12) }}>
        <div style={{ marginTop: 110, textAlign: 'center' }}><Kicker at={sec(19.2)} color={C.blue}>Das brauchst du</Kicker></div>
        <div style={{ position: 'absolute', top: 340, left: 120 }}>
          <Checklist items={[
            { text: 'Ein Depot', appear: sec(19.6) },
            { text: '100 € im Monat', appear: sec(20.2) },
            { text: 'Geduld', appear: sec(20.8) },
          ]} />
        </div>
        <div style={{ position: 'absolute', bottom: 200, left: 80, right: 80 }}>
          <FeatureGrid cols={3} items={[
            { icon: 'shield', label: 'Sicher', appear: sec(21.6), color: C.blue },
            { icon: 'percent', label: '7 % p.a.', appear: sec(22.0), color: C.accent },
            { icon: 'rocket', label: 'Einfach', appear: sec(22.4), color: C.purple },
          ]} />
        </div>
      </AbsoluteFill>

      {/* 6 · Zitat */}
      <AbsoluteFill style={{ opacity: life(f, sec(24), sec(28), 12), alignItems: 'center', justifyContent: 'center' }}>
        <Quote text="Der beste Zeitpunkt war gestern. Der zweitbeste ist heute."
          author="Investoren-Weisheit" at={sec(24.4)} color={C.accent} size={66} />
      </AbsoluteFill>

      <Vignette />
      <Progress totalFrames={sec(28)} width={width} />
    </AbsoluteFill>
  );
};
