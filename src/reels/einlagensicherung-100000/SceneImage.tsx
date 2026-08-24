import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {REEL_STYLE, VISUAL_BOTTOM, VISUAL_TOP, prog} from '../../brand';

/**
 * Bildszene: Bild bleibt vollständig sichtbar (`contain`, kein Beschneiden von
 * Motiven/Labels), erhält aber eine dezente durchgehende Ken-Burns-Bewegung
 * über die gesamte Beat-Dauer. Das hält auch die längeren, an den echten
 * Satzgrenzen orientierten Bildbeats (> 6s) visuell lebendig, ohne neue
 * Bilder zu erzeugen oder das KI-Bild selbst zu verändern.
 */
export const SceneImage: React.FC<{
  src: string;
  durationFrames: number;
  labels?: string[];
}> = ({src, durationFrames}) => {
  const frame = useCurrentFrame();

  // Max. Zusatzskalierung 1.04 laut Bildpräsentations-Vertrag.
  const targetScale = 1.04;
  const zoom = 1 + (targetScale - 1) * prog(frame, 0, durationFrames);
  const enter = prog(frame, 0, REEL_STYLE.transition.imageEnterFrames);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: VISUAL_TOP,
          height: VISUAL_BOTTOM - VISUAL_TOP,
          left: 40,
          right: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: enter,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${zoom})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
