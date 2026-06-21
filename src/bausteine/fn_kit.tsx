import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, Glass} from './fn_core';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const sp = (f: number, fps: number, d = 13, delay = 4) => spring({frame: f - delay, fps, config: {damping: d}});

// ── FNTitle ── Gradient-Glow-Titel + Untertitel
export const FNTitle: React.FC<{title?: string; sub?: string}> =
({title = 'INFLATION', sub = 'einfach erklärt'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = sp(f, fps); const shim = interpolate(f, [0, 90], [0, 300]);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: bebas, fontSize: 220, lineHeight: 1, transform: `scale(${s})`,
      background: `linear-gradient(90deg, ${C.green}, ${C.gold}, ${C.greenLt}, ${C.green})`,
      backgroundSize: '300% 100%', backgroundPosition: `${shim}% 0%`,
      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      filter: 'drop-shadow(0 0 45px rgba(0,210,106,0.5))'}}>{title}</div>
    <div style={{fontFamily: inter, fontSize: 44, fontWeight: 600, color: C.ink,
      opacity: interpolate(f, [22, 42], [0, 1], CL), letterSpacing: 2, marginTop: 8}}>{sub}</div>
  </AbsoluteFill>;
};

// ── FNBigNumber ── Spring-Count-Up mit Glow
export const FNBigNumber: React.FC<{to?: number; prefix?: string; suffix?: string; label?: string; color?: string}> =
({to = 67000, prefix = '', suffix = ' €', label = 'aus 100 € über 40 Jahre', color = C.green}) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [8, 78], [0, to], CL);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: bebas, fontSize: 240, color, lineHeight: 1,
      filter: `drop-shadow(0 0 50px ${color}88)`}}>{prefix}{de(n)}{suffix}</div>
    <div style={{fontFamily: inter, fontSize: 40, color: C.muted, marginTop: 6,
      opacity: interpolate(f, [10, 26], [0, 1], CL)}}>{label}</div>
  </AbsoluteFill>;
};

// ── FNStatCard ── Glassmorphism-Karte
export const FNStatCard: React.FC<{value?: string; label?: string; sub?: string; color?: string}> =
({value = '7 % p.a.', label = 'Ø Rendite Weltmarkt', sub = 'historisch, breit gestreut', color = C.gold}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = sp(f, fps, 14);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{transform: `scale(${s})`}}><Glass style={{textAlign: 'center'}}>
      <div style={{fontFamily: inter, fontSize: 34, color: C.muted}}>{label}</div>
      <div style={{fontFamily: bebas, fontSize: 170, color, lineHeight: 1.05,
        filter: `drop-shadow(0 0 40px ${color}88)`}}>{value}</div>
      <div style={{fontFamily: inter, fontSize: 30, color: C.ink, opacity: 0.8}}>{sub}</div>
    </Glass></div>
  </AbsoluteFill>;
};

// ── FNCompareBars ── zwei leuchtende Säulen + Werte
type Side = {label: string; val: number; color: string};
export const FNCompareBars: React.FC<{title?: string; sub?: string; left?: Side; right?: Side}> =
({title = 'Sparkonto vs. Investiert', sub = '10.000 € nach 20 Jahren',
  left = {label: 'Sparkonto', val: 6700, color: C.red}, right = {label: 'Investiert', val: 31000, color: C.green}}) => {
  const f = useCurrentFrame(); const g = interpolate(f, [12, 60], [0, 1], CL);
  const mx = Math.max(left.val, right.val); const H = 560;
  const bar = (d: Side, x: number) => {
    const h = H * (d.val / mx) * g;
    return <div style={{position: 'absolute', left: x, bottom: 240, width: 280, textAlign: 'center'}}>
      <div style={{fontFamily: bebas, fontSize: 64, color: C.ink, marginBottom: 12,
        opacity: interpolate(f, [30, 50], [0, 1], CL)}}>{de(d.val * g)} €</div>
      <div style={{width: 280, height: h, borderRadius: 20, margin: '0 auto',
        background: `linear-gradient(180deg, ${d.color}, ${d.color}aa)`,
        boxShadow: `0 0 50px ${d.color}66`}} />
      <div style={{fontFamily: inter, fontSize: 36, color: d.color, marginTop: 16, fontWeight: 700}}>{d.label}</div>
    </div>;
  };
  return <AbsoluteFill>
    <div style={{textAlign: 'center', marginTop: 90}}>
      <div style={{fontFamily: bebas, fontSize: 90, color: C.ink}}>{title}</div>
      <div style={{fontFamily: inter, fontSize: 36, color: C.muted}}>{sub}</div>
    </div>
    {bar(left, 560)}{bar(right, 1080)}
  </AbsoluteFill>;
};

