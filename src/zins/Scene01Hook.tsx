// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 1 — HOOK  (49,1s · 16:9)
//  Experimentelle Longform-Szene ohne fest eingebundenes Produktionsaudio.
//  Build-Look: Clean-Bold, dunkelgrün. Jeder Beat exakt aufs Wort.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, euro,
  Background, Vignette,
  DramaticNumber, Scramble, LottieBox, Shine, Emphasis,
} from '../brand';

// ─── Beat-Zeiten (Sekunden, aus Whisper) ─────────────────────────────────────
const T = {
  pizza: 4.8, konto: 7.4, jahr: 9.7, depot: 13.6,
  reveal: 16.7, num120: 18.2, bruchteil: 20.8,
  negation: 23.6, trick: 24.3, glueck: 25.16, zock: 26.16,
  effekt: 27.6, kennt: 30.0, reicharm: 34.7, reich: 36.18, arm: 38.38,
  mit50: 39.6, zehnmin: 42.5, anders: 45.6, ende: 50.3,  // Audio 49.69s + Nachlauf
};

// kleiner Stage-Wrapper: blendet Inhalt im Fenster [inS,outS] ein/aus
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
    textAlign: 'center', lineHeight: 1.15, maxWidth: 1400, ...style }}>{children}</div>
);

