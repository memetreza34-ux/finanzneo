// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 2 — WAS IST ZINSESZINS  (82,2s · 16:9)
//  Audio: szene-02-zinseszins.mp3 · Beats aus Whisper.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, euro,
  Background, Vignette, GrowthChart, Counter, FlipIn3D, LottieBox, Emphasis,
} from '../brand';

const T = {
  name: 0, wort: 2.82, anlegen: 11.0, zinsen1: 16.48,
  trick: 18.7, auf1: 22.94, auf2: 28.96, selber: 33.5,
  zahlen: 38.4, tausend: 41.9, proz7: 43.24, plus70: 46.18, gleich1070: 48.86,
  jahr2: 50.4, proz7b: 54.3, basis: 57.8,
  schnee: 62.2, winzig: 66.4, gr1: 70.1, lawine: 73.0,
  fazit: 74.9, langsam: 78.7, explosiv: 80.48, ende: 82.78,
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

// eine Hierarchie-Zeile ("+ Zinsen auf …") die einrückt + grün glüht
const StackRow: React.FC<{ at: number; indent: number; text: string; strong?: boolean }> =
  ({ at, indent, text, strong }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - sec(at), fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div style={{ marginLeft: indent, opacity: Math.min(p * 1.4, 1),
      transform: `translateX(${(1 - p) * -50}px)`, display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontFamily: FONT.title, fontSize: strong ? 64 : 52,
        color: strong ? C.accent : a(C.accent, 0.55 + indent / 400) }}>+</span>
      <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: strong ? 60 : 50,
        color: strong ? C.white : a(C.white, 0.9) }}>{text}</span>
    </div>
  );
};

