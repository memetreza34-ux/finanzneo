import React from 'react';
import {AbsoluteFill,Sequence,staticFile} from 'remotion';
import {C,FONT} from '../../design-system';
import manifest from './asset-manifest.json';
import runtime from './runtime-data.json';
import {ETF_COST_COPY,ETF_COST_PREVIEW_DURATIONS,ETF_COST_PREVIEW_TOTAL_FRAMES as STORYBOARD_FRAMES} from './config';
import {Header,SafeFlowImage,SeamlessBackground,VisualViewport} from './layout';
import {SameSavingsTwoCostPathsAnimation,FeeCompoundingDragAnimation,ModelReturnSplitAnimation} from './animations-core';
import {ThirtyYearGrowthRaceAnimation} from './animation-growth-race';
import {CostLayersJourneyAnimation} from './animation-cost-journey';
import {SelectionFilterAnimation} from './animation-criteria-filter';
import {EtfKostenV2Final,type CaptionUnit} from './EtfKostenV2Final';

type ImageId='scene-01'|'scene-04'|'scene-07'|'scene-10';
const runtimeDurations=runtime.durations as number[];
const runtimeCaptions=runtime.captionUnits as CaptionUnit[];
const finalReady=runtime.status==='final-audio-aligned'&&runtimeDurations.length===10&&runtimeCaptions.length>0;
export const ETF_COST_PREVIEW_TOTAL_FRAMES=finalReady?runtimeDurations.reduce((sum,value)=>sum+value,0):STORYBOARD_FRAMES;

const ImageScene:React.FC<{id:ImageId;index:number}>=({id,index})=>{
 const src=(manifest as Record<string,string|null>)[id];
 if(src)return <AbsoluteFill style={{background:C.bg}}><SeamlessBackground/><SafeFlowImage src={staticFile(src)}/><Header copy={ETF_COST_COPY[index]}/></AbsoluteFill>;
 return <AbsoluteFill style={{background:C.bg}}><SeamlessBackground/><Header copy={ETF_COST_COPY[index]}/><VisualViewport><div style={{position:'absolute',inset:70,border:'2px dashed rgba(255,255,255,.2)',borderRadius:36,display:'grid',placeItems:'center',fontFamily:FONT.body,fontWeight:900,fontSize:34,color:C.gray}}>{id.toUpperCase()} · BILD NOCH NICHT SYNCHRONISIERT</div></VisualViewport></AbsoluteFill>;
};

const scene=(index:number,duration:number)=>{
 switch(index){
  case 0:return <ImageScene id="scene-01" index={0}/>;
  case 1:return <SameSavingsTwoCostPathsAnimation durationInFrames={duration}/>;
  case 2:return <FeeCompoundingDragAnimation durationInFrames={duration}/>;
  case 3:return <ImageScene id="scene-04" index={3}/>;
  case 4:return <ModelReturnSplitAnimation durationInFrames={duration}/>;
  case 5:return <ThirtyYearGrowthRaceAnimation durationInFrames={duration}/>;
  case 6:return <ImageScene id="scene-07" index={6}/>;
  case 7:return <CostLayersJourneyAnimation durationInFrames={duration}/>;
  case 8:return <SelectionFilterAnimation durationInFrames={duration}/>;
  case 9:return <ImageScene id="scene-10" index={9}/>;
  default:return null;
 }
};

export const EtfKostenV2Storyboard:React.FC=()=>{
 if(finalReady)return <EtfKostenV2Final durations={runtimeDurations} captionUnits={runtimeCaptions}/>;
 let from=0;
 return <AbsoluteFill style={{background:C.bg}}>{ETF_COST_PREVIEW_DURATIONS.map((duration,index)=>{const start=from;from+=duration;return <Sequence key={index} from={start} durationInFrames={duration}>{scene(index,duration)}</Sequence>})}</AbsoluteFill>;
};
