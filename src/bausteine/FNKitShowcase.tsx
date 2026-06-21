import {AbsoluteFill, Sequence} from 'remotion';
import {C, AuroraBG} from './fn_core';
import {FNTitle, FNBigNumber, FNStatCard, FNCompareBars, FNGrowthCurve, FNDonut, FNHook, FNTicker, FNEndCard} from './fn_kit';

const BEAT = 110;
const beats = [
  <FNTitle />, <FNHook />, <FNBigNumber />, <FNStatCard />,
  <FNCompareBars />, <FNGrowthCurve />, <FNDonut />, <FNTicker />, <FNEndCard />,
];
export const FNKIT_FRAMES = BEAT * beats.length;

export const FNKitShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AuroraBG />
    {beats.map((b, i) => (
      <Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>{b}</Sequence>
    ))}
  </AbsoluteFill>
);
