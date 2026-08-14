import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {CaptionWord} from '../../lib/captions';
import {SentenceKaraokeCaptions} from '../../design-system/SentenceKaraokeCaptions';
import {InflationBackground, InflationFlowImage, InflationSceneShell, INFLATION_LAYOUT} from './shared';
import {BasketPriceOverTimeAnimation, BuyingPowerLossAnimation, NominalVsRealAnimation, PriceLevelMechanismAnimation, PurchasingPowerTimelineAnimation, SamePurchasingPowerTargetAnimation} from './animations';

export type InflationTimeline={sceneStarts:number[];sceneDurations:number[]};
export type InflationKaufkraftProps={timeline:InflationTimeline;audioSrc?:string|null;captionWords?:CaptionWord[];storyboard?:boolean};

const scenes=[
  ['10.000 € BLEIBEN NICHT 10.000 €','Der Kontostand kann gleich bleiben – die Kaufkraft nicht.','image'],
  ['INFLATION VERÄNDERT PREISE','Steigen Preise, bekommst du für denselben Euro weniger.','animation'],
  ['3 % WIRKEN JEDES JAHR','Aus 100 € Warenkorb werden im Modell rund 181 €.','animation'],
  ['DEIN KONTO SIEHT GLEICH AUS','Nominal unverändert. Die Umgebung wird teurer.','image'],
  ['5 → 10 → 20 JAHRE','8.626 € → 7.441 € → 5.537 € heutige Kaufkraft.','animation'],
  ['RUND 45 % KAUFKRAFT WEG','Der Nominalwert bleibt bei 10.000 €.','animation'],
  ['DU MERKST ES AM WARENKORB','Gleiche Euro – weniger Waren.','image'],
  ['NOMINAL ≠ REAL','Kontostand und Kaufkraft sind zwei verschiedene Größen.','animation'],
  ['GLEICHE KAUFKRAFT BRAUCHT MEHR EURO','Im 3-%-Modell: 10.000 € heute ≈ 18.061 € in 20 Jahren.','animation'],
  ['DENK IN KAUFKRAFT','Nicht nur: Wie viele Euro? Sondern: Was können sie kaufen?','image'],
] as const;

const mockKind=(scene:number)=>scene===1?'hook':scene===4?'nominal':scene===7?'basket':'close';
const isImageScene=(scene:number)=>scene===1||scene===4||scene===7||scene===10;

const visual=(scene:number,duration:number,storyboard:boolean)=>{
  if(isImageScene(scene))return <InflationFlowImage scene={scene} storyboard={storyboard} mockKind={mockKind(scene)}/>;
  if(scene===2)return <PriceLevelMechanismAnimation durationFrames={duration}/>;
  if(scene===3)return <BasketPriceOverTimeAnimation durationFrames={duration}/>;
  if(scene===5)return <PurchasingPowerTimelineAnimation durationFrames={duration}/>;
  if(scene===6)return <BuyingPowerLossAnimation durationFrames={duration}/>;
  if(scene===8)return <NominalVsRealAnimation durationFrames={duration}/>;
  return <SamePurchasingPowerTargetAnimation durationFrames={duration}/>;
};

export const InflationKaufkraft:React.FC<InflationKaufkraftProps>=({timeline,audioSrc=null,captionWords=[],storyboard=false})=>{
  if(timeline.sceneStarts.length!==10||timeline.sceneDurations.length!==10)throw new Error('InflationKaufkraft benötigt exakt 10 Szenenstarts und 10 Szenendauern.');
  if(timeline.sceneDurations.some((d)=>!Number.isFinite(d)||d<=0))throw new Error('Alle Szenendauern müssen > 0 sein.');
  return <AbsoluteFill>
    <InflationBackground/>
    {audioSrc?<Audio src={staticFile(audioSrc)}/>:null}
    {scenes.map(([headline,subheadline,type],i)=><Sequence key={i} from={timeline.sceneStarts[i]} durationInFrames={timeline.sceneDurations[i]}><InflationSceneShell headline={headline} subheadline={subheadline} fullFrameVisual={type==='image'}>{visual(i+1,timeline.sceneDurations[i],storyboard)}</InflationSceneShell></Sequence>)}
    {captionWords.length?<SentenceKaraokeCaptions words={captionWords} bottom={INFLATION_LAYOUT.captionBottom} left={INFLATION_LAYOUT.captionLeft} right={INFLATION_LAYOUT.captionRight}/>:null}
  </AbsoluteFill>;
};
