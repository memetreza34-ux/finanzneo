import React from 'react';
import {AbsoluteFill, Img, Series, staticFile} from 'remotion';
import {Captions, SceneHeader, type CaptionWord, type IconName} from '../brand';

export const FINANCE_IMAGE_SCENE_TEST_SCENE_FRAMES = 150;
export const FINANCE_IMAGE_SCENE_TEST_FRAMES = FINANCE_IMAGE_SCENE_TEST_SCENE_FRAMES * 3;

const makeCaptionWords = (text: string): CaptionWord[] => {
  const words = text.trim().split(/\s+/);
  const start = 0.25;
  const end = 4.55;
  const step = (end - start) / Math.max(1, words.length);

  return words.map((word, index) => ({
    word,
    start: start + step * index,
    end: start + step * (index + 0.84),
  }));
};

type PureImageSceneProps = {
  title: string;
  icon: IconName;
  image: string;
  caption: string;
};

const PureImageScene: React.FC<PureImageSceneProps> = ({title, icon, image, caption}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <SceneHeader title={title} icon={icon} />

    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: 355,
        height: 940,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Img
        src={staticFile(image)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>

    <Captions words={makeCaptionWords(caption)} />
  </AbsoluteFill>
);

const scenes: PureImageSceneProps[] = [
  {
    title: 'Notgroschen fängt Überraschungen ab',
    icon: 'wallet',
    image: 'experiments/image-world-consistency-v1/hybrid-test-v1/notgroschen-waschmaschine.webp',
    caption: 'Der Notgroschen bezahlt die unerwartete Reparatur, ohne dass dein Alltag sofort ins Minus rutscht.',
  },
  {
    title: 'Versicherung begrenzt große Schäden',
    icon: 'shield',
    image: 'experiments/image-world-consistency-v1/hybrid-test-v1/wasserschaden.webp',
    caption: 'Beim Wasserschaden zeigt das Bild direkt das Problem und die finanzielle Absicherung daneben.',
  },
  {
    title: 'Ein ETF verteilt dein Risiko',
    icon: 'chart-up',
    image: 'experiments/image-world-consistency-v1/hybrid-test-v1/etf-diversifikation.webp',
    caption: 'Statt nur auf ein Unternehmen zu setzen, verteilt ein ETF dein Geld auf viele Bereiche.',
  },
];

export const FinanceImageSceneTest: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Series>
      {scenes.map((scene) => (
        <Series.Sequence key={scene.title} durationInFrames={FINANCE_IMAGE_SCENE_TEST_SCENE_FRAMES}>
          <PureImageScene {...scene} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
