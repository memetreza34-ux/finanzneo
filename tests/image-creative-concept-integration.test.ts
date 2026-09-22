import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

test('Creative Concept V1 ist in Create, Validate, Compiler und Production Standard verdrahtet', () => {
  const create = readFileSync('scripts/create-finanzneo-reel.mjs', 'utf8');
  const validate = readFileSync('scripts/validate-reel.mjs', 'utf8');
  const compiler = readFileSync('scripts/compile-future-image-prompts-v5.mjs', 'utf8');
  const production = JSON.parse(readFileSync('config/finanzneo-production-standard.json', 'utf8'));
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  assert.match(create, /apply-image-creative-concept-v1\.mjs/);
  assert.match(validate, /validate-image-creative-concept-v1\.mjs/);
  assert.match(compiler, /IMAGE_CREATIVE_CONCEPT_ID/);
  assert.equal(production.imageStorytelling.creativeConceptId, 'finanzneo-image-creative-concept-v1');
  assert.equal(production.imageStorytelling.creativeConceptValidator, 'scripts/validate-image-creative-concept-v1.mjs');
  assert.equal(pkg.scripts['reel:image-creative:apply'], 'node scripts/apply-image-creative-concept-v1.mjs');
  assert.equal(pkg.scripts['reel:image-creative:validate'], 'node scripts/validate-image-creative-concept-v1.mjs');
});

test('Creative Concept V1 enthält keine alte Staging-Quota', () => {
  const apply = readFileSync('scripts/apply-image-creative-concept-v1.mjs', 'utf8');
  const validator = readFileSync('scripts/validate-image-creative-concept-v1.mjs', 'utf8');
  assert.doesNotMatch(apply, /minExplicitCauseEffectPerSixImages\s*:/);
  assert.doesNotMatch(apply, /maxImagesWithoutImpactComposition\s*:/);
  assert.doesNotMatch(validator, /mindestens 3.*Cause\/Effect/i);
  assert.match(apply, /singleIconicObjectAllowed: true/);
  assert.match(apply, /controlledFantasyAllowed: true/);
  assert.match(apply, /conceptTypeQuotaForbidden: true/);
});

test('V9-Bildwelt bleibt vom Creative Concept getrennt', () => {
  const world = readFileSync('config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt', 'utf8');
  assert.doesNotMatch(world, /finanzneo-image-creative-concept-v1/);
  assert.match(world, /GENERATED_IMAGE_ASPECT_RATIO: 1:1/);
  assert.match(world, /deep black/i);
  assert.match(world, /Strict single-job state machine/i);
});
