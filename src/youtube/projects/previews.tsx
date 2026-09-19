// GENERIERT von scripts/youtube-preview-animations.ts — nicht von Hand bearbeiten.

import React from 'react';
import {Composition} from 'remotion';
import {YOUTUBE_FORMAT} from '../layout';
import {Preview20260921Bis20260927VersicherungenPreview, Preview20260921Bis20260927VersicherungenPreviewFrames, Preview20260921Bis20260927VersicherungenPreviewId} from './2026-09-21-bis-2026-09-27-versicherungen-preview';

export const YouTubePreviewCompositions: React.FC = () => (
  <>
    <Composition
      key={Preview20260921Bis20260927VersicherungenPreviewId}
      id={Preview20260921Bis20260927VersicherungenPreviewId}
      component={Preview20260921Bis20260927VersicherungenPreview}
      durationInFrames={Preview20260921Bis20260927VersicherungenPreviewFrames}
      fps={YOUTUBE_FORMAT.fps}
      width={YOUTUBE_FORMAT.width}
      height={YOUTUBE_FORMAT.height}
    />
  </>
);
