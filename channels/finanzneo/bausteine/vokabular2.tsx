import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog, num, FONT } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR 2 — weitere 13 wiederkehrende Finanz-Objekte, gleicher Stil
//  wie vokabular.tsx (SVG, prog()/spring(), gold=Geld, grün=Wachstum, blau=Bank).
//  1) CardTap 2) CoinFlip 3) GoldBarStack 4) ShieldProtect 5) ATMWithdraw
//  6) ContractSign 7) ReceiptPrint 8) TaxStamp 9) HandshakeDeal 10) WalletBulge
//  11) CalculatorType 12) PaycheckSlide 13) TickerTape
// ════════════════════════════════════════════════════════════════════════════
const GOLD = C.gold, GOLD_DK = '#B8860B', GREEN = C.green, BLUE = C.blue, RED = C.negative;
const glow = (col: string, r = 16) => `drop-shadow(0 0 ${r}px ${a(col, 0.55)})`;

// ─── 1) CardTap — Karte tippt aufs Terminal, Haken leuchtet auf ──────────────
export const CardTap: React.FC<{ size?: number; at?: number }> = ({ size = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, E.spring);
  const y = -30 + p * 200;
  const tilt = (1 - p) * -10;
  const hit = prog(f, at + 18, at + 30, E.out);
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 260 390" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="vk2-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD} /><stop offset="100%" stopColor={GREEN} />
        </linearGradient>
      </defs>
      {/* Terminal */}
      <rect x={30} y={260} width={200} height={110} rx={16} fill="#232B31" stroke={C.white} strokeWidth={5} />
      <rect x={54} y={280} width={152} height={54} rx={8} fill={hit > 0.05 ? a(GREEN, 0.25) : '#0E161B'} stroke={a(C.white, 0.3)} strokeWidth={3} />
      <g opacity={hit}>
        <path d="M96 308 L120 328 L166 288" fill="none" stroke={GREEN} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: glow(GREEN, 16) }} />
      </g>
      <rect x={98} y={342} width={64} height={10} rx={5} fill={a(C.white, 0.35)} />
      {/* Karte */}
      <g style={{ transform: `translateY(${y}px) rotate(${tilt}deg)`, transformOrigin: '130px 150px', filter: glow(GOLD, 16) }}>
        <rect x={45} y={40} width={170} height={110} rx={16} fill="url(#vk2-card)" stroke={C.white} strokeWidth={4} />
        <rect x={45} y={80} width={170} height={16} fill={a(C.bgDeep, 0.5)} />
        <rect x={62} y={112} width={60} height={10} rx={5} fill={a(C.white, 0.8)} />
        <circle cx={186} cy={62} r={10} fill={a(C.white, 0.6)} />
        <circle cx={172} cy={62} r={10} fill={a(C.white, 0.4)} />
      </g>
    </svg>
  );
};

// ─── 2) CoinFlip — Münze rotiert um Y-Achse, zeigt Vorder-/Rückseite ─────────
export const CoinFlip: React.FC<{ size?: number; at?: number; labelFront?: string; labelBack?: string }> = ({
  size = 200, at = 0, labelFront = '€', labelBack = '$',
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 55, E.out);
  const angleDeg = p * (3 * 360);
  const rad = (angleDeg * Math.PI) / 180;
  const scaleX = Math.cos(rad);
  const front = scaleX >= 0;
  const bob = -Math.sin(p * Math.PI) * 40;
  const lift = prog(f, at, at + 10, E.spring);
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: 'visible' }}>
      <ellipse cx={100} cy={230} rx={44} ry={8} fill="rgba(0,0,0,0.28)" opacity={lift} />
      <g style={{ transform: `translateY(${bob + (1 - lift) * 30}px) scaleX(${Math.max(0.06, Math.abs(scaleX))})`, transformOrigin: '100px 120px', opacity: lift }}>
        <circle cx={100} cy={120} r={80} fill={front ? `url(#vk2-coinF)` : `url(#vk2-coinB)`} stroke={GOLD_DK} strokeWidth={5} style={{ filter: glow(GOLD, 18) }} />
        <circle cx={100} cy={120} r={64} fill="none" stroke="#FFF3C4" strokeWidth={3} opacity={0.5} />
        <text x={100} y={144} textAnchor="middle" fontSize={78} fill="#7A5200" fontFamily={FONT.title}>{front ? labelFront : labelBack}</text>
      </g>
      <defs>
        <radialGradient id="vk2-coinF" cx="38%" cy="33%" r="75%">
          <stop offset="0%" stopColor="#FFEDB0" /><stop offset="55%" stopColor={GOLD} /><stop offset="100%" stopColor={GOLD_DK} />
        </radialGradient>
        <radialGradient id="vk2-coinB" cx="62%" cy="33%" r="75%">
          <stop offset="0%" stopColor="#FFF6D8" /><stop offset="55%" stopColor="#E8C34F" /><stop offset="100%" stopColor={GOLD_DK} />
        </radialGradient>
      </defs>
    </svg>
  );
};

