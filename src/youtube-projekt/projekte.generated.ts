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
import zeitplan1 from '../../youtube/2026-10-10_supermarkt-tricks/_intern/06-projektdateien/timeline.json';
import {YouTubeVisual02Animation as P1_visual_02} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-02/animation';
import {YouTubeVisual14Animation as P1_visual_14} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-14/animation';
import {YouTubeVisual22Animation as P1_visual_22} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-22/animation';
import {YouTubeVisual25Animation as P1_visual_25} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-25/animation';
import {YouTubeVisual32Animation as P1_visual_32} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-32/animation';
import {YouTubeVisual38Animation as P1_visual_38} from '../../youtube/2026-10-10_supermarkt-tricks/_intern/04-visuals/EINZELNE-VISUALS/visual-38/animation';

export const YOUTUBE_PROJEKTE: Array<{id: string; zeitplan: YouTubeZeitplan; animationen: Record<string, React.FC<{beats?: number[]}>>}> = [
  {id: 'YouTube-2026-10-09-abo-falle', zeitplan: zeitplan0 as unknown as YouTubeZeitplan, animationen: {'visual-01': P0_visual_01, 'visual-03': P0_visual_03, 'visual-04': P0_visual_04, 'visual-07': P0_visual_07, 'visual-11': P0_visual_11, 'visual-17': P0_visual_17, 'visual-20': P0_visual_20}},
  {id: 'YouTube-2026-10-10-supermarkt-tricks', zeitplan: zeitplan1 as unknown as YouTubeZeitplan, animationen: {'visual-02': P1_visual_02, 'visual-14': P1_visual_14, 'visual-22': P1_visual_22, 'visual-25': P1_visual_25, 'visual-32': P1_visual_32, 'visual-38': P1_visual_38}},
];
