#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-cover-hook-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-cover-hook-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.coverHookContract;
if (!c) {
  console.log('✓ Reel ohne Future-Cover-Hook bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
assert(c.id === ID, 'coverHookContract.id muss ' + ID + ' sein.');
for (const key of [
  'titleRenderedByRemotion',
  'titleInGeneratedFlowImageForbidden',
  'titleVisibleWithinFirstSecond',
  'subtitlesForbiddenDuringScene01',
  'imagePlusTitleOnly',
  'standardSceneHeaderForbiddenDuringScene01',
  'coverIconForbidden',
  'secondaryTextForbidden',
  'noIntroBeforeTitle',
  'noFadeInDelay',
  'flowImageMustReserveTitleSafeSpace',
  'standaloneCoverRequired',
]) assert(c[key] === true, 'coverHookContract.' + key + ' muss true sein.');
assert(c.sourceSceneId === 'scene-01', 'Cover-Hook muss scene-01 verwenden.');
assert(c.captionStartsFromSceneId === 'scene-02', 'Untertitel müssen erst mit scene-02 beginnen.');
assert(Number(c.titleVisibleFromFrame) === 0, 'Titel muss ab Frame 0 sichtbar sein.');
assert(Number(c.titleHoldMinFrames) >= 30, 'Titel muss mindestens 30 Frames lesbar bleiben.');
assert(c.exportedCoverSource === 'final-video-frame-0', 'Future-Cover muss aus dem finalen Video-Frame 0 exportiert werden.');

const first = Array.isArray(index.scenes) ? index.scenes[0] : null;
assert(first?.id === 'scene-01' && first?.type === 'image', 'scene-01 muss eine Bildszene sein.');
assert(first?.coverHook === true, 'scene-01.coverHook muss true sein.');
assert(first?.captionEnabled === false, 'scene-01.captionEnabled muss false sein.');
assert(first?.subtitleMode === 'off', 'scene-01.subtitleMode muss off sein.');
assert(first?.titleMode === 'reel-title-overlay', 'scene-01.titleMode muss reel-title-overlay sein.');
assert(Number(first?.titleVisibleFromFrame) === 0, 'scene-01 Titel muss bei Frame 0 beginnen.');
assert(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt scene-index.title entsprechen.');

for (const relative of ['03-szenen/00-cover/cover.txt', first?.planFile, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/technische-hinweise.md', '05-projektdateien/cover-hook-qa.md']) {
  if (!relative) continue;
  const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);
  assert(existsSync(path), relative + ' fehlt.');
  if (existsSync(path)) {
    const source = readFileSync(path, 'utf8');
    assert(source.includes(ID), relative + ' enthält den Cover-Hook-V2-Marker nicht.');
  }
}

const handoffPath = resolve(root, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md');
if (existsSync(handoffPath)) {
  const handoff = readFileSync(handoffPath, 'utf8');
  assert(handoff.includes('Frame 0'), 'Antigravity-Handoff muss Frame 0 ausdrücklich festlegen.');
  assert(handoff.includes('KEINE Caption-/Subtitle-Komponente'), 'Antigravity-Handoff muss Captions in scene-01 technisch sperren.');
  assert(handoff.includes('Untertitel beginnen erst mit scene-02'), 'Antigravity-Handoff muss scene-02 als Caption-Start festlegen.');
  assert(handoff.includes('finale Export erzeugt cover.png aus Frame 0'), 'Antigravity-Handoff muss den gerenderten Frame-0-Coverexport festlegen.');
}

if (errors.length) {
  console.error('\nFuture-Cover-Hook verletzt:\n');
  errors.forEach((e) => console.error('- ' + e));
  process.exit(1);
}
console.log('\n✓ Future-Cover-Hook erfüllt: ' + ID);
console.log('✓ Frame 0 = Hero-Bild + exakter Reel-Titel · keine Untertitel · kein Standard-Header-Icon.');
console.log('✓ Cover-Export kommt aus dem geprüften finalen Video-Frame 0.');
