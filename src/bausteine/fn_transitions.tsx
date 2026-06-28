// FinanzNeo Transitions — Pro-Palette (Grün/Gold/Neutral).
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C, bebas} from './fn_core';
import {P} from './fn_pro';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5; return x - Math.floor(x);};
const Card: React.FC<{t: string}> = ({t}) => (
  <div style={{padding: '50px 90px', borderRadius: 28, background: `linear-gradient(160deg,${P.greenLt},${P.green})`,
    fontFamily: bebas, fontSize: 76, color: C.bgDeep, boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>{t}</div>
);

export const FNWipeIn: React.FC = () => {const f = useCurrentFrame(); const p = c01(f / 22);
  return <div style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}><Card t="Wipe In" /></div>;};
export const FNCircleReveal: React.FC = () => {const f = useCurrentFrame(); const p = c01(f / 26);
  return <div style={{clipPath: `circle(${p * 80}% at 50% 50%)`}}><Card t="Circle Reveal" /></div>;};
export const FNSlideOver: React.FC = () => {const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f, fps, config: {damping: 14}});
  return <div style={{transform: `translateX(${(1 - s) * -900}px)`}}><Card t="Slide Over" /></div>;};
export const FNZoomBlur: React.FC = () => {const f = useCurrentFrame(); const p = c01(f / 24);
  return <div style={{transform: `scale(${1.4 - p * 0.4})`, filter: `blur(${(1 - p) * 26}px)`, opacity: p}}><Card t="Zoom Blur" /></div>;};
export const FNBarsWipe: React.FC = () => {const f = useCurrentFrame();
  return <div style={{position: 'relative'}}><Card t="Bars Wipe" />
    <div style={{position: 'absolute', inset: 0, display: 'flex'}}>{new Array(7).fill(0).map((_, i) => {const p = c01((f - i * 3) / 16);
      return <div key={i} style={{flex: 1, background: C.bgDeep, transformOrigin: 'bottom', transform: `scaleY(${1 - p})`}} />;})}</div></div>;};
export const FNFadeThrough: React.FC = () => {const f = useCurrentFrame(); const flash = Math.max(0, 1 - Math.abs(f - 12) / 12);
  return <div style={{position: 'relative'}}><Card t="Fade Through" /><div style={{position: 'absolute', inset: -120, background: '#fff', opacity: flash}} /></div>;};
export const FNPixelDissolve: React.FC = () => {const f = useCurrentFrame();
  return <div style={{position: 'relative'}}><Card t="Pixel Dissolve" />
    <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gridTemplateRows: 'repeat(4,1fr)'}}>
      {new Array(40).fill(0).map((_, i) => <div key={i} style={{background: C.bgDeep, opacity: f > rand(i) * 26 ? 0 : 1}} />)}</div></div>;};
export const FNBlurIn: React.FC = () => {const f = useCurrentFrame(); const p = c01(f / 24);
  return <div style={{filter: `blur(${(1 - p) * 30}px)`, opacity: p, transform: `scale(${0.9 + p * 0.1})`}}><Card t="Blur In" /></div>;};
