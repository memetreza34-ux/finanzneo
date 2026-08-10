import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, E, prog, lerpF, a, CLAMP } from '../tokens';
import { FONT } from '../fonts';

// ─── Typewriter — Zeichen erscheinen nacheinander ─────────────────────────────
export const Typewriter: React.FC<{
  text: string; start: number; cps?: number; size?: number; color?: string; weight?: number;
  style?: React.CSSProperties; caret?: boolean;
}> = ({ text, start, cps = 28, size = 56, color = C.white, weight = 700, style, caret = true }) => {
  const f = useCurrentFrame();
  const shown = Math.max(0, Math.floor(((f - start) / 30) * cps));
  const visible = text.slice(0, shown);
  const done = shown >= text.length;
  return (
    <span style={{ fontFamily: FONT.body, fontSize: size, color, fontWeight: weight, ...style }}>
      {visible}
      {caret && !done && f > start && <span style={{ opacity: f % 16 < 8 ? 1 : 0, color: C.accent }}>|</span>}
    </span>
  );
};

// ─── Masken-Reveal — Text wischt von links auf ────────────────────────────────
export const MaskReveal: React.FC<{
  children: React.ReactNode; at: number; dur?: number; size?: number; color?: string; weight?: number;
  style?: React.CSSProperties;
}> = ({ children, at, dur = 16, size = 80, color = C.white, weight = 900, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const pct = (1 - p) * 100;
  return (
    <div style={{ fontFamily: FONT.title, fontSize: size, color, fontWeight: weight, lineHeight: 1.05,
      clipPath: `inset(0 ${pct}% 0 0)`, WebkitClipPath: `inset(0 ${pct}% 0 0)`, ...style }}>
      {children}
    </div>
  );
};

// ─── Wort-Stagger — Wörter springen nacheinander hoch ─────────────────────────
export const WordStagger: React.FC<{
  text: string; start: number; perWord?: number; size?: number;
  highlight?: string[]; highlightColor?: string; color?: string; style?: React.CSSProperties;
}> = ({ text, start, perWord = 4, size = 72, highlight = [], highlightColor = C.accent, color = C.white, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px',
      fontFamily: FONT.body, fontSize: size, lineHeight: 1.2, ...style }}>
      {text.split(' ').map((w, i) => {
        const wf = start + i * perWord;
        const p = prog(f, wf, wf + perWord + 4, E.spring);
        const isH = highlight.some(h => w.replace(/[.,!?]/g, '').toLowerCase() === h.toLowerCase());
        return (
          <span key={i} style={{ display: 'inline-block', opacity: p,
            transform: `translateY(${lerpF(f, 34, 0, wf, wf + perWord + 4, E.spring)}px)`,
            color: isH ? highlightColor : color, fontWeight: isH ? 900 : 600,
            textShadow: isH ? `0 0 26px ${a(highlightColor, 0.5)}` : undefined }}>{w}</span>
        );
      })}
    </div>
  );
};

// ─── Highlight-Unterstreichung — Linie wächst unter Wort ──────────────────────
export const Underline: React.FC<{
  children: React.ReactNode; at: number; dur?: number; color?: string; size?: number; weight?: number;
}> = ({ children, at, dur = 14, color = C.accent, size = 64, weight = 800 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontFamily: FONT.body, fontSize: size,
      fontWeight: weight, color: C.white }}>
      {children}
      <span style={{ position: 'absolute', left: 0, bottom: -8, height: 8, width: `${p * 100}%`,
        background: color, borderRadius: 4, boxShadow: `0 0 12px ${a(color, 0.7)}` }} />
    </span>
  );
};

