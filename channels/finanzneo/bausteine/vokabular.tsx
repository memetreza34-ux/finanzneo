import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog, num, FONT } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR — das Herzstück: wiederkehrende Finanz-Objekte, animierbar
//  & kombinierbar. Aus denen baut man JEDES Finanz-Thema. Konsistenter Stil
//  (gold=Geld, grün=Wachstum, blau=Bank). Alle als SVG, theme-neutral einsetzbar.
// ════════════════════════════════════════════════════════════════════════════
const GOLD = C.gold, GOLD_DK = '#B8860B', GREEN = C.green, BLUE = C.blue;
const glow = (col: string, r = 16) => `drop-shadow(0 0 ${r}px ${a(col, 0.55)})`;

// Ein Münz-Gesicht (ohne Wrapper) — wiederverwendet in Coin/MoneyFlow.
const coinFace = (s: number, key?: number) => (
  <svg key={key} width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <defs>
      <radialGradient id="vk-coin" cx="38%" cy="33%" r="75%">
        <stop offset="0%" stopColor="#FFEDB0" /><stop offset="55%" stopColor={GOLD} /><stop offset="100%" stopColor={GOLD_DK} />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="92" rx="32" ry="6" fill="rgba(0,0,0,0.28)" />
    <circle cx="50" cy="50" r="44" fill="url(#vk-coin)" stroke={GOLD_DK} strokeWidth="3" style={{ filter: glow(GOLD, 14) }} />
    <circle cx="50" cy="50" r="36" fill="none" stroke="#FFF3C4" strokeWidth="2" opacity="0.5" />
    <text x="50" y="67" textAnchor="middle" fontSize="50" fill="#7A5200" fontFamily={FONT.title}>€</text>
  </svg>
);

// ─── 1) Coin / Geldstapel — wächst, stapelt ──────────────────────────────────
export const Coin: React.FC<{ size?: number; at?: number; count?: number; style?: React.CSSProperties }> = ({
  size = 150, at = 0, count = 1, style,
}) => {
  const f = useCurrentFrame();
  const off = size * 0.2;
  return (
    <div style={{ position: 'relative', width: size, height: size + (count - 1) * off, ...style }}>
      {Array.from({ length: count }).map((_, i) => {
        const cp = prog(f, at + i * 4, at + i * 4 + 12, E.spring);
        return (
          <div key={i} style={{ position: 'absolute', left: 0, bottom: i * off,
            opacity: Math.min(cp * 1.4, 1), transform: `translateY(${(1 - cp) * 26}px) scale(${0.7 + cp * 0.3})` }}>
            {coinFace(size)}
          </div>
        );
      })}
    </div>
  );
};

// ─── 2) Account / Konto — Glas füllt sich mit Geld ───────────────────────────
export const Account: React.FC<{ w?: number; h?: number; fill?: number; start?: number; end?: number; label?: string }> = ({
  w = 300, h = 360, fill = 0.7, start = 0, end = 40, label,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const lvl = fill * p;
  const bx = w / 2, top = 40, bot = h - 40, innerTop = top + (bot - top) * (1 - lvl);
  return (
    <svg width={w} height={h + 40} style={{ overflow: 'visible' }}>
      <clipPath id="vk-jar"><rect x={40} y={top} width={w - 80} height={bot - top} rx={30} /></clipPath>
      <rect x={40} y={innerTop} width={w - 80} height={bot - innerTop} fill={a(GOLD, 0.9)} clipPath="url(#vk-jar)"
        style={{ filter: glow(GOLD, 14) }} />
      <ellipse cx={bx} cy={innerTop} rx={(w - 80) / 2} ry={12} fill="#FFEDB0" clipPath="url(#vk-jar)" opacity={lvl > 0.02 ? 0.9 : 0} />
      <rect x={40} y={top} width={w - 80} height={bot - top} rx={30} fill="none" stroke={C.white} strokeWidth={7} />
      <text x={bx} y={(top + bot) / 2 + 16} textAnchor="middle" fontSize={54} fill={C.white} fontFamily={FONT.title} opacity={0.85}>{Math.round(lvl * 100)}%</text>
      {label && <text x={bx} y={bot + 46} textAnchor="middle" fontSize={34} fill={C.gray} fontFamily={FONT.body}>{label}</text>}
    </svg>
  );
};

// ─── 3) Bank — klassisches Gebäude ───────────────────────────────────────────
export const Bank: React.FC<{ size?: number; at?: number; color?: string }> = ({ size = 320, at = 0, color = BLUE }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const s = size / 320;
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 320 272" style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 26}px) scale(${0.85 + p * 0.15})`, filter: glow(color, 18 * s) }}>
      <polygon points="160,20 300,90 20,90" fill={a(color, 0.9)} stroke={C.white} strokeWidth="5" strokeLinejoin="round" />
      <text x="160" y="74" textAnchor="middle" fontSize="40" fill={C.white} fontFamily={FONT.title}>€</text>
      {[40, 100, 160, 220, 280].map((x) => (
        <rect key={x} x={x - 16} y={100} width={32} height={130} rx={6} fill={a(color, 0.35)} stroke={C.white} strokeWidth="4" />
      ))}
      <rect x={10} y={236} width={300} height={26} rx={8} fill={a(color, 0.9)} stroke={C.white} strokeWidth="5" />
    </svg>
  );
};

