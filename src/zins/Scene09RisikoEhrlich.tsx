// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 9 — RISIKO EHRLICH  (70,19s · 16:9)
//  Audio: szene-09-risiko-ehrlich.mp3 · Crash-Kurven, Panik vs ruhig (Split).
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, E, sec, prog, lerpF, life, a,
  Background, Vignette,
} from '../brand';

const T = {
  ehrlich: 0, garantie: 5.1, markt: 9.0, faellt: 12.7, weh: 18.6,
  trennt: 24.6, panik: 27.9, ruhig: 32.3,
  krise: 39.6, regeln: 47.1, regel1: 49.6, regel2: 53.8,
  keinrisiko: 59.0, preis: 61.8, hebel: 65.2, schutz: 68.0, ende: 70.79,
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

// Kurve aus normalisierten Punkten [x,y] (y=0 unten, 1 oben), zeichnet bis `draw`
const Curve: React.FC<{ pts: [number, number][]; draw: number; color: string;
  w: number; h: number; box: { l: number; r: number; t: number; b: number };
  strokeW?: number; dashed?: boolean }> = ({ pts, draw, color, w, h, box, strokeW = 7, dashed }) => {
  const tx = (x: number) => box.l + x * (box.r - box.l);
  const ty = (y: number) => box.b - y * (box.b - box.t);
  // interpoliere entlang der Polylinie bis Anteil draw
  const total = pts.length - 1;
  const upto = draw * total;
  const out: string[] = [];
  for (let i = 0; i < pts.length; i++) {
    if (i <= upto) { out.push(`${tx(pts[i][0]).toFixed(1)},${ty(pts[i][1]).toFixed(1)}`); }
    else {
      const prev = pts[i - 1], frac = upto - (i - 1);
      if (frac > 0) {
        const x = prev[0] + (pts[i][0] - prev[0]) * frac;
        const y = prev[1] + (pts[i][1] - prev[1]) * frac;
        out.push(`${tx(x).toFixed(1)},${ty(y).toFixed(1)}`);
      }
      break;
    }
  }
  return (
    <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
      <line x1={box.l} y1={box.b} x2={box.r} y2={box.b} stroke={C.gray} strokeWidth={2} opacity={0.35} />
      {out.length > 1 && (
        <path d={`M ${out.join(' L ')}`} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={dashed ? '16 12' : undefined} strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.6)})` }} />
      )}
    </svg>
  );
};

// Aufwärtskurve mit zwei Crashs (für B + D)
const UPDIPS: [number, number][] = [
  [0, 0.15], [0.12, 0.3], [0.24, 0.45], [0.3, 0.22], [0.4, 0.42],
  [0.55, 0.6], [0.66, 0.32], [0.78, 0.62], [0.9, 0.78], [1, 0.92],
];

export const Scene09RisikoEhrlich: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-09-risiko-ehrlich.mp3')} />

      {/* A — Der ehrliche Teil */}
      <Stage inS={0} outS={T.markt}>
        <Line size={50} color={C.gray} weight={600}>Jetzt der ehrliche Teil,</Line>
        <Line size={64} weight={900} style={{ marginTop: 8 }}>den dir die meisten verschweigen.</Line>
        <Line size={52} color={C.negative} weight={800} style={{ marginTop: 40,
          opacity: prog(f, sec(T.garantie), sec(T.garantie + 0.6)) }}>
          Keine Garantie. Kein schnelles Geld.</Line>
      </Stage>

      {/* B — Crash-Kurve mit −20% / −30% */}
      <Stage inS={T.markt} outS={T.trennt}>
        <Line size={48} weight={800} style={{ position: 'absolute', top: 120 }}>
          Der Markt geht nicht in einer geraden Linie nach oben.</Line>
        <Curve pts={UPDIPS} draw={prog(f, sec(T.markt + 0.5), sec(T.weh))} color={C.accent}
          w={1920} h={1080} box={{ l: 280, r: 1640, t: 340, b: 780 }} />
        {/* Crash-Marker */}
        <div style={{ position: 'absolute', left: 560, top: 560,
          opacity: prog(f, sec(T.faellt), sec(T.faellt + 0.5)) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 60, color: C.negative }}>−20 %</span>
        </div>
        <div style={{ position: 'absolute', left: 1180, top: 500,
          opacity: prog(f, sec(T.faellt + 2), sec(T.faellt + 2.5)) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 60, color: C.negative }}>−30 %</span>
        </div>
        <Line size={44} weight={800} style={{ position: 'absolute', bottom: 120,
          opacity: prog(f, sec(T.weh), sec(T.weh + 0.6)) }}>
          Dein Depot wird tief im Rot stehen. <span style={{ color: C.negative }}>Das tut weh.</span>
          <span style={{ color: C.gray }}> Und gehört dazu.</span></Line>
      </Stage>

      {/* C — Panik vs Ruhig (Split, beide sichtbar) */}
      <Stage inS={T.trennt} outS={T.krise}>
        <Line size={50} weight={800} style={{ position: 'absolute', top: 110 }}>
          In diesen Momenten trennt sich alles.</Line>
        <div style={{ display: 'flex', gap: 80, width: 1700, marginTop: 30 }}>
          {/* Panik */}
          <div style={{ flex: 1, position: 'relative', height: 460,
            opacity: prog(f, sec(T.panik), sec(T.panik + 0.6)) }}>
            <Curve pts={[[0, 0.6], [0.3, 0.7], [0.45, 0.3], [0.6, 0.28], [1, 0.2]]}
              draw={prog(f, sec(T.panik), sec(T.panik + 2.5))} color={C.negative}
              w={780} h={460} box={{ l: 40, r: 740, t: 80, b: 380 }} strokeW={7} />
            <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
              <div style={{ fontFamily: FONT.title, fontSize: 56, color: C.negative }}>PANIK-VERKAUF</div>
              <Line size={32} color={C.gray} weight={700}>macht den Verlust echt</Line>
            </div>
          </div>
          {/* Ruhig */}
          <div style={{ flex: 1, position: 'relative', height: 460,
            opacity: prog(f, sec(T.ruhig), sec(T.ruhig + 0.6)) }}>
            <Curve pts={[[0, 0.6], [0.3, 0.7], [0.45, 0.3], [0.6, 0.45], [0.8, 0.7], [1, 0.92]]}
              draw={prog(f, sec(T.ruhig), sec(T.ruhig + 3))} color={C.accent}
              w={780} h={460} box={{ l: 40, r: 740, t: 80, b: 380 }} strokeW={8} />
            <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
              <div style={{ fontFamily: FONT.title, fontSize: 56, color: C.accent }}>RUHIG BLEIBEN</div>
              <Line size={32} color={C.gray} weight={700}>der Markt erholte sich immer</Line>
            </div>
          </div>
        </div>
      </Stage>

      {/* D — nur eine Delle in der Aufwärtskurve */}
      <Stage inS={T.krise} outS={T.regeln}>
        <Curve pts={UPDIPS} draw={prog(f, sec(T.krise + 0.3), sec(T.regeln - 0.5))} color={C.accent}
          w={1920} h={1080} box={{ l: 280, r: 1640, t: 320, b: 720 }} strokeW={9} />
        <Line size={54} weight={900} style={{ position: 'absolute', bottom: 150 }}>
          Jede Krise war am Ende nur eine <span style={{ color: C.negative }}>Delle</span></Line>
        <Line size={54} weight={900} color={C.accent} style={{ position: 'absolute', bottom: 90 }}>
          in einer langen Aufwärtskurve.</Line>
      </Stage>

      {/* E — Zwei Regeln (nebeneinander) */}
      <Stage inS={T.regeln} outS={T.keinrisiko}>
        <Line size={50} color={C.gray} weight={700} style={{ marginBottom: 44 }}>Zwei einfache Regeln:</Line>
        <div style={{ display: 'flex', gap: 50 }}>
          {[['1', 'Investiere nie Geld,\ndas du in den nächsten Jahren brauchst.', T.regel1],
            ['2', 'Investiere nur,\nwas du wirklich liegen lassen kannst.', T.regel2]].map((r, i) => (
            <div key={i} style={{ width: 640, padding: '40px 44px', borderRadius: 24,
              background: a(C.white, 0.04), border: `1px solid ${a(C.blue, 0.35)}`,
              opacity: prog(f, sec(r[2] as number), sec((r[2] as number) + 0.6)),
              transform: `translateY(${lerpF(f, 40, 0, sec(r[2] as number), sec((r[2] as number) + 0.6))}px)` }}>
              <div style={{ fontFamily: FONT.title, fontSize: 80, color: C.blue }}>{r[0]}</div>
              <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.white,
                whiteSpace: 'pre-line', marginTop: 8 }}>{r[1]}</div>
            </div>
          ))}
        </div>
      </Stage>

      {/* F — Fazit: Zeit = Hebel UND Schutz */}
      <Stage inS={T.keinrisiko} outS={T.ende} ramp={0.6}>
        <Line size={52} weight={700}>Dann sind Schwankungen kein Risiko —</Line>
        <Line size={58} color={C.gold} weight={900} style={{ marginTop: 10,
          opacity: prog(f, sec(T.preis), sec(T.preis + 0.6)) }}>
          sondern der Preis für Wachstum.</Line>
        <Line size={50} weight={800} style={{ marginTop: 50,
          opacity: prog(f, sec(T.hebel), sec(T.hebel + 0.5)) }}>
          Lange Zeit ist dein größter <span style={{ color: C.accent }}>Hebel</span></Line>
        <Line size={64} color={C.blue} weight={900} style={{ marginTop: 10,
          opacity: prog(f, sec(T.schutz), sec(T.schutz + 0.5)) }}>
          …und dein bester Schutz.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE09_FRAMES = Math.ceil(70.19 * 30) + 18;
