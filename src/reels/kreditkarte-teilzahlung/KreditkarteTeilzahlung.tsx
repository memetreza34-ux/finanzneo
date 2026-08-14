import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {CaptionWord} from '../../lib/captions';
import {SentenceKaraokeCaptions} from '../../design-system/SentenceKaraokeCaptions';
import {CreditBackground,CreditFlowImage,CreditSceneShell,CREDIT_LAYOUT} from './shared';
import {RevolvingBalanceAnimation,RateSplitAnimation,SlowDebtDrainAnimation,FortyOneMonthsAnimation,RateRaceAnimation,InterestComparisonAnimation} from './animations';

export type CreditTimeline={sceneStarts:number[];sceneDurations:number[]};
export type KreditkarteTeilzahlungProps={timeline:CreditTimeline;audioSrc?:string|null;captionWords?:CaptionWord[];storyboard?:boolean};

const scenes=[
['KLEINE RATE. LANGE SCHULD.','50 € wirken klein – Zinsen können die Rückzahlung verlängern.','image'],
['RESTSCHULD ROLLT WEITER','Du zahlst einen Teil – der offene Betrag bleibt im Kreislauf.','animation'],
['ZINS SCHMÄLERT DIE TILGUNG','Im Modell: 1,5 % pro Monat auf die Restschuld.','animation'],
['MONAT 1: 22,50 € ZINSEN','Von 50 € Rate tilgen nur 27,50 € die Schuld.','image'],
['RESTSCHULD SINKT LANGSAM','Jeden Monat: Zins drauf, Rate runter.','animation'],
['41 MONATE BIS NULL','50 € Rate · 1.500 € Startschuld · 18-%-Modell.','animation'],
['RUND 508 € ZINSEN','Zusätzlich zur ursprünglichen 1.500-€-Schuld.','image'],
['100 € RATE BESCHLEUNIGT','Im selben Modell: rund 18 statt 41 Monate.','animation'],
['KNAPP 296 € ZINSEN UNTERSCHIED','Rund 508 € vs. 212 € im selben Modell.','animation'],
['PRÜF MEHR ALS DIE RATE','Effektivzins · Rückzahlungsrate · Vollzahlung.','image'],
] as const;

const mockKind=(scene:number)=>scene===1?'hook':scene===4?'split':scene===7?'cost':'check';
const visual=(scene:number,duration:number,storyboard:boolean)=>{if([1,4,7,10].includes(scene))return <CreditFlowImage scene={scene} storyboard={storyboard} mockKind={mockKind(scene)}/>;if(scene===2)return <RevolvingBalanceAnimation durationFrames={duration}/>;if(scene===3)return <RateSplitAnimation durationFrames={duration}/>;if(scene===5)return <SlowDebtDrainAnimation durationFrames={duration}/>;if(scene===6)return <FortyOneMonthsAnimation durationFrames={duration}/>;if(scene===8)return <RateRaceAnimation durationFrames={duration}/>;return <InterestComparisonAnimation durationFrames={duration}/>};

export const KreditkarteTeilzahlung:React.FC<KreditkarteTeilzahlungProps>=({timeline,audioSrc=null,captionWords=[],storyboard=false})=>{if(timeline.sceneStarts.length!==10||timeline.sceneDurations.length!==10)throw new Error('KreditkarteTeilzahlung benötigt 10 Szenenstarts und 10 Szenendauern.');if(timeline.sceneDurations.some(d=>!Number.isFinite(d)||d<=0))throw new Error('Alle Szenendauern müssen > 0 sein.');return <AbsoluteFill><CreditBackground/>{audioSrc?<Audio src={staticFile(audioSrc)}/>:null}{scenes.map(([headline,subheadline,type],i)=><Sequence key={i} from={timeline.sceneStarts[i]} durationInFrames={timeline.sceneDurations[i]}><CreditSceneShell headline={headline} subheadline={subheadline} fullFrameVisual={type==='image'}>{visual(i+1,timeline.sceneDurations[i],storyboard)}</CreditSceneShell></Sequence>)}{captionWords.length?<SentenceKaraokeCaptions words={captionWords} bottom={CREDIT_LAYOUT.captionBottom} left={CREDIT_LAYOUT.captionLeft} right={CREDIT_LAYOUT.captionRight}/>:null}</AbsoluteFill>};
