import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('latest YouTube video uses meaning-first free visual logic', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/validate-youtube-visual-freedom.mjs', 'youtube/2026-10-05_fuenf-euro-taeglich'],
    {encoding: 'utf8'},
  );

  assert.equal(
    result.status,
    0,
    `visual freedom validator failed:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
  );
});
