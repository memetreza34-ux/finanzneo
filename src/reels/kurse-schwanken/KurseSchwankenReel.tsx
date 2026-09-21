import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {Captions, FinanceBackground, SceneHeader, SceneTransition} from '../../design-system';
import {normalizeCaptionData} from '../../lib/captions';
import {AUDIO_SRC, SCENES} from './timeline';
import {SceneImage} from './SceneImage';
import {ANIMATION_BY_SCENE} from './animations';
import wordTimingsRaw from '../../../reels/2026-09-21_bis_2026-09-27/montag/reel-01_kurse-schwanken/04-caption/word-timings.json';

const captionWords = normalizeCaptionData(wordTimingsRaw);

/**
 * Produktions-Composition: "Langfristig hoch, aber nie gerade".
 *
 * Acht Szenen aus drei Quellen: fünf Google-Flow-Bilder tragen die Alltagssituation,
 * zwei Datenszenen tragen die belegten Zahlen, eine Animation trägt die eine
 * Zustandsänderung, die ein Bild nicht zeigen könnte. Die Startframes stammen aus
 * den echten Wort-Timings; die Captions laufen durchgehend darüber.
 */
export const KurseSchwankenReel: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    <FinanceBackground />
    <Audio src={staticFile(AUDIO_SRC)} />

    <Series>
      {SCENES.map((scene) => {
        const AnimationComponent = ANIMATION_BY_SCENE[scene.id];

        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationFrames}>
            <SceneTransition durationFrames={scene.durationFrames}>
              {scene.type === 'image' && scene.image ? (
                <SceneImage src={scene.image} durationFrames={scene.durationFrames} />
              ) : AnimationComponent ? (
                <AnimationComponent durationFrames={scene.durationFrames} />
              ) : null}
              <SceneHeader title={scene.headline} icon={scene.icon} tone={scene.tone} at={0} />
            </SceneTransition>
          </Series.Sequence>
        );
      })}
    </Series>

    <Captions words={captionWords} background={false} />
  </AbsoluteFill>
);
