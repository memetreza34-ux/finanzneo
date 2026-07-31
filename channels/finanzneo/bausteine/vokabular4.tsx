import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog, num, FONT } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR 4 — weitere 14 wiederkehrende Finanz-Objekte, gleicher Stil
//  wie vokabular.tsx/vokabular2.tsx/vokabular3.tsx (SVG, prog()/spring(),
//  gold=Geld, grün=Wachstum, blau=Bank, rot=Gefahr/Fehler).
//  Risiko & Fehler + Alltag & Ausgaben + Wissen & Vertrauen.
//  1) CrackedPiggy 2) RedFlagPole 3) FeeLeak 4) InflationShrink 5) DebtSpiral
//  6) ScamAlert 7) MarketCrashArrow 8) PenaltyStamp 9) ShoppingCartFill
//  10) SubscriptionStack 11) BudgetJarsSplit 12) GroceryBagCoins
//  13) RentHouseArrow 14) PayslipBreakdown
// ════════════════════════════════════════════════════════════════════════════
const GOLD = C.gold, GOLD_DK = '#B8860B', GREEN = C.green, BLUE = C.blue, RED = C.negative;
const glow = (col: string, r = 16) => `drop-shadow(0 0 ${r}px ${a(col, 0.55)})`;

// ─── 1) CrackedPiggy — Sparschwein bekommt Riss, Münzen fallen raus ─────────
export const CrackedPiggy: React.FC<{ size?: number; at?: number }> = ({ size = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const crackLen = 140;
  const crackDraw = prog(f, at + 12, at + 24, E.out);
  const coinsStart = at + 22;
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <ellipse cx={140} cy={160} rx={95} ry={68} fill={a('#FF9FBE', 0.85)} stroke={C.white} strokeWidth={5} />
      <ellipse cx={210} cy={130} rx={18} ry={14} fill={a('#FF9FBE', 0.85)} stroke={C.white} strokeWidth={4} />
      <circle cx={70} cy={150} r={12} fill="none" stroke={C.white} strokeWidth={4} />
      {[100, 140, 180].map((x) => <rect key={x} x={x - 8} y={205} width={16} height={26} rx={6} fill={a('#FF9FBE', 0.85)} stroke={C.white} strokeWidth={3} />)}
      <path d={`M100 110 L120 150 L110 160 L135 200`} fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={crackLen} strokeDashoffset={crackLen * (1 - crackDraw)} style={{ filter: glow(RED, 12) }} />
      {[0, 1, 2].map((i) => {
        const s = coinsStart + i * 8;
        const cp = prog(f, s, s + 26, E.in);
        if (cp <= 0 || cp >= 1) return null;
        const y = 190 + cp * 90;
        return <g key={i} opacity={1 - cp * 0.5} transform={`translate(${118 + i * 10} ${y})`}>
          <circle r={11} fill={GOLD} stroke={GOLD_DK} strokeWidth={2} />
        </g>;
      })}
    </svg>
  );
};

// ─── 2) RedFlagPole — rote Flagge schießt hoch, Überschwingen ──────────────
export const RedFlagPole: React.FC<{ size?: number; at?: number }> = ({ size = 240, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 8, stiffness: 220 } });
  const pc = Math.min(p, 1.2);
  const flagY = 220 - pc * 140;
  const wave = Math.sin(f * 0.2) * 6;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 240 264" style={{ overflow: 'visible', filter: glow(RED, 16) }}>
      <line x1={70} y1={30} x2={70} y2={240} stroke={C.white} strokeWidth={7} strokeLinecap="round" />
      <circle cx={70} cy={26} r={7} fill={C.white} />
      <path d={`M70 ${flagY} Q${110 + wave} ${flagY + 14} 150 ${flagY} L150 ${flagY + 60} Q${110 + wave} ${flagY + 46} 70 ${flagY + 60} Z`}
        fill={RED} stroke={C.white} strokeWidth={3} opacity={Math.min(1, pc * 2)} />
    </svg>
  );
};

