import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

export const bebas = loadBebas().fontFamily;
export const inter = loadInter().fontFamily;

// FinanzNeo-Marke
export const C = {
  bg: '#0A1A0F', bgDeep: '#06120A', ink: '#FFFFFF', muted: '#9DB0A6',
  green: '#00D26A', greenLt: '#5CFFAD', gold: '#FFC83D', goldLt: '#FFE49A',
  blue: '#3D8BFF', red: '#FF3333', purple: '#B98CFF',
};

// Disziplinierte Premium-Palette (Pro-Stil): nur Grün + Gold + Neutral
export const P = {
  ink: '#F4FAF6', muted: '#8FA89A', line: 'rgba(255,255,255,0.10)',
  green: '#00D26A', greenLt: '#7BFFC0', greenDeep: '#0E3B27', gold: '#FFC83D', loss: '#FF6B6B',
};

export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
};

// Driftender Farb-Blob mit echtem Gaussian-Blur (der Premium-Trick)
const Blob: React.FC<{cx: number; cy: number; size: number; color: string; px: number}> =
({cx, cy, size, color, px}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', width: size, height: size, borderRadius: '50%',
    left: cx + Math.sin((f + px) / 55) * 140, top: cy + Math.cos((f + px) / 65) * 120,
    background: `radial-gradient(circle, ${color}, transparent 65%)`, filter: 'blur(90px)', opacity: 0.55}} />;
};

// Lebender FinanzNeo-Hintergrund: dunkelgrün + driftende Grün/Gold-Blobs + Grid + Vignette + Körnung
export const AuroraBG: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, #11261A, ${C.bgDeep} 72%)`}}>
      <Blob cx={300} cy={300} size={620} color={C.green} px={0} />
      <Blob cx={1500} cy={760} size={680} color={C.gold} px={60} />
      <Blob cx={760} cy={900} size={560} color={C.blue} px={120} />
      {/* rotierender Conic-Schimmer */}
      <AbsoluteFill style={{
        background: `conic-gradient(from ${f * 0.4}deg at 50% 42%, rgba(0,210,106,0.10), transparent 38%, rgba(255,200,61,0.08), transparent 80%)`}} />
      {/* feines Grid mit weicher Maske */}
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
        backgroundSize: '64px 64px',
        WebkitMaskImage: 'radial-gradient(circle at 50% 42%, black, transparent 72%)'}} />
      {/* Körnung */}
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'overlay',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'}} />
      {/* Vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 50%, rgba(0,0,0,0.55))'}} />
    </AbsoluteFill>
  );
};

// Einfacher, RUHIGER Hintergrund (keine Animation) — sauberes Dunkelgrün + dezente Vignette
export const StaticBG: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #112A1B, ${C.bgDeep} 78%)`}}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 58%, rgba(0,0,0,0.45))'}} />
  </AbsoluteFill>
);

// Glassmorphism-Karte (Milchglas) — Premium-UI-Element
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> =
({children, style}) => (
  <div style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.45)', padding: '46px 64px', ...style}}>
    {children}</div>
);
