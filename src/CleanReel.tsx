import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, RollingNumber, AreaPremium, CameraBlur } from './brand';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · CLEAN REEL — der echte Kanal-Look (Clean Bold, 100% 2D)
//  4 Szenen: Hook → Big Number → Chart-Vergleich → Payoff. Kein 3D.
// ════════════════════════════════════════════════════════════════════════════

// Wort-Reveal von unten (clean) — Standard-Helfer für alle Szenen
const word = (f: number, txt: string, at: number, size: number, col = C.white, weight = 800, italic = false) => {
  const o = prog(f, at, at + 7);
  const y = lerpF(f, 40, 0, at, at + 12, E.out);
  return (
    <span style={{ display: 'inline-block', opacity: o, transform: `translateY(${y}px)`,
      fontFamily: FONT.body, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal',
      fontSize: size, color: col, margin: '0 9px', lineHeight: 1.15 }}>{txt}</span>
  );
};

// ─── Szene 1 · HOOK (Problem, rot) ────────────────────────────────────────────
const SHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 12%, #1A0E0E 0%, ${C.bg} 60%)`,
      alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ opacity: life(f, 0, sec(6.0), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', paddingInline: 60 }}>
          {word(f, 'Dein', sec(0.2), 70)}{word(f, 'Geld', sec(0.45), 70)}{word(f, 'auf', sec(0.7), 70)}{word(f, 'dem', sec(0.9), 70)}<br />
          {word(f, 'Sparbuch', sec(1.2), 96, C.gold as any, 900)}<br />
          <div style={{ marginTop: 30 }}>
            {word(f, 'verliert', sec(2.4), 84, C.negative as any, 900)}{word(f, 'jedes', sec(2.75), 84, C.negative as any, 900)}{word(f, 'Jahr', sec(3.05), 84, C.negative as any, 900)}
          </div>
          {/* roter Unterstrich, der reinwächst */}
          <div style={{ width: lerpF(f, 0, 360, sec(3.4), sec(4.1)), height: 7, background: C.negative,
            margin: '34px auto 0', borderRadius: 4, boxShadow: `0 0 24px ${a(C.negative, 0.6)}` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Szene 2 · BIG NUMBER (Signature diagonaler Block) ────────────────────────
const SBigNumber: React.FC = () => {
  const f = useCurrentFrame();
  const blockP = prog(f, sec(0.2), sec(1.0), E.inOut);
  const blockClip = `polygon(0 0, ${blockP * 100}% 0, ${blockP * 100 - 12}% 100%, 0 100%)`;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 0%, #10261A 0%, ${C.bg} 60%)` }}>
      {/* Setup-Text vor dem Block */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(1.4), 8), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          {word(f, 'Aber', sec(0.1), 60, C.gray as any)}{word(f, '100 €', sec(0.35), 80, C.gold as any, 900)}{word(f, 'im', sec(0.6), 60, C.gray as any)}{word(f, 'Monat', sec(0.8), 60, C.gray as any)}
        </div>
      </AbsoluteFill>
      {/* diagonaler Grün-Block + Zahl */}
      <AbsoluteFill style={{ opacity: life(f, sec(1.4), sec(7.2), 8) }}>
        <div style={{ position: 'absolute', inset: 0, background: C.accent, clipPath: blockClip }} />
        <CameraBlur samples={6}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 46, color: C.bg, letterSpacing: 4,
                opacity: prog(f, sec(2.0), sec(2.4)) }}>WERDEN</div>
              <div style={{ marginTop: 4 }}>
                <RollingNumber to={120000} start={sec(2.2)} end={sec(4.4)} size={180} color={C.bg} />
              </div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: C.bg, letterSpacing: 2,
                opacity: prog(f, sec(4.6), sec(5.1)), transform: `translateY(${lerpF(f, 20, 0, sec(4.6), sec(5.1))}px)` }}>in 30 Jahren</div>
            </div>
          </AbsoluteFill>
        </CameraBlur>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Szene 3 · CHART-VERGLEICH (Sparbuch vs ETF) ──────────────────────────────
