import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ReorderingBars, ReorderingTable, BuildingDonut, LIGHT, LightStage, SmallLabel, TracedTrendChart} from './charts';
import {CashFlowSystem, ComparisonDelta, HeatmapTransition, WaffleProgress} from './systems';
import type {DonutPart, RankDatum, TrendPoint} from './core';

export const MOTION_V3_SCENE_FRAMES = 165;
export const MOTION_V3_FPS = 30;
export const MOTION_V3_FORMAT = {width: 1920, height: 1080, fps: MOTION_V3_FPS} as const;

const ranks: RankDatum[] = [
  {id: 'a', label: 'Unternehmen A', start: 580, end: 920, color: LIGHT.green},
  {id: 'b', label: 'Unternehmen B', start: 840, end: 690, color: LIGHT.blue},
  {id: 'c', label: 'Unternehmen C', start: 390, end: 980, color: LIGHT.orange},
  {id: 'd', label: 'Unternehmen D', start: 730, end: 810, color: LIGHT.purple},
];
const fundParts: DonutPart[] = [
  {id: 'stocks', label: 'Welt-ETF', value: 55, color: LIGHT.green},
  {id: 'bonds', label: 'Anleihen', value: 25, color: LIGHT.blue},
  {id: 'cash', label: 'Tagesgeld', value: 12, color: LIGHT.gold},
  {id: 'other', label: 'Sonstiges', value: 8, color: LIGHT.orange},
];
const growth: TrendPoint[] = [
  {id:'1', label:'Start', value: 10000},
  {id:'2', label:'2 J.', value: 13200},
  {id:'3', label:'4 J.', value: 16800},
  {id:'4', label:'6 J.', value: 24800},
  {id:'5', label:'8 J.', value: 30500},
  {id:'6', label:'10 J.', value: 44000},
  {id:'7', label:'12 J.', value: 61300},
  {id:'8', label:'14 J.', value: 79800},
];
const heatValues = [
  [.12,.25,.38,.52,.68,.29,.20],
  [.25,.35,.58,.78,.90,.68,.34],
  [.10,.24,.39,.54,.59,.73,.32],
  [.22,.52,.67,.82,.94,.76,.48],
  [.15,.32,.46,.64,.80,.88,.57],
];
const cashSinks=[
  {id:'fix',label:'Fixkosten',amount:1470,color:LIGHT.orange},
  {id:'life',label:'Alltag',amount:930,color:LIGHT.blue},
  {id:'save',label:'Sparen',amount:600,color:LIGHT.green},
];

export const RankRaceV3:React.FC = () => <LightStage background="#F9F7F2">
  <SmallLabel x={220} y={135}>Umsatzvergleich · Vorjahr → aktuell</SmallLabel>
  <ReorderingBars data={ranks} changeStart={40} changeEnd={130} rowHeight={165} y={245} maxValue={1000}/>
</LightStage>;

export const DonutBuildV3:React.FC = () => <LightStage background="#FAF8F2">
  <SmallLabel x={230} y={140}>Portfolioaufteilung</SmallLabel>
  <BuildingDonut data={fundParts} start={13} spacing={22} buildDuration={32}/>
</LightStage>;

export const TrendTraceV3:React.FC = () => <LightStage background="#F5F9F6">
  <SmallLabel x={220} y={130}>Vermögensentwicklung · Beispielwerte</SmallLabel>
  <TracedTrendChart data={growth} start={12} end={136} minValue={0} maxValue={85000}/>
</LightStage>;

export const FlowTokensV3:React.FC = () => <LightStage background="#FBF9F4">
  <SmallLabel x={170} y={125}>Monatsbudget · Zuordnung der Einnahmen</SmallLabel>
  <CashFlowSystem sinks={cashSinks}/>
</LightStage>;

export const HeatmapFillV3:React.FC = () => <LightStage background="#F9FBF8">
  <SmallLabel x={255} y={120}>Auslastung · Wochenübersicht</SmallLabel>
  <HeatmapTransition values={heatValues} start={8} step={3}/>
</LightStage>;

export const SortableTableV3:React.FC = () => <LightStage background="#F6F9F7">
  <SmallLabel x={270} y={125}>Rangfolge nach Umsatz</SmallLabel>
  <ReorderingTable data={ranks} y={215} changeStart={40} changeEnd={130}/>
</LightStage>;

export const WaffleGrowV3:React.FC = () => <LightStage background="#F8F6FA">
  <WaffleProgress from={26} to={68} start={20} end={137} label="Ziel erreicht" color={LIGHT.purple}/>
</LightStage>;

export const DeltaCompareV3:React.FC = () => <LightStage background="#FAF9F5">
  <SmallLabel x={235} y={135}>Sparbetrag · Monatsvergleich</SmallLabel>
  <ComparisonDelta first={300} second={485} labels={['Vorher','Nachher']} start={28} end={125}/>
</LightStage>;

export const MOTION_V3_SCENES = [
  {id:'RankRaceV3', file:'01-rank-race', name:'Echtes Ranking-Reflow', component:RankRaceV3, mechanism:'reorder'},
  {id:'DonutBuildV3', file:'02-donut-build', name:'Segmentaufbau', component:DonutBuildV3, mechanism:'progressive-arc'},
  {id:'TrendTraceV3', file:'03-trend-trace', name:'Kontinuierlicher Trendpfad', component:TrendTraceV3, mechanism:'trace'},
  {id:'FlowTokensV3', file:'04-flow-tokens', name:'Tokenfluss und Aggregation', component:FlowTokensV3, mechanism:'follow-path'},
  {id:'HeatmapFillV3', file:'05-heatmap', name:'Werte in Farbstärken übersetzen', component:HeatmapFillV3, mechanism:'data-fill'},
  {id:'SortableTableV3', file:'06-table-reorder', name:'Tabellenzeilen umsortieren', component:SortableTableV3, mechanism:'layout-reflow'},
  {id:'WaffleGrowV3', file:'07-waffle', name:'Zellen fortschreitend füllen', component:WaffleGrowV3, mechanism:'grid-fill'},
  {id:'DeltaCompareV3', file:'08-delta', name:'Werte animiert vergleichen', component:DeltaCompareV3, mechanism:'compare-delta'},
] as const;

export const YOUTUBE_LIGHT_MOTION_V3_FRAMES = MOTION_V3_SCENES.length * MOTION_V3_SCENE_FRAMES;
export const YouTubeLightMotionV3:React.FC = () => <AbsoluteFill style={{background:LIGHT.cream}}>
  {MOTION_V3_SCENES.map((scene, index) => {
    const Scene = scene.component;
    return <Sequence key={scene.id} from={index * MOTION_V3_SCENE_FRAMES} durationInFrames={MOTION_V3_SCENE_FRAMES} premountFor={15}>
      <Scene/>
    </Sequence>;
  })}
</AbsoluteFill>;

