import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-cover-hook-v3.mjs');
const ID = 'finanzneo-cover-hook-v3';

const makeReel = (overrides: Record<string, unknown> = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-cover-v3-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const title = String(overrides.title ?? '3 % Tagesgeld? Wie lange gilt der Zins wirklich?');
  const spokenLine = String(overrides.spokenLine ?? '3 % Tagesgeld? Wie lange gilt dieser Zins wirklich?');
  const hookForm = String(overrides.hookForm ?? 'question');
  const topicAnchor = String(overrides.topicAnchor ?? 'Tagesgeld Zins');
  const plannedSeconds = Number(overrides.plannedSeconds ?? 2.4);
  const durationFrames = Number(overrides.durationFrames ?? 72);
  const script = String(overrides.script ?? `${spokenLine} Viele Neukundenangebote gelten nur für einen begrenzten Zeitraum.`);

  const contract = {
    id: ID,
    appliesToNewReelsOnly: true,
    sourceSceneId: 'scene-01',
    scene01IsCover: true,
    scene01IsFirstContentBeat: true,
    dedicatedCoverOnlySceneForbidden: true,
    zeroPointOneSecondCoverOnlyIntroForbidden: true,
    standaloneCoverSceneForbidden: true,
    standaloneCoverRequired: false,
    coverSnapshotFrame: 0,
    dedicatedCoverHoldFrames: 0,
    voiceoverRequiredInScene01: true,
    voiceoverStartsInScene01: true,
    hookRequiredAtFirstSpokenWord: true,
    genericIntroForbidden: true,
    concreteTopicAnchorRequired: true,
    allowedHookForms: ['question', 'claim', 'problem', 'warning', 'contrast', 'number'],
    coverTitleMustFunctionAsHook: true,
    titleSource: 'scene-index.title',
    titleRenderedByRemotion: true,
    titleInGeneratedFlowImageForbidden: true,
    titleVisibleFromFrame: 0,
    noIntroBeforeHook: true,
    noFadeInDelay: true,
    coverFrameImagePlusTitleOnly: true,
    coverFrameCaptionFree: true,
    captionsAllowedInsideScene01AfterCoverFrame: true,
    captionStartsFromSceneId: 'scene-01',
    standardSceneHeaderForbiddenDuringScene01: true,
    coverIconForbidden: true,
    flowImageMustReserveTitleSafeSpace: true,
    exportedCoverSource: 'final-video-frame-0',
    scene01TimingSource: 'first-spoken-hook-beat',
    scene01MinimumContentFramesWhenKnown: 24,
    scene01RecommendedSeconds: '1.8-3.0',
  };

  const first = {
    id: 'scene-01',
    type: 'image',
    directory: 'EINZELNE-SZENEN/scene-01',
    planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt',
    coverHook: true,
    contentHook: true,
    coverOnlyIntro: false,
    voiceoverRequired: true,
    voiceoverStartsHere: true,
    captionEnabled: true,
    coverFrameCaptionFree: true,
    titleMode: 'reel-title-overlay',
    titleVisibleFromFrame: 0,
    coverTitle: title,
    coverSnapshotFrame: 0,
    durationPolicy: 'content-driven-from-hook-voiceover',
    plannedSeconds,
    durationFrames,
    hook: {
      form: hookForm,
      spokenLine,
      topicAnchor,
      coverHeadline: title,
      startsAtFirstSpokenWord: true,
      noGenericIntro: true,
    },
  };

  const index = {title, coverHookContract: contract, scenes: [first]};
  const marker = `FUTURE_COVER_HOOK: ${ID}`;
  const handoff = `${marker}\n## Szene 01 — Cover = erster Content-Beat\n- Es gibt KEINEN separaten 0,1-s-Cover-Clip.\n- Das Voiceover beginnt bereits in Szene 01 ab dem ersten gesprochenen Wort.\n- Captions dürfen innerhalb von Szene 01 nach dem Cover-Frame erscheinen.\n- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4.`;
  const sceneMd = `${marker}\nHOOK_FORM: ${hookForm}\nHOOK_SPOKEN_LINE: ${spokenLine}\nHOOK_TOPIC_ANCHOR: ${topicAnchor}\nHOOK_COVER_HEADLINE: ${title}\nHOOK_STARTS_AT_FIRST_WORD: true\nNO_GENERIC_INTRO: true\nNO_STANDALONE_COVER_BEAT: true`;

  write('03-szenen/scene-index.json', JSON.stringify(index, null, 2));
  write('03-szenen/00-cover/cover.txt', marker);
  write('03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt', marker);
  write('03-szenen/EINZELNE-SZENEN/scene-01/szene.md', sceneMd);
  write('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', handoff);
  write('05-projektdateien/technische-hinweise.md', handoff);
  write('05-projektdateien/cover-hook-qa.md', marker);
  write('01-script/script-fliess-text.txt', script);
  return root;
};

test('Cover Hook V3 akzeptiert scene-01 als Cover und ersten gesprochenen Hook-Beat', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('0,1-s-/3-Frame-Cover-only-Szene wird blockiert', () => {
  const root = makeReel({plannedSeconds: 0.1, durationFrames: 3});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /0,1|3-Frame|zu kurz|Cover-only/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('generische Begrüßung vor dem Thema wird blockiert', () => {
  const root = makeReel({spokenLine: 'Heute geht es um Tagesgeld und Zinsen.', hookForm: 'claim', script: 'Heute geht es um Tagesgeld und Zinsen. Danach schauen wir auf die Frist.'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /generische Einleitung|direkten Hooks/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Gesamtskript darf keine Vorrede vor der hinterlegten Hook-Zeile haben', () => {
  const root = makeReel({script: 'Kurze Vorrede. 3 % Tagesgeld? Wie lange gilt dieser Zins wirklich?'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Gesamtskript.*beginnen|Vorrede/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Reels ohne Cover Hook V3 bleiben rückwärtskompatibel', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-cover-legacy-'));
  try {
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({coverHookContract: {id: 'finanzneo-cover-hook-v2'}}));
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
