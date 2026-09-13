import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const imageScenePath = path.join(root, 'src/reels-test/FinanceImageSceneTest.tsx');
const registryPath = path.join(root, 'src/root/ExperimentCompositions.tsx');

const read = (file: string) => fs.readFileSync(file, 'utf8');

test('pure image scene uses image + header + captions as the complete structure', () => {
  const source = read(imageScenePath);

  assert.match(source, /<Img/);
  assert.match(source, /<SceneHeader/);
  assert.match(source, /<Captions/);
  assert.match(source, /background: '#000'/);
});

test('pure image scene does not add explanatory Remotion motion on top of the image', () => {
  const source = read(imageScenePath);

  assert.doesNotMatch(source, /useCurrentFrame/);
  assert.doesNotMatch(source, /interpolate\(/);
  assert.doesNotMatch(source, /spring\(/);
  assert.doesNotMatch(source, /LottieBox/);
  assert.doesNotMatch(source, /<svg/);
  assert.doesNotMatch(source, /transform:/);
});

test('pure image scene replaces the misunderstood hybrid composition in the experiment registry', () => {
  const registry = read(registryPath);

  assert.match(registry, /ReelsTestFinanceImageScenes/);
  assert.doesNotMatch(registry, /ReelsTestFinanceImageHybridMotion/);
});
