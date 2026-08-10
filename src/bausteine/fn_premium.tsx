// FinanzNeo PREMIUM/KOMPLEX — finanz-spezifische, wiederverwendbare Animationen (Remotion).
// Technik inspiriert vom KI-Kit (PointGlobe/Orbit/ParticleMorph/IsoBuild/Graph), umgemünzt auf Finanzen.
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5; return x - Math.floor(x);};
const W = 1920, H = 1080;

const Caption: React.FC<{t: string; from?: number}> = ({t, from = 16}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', fontFamily: bebas,
    fontSize: 70, color: C.ink, opacity: interpolate(f, [from, from + 16], [0, 1], CL),
    filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.6))'}}>{t}</div>;
};

// 1) FNPortfolioGlobe — rotierende 3D-Punktkugel = "weltweit gestreut"
export const FNPortfolioGlobe: React.FC<{caption?: string}> = ({caption = 'weltweit gestreut · 1.000+ Firmen'}) => {
  const f = useCurrentFrame(); const cx = W / 2, cy = 480, R = 360, N = 420; const ang = f * 0.012;
  const ps = new Array(N).fill(0).map((_, i) => {
    const y = 1 - (i / (N - 1)) * 2; const rr = Math.sqrt(Math.max(0, 1 - y * y)); const th = i * 2.399963;
    const x = Math.cos(th) * rr, z = Math.sin(th) * rr;
    return {x: cx + (x * Math.cos(ang) + z * Math.sin(ang)) * R, y: cy + y * R, z: -x * Math.sin(ang) + z * Math.cos(ang)};
  }).sort((a, b) => a.z - b.z);
  const app = eo(c01(f / 40));
  return <AbsoluteFill>
    <svg width={W} height={H}>
      <defs><radialGradient id="pgc"><stop offset="0%" stopColor={C.green} stopOpacity={0.35} /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
      <circle cx={cx} cy={cy} r={R * 0.96} fill="url(#pgc)" opacity={app} />
      {ps.map((p, i) => {const d = (p.z + 1) / 2;
        return <circle key={i} cx={p.x} cy={p.y} r={(1 + d * 4) * app} fill={d > 0.6 ? C.gold : C.green}
          opacity={(0.15 + d * 0.85) * app} style={{filter: d > 0.7 ? `drop-shadow(0 0 6px ${C.green})` : 'none'}} />;})}
    </svg>
    <Caption t={caption} from={30} />
  </AbsoluteFill>;
};

// 2) FNWealthOrbit — Kern "DEIN GELD" + umlaufende Anlageklassen
export const FNWealthOrbit: React.FC<{sats?: [string, number, number, string][]}> =
({sats = [['ETF', 230, 0.028, C.green], ['Aktien', 320, 0.021, C.gold], ['Anleihen', 410, 0.016, C.blue], ['Gold', 500, 0.012, C.purple]]}) => {
  const f = useCurrentFrame(); const cx = W / 2, cy = H / 2;
  const app = (d: number) => interpolate(f, [d, d + 16], [0, 1], CL);
  return <AbsoluteFill>
    <svg width={W} height={H}>
      <defs><radialGradient id="woc"><stop offset="0%" stopColor={C.greenLt} /><stop offset="60%" stopColor={C.green} /><stop offset="100%" stopColor="#00803F" /></radialGradient></defs>
      {sats.map((s, i) => <ellipse key={'o' + i} cx={cx} cy={cy} rx={s[1]} ry={s[1] * 0.42} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />)}
      <circle cx={cx} cy={cy} r={95} fill="url(#woc)" style={{filter: `drop-shadow(0 0 40px ${C.green}aa)`}} />
      <text x={cx} y={cy - 4} fontSize={34} fontWeight={800} fill={C.bg} textAnchor="middle" fontFamily={bebas}>DEIN</text>
      <text x={cx} y={cy + 34} fontSize={34} fontWeight={800} fill={C.bg} textAnchor="middle" fontFamily={bebas}>GELD</text>
      {sats.map((s, i) => {const a = f * s[2] + i * 1.6; const x = cx + Math.cos(a) * s[1], y = cy + Math.sin(a) * s[1] * 0.42;
        return <g key={i} opacity={app(i * 10)}>
          <circle cx={x} cy={y} r={42} fill={s[3]} style={{filter: `drop-shadow(0 0 18px ${s[3]})`}} />
          <text x={x} y={y + 8} fontSize={26} fontWeight={700} fill={C.bg} textAnchor="middle" fontFamily={bebas}>{s[0]}</text>
        </g>;})}
    </svg>
  </AbsoluteFill>;
};