// ── FNGrowthCurve ── SVG Exp-Kurve, Gradient-Stroke, Glow, gezeichnet
export const FNGrowthCurve: React.FC<{label?: string}> = ({label = '+240 %'}) => {
  const f = useCurrentFrame(); const W = 1920, H = 1080;
  const draw = interpolate(f, [6, 70], [0, 1], CL);
  const pts = Array.from({length: 40}, (_, i) => {
    const t = i / 39; const y = (Math.exp(3.2 * t) - 1) / (Math.exp(3.2) - 1);
    return [180 + t * (W - 360), H - 200 - y * (H - 460)];
  });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const tip = pts[Math.max(0, Math.floor(draw * (pts.length - 1)))];
  return <AbsoluteFill>
    <svg width={W} height={H}>
      <defs>
        <linearGradient id="fkg" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor={C.green} /><stop offset="100%" stopColor={C.gold} /></linearGradient>
        <linearGradient id="fka" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity={0.35} /><stop offset="100%" stopColor={C.green} stopOpacity={0} /></linearGradient>
      </defs>
      <line x1={180} y1={H - 200} x2={W - 180} y2={H - 200} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      <path d={`${d} L${pts[pts.length - 1][0]},${H - 200} L${pts[0][0]},${H - 200} Z`} fill="url(#fka)" opacity={draw} />
      <path d={d} fill="none" stroke="url(#fkg)" strokeWidth={10} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: 'drop-shadow(0 0 16px rgba(0,210,106,0.7))'}} />
      <circle cx={tip[0]} cy={tip[1]} r={16} fill={C.greenLt} style={{filter: 'drop-shadow(0 0 20px rgba(92,255,173,0.9))'}} />
    </svg>
    <div style={{position: 'absolute', left: 200, top: 150, fontFamily: bebas, fontSize: 130, color: C.gold,
      opacity: interpolate(f, [50, 70], [0, 1], CL), filter: 'drop-shadow(0 0 30px rgba(255,200,61,0.5))'}}>{label}</div>
  </AbsoluteFill>;
};

// ── FNDonut ── Conic-Gradient-Donut + Legende
export const FNDonut: React.FC<{title?: string; segments?: {v: number; color: string; label: string}[]}> =
({title = 'Dein Budget', segments = [{v: 0.4, color: C.blue, label: 'Wohnen'}, {v: 0.25, color: C.green, label: 'Sparen'}, {v: 0.2, color: C.gold, label: 'Leben'}, {v: 0.15, color: C.purple, label: 'Rest'}]}) => {
  const f = useCurrentFrame(); const g = interpolate(f, [10, 70], [0, 1], CL);
  let acc = 0; const stops: string[] = [];
  segments.forEach((s) => {
    const a = acc * 360, b = (acc + s.v * g) * 360;
    stops.push(`${s.color} ${a}deg ${b}deg`); acc += s.v;
  });
  stops.push(`rgba(255,255,255,0.06) ${acc * g * 360}deg 360deg`);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 120}}>
    <div style={{width: 480, height: 480, borderRadius: '50%', background: `conic-gradient(${stops.join(',')})`,
      filter: 'drop-shadow(0 0 40px rgba(0,210,106,0.3))', position: 'relative'}}>
      <div style={{position: 'absolute', inset: 120, borderRadius: '50%', background: C.bgDeep}} />
    </div>
    <div>{segments.map((s, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
        opacity: interpolate(f, [20 + i * 8, 36 + i * 8], [0, 1], CL)}}>
        <div style={{width: 34, height: 34, borderRadius: 10, background: s.color, boxShadow: `0 0 18px ${s.color}88`}} />
        <span style={{fontFamily: inter, fontSize: 40, color: C.ink}}>{s.label}</span>
        <span style={{fontFamily: bebas, fontSize: 44, color: s.color}}>{Math.round(s.v * 100)} %</span>
      </div>))}</div>
  </AbsoluteFill>;
};

