import React from 'react';
import {Composition} from 'remotion';
import {Thumbnail} from '../Thumbnail';
import {ThumbnailFlux} from '../ThumbnailFlux';
import {ProfilePic1, ProfilePic2, ProfilePic3} from '../ProfilePic';
import {DisclaimerPreview} from '../DisclaimerPreview';
import {DreiKontenSystem, DREI_KONTEN_SYSTEM_FRAMES} from '../reels/drei-konten/DreiKontenSystem';
import {NotgroschenStufenplan, NOTGROSCHEN_TOTAL_FRAMES} from '../reels/notgroschen/NotgroschenStufenplan';
import {ZinseszinsZeit, ZINSESZINS_TOTAL_FRAMES} from '../reels/zinseszins/ZinseszinsZeit';
import {EtfKostenV2Storyboard, ETF_COST_PREVIEW_TOTAL_FRAMES} from '../reels/etf-kosten-v2/EtfKostenV2Storyboard';
import {InflationKaufkraftRuntime, INFLATION_FINAL_TOTAL_FRAMES} from '../reels/inflation/InflationKaufkraftRuntime';
import {InflationKaufkraftStoryboard, INFLATION_STORYBOARD_FRAMES} from '../reels/inflation/InflationKaufkraftStoryboard';
import {Scene01Hook, SCENE01_FRAMES} from '../zins/Scene01Hook';
import {Scene02Zinseszins, SCENE02_FRAMES} from '../zins/Scene02Zinseszins';
import {Scene03SparbuchVs, SCENE03_FRAMES} from '../zins/Scene03SparbuchVs';
import {Scene04MachtDerZeit, SCENE04_FRAMES} from '../zins/Scene04MachtDerZeit';
import {Scene05EchtesBeispiel, SCENE05_FRAMES} from '../zins/Scene05EchtesBeispiel';
import {Scene06Killer, SCENE06_FRAMES} from '../zins/Scene06Killer';
import {Scene07GroessterFehler, SCENE07_FRAMES} from '../zins/Scene07GroessterFehler';
import {Scene08WieVielReicht, SCENE08_FRAMES} from '../zins/Scene08WieVielReicht';
import {Scene09RisikoEhrlich, SCENE09_FRAMES} from '../zins/Scene09RisikoEhrlich';
import {Scene10ErsterSchritt, SCENE10_FRAMES} from '../zins/Scene10ErsterSchritt';
import {Scene11PayoffCTA, SCENE11_FRAMES} from '../zins/Scene11PayoffCTA';
import {ShortHook, SHORT_HOOK_FRAMES} from '../zins/ShortHook';
import {ShortAnnaTom, SHORT_ANNATOM_FRAMES} from '../zins/ShortAnnaTom';
import {ShortSparbuch, SHORT_SPARBUCH_FRAMES} from '../zins/ShortSparbuch';
import {ShortZeit, SHORT_ZEIT_FRAMES} from '../zins/ShortZeit';
import {ShortKiller, SHORT_KILLER_FRAMES} from '../zins/ShortKiller';
import {ShortStart, SHORT_START_FRAMES} from '../zins/ShortStart';
import {ShortMSCI, SHORT_MSCI_FRAMES} from '../zins/ShortMSCI';

const FPS = 30;
const VERTICAL = {width: 1080, height: 1920} as const;
const WIDE = {width: 1920, height: 1080} as const;

export const ProductionCompositions: React.FC = () => (
  <>
    <Composition id="NotgroschenStufenplan" component={NotgroschenStufenplan} durationInFrames={NOTGROSCHEN_TOTAL_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ZinseszinsZeit" component={ZinseszinsZeit} durationInFrames={ZINSESZINS_TOTAL_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="EtfKostenV2Storyboard" component={EtfKostenV2Storyboard} durationInFrames={ETF_COST_PREVIEW_TOTAL_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="InflationKaufkraft" component={InflationKaufkraftRuntime} durationInFrames={INFLATION_FINAL_TOTAL_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="InflationKaufkraftStoryboard" component={InflationKaufkraftStoryboard} durationInFrames={INFLATION_STORYBOARD_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="DreiKontenSystem" component={DreiKontenSystem} durationInFrames={DREI_KONTEN_SYSTEM_FRAMES} fps={FPS} {...VERTICAL} />

    <Composition id="ShortHook" component={ShortHook} durationInFrames={SHORT_HOOK_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortAnnaTom" component={ShortAnnaTom} durationInFrames={SHORT_ANNATOM_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortSparbuch" component={ShortSparbuch} durationInFrames={SHORT_SPARBUCH_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortZeit" component={ShortZeit} durationInFrames={SHORT_ZEIT_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortKiller" component={ShortKiller} durationInFrames={SHORT_KILLER_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortStart" component={ShortStart} durationInFrames={SHORT_START_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="ShortMSCI" component={ShortMSCI} durationInFrames={SHORT_MSCI_FRAMES} fps={FPS} {...VERTICAL} />

    <Composition id="S1Hook" component={Scene01Hook} durationInFrames={SCENE01_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S2Zinseszins" component={Scene02Zinseszins} durationInFrames={SCENE02_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S3SparbuchVs" component={Scene03SparbuchVs} durationInFrames={SCENE03_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S4MachtDerZeit" component={Scene04MachtDerZeit} durationInFrames={SCENE04_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S5EchtesBeispiel" component={Scene05EchtesBeispiel} durationInFrames={SCENE05_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S6Killer" component={Scene06Killer} durationInFrames={SCENE06_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S7GroessterFehler" component={Scene07GroessterFehler} durationInFrames={SCENE07_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S8WieVielReicht" component={Scene08WieVielReicht} durationInFrames={SCENE08_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S9RisikoEhrlich" component={Scene09RisikoEhrlich} durationInFrames={SCENE09_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S10ErsterSchritt" component={Scene10ErsterSchritt} durationInFrames={SCENE10_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S11PayoffCTA" component={Scene11PayoffCTA} durationInFrames={SCENE11_FRAMES} fps={FPS} {...WIDE} />

    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ThumbnailFlux" component={ThumbnailFlux} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ProfilePic1" component={ProfilePic1} durationInFrames={1} fps={FPS} width={1080} height={1080} />
    <Composition id="ProfilePic2" component={ProfilePic2} durationInFrames={1} fps={FPS} width={1080} height={1080} />
    <Composition id="ProfilePic3" component={ProfilePic3} durationInFrames={1} fps={FPS} width={1080} height={1080} />
    <Composition id="DisclaimerVertical" component={DisclaimerPreview} durationInFrames={300} fps={FPS} {...VERTICAL} />
    <Composition id="DisclaimerWide" component={DisclaimerPreview} durationInFrames={300} fps={FPS} {...WIDE} />
  </>
);
