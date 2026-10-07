import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
  EDITORIAL_IMAGE_WORLD_ID,
  EDITORIAL_MOTION_LIBRARY_ID,
  EDITORIAL_MOTION_LOCK,
  editorialMotionContractFields,
} from '../scripts/lib/editorial-motion-contract.mjs';

test('Editorial Motion V1 targets the new Editorial Finance image world', () => {
  const contract = editorialMotionContractFields();
  assert.equal(EDITORIAL_MOTION_LOCK, 'finanzneo-editorial-motion-v1');
  assert.equal(EDITORIAL_MOTION_LIBRARY_ID, 'finanzneo-editorial-motion-library-v1');
  assert.equal(EDITORIAL_IMAGE_WORLD_ID, 'finanzneo-editorial-finance-v1');
  assert.equal(contract.visualTargetWorld, EDITORIAL_IMAGE_WORLD_ID);
  assert.equal(contract.editorialTwoDPreferred, true);
  assert.equal(contract.fixed3DStyleForbidden, true);
  assert.equal(contract.flexibleAnimationSurface, true);
  assert.equal(contract.pureBlackAnimationSurfaceRequired, false);
  assert.equal(contract.minimumMotionNeededPreferred, true);
  assert.equal(contract.onePrimaryChangeMayBeEnough, true);
  assert.equal(contract.multipleMotionChannelsRequired, false);
  assert.equal(contract.cameraMovementRequired, false);
  assert.equal(contract.defaultCameraRole, 'still');
});

test('new Editorial Motion does not require retired Physical primitives', () => {
  const contract = editorialMotionContractFields();
  assert.equal(contract.requirePremiumPhysicalStage, false);
  assert.equal(contract.requirePhysicalObjects, false);
  assert.equal(contract.physicalObjectsOptional, true);
  assert.equal(contract.materialDepthLightingRequired, false);

  const library = readFileSync('src/finance-motion/editorial-v1.tsx', 'utf8');
  assert.match(library, /EDITORIAL_FINANCE_MOTION_REGISTRY/);
  assert.match(library, /EditorialMotionStage/);
  assert.doesNotMatch(library, /PremiumPhysicalStage/);
  assert.doesNotMatch(library, /<Physical(?:Object|Tag|Rail|Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack)\b/);
});

test('new Reel creation applies Editorial Motion instead of Premium Physical Motion', () => {
  const create = readFileSync('scripts/create-finanzneo-reel.mjs', 'utf8');
  assert.match(create, /apply-editorial-motion-v1\.mjs/);
  assert.doesNotMatch(create, /\['scripts\/apply-premium-animation-v2\.mjs', \[target\]\]/);
});

test('Editorial Motion library includes simple finance and metaphor mechanisms', () => {
  const library = readFileSync('src/finance-motion/editorial-v1.tsx', 'utf8');
  for (const id of [
    'money-transfer',
    'value-growth',
    'loan-paydown',
    'finance-timeline',
    'mountain-progress',
    'document-cost-increase',
  ]) {
    assert.match(library, new RegExp("id:'" + id + "'"));
  }
});
