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
  'coverImageFadeInForbidden',
  'coverImageEntranceTransitionForbidden',
  'blackLeadInForbidden',
  'frame0HeroImageRenderQaRequired',
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
check(Number(c.heroImageVisibleFromFrame) === 0, 'Hero-Bild muss ab Frame 0 sichtbar sein.');
check(Number(c.heroImageInitialOpacity) === 1, 'Hero-Bild muss bei Frame 0 bereits opacity 1 haben.');
check(c.exportedCoverSource === 'final-video-frame-0', 'Cover muss aus final-video-frame-0 exportiert werden.');

check(Number(index.cover?.heroImageVisibleFromFrame) === 0, 'cover.heroImageVisibleFromFrame muss 0 sein.');
check(Number(index.cover?.heroImageInitialOpacity) === 1, 'cover.heroImageInitialOpacity muss 1 sein.');
check(index.cover?.imageEntranceTransition === 'none', 'cover.imageEntranceTransition muss none sein.');
check(Number(index.transitionContract?.scene01ImageEnterFrames) === 0, 'transitionContract.scene01ImageEnterFrames muss 0 sein.');
check(index.transitionContract?.scene01ImageFadeInForbidden === true, 'scene01 Image-Fade-in muss verboten sein.');
check(index.transitionContract?.scene01BlackLeadInForbidden === true, 'scene01 schwarzer Vorlauf muss verboten sein.');

const first = Array.isArray(index.scenes) ? index.scenes[0] : null;
check(first?.id === 'scene-01' && first?.type === 'image', 'scene-01 muss eine Bildszene sein.');
check(first?.coverHook === true, 'scene-01.coverHook muss true sein.');
check(first?.captionEnabled === true, 'scene-01.captionEnabled muss true sein; Voiceover ohne Caption ist verboten.');
check(first?.captionsStartWithVoiceover === true, 'scene-01.captionsStartWithVoiceover muss true sein.');
check(first?.subtitleMode === 'sentence-with-audio-synced-active-word', 'scene-01 muss den normalen audio-synchronen Subtitle-Modus verwenden.');
check(first?.titleMode === 'reel-title-overlay', 'scene-01.titleMode muss reel-title-overlay sein.');
check(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt dem Reel-Titel entsprechen.');
check(Number(first?.imageVisibleFromFrame) === 0, 'scene-01.imageVisibleFromFrame muss 0 sein.');
check(Number(first?.imageInitialOpacity) === 1, 'scene-01.imageInitialOpacity muss 1 sein.');
check(first?.imageEnterMode === 'none', 'scene-01.imageEnterMode muss none sein.');

for (const relative of ['03-szenen/00-cover/cover.txt', first?.planFile, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/technische-hinweise.md', '05-projektdateien/cover-hook-qa.md']) {
  if (!relative) continue;
  const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);
  check(existsSync(path), `${relative} fehlt.`);
  if (existsSync(path)) check(readFileSync(path, 'utf8').includes(ID), `${relative} enthält den Cover-Hook-V3-Marker nicht.`);
}

const handoffPath = resolve(root, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md');
if (existsSync(handoffPath)) {
  const handoff = readFileSync(handoffPath, 'utf8');
  check(/FRAME 0.*vollständige.*Hero-Bild/i.test(handoff), 'Handoff muss das vollständige Hero-Bild bereits in Frame 0 verlangen.');
  check(/kein schwarzer Lead-in/i.test(handoff), 'Handoff muss schwarzen Cover-Vorlauf verbieten.');
  check(/kein Image-Fade-in/i.test(handoff), 'Handoff muss Cover-Bild-Fade-in verbieten.');
  check(/ersten gesprochenen Wort/i.test(handoff), 'Handoff muss Caption-Start beim ersten gesprochenen Wort festlegen.');
  check(/ohne Captions ist verboten/i.test(handoff), 'Handoff muss gesprochenes Audio ohne Captions verbieten.');
}

if (errors.length) {
  console.error('\nFuture-Cover-Hook-V3 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('\n✓ Future Cover Hook V3 erfüllt.');
console.log('✓ Frame 0 = vollständiges Hero-Bild + Titel; kein schwarzer Vorlauf und kein Cover-Bild-Fade-in.');
console.log('✓ Captions beginnen mit dem ersten gesprochenen Wort — auch in scene-01.');
