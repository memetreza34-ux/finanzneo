import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog, num, FONT } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR 5 — Bonus: 6 weitere Objekte, gleicher Stil. Wissen & Vertrauen.
//  1) BookToLightbulb 2) CertificateSeal 3) MentorArrow 4) QuizCheckX
//  5) TrustBadgeStar 6) NewsHeadlineSlide
// ════════════════════════════════════════════════════════════════════════════
const GOLD = C.gold, GREEN = C.green, BLUE = C.blue, RED = C.negative;
const glow = (col: string, r = 16) => `drop-shadow(0 0 ${r}px ${a(col, 0.55)})`;

// ─── 1) BookToLightbulb — Buch klappt auf, Glühbirne leuchtet danach ───────
export const BookToLightbulb: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const bookP = prog(f, at, at + 16, E.spring);
  const openP = prog(f, at + 10, at + 26, E.out);
  const bulbP = prog(f, at + 28, at + 42, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      <g style={{ opacity: Math.min(bookP * 1.4, 1), transform: `translateY(${(1 - bookP) * 20}px)` }}>
        <path d={`M60 220 Q60 ${220 - openP * 20} 140 210 L140 130 Q60 140 60 190 Z`} fill={a(BLUE, 0.7)} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M220 220 Q220 ${220 - openP * 20} 140 210 L140 130 Q220 140 220 190 Z`} fill={a(BLUE, 0.5)} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <g style={{ opacity: Math.min(bulbP * 1.4, 1), transform: `translateY(${(1 - bulbP) * -16}px) scale(${0.7 + bulbP * 0.3})`, transformOrigin: '140px 70px', filter: glow(GOLD, 20 * bulbP) }}>
        <circle cx={140} cy={70} r={34} fill={a(GOLD, 0.9)} stroke={C.white} strokeWidth={3} />
        <rect x={128} y={100} width={24} height={16} rx={4} fill="#8A929A" />
        <path d="M126 70 L134 82 L146 62 L154 74" fill="none" stroke="#7A5200" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      </g>
    </svg>
  );
};

// ─── 2) CertificateSeal — Urkunde, Siegel prägt sich mit Scale-Impact ──────
export const CertificateSeal: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const docP = prog(f, at, at + 12, E.spring);
  const impact = at + 18;
  const sealP = prog(f, at + 10, impact, E.in);
  const overshoot = f >= impact ? Math.max(0, 1 - (f - impact) * 0.08) : 0;
  const scale = f < impact ? 0.4 + sealP * 0.6 : 1 + overshoot * 0.25;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 280 210" style={{ overflow: 'visible' }}>
      <g opacity={Math.min(docP * 1.4, 1)}>
        <rect x={20} y={20} width={240} height={170} rx={10} fill={a(C.white, 0.06)} stroke={C.white} strokeWidth={5} />
        <rect x={20} y={20} width={240} height={170} rx={10} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.5} />
        {[55, 80, 105].map((y) => <rect key={y} x={45} y={y} width={130} height={7} rx={3} fill={a(C.white, 0.25)} />)}
      </g>
      <g style={{ opacity: f >= at + 10 ? 1 : 0, transform: `scale(${scale})`, transformOrigin: '210px 130px', filter: glow(GOLD, 16) }}>
        <circle cx={210} cy={130} r={40} fill={a(GOLD, 0.9)} stroke="#B8860B" strokeWidth={4} />
        <path d="M195 132 L206 143 L226 118" fill="none" stroke="#5A3D00" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// ─── 3) MentorArrow — gestrichelter Bogen zeichnet sich, klein → groß ──────
export const MentorArrow: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const pathLen = 260;
  const draw = prog(f, at, at + 34, E.out);
  const dotP = prog(f, at + 30, at + 44, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      <path d="M60 220 Q120 220 150 160 Q180 100 230 60" fill="none" stroke={a(C.white, 0.6)} strokeWidth={4}
        strokeDasharray="10 10" strokeDashoffset={pathLen * (1 - draw)} strokeLinecap="round" />
      <circle cx={60} cy={220} r={8} fill={BLUE} opacity={draw > 0.02 ? 1 : 0} />
      <g opacity={Math.min(dotP * 1.4, 1)} transform={`translate(230 60) scale(${0.6 + dotP * 0.4})`} style={{ filter: glow(GOLD, 14) }}>
        <circle r={18} fill={GOLD} stroke={C.white} strokeWidth={3} />
      </g>
    </svg>
  );
};

// ─── 4) QuizCheckX — Kreis wechselt Haken/Kreuz je nach correct, Bounce ────
export const QuizCheckX: React.FC<{ size?: number; at?: number; correct?: boolean }> = ({
  size = 220, at = 0, correct = true,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  const pc = Math.min(p, 1.15);
  const col = correct ? GREEN : RED;
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" style={{ opacity: Math.min(1, p * 2), transform: `scale(${pc})`, transformOrigin: 'center', filter: glow(col, 18) }}>
      <circle cx={110} cy={110} r={90} fill={a(col, 0.18)} stroke={col} strokeWidth={8} />
      {correct
        ? <path d="M65 112 L95 145 L155 78" fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        : <>
            <line x1={70} y1={70} x2={150} y2={150} stroke={col} strokeWidth={14} strokeLinecap="round" />
            <line x1={150} y1={70} x2={70} y2={150} stroke={col} strokeWidth={14} strokeLinecap="round" />
          </>
      }
    </svg>
  );
};

// ─── 5) TrustBadgeStar — 5 Sterne füllen nacheinander, Funkeln beim letzten ─
export const TrustBadgeStar: React.FC<{ size?: number; at?: number; count?: number }> = ({
  size = 320, at = 0, count = 5,
}) => {
  const f = useCurrentFrame();
  const starPath = (cx: number, cy: number, r: number) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.42;
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
      d += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
    }
    return d + 'Z';
  };
  const starW = 56;
  const totalW = count * starW;
  return (
    <svg width={size} height={size * 0.4} viewBox={`0 0 ${totalW} 90`} style={{ overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = at + i * 8;
        const p = prog(f, s, s + 14, E.spring);
        const cx = i * starW + starW / 2, cy = 45;
        const isLast = i === count - 1;
        const sparkle = isLast ? prog(f, s + 12, s + 26, E.out) : 0;
        return (
          <g key={i}>
            <path d={starPath(cx, cy, 26)} fill="none" stroke={a(C.white, 0.3)} strokeWidth={3} />
            <path d={starPath(cx, cy, 26)} fill={GOLD} opacity={Math.min(p * 1.4, 1)} style={{ filter: p > 0.1 ? glow(GOLD, 8) : 'none' }} />
            {isLast && sparkle > 0 && [0, 1, 2, 3].map((k) => {
              const ang = (k / 4) * Math.PI * 2 + Math.PI / 4;
              const d = sparkle * 30;
              return <line key={k} x1={cx} y1={cy} x2={cx + Math.cos(ang) * d} y2={cy + Math.sin(ang) * d} stroke={C.white} strokeWidth={2} opacity={1 - sparkle} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ─── 6) NewsHeadlineSlide — Balken mit Icon slidet rein, Text versetzt ─────
export const NewsHeadlineSlide: React.FC<{ w?: number; at?: number; headline?: string }> = ({
  w = 640, at = 0, headline = 'MÄRKTE IM AUFWIND',
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 16, stiffness: 140 } });
  const pc = Math.min(p, 1);
  const x = -(w + 60) * (1 - pc);
  const textP = prog(f, at + 10, at + 26, E.out);
  return (
    <svg width={w} height={90} viewBox={`0 0 ${w} 90`} style={{ overflow: 'visible' }}>
      <g style={{ transform: `translateX(${x}px)`, filter: glow(BLUE, 12) }}>
        <rect x={0} y={10} width={70} height={70} rx={14} fill={a(BLUE, 0.9)} stroke={C.white} strokeWidth={3} />
        <path d="M22 55 L34 40 L46 50 L58 28" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={82} y={16} width={w - 100} height={58} rx={12} fill={a(C.white, 0.06)} stroke={a(C.white, 0.25)} strokeWidth={2} />
      </g>
      <text x={x + 100} y={52} fontSize={30} fill={C.white} fontFamily={FONT.title} opacity={textP} style={{ transform: `translateX(${(1 - textP) * 24}px)` }}>{headline}</text>
    </svg>
  );
};
