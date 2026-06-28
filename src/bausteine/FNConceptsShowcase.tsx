import {AbsoluteFill, Series} from 'remotion';
import {C, StaticBG} from './fn_core';
import * as K from './fn_concepts';

const scenes = [K.FNSnowball, K.FNCostAverage, K.FNDiversification, K.FNRiskReturn, K.FNDrawdown, K.FNNetWorth, K.FNFourPercent, K.FNEmergencyFund];
export const FNCONCEPTS_FRAMES = scenes.length * 150;

export const FNConceptsShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <StaticBG />
    <Series>
      {scenes.map((Sc, i) => <Series.Sequence key={i} durationInFrames={150}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Sc /></AbsoluteFill>
      </Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
