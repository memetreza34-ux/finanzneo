import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {C} from '../../brand';
import {AnnualCostsAnimation} from './AnnualCostsAnimation';
import {DREI_KONTEN_DURATIONS, DREI_KONTEN_SYSTEM_FRAMES, SCENE_COPY} from './config';
import {FixedCostsMathAnimation} from './FixedCostsMathAnimation';
import {KaraokeCaptions} from './KaraokeCaptions';
import {SalarySplitAnimation} from './SalarySplitAnimation';
import {StillScene} from './shared';
import {WeeklyBudgetAnimation} from './WeeklyBudgetAnimation';

export {DREI_KONTEN_SCENE_TYPES, DREI_KONTEN_DURATIONS, DREI_KONTEN_SYSTEM_FRAMES} from './config';

type DreiKontenSystemProps = {audioSrc?: string};

const renderScene = (index: number, durationInFrames: number) => {
  switch (index) {
    case 0:
      return <StillScene sceneId="scene-01" copy={SCENE_COPY[0]} panX={2} imageScale={1.02} sourceCropTop={0.12} sourceCropBottom={0.17} durationInFrames={durationInFrames} />;
    case 1:
      return <StillScene sceneId="scene-02" copy={SCENE_COPY[1]} panX={-2} imageScale={1.02} sourceCropTop={0.14} sourceCropBottom={0.18} durationInFrames={durationInFrames} />;
    case 2:
      return <StillScene sceneId="scene-05" copy={SCENE_COPY[2]} panY={2} imageScale={1.03} sourceCropTop={0.09} sourceCropBottom={0.17} durationInFrames={durationInFrames} />;
    case 3:
      return <SalarySplitAnimation durationInFrames={durationInFrames} />;
    case 4:
      return <StillScene sceneId="scene-07" copy={SCENE_COPY[4]} panX={2} imageScale={1.04} sourceCropTop={0.06} sourceCropBottom={0.2} durationInFrames={durationInFrames} />;
    case 5:
      return <FixedCostsMathAnimation durationInFrames={durationInFrames} />;
    case 6:
      return <StillScene sceneId="scene-03" copy={SCENE_COPY[6]} panX={-2} imageScale={1.04} sourceCropTop={0.06} sourceCropBottom={0.19} durationInFrames={durationInFrames} />;
    case 7:
      return <AnnualCostsAnimation durationInFrames={durationInFrames} />;
    case 8:
      return <WeeklyBudgetAnimation durationInFrames={durationInFrames} />;
    case 9:
      return <StillScene sceneId="scene-10" copy={SCENE_COPY[9]} panY={1} imageScale={1.03} sourceCropTop={0.05} sourceCropBottom={0.18} durationInFrames={durationInFrames} />;
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
      <KaraokeCaptions />
    </AbsoluteFill>
  );
};
