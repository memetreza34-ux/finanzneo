#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-cover-hook-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-cover-hook-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const first = scenes[0];
if (!first || first.id !== 'scene-01' || first.type !== 'image') {
  console.error('Cover-Hook V3 verlangt scene-01 als Bildszene.');
  process.exit(1);
}

const title = String(index.title ?? '').trim();
if (!title) {
  console.error('scene-index.title fehlt; Cover-Hook braucht den exakten Reel-Titel.');
  process.exit(1);
}

index.coverHookContract = {
  id: CONTRACT_ID,
  sourceSceneId: 'scene-01',
  titleSource: 'scene-index.title',
  titleRenderedByRemotion: true,
  titleInGeneratedFlowImageForbidden: true,
  titleVisibleFromFrame: 0,
  titleVisibleWithinFirstSecond: true,
  titleHoldMinFrames: 30,
  heroImageVisibleFromFrame: 0,
  heroImageInitialOpacity: 1,
  coverImageFadeInForbidden: true,
  coverImageEntranceTransitionForbidden: true,
  blackLeadInForbidden: true,
  frame0HeroImageRenderQaRequired: true,
  captionsFollowVoiceoverFromFirstSpokenWord: true,
  captionlessSpokenAudioForbidden: true,
  standardSceneHeaderForbiddenDuringScene01: true,
  coverIconForbidden: true,
  secondaryTextForbidden: true,
  noIntroBeforeTitle: true,
  noFadeInDelay: true,
  flowImageMustReserveTitleSafeSpace: true,
  standaloneCoverRequired: true,
  exportedCoverSource: 'final-video-frame-0',
};

index.cover = {
  ...(index.cover ?? {}),
  sourceSceneId: 'scene-01',
  sameAssetAsFirstScene: true,
  separateGenerationForbidden: true,
  renderedTitleOverlayRequired: true,
  heroImageVisibleFromFrame: 0,
  heroImageInitialOpacity: 1,
  imageEntranceTransition: 'none',
  finalExportSource: 'final-video-frame-0',
};

// Generic image scenes may keep their short entrance transition. The cover is
// a hard exception: frame 0 is already the finished cover composition.
index.transitionContract = {
  ...(index.transitionContract ?? {}),
  scene01ImageEnterFrames: 0,
  scene01ImageFadeInForbidden: true,
  scene01BlackLeadInForbidden: true,
};

index.scenes = scenes.map((scene, i) => i === 0 ? {
  ...scene,
  coverHook: true,
  captionEnabled: true,
  subtitleMode: 'sentence-with-audio-synced-active-word',
  captionsStartWithVoiceover: true,
  titleMode: 'reel-title-overlay',
  titleVisibleFromFrame: 0,
  coverTitle: title,
  imageVisibleFromFrame: 0,
  imageInitialOpacity: 1,
  imageEnterMode: 'none',
} : scene);

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const appendOnce = (relativePath, marker, block) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(marker)) {
    source += '\n\n' + block.trim() + '\n';
    writeFileSync(path, source, 'utf8');
  }
};

const promptBlock = `FUTURE_COVER_HOOK: ${CONTRACT_ID}

COVER-HOOK V3 — NUR SZENE 01:
- Das Flow-Bild enthält KEINEN Reel-Titel, KEINE Headline, KEINEN Untertitel und KEINEN CTA.
- Reserviere oben ruhige tiefschwarze Negativfläche für den exakten Remotion-Titel.
- Zeige EIN starkes, sofort verständliches Hero-Motiv mit realer Alltagssituation, Konflikt oder Konsequenz.
- FRAME 0 IST BEREITS DAS FERTIGE COVER: Hero-Bild sofort vollständig sichtbar + exakter Remotion-Titel. Kein schwarzer Vorlauf, kein Bild-Fade-in und keine Entrance-Transition für das Cover-Bild.
- Der exakte Titel wird ab Frame 0 in Remotion gerendert.
- Sobald das Voiceover spricht, laufen die normalen audio-synchronen Captions auch in scene-01. Es gibt keinen gesprochenen Abschnitt ohne Untertitel.`;

appendOnce('03-szenen/00-cover/cover.txt', `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);
if (typeof first.planFile === 'string') appendOnce(first.planFile, `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
const handoffPath = resolve(projectDir, 'ANTIGRAVITY-AUFTRAG.md');
if (!existsSync(handoffPath)) {
  writeFileSync(handoffPath, '# ANTIGRAVITY — PHASE 3\n\nFinale Nutzerbilder, Voiceover und echte Wort-Timings integrieren. Danach Preflight → Candidate → Render-QA → Export.\n', 'utf8');
}

const handoffBlock = `COVER_HOOK_CONTRACT: ${CONTRACT_ID}

## Szene 01 — harter Render-Vertrag
- FRAME 0 muss bereits das vollständige Hero-Bild in normaler Helligkeit/Deckkraft UND den exakten Reel-Titel zeigen.
- Für scene-01 die generische Bild-Einblendung ausdrücklich NICHT anwenden: opacity ab Frame 0 = 1, kein schwarzer Lead-in, kein Image-Fade-in, keine Entrance-Transition.
- Exakter Reel-Titel ist ab Frame 0 sichtbar; kein Intro/Fade davor.
- Kein normaler SceneHeader und kein Header-Icon in scene-01.
- Sobald das Voiceover ab dem ersten gesprochenen Wort startet, MUSS die globale Captions-Komponente sichtbar und wortgenau synchron sein — auch innerhalb scene-01.
- Gesprochenes Audio ohne Captions ist verboten. Eine captionlose Cover-Szene mit laufendem Voiceover ist ein harter FAIL.
- Das Flow-Bild selbst enthält weder Titel noch Untertitel.
- Der Coverexport kommt aus Frame 0 und muss deshalb bereits Bild + Titel enthalten.
- Render-QA prüft den visuellen Kern EXAKT bei Frame 0. Ein Titel auf schwarzem Hintergrund mit später eingeblendetem Hero-Bild ist ein harter FAIL.`;

appendOnce('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, handoffBlock);
appendOnce('05-projektdateien/technische-hinweise.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, handoffBlock);

writeFileSync(resolve(projectDir, 'cover-hook-qa.md'), `# Cover Hook QA\n\nCOVER_HOOK_CONTRACT: ${CONTRACT_ID}\n\n- [ ] Frame 0 zeigt bereits das vollständige Hero-Bild in normaler Deckkraft\n- [ ] kein schwarzer Vorlauf / kein Hero-Bild-Fade-in / keine Cover-Entrance-Transition\n- [ ] exakter Reel-Titel ab Frame 0 sichtbar\n- [ ] kein normales Header-Icon in scene-01\n- [ ] Captions starten mit dem ersten gesprochenen Wort\n- [ ] kein gesprochenes Audio ohne Captions\n- [ ] keine KI-generierte Titeltypografie im Flow-Bild\n- [ ] Coverexport aus finalem Frame 0\n`, 'utf8');

console.log('✓ Future Cover Hook gesetzt: ' + CONTRACT_ID);
console.log('✓ Frame 0 = vollständiges Hero-Bild + Titel; kein Cover-Bild-Fade-in.');
console.log('✓ Captions folgen dem Voiceover bereits in scene-01.');
