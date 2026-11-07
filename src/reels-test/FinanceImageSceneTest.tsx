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

// Layout-Test für reine Bildszenen. Nutzt eingecheckte Bilder des Einlagensicherungs-Reels; die
// früheren Testbilder unter public/experiments/ wurden am 07.10.2026 als ausgemusterte Bildwelt gelöscht.
const scenes: PureImageSceneProps[] = [
  {
    title: 'Das zählt als Einlage',
    icon: 'list',
    image: 'reels/einlagensicherung-100000/images/scene-03.png',
    caption: 'Girokonto, Tagesgeld und Festgeld zählen als Einlage und sind bis 100.000 Euro pro Bank geschützt.',
  },
  {
    title: 'Jede Bank schützt separat',
    icon: 'lock',
    image: 'reels/einlagensicherung-100000/images/scene-07.png',
    caption: 'Hast du Geld bei zwei verschiedenen Banken, gilt der Schutz für jede Bank einzeln.',
  },
  {
    title: 'Sonderfall: bis 500.000 € möglich',
    icon: 'euro',
    image: 'reels/einlagensicherung-100000/images/scene-11.png',
    caption: 'Nach einem Hausverkauf kann ein hoher Betrag kurzzeitig zusätzlich geschützt sein.',
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
