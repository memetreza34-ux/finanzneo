#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-cover-hook-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-cover-hook-v2';
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
  console.error('Cover-Hook V2 verlangt scene-01 als Bildszene.');
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
  subtitlesForbiddenDuringScene01: true,
  captionStartsFromSceneId: 'scene-02',
  imagePlusTitleOnly: true,
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
  captionEnabled: false,
  subtitleMode: 'off',
  titleMode: 'reel-title-overlay',
  titleVisibleFromFrame: 0,
  coverTitle: title,
} : scene);

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const appendOnce = (relativePath, marker, block) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(marker)) {
    source += '\n\n' + block.trim() + '\n';
    writeFileSync(path, source, 'utf8');
  }
};

const promptBlock = `FUTURE_COVER_HOOK: ${CONTRACT_ID}

COVER-HOOK V2 — NUR SZENE 01:
- Das generierte Flow-Bild enthält KEINEN Reel-Titel, KEINE Headline, KEINEN Untertitel und KEINEN CTA.
- Reserviere im oberen Bereich bewusst ruhige, tiefschwarze Negativfläche für den späteren exakten Remotion-Titel.
- Zeige EIN starkes, sofort verständliches Hero-Motiv mit klarer Alltagssituation, sichtbarem Konflikt oder sichtbarer Konsequenz.
- Kein Symbolrätsel, keine dekorative Objektansammlung, kein Katalog-Stillleben.
- Das Bild muss auch ohne Text innerhalb von unter einer Sekunde Interesse wecken.
- Der exakte Titel wird erst in Remotion ab Frame 0 gesetzt; deshalb keine KI-generierte Titeltypografie im Bild.`;

appendOnce('03-szenen/00-cover/cover.txt', `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);
if (typeof first.planFile === 'string') {
  appendOnce(first.planFile, `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);
}

const antigravityBlock = `COVER_HOOK_CONTRACT: ${CONTRACT_ID}

## Szene 01 — harter Render-Vertrag

- Szene 01 ist ein echtes Reel-Cover und zugleich der erste sichtbare Videoframe.
- Rendere den exakten Titel aus scene-index.title mit Remotion bereits bei Frame 0. Kein Fade-in, kein Intro davor, keine verzögerte Einblendung.
- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein. Untertitel beginnen erst mit scene-02.
- Szene 01 enthält nur Hero-Bild + Reel-Titel. Kein normales SceneHeader-Icon, keine zweite Textzeile als Erklärung, kein CTA, keine Zusatzkarte.
- Der Titel muss mindestens die ersten 30 Frames stabil lesbar sein und darf während scene-01 sichtbar bleiben.
- Das Flow-Bild selbst enthält den Titel NICHT; die exakte Typografie kommt aus Remotion.
- Implementiere die Caption-Sperre im tatsächlichen Composition-Code über die aktive Szene/Frame-Grenze, nicht nur über Metadaten.
- Playwright/Render-QA muss Frame 0 prüfen: Titel sichtbar, Bild sichtbar, keine Untertitel, kein Icon, keine Zusatztexte.
- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4. So ist das Cover exakt dieselbe sichtbare erste Szene inklusive Titel.`;

appendOnce('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, antigravityBlock);
appendOnce('05-projektdateien/technische-hinweise.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, antigravityBlock);

const qaPath = resolve(root, '05-projektdateien/cover-hook-qa.md');
if (!existsSync(qaPath)) {
  writeFileSync(qaPath, `# Cover Hook QA\n\nCOVER_HOOK_CONTRACT: ${CONTRACT_ID}\n\nFrame-0-Pflichtprüfung:\n- [ ] exakter Reel-Titel sichtbar\n- [ ] Hero-Bild sichtbar und verständlich\n- [ ] keine Untertitel / Captions\n- [ ] kein normales Header-Icon\n- [ ] keine Erklärung / CTA / Zusatzkarte\n- [ ] Titel nicht per Fade-in verzögert\n- [ ] Komposition funktioniert als eigenständiges Reel-Cover\n\nErst bei vollständigem PASS darf Phase 3 finalisieren.\n`, 'utf8');
}

console.log('✓ Future Cover Hook gesetzt: ' + CONTRACT_ID);
console.log('  Szene 01 = Hero-Bild + exakter Reel-Titel ab Frame 0 · keine Untertitel · Cover-Export aus finalem Frame 0.');