// ─── 3) GoldBarStack — Goldbarren stapeln sich mit Bounce ────────────────────
export const GoldBarStack: React.FC<{ size?: number; at?: number; count?: number }> = ({ size = 260, at = 0, count = 4 }) => {
  const f = useCurrentFrame();
  const barH = 46, gap = 8, w = 210, wTop = 176;
  const totalH = count * (barH + gap);
  return (
    <svg width={size} height={size} viewBox={`0 0 240 ${totalH + 40}`} style={{ overflow: 'visible', filter: glow(GOLD, 14) }}>
      <defs>
        <linearGradient id="vk2-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFEDB0" /><stop offset="45%" stopColor={GOLD} /><stop offset="100%" stopColor={GOLD_DK} />
        </linearGradient>
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const idx = count - 1 - i; // unterste zuerst
        const p = prog(f, at + idx * 8, at + idx * 8 + 16, E.spring);
        const y = totalH - (idx + 1) * (barH + gap) + 10;
        const dx = (w - wTop) / 2;
        return (
          <g key={i} opacity={Math.min(p * 1.4, 1)} style={{ transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + p * 0.2})`, transformOrigin: `120px ${y + barH / 2}px` }}>
            <polygon points={`${120 - w / 2},${y + barH} ${120 + w / 2},${y + barH} ${120 + wTop / 2},${y} ${120 - wTop / 2},${y}`}
              fill="url(#vk2-gold)" stroke={GOLD_DK} strokeWidth={3} strokeLinejoin="round" />
            <text x={120} y={y + barH * 0.7} textAnchor="middle" fontSize={20} fill="#5A3D00" fontFamily={FONT.body} opacity={0.8}>999.9</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── 4) ShieldProtect — Schild faded ein, Haken pulst (Absicherung) ─────────
export const ShieldProtect: React.FC<{ size?: number; at?: number; color?: string }> = ({ size = 260, at = 0, color = BLUE }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const pulse = prog(f, at + 14, at + 26, E.spring);
  const loop = Math.sin(Math.max(0, f - (at + 26)) * 0.12) * 0.06 + 1;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 240 276" style={{
      opacity: Math.min(p * 1.4, 1),
      transform: `translateY(${(1 - p) * 24}px) scale(${0.82 + p * 0.18})`,
      filter: glow(color, 20),
    }}>
      <path d="M120 10 L220 46 V126 C220 196 176 240 120 266 C64 240 20 196 20 126 V46 Z"
        fill={a(color, 0.22)} stroke={color} strokeWidth={7} strokeLinejoin="round" />
      <g style={{ opacity: pulse, transform: `scale(${pulse < 1 ? 0.6 + pulse * 0.4 : loop})`, transformOrigin: '120px 140px' }}>
        <path d="M78 140 L108 170 L166 100" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: glow(color, 14) }} />
      </g>
    </svg>
  );
};

// ─── 5) ATMWithdraw — Banknote fährt aus dem Automaten heraus ────────────────
export const ATMWithdraw: React.FC<{ size?: number; at?: number }> = ({ size = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const outP = prog(f, at + 12, at + 30, E.out);
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 240 288" style={{
      opacity: Math.min(p * 1.4, 1), transform: `scale(${0.85 + p * 0.15})`,
    }}>
      <rect x={20} y={20} width={200} height={248} rx={20} fill="#232B31" stroke={C.white} strokeWidth={5} style={{ filter: glow(BLUE, 12) }} />
      <rect x={44} y={46} width={152} height={92} rx={10} fill={a(BLUE, 0.18)} stroke={a(C.white, 0.3)} strokeWidth={3} />
      <text x={120} y={98} textAnchor="middle" fontSize={22} fill={a(C.white, 0.8)} fontFamily={FONT.body}>AUSZAHLUNG</text>
      <rect x={70} y={162} width={100} height={14} rx={6} fill="#0E161B" stroke={a(C.white, 0.3)} strokeWidth={2} />
      <clipPath id="vk2-slot"><rect x={70} y={162} width={100} height={80} /></clipPath>
      <g clipPath="url(#vk2-slot)">
        <rect x={78} y={242 - outP * 92} width={84} height={44} rx={5} fill={a(GREEN, 0.9)} stroke="#0F5C2E" strokeWidth={3} style={{ filter: glow(GREEN, 10) }} />
      </g>
      <rect x={70} y={162} width={100} height={14} rx={6} fill="#0E161B" stroke={a(C.white, 0.3)} strokeWidth={2} />
      {outP > 0.55 && (
        <text x={120} y={162 - (outP - 0.55) * 92} textAnchor="middle" fontSize={26} fill={C.white} fontFamily={FONT.title} opacity={Math.min(1, (outP - 0.55) * 3)}>€</text>
      )}
    </svg>
  );
};

// ─── 6) ContractSign — Unterschrift zeichnet sich selbst ─────────────────────
export const ContractSign: React.FC<{ size?: number; at?: number; w?: number; h?: number }> = ({
  size = 260, at = 0, w = 240, h = 300,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const sigPath = 'M50 60 C70 20 90 20 100 45 C110 70 90 75 95 55 C100 35 130 20 150 45 C170 70 150 80 160 55 C168 34 185 40 190 55';
  const sigLen = 320;
  const draw = prog(f, at + 12, at + 42, E.inOut);
  return (
    <svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`} style={{
      opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 20}px) scale(${0.9 + p * 0.1})`, filter: glow(BLUE, 12),
    }}>
      <rect x={10} y={10} width={w - 20} height={h - 20} rx={14} fill={a(C.white, 0.06)} stroke={C.white} strokeWidth={4} />
      {[70, 100, 130, 160].map((y) => <rect key={y} x={30} y={y} width={w - 100} height={6} rx={3} fill={a(C.white, 0.25)} />)}
      <line x1={30} y1={h - 70} x2={w - 30} y2={h - 70} stroke={a(C.white, 0.3)} strokeWidth={2} />
      <g transform={`translate(15 ${h - 240})`}>
        <path d={sigPath} fill="none" stroke={GREEN} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={sigLen} strokeDashoffset={sigLen * (1 - draw)} style={{ filter: glow(GREEN, 10) }} />
      </g>
    </svg>
  );
};

// ─── 7) ReceiptPrint — Kassenbon schiebt sich heraus, Summe grün ─────────────
export const ReceiptPrint: React.FC<{ size?: number; at?: number; lines?: number }> = ({ size = 220, at = 0, lines = 4 }) => {
  const f = useCurrentFrame();
  const w = 180, lineH = 22, top = 20, bodyH = 40 + lines * lineH + 30;
  const outP = prog(f, at, at + 26, E.out);
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 220 290" style={{ overflow: 'visible' }}>
      <rect x={20} y={0} width={w} height={18} rx={4} fill="#232B31" stroke={C.white} strokeWidth={4} />
      <clipPath id="vk2-slotR"><rect x={0} y={18} width={220} height={272} /></clipPath>
      <g clipPath="url(#vk2-slotR)" style={{ transform: `translateY(${(1 - outP) * -bodyH}px)` }}>
        <g transform={`translate(20 18)`}>
          <path d={`M0 0 H${w} V${bodyH - 10} L${w - 10} ${bodyH} L${w - 30} ${bodyH - 10} L${w - 50} ${bodyH} L${w - 70} ${bodyH - 10} L${w - 90} ${bodyH} L${w - 110} ${bodyH - 10} L${w - 130} ${bodyH} L${w - 150} ${bodyH - 10} L${w - 170} ${bodyH} L${w - 180} ${bodyH - 10} Z`}
            fill="#F4F0E6" stroke={a(C.bgDeep, 0.4)} strokeWidth={2} />
          {Array.from({ length: lines }).map((_, i) => {
            const lp = prog(f, at + 14 + i * 6, at + 14 + i * 6 + 10, E.out);
            const isLast = i === lines - 1;
            return (
              <g key={i} opacity={lp}>
                <rect x={16} y={30 + i * lineH} width={80} height={7} rx={3} fill={isLast ? GREEN : a(C.bgDeep, 0.45)} />
                <rect x={w - 60} y={30 + i * lineH} width={44} height={7} rx={3} fill={isLast ? GREEN : a(C.bgDeep, 0.35)} />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
};

// ─── 8) TaxStamp — Stempel schlägt mit Impact auf Dokument ───────────────────
export const TaxStamp: React.FC<{ size?: number; at?: number; text?: string; color?: string }> = ({
  size = 260, at = 0, text = 'OK', color = RED,
}) => {
  const f = useCurrentFrame();
  const docP = prog(f, at, at + 10, E.spring);
  const impact = at + 16;
  const drop = prog(f, at + 6, impact, E.in);
  const stampY = -140 + drop * 140;
  const shakeT = Math.max(0, f - impact);
  const shake = shakeT < 10 ? Math.sin(shakeT * 2.4) * (10 - shakeT) * 0.5 : 0;
  const stampScale = f < impact ? 1 : Math.min(1.15, 1 + Math.max(0, 8 - (f - impact)) * 0.02);
  const ringP = prog(f, impact, impact + 10, E.spring);
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ overflow: 'visible' }}>
      <g style={{ opacity: Math.min(docP * 1.4, 1), transform: `translateX(${shake}px)` }}>
        <rect x={30} y={70} width={200} height={150} rx={10} fill={a(C.white, 0.08)} stroke={C.white} strokeWidth={4} />
        {[100, 128, 156].map((y) => <rect key={y} x={50} y={y} width={140} height={7} rx={3} fill={a(C.white, 0.25)} />)}
      </g>
      <g style={{ opacity: f >= impact ? 1 : 0, transform: `translateY(${stampY}px) rotate(-14deg) scale(${stampScale})`, transformOrigin: '130px 150px' }}>
        <circle cx={130} cy={150} r={54} fill="none" stroke={color} strokeWidth={8} opacity={ringP} style={{ filter: glow(color, 18) }} />
        <circle cx={130} cy={150} r={40} fill="none" stroke={color} strokeWidth={3} opacity={ringP * 0.7} />
        <text x={130} y={162} textAnchor="middle" fontSize={40} fill={color} fontFamily={FONT.title} opacity={ringP}>{text}</text>
      </g>
    </svg>
  );
};

// ─── 9) HandshakeDeal — zwei Hände gleiten zur Mitte, Deal ───────────────────
export const HandshakeDeal: React.FC<{ size?: number; at?: number }> = ({ size = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 130 } });
  const pc = Math.min(p, 1);
  const leftX = -120 * (1 - pc);
  const rightX = 120 * (1 - pc);
  const grip = prog(f, at + 16, at + 24, E.spring);
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 300 210" style={{ overflow: 'visible', filter: glow(GOLD, 14) }}>
      <g style={{ transform: `translateX(${leftX}px)`, opacity: Math.min(pc * 1.4, 1) }}>
        <path d="M10 130 C10 100 40 90 70 100 L150 118 C160 120 162 132 152 136 L86 128 C76 126 70 132 78 140 L140 150 C150 152 150 164 140 165 L90 158 C82 157 78 163 86 168 L120 174 C128 176 126 186 118 186 L70 178 C40 173 10 160 10 130 Z"
          fill={a(GOLD, 0.85)} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <g style={{ transform: `translateX(${rightX}px) scaleX(-1)`, transformOrigin: '150px 0px', opacity: Math.min(pc * 1.4, 1) }}>
        <path d="M10 130 C10 100 40 90 70 100 L150 118 C160 120 162 132 152 136 L86 128 C76 126 70 132 78 140 L140 150 C150 152 150 164 140 165 L90 158 C82 157 78 163 86 168 L120 174 C128 176 126 186 118 186 L70 178 C40 173 10 160 10 130 Z"
          fill={a(BLUE, 0.85)} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <circle cx={150} cy={140} r={16} fill={GREEN} opacity={grip} style={{ filter: glow(GREEN, 16) }} />
    </svg>
  );
};

// ─── 10) WalletBulge — Geldbörse, Scheine poppen gestaffelt heraus ──────────
export const WalletBulge: React.FC<{ size?: number; at?: number; count?: number }> = ({ size = 260, at = 0, count = 3 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 260 234" style={{ overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, i) => {
        const bp = prog(f, at + 8 + i * 6, at + 8 + i * 6 + 14, E.spring);
        const x = 90 + i * 26;
        return (
          <g key={i} opacity={Math.min(bp * 1.4, 1)} style={{ transform: `translateY(${(1 - bp) * 30}px) rotate(${-8 + i * 8}deg)`, transformOrigin: `${x + 15}px 110px` }}>
            <rect x={x} y={40} width={78} height={44} rx={6} fill={a(GREEN, 0.9)} stroke={C.white} strokeWidth={3} style={{ filter: glow(GREEN, 8) }} />
            <text x={x + 39} y={68} textAnchor="middle" fontSize={22} fill={C.white} fontFamily={FONT.title}>€</text>
          </g>
        );
      })}
      <g style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 20}px)`, filter: glow(GOLD_DK, 14) }}>
        <path d="M20 110 Q130 90 240 110 L236 210 Q130 230 24 210 Z" fill="#5A3D1E" stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
        <path d="M20 110 Q130 128 240 110" fill="none" stroke={a(C.white, 0.3)} strokeWidth={3} />
        <circle cx={130} cy={160} r={12} fill={GOLD} stroke={GOLD_DK} strokeWidth={3} />
      </g>
    </svg>
  );
};

