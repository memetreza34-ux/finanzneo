import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('Visual DNA config and router expose the same core image families', () => {
  const config = JSON.parse(read('config/finanzneo-visual-dna-v1.json'));
  const router = read('scripts/lib/visual-routing-v1.mjs');

  for (const route of [
    'single-object-image',
    'money-flow-image',
    'comparison-image',
    'pressure-problem-image',
    'protection-buffer-image',
    'human-context-image',
  ]) {
    assert.ok(config.routes.includes(route), `${route} fehlt in Visual-DNA-Config`);
    assert.ok(router.includes(`'${route}'`), `${route} fehlt im Router`);
  }
});

test('precise data routes are kept in Remotion with source metadata', () => {
  const plan = JSON.parse(read('experiments/visual-dna-remotion-demo-v1/VISUAL-ROUTING-PLAN.json'));
  const exact = plan.scenes.filter((scene: {exactDataRequired: boolean}) => scene.exactDataRequired);

  assert.equal(exact.length, 2);
  for (const scene of exact) {
    assert.equal(scene.engine, 'remotion');
    assert.equal(scene.sceneType, 'animation');
    assert.ok(scene.dataSource);
    assert.ok(scene.dataAsOf);
    assert.equal(scene.status, 'READY');
  }
});

test('mixed demo is registered as an experiment composition', () => {
  const registry = read('src/root/ExperimentCompositions.tsx');
  const demo = read('src/reels-test/VisualDnaRemotionDemo.tsx');

  assert.match(registry, /id="VisualDnaRemotionDemo"/);
  assert.match(demo, /FinanceDataVisual/);
  assert.match(demo, /sp500-10y\.json/);
  assert.match(demo, /ROUTING DEMO · NICHT PRODUKTION/);
});

test('demo keeps people optional rather than the default visual', () => {
  const plan = JSON.parse(read('experiments/visual-dna-remotion-demo-v1/VISUAL-ROUTING-PLAN.json'));
  const humanScenes = plan.scenes.filter((scene: {route: string}) => scene.route === 'human-context-image');
  assert.equal(humanScenes.length, 1);
  assert.equal(plan.counts.scenes, 6);
});
