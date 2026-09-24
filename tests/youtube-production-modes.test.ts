import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const runCreator = (args: string[]) => spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-youtube-mode.mjs'),
  ...args,
], {encoding: 'utf8'});

test('images-only mode creates static Flow visuals without Remotion animation files', () => {
  const target = `youtube/.tmp-images-only-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = runCreator([
      '--mode', 'images-only',
      '--target', target,
      '--title', 'Images Only Test',
      '--visual-count', '3',
    ]);
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.productionMode.id, 'images-only');
    assert.equal(index.productionMode.staticImageVisualsOnly, true);
    assert.equal(index.productionMode.remotionExplainerVisualsAllowed, false);
    assert.equal(index.visuals.length, 3);
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'image', 'image']);

    for (let i = 1; i <= 3; i += 1) {
      const id = String(i).padStart(2, '0');
      const root = resolve(absolute, `04-visuals/EINZELNE-VISUALS/visual-${id}`);
      assert.equal(existsSync(resolve(root, 'bildprompt.txt')), true);
      assert.equal(existsSync(resolve(root, 'animation.tsx')), false);
      assert.equal(existsSync(resolve(root, 'remotion.md')), false);
      const prompt = readFileSync(resolve(root, 'bildprompt.txt'), 'utf8');
      assert.match(prompt, /VOICEOVER CONTEXT:/);
      assert.match(prompt, /VISUAL STORYTELLING:/);
      assert.match(prompt, /No Remotion overlay/i);
    }

    const remotionPlan = readFileSync(resolve(absolute, '06-projektdateien/remotion-plan.md'), 'utf8');
    assert.match(remotionPlan, /deaktiviert/i);
    assert.match(remotionPlan, /images-only/);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});

test('hybrid mode preserves mixed image and motion visual types', () => {
  const target = `youtube/.tmp-hybrid-mode-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = runCreator([
      '--mode', 'hybrid',
      '--target', target,
      '--title', 'Hybrid Mode Test',
      '--types', 'image,animation,hybrid',
    ]);
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.productionMode.id, 'hybrid');
    assert.equal(index.productionMode.remotionAnimationAllowed, true);
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'animation', 'hybrid']);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-03/animation.tsx')), true);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});
