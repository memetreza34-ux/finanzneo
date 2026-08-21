import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {C, inter, StaticBG} from './fn_core';
import * as P from './fn_pro';

const items: {name: string; node: React.ReactNode}[] = [
  {name: 'Hero-Zahl', node: <P.FNHeroNumber />},
  {name: 'Balken (clean)', node: <P.FNBarsClean />},
  {name: 'Linie (clean)', node: <P.FNLineClean />},
  {name: 'Stat-Triptychon', node: <P.FNStatTriptych />},
  {name: 'Donut (tonal)', node: <P.FNDonutClean />},
  {name: 'Vergleich (clean)', node: <P.FNCompareClean />},
  {name: 'Zitat', node: <P.FNQuoteClean />},
];
export const FNPRO_FRAMES = items.length * 140;

const Demo: React.FC<{name: string; node: React.ReactNode}> = ({name, node}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticBG />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '110px 120px'}}>{node}</AbsoluteFill>
      <div style={{position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', opacity: Math.min(1, (f - 4) / 12),
        fontFamily: inter, fontSize: 28, letterSpacing: 4, color: 'rgba(255,255,255,0.4)'}}>{name}</div>
    </AbsoluteFill>
  );
};

export const FNProShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((it, i) => <Series.Sequence key={i} durationInFrames={140}><Demo {...it} /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
