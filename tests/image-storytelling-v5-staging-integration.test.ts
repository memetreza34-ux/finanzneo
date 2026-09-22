import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

test('V5.1 Dynamic Staging ist in Create, Validate, Compiler und Production Standard verdrahtet', () => {
  const create = readFileSync('scripts/create-finanzneo-reel.mjs', 'utf8');
  const validate = readFileSync('scripts/validate-reel.mjs', 'utf8');
  const compiler = readFileSync('scripts/compile-future-image-prompts-v5.mjs', 'utf8');
  const production = JSON.parse(readFileSync('config/finanzneo-production-standard.json', 'utf8'));
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  assert.match(create, /apply-future-image-storytelling-v5-staging\.mjs/);
  assert.match(validate, /validate-future-image-storytelling-v5-staging\.mjs/);
  assert.match(compiler, /V5_STAGING_ID/);
  assert.equal(production.imageStorytelling.stagingId, 'finanzneo-image-storytelling-v5-staging-v1');
  assert.equal(production.imageStorytelling.stagingValidator, 'scripts/validate-future-image-storytelling-v5-staging.mjs');
  assert.equal(pkg.scripts['reel:image-storytelling:v5:staging'], 'node scripts/apply-future-image-storytelling-v5-staging.mjs');
  assert.equal(pkg.scripts['reel:image-storytelling:v5:validate-staging'], 'node scripts/validate-future-image-storytelling-v5-staging.mjs');
});

test('V9-Bildwelt bleibt von V5.1-Regie getrennt', () => {
  const world = readFileSync('config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt', 'utf8');
  assert.doesNotMatch(world, /finanzneo-image-storytelling-v5-staging-v1/);
  assert.match(world, /GENERATED_IMAGE_ASPECT_RATIO: 1:1/);
  assert.match(world, /deep black/i);
  assert.match(world, /Strict single-job state machine/i);
});
