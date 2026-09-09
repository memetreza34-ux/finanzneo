import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
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
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-youtube-ready-v3-'));
  for (const path of PHASE_1_FILES) write(root, path, `Finaler Inhalt für ${path}.`);

  const animationSource = `import React from 'react';\nexport const MECHANIC_ID='reserve-build';\nexport const VISUAL_TECHNIQUE_ID='depth-build';\nexport const COMPOSITION_FAMILY_ID='css-3d';\nexport const Scene02=()=>null;\n`;
  const index = {
    title: 'V3 Readiness Test',
    motionStandard: {id:'finanzneo-youtube-motion-v3'},
    thumbnail: {googleFlowFileName:'YouTube Thumbnail - Test.png'},
    visuals: [
      {
        id:'szene-01',type:'image',planFile:'03-szenen/szene-01/bildprompt.txt',
        googleFlowFileName:'YouTube Bild 01 - Test.png',chapter:'Hook',scriptBeat:'Konkreter Einstieg.',
        expectedVisual:'Konkrete Finanzsituation.',objectLabels:[],wordStartIndex:0,wordEndIndex:29,
      },
      {
        id:'szene-02',type:'animation',planFile:'03-szenen/szene-02/remotion.md',
        animationSourceFile:'03-szenen/szene-02/animation.tsx',animationExport:'Scene02',
        animationIntent:'Zeigt einen sichtbaren Prozess.',viewerTakeaway:'Der Ablauf wird verständlich.',qualityTier:'support',
        mechanicId:'reserve-build',visualTechniqueId:'depth-build',compositionFamilyId:'css-3d',repeatTechniqueReason:'',
        motionChannels:['Objekte','Kamera','Tiefe'],visualBeats:['Start','Aufbau','Verbindung','Resultat'],
        motionEvents:['Start','Objekt 1','Objekt 2','Resultat'],previewDurationFrames:180,maxQuietFrames:90,
        chapter:'Erklärung',scriptBeat:'Der Prozess wird sichtbar.',wordStartIndex:30,wordEndIndex:59,
      },
    ],
  };
  write(root, '05-projektdateien/scene-index.json', `${JSON.stringify(index)}\n`);
  write(root, '03-szenen/szene-01/bildprompt.txt', 'Finaler Literal-first Bildprompt.');
  write(root, '03-szenen/szene-02/remotion.md', 'Finale Motion-V3-Spezifikation.');
  write(root, '03-szenen/szene-02/animation.tsx', animationSource);
  write(root, '05-projektdateien/animation-seal.json', `${JSON.stringify({
    version:2,motionStandardId:'finanzneo-youtube-motion-v3',entries:[{
      id:'szene-02',sourceFile:'03-szenen/szene-02/animation.tsx',exportName:'Scene02',qualityTier:'support',
      mechanicId:'reserve-build',visualTechniqueId:'depth-build',compositionFamilyId:'css-3d',
      sha256:createHash('sha256').update(Buffer.from(animationSource)).digest('hex'),
    }],
  })}\n`);
  write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/YouTube Thumbnail - Test.png', Buffer.from('thumbnail'));
  write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Test.png', Buffer.from('visual'));
  write(root, '02-audio/voice.mp3', Buffer.from('audio'));

  const words = Array.from({length:60}, (_, i) => ({word:`Wort${i + 1}`,start:i * 0.2,end:i * 0.2 + 0.18}));
  const sentences = Array.from({length:6}, (_, i) => ({
    text:words.slice(i * 10, i * 10 + 10).map((word) => word.word).join(' '),
    start:words[i * 10].start,
    end:words[i * 10 + 9].end,
    words:words.slice(i * 10, i * 10 + 10),
  }));
  write(root, '02-audio/word-timings.json', `${JSON.stringify({
    source:'voice.mp3',subtitleMode:'sentence-with-audio-synced-active-word',activeWordColor:'finance-green',words,sentences,
  })}\n`);
  write(root, '05-projektdateien/timeline.json', `${JSON.stringify({
    durationFrames:360,
    visuals:[
      {id:'szene-01',startFrame:0,durationFrames:150},
      {id:'szene-02',startFrame:150,durationFrames:210},
    ],
  })}\n`);
  return root;
};

test('Motion V3 Readiness gibt nur vollständig aufgelöste Projekte frei', () => {
  const root = createReadyFixture();
  try {
    const result = analyzeYouTubeReadiness(root);
    assert.equal(result.ready, true, [...result.phase1Blockers,...result.phase2Blockers].join('\n'));
  } finally { rmSync(root, {recursive:true, force:true}); }
});

test('16:9-Prüfung akzeptiert horizontale Quellen und blockiert Reel-Formate', () => {
  assert.equal(isSixteenNineDimensions(1920,1080), true);
  assert.equal(isSixteenNineDimensions(2048,1152), true);
  assert.equal(isSixteenNineDimensions(1080,1080), false);
  assert.equal(isSixteenNineDimensions(1080,1920), false);
});

test('Fehlendes Nutzerbild wird exakt blockiert', () => {
  const root = createReadyFixture();
  try {
    unlinkSync(join(root,'03-szenen/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Test.png'));
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase2Blockers.includes('Nutzerbild fehlt: 03-szenen/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Test.png'));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Veränderter Motion-Code nach Seal wird blockiert', () => {
  const root = createReadyFixture();
  try {
    write(root,'03-szenen/szene-02/animation.tsx','manipuliert');
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase1Blockers.some((blocker) => blocker.includes('Hash für szene-02 stimmt nicht mehr')));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Leere Wort-Timestamps werden hart blockiert', () => {
  const root = createReadyFixture();
  try {
    write(root,'02-audio/word-timings.json',JSON.stringify({source:'voice.mp3',subtitleMode:'sentence-with-audio-synced-active-word',activeWordColor:'finance-green',words:[],sentences:[]}));
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.includes('keine vollständigen echten Wort-Zeitstempel')));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('0-Frame-Timeline wird hart blockiert', () => {
  const root = createReadyFixture();
  try {
    write(root,'05-projektdateien/timeline.json',JSON.stringify({durationFrames:0,visuals:[{id:'szene-01',startFrame:0,durationFrames:0},{id:'szene-02',startFrame:0,durationFrames:0}]}));
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.includes('durationFrames muss > 0')));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Statisches Bild über sieben Sekunden wird blockiert', () => {
  const root = createReadyFixture();
  try {
    write(root,'05-projektdateien/timeline.json',JSON.stringify({durationFrames:450,visuals:[{id:'szene-01',startFrame:0,durationFrames:240},{id:'szene-02',startFrame:240,durationFrames:210}]}));
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.includes('länger als 7 Sekunden')));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Mehrere Voiceover-Dateien werden blockiert', () => {
  const root = createReadyFixture();
  try {
    write(root,'02-audio/zweite-stimme.wav',Buffer.from('audio'));
    const result = analyzeYouTubeReadiness(root);
    assert.ok(result.phase2Blockers.some((blocker) => blocker.startsWith('02-audio/ enthält mehrere Audiodateien:')));
  } finally { rmSync(root,{recursive:true,force:true}); }
});
