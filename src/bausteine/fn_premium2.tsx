// FinanzNeo PREMIUM-Bausteine — Border-Beam, Candles, Gold, Mountain, Ringe (FinanzNeo-Marke).
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, P as PP} from './fn_core';
import {PremiumChart} from './fn_chart_base';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);
const de = (n: number) => Math.round(n).toLocaleString('de-DE');

// 1) Shine-Card — Glassmorphism + rotierender Border-Beam + Licht-Sweep
export const FNShineCard: React.FC<{value?: string; label?: string; color?: string}> =
({value = '7% p.a.', label = 'Ø Rendite Weltmarkt', color = C.green}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 14}});
  const sweep = ((f * 9) % 260) - 60;
  return <div style={{position: 'relative', borderRadius: 34, padding: 3, overflow: 'hidden', transform: `scale(${s})`}}>
    <div style={{position: 'absolute', inset: '-60%', background: `conic-gradient(from ${f * 4}deg, transparent 0 68%, ${color} 82%, ${C.gold} 92%, transparent 100%)`}} />
    <div style={{position: 'relative', borderRadius: 31, padding: '64px 96px', textAlign: 'center', overflow: 'hidden',
      background: 'rgba(10,26,15,0.85)', backdropFilter: 'blur(16px)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)'}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: '40%', transform: 'skewX(-20deg)',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)'}} />
      <div style={{fontFamily: inter, fontSize: 38, color: C.muted, position: 'relative'}}>{label}</div>
      <div style={{fontFamily: bebas, fontSize: 200, color, lineHeight: 1.02, position: 'relative', filter: `drop-shadow(0 0 40px ${color}88)`}}>{value}</div>
    </div>
  </div>;
};

// 2) Candlestick-Chart — die Finanz-Signatur
export const FNCandles: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 640; const N = 16; const base = H - 80;
  const rng = (i: number) => Math.sin(i * 91.7) * 0.5 + 0.5;
  let price = 0.3; const candles = new Array(N).fill(0).map((_, i) => {
    const o = price; price += (rng(i) - 0.42) * 0.12; const c = Math.max(0.05, Math.min(0.95, price));
    const hi = Math.max(o, c) + rng(i + 5) * 0.06, lo = Math.min(o, c) - rng(i + 9) * 0.06;
    return {o, c, hi, lo, up: c >= o};
  });
  const cw = (W - 160) / N; const y = (v: number) => base - v * (H - 200);
  return <svg width={W} height={H} style={{fontFamily: bebas}}>
    <line x1={80} y1={base} x2={W - 80} y2={base} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
    {candles.map((cd, i) => {const x = 80 + cw * (i + 0.5); const show = rev(f, i * 5, 10); if (show <= 0) return null;
      const col = cd.up ? C.green : C.red;
      return <g key={i} opacity={show} style={{filter: `drop-shadow(0 0 6px ${col}66)`}}>
        <line x1={x} y1={y(cd.hi)} x2={x} y2={y(cd.lo)} stroke={col} strokeWidth={3} />
        <rect x={x - cw * 0.3} y={y(Math.max(cd.o, cd.c))} width={cw * 0.6} height={Math.max(3, Math.abs(y(cd.o) - y(cd.c)))} fill={col} rx={3} />
      </g>;})}
  </svg>;
};

// 3) Gold-Barren — isometrischer Stapel + Glanz-Sweep
export const FNGoldBars: React.FC = () => {
  const f = useCurrentFrame(); const ox = 300, oy = 150, w = 70, h = 38, ch = 50;
  const bars: [number, number, number][] = [];
  for (let x = 0; x < 3; x++) for (let yy = 0; yy < 3; yy++) bars.push([x, yy, 0]);
  for (let x = 0; x < 2; x++) for (let yy = 0; yy < 2; yy++) bars.push([x, yy, 1]);
  bars.push([0, 0, 2]);
  const sweep = ((f * 8) % 800) - 100;
  return <svg width={620} height={620} style={{fontFamily: bebas}}>
    <defs><linearGradient id="goldT" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFE49A" /><stop offset="100%" stopColor={C.gold} /></linearGradient>
      <clipPath id="barsClip"><rect x={0} y={0} width={620} height={620} /></clipPath></defs>
    {bars.map((b, i) => {const g = eo(c01((f - i * 6) / 22)); if (g <= 0) return null; const dy = (1 - g) * -160;
      const sx = ox + (b[0] - b[1]) * w, sy = oy + (b[0] + b[1]) * h - b[2] * ch + dy;
      return <g key={i} opacity={g}>
        <polygon points={`${sx - w},${sy + h} ${sx},${sy + 2 * h} ${sx},${sy + 2 * h + ch} ${sx - w},${sy + h + ch}`} fill="#B8860B" />
        <polygon points={`${sx + w},${sy + h} ${sx},${sy + 2 * h} ${sx},${sy + 2 * h + ch} ${sx + w},${sy + h + ch}`} fill="#9A6E0A" />
        <polygon points={`${sx},${sy} ${sx + w},${sy + h} ${sx},${sy + 2 * h} ${sx - w},${sy + h}`} fill="url(#goldT)" />
      </g>;})}
    <rect x={sweep} y={0} width={120} height={620} fill="rgba(255,255,255,0.18)" transform={`skewX(-18)`} clipPath="url(#barsClip)" />
  </svg>;
};

