import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const projects = [
  'youtube/2026-10-05_fuenf-euro-taeglich',
  'youtube/2026-10-06_billig-kaufen',
];

for (const project of projects) {
  test(`${project} obeys executable framed layout, header/icon and no-caption contract`, () => {
    const result = spawnSync(
      process.execPath,
      ['scripts/validate-youtube-layout.mjs', project],
      {encoding: 'utf8'},
    );

    assert.equal(
      result.status,
      0,
      `layout validator failed for ${project}:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
    );
  });
}
