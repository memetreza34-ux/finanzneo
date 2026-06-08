import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a, num } from '../tokens';
import { FONT } from '../fonts';

// ─── TABELLE — Zeilen bauen sich nacheinander auf ─────────────────────────────
export const Table: React.FC<{
  headers: string[];
  rows: { cells: string[]; appear: number; highlight?: boolean }[];
  width?: number | string; accent?: string;
}> = ({ headers, rows, width = '100%', accent = C.accent }) => {
  const f = useCurrentFrame();
  const cols = headers.length;
  return (
    <div style={{ width, fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: `1.4fr ${'1fr '.repeat(cols - 1)}`,
        padding: '20px 28px', borderRadius: 16, background: a(accent, 0.14), border: `2px solid ${a(accent, 0.4)}` }}>
        {headers.map((h, i) => (
          <div key={i} style={{ fontSize: 34, fontWeight: 800, color: accent,
            textAlign: i === 0 ? 'left' : 'center' }}>{h}</div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((r, i) => {
        const p = prog(f, r.appear, r.appear + 12, E.out);
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: `1.4fr ${'1fr '.repeat(cols - 1)}`,
            padding: '22px 28px', marginTop: 10, borderRadius: 14,
            background: r.highlight ? a(accent, 0.1) : 'rgba(255,255,255,0.04)',
            border: r.highlight ? `2px solid ${a(accent, 0.5)}` : `1px solid ${a(C.gray, 0.12)}`,
            opacity: p, transform: `translateX(${lerpF(f, 60, 0, r.appear, r.appear + 12)}px)` }}>
            {r.cells.map((cell, j) => (
              <div key={j} style={{ fontSize: 36, fontWeight: j === 0 ? 700 : 600,
                color: j === 0 ? C.white : (r.highlight ? accent : C.gray),
                textAlign: j === 0 ? 'left' : 'center' }}>{cell}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─── RIESEN-STAT — eine fette Zahl + Kontext (Hook-Momente) ───────────────────
export const BigStat: React.FC<{
  value: string; label: string; at?: number; color?: string; size?: number;
  style?: React.CSSProperties;
}> = ({ value, label, at = 0, color = C.accent, size = 280, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  return (
    <div style={{ textAlign: 'center', opacity: p, transform: `scale(${0.7 + p * 0.3})`, ...style }}>
      <div style={{ fontFamily: FONT.title, fontSize: size, color, lineHeight: 0.95,
        textShadow: `0 0 80px ${a(color, 0.6)}` }}>{value}</div>
      <div style={{ fontFamily: FONT.body, fontSize: size * 0.16, fontWeight: 700, color: C.white,
        marginTop: 10, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

// ─── RISIKO-TACHO (Gauge) — Halbkreis-Zeiger ──────────────────────────────────
export const Gauge: React.FC<{
  cx: number; cy: number; radius?: number; value: number;  // 0..100
  start: number; end: number; label?: string;
}> = ({ cx, cy, radius = 200, value, start, end, label }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const v = value * p;
  const ang = Math.PI * (v / 100);             // 0..PI (links→rechts)
  const nx = cx - Math.cos(ang) * radius * 0.8;
  const ny = cy - Math.sin(ang) * radius * 0.8;
  const seg = (frac: number, color: string, from: number) => {
    const a0 = Math.PI * from, a1 = Math.PI * (from + frac);
    const x0 = cx - Math.cos(a0) * radius, y0 = cy - Math.sin(a0) * radius;
    const x1 = cx - Math.cos(a1) * radius, y1 = cy - Math.sin(a1) * radius;
    return `M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg width={cx * 2} height={cy + radius * 0.5} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d={seg(0.34, C.accent, 0)} fill="none" stroke={C.accent} strokeWidth={32} strokeLinecap="round" opacity={0.85} />
      <path d={seg(0.33, C.gold, 0.34)} fill="none" stroke={C.gold} strokeWidth={32} opacity={0.85} />
      <path d={seg(0.33, C.negative, 0.67)} fill="none" stroke={C.negative} strokeWidth={32} strokeLinecap="round" opacity={0.85} />
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.white} strokeWidth={8} strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' }} />
      <circle cx={cx} cy={cy} r={16} fill={C.white} />
      {label && <text x={cx} y={cy + radius * 0.35} textAnchor="middle" fill={C.white} fontSize={radius * 0.2} fontFamily={FONT.title}>{label}</text>}
    </svg>
  );
};

// ─── FORTSCHRITTS-BALKEN — „73 % der Deutschen…" ──────────────────────────────
export const StatBar: React.FC<{
  percent: number; label: string; at: number; color?: string; width?: number;
}> = ({ percent, label, at, color = C.accent, width = 800 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 24, E.out);
  return (
    <div style={{ width }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12,
        fontFamily: FONT.body, fontSize: 38, fontWeight: 700, color: C.white }}>
        <span>{label}</span>
        <span style={{ color, fontFamily: FONT.title, fontSize: 50 }}>{Math.round(percent * p)}%</span>
      </div>
      <div style={{ height: 36, borderRadius: 999, background: a(C.gray, 0.15), overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent * p}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${a(color, 0.7)}, ${color})`,
          boxShadow: `0 0 18px ${a(color, 0.6)}` }} />
      </div>
    </div>
  );
};
