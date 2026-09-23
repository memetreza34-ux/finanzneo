#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  VISUAL_ROUTING_ID,
  buildVisualRoutingDecision,
} from './lib/visual-routing-v1.mjs';

const args = process.argv.slice(2);
const inputPath = args[0];
const outputFlag = args.indexOf('--output');
const outputPath = outputFlag === -1 ? null : args[outputFlag + 1];

if (!inputPath) {
  console.error('Nutzung: node scripts/plan-visual-routing-v1.mjs <routing-input.json> [--output <routing-plan.json>]');
  process.exit(1);
}

const input = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
if (!Array.isArray(input.scenes) || input.scenes.length === 0) {
  console.error('routing-input.json braucht ein nicht-leeres scenes-Array.');
  process.exit(1);
}

const decisions = input.scenes.map((scene, index) => {
  const id = String(scene.id ?? `scene-${String(index + 1).padStart(2, '0')}`);
  const text = String(scene.text ?? scene.voiceBeat ?? scene.headline ?? '');
  const decision = buildVisualRoutingDecision({
    text,
    exactTimeSeries: Boolean(scene.exactTimeSeries),
    exactNumericComparison: Boolean(scene.exactNumericComparison),
    exactAllocation: Boolean(scene.exactAllocation),
    exactTimeline: Boolean(scene.exactTimeline),
    moneyMovement: Boolean(scene.moneyMovement),
    comparison: Boolean(scene.comparison),
    humanNarrativeValue: Boolean(scene.humanNarrativeValue),
  });

  const source = String(scene.dataSource ?? '').trim();
  const asOf = String(scene.dataAsOf ?? '').trim();
  const dataReady = !decision.exactDataRequired || (source && asOf);

  return {
    id,
    text,
    ...decision,
    dataSource: source || null,
    dataAsOf: asOf || null,
    status: dataReady ? 'READY' : 'BLOCKED_MISSING_SOURCE',
    routeReason: String(scene.routeReason ?? '').trim() || null,
  };
});

const result = {
  contract: VISUAL_ROUTING_ID,
  title: String(input.title ?? 'FinanzNeo Visual Routing Plan'),
  generatedFrom: inputPath,
  rules: {
    peopleAreOptional: true,
    humanIsNeverDefaultFallback: true,
    exactDataUsesRemotion: true,
    generatedConceptsUseGoogleFlow: true,
    imageXorAnimationRemainsRequired: true,
  },
  counts: {
    scenes: decisions.length,
    googleFlow: decisions.filter((d) => d.engine === 'google-flow').length,
    remotion: decisions.filter((d) => d.engine === 'remotion').length,
    blocked: decisions.filter((d) => d.status !== 'READY').length,
  },
  scenes: decisions,
};

const json = `${JSON.stringify(result, null, 2)}\n`;
if (outputPath) {
  writeFileSync(resolve(outputPath), json, 'utf8');
  console.log(`✓ Visual Routing Plan geschrieben: ${outputPath}`);
} else {
  process.stdout.write(json);
}

if (result.counts.blocked > 0) {
  console.error(`\n${result.counts.blocked} Datenvisual(s) blockiert: Quelle + Datenstand fehlen.`);
  process.exitCode = 2;
}
