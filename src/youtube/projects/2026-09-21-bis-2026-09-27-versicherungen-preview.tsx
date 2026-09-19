// GENERIERT von scripts/youtube-preview-animations.ts — nicht von Hand bearbeiten.
// Quelle: 2026-09-21_bis_2026-09-27/versicherungen
// Neu bauen: npm run youtube:phase1:preview -- youtube/2026-09-21_bis_2026-09-27/versicherungen
//
// Vorschau mit Platzhalterzeiten, kein Schnitt. Jede Szene läuft gleich lang,
// damit die Mechanik sichtbar wird, bevor es echte Wortzeiten gibt.

import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {YouTubeAnimationFrame, YouTubeStage} from '../components';
import {YouTubeVisual02Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-02/animation';
import {YouTubeVisual05Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-05/animation';
import {YouTubeVisual07Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-07/animation';
import {YouTubeVisual11Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-11/animation';
import {YouTubeVisual13Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-13/animation';
import {YouTubeVisual14Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-14/animation';
import {YouTubeVisual18Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-18/animation';
import {YouTubeVisual19Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-19/animation';
import {YouTubeVisual20Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-20/animation';
import {YouTubeVisual24Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-24/animation';
import {YouTubeVisual27Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-27/animation';
import {YouTubeVisual28Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-28/animation';
import {YouTubeVisual30Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-30/animation';
import {YouTubeVisual31Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-31/animation';
import {YouTubeVisual32Animation} from '../../../youtube/2026-09-21_bis_2026-09-27/versicherungen/04-projekt/VISUALS/visual-32/animation';

const FRAMES_PER_SCENE = 210;

const SCENES = [
  {id: 'visual-02', caption: 'visual-02 · animation · Das Handy ja, du nicht', mechanic: 'policy-sheets-cover-objects', Component: YouTubeVisual02Animation},
  {id: 'visual-05', caption: 'visual-05 · animation · Die Liste hört nie auf', mechanic: 'endless-item-pile', Component: YouTubeVisual05Animation},
  {id: 'visual-07', caption: 'visual-07 · animation · Wofür eine Police da ist', mechanic: 'small-bounces-large-caught', Component: YouTubeVisual07Animation},
  {id: 'visual-11', caption: 'visual-11 · animation · Haftung ohne Obergrenze', mechanic: 'liability-counter-without-ceiling', Component: YouTubeVisual11Animation},
  {id: 'visual-13', caption: 'visual-13 · data · Wie hoch die Deckung sein sollte', mechanic: 'coverage-levels-compared', Component: YouTubeVisual13Animation},
  {id: 'visual-14', caption: 'visual-14 · animation · Nicht der wahrscheinliche Fall', mechanic: 'worst-case-not-likely-case', Component: YouTubeVisual14Animation},
  {id: 'visual-18', caption: 'visual-18 · data · Rund 400 Euro im Monat', mechanic: 'pension-below-the-line', Component: YouTubeVisual18Animation},
  {id: 'visual-19', caption: 'visual-19 · animation · Die Lücke jeden Monat', mechanic: 'income-drops-to-remainder', Component: YouTubeVisual19Animation},
  {id: 'visual-20', caption: 'visual-20 · animation · Was ein Arbeitsleben wert ist', mechanic: 'working-life-adds-up', Component: YouTubeVisual20Animation},
  {id: 'visual-24', caption: 'visual-24 · animation · Könntest du alles neu kaufen?', mechanic: 'replace-the-whole-room', Component: YouTubeVisual24Animation},
  {id: 'visual-27', caption: 'visual-27 · animation · Doppelt abgesichert', mechanic: 'double-cover-same-damage', Component: YouTubeVisual27Animation},
  {id: 'visual-28', caption: 'visual-28 · data · Was sich da summiert', mechanic: 'small-premiums-add-up', Component: YouTubeVisual28Animation},
  {id: 'visual-30', caption: 'visual-30 · animation · Dann kommt der Rest', mechanic: 'three-policies-in-order', Component: YouTubeVisual30Animation},
  {id: 'visual-31', caption: 'visual-31 · animation · Zwei Größen, eine Aufgabe', mechanic: 'reserve-and-policy-same-job', Component: YouTubeVisual31Animation},
  {id: 'visual-32', caption: 'visual-32 · animation · Was wohin gehört', mechanic: 'damages-sorted-by-size', Component: YouTubeVisual32Animation},
];

export const Preview20260921Bis20260927VersicherungenPreviewFrames = SCENES.length * FRAMES_PER_SCENE;
export const Preview20260921Bis20260927VersicherungenPreviewId = 'YouTubePreview-2026-09-21-bis-2026-09-27-versicherungen-preview';

export const Preview20260921Bis20260927VersicherungenPreview: React.FC = () => (
  <YouTubeStage>
    {SCENES.map((scene, index) => (
      <Sequence key={scene.id} from={index * FRAMES_PER_SCENE} durationInFrames={FRAMES_PER_SCENE}>
        <AbsoluteFill>
          <div style={{
            position: 'absolute', left: 60, top: 54, fontSize: 34, fontWeight: 900,
            color: '#F7F7F2', fontFamily: 'Arial, Helvetica, sans-serif',
          }}>{scene.caption}</div>
          <div style={{
            position: 'absolute', left: 60, top: 100, fontSize: 24, fontWeight: 700,
            color: '#8A9299', fontFamily: 'Arial, Helvetica, sans-serif',
          }}>{scene.mechanic}</div>
          <YouTubeAnimationFrame>
            <scene.Component />
          </YouTubeAnimationFrame>
        </AbsoluteFill>
      </Sequence>
    ))}
  </YouTubeStage>
);
