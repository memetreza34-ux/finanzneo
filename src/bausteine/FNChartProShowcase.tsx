import {AbsoluteFill, Series} from 'remotion';
import {C, StaticBG} from './fn_core';
import * as CH from './fn_chart_base';

const scenes = [CH.FNLineChartPro, CH.FNDualLinePro, CH.FNCompoundPro, CH.FNDrawdownPro];
export const FNCHARTPRO_FRAMES = scenes.length * 150;

export const FNChartProShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <StaticBG />
    <Series>
      {scenes.map((Sc, i) => <Series.Sequence key={i} durationInFrames={150}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Sc /></AbsoluteFill>
      </Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
