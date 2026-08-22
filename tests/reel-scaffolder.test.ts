import assert from 'node:assert/strict';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {REEL_FINAL_EXPORT, REEL_LAYOUT, REEL_VISUAL_MIX} from '../scripts/lib/reel-contract.mjs';

test('Reel-Scaffolder erzeugt den zentralen Premium-Produktionsvertrag', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-reel-scaffold-'));
  mkdirSync(join(root, 'reels'));

  try {
    const script = join(process.cwd(), 'scripts/scaffold-finanzneo-reel.mjs');
    const result = spawnSync(process.execPath, [
      script,
      '--target',
      'reels/contract-test',
      '--title',
      'Contract Test',
    ], {cwd: root, encoding: 'utf8'});

    assert.equal(result.status, 0, result.stderr);
    const index = JSON.parse(readFileSync(join(root, 'reels/contract-test/03-szenen/scene-index.json'), 'utf8'));
    assert.equal(index.imageSceneCount, 4);
    assert.equal(index.animationSceneCount, 6);
    assert.equal(index.visualMix.strategy, REEL_VISUAL_MIX.strategy);
    assert.equal(index.visualMix.actualAnimationShare, 0.6);
    assert.deepEqual(index.layout, REEL_LAYOUT);
    assert.equal(index.cover.type, 'image-with-remotion-text');
    assert.ok(index.cover.overlay.headline);
    assert.deepEqual(index.finalExport, REEL_FINAL_EXPORT);
    assert.equal(existsSync(join(root, 'reels/contract-test/06-export/README.md')), true);

    for (const scene of index.scenes.filter((entry: {type: string}) => entry.type === 'animation')) {
      assert.ok(scene.visualMetaphor);
      assert.ok(scene.startState);
      assert.ok(scene.action);
      assert.ok(scene.endState);
    }
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
