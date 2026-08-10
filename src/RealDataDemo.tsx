import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, RollingNumber, AreaPremium } from './brand';
import sp500 from '../public/data/sp500-10y.json';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · REAL-DATA DEMO — echte Yahoo-Finance-Daten im Chart
//  Beweist: public/data/*.json (von scripts/fetch-data.mjs) → AreaPremium.
//  Daten IMMER mit Quelle + Datum zeigen (unten rechts).
// ════════════════════════════════════════════════════════════════════════════

export const REAL_DATA_FRAMES = sec(8);

export const RealDataDemo: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W } = useVideoConfig();
  const data = sp500.chart as { x: string; y: number }[];
  const last = data[data.length - 1].y;
  const first = data[0].y;
  const growthPct = Math.round(((last - first) / first) * 100);
  const cw = Math.min(960, W - 120);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 8%, #0E2016 0%, ${C.bg} 62%)`,
      alignItems: 'center', opacity: life(f, 0, REAL_DATA_FRAMES, 9) }}>

      {/* Kicker + Titel */}
      <div style={{ marginTop: 150, textAlign: 'center',
        opacity: prog(f, sec(0.2), sec(0.7)), transform: `translateY(${lerpF(f, 26, 0, sec(0.2), sec(0.8))}px)` }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.accentLt, letterSpacing: 6 }}>ECHTE DATEN · 10 JAHRE</div>
        <div style={{ fontFamily: FONT.title, fontSize: 130, color: C.white, lineHeight: 0.95, marginTop: 8 }}>S&amp;P 500</div>
      </div>

      {/* Echter Chart */}
      <div style={{ position: 'absolute', top: 520, opacity: prog(f, sec(1.0), sec(1.4)) }}>
        <AreaPremium data={data} width={cw} height={680} drawStart={sec(1.2)} drawEnd={sec(4.0)} color={C.accent} />
      </div>

      {/* Endwert + Wachstum — sauber gestapelt, klare Abstände (kein Quetschen) */}
      <div style={{ position: 'absolute', top: 1300, width: '100%', textAlign: 'center',
        opacity: prog(f, sec(4.0), sec(4.5)) }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: C.gray, letterSpacing: 1 }}>Punktestand heute</div>
        <div style={{ marginTop: 26 }}>
          <RollingNumber to={Math.round(last)} start={sec(4.2)} end={sec(6.0)} size={150} color={C.accent} suffix="" />
        </div>
        <div style={{ fontFamily: FONT.title, fontSize: 70, color: C.gold, marginTop: 54,
          opacity: prog(f, sec(6.0), sec(6.5)) }}>+{growthPct}% in 10 Jahren</div>
      </div>

      {/* Quelle + Datum (Pflicht) */}
      <div style={{ position: 'absolute', bottom: 60, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 500, fontSize: 26, color: a(C.gray, 0.7),
        opacity: prog(f, sec(1.5), sec(2.0)) }}>
        Quelle: {sp500.source} · Stand: {sp500.fetchedAt}
      </div>
    </AbsoluteFill>
  );
};
