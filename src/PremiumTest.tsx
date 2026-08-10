import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { C, sec, Background, Vignette, Title, Kicker,
  AreaPremium, BarsPremium, PiePremium, RadarPremium } from './brand';

// Vergleich: Premium-Charts (Recharts) statt handgemalt.
export const PremiumTest: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background grid glow />
      <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center' }}>
        <Kicker at={0} color={C.gold}>Premium · Recharts</Kicker>
      </div>

      {/* Area */}
      <div style={{ position: 'absolute', top: 200, left: 40 }}>
        <AreaPremium width={width - 80} height={480} drawStart={sec(0.3)} drawEnd={sec(2.5)}
          data={[
            { x: '0J', y: 0 }, { x: '5J', y: 9000 }, { x: '10J', y: 22000 },
            { x: '15J', y: 41000 }, { x: '20J', y: 68000 }, { x: '25J', y: 105000 }, { x: '30J', y: 120000 },
          ]} color={C.accent} />
      </div>

      {/* Bars + Pie nebeneinander */}
      <div style={{ position: 'absolute', top: 740, left: 40 }}>
        <BarsPremium width={(width - 80) / 2} height={420} growStart={sec(2.0)} growEnd={sec(3.2)}
          data={[
            { name: 'Sparbuch', value: 20000, color: C.negative },
            { name: 'ETF', value: 120000, color: C.accent },
          ]} />
      </div>
      <div style={{ position: 'absolute', top: 740, right: 40 }}>
        <PiePremium width={(width - 80) / 2} height={420} drawStart={sec(2.4)} drawEnd={sec(3.6)}
          centerLabel="100%"
          data={[
            { name: 'Aktien', value: 60, color: C.accent },
            { name: 'Anleihen', value: 25, color: C.blue },
            { name: 'Gold', value: 15, color: C.gold },
          ]} />
      </div>

      {/* Radar */}
      <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)' }}>
        <RadarPremium width={620} height={520} drawStart={sec(3.0)} drawEnd={sec(4.2)}
          data={[
            { axis: 'Rendite', value: 90 }, { axis: 'Sicherheit', value: 60 },
            { axis: 'Liquidität', value: 80 }, { axis: 'Einfachheit', value: 95 }, { axis: 'Kosten', value: 85 },
          ]} color={C.accent} />
      </div>

      <Vignette />
    </AbsoluteFill>
  );
};
