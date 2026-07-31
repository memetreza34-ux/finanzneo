import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog, num, FONT } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR 3 — weitere 16 wiederkehrende Finanz-Objekte, gleicher Stil
//  wie vokabular.tsx/vokabular2.tsx (SVG, prog()/spring(), gold=Geld, grün=Wachstum,
//  blau=Bank). Investieren & Märkte + Vermögen & Ziele.
//  1) RisingSteps 2) BullBearFigure 3) PortfolioPie 4) RiskDial 5) DividendRain
//  6) IndexFundBlock 7) CryptoWallet 8) ExchangeArrows 9) HouseKey 10) GoalFlag
//  11) RetirementSun 12) EmergencyFund 13) CarUnlock 14) TravelPin
//  15) DreamBoard 16) FamilyShield
// ════════════════════════════════════════════════════════════════════════════
const GOLD = C.gold, GOLD_DK = '#B8860B', GREEN = C.green, BLUE = C.blue, RED = C.negative, PURPLE = C.purple;
const glow = (col: string, r = 16) => `drop-shadow(0 0 ${r}px ${a(col, 0.55)})`;

// ─── 1) RisingSteps — Treppe steigt an, Figur klettert Stufe für Stufe ───────
export const RisingSteps: React.FC<{ size?: number; at?: number; steps?: number }> = ({
  size = 300, at = 0, steps = 5,
}) => {
  const f = useCurrentFrame();
  const stepW = 54, stepH = 34, gap = 4;
  const w = steps * (stepW + gap);
  const h = steps * (stepH + gap) + 40;
  const climbP = prog(f, at + steps * 6, at + steps * 6 + steps * 10, E.inOut);
  const idx = Math.min(steps - 1, Math.floor(climbP * steps));
  const localP = climbP * steps - idx;
  const figX = w - stepW / 2 - idx * (stepW + gap) - localP * (stepW + gap);
  const figY = h - 40 - idx * (stepH + gap) - localP * (stepH + gap) - 34;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      {Array.from({ length: steps }).map((_, i) => {
        const p = prog(f, at + i * 6, at + i * 6 + 14, E.spring);
        const x = w - stepW - i * (stepW + gap);
        const y = h - 40 - i * (stepH + gap);
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)} style={{ transform: `translateY(${(1 - p) * 24}px)` }}>
            <rect x={x} y={y} width={stepW} height={h - y} rx={6} fill={a(GREEN, 0.22 + i * 0.1)} stroke={C.white} strokeWidth={3} />
          </g>
        );
      })}
      <g style={{ opacity: prog(f, at + steps * 6, at + steps * 6 + 8, E.spring), transform: `translate(${figX}px, ${figY}px)`, filter: glow(GOLD, 12) }}>
        <circle cx={0} cy={0} r={13} fill={GOLD} stroke={C.white} strokeWidth={3} />
      </g>
    </svg>
  );
};

