// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 10 — DEIN ERSTER SCHRITT  (65,28s · 16:9)
//  Audio: szene-10-erster-schritt.mp3 · 3 Schritte, Automatik-Loop, unterhaltsam.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a,
  Background, Vignette, KineticPunch,
} from '../brand';

const T = {
  theorie: 0, konkret: 3.0, nicht: 7.5, anfangen: 12.88, soMachen: 15.0,
  streuen: 17.3, hunderte: 23.38, kosten: 25.82, geheim: 31.38, auto: 32.72,
  gehalt: 39.64, hintergrund: 46.24,
  einrichten: 52.64, geheimnis: 56.44, beratung: 59.52, selbst: 64.56, ende: 65.88,
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

// Schritt-Zeile in der Liste
const StepRow: React.FC<{ n: string; title: string; sub: string; at: number; gold?: boolean } &
  { f: number; fps: number }> = ({ n, title, sub, at, gold, f, fps }) => {
  const p = spring({ frame: f - sec(at), fps, config: { damping: 14, stiffness: 180 } });
  const c = gold ? C.gold : C.accent;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34, width: 1150,
      opacity: Math.min(p * 1.4, 1), transform: `translateX(${(1 - p) * -50}px)` }}>
      <div style={{ width: 92, height: 92, borderRadius: '50%', flexShrink: 0,
        background: a(c, 0.15), border: `2px solid ${a(c, 0.6)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.title, fontSize: 50, color: c }}>{n}</div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 52, color: C.white }}>
          {title} {gold && <span style={{ color: C.gold }}>★</span>}</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 32, color: C.gray }}>{sub}</div>
      </div>
    </div>
  );
};

export const Scene10ErsterSchritt: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Audio src={staticFile('audio/szene-10-erster-schritt.mp3')} />

      {/* A — Genug Theorie → ANFANGEN */}
      <Stage inS={0} outS={T.soMachen}>
        <Line size={48} color={C.gray} weight={600}>Genug Theorie. Was machst du jetzt konkret?</Line>
        <Line size={44} weight={700} style={{ marginTop: 40,
          opacity: prog(f, sec(T.nicht), sec(T.nicht + 0.5)) }}>
          Der erste Schritt ist nicht „die perfekte Aktie finden".</Line>
        <div style={{ marginTop: 26, height: 200, display: 'flex', alignItems: 'center',
          justifyContent: 'center' }}>
          {f >= sec(T.anfangen - 0.3) && (
            <KineticPunch words={['Sondern: ANFANGEN.']} at={sec(T.anfangen)} per={90} size={120}
              colors={[C.accent]} />
          )}
        </div>
      </Stage>

      {/* B — Die 3 Schritte (Liste baut sich auf, bleibt stehen) */}
      <Stage inS={T.soMachen} outS={T.einrichten}>
        <Line size={46} color={C.gray} weight={700} style={{ position: 'absolute', top: 110 }}>
          So machen es die meisten:</Line>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44, marginTop: 40 }}>
          <StepRow n="1" title="Breit gestreut investieren" sub="nicht auf 1 Firma — auf hunderte"
            at={T.streuen} f={f} fps={fps} />
          <StepRow n="2" title="Auf niedrige Kosten achten" sub="erinnerst du dich? Killer #1"
            at={T.kosten} f={f} fps={fps} />
          <StepRow n="3" title="Alles automatisieren" sub="der eine Geheimtrick" at={T.geheim} gold f={f} fps={fps} />
        </div>

        {/* Automatik-Detail (erscheint ab Gehalt, ersetzt Fokus auf Schritt 3) */}
        <div style={{ position: 'absolute', bottom: 90, textAlign: 'center',
          opacity: life(f, sec(T.gehalt), sec(T.einrichten), sec(0.5)) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
            {['Gehalt kommt', 'fester Betrag rein', 'jeden Monat'].map((t, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ fontFamily: FONT.title, fontSize: 50, color: C.gray,
                  opacity: prog(f, sec(T.gehalt + i * 0.6), sec(T.gehalt + i * 0.6 + 0.4)) }}>→</span>}
                <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 40, color: i === 2 ? C.accent : C.white,
                  opacity: prog(f, sec(T.gehalt + i * 0.6), sec(T.gehalt + i * 0.6 + 0.4)) }}>{t}</span>
              </React.Fragment>
            ))}
          </div>
          <Line size={40} color={C.blue} weight={700} style={{ marginTop: 16,
            opacity: prog(f, sec(T.hintergrund), sec(T.hintergrund + 0.6)) }}>
            Der Zinseszins läuft im Hintergrund — du spürst es gar nicht.</Line>
        </div>
      </Stage>

      {/* C — Einrichten · Vergessen · Wachsen + Disclaimer-Hinweis */}
      <Stage inS={T.einrichten} outS={T.ende} ramp={0.6}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[['Einrichten', T.einrichten], ['Vergessen', T.einrichten + 0.8], ['Wachsen lassen', T.einrichten + 1.7]]
            .map(([txt, t], i) => {
              const p = spring({ frame: f - sec(t as number), fps, config: { damping: 11, stiffness: 260 } });
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ fontFamily: FONT.title, fontSize: 60, color: C.gray,
                    opacity: prog(f, sec(t as number), sec((t as number) + 0.3)) }}>·</span>}
                  <span style={{ fontFamily: FONT.title, fontSize: 96, color: C.accent,
                    opacity: Math.min(p * 1.4, 1), transform: `scale(${0.7 + Math.min(p, 1) * 0.3})`,
                    display: 'inline-block' }}>{txt}</span>
                </React.Fragment>
              );
            })}
        </div>
        <Line size={50} weight={800} style={{ marginTop: 40,
          opacity: prog(f, sec(T.geheimnis), sec(T.geheimnis + 0.5)) }}>
          Das ist das ganze Geheimnis.</Line>
        {/* Disclaimer-Hinweis (rechtlich) */}
        <div style={{ position: 'absolute', bottom: 90, textAlign: 'center',
          opacity: prog(f, sec(T.beratung), sec(T.beratung + 0.6)) }}>
          <Line size={34} color={C.gray} weight={600}>
            Das hier ist keine Anlageberatung — nur das Grundprinzip.</Line>
          <Line size={38} color={a(C.white, 0.9)} weight={700} style={{ marginTop: 8,
            opacity: prog(f, sec(T.selbst - 0.5), sec(T.selbst)) }}>
            Welcher Sparplan zu dir passt, entscheidest <span style={{ color: C.accent }}>du selbst</span>.</Line>
        </div>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE10_FRAMES = Math.ceil(65.28 * 30) + 18;
