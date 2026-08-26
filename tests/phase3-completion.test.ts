import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {
  PHASE1_ANIMATION_SEAL_RELATIVE,
  PHASE3_MANIFEST_RELATIVE,
  createPhase3ManifestSkeleton,
  phase3CompletionContractFields,
  sha256File,
  validatePhase3Manifest,
} from '../scripts/lib/phase3-completion.mjs';
import {ANIMATION_QUALITY_LOCK} from '../scripts/lib/reel-scene-schema.mjs';

const repoPath = (absolute: string) => relative(resolve('.'), absolute).replaceAll('\\', '/');

const buildFixture = () => {
  const tempRoot = mkdtempSync(resolve('.tmp-phase3-completion-'));
  const reelRoot = join(tempRoot, 'reel');
  const srcRoot = join(tempRoot, 'src');
  const assetRoot = join(tempRoot, 'assets');
  const animationDir = join(reelRoot, '03-szenen/EINZELNE-SZENEN/scene-02');
  mkdirSync(join(reelRoot, '03-szenen'), {recursive: true});
  mkdirSync(join(reelRoot, '05-projektdateien'), {recursive: true});
  mkdirSync(srcRoot, {recursive: true});
  mkdirSync(assetRoot, {recursive: true});
  mkdirSync(animationDir, {recursive: true});

  const entryPoint = join(srcRoot, 'index.ts');
  const compositionSource = join(srcRoot, 'Reel.tsx');
  const imageAsset = join(assetRoot, 'scene-01.png');
  const animationSource = join(animationDir, 'animation.tsx');
  writeFileSync(entryPoint, 'export const entry = true;\n');
  writeFileSync(compositionSource, [
    "import React from 'react';",
    'export const Reel = () => <main>Produktionskomposition mit direkter Phase-1-Animation</main>;',
    'export const description = "Testquelle mit ausreichend Inhalt für den Produktions-Preflight";',
    '',
  ].join('\n'));
  writeFileSync(imageAsset, Buffer.alloc(256, 7));
  writeFileSync(animationSource, [
    "import React from 'react';",
    "import {useCurrentFrame} from 'remotion';",
    "import {AnimationStage} from '../../../../../../src/brand/components/ReelStage';",
    "import {ANIMATION_COLORS, prog} from '../../../../../../src/brand/tokens';",
    '',
    '/**',
    ' * ANIMATION_NARRATIVE',
    ' * START: Zwei getrennte Kartenbeträge stehen sichtbar nebeneinander.',
    ' * MECHANISM: Beide Beträge bewegen sich nacheinander in dieselbe Bankfläche.',
    ' * RESULT: Eine gemeinsame Summe bleibt als eindeutiges Ergebnis stehen.',
    ' *',
    ' * Diese lange Dokumentation macht die Fixture absichtlich repräsentativ für',
    ' * produktionsreifen Phase-1-Code: konkrete Objekte, konkrete Mechanik, klares',
    ' * Ergebnis und keine generische Debug-Bewegung. Weitere erklärende Zeilen',
    ' * sorgen dafür, dass die Testquelle dieselbe Mindestgröße wie echte Dateien',
    ' * erreicht und nicht versehentlich als leere Platzhalterkomponente gilt.',
    ' */',
    'const RESULT_HOLD_FRAMES = 15;',
    'export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 60}) => {',
    '  const frame = useCurrentFrame();',
    '  const move = prog(frame, 4, Math.max(12, durationFrames - RESULT_HOLD_FRAMES));',
    '  return (',
    '    <AnimationStage>',
    '      <div style={{position:"absolute",left:160,right:160,top:620,color:ANIMATION_COLORS.neutralText,fontSize:44}}>',
    '        <span style={{display:"inline-block",transform:`translateX(${move * 120}px)`}}>40.000 €</span>',
    '        <span style={{marginLeft:120,color:ANIMATION_COLORS.money}}>+ 60.000 €</span>',
    '        <div style={{marginTop:70,color:ANIMATION_COLORS.focus}}>100.000 € bei einer Bank</div>',
    '      </div>',
    '    </AnimationStage>',
    '  );',
    '};',
    '',
  ].join('\n'));

  const index = {
    title: 'Test Reel',
    video: {fps: 30},
    phase3CompletionContract: phase3CompletionContractFields(),
    phase1AnimationCode: {
      required: true,
      qualityLock: ANIMATION_QUALITY_LOCK,
      phase3MayNotReplaceCanonicalAnimation: true,
    },
    scenes: [
      {id: 'scene-01', type: 'image', googleFlowFileName: 'Bild 01 - Test.png'},
      {
        id: 'scene-02',
        type: 'animation',
        animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
        animationExport: 'Scene02Animation',
        animationIntent: 'Zwei Beträge starten getrennt, fließen sichtbar zusammen und enden als eine gemeinsame Bank-Summe.',
        animationQualityLock: ANIMATION_QUALITY_LOCK,
      },
    ],
  };
  const indexPath = join(reelRoot, '03-szenen/scene-index.json');
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  const seal = {
    version: 1,
    lockId: ANIMATION_QUALITY_LOCK,
    createdAt: new Date().toISOString(),
    reelProject: repoPath(reelRoot),
    sceneIndexSha256: sha256File(indexPath),
    sources: [{
      id: 'scene-02',
      animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
      animationExport: 'Scene02Animation',
      sha256: sha256File(animationSource),
    }],
  };
  writeFileSync(join(reelRoot, PHASE1_ANIMATION_SEAL_RELATIVE), `${JSON.stringify(seal, null, 2)}\n`);

  const manifest = createPhase3ManifestSkeleton(reelRoot, {
    composition: 'TestReel',
    entryPoint: repoPath(entryPoint),
    output: 'out/test-reel.mp4',
  });
  manifest.compositionSourcePath = repoPath(compositionSource);
  manifest.status = 'READY_TO_RENDER';
  manifest.globalLayers = {
    audioImplemented: true,
    captionsImplemented: true,
    sceneHeadersImplemented: true,
  };
  manifest.scenes[0] = {
    ...manifest.scenes[0],
    implemented: true,
    startFrame: 0,
    durationFrames: 30,
    assetPath: repoPath(imageAsset),
  };
  manifest.scenes[1] = {
    ...manifest.scenes[1],
    implemented: true,
    startFrame: 30,
    durationFrames: 30,
  };
  writeFileSync(join(reelRoot, PHASE3_MANIFEST_RELATIVE), `${JSON.stringify(manifest, null, 2)}\n`);

  return {tempRoot, reelRoot, manifest, animationSource};
};

