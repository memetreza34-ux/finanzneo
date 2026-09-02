import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {
  REEL_BACKGROUND_CONTRACT_ID,
  REEL_BACKGROUND_HEX,
  validateCentralReelBackgroundContract,
  validatePhase3CompositionBackgroundSource,
} from '../scripts/lib/reel-background-contract.mjs';

test('central Reel background remains static pure black', () => {
  assert.equal(REEL_BACKGROUND_CONTRACT_ID, 'finanzneo-pure-black-background-v1');
  assert.equal(REEL_BACKGROUND_HEX, '#000000');
  assert.deepEqual(validateCentralReelBackgroundContract(resolve('.')), []);
});

test('Phase-3 composition may not import particle/aurora/grid backgrounds', () => {
  const root = mkdtempSync(resolve('.tmp-background-contract-'));
  try {
    const safe = join(root, 'safe.tsx');
    writeFileSync(safe, `import React from 'react';\nexport const Reel = () => <div>content</div>;\n`);
    assert.deepEqual(validatePhase3CompositionBackgroundSource(safe), []);

    const bad = join(root, 'bad.tsx');
    writeFileSync(bad, `import {FNBgParticles} from './fn_backgrounds';\nexport const Reel = FNBgParticles;\n`);
    const errors = validatePhase3CompositionBackgroundSource(bad);
    assert.ok(errors.length > 0);
    assert.match(errors.join('\n'), /FNBgParticles|fn_backgrounds/);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