// ─── 3) FeeLeak — Kontostand-Balken mit Loch, Tropfen sickern raus ─────────
export const FeeLeak: React.FC<{ size?: number; at?: number; dur?: number }> = ({ size = 260, at = 0, dur = 70 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const shrink = prog(f, at + 12, at + dur, E.inOut);
  const barH = 160 * (1 - shrink * 0.55);
  const barY = 220 - barH;
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <rect x={80} y={barY} width={100} height={barH} rx={10} fill={a(BLUE, 0.5)} stroke={C.white} strokeWidth={4} />
      <circle cx={150} cy={190} r={7} fill={C.bgDeep} stroke={RED} strokeWidth={2} />
      {Array.from({ length: 4 }).map((_, i) => {
        const s = at + 20 + i * 14;
        const dp = prog(f, s, s + 34, E.in);
        if (dp <= 0 || dp >= 1) return null;
        return <ellipse key={i} cx={150 + Math.sin(dp * 5) * 3} cy={190 + dp * 60} rx={5} ry={7} fill={RED} opacity={1 - dp * 0.6} />;
      })}
      <text x={130} y={245} textAnchor="middle" fontSize={20} fill={RED} fontFamily={FONT.body} opacity={0.85}>GEBÜHREN</text>
    </svg>
  );
};

// ─── 4) InflationShrink — Geldschein schrumpft, Kamera zoomt rein ──────────
export const InflationShrink: React.FC<{ size?: number; at?: number; dur?: number }> = ({ size = 280, at = 0, dur = 70 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const shrinkP = prog(f, at + 10, at + dur, E.inOut);
  const scale = (0.95 + p * 0.05) * (1 - shrinkP * 0.5);
  const zoom = 1 + shrinkP * 0.35;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 280 168" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible', transform: `scale(${zoom})` }}>
      <g style={{ transform: `scale(${scale})`, transformOrigin: '140px 84px', filter: glow(GREEN, 12) }}>
        <rect x={20} y={20} width={240} height={128} rx={12} fill={a(GREEN, 0.22)} stroke={GREEN} strokeWidth={5} />
        <circle cx={140} cy={84} r={44} fill="none" stroke={GREEN} strokeWidth={3} opacity={0.6} />
        <text x={140} y={98} textAnchor="middle" fontSize={44} fill={GREEN} fontFamily={FONT.title}>€</text>
      </g>
    </svg>
  );
};

