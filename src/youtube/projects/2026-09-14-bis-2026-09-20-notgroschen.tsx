// GENERIERT von scripts/youtube-build-composition.ts — nicht von Hand bearbeiten.
// Quelle: 2026-09-14_bis_2026-09-20/notgroschen
// Neu bauen: npm run youtube:phase3:build -- youtube/2026-09-14_bis_2026-09-20/notgroschen

import React from 'react';
import {YouTubeVideo} from '../YouTubeVideo';
import type {YouTubeTimeline} from '../timeline';
import timelineJson from './2026-09-14-bis-2026-09-20-notgroschen.timeline.json';
import {YouTubeVisual04Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-04/animation';
import {YouTubeVisual05Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-05/animation';
import {YouTubeVisual09Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-09/animation';
import {YouTubeVisual10Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-10/animation';
import {YouTubeVisual13Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-13/animation';
import {YouTubeVisual14Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-14/animation';
import {YouTubeVisual17Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-17/animation';
import {YouTubeVisual19Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-19/animation';
import {YouTubeVisual22Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-22/animation';
import {YouTubeVisual23Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-23/animation';
import {YouTubeVisual24Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-24/animation';
import {YouTubeVisual26Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-26/animation';
import {YouTubeVisual28Animation} from '../../../youtube/2026-09-14_bis_2026-09-20/notgroschen/04-projekt/VISUALS/visual-28/animation';

const timeline = timelineJson as YouTubeTimeline;

export const Video20260914Bis20260920NotgroschenFrames = timeline.durationInFrames;
export const Video20260914Bis20260920NotgroschenId = 'YouTube-2026-09-14-bis-2026-09-20-notgroschen';

export const Video20260914Bis20260920Notgroschen: React.FC = () => (
  <YouTubeVideo
    timeline={timeline}
    assetBase="youtube/2026-09-14_bis_2026-09-20/notgroschen"
    audioFileName="voiceover.wav"
    animations={{
  'visual-04': YouTubeVisual04Animation,
  'visual-05': YouTubeVisual05Animation,
  'visual-09': YouTubeVisual09Animation,
  'visual-10': YouTubeVisual10Animation,
  'visual-13': YouTubeVisual13Animation,
  'visual-14': YouTubeVisual14Animation,
  'visual-17': YouTubeVisual17Animation,
  'visual-19': YouTubeVisual19Animation,
  'visual-22': YouTubeVisual22Animation,
  'visual-23': YouTubeVisual23Animation,
  'visual-24': YouTubeVisual24Animation,
  'visual-26': YouTubeVisual26Animation,
  'visual-28': YouTubeVisual28Animation,
    }}
  />
);