const SChart: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W } = useVideoConfig();
  const spar = [
    { x: 'J1', y: 1200 }, { x: 'J10', y: 12000 }, { x: 'J20', y: 24000 }, { x: 'J30', y: 36000 },
  ];
  const etf = [
    { x: 'J1', y: 1300 }, { x: 'J10', y: 18000 }, { x: 'J20', y: 52000 }, { x: 'J30', y: 120000 },
  ];
  const cw = Math.min(940, W - 120);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 8%, #0E2016 0%, ${C.bg} 62%)`,
      alignItems: 'center' }}>
      <AbsoluteFill style={{ opacity: life(f, 0, sec(8.0), 10), alignItems: 'center', paddingTop: 220 }}>
        {/* Titel */}
        <div style={{ textAlign: 'center', opacity: prog(f, sec(0.2), sec(0.7)),
          transform: `translateY(${lerpF(f, 28, 0, sec(0.2), sec(0.8))}px)` }}>
          <div style={{ fontFamily: FONT.title, fontSize: 110, color: C.white, lineHeight: 0.95 }}>
            <span style={{ color: C.negative }}>SPARBUCH</span> VS <span style={{ color: C.accent }}>ETF</span>
          </div>
        </div>
        {/* ETF-Chart mit Achsen (Basis-Skala 0–120k) */}
        <div style={{ position: 'absolute', top: 520, opacity: prog(f, sec(1.0), sec(1.4)) }}>
          <AreaPremium data={etf} width={cw} height={620} drawStart={sec(3.2)} drawEnd={sec(5.4)} color={C.accent} yMax={120000} />
        </div>
        {/* Sparbuch-Linie (rot, flach) — selbe Skala, ohne Achsen drübergelegt */}
        <div style={{ position: 'absolute', top: 520, opacity: prog(f, sec(1.0), sec(1.4)) }}>
          <AreaPremium data={spar} width={cw} height={620} drawStart={sec(1.2)} drawEnd={sec(3.0)} color={C.negative} yMax={120000} hideAxes />
        </div>
        {/* Endwert-Tags */}
        <div style={{ position: 'absolute', top: 1180, width: cw, display: 'flex', justifyContent: 'space-between', paddingInline: 50 }}>
          <div style={{ opacity: prog(f, sec(3.0), sec(3.5)), textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.gray }}>Sparbuch</div>
            <div style={{ fontFamily: FONT.title, fontSize: 80, color: C.negative }}>36.000€</div>
          </div>
          <div style={{ opacity: prog(f, sec(5.2), sec(5.7)), textAlign: 'center',
            transform: `scale(${lerpF(f, 0.8, 1, sec(5.2), sec(5.7), E.spring)})` }}>
            <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.accentLt }}>ETF</div>
            <div style={{ fontFamily: FONT.title, fontSize: 100, color: C.accent }}>120.000€</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Szene 4 · PAYOFF / CTA ───────────────────────────────────────────────────
const SPayoff: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 50%, #10261A 0%, ${C.bg} 65%)`,
      alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ opacity: life(f, 0, sec(5.0), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 48, color: C.gray,
            opacity: prog(f, sec(0.2), sec(0.7)) }}>Der beste Tag zum Starten war gestern.</div>
          <div style={{ fontFamily: FONT.title, fontSize: 150, color: C.white, lineHeight: 1, marginTop: 24,
            opacity: prog(f, sec(1.0), sec(1.5)), transform: `translateY(${lerpF(f, 30, 0, sec(1.0), sec(1.6), E.spring)}px)` }}>
            DER ZWEITBESTE<br /><span style={{ color: C.accent }}>IST HEUTE.</span>
          </div>
          <div style={{ width: lerpF(f, 0, 340, sec(2.0), sec(2.7)), height: 7, background: C.accent,
            margin: '44px auto 0', borderRadius: 4, boxShadow: `0 0 24px ${a(C.accent, 0.6)}` }} />
          <div style={{ marginTop: 70, opacity: prog(f, sec(3.0), sec(3.5)),
            transform: `translateY(${lerpF(f, 20, 0, sec(3.0), sec(3.5))}px)` }}>
            <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 40, color: C.bg,
              background: C.accent, padding: '18px 44px', borderRadius: 999 }}>Folge für mehr 📈</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── STITCH: 4 Szenen hintereinander (jede Sequence = 0-basiert) ──────────────
const D1 = sec(6.0), D2 = sec(7.2), D3 = sec(8.0), D4 = sec(5.0);
export const CLEAN_REEL_FRAMES = D1 + D2 + D3 + D4;

export const CleanReel: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence from={0} durationInFrames={D1}><SHook /></Sequence>
    <Sequence from={D1} durationInFrames={D2}><SBigNumber /></Sequence>
    <Sequence from={D1 + D2} durationInFrames={D3}><SChart /></Sequence>
    <Sequence from={D1 + D2 + D3} durationInFrames={D4}><SPayoff /></Sequence>
  </AbsoluteFill>
);
