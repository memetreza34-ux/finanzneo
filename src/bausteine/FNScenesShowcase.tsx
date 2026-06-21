import {AbsoluteFill, Series} from 'remotion';
import {C} from './fn_core';
import * as S from './fn_scenes';

const scenes = [S.FNCompoundScene, S.FNInflationScene, S.FNCompareScene, S.FNPortfolioScene, S.FNMarketScene];
export const FNSCENES_FRAMES = scenes.length * 160;

export const FNScenesShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {scenes.map((Sc, i) => <Series.Sequence key={i} durationInFrames={160}><Sc /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