// ─── 5) DebtSpiral — Münze wird spiralförmig nach innen gezogen ───────────
export const DebtSpiral: React.FC<{ size?: number; at?: number; dur?: number }> = ({ size = 280, at = 0, dur = 80 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const turns = 3;
  const ang = p * turns * Math.PI * 2;
  const r = 110 * (1 - p);
  const cx = 140, cy = 140;
  const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
  const pathPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * p;
    const rr = 110 * (1 - t), aa = t * turns * Math.PI * 2;
    pathPts.push(`${cx + Math.cos(aa) * rr},${cy + Math.sin(aa) * rr}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      <polyline points={pathPts.join(' ')} fill="none" stroke={a(RED, 0.4)} strokeWidth={2} />
      <g transform={`translate(${x} ${y})`} style={{ filter: glow(RED, 14) }}>
        <circle r={20} fill={GOLD} stroke={RED} strokeWidth={4} />
        <text y={7} textAnchor="middle" fontSize={20} fill="#7A5200" fontFamily={FONT.title}>€</text>
      </g>
      <circle cx={cx} cy={cy} r={6} fill={RED} opacity={0.7} />
    </svg>
  );
};

// ─── 6) ScamAlert — Masken-/Haken-Form, rot pulsierender Warnrahmen ────────
export const ScamAlert: React.FC<{ size?: number; at?: number }> = ({ size = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const pulse = 0.6 + Math.sin(Math.max(0, f - at) * 0.22) * 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <rect x={20} y={20} width={220} height={220} rx={24} fill="none" stroke={RED} strokeWidth={7} opacity={Math.max(0.15, pulse)}
        style={{ filter: glow(RED, 22 * pulse) }} />
      <path d="M90 90 Q130 60 170 90 Q190 130 170 175 Q130 200 90 175 Q70 130 90 90 Z"
        fill={a(RED, 0.18)} stroke={RED} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={112} cy={120} r={7} fill={RED} />
      <circle cx={148} cy={120} r={7} fill={RED} />
      <path d="M108 155 Q130 140 152 155" fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

// ─── 7) MarketCrashArrow — kantige rote Blitz-Linie bricht ab, Funken ──────
export const MarketCrashArrow: React.FC<{ size?: number; at?: number }> = ({ size = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const draw = prog(f, at, at + 20, E.in);
  const pathLen = 420;
  const impact = at + 20;
  const sparkP = prog(f, impact, impact + 16, E.out);
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
      <path d="M20 40 L100 60 L70 110 L160 130 L120 190 L230 260" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - draw)} style={{ filter: glow(RED, 18) }} />
      {f >= impact && Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2;
        const d = sparkP * 40;
        return <line key={i} x1={230} y1={260} x2={230 + Math.cos(ang) * d} y2={260 + Math.sin(ang) * d}
          stroke={GOLD} strokeWidth={3} opacity={1 - sparkP} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// ─── 8) PenaltyStamp — roter Stempel schlägt mit Rotation ein ─────────────
export const PenaltyStamp: React.FC<{ size?: number; at?: number; text?: string }> = ({
  size = 280, at = 0, text = 'STORNIERT',
}) => {
  const f = useCurrentFrame();
  const docP = prog(f, at, at + 10, E.spring);
  const impact = at + 18;
  const drop = prog(f, at + 6, impact, E.in);
  const startRot = -50, endRot = -18;
  const rot = startRot + (endRot - startRot) * drop;
  const stampScale = -160 + drop * 160;
  const shakeT = Math.max(0, f - impact);
  const shake = shakeT < 10 ? Math.sin(shakeT * 2.4) * (10 - shakeT) * 0.5 : 0;
  const ringP = prog(f, impact, impact + 10, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
      <g style={{ opacity: Math.min(docP * 1.4, 1), transform: `translateX(${shake}px)` }}>
        <rect x={30} y={70} width={220} height={160} rx={10} fill={a(C.white, 0.08)} stroke={C.white} strokeWidth={4} />
        {[105, 135, 165, 195].map((y) => <rect key={y} x={52} y={y} width={150} height={7} rx={3} fill={a(C.white, 0.25)} />)}
      </g>
      <g style={{ opacity: f >= impact ? 1 : 0, transform: `translateY(${stampScale}px) rotate(${rot}deg)`, transformOrigin: '140px 150px' }}>
        <circle cx={140} cy={150} r={62} fill="none" stroke={RED} strokeWidth={8} opacity={ringP} style={{ filter: glow(RED, 20) }} />
        <text x={140} y={158} textAnchor="middle" fontSize={26} fill={RED} fontFamily={FONT.title} opacity={ringP} letterSpacing={1}>{text}</text>
      </g>
    </svg>
  );
};

// ─── 9) ShoppingCartFill — Wagen füllt sich, Summe zählt hoch ─────────────
export const ShoppingCartFill: React.FC<{ size?: number; at?: number; items?: number; total?: number }> = ({
  size = 300, at = 0, items = 5, total = 68,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const countP = prog(f, at + 12, at + 50, E.out);
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 300 255" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <path d="M40 60 H70 L95 170 H230 L255 90 H85" fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={110} cy={200} r={14} fill="none" stroke={C.white} strokeWidth={6} />
      <circle cx={215} cy={200} r={14} fill="none" stroke={C.white} strokeWidth={6} />
      {Array.from({ length: items }).map((_, i) => {
        const ip = prog(f, at + 14 + i * 6, at + 14 + i * 6 + 12, E.spring);
        const x = 105 + (i % 3) * 40, y = 100 - Math.floor(i / 3) * 34;
        return <rect key={i} x={x} y={y} width={28} height={28} rx={5} fill={a([GREEN, GOLD, BLUE][i % 3], 0.85)} stroke={C.white} strokeWidth={2}
          opacity={Math.min(ip * 1.4, 1)} transform={`translate(0 ${(1 - ip) * -20})`} />;
      })}
      <text x={150} y={245} textAnchor="middle" fontSize={30} fill={GREEN} fontFamily={FONT.title} style={{ filter: glow(GREEN, 8) }}>{Math.round(total * countP)} €</text>
    </svg>
  );
};

// ─── 10) SubscriptionStack — Karten stapeln versetzt, eine wird weggewischt ─
export const SubscriptionStack: React.FC<{ size?: number; at?: number; count?: number }> = ({
  size = 260, at = 0, count = 4,
}) => {
  const f = useCurrentFrame();
  const cancelStart = at + count * 6 + 12;
  const swipeP = prog(f, cancelStart, cancelStart + 24, E.in);
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, i) => {
        const p = prog(f, at + i * 6, at + i * 6 + 14, E.spring);
        const isTop = i === count - 1;
        const x = 60 + i * 14 - (isTop ? swipeP * 300 : 0);
        const y = 60 + i * 12;
        const rotDeg = isTop ? swipeP * -20 : 0;
        const col = [BLUE, GOLD, C.purple, GREEN][i % 4];
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1) * (isTop ? 1 - swipeP * 0.3 : 1)} transform={`translate(${x} ${y}) rotate(${rotDeg})`}>
            <rect width={140} height={90} rx={12} fill={a(col, 0.85)} stroke={C.white} strokeWidth={3} />
            <rect x={16} y={16} width={60} height={10} rx={5} fill={a(C.white, 0.7)} />
            <rect x={16} y={40} width={40} height={8} rx={4} fill={a(C.white, 0.4)} />
          </g>
        );
      })}
    </svg>
  );
};

// ─── 11) BudgetJarsSplit — Geldschein teilt sich auf 3 Gläser auf ─────────
export const BudgetJarsSplit: React.FC<{ size?: number; at?: number }> = ({ size = 320, at = 0 }) => {
  const f = useCurrentFrame();
  const billP = prog(f, at, at + 12, E.spring);
  const splitP = prog(f, at + 12, at + 30, E.inOut);
  const jars = [{ x: 60, col: GREEN }, { x: 160, col: GOLD }, { x: 260, col: BLUE }];
  return (
    <svg width={size} height={size} viewBox="0 0 320 320" style={{ overflow: 'visible' }}>
      <g style={{ opacity: Math.min(billP * 1.4, 1) * (1 - splitP), transform: `translateY(${splitP * 20}px)` }}>
        <rect x={110} y={40} width={100} height={54} rx={8} fill={a(GREEN, 0.7)} stroke={C.white} strokeWidth={4} />
        <text x={160} y={76} textAnchor="middle" fontSize={26} fill={C.white} fontFamily={FONT.title}>€</text>
      </g>
      {jars.map((j, i) => {
        const p = prog(f, at + 20 + i * 6, at + 20 + i * 6 + 20, E.spring);
        const fillLvl = 60 * p;
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)}>
            <rect x={j.x - 34} y={200} width={68} height={90} rx={14} fill="none" stroke={C.white} strokeWidth={4} />
            <rect x={j.x - 30} y={290 - fillLvl} width={60} height={fillLvl} rx={8} fill={a(j.col, 0.75)} style={{ filter: glow(j.col, 8) }} />
            <rect x={j.x - 40} y={190} width={80} height={14} rx={6} fill="none" stroke={C.white} strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};

// ─── 12) GroceryBagCoins — Einkaufstüte, Zahl zählt mit Münz-Icons hoch ────
export const GroceryBagCoins: React.FC<{ size?: number; at?: number; total?: number }> = ({
  size = 280, at = 0, total = 42,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const countP = prog(f, at + 14, at + 48, E.out);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <path d="M70 100 L60 230 Q60 246 76 246 H204 Q220 246 220 230 L210 100 Z" fill={a(GOLD, 0.2)} stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
      <path d="M100 100 V80 Q100 50 140 50 Q180 50 180 80 V100" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
      <line x1={70} y1={140} x2={210} y2={140} stroke={a(C.white, 0.3)} strokeWidth={3} />
      {[0, 1, 2].map((i) => {
        const cp = prog(f, at + 14 + i * 4, at + 14 + i * 4 + 10, E.spring);
        return <circle key={i} cx={110 + i * 30} cy={190} r={12} fill={GOLD} stroke={GOLD_DK} strokeWidth={2}
          opacity={Math.min(cp * 1.4, 1)} transform={`translate(0 ${(1 - cp) * 20})`} />;
      })}
      <text x={140} y={40} textAnchor="middle" fontSize={30} fill={GREEN} fontFamily={FONT.title} style={{ filter: glow(GREEN, 8) }}>{Math.round(total * countP)} €</text>
    </svg>
  );
};

// ─── 13) RentHouseArrow — Haus, monatlicher Pfeil zieht Betrag heraus ──────
export const RentHouseArrow: React.FC<{ size?: number; at?: number; amount?: number }> = ({
  size = 280, at = 0, amount = 950,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const arrowP = prog(f, at + 12, at + 36, E.out);
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <polygon points="140,30 240,100 40,100" fill={a(BLUE, 0.8)} stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
      <rect x={55} y={100} width={170} height={130} fill={a(BLUE, 0.18)} stroke={C.white} strokeWidth={5} />
      <rect x={122} y={160} width={36} height={70} fill={C.bgDeep} stroke={C.white} strokeWidth={4} />
      <g style={{ opacity: Math.min(1, arrowP * 2), transform: `translateX(${arrowP * 90}px)`, filter: glow(RED, 10) }}>
        <line x1={140} y1={190} x2={220} y2={190} stroke={RED} strokeWidth={6} strokeLinecap="round" />
        <path d="M212 178 L230 190 L212 202 Z" fill={RED} />
      </g>
      <text x={140} y={268} textAnchor="middle" fontSize={26} fill={RED} fontFamily={FONT.title} opacity={Math.min(1, arrowP * 2)}>-{num(amount)} €</text>
    </svg>
  );
};

// ─── 14) PayslipBreakdown — Gehaltszettel: Brutto → Netto ─────────────────
export const PayslipBreakdown: React.FC<{ size?: number; at?: number; brutto?: number; netto?: number }> = ({
  size = 300, at = 0, brutto = 3800, netto = 2450,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const splitP = prog(f, at + 12, at + 30, E.spring);
  const maxW = 220;
  const bruttoW = maxW;
  const nettoW = maxW * (netto / brutto);
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 300 240" style={{ opacity: Math.min(p * 1.4, 1), overflow: 'visible' }}>
      <text x={20} y={40} fontSize={22} fill={a(C.white, 0.6)} fontFamily={FONT.body}>Brutto</text>
      <rect x={20} y={50} width={bruttoW} height={40} rx={8} fill={a(C.gray, 0.4)} stroke={C.white} strokeWidth={3} />
      <text x={20 + bruttoW + 10} y={78} fontSize={24} fill={C.white} fontFamily={FONT.title}>{num(brutto)} €</text>
      <g style={{ opacity: splitP }}>
        <text x={20} y={140} fontSize={22} fill={GREEN} fontFamily={FONT.body}>Netto</text>
        <rect x={20} y={150} width={nettoW * splitP} height={40} rx={8} fill={a(GREEN, 0.85)} stroke={C.white} strokeWidth={3} style={{ filter: glow(GREEN, 10) }} />
        <text x={20 + nettoW * splitP + 10} y={178} fontSize={24} fill={GREEN} fontFamily={FONT.title}>{num(Math.round(netto * splitP))} €</text>
      </g>
    </svg>
  );
};
