import * as S from './fn_scenes';
import {FNShowcaseSeries, showcaseFrames} from './showcase-utils';

const BEAT = 160;
const scenes = [S.FNCompoundScene, S.FNInflationScene, S.FNCompareScene, S.FNPortfolioScene, S.FNMarketScene];
export const FNSCENES_FRAMES = showcaseFrames(scenes.length, BEAT);

export const FNScenesShowcase: React.FC = () => (
  <FNShowcaseSeries scenes={scenes} beat={BEAT} background="none" centerContent={false} />
);
