// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 3 — SPARBUCH vs ETF (Lisa vs Max)  (9:16 · 1080×1920)
//  Audio: public/audio/short-03.mp3 (Szene 3, 0–58,6s)  ·  kein Untertitel.
//  Pointe: „Unterschied: über 85.000 €".
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, euro, Background, Vignette, DigitSlots, Shine } from '../brand';

export const SHORT_SPARBUCH_FRAMES = Math.round(59 * 30);

const T = {
  lisaIn: 3.6, both100: 7.16, both30: 10.46, lisaArt: 14.66, lisaEnd: 25.02, lisaNote: 27.6,
  maxIn: 32.26, maxPaid: 40.4, maxEnd: 44.84, diff: 56.6,
};
const fade = (f: number, at: number, d = 0.45) => prog(f, sec(at), sec(at + d));
const rise = (f: number, at: number, d = 0.45) => lerpF(f, 18, 0, sec(at), sec(at + d));

const Panel: React.FC<{
  emoji: string; name: string; color: string; tag: string; tagAt: number;
  inAt: number; paid: string; paidAt: number; endValue: number; endAt: number; winner?: boolean;
}> = ({ emoji, name, color, tag, tagAt, inAt, paid, paidAt, endValue, endAt, winner }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(inAt), sec(99), 8);
  if (op <= 0) return null;
  return (
    <div style={{ opacity: op, width: 940, padding: '32px 40px', borderRadius: 28,
      background: a(color, 0.08), border: `2px solid ${a(color, winner ? 0.7 : 0.4)}`,
      boxShadow: winner && f > sec(endAt) ? `0 0 50px ${a(color, 0.35)}` : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: fade(f, inAt),
        transform: `translateY(${rise(f, inAt)}px)` }}>
        <span style={{ fontSize: 68 }}>{emoji}</span>
        <span style={{ fontFamily: FONT.title, fontSize: 74, color }}>{name}</span>
        {winner && <span style={{ fontSize: 56, marginLeft: 'auto', opacity: fade(f, endAt + 0.3) }}>🚀</span>}
      </div>
      <div style={{ marginTop: 10, fontFamily: FONT.body, fontWeight: 700, fontSize: 42, color: a(C.white, 0.9),
        opacity: fade(f, tagAt) }}>{tag}</div>
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ opacity: fade(f, paidAt) }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: a(C.gray, 0.8) }}>eingezahlt</div>
          <div style={{ fontFamily: FONT.title, fontSize: 60, color: C.gold }}>{paid}</div>
        </div>
        <div style={{ opacity: fade(f, endAt), textAlign: 'right' }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: a(C.gray, 0.8) }}>nach 30 Jahren</div>
          <DigitSlots value={euro(endValue)} fontSize={96} color={color} startAt={sec(endAt)} />
        </div>
      </div>
    </div>
  );
};

export const ShortSparbuch: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-03.mp3')} />
      <div style={{ position: 'absolute', top: 56, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 46 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: a(C.gray, 0.55) }}>KEINE ANLAGEBERATUNG</div>
      <div style={{ position: 'absolute', top: 168, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 56,
        color: C.white, opacity: f < sec(T.diff) ? fade(f, 0.3) : 1 - fade(f, T.diff - 0.2, 0.3) }}>
        Gleich viel gespart — gleiche Zeit
      </div>

      <div style={{ position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 26 }}>
        <Panel emoji="🐷" name="Lisa" color={C.gray} tag="lässt alles auf dem Sparbuch — fast 0 % Zinsen"
          tagAt={T.lisaArt} inAt={T.lisaIn} paid="36.000 €" paidAt={T.both100}
          endValue={36000} endAt={T.lisaEnd} />
        <div style={{ fontFamily: FONT.title, fontSize: 50, color: a(C.white, 0.6),
          opacity: life(f, sec(T.maxIn - 0.4), sec(99), 6) }}>VS</div>
        <Panel emoji="📈" name="Max" color={C.accent} tag="breit gestreut investiert — Ø 7 % pro Jahr"
          tagAt={T.maxIn} inAt={T.maxIn} paid="36.000 €" paidAt={T.maxPaid}
          endValue={121000} endAt={T.maxEnd} winner />
      </div>

      <div style={{ position: 'absolute', bottom: 170, width: '100%', textAlign: 'center', opacity: fade(f, T.diff) }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: a(C.white, 0.85) }}>Gleicher Einsatz. Der Unterschied:</div>
        <Shine at={sec(T.diff + 0.3)}>
          <span style={{ fontFamily: FONT.title, fontSize: 150, color: C.accent, textShadow: `0 0 50px ${a(C.accent, 0.5)}` }}>
            + {euro(85000)}
          </span>
        </Shine>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.accentLt, marginTop: 6 }}>nur durch Zinseszins + Zeit</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
