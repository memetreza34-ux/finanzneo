// GENERIERT von scripts/youtube-build-composition.ts — nicht von Hand bearbeiten.

import React from 'react';
import {Composition} from 'remotion';
import {YOUTUBE_FORMAT} from '../layout';
import {Video20260914Bis20260920Notgroschen, Video20260914Bis20260920NotgroschenFrames, Video20260914Bis20260920NotgroschenId} from './2026-09-14-bis-2026-09-20-notgroschen';

export const YouTubeProjectCompositions: React.FC = () => (
  <>
    <Composition
      key={Video20260914Bis20260920NotgroschenId}
      id={Video20260914Bis20260920NotgroschenId}
      component={Video20260914Bis20260920Notgroschen}
      durationInFrames={Video20260914Bis20260920NotgroschenFrames}
      fps={YOUTUBE_FORMAT.fps}
      width={YOUTUBE_FORMAT.width}
      height={YOUTUBE_FORMAT.height}
    />
  </>
);