// ─── 4) Person „Du" — Figur, hält optional Geld ──────────────────────────────
export const Person: React.FC<{ size?: number; at?: number; color?: string; label?: string }> = ({
  size = 240, at = 0, color = GREEN, label,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 200 250" style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 24}px) scale(${0.85 + p * 0.15})` }}>
      <circle cx="100" cy="58" r="46" fill={a(color, 0.9)} stroke={C.white} strokeWidth="5" style={{ filter: glow(color, 14) }} />
      <path d="M40 250 Q40 140 100 140 Q160 140 160 250 Z" fill={a(color, 0.9)} stroke={C.white} strokeWidth="5" strokeLinejoin="round" />
      {label && <text x="100" y="240" textAnchor="middle" fontSize="30" fill={C.white} fontFamily={FONT.title}>{label}</text>}
    </svg>
  );
};

// ─── 5) MoneyFlow — Münzen wandern A → B ─────────────────────────────────────
export const MoneyFlow: React.FC<{
  fromX: number; fromY: number; toX: number; toY: number; start: number; dur?: number; count?: number; coinSize?: number;
}> = ({ fromX, fromY, toX, toY, start, dur = 40, count = 4, coinSize = 64 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = start + i * 10;
        const p = prog(f, s, s + dur, E.inOut);
        if (p <= 0 || p >= 1) return null;
        const x = fromX + (toX - fromX) * p;
        const y = fromY + (toY - fromY) * p - Math.sin(p * Math.PI) * 60; // Bogen
        return <div key={i} style={{ position: 'absolute', left: x - coinSize / 2, top: y - coinSize / 2, opacity: Math.sin(p * Math.PI) }}>{coinFace(coinSize)}</div>;
      })}
    </div>
  );
};

// ─── 6) YearClock — Zeit/Jahre ticken ────────────────────────────────────────
export const YearClock: React.FC<{ fromYear: number; toYear: number; start: number; end: number; size?: number }> = ({
  fromYear, toYear, start, end, size = 240,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.inOut);
  const year = Math.round(fromYear + (toYear - fromYear) * p);
  const ang = p * (toYear - fromYear) * 40;         // Zeiger dreht mehrfach
  const cx = size / 2, r = size / 2 - 10;
  return (
    <svg width={size} height={size + 90} style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cx} r={r} fill={a(BLUE, 0.10)} stroke={C.white} strokeWidth="6" style={{ filter: glow(BLUE, 12) }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const aa = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={cx + Math.sin(aa) * (r - 16)} cy={cx - Math.cos(aa) * (r - 16)} r={3.5} fill={a(C.white, 0.5)} />;
      })}
      <line x1={cx} y1={cx} x2={cx + Math.sin(ang * Math.PI / 180) * (r - 30)} y2={cx - Math.cos(ang * Math.PI / 180) * (r - 30)}
        stroke={GREEN} strokeWidth="7" strokeLinecap="round" style={{ filter: glow(GREEN, 10) }} />
      <circle cx={cx} cy={cx} r={10} fill={C.white} />
      <text x={cx} y={size + 60} textAnchor="middle" fontSize="70" fill={C.white} fontFamily={FONT.title}>{year}</text>
    </svg>
  );
};

