import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, num } from './brand';

const CL = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ─── Premium animiertes Gradient-Mesh (weich fließend) ────────────────────────
const MeshBG: React.FC = () => {
  const f = useCurrentFrame();
  const blob = (cx0: number, cy0: number, col: string, sp: number, ph: number) => {
    const x = cx0 + Math.sin(f * sp + ph) * 18;
    const y = cy0 + Math.cos(f * sp * 0.8 + ph) * 16;
    return `radial-gradient(38% 38% at ${x}% ${y}%, ${a(col, 0.45)} 0%, transparent 60%)`;
  };
  return (
    <AbsoluteFill style={{
      background: `${blob(30, 28, C.accent, 0.012, 0)}, ${blob(74, 40, C.blue, 0.01, 2)},
                   ${blob(50, 78, C.accentDk, 0.014, 4)}, ${blob(20, 65, C.gold, 0.009, 1)}, ${C.bg}`,
    }} />
  );
};

// ─── Buchstabe-für-Buchstabe Blur-Rise (premium Headline) ─────────────────────
const LetterReveal: React.FC<{ text: string; start: number; size?: number; color?: string; per?: number; weight?: number }> = ({
  text, start, size = 96, color = C.white, per = 2, weight = 400,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontFamily: FONT.title, fontSize: size, color, lineHeight: 1.05, letterSpacing: 1 }}>
      {text.split('').map((ch, i) => {
        const s = start + i * per;
        const o = prog(f, s, s + 8);
        const ty = lerpF(f, 40, 0, s, s + 12, E.out);
        const bl = lerpF(f, 14, 0, s, s + 12, E.out);
        return <span key={i} style={{ display: 'inline-block', opacity: o, fontWeight: weight,
          transform: `translateY(${ty}px)`, filter: `blur(${bl}px)`, whiteSpace: 'pre' }}>{ch}</span>;
      })}
    </div>
  );
};

// ─── Glas-Karte mit 3D-Tilt-Einflug ───────────────────────────────────────────
const GlassCard: React.FC<{ at: number; tint: string; label: string; value: string; delay?: number; w?: number }> = ({
  at, tint, label, value, w = 300,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const rotX = lerpF(f, 35, 0, at, at + 18, E.out);
  const ty = lerpF(f, 70, 0, at, at + 16, E.spring);
  return (
    <div style={{ perspective: 1000 }}>
      <div style={{ width: w, padding: '34px 28px', borderRadius: 28,
        background: `linear-gradient(150deg, ${a(tint, 0.22)}, ${a('#ffffff', 0.04)})`,
        border: `1.5px solid ${a(tint, 0.5)}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 50px ${a(tint, 0.25)}, inset 0 1px 0 ${a('#fff', 0.25)}`,
        backdropFilter: 'blur(12px)', opacity: p,
        transform: `translateY(${ty}px) rotateX(${rotX}deg)`, transformOrigin: 'center bottom', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.title, fontSize: 78, color: tint, lineHeight: 1, textShadow: `0 0 30px ${a(tint, 0.5)}` }}>{value}</div>
        <div style={{ fontFamily: FONT.body, fontSize: 28, color: C.white, marginTop: 10, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
};

// ─── Hero-Zahl: Blur-In + Bloom + Overshoot + Light-Sweep ─────────────────────
const HeroNumber: React.FC<{ to: number; start: number; size?: number }> = ({ to, start, size = 200 }) => {
  const f = useCurrentFrame();
  const appear = prog(f, start, start + 20, E.spring);
  const val = Math.round(lerpF(f, 0, to, start, start + 36, E.out));
  const bl = lerpF(f, 24, 0, start, start + 18);
  const bloom = 0.4 + Math.sin(f * 0.12) * 0.15;
  const sweep = prog(f, start + 30, start + 55, E.inOut);
  return (
    <div style={{ position: 'relative', display: 'inline-block', opacity: appear,
      transform: `scale(${0.7 + appear * 0.3})`, filter: `blur(${bl}px)` }}>
      <div style={{ position: 'absolute', inset: -40, borderRadius: 40,
        background: `radial-gradient(circle, ${a(C.gold, bloom)} 0%, transparent 70%)` }} />
      <div style={{ position: 'relative', fontFamily: FONT.title, fontSize: size, color: C.gold, lineHeight: 1,
        textShadow: `0 0 60px ${a(C.gold, 0.7)}` }}>{num(val)} €</div>
      {/* Light-Sweep */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', left: `${-30 + sweep * 160}%`,
        transform: 'skewX(-18deg)', background: `linear-gradient(90deg, transparent, ${a('#fff', 0.5)}, transparent)`,
        opacity: sweep > 0 && sweep < 1 ? 1 : 0, mixBlendMode: 'overlay' }} />
    </div>
  );
};

// ─── Floating Light-Streaks (premium Deko) ────────────────────────────────────
const Streaks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 7 }, (_, i) => {
        const y = (i * 280 + 100) % 1920;
        const x = ((f * (1.5 + i * 0.4) + i * 300) % 2400) - 400;
        return <div key={i} style={{ position: 'absolute', top: y, left: x, width: 240, height: 2,
          background: `linear-gradient(90deg, transparent, ${a(C.accentLt, 0.5)}, transparent)`, opacity: 0.5 }} />;
      })}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