// ─── Scramble — Zeichen-Wirrwarr löst sich von links nach rechts auf ──────────
//    Perfekt für „geheime" Zahlen/Begriffe: <Scramble text="121.997 €" at={10} />
export const Scramble: React.FC<{
  text: string; at: number; dur?: number; size?: number; color?: string;
  fontFamily?: string; weight?: number;
}> = ({ text, at, dur = 30, size = 96, color = C.white, fontFamily = FONT.title, weight = 400 }) => {
  const f = useCurrentFrame();
  const POOL = '!<>-_\\/[]{}—=+*^?#ABCDEFGHKMNPRSTUWXZ0123456789';
  const chars = text.split('');
  return (
    <span style={{ fontFamily, fontSize: size, fontWeight: weight, color, whiteSpace: 'pre' }}>
      {chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        const resolveAt = at + (i / Math.max(chars.length - 1, 1)) * dur;
        if (f >= resolveAt) return ch;
        if (f < at) return ' ';
        // deterministisches Flackern
        const r = POOL[(i * 13 + f * 7) % POOL.length];
        return <span key={i} style={{ opacity: 0.6 }}>{r}</span>;
      })}
    </span>
  );
};

// ─── KineticPunch — Wörter knallen nacheinander groß rein (Kinetic Typography) ─
//    <KineticPunch words={['SPAREN.','WARTEN.','VERLIEREN.']} at={0} per={18} />
export const KineticPunch: React.FC<{
  words: string[]; at: number; per?: number; size?: number;
  colors?: string[]; holdLast?: boolean;
}> = ({ words, at, per = 18, size = 130, colors = [C.white], holdLast = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f - at;
  if (t < 0) return null;
  const idx = Math.min(Math.floor(t / per), words.length - 1);
  const local = t - idx * per;
  const isLast = idx === words.length - 1;
  const inP = spring({ frame: local, fps, config: { damping: 11, stiffness: 320 } });
  const out = !isLast || !holdLast
    ? interpolate(local, [per - 5, per], [0, 1], CLAMP) : 0;
  const rot = (idx % 2 === 0 ? 1 : -1) * (1 - inP) * 8;
  return (
    <span style={{
      fontFamily: FONT.title, fontSize: size, color: colors[idx % colors.length],
      display: 'inline-block', whiteSpace: 'nowrap',
      transform: `scale(${0.7 + inP * 0.3}) rotate(${rot}deg)`,
      opacity: Math.min(inP * 1.4, 1) * (1 - out),
    }}>
      {words[idx]}
    </span>
  );
};

// ─── FlipIn3D — Zeichen klappen nacheinander aus der Tiefe ────────────────────
export const FlipIn3D: React.FC<{
  text: string; at: number; size?: number; color?: string; stagger?: number;
}> = ({ text, at, size = 96, color = C.white, stagger = 2.5 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: 'inline-block', perspective: 800, whiteSpace: 'pre' }}>
      {text.split('').map((ch, i) => {
        const p = spring({ frame: f - at - i * stagger, fps, config: { damping: 14, stiffness: 220 } });
        return (
          <span key={i} style={{
            fontFamily: FONT.title, fontSize: size, color,
            display: 'inline-block',
            transform: `rotateX(${(1 - p) * -90}deg) translateY(${(1 - p) * 18}px)`,
            transformOrigin: '50% 100%',
            opacity: Math.min(p * 1.5, 1),
          }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
};

// ─── WaveText — sanfte stehende Welle (für Akzent-Worte, dezent einsetzen) ────
export const WaveText: React.FC<{
  text: string; at?: number; size?: number; color?: string; amplitude?: number;
}> = ({ text, at = 0, size = 80, color = C.accent, amplitude = 7 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ whiteSpace: 'pre', display: 'inline-block' }}>
      {text.split('').map((ch, i) => {
        const inP = spring({ frame: f - at - i * 2, fps, config: { damping: 13, stiffness: 200 } });
        const y = Math.sin((f - at) * 0.18 - i * 0.55) * amplitude;
        return (
          <span key={i} style={{
            fontFamily: FONT.title, fontSize: size, color,
            display: 'inline-block', opacity: Math.min(inP * 1.4, 1),
            transform: `translateY(${(1 - inP) * 24 + y}px)`,
          }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
};
