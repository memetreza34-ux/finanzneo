// FinanzNeo FINANZ-KERN — die fehlenden Finanz-Essentials, Pro-Palette.
import {useCurrentFrame, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';
import {P} from './fn_pro';
import {calculateSavingsPlanFutureValue} from '../finance/calculations';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const c01 = (t: number) => Math.max(0, Math.min(1, t));
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);
const glow = (c: string, o = 0.25) => `drop-shadow(0 0 46px ${c}${Math.round(o * 255).toString(16).padStart(2, '0')})`;

const Frame: React.FC<{title: string; caption?: string; children: React.ReactNode}> = ({title, caption, children}) => {
  const f = useCurrentFrame();
  return <div style={{textAlign: 'center', width: 1600}}>
    <div style={{fontFamily: bebas, fontSize: 84, color: P.ink, opacity: rev(f, 2)}}>{title}</div>
    <div style={{margin: '48px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 540}}>{children}</div>
    {caption && <div style={{fontFamily: inter, fontSize: 40, color: P.muted, opacity: rev(f, 60), maxWidth: 1300, margin: '0 auto'}}>{caption}</div>}
  </div>;
};

// 1) Vergleichstabelle
export const FNCompareTable: React.FC = () => {
  const f = useCurrentFrame(); const cols = ['MSCI World', 'S&P 500', 'DAX']; const best = 0;
  const rows: [string, string[]][] = [['Rendite Ø p.a.', ['7 %', '10 %', '8 %']], ['Kosten (TER)', ['0,20 %', '0,07 %', '0,30 %']], ['Firmen', ['~1.500', '500', '40']], ['Streuung', ['Welt', 'USA', 'Deutschland']]];
  const cell = (txt: string, hi: boolean, ci: number, ri: number) => (
    <div style={{padding: '24px 0', fontFamily: ci === -1 ? inter : bebas, fontSize: ci === -1 ? 34 : 44,
      color: ci === -1 ? P.muted : hi ? P.green : P.ink, background: hi ? `${P.green}12` : 'transparent',
      borderBottom: `1px solid ${P.line}`, opacity: rev(f, 14 + ri * 10)}}>{txt}</div>
  );
  return <Frame title="ETF-Vergleich" caption="Breit gestreut, günstig — der Welt-ETF gewinnt für Einsteiger.">
    <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', width: 1400}}>
      <div />{cols.map((c2, i) => <div key={i} style={{padding: '20px 0', fontFamily: bebas, fontSize: 50, color: i === best ? P.green : P.ink, opacity: rev(f, 6), borderBottom: `2px solid ${i === best ? P.green : P.line}`}}>{i === best ? '★ ' : ''}{c2}</div>)}
      {rows.map(([label, vals], ri) => <>{cell(label, false, -1, ri)}{vals.map((v, ci) => <div key={ci}>{cell(v, ci === best, ci, ri)}</div>)}</>)}
    </div>
  </Frame>;
};

// 2) Dual-Line — zwei Kurven über Zeit
export const FNDualLine: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 560; const draw = c01((f - 8) / 70);
  const spar = (x: number) => x * 0.18; const etf = (x: number) => (Math.exp(2.5 * x) - 1) / (Math.exp(2.5) - 1);
  const path = (fn: (x: number) => number) => {const pts = new Array(40).fill(0).map((_, i) => {const x = i / 39; return [70 + x * (W - 140), H - 60 - fn(x) * (H - 130)];}); return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');};
  return <Frame title="Sparen vs. Investieren" caption="Gleicher Einsatz, 30 Jahre — der Unterschied wächst jedes Jahr.">
    <svg width={W} height={H} style={{fontFamily: bebas}}>
      <line x1={70} y1={H - 60} x2={W - 70} y2={H - 60} stroke={P.line} strokeWidth={2} />
      <path d={path(spar)} fill="none" stroke={P.muted} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d={path(etf)} fill="none" stroke={P.green} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: glow(P.green, 0.3)}} />
      {draw > 0.95 && <><text x={W - 80} y={H - 60 - etf(1) * (H - 130) - 24} fontSize={44} fill={P.green} textAnchor="end" opacity={rev(f, 72)}>ETF</text>
        <text x={W - 80} y={H - 60 - spar(1) * (H - 130) - 18} fontSize={36} fill={P.muted} textAnchor="end" opacity={rev(f, 72)}>Sparbuch</text></>}
    </svg>
  </Frame>;
};