test('Phase-3-Completion-Contract aktiviert alle harten Gates', () => {
  const contract = phase3CompletionContractFields();
  assert.equal(contract.required, true);
  assert.equal(contract.allScenesMustBeImplemented, true);
  assert.equal(contract.captionOnlySceneForbidden, true);
  assert.equal(contract.postRenderVisualQaRequired, true);
  assert.equal(contract.exportRequiresPassedRenderQa, true);
  assert.equal(contract.exactVideoHashRequiredForExport, true);
  assert.equal(contract.finalVideoExistsOnlyAfterQaPass, true);
  assert.equal(contract.canonicalPhase1AnimationRequired, true);
  assert.equal(contract.phase3MayNotReplaceCanonicalAnimation, true);
  assert.equal(contract.phase1AnimationHashMustMatchSeal, true);
});

test('vollständig belegtes Produktionsmanifest besteht den Phase-3-Preflight', () => {
  const fixture = buildFixture();
  try {
    const result = validatePhase3Manifest(fixture.reelRoot);
    assert.equal(result.scenes.length, 2);
    assert.equal(result.totalFrames, 60);
  } finally {
    rmSync(fixture.tempRoot, {recursive: true, force: true});
  }
});

test('fehlende Animationsimplementierung blockiert Phase 3', () => {
  const fixture = buildFixture();
  try {
    fixture.manifest.scenes[1].implemented = false;
    writeFileSync(join(fixture.reelRoot, PHASE3_MANIFEST_RELATIVE), `${JSON.stringify(fixture.manifest, null, 2)}\n`);
    assert.throws(() => validatePhase3Manifest(fixture.reelRoot), /implemented=true/);
  } finally {
    rmSync(fixture.tempRoot, {recursive: true, force: true});
  }
});

test('Timeline-Lücke blockiert Phase 3', () => {
  const fixture = buildFixture();
  try {
    fixture.manifest.scenes[1].startFrame = 45;
    writeFileSync(join(fixture.reelRoot, PHASE3_MANIFEST_RELATIVE), `${JSON.stringify(fixture.manifest, null, 2)}\n`);
    assert.throws(() => validatePhase3Manifest(fixture.reelRoot), /nicht lückenlos/);
  } finally {
    rmSync(fixture.tempRoot, {recursive: true, force: true});
  }
});

test('Phase 3 darf versiegelten Animationscode nicht verändern', () => {
  const fixture = buildFixture();
  try {
    writeFileSync(fixture.animationSource, `${readFileSync(fixture.animationSource, 'utf8')}\n// nachträgliche Änderung\n`);
    assert.throws(() => validatePhase3Manifest(fixture.reelRoot), /nach reel:ready verändert/);
  } finally {
    rmSync(fixture.tempRoot, {recursive: true, force: true});
  }
});
