import React from 'react';
import {AbsoluteFill,Sequence} from 'remotion';
import {FeesScene01Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-01/animation';
import {FeesScene02Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-02/animation';
import {FeesScene03Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-03/animation';
import {FeesScene04Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-04/animation';
import {FeesScene05Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-05/animation';
import {FeesScene06Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-06/animation';

export const FEES_30_YEARS_CUSTOM_REEL_FRAMES=1800;
const SCENE_FRAMES=300;

export const Fees30YearsCustomReelV1:React.FC=()=>(
  <AbsoluteFill style={{backgroundColor:'#000'}}>
    <Sequence from={0} durationInFrames={SCENE_FRAMES}><FeesScene01Animation/></Sequence>
    <Sequence from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES}><FeesScene02Animation/></Sequence>
    <Sequence from={SCENE_FRAMES*2} durationInFrames={SCENE_FRAMES}><FeesScene03Animation/></Sequence>
    <Sequence from={SCENE_FRAMES*3} durationInFrames={SCENE_FRAMES}><FeesScene04Animation/></Sequence>
    <Sequence from={SCENE_FRAMES*4} durationInFrames={SCENE_FRAMES}><FeesScene05Animation/></Sequence>
    <Sequence from={SCENE_FRAMES*5} durationInFrames={SCENE_FRAMES}><FeesScene06Animation/></Sequence>
  </AbsoluteFill>
);