// ─── 2) BullBearFigure — Stier vs Bär Umriss, mood hebt einen hervor ─────────
export const BullBearFigure: React.FC<{ size?: number; at?: number; mood?: 'bull' | 'bear' }> = ({
  size = 320, at = 0, mood = 'bull',
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const bullActive = mood === 'bull';
  const bullOp = bullActive ? 1 : 0.28;
  const bearOp = bullActive ? 0.28 : 1;
  const hiCol = bullActive ? GREEN : RED;
  const pulse = 1 + Math.sin(Math.max(0, f - at - 16) * 0.1) * 0.03;
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 320 224" style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 20}px)` }}>
      {/* Bär (links) */}
      <g opacity={bearOp} style={{ transform: bullActive ? 'none' : `scale(${pulse})`, transformOrigin: '80px 150px', filter: !bullActive ? glow(hiCol, 16) : 'none' }}>
        <path d="M30 190 Q30 120 80 110 Q60 80 68 60 Q90 78 100 100 Q120 96 128 116 Q150 130 150 190 Z"
          fill="none" stroke={RED} strokeWidth={7} strokeLinejoin="round" />
        <path d="M80 110 Q100 96 120 108" fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" transform="rotate(-14 100 108)" />
      </g>
      {/* Stier (rechts) */}
      <g opacity={bullOp} style={{ transform: bullActive ? `scale(${pulse})` : 'none', transformOrigin: '240px 150px', filter: bullActive ? glow(hiCol, 16) : 'none' }}>
        <path d="M190 190 Q190 130 240 118 Q225 90 235 70 Q252 90 258 108 Q280 100 290 122 Q310 132 310 190 Z"
          fill="none" stroke={GREEN} strokeWidth={7} strokeLinejoin="round" />
        <path d="M215 96 Q225 78 245 82" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
        <path d="M275 96 Q265 78 245 82" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ─── 3) PortfolioPie — Kreis-Segmente bauen sich auf, leichte 3D-Perspektive ─
export const PortfolioPie: React.FC<{ size?: number; at?: number; segments?: { value: number; color: string }[] }> = ({
  size = 300, at = 0,
  segments = [{ value: 40, color: GREEN }, { value: 25, color: GOLD }, { value: 20, color: BLUE }, { value: 15, color: PURPLE }],
}) => {
  const f = useCurrentFrame();
  const total = segments.reduce((s, x) => s + x.value, 0);
  const tiltP = prog(f, at, at + 20, E.out);
  const tilt = 46 - tiltP * 20;
  const r = 100, cx = 150, cy = 150;
  let acc = 0;
  const arc = (startFrac: number, endFrac: number) => {
    const a0 = startFrac * Math.PI * 2 - Math.PI / 2, a1 = endFrac * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
    const large = endFrac - startFrac > 0.5 ? 1 : 0;
    return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ transform: `rotateX(${tilt}deg)`, transformStyle: 'preserve-3d' }}>
      {segments.map((seg, i) => {
        const startFrac = acc / total;
        acc += seg.value;
        const endFrac = acc / total;
        const p = prog(f, at + 14 + i * 8, at + 14 + i * 8 + 16, E.spring);
        const curEnd = startFrac + (endFrac - startFrac) * p;
        if (p <= 0) return null;
        return <path key={i} d={arc(startFrac, curEnd)} fill={a(seg.color, 0.88)} stroke={C.white} strokeWidth={3}
          style={{ opacity: Math.min(p * 1.4, 1), filter: glow(seg.color, 8) }} />;
      })}
      <circle cx={cx} cy={cy} r={44} fill={C.bgDeep} stroke={a(C.white, 0.3)} strokeWidth={3} />
    </svg>
  );
};

// ─── 4) RiskDial — Halbkreis Sicher→Riskant, Nadel schwingt zum Ziel ─────────
export const RiskDial: React.FC<{ size?: number; at?: number; riskLevel?: number }> = ({
  size = 300, at = 0, riskLevel = 0.6,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 90 } });
  const pc = Math.min(p, 1);
  const angDeg = -90 + riskLevel * pc * 180;
  const cx = 150, cy = 170, r = 120;
  const col = riskLevel < 0.34 ? GREEN : riskLevel < 0.67 ? GOLD : RED;
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 300 195" style={{ overflow: 'visible' }}>
      <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke={a(GREEN, 0.7)} strokeWidth={18} strokeDasharray="126 400" />
      <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke={a(GOLD, 0.7)} strokeWidth={18} strokeDasharray="126 400" strokeDashoffset={-126} />
      <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke={a(RED, 0.7)} strokeWidth={18} strokeDasharray="126 400" strokeDashoffset={-252} />
      <line x1={cx} y1={cy} x2={cx + Math.cos(angDeg * Math.PI / 180) * (r - 24)} y2={cy + Math.sin(angDeg * Math.PI / 180) * (r - 24)}
        stroke={col} strokeWidth={8} strokeLinecap="round" style={{ filter: glow(col, 14) }} />
      <circle cx={cx} cy={cy} r={12} fill={col} stroke={C.white} strokeWidth={3} />
      <text x={40} y={190} fontSize={22} fill={C.white} fontFamily={FONT.body} opacity={0.7}>Sicher</text>
      <text x={200} y={190} fontSize={22} fill={C.white} fontFamily={FONT.body} opacity={0.7}>Riskant</text>
    </svg>
  );
};

