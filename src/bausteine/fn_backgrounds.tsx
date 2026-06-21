// FinanzNeo GRUNDLAGEN-Bausteine: animierte Premium-Hintergründe (themen-neutral, für JEDES Video).
// Bewusst DEZENT (Finanz = seriös, Text muss lesbar bleiben). Alle füllen ihren Parent
// (AbsoluteFill) → automatisch 16:9 UND 9:16 tauglich, ohne feste Pixelmaße.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rand, bebas, inter} from './fn_core';

// 1) FNBgAurora — driftende Grün/Gold-Blur-Blobs + Vignette (der ruhige Standard)
export const FNBgAurora: React.FC = () => {
  const f = useCurrentFrame();
  const blob = (cx: number, cy: number, col: string, px: number, size: number) => ({
    position: 'absolute' as const, width: `${size}%`, height: `${size}%`, borderRadius: '50%',
    left: `${cx + Math.sin((f + px) / 55) * 7}%`, top: `${cy + Math.cos((f + px) / 65) * 6}%`,
    background: `radial-gradient(circle, ${col}, transparent 65%)`, filter: 'blur(70px)', opacity: 0.5,
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #15331f, ${C.bgDeep} 75%)`}}>
      <div style={blob(8, 18, C.green, 0, 46)} />
      <div style={blob(70, 55, C.gold, 60, 50)} />
      <div style={blob(38, 70, C.blue, 120, 40)} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 52%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// 2) FNBgMesh — weicher, wandernder Mesh-Gradient (edel, premium)
export const FNBgMesh: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at ${30 + Math.sin(f / 55) * 12}% 28%, #0f3a24, transparent 45%),
        radial-gradient(circle at 78% ${62 + Math.cos(f / 48) * 12}%, #2a2410, transparent 46%),
        radial-gradient(circle at 42% 86%, #0a2c1c, transparent 50%), ${C.bgDeep}`}} />
  );
};

// 3) FNBgGrid — feines Linien-Raster + sanfter radialer Glow-Sweep (seriös, "Daten/Markt")
export const FNBgGrid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, #0c2417, ${C.bgDeep} 78%)`}}>
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(rgba(0,210,106,0.11) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,106,0.11) 1px,transparent 1px)',
        backgroundSize: '58px 58px',
        WebkitMaskImage: `radial-gradient(circle at 50% ${42 + Math.sin(f / 40) * 6}%, black, transparent 72%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${C.green}22, transparent 40%)`, opacity: 0.6 + Math.sin(f / 25) * 0.2}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 52%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// 4) FNBgRays — weiche Lichtstrahlen von oben (edel, ruhig)
export const FNBgRays: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0d2417, ${C.bgDeep})`}}>
      {new Array(9).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', top: '-25%', left: '50%', width: '5%', height: '150%',
          transformOrigin: 'top center', transform: `translateX(-50%) rotate(${(i - 4) * 10 + Math.sin(f / 45 + i) * 2.5}deg)`,
          background: `linear-gradient(180deg, ${C.greenLt}, transparent 70%)`, filter: 'blur(24px)',
          opacity: 0.14 + 0.10 * Math.abs(Math.sin(f / 28 + i * 1.3))}} />
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, transparent 55%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// 5) FNBgParticles — langsam aufsteigende Funken (Wachstum/Geld), sehr dezent
export const FNBgParticles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 60%, #0e2a1a, ${C.bgDeep} 80%)`}}>
      {new Array(46).fill(0).map((_, i) => {
        const x = rand(i) * 100;
        const y = (100 - ((f * (0.10 + rand(i + 3) * 0.18) + rand(i + 9) * 100) % 110));
        const s = 2 + rand(i + 7) * 3;
        const col = i % 5 === 0 ? C.gold : C.green;
        return <div key={i} style={{position: 'absolute', left: `${x + Math.sin(f / 30 + i) * 1.5}%`, top: `${y}%`,
          width: s, height: s, borderRadius: '50%', background: col,
          opacity: 0.15 + rand(i + 1) * 0.35, boxShadow: `0 0 ${s * 2}px ${col}`}} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.45))'}} />
    </AbsoluteFill>
  );
};

// 6) FNBgTicker — feine horizontale Linien laufen langsam (Börsen-/Markt-Feeling)
export const FNBgTicker: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #0c2316, ${C.bgDeep})`}}>
      {new Array(22).fill(0).map((_, i) => {
        const y = (i / 22) * 100;
        const dir = i % 2 === 0 ? 1 : -1;
        const shift = ((f * (0.25 + rand(i) * 0.3) * dir) % 120);
        return <div key={i} style={{position: 'absolute', top: `${y}%`, left: `${-10 + shift}%`, width: '70%', height: 1,
          background: `linear-gradient(90deg, transparent, ${i % 6 === 0 ? C.gold : C.green}, transparent)`,
          opacity: 0.10 + rand(i + 2) * 0.12}} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 48%, rgba(0,0,0,0.55))'}} />
    </AbsoluteFill>
  );
};

export const FN_BGS: [string, React.FC][] = [
  ['FNBgAurora', FNBgAurora], ['FNBgMesh', FNBgMesh], ['FNBgGrid', FNBgGrid],
  ['FNBgRays', FNBgRays], ['FNBgParticles', FNBgParticles], ['FNBgTicker', FNBgTicker],
];

// Demo: Hintergrund in echter Nutzung — Kicker + Headline + Zahl (Lesbarkeits-/Look-Test)
export const FNBgDemo: React.FC = () => {
  const f = useCurrentFrame();
  const app = (s: number) => Math.max(0, Math.min(1, (f - s) / 16));
  return (
    <AbsoluteFill>
      <FNBgGrid />
      <AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{fontFamily: inter, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.green,
          opacity: app(4)}}>SO WÄCHST DEIN GELD</div>
        <div style={{fontFamily: bebas, fontSize: 230, lineHeight: 1, color: C.ink,
          textShadow: `0 0 60px ${C.green}55`, opacity: app(14), marginTop: 20}}>347.000 €</div>
        <div style={{fontFamily: inter, fontSize: 34, color: C.muted, opacity: app(28), marginTop: 18}}>
          aus 200 € im Monat · 30 Jahre · 7 %</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Übersichts-Raster (3×2) — zum Anschauen aller Hintergründe auf einen Blick
export const FNBgGridShowcase: React.FC = () => (
  <AbsoluteFill style={{background: '#000', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6, padding: 6}}>
    {FN_BGS.map(([name, Comp]) => (
      <div key={name} style={{position: 'relative', overflow: 'hidden', borderRadius: 10}}>
        <Comp />
        <div style={{position: 'absolute', bottom: 14, left: 16, fontFamily: 'Inter', fontSize: 26, fontWeight: 700,
          color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{name}</div>
      </div>
    ))}
  </AbsoluteFill>
);