export const Scene02Zinseszins: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-02-zinseszins.mp3')} />

      {/* A — Begriff ZINSESZINS */}
      <Stage inS={0} outS={T.anlegen}>
        <Line size={50} color={C.gray} weight={600}>Das Ganze hat einen Namen:</Line>
        <div style={{ marginTop: 26 }}>
          <FlipIn3D text="ZINSESZINS" at={sec(T.wort)} size={170} color={C.accent} />
        </div>
        <Line size={46} weight={700} style={{ marginTop: 30, opacity: prog(f, sec(6.5), sec(8)) }}>
          Das <span style={{ color: C.gold }}>Stärkste</span>, was dein Geld je tun kann.</Line>
      </Stage>

      {/* B — Geld → Zinsen (einfach) */}
      <Stage inS={T.anlegen} outS={T.trick}>
        <Line size={44} color={C.gray} weight={600}>Ganz einfach:</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 30 }}>
          <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>Dein Geld</div>
          <div style={{ fontFamily: FONT.title, fontSize: 70, color: C.gray,
            opacity: prog(f, sec(14), sec(15)) }}>→</div>
          <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.accent,
            opacity: prog(f, sec(T.zinsen1), sec(T.zinsen1 + 0.6)),
            transform: `scale(${lerpF(f, 0.7, 1, sec(T.zinsen1), sec(T.zinsen1 + 0.6))})` }}>+ Zinsen</div>
        </div>
      </Stage>

      {/* C+D — Der Trick: Zinsen auf Zinsen (Hierarchie) */}
      <Stage inS={T.trick} outS={T.zahlen}>
        <Line size={48} color={C.gold} weight={800} style={{ marginBottom: 36 }}>Aber jetzt kommt der Trick:</Line>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start' }}>
          <StackRow at={T.trick + 1} indent={0} text="Zinsen auf dein Geld" />
          <StackRow at={T.auf1} indent={70} text="Zinsen auf deine Zinsen" />
          <StackRow at={T.auf2} indent={140} text="Zinsen auf die Zinsen deiner Zinsen" />
        </div>
        <div style={{ marginTop: 44, opacity: prog(f, sec(T.selber), sec(T.selber + 0.6)),
          transform: `scale(${lerpF(f, 0.85, 1, sec(T.selber), sec(T.selber + 0.6))})` }}>
          <Line size={64} color={C.accent} weight={900}>Dein Geld macht selber Geld.</Line>
        </div>
      </Stage>

      {/* E — Jahr-1-Rechnung: 1000 → +70 → 1070 */}
      <Stage inS={T.zahlen} outS={T.jahr2}>
        <Line size={44} color={C.gray} weight={600} style={{ marginBottom: 30 }}>Mit echten Zahlen:</Line>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* 1000 € */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <Counter from={0} to={1000} start={sec(T.tausend)} end={sec(T.tausend + 1)} suffix=" €"
              size={120} color={C.white} />
          </div>
          {/* + 7% */}
          <div style={{ fontFamily: FONT.title, fontSize: 64, color: C.gold,
            opacity: prog(f, sec(T.proz7), sec(T.proz7 + 0.5)) }}>7 % pro Jahr</div>
          {/* + 70 € */}
          <div style={{ fontFamily: FONT.title, fontSize: 70, color: C.accent,
            opacity: prog(f, sec(T.plus70), sec(T.plus70 + 0.5)),
            transform: `translateY(${lerpF(f, 20, 0, sec(T.plus70), sec(T.plus70 + 0.5))}px)` }}>
            + 70 €</div>
          {/* Trennlinie */}
          <div style={{ width: 320, height: 3, background: a(C.gray, 0.4), margin: '6px 0',
            opacity: prog(f, sec(T.gleich1070 - 0.3), sec(T.gleich1070)) }} />
          {/* = 1070 € */}
          <div style={{ opacity: prog(f, sec(T.gleich1070), sec(T.gleich1070 + 0.4)) }}>
            <Counter from={1000} to={1070} start={sec(T.gleich1070)} end={sec(T.gleich1070 + 1)} suffix=" €"
              size={130} color={C.accent} />
          </div>
        </div>
      </Stage>

      {/* F — Jahr 2: 7% auf 1070 (Basis wächst) */}
      <Stage inS={T.jahr2} outS={T.schnee}>
        <Line size={52} weight={800}>Im zweiten Jahr:</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 26 }}>
          <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.gold }}>7 %</span>
          <span style={{ fontFamily: FONT.body, fontSize: 50, fontWeight: 700, color: C.gray }}>auf</span>
          <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>1.070 €</span>
        </div>
        <Line size={44} color={C.gray} weight={700} style={{ marginTop: 18,
          opacity: prog(f, sec(T.basis - 1), sec(T.basis)) }}>
          nicht mehr auf 1.000 €</Line>
        <div style={{ marginTop: 30, opacity: prog(f, sec(T.basis), sec(T.basis + 0.6)) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 78, color: C.accent }}>+ 74,90 €</span>
          <Line size={40} color={a(C.white, 0.85)} weight={700} style={{ marginTop: 8 }}>
            Die Basis wächst jedes Jahr mit.</Line>
        </div>
      </Stage>

      {/* G — Schneeball → Lawine (wachsender Kreis) */}
      <Stage inS={T.schnee} outS={T.fazit}>
        {(() => {
          // Kreis wächst von winzig → riesig
          const size = interpolate(f, [sec(T.schnee), sec(T.winzig), sec(T.gr1), sec(T.lawine)],
            [0, 60, 240, 560], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isLawine = f >= sec(T.lawine);
          const col = isLawine ? C.accent : C.white;
          return (
            <>
              <div style={{ width: size, height: size, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 30%, ${a(col, 0.95)}, ${a(col, 0.5)})`,
                boxShadow: `0 0 ${size / 4}px ${a(col, 0.6)}`, transition: 'none' }} />
              <Line size={70} color={col} weight={900} style={{ position: 'absolute', bottom: 180 }}>
                {isLawine ? 'Eine Lawine.' : 'Ein Schneeball…'}
              </Line>
            </>
          );
        })()}
      </Stage>

      {/* H — Zinseszins-Kurve: langsam → explosiv */}
      <Stage inS={T.fazit} outS={T.ende} ramp={0.6}>
        <Line size={56} weight={800} style={{ position: 'absolute', top: 150 }}>
          So wächst dein Vermögen:</Line>
        <GrowthChart width={1920} height={1080}
          box={{ left: 280, right: 1640, top: 380, bottom: 820 }}
          maxX={30} maxY={120000}
          drawStart={sec(T.fazit + 0.5)} drawEnd={sec(T.explosiv + 0.8)}
          xLabels={[{ x: 0, label: 'Start' }, { x: 30, label: '30 Jahre' }]}
          color={C.accent} />
        <div style={{ position: 'absolute', bottom: 130, display: 'flex', gap: 60 }}>
          <span style={{ fontFamily: FONT.body, fontSize: 42, fontWeight: 800, color: C.gray,
            opacity: prog(f, sec(T.langsam), sec(T.langsam + 0.5)) }}>langsam am Anfang…</span>
          <span style={{ fontFamily: FONT.body, fontSize: 42, fontWeight: 800, color: C.accent,
            opacity: prog(f, sec(T.explosiv), sec(T.explosiv + 0.5)) }}>explosiv am Ende.</span>
        </div>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE02_FRAMES = Math.ceil(82.18 * 30) + 18;
