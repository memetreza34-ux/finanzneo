import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {C,FONT} from '../../design-system';
import manifest from './asset-manifest.json';
import {ETF_COST_COPY} from './config';
import {CaptionViewport,Header,SafeFlowImage,SeamlessBackground} from './layout';
import {SameSavingsTwoCostPathsAnimation,FeeCompoundingDragAnimation,ModelReturnSplitAnimation} from './animations-core';
import {ThirtyYearGrowthRaceAnimation} from './animation-growth-race';
import {CostLayersJourneyAnimation} from './animation-cost-journey';
import {SelectionFilterAnimation} from './animation-criteria-filter';

export type CaptionWord={text:string;startFrame:number;endFrame:number};
export type CaptionUnit={startFrame:number;endFrame:number;words:CaptionWord[]};
type ImageId='scene-01'|'scene-04'|'scene-07'|'scene-10';

const Still:React.FC<{id:ImageId;index:number}>=({id,index})=>{
 const src=(manifest as Record<string,string|null>)[id];
 if(!src)throw new Error(`Missing media for ${id}`);
 return <AbsoluteFill style={{background:C.bg}}><SeamlessBackground/><SafeFlowImage src={staticFile(src)}/><Header copy={ETF_COST_COPY[index]}/></AbsoluteFill>;
};

const Captions:React.FC<{units:CaptionUnit[]}>=({units})=>{
 const frame=useCurrentFrame();
 const unit=units.find((u)=>frame>=u.startFrame&&frame<u.endFrame);
 if(!unit)return null;
 return <CaptionViewport><div style={{fontFamily:FONT.body,fontWeight:900,fontSize:48,lineHeight:1.12,textAlign:'center',color:C.white,textShadow:'0 4px 14px rgba(0,0,0,.9)'}}>{unit.words.map((w,i)=>{const active=frame>=w.startFrame&&frame<w.endFrame;return <React.Fragment key={`${i}-${w.text}`}><span style={{color:active?C.accentLt:C.white}}>{w.text}</span>{i<unit.words.length-1?' ':''}</React.Fragment>})}</div></CaptionViewport>;
};

const Visual:React.FC<{index:number;duration:number}>=({index,duration})=>{
 switch(index){
  case 0:return <Still id="scene-01" index={0}/>;
  case 1:return <SameSavingsTwoCostPathsAnimation durationInFrames={duration}/>;
  case 2:return <FeeCompoundingDragAnimation durationInFrames={duration}/>;
  case 3:return <Still id="scene-04" index={3}/>;
  case 4:return <ModelReturnSplitAnimation durationInFrames={duration}/>;
  case 5:return <ThirtyYearGrowthRaceAnimation durationInFrames={duration}/>;
  case 6:return <Still id="scene-07" index={6}/>;
  case 7:return <CostLayersJourneyAnimation durationInFrames={duration}/>;
  case 8:return <SelectionFilterAnimation durationInFrames={duration}/>;
  case 9:return <Still id="scene-10" index={9}/>;
  default:return null;
 }
};

export const EtfKostenV2Final:React.FC<{durations:readonly number[];captionUnits:CaptionUnit[]}>=({durations,captionUnits})=>{
 const audio=(manifest as {audio:string|null}).audio;
 if(!audio)throw new Error('Missing final audio');
 if(durations.length!==10||durations.some((d)=>!Number.isFinite(d)||d<=0))throw new Error('Invalid final timeline');
 if(!captionUnits.length)throw new Error('Missing aligned captions');
 let from=0;
 return <AbsoluteFill style={{background:C.bg}}><Audio src={staticFile(audio)}/>{durations.map((duration,index)=>{const start=from;from+=duration;return <Sequence key={index} from={start} durationInFrames={duration}><Visual index={index} duration={duration}/></Sequence>})}<Captions units={captionUnits}/></AbsoluteFill>;
};