// 3) FNMoneyMorph — Partikel: Chaos (einzelne Euros) → geordnete steigende Balken
export const FNMoneyMorph: React.FC<{caption?: string}> = ({caption = 'aus Chaos wird System'}) => {
  const f = useCurrentFrame(); const N = 180; const t = eo(c01((f - 10) / 60));
  const cx = W / 2, cy = H / 2 - 40;
  return <AbsoluteFill>
    <svg width={W} height={H}>
      {new Array(N).fill(0).map((_, i) => {
        const ax = cx + (rand(i) - 0.5) * 1500, ay = cy + (rand(i + 7) - 0.5) * 800;
        const bar = i % 5; const inBar = Math.floor(i / 5);
        const bh = 90 + bar * 70;
        const bx = cx - 520 + bar * 260 + (inBar % 6) * 30;
        const by = cy + 260 - (Math.floor(inBar / 6)) * 30;
        const tx = bx, ty = by - (inBar % Math.max(1, Math.round(bh / 30))) * 30;
        const x = ax + (tx - ax) * t, y = ay + (ty - ay) * t;
        const col = [C.green, C.gold, C.blue, C.greenLt, C.green][bar];
        return <circle key={i} cx={x} cy={y} r={9} fill={col} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${col})`}} />;
      })}
    </svg>
    <Caption t={caption} from={40} />
  </AbsoluteFill>;
};

// 4) FNWealthTower — isometrische Geld-Blöcke stapeln sich (Vermögensaufbau Jahr für Jahr)
export const FNWealthTower: React.FC<{caption?: string}> = ({caption = 'Jahr für Jahr aufgebaut'}) => {
  const f = useCurrentFrame(); const ox = W / 2, oy = 360, w = 120, h = 66, ch = 80;
  const cubes: [number, number, number][] = [];
  for (let z = 0; z < 5; z++) {const s = 3 - Math.floor(z / 2); for (let x = 0; x < s; x++) for (let y = 0; y < s; y++) cubes.push([x, y, z]);}
  return <AbsoluteFill>
    <svg width={W} height={H}>
      {cubes.map((cu, idx) => {
        const [gx, gy, gz] = cu; const g = eo(c01((f - idx * 4) / 20)); if (g <= 0) return null;
        const dy = (1 - g) * -260; const sx = ox + (gx - gy) * w; const sy = oy + (gx + gy) * h - gz * ch + dy;
        const top = `${sx},${sy} ${sx + w},${sy + h} ${sx},${sy + 2 * h} ${sx - w},${sy + h}`;
        const left = `${sx - w},${sy + h} ${sx},${sy + 2 * h} ${sx},${sy + 2 * h + ch} ${sx - w},${sy + h + ch}`;
        const right = `${sx + w},${sy + h} ${sx},${sy + 2 * h} ${sx},${sy + 2 * h + ch} ${sx + w},${sy + h + ch}`;
        return <g key={idx} opacity={g}>
          <polygon points={left} fill="#00803F" />
          <polygon points={right} fill="#006b34" />
          <polygon points={top} fill={C.green} style={{filter: `drop-shadow(0 0 10px ${C.green}88)`}} />
        </g>;
      })}
    </svg>
    <Caption t={caption} from={70} />
  </AbsoluteFill>;
};

// 5) FNCompoundLoop — Zinseszins-Kreislauf, leuchtendes Partikel läuft Kapital→Zinsen→reinvest
export const FNCompoundLoop: React.FC = () => {
  const f = useCurrentFrame(); const cx = W / 2, cy = H / 2; const R = 300;
  const nodes = ['KAPITAL', 'ZINSEN', 'MEHR\nKAPITAL', 'MEHR\nZINSEN'];
  const cols = [C.gold, C.green, C.blue, C.greenLt];
  const pos = nodes.map((_, i) => {const a = -Math.PI / 2 + i * Math.PI / 2; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];});
  const pp = (f * 0.012) % 1; const seg = Math.floor(pp * 4); const lt = (pp * 4) % 1;
  const a0 = pos[seg], a1 = pos[(seg + 1) % 4];
  const px = a0[0] + (a1[0] - a0[0]) * lt, py = a0[1] + (a1[1] - a0[1]) * lt;
  return <AbsoluteFill>
    <svg width={W} height={H}>
      {pos.map((p, i) => {const q = pos[(i + 1) % 4];
        return <line key={'l' + i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="rgba(255,255,255,0.15)" strokeWidth={3} />;})}
      <text x={cx} y={cy + 10} fontSize={54} fontWeight={800} fill={C.ink} textAnchor="middle" fontFamily={bebas}>ZINSESZINS</text>
      {pos.map((p, i) => <g key={'n' + i} opacity={interpolate(f, [i * 8, i * 8 + 14], [0, 1], CL)}>
        <circle cx={p[0]} cy={p[1]} r={80} fill={cols[i]} opacity={0.16} />
        <circle cx={p[0]} cy={p[1]} r={80} fill="none" stroke={cols[i]} strokeWidth={4} style={{filter: `drop-shadow(0 0 16px ${cols[i]})`}} />
        {nodes[i].split('\n').map((ln, k, arr) => <text key={k} x={p[0]} y={p[1] + 8 + (k - (arr.length - 1) / 2) * 30}
          fontSize={26} fontWeight={700} fill={C.ink} textAnchor="middle" fontFamily={bebas}>{ln}</text>)}
      </g>)}
      <circle cx={px} cy={py} r={16} fill={C.greenLt} style={{filter: `drop-shadow(0 0 22px ${C.greenLt})`}} opacity={interpolate(f, [40, 56], [0, 1], CL)} />
    </svg>
  </AbsoluteFill>;
};

// 6) FNInflationErode — Wertblock zerbröselt, Partikel driften weg, Wert sinkt (Nische!)
export const FNInflationErode: React.FC = () => {
  const f = useCurrentFrame(); const cols = 16, rows = 10, sq = 60; const N = cols * rows;
  const ox = W / 2 - (cols * sq) / 2, oy = 360;
  const prog = c01((f - 20) / 110);
  const val = interpolate(prog, [0, 1], [10000, 5000]);
  return <AbsoluteFill>
    <svg width={W} height={H}>
      {new Array(N).fill(0).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const gone = rand(i) < prog * 1.1; // je weiter, desto mehr weg
        const drift = gone ? (f - (20 + rand(i) * 110)) : 0;
        const x = ox + c * sq + (gone ? (rand(i + 3) - 0.5) * drift * 4 : 0);
        const y = oy + r * sq - (gone ? Math.max(0, drift) * 3 : 0);
        const op = gone ? Math.max(0, 1 - Math.max(0, drift) / 40) : 1;
        if (op <= 0) return null;
        return <rect key={i} x={x} y={y} width={sq - 6} height={sq - 6} rx={8} fill={gone ? C.red : C.gold}
          opacity={op * 0.92} style={{filter: gone ? `drop-shadow(0 0 6px ${C.red})` : 'none'}} />;
      })}
    </svg>
    <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: bebas, fontSize: 130, color: C.red,
      filter: `drop-shadow(0 0 30px ${C.red}77)`}}>{de(val)} € wert</div>
    <Caption t="Inflation frisst deine Kaufkraft" from={20} />
  </AbsoluteFill>;
};

// 7) FNRiskReturn — Risiko/Rendite-Quadrant, Asset-Punkte federn rein
export const FNRiskReturn: React.FC<{assets?: [string, number, number, string][]}> =
({assets = [['Sparbuch', 0.1, 0.1, C.red], ['Anleihen', 0.35, 0.35, C.blue], ['ETF', 0.55, 0.7, C.green], ['Einzelaktie', 0.8, 0.78, C.gold], ['Krypto', 0.95, 0.95, C.purple]]}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const x0 = 360, y0 = 920, x1 = 1560, y1 = 180;
  return <AbsoluteFill>
    <svg width={W} height={H}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
      <text x={(x0 + x1) / 2} y={y0 + 60} fontSize={34} fill={C.muted} textAnchor="middle" fontFamily={inter}>Risiko →</text>
      <text x={x0 - 40} y={(y0 + y1) / 2} fontSize={34} fill={C.muted} textAnchor="middle" fontFamily={inter} transform={`rotate(-90 ${x0 - 40} ${(y0 + y1) / 2})`}>Rendite →</text>
      {assets.map((a, i) => {
        const s = spring({frame: f - 10 - i * 8, fps, config: {damping: 12}});
        const px = x0 + a[1] * (x1 - x0), py = y0 + a[2] * (y1 - y0);
        return <g key={i} opacity={s}>
          <circle cx={px} cy={py} r={26 * s} fill={a[3]} style={{filter: `drop-shadow(0 0 18px ${a[3]})`}} />
          <text x={px} y={py - 40} fontSize={30} fontWeight={700} fill={C.ink} textAnchor="middle" fontFamily={bebas} opacity={s}>{a[0]}</text>
        </g>;
      })}
    </svg>
  </AbsoluteFill>;
};

// 8) FNCashflowSplit — Einkommen strömt runter, splittet in Töpfe (fließende Partikel)
export const FNCashflowSplit: React.FC<{buckets?: [string, number, string][]}> =
({buckets = [['Fixkosten', 0.5, C.blue], ['Leben', 0.2, C.gold], ['Investieren', 0.3, C.green]]}) => {
  const f = useCurrentFrame(); const topX = W / 2, topY = 200; const splitY = 520; const bucketY = 880;
  const bx = buckets.map((_, i) => (W / (buckets.length + 1)) * (i + 1));
  const NP = 60;
  return <AbsoluteFill>
    <svg width={W} height={H}>
      <text x={topX} y={topY - 40} fontSize={44} fontWeight={800} fill={C.ink} textAnchor="middle" fontFamily={bebas}>EINKOMMEN</text>
      <circle cx={topX} cy={topY} r={26} fill={C.greenLt} style={{filter: `drop-shadow(0 0 18px ${C.greenLt})`}} />
      {buckets.map((b, i) => <line key={'l' + i} x1={topX} y1={topY} x2={bx[i]} y2={splitY} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
      {buckets.map((b, i) => <line key={'l2' + i} x1={bx[i]} y1={splitY} x2={bx[i]} y2={bucketY} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
      {/* fließende Partikel */}
      {buckets.flatMap((b, i) => new Array(Math.round(NP * b[1])).fill(0).map((_, j) => {
        const seed = (i * 97 + j * 13) % 100 / 100; const p = ((f * 0.012 + seed) % 1);
        let x, y;
        if (p < 0.5) {const tt = p / 0.5; x = topX + (bx[i] - topX) * tt; y = topY + (splitY - topY) * tt;}
        else {const tt = (p - 0.5) / 0.5; x = bx[i]; y = splitY + (bucketY - splitY) * tt;}
        return <circle key={i + '-' + j} cx={x} cy={y} r={6} fill={b[2]} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${b[2]})`}} />;
      }))}
      {buckets.map((b, i) => <g key={'b' + i}>
        <rect x={bx[i] - 150} y={bucketY} width={300} height={150} rx={20} fill={b[2]} opacity={0.16} />
        <rect x={bx[i] - 150} y={bucketY} width={300} height={150} rx={20} fill="none" stroke={b[2]} strokeWidth={3} />
        <text x={bx[i]} y={bucketY + 70} fontSize={34} fontWeight={700} fill={C.ink} textAnchor="middle" fontFamily={bebas}>{b[0]}</text>
        <text x={bx[i]} y={bucketY + 118} fontSize={40} fill={b[2]} textAnchor="middle" fontFamily={bebas}>{Math.round(b[1] * 100)} %</text>
      </g>)}
    </svg>
  </AbsoluteFill>;
};
