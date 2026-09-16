// Sichtprüfung für das YouTube-Layout V1.
//
// Zeigt die drei Bahnen mit echtem Inhalt: Zwischenüberschrift oben, Visual auf
// drei Vierteln der Breite, optionaler Infotext unten. Dient der visuellen
// Abnahme des Layouts, nicht der Produktion.

import React from 'react';
import {staticFile} from 'remotion';
import {COLORS, PhysicalAccount, PhysicalBill, progressBetween} from './motion-kit';
import {YOUTUBE_STYLE} from './layout';
import {
  YouTubeAnimationFrame,
  YouTubeHeader,
  YouTubeImage,
  YouTubeInfoText,
  YouTubePhysicalStage,
  YouTubeStage,
} from './components';
import {useCurrentFrame} from 'remotion';

export const YOUTUBE_LAYOUT_DEMO_FRAMES = 150;

export const YouTubeLayoutDemo: React.FC<{showImage?: boolean; outline?: boolean}> = ({
  showImage = false,
  outline = false,
}) => {
  const frame = useCurrentFrame();
  const move = progressBetween(frame, YOUTUBE_LAYOUT_DEMO_FRAMES, 0.15, 0.6);
  const {visual} = YOUTUBE_STYLE;

  return (
    <YouTubeStage>
      <YouTubeHeader title="Reserve getrennt halten" icon="wallet" />

      {showImage ? (
        <YouTubeImage src={staticFile('test/youtube-layout-probe.png')} />
      ) : (
        <YouTubeAnimationFrame>
          <YouTubePhysicalStage>
            <PhysicalAccount x={250} y={470} label="Girokonto" balance="1.240 €" />
            <PhysicalBill x={810 + move * 120} y={500} amount="480 €" label="Reparatur" rotate={-5} />
            <PhysicalAccount x={1380} y={470} label="Notgroschen" balance="3.000 €" state="protected" />
          </YouTubePhysicalStage>
        </YouTubeAnimationFrame>
      )}

      {/* Umriss der Bildzone, damit bei der Abnahme sichtbar ist, wo das Bild sitzt. */}
      {outline ? (
        <div style={{
          position: 'absolute',
          left: visual.left,
          top: visual.top,
          width: visual.width,
          height: visual.height,
          border: `2px dashed ${COLORS.line}`,
        }} />
      ) : null}

      <YouTubeInfoText>Beispielrechnung, keine Anlageberatung</YouTubeInfoText>
    </YouTubeStage>
  );
};
