// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 6 — DIE 3 ZINSESZINS-KILLER  (77,53s · 16:9)
//  Audio: szene-06-zinseszins-killer.mp3 · jeder Killer = eigene Animation.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, E, sec, prog, lerpF, life, a, euro,
  Background, Vignette, Counter, LottieBox,
} from '../brand';

const T = {
  intro: 0, fressen: 4.9,
  k1: 8.6, fonds: 14.0, fondsB: 15.9, wen: 21.1, kostet: 24.9, frisst: 31.3, guenstig: 35.8,
  k2: 41.2, panik: 44.5, toetet: 48.0,
  k3: 54.1, raus: 57.0, jederEuro: 61.4,
  merk: 66.9, vermeidet: 72.0, ende: 78.13,
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

// Killer-Header: große rote Nummer + Name
const KillerHead: React.FC<{ n: number; name: string; at: number }> = ({ n, name, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - sec(at), fps, config: { damping: 12, stiffness: 220 } });
  return (
    <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center',
      opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * -30}px)` }}>
      <span style={{ fontFamily: FONT.body, fontSize: 34, fontWeight: 800, color: C.negative,
        letterSpacing: 3 }}>KILLER #{n}</span>
      <div style={{ fontFamily: FONT.title, fontSize: 84, color: C.white, marginTop: 4 }}>{name}</div>
    </div>
  );
};

// Crash-Kurve für Killer 2: hoch → Crash → Panik-Verkauf → verpasste Erholung
const CrashChart: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const W = 1920, b = { left: 360, right: 1560, top: 420, bottom: 760 };
  const cw = b.right - b.left, ch = b.bottom - b.top;
  const draw = prog(f, sec(at), sec(at + 6), E.inOut);
  // Verlauf: steigt, crasht bei x=0.5, erholt sich danach
  const fn = (x: number) => {
    if (x < 0.45) return 0.35 + x * 0.9;             // Anstieg
    if (x < 0.6) return 0.755 - (x - 0.45) * 3.0;    // Crash
    return 0.305 + (x - 0.6) * 1.7;                  // Erholung
  };
  const tx = (x: number) => b.left + x * cw;
  const ty = (v: number) => b.bottom - v * ch;
  const crashX = 0.6;
  const solidEnd = Math.min(draw, crashX);
  const dashStart = crashX;
  const mk = (from: number, to: number) => {
    const pts: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = from + (to - from) * (i / steps);
      if (x > draw) break;
      pts.push(`${tx(x).toFixed(1)},${ty(fn(x)).toFixed(1)}`);
    }
    return pts.length ? `M ${pts.join(' L ')}` : '';
  };
  const panikVisible = draw >= crashX;
  return (
    <svg width={W} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <line x1={b.left} y1={b.bottom} x2={b.right} y2={b.bottom} stroke={C.gray} strokeWidth={2} opacity={0.4} />
      {/* solider Teil bis Crash (weiß→rot) */}
      <path d={mk(0, Math.min(draw, crashX))} fill="none" stroke={C.negative} strokeWidth={9}
        style={{ filter: `drop-shadow(0 0 10px ${a(C.negative, 0.6)})` }} />
      {/* gestrichelte verpasste Erholung (grün) */}
      {draw > crashX && (
        <path d={mk(crashX, 1)} fill="none" stroke={C.accent} strokeWidth={8} strokeDasharray="16 12"
          opacity={0.9} style={{ filter: `drop-shadow(0 0 10px ${a(C.accent, 0.5)})` }} />
      )}
      {/* Panik-Verkauf-Marker am Tiefpunkt */}
      {panikVisible && (
        <g opacity={prog(f, sec(at + 3), sec(at + 3.6))}>
          <circle cx={tx(crashX)} cy={ty(fn(crashX))} r={14} fill={C.negative} />
          <text x={tx(crashX)} y={ty(fn(crashX)) + 56} textAnchor="middle" fill={C.negative}
            fontSize={34} fontWeight={800} fontFamily={FONT.body}>PANIK-VERKAUF</text>
        </g>
      )}
      {/* Label verpasste Erholung */}
      {draw > 0.92 && (
        <text x={tx(1)} y={ty(fn(1)) - 24} textAnchor="end" fill={C.accent} fontSize={32}
          fontFamily={FONT.body} fontWeight={700} opacity={prog(f, sec(at + 5), sec(at + 5.6))}>
          …die Erholung verpasst</text>
      )}
    </svg>
  );
};

export const Scene06Killer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-06-zinseszins-killer.mp3')} />

      {/* A — Intro: 3 heimliche Feinde */}
      <Stage inS={0} outS={T.k1}>
        <LottieBox file="lottie/warnung.json" size={150} loop={false} />
        <Line size={50} color={C.gray} weight={600} style={{ marginTop: 16 }}>Aber Achtung — der Zinseszins hat</Line>
        <Line size={96} color={C.negative} weight={900} style={{ marginTop: 10 }}>3 heimliche Feinde</Line>
        <Line size={42} color={a(C.white, 0.85)} weight={700} style={{ marginTop: 18,
          opacity: prog(f, sec(T.fressen), sec(T.fressen + 0.6)) }}>
          Sie fressen dein Vermögen — ohne dass du es merkst.</Line>
      </Stage>

      {/* B — Killer 1: Hohe Gebühren */}
      <Stage inS={T.k1} outS={T.k2}>
        <KillerHead n={1} name="HOHE GEBÜHREN" at={T.k1} />
        {/* zwei Fonds */}
        <div style={{ display: 'flex', gap: 120, marginTop: 40,
          opacity: life(f, sec(T.fonds), sec(T.kostet), sec(0.5)) }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.title, fontSize: 110, color: C.accent }}>0,2 %</div>
            <Line size={32} color={C.gray} weight={700}>günstiger Fonds</Line>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.title, fontSize: 110, color: C.negative,
              opacity: prog(f, sec(T.fondsB), sec(T.fondsB + 0.5)) }}>1,8 %</div>
            <Line size={32} color={C.gray} weight={700}>teurer Fonds</Line>
          </div>
        </div>
        <Line size={40} color={C.gray} weight={600} style={{ marginTop: 30,
          opacity: life(f, sec(T.wen), sec(T.kostet), sec(0.4)) }}>
          „Nur 1,6 % Unterschied — wen interessiert das?"</Line>

        {/* Der Schock: über 30 Jahre */}
        <div style={{ position: 'absolute', top: 360, display: 'flex', gap: 100, alignItems: 'flex-end',
          opacity: prog(f, sec(T.kostet), sec(T.kostet + 0.6)) }}>
          <div style={{ textAlign: 'center' }}>
            <Counter from={0} to={117000} start={sec(T.kostet)} end={sec(T.kostet + 1.4)} suffix=" €"
              size={96} color={C.accent} />
            <Line size={30} color={C.gray} weight={700} style={{ marginTop: 6 }}>mit 0,2 %</Line>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Counter from={0} to={86000} start={sec(T.kostet)} end={sec(T.kostet + 1.4)} suffix=" €"
              size={96} color={C.negative} />
            <Line size={30} color={C.gray} weight={700} style={{ marginTop: 6 }}>mit 1,8 %</Line>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 150, textAlign: 'center',
          opacity: prog(f, sec(T.frisst), sec(T.frisst + 0.6)) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 72, color: C.gold }}>≈ 31.000 € weg</span>
          <Line size={40} weight={800} color={a(C.white, 0.9)} style={{ marginTop: 10,
            opacity: prog(f, sec(T.guenstig), sec(T.guenstig + 0.6)) }}>
            Günstig schlägt teuer.</Line>
        </div>
      </Stage>

      {/* C — Killer 2: Zu früh verkaufen (Crash-Kurve) */}
      <Stage inS={T.k2} outS={T.k3}>
        <KillerHead n={2} name="ZU FRÜH VERKAUFEN" at={T.k2} />
        <CrashChart at={T.panik} />
        <div style={{ position: 'absolute', bottom: 130, textAlign: 'center',
          opacity: prog(f, sec(T.toetet), sec(T.toetet + 0.6)) }}>
          <Line size={44} weight={800}>Du tötest den Zinseszins genau dann,</Line>
          <Line size={44} color={C.negative} weight={900} style={{ marginTop: 6 }}>
            wenn er am meisten für dich arbeiten würde.</Line>
        </div>
      </Stage>

      {/* D — Killer 3: Das Geld anfassen */}
      <Stage inS={T.k3} outS={T.merk}>
        <KillerHead n={3} name="DAS GELD ANFASSEN" at={T.k3} />
        <Line size={44} color={C.gray} weight={600} style={{ marginTop: 30 }}>
          Zwischendurch was rausnehmen — fürs Handy, für Urlaub…</Line>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 50,
          opacity: prog(f, sec(T.jederEuro), sec(T.jederEuro + 0.6)) }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>1 € heute</div>
            <Line size={30} color={C.gray} weight={700}>rausgenommen</Line>
          </div>
          <div style={{ fontFamily: FONT.title, fontSize: 70, color: C.gray }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.negative }}>7,61 € weg</div>
            <Line size={30} color={C.gray} weight={700}>in 30 Jahren</Line>
          </div>
        </div>
        <Line size={38} color={a(C.white, 0.85)} weight={700} style={{ marginTop: 40,
          opacity: prog(f, sec(T.jederEuro + 2.5), sec(T.jederEuro + 3.1)) }}>
          Jeder Euro nimmt alle Zinsen mit, die er noch gebracht hätte.</Line>
      </Stage>

      {/* E — Fazit: 3 Regeln */}
      <Stage inS={T.merk} outS={T.ende} ramp={0.6}>
        <Line size={46} color={C.gray} weight={600} style={{ marginBottom: 36 }}>Merk dir einfach:</Line>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start' }}>
          {[['Niedrige Kosten', 0], ['Ruhig bleiben', 0.5], ['Liegen lassen', 1.0]].map(([txt, d], i) => {
            const p = spring({ frame: f - sec(T.merk + 0.6 + (d as number)), fps, config: { damping: 14, stiffness: 200 } });
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22,
                opacity: Math.min(p * 1.4, 1), transform: `translateX(${(1 - p) * -40}px)` }}>
                <span style={{ fontFamily: FONT.title, fontSize: 64, color: C.accent }}>✓</span>
                <span style={{ fontFamily: FONT.title, fontSize: 76, color: C.white }}>{txt}</span>
              </div>
            );
          })}
        </div>
        <Line size={40} color={a(C.white, 0.9)} weight={700} style={{ marginTop: 46,
          opacity: prog(f, sec(T.vermeidet), sec(T.vermeidet + 0.6)) }}>
          Wer diese 3 Fehler vermeidet, hat schon mehr richtig gemacht als die meisten.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE06_FRAMES = Math.ceil(77.53 * 30) + 18;
