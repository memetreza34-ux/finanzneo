// FinanzNeo Chart-Bausteine — aus KI-Kit portiert, FinanzNeo-Marke + Glassmorphism.
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, Glass} from './fn_core';
import {PremiumChart} from './fn_chart_base';

const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);
const de = (n: number) => Math.round(n).toLocaleString('de-DE');

export const FNHBars: React.FC<{data?: [string, number, string][]}> =
({data = [['Aktien', 0.95, C.green], ['Immobilien', 0.7, C.gold], ['Anleihen', 0.45, C.blue], ['Sparbuch', 0.2, C.red]]}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: inter, width: 1300, display: 'flex', flexDirection: 'column', gap: 34}}>
    {data.map(([l, v, col], i) => {const g = eo(c01((f - 10 - i * 10) / 40));
      return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: rev(f, i * 10)}}>
        <div style={{width: 280, textAlign: 'right', fontFamily: bebas, fontSize: 52, color: C.ink}}>{l}</div>
        <div style={{flex: 1, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
          <div style={{width: `${v * 100 * g}%`, height: '100%', background: `linear-gradient(90deg,${col},${col}aa)`, borderRadius: 16, boxShadow: `0 0 30px ${col}66`}} /></div>
        <div style={{width: 110, fontFamily: bebas, fontSize: 48, color: col}}>{Math.round(v * 100 * g)}%</div>
      </div>;})}
  </div>;
};

export const FNProgressRing: React.FC<{pct?: number; label?: string; color?: string}> =
({pct = 0.72, label = 'Sparziel', color = C.green}) => {
  const f = useCurrentFrame(); const R = 200, CIRC = 2 * Math.PI * R; const g = eo(c01((f - 6) / 50));
  return <div style={{position: 'relative', width: 480, height: 480, fontFamily: bebas}}>
    <svg width={480} height={480}>
      <circle cx={240} cy={240} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={30} />
      <circle cx={240} cy={240} r={R} fill="none" stroke={color} strokeWidth={30} strokeLinecap="round"
        strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct * g)} transform="rotate(-90 240 240)"
        style={{filter: `drop-shadow(0 0 18px ${color})`}} />
    </svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 130, color: C.ink, lineHeight: 1}}>{Math.round(pct * 100 * g)}%</div>
      <div style={{fontFamily: inter, fontSize: 36, color: C.muted}}>{label}</div></div>
  </div>;
};

export const FNGauge: React.FC<{pct?: number; label?: string; color?: string}> =
({pct = 0.78, label = 'Risiko mittel', color = C.gold}) => {
  const f = useCurrentFrame(); const g = eo(c01((f - 6) / 45)); const R = 240;
  return <div style={{position: 'relative', width: 600, height: 360, fontFamily: bebas}}>
    <svg width={600} height={360}>
      <path d={`M60,320 A${R},${R} 0 0 1 540,320`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={40} strokeLinecap="round" />
      <path d={`M60,320 A${R},${R} 0 0 1 540,320`} fill="none" stroke={color} strokeWidth={40} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pct * g} style={{filter: `drop-shadow(0 0 14px ${color})`}} />
    </svg>
    <div style={{position: 'absolute', bottom: 0, width: '100%', textAlign: 'center'}}>
      <div style={{fontSize: 110, color: C.ink}}>{Math.round(pct * 100 * g)}</div>
      <div style={{fontFamily: inter, fontSize: 32, color: C.muted}}>{label}</div></div>
  </div>;
};

export const FNKPIGrid: React.FC<{kpis?: [string, string, string][]}> =
({kpis = [['Sparquote', '22%', C.green], ['Rendite', '7% p.a.', C.gold], ['Depot', '48.500€', C.blue], ['Notgroschen', '6 Mon.', C.purple]]}) => {
  const f = useCurrentFrame();
  return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, width: 1100}}>
    {kpis.map(([l, v, col], i) => {const s = spring({frame: f - i * 6, fps: 30, config: {damping: 14}});
      return <div key={i} style={{transform: `scale(${s})`}}><Glass style={{textAlign: 'center', padding: '36px'}}>
        <div style={{fontFamily: bebas, fontSize: 100, color: col, lineHeight: 1, filter: `drop-shadow(0 0 24px ${col}66)`}}>{v}</div>
        <div style={{fontFamily: inter, fontSize: 34, color: C.muted}}>{l}</div></Glass></div>;})}
  </div>;
};

