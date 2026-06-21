import {AbsoluteFill, Sequence} from 'remotion';
import {C, AuroraBG} from './fn_core';
import {FNPortfolioGlobe, FNWealthOrbit, FNMoneyMorph, FNWealthTower, FNCompoundLoop, FNInflationErode, FNRiskReturn, FNCashflowSplit} from './fn_premium';

const BEAT = 140;
const beats = [
  <FNPortfolioGlobe />, <FNWealthOrbit />, <FNMoneyMorph />, <FNWealthTower />,
  <FNCompoundLoop />, <FNInflationErode />, <FNRiskReturn />, <FNCashflowSplit />,
];
export const FNPREM_FRAMES = BEAT * beats.length;

export const FNPremiumShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AuroraBG />
    {beats.map((b, i) => (
      <Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>{b}</Sequence>
    ))}
  </AbsoluteFill>
);
