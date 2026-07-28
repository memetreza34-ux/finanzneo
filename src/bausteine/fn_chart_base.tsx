// FinanzNeo PREMIUM-CHART-Fundament — echte beschriftete Achsen (X & Y), Gitternetz,
// großzügige Abstände, Legende. Alle Kurven bauen darauf auf.
import {useCurrentFrame} from 'remotion';
import {calculateSavingsPlanSeries} from '../finance/calculations';
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

// ---- Konkrete Premium-Charts mit nachvollziehbaren Beispielannahmen ----
const monthly100At7For30Years = calculateSavingsPlanSeries({
  contributionPerPeriod: 100,
  annualReturnRate: 0.07,
  years: 30,
}).map((point) => point.value);

const monthly100At1Point2For30Years = calculateSavingsPlanSeries({
  contributionPerPeriod: 100,
  annualReturnRate: 0.012,
  years: 30,
}).map((point) => point.value);

const monthly100At7For40Years = calculateSavingsPlanSeries({
  contributionPerPeriod: 100,
  annualReturnRate: 0.07,
  years: 40,
}).map((point) => point.value);

const euroThousands = (value: number) => value === 0 ? '0' : `${Math.round(value / 1000)} Tsd.`;

export const FNLineChartPro: React.FC = () => (
  <PremiumChart
    title="So wächst ein Sparplan"
    caption="Beispielrechnung: 100 € monatlich, 7 % p. a., 30 Jahre, Einzahlung am Monatsende — ohne Kosten, Steuern und Inflation."
    xTitle="Jahre"
    yTitle="Wert (€)"
    xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={125000}
    yTicks={[0, 25000, 50000, 75000, 100000, 125000]}
    yFmt={euroThousands}
    series={[{label: 'Beispiel-Sparplan', color: P.green, data: monthly100At7For30Years, area: true}]}
  />
);

export const FNDualLinePro: React.FC = () => (
  <PremiumChart
    title="Zwei Rendite-Annahmen"
    caption="Beispielrechnung: jeweils 100 € monatlich über 30 Jahre; 1,2 % p. a. gegenüber 7 % p. a. — keine Renditegarantie."
    xTitle="Jahre"
    yTitle="Wert (€)"
    xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={125000}
    yTicks={[0, 25000, 50000, 75000, 100000, 125000]}
    yFmt={euroThousands}
    series={[
      {label: '1,2 % p. a.', color: P.muted, data: monthly100At1Point2For30Years, dash: true},
      {label: '7 % p. a.', color: P.green, data: monthly100At7For30Years, area: true},
    ]}
  />
);

export const FNCompoundPro: React.FC = () => (
  <PremiumChart
    title="Zeit verändert das Ergebnis"
    caption="Beispielrechnung: 100 € monatlich, 7 % p. a., 40 Jahre, Einzahlung am Monatsende — ohne Kosten, Steuern und Inflation."
    xTitle="Jahre"
    yTitle="Wert (€)"
    xLabels={['0', '10', '20', '30', '40']}
    yMax={275000}
    yTicks={[0, 50000, 100000, 150000, 200000, 250000]}
    yFmt={euroThousands}
    series={[{label: 'Beispiel-Sparplan', color: P.gold, data: monthly100At7For40Years, area: true}]}
  />
);

export const FNDrawdownPro: React.FC = () => (
  <PremiumChart
    title="Schematischer Crash-Verlauf"
    caption="Illustratives Beispiel — keine historischen Marktdaten und keine Prognose für zukünftige Entwicklungen."
    xTitle="Phasen"
    yTitle="Beispielindex"
    xLabels={['Start', 'Anstieg', 'Crash', 'Erholung', 'Neues Hoch']}
    yMax={150}
    yTicks={[0, 30, 60, 90, 120, 150]}
    yFmt={(n) => `${n}`}
    series={[{label: 'Beispielindex', color: P.green, data: [100, 110, 95, 70, 82, 96, 108, 120, 135], area: true}]}
  />
);
