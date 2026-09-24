import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const runCreator = (args: string[]) => spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-youtube-mode.mjs'),
  ...args,
], {encoding: 'utf8'});

test('images-only mode creates static scenes with heading icon and contained Flow visual, but no animation files', () => {
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
    assert.equal(index.productionMode.staticSceneLayoutRequired, true);
    assert.equal(index.productionMode.staticLayoutAssemblyAllowed, true);
    assert.equal(index.productionMode.remotionExplainerVisualsAllowed, false);
    assert.equal(index.productionMode.remotionAnimationAllowed, false);
    assert.equal(index.layoutContract.sceneHeadingRequired, true);
    assert.equal(index.layoutContract.sceneIconRequired, true);
    assert.equal(index.layoutContract.flowImageFullscreenForbidden, true);
    assert.equal(index.layoutContract.flowImagePlacement, 'contained-visual-window');
    assert.equal(index.visuals.length, 3);
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'image', 'image']);

    const layoutContract = JSON.parse(readFileSync(resolve(absolute, '06-projektdateien/layout-contract.json'), 'utf8'));
    assert.equal(layoutContract.id, 'finanzneo-youtube-framed-scene-v1');
    assert.equal(layoutContract.sceneHeadingRequired, true);
    assert.equal(layoutContract.sceneIconRequired, true);
    assert.equal(layoutContract.flowImageFullscreenForbidden, true);
    assert.equal(layoutContract.headingAndIconOutsideFlowImage, true);

    for (let i = 1; i <= 3; i += 1) {
      const id = String(i).padStart(2, '0');
      const root = resolve(absolute, `04-visuals/EINZELNE-VISUALS/visual-${id}`);
      assert.equal(existsSync(resolve(root, 'bildprompt.txt')), true);
      assert.equal(existsSync(resolve(root, 'animation.tsx')), false);
      assert.equal(existsSync(resolve(root, 'remotion.md')), false);
      const prompt = readFileSync(resolve(root, 'bildprompt.txt'), 'utf8');
      assert.match(prompt, /VOICEOVER CONTEXT:/);
      assert.match(prompt, /VISUAL STORYTELLING:/);
      assert.match(prompt, /static layout assembler/i);
      assert.match(prompt, /contained visual window/i);
    }

    const staticPlan = readFileSync(resolve(absolute, '06-projektdateien/remotion-plan.md'), 'utf8');
    assert.match(staticPlan, /Animation deaktiviert/i);
    assert.match(staticPlan, /Überschrift \+ passendes Icon/i);
    assert.match(staticPlan, /niemals den kompletten Frame/i);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});

test('hybrid mode keeps the exact same framed layout but allows animation', () => {
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
    assert.equal(index.productionMode.staticSceneLayoutRequired, true);
    assert.equal(index.productionMode.remotionAnimationAllowed, true);
    assert.equal(index.layoutContract.sceneHeadingRequired, true);
    assert.equal(index.layoutContract.sceneIconRequired, true);
    assert.equal(index.layoutContract.flowImageFullscreenForbidden, true);
    assert.equal(index.layoutContract.flowImagePlacement, 'contained-visual-window');
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'animation', 'hybrid']);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-03/animation.tsx')), true);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});