// ─── 5) DividendRain — Münzen fallen gestaffelt auf ein Depot ───────────────
export const DividendRain: React.FC<{ size?: number; at?: number; count?: number }> = ({
  size = 280, at = 0, count = 6,
}) => {
  const f = useCurrentFrame();
  const depotP = prog(f, at, at + 14, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = at + 10 + i * 9;
        const p = prog(f, s, s + 30, E.in);
        if (p <= 0 || p >= 1) return null;
        const x = 60 + (i * 37) % 170;
        const y = -20 + p * 190;
        const bounce = p > 0.9 ? Math.sin((p - 0.9) * 31) * (1 - (p - 0.9) * 10) * 8 : 0;
        return <g key={i} opacity={Math.min(1, (1 - p) * 3 + 0.3)} transform={`translate(${x} ${y - bounce})`}>
          <circle r={16} fill={GOLD} stroke={GOLD_DK} strokeWidth={3} style={{ filter: glow(GOLD, 10) }} />
          <text y={6} textAnchor="middle" fontSize={16} fill="#7A5200" fontFamily={FONT.title}>€</text>
        </g>;
      })}
      <g style={{ opacity: Math.min(depotP * 1.4, 1) }}>
        <rect x={40} y={200} width={200} height={60} rx={12} fill={a(BLUE, 0.3)} stroke={C.white} strokeWidth={4} />
        <text x={140} y={238} textAnchor="middle" fontSize={26} fill={C.white} fontFamily={FONT.title} opacity={0.7}>DEPOT</text>
      </g>
    </svg>
  );
};

// ─── 6) IndexFundBlock — kleine Quadrate fliegen zusammen zu großem Block ────
export const IndexFundBlock: React.FC<{ size?: number; at?: number; count?: number }> = ({
  size = 300, at = 0, count = 9,
}) => {
  const f = useCurrentFrame();
  const cols = 3;
  const cell = 70, gap = 6;
  const total = cols * (cell + gap) - gap;
  const startPos = Array.from({ length: count }).map((_, i) => {
    const ang = (i / count) * Math.PI * 2;
    return { x: Math.cos(ang) * 260, y: Math.sin(ang) * 260 };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} style={{ overflow: 'visible', filter: glow(BLUE, 12) }}>
      {Array.from({ length: count }).map((_, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const tx = col * (cell + gap), ty = row * (cell + gap);
        const p = prog(f, at + i * 4, at + i * 4 + 22, E.spring);
        const x = startPos[i].x + (tx - startPos[i].x) * p;
        const y = startPos[i].y + (ty - startPos[i].y) * p;
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)} transform={`translate(${x} ${y})`}>
            <rect width={cell} height={cell} rx={10} fill={a(BLUE, 0.85)} stroke={C.white} strokeWidth={3} />
            <text x={cell / 2} y={cell / 2 + 8} textAnchor="middle" fontSize={22} fill={C.white} fontFamily={FONT.title} opacity={0.8}>{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── 7) CryptoWallet — Karte mit QR-Punktmuster, Glanz-Sweep ────────────────
export const CryptoWallet: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const sweep = prog(f, at + 16, at + 46, E.inOut);
  const w = 240, h = 150;
  // deterministisches Pseudo-QR-Punktmuster (seed statt Math.random)
  const dots: { x: number; y: number }[] = [];
  let seed = 7;
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (seed % 5 < 2) dots.push({ x: c, y: r });
    }
  }
  return (
    <svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`} style={{
      opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 20}px) scale(${0.9 + p * 0.1})`, filter: glow(PURPLE, 16),
    }}>
      <defs>
        <linearGradient id="vk3-wallet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={PURPLE} /><stop offset="100%" stopColor={BLUE} />
        </linearGradient>
        <clipPath id="vk3-walletClip"><rect x={0} y={0} width={w} height={h} rx={18} /></clipPath>
      </defs>
      <rect x={0} y={0} width={w} height={h} rx={18} fill="url(#vk3-wallet)" stroke={C.white} strokeWidth={4} />
      <g clipPath="url(#vk3-walletClip)">
        <rect x={sweep * w * 1.8 - w * 0.4} y={-20} width={40} height={h + 40} fill={a(C.white, 0.28)} transform={`skewX(-20)`} />
      </g>
      <g transform="translate(16 60)">
        {dots.map((d, i) => <rect key={i} x={d.x * 12} y={d.y * 12} width={10} height={10} rx={2} fill={a(C.white, 0.85)} />)}
      </g>
      <text x={200} y={40} textAnchor="end" fontSize={20} fill={C.white} fontFamily={FONT.title} opacity={0.85}>₿</text>
    </svg>
  );
};

