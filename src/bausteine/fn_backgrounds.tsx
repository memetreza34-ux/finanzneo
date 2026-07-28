// FinanzNeo Premium-Hintergründe.
// Neue Produktionen verwenden FinanceBackground aus src/design-system.
// Diese Exporte bleiben als kompatible Spezialvarianten bestehen.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rand, bebas, inter} from './fn_core';
import {C as BRAND_C, a, euro} from '../brand/tokens';
import {calculateSavingsPlanFutureValue} from '../finance/calculations';

// EMPFOHLEN: seltener Premium-Hintergrund für Hook oder Payoff.
export const FNBgAurora: React.FC = () => {
  const f = useCurrentFrame();
  const blob = (cx: number, cy: number, color: string, phase: number, size: number) => ({
    position: 'absolute' as const,
    width: `${size}%`,
    height: `${size}%`,
    borderRadius: '50%',
    left: `${cx + Math.sin((f + phase) / 55) * 7}%`,
    top: `${cy + Math.cos((f + phase) / 65) * 6}%`,
    background: `radial-gradient(circle, ${color}, transparent 65%)`,
    filter: 'blur(70px)',
    opacity: 0.5,
  });

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${BRAND_C.surfaceStrong}, ${C.bgDeep} 75%)`}}>
      <div style={blob(8, 18, C.green, 0, 46)} />
      <div style={blob(70, 55, C.gold, 60, 50)} />
      <div style={blob(38, 70, C.blue, 120, 40)} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 52%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// EXPERIMENTELL: weicher wandernder Mesh-Gradient.
export const FNBgMesh: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at ${30 + Math.sin(f / 55) * 12}% 28%, ${BRAND_C.surfacePositive}, transparent 45%),
        radial-gradient(circle at 78% ${62 + Math.cos(f / 48) * 12}%, ${a(C.gold, 0.18)}, transparent 46%),
        radial-gradient(circle at 42% 86%, ${BRAND_C.surface}, transparent 50%), ${C.bgDeep}`,
    }} />
  );
};

// EMPFOHLEN: Daten-, Chart- und Markt-Hintergrund.
export const FNBgGrid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${BRAND_C.surface}, ${C.bgDeep} 78%)`}}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${a(C.green, 0.11)} 1px,transparent 1px),linear-gradient(90deg,${a(C.green, 0.11)} 1px,transparent 1px)`,
        backgroundSize: '58px 58px',
        WebkitMaskImage: `radial-gradient(circle at 50% ${42 + Math.sin(f / 40) * 6}%, black, transparent 72%)`,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 42%, ${a(C.green, 0.13)}, transparent 40%)`,
        opacity: 0.6 + Math.sin(f / 25) * 0.2,
      }} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 52%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// EXPERIMENTELL: Lichtstrahlen. Nur bei begründetem dramaturgischem Zweck.
export const FNBgRays: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${BRAND_C.surface}, ${C.bgDeep})`}}>
      {new Array(9).fill(0).map((_, index) => (
        <div key={index} style={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          width: '5%',
          height: '150%',
          transformOrigin: 'top center',
          transform: `translateX(-50%) rotate(${(index - 4) * 10 + Math.sin(f / 45 + index) * 2.5}deg)`,
          background: `linear-gradient(180deg, ${C.greenLt}, transparent 70%)`,
          filter: 'blur(24px)',
          opacity: 0.14 + 0.10 * Math.abs(Math.sin(f / 28 + index * 1.3)),
        }} />
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, transparent 55%, rgba(0,0,0,0.5))'}} />
    </AbsoluteFill>
  );
};