export const Scene01Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />

      {/* A1 — 100 € im Monat */}
      <Stage inS={0} outS={T.pizza}>
        <Line size={52} color={C.gray} weight={600}>Stell dir vor…</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 26 }}>
          <Line size={70}>du legst jeden Monat nur</Line>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 30 }}>
          <LottieBox file="lottie/muenze.json" size={150} loop={false} />
          <span style={{ fontFamily: FONT.title, fontSize: 190, color: C.gold,
            textShadow: `0 0 70px ${a(C.gold, 0.5)}` }}>100&nbsp;€</span>
        </div>
      </Stage>

      {/* A2 — Pizza pro Woche */}
      <Stage inS={T.pizza} outS={T.konto}>
        <div style={{ fontSize: 150 }}>🍕</div>
        <Line size={66} style={{ marginTop: 20 }}>Eine Pizza pro Woche.</Line>
        <Line size={44} color={C.gray} weight={600} style={{ marginTop: 14 }}>Mehr nicht.</Line>
      </Stage>

      {/* A3 — kaum spürbar */}
      <Stage inS={T.konto} outS={T.jahr}>
        <LottieBox file="lottie/geldboerse.json" size={210} loop={false} />
        <Line size={60} style={{ marginTop: 24 }}>Du merkst es kaum<br />auf deinem Konto.</Line>
      </Stage>

      {/* A4 — Monat für Monat, Jahr für Jahr */}
      <Stage inS={T.jahr} outS={T.depot}>
        <LottieBox file="lottie/zeit.json" size={190} loop />
        <Line size={64} style={{ marginTop: 22 }}>Aber du machst es<br />
          <span style={{ color: C.blue }}>jeden Monat. Jahr für Jahr.</span></Line>
      </Stage>

      {/* B — Blick aufs Depot */}
      <Stage inS={T.depot} outS={T.reveal}>
        <Line size={54} color={C.gray} weight={600}>Und irgendwann…</Line>
        <Line size={78} style={{ marginTop: 20 }}>schaust du auf dein Depot.</Line>
      </Stage>

      {/* C — 120.000 € Reveal + Bruchteil  (Höhepunkt) */}
      <Stage inS={T.reveal} outS={T.negation}>
        {(() => {
          // Zahl zählt bis ~num120, danach wandert sie hoch + 36.000 erscheint
          const moved = prog(f, sec(T.bruchteil), sec(T.bruchteil + 0.6));
          const y = lerpF(f, 0, -150, sec(T.bruchteil), sec(T.bruchteil + 0.6));
          const scale = lerpF(f, 1, 0.62, sec(T.bruchteil), sec(T.bruchteil + 0.6));
          return (
            <>
              <div style={{ transform: `translateY(${y}px) scale(${scale})`, position: 'relative' }}>
                <Line size={40} color={C.gray} weight={700} style={{ marginBottom: 8 }}>
                  Auf deinem Depot stehen</Line>
                <Shine at={sec(T.num120)}>
                  <DramaticNumber to={121997} from={0} format={(n) => '≈ ' + euro(n)}
                    fontSize={180} color={C.accent} startAt={sec(T.reveal + 0.3)}
                    durationFrames={sec(2.3)} fakeStopAt={0.25} />
                </Shine>
              </div>
              {/* Bruchteil */}
              <div style={{ marginTop: 30, opacity: moved,
                transform: `translateY(${(1 - moved) * 40}px)` }}>
                <Line size={44} color={C.gray} weight={700}>Eingezahlt hast du nur</Line>
                <div style={{ fontFamily: FONT.title, fontSize: 96, color: C.white,
                  marginTop: 6 }}>36.000&nbsp;€</div>
                <Line size={34} color={a(C.gray, 0.8)} weight={600} style={{ marginTop: 6 }}>
                  …einen Bruchteil davon.</Line>
              </div>
            </>
          );
        })()}
      </Stage>

      {/* D1 — Kein Trick / kein Glück / keine Zockerei  (3 Negationen, rot durchgestrichen) */}
      <Stage inS={T.negation} outS={T.effekt}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          {[['Kein Trick.', T.trick], ['Kein Glück.', T.glueck], ['Keine Zockerei.', T.zock]]
            .map(([txt, t], i) => {
              const ti = t as number;
              const inP = spring({ frame: f - sec(ti), fps, config: { damping: 12, stiffness: 320 } });
              const strike = prog(f, sec(ti + 0.25), sec(ti + 0.6));
              return (
                <div key={i} style={{ position: 'relative', opacity: Math.min(inP * 1.4, 1),
                  transform: `scale(${0.7 + inP * 0.3})` }}>
                  <span style={{ fontFamily: FONT.title, fontSize: 92, color: C.white }}>{txt}</span>
                  <span style={{ position: 'absolute', left: -10, right: -10, top: '52%', height: 7,
                    background: C.negative, width: `${strike * 100}%`, borderRadius: 4,
                    boxShadow: `0 0 14px ${a(C.negative, 0.7)}` }} />
                </div>
              );
            })}
        </div>
      </Stage>

      {/* D2 — Nur EIN Effekt */}
      <Stage inS={T.effekt} outS={T.kennt}>
        <Line size={56} color={C.gray} weight={600}>Nur</Line>
        <Emphasis at={sec(T.effekt + 0.2)}>
          <div style={{ fontFamily: FONT.title, fontSize: 230, color: C.accent, lineHeight: 0.9,
            textShadow: `0 0 80px ${a(C.accent, 0.5)}` }}>1 EFFEKT</div>
        </Emphasis>
      </Stage>

      {/* E1 — kennt / nutzt */}
      <Stage inS={T.kennt} outS={T.reicharm}>
        <Line size={64}>Fast jeder kennt ihn.</Line>
        <Line size={64} color={C.gold} style={{ marginTop: 18 }}>Kaum jemand nutzt ihn.</Line>
      </Stage>

      {/* E2 — reich vs arm (Split) */}
      <Stage inS={T.reicharm} outS={T.mit50}>
        {(() => {
          const pr = spring({ frame: f - sec(T.reich), fps, config: { damping: 13, stiffness: 200 } });
          const pa = spring({ frame: f - sec(T.arm), fps, config: { damping: 13, stiffness: 200 } });
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 70 }}>
              <div style={{ textAlign: 'center', opacity: Math.min(pr * 1.4, 1),
                transform: `translateX(${(1 - pr) * -80}px)` }}>
                <div style={{ fontFamily: FONT.title, fontSize: 150, color: C.accent }}>REICH</div>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 60, fontWeight: 800, color: C.gray,
                opacity: prog(f, sec(T.reich), sec(T.reich + 0.5)) }}>oder</div>
              <div style={{ textAlign: 'center', opacity: Math.min(pa * 1.4, 1),
                transform: `translateX(${(1 - pa) * 80}px)` }}>
                <div style={{ fontFamily: FONT.title, fontSize: 150, color: C.negative }}>ARM</div>
              </div>
            </div>
          );
        })()}
      </Stage>

      {/* F1 — mit 50 */}
      <Stage inS={T.mit50} outS={T.zehnmin}>
        <Line size={62} color={C.gray} weight={700}>Die meisten verstehen ihn</Line>
        <div style={{ fontFamily: FONT.title, fontSize: 130, color: a(C.white, 0.85),
          marginTop: 12 }}>erst mit 50</div>
      </Stage>

      {/* F2 — du in 10 Minuten */}
      <Stage inS={T.zehnmin} outS={T.anders}>
        <Line size={62}>Du verstehst ihn in den nächsten</Line>
        <div style={{ marginTop: 18 }}>
          <Scramble text="10 MINUTEN" at={sec(T.zehnmin + 0.3)} dur={sec(0.9)} size={150} color={C.accent} />
        </div>
      </Stage>

      {/* F3 — danach anders */}
      <Stage inS={T.anders} outS={T.ende} ramp={0.6}>
        <Line size={70}>Und danach…</Line>
        <Line size={70} color={C.accent} style={{ marginTop: 14 }}>
          siehst du dein Geld komplett anders.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

// echte Audio-Dauer 49.69s + 0.6s Nachlauf, damit das letzte Wort ausklingt
export const SCENE01_FRAMES = Math.ceil(49.69 * 30) + 18;