// ─── 8) ExchangeArrows — zwei gebogene Pfeile bilden Kreis, rotieren einmal ──
export const ExchangeArrows: React.FC<{ size?: number; at?: number }> = ({ size = 240, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const spin = prog(f, at + 14, at + 54, E.inOut) * 360;
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{
      opacity: Math.min(p * 1.4, 1), transform: `scale(${0.85 + p * 0.15}) rotate(${spin}deg)`, transformOrigin: 'center', filter: glow(GREEN, 14),
    }}>
      <path d="M50 90 A70 70 0 0 1 180 60" fill="none" stroke={GREEN} strokeWidth={12} strokeLinecap="round" />
      <path d="M165 40 L190 60 L162 76 Z" fill={GREEN} />
      <path d="M190 150 A70 70 0 0 1 60 180" fill="none" stroke={GOLD} strokeWidth={12} strokeLinecap="round" />
      <path d="M75 200 L50 180 L78 164 Z" fill={GOLD} />
    </svg>
  );
};

// ─── 9) HouseKey — Haus-Silhouette, Schlüssel dreht sich ins Schloss ─────────
export const HouseKey: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const turn = prog(f, at + 16, at + 34, E.spring) * 90;
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 280 266" style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 22}px)`, filter: glow(GOLD, 14) }}>
      <polygon points="140,20 250,100 30,100" fill={a(GOLD, 0.85)} stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
      <rect x={45} y={100} width={190} height={150} fill={a(GOLD, 0.18)} stroke={C.white} strokeWidth={5} />
      <rect x={120} y={165} width={40} height={85} rx={4} fill={C.bgDeep} stroke={C.white} strokeWidth={4} />
      <circle cx={140} cy={205} r={9} fill={GOLD} stroke={GOLD_DK} strokeWidth={2} />
      <g transform={`translate(140 205) rotate(${turn})`} style={{ filter: glow(GOLD, 10) }}>
        <rect x={-4} y={-2} width={40} height={8} rx={4} fill={GOLD} />
        <circle cx={44} cy={2} r={13} fill="none" stroke={GOLD} strokeWidth={6} />
      </g>
    </svg>
  );
};

