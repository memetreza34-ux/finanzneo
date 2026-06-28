// FinanzNeo Text-Bausteine — aus KI-Kit portiert, FinanzNeo-Marke (Bebas/Inter, Grün/Gold).
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';

const rev = (f: number, s: number, d = 14) => Math.max(0, Math.min(1, (f - s) / d));

export const FNShimmer: React.FC<{text?: string; fs?: number}> = ({text = 'VERMÖGEN', fs = 200}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 13}}); const shim = interpolate(f, [0, 90], [0, 300]);
  return <div style={{fontFamily: bebas, fontSize: fs, lineHeight: 1, textAlign: 'center', transform: `scale(${s})`,
    background: `linear-gradient(90deg,${C.green},${C.gold},${C.greenLt},${C.green})`, backgroundSize: '300% 100%',
    backgroundPosition: `${shim}% 0%`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    filter: 'drop-shadow(0 0 45px rgba(0,210,106,0.5))'}}>{text}</div>;
};

export const FNType: React.FC<{text?: string; fs?: number}> = ({text = 'Dein Geld arbeitet …', fs = 80}) => {
  const f = useCurrentFrame(); const n = Math.min(text.length, Math.floor(f / 2)); const caret = Math.floor(f / 12) % 2 === 0;
  return <div style={{fontFamily: inter, fontWeight: 600, fontSize: fs, color: C.ink, textAlign: 'center'}}>
    {text.slice(0, n)}<span style={{opacity: caret ? 1 : 0, color: C.green}}>|</span>
  </div>;
};

export const FNWordReveal: React.FC<{text?: string; fs?: number; accent?: number}> =
({text = 'Zeit schlägt Timing am Markt', fs = 96, accent = 1}) => {
  const f = useCurrentFrame(); const words = text.split(' ');
  return <div style={{fontFamily: bebas, fontSize: fs, color: C.ink, textAlign: 'center', display: 'flex', flexWrap: 'wrap',
    gap: '0 22px', justifyContent: 'center', lineHeight: 1.15, maxWidth: 1400}}>
    {words.map((w, i) => {const g = rev(f, i * 7, 12);
      return <span key={i} style={{opacity: g, transform: `translateY(${(1 - g) * 18}px)`, display: 'inline-block', color: i === accent ? C.gold : C.ink}}>{w}</span>;})}
  </div>;
};

export const FNHighlight: React.FC<{text?: string; fs?: number; color?: string}> = ({text = 'STEUERFREI', fs = 150, color = C.gold}) => {
  const f = useCurrentFrame(); const w = Math.max(0, Math.min(1, (f - 10) / 18));
  return <div style={{position: 'relative', display: 'inline-block', fontFamily: bebas, fontSize: fs}}>
    <div style={{position: 'absolute', inset: '-4px -20px', background: color, borderRadius: 16, transformOrigin: 'left', transform: `scaleX(${w})`}} />
    <span style={{position: 'relative', color: w > 0.5 ? C.bgDeep : C.ink}}>{text}</span>
  </div>;
};

// Kinetischer Absatz — für komplexe Finanz-Aussagen (Wort-Rhythmus + Betonung)
type Tok = {t: string; hl?: boolean; c?: string};
export const FNKineticParagraph: React.FC<{tokens?: Tok[]}> = ({tokens = [
  {t: 'Wer'}, {t: 'früh'}, {t: 'startet,'}, {t: 'gewinnt'}, {t: 'nicht'}, {t: 'mit'}, {t: 'mehr'}, {t: 'Geld'},
  {t: '—'}, {t: 'sondern'}, {t: 'mit'}, {t: 'ZEIT', hl: true, c: C.gold}, {t: 'und'}, {t: 'ZINSESZINS', hl: true, c: C.green}, {t: '.'},
]}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: bebas, display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'center', maxWidth: 1500, lineHeight: 1.3}}>
    {tokens.map((tk, i) => {const g = rev(f, i * 6, 12); const sweep = Math.max(0, Math.min(1, (f - i * 6 - 6) / 12));
      return <span key={i} style={{position: 'relative', fontSize: tk.hl ? 110 : 84, color: tk.hl ? C.bgDeep : C.ink,
        opacity: g, transform: `translateY(${(1 - g) * 18}px)`, display: 'inline-block', padding: tk.hl ? '0 14px' : 0}}>
        {tk.hl && <span style={{position: 'absolute', inset: '4px -2px', background: tk.c, borderRadius: 12, transformOrigin: 'left', transform: `scaleX(${sweep})`, zIndex: -1}} />}
        {tk.t}</span>;})}
  </div>;
};
