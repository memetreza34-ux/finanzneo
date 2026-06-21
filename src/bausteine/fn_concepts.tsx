// FinanzNeo KONZEPT-Bausteine — komplexe Themen EINFACH & PREMIUM erklärt.
// Strenge Palette (P): Grün + Gold + Neutral. Jeder Baustein = Titel + Visual + Caption.
import {useCurrentFrame, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';
import {P} from './fn_pro';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);
const glow = (c: string, o = 0.25) => `drop-shadow(0 0 46px ${c}${Math.round(o * 255).toString(16).padStart(2, '0')})`;

const Frame: React.FC<{title: string; caption: string; children: React.ReactNode}> = ({title, caption, children}) => {
  const f = useCurrentFrame();
  return <div style={{textAlign: 'center', width: 1600}}>
    <div style={{fontFamily: bebas, fontSize: 84, color: P.ink, opacity: rev(f, 2)}}>{title}</div>
    <div style={{margin: '50px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 560}}>{children}</div>
    <div style={{fontFamily: inter, fontSize: 42, color: P.muted, opacity: rev(f, 60), maxWidth: 1300, margin: '0 auto'}}>{caption}</div>
  </div>;
};

// 1) Zinseszins — Schneeball rollt & wächst
export const FNSnowball: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 560; const t = eo(c01((f - 8) / 90));
  const x = 140 + t * (W - 320); const r = 28 + t * 150; const slopeY = (xx: number) => 120 + (xx - 140) / (W - 320) * 300;
  const n = interpolate(f, [8, 98], [1000, 92000], CL);
  return <Frame title="Zinseszins" caption="Gewinne erzeugen wieder Gewinne — der Schneeball-Effekt.">
    <svg width={W} height={H}>
      <line x1={120} y1={110} x2={W - 120} y2={420} stroke={P.line} strokeWidth={3} />
      {[0.4, 0.6, 0.8].map((tt, i) => {const gx = 140 + tt * (W - 320); return tt < t ? <circle key={i} cx={gx} cy={slopeY(gx) - (28 + tt * 150)} r={28 + tt * 150} fill={P.green} opacity={0.12} /> : null;})}
      <circle cx={x} cy={slopeY(x) - r} r={r} fill={`url(#sg)`} style={{filter: glow(P.green, 0.3)}} />
      <defs><radialGradient id="sg"><stop offset="0%" stopColor={P.greenLt} /><stop offset="100%" stopColor={P.green} /></radialGradient></defs>
      <text x={x} y={slopeY(x) - r + 12} fontSize={r > 70 ? 44 : 0} fontFamily={bebas} fill={C.bgDeep} textAnchor="middle">€</text>
    </svg>
    <div style={{position: 'absolute', fontFamily: bebas, fontSize: 96, color: P.gold, marginTop: -460, filter: glow(P.gold, 0.2)}}>{de(n)} €</div>
  </Frame>;
};

// 2) Sparplan / Cost-Average
export const FNCostAverage: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 540; const draw = c01((f - 8) / 60);
  const price = (x: number) => H / 2 + Math.sin(x / 130) * 140 + Math.sin(x / 47) * 50;
  const linePts = []; for (let x = 60; x <= W - 60; x += 14) linePts.push(`${x},${price(x)}`);
  const buys = new Array(8).fill(0).map((_, i) => 120 + i * ((W - 240) / 7));
  return <Frame title="Der Sparplan-Trick" caption="Automatisch kaufen — mal teuer, mal günstig. Der Schnitt macht's.">
    <svg width={W} height={H}>
      <polyline points={linePts.join(' ')} fill="none" stroke={P.muted} strokeWidth={3} opacity={0.5} />
      <line x1={60} y1={H / 2} x2={W - 60} y2={H / 2} stroke={P.gold} strokeWidth={3} strokeDasharray="10 10" opacity={rev(f, 50)} />
      {buys.map((x, i) => {const show = draw > i / buys.length; return show ? <g key={i}><circle cx={x} cy={price(x)} r={16} fill={P.green} style={{filter: glow(P.green, 0.4)}} /></g> : null;})}
      <text x={W - 70} y={H / 2 - 18} fontSize={30} fontFamily={inter} fill={P.gold} textAnchor="end" opacity={rev(f, 56)}>Ø Kaufpreis</text>
    </svg>
  </Frame>;
};