// ─── 7) Vault / Tresor — Sparen, Rücklage ────────────────────────────────────
export const Vault: React.FC<{ size?: number; at?: number; color?: string }> = ({ size = 300, at = 0, color = GREEN }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const spin = prog(f, at + 8, at + 44, E.out) * 320;
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ opacity: Math.min(p * 1.4, 1), transform: `scale(${0.85 + p * 0.15})`, filter: glow(color, 18) }}>
      <defs><linearGradient id="vk-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#33414A" /><stop offset="100%" stopColor="#1A2228" /></linearGradient></defs>
      <rect x={28} y={28} width={244} height={244} rx={30} fill="url(#vk-steel)" stroke={C.white} strokeWidth={5} />
      <rect x={52} y={52} width={196} height={196} rx={20} fill="none" stroke={a(C.white, 0.25)} strokeWidth={3} />
      <circle cx={150} cy={150} r={62} fill="#0E161B" stroke={C.white} strokeWidth={4} />
      <g transform={`rotate(${spin} 150 150)`}>
        {[0, 60, 120].map((d) => <rect key={d} x={147} y={98} width={6} height={104} rx={3} fill={a(C.white, 0.6)} transform={`rotate(${d} 150 150)`} />)}
      </g>
      <circle cx={150} cy={150} r={16} fill={GOLD} style={{ filter: glow(GOLD, 12) }} />
      <rect x={244} y={138} width={22} height={40} rx={6} fill="url(#vk-steel)" stroke={C.white} strokeWidth={4} />
    </svg>
  );
};

// ─── 8) Basket / ETF — viele Firmen in einem Korb (Diversifikation) ──────────
export const Basket: React.FC<{ size?: number; at?: number; items?: number }> = ({ size = 340, at = 0, items = 6 }) => {
  const f = useCurrentFrame();
  const cols = [GREEN, GOLD, BLUE, C.purple, GREEN, GOLD];
  const rimP = prog(f, at, at + 12, E.spring);
  const cell = 62, perRow = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 340 340" style={{ filter: glow(GREEN, 14) }}>
      {Array.from({ length: items }).map((_, i) => {
        const p = prog(f, at + 10 + i * 5, at + 24 + i * 5, E.spring);
        const x = 92 + (i % perRow) * (cell + 12), y = 96 - Math.floor(i / perRow) * (cell + 12);
        return <g key={i} opacity={Math.min(p * 1.4, 1)} transform={`translate(0 ${(1 - p) * 30})`}>
          <rect x={x} y={y} width={cell} height={cell} rx={12} fill={a(cols[i % cols.length], 0.9)} stroke={C.white} strokeWidth={3} />
        </g>;
      })}
      {/* Korb */}
      <g style={{ opacity: Math.min(rimP * 1.4, 1) }}>
        <path d="M60 170 L280 170 L256 300 L84 300 Z" fill={a('#8B5A2B', 0.35)} stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
        <rect x={52} y={158} width={236} height={24} rx={12} fill={a('#8B5A2B', 0.6)} stroke={C.white} strokeWidth={4} />
        {[100, 140, 180, 220, 260].map((x) => <line key={x} x1={x} y1={182} x2={x - 10} y2={296} stroke={a(C.white, 0.25)} strokeWidth={3} />)}
      </g>
    </svg>
  );
};

// ─── 9) Debt — Ball & Kette (Kredit/Belastung) ───────────────────────────────
export const Debt: React.FC<{ size?: number; at?: number; label?: string }> = ({ size = 300, at = 0, label = 'SCHULDEN' }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const sway = Math.sin(f * 0.06) * 5;
  const red = C.negative;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 300 345" style={{ opacity: Math.min(p * 1.4, 1) }}>
      <g transform={`rotate(${sway} 150 40)`}>
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={150} cy={40 + i * 34} rx={16} ry={24} fill="none" stroke="#8A929A" strokeWidth={9} />)}
        <circle cx={150} cy={250} r={80} fill="#1A2228" stroke={red} strokeWidth={5} style={{ filter: glow(red, 16) }} />
        <text x={150} y={266} textAnchor="middle" fontSize={54} fill={red} fontFamily={FONT.title}>€</text>
      </g>
      {label && <text x={150} y={338} textAnchor="middle" fontSize={34} fill={red} fontFamily={FONT.title} letterSpacing={2}>{label}</text>}
    </svg>
  );
};

