import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FullFrameImage, FullFrameReadabilityScrim} from '../../design-system';
import {C} from '../../brand';
import assetManifest from './asset-manifest.json';
import {ZINSESZINS_COPY, ZINSESZINS_DURATIONS, ZINSESZINS_TOTAL_FRAMES} from './config';
import {ZinseszinsKaraokeCaptions} from './KaraokeCaptions';
import {Headline} from './shared';
import {
  AssumptionAnimation, EqualContributionAnimation, RealityCheckAnimation, TimeAdvantageComparison,
  SmallRateLongTimeAnimation, HighRateShortTimeAnimation
} from './animations';

export {ZINSESZINS_TOTAL_FRAMES};
type ImageSceneId = 'scene-01' | 'scene-03' | 'scene-08' | 'scene-10';

const StillScene: React.FC<{sceneId: ImageSceneId; index: number}> = ({sceneId, index}) => {
  const src = (assetManifest as Record<string, string | null>)[sceneId];
  if (!src) throw new Error(`BLOCKED: Pflichtbild für ${sceneId} fehlt im synchronisierten Ziel-Reel-Asset-Manifest.`);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <FullFrameImage src={staticFile(src)} />
      <FullFrameReadabilityScrim />
      <Headline copy={ZINSESZINS_COPY[index]} />
    </AbsoluteFill>
  );
};

const scene = (index: number, duration: number) => {
  switch (index) {
    case 0: return <StillScene sceneId="scene-01" index={0} />;
    case 1: return <EqualContributionAnimation durationInFrames={duration} />;
    case 2: return <StillScene sceneId="scene-03" index={2} />;
    case 3: return <AssumptionAnimation durationInFrames={duration} />;
    case 4: return <SmallRateLongTimeAnimation durationInFrames={duration} />;
    case 5: return <HighRateShortTimeAnimation durationInFrames={duration} />;
    case 6: return <TimeAdvantageComparison durationInFrames={duration} />;
    case 7: return <StillScene sceneId="scene-08" index={7} />;
    case 8: return <RealityCheckAnimation durationInFrames={duration} />;
    case 9: return <StillScene sceneId="scene-10" index={9} />;
    default: return null;
  }
};

export const ZinseszinsZeit: React.FC = () => {
  let from = 0;
  const audio = (assetManifest as {audio: string | null}).audio;
  if (!audio) throw new Error('BLOCKED: Finales Voiceover fehlt im synchronisierten Ziel-Reel-Asset-Manifest.');

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile(audio)} volume={1} />
      {ZINSESZINS_DURATIONS.map((duration, index) => {
        const start = from;
        from += duration;
        return (
          <Sequence key={index} from={start} durationInFrames={duration}>
            {scene(index, duration)}
          </Sequence>
        );
      })}
      <ZinseszinsKaraokeCaptions />
    </AbsoluteFill>
  );
};
