#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  COVER_ANCHOR_BLOCK_SIZE,
  COVER_ANCHOR_FLOW_ID,
  COVER_ANCHOR_OUTPUT_DIR,
  assignCoverAnchorSlots,
} from './lib/cover-anchor-flow-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-cover-anchor-flow-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.coverAnchorFlow;
if (!contract) {
  console.log('✓ Legacy-Reel ohne Cover Anchor Flow; übersprungen.');
  process.exit(0);
}

const errors = [];
if (contract.id !== COVER_ANCHOR_FLOW_ID) errors.push(`coverAnchorFlow.id muss ${COVER_ANCHOR_FLOW_ID} sein.`);
if (contract.sourceSceneId !== 'scene-01') errors.push('sourceSceneId muss scene-01 sein.');
if (contract.blockSize !== COVER_ANCHOR_BLOCK_SIZE) errors.push(`blockSize muss ${COVER_ANCHOR_BLOCK_SIZE} sein.`);
if (contract.unifiedOutputDirectory !== COVER_ANCHOR_OUTPUT_DIR) errors.push(`unifiedOutputDirectory muss ${COVER_ANCHOR_OUTPUT_DIR} sein.`);
for (const key of [
  'firstSceneIsCoverAndMasterAnchor',
  'anchorMustPassVisionQaBeforeFollowups',
  'anchorRequiresExplicitUserApproval',
  'followupsMustUseApprovedAnchorImageReference',
  'planningOccursInFiveImageBlocks',
  'followupBlocksAutoRunAfterUserApproval',
  'noFurtherUserConfirmationInsideFollowupBlocks',
  'automaticallyAdvanceToNextFollowupBlock',
  'generationRemainsStrictSingleJob',
  'renameImmediatelyAfterEachImage',
  'onlyScene01MayBePersistentGenerationReference',
]) if (contract[key] !== true) errors.push(`coverAnchorFlow.${key} muss true sein.`);

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
if (imageScenes[0]?.id !== 'scene-01') errors.push('scene-01 muss die erste IMAGE-Szene sein.');
const anchorFile = imageScenes[0]?.googleFlowFileName;
if (!anchorFile || contract.sourceFileName !== anchorFile) errors.push('sourceFileName muss exakt die scene-01-Bilddatei sein.');
if (index.cover?.sourceSceneId !== 'scene-01' || index.cover?.googleFlowFileName !== anchorFile) errors.push('Cover muss dieselbe Datei wie scene-01 verwenden.');

const expectedAssignments = new Map(assignCoverAnchorSlots(imageScenes).map((item) => [item.sceneId, item]));
for (const scene of imageScenes) {
  const expected = expectedAssignments.get(scene.id);
  const meta = scene.imageStorytelling ?? {};
  if (meta.coverAnchorRole !== expected.role) errors.push(`${scene.id}: coverAnchorRole muss ${expected.role} sein.`);
  if (meta.coverAnchorReferenceFile !== anchorFile) errors.push(`${scene.id}: coverAnchorReferenceFile muss ${anchorFile} sein.`);
  if (Number(meta.coverAnchorBlock) !== expected.block) errors.push(`${scene.id}: coverAnchorBlock muss ${expected.block} sein.`);
  if (Number(meta.coverAnchorBlockSlot) !== expected.slot) errors.push(`${scene.id}: coverAnchorBlockSlot muss ${expected.slot} sein.`);
  if (typeof scene.planFile === 'string') {
    const planPath = resolve(root, '03-szenen', scene.planFile.replace(/^03-szenen\//, ''));
    if (!existsSync(planPath)) errors.push(`${scene.id}: planFile fehlt.`);
    else {
      const source = readFileSync(planPath, 'utf8');
      for (const marker of ['COVER_ANCHOR_ROLE:', 'COVER_ANCHOR_REFERENCE_FILE:', 'COVER_ANCHOR_BLOCK:', 'COVER_ANCHOR_BLOCK_SLOT:']) {
        if (!source.includes(marker)) errors.push(`${scene.id}: ${marker} fehlt im Bildprompt.`);
      }
    }
  }
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) errors.push('alle-bildprompts.txt fehlt.');
else {
  const master = readFileSync(masterPath, 'utf8');
  for (const marker of [
    `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`,
    `COVER_ANCHOR_BLOCK_SIZE: ${COVER_ANCHOR_BLOCK_SIZE}`,
    `COVER_ANCHOR_OUTPUT_DIR: ${COVER_ANCHOR_OUTPUT_DIR}`,
    'COVER_ANCHOR_MANUAL_GATE: explicit-user-approval-after-scene-01',
    'COVER_ANCHOR_AUTORUN_AFTER_APPROVAL: true',
  ]) if (!master.includes(marker)) errors.push(`Masterprompt fehlt: ${marker}`);
}

const planPath = resolve(root, '05-projektdateien/COVER-ANCHOR-PLAN.md');
if (!existsSync(planPath)) errors.push('05-projektdateien/COVER-ANCHOR-PLAN.md fehlt.');
else {
  const plan = readFileSync(planPath, 'utf8');
  for (const marker of [
    'ausdrückliche Nutzerfreigabe',
    'Keine weitere Nutzerbestätigung',
    'automatisch der nächste 5er-Block',
  ]) if (!plan.includes(marker)) errors.push(`COVER-ANCHOR-PLAN.md fehlt Regel: ${marker}`);
}

if (errors.length) {
  console.error('\n✗ COVER ANCHOR FLOW NICHT BESTANDEN:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✓ Cover Anchor Flow PASS: ${COVER_ANCHOR_FLOW_ID}`);
console.log('✓ scene-01 wird zuerst allein erzeugt und braucht QA-PASS + ausdrückliche Nutzerfreigabe.');
console.log(`✓ Danach laufen Folge-Bilder automatisch in ${COVER_ANCHOR_BLOCK_SIZE}er-Blöcken weiter.`);
console.log('✓ Generierung bleibt strikt einzeln; keine weitere Nutzerbestätigung zwischen Folge-Bildern oder Folge-Blöcken erforderlich.');
