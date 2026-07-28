import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C as BRAND_C, PREMIUM} from '../brand/tokens';
import {FONT} from '../brand/fonts';

// Kompatibilitäts-Aliase für bestehende Premium-Bausteine.
// Neue Produktionsdateien importieren direkt aus src/design-system.
export const bebas = FONT.title;
export const inter = FONT.body;

// Frühere Baustein-Farbnamen bleiben erhalten, stammen aber vollständig
// aus der zentralen FinanzNeo-Palette in src/brand/tokens.ts.
export const C = {
  bg: BRAND_C.bg,
  bgDeep: BRAND_C.bgDeep,
  ink: BRAND_C.white,
  muted: BRAND_C.gray,
  green: BRAND_C.accent,
  greenLt: BRAND_C.accentLt,
  gold: BRAND_C.gold,
  goldLt: BRAND_C.goldLt,
  blue: BRAND_C.blue,
  red: BRAND_C.negative,
  purple: BRAND_C.purple,
} as const;

// Disziplinierte Premium-Palette. Ebenfalls nur ein Alias auf zentrale Tokens.
export const P = {
  ink: PREMIUM.ink,
  muted: PREMIUM.muted,
  line: PREMIUM.line,
  green: PREMIUM.positive,
  greenLt: PREMIUM.positiveLight,
  greenDeep: PREMIUM.positiveDeep,
  gold: PREMIUM.money,
  loss: PREMIUM.loss,
} as const;

export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
};

// Driftender Farb-Blob mit echtem Gaussian-Blur.
const Blob: React.FC<{cx: number; cy: number; size: number; color: string; px: number}> =
({cx, cy, size, color, px}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', width: size, height: size, borderRadius: '50%',
    left: cx + Math.sin((f + px) / 55) * 140, top: cy + Math.cos((f + px) / 65) * 120,
    background: `radial-gradient(circle, ${color}, transparent 65%)`, filter: 'blur(90px)', opacity: 0.55}} />;
};

// Lebender FinanzNeo-Hintergrund für Showcases und bewusst dynamische Szenen.
export const AuroraBG: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${BRAND_C.surface}, ${C.bgDeep} 72%)`}}>
      <Blob cx={300} cy={300} size={620} color={C.green} px={0} />
      <Blob cx={1500} cy={760} size={680} color={C.gold} px={60} />
      <Blob cx={760} cy={900} size={560} color={C.blue} px={120} />
      <AbsoluteFill style={{
        background: `conic-gradient(from ${f * 0.4}deg at 50% 42%, rgba(0,210,106,0.10), transparent 38%, rgba(255,200,61,0.08), transparent 80%)`}} />
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
        backgroundSize: '64px 64px',
        WebkitMaskImage: 'radial-gradient(circle at 50% 42%, black, transparent 72%)'}} />
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'overlay',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 50%, rgba(0,0,0,0.55))'}} />
    </AbsoluteFill>
  );
};

// Ruhiger Standardhintergrund. Für produktive Erklärszenen bevorzugen.
export const StaticBG: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${BRAND_C.surfaceStrong}, ${C.bgDeep} 78%)`}}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 58%, rgba(0,0,0,0.45))'}} />
  </AbsoluteFill>
);

// Glassmorphism-Karte für ältere Premium-Bausteine.
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> =
({children, style}) => (
  <div style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.45)', padding: '46px 64px', ...style}}>
    {children}</div>
);
