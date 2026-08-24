import assert from 'node:assert/strict';
import test from 'node:test';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields} from '../scripts/lib/flow-autonomy.mjs';

test('Flow-Autonomievertrag verbietet Batch und erzwingt Concurrency 1', () => {
  assert.match(AUTONOMY_BLOCK, /DIES IST KEIN BATCH-AUFTRAG/);
  assert.match(AUTONOMY_BLOCK, /MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG/);
  assert.match(AUTONOMY_BLOCK, /ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT/);
  assert.doesNotMatch(FLOW_AGENT_BLOCK, /Lies die gesamte Datei einmal/);
  assert.match(FLOW_AGENT_BLOCK, /MAX_CONCURRENT_GENERATIONS = 1/);
  assert.match(FLOW_AGENT_BLOCK, /mehrere Bilder in einem Generierungsaufruf/);
  assert.match(FLOW_AGENT_BLOCK, /alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen/);
});

test('scene-index Flow-Felder bilden das Single-Job-Gate maschinenlesbar ab', () => {
  const flow = flowAutonomyFields();
  assert.equal(flow.maxConcurrentGenerations, 1);
  assert.equal(flow.batchGenerationForbidden, true);
  assert.equal(flow.multiImageRequestForbidden, true);
  assert.equal(flow.queueLaterImagesForbidden, true);
  assert.equal(flow.currentStepGateRequired, true);
  assert.equal(flow.nextStepLockedUntilCurrentResultReturned, true);
  assert.equal(flow.renameBeforeUnlockNext, true);
  assert.equal(flow.qaBeforeUnlockNext, true);
});
