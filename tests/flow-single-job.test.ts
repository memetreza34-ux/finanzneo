import assert from 'node:assert/strict';
import test from 'node:test';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, STYLE_ANCHOR_NOTE, flowAutonomyFields} from '../scripts/lib/flow-autonomy.mjs';

test('Flow-Autonomievertrag macht scene-01 zum Style-Anker und begrenzt Bloecke auf fuenf', () => {
  assert.match(AUTONOMY_BLOCK, /SZENE 01 IST DER STYLE-ANKER/);
  assert.match(AUTONOMY_BLOCK, /SOLANGE DER ANKER DIE QA NICHT BESTANDEN HAT, IST JEDER WEITERE BILDBLOCK GESPERRT/);
  assert.match(AUTONOMY_BLOCK, /BLOECKEN VON HOECHSTENS 5 BILDERN/);
  assert.match(AUTONOMY_BLOCK, /MUSS DEN STYLE-ANKER ALS REFERENZ MITGEBEN/);
  assert.match(AUTONOMY_BLOCK, /KEINE REFERENZ AUF IRGENDEIN ANDERES BILD ALS DEN ANKER/);
  assert.doesNotMatch(FLOW_AGENT_BLOCK, /Lies die gesamte Datei einmal/);
  assert.match(FLOW_AGENT_BLOCK, /mehr als 5 Bilder in einem Block/);
  assert.match(FLOW_AGENT_BLOCK, /einen Block starten, bevor der Anker die QA bestanden hat/);
  assert.match(FLOW_AGENT_BLOCK, /alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen/);
});

test('scene-index Flow-Felder bilden das Style-Anker-Gate maschinenlesbar ab', () => {
  const flow = flowAutonomyFields();
  assert.equal(flow.styleAnchorSceneId, 'scene-01');
  assert.equal(flow.styleAnchorRequiredForEveryImage, true);
  assert.equal(flow.styleAnchorMustPassQaBeforeBlocks, true);
  assert.equal(flow.maxImagesPerBlock, 5);
  assert.equal(flow.referenceAnyOtherImageForbidden, true);
  assert.equal(flow.anchorMatchQaRequired, true);
  assert.equal(flow.multiImageRequestForbidden, true);
  assert.equal(flow.queueLaterImagesForbidden, true);
  assert.equal(flow.currentStepGateRequired, true);
  assert.equal(flow.nextStepLockedUntilCurrentResultReturned, true);
  assert.equal(flow.renameBeforeUnlockNext, true);
  assert.equal(flow.qaBeforeUnlockNext, true);
});

test('Der Style-Anker uebertraegt nur den Look, niemals die Szene', () => {
  assert.match(AUTONOMY_BLOCK, /DER ANKER IST EINE STILREFERENZ UND KEINE BILDVORLAGE/);
  assert.match(AUTONOMY_BLOCK, /DER ANKER BESTIMMT NIEMALS: SCHAUPLATZ, MOEBEL, KAMERAWINKEL/);
  assert.match(AUTONOMY_BLOCK, /KOPIERE NIEMALS DIE KOMPOSITION DES ANKERS/);
  assert.match(FLOW_AGENT_BLOCK, /uebernimm NICHT Schauplatz, Kamerawinkel, Moebel oder Requisiten/);
  assert.match(FLOW_AGENT_BLOCK, /die Komposition, den Schauplatz, den Kamerawinkel oder die Requisiten des Ankers/);
  assert.match(STYLE_ANCHOR_NOTE, /Der Anker ist NUR Stilreferenz/);
  assert.match(STYLE_ANCHOR_NOTE, /Vom Anker kommen NICHT Schauplatz, Kamerawinkel, Moebel und Requisiten/);
});

test('Szenenvarianz ist Teil des Flow-Vertrags und der QA', () => {
  assert.match(AUTONOMY_BLOCK, /SCENE_VARIANCE_LOCK: finanzneo-scene-variance-v1/);
  assert.match(AUTONOMY_BLOCK, /SZENENVARIANZ — VERBINDLICH/);
  assert.match(AUTONOMY_BLOCK, /JEDES BILD ZEIGT EINE SICHTBAR ANDERE SITUATION ALS DAS BILD DAVOR UND ALS DER ANKER/);
  assert.match(AUTONOMY_BLOCK, /VARIANZ-QA JE BILD/);
  assert.match(AUTONOMY_BLOCK, /OHNE ANKER-REFERENZ NUR MIT DEM GESCHRIEBENEN V9-LOCK NEU ERZEUGT/);
  assert.match(FLOW_AGENT_BLOCK, /Pruefe zusaetzlich die VARIANZ/);
  assert.match(FLOW_AGENT_BLOCK, /dieselbe Szenerie in mehreren Bildern wiederholen/);

  const flow = flowAutonomyFields();
  assert.equal(flow.styleAnchorTransfersStyleOnly, true);
  assert.equal(flow.styleAnchorCompositionCopyForbidden, true);
  assert.equal(flow.sceneVarianceLockId, 'finanzneo-scene-variance-v1');
  assert.equal(flow.sceneVarianceQaRequired, true);
  assert.equal(flow.repeatedSetDressingForbidden, true);
  assert.equal(flow.anchorFallbackWithoutReferenceAfterVarianceFail, true);
});