export const PremiumReel: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <MeshBG />
      <Streaks />

      {/* 1 · Headline Blur-Rise (0-4s) */}
      <AbsoluteFill style={{ opacity: life(f, 0, sec(4.2), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ paddingInline: 50, textAlign: 'center' }}>
          <LetterReveal text="REICHTUM IST" start={sec(0.3)} size={92} />
          <div style={{ marginTop: 8 }}>
            <LetterReveal text="KEIN ZUFALL" start={sec(1.1)} size={104} color={C.accent} />
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 34, color: C.gray, letterSpacing: 4, marginTop: 28,
            opacity: prog(f, sec(2.2), sec(2.8)) }}>ES IST EINE FORMEL</div>
        </div>
      </AbsoluteFill>

      {/* 2 · 3 Glas-Karten 3D-Einflug (4.2-8.4s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(4.2), sec(8.6), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 64, color: C.white, marginBottom: 50,
            opacity: prog(f, sec(4.4), sec(4.9)) }}>DIE FORMEL</div>
          <div style={{ display: 'flex', gap: 26, justifyContent: 'center' }}>
            <GlassCard at={sec(4.8)} tint={C.accent} value="200€" label="pro Monat" w={300} />
            <GlassCard at={sec(5.2)} tint={C.blue} value="8%" label="Rendite" w={300} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
            <GlassCard at={sec(5.6)} tint={C.purple} value="40 J." label="Zeit" w={300} />
          </div>
        </div>
      </AbsoluteFill>

      {/* 3 · Hero-Zahl mit Bloom + Light-Sweep (8.6-13s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(8.6), sec(13.2), 12), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: C.white,
            opacity: prog(f, sec(8.9), sec(9.4)) }}>Das Ergebnis:</div>
          <div style={{ marginTop: 40 }}>
            <HeroNumber to={1000000} start={sec(9.2)} size={170} />
          </div>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: C.accentLt, marginTop: 50,
            opacity: prog(f, sec(11.6), sec(12.2)) }}>Millionär. Ganz ohne Glück.</div>
        </div>
      </AbsoluteFill>

      {/* 4 · CTA (13.2-15.5s) */}
      <AbsoluteFill style={{ opacity: life(f, sec(13.2), sec(15.5), 10), alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', transform: `scale(${prog(f, sec(13.4), sec(13.9), E.spring)})` }}>
          <LetterReveal text="START 2026" start={sec(13.5)} size={130} color={C.accent} per={3} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: 'radial-gradient(130% 90% at 50% 45%, transparent 42%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
