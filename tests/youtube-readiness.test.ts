import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {PHASE_1_FILES} from '../scripts/lib/youtube-contract.mjs';
import {analyzeYouTubeReadiness, isSixteenNineDimensions} from '../scripts/lib/youtube-readiness.mjs';

const write = (root: string, relativePath: string, content: string | Buffer) => {
  const path = join(root, relativePath);
  mkdirSync(join(path, '..'), {recursive: true});
  writeFileSync(path, content);
};

const createReadyFixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-youtube-ready-'));
  for (const path of PHASE_1_FILES) write(root, path, `Finaler Inhalt für ${path}.`);

  const index = {
    title: 'Notgroschen vollständig erklärt',
    thumbnail: {googleFlowFileName: 'YouTube Thumbnail - Notgroschen.png'},
    visuals: [
      {
        id: 'visual-01',
        type: 'image',
        planFile: '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt',
        googleFlowFileName: 'YouTube Bild 01 - Sicherheitspuffer.png',
        chapter: 'Warum du einen Notgroschen brauchst',
        scriptBeat: 'Eine unerwartete Reparatur darf nicht in den Dispo führen.',
        expectedVisual: 'Ein Schutzschild bewahrt Geld vor einer Reparaturrechnung.',
        objectLabels: ['Notgroschen', 'Reparatur'],
      },
      {
        id: 'visual-02',
        type: 'animation',
        planFile: '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md',
        chapter: 'Die richtige Höhe',
        scriptBeat: 'Drei Monatsausgaben werden schrittweise aufgebaut.',
      },
    ],
  };
  write(root, '04-visuals/visual-index.json', `${JSON.stringify(index)}\n`);
  write(root, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt', 'Finaler englischer Bildprompt.');
  write(root, '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md', 'Finale Remotion-Animation.');
  write(root, '04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Thumbnail - Notgroschen.png', Buffer.from('thumbnail'));
  write(root, '04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Sicherheitspuffer.png', Buffer.from('visual'));
  write(root, '03-audio/voice.mp3', Buffer.from('audio'));
  write(root, '03-audio/word-timings.json', `${JSON.stringify({
    source: '03-audio/voice.mp3',
    subtitleMode: 'sentence-with-audio-synced-active-word',
    activeWordColor: 'finance-green',
    words: [{word:'Ein',start:0,end:0.2}],
    sentences: [{text:'Ein',start:0,end:0.2,words:[{word:'Ein',start:0,end:0.2}]}],
  })}\n`);
  return root;
};

test('Einsatzprüfung gibt ein vollständiges YouTube-Projekt für Phase 3 frei', () => {
  const root = createReadyFixture();
  try {
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, true);
    assert.deepEqual(result.phase1Blockers, []);
    assert.deepEqual(result.phase2Blockers, []);
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});

test('16:9-Prüfung akzeptiert horizontale Quellbilder und blockiert Reel-Formate', () => {
  assert.equal(isSixteenNineDimensions(1920, 1080), true);
  assert.equal(isSixteenNineDimensions(2048, 1152), true);
  assert.equal(isSixteenNineDimensions(1080, 1080), false);
  assert.equal(isSixteenNineDimensions(1080, 1920), false);
});

test('Einsatzprüfung meldet ein fehlendes Nutzerbild exakt', () => {
  const root = createReadyFixture();
  try {
    unlinkSync(join(root, '04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Sicherheitspuffer.png'));
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase2Blockers.includes('Nutzerbild fehlt: 04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Sicherheitspuffer.png'));
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});

test('Einsatzprüfung blockiert offene Metadaten und Social-Promo-Platzhalter', () => {
  const root = createReadyFixture();
  try {
    write(root, '05-publishing/final-title.txt', '[FINALEN YOUTUBE-TITEL EINFÜGEN]');
    write(root, '05-publishing/social-promo/instagram.txt', 'CAPTION: [EINFÜGEN]');
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase1Blockers.includes('05-publishing/final-title.txt enthält noch Platzhalter.'));
    assert.ok(result.phase1Blockers.includes('05-publishing/social-promo/instagram.txt enthält noch Platzhalter.'));
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});

test('Einsatzprüfung blockiert mehrere Voiceover-Dateien', () => {
  const root = createReadyFixture();
  try {
    write(root, '03-audio/zweite-stimme.wav', Buffer.from('audio'));
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.startsWith('03-audio/ enthält mehrere Audiodateien:')));
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});