// 3) Streuung / Diversifikation
export const FNDiversification: React.FC = () => {
  const f = useCurrentFrame(); const spread = eo(c01((f - 30) / 50));
  return <Frame title="Streuung schlägt Risiko" caption="Nicht alles auf eine Karte — viele kleine Anteile statt einem großen.">
    <div style={{display: 'flex', gap: 160, alignItems: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{width: 200, height: 200, borderRadius: '50%', background: P.loss, margin: '0 auto', opacity: rev(f, 6),
          transform: `translateX(${Math.sin(f / 4) * (rev(f, 6) * 6)}px)`, boxShadow: `0 0 50px ${P.loss}40`}} />
        <div style={{fontFamily: inter, fontSize: 36, color: P.muted, marginTop: 24}}>1 Aktie · riskant</div>
      </div>
      <div style={{fontFamily: bebas, fontSize: 70, color: P.muted}}>vs.</div>
      <div style={{textAlign: 'center'}}>
        <div style={{width: 360, height: 240, position: 'relative'}}>
          {new Array(40).fill(0).map((_, i) => {const a = (i / 40) * Math.PI * 2; const rr = 20 + (i % 5) * 22;
            return <div key={i} style={{position: 'absolute', left: 180 + Math.cos(a) * rr * spread - 10, top: 120 + Math.sin(a) * rr * spread - 10,
              width: 20, height: 20, borderRadius: '50%', background: P.green, opacity: 0.85}} />;})}
        </div>
        <div style={{fontFamily: inter, fontSize: 36, color: P.ink, marginTop: 24}}>1.000 Firmen · stabil</div>
      </div>
    </div>
  </Frame>;
};

// 4) Risiko vs. Rendite (Quadrant)
export const FNRiskReturn: React.FC = () => {
  const f = useCurrentFrame(); const W = 1100, H = 560;
  const assets: [string, number, number][] = [['Tagesgeld', 0.1, 0.12], ['Anleihen', 0.3, 0.3], ['Immobilien', 0.5, 0.5], ['Aktien', 0.75, 0.78], ['Krypto', 0.95, 0.95]];
  const px = (v: number) => 90 + v * (W - 180); const py = (v: number) => H - 70 - v * (H - 140);
  return <Frame title="Risiko & Rendite" caption="Mehr Chance gibt's nur mit mehr Schwankung — finde deine Mitte.">
    <svg width={W} height={H} style={{fontFamily: inter}}>
      <line x1={90} y1={H - 70} x2={W - 90} y2={H - 70} stroke={P.line} strokeWidth={2} />
      <line x1={90} y1={50} x2={90} y2={H - 70} stroke={P.line} strokeWidth={2} />
      <line x1={90} y1={H - 70} x2={W - 110} y2={80} stroke={P.gold} strokeWidth={2} strokeDasharray="8 10" opacity={rev(f, 30) * 0.6} />
      <text x={W - 90} y={H - 30} fontSize={28} fill={P.muted} textAnchor="end">Risiko →</text>
      <text x={60} y={60} fontSize={28} fill={P.muted} textAnchor="middle" transform={`rotate(-90 60 ${H / 2})`}>Rendite →</text>
      {assets.map((a, i) => {const g = eo(c01((f - 14 - i * 8) / 26)); const hi = i === 3;
        return <g key={i} opacity={g}><circle cx={px(a[1])} cy={py(a[2])} r={(hi ? 22 : 15) * g} fill={hi ? P.green : P.greenDeep} stroke={hi ? P.greenLt : P.muted} strokeWidth={2} style={{filter: hi ? glow(P.green, 0.4) : 'none'}} />
          <text x={px(a[1])} y={py(a[2]) - 32} fontSize={28} fontWeight={hi ? 700 : 500} fill={hi ? P.ink : P.muted} textAnchor="middle">{a[0]}</text></g>;})}
    </svg>
  </Frame>;
};

// 5) Drawdown — Crash & Erholung
export const FNDrawdown: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 540; const draw = c01((f - 8) / 70);
  const pts = [[60, 320], [320, 240], [520, 200], [700, 430], [820, 400], [1000, 250], [1200, 150], [1340, 90]];
  const shown = pts.slice(0, Math.max(2, Math.ceil(draw * pts.length)));
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  return <Frame title="Crash? Kein Drama." caption="Märkte fallen — und erholen sich. Wer dabei bleibt, gewinnt.">
    <svg width={W} height={H} style={{fontFamily: bebas}}>
      <path d={d} fill="none" stroke={P.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" style={{filter: glow(P.green, 0.3)}} />
      {draw > 0.45 && <g opacity={rev(f, 40)}><circle cx={700} cy={430} r={12} fill={P.loss} /><text x={700} y={490} fontSize={44} fill={P.loss} textAnchor="middle">−40%</text></g>}
      {draw > 0.95 && <g opacity={rev(f, 70)}><circle cx={1340} cy={90} r={14} fill={P.greenLt} style={{filter: glow(P.greenLt, 0.5)}} /><text x={1300} y={60} fontSize={40} fill={P.greenLt} textAnchor="end">neues Hoch</text></g>}
    </svg>
  </Frame>;
};

// 6) Vermögensaufbau — Einzahlung vs. Gewinn (gestapelt)
export const FNNetWorth: React.FC = () => {
  const f = useCurrentFrame(); const W = 1400, H = 560; const draw = c01((f - 8) / 65); const N = 40;
  const contrib = (x: number) => x * 0.35; const total = (x: number) => (Math.exp(2.4 * x) - 1) / (Math.exp(2.4) - 1);
  const band = (fn: (x: number) => number, col: string, op: number) => {
    const pts = new Array(N).fill(0).map((_, i) => {const x = i / (N - 1); return [60 + x * (W - 120), H - 60 - fn(x) * (H - 130)];});
    const shown = pts.slice(0, Math.max(2, Math.ceil(draw * N)));
    const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ') + ` L${shown[shown.length - 1][0]},${H - 60} L60,${H - 60} Z`;
    return <path d={d} fill={col} opacity={op} />;
  };
  return <Frame title="Vermögen wächst" caption="Irgendwann erwirtschaften die Gewinne mehr als deine Einzahlungen.">
    <svg width={W} height={H}>
      {band(total, P.green, 0.85)}
      {band(contrib, P.greenDeep, 1)}
      <text x={W - 90} y={H - 80} fontSize={28} fontFamily={inter} fill={P.greenLt} textAnchor="end" opacity={rev(f, 55)}>Gewinne</text>
      <text x={120} y={H - 90} fontSize={28} fontFamily={inter} fill={P.muted} opacity={rev(f, 55)}>Einzahlungen</text>
    </svg>
  </Frame>;
};

// 7) 4%-Regel — von den Zinsen leben
export const FNFourPercent: React.FC = () => {
  const f = useCurrentFrame();
  return <Frame title="Von Zinsen leben (4%-Regel)" caption="Aus dem Vermögen entnimmst du jährlich ~4 % — es bleibt erhalten.">
    <div style={{display: 'flex', alignItems: 'center', gap: 90}}>
      <div style={{textAlign: 'center', opacity: rev(f, 6)}}>
        <div style={{width: 300, height: 300, borderRadius: '50%', background: `conic-gradient(${P.gold} 0 14deg, ${P.green} 14deg 360deg)`, position: 'relative', boxShadow: `0 0 60px ${P.green}30`}}>
          <div style={{position: 'absolute', inset: 70, borderRadius: '50%', background: C.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 56, color: P.ink}}>1 Mio</div>
        </div>
        <div style={{fontFamily: inter, fontSize: 34, color: P.muted, marginTop: 22}}>dein Vermögen</div>
      </div>
      <div style={{fontFamily: bebas, fontSize: 60, color: P.gold, opacity: rev(f, 30)}}>→</div>
      <div style={{textAlign: 'center', opacity: rev(f, 36)}}>
        <div style={{fontFamily: bebas, fontSize: 150, color: P.gold, filter: glow(P.gold, 0.2)}}>40.000 €</div>
        <div style={{fontFamily: inter, fontSize: 34, color: P.ink}}>pro Jahr — ohne anzutasten</div>
      </div>
    </div>
  </Frame>;
};

// 8) Notgroschen — Sicherheit zuerst
export const FNEmergencyFund: React.FC = () => {
  const f = useCurrentFrame(); const layers: [string, number][] = [['1 Monat', 30], ['3 Monate', 60], ['6 Monate', 90]];
  return <Frame title="Notgroschen zuerst" caption="Erst 3–6 Monatsausgaben als Puffer — dann investieren.">
    <div style={{display: 'flex', flexDirection: 'column-reverse', gap: 14, alignItems: 'center'}}>
      {layers.map(([l, fillF], i) => {const g = eo(c01((f - fillF) / 30));
        return <div key={i} style={{width: 620, height: 110, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: `1px solid ${P.line}`, position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, width: `${g * 100}%`, background: i === 2 ? `linear-gradient(90deg,${P.greenLt},${P.green})` : P.greenDeep}} />
          <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 52, color: P.ink}}>{l}</div>
        </div>;})}
    </div>
  </Frame>;
};
