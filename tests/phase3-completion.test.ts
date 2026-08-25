import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {
  PHASE3_MANIFEST_RELATIVE,
  createPhase3ManifestSkeleton,
  phase3CompletionContractFields,
  validatePhase3Manifest,
} from '../scripts/lib/phase3-completion.mjs';

const repoPath = (absolute: string) => relative(resolve('.'), absolute).replaceAll('\\', '/');

const buildFixture = () => {
  const tempRoot = mkdtempSync(resolve('.tmp-phase3-completion-'));
  const reelRoot = join(tempRoot, 'reel');
  const srcRoot = join(tempRoot, 'src');
  const assetRoot = join(tempRoot, 'assets');
  mkdirSync(join(reelRoot, '03-szenen'), {recursive: true});
  mkdirSync(join(reelRoot, '05-projektdateien'), {recursive: true});
  mkdirSync(srcRoot, {recursive: true});
  mkdirSync(assetRoot, {recursive: true});

  const entryPoint = join(srcRoot, 'index.ts');
  const compositionSource = join(srcRoot, 'Reel.tsx');
  const imageAsset = join(assetRoot, 'scene-01.png');
  writeFileSync(entryPoint, 'export const entry = true;\n');
  writeFileSync(compositionSource, [
    "import React from 'react';",
    'export const SceneTwoAnimation = () => <div>sichtbare Animation mit echtem Inhalt</div>;',
    'export const Reel = () => <main><SceneTwoAnimation /></main>;',
    'export const description = "Testquelle mit ausreichend Inhalt für den Produktions-Preflight";',
    '',
  ].join('\n'));
  writeFileSync(imageAsset, Buffer.alloc(256, 7));

  const index = {
    title: 'Test Reel',
    video: {fps: 30},
    phase3CompletionContract: phase3CompletionContractFields(),
    scenes: [
      {id: 'scene-01', type: 'image', googleFlowFileName: 'Bild 01 - Test.png'},
      {id: 'scene-02', type: 'animation'},
    ],
  };
  writeFileSync(join(reelRoot, '03-szenen/scene-index.json'), `${JSON.stringify(index, null, 2)}\n`);

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
    componentPath: repoPath(compositionSource),
    componentExport: 'SceneTwoAnimation',
  };
  writeFileSync(join(reelRoot, PHASE3_MANIFEST_RELATIVE), `${JSON.stringify(manifest, null, 2)}\n`);

  return {tempRoot, reelRoot, manifest};
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
