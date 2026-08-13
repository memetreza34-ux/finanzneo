import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {
  DailyInterestAnimation,
  DispoMechanismAnimation,
  InterestExampleAnimation,
  RepaymentStepsAnimation,
  SalaryHoleAnimation,
  TermsCheckAnimation,
} from './animations';

export type DispoTimeline = {
  sceneStarts:number[];
  sceneDurations:number[];
};

const assertTimeline=(timeline:DispoTimeline)=>{
  if(timeline.sceneStarts.length!==10 || timeline.sceneDurations.length!==10){
    throw new Error('DispoKosten requires exactly 10 audio-derived scene starts and durations.');
  }
  if(timeline.sceneDurations.some((v)=>!Number.isFinite(v)||v<=0)){
    throw new Error('DispoKosten refuses unresolved or fake scene durations.');
  }
};

const UserImage:React.FC<{src:string}>=({src})=><AbsoluteFill style={{background:'#020805'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></AbsoluteFill>;

/**
 * Prebuilt V17 visual track.
 * IMPORTANT: sceneStarts/sceneDurations must come from the final voiceover alignment.
 * This component intentionally contains no fallback timing grid.
 */
export const DispoKosten:React.FC<{timeline:DispoTimeline}>=({timeline})=>{
  assertTimeline(timeline);
  const d=timeline.sceneDurations;
  const s=timeline.sceneStarts;
  return <AbsoluteFill style={{background:'#020805'}}>
    <Sequence from={s[0]} durationInFrames={d[0]}><UserImage src="reels/dispo/scene-01.png"/></Sequence>
    <Sequence from={s[1]} durationInFrames={d[1]}><DispoMechanismAnimation durationInFrames={d[1]}/></Sequence>
    <Sequence from={s[2]} durationInFrames={d[2]}><DailyInterestAnimation durationInFrames={d[2]}/></Sequence>
    <Sequence from={s[3]} durationInFrames={d[3]}><UserImage src="reels/dispo/scene-04.png"/></Sequence>
    <Sequence from={s[4]} durationInFrames={d[4]}><InterestExampleAnimation durationInFrames={d[4]}/></Sequence>
    <Sequence from={s[5]} durationInFrames={d[5]}><SalaryHoleAnimation durationInFrames={d[5]}/></Sequence>
    <Sequence from={s[6]} durationInFrames={d[6]}><UserImage src="reels/dispo/scene-07.png"/></Sequence>
    <Sequence from={s[7]} durationInFrames={d[7]}><RepaymentStepsAnimation durationInFrames={d[7]}/></Sequence>
    <Sequence from={s[8]} durationInFrames={d[8]}><TermsCheckAnimation durationInFrames={d[8]}/></Sequence>
    <Sequence from={s[9]} durationInFrames={d[9]}><UserImage src="reels/dispo/scene-10.png"/></Sequence>
  </AbsoluteFill>;
};
