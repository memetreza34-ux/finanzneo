import assert from 'node:assert/strict';
import test from 'node:test';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields} from '../scripts/lib/flow-autonomy.mjs';

test('Legacy-Reel-Flow nutzt 3 Cover parallel und danach Scene-Concurrency 1', () => {
  assert.match(AUTONOMY_BLOCK, /COVER-PARALLEL \+ SCENE-SINGLE-JOB/);
  assert.match(AUTONOMY_BLOCK, /COVER_CONCURRENCY = 3/);
  assert.match(AUTONOMY_BLOCK, /MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB/);
  assert.match(AUTONOMY_BLOCK, /5ER-BLOCK IST NIEMALS EIN 5-BILD-BATCH/);
  assert.match(FLOW_AGENT_BLOCK, /MAX_CONCURRENT_SCENE_GENERATIONS = 1/);
  assert.match(FLOW_AGENT_BLOCK, /fünf Bilder eines 5er-Blocks gleichzeitig starten/);
  assert.match(FLOW_AGENT_BLOCK, /alle Szenenbilder zuerst erzeugen und erst danach gesammelt umbenennen/);
});

test('Legacy-Reel scene-index bildet Cover-parallel und Scene-single maschinenlesbar ab', () => {
  const flow = flowAutonomyFields();
  assert.equal(flow.coverParallelGenerationRequired, true);
  assert.equal(flow.coverConcurrentGenerations, 3);
  assert.equal(flow.coverSeparateJobsRequired, true);
  assert.equal(flow.sceneMaxConcurrentGenerations, 1);
  assert.equal(flow.maxConcurrentGenerations, 1);
  assert.equal(flow.batchGenerationForbidden, true);
  assert.equal(flow.multiImageRequestForbidden, true);
  assert.equal(flow.queueLaterImagesForbidden, true);
  assert.equal(flow.renameBeforeUnlockNext, true);
  assert.equal(flow.qaBeforeUnlockNext, true);
});
