import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, RollingNumber } from './brand';

const CL = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// FinanzNeo SIGNATURE-STIL: "Clean Bold" — klare Flächen, große Typo, mutiger
// diagonaler Grün-Akzent, smooth. ~10s vertikal.
export const Signature: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();

  // Wort-Reveal Helper (clean, von unten)
  const word = (txt: string, at: number, size: number, col = C.white, weight = 800) => {
    const o = prog(f, at, at + 7);
    const y = lerpF(f, 40, 0, at, at + 12, E.out);
    return <span style={{ display: 'inline-block', opacity: o, transform: `translateY(${y}px)`,
      fontFamily: FONT.body, fontWeight: weight, fontSize: size, color: col, margin: '0 10px' }}>{txt}</span>;
  };

  // Diagonaler Grün-Block (wischt von links rein)
  const blockP = prog(f, sec(3.4), sec(4.1), E.inOut);
  const blockClip = `polygon(0 0, ${blockP * 100}% 0, ${blockP * 100 - 12}% 100%, 0 100%)`;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 0%, #10261A 0%, ${C.bg} 60%)` }}>

      {/* ── Beat A · Clean Hook (0–3.4s) ── */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(3.6), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', paddingInline: 60, lineHeight: 1.3 }}>
          {word('Aus', sec(0.3), 70)}{word('nur', sec(0.6), 70)}<br />
          {word('100 €', sec(1.0), 110, C.gold, 900)}<br />
          {word('im', sec(1.6), 70)}{word('Monat', sec(1.8), 70)}{word('…', sec(2.1), 70)}
        </div>
      </AbsoluteFill>

      {/* ── Beat B · Bold diagonaler Block + Zahl (3.4–7s) ── */}
      <AbsoluteFill style={{ opacity: life(f, sec(3.4), sec(7.2), 10) }}>
        {/* diagonaler Grün-Block */}
        <div style={{ position: 'absolute', inset: 0, background: C.accent, clipPath: blockClip }} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 46, color: C.bg, letterSpacing: 4,
              opacity: prog(f, sec(4.2), sec(4.6)) }}>WERDEN</div>
            <div style={{ marginTop: 6 }}>
              <RollingNumber to={120000} start={sec(4.4)} end={sec(6.4)} size={180} color={C.bg} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── Beat C · Clean Payoff (7–10s) ── */}
      <AbsoluteFill style={{ opacity: life(f, sec(7.2), sec(10), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 130, color: C.white, lineHeight: 1,
            opacity: prog(f, sec(7.4), sec(7.9)), transform: `translateY(${lerpF(f, 30, 0, sec(7.4), sec(7.9), E.spring)}px)` }}>
            IN NUR<br /><span style={{ color: C.accent }}>30 JAHREN</span>
          </div>
          <div style={{ width: lerpF(f, 0, 300, sec(8.2), sec(8.8)), height: 6, background: C.accent,
            margin: '40px auto 0', borderRadius: 3 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