// ─── 10) InterestGear — Zins/% dreht & wirkt ─────────────────────────────────
export const InterestGear: React.FC<{ size?: number; at?: number; percent?: number; color?: string }> = ({
  size = 240, at = 0, percent = 7, color = GREEN,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const rot = (f - at) * 2.2;
  const teeth = 12, R = 96, cx = 120;
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ opacity: Math.min(p * 1.4, 1), transform: `scale(${0.8 + p * 0.2})`, filter: glow(color, 16) }}>
      <g transform={`rotate(${rot} ${cx} ${cx})`}>
        {Array.from({ length: teeth }).map((_, i) => {
          const aa = (i / teeth) * Math.PI * 2;
          return <rect key={i} x={cx - 12} y={cx - R - 20} width={24} height={26} rx={5} fill={a(color, 0.9)} transform={`rotate(${(i / teeth) * 360} ${cx} ${cx})`} />;
        })}
        <circle cx={cx} cy={cx} r={R} fill={a(color, 0.16)} stroke={color} strokeWidth={7} />
      </g>
      <circle cx={cx} cy={cx} r={62} fill={C.bgDeep} stroke={color} strokeWidth={4} />
      <text x={cx} y={cx + 22} textAnchor="middle" fontSize={62} fill={C.white} fontFamily={FONT.title}>{percent}%</text>
    </svg>
  );
};

// ─── 11) TrendArrow — Wert steigt/fällt ──────────────────────────────────────
export const TrendArrow: React.FC<{ dir?: 'up' | 'down'; size?: number; at?: number }> = ({ dir = 'up', size = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 180 } });
  const col = dir === 'up' ? GREEN : C.negative;
  const flip = dir === 'up' ? '' : 'scale(1,-1) translate(0,-260)';
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ opacity: Math.min(p * 1.4, 1), transform: `scale(${0.7 + Math.min(p, 1) * 0.3})`, filter: glow(col, 20) }}>
      <g transform={flip}>
        <path d="M30 210 L110 130 L160 180 L215 70" fill="none" stroke={col} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M170 60 L228 52 L220 110 Z" fill={col} />
      </g>
    </svg>
  );
};

// ─── 12) Market — Candlestick-Chart (Börse/Kurse) ────────────────────────────
export const Market: React.FC<{ at?: number; w?: number; h?: number }> = ({ at = 0, w = 600, h = 380 }) => {
  const f = useCurrentFrame();
  const candles = [
    { o: 0.4, c: 0.55, hi: 0.62, lo: 0.34, up: true }, { o: 0.55, c: 0.48, hi: 0.6, lo: 0.42, up: false },
    { o: 0.48, c: 0.66, hi: 0.72, lo: 0.45, up: true }, { o: 0.66, c: 0.78, hi: 0.84, lo: 0.62, up: true },
    { o: 0.78, c: 0.7, hi: 0.82, lo: 0.66, up: false }, { o: 0.7, c: 0.9, hi: 0.95, lo: 0.68, up: true },
  ];
  const bw = 46, gap = (w - 120) / candles.length;
  const yv = (v: number) => 40 + (1 - v) * (h - 90);
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <line x1={70} y1={h - 40} x2={w - 30} y2={h - 40} stroke={a(C.gray, 0.25)} strokeWidth={2} />
      {candles.map((cd, i) => {
        const p = prog(f, at + i * 8, at + i * 8 + 14, E.spring);
        if (p <= 0) return null;
        const x = 90 + i * gap;
        const col = cd.up ? GREEN : C.negative;
        const top = yv(Math.max(cd.o, cd.c)), bot = yv(Math.min(cd.o, cd.c));
        return <g key={i} opacity={Math.min(p * 1.4, 1)} style={{ transform: `scaleY(${p})`, transformOrigin: `center ${h - 40}px` }}>
          <line x1={x} y1={yv(cd.hi)} x2={x} y2={yv(cd.lo)} stroke={col} strokeWidth={4} />
          <rect x={x - bw / 2} y={top} width={bw} height={Math.max(6, bot - top)} rx={5} fill={col} style={{ filter: glow(col, 8) }} />
        </g>;
      })}
    </svg>
  );
};
