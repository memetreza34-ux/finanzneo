import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {AnimationStage, Background, Captions, SceneHeader, SceneTransition, Vignette} from '../../brand';
import {normalizeCaptionData} from '../../lib/captions';
import {AUDIO_SRC, SCENES} from './timeline';
import {SceneImage} from './SceneImage';
import {ANIMATION_BY_SCENE} from './animations';
import wordTimingsRaw from './wordTimings.json';

const captionWords = normalizeCaptionData(wordTimingsRaw);

/**
 * Produktions-Composition: "100.000 € Einlagensicherung — pro Konto oder pro Bank?"
 * 15 Szenen, echte audio-basierte Startframes (siehe timeline.ts), 9 Bild- +
 * 6 native Remotion-Animationsszenen. Jede Szene trägt SceneHeader + Icon;
 * satzbasierte Karaoke-Captions laufen durchgehend über allen Szenen.
 */
export const EinlagensicherungReel: React.FC = () => (
  <AbsoluteFill style={{background: '#0A1A0F'}}>
    <Audio src={staticFile(AUDIO_SRC)} />

    <Series>
      {SCENES.map((scene) => {
        const AnimationComponent = ANIMATION_BY_SCENE[scene.id];

        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationFrames}>
            <SceneTransition durationFrames={scene.durationFrames}>
              <Background grid={false} glow />
              <Vignette />
              {scene.type === 'image' && scene.image ? (
                <SceneImage src={scene.image} durationFrames={scene.durationFrames} labels={scene.objectLabels} />
              ) : AnimationComponent ? (
                <AnimationStage>
                  <AnimationComponent durationFrames={scene.durationFrames} />
                </AnimationStage>
              ) : null}
              <SceneHeader title={scene.headline} icon={scene.icon} tone={scene.tone} at={0} />
            </SceneTransition>
          </Series.Sequence>
        );
      })}
    </Series>

    <Captions words={captionWords} />
  </AbsoluteFill>
);
