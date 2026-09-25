import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const runCreator = (args: string[]) => spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-youtube-mode.mjs'),
  ...args,
], {encoding: 'utf8'});

test('Phase A with visual-count keeps the framed 3D layout and disables animation', () => {
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
    assert.equal(index.productionMode.semanticName, 'phase-a-static');
    assert.equal(index.productionMode.animationDisabledOnly, true);
    assert.equal(index.productionMode.staticImageVisualsOnly, false);
    assert.equal(index.productionMode.staticSceneLayoutRequired, true);
    assert.equal(index.productionMode.staticLayoutAssemblyAllowed, true);
    assert.equal(index.productionMode.staticRemotionExplainerVisualsAllowed, true);
    assert.equal(index.productionMode.staticDataVisualsAllowed, true);
    assert.equal(index.productionMode.remotionAnimationAllowed, false);
    assert.deepEqual(index.productionMode.allowedVisualTypes, ['image', 'hybrid', 'data', 'real-asset']);
    assert.deepEqual(index.productionMode.forbiddenVisualTypes, ['animation']);
    assert.equal(index.layoutContract.sceneHeadingRequired, true);
    assert.equal(index.layoutContract.sceneIconRequired, true);
    assert.equal(index.layoutContract.flowImageFullscreenForbidden, true);
    assert.equal(index.layoutContract.flowImagePlacement, 'contained-visual-window');
    assert.equal(index.phaseA.imageWorldUnchanged, true);
    assert.equal(index.phaseA.imageWorldId, 'finanzneo-youtube-grounded-3d-black-v1');
    assert.equal(index.visuals.length, 3);
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'image', 'image']);
    assert.deepEqual(index.visuals.map((visual: {phaseAVisualKind: string}) => visual.phaseAVisualKind), ['3d-story', '3d-story', '3d-story']);

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
      assert.match(prompt, /STATIC_REMOTION_OVERLAY:/i);
      assert.match(prompt, /static video layout owns exact explanatory text and numbers/i);
    }

    const staticPlan = readFileSync(resolve(absolute, '06-projektdateien/remotion-plan.md'), 'utf8');
    assert.match(staticPlan, /Animation deaktiviert/i);
    assert.match(staticPlan, /StaticNumber/i);
    assert.match(staticPlan, /Mini-Charts/i);
    assert.match(staticPlan, /Flow-Bilder dürfen niemals fullscreen/i);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});

test('Phase A accepts mixed static image hybrid data and real-asset scenes but forbids animation type', () => {
  const target = `youtube/.tmp-phase-a-mixed-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = runCreator([
      '--mode', 'images-only',
      '--target', target,
      '--title', 'Phase A Mixed Test',
      '--types', 'image,hybrid,data,real-asset',
    ]);
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.deepEqual(index.visuals.map((visual: {type: string}) => visual.type), ['image', 'hybrid', 'data', 'real-asset']);
    assert.deepEqual(
      index.visuals.map((visual: {phaseAVisualKind: string}) => visual.phaseAVisualKind),
      ['3d-story', '3d-explainer', 'static-data', 'real-asset'],
    );

    for (const position of [2, 3]) {
      const id = String(position).padStart(2, '0');
      const visual = index.visuals[position - 1];
      assert.equal(visual.animationDisabled, true);
      assert.equal(visual.motionPreset, 'STATIC');
      const source = readFileSync(resolve(absolute, `04-visuals/EINZELNE-VISUALS/visual-${id}/animation.tsx`), 'utf8');
      assert.match(source, /PHASE A STATIC/);
      assert.doesNotMatch(source, /useCurrentFrame\s*\(/);
      assert.doesNotMatch(source, /\binterpolate\s*\(/);
      assert.doesNotMatch(source, /\bspring\s*\(/);
      const plan = readFileSync(resolve(absolute, `04-visuals/EINZELNE-VISUALS/visual-${id}/remotion.md`), 'utf8');
      assert.match(plan, /MOTION_PRESET: STATIC/);
      assert.match(plan, /ANIMATION_DISABLED: true/);
    }

    const hybridPrompt = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/bildprompt.txt'), 'utf8');
    assert.match(hybridPrompt, /static Remotion overlays/i);
    assert.match(hybridPrompt, /negative-space/i);

    const forbiddenTarget = `youtube/.tmp-phase-a-forbidden-${process.pid}-${Date.now()}`;
    const forbiddenAbsolute = resolve(forbiddenTarget);
    try {
      const forbiddenRun = runCreator([
        '--mode', 'images-only',
        '--target', forbiddenTarget,
        '--title', 'Forbidden Animation Test',
        '--types', 'image,animation',
      ]);
      assert.notEqual(forbiddenRun.status, 0);
      assert.match(forbiddenRun.stderr || forbiddenRun.stdout, /Phase A erlaubt nur statische Typen/i);
    } finally {
      rmSync(forbiddenAbsolute, {recursive: true, force: true});
    }
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});

test('Phase A static design-system primitives contain no Remotion frame animation hooks', () => {
  const source = readFileSync(resolve('src/design-system/YouTubeStaticExplainers.tsx'), 'utf8');
  for (const name of ['StaticNumber', 'StaticArrow', 'StaticLabels', 'StaticCompare', 'StaticMiniChart']) {
    assert.match(source, new RegExp(`export const ${name}\\b`));
  }
  assert.doesNotMatch(source, /useCurrentFrame\s*\(/);
  assert.doesNotMatch(source, /\binterpolate\s*\(/);
  assert.doesNotMatch(source, /\bspring\s*\(/);
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
    const animationSource = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx'), 'utf8');
    assert.match(animationSource, /useCurrentFrame\s*\(/);
    assert.match(animationSource, /\binterpolate\s*\(/);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});
