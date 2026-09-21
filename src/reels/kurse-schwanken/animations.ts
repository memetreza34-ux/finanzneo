import type React from 'react';
// Die kanonischen Phase-1-Quellen liegen im Reel-Ordner und sind versiegelt.
// Phase 3 bindet sie hier unverändert ein und ersetzt nichts.
import {Scene03Animation} from '../../../reels/2026-09-21_bis_2026-09-27/montag/reel-01_kurse-schwanken/03-szenen/EINZELNE-SZENEN/scene-03/animation';
import {Scene05Animation} from '../../../reels/2026-09-21_bis_2026-09-27/montag/reel-01_kurse-schwanken/03-szenen/EINZELNE-SZENEN/scene-05/animation';
import {Scene06Animation} from '../../../reels/2026-09-21_bis_2026-09-27/montag/reel-01_kurse-schwanken/03-szenen/EINZELNE-SZENEN/scene-06/animation';

export type AnimationComponent = React.FC<{durationFrames?: number}>;

export const ANIMATION_BY_SCENE: Record<string, AnimationComponent> = {
  'scene-03': Scene03Animation,
  'scene-05': Scene05Animation,
  'scene-06': Scene06Animation,
};
