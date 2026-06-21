// FinanzNeo PRO — volle Premium-Qualität, STRENGE Farbführung (Grün + Gold + Neutral),
// dezenter Glow, feine Typo, viel Luft. Keine bunten Kombis.
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, P} from './fn_core';
import {PremiumChart} from './fn_chart_base';
export {P};
const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 16) => Math.max(0, Math.min(1, (f - s) / d));
const soft = '0 30px 80px rgba(0,0,0,0.45)';
const glow = (c: string, o = 0.25) => `drop-shadow(0 0 46px ${c}${Math.round(o * 255).toString(16).padStart(2, '0')})`;

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, letterSpacing: 8, color: P.muted, opacity: rev(f, 2), textTransform: 'uppercase'}}>{children}</div>;
};

// 1) Hero-Zahl — die eine große Aussage, edel
export const FNHeroNumber: React.FC<{kicker?: string; to?: number; suffix?: string; label?: string}> =
({kicker = 'Aus 100 € monatlich', to = 248000, suffix = ' €', label = 'nach 30 Jahren · 7 % p.a.'}) => {
  const f = useCurrentFrame(); const n = interpolate(f, [10, 80], [0, to], CL);
  return <div style={{textAlign: 'center'}}>
    <Kicker>{kicker}</Kicker>
    <div style={{fontFamily: bebas, fontSize: 320, color: P.gold, lineHeight: 1, letterSpacing: 2, marginTop: 6, filter: glow(P.gold, 0.22)}}>{de(n)}{suffix}</div>
    <div style={{height: 2, width: 360, margin: '18px auto 0', background: `linear-gradient(90deg, transparent, ${P.line}, transparent)`}} />
    <div style={{fontFamily: inter, fontSize: 40, color: P.muted, marginTop: 22, opacity: rev(f, 26)}}>{label}</div>
  </div>;
};

// 2) Balken — eine Akzentfarbe (grün), Rest neutral, dezent
export const FNBarsClean: React.FC<{title?: string; data?: [string, number, boolean][]}> =
({title = 'Welche Anlage wächst am stärksten?', data = [['Sparbuch', 0.18, false], ['Anleihen', 0.42, false], ['Immobilien', 0.7, false], ['Aktien', 1.0, true]]}) => {
  const f = useCurrentFrame(); const mx = 520;
  return <div style={{textAlign: 'center'}}>
    <div style={{fontFamily: bebas, fontSize: 70, color: P.ink, marginBottom: 60}}>{title}</div>
    <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 56, height: 600}}>
      {data.map(([l, v, hi], i) => {const g = eo(Math.max(0, Math.min(1, (f - 14 - i * 8) / 42)));
        return <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontFamily: bebas, fontSize: hi ? 64 : 48, color: hi ? P.green : P.muted, marginBottom: 16, opacity: rev(f, 30 + i * 6)}}>{Math.round(v * 100)}</div>
          <div style={{width: 150, height: mx * v * g, borderRadius: 16,
            background: hi ? `linear-gradient(180deg, ${P.greenLt}, ${P.green})` : P.greenDeep,
            boxShadow: hi ? `0 0 50px ${P.green}40, ${soft}` : soft,
            border: hi ? 'none' : `1px solid ${P.line}`}} />
          <div style={{fontFamily: inter, fontSize: 34, fontWeight: hi ? 700 : 500, color: hi ? P.ink : P.muted, marginTop: 18}}>{l}</div>
        </div>;})}
    </div>
  </div>;
};

// 3) Linie — jetzt mit beschrifteten Achsen (PremiumChart)
const expData = (max: number, k = 2.6, N = 31) => new Array(N).fill(0).map((_, i) => {const x = i / (N - 1); return (Math.exp(k * x) - 1) / (Math.exp(k) - 1) * max;});
export const FNLineClean: React.FC = () => (
  <PremiumChart title="Dein Depot über die Zeit" caption="Breit gestreut investiert — der Wert wächst mit den Jahren."
    xTitle="Jahre" yTitle="Wert (€)" xLabels={['0', '5', '10', '15', '20', '25', '30']}
    yMax={250000} yTicks={[0, 50000, 100000, 150000, 200000, 250000]} yFmt={(n) => `${n / 1000}k`}
    series={[{label: 'Depot', color: P.green, data: expData(242000), area: true}]} />
);

// 4) Stat-Triptychon — 3 Kennzahlen mit Hairline-Trennern (editorial)
export const FNStatTriptych: React.FC<{stats?: [string, string][]}> =
({stats = [['7 %', 'Ø Rendite p.a.'], ['25 J.', 'Anlagehorizont'], ['0 €', 'Aufwand pro Monat*']]}) => {
  const f = useCurrentFrame();
  return <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
    {stats.map(([v, l], i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center'}}>
        <div style={{textAlign: 'center', padding: '0 80px', opacity: rev(f, i * 12)}}>
          <div style={{fontFamily: bebas, fontSize: 200, color: i === 0 ? P.green : P.ink, lineHeight: 1, filter: i === 0 ? glow(P.green, 0.2) : 'none'}}>{v}</div>
          <div style={{fontFamily: inter, fontSize: 36, color: P.muted, marginTop: 14}}>{l}</div>
        </div>
        {i < stats.length - 1 && <div style={{width: 1.5, height: 220, background: P.line}} />}
      </div>))}
  </div>;
};

