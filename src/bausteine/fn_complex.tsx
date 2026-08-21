// FinanzNeo komplexe Szenen — aus KI-Kit portiert, FinanzNeo-Marke.
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas} from './fn_core';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);
// Begriff verwandelt sich (Sparen → Vermögen)
export const FNConceptMorph: React.FC<{a?: string; b?: string}> = ({a = 'SPAREN', b = 'VERMÖGEN'}) => {
  const f = useCurrentFrame(); const sw = 50;
  const oa = interpolate(f, [0, sw - 10, sw], [1, 1, 0], {extrapolateRight: 'clamp'});
  const ob = interpolate(f, [sw, sw + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const burst = f > sw - 6 && f < sw + 20;
  return <div style={{position: 'relative', textAlign: 'center', fontFamily: bebas}}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 180, color: C.muted, opacity: oa, filter: `blur(${(1 - oa) * 14}px)`}}>{a}</div>
    <div style={{fontSize: 200, opacity: ob, filter: `blur(${(1 - ob) * 14}px)`, transform: `scale(${0.8 + ob * 0.2})`,
      background: `linear-gradient(90deg,${C.green},${C.gold})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{b}</div>
    {burst && new Array(16).fill(0).map((_, i) => {const a2 = (i / 16) * Math.PI * 2; const p = c01((f - (sw - 6)) / 22);
      return <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: '50%',
        background: C.gold, transform: `translate(${Math.cos(a2) * p * 280}px,${Math.sin(a2) * p * 280}px)`, opacity: 1 - p}} />;})}
  </div>;
};

// Daten-Story: Kurve zeichnet → Callout → Fazit
export const FNDataStory: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 620; const draw = c01((f - 6) / 50);
  const pts = [0.2, 0.3, 0.28, 0.5, 0.45, 0.7, 1.0].map((p, i, arr) => [80 + (i / (arr.length - 1)) * (W - 160), H - 80 - p * (H - 180)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const peak = pts[pts.length - 1]; const callout = f > 70; const concl = f > 100;
  return <div style={{position: 'relative', fontFamily: bebas}}>
    <svg width={W} height={H}>
      <line x1={80} y1={H - 80} x2={W - 80} y2={H - 80} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      <path d={d} fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
      {callout && <circle cx={peak[0]} cy={peak[1]} r={16} fill={C.gold} style={{filter: `drop-shadow(0 0 12px ${C.gold})`}} />}
    </svg>
    {callout && <div style={{position: 'absolute', left: peak[0] - 240, top: peak[1] - 90, fontFamily: bebas, fontSize: 56, color: C.bgDeep, background: C.gold, padding: '8px 22px', borderRadius: 14, opacity: rev(f, 70)}}>+312% 🚀</div>}
    {concl && <div style={{textAlign: 'center', fontSize: 64, color: C.ink, marginTop: 10, opacity: rev(f, 100)}}>Langfristig gewinnt <span style={{color: C.green}}>der Markt</span>.</div>}
  </div>;
};

// 3D-Karten (Anlageklassen) fächern auf
export const FNCard3DStack: React.FC<{cards?: [string, string][]}> =
({cards = [['Aktien', C.green], ['ETFs', C.gold], ['Immobilien', C.blue]]}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div style={{perspective: 1400, fontFamily: bebas}}>
    <div style={{position: 'relative', width: 420, height: 560, transformStyle: 'preserve-3d'}}>
      {cards.map(([name, col], i) => {const s = spring({frame: f - i * 10, fps, config: {damping: 14}}); const off = i - (cards.length - 1) / 2;
        return <div key={i} style={{position: 'absolute', inset: 0, borderRadius: 32, background: `linear-gradient(160deg,${col},${C.bgDeep})`,
          border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'flex-end', padding: 40, color: '#fff', fontSize: 56,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)', transform: `translateX(${off * 180 * s}px) translateZ(${i * 50}px) rotateY(${off * -18 * s}deg)`}}>{name}</div>;})}
    </div>
  </div>;
};

// Exponentielle Kurve (Zinseszins) + Meilensteine
export const FNExponential: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 640; const draw = c01((f - 6) / 60); const fn = (x: number) => Math.pow(x, 3);
  const pts = new Array(50).fill(0).map((_, i) => {const x = i / 49; return [90 + x * (W - 180), H - 70 - fn(x) * (H - 140)];});
  const shown = pts.slice(0, Math.max(2, Math.ceil(draw * pts.length))); const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const ms: [number, string][] = [[0.5, '10 J.'], [0.75, '20 J.'], [0.95, '30 J.']];
  return <svg width={W} height={H} style={{fontFamily: bebas}}>
    <line x1={90} y1={H - 70} x2={W - 80} y2={H - 70} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
    <path d={d} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${C.gold})`}} />
    {ms.map(([x, lab], i) => {const px = 90 + x * (W - 180), py = H - 70 - fn(x) * (H - 140);
      return draw >= x ? <g key={i} opacity={rev(f, 6 + x * 60)}><circle cx={px} cy={py} r={12} fill={C.greenLt} />
        <text x={px} y={py - 22} fontSize={40} fill={C.ink} textAnchor="middle">{lab}</text></g> : null;})}
  </svg>;
};

// Partikel morphen (Chaos → geordneter Vermögensaufbau)
export const FNParticleMorph: React.FC = () => {
  const f = useCurrentFrame(); const N = 130; const t = eo((Math.sin(f / 40) + 1) / 2);
  return <svg width={700} height={700} viewBox="-350 -350 700 700" style={{fontFamily: bebas}}>
    {new Array(N).fill(0).map((_, i) => {const a = (i / N) * Math.PI * 2; const ax = Math.cos(a) * 270, ay = Math.sin(a) * 270;
      const cols = 13; const bx = ((i % cols) - 6) * 40, by = (Math.floor(i / cols) - 4.5) * 40;
      const x = ax + (bx - ax) * t, y = ay + (by - ay) * t; const col = [C.green, C.gold, C.greenLt][i % 3];
      return <circle key={i} cx={x} cy={y} r={5} fill={col} opacity={0.85} style={{filter: `drop-shadow(0 0 4px ${col})`}} />;})}
  </svg>;
};

// Zwei Säulen + Pfeil + Δ-Highlight (Story-Vergleich)
export const FNCompareStory: React.FC<{left?: [string, number, string]; right?: [string, number, string]; delta?: string}> =
({left = ['Sparbuch', 0.35, C.red], right = ['ETF', 1.0, C.green], delta = '+185%'}) => {
  const f = useCurrentFrame(); const g = eo(c01((f - 10) / 45)); const Hmax = 560;
  const bar = (d: [string, number, string]) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
    <div style={{width: 200, height: Hmax * d[1] * g, borderRadius: 20, background: `linear-gradient(180deg,${d[2]},${d[2]}aa)`, boxShadow: `0 0 30px ${d[2]}66`}} />
    <div style={{marginTop: 18, fontFamily: bebas, fontSize: 56, color: C.ink}}>{d[0]}</div></div>;
  return <div style={{position: 'relative', display: 'flex', gap: 160, alignItems: 'flex-end', height: 680, fontFamily: bebas}}>
    {bar(left)}{bar(right)}
    {f > 70 && <div style={{position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', fontSize: 90, color: C.green,
      opacity: rev(f, 70), background: `${C.green}22`, padding: '10px 34px', borderRadius: 18, border: `3px solid ${C.green}`}}>{delta} ↑</div>}
  </div>;
};
