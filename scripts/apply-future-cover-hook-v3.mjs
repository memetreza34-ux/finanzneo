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
  finalExportSource: 'final-video-frame-0',
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
- Der exakte Titel wird ab Frame 0 in Remotion gerendert.
- WICHTIG: Sobald das Voiceover spricht, laufen die normalen audio-synchronen Captions auch in scene-01. Es gibt keinen gesprochenen Abschnitt ohne Untertitel.`;

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
- Exakter Reel-Titel ist ab Frame 0 sichtbar; kein Intro/Fade davor.
- Kein normaler SceneHeader und kein Header-Icon in scene-01.
- Sobald das Voiceover ab dem ersten gesprochenen Wort startet, MUSS die globale Captions-Komponente sichtbar und wortgenau synchron sein — auch innerhalb scene-01.
- Gesprochenes Audio ohne Captions ist verboten. Eine 5–6 Sekunden lange captionlose Cover-Szene ist ein harter FAIL.
- Das Flow-Bild selbst enthält weder Titel noch Untertitel.
- Frame-0-Coverexport bleibt erlaubt; Captions erscheinen nur, wenn bei Frame 0 bereits ein Wort gesprochen wird.
- Render-QA prüft Titel, Hero-Bild und Caption-Kontinuität ab dem ersten gesprochenen Wort.`;

appendOnce('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, handoffBlock);
appendOnce('05-projektdateien/technische-hinweise.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, handoffBlock);

writeFileSync(resolve(projectDir, 'cover-hook-qa.md'), `# Cover Hook QA\n\nCOVER_HOOK_CONTRACT: ${CONTRACT_ID}\n\n- [ ] exakter Reel-Titel ab Frame 0 sichtbar\n- [ ] Hero-Bild sichtbar\n- [ ] kein normales Header-Icon in scene-01\n- [ ] Captions starten mit dem ersten gesprochenen Wort\n- [ ] kein gesprochenes Audio ohne Captions\n- [ ] keine KI-generierte Titeltypografie im Flow-Bild\n- [ ] Coverexport aus finalem Frame 0\n`, 'utf8');

console.log('✓ Future Cover Hook gesetzt: ' + CONTRACT_ID);
console.log('✓ Cover-Titel ab Frame 0; Captions folgen dem Voiceover bereits in scene-01.');
