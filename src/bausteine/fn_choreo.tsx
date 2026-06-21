// FinanzNeo CHOREOGRAFIERT — saubere Beats (Series), pro Moment NUR eine Sache,
// volle Fläche, nichts überlappt. Vorlage für echte Reels.
import {AbsoluteFill, Series, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, bebas, inter, StaticBG} from './fn_core';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const de = (n: number) => Math.round(n).toLocaleString('de-DE');
const rev = (f: number, s: number, d = 14) => Math.max(0, Math.min(1, (f - s) / d));

// Kopf: Kicker + Zwischenüberschrift + Beam-Underline (in jedem Beat)
const TopBar: React.FC<{title: string; accent?: string}> = ({title, accent = C.green}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center'}}>
    <div style={{fontFamily: inter, fontSize: 30, fontWeight: 800, letterSpacing: 8, color: accent, opacity: rev(f, 2)}}>FINANZ-WISSEN</div>
    <div style={{fontFamily: bebas, fontSize: 88, color: C.ink, marginTop: 6, opacity: rev(f, 8)}}>{title}</div>
    <div style={{height: 6, width: 220, margin: '14px auto 0', borderRadius: 3, transformOrigin: 'center',
      transform: `scaleX(${rev(f, 14, 20)})`, background: `linear-gradient(90deg, transparent, ${accent}, ${C.gold}, transparent)`}} />
  </div>;
};

// BEAT 1 — Intro
const Intro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 4, fps, config: {damping: 13}});
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
    <div style={{fontFamily: inter, fontSize: 34, fontWeight: 800, letterSpacing: 8, color: C.green, opacity: rev(f, 6)}}>FINANZ-WISSEN</div>
    <div style={{fontFamily: bebas, fontSize: 200, lineHeight: 1, transform: `scale(${s})`, marginTop: 10,
      background: `linear-gradient(90deg,${C.red},${C.gold},${C.green})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      filter: 'drop-shadow(0 0 45px rgba(0,210,106,0.4))'}}>Sparbuch<br />vs. ETF</div>
  </AbsoluteFill>;
};

// BEAT 2 — Wachstum: Balken wachsen, Zahlen zählen SYNCHRON
const Growth: React.FC = () => {
  const f = useCurrentFrame(); const maxH = 470, baseY = 910;
  const setup = interpolate(f, [6, 24, 70, 86], [0, 1, 1, 0], CL);
  const sparG = interpolate(f, [92, 170], [0, 0.13], CL); const etfG = interpolate(f, [100, 230], [0, 1.0], CL);
  const sparV = interpolate(f, [92, 170], [10000, 10700], CL); const etfV = interpolate(f, [100, 230], [10000, 54000], CL);
  const barsIn = rev(f, 88, 16);
  const bar = (x: number, g: number, v: number, label: string, col: string, nf: number) => (
    <div style={{position: 'absolute', left: x, bottom: 1080 - baseY, width: 240, textAlign: 'center', opacity: barsIn}}>
      <div style={{fontFamily: bebas, fontSize: 66, color: col, marginBottom: 16, opacity: rev(f, nf, 16), filter: `drop-shadow(0 0 18px ${col}88)`}}>{de(v)} €</div>
      <div style={{width: 240, height: maxH * g, margin: '0 auto', borderRadius: 22, background: `linear-gradient(180deg,${col},${col}aa)`, boxShadow: `0 0 50px ${col}55`}} />
      <div style={{fontFamily: inter, fontSize: 40, fontWeight: 700, color: col, marginTop: 18}}>{label}</div>
    </div>
  );
  return <AbsoluteFill>
    <TopBar title="SO WÄCHST DEIN GELD" />
    {setup > 0.01 && <div style={{position: 'absolute', top: 380, width: '100%', textAlign: 'center', opacity: setup}}>
      <div style={{fontFamily: bebas, fontSize: 150, color: C.gold, filter: `drop-shadow(0 0 30px ${C.gold}66)`}}>10.000 €</div>
      <div style={{fontFamily: inter, fontSize: 46, color: C.ink}}>25 Jahre angelegt — was wird daraus?</div></div>}
    {f >= 88 && <>{bar(680, sparG, sparV, 'Sparbuch', C.red, 100)}{bar(1010, etfG, etfV, 'ETF (Welt)', C.green, 110)}</>}
  </AbsoluteFill>;
};

// BEAT 3 — Unterschied: NUR die Kernzahl, sauber zentriert
const Difference: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 8, fps, config: {damping: 11}});
  return <AbsoluteFill>
    <TopBar title="DER UNTERSCHIED" accent={C.gold} />
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{display: 'inline-block', transform: `scale(${s})`, fontFamily: bebas, fontSize: 240, color: C.green,
        background: `${C.green}1a`, border: `5px solid ${C.green}`, borderRadius: 36, padding: '20px 80px', filter: `drop-shadow(0 0 50px ${C.green}66)`}}>+185%</div>
      <div style={{fontFamily: inter, fontSize: 52, color: C.ink, marginTop: 44, opacity: rev(f, 30)}}>5× mehr — nur durch Investieren statt Sparen.</div>
    </AbsoluteFill>
    {/* Kontext-Chips unten, klar getrennt */}
    <div style={{position: 'absolute', bottom: 90, width: '100%', display: 'flex', justifyContent: 'center', gap: 50, opacity: rev(f, 46)}}>
      {[['Sparbuch', '10.700 €', C.red], ['ETF', '54.000 €', C.green]].map(([l, v, col], i) => (
        <div key={i} style={{padding: '20px 44px', borderRadius: 20, border: `2px solid ${col}`, background: `${col}1a`}}>
          <span style={{fontFamily: inter, fontSize: 34, color: C.muted}}>{l}: </span>
          <span style={{fontFamily: bebas, fontSize: 48, color: col as string}}>{v}</span></div>))}
    </div>
  </AbsoluteFill>;
};

// BEAT 4 — Fazit: NUR Aussage + CTA, volle Fläche
const Fazit: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 6, fps, config: {damping: 13}});
  return <AbsoluteFill>
    <TopBar title="FAZIT" />
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div style={{fontFamily: bebas, fontSize: 150, color: C.ink, lineHeight: 1.05, transform: `scale(${s})`}}>Zeit + Markt<br />schlägt <span style={{color: C.green}}>Sparen</span>.</div>
      <div style={{fontFamily: inter, fontSize: 46, fontWeight: 700, color: C.gold, marginTop: 56, padding: '22px 56px',
        border: `3px solid ${C.gold}`, borderRadius: 50, opacity: rev(f, 40)}}>▶ Folge für mehr</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export const FNSparbuchVsETF: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <StaticBG />
    <Series>
      <Series.Sequence durationInFrames={70}><Intro /></Series.Sequence>
      <Series.Sequence durationInFrames={245}><Growth /></Series.Sequence>
      <Series.Sequence durationInFrames={130}><Difference /></Series.Sequence>
      <Series.Sequence durationInFrames={130}><Fazit /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
