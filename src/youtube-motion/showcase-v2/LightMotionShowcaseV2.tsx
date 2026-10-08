import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {LIGHT_SCENE_FRAMES} from './light-primitives';
import {
  LightBarRace,
  LightCompare,
  LightDonut,
  LightHeatmap,
  LightIconBudget,
  LightLineArea,
  LightRankingTable,
  LightStackedBars,
} from './light-scenes-a';
import {
  LightFlowDiagram,
  LightInvoice,
  LightProcess,
  LightProgressRings,
  LightScatter,
  LightSparkStats,
  LightTimeline,
} from './light-scenes-b';

const scenes=[
  LightCompare,
  LightRankingTable,
  LightBarRace,
  LightLineArea,
  LightDonut,
  LightStackedBars,
  LightHeatmap,
  LightIconBudget,
  LightTimeline,
  LightProcess,
  LightFlowDiagram,
  LightInvoice,
  LightScatter,
  LightProgressRings,
  LightSparkStats,
] as const;

export const LIGHT_MOTION_SHOWCASE_FRAMES=LIGHT_SCENE_FRAMES*scenes.length;

export const LightMotionShowcaseV2:React.FC=()=>(
  <AbsoluteFill style={{background:'#F7F5EF'}}>
    {scenes.map((Scene,i)=>(
      <Sequence key={i} from={i*LIGHT_SCENE_FRAMES} durationInFrames={LIGHT_SCENE_FRAMES} premountFor={24}>
        <Scene/>
      </Sequence>
    ))}
  </AbsoluteFill>
);