// ─── 10) GoalFlag — Balken wachsen, Flagge fällt auf den Gipfel ─────────────
export const GoalFlag: React.FC<{ size?: number; at?: number; bars?: number[] }> = ({
  size = 300, at = 0, bars = [0.3, 0.5, 0.7, 1],
}) => {
  const f = useCurrentFrame();
  const barW = 46, gap = 14, maxH = 200;
  const w = bars.length * (barW + gap);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${w} 260`} style={{ overflow: 'visible' }}>
      {bars.map((b, i) => {
        const p = prog(f, at + i * 8, at + i * 8 + 20, E.spring);
        const h = b * maxH * p;
        const x = i * (barW + gap);
        return <rect key={i} x={x} y={240 - h} width={barW} height={h} rx={6} fill={a(GREEN, 0.5 + i * 0.12)} stroke={C.white} strokeWidth={3} />;
      })}
      <g style={{
        opacity: prog(f, at + bars.length * 8 + 6, at + bars.length * 8 + 16, E.spring),
        transform: `translate(${(bars.length - 1) * (barW + gap) + barW / 2}px, ${40 - Math.max(0, 1 - prog(f, at + bars.length * 8 + 6, at + bars.length * 8 + 16, E.in)) * 60}px)`,
        filter: glow(GOLD, 12),
      }}>
        <line x1={0} y1={0} x2={0} y2={-70} stroke={C.white} strokeWidth={4} />
        <path d="M0 -70 L44 -60 L0 -48 Z" fill={GOLD} />
      </g>
    </svg>
  );
};

// ─── 11) RetirementSun — Sonne geht über Liegestuhl auf, warmes Gold ────────
export const RetirementSun: React.FC<{ size?: number; at?: number }> = ({ size = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 40, E.out);
  const sunY = 200 - p * 110;
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 300 255" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="vk3-sun" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFF3C4" /><stop offset="60%" stopColor={GOLD} /><stop offset="100%" stopColor="#FF8C42" />
        </radialGradient>
      </defs>
      <clipPath id="vk3-horizon"><rect x={0} y={0} width={300} height={200} /></clipPath>
      <g clipPath="url(#vk3-horizon)">
        <circle cx={150} cy={sunY} r={62} fill="url(#vk3-sun)" opacity={Math.min(1, p * 1.5)} style={{ filter: glow(GOLD, 30) }} />
      </g>
      <line x1={20} y1={200} x2={280} y2={200} stroke={a(C.white, 0.3)} strokeWidth={3} />
      {/* Liegestuhl */}
      <g opacity={Math.min(1, prog(f, at, at + 14, E.spring) * 1.4)}>
        <path d="M90 200 L110 150 L190 150 L210 200" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M110 150 L96 200" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
        <path d="M190 150 L204 200" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
        <line x1={112} y1={158} x2={188} y2={158} stroke={a('#8B5A2B', 0.8)} strokeWidth={8} />
        <line x1={116} y1={172} x2={184} y2={172} stroke={a('#8B5A2B', 0.8)} strokeWidth={8} />
        <line x1={120} y1={186} x2={180} y2={186} stroke={a('#8B5A2B', 0.8)} strokeWidth={8} />
      </g>
    </svg>
  );
};

// ─── 12) EmergencyFund — Schirm klappt sich schützend über Münzstapel ───────
export const EmergencyFund: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const coinP = prog(f, at, at + 12, E.spring);
  const umbP = prog(f, at + 10, at + 26, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      <g style={{ opacity: Math.min(coinP * 1.4, 1) }}>
        {[0, 1, 2].map((i) => <ellipse key={i} cx={140} cy={230 - i * 18} rx={54} ry={16} fill={a(GOLD, 0.85)} stroke={GOLD_DK} strokeWidth={3} />)}
      </g>
      <g style={{
        opacity: Math.min(umbP * 1.4, 1),
        transform: `translateY(${(1 - umbP) * -40}px) scale(${0.7 + umbP * 0.3})`,
        transformOrigin: '140px 120px', filter: glow(BLUE, 16),
      }}>
        <path d="M60 130 Q80 70 140 70 Q200 70 220 130 Q195 115 175 130 Q155 115 140 130 Q125 115 105 130 Q85 115 60 130 Z"
          fill={a(BLUE, 0.85)} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
        <line x1={140} y1={70} x2={140} y2={40} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
        <path d="M140 130 L140 190 Q140 205 155 205" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ─── 13) CarUnlock — Auto-Silhouette, Funkwellen pulsen beim Entsperren ─────
export const CarUnlock: React.FC<{ size?: number; at?: number }> = ({ size = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const waveP = prog(f, at + 14, at + 44, E.out);
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 300 180" style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 18}px)`, filter: glow(GREEN, 14) }}>
      {[0, 1, 2].map((i) => {
        const r = 30 + waveP * (60 + i * 24) - i * 10;
        const op = Math.max(0, (1 - waveP) * 0.5 - i * 0.1);
        return <circle key={i} cx={150} cy={100} r={Math.max(0, r)} fill="none" stroke={GREEN} strokeWidth={3} opacity={op} />;
      })}
      <path d="M40 130 L58 90 Q70 68 100 68 L200 68 Q230 68 242 90 L260 130 Z" fill="none" stroke={C.white} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      <line x1={30} y1={130} x2={270} y2={130} stroke={C.white} strokeWidth={6} strokeLinecap="round" />
      <path d="M80 90 L100 70 L150 70 L160 90 Z" fill="none" stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      <path d="M165 90 L175 70 L200 70 L216 90 Z" fill="none" stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={82} cy={132} r={18} fill={C.bgDeep} stroke={C.white} strokeWidth={5} />
      <circle cx={218} cy={132} r={18} fill={C.bgDeep} stroke={C.white} strokeWidth={5} />
    </svg>
  );
};

