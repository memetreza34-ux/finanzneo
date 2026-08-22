import assert from 'node:assert/strict';
import {existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {mkdtempSync} from 'node:fs';
import {analyzeReelReadiness, isSquareImageDimensions} from '../scripts/lib/reel-readiness.mjs';
import {REEL_CAPTION, REEL_FINAL_EXPORT, REEL_LAYOUT, REEL_VISUAL_MIX} from '../scripts/lib/reel-contract.mjs';

const write = (root: string, relativePath: string, content: string | Buffer) => {
  const path = join(root, relativePath);
  mkdirSync(join(path, '..'), {recursive: true});
  writeFileSync(path, content);
};

const createReadyFixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-reel-ready-'));
  const index = {
    title: 'Notgroschen einfach erklärt',
    cover: {
      type: 'image-with-remotion-text',
      googleFlowFileName: 'Bild 00 - Notgroschen.png',
      overlay: {
        eyebrow: 'FINANZNEO',
        headline: 'DEIN NOTGROSCHEN',
        accentLine: 'SCHÜTZT DICH',
        payoff: 'PUFFER STATT DISPO',
      },
    },
    layout: REEL_LAYOUT,
    finalExport: REEL_FINAL_EXPORT,
    subtitleDisplay: {
      mode: REEL_CAPTION.mode,
      activeWordColor: REEL_CAPTION.activeWordColor,
      maxWords: REEL_CAPTION.maxWords,
      maxCharacters: REEL_CAPTION.maxCharacters,
      maxLines: REEL_CAPTION.maxLines,
      noDeadGaps: true,
      holdDuringPauses: true,
      noWordJump: true,
      noWordScale: true,
    },
    visualMix: {
      strategy: REEL_VISUAL_MIX.strategy,
      preferredAnimationShare: REEL_VISUAL_MIX.preferredAnimationShare,
      minimumAnimationShare: REEL_VISUAL_MIX.minimumAnimationShare,
      maximumAnimationShare: REEL_VISUAL_MIX.maximumAnimationShare,
      actualAnimationShare: 0.5,
      exceptionRationale: 'Der kompakte Test-Fixture besitzt bewusst nur zwei Szenen.',
    },
    scenes: [
      {
        id: 'scene-01',
        type: 'image',
        directory: 'EINZELNE-SZENEN/scene-01',
        planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt',
        googleFlowFileName: 'Bild 01 - Sicherheitspuffer.png',
        headline: 'Dein Puffer',
        accent: 'Notgroschen',
        icon: 'sicherheit',
        expectedVisual: 'Ein Schutzschild bewahrt einen Geldstapel vor einer Reparaturrechnung.',
        objectLabels: ['Notgroschen', 'Reparatur'],
      },
      {
        id: 'scene-02',
        type: 'animation',
        directory: 'EINZELNE-SZENEN/scene-02',
        planFile: 'EINZELNE-SZENEN/scene-02/remotion.md',
        headline: 'Drei Monatsausgaben',
        accent: 'Ziel',
        icon: 'ziel',
        visualMetaphor: 'Drei Monatsblöcke bauen einen Sicherheitspuffer auf.',
        startState: 'Ein einzelner Monatsblock ist sichtbar.',
        action: 'Zwei weitere Blöcke werden sichtbar aufgestapelt.',
        endState: 'Der vollständige Puffer steht bereit.',
      },
    ],
  };

  write(root, '03-szenen/scene-index.json', `${JSON.stringify(index)}\n`);
  write(root, '01-script/script-fliess-text.txt', 'Eine kaputte Waschmaschine sollte dich nicht in den Dispo zwingen.');
  write(root, '03-szenen/00-cover/cover.txt', 'Finaler Cover-Prompt ohne offene Felder.');
  write(root, '03-szenen/alle-bildprompts.txt', 'Finale Google-Flow-Prompts ohne offene Felder.');
  write(root, '03-szenen/EINZELNE-SZENEN/scene-01/szene.md', 'Sprechtext und Visual sind final.');
  write(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt', 'Finaler Bildprompt.');
  write(root, '03-szenen/EINZELNE-SZENEN/scene-02/szene.md', 'Sprechtext und Visual sind final.');
  write(root, '03-szenen/EINZELNE-SZENEN/scene-02/remotion.md', 'Visuelle Metapher: Monatsblöcke.\nStartzustand: ein Block.\nHandlung/Mechanismus: Blöcke stapeln sich.\nEndzustand: Puffer vollständig.');
  write(root, '05-projektdateien/recherche-quellen.md', 'Beispielannahmen sind im Skript klar markiert.');
  write(root, '05-projektdateien/szenenplan.md', 'Hook, Erklärung, Beispiel, Merksatz und CTA.');
  write(root, '05-projektdateien/animationen.md', 'Szene 02 zeigt drei Monatsausgaben als Balken.');
  write(root, '04-caption/caption.txt', 'Ein Notgroschen schützt vor teuren Schulden.');
  write(root, '04-caption/instagram-reels.txt', 'CAPTION:\nSo baust du deinen Puffer auf.');
  write(root, '04-caption/tiktok.txt', 'CAPTION:\nDein Notgroschen in drei Schritten.');
  write(root, '04-caption/facebook-reels.txt', 'REEL-TEXT:\nEinfach erklärt.');
  write(root, '04-caption/snapchat.txt', 'CAPTION:\nPuffer statt Dispo.');
  write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 00 - Notgroschen.png', Buffer.from('cover'));
  write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Sicherheitspuffer.png', Buffer.from('scene'));
  write(root, '02-audio/voice.mp3', Buffer.from('audio'));
  write(root, '04-caption/word-timings.json', `${JSON.stringify({
    version: 'finanzneo-caption-v1',
    source: '02-audio/voice.mp3',
    subtitleMode: 'sentence-with-audio-synced-active-word',
    activeWordColor: 'finance-green',
    words: [{word: 'Eine', start: 0, end: 0.3}],
    sentences: [{text: 'Eine', start: 0, end: 0.3, words: [{word: 'Eine', start: 0, end: 0.3}]}],
  })}\n`);

  return root;
};

test('Einsatzprüfung gibt ein vollständiges Reel für Phase 3 frei', () => {
  const root = createReadyFixture();
  try {
    const result = analyzeReelReadiness(root);
    assert.equal(result.ready, true);
    assert.deepEqual(result.phase1Blockers, []);
    assert.deepEqual(result.phase2Blockers, []);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Nur echte quadratische Bildmaße bestehen den 1:1-Formatcheck', () => {
  assert.equal(isSquareImageDimensions(2048, 2048), true);
  assert.equal(isSquareImageDimensions(1080, 1920), false);
  assert.equal(isSquareImageDimensions(0, 0), false);
});

test('Einsatzprüfung meldet fehlende Bilder mit exaktem Dateinamen', () => {
  const root = createReadyFixture();
  try {
    unlinkSync(join(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Sicherheitspuffer.png'));
    const result = analyzeReelReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase2Blockers.includes('Nutzerbild fehlt: 03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Sicherheitspuffer.png'));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Einsatzprüfung blockiert offene Phase-1-Platzhalter', () => {
  const root = createReadyFixture();
  try {
    write(root, '01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]');
    const result = analyzeReelReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase1Blockers.includes('01-script/script-fliess-text.txt enthält noch Platzhalter.'));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Einsatzprüfung blockiert unvollständige Animationsmechanismen', () => {
  const root = createReadyFixture();
  try {
    const path = join(root, '03-szenen/scene-index.json');
    const index = JSON.parse(readFileSync(path, 'utf8'));
    index.scenes[1].action = '[EINFÜGEN]';
    write(root, '03-szenen/scene-index.json', `${JSON.stringify(index)}\n`);
    const result = analyzeReelReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase1Blockers.includes('03-szenen/scene-index.json: scene-02.action fehlt oder enthält einen Platzhalter.'));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Einsatzprüfung blockiert zu lange Untertitelsätze', () => {
  const root = createReadyFixture();
  try {
    const words = Array.from({length: REEL_CAPTION.maxWords + 1}, (_, index) => ({
      word: `Wort${index + 1}`,
      start: index * 0.2,
      end: index * 0.2 + 0.15,
    }));
    write(root, '04-caption/word-timings.json', `${JSON.stringify({
      version: 'finanzneo-caption-v1',
      source: '02-audio/voice.mp3',
      subtitleMode: REEL_CAPTION.mode,
      activeWordColor: REEL_CAPTION.activeWordColor,
      words,
      sentences: [{text: words.map((word) => word.word).join(' '), start: 0, end: 2.5, words}],
    })}\n`);
    const result = analyzeReelReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.includes(`erlaubt sind höchstens ${REEL_CAPTION.maxWords}`)));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Bild-Sync kopiert exakte Nutzerdateien und bewahrt die Originale', () => {
  const root = createReadyFixture();
  try {
    const result = spawnSync(process.execPath, ['scripts/sort-reel-images.mjs', root], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);

    const coverSource = join(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 00 - Notgroschen.png');
    const sceneSource = join(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Sicherheitspuffer.png');
    const coverTarget = join(root, '03-szenen/00-cover/Bild 00 - Notgroschen.png');
    const sceneTarget = join(root, '03-szenen/EINZELNE-SZENEN/scene-01/Bild 01 - Sicherheitspuffer.png');

    assert.equal(existsSync(coverSource), true);
    assert.equal(existsSync(sceneSource), true);
    assert.deepEqual(readFileSync(coverTarget), readFileSync(coverSource));
    assert.deepEqual(readFileSync(sceneTarget), readFileSync(sceneSource));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
