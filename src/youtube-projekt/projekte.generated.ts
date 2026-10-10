// GENERIERT von scripts/youtube-zusammenbau.mjs — nicht von Hand ändern.
import type React from 'react';
import type {YouTubeZeitplan} from './YouTubeVideo';

import zeitplan0 from '../../youtube/2026-10-09_abo-falle/_intern/06-projektdateien/timeline.json';
import {YouTubeVisual01Animation as P0_visual_01} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-01/animation';
import {YouTubeVisual03Animation as P0_visual_03} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-03/animation';
import {YouTubeVisual04Animation as P0_visual_04} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-04/animation';
import {YouTubeVisual07Animation as P0_visual_07} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-07/animation';
import {YouTubeVisual11Animation as P0_visual_11} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-11/animation';
import {YouTubeVisual17Animation as P0_visual_17} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-17/animation';
import {YouTubeVisual20Animation as P0_visual_20} from '../../youtube/2026-10-09_abo-falle/_intern/04-visuals/EINZELNE-VISUALS/visual-20/animation';

export const YOUTUBE_PROJEKTE: Array<{id: string; zeitplan: YouTubeZeitplan; animationen: Record<string, React.FC<{beats?: number[]}>>}> = [
  {id: 'YouTube-2026-10-09-abo-falle', zeitplan: zeitplan0 as unknown as YouTubeZeitplan, animationen: {'visual-01': P0_visual_01, 'visual-03': P0_visual_03, 'visual-04': P0_visual_04, 'visual-07': P0_visual_07, 'visual-11': P0_visual_11, 'visual-17': P0_visual_17, 'visual-20': P0_visual_20}},
];