export const FNSparkline: React.FC<{points?: number[]; label?: string; color?: string}> =
({points = [0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 1.0], label = '+42%', color = C.green}) => {
  const f = useCurrentFrame(); const W = 900, H = 280; const draw = c01((f - 4) / 40);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${20 + (i / (points.length - 1)) * (W - 40)},${H - 20 - p * (H - 60)}`).join(' ');
  return <div style={{display: 'flex', alignItems: 'center', gap: 40, fontFamily: bebas}}>
    <svg width={W} height={H}><path d={d} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 12px ${color})`}} /></svg>
    <div style={{fontSize: 120, color, opacity: rev(f, 30)}}>{label}</div>
  </div>;
};

export const FNStackedBar: React.FC = () => {
  const f = useCurrentFrame(); const segs: [string, number, string][] = [['Sparen', 0.4, C.green], ['Leben', 0.35, C.gold], ['Wohnen', 0.25, C.blue]];
  const g = eo(c01((f - 6) / 40));
  return <div style={{fontFamily: inter, width: 1200}}>
    <div style={{display: 'flex', width: '100%', height: 100, borderRadius: 20, overflow: 'hidden'}}>
      {segs.map(([_, v, col], i) => <div key={i} style={{width: `${v * 100 * g}%`, background: `linear-gradient(180deg,${col},${col}cc)`}} />)}
    </div>
    <div style={{display: 'flex', gap: 40, marginTop: 26, opacity: rev(f, 30)}}>
      {segs.map(([l, v, col], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 36, color: C.ink}}>
        <div style={{width: 24, height: 24, borderRadius: 6, background: col}} />{l} {Math.round(v * 100)}%</div>)}</div>
  </div>;
};

export const FNRanking: React.FC<{items?: [string, number][]}> =
({items = [['MSCI World', 92], ['S&P 500', 88], ['DAX', 74], ['Gold', 61], ['Tagesgeld', 30]]}) => {
  const f = useCurrentFrame(); const max = Math.max(...items.map((i) => i[1])); const cols = [C.gold, C.green, C.blue, C.purple, C.muted];
  return <div style={{fontFamily: bebas, width: 1300, display: 'flex', flexDirection: 'column', gap: 22}}>
    {items.map(([name, v], i) => {const g = eo(c01((f - i * 8) / 36));
      return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: rev(f, i * 8)}}>
        <div style={{fontSize: 56, color: cols[i], width: 60}}>{i + 1}</div>
        <div style={{width: 320, fontSize: 48, color: C.ink}}>{name}</div>
        <div style={{flex: 1, height: 54, borderRadius: 14, background: 'rgba(255,255,255,0.07)'}}>
          <div style={{width: `${(v / max) * 100 * g}%`, height: '100%', background: cols[i], borderRadius: 14, boxShadow: `0 0 20px ${cols[i]}66`}} /></div>
        <div style={{width: 90, fontSize: 46, color: cols[i]}}>{v}</div>
      </div>;})}
  </div>;
};

const areaData = (max: number, k = 2.4, N = 31) => new Array(N).fill(0).map((_, i) => {const x = i / (N - 1); return (Math.exp(k * x) - 1) / (Math.exp(k) - 1) * max;});
export const FNAreaChart: React.FC = () => (
  <PremiumChart title="Vermögen über die Jahre" caption="Mit Sparplan & Zinseszins wächst der Wert stetig."
    xTitle="Jahre" yTitle="Wert (€)" xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={200000} yTicks={[0, 50000, 100000, 150000, 200000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Wert', color: C.green, data: areaData(195000), area: true}]} />
);
