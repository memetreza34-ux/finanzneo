// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SZENE 7 — DER GRÖSSTE FEHLER (Anna vs Tom)  (77,35s · 16:9)
//  Audio: szene-07-groesster-fehler.mp3 · Split-Layout: beide durchgehend sichtbar.
//  Zahlen verifiziert (7% p.a.): Anna 12.000€→≈185.000€, Tom 42.000€→≈180.000€.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  C, FONT, sec, prog, life, a,
  Background, Vignette, Counter,
} from '../brand';

const T = {
  fehler: 0, warten: 6.5, brand: 16.48,
  anna: 20.3, anna30: 26.98, anna12k: 30.0,
  tom: 34.0, tom65: 43.66, tom42k: 45.5, dreimal: 48.16,
  frage: 50.3, denkst: 54.3, falsch: 56.98, vorne: 57.94, weniger: 61.0,
  fruehe: 65.0, besttag: 71.0, heute: 76.66, ende: 77.95,
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

// eine Vergleichs-Spalte (Anna / Tom) — füllt ihre Hälfte
const Column: React.FC<{
  name: string; sub: string; einzahlung: string; endwert: number;
  appear: number; einzahlAt: number; revealAt: number;
  accent: string; winner?: boolean;
}> = ({ name, sub, einzahlung, endwert, appear, einzahlAt, revealAt, accent, winner }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - sec(appear), fps, config: { damping: 14, stiffness: 160 } });
  const dim = p < 0.5 ? 0.25 : 1; // vor "appear" gedimmt als Platzhalter
  return (
    <div style={{ flex: 1, textAlign: 'center', opacity: Math.max(dim, Math.min(p * 1.4, 1)) }}>
      <div style={{ fontFamily: FONT.title, fontSize: 120, color: accent }}>{name}</div>
      <Line size={38} color={C.gray} weight={700} style={{ marginTop: 6 }}>{sub}</Line>
      {/* eingezahlt */}
      <div style={{ marginTop: 50, opacity: prog(f, sec(einzahlAt), sec(einzahlAt + 0.6)) }}>
        <Line size={32} color={C.gray} weight={700}>eingezahlt</Line>
        <div style={{ fontFamily: FONT.title, fontSize: 84, color: C.gold, marginTop: 2 }}>{einzahlung}</div>
      </div>
      {/* Endwert (Reveal) */}
      <div style={{ marginTop: 44, opacity: prog(f, sec(revealAt), sec(revealAt + 0.6)) }}>
        <Line size={32} color={C.gray} weight={700}>mit 65 Jahren</Line>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12 }}>
          <Counter from={0} to={endwert} start={sec(revealAt)} end={sec(revealAt + 1.8)} suffix=" €"
            size={104} color={accent}
            style={winner ? { textShadow: `0 0 50px ${a(accent, 0.5)}` } : undefined} />
          {winner && <span style={{ fontSize: 70 }}>👑</span>}
        </div>
      </div>
    </div>
  );
};

export const Scene07GroessterFehler: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />

      {/* A — Der größte Fehler: WARTEN */}
      <Stage inS={0} outS={T.anna}>
        <Line size={46} color={C.gray} weight={600}>Der größte Fehler von allen:</Line>
        <Line size={160} color={C.negative} weight={900} style={{ marginTop: 6 }}>WARTEN</Line>
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10,
          opacity: life(f, sec(T.warten + 1), sec(T.brand), sec(0.5)) }}>
          {['„…wenn ich mehr verdiene."', '„…nächstes Jahr."', '„…erst muss ich mich einlesen."']
            .map((txt, i) => (
            <Line key={i} size={40} color={a(C.white, 0.7)} weight={600}
              style={{ opacity: prog(f, sec(T.warten + 1 + i * 1.5), sec(T.warten + 1.6 + i * 1.5)) }}>
              {txt}</Line>
          ))}
        </div>
        <Line size={50} color={C.negative} weight={800} style={{ position: 'absolute', bottom: 160,
          opacity: prog(f, sec(T.brand), sec(T.brand + 0.6)) }}>
          Klingt vernünftig — ist aber brandgefährlich.</Line>
      </Stage>

      {/* B+C+D — SPLIT: Anna links, Tom rechts, beide durchgehend */}
      <Stage inS={T.anna} outS={T.fruehe}>
        {/* Titel oben */}
        <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center' }}>
          <Line size={54} weight={800} style={{
            opacity: prog(f, sec(T.frage), sec(T.frage + 0.5)) }}>Wer hat mit 65 mehr?</Line>
        </div>

        {/* zwei Spalten + Mittellinie */}
        <div style={{ display: 'flex', alignItems: 'flex-start', width: 1680, marginTop: 40 }}>
          <Column name="ANNA" sub="startet mit 20 · zahlt nur 10 Jahre"
            einzahlung="12.000 €" endwert={185000}
            appear={T.anna} einzahlAt={T.anna12k} revealAt={T.vorne + 0.4}
            accent={C.accent} winner />
          <div style={{ width: 2, alignSelf: 'stretch', minHeight: 620,
            background: a(C.gray, 0.25), margin: '0 20px' }} />
          <Column name="TOM" sub="startet mit 30 · zahlt 35 Jahre durch"
            einzahlung="42.000 €" endwert={180000}
            appear={T.tom} einzahlAt={T.tom42k} revealAt={T.vorne + 0.4}
            accent={a(C.white, 0.7)} />
        </div>

        {/* "3× so viel" (während Einzahlungs-Phase, vor Auflösung) */}
        <Line size={40} color={C.gold} weight={800} style={{ position: 'absolute', bottom: 150,
          opacity: life(f, sec(T.dreimal), sec(T.frage), sec(0.4)) }}>
          Tom zahlt 3× so viel ein wie Anna.</Line>

        {/* "Du denkst Tom → FALSCH" kurz vor der Auflösung */}
        <Line size={56} color={C.negative} weight={900} style={{ position: 'absolute', bottom: 150,
          opacity: life(f, sec(T.falsch), sec(T.vorne + 0.5), sec(0.25)) }}>
          „Natürlich Tom!" … FALSCH.</Line>

        {/* Pointe nach der Auflösung */}
        <Line size={44} weight={800} color={C.gold} style={{ position: 'absolute', bottom: 90,
          opacity: prog(f, sec(T.weniger), sec(T.weniger + 0.6)) }}>
          Anna gewinnt — mit 30.000 € weniger eingezahlt.</Line>
      </Stage>

      {/* E — frühe Jahre + bester Tag */}
      <Stage inS={T.fruehe} outS={T.ende} ramp={0.6}>
        <Line size={52} weight={700}>Annas frühe Jahre hatten am längsten Zeit.</Line>
        <Line size={52} color={C.gray} weight={700} style={{ marginTop: 10 }}>
          Die holt Tom nie wieder auf.</Line>
        <Line size={46} weight={700} style={{ marginTop: 50,
          opacity: prog(f, sec(T.besttag), sec(T.besttag + 0.6)) }}>
          Der beste Tag zu starten war <span style={{ color: C.gray }}>vor 10 Jahren</span>.</Line>
        <Line size={76} color={C.accent} weight={900} style={{ marginTop: 14,
          opacity: prog(f, sec(T.heute - 0.6), sec(T.heute)) }}>
          Der zweitbeste ist HEUTE.</Line>
      </Stage>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE07_FRAMES = Math.ceil(77.35 * 30) + 18;