// 3) Formel-Reveal (Zinseszins)
export const FNFormula: React.FC = () => {
  const f = useCurrentFrame();
  const part = (txt: string, sub: string, col: string, delay: number) => (
    <div style={{textAlign: 'center', opacity: rev(f, delay), transform: `translateY(${(1 - rev(f, delay)) * 16}px)`}}>
      <div style={{fontFamily: bebas, fontSize: 150, color: col}}>{txt}</div>
      <div style={{fontFamily: inter, fontSize: 30, color: P.muted, marginTop: -10}}>{sub}</div>
    </div>
  );
  return <Frame title="Die Zinseszins-Formel" caption="Kapital × (1 + Zins) hoch Jahre — die Macht der Zeit (n im Exponenten).">
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 24}}>
      {part('K', 'Startkapital', P.gold, 6)}
      <div style={{fontFamily: bebas, fontSize: 150, color: P.muted}}>×</div>
      {part('(1+r)', 'Zinssatz', P.green, 24)}
      <div style={{fontFamily: bebas, fontSize: 90, color: P.green, marginTop: -10, opacity: rev(f, 42)}}>n</div>
      <div style={{alignSelf: 'center', fontFamily: inter, fontSize: 30, color: P.muted, opacity: rev(f, 50)}}>← Jahre</div>
    </div>
  </Frame>;
};

// 4) Kredit / Tilgung
export const FNLoanAmort: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 520; const draw = c01((f - 8) / 70);
  const pts = new Array(40).fill(0).map((_, i) => {const x = i / 39; const y = 1 - x; return [70 + x * (W - 140), H - 60 - y * (H - 120)];});
  const shown = pts.slice(0, Math.max(2, Math.ceil(draw * pts.length)));
  const line = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const rest = interpolate(f, [8, 78], [200000, 0], CL);
  return <Frame title="Kredit tilgen" caption="Jede Rate senkt die Restschuld — am Ende: schuldenfrei.">
    <div style={{position: 'relative'}}>
      <svg width={W} height={H}>
        <defs><linearGradient id="loan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.gold} stopOpacity={0.3} /><stop offset="100%" stopColor={P.gold} stopOpacity={0} /></linearGradient></defs>
        <line x1={70} y1={H - 60} x2={W - 70} y2={H - 60} stroke={P.line} strokeWidth={2} />
        <path d={`${line} L${shown[shown.length - 1][0]},${H - 60} L70,${H - 60} Z`} fill="url(#loan)" opacity={draw} />
        <path d={line} fill="none" stroke={P.gold} strokeWidth={8} strokeLinecap="round" style={{filter: glow(P.gold, 0.25)}} />
        {draw > 0.95 && <text x={W - 90} y={H - 80} fontSize={40} fontFamily={bebas} fill={P.green} textAnchor="end" opacity={rev(f, 72)}>schuldenfrei ✓</text>}
      </svg>
      <div style={{position: 'absolute', left: 90, top: 10, fontFamily: bebas, fontSize: 80, color: P.ink}}>{de(rest)} €</div>
      <div style={{position: 'absolute', left: 90, top: 100, fontFamily: inter, fontSize: 30, color: P.muted}}>Restschuld</div>
    </div>
  </Frame>;
};

