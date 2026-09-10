import * as K from './fn_concepts';
import {FNShowcaseSeries, showcaseFrames} from './showcase-utils';

const BEAT = 150;
const scenes = [
  K.FNSnowball,
  K.FNCostAverage,
  K.FNDiversification,
  K.FNRiskReturn,
  K.FNDrawdown,
  K.FNNetWorth,
  K.FNFourPercent,
  K.FNEmergencyFund,
];
export const FNCONCEPTS_FRAMES = showcaseFrames(scenes.length, BEAT);

export const FNConceptsShowcase: React.FC = () => (
  <FNShowcaseSeries scenes={scenes} beat={BEAT} background="static" />
);