// ─── 11) CalculatorType — Tasten leuchten, Display zählt hoch ───────────────
export const CalculatorType: React.FC<{ size?: number; at?: number; targetValue?: number }> = ({
  size = 240, at = 0, targetValue = 1250,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const keys = Array.from({ length: 12 }).map((_, i) => i);
  const countP = prog(f, at + 8, at + 46, E.out);
  const shown = Math.round(targetValue * countP);
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 240 312" style={{
      opacity: Math.min(p * 1.4, 1), transform: `scale(${0.85 + p * 0.15})`, filter: glow(GREEN, 12),
    }}>
      <rect x={20} y={10} width={200} height={292} rx={20} fill="#232B31" stroke={C.white} strokeWidth={5} />
      <rect x={40} y={30} width={160} height={54} rx={8} fill="#0E161B" stroke={a(C.white, 0.3)} strokeWidth={3} />
      <text x={192} y={68} textAnchor="end" fontSize={34} fill={GREEN} fontFamily={FONT.title} style={{ filter: glow(GREEN, 10) }}>{num(shown)}</text>
      {keys.map((i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const kx = 46 + col * 52, ky = 100 + row * 48;
        const lit = prog(f, at + 10 + i * 3, at + 10 + i * 3 + 10, E.spring) * (1 - prog(f, at + 10 + i * 3 + 8, at + 10 + i * 3 + 18, E.out));
        return <rect key={i} x={kx} y={ky} width={40} height={36} rx={8} fill={a(GREEN, 0.15 + Math.max(0, lit) * 0.7)}
          stroke={a(C.white, 0.3)} strokeWidth={2} />;
      })}
    </svg>
  );
};

