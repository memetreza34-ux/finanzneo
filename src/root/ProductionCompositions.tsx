import React from 'react';
import {YouTubeProjectCompositions} from '../youtube/projects';

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
  </>
);
