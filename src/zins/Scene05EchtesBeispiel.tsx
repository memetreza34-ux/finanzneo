// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 5 — ECHTES BEISPIEL (MSCI World)  (68,74s · 16:9)
//  Audio: szene-05-echtes-beispiel.mp3 · ECHTE Yahoo-Finance-Daten (Pflicht: Quelle+Datum).
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a,
  Background, Vignette, AreaPremium, LottieBox,
} from '../brand';
import msciData from '../../public/data/msci-world-10y.json';

const DATA = msciData.chart as { x: string; y: number }[];

const T = {
  frage: 0, echte: 5.2, msci: 8.6, firmen: 15.5, alle: 19.2, pleite: 23.4,
  zehnp: 26.4, zehnnicht7: 32.5, rechne7: 34.5, warum: 38.3, echtdaten: 45.3,
  ehrlich: 49.7, nichtjedes: 51.8, tiefrot: 54.8,
  trend: 58.5, richtung: 64.0, oben: 67.0, ende: 69.34,
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

export const Scene05EchtesBeispiel: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-05-echtes-beispiel.mp3')} />

      {/* A — 7%? Wo gibt's das? */}
      <Stage inS={0} outS={T.msci}>
        <Line size={70} weight={900}>„7 % — wo gibt's das?"</Line>
        <Line size={48} color={C.gray} weight={600} style={{ marginTop: 22,
          opacity: prog(f, sec(T.echte), sec(T.echte + 0.6)) }}>
          Berechtigte Frage. Schauen wir auf <span style={{ color: C.accent }}>echte Zahlen</span>.</Line>
      </Stage>

      {/* B — MSCI World + echte Kurve (Anker, lange sichtbar) */}
      <Stage inS={T.msci} outS={T.ehrlich}>
        {/* Titel oben */}
        <div style={{ position: 'absolute', top: 90, textAlign: 'center', width: '100%' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 92, color: C.white }}>MSCI WORLD</div>
          <div style={{ fontFamily: FONT.body, fontSize: 38, fontWeight: 600, color: C.gray, marginTop: 4 }}>
            ein Index aus über 1.500 Firmen weltweit</div>
        </div>

        {/* Firmen-Chips (erscheinen 15.5, weg ab ~26) */}
        <div style={{ position: 'absolute', top: 250, display: 'flex', gap: 18,
          opacity: life(f, sec(T.firmen), sec(T.zehnp), sec(0.5)) }}>
          {['Apple', 'Microsoft', 'Nestlé', '+ 1.500 mehr'].map((n, i) => (
            <div key={i} style={{ padding: '10px 24px', borderRadius: 999,
              background: a(C.white, 0.06), border: `1px solid ${a(C.white, 0.15)}`,
              fontFamily: FONT.body, fontSize: 30, fontWeight: 700,
              color: i === 3 ? C.accent : C.white,
              opacity: prog(f, sec(T.firmen + i * 0.4), sec(T.firmen + i * 0.4 + 0.5)) }}>{n}</div>
          ))}
        </div>

        {/* Rendite-Badge (erscheint 26.4) */}
        <div style={{ position: 'absolute', top: 250, display: 'flex', flexDirection: 'column',
          alignItems: 'center', opacity: prog(f, sec(T.zehnp), sec(T.zehnp + 0.6)),
          transform: `scale(${lerpF(f, 0.8, 1, sec(T.zehnp), sec(T.zehnp + 0.6))})` }}>
          <span style={{ fontFamily: FONT.body, fontSize: 32, fontWeight: 700, color: C.gray }}>
            letzte 10 Jahre · Ø</span>
          <span style={{ fontFamily: FONT.title, fontSize: 110, color: C.accent,
            textShadow: `0 0 50px ${a(C.accent, 0.4)}` }}>≈ 10,8 % p.a.</span>
        </div>

        {/* Die echte Kurve */}
        <AreaPremium data={DATA} width={1920} height={1080}
          drawStart={sec(T.msci + 1.5)} drawEnd={sec(T.alle + 2)} color={C.accent} hideAxes />

        {/* unter der Kurve: ich rechne mit 7% */}
        <div style={{ position: 'absolute', bottom: 150, textAlign: 'center',
          opacity: prog(f, sec(T.rechne7), sec(T.rechne7 + 0.6)) }}>
          <Line size={44} weight={700}>
            Und trotzdem rechne ich nur mit <span style={{ color: C.gold }}>7 %</span>.</Line>
          <Line size={34} color={C.gray} weight={600} style={{ marginTop: 8,
            opacity: prog(f, sec(T.warum), sec(T.warum + 0.6)) }}>
            Lieber zu wenig versprochen — als dir was vormachen.</Line>
        </div>

        {/* Quelle (Pflicht, dezent unten) */}
        <div style={{ position: 'absolute', bottom: 44, fontFamily: FONT.body, fontSize: 24,
          color: a(C.gray, 0.7), letterSpacing: 1 }}>
          Quelle: Yahoo Finance · MSCI World · Stand Juni 2026 · echte Daten</div>
      </Stage>

      {/* C — Ehrlichkeit: nicht jedes Jahr 10% */}
      <Stage inS={T.ehrlich} outS={T.trend}>
        <Line size={56} weight={800}>Aber sei ehrlich zu dir:</Line>
        <Line size={50} color={C.gray} weight={700} style={{ marginTop: 22,
          opacity: prog(f, sec(T.nichtjedes), sec(T.nichtjedes + 0.6)) }}>
          Es gibt nicht jedes Jahr 10 %.</Line>
        <div style={{ display: 'flex', gap: 80, marginTop: 40,
          opacity: prog(f, sec(T.tiefrot), sec(T.tiefrot + 0.6)) }}>
          <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.accent }}>manche stark</div>
          <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.negative }}>manche tiefrot</div>
        </div>
      </Stage>

      {/* D — Trend über Jahrzehnte → nach oben */}
      <Stage inS={T.trend} outS={T.ende} ramp={0.6}>
        <Line size={52} weight={700}>Es geht nicht um ein einzelnes Jahr.</Line>
        <Line size={64} weight={900} style={{ marginTop: 18 }}>
          Sondern um den <span style={{ color: C.blue }}>Trend über 20–30 Jahre</span>.</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 40,
          opacity: prog(f, sec(T.richtung + 1), sec(T.richtung + 1.6)) }}>
          <LottieBox file="lottie/trendauf.json" size={120} loop={false} />
          <span style={{ fontFamily: FONT.title, fontSize: 120, color: C.accent,
            textShadow: `0 0 50px ${a(C.accent, 0.4)}` }}>immer nach oben</span>
        </div>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE05_FRAMES = Math.ceil(68.74 * 30) + 18;
