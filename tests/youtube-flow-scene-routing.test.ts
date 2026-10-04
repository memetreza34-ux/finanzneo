import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('YouTube Flow bleibt szenenbasiert und Präzisionsgrafiken gehören Remotion', () => {
  const wrapper = read('scripts/create-finanzneo-youtube.mjs');
  const world = read('config/finanzneo-image-worlds/finanzneo-youtube-v9-front-readable-v2.txt');
  const standard = read('youtube/PRODUKTIONSSTANDARD.md');

  for (const source of [wrapper, world]) {
    assert.match(source, /scene-first/i);
    assert.match(source, /Remotion/);
    assert.doesNotMatch(source, /SIMPLE EXPLAINER/i);
  }

  assert.match(standard, /Google Flow ist kein Infografik-Generator/);
  assert.match(standard, /Remotion/);
  assert.doesNotMatch(standard, /SIMPLE EXPLAINER/i);

  assert.match(wrapper, /PRECISION_GRAPHICS_OWNER: REMOTION/);
  assert.match(wrapper, /editorial-3d-illustration/);
  assert.doesNotMatch(wrapper, /number-focus|quote-card|ui-example|symbol-focus/);

  assert.match(world, /FLOW_IMAGE_POLICY: scene-first-no-infographic-v1/);
  assert.match(world, /flat infographic/i);
  assert.match(world, /checklist/i);
  assert.match(world, /settings|UI/i);
  assert.match(world, /progress bar/i);

  assert.match(standard, /exakte Zahlenaufteilung/i);
  assert.match(standard, /UI-\/Settings-Zustand/i);
});
