// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 8 — WIE VIEL REICHT  (57,30s · 16:9)
//  Audio: szene-08-wie-viel-reicht.mp3 · schon 25 €/Monat reichen.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a,
  Background, Vignette,
} from '../brand';

const T = {
  kein: 0, denkfehler: 5.0, vermoegen: 9.0, warten: 13.0, zeit1: 17.36,
  reichen: 17.8, fund: 20.24, kaffee: 24.12, dass: 30.0,
  klein: 34.5, p25: 37.1, p50: 43.1, p100: 45.0, gnaedig: 47.5, zeit2: 52.56, ende: 57.9,
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

// Stufe der 25→50→100 Treppe
const Step: React.FC<{ amount: number; height: number; appear: number; highlight?: boolean }> =
  ({ amount, height, appear, highlight }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - sec(appear), fps, config: { damping: 15, stiffness: 130 } });
  const h = height * p;
  const col = highlight ? C.accent : C.accentDk;  // saubere Hex (a() nie doppelt anwenden)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      alignItems: 'center', width: 230, height: 460, opacity: Math.min(p * 1.5, 1) }}>
      <span style={{ fontFamily: FONT.title, fontSize: highlight ? 76 : 60,
        color: highlight ? C.gold : C.white, marginBottom: 12 }}>{amount} €</span>
      <div style={{ width: 200, height: h, borderRadius: '12px 12px 0 0',
        background: `linear-gradient(${a(col, 0.95)}, ${a(col, 0.45)})`,
        boxShadow: `0 0 24px ${a(col, 0.4)}` }} />
    </div>
  );
};

export const Scene08WieVielReicht: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />

      {/* A — Denkfehler: du brauchst kein Vermögen */}
      <Stage inS={0} outS={T.reichen}>
        <Line size={48} color={C.gray} weight={600}>„Ich hab gerade kein Geld übrig."</Line>
        <Line size={70} color={C.negative} weight={900} style={{ marginTop: 16,
          opacity: prog(f, sec(T.denkfehler), sec(T.denkfehler + 0.5)) }}>
          Der größte Denkfehler.</Line>
        <Line size={58} weight={800} style={{ marginTop: 36,
          opacity: prog(f, sec(T.vermoegen), sec(T.vermoegen + 0.6)) }}>
          Du brauchst kein Vermögen,<br />um eins aufzubauen.</Line>
        <Line size={44} color={C.gray} weight={700} style={{ position: 'absolute', bottom: 200,
          opacity: prog(f, sec(T.warten), sec(T.warten + 0.5)) }}>
          Viele warten auf tausende € — und verlieren das Wertvollste:</Line>
        <div style={{ position: 'absolute', bottom: 110,
          opacity: prog(f, sec(T.zeit1), sec(T.zeit1 + 0.4)),
          transform: `scale(${lerpF(f, 0.8, 1, sec(T.zeit1), sec(T.zeit1 + 0.4))})` }}>
          <span style={{ fontFamily: FONT.title, fontSize: 120, color: C.blue,
            textShadow: `0 0 50px ${a(C.blue, 0.4)}` }}>ZEIT</span>
        </div>
      </Stage>

      {/* B — Schon 25 € reichen + Alltags-Vergleiche nebeneinander */}
      <Stage inS={T.reichen} outS={T.klein}>
        <Line size={50} weight={700}>Schon</Line>
        <div style={{ fontFamily: FONT.title, fontSize: 200, color: C.gold, lineHeight: 1,
          textShadow: `0 0 60px ${a(C.gold, 0.4)}`,
          transform: `scale(${lerpF(f, 0.85, 1, sec(T.fund), sec(T.fund + 0.5))})` }}>25 €</div>
        <Line size={50} weight={700} style={{ marginTop: 4 }}>im Monat reichen.</Line>
        {/* zwei Alltags-Karten nebeneinander */}
        <div style={{ display: 'flex', gap: 50, marginTop: 44,
          opacity: prog(f, sec(T.kaffee), sec(T.kaffee + 0.6)) }}>
          {[['☕', '1 Kaffee weniger', 'pro Woche'], ['🍔', '1 Lieferessen', 'gespart']].map((c, i) => (
            <div key={i} style={{ width: 420, padding: '26px 30px', borderRadius: 20,
              background: a(C.white, 0.04), border: `1px solid ${a(C.white, 0.12)}`,
              display: 'flex', alignItems: 'center', gap: 24,
              opacity: prog(f, sec(T.kaffee + i * 0.5), sec(T.kaffee + i * 0.5 + 0.5)) }}>
              <span style={{ fontSize: 70 }}>{c[0]}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 36, color: C.white }}>{c[1]}</div>
                <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 28, color: C.gray }}>{c[2]}</div>
              </div>
            </div>
          ))}
        </div>
        <Line size={46} weight={800} style={{ position: 'absolute', bottom: 90,
          opacity: prog(f, sec(T.dass), sec(T.dass + 0.6)) }}>
          Nicht wie <span style={{ color: C.gray }}>groß</span> du startest —
          sondern <span style={{ color: C.accent }}>DASS</span> du startest.</Line>
      </Stage>

      {/* C — 25 → 50 → 100 Treppe + Zinseszins gnädig */}
      <Stage inS={T.klein} outS={T.ende} ramp={0.6}>
        <Line size={48} weight={800} style={{ position: 'absolute', top: 130 }}>
          Klein anfangen — später erhöhen:</Line>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 70, marginTop: 60 }}>
          <Step amount={25} height={140} appear={T.p25} />
          <Step amount={50} height={250} appear={T.p50} />
          <Step amount={100} height={380} appear={T.p100} highlight />
        </div>
        <div style={{ position: 'absolute', bottom: 110, textAlign: 'center',
          opacity: prog(f, sec(T.zeit2 - 1), sec(T.zeit2 - 0.4)) }}>
          <Line size={46} weight={800}>Der Zinseszins will nur eins von dir:</Line>
          <Line size={64} color={C.blue} weight={900} style={{ marginTop: 8,
            opacity: prog(f, sec(T.zeit2), sec(T.zeit2 + 0.4)) }}>ZEIT.</Line>
        </div>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE08_FRAMES = Math.ceil(57.30 * 30) + 18;
