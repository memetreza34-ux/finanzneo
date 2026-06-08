import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, sec, life, Background, Vignette, Progress, Title, Kicker,
  Mindmap, Flowchart, Pyramid, Cycle, Balance, GoalTracker, Ranking,
} from './brand';

// Demo: Diagramm-Typen (Mindmap, Flowchart, Pyramide, Kreislauf, Waage, Ziel, Ranking).
export const Showcase4: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background grid glow />

      {/* 1 · Mindmap */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(5), 12) }}>
        <div style={{ position: 'absolute', top: 90, width: '100%', textAlign: 'center' }}><Title at={sec(0.2)} size={80}>Mindmap</Title></div>
        <Mindmap width={width} height={height - 100} center="ETF" centerAt={sec(0.5)}
          nodes={[
            { label: 'Aktien', appear: sec(1.2), color: C.accent },
            { label: 'Anleihen', appear: sec(1.7), color: C.blue },
            { label: 'Gold', appear: sec(2.2), color: C.gold },
            { label: 'Immobilien', appear: sec(2.7), color: C.purple },
          ]} />
      </AbsoluteFill>

      {/* 2 · Flowchart */}
      <AbsoluteFill style={{ opacity: life(f, sec(5), sec(9), 12) }}>
        <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center' }}><Title at={sec(5.2)} size={80}>Flowchart</Title></div>
        <Flowchart vertical y={360} width={width} steps={[
          { label: 'Geld verdienen', appear: sec(5.6) },
          { label: 'In ETF anlegen', appear: sec(6.3) },
          { label: 'Wachsen lassen', appear: sec(7.0) },
        ]} />
      </AbsoluteFill>

      {/* 3 · Pyramide */}
      <AbsoluteFill style={{ opacity: life(f, sec(9), sec(13), 12) }}>
        <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center' }}><Title at={sec(9.2)} size={80}>Pyramide</Title></div>
        <Pyramid cx={width / 2} topY={360} baseW={760} levelH={150} levels={[
          { label: 'Notgroschen', appear: sec(9.6) },
          { label: 'ETF-Sparplan', appear: sec(10.2) },
          { label: 'Einzelaktien', appear: sec(10.8) },
          { label: 'Krypto', appear: sec(11.4) },
        ]} />
      </AbsoluteFill>

      {/* 4 · Kreislauf */}
      <AbsoluteFill style={{ opacity: life(f, sec(13), sec(17), 12) }}>
        <div style={{ position: 'absolute', top: 90, width: '100%', textAlign: 'center' }}><Kicker at={sec(13.2)} color={C.accent}>Zinseszins</Kicker></div>
        <Cycle width={width} height={height - 60} centerLabel="📈" radius={300}
          nodes={[
            { label: 'Einzahlen', appear: sec(13.6) },
            { label: 'Zinsen', appear: sec(14.2) },
            { label: 'Reinvest', appear: sec(14.8) },
            { label: 'Mehr Zinsen', appear: sec(15.4) },
          ]} />
      </AbsoluteFill>

      {/* 5 · Waage + Ziel-Tracker */}
      <AbsoluteFill style={{ opacity: life(f, sec(17), sec(21), 12) }}>
        <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center' }}><Title at={sec(17.2)} size={76}>Waage & Ziel</Title></div>
        <Balance width={width} cx={360} topY={420} tiltAt={sec(17.8)}
          left={{ label: 'Risiko', weight: 1, color: C.negative }}
          right={{ label: 'Rendite', weight: 3, color: C.accent }} />
        <GoalTracker x={760} topY={360} height={620} percent={75} goalLabel="Sparziel 10k€"
          start={sec(18.4)} end={sec(20.2)} color={C.accent} />
      </AbsoluteFill>

      {/* 6 · Ranking */}
      <AbsoluteFill style={{ opacity: life(f, sec(21), sec(25), 12) }}>
        <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center' }}><Title at={sec(21.2)} size={80}>Top 3 Broker</Title></div>
        <div style={{ position: 'absolute', top: 400, left: 80, right: 80 }}>
          <Ranking items={[
            { name: 'Trade Republic', value: '1 €', appear: sec(21.6) },
            { name: 'Scalable', value: '0,99 €', appear: sec(22.2) },
            { name: 'ING', value: '4,90 €', appear: sec(22.8) },
          ]} />
        </div>
      </AbsoluteFill>

      <Vignette />
      <Progress totalFrames={sec(25)} width={width} />
    </AbsoluteFill>
  );
};
