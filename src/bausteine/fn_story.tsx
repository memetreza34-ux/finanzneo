// FinanzNeo ERKLÄR-Bausteine im KI-Niveau: mehrere PHASEN in einem Baustein
// (Setup → Entwicklung → Fazit) statt nur Endzustand einblenden. Das ist der Qualitäts-Hebel.
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';
import {FNBgAurora} from './fn_backgrounds';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const eo = (t: number) => 1 - Math.pow(1 - t, 3);

// FNGrowthStory — "Wie aus X über die Zeit Y wird" (3 Beats, synchron animiert):
//  Beat 1 (Setup): Startbetrag erscheint.
//  Beat 2 (Entwicklung): Kurve zeichnet + Zahl zählt + Jahre laufen + Meilensteine leuchten — alles SYNCHRON.
//  Beat 3 (Fazit): Endpunkt pulst, Callout-Badge + Kernaussage.
export const FNGrowthStory: React.FC<{
  start?: number; end?: number; years?: number; perMonth?: number;
  conclusion?: string; rate?: string;
}> = ({start = 72000, end = 244000, years = 30, perMonth = 200,
  conclusion = 'Zeit ist dein größter Hebel.', rate = '7 % p.a.'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const W = 1920, H = 1080, x0 = 240, x1 = 1680, yBase = 820, yTop = 240;

  // PHASEN
  const setup = spring({frame: f - 2, fps, config: {damping: 12}});      // Beat 1
  const draw = interpolate(f, [26, 96], [0, 1], CL);                      // Beat 2
  const fazit = f > 98;                                                   // Beat 3

  // Exponentielle Sparplan-Kurve
  const pts = Array.from({length: 60}, (_, i) => {
    const t = i / 59; const y = (Math.exp(3.0 * t) - 1) / (Math.exp(3.0) - 1);
    return [x0 + t * (x1 - x0), yBase - y * (yBase - yTop)];
  });
  const shownN = Math.max(2, Math.ceil(draw * pts.length));
  const shown = pts.slice(0, shownN);
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const tip = shown[shown.length - 1];
  const val = start + (end - start) * eo(draw);
  const yr = Math.round(years * draw);
  const milestones: [number, string][] = [[0.4, `${Math.round(years * 0.4)} J.`], [0.7, `${Math.round(years * 0.7)} J.`], [1, `${years} Jahre`]];
  const pct = Math.round(((end - start) / start) * 100);

  return (
    <AbsoluteFill>
      {/* mitlaufende Zahl (Beat 2) + Kicker */}
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, letterSpacing: 5, color: C.green,
          opacity: setup}}>{perMonth} € IM MONAT · {rate}</div>
        <div style={{fontFamily: bebas, fontSize: 170, lineHeight: 1, color: C.greenLt,
          filter: `drop-shadow(0 0 45px ${C.green}77)`, opacity: interpolate(f, [22, 34], [0, 1], CL)}}>
          {de(val)} €
        </div>
        <div style={{fontFamily: inter, fontSize: 36, color: C.muted, opacity: interpolate(f, [28, 40], [0, 1], CL)}}>
          nach {yr} {yr === 1 ? 'Jahr' : 'Jahren'}
        </div>
      </div>

      <svg width={W} height={H}>
        <defs>
          <linearGradient id="gs" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor={C.green} /><stop offset="100%" stopColor={C.gold} /></linearGradient>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity={0.32} /><stop offset="100%" stopColor={C.green} stopOpacity={0} /></linearGradient>
        </defs>
        {/* Achse */}
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        {/* Beat 1: Startbetrag */}
        <g opacity={setup} transform={`translate(${x0},${yBase}) scale(${setup})`}>
          <circle r={14} fill={C.gold} style={{filter: `drop-shadow(0 0 16px ${C.gold})`}} />
          <text x={0} y={56} fontSize={30} fill={C.muted} textAnchor="middle" fontFamily={inter}>Start: {de(start)} €</text>
        </g>
        {/* Beat 2: Fläche + Kurve zeichnen */}
        {draw > 0 && <path d={`${d} L${tip[0]},${yBase} L${x0},${yBase} Z`} fill="url(#ga)" opacity={0.9} />}
        <path d={d} fill="none" stroke="url(#gs)" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
          style={{filter: `drop-shadow(0 0 16px ${C.green}aa)`}} />
        {/* Meilensteine leuchten auf, wenn die Kurve sie erreicht */}
        {milestones.map(([t, lab], i) => {
          if (draw < t) return null;
          const px = x0 + t * (x1 - x0); const ty = (Math.exp(3.0 * t) - 1) / (Math.exp(3.0) - 1);
          const py = yBase - ty * (yBase - yTop); const a = interpolate(f, [26 + t * 70, 36 + t * 70], [0, 1], CL);
          return <g key={i} opacity={a}>
            <circle cx={px} cy={py} r={9} fill={C.gold} style={{filter: `drop-shadow(0 0 12px ${C.gold})`}} />
            <text x={px} y={yBase + 44} fontSize={28} fill={C.muted} textAnchor="middle" fontFamily={inter}>{lab}</text>
          </g>;
        })}
        {/* laufende Spitze mit Puls (lebt auch nach dem Zeichnen) */}
        {draw > 0 && <circle cx={tip[0]} cy={tip[1]} r={16 + (fazit ? Math.sin(f / 6) * 4 : 0)} fill={C.greenLt}
          style={{filter: `drop-shadow(0 0 24px ${C.greenLt})`}} />}
      </svg>

      {/* Beat 3: Callout-Badge am Hochpunkt */}
      {fazit && (
        <div style={{position: 'absolute', left: tip[0] - 150, top: tip[1] - 96, fontFamily: bebas, fontSize: 64,
          color: C.bg, background: C.gold, padding: '6px 26px', borderRadius: 16,
          boxShadow: `0 0 40px ${C.gold}88`, opacity: interpolate(f, [100, 116], [0, 1], CL),
          transform: `scale(${spring({frame: f - 100, fps, config: {damping: 10}})})`}}>+{pct} %</div>
      )}
      {/* Beat 3: Kernaussage */}
      {fazit && (
        <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', fontFamily: bebas,
          fontSize: 74, color: C.ink, opacity: interpolate(f, [112, 128], [0, 1], CL),
          filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.6))'}}>{conclusion}</div>
      )}
    </AbsoluteFill>
  );
};

// Demo mit Hintergrund (zum Anschauen)
export const FNGrowthStoryDemo: React.FC = () => (
  <AbsoluteFill><FNBgAurora /><FNGrowthStory /></AbsoluteFill>
);