// 5) Donut — tonal (grün→hellgrün→gold), kein Buntmix
export const FNDonutClean: React.FC<{title?: string; segs?: [string, number, string][]}> =
({title = 'So teilst du 1.000 € auf', segs = [['Investieren', 0.6, P.green], ['Notgroschen', 0.25, P.greenLt], ['Spaß', 0.15, P.gold]]}) => {
  const f = useCurrentFrame(); const g = Math.max(0, Math.min(1, (f - 10) / 55)); let acc = 0; const stops: string[] = [];
  segs.forEach((s) => {const a = acc * 360, b = (acc + s[1] * g) * 360; stops.push(`${s[2]} ${a}deg ${b}deg`); acc += s[1];});
  stops.push(`rgba(255,255,255,0.05) ${acc * g * 360}deg 360deg`);
  return <div style={{display: 'flex', alignItems: 'center', gap: 110}}>
    <div style={{width: 480, height: 480, borderRadius: '50%', background: `conic-gradient(${stops.join(',')})`, position: 'relative', boxShadow: soft}}>
      <div style={{position: 'absolute', inset: 130, borderRadius: '50%', background: C.bgDeep}} />
    </div>
    <div>
      <div style={{fontFamily: bebas, fontSize: 64, color: P.ink, marginBottom: 30}}>{title}</div>
      {segs.map(([l, v, col], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: rev(f, 24 + i * 10)}}>
          <div style={{width: 30, height: 30, borderRadius: 8, background: col}} />
          <span style={{fontFamily: inter, fontSize: 42, color: P.ink, width: 320}}>{l}</span>
          <span style={{fontFamily: bebas, fontSize: 56, color: col}}>{Math.round(v * 100)} %</span>
        </div>))}
    </div>
  </div>;
};

// 6) Vergleich — Grün (gut) vs. Neutral (schwach), Gold-Delta. Kein Rot-Clash.
export const FNCompareClean: React.FC<{a?: [string, number]; b?: [string, number]; delta?: string}> =
({a = ['Sparbuch', 0.3], b = ['ETF (Welt)', 1.0], delta = '5× mehr'}) => {
  const f = useCurrentFrame(); const g = eo(Math.max(0, Math.min(1, (f - 12) / 48))); const Hm = 520;
  const bar = (d: [string, number], hi: boolean) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: 220, height: Hm * d[1] * g, borderRadius: 18,
      background: hi ? `linear-gradient(180deg,${P.greenLt},${P.green})` : P.greenDeep, border: hi ? 'none' : `1px solid ${P.line}`,
      boxShadow: hi ? `0 0 50px ${P.green}40, ${soft}` : soft}} />
    <div style={{fontFamily: inter, fontSize: 40, fontWeight: hi ? 700 : 500, color: hi ? P.ink : P.muted, marginTop: 20}}>{d[0]}</div></div>;
  return <div style={{position: 'relative', display: 'flex', gap: 150, alignItems: 'flex-end', height: 660}}>
    {bar(a, false)}{bar(b, true)}
    {f > 70 && <div style={{position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', fontFamily: bebas, fontSize: 100, color: P.gold,
      opacity: rev(f, 70), filter: glow(P.gold, 0.2)}}>{delta}</div>}
  </div>;
};

// 7) Zitat — editorial, viel Luft
export const FNQuoteClean: React.FC<{quote?: string; author?: string}> =
({quote = 'Nicht Timing am Markt, sondern Zeit im Markt macht reich.', author = 'Börsenweisheit'}) => {
  const f = useCurrentFrame(); const words = quote.split(' ');
  return <div style={{textAlign: 'center', maxWidth: 1400}}>
    <div style={{fontFamily: bebas, fontSize: 160, color: P.gold, lineHeight: 0.4, opacity: rev(f, 2)}}>“</div>
    <div style={{fontFamily: bebas, fontSize: 96, color: P.ink, lineHeight: 1.15, display: 'flex', flexWrap: 'wrap', gap: '0 24px', justifyContent: 'center'}}>
      {words.map((w, i) => {const g = rev(f, 12 + i * 5, 14); return <span key={i} style={{opacity: g, transform: `translateY(${(1 - g) * 14}px)`, display: 'inline-block'}}>{w}</span>;})}
    </div>
    <div style={{fontFamily: inter, fontSize: 36, color: P.muted, marginTop: 40, letterSpacing: 2, opacity: rev(f, 12 + words.length * 5)}}>— {author}</div>
  </div>;
};
