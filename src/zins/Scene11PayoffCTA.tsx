// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 11 — PAYOFF / CTA  (56,32s · 16:9)
//  Audio: szene-11-payoff-cta.mp3 · Finale: Formel, zukünftiges Ich, Abo-CTA.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, euro,
  Background, Vignette, DramaticNumber, Counter, SubscribeBar, Confetti,
} from '../brand';

const T = {
  fassen: 0, hundert: 2.34, proz: 4.08, jahre: 5.76, reveal: 7.0, eingezahlt: 9.5,
  zeit: 13.0, nicht: 17.5,
  moment: 23.9, schritt: 28.5, geduld: 32.24,
  ich: 33.5, satz: 43.0, heute: 46.0,
  abo: 47.9, naechstes: 53.0, ende: 56.92,
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
const Badge: React.FC<{ children: React.ReactNode; at: number; color?: string } & { f: number }> =
  ({ children, at, color = C.gold, f }) => (
  <div style={{ padding: '14px 34px', borderRadius: 999, background: a(color, 0.14),
    border: `2px solid ${a(color, 0.5)}`, fontFamily: FONT.title, fontSize: 64, color,
    opacity: prog(f, sec(at), sec(at + 0.5)),
    transform: `scale(${lerpF(f, 0.8, 1, sec(at), sec(at + 0.5))})` }}>{children}</div>
);

export const Scene11PayoffCTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-11-payoff-cta.mp3')} />

      {/* A — Zusammenfassung: Formel → 121.000 € */}
      <Stage inS={0} outS={T.moment}>
        <Line size={44} color={C.gray} weight={600} style={{ position: 'absolute', top: 130 }}>
          Fassen wir zusammen:</Line>
        {/* Formel-Badges */}
        <div style={{ display: 'flex', gap: 28, marginTop: -120 }}>
          <Badge at={T.hundert} f={f} color={C.gold}>100 € / Monat</Badge>
          <Badge at={T.proz} f={f} color={C.gold}>7 %</Badge>
          <Badge at={T.jahre} f={f} color={C.blue}>30 Jahre</Badge>
        </div>
        {/* 121.000 Finale */}
        <div style={{ marginTop: 50, opacity: prog(f, sec(T.reveal), sec(T.reveal + 0.4)) }}>
          <DramaticNumber to={121000} from={0} format={(n) => '≈ ' + euro(n)} fontSize={180}
            color={C.accent} startAt={sec(T.reveal)} durationFrames={sec(2.2)} fakeStopAt={0.25} />
        </div>
        <Line size={42} color={C.gray} weight={700} style={{ marginTop: 14,
          opacity: prog(f, sec(T.eingezahlt), sec(T.eingezahlt + 0.6)) }}>
          Eingezahlt hast du nur <span style={{ color: C.white }}>36.000 €</span>.</Line>
        {/* wechselnder Schlusstext */}
        <Line size={50} weight={800} style={{ position: 'absolute', bottom: 150,
          opacity: life(f, sec(T.zeit), sec(T.nicht), sec(0.4)) }}>
          Den ganzen Rest hat die <span style={{ color: C.blue }}>Zeit</span> gemacht.</Line>
        <Line size={46} weight={800} style={{ position: 'absolute', bottom: 150,
          opacity: prog(f, sec(T.nicht), sec(T.nicht + 0.5)) }}>
          Nicht Gehalt. Nicht Glück. Nicht ein Tipp. —
          Nur <span style={{ color: C.accent }}>Geduld</span> & der Zinseszins.</Line>
      </Stage>

      {/* B1 — Du brauchst nur den ersten Schritt */}
      <Stage inS={T.moment} outS={T.ich}>
        <Line size={52} color={C.gray} weight={700}>Du brauchst keinen perfekten Moment.</Line>
        <Line size={52} color={C.gray} weight={700} style={{ marginTop: 10,
          opacity: prog(f, sec(T.moment + 2), sec(T.moment + 2.5)) }}>
          Du brauchst keine 1.000 €.</Line>
        <Line size={68} weight={900} style={{ marginTop: 30,
          opacity: prog(f, sec(T.schritt), sec(T.schritt + 0.5)) }}>
          Nur den <span style={{ color: C.accent }}>ersten Schritt</span>. Und Geduld.</Line>
      </Stage>

      {/* B2 — Dein zukünftiges Ich (Split) → HEUTE */}
      <Stage inS={T.ich} outS={T.abo}>
        <Line size={50} weight={800} style={{ position: 'absolute', top: 130 }}>
          Dein zukünftiges Ich in 30 Jahren denkt entweder:</Line>
        <div style={{ display: 'flex', gap: 60, marginTop: -150 }}>
          {/* gut */}
          <div style={{ width: 700, padding: '40px 44px', borderRadius: 24,
            background: a(C.accent, 0.1), border: `2px solid ${a(C.accent, 0.5)}`,
            opacity: prog(f, sec(T.ich + 1.5), sec(T.ich + 2.1)) }}>
            <div style={{ fontSize: 60 }}>😊</div>
            <Line size={42} weight={800} color={C.accent} style={{ marginTop: 10, textAlign: 'left' }}>
              „Gott sei Dank hab ich angefangen."</Line>
          </div>
          {/* schlecht */}
          <div style={{ width: 700, padding: '40px 44px', borderRadius: 24,
            background: a(C.negative, 0.08), border: `2px solid ${a(C.negative, 0.45)}`,
            opacity: prog(f, sec(T.ich + 4), sec(T.ich + 4.6)) }}>
            <div style={{ fontSize: 60 }}>😔</div>
            <Line size={42} weight={800} color={C.negative} style={{ marginTop: 10, textAlign: 'left' }}>
              „Hätte ich nur früher begonnen."</Line>
          </div>
        </div>
        <Line size={54} weight={900} style={{ position: 'absolute', bottom: 230,
          opacity: prog(f, sec(T.satz), sec(T.satz + 0.5)) }}>
          Welchen Satz du hörst — entscheidest du</Line>
        <div style={{ position: 'absolute', bottom: 90,
          opacity: prog(f, sec(T.heute), sec(T.heute + 0.4)),
          transform: `scale(${lerpF(f, 0.8, 1, sec(T.heute), sec(T.heute + 0.4))})` }}>
          <span style={{ fontFamily: FONT.title, fontSize: 96, color: C.accent,
            textShadow: `0 0 50px ${a(C.accent, 0.5)}` }}>HEUTE.</span>
        </div>
      </Stage>

      {/* C — CTA: Abo + Konfetti */}
      <Stage inS={T.abo} outS={T.ende} ramp={0.5}>
        <Confetti width={1920} height={1080} at={sec(T.abo)} n={70} />
        <Line size={64} weight={900}>Hat dir das geholfen?</Line>
        <Line size={50} weight={700} style={{ marginTop: 16,
          opacity: prog(f, sec(T.abo + 1.5), sec(T.abo + 2)) }}>
          Lass ein <span style={{ color: C.accent }}>Abo</span> da.</Line>
        <Line size={40} color={C.gray} weight={600} style={{ marginTop: 30,
          opacity: prog(f, sec(T.abo + 3), sec(T.abo + 3.6)) }}>
          Jede Woche Finanzwissen, das du wirklich verstehst.</Line>
        <Line size={46} weight={800} color={C.blue} style={{ marginTop: 44,
          opacity: prog(f, sec(T.naechstes), sec(T.naechstes + 0.6)) }}>
          Wir sehen uns im nächsten Video. 👋</Line>
        <SubscribeBar at={sec(T.abo + 1)} dur={sec(7.5)} bottom={150} />
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE11_FRAMES = Math.ceil(56.32 * 30) + 18;
