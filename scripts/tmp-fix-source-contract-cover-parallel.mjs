#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const patchFile = (path, replacements) => {
  let source = readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!source.includes(from)) throw new Error(`${path}: expected patch source missing: ${from.slice(0, 100)}`);
    source = source.replace(from, to);
  }
  writeFileSync(path, source, 'utf8');
};

patchFile('scripts/lib/flow-autonomy.mjs', [[
  "  autonomousFullRun: false,\n  autonomousAfterCoverSelection: true,\n  coverParallelGenerationRequired: true,",
  "  autonomousFullRun: false,\n  autonomousAfterCoverSelection: true,\n  generationMode: 'cover-parallel-then-scene-single',\n  strictSequential: false,\n  sceneGenerationMode: 'one-image-at-a-time',\n  sceneStrictSequential: true,\n  coverParallelGenerationRequired: true,",
]]);

patchFile('scripts/validate-reel-source-contract.mjs', [
  [
    "assert(googleFlow.generationMode === 'one-image-at-a-time', 'Google Flow muss one-image-at-a-time verwenden.');\nassert(googleFlow.strictSequential === true, 'Google Flow muss strikt sequenziell arbeiten.');\nassert(Number(googleFlow.maxConcurrentGenerations) === 1, 'Google Flow darf maximal einen laufenden Bildjob haben.');",
    "assert(googleFlow.generationMode === 'cover-parallel-then-scene-single', 'Google Flow muss Cover-parallel und danach Scene-single arbeiten.');\nassert(googleFlow.strictSequential === false, 'Global darf strictSequential wegen der parallelen Cover-Phase nicht true sein.');\nassert(googleFlow.coverParallelGenerationRequired === true, 'Cover A/B/C müssen parallel erzeugt werden.');\nassert(Number(googleFlow.coverConcurrentGenerations) === 3, 'Cover-Phase muss concurrency=3 verwenden.');\nassert(googleFlow.coverSeparateJobsRequired === true, 'Cover A/B/C müssen drei getrennte Jobs sein.');\nassert(googleFlow.sceneGenerationMode === 'one-image-at-a-time', 'Szenenbilder müssen one-image-at-a-time verwenden.');\nassert(googleFlow.sceneStrictSequential === true, 'Szenenbilder müssen strikt sequenziell arbeiten.');\nassert(Number(googleFlow.maxConcurrentGenerations) === 1, 'Nach der Cover-Auswahl darf maximal ein Szenenbildjob laufen.');",
  ],
  [
    "  assert(master.includes(`FLOW_EXECUTION_MODE: ${FLOW_EXECUTION_MODE_ID}`), 'Master-Prompt enthält Strict-Single-Job V3 nicht.');\n  assert(master.includes(`FLOW_STATE_MACHINE: ${FLOW_STATE_MACHINE_ID}`), 'Master-Prompt enthält die Flow-State-Machine nicht.');\n  assert(/MAX_CONCURRENT_GENERATIONS\\s*=\\s*1/.test(master) || /CONCURRENCY\\s*=\\s*1/.test(master), 'Master-Prompt begrenzt die Bildgenerierung nicht auf concurrency=1.');",
    "  assert(master.includes(`FLOW_EXECUTION_MODE: ${FLOW_EXECUTION_MODE_ID}`), 'Master-Prompt enthält den aktuellen Cover-parallel/Scene-single-Modus nicht.');\n  assert(master.includes(`FLOW_STATE_MACHINE: ${FLOW_STATE_MACHINE_ID}`), 'Master-Prompt enthält die Flow-State-Machine nicht.');\n  assert(master.includes('FLOW_COVER_CONCURRENCY: 3'), 'Master-Prompt muss die drei Cover-Jobs parallel erlauben.');\n  assert(master.includes('FLOW_SCENE_CONCURRENCY: 1'), 'Master-Prompt muss Szenenbilder nach der Cover-Wahl auf concurrency=1 begrenzen.');",
  ],
  [
    "notes.push(`Google Flow geprüft: ${FLOW_EXECUTION_MODE_ID} · concurrency=1.`);",
    "notes.push(`Google Flow geprüft: ${FLOW_EXECUTION_MODE_ID} · Cover concurrency=3 · Scene concurrency=1.`);",
  ],
]);

console.log('✓ Source-Vertrag auf Cover parallel=3 / Szenenbilder sequential=1 aktualisiert.');
