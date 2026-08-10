// FinanzNeo PREMIUM — Stil "Edel-minimal (Apple/Glas)".
// Prinzip: viel Negativraum, EIN Glas-Panel, feine Typo (tight tracking, tabular nums),
// weiche Schatten statt harter Glows, ruhige langsame Bewegung, gedämpfte Farben.
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {inter} from './fn_core';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
// sanftes ease-in-out für ruhige, edle Bewegung
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// gedämpfte, edle Palette (weniger Neon)
const P = {
  bg: '#0A1310', ink: '#F2F6F3', muted: '#8B978F', faint: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.10)', green: '#34D399', greenSoft: '#6EE7B7',
};

// Ruhiger, edler Hintergrund: ein einziger weicher Schimmer + feine Körnung + Vignette
const CalmBG: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 28%, #11201A 0%, ${P.bg} 60%, #060B09 100%)`}}>
    <AbsoluteFill style={{background: `radial-gradient(40% 32% at 50% 30%, ${P.green}14, transparent 70%)`}} />
    <AbsoluteFill style={{opacity: 0.04, mixBlendMode: 'overlay',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, transparent 55%, rgba(0,0,0,0.5))'}} />
  </AbsoluteFill>
);

export const FNGrowthGlass: React.FC<{
  start?: number; end?: number; years?: number; perMonth?: number; rate?: string;
}> = ({start = 72000, end = 244000, years = 30, perMonth = 200, rate = '7 % p.a.'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();

  // ruhige Phasen, großzügig getimt
  const panel = spring({frame: f - 4, fps, config: {damping: 18, mass: 0.9}});
  const rise = interpolate(f, [4, 30], [40, 0], CL);
  const draw = eio(interpolate(f, [30, 120], [0, 1], CL));
  const val = start + (end - start) * draw;
  const yr = Math.round(years * draw);
  const pct = Math.round(((end - start) / start) * 100);

  // Panel-Geometrie
  const PW = 1240, PH = 700, PX = (1920 - PW) / 2, PY = (1080 - PH) / 2;
  // Mini-Kurve unten im Panel
  const cx0 = 80, cx1 = PW - 80, cyB = PH - 70, cyT = 430;
  const pts = Array.from({length: 60}, (_, i) => {
    const t = i / 59; const y = (Math.exp(2.6 * t) - 1) / (Math.exp(2.6) - 1);
    return [cx0 + t * (cx1 - cx0), cyB - y * (cyB - cyT)];
  });
  const shown = pts.slice(0, Math.max(2, Math.ceil(draw * pts.length)));
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const tip = shown[shown.length - 1];
  const ringExpand = interpolate(f, [118, 138], [0, 1], CL);

  return (
    <AbsoluteFill>
      <CalmBG />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{
          position: 'relative', width: PW, height: PH, borderRadius: 40,
          opacity: panel, transform: `translateY(${rise}px) scale(${0.98 + panel * 0.02})`,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))',
          backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 50px 140px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
          padding: '64px 80px', fontFamily: inter,
        }}>
          {/* Kicker */}
          <div style={{fontSize: 26, fontWeight: 600, letterSpacing: 6, color: P.muted,
            opacity: interpolate(f, [10, 26], [0, 1], CL)}}>
            {perMonth} € MONATLICH · {rate}
          </div>

          {/* Hero-Zahl — fein, tight tracking, tabular nums */}
          <div style={{fontSize: 196, fontWeight: 700, letterSpacing: -6, lineHeight: 1.02, color: P.ink,
            fontVariantNumeric: 'tabular-nums', marginTop: 18,
            opacity: interpolate(f, [16, 32], [0, 1], CL)}}>
            {de(val)} €
          </div>
          {/* Sub-Zeile + dezenter Zuwachs */}
          <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 6,
            opacity: interpolate(f, [24, 40], [0, 1], CL)}}>
            <span style={{fontSize: 36, color: P.muted}}>nach {yr} {yr === 1 ? 'Jahr' : 'Jahren'}</span>
            <span style={{fontSize: 32, fontWeight: 600, color: P.green, opacity: draw > 0.15 ? 1 : 0}}>
              ▲ {pct} %
            </span>
          </div>

          {/* dezente Kurve unten im Panel */}
          <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
            <defs>
              <linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={P.green} stopOpacity={0.5} /><stop offset="100%" stopColor={P.greenSoft} />
              </linearGradient>
              <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.green} stopOpacity={0.16} /><stop offset="100%" stopColor={P.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <line x1={cx0} y1={cyB} x2={cx1} y2={cyB} stroke={P.line} strokeWidth={1} />
            {draw > 0 && <path d={`${d} L${tip[0]},${cyB} L${cx0},${cyB} Z`} fill="url(#gf)" />}
            <path d={d} fill="none" stroke="url(#gg)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
              style={{filter: 'drop-shadow(0 4px 14px rgba(52,211,153,0.35))'}} />
            {/* weicher einmaliger Ring am Endpunkt (kein Dauer-Puls) */}
            {ringExpand > 0 && <circle cx={tip[0]} cy={tip[1]} r={6 + ringExpand * 26} fill="none"
              stroke={P.greenSoft} strokeWidth={2} opacity={(1 - ringExpand) * 0.8} />}
            {draw > 0 && <circle cx={tip[0]} cy={tip[1]} r={7} fill={P.greenSoft}
              style={{filter: 'drop-shadow(0 0 10px rgba(110,231,183,0.7))'}} />}
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FNGrowthGlassDemo: React.FC = () => <FNGrowthGlass />;
