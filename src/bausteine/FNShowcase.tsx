import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, AuroraBG, Glass} from './fn_core';

export const FN_FRAMES = 390;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');

// BEAT 1 — Titel mit animiertem Gradient-Text + Glow
const Title: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 13}});
  const shim = interpolate(f, [0, 90], [0, 300]);
  const subO = interpolate(f, [24, 44], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: bebas, fontSize: 220, lineHeight: 1, transform: `scale(${s})`,
        background: `linear-gradient(90deg, ${C.green}, ${C.gold}, ${C.greenLt}, ${C.green})`,
        backgroundSize: '300% 100%', backgroundPosition: `${shim}% 0%`,
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        filter: `drop-shadow(0 0 45px rgba(0,210,106,0.5))`}}>INFLATION</div>
      <div style={{fontFamily: inter, fontSize: 44, fontWeight: 600, color: C.ink, opacity: subO,
        letterSpacing: 2, marginTop: 10}}>Warum dein Geld weniger wird</div>
    </AbsoluteFill>
  );
};

// BEAT 2 — Glassmorphism-Karte mit Spring-Count-Up + Glow
const StatCard: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 14}});
  const n = interpolate(f, [10, 80], [100, 67000], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `scale(${s})`}}>
        <Glass style={{textAlign: 'center'}}>
          <div style={{fontFamily: inter, fontSize: 36, color: C.muted}}>Aus 100 € werden</div>
          <div style={{fontFamily: bebas, fontSize: 180, color: C.green, lineHeight: 1.05,
            filter: `drop-shadow(0 0 40px rgba(0,210,106,0.55))`}}>{fmt(n)} €</div>
          <div style={{fontFamily: inter, fontSize: 32, color: C.gold}}>mit Zinseszins über 40 Jahre</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// BEAT 3 — Wachstumskurve (SVG) mit Gradient-Stroke, Glow, gezeichnet
const Growth: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const draw = interpolate(f, [6, 70], [0, 1], clamp);
  const pts = Array.from({length: 40}, (_, i) => {
    const t = i / 39;
    const y = (Math.exp(3.2 * t) - 1) / (Math.exp(3.2) - 1);
    return [180 + t * (W - 360), H - 200 - y * (H - 460)];
  });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const tip = pts[Math.max(0, Math.min(pts.length - 1, Math.floor(draw * (pts.length - 1))))];
  const lblO = interpolate(f, [50, 70], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="fng" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={C.green} /><stop offset="100%" stopColor={C.gold} />
          </linearGradient>
          <linearGradient id="fna" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.green} stopOpacity={0.35} /><stop offset="100%" stopColor={C.green} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line x1={180} y1={H - 200} x2={W - 180} y2={H - 200} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        <path d={`${d} L${pts[pts.length - 1][0]},${H - 200} L${pts[0][0]},${H - 200} Z`} fill="url(#fna)" opacity={draw} />
        <path d={d} fill="none" stroke="url(#fng)" strokeWidth={10} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
          style={{filter: 'drop-shadow(0 0 16px rgba(0,210,106,0.7))'}} />
        <circle cx={tip[0]} cy={tip[1]} r={16} fill={C.greenLt} style={{filter: 'drop-shadow(0 0 20px rgba(92,255,173,0.9))'}} />
      </svg>
      <div style={{position: 'absolute', left: 200, top: 150, fontFamily: bebas, fontSize: 130, color: C.gold,
        opacity: lblO, filter: 'drop-shadow(0 0 30px rgba(255,200,61,0.5))'}}>+240 %</div>
    </AbsoluteFill>
  );
};

export const FNShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AuroraBG />
    <Sequence durationInFrames={130}><Title /></Sequence>
    <Sequence from={130} durationInFrames={130}><StatCard /></Sequence>
    <Sequence from={260} durationInFrames={130}><Growth /></Sequence>
  </AbsoluteFill>
);
