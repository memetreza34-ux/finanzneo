// FinanzNeo SZENEN — volle Fläche: Visual + Text gemischt, premium, für komplexe Themen.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, bebas, inter, StaticBG} from './fn_core';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);
// Text-Seite: Kicker + Headline + Punkte + Stat (gestaffelt)
const TextPanel: React.FC<{kicker: string; title: string; points: string[]; stat?: string; statLabel?: string; accent?: string}> =
({kicker, title, points, stat, statLabel, accent = C.green}) => {
  const f = useCurrentFrame();
  return <div style={{maxWidth: 760}}>
    <div style={{fontFamily: inter, fontSize: 32, fontWeight: 800, letterSpacing: 6, color: accent, opacity: rev(f, 2)}}>{kicker}</div>
    <div style={{fontFamily: bebas, fontSize: 110, color: C.ink, lineHeight: 1.02, marginTop: 10, opacity: rev(f, 10)}}>{title}</div>
    <div style={{marginTop: 36, display: 'flex', flexDirection: 'column', gap: 22}}>
      {points.map((p, i) => {const g = rev(f, 34 + i * 12, 16);
        return <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 18, opacity: g, transform: `translateX(${(1 - g) * 24}px)`}}>
          <div style={{width: 16, height: 16, borderRadius: 5, background: accent, marginTop: 14, flexShrink: 0, boxShadow: `0 0 14px ${accent}`}} />
          <div style={{fontFamily: inter, fontSize: 40, color: C.ink, lineHeight: 1.3}}>{p}</div></div>;})}
    </div>
    {stat && <div style={{marginTop: 44, opacity: rev(f, 40 + points.length * 12)}}>
      <div style={{fontFamily: bebas, fontSize: 96, color: accent, lineHeight: 1, filter: `drop-shadow(0 0 30px ${accent}66)`}}>{stat}</div>
      {statLabel && <div style={{fontFamily: inter, fontSize: 30, color: C.muted}}>{statLabel}</div>}</div>}
  </div>;
};

