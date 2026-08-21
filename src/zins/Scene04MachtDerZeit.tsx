// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 4 — DIE MACHT DER ZEIT  (76,16s · 16:9)
//  Audio: szene-04-macht-der-zeit.mp3 · Kern: 4 Balken explodieren über Jahrzehnte.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, life, a, num,
  Background, Vignette,
} from '../brand';

const T = {
  wichtig: 0, staerker: 3.5, zeig: 8.3, setup: 10.6, schauen: 14.6,
  j10: 16.2, nett: 19.8, j20: 22.2, verrueckt: 27.3, j30: 28.8, j40: 33.3,
  genau: 38.4, sprung: 40.7, jahrzehnt: 46.1, mehrals: 48.3,
  nochmal: 52.3, letzte: 53.7, warum: 57.7, riesig: 59.2, menge: 61.7,
  haertesten: 65.1, schluss: 67.4, frueher: 68.8, ende: 76.76,
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

// ─── ein wachsender Balken mit Betrag oben + Jahr-Label unten ─────────────────
const MAXAMT = 264000, MAXH = 470;
const Bar: React.FC<{ years: string; amount: number; appear: number;
  goldFrom?: number; goldAppear?: number }> = ({ years, amount, appear, goldFrom, goldAppear }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - sec(appear), fps, config: { damping: 15, stiffness: 110 } });
  const h = (amount / MAXAMT) * MAXH * p;
  const W = 210;
  // optionaler Gold-Abschnitt (Zuwachs im letzten Jahrzehnt)
  const goldP = goldAppear !== undefined ? prog(f, sec(goldAppear), sec(goldAppear + 0.8)) : 0;
  const goldH = goldFrom !== undefined ? ((amount - goldFrom) / MAXAMT) * MAXH * p * goldP : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W }}>
      {/* Betrag oben */}
      <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', opacity: Math.min(p * 1.5, 1) }}>
        <span style={{ fontFamily: FONT.title, fontSize: 46,
          color: goldFrom !== undefined && goldP > 0.5 ? C.gold : C.accent }}>
          {num(Math.round(amount * p))} €
        </span>
      </div>
      {/* Balken */}
      <div style={{ width: W, height: h, borderRadius: '10px 10px 0 0', position: 'relative',
        background: `linear-gradient(${a(C.accent, 0.95)}, ${a(C.accent, 0.5)})`,
        boxShadow: `0 0 24px ${a(C.accent, 0.4)}` }}>
        {goldH > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: goldH,
            borderRadius: '10px 10px 0 0',
            background: `linear-gradient(${a(C.gold, 0.95)}, ${a(C.gold, 0.5)})`,
            boxShadow: `0 0 24px ${a(C.gold, 0.5)}` }} />
        )}
      </div>
      {/* Jahr-Label */}
      <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: C.white,
        marginTop: 18, opacity: Math.min(p * 1.5, 1) }}>{years}</div>
    </div>
  );
};

export const Scene04MachtDerZeit: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />

      {/* A — Das Wichtigste: Zeit > Geld */}
      <Stage inS={0} outS={T.setup}>
        <Line size={46} color={C.gray} weight={600}>Das Wichtigste im ganzen Video:</Line>
        <Line size={86} weight={900} style={{ marginTop: 18 }}>
          Zeit ist <span style={{ color: C.blue }}>stärker</span> als Geld.</Line>
        <Line size={50} color={C.gray} weight={700} style={{ marginTop: 16,
          opacity: prog(f, sec(T.staerker + 3), sec(T.staerker + 3.6)) }}>Viel stärker.</Line>
      </Stage>

      {/* B — Setup */}
      <Stage inS={T.setup} outS={T.j10 - 0.3}>
        <Line size={58} weight={700}>Gleiche <span style={{ color: C.gold }}>100 € im Monat</span>.
          <br /><span style={{ color: C.gold }}>7 %</span> pro Jahr.</Line>
        <Line size={46} color={C.gray} weight={600} style={{ marginTop: 20 }}>Schauen wir, wie es wächst…</Line>
      </Stage>

      {/* C — Die 4 Balken explodieren */}
      <Stage inS={T.j10 - 0.3} outS={T.nochmal}>
        <Line size={40} color={C.gray} weight={700} style={{ position: 'absolute', top: 110 }}>
          100 € im Monat · 7 % pro Jahr</Line>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 70, marginTop: 80 }}>
          <Bar years="10 Jahre" amount={17000} appear={T.j10} />
          <Bar years="20 Jahre" amount={52000} appear={T.j20} />
          <Bar years="30 Jahre" amount={121000} appear={T.j30} />
          <Bar years="40 Jahre" amount={264000} appear={T.j40} goldFrom={121000} goldAppear={T.sprung} />
        </div>
        {/* Sprung-Highlight */}
        <div style={{ position: 'absolute', bottom: 90, textAlign: 'center',
          opacity: prog(f, sec(T.sprung), sec(T.sprung + 0.6)) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 60, color: C.gold }}>
            + 140.000 € allein im letzten Jahrzehnt</span>
          <Line size={38} color={a(C.white, 0.85)} weight={700} style={{ marginTop: 8,
            opacity: prog(f, sec(T.mehrals), sec(T.mehrals + 0.6)) }}>
            …mehr als in den ersten 30 Jahren zusammen.</Line>
        </div>
      </Stage>

      {/* E — letzte 10 > erste 30 + warum */}
      <Stage inS={T.nochmal} outS={T.haertesten}>
        <Line size={44} color={C.gray} weight={600}>Lies das nochmal:</Line>
        <Line size={68} weight={900} style={{ marginTop: 20 }}>
          Die letzten <span style={{ color: C.accent }}>10 Jahre</span> bringen mehr</Line>
        <Line size={68} weight={900} style={{ marginTop: 6 }}>
          als die ersten <span style={{ color: C.gray }}>30</span>.</Line>
        <Line size={48} weight={700} color={C.blue} style={{ marginTop: 34,
          opacity: prog(f, sec(T.riesig), sec(T.riesig + 0.6)) }}>
          Weil dein Geld am Ende riesig ist —</Line>
        <Line size={48} weight={700} color={C.blue} style={{ marginTop: 6,
          opacity: prog(f, sec(T.menge), sec(T.menge + 0.6)) }}>
          und 7 % von riesig ist eine Menge.</Line>
      </Stage>

      {/* F — Fazit: früher starten */}
      <Stage inS={T.haertesten} outS={T.ende} ramp={0.6}>
        <Line size={58} weight={800}>Dein Geld arbeitet am härtesten…</Line>
        <Line size={78} color={C.accent} weight={900} style={{ marginTop: 14 }}>ganz zum Schluss.</Line>
        <Line size={46} weight={700} style={{ marginTop: 38,
          opacity: prog(f, sec(T.frueher), sec(T.frueher + 0.6)) }}>
          Darum ist <span style={{ color: C.gold }}>jedes Jahr früher</span> mehr wert</Line>
        <Line size={46} color={C.gray} weight={700} style={{ marginTop: 6,
          opacity: prog(f, sec(T.frueher + 2), sec(T.frueher + 2.6)) }}>
          als jeder Euro, den du später dazulegst.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE04_FRAMES = Math.ceil(76.16 * 30) + 18;
