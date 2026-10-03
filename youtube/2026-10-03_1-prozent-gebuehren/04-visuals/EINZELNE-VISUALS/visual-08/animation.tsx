import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'cost-line-focus-scan-v1';
export const VISUAL_TECHNIQUE_ID = 'css-magnifier-scan-overlay-v1';
export const COMPOSITION_FAMILY_ID = 'document-motion';

export const ANIMATION_NARRATIVE = {
  START: 'Ein ruhiges Kosten-Dokument liegt vollständig sichtbar im Hintergrund.',
  MECHANISM: 'Ein heller Fokusrahmen fährt über mehrere Zeilen und bleibt auf der Kostenzeile stehen.',
  RESULT: 'Die relevante Kostenangabe wird klar hervorgehoben und als Prüfpunkt verankert.',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [0, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lock = interpolate(frame, [90, 125], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(scan, [0, 1], [220, 590]);
  const width = interpolate(lock, [0, 1], [620, 820]);

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          left: 550,
          top: y,
          width,
          height: 118,
          border: '6px solid #1ED79B',
          borderRadius: 26,
          boxShadow: '0 0 0 10px rgba(30,215,155,0.10), 0 24px 80px rgba(30,215,155,0.24)',
          transform: `translateX(${-100 * lock}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 660,
          top: 760,
          padding: '18px 30px',
          borderRadius: 22,
          backgroundColor: 'rgba(0,0,0,0.82)',
          color: '#F4F1E8',
          fontSize: 34,
          fontWeight: 800,
          opacity: lock,
        }}
      >
        Kosten vergleichen
      </div>
    </AbsoluteFill>
  );
};
