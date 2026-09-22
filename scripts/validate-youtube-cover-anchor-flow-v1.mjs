#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {COVER_ANCHOR_BLOCK_SIZE, COVER_ANCHOR_FLOW_ID, assignCoverAnchorSlots} from './lib/cover-anchor-flow-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-youtube-cover-anchor-flow-v1.mjs <YouTube-Projekt>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '04-visuals/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-visuals/visual-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.coverAnchorFlow;
if (!contract) {
  console.log('✓ Legacy-YouTube-Projekt ohne Cover Anchor Flow; übersprungen.');
  process.exit(0);
}

const errors = [];
if (contract.id !== COVER_ANCHOR_FLOW_ID) errors.push(`coverAnchorFlow.id muss ${COVER_ANCHOR_FLOW_ID} sein.`);
if (contract.blockSize !== COVER_ANCHOR_BLOCK_SIZE) errors.push(`blockSize muss ${COVER_ANCHOR_BLOCK_SIZE} sein.`);
for (const key of [
  'firstVisualIsMasterAnchor', 'anchorMustPassQaBeforeOtherGeneratedImages',
  'followupsMustUseApprovedAnchorImageReference', 'planningOccursInFiveImageBlocks',
  'generationRemainsStrictSingleJob', 'renameImmediatelyAfterEachImage',
  'thumbnailIsSeparatePublishingAsset', 'thumbnailMayUseApprovedAnchorForArtDirection',
  'onlyVisual01MayBePersistentGenerationReference',
]) if (contract[key] !== true) errors.push(`coverAnchorFlow.${key} muss true sein.`);

const visuals = Array.isArray(index.visuals) ? index.visuals : [];
const imageVisuals = visuals.filter((visual) => typeof visual?.googleFlowFileName === 'string' && visual.googleFlowFileName.trim());
if (imageVisuals.length && imageVisuals[0]?.id !== 'visual-01') errors.push('visual-01 muss das erste bildbasierte Video-Visual sein.');
if (imageVisuals.length) {
  const anchorFile = imageVisuals[0].googleFlowFileName;
  if (contract.sourceVisualId !== 'visual-01') errors.push('sourceVisualId muss visual-01 sein.');
  if (contract.sourceFileName !== anchorFile) errors.push('sourceFileName muss exakt die visual-01-Datei sein.');
  const expected = new Map(assignCoverAnchorSlots(imageVisuals.map((visual) => ({id: visual.id}))).map((item) => [item.sceneId, item]));
  for (const visual of imageVisuals) {
    const assignment = expected.get(visual.id);
    const anchor = visual.coverAnchor ?? {};
    if (anchor.role !== assignment.role) errors.push(`${visual.id}: coverAnchor.role muss ${assignment.role} sein.`);
    if (anchor.referenceFile !== anchorFile) errors.push(`${visual.id}: coverAnchor.referenceFile muss ${anchorFile} sein.`);
    if (Number(anchor.block) !== assignment.block) errors.push(`${visual.id}: coverAnchor.block muss ${assignment.block} sein.`);
    if (Number(anchor.blockSlot) !== assignment.slot) errors.push(`${visual.id}: coverAnchor.blockSlot muss ${assignment.slot} sein.`);
  }
}

const masterPath = resolve(root, '04-visuals/alle-bildprompts.txt');
if (!existsSync(masterPath)) errors.push('04-visuals/alle-bildprompts.txt fehlt.');
else {
  const master = readFileSync(masterPath, 'utf8');
  for (const marker of [
    'COVER ANCHOR FLOW V1 — EXECUTION ORDER OVERRIDE',
    `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`,
    `FOLLOWUP_PLAN_BLOCK_SIZE: ${COVER_ANCHOR_BLOCK_SIZE}`,
  ]) if (!master.includes(marker)) errors.push(`YouTube-Masterprompt fehlt: ${marker}`);
}
if (!existsSync(resolve(root, '06-projektdateien/COVER-ANCHOR-PLAN.md'))) errors.push('06-projektdateien/COVER-ANCHOR-PLAN.md fehlt.');

if (errors.length) {
  console.error('\n✗ YOUTUBE COVER ANCHOR FLOW NICHT BESTANDEN:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✓ YouTube Cover Anchor Flow PASS: ${COVER_ANCHOR_FLOW_ID}`);
console.log('✓ visual-01 ist Master-Referenz; Folge-Bildvisuals sind in 5er-Planblöcken organisiert und bleiben Einzeljobs.');
