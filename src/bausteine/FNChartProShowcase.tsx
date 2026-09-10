import * as CH from './fn_chart_base';
import {FNShowcaseSeries, showcaseFrames} from './showcase-utils';

const BEAT = 150;
const scenes = [CH.FNLineChartPro, CH.FNDualLinePro, CH.FNCompoundPro, CH.FNDrawdownPro];
export const FNCHARTPRO_FRAMES = showcaseFrames(scenes.length, BEAT);

export const FNChartProShowcase: React.FC = () => (
  <FNShowcaseSeries scenes={scenes} beat={BEAT} background="static" />
);
