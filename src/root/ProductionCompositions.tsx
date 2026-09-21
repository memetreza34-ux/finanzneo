import React from 'react';
import {Composition} from 'remotion';
import {YouTubeProjectCompositions} from '../youtube/projects';
import {FORMAT} from '../brand/tokens';
import {KurseSchwankenReel} from '../reels/kurse-schwanken/KurseSchwankenReel';
import {FPS, TOTAL_FRAMES} from '../reels/kurse-schwanken/timeline';

/**
 * Veröffentlichbare Videos und exportierbare Kanal-Assets.
 *
 * YouTube-Longform-Projekte werden nicht von Hand eingetragen. Sie entstehen aus
 * `npm run youtube:phase3:build -- youtube/<Woche>/<Thema>`, das Szenen, Timeline
 * und Animationsbindungen aus den Projektdaten generiert und hier registriert.
 */
export const ProductionCompositions: React.FC = () => (
  <>
    <YouTubeProjectCompositions />

    <Composition
      id="KurseSchwankenReel"
      component={KurseSchwankenReel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      {...FORMAT.vertical}
    />
  </>
);