// 4) Neon-Zahl — doppelter Glow + Count-Up + Beam-Underline
export const FNNeonNumber: React.FC<{to?: number; suffix?: string; label?: string; color?: string}> =
({to = 1000000, suffix = ' €', label = 'Das erste Million-Ziel', color = C.green}) => {
  const f = useCurrentFrame(); const n = interpolate(f, [8, 80], [0, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{textAlign: 'center', fontFamily: bebas}}>
    <div style={{fontSize: 230, color: C.ink, lineHeight: 1, textShadow: `0 0 20px ${color}, 0 0 60px ${color}aa`}}>{de(n)}{suffix}</div>
    <div style={{height: 8, width: `${rev(f, 20, 60) * 60}%`, margin: '14px auto 0', borderRadius: 4,
      background: `linear-gradient(90deg, transparent, ${color}, ${C.gold}, transparent)`}} />
    <div style={{fontFamily: inter, fontSize: 42, color: C.muted, marginTop: 18, opacity: rev(f, 30)}}>{label}</div>
  </div>;
};

// 5) Wealth-Mountain — jetzt mit beschrifteten Achsen (PremiumChart)
const mountainData = (max: number, k = 2.6, N = 31) => new Array(N).fill(0).map((_, i) => {const x = i / (N - 1); return (Math.exp(k * x) - 1) / (Math.exp(k) - 1) * max;});
export const FNWealthMountain: React.FC = () => (
  <PremiumChart title="Der Vermögens-Berg" caption="Jahr für Jahr aufgebaut — am Ende ein stattlicher Betrag."
    xTitle="Jahre" yTitle="Wert (€)" xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={300000} yTicks={[0, 100000, 200000, 300000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Vermögen', color: PP.green, data: mountainData(285000), area: true}]} />
);

// 6) Portfolio-Ringe — konzentrische Allokation (Premium-Donut)
export const FNPortfolioRings: React.FC<{rings?: [string, number, string][]}> =
({rings = [['Aktien', 0.6, C.green], ['Immobilien', 0.25, C.gold], ['Cash', 0.15, C.blue]]}) => {
  const f = useCurrentFrame(); const cx = 300, cy = 300;
  return <div style={{display: 'flex', alignItems: 'center', gap: 80, fontFamily: bebas}}>
    <svg width={600} height={600}>
      {rings.map(([_, v, col], i) => {const R = 240 - i * 70; const CIRC = 2 * Math.PI * R; const g = eo(c01((f - i * 10) / 45));
        return <g key={i}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={44} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={col} strokeWidth={44} strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - v * g)} transform={`rotate(-90 ${cx} ${cy})`} style={{filter: `drop-shadow(0 0 12px ${col}88)`}} />
        </g>;})}
    </svg>
    <div>{rings.map(([l, v, col], i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26, opacity: rev(f, 20 + i * 10)}}>
        <div style={{width: 36, height: 36, borderRadius: 10, background: col, boxShadow: `0 0 18px ${col}88`}} />
        <span style={{fontFamily: inter, fontSize: 44, color: C.ink}}>{l}</span>
        <span style={{fontSize: 52, color: col}}>{Math.round(v * 100)}%</span>
      </div>))}</div>
  </div>;
};

// 7) Border-Beam-Stat — große Zahl in leuchtender Beam-Karte
export const FNBeamStat: React.FC<{big?: string; label?: string; color?: string}> =
({big = '+312%', label = 'in 25 Jahren', color = C.green}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 13}});
  return <div style={{position: 'relative', borderRadius: 40, padding: 4, overflow: 'hidden', transform: `scale(${s})`}}>
    <div style={{position: 'absolute', inset: '-60%', background: `conic-gradient(from ${f * 5}deg, transparent 0 75%, ${color} 88%, transparent 100%)`}} />
    <div style={{position: 'relative', borderRadius: 36, padding: '70px 120px', textAlign: 'center', background: C.bgDeep}}>
      <div style={{fontFamily: bebas, fontSize: 240, color, lineHeight: 1, filter: `drop-shadow(0 0 40px ${color}88)`}}>{big}</div>
      <div style={{fontFamily: inter, fontSize: 44, color: C.muted}}>{label}</div>
    </div>
  </div>;
};

// 8) Market-Heat — Sektoren-Heatmap (Markt heute)
export const FNMarketHeat: React.FC = () => {
  const f = useCurrentFrame();
  const sectors: [string, number][] = [['Tech', 2.4], ['Energie', -1.2], ['Auto', 0.8], ['Pharma', 1.5], ['Banken', -0.6], ['Konsum', 0.3], ['Industrie', 1.1], ['Rohstoff', -2.1], ['Telekom', 0.5]];
  return <div style={{fontFamily: bebas, textAlign: 'center'}}>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, width: 900}}>
      {sectors.map(([name, chg], i) => {const g = eo(c01((f - i * 6) / 22)); const up = chg >= 0;
        const col = up ? C.green : C.red; const intensity = Math.min(1, Math.abs(chg) / 2.5);
        return <div key={i} style={{padding: '34px 16px', borderRadius: 16, opacity: g, transform: `scale(${g})`,
          background: `${col}${Math.round(20 + intensity * 50).toString(16)}`, border: `2px solid ${col}`}}>
          <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, color: C.ink}}>{name}</div>
          <div style={{fontSize: 60, color: col}}>{up ? '+' : ''}{chg}%</div>
        </div>;})}
    </div>
  </div>;
};