// ─── 14) TravelPin — Weltkarten-Kontur, Pin fällt mit Bounce auf Punkt ──────
export const TravelPin: React.FC<{ size?: number; at?: number }> = ({ size = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 160 } });
  const pc = Math.min(p, 1.3);
  const pinY = -60 + Math.min(p, 1) * 130 - Math.max(0, (p - 1)) * 0;
  const bounceY = p > 1 ? Math.sin((p - 1) * 20) * (2 - p) * 14 : 0;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 300 225" style={{ overflow: 'visible' }}>
      <g opacity={0.35} fill="none" stroke={C.white} strokeWidth={3}>
        <path d="M20 90 Q50 60 90 80 Q120 60 160 75 Q200 55 250 90 Q270 110 240 140 Q200 165 150 150 Q100 170 60 150 Q20 130 20 90 Z" />
      </g>
      <g style={{ transform: `translate(150px, ${Math.min(pinY, 90) + bounceY}px)`, filter: glow(RED, 14) }} opacity={Math.min(1, p * 2)}>
        <path d="M0 -40 C-22 -40 -36 -22 -36 0 C-36 26 0 60 0 60 C0 60 36 26 36 0 C36 -22 22 -40 0 -40 Z" fill={RED} stroke={C.white} strokeWidth={4} />
        <circle cx={0} cy={0} r={12} fill={C.white} />
      </g>
    </svg>
  );
};

// ─── 15) DreamBoard — Pinnwand, Polaroids fliegen gestaffelt schief ein ─────
export const DreamBoard: React.FC<{ size?: number; at?: number }> = ({ size = 320, at = 0 }) => {
  const f = useCurrentFrame();
  const boardP = prog(f, at, at + 12, E.spring);
  const cards = [
    { x: 40, y: 40, rot: -8 }, { x: 150, y: 30, rot: 5 }, { x: 60, y: 150, rot: 7 }, { x: 175, y: 155, rot: -6 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 320 320" style={{ overflow: 'visible' }}>
      <rect x={10} y={10} width={300} height={300} rx={16} fill={a('#8B5A2B', 0.25)} stroke={C.white} strokeWidth={4} opacity={Math.min(boardP * 1.4, 1)} />
      {cards.map((c, i) => {
        const p = prog(f, at + 14 + i * 8, at + 14 + i * 8 + 16, E.spring);
        const startY = c.y - 120;
        const y = startY + (c.y - startY) * p;
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)} transform={`translate(${c.x} ${y}) rotate(${c.rot * Math.min(1, p * 1.3)})`}>
            <rect width={80} height={92} rx={4} fill="#F4F0E6" stroke={a(C.bgDeep, 0.4)} strokeWidth={2} />
            <rect x={8} y={8} width={64} height={56} fill={a([GREEN, GOLD, BLUE, PURPLE][i % 4], 0.5)} />
          </g>
        );
      })}
    </svg>
  );
};

// ─── 16) FamilyShield — mehrere Personen stehen unter gemeinsamem Schild ────
export const FamilyShield: React.FC<{ size?: number; at?: number; members?: number }> = ({
  size = 320, at = 0, members = 3,
}) => {
  const f = useCurrentFrame();
  const shieldP = prog(f, at + members * 6, at + members * 6 + 18, E.spring);
  const cx = 160;
  const spread = 70;
  return (
    <svg width={size} height={size} viewBox="0 0 320 320" style={{ overflow: 'visible' }}>
      {Array.from({ length: members }).map((_, i) => {
        const p = prog(f, at + i * 6, at + i * 6 + 14, E.spring);
        const x = cx + (i - (members - 1) / 2) * spread;
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)} transform={`translate(${x} ${220 + (1 - p) * 20}) scale(${0.85 + p * 0.15})`}>
            <circle cx={0} cy={-40} r={22} fill={a(GREEN, 0.85)} stroke={C.white} strokeWidth={3} />
            <path d="M-24 60 Q-24 0 0 0 Q24 0 24 60 Z" fill={a(GREEN, 0.85)} stroke={C.white} strokeWidth={3} strokeLinejoin="round" />
          </g>
        );
      })}
      <g style={{ opacity: Math.min(shieldP * 1.4, 1), transform: `translateY(${(1 - shieldP) * -30}px) scale(${0.8 + shieldP * 0.2})`, transformOrigin: '160px 90px', filter: glow(BLUE, 18) }}>
        <path d="M160 20 L250 50 V110 C250 170 210 205 160 225 C110 205 70 170 70 110 V50 Z" fill={a(BLUE, 0.28)} stroke={BLUE} strokeWidth={7} strokeLinejoin="round" />
      </g>
    </svg>
  );
};
