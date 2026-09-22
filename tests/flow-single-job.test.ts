import assert from 'node:assert/strict';
import test from 'node:test';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields} from '../scripts/lib/flow-autonomy.mjs';

test('Flow-Autonomievertrag verbietet Batch und erzwingt Concurrency 1', () => {
  assert.match(AUTONOMY_BLOCK, /DIES IST KEIN BATCH-AUFTRAG/);
  assert.match(AUTONOMY_BLOCK, /MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG/);
  assert.match(AUTONOMY_BLOCK, /scene-01 IST ZUERST ZU ERZEUGEN/);
  assert.match(AUTONOMY_BLOCK, /NACH JEDEM BILD: VOLLSTÄNDIG WARTEN.*ERST DANN NÄCHSTES BILD/);
  assert.match(AUTONOMY_BLOCK, /POST_GENERATION_VISION_QA: finanzneo-image-vision-qa-v1/);
  assert.match(AUTONOMY_BLOCK, /SHA-256-HASH/i);
  assert.doesNotMatch(FLOW_AGENT_BLOCK, /Lies die gesamte Datei einmal/);
  assert.match(FLOW_AGENT_BLOCK, /Starte genau EINEN Bildgenerierungsjob/);
  assert.match(FLOW_AGENT_BLOCK, /Keine Queue und kein Paralleljob/);
  assert.match(FLOW_AGENT_BLOCK, /reel:image-vision:prepare/);
  assert.match(FLOW_AGENT_BLOCK, /reel:image-vision:validate/);
  assert.match(FLOW_AGENT_BLOCK, /tatsächliche Bilddatei/);
  assert.match(FLOW_AGENT_BLOCK, /QA-PASS ohne Sichtprüfung der echten Bildpixel/);
  assert.match(FLOW_AGENT_BLOCK, /mehrere Bilder in einem Generierungsaufruf/);
  assert.match(FLOW_AGENT_BLOCK, /alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen/);
});

test('scene-index Flow-Felder bilden Single-Job plus Pixel-Vision-Gate maschinenlesbar ab', () => {
  const flow = flowAutonomyFields();
  assert.equal(flow.maxConcurrentGenerations, 1);
  assert.equal(flow.batchGenerationForbidden, true);
  assert.equal(flow.multiImageRequestForbidden, true);
  assert.equal(flow.queueLaterImagesForbidden, true);
  assert.equal(flow.currentStepGateRequired, true);
  assert.equal(flow.nextStepLockedUntilCurrentResultReturned, true);
  assert.equal(flow.renameBeforeUnlockNext, true);
  assert.equal(flow.qaBeforeUnlockNext, true);
  assert.equal(flow.postGenerationVisionQaId, 'finanzneo-image-vision-qa-v1');
  assert.equal(flow.postGenerationVisionQaRequired, true);
  assert.equal(flow.multimodalPixelInspectionRequired, true);
  assert.equal(flow.promptOnlyQaForbidden, true);
  assert.equal(flow.visionQaBoundToImageSha256, true);
  assert.equal(flow.nextStepLockedUntilVisionQaPass, true);
  assert.equal(flow.regenerateSameSceneOnVisionQaFail, true);
  assert.equal(flow.coverAnchorFlowId, 'finanzneo-cover-anchor-flow-v1');
  assert.equal(flow.coverAnchorSourceSceneId, 'scene-01');
  assert.equal(flow.coverAnchorQaPassRequiredBeforeFollowups, true);
  assert.equal(flow.followupPlanBlockSize, 5);
  assert.equal(flow.followupGenerationStillSingleJob, true);
  assert.equal(flow.approvedCoverImageReferenceRequiredForFollowups, true);
  assert.equal(flow.onlyCoverMayBePersistentGenerationReference, true);
});
