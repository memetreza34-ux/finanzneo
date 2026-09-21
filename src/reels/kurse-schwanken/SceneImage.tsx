import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {REEL_STYLE, VISUAL_BOTTOM, VISUAL_TOP, prog} from '../../brand';

/**
 * Bildszene: Das Nutzerbild bleibt vollständig sichtbar (`contain`), bekommt aber
 * eine ruhige durchgehende Ken-Burns-Bewegung über die ganze Beat-Dauer. Das Bild
 * selbst wird nicht verändert und nicht beschnitten.
 */
export const SceneImage: React.FC<{src: string; durationFrames: number}> = ({src, durationFrames}) => {
  const frame = useCurrentFrame();
  // Höchstens 1.04 Zusatzskalierung laut Bildpräsentations-Vertrag.
  const zoom = 1 + 0.04 * prog(frame, 0, durationFrames);
  const enter = prog(frame, 0, REEL_STYLE.transition.imageEnterFrames);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: VISUAL_TOP,
          height: VISUAL_BOTTOM - VISUAL_TOP,
          // Der freie Rand links/rechts muss schwarz bleiben: die Post-Render-QA
          // misst dort einen 48 px breiten Streifen. 80 px Abstand halten das
          // Bild sicher ausserhalb, auch mit der Ken-Burns-Skalierung.
          left: 80,
          right: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: enter,
        }}
      >
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${zoom})`}} />
      </div>
    </AbsoluteFill>
  );
};
