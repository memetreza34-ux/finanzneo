// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 3 — SPARBUCH vs ZINSESZINS  (83,75s · 16:9)
//  Audio: szene-03-sparbuch-vs.mp3 · Höhepunkt: Dual-Chart (flach vs explosiv).
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  C, FONT, E, sec, prog, life, a,
  Background, Vignette, Counter, LottieBox,
} from '../brand';

const T = {
  wehtut: 0, lisamax: 3.6, hundert: 7.2, dreissig: 10.5,
  lisaspar: 14.7, sicher: 19.2, lisa36k: 23.1, centmehr: 27.0,
  maxinvest: 32.3, maxein: 38.1, max121k: 42.3,
  sacken: 48.3, gleich: 50.0, unterschied: 54.0,
  mitdenkt: 59.3, lisaweniger: 63.2, inflation: 67.3, verloren: 71.9,
  fazit: 75.9, zinszeit: 78.2, ende: 84.35,
};

const Stage: React.FC<{ inS: number; outS: number; ramp?: number; children: React.ReactNode;
  style?: React.CSSProperties }> = ({ inS, outS, ramp = 0.4, children, style }) => {
  const f = useCurrentFrame();
  const o = life(f, sec(inS), sec(outS), sec(ramp));
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: o, ...style }}>
      {children}
    </AbsoluteFill>
  );
};
const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number;
  style?: React.CSSProperties }> = ({ children, size = 60, color = C.white, weight = 800, style }) => (
  <div style={{ fontFamily: FONT.body, fontSize: size, fontWeight: weight, color,
    textAlign: 'center', lineHeight: 1.15, maxWidth: 1500, ...style }}>{children}</div>
);

