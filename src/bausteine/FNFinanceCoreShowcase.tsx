import * as K from './fn_finance_core';
import {FNShowcaseSeries, showcaseFrames} from './showcase-utils';

const BEAT = 150;
const scenes = [
  K.FNCompareTable,
  K.FNDualLine,
  K.FNFormula,
  K.FNLoanAmort,
  K.FNPyramid,
  K.FNTermCard,
  K.FNCalculator,
];
export const FNFC_FRAMES = showcaseFrames(scenes.length, BEAT);

export const FNFinanceCoreShowcase: React.FC = () => (
  <FNShowcaseSeries scenes={scenes} beat={BEAT} background="static" />
);