const Split: React.FC<{left: React.ReactNode; right: React.ReactNode; flip?: boolean}> = ({left, right, flip}) => (
  <AbsoluteFill>
    <StaticBG />
    <div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', padding: '0 110px', gap: 90,
      flexDirection: flip ? 'row-reverse' : 'row'}}>
      <div style={{flex: 1.05, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{left}</div>
      <div style={{flex: 0.95}}>{right}</div>
    </div>
  </AbsoluteFill>
);

// ---------- Linke Visuals (panel-groß) ----------
const CompoundCurve: React.FC = () => {
  const f = useCurrentFrame(); const W = 820, H = 600; const draw = c01((f - 8) / 60); const fn = (x: number) => Math.pow(x, 2.8);
  const pts = new Array(46).fill(0).map((_, i) => {const x = i / 45; return [40 + x * (W - 80), H - 50 - fn(x) * (H - 120)];});
  const shown = pts.slice(0, Math.max(2, Math.ceil(draw * pts.length)));
  const line = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${shown[shown.length - 1][0]},${H - 50} L40,${H - 50} Z`;
  const tip = shown[shown.length - 1];
  return <svg width={W} height={H} style={{fontFamily: bebas}}>
    <defs><linearGradient id="ccg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity={0.5} /><stop offset="100%" stopColor={C.green} stopOpacity={0} /></linearGradient></defs>
    <line x1={40} y1={H - 50} x2={W - 40} y2={H - 50} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
    <path d={area} fill="url(#ccg)" opacity={draw} />
    <path d={line} fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" style={{filter: `drop-shadow(0 0 14px ${C.green})`}} />
    <circle cx={tip[0]} cy={tip[1]} r={15} fill={C.greenLt} style={{filter: `drop-shadow(0 0 18px ${C.greenLt})`}} />
  </svg>;
};

const InflationErode: React.FC = () => {
  const f = useCurrentFrame(); const shrink = eo(c01((f - 20) / 70)); const val = 100 - shrink * 33;
  return <div style={{position: 'relative', textAlign: 'center', fontFamily: bebas, width: 820, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {f > 20 && new Array(20).fill(0).map((_, i) => {const p = c01((f - 20 - i * 2) / 60);
      return <div key={i} style={{position: 'absolute', left: `${45 + (i % 7) * 2}%`, top: `${40 + p * 50}%`, fontSize: 26, opacity: (1 - p) * 0.7}}>🍂</div>;})}
    <div style={{fontSize: 280, color: C.gold, filter: `drop-shadow(0 0 40px ${C.gold}66)`, opacity: 1 - shrink * 0.3, transform: `scale(${1 - shrink * 0.25})`}}>{Math.round(val)}€</div>
  </div>;
};

const TwoBars: React.FC<{a?: [string, number, string]; b?: [string, number, string]}> =
({a = ['Sparbuch', 0.32, C.red], b = ['ETF', 1.0, C.green]}) => {
  const f = useCurrentFrame(); const g = eo(c01((f - 12) / 50)); const Hm = 480;
  const bar = (d: [string, number, string]) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
    <div style={{width: 180, height: Hm * d[1] * g, borderRadius: 18, background: `linear-gradient(180deg,${d[2]},${d[2]}aa)`, boxShadow: `0 0 30px ${d[2]}66`}} />
    <div style={{marginTop: 16, fontFamily: bebas, fontSize: 52, color: C.ink}}>{d[0]}</div></div>;
  return <div style={{display: 'flex', gap: 90, alignItems: 'flex-end', height: 600}}>{bar(a)}{bar(b)}</div>;
};

const Rings: React.FC = () => {
  const f = useCurrentFrame(); const cx = 300, cy = 300; const rings: [number, string][] = [[0.6, C.green], [0.25, C.gold], [0.15, C.blue]];
  return <svg width={600} height={600}>
    {rings.map(([v, col], i) => {const R = 240 - i * 72; const CIRC = 2 * Math.PI * R; const g = eo(c01((f - i * 10) / 45));
      return <g key={i}><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={46} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={col} strokeWidth={46} strokeLinecap="round" strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - v * g)} transform={`rotate(-90 ${cx} ${cy})`} style={{filter: `drop-shadow(0 0 12px ${col}88)`}} /></g>;})}
  </svg>;
};

const MiniCandles: React.FC = () => {
  const f = useCurrentFrame(); const W = 820, H = 560, N = 12, base = H - 60;
  const rng = (i: number) => Math.sin(i * 91.7) * 0.5 + 0.5; let price = 0.35;
  const cs = new Array(N).fill(0).map((_, i) => {const o = price; price += (rng(i) - 0.4) * 0.13; const c = Math.max(0.05, Math.min(0.95, price));
    return {o, c, hi: Math.max(o, c) + rng(i + 5) * 0.06, lo: Math.min(o, c) - rng(i + 9) * 0.06, up: c >= o};});
  const cw = (W - 80) / N; const y = (v: number) => base - v * (H - 160);
  return <svg width={W} height={H}>
    <line x1={40} y1={base} x2={W - 40} y2={base} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
    {cs.map((cd, i) => {const x = 40 + cw * (i + 0.5); const show = rev(f, i * 5, 10); if (show <= 0) return null; const col = cd.up ? C.green : C.red;
      return <g key={i} opacity={show} style={{filter: `drop-shadow(0 0 5px ${col}66)`}}>
        <line x1={x} y1={y(cd.hi)} x2={x} y2={y(cd.lo)} stroke={col} strokeWidth={3} />
        <rect x={x - cw * 0.3} y={y(Math.max(cd.o, cd.c))} width={cw * 0.6} height={Math.max(3, Math.abs(y(cd.o) - y(cd.c)))} fill={col} rx={3} /></g>;})}
  </svg>;
};

// ---------- SZENEN ----------
export const FNCompoundScene: React.FC = () => (
  <Split left={<CompoundCurve />} right={<TextPanel kicker="ZINSESZINS"
    title={'Geld, das\nGeld macht'} accent={C.green}
    points={['Deine Gewinne erzeugen wieder Gewinne', 'Je früher du startest, desto stärker der Effekt', 'Zeit ist wichtiger als die Höhe']}
    stat="+340%" statLabel="aus 100 € über 40 Jahre (7 % p.a.)" />} />
);

export const FNInflationScene: React.FC = () => (
  <Split flip left={<InflationErode />} right={<TextPanel kicker="INFLATION" accent={C.gold}
    title={'Dein Geld\nschrumpft'}
    points={['Bei 2 % Inflation verlierst du jedes Jahr Kaufkraft', 'Auf dem Sparbuch frisst sie deine Rendite auf', 'Nur Anlagen über der Inflationsrate schützen']}
    stat="−33%" statLabel="Kaufkraft in 20 Jahren" />} />
);

export const FNCompareScene: React.FC = () => (
  <Split left={<TwoBars />} right={<TextPanel kicker="SPARBUCH VS. ETF" accent={C.green}
    title={'Der teure\nUnterschied'}
    points={['10.000 € über 25 Jahre angelegt', 'Sparbuch: kaum mehr als eingezahlt', 'Breit gestreuter ETF: ein Vielfaches']}
    stat="+185%" statLabel="Mehr-Ertrag durch Investieren" />} />
);

export const FNPortfolioScene: React.FC = () => (
  <Split flip left={<Rings />} right={<TextPanel kicker="ASSET ALLOCATION" accent={C.gold}
    title={'Richtig\nverteilen'}
    points={['60 % Aktien — Wachstumsmotor', '25 % Immobilien — Stabilität', '15 % Cash — Sicherheit & Flexibilität']}
    stat="3 Töpfe" statLabel="Risiko klug gestreut" />} />
);

export const FNMarketScene: React.FC = () => (
  <Split left={<MiniCandles />} right={<TextPanel kicker="DER MARKT" accent={C.green}
    title={'Auf und ab —\nund trotzdem hoch'}
    points={['Kurse schwanken täglich (rote & grüne Kerzen)', 'Kurzfristig: Chaos. Langfristig: Aufwärts', 'Wer ruhig bleibt, gewinnt']}
    stat="~7% p.a." statLabel="Weltmarkt im langen Schnitt" />} />
);