// ─── 12) PaycheckSlide — Umschlag slidet rein, zeigt Betrag ─────────────────
export const PaycheckSlide: React.FC<{ size?: number; at?: number; amount?: number; dur?: number }> = ({
  size = 300, at = 0, amount = 2400, dur = 60,
}) => {
  const f = useCurrentFrame();
  const inP = prog(f, at, at + 16, E.spring);
  const outP = prog(f, at + dur - 14, at + dur, E.in);
  const x = -320 * (1 - inP) + 320 * outP;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 300 180" style={{ overflow: 'visible' }}>
      <g style={{ transform: `translateX(${x}px)`, filter: glow(GOLD, 14) }}>
        <rect x={20} y={20} width={260} height={140} rx={14} fill={a(GOLD, 0.14)} stroke={C.white} strokeWidth={5} />
        <path d="M20 20 L150 100 L280 20" fill="none" stroke={C.white} strokeWidth={4} />
        <text x={150} y={140} textAnchor="middle" fontSize={38} fill={C.white} fontFamily={FONT.title}>{num(amount)} €</text>
      </g>
    </svg>
  );
};

// ─── 13) TickerTape — endlos scrollendes Kursband, frame-exakt ──────────────
export const TickerTape: React.FC<{ items: { symbol: string; change: number }[]; at?: number; w?: number; speed?: number }> = ({
  items, at = 0, w = 900, speed = 3.2,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.out);
  const itemW = 190;
  const setW = items.length * itemW;
  const shift = Math.max(0, f - at) * speed;
  const offset = -(shift % setW);
  const rows = [...items, ...items, ...items]; // genug fürs Loop-Wrap
  return (
    <svg width={w} height={90} viewBox={`0 0 ${w} 90`} style={{ opacity: p }}>
      <clipPath id="vk2-ticker"><rect x={0} y={0} width={w} height={90} rx={12} /></clipPath>
      <rect x={0} y={0} width={w} height={90} rx={12} fill={a(C.bgDeep, 0.6)} stroke={a(C.white, 0.2)} strokeWidth={2} />
      <g clipPath="url(#vk2-ticker)">
        <g style={{ transform: `translateX(${offset}px)` }}>
          {rows.map((it, i) => {
            const up = it.change >= 0;
            const col = up ? GREEN : RED;
            const x = i * itemW + 20;
            return (
              <g key={i} transform={`translate(${x} 0)`}>
                <text x={0} y={38} fontSize={26} fill={C.white} fontFamily={FONT.title}>{it.symbol}</text>
                <text x={0} y={66} fontSize={22} fill={col} fontFamily={FONT.body}>{up ? '▲' : '▼'} {Math.abs(it.change).toFixed(1)}%</text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
};