// ─── Dual-Chart: Lisa (flach, rot) vs Max (explosiv, grün), shared scale ──────
const DualChart: React.FC<{ drawStart: number; drawEnd: number }> = ({ drawStart, drawEnd }) => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const b = { left: 300, right: 1480, top: 360, bottom: 800 };
  const cw = b.right - b.left, ch = b.bottom - b.top;
  const maxX = 30, maxY = 121000;
  const draw = prog(f, drawStart, drawEnd, E.inOut);
  const tx = (x: number) => b.left + (x / maxX) * cw;
  const ty = (y: number) => b.bottom - (y / maxY) * ch;
  const lisa = (x: number) => 36000 * (x / maxX);                  // linear (Sparbuch)
  const max = (x: number) => maxY * Math.pow(x / maxX, 2.05);      // Zinseszins
  const mk = (fn: (x: number) => number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) { const t = i / 120, x = t * maxX * draw; pts.push(`${tx(x).toFixed(1)},${ty(fn(x)).toFixed(1)}`); }
    return `M ${pts.join(' L ')}`;
  };
  const endX = tx(maxX * draw);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      {/* Achsen */}
      <line x1={b.left} y1={b.top} x2={b.left} y2={b.bottom} stroke={C.gray} strokeWidth={2} opacity={0.3} />
      <line x1={b.left} y1={b.bottom} x2={b.right} y2={b.bottom} stroke={C.gray} strokeWidth={2} opacity={0.4} />
      <text x={b.left} y={b.bottom + 44} fill={C.gray} fontSize={28} fontFamily={FONT.body} opacity={0.6}>Start</text>
      <text x={b.right} y={b.bottom + 44} textAnchor="end" fill={C.gray} fontSize={28} fontFamily={FONT.body} opacity={0.6}>30 Jahre</text>
      {/* Lisa (Sparbuch) */}
      <path d={mk(lisa)} fill="none" stroke={C.negative} strokeWidth={7} opacity={0.9}
        style={{ filter: `drop-shadow(0 0 8px ${a(C.negative, 0.6)})` }} />
      {/* Max (Zinseszins) */}
      <path d={mk(max)} fill="none" stroke={C.accent} strokeWidth={9}
        style={{ filter: `drop-shadow(0 0 12px ${a(C.accent, 0.8)})` }} />
      {/* Endpunkte + Labels */}
      <circle cx={endX} cy={ty(lisa(maxX * draw))} r={9} fill={C.negative} />
      <circle cx={endX} cy={ty(max(maxX * draw))} r={11} fill={C.accent} />
      <text x={endX + 20} y={ty(lisa(maxX * draw)) + 10} fill={C.negative} fontSize={34} fontWeight={700} fontFamily={FONT.body}>Sparbuch</text>
      <text x={endX + 20} y={ty(max(maxX * draw)) + 10} fill={C.accent} fontSize={40} fontFamily={FONT.title}>investiert</text>
    </svg>
  );
};
export const Scene03SparbuchVs: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />

      {/* A — Vergleich der weh tut */}
      <Stage inS={0} outS={T.lisamax}>
        <Line size={50} color={C.gray} weight={600}>Jetzt der Vergleich,</Line>
        <Line size={84} color={C.negative} weight={900} style={{ marginTop: 14 }}>der ein bisschen weh tut.</Line>
      </Stage>

      {/* B — Lisa & Max vorstellen */}
      <Stage inS={T.lisamax} outS={T.lisaspar}>
        <div style={{ display: 'flex', gap: 140, marginBottom: 40 }}>
          <div style={{ fontFamily: FONT.title, fontSize: 130, color: C.white }}>LISA</div>
          <div style={{ fontFamily: FONT.title, fontSize: 130, color: C.white }}>MAX</div>
        </div>
        <Line size={56} weight={700} style={{ opacity: prog(f, sec(T.hundert), sec(T.hundert + 0.6)) }}>
          Beide: <span style={{ color: C.gold }}>100 € im Monat</span></Line>
        <Line size={56} weight={700} style={{ marginTop: 12,
          opacity: prog(f, sec(T.dreissig), sec(T.dreissig + 0.6)) }}>
          Beide: <span style={{ color: C.blue }}>30 Jahre lang</span></Line>
      </Stage>

      {/* C — Lisa: Sparbuch → 36.000 */}
      <Stage inS={T.lisaspar} outS={T.maxinvest}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>LISA</span>
          <span style={{ fontFamily: FONT.body, fontSize: 44, fontWeight: 700, color: C.gray }}>· Sparbuch</span>
        </div>
        <Line size={42} color={C.gray} weight={600}
          style={{ opacity: prog(f, sec(T.sicher), sec(T.sicher + 0.6)) }}>
          Kein Risiko. Aber fast keine Zinsen.</Line>
        <div style={{ marginTop: 34, opacity: prog(f, sec(T.lisa36k), sec(T.lisa36k + 0.4)) }}>
          <Counter from={0} to={36000} start={sec(T.lisa36k)} end={sec(T.lisa36k + 1.4)} suffix=" €"
            size={170} color={a(C.white, 0.85)} />
        </div>
        <Line size={40} color={C.gray} weight={600} style={{ marginTop: 8,
          opacity: prog(f, sec(T.centmehr), sec(T.centmehr + 0.5)) }}>
          Genau das Eingezahlte. Keinen Cent mehr.</Line>
      </Stage>

      {/* D — Max: investiert → 121.000 */}
      <Stage inS={T.maxinvest} outS={T.sacken}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.accent }}>MAX</span>
          <span style={{ fontFamily: FONT.body, fontSize: 44, fontWeight: 700, color: C.gray }}>· investiert · 7 %</span>
        </div>
        <Line size={42} color={C.gray} weight={600}
          style={{ opacity: prog(f, sec(T.maxein), sec(T.maxein + 0.6)) }}>
          Zahlt exakt das Gleiche ein: auch 36.000 €</Line>
        <div style={{ marginTop: 30, opacity: prog(f, sec(T.max121k), sec(T.max121k + 0.4)) }}>
          <Counter from={0} to={121000} start={sec(T.max121k)} end={sec(T.max121k + 1.8)} suffix=" €"
            size={210} color={C.accent} style={{ textShadow: `0 0 70px ${a(C.accent, 0.5)}` }} />
        </div>
      </Stage>

      {/* E — Dual-Chart + Unterschied 85.000 */}
      <Stage inS={T.sacken} outS={T.mitdenkt}>
        <Line size={48} weight={800} style={{ position: 'absolute', top: 150 }}>
          Gleicher Betrag. Gleiche Zeit. Gleiche Disziplin.</Line>
        <DualChart drawStart={sec(T.sacken + 0.4)} drawEnd={sec(T.unterschied)} />
        <div style={{ position: 'absolute', bottom: 120, textAlign: 'center',
          opacity: prog(f, sec(T.unterschied), sec(T.unterschied + 0.5)) }}>
          <Line size={40} color={C.gray} weight={700}>Der Unterschied:</Line>
          <div style={{ fontFamily: FONT.title, fontSize: 110, color: C.gold,
            textShadow: `0 0 50px ${a(C.gold, 0.4)}` }}>+ 85.000 €</div>
        </div>
      </Stage>

      {/* F — Inflation: Lisas Geld schrumpft real */}
      <Stage inS={T.mitdenkt} outS={T.fazit}>
        <Line size={46} color={C.gray} weight={600} style={{ marginBottom: 26 }}>
          Und der Teil, den kaum jemand mitdenkt:</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <LottieBox file="lottie/warnung.json" size={130} loop={false} />
          <div>
            <span style={{ fontFamily: FONT.title, fontSize: 100, color: a(C.white, 0.5),
              textDecoration: f > sec(T.lisaweniger) ? 'line-through' : 'none' }}>36.000 €</span>
          </div>
        </div>
        <Line size={50} weight={800} color={C.negative} style={{ marginTop: 24,
          opacity: prog(f, sec(T.inflation), sec(T.inflation + 0.5)) }}>
          Durch Inflation real weniger wert.</Line>
        <Line size={44} color={C.gray} weight={700} style={{ marginTop: 10,
          opacity: prog(f, sec(T.verloren), sec(T.verloren + 0.5)) }}>
          Sie hat sogar <span style={{ color: C.negative }}>verloren</span>.</Line>
      </Stage>

      {/* G — Fazit: nicht das Geld, der Zinseszins + die Zeit */}
      <Stage inS={T.fazit} outS={T.ende} ramp={0.6}>
        <Line size={56} weight={700}>Nicht das Geld macht den Unterschied.</Line>
        <Line size={88} color={C.accent} weight={900} style={{ marginTop: 22 }}>
          Der Zinseszins.</Line>
        <Line size={64} color={C.blue} weight={800} style={{ marginTop: 14,
          opacity: prog(f, sec(T.zinszeit + 0.6), sec(T.zinszeit + 1.2)) }}>Und die Zeit.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE03_FRAMES = Math.ceil(83.75 * 30) + 18;