// ── FNHook ── großer Hook mit Glow
export const FNHook: React.FC<{kicker?: string; text?: string; color?: string}> =
({kicker = 'WUSSTEST DU?', text = 'Dein Geld halbiert sich in 35 Jahren.', color = C.gold}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = sp(f, fps, 11);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 160px'}}>
    <div style={{fontFamily: bebas, fontSize: 60, color, letterSpacing: 4, transform: `scale(${s})`,
      filter: `drop-shadow(0 0 30px ${color}77)`}}>{kicker}</div>
    <div style={{fontFamily: bebas, fontSize: 120, color: C.ink, lineHeight: 1.05, marginTop: 24,
      opacity: interpolate(f, [16, 36], [0, 1], CL)}}>{text}</div>
  </AbsoluteFill>;
};

// ── FNTicker ── Kurs-Liste (Glass-Reihen, rot/grün)
export const FNTicker: React.FC<{items?: [string, string, boolean][]}> =
({items = [['MSCI World', '+8,1 %', true], ['S&P 500', '+10,4 %', true], ['Tagesgeld', '+1,0 %', true], ['Sparbuch', '-2,0 %', false]]}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 1100}}>{items.map(([sym, chg, up], i) => (
      <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '28px 44px', marginBottom: 22, borderRadius: 20, backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
        opacity: interpolate(f, [i * 8, i * 8 + 16], [0, 1], CL),
        transform: `translateX(${interpolate(f, [i * 8, i * 8 + 16], [40, 0], CL)}px)`}}>
        <span style={{fontFamily: bebas, fontSize: 54, color: C.ink}}>{sym}</span>
        <span style={{fontFamily: bebas, fontSize: 54, color: up ? C.green : C.red,
          filter: `drop-shadow(0 0 16px ${(up ? C.green : C.red)}66)`}}>{up ? '▲' : '▼'} {chg}</span>
      </div>))}</div>
  </AbsoluteFill>;
};

// ── FNEndCard ── Glass-Chips Like/Kommentar/Abo
export const FNEndCard: React.FC<{title?: string}> = ({title = 'Danke fürs Zuschauen!'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = sp(f, fps, 13);
  const chips: [string, string][] = [['👍', 'Like'], ['💬', 'Kommentar'], ['🔔', 'Abo']];
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: bebas, fontSize: 110, color: C.ink, transform: `scale(${s})`,
      filter: 'drop-shadow(0 0 30px rgba(0,210,106,0.4))'}}>{title}</div>
    <div style={{display: 'flex', gap: 32, marginTop: 50}}>{chips.map(([ic, t], i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '24px 40px', borderRadius: 20,
        backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
        fontFamily: inter, fontSize: 40, fontWeight: 700, color: C.ink,
        opacity: interpolate(f, [24 + i * 10, 40 + i * 10], [0, 1], CL)}}>
        <span style={{fontSize: 48}}>{ic}</span>{t}</div>))}</div>
  </AbsoluteFill>;
};
