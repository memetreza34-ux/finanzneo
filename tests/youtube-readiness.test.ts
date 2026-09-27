import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync} from 'node:fs';
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

  const animationSource = `import React from 'react';\nimport {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';\nexport const YouTubeVisual02Animation: React.FC = () => { const frame=useCurrentFrame(); const p=interpolate(frame,[0,30],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}); return <AbsoluteFill><div style={{transform:\`translateY(\${(1-p)*20}px)\`}}>Reserve</div></AbsoluteFill>; };\n`;

  const motionContract = {
    viewerChange: 'Drei einfache Monatsbalken wachsen nacheinander auf ihre Zielhöhe.',
    reason: 'Drei Balken zeigen die Höhe der Reserve direkter als eine komplexe 3D-Szene.',
    motionPreset: 'BAR_GROW',
    advancedReason: '',
    toolStack: ['Remotion'],
  };

  const index = {
    title: 'Notgroschen vollständig erklärt',
    motionStandard: {id: 'finanzneo-youtube-motion-v4-simple'},
    thumbnail: {googleFlowFileName: 'YouTube Thumbnail - Notgroschen.png'},
    visuals: [
      {
        id: 'visual-01',
        type: 'image',
        assetSource: 'google-flow',
        flowAllowed: true,
        flowReason: 'Die kaputte Waschmaschine mit Rechnung ist als Alltagssituation schneller verständlich als eine abstrakte Grafik.',
        message: 'Unerwartete Reparaturen können sofort mehrere hundert Euro kosten.',
        reason: 'Ein einfaches Alltagsbild macht das konkrete Problem direkt sichtbar.',
        planFile: '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt',
        googleFlowFileName: 'YouTube Bild 01 - Sicherheitspuffer.png',
        chapter: 'Warum du einen Notgroschen brauchst',
        scriptBeat: 'Eine unerwartete Reparatur darf nicht in den Dispo führen.',
        expectedVisual: 'Eine einfache kaputte Waschmaschine mit Reparaturrechnung als klarer Hauptfokus.',
        objectLabels: [],
      },
      {
        id: 'visual-02',
        type: 'animation',
        assetSource: 'remotion',
        flowAllowed: false,
        flowReason: '',
        message: 'Drei Monatsausgaben ergeben den geplanten Sicherheitspuffer.',
        reason: motionContract.reason,
        planFile: '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md',
        animationSourceFile: '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx',
        animationExport: 'YouTubeVisual02Animation',
        ...motionContract,
        chapter: 'Die richtige Höhe',
        scriptBeat: 'Drei Monatsausgaben werden schrittweise aufgebaut.',
      },
    ],
  };
  write(root, '04-visuals/visual-index.json', `${JSON.stringify(index)}\n`);
  write(root, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt', 'Finaler einfacher englischer Editorial-Bildprompt ohne offene Felder.');
  write(root, '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md', 'Finale einfache Remotion-Spezifikation ohne offene Felder.');
  write(root, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx', animationSource);
  write(root, '06-projektdateien/animation-seal.json', `${JSON.stringify({
    version: 3,
    motionStandardId: 'finanzneo-youtube-motion-v4-simple',
    sourceIndex: '04-visuals/visual-index.json',
    entries: [{
      id: 'visual-02',
      sourceFile: '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx',
      exportName: 'YouTubeVisual02Animation',
      ...motionContract,
      sha256: createHash('sha256').update(Buffer.from(animationSource)).digest('hex'),
    }],
  })}\n`);
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

test('Einsatzprüfung gibt ein vollständiges Motion-V4-versiegeltes YouTube-Projekt für Phase 3 frei', () => {
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

test('Einsatzprüfung meldet ein fehlendes Flow-Bild exakt', () => {
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

test('Einsatzprüfung blockiert veränderten Motion-Code nach Seal', () => {
  const root = createReadyFixture();
  try {
    write(root, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx', 'manipuliert');
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase1Blockers.some((blocker) => blocker.includes('Hash für visual-02 stimmt nicht mehr')));
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});

test('Einsatzprüfung blockiert veränderten Motion-V4-Vertrag nach Seal', () => {
  const root = createReadyFixture();
  try {
    const indexPath = join(root, '04-visuals/visual-index.json');
    const index = JSON.parse(readFileSync(indexPath, 'utf8'));
    index.visuals[1].viewerChange = 'Eine andere sichtbare Idee wird nach dem Seal eingeschoben.';
    writeFileSync(indexPath, `${JSON.stringify(index)}\n`);
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, false);
    assert.ok(result.phase1Blockers.some((blocker) => blocker.includes('Motion-V4-Vertrag für visual-02 stimmt nicht mehr')));
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

test('Einsatzprüfung verlangt ein geplantes echtes Asset tatsächlich lokal', () => {
  const root = createReadyFixture();
  try {
    const indexPath = join(root, '04-visuals/visual-index.json');
    const index = JSON.parse(readFileSync(indexPath, 'utf8'));
    index.visuals.push({
      id: 'visual-03',
      type: 'real-asset',
      assetSource: 'real-asset',
      flowAllowed: false,
      flowReason: '',
      message: 'Das Factsheet belegt die laufenden Kosten.',
      reason: 'Die echte Quelle ist glaubwürdiger als ein generiertes Dokument.',
      chapter: 'Kosten prüfen',
      scriptBeat: 'Die laufenden Kosten stehen im offiziellen Factsheet.',
      planFile: '04-visuals/EINZELNE-VISUALS/visual-03/asset-plan.md',
      assetFile: '04-visuals/assets/etf-factsheet.png',
      sourceNote: 'Offizielles ETF-Factsheet, lokal für die Produktion abgelegt.',
    });
    writeFileSync(indexPath, `${JSON.stringify(index)}\n`);
    write(root, '04-visuals/EINZELNE-VISUALS/visual-03/asset-plan.md', 'Finaler Asset-Plan ohne offene Felder.');

    const missing = analyzeYouTubeReadiness(root);
    assert.equal(missing.ready, false);
    assert.ok(missing.phase2Blockers.some((blocker) => blocker.includes('Echtes Asset fehlt für visual-03')));

    write(root, '04-visuals/assets/etf-factsheet.png', Buffer.from('real asset'));
    const present = analyzeYouTubeReadiness(root);
    assert.equal(present.phase2Blockers.some((blocker) => blocker.includes('Echtes Asset fehlt für visual-03')), false);
  } finally {
    rmSync(root, {recursive:true, force:true});
  }
});