// 5) Anlage-Pyramide
export const FNPyramid: React.FC = () => {
  const f = useCurrentFrame();
  const tiers: [string, string, number, string][] = [
    ['Notgroschen · Tagesgeld', 'Sicherheit', 900, P.greenDeep],
    ['ETF · Anleihen', 'Basis-Vermögen', 620, P.green],
    ['Einzelaktien · Krypto', 'Risiko-Kapital', 320, P.gold],
  ];
  return <Frame title="Die Anlage-Pyramide" caption="Erst die breite, sichere Basis — dann nach oben mit mehr Risiko.">
    <div style={{display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 10}}>
      {tiers.map(([l, tag, w, col], i) => {const g = eo(c01((f - 10 - i * 16) / 26));
        return <div key={i} style={{width: w * g, height: 130, background: col, borderRadius: 12, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${col}40`, opacity: rev(f, 10 + i * 16)}}>
          <div style={{fontFamily: bebas, fontSize: 46, color: i === 0 ? P.ink : C.bgDeep}}>{l}</div>
          <div style={{fontFamily: inter, fontSize: 26, color: i === 0 ? P.muted : 'rgba(6,18,10,0.7)'}}>{tag}</div>
        </div>;})}
    </div>
  </Frame>;
};

// 6) Begriffs-/Definitionskarte
export const FNTermCard: React.FC<{term?: string; full?: string; def?: string; icon?: string}> =
({term = 'ETF', full = 'Exchange Traded Fund', def = 'Ein Korb aus vielen Aktien, der einen ganzen Markt abbildet — günstig & automatisch gestreut.', icon = '🧺'}) => {
  const f = useCurrentFrame();
  return <Frame title="Kurz erklärt">
    <div style={{width: 1200, padding: '60px 80px', borderRadius: 32, background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${P.line}`, boxShadow: '0 30px 80px rgba(0,0,0,0.45)', textAlign: 'left', opacity: rev(f, 6)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <div style={{fontSize: 90}}>{icon}</div>
        <div><div style={{fontFamily: bebas, fontSize: 130, color: P.green, lineHeight: 1, filter: glow(P.green, 0.2)}}>{term}</div>
          <div style={{fontFamily: inter, fontSize: 38, color: P.muted}}>{full}</div></div>
      </div>
      <div style={{height: 2, background: P.line, margin: '36px 0'}} />
      <div style={{fontFamily: inter, fontSize: 44, color: P.ink, lineHeight: 1.4, opacity: rev(f, 24)}}>{def}</div>
    </div>
  </Frame>;
};

// 7) Spar-Rechner (Eingabe → Ergebnis)
// Endwert stammt aus der zentralen Finanzberechnung, nicht aus einer freien Zahl.
const CALCULATOR_RESULT = calculateSavingsPlanFutureValue({
  contributionPerPeriod: 100,
  annualReturnRate: 0.07,
  years: 30,
});

export const FNCalculator: React.FC = () => {
  const f = useCurrentFrame(); const result = interpolate(f, [40, 100], [0, CALCULATOR_RESULT], CL);
  const field = (label: string, val: string, delay: number) => (
    <div style={{padding: '22px 30px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid ${P.line}`, marginBottom: 18, opacity: rev(f, delay), minWidth: 420}}>
      <div style={{fontFamily: inter, fontSize: 28, color: P.muted}}>{label}</div>
      <div style={{fontFamily: bebas, fontSize: 64, color: P.ink}}>{val}</div>
    </div>
  );
  return <Frame title="Spar-Rechner" caption="Kleine Beträge, lange Zeit, Zinseszins — und es wird richtig groß.">
    <div style={{display: 'flex', alignItems: 'center', gap: 70}}>
      <div>{field('Sparrate / Monat', '100 €', 6)}{field('Laufzeit', '30 Jahre', 16)}{field('Rendite', '7 % p.a.', 26)}</div>
      <div style={{fontFamily: bebas, fontSize: 80, color: P.green, opacity: rev(f, 34)}}>=</div>
      <div style={{textAlign: 'center', opacity: rev(f, 38)}}>
        <div style={{fontFamily: bebas, fontSize: 200, color: P.gold, lineHeight: 1, filter: glow(P.gold, 0.22)}}>{de(result)} €</div>
        <div style={{fontFamily: inter, fontSize: 36, color: P.ink}}>aus nur 36.000 € Einzahlung</div>
      </div>
    </div>
  </Frame>;
};