// EXPERIMENTELL: Partikel. Nicht hinter Untertiteln oder komplexen Bildern verwenden.
export const FNBgParticles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 60%, ${BRAND_C.surfaceStrong}, ${C.bgDeep} 80%)`}}>
      {new Array(46).fill(0).map((_, index) => {
        const x = rand(index) * 100;
        const y = 100 - ((f * (0.10 + rand(index + 3) * 0.18) + rand(index + 9) * 100) % 110);
        const size = 2 + rand(index + 7) * 3;
        const color = index % 5 === 0 ? C.gold : C.green;
        return <div key={index} style={{
          position: 'absolute',
          left: `${x + Math.sin(f / 30 + index) * 1.5}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          opacity: 0.15 + rand(index + 1) * 0.35,
          boxShadow: `0 0 ${size * 2}px ${color}`,
        }} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.45))'}} />
    </AbsoluteFill>
  );
};

// EXPERIMENTELL: horizontale Marktlinien.
export const FNBgTicker: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${BRAND_C.surface}, ${C.bgDeep})`}}>
      {new Array(22).fill(0).map((_, index) => {
        const y = (index / 22) * 100;
        const direction = index % 2 === 0 ? 1 : -1;
        const shift = (f * (0.25 + rand(index) * 0.3) * direction) % 120;
        return <div key={index} style={{
          position: 'absolute',
          top: `${y}%`,
          left: `${-10 + shift}%`,
          width: '70%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${index % 6 === 0 ? C.gold : C.green}, transparent)`,
          opacity: 0.10 + rand(index + 2) * 0.12,
        }} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 48%, rgba(0,0,0,0.55))'}} />
    </AbsoluteFill>
  );
};

export const FN_RECOMMENDED_BGS: [string, React.FC][] = [
  ['FNBgAurora', FNBgAurora],
  ['FNBgGrid', FNBgGrid],
];

export const FN_EXPERIMENTAL_BGS: [string, React.FC][] = [
  ['FNBgMesh', FNBgMesh],
  ['FNBgRays', FNBgRays],
  ['FNBgParticles', FNBgParticles],
  ['FNBgTicker', FNBgTicker],
];

// Vollständige Liste bleibt für bestehende Showcases kompatibel.
export const FN_BGS: [string, React.FC][] = [
  ...FN_RECOMMENDED_BGS,
  ...FN_EXPERIMENTAL_BGS,
];

const BG_DEMO_VALUE = calculateSavingsPlanFutureValue({
  contributionPerPeriod: 200,
  annualReturnRate: 0.07,
  years: 30,
  periodsPerYear: 12,
});

// Demo mit reproduzierbarer Beispielrechnung statt frei eingetragener Zahl.
export const FNBgDemo: React.FC = () => {
  const f = useCurrentFrame();
  const appear = (start: number) => Math.max(0, Math.min(1, (f - start) / 16));
  return (
    <AbsoluteFill>
      <FNBgGrid />
      <AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{fontFamily: inter, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.green,
          opacity: appear(4)}}>BEISPIELRECHNUNG</div>
        <div style={{fontFamily: bebas, fontSize: 210, lineHeight: 1, color: C.ink,
          textShadow: `0 0 60px ${a(C.green, 0.33)}`, opacity: appear(14), marginTop: 20}}>{euro(BG_DEMO_VALUE)}</div>
        <div style={{fontFamily: inter, fontSize: 34, color: C.muted, opacity: appear(28), marginTop: 18}}>
          200 € monatlich · 30 Jahre · 7 % p. a.
        </div>
        <div style={{fontFamily: inter, fontSize: 24, color: a(C.muted, 0.72), opacity: appear(36), marginTop: 10}}>
          Einzahlung am Monatsende · vor Kosten, Steuern und Inflation · keine Renditegarantie
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FNBgGridShowcase: React.FC = () => (
  <AbsoluteFill style={{background: '#000', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6, padding: 6}}>
    {FN_BGS.map(([name, Component]) => (
      <div key={name} style={{position: 'relative', overflow: 'hidden', borderRadius: 10}}>
        <Component />
        <div style={{position: 'absolute', bottom: 14, left: 16, fontFamily: inter, fontSize: 26, fontWeight: 700,
          color: C.ink, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{name}</div>
      </div>
    ))}
  </AbsoluteFill>
);
