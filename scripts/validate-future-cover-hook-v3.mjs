#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-cover-hook-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-cover-hook-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.coverHookContract;
if (!c || c.id !== ID) {
  console.log('✓ Reel ohne Cover-Hook-V3 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
for (const key of [
  'titleRenderedByRemotion',
  'titleInGeneratedFlowImageForbidden',
  'titleVisibleWithinFirstSecond',
  'captionsFollowVoiceoverFromFirstSpokenWord',
  'captionlessSpokenAudioForbidden',
  'standardSceneHeaderForbiddenDuringScene01',
  'coverIconForbidden',
  'secondaryTextForbidden',
  'noIntroBeforeTitle',
  'noFadeInDelay',
  'flowImageMustReserveTitleSafeSpace',
  'standaloneCoverRequired',
]) check(c[key] === true, `coverHookContract.${key} muss true sein.`);
check(c.sourceSceneId === 'scene-01', 'Cover-Hook V3 muss scene-01 verwenden.');
check(Number(c.titleVisibleFromFrame) === 0, 'Titel muss ab Frame 0 sichtbar sein.');
check(Number(c.titleHoldMinFrames) >= 30, 'Titel muss mindestens 30 Frames lesbar bleiben.');
check(c.exportedCoverSource === 'final-video-frame-0', 'Cover muss aus final-video-frame-0 exportiert werden.');

const first = Array.isArray(index.scenes) ? index.scenes[0] : null;
check(first?.id === 'scene-01' && first?.type === 'image', 'scene-01 muss eine Bildszene sein.');
check(first?.coverHook === true, 'scene-01.coverHook muss true sein.');
check(first?.captionEnabled === true, 'scene-01.captionEnabled muss true sein; Voiceover ohne Caption ist verboten.');
check(first?.captionsStartWithVoiceover === true, 'scene-01.captionsStartWithVoiceover muss true sein.');
check(first?.subtitleMode === 'sentence-with-audio-synced-active-word', 'scene-01 muss den normalen audio-synchronen Subtitle-Modus verwenden.');
check(first?.titleMode === 'reel-title-overlay', 'scene-01.titleMode muss reel-title-overlay sein.');
check(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt dem Reel-Titel entsprechen.');

for (const relative of ['03-szenen/00-cover/cover.txt', first?.planFile, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/technische-hinweise.md', '05-projektdateien/cover-hook-qa.md']) {
  if (!relative) continue;
  const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);
  check(existsSync(path), `${relative} fehlt.`);
  if (existsSync(path)) check(readFileSync(path, 'utf8').includes(ID), `${relative} enthält den Cover-Hook-V3-Marker nicht.`);
}

const handoffPath = resolve(root, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md');
if (existsSync(handoffPath)) {
  const handoff = readFileSync(handoffPath, 'utf8');
  check(/ersten gesprochenen Wort/i.test(handoff), 'Handoff muss Caption-Start beim ersten gesprochenen Wort festlegen.');
  check(/ohne Captions ist verboten/i.test(handoff), 'Handoff muss gesprochenes Audio ohne Captions verbieten.');
}

if (errors.length) {
  console.error('\nFuture-Cover-Hook-V3 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('\n✓ Future Cover Hook V3 erfüllt.');
console.log('✓ Titel ab Frame 0; Captions beginnen mit dem ersten gesprochenen Wort — auch in scene-01.');
