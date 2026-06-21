// FinanzNeo PREMIUM-CHART-Fundament — echte beschriftete Achsen (X & Y), Gitternetz,
// großzügige Abstände, Legende. Alle Kurven bauen darauf auf.
import {useCurrentFrame, interpolate} from 'remotion';
import {bebas, inter, P} from './fn_core';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);
const glow = (c: string, o = 0.3) => `drop-shadow(0 0 30px ${c}${Math.round(o * 255).toString(16).padStart(2, '0')})`;

type Series = {label: string; color: string; data: number[]; area?: boolean; dash?: boolean};

export const PremiumChart: React.FC<{
  title: string; caption?: string; xTitle: string; yTitle: string;
  xLabels: string[]; yMax: number; yTicks: number[]; yFmt: (n: number) => string; series: Series[];
}> = ({title, caption, xTitle, yTitle, xLabels, yMax, yTicks, yFmt, series}) => {
  const f = useCurrentFrame();
  const W = 1560, H = 740, L = 210, R = 90, T = 56, B = 140;
  const draw = c01((f - 10) / 75);
  const n = series[0].data.length;
  const px = (i: number) => L + (i / (n - 1)) * (W - L - R);
  const py = (v: number) => (H - B) - (v / yMax) * (H - B - T);

  return <div style={{textAlign: 'center', width: 1640}}>
    <div style={{fontFamily: bebas, fontSize: 90, color: P.ink, opacity: rev(f, 2), marginBottom: 18}}>{title}</div>
    <svg width={W} height={H}>
      {/* horizontale Gitterlinien + Y-Werte */}
      {yTicks.map((t, i) => {const y = py(t);
        return <g key={i}>
          <line x1={L} y1={y} x2={W - R} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
          <text x={L - 28} y={y + 12} fontSize={34} fontFamily={inter} fill={P.muted} textAnchor="end" opacity={rev(f, 4)}>{yFmt(t)}</text>
        </g>;})}
      {/* Achsenlinien */}
      <line x1={L} y1={T} x2={L} y2={H - B} stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
      <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
      {/* X-Werte */}
      {xLabels.map((lab, i) => {const x = L + (i / (xLabels.length - 1)) * (W - L - R);
        return <text key={i} x={x} y={H - B + 50} fontSize={34} fontFamily={inter} fill={P.muted} textAnchor="middle" opacity={rev(f, 6)}>{lab}</text>;})}
      {/* Achsentitel */}
      <text x={(L + W - R) / 2} y={H - 24} fontSize={36} fontFamily={inter} fontWeight={600} fill={P.ink} textAnchor="middle" opacity={rev(f, 10)}>{xTitle}</text>
      <text x={52} y={(T + H - B) / 2} fontSize={36} fontFamily={inter} fontWeight={600} fill={P.ink} textAnchor="middle" transform={`rotate(-90 52 ${(T + H - B) / 2})`} opacity={rev(f, 10)}>{yTitle}</text>
      {/* Serien */}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => [px(i), py(v)]);
        const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
        const tip = pts[Math.max(0, Math.floor(draw * (pts.length - 1)))];
        return <g key={si}>
          {s.area && <path d={`${line} L${pts[pts.length - 1][0]},${H - B} L${pts[0][0]},${H - B} Z`} fill={s.color} opacity={0.12 * draw} />}
          <path d={line} fill="none" stroke={s.color} strokeWidth={s.dash ? 5 : 8} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={s.dash ? '4 12' : 1} pathLength={s.dash ? undefined : 1} strokeDashoffset={s.dash ? undefined : 1 - draw}
            opacity={s.dash ? draw * 0.7 : 1} style={{filter: s.dash ? 'none' : glow(s.color, 0.3)}} />
          {!s.dash && <circle cx={tip[0]} cy={tip[1]} r={12} fill={s.color} style={{filter: glow(s.color, 0.5)}} />}
        </g>;})}
      {/* Legende */}
      {series.length > 1 && <g opacity={rev(f, 16)}>
        {series.map((s, i) => <g key={i} transform={`translate(${W - R - 320}, ${T + 20 + i * 50})`}>
          <rect width={40} height={8} rx={4} y={10} fill={s.color} />
          <text x={56} y={22} fontSize={34} fontFamily={inter} fill={P.ink}>{s.label}</text></g>)}
      </g>}
    </svg>
    {caption && <div style={{fontFamily: inter, fontSize: 42, color: P.muted, opacity: rev(f, 64), marginTop: 28, maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto'}}>{caption}</div>}
  </div>;
};

// ---- Konkrete Premium-Charts ----
const expSeries = (max: number, k = 2.6) => new Array(31).fill(0).map((_, i) => {const x = i / 30; return (Math.exp(k * x) - 1) / (Math.exp(k) - 1) * max;});
const linSeries = (max: number) => new Array(31).fill(0).map((_, i) => (i / 30) * max);

export const FNLineChartPro: React.FC = () => (
  <PremiumChart title="So wächst dein Vermögen" caption="100 € pro Monat, 7 % Rendite — der Zinseszins zieht spät steil an."
    xTitle="Jahre" yTitle="Wert (€)" xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={250000} yTicks={[0, 50000, 100000, 150000, 200000, 250000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Vermögen', color: P.green, data: expSeries(248000), area: true}]} />
);

export const FNDualLinePro: React.FC = () => (
  <PremiumChart title="Sparen vs. Investieren" caption="Gleicher Einsatz über 30 Jahre — die Schere geht immer weiter auf."
    xTitle="Jahre" yTitle="Wert (€)" xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={250000} yTicks={[0, 50000, 100000, 150000, 200000, 250000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Sparbuch', color: P.muted, data: linSeries(44000), dash: true}, {label: 'ETF (Welt)', color: P.green, data: expSeries(248000), area: true}]} />
);

export const FNCompoundPro: React.FC = () => (
  <PremiumChart title="Die Macht des Zinseszins" caption="Erst flach, dann exponentiell — Zeit ist der wichtigste Faktor."
    xTitle="Jahre" yTitle="Kapital (€)" xLabels={['0', '10', '20', '30', '40']}
    yMax={400000} yTicks={[0, 100000, 200000, 300000, 400000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Kapital', color: P.gold, data: new Array(41).fill(0).map((_, i) => {const x = i / 40; return (Math.exp(3 * x) - 1) / (Math.exp(3) - 1) * 380000;}), area: true}]} />
);

export const FNDrawdownPro: React.FC = () => (
  <PremiumChart title="Crash & Erholung" caption="Märkte fallen — und erreichen danach neue Höchststände. Dranbleiben zahlt sich aus."
    xTitle="Jahre" yTitle="Index" xLabels={['2018', '2020', '2022', '2024', '2026']}
    yMax={200} yTicks={[0, 50, 100, 150, 200]} yFmt={(n) => `${n}`}
    series={[{label: 'Weltindex', color: P.green, data: [80, 95, 110, 70, 88, 120, 150, 175, 200].map((v) => v), area: true}]} />
);
