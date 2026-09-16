// FinanzNeo YouTube Longform — die Composition, die ein Projekt rendert.
//
// Aufbau wie beim Reel-Template: eine deklarative Szenenliste, eine Series mit
// einer Sequence je Szene und ein Binding-Map für die versiegelten Phase-1-
// Animationen. Fehlt ein Binding, bricht der Render hart ab — kein CTA-, Text-
// oder Schwarzbild-Ersatz.

import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile, useCurrentFrame} from 'remotion';
import {YOUTUBE_STYLE} from './layout';
import {missingYouTubeBindings, missingYouTubeImages, type YouTubeScene, type YouTubeTimeline} from './timeline';
import {
  YouTubeAnimationFrame,
  YouTubeHeader,
  YouTubeImage,
  YouTubeInfoText,
  YouTubeStage,
} from './components';
import type {IconName} from '../brand/components/Icon';

export type YouTubeAnimationMap = Record<string, React.ComponentType>;

export type YouTubeVideoProps = {
  timeline: YouTubeTimeline;
  /** Ordner unter public/, z. B. 'youtube/notgroschen'. */
  assetBase: string;
  audioFileName?: string;
  animations?: YouTubeAnimationMap;
};

const {continuityFrames: CONTINUITY} = YOUTUBE_STYLE.transition;

/**
 * Weicher Szenenwechsel ohne Schwarzblende.
 *
 * Der Standard verbietet `fadeToBlackForbidden`, weil ein schwarzes Zwischenbild
 * auf einer schwarzen Welt wie ein Aussetzer wirkt. Stattdessen überlappen die
 * Szenen minimal in Deckkraft und Versatz.
 */
const SceneContinuity: React.FC<{durationInFrames: number; children: React.ReactNode}> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = Math.min(1, Math.max(0, frame / CONTINUITY));
  const leave = Math.min(1, Math.max(0, (frame - (durationInFrames - CONTINUITY)) / CONTINUITY));
  const opacity = Math.min(1, 0.94 + enter * 0.06 - leave * 0.04);

  return (
    <AbsoluteFill style={{opacity, transform: `translateY(${(1 - enter) * 3 - leave * 2}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{
  scene: YouTubeScene;
  assetBase: string;
  animations?: YouTubeAnimationMap;
}> = ({scene, assetBase, animations}) => {
  const needsImage = scene.type === 'image';
  const needsAnimation = scene.type !== 'image';

  let Animation: React.ComponentType | undefined;
  if (needsAnimation) {
    if (!scene.animationId) {
      throw new Error(`FEHLENDE ANIMATION: ${scene.id} (${scene.type}) hat keine animationId. Render wird abgebrochen.`);
    }
    Animation = animations?.[scene.animationId];
    if (!Animation) {
      throw new Error(`FEHLENDES BINDING: ${scene.id} erwartet animations["${scene.animationId}"]. Render wird abgebrochen.`);
    }
  }

  if (needsImage && !scene.imageFileName) {
    throw new Error(`FEHLENDES BILD: ${scene.id} (${scene.type}) hat keinen googleFlowFileName. Render wird abgebrochen.`);
  }

  return (
    <YouTubeStage>
      {scene.headline ? <YouTubeHeader title={scene.headline} icon={(scene.icon ?? 'euro') as IconName} tone={scene.tone} /> : null}

      {needsImage && scene.imageFileName ? (
        <YouTubeImage src={staticFile(`${assetBase}/images/${scene.imageFileName}`)} />
      ) : null}

      {Animation ? (
        <YouTubeAnimationFrame>
          <Animation />
        </YouTubeAnimationFrame>
      ) : null}

      {scene.infoText ? <YouTubeInfoText>{scene.infoText}</YouTubeInfoText> : null}
    </YouTubeStage>
  );
};

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  timeline,
  assetBase,
  audioFileName,
  animations,
}) => {
  const missing = [
    ...missingYouTubeBindings(timeline, Object.keys(animations ?? {})),
    ...missingYouTubeImages(timeline),
  ];
  if (missing.length > 0) {
    throw new Error(`YouTube-Render abgebrochen. Fehlende Bindungen oder Assets:\n- ${missing.join('\n- ')}`);
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      {audioFileName ? <Audio src={staticFile(`${assetBase}/audio/${audioFileName}`)} /> : null}
      <Series>
        {timeline.scenes.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneContinuity durationInFrames={scene.durationInFrames}>
              <SceneView scene={scene} assetBase={assetBase} animations={animations} />
            </SceneContinuity>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
