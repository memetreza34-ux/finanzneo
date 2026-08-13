import React from 'react';
import runtime from './runtime-data.json';
import {EtfKostenV2Final,type CaptionUnit} from './EtfKostenV2Final';

const durations=(runtime.durations as number[]);
const captionUnits=(runtime.captionUnits as CaptionUnit[]);

export const ETF_COST_FINAL_TOTAL_FRAMES=Math.max(1,durations.reduce((sum,value)=>sum+value,0));

export const EtfKostenV2Runtime:React.FC=()=>
  <EtfKostenV2Final durations={durations} captionUnits={captionUnits}/>;
