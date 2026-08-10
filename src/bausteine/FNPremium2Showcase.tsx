import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {C, bebas, inter, StaticBG} from './fn_core';
import * as P from './fn_premium2';

const items: {name: string; node: React.ReactNode}[] = [
  {name: 'Shine-Card', node: <P.FNShineCard />},
  {name: 'Candlestick-Chart', node: <P.FNCandles />},
  {name: 'Gold-Barren', node: <P.FNGoldBars />},
  {name: 'Neon-Zahl', node: <P.FNNeonNumber />},
  {name: 'Wealth-Mountain', node: <P.FNWealthMountain />},
  {name: 'Portfolio-Ringe', node: <P.FNPortfolioRings />},
  {name: 'Beam-Stat', node: <P.FNBeamStat />},
  {name: 'Market-Heatmap', node: <P.FNMarketHeat />},
];
export const FNPREM2_FRAMES = items.length * 140;

const Demo: React.FC<{name: string; node: React.ReactNode}> = ({name, node}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticBG />
      <AbsoluteFill style={{padding: '90px 100px 120px', display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.gold, opacity: Math.min(1, f / 12)}}>FINANZNEO · PREMIUM</div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{node}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 56, width: '100%', textAlign: 'center', opacity: Math.min(1, (f - 4) / 12),
        fontFamily: bebas, fontSize: 56, color: C.ink}}>{name}</div>
    </AbsoluteFill>
  );
};

export const FNPremium2Showcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((it, i) => <Series.Sequence key={i} durationInFrames={140}><Demo {...it} /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
