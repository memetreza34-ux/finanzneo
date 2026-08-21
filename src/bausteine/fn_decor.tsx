// FinanzNeo Deko + Betonung — Pro-Palette (Grün/Gold/Neutral).
import {useCurrentFrame} from 'remotion';
import {C, bebas} from './fn_core';
import {P} from './fn_pro';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);

// ---- Deko ----
export const FNWaveDivider: React.FC = () => {
  const f = useCurrentFrame();
  const path = (ph: number, op: number) => {let d = 'M0,100'; for (let x = 0; x <= 1200; x += 24) d += ` L${x},${100 + Math.sin(x / 110 + f / 12 + ph) * 34}`; d += ' L1200,220 L0,220 Z'; return <path d={d} fill={P.green} opacity={op} />;};
  return <svg width={1200} height={240}>{path(0, 0.2)}{path(1.5, 0.35)}{path(3, 0.6)}</svg>;
};
export const FNMarquee: React.FC<{text?: string}> = ({text = 'INVESTIEREN · SPAREN · WACHSEN · '}) => {
  const f = useCurrentFrame(); const x = -(f * 4) % 700;
  return <div style={{width: 1400, overflow: 'hidden', background: P.gold, padding: '22px 0', transform: 'rotate(-2deg)'}}>
    <div style={{display: 'flex', whiteSpace: 'nowrap', transform: `translateX(${x}px)`, fontFamily: bebas, fontSize: 56, color: C.bgDeep}}>{text.repeat(8)}</div></div>;
};
export const FNGradientBar: React.FC = () => {const f = useCurrentFrame(); const shift = (f * 2) % 200;
  return <div style={{width: 1100, height: 30, borderRadius: 15, background: `linear-gradient(90deg,${P.green},${P.greenLt},${P.gold},${P.green})`, backgroundSize: '200% 100%', backgroundPosition: `${shift}% 0%`, boxShadow: `0 0 30px ${P.green}40`}} />;};
export const FNDotsPattern: React.FC = () => {const f = useCurrentFrame();
  return <div style={{display: 'grid', gridTemplateColumns: 'repeat(14,1fr)', gap: 22, width: 900}}>
    {new Array(112).fill(0).map((_, i) => {const w = (Math.sin(f / 10 + (i % 14) * 0.5 + Math.floor(i / 14) * 0.5) + 1) / 2;
      return <div key={i} style={{width: 16, height: 16, borderRadius: '50%', background: P.green, opacity: 0.15 + w * 0.6, transform: `scale(${0.6 + w * 0.5})`}} />;})}</div>;};
export const FNSpinner: React.FC = () => {const f = useCurrentFrame();
  return <div style={{width: 180, height: 180, borderRadius: '50%', border: `14px solid rgba(255,255,255,0.08)`, borderTopColor: P.green, transform: `rotate(${f * 9}deg)`, boxShadow: `0 0 30px ${P.green}40`}} />;};
export const FNTickerTape: React.FC<{items?: string[]}> = ({items = ['📈 +2,4%', '💰 Dividende', '🏦 ETF', '⏳ Langfristig']}) => {
  const f = useCurrentFrame(); const x = -(f * 3) % 900;
  return <div style={{width: 1300, overflow: 'hidden', borderTop: `2px solid ${P.green}`, borderBottom: `2px solid ${P.green}`, padding: '18px 0'}}>
    <div style={{display: 'flex', gap: 70, whiteSpace: 'nowrap', transform: `translateX(${x}px)`, fontFamily: bebas, fontSize: 44, color: P.ink}}>{[...items, ...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div></div>;
};

// ---- Betonung ----
export const FNArrowPointer: React.FC<{text?: string}> = ({text = 'HIER'}) => {const f = useCurrentFrame(); const bob = Math.sin(f / 6) * 14;
  return <div style={{textAlign: 'center'}}><div style={{fontFamily: bebas, fontSize: 90, color: P.ink, opacity: rev(f, 2)}}>{text}</div>
    <div style={{fontSize: 110, transform: `translateY(${bob}px)`, opacity: rev(f, 10)}}>👇</div></div>;};
export const FNCircleHighlight: React.FC<{text?: string}> = ({text = 'WICHTIG'}) => {const f = useCurrentFrame(); const draw = c01((f - 8) / 26);
  return <div style={{position: 'relative', padding: '40px 80px'}}><div style={{fontFamily: bebas, fontSize: 110, color: P.ink}}>{text}</div>
    <svg width={620} height={240} style={{position: 'absolute', left: -20, top: -10, overflow: 'visible'}}>
      <ellipse cx={310} cy={120} rx={290} ry={100} fill="none" stroke={P.gold} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} transform="rotate(-4 310 120)" style={{filter: `drop-shadow(0 0 8px ${P.gold}66)`}} /></svg></div>;};
export const FNUnderline: React.FC<{text?: string}> = ({text = 'genau das'}) => {const f = useCurrentFrame(); const draw = c01((f - 10) / 22);
  return <div style={{position: 'relative', display: 'inline-block'}}><div style={{fontFamily: bebas, fontSize: 100, color: P.ink}}>{text}</div>
    <svg width={640} height={50} style={{position: 'absolute', left: 0, bottom: -20}}><path d="M6,26 Q160,8 320,26 T634,22" fill="none" stroke={P.green} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} /></svg></div>;};
export const FNSpotlight: React.FC<{text?: string}> = ({text = 'FOKUS'}) => {const f = useCurrentFrame();
  return <div style={{textAlign: 'center'}}><div style={{fontFamily: bebas, fontSize: 150, color: P.ink, opacity: rev(f, 4),
    WebkitMaskImage: `radial-gradient(circle at ${50 + Math.sin(f / 20) * 20}% 50%, black 30%, rgba(0,0,0,0.25) 70%)`}}>{text}</div></div>;};
export const FNBigArrowUp: React.FC<{label?: string}> = ({label = '+500%'}) => {const f = useCurrentFrame();
  return <div style={{textAlign: 'center', opacity: rev(f, 2)}}><div style={{fontFamily: bebas, fontSize: 280, color: P.green, lineHeight: 0.8, filter: `drop-shadow(0 0 40px ${P.green}40)`}}>↑</div>
    <div style={{fontFamily: bebas, fontSize: 110, color: P.green}}>{label}</div></div>;};
export const FNZoomBox: React.FC<{label?: string}> = ({label = 'Detail'}) => {const f = useCurrentFrame(); const s = 1 + Math.sin(f / 10) * 0.04;
  return <div style={{position: 'relative', width: 420, height: 420}}><div style={{position: 'absolute', inset: 0, border: `6px solid ${P.gold}`, borderRadius: 24, transform: `scale(${s})`, boxShadow: `0 0 30px ${P.gold}40`, opacity: rev(f, 2)}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 60, color: P.ink}}>🔍 {label}</div></div>;};
