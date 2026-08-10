// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 1 — HOOK  (9:16 · 1080×1920)
//  Audio: public/audio/short-01.mp3 (0–34,5s aus Szene 1)  ·  Endcard bis 37s.
//  Captions wortgenau unten, Key-Moments groß mittig.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, euro,
  Background, Vignette, Captions, DigitSlots, KineticPunch, Emphasis, Shine,
  FINANCE_EXAMPLES,
  calculateSavingsPlanFutureValue, calculateTotalContributions,
} from '../design-system';
import {clipCaptionWords, normalizeCaptionData} from '../lib/captions';
import capData from '../../public/captions/szene-01-hook.json';

export const SHORT_HOOK_FRAMES = Math.round(37 * 30);

// Unterstützt FinanzNeo v1 sowie die beiden früheren Whisper-Formate.
const WORDS = clipCaptionWords(normalizeCaptionData(capData), {endAt: 34.5});

// Verbindliche Beispielannahmen aus src/finance/examples.ts.
const EXAMPLE = FINANCE_EXAMPLES.savingsPlan;

const FUTURE_VALUE = Math.round(calculateSavingsPlanFutureValue(EXAMPLE));

const CONTRIBUTIONS = Math.round(calculateTotalContributions({
  contributionPerPeriod: EXAMPLE.contributionPerPeriod,
  years: EXAMPLE.years,
  periodsPerYear: EXAMPLE.periodsPerYear,
}));

// Beat-Zeiten (s)
const T = {
  hundert: 3.34, pizza: 4.8, depot: 13.6, reveal: 16.7, num: 18.2,
  bruchteil: 20.8, negation: 23.6, effekt: 27.6, kennt: 30.0, end: 34.5,
};

const Stage: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties}> = ({a: s, b: e, children, style}) => {
  const f = useCurrentFrame();
  const op = life(f, sec(s), sec(e), 8);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: op, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

export const ShortHook: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-01.mp3')} />

      {/* Top: Marke + Rechtshinweis */}
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center',
        fontFamily: FONT.title, fontSize: 50, opacity: 0.95}}>
        <span style={{color: C.white}}>Finanz</span><span style={{color: C.accent}}>Neo</span>
      </div>
      <div style={{position: 'absolute', top: 132, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: a(C.gray, 0.6)}}>
        KEINE ANLAGEBERATUNG
      </div>

      {/* A · 100 € pro Monat */}
      <Stage a={T.hundert} b={T.depot} style={{marginTop: -120}}>
        <KineticPunch words={[euro(EXAMPLE.contributionPerPeriod)]} at={sec(T.hundert)} size={250} colors={[C.gold]} />
        <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 60, color: C.white, marginTop: 8}}>pro Monat</div>
        <div style={{marginTop: 46, fontFamily: FONT.body, fontWeight: 700, fontSize: 52,
          color: a(C.white, 0.85), opacity: prog(f, sec(T.pizza), sec(T.pizza + 0.5))}}>
          🍕 nur eine Pizza pro Woche
        </div>
      </Stage>

      {/* B · berechneter Endwert */}
      <Stage a={T.reveal} b={T.negation} style={{marginTop: -140}}>
        <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 46, letterSpacing: 2,
          color: C.accentLt, marginBottom: 18}}>NACH {EXAMPLE.years} JAHREN</div>
        <Shine at={sec(T.num)}>
          <DigitSlots value={euro(FUTURE_VALUE)} fontSize={210} color={C.accent} startAt={sec(T.num)} />
        </Shine>
        <div style={{marginTop: 40, fontFamily: FONT.body, fontWeight: 700, fontSize: 44,
          color: a(C.gray, 0.85), opacity: prog(f, sec(T.bruchteil), sec(T.bruchteil + 0.5))}}>
          eingezahlt: {euro(CONTRIBUTIONS)}
        </div>
        <div style={{marginTop: 16, fontFamily: FONT.body, fontWeight: 600, fontSize: 25,
          color: a(C.gray, 0.66), maxWidth: 900, textAlign: 'center'}}>
          {EXAMPLE.disclosure}
        </div>
      </Stage>

      {/* C · Kein Trick / Glück / Zockerei → 1 Effekt */}
      <Stage a={T.negation} b={T.end} style={{marginTop: -120}}>
        {['Kein Trick.', 'Kein Glück.', 'Keine Zockerei.'].map((text, index) => (
          <div key={text} style={{fontFamily: FONT.title, fontSize: 78, color: a(C.negative, 0.9),
            opacity: prog(f, sec(T.negation + index * 0.85), sec(T.negation + index * 0.85 + 0.4)),
            transform: `translateY(${lerpF(f, 16, 0, sec(T.negation + index * 0.85), sec(T.negation + index * 0.85 + 0.4))}px)`}}>
            {text}
          </div>
        ))}
        <div style={{marginTop: 40, opacity: prog(f, sec(T.effekt), sec(T.effekt + 0.4))}}>
          <Emphasis at={sec(T.effekt)}>
            <span style={{fontFamily: FONT.title, fontSize: 110, color: C.accent}}>Nur EIN Effekt</span>
          </Emphasis>
        </div>
        <div style={{marginTop: 24, fontFamily: FONT.body, fontWeight: 700, fontSize: 46,
          color: a(C.white, 0.85), opacity: prog(f, sec(T.kennt), sec(T.kennt + 0.5))}}>
          …den kaum jemand wirklich nutzt
        </div>
      </Stage>

      {/* Endcard */}
      <Stage a={T.end + 0.2} b={99}>
        <div style={{fontFamily: FONT.title, fontSize: 92, color: C.white, textAlign: 'center', lineHeight: 1.05}}>
          Welcher Effekt?
        </div>
        <div style={{fontFamily: FONT.title, fontSize: 130, color: C.accent, marginTop: 10,
          textShadow: `0 0 50px ${a(C.accent, 0.5)}`}}>ZINSESZINS</div>
        <div style={{marginTop: 60, fontFamily: FONT.body, fontWeight: 800, fontSize: 52, color: C.white}}>
          👉 Folge <span style={{color: C.accent}}>@finanz.neo</span>
        </div>
        <div style={{marginTop: 14, fontFamily: FONT.body, fontWeight: 600, fontSize: 38, color: a(C.gray, 0.8)}}>
          das ganze Video auf dem Kanal
        </div>
      </Stage>

      <Captions words={WORDS} perGroup={3} size={68} bottom={300} highlight={C.gold} />

      <Vignette />
    </AbsoluteFill>
  );
};
