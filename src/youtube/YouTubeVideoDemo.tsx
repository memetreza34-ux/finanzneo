// End-to-End-Sichtprüfung der YouTube-Composition.
//
// Baut aus synthetischen Satzgrenzen eine echte Timeline und rendert sie durch
// YouTubeVideo: eine Bildszene, eine Animationsszene und ein Hybrid. Dient der
// Abnahme der Kette Timeline → Series → Layout, nicht der Produktion.

import React from 'react';
import {COLORS, PhysicalAccount, PhysicalBill, progressBetween, YouTubePhysicalStage} from './motion-kit';
import {buildYouTubeTimeline, type YouTubeSentence, type YouTubeVisual} from './timeline';
import {YouTubeVideo} from './YouTubeVideo';
import {useCurrentFrame, useVideoConfig} from 'remotion';

const SENTENCES: YouTubeSentence[] = [
  {start: 0, end: 3.4},
  {start: 3.4, end: 5.2},
  {start: 5.2, end: 11.0},
  {start: 11.0, end: 13.6},
];

const VISUALS: YouTubeVisual[] = [
  {
    id: 'visual-01',
    type: 'image',
    googleFlowFileName: 'YouTube Bild 01 - Probe.png',
    sentenceSpan: {from: 1, to: 1},
    headline: 'Waschmaschine kaputt',
    icon: 'warning',
    tone: 'warning',
    infoText: 'Beispielrechnung, keine Anlageberatung',
  },
  {
    id: 'visual-02',
    type: 'animation',
    animationExport: 'DemoTransfer',
    sentenceSpan: {from: 2, to: 3},
    headline: 'Reserve getrennt halten',
    icon: 'wallet',
  },
  {
    id: 'visual-03',
    type: 'hybrid',
    googleFlowFileName: 'YouTube Bild 01 - Probe.png',
    animationExport: 'DemoHighlight',
    sentenceSpan: {from: 4, to: 4},
    headline: 'Bezahlt aus der Reserve',
    icon: 'check',
    tone: 'positive',
  },
];

const DemoTransfer: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const move = progressBetween(frame, durationInFrames, 0.1, 0.7);
  return (
    <YouTubePhysicalStage>
      <PhysicalAccount x={250} y={470} label="Girokonto" balance="1.240 €" />
      <PhysicalBill x={810 + move * 140} y={500} amount="480 €" label="Reparatur" rotate={-5} />
      <PhysicalAccount x={1380} y={470} label="Notgroschen" balance="3.000 €" state="protected" />
    </YouTubePhysicalStage>
  );
};

const DemoHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const grow = progressBetween(frame, durationInFrames, 0.05, 0.5);
  return (
    <div style={{
      position: 'absolute',
      left: 620,
      top: 520,
      width: 400 * grow,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.green,
    }} />
  );
};

const TIMELINE = buildYouTubeTimeline(VISUALS, SENTENCES, 30);
export const YOUTUBE_VIDEO_DEMO_FRAMES = TIMELINE.durationInFrames;

export const YouTubeVideoDemo: React.FC = () => (
  <YouTubeVideo
    timeline={TIMELINE}
    assetBase="test"
    animations={{'visual-02': DemoTransfer, 'visual-03': DemoHighlight}}
  />
);
