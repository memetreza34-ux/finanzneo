import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {C} from '../../brand';
import {AnnualCostsAnimation} from './AnnualCostsAnimation';
import {DREI_KONTEN_DURATIONS, DREI_KONTEN_SYSTEM_FRAMES, SCENE_COPY} from './config';
import {FixedCostsMathAnimation} from './FixedCostsMathAnimation';
import {SalarySplitAnimation} from './SalarySplitAnimation';
import {StillScene} from './shared';
import {WeeklyBudgetAnimation} from './WeeklyBudgetAnimation';

export {DREI_KONTEN_SCENE_TYPES, DREI_KONTEN_DURATIONS, DREI_KONTEN_SYSTEM_FRAMES} from './config';

type DreiKontenSystemProps = {audioSrc?: string};

const renderScene = (index: number, durationInFrames: number) => {
  switch (index) {
    case 0:
      return <StillScene sceneId="scene-01" kicker={SCENE_COPY[0].kicker} caption={SCENE_COPY[0].caption} panX={10} durationInFrames={durationInFrames} />;
    case 1:
      return <StillScene sceneId="scene-02" kicker={SCENE_COPY[1].kicker} caption={SCENE_COPY[1].caption} panX={-10} durationInFrames={durationInFrames} />;
    case 2:
      return <StillScene sceneId="scene-03" kicker={SCENE_COPY[2].kicker} caption={SCENE_COPY[2].caption} panY={10} durationInFrames={durationInFrames} />;
    case 3:
      return <SalarySplitAnimation durationInFrames={durationInFrames} />;
    case 4:
      return <StillScene sceneId="scene-05" kicker={SCENE_COPY[4].kicker} caption={SCENE_COPY[4].caption} panX={8} durationInFrames={durationInFrames} />;
    case 5:
      return <FixedCostsMathAnimation durationInFrames={durationInFrames} />;
    case 6:
      return <StillScene sceneId="scene-07" kicker={SCENE_COPY[6].kicker} caption={SCENE_COPY[6].caption} panX={-8} durationInFrames={durationInFrames} />;
    case 7:
      return <AnnualCostsAnimation durationInFrames={durationInFrames} />;
    case 8:
      return <WeeklyBudgetAnimation durationInFrames={durationInFrames} />;
    case 9:
      return <StillScene sceneId="scene-10" kicker={SCENE_COPY[9].kicker} caption={SCENE_COPY[9].caption} panY={8} durationInFrames={durationInFrames} />;
    default:
      return null;
  }
};

export const DreiKontenSystem: React.FC<DreiKontenSystemProps> = ({audioSrc}) => {
  let from = 0;

  return (
    <AbsoluteFill style={{background: C.bg}}>
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
      {DREI_KONTEN_DURATIONS.map((durationInFrames, index) => {
        const start = from;
        from += durationInFrames;

        return (
          <Sequence key={`scene-${index + 1}`} from={start} durationInFrames={durationInFrames}>
            {renderScene(index, durationInFrames)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
