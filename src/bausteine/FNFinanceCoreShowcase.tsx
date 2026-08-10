import {AbsoluteFill, Series} from 'remotion';
import {C, StaticBG} from './fn_core';
import * as K from './fn_finance_core';

const scenes = [K.FNCompareTable, K.FNDualLine, K.FNFormula, K.FNLoanAmort, K.FNPyramid, K.FNTermCard, K.FNCalculator];
export const FNFC_FRAMES = scenes.length * 150;

export const FNFinanceCoreShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <StaticBG />
    <Series>
      {scenes.map((Sc, i) => <Series.Sequence key={i} durationInFrames={150}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Sc /></AbsoluteFill>
      </Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
