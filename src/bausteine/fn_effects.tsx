// FinanzNeo Effekt-Bausteine — aus KI-Kit portiert, FinanzNeo-Marke.
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5; return x - Math.floor(x);};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');

export const FNCheckmark: React.FC<{color?: string; size?: number}> = ({color = C.green, size = 320}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const ring = c01((f - 2) / 18); const tick = c01((f - 14) / 16); const pop = spring({frame: f - 2, fps, config: {damping: 11}});
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${pop})`}}>
    <circle cx={50} cy={50} r={42} fill="none" stroke={color} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 50 50)" />
    <path d="M30 52 L45 66 L72 36" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} style={{filter: `drop-shadow(0 0 10px ${color})`}} />
  </svg>;
};

export const FNConfetti: React.FC = () => {
  const f = useCurrentFrame(); const {width, height} = useVideoConfig(); const cols = [C.green, C.gold, C.greenLt, C.blue];
  return <>{new Array(90).fill(0).map((_, i) => {const x = rand(i) * width; const p = c01((f - rand(i + 5) * 12) / 90);
    const y = -40 + p * (height + 80) * (0.6 + rand(i + 2) * 0.6); const rot = f * (4 + rand(i + 3) * 6);
    return <div key={i} style={{position: 'absolute', left: x + Math.sin(f / 10 + i) * 30, top: y, width: 16, height: 24,
      background: cols[i % cols.length], transform: `rotate(${rot}deg)`, opacity: p < 0.95 ? 1 : 0, borderRadius: 3}} />;})}</>;
};

export const FNRingPulse: React.FC<{color?: string}> = ({color = C.gold}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'relative', width: 420, height: 420}}>
    {[0, 1, 2].map((i) => {const p = ((f + i * 20) % 60) / 60;
      return <div key={i} style={{position: 'absolute', inset: 0, margin: 'auto', width: 140 + p * 280, height: 140 + p * 280,
        borderRadius: '50%', border: `4px solid ${color}`, opacity: (1 - p) * 0.7}} />;})}
    <div style={{position: 'absolute', inset: 0, margin: 'auto', width: 130, height: 130, borderRadius: '50%', background: color, boxShadow: `0 0 50px ${color}`}} />
  </div>;
};

export const FNFlashWord: React.FC<{text?: string; color?: string}> = ({text = '+340%', color = C.green}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 2, fps, config: {damping: 9, stiffness: 200}}); const shake = f < 18 ? Math.sin(f * 1.4) * (18 - f) : 0;
  return <div style={{fontFamily: bebas, fontSize: 280, color, transform: `scale(${s}) translateX(${shake}px)`, textShadow: `0 0 60px ${color}`}}>{text}</div>;
};

export const FNMoneyCounter: React.FC<{to?: number; label?: string; color?: string}> =
({to = 250000, label = 'Vermögen mit 60', color = C.gold}) => {
  const f = useCurrentFrame(); const n = interpolate(f, [8, 80], [0, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{textAlign: 'center', fontFamily: bebas}}>
    <div style={{fontSize: 260, color, lineHeight: 1, filter: `drop-shadow(0 0 50px ${color}88)`}}>{de(n)} €</div>
    <div style={{fontFamily: inter, fontSize: 44, color: C.muted, opacity: rev(f, 20)}}>{label}</div>
  </div>;
};

export const FNCoinBurst: React.FC<{label?: string}> = ({label = 'Passives Einkommen'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 4, fps, config: {damping: 8, stiffness: 180}});
  return <div style={{position: 'relative', textAlign: 'center', fontFamily: bebas}}>
    {f > 4 && new Array(12).fill(0).map((_, i) => {const a = (i / 12) * Math.PI * 2; const p = Math.min(1, (f - 4) / 24);
      return <div key={i} style={{position: 'absolute', left: '50%', top: '40%', fontSize: 50, transform: `translate(${Math.cos(a) * p * 240}px,${Math.sin(a) * p * 240}px)`, opacity: 1 - p}}>🪙</div>;})}
    <div style={{fontSize: 200, transform: `scale(${s})`}}>💰</div>
    <div style={{fontFamily: inter, fontSize: 44, fontWeight: 700, color: C.gold, opacity: rev(f, 16)}}>{label}</div>
  </div>;
};
