// FinanzNeo End-Cards + UI — Pro-Palette (Grün/Gold/Neutral).
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';
import {P} from './fn_pro';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);

// ---- End-Cards ----
export const FNFollowBar: React.FC<{handle?: string}> = ({handle = '@finanzneo'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 14}});
  return <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '24px 40px', borderRadius: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', transform: `translateY(${(1 - s) * 90}px)`}}>
    <div style={{width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${P.green},${P.gold})`}} />
    <div style={{fontFamily: bebas, fontSize: 56, color: P.ink}}>{handle}</div>
    <div style={{marginLeft: 18, padding: '16px 40px', borderRadius: 40, background: P.green, color: C.bgDeep, fontFamily: bebas, fontSize: 44}}>Folgen</div></div>;
};
export const FNNextVideo: React.FC<{title?: string}> = ({title = 'ETF-Sparplan erklärt'}) => {
  const f = useCurrentFrame(); const ring = interpolate(f, [0, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const R = 56, CIRC = 2 * Math.PI * R;
  return <div style={{display: 'flex', alignItems: 'center', gap: 30, width: 820, padding: 28, borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', opacity: rev(f, 2)}}>
    <div style={{position: 'relative', width: 140, height: 140}}><svg width={140} height={140}><circle cx={70} cy={70} r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={8} /><circle cx={70} cy={70} r={R} fill="none" stroke={P.green} strokeWidth={8} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - ring)} transform="rotate(-90 70 70)" /></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46}}>▶</div></div>
    <div><div style={{fontFamily: inter, fontSize: 28, color: P.muted}}>Nächstes Video</div><div style={{fontFamily: bebas, fontSize: 56, color: P.ink}}>{title}</div></div></div>;
};
export const FNLogoSting: React.FC<{name?: string}> = ({name = 'FINANZNEO'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 11, stiffness: 130}}); const shim = interpolate(f, [10, 80], [0, 300]);
  return <div style={{textAlign: 'center', transform: `scale(${s})`}}><div style={{fontSize: 110, transform: `rotate(${(1 - s) * 180}deg)`}}>📈</div>
    <div style={{fontFamily: bebas, fontSize: 110, marginTop: 12, background: `linear-gradient(90deg,${P.green},${P.gold},${P.greenLt},${P.green})`, backgroundSize: '300% 100%', backgroundPosition: `${shim}% 0%`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{name}</div></div>;
};
export const FNThanks: React.FC = () => {const f = useCurrentFrame();
  return <div style={{textAlign: 'center'}}><div style={{fontSize: 150, opacity: rev(f, 2)}}>🙏</div>
    <div style={{fontFamily: bebas, fontSize: 90, color: P.ink, opacity: rev(f, 16)}}>Danke!</div>
    <div style={{fontFamily: inter, fontSize: 36, color: P.muted, marginTop: 12, opacity: rev(f, 30)}}>Bis zum nächsten Video</div></div>;};

// ---- UI ----
export const FNBadge: React.FC<{text?: string}> = ({text = 'NEU'}) => {const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 11}});
  return <div style={{display: 'inline-block', border: `3px solid ${P.gold}`, color: P.gold, borderRadius: 40, padding: '16px 48px', fontFamily: bebas, fontSize: 56, letterSpacing: 3, transform: `scale(${s})`}}>{text}</div>;};
export const FNChip: React.FC<{text?: string}> = ({text = 'ETF'}) => {const f = useCurrentFrame();
  return <div style={{display: 'inline-block', background: `${P.green}1a`, border: `1px solid ${P.green}`, color: P.ink, borderRadius: 18, padding: '18px 38px', fontFamily: inter, fontSize: 40, fontWeight: 600, opacity: rev(f, 2)}}>{text}</div>;};
export const FNLowerThird: React.FC<{title?: string; sub?: string}> = ({title = 'Zinseszins', sub = 'der 8. Weltwunder'}) => {const f = useCurrentFrame(); const w = c01((f - 4) / 18);
  return <div style={{alignSelf: 'flex-start', width: 900}}><div style={{height: 8, width: `${w * 70}%`, background: P.green, borderRadius: 4}} />
    <div style={{overflow: 'hidden'}}><div style={{fontFamily: bebas, fontSize: 72, color: P.ink, marginTop: 16, opacity: rev(f, 14)}}>{title}</div>
      <div style={{fontFamily: inter, fontSize: 38, color: P.muted, marginTop: 4, opacity: rev(f, 22)}}>{sub}</div></div></div>;};
export const FNListReveal: React.FC<{items?: string[]}> = ({items = ['Früh starten', 'Breit streuen', 'Günstig (ETF)', 'Geduldig bleiben']}) => {const f = useCurrentFrame();
  return <div style={{display: 'flex', flexDirection: 'column', gap: 28, width: 900}}>{items.map((t, i) => {const g = rev(f, i * 12, 16);
    return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: g, transform: `translateX(${(1 - g) * -28}px)`}}>
      <div style={{width: 56, height: 56, borderRadius: '50%', background: P.green, color: C.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 36, flexShrink: 0}}>✓</div>
      <div style={{fontFamily: inter, fontSize: 46, color: P.ink}}>{t}</div></div>;})}</div>;};
