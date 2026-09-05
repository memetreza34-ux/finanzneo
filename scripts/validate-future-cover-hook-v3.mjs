#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-cover-hook-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-cover-hook-v3';
const LEGACY_ID = 'finanzneo-cover-hook-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.coverHookContract;
if (!c || c.id === LEGACY_ID) {
  console.log('✓ Reel ohne Cover-Hook V3 bleibt rückwärtskompatibel; V2 wird vom V2-Validator geprüft.');
  process.exit(0);
}

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const placeholder = (value) => typeof value !== 'string' || !value.trim() || /\[|EINFÜGEN|TODO|TBD|PLACEHOLDER/i.test(value);
const normalize = (value) => String(value ?? '').toLowerCase().replace(/[„“"'’`]/g, '').replace(/[^a-z0-9äöüß%€]+/gi, ' ').trim().replace(/\s+/g, ' ');

assert(c.id === ID, 'coverHookContract.id muss ' + ID + ' sein.');
for (const key of [
  'appliesToNewReelsOnly',
  'scene01IsCover',
  'scene01IsFirstContentBeat',
  'dedicatedCoverOnlySceneForbidden',
  'zeroPointOneSecondCoverOnlyIntroForbidden',
  'standaloneCoverSceneForbidden',
  'voiceoverRequiredInScene01',
  'voiceoverStartsInScene01',
  'hookRequiredAtFirstSpokenWord',
  'genericIntroForbidden',
  'concreteTopicAnchorRequired',
  'coverTitleMustFunctionAsHook',
  'titleRenderedByRemotion',
  'titleInGeneratedFlowImageForbidden',
  'noIntroBeforeHook',
  'noFadeInDelay',
  'coverFrameImagePlusTitleOnly',
  'coverFrameCaptionFree',
  'captionsAllowedInsideScene01AfterCoverFrame',
  'standardSceneHeaderForbiddenDuringScene01',
  'coverIconForbidden',
  'flowImageMustReserveTitleSafeSpace',
]) assert(c[key] === true, 'coverHookContract.' + key + ' muss true sein.');

assert(c.standaloneCoverRequired === false, 'Cover-Hook V3 darf keine eigenständige Cover-Szene verlangen.');
assert(c.sourceSceneId === 'scene-01', 'Cover-Hook V3 muss scene-01 verwenden.');
assert(Number(c.coverSnapshotFrame) === 0, 'Cover-Snapshot muss aus Frame 0 kommen.');
assert(Number(c.dedicatedCoverHoldFrames) === 0, 'Es darf keinen separaten Cover-Hold geben.');
assert(c.captionStartsFromSceneId === 'scene-01', 'Captions dürfen bereits in scene-01 beginnen; scene-02 als harter Start wäre falsch.');
assert(Number(c.titleVisibleFromFrame) === 0, 'Hook-Titel muss ab Frame 0 sichtbar sein.');
assert(c.exportedCoverSource === 'final-video-frame-0', 'Cover muss aus finalem Video-Frame 0 exportiert werden.');
assert(c.scene01TimingSource === 'first-spoken-hook-beat', 'scene-01-Timing muss aus dem ersten gesprochenen Hook-Beat kommen.');
assert(Number(c.scene01MinimumContentFramesWhenKnown) >= 24, 'Bekannte scene-01-Dauer muss mindestens 24 Content-Frames erlauben.');
assert(Array.isArray(c.allowedHookForms) && ['question', 'claim', 'problem', 'warning', 'contrast', 'number'].every((form) => c.allowedHookForms.includes(form)), 'Erlaubte Hook-Formen fehlen oder sind unvollständig.');

const first = Array.isArray(index.scenes) ? index.scenes[0] : null;
assert(first?.id === 'scene-01' && first?.type === 'image', 'scene-01 muss eine Bildszene sein.');
assert(first?.coverHook === true, 'scene-01.coverHook muss true sein.');
assert(first?.contentHook === true, 'scene-01.contentHook muss true sein.');
assert(first?.coverOnlyIntro === false, 'scene-01 darf kein Cover-only-Intro sein.');
assert(first?.voiceoverRequired === true, 'scene-01 braucht Voiceover.');
assert(first?.voiceoverStartsHere === true, 'Voiceover muss in scene-01 starten.');
assert(first?.captionEnabled === true, 'Captions müssen grundsätzlich schon in scene-01 erlaubt sein.');
assert(first?.coverFrameCaptionFree === true, 'Nur der Cover-Frame 0 muss caption-frei bleiben.');
assert(first?.titleMode === 'reel-title-overlay', 'scene-01.titleMode muss reel-title-overlay sein.');
assert(Number(first?.titleVisibleFromFrame) === 0, 'scene-01 Hook-Titel muss bei Frame 0 beginnen.');
assert(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt scene-index.title entsprechen.');
assert(Number(first?.coverSnapshotFrame) === 0, 'scene-01.coverSnapshotFrame muss 0 sein.');
assert(first?.durationPolicy === 'content-driven-from-hook-voiceover', 'scene-01 darf keine künstliche Cover-Dauer verwenden.');

const hook = first?.hook ?? {};
const allowedForms = new Set(['question', 'claim', 'problem', 'warning', 'contrast', 'number']);
assert(typeof hook.form === 'string' && allowedForms.has(hook.form.trim()), 'scene-01.hook.form muss question, claim, problem, warning, contrast oder number sein.');
assert(!placeholder(hook.spokenLine), 'scene-01.hook.spokenLine muss die exakte erste gesprochene Hook-Zeile enthalten.');
assert(!placeholder(hook.topicAnchor), 'scene-01.hook.topicAnchor muss das konkrete Thema/Objekt benennen.');
assert(hook.coverHeadline === index.title, 'scene-01.hook.coverHeadline muss exakt scene-index.title entsprechen.');
assert(hook.startsAtFirstSpokenWord === true, 'Hook muss mit dem ersten gesprochenen Wort starten.');
assert(hook.noGenericIntro === true, 'Generische Einleitung vor dem Hook muss verboten sein.');

const hookLine = String(hook.spokenLine ?? '').trim();
const genericIntro = /^(hallo\b|willkommen\b|hey\b|in diesem video\b|in diesem reel\b|heute geht es\b|heute sprechen wir\b|ich zeige dir heute\b|lass uns\b|wir schauen uns heute\b)/i;
assert(!genericIntro.test(hookLine), 'Erste gesprochene Zeile ist eine generische Einleitung statt eines direkten Hooks.');
assert(hookLine.length >= 12, 'Erste Hook-Zeile ist zu kurz/vage; sie muss sofort eine konkrete Aussage tragen.');

if (hook.form === 'question') {
  assert(/[?？]\s*$/.test(hookLine) || /[?？]/.test(String(index.title ?? '')), 'Question-Hook braucht sichtbar/gesprochen eine echte Frage.');
}

const anchorTokens = normalize(hook.topicAnchor).split(' ').filter((token) => token.length >= 4 && !['thema', 'konkret', 'finanz', 'frage', 'aussage'].includes(token));
const combinedHook = normalize(`${index.title ?? ''} ${hookLine}`);
assert(anchorTokens.length > 0, 'HOOK_TOPIC_ANCHOR ist zu generisch.');
assert(anchorTokens.some((token) => combinedHook.includes(token)), 'Konkreter Themenanker ist weder in Cover-Headline noch erster Hook-Zeile erkennbar.');

const title = String(index.title ?? '').trim();
assert(title.length >= 10, 'scene-index.title ist zu kurz, um als klarer Cover-Hook zu funktionieren.');
assert(!/^(tagesgeld|kreditkarte|überweisung|etf|finanzen|geld|zinsen?)$/i.test(title), 'Cover-Headline ist nur eine neutrale Themenbezeichnung statt eines Hooks.');

const plannedSeconds = Number(first?.plannedSeconds ?? first?.durationSeconds ?? 0);
if (Number.isFinite(plannedSeconds) && plannedSeconds > 0) {
  assert(plannedSeconds >= 0.8, 'scene-01 ist als bekannte Dauer zu kurz und wirkt wie ein separater Cover-Clip; mindestens 0,8 s Content-Beat erforderlich.');
}
const durationFrames = Number(first?.durationFrames ?? 0);
if (Number.isFinite(durationFrames) && durationFrames > 0) {
  assert(durationFrames >= 24, 'scene-01 darf nicht als 3-Frame/0,1-s-Cover-only-Szene angelegt sein.');
}

const scriptPath = resolve(root, '01-script/script-fliess-text.txt');
assert(existsSync(scriptPath), '01-script/script-fliess-text.txt fehlt.');
if (existsSync(scriptPath)) {
  const script = readFileSync(scriptPath, 'utf8').trim();
  assert(script && !/\[|VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN|TODO|TBD/i.test(script), 'Gesamtskript ist noch Platzhalter; Cover-Hook V3 braucht die echte erste gesprochene Zeile.');
  if (script && hookLine) {
    assert(normalize(script).startsWith(normalize(hookLine)), 'Gesamtskript muss exakt mit scene-01.hook.spokenLine beginnen; keine Vorrede vor dem Hook.');
  }
}

const sceneDir = typeof first?.directory === 'string' && first.directory.trim()
  ? first.directory.trim().replace(/^03-szenen\//, '').replace(/\/$/, '')
  : 'EINZELNE-SZENEN/scene-01';
const requiredFiles = [
  '03-szenen/00-cover/cover.txt',
  first?.planFile,
  `03-szenen/${sceneDir}/szene.md`,
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  '05-projektdateien/technische-hinweise.md',
  '05-projektdateien/cover-hook-qa.md',
];
for (const relative of requiredFiles) {
  if (!relative) continue;
  const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);
  assert(existsSync(path), relative + ' fehlt.');
  if (existsSync(path)) {
    const source = readFileSync(path, 'utf8');
    assert(source.includes(ID), relative + ' enthält den Cover-Hook-V3-Marker nicht.');
  }
}

const sceneMdPath = resolve(root, '03-szenen', sceneDir, 'szene.md');
if (existsSync(sceneMdPath)) {
  const sceneMd = readFileSync(sceneMdPath, 'utf8');
  for (const marker of ['HOOK_FORM:', 'HOOK_SPOKEN_LINE:', 'HOOK_TOPIC_ANCHOR:', 'HOOK_COVER_HEADLINE:', 'HOOK_STARTS_AT_FIRST_WORD: true', 'NO_GENERIC_INTRO: true', 'NO_STANDALONE_COVER_BEAT: true']) {
    assert(sceneMd.includes(marker), `scene-01/szene.md benötigt ${marker}`);
  }
}

const handoffPath = resolve(root, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md');
if (existsSync(handoffPath)) {
  const handoff = readFileSync(handoffPath, 'utf8');
  assert(handoff.includes('Cover = erster Content-Beat'), 'Antigravity-Handoff muss scene-01 als Cover UND ersten Content-Beat festlegen.');
  assert(handoff.includes('KEINEN separaten 0,1-s-Cover-Clip'), 'Antigravity-Handoff muss den 0,1-s-Cover-only-Clip ausdrücklich verbieten.');
  assert(handoff.includes('Voiceover beginnt bereits in Szene 01'), 'Antigravity-Handoff muss Voiceover-Start in scene-01 festlegen.');
  assert(handoff.includes('Captions dürfen innerhalb von Szene 01 nach dem Cover-Frame erscheinen'), 'Antigravity-Handoff muss Captions nach Frame 0 bereits in scene-01 erlauben.');
  assert(handoff.includes('finale Export erzeugt cover.png aus Frame 0'), 'Antigravity-Handoff muss Frame-0-Coverexport festlegen.');
}

if (errors.length) {
  console.error('\nFuture-Cover-Hook V3 verletzt:\n');
  errors.forEach((e) => console.error('- ' + e));
  process.exit(1);
}

console.log('\n✓ Future-Cover-Hook erfüllt: ' + ID);
console.log('✓ scene-01 = Cover + erster echter Content-Hook; kein separater 0,1-s-/3-Frame-Cover-Clip.');
console.log('✓ Voiceover startet mit dem ersten Wort in scene-01; Frame 0 bleibt sauberer Cover-Snapshot.');
console.log('✓ Captions dürfen nach Frame 0 bereits innerhalb scene-01 laufen; Cover-Export bleibt final-video-frame-0.');
