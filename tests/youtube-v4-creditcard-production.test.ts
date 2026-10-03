import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import test from 'node:test';
import {analyzeYouTubeReadiness} from '../scripts/lib/youtube-readiness.mjs';

const target = 'youtube/2026-10-03_kreditkarten-teilzahlung';

const runNode = (script: string) => spawnSync(process.execPath, [resolve(script), target], {
  encoding: 'utf8',
});

test('Kreditkarten-Teilzahlung erfüllt YouTube V4 und Motion V3', () => {
  const contract = runNode('scripts/validate-youtube.mjs');
  assert.equal(contract.status, 0, `${contract.stdout}\n${contract.stderr}`);

  const motion = runNode('scripts/validate-youtube-animation-quality.mjs');
  assert.equal(motion.status, 0, `${motion.stdout}\n${motion.stderr}`);
});

test('Phase 1 des Kreditkarten-Videos hat keine Readiness-Blocker', () => {
  const result = analyzeYouTubeReadiness(target);
  assert.deepEqual(result.phase1Blockers, []);
  assert.ok(result.phase2Blockers.length > 0, 'Phase 2 muss vor echten Flow-Bildern, Voiceover und Wort-Timings gesperrt bleiben.');
});
