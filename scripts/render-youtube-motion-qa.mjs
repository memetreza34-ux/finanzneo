#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {isStaticYouTubeVisual, requiresYouTubeMotion} from './lib/youtube-motion-contract.mjs';

const YOUTUBE_MOTION_QUALITY_STANDARD_ID = 'finanzneo-youtube-motion-quality-v1';
const YOUTUBE_VISUAL_QA_STANDARD_ID = 'finanzneo-youtube-visual-qa-16x9-v1';
const STATES = [
  ['START', 0],
  ['25%', 0.25],
  ['50%', 0.5],
  ['75%', 0.75],
  ['RESULT HOLD', 1],
];

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith('--'));
const draft = args.includes('--draft');
if (!target) {
  console.error('Nutzung: npm run youtube:motion:qa -- youtube/<Projekt> [--draft]');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const indexPath = resolve(root, '04-visuals/visual-index.json');
const timelinePath = resolve(root, '06-projektdateien/timeline.json');
if (!existsSync(indexPath) || !existsSync(timelinePath)) {
  console.error('visual-index.json oder timeline.json fehlt.');
  process.exit(1);
}

const index = readJson(indexPath);
if (index?.phaseB?.motionQualityStandardId !== YOUTUBE_MOTION_QUALITY_STANDARD_ID) {
  console.log('✓ Projekt nutzt den neuen Motion-Quality-Standard nicht; keine Representative-Frame-QA nötig.');
  process.exit(0);
}
if (index?.phaseB?.visualQaStandardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) {
  console.error(`visualQaStandardId muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} sein.`);
  process.exit(1);
}

const timeline = readJson(timelinePath);
const timelineById = new Map((timeline?.visuals ?? []).map((visual) => [visual.id, visual]));
const visuals = (index?.visuals ?? []).filter(requiresYouTubeMotion).filter((visual) => !isStaticYouTubeVisual(visual));
if (visuals.length === 0) {
  console.log('✓ Keine animierten Visuals für Motion-QA vorhanden.');
  process.exit(0);
}

const prepared = visuals.map((visual, indexNumber) => {
  const timelineVisual = timelineById.get(visual.id);
  const timelineDuration = Number(timelineVisual?.durationFrames ?? 0);
  const durationInFrames = timelineDuration > 1 ? timelineDuration : (draft ? 120 : 0);
  if (durationInFrames <= 1) {
    console.error(`${visual.id}: timeline.durationFrames fehlt/ist 0. Erst finale Visual-Timings setzen oder für einen frühen Entwurf --draft verwenden.`);
    process.exit(1);
  }
  if (!visual.animationSourceFile || !visual.animationExport) {
    console.error(`${visual.id}: animationSourceFile/animationExport fehlt.`);
    process.exit(1);
  }
  const sourcePath = resolve(root, visual.animationSourceFile);
  if (!existsSync(sourcePath)) {
    console.error(`${visual.id}: Animationsquelle fehlt: ${sourcePath}`);
    process.exit(1);
  }
  const projectRelativeSource = relative(resolve('src'), sourcePath).split(sep).join('/').replace(/\.tsx$/, '');
  const importPath = projectRelativeSource.startsWith('.') ? projectRelativeSource : `./${projectRelativeSource}`;
  return {
    visual,
    alias: `QaVisual${indexNumber + 1}`,
    compositionId: `YouTubeMotionQa_${String(visual.id).replace(/[^A-Za-z0-9_-]/g, '_')}`,
    durationInFrames,
    importPath,
    timingSource: timelineDuration > 1 ? 'timeline' : 'draft-fallback-120',
  };
});

const entryPath = resolve('src/__youtube_motion_qa_entry.tsx');
const imports = prepared.map(({visual, alias, importPath}) => `import {${visual.animationExport} as ${alias}} from '${importPath}';`).join('\n');
const compositions = prepared.map(({alias, compositionId, durationInFrames}) => `    <Composition id="${compositionId}" component={${alias}} durationInFrames={${durationInFrames}} fps={30} width={1920} height={1080} />`).join('\n');
const entrySource = `import React from 'react';\nimport {Composition, registerRoot} from 'remotion';\n${imports}\n\nconst MotionQaRoot: React.FC = () => (\n  <>\n${compositions}\n  </>\n);\n\nregisterRoot(MotionQaRoot);\n`;

const qaRoot = resolve(root, '06-projektdateien/motion-qa-frames');
mkdirSync(qaRoot, {recursive: true});
writeFileSync(entryPath, entrySource);

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const manifest = {
  standardId: YOUTUBE_VISUAL_QA_STANDARD_ID,
  motionQualityStandardId: YOUTUBE_MOTION_QUALITY_STANDARD_ID,
  frameSize: {width: 1920, height: 1080, fps: 30},
  draft,
  visuals: [],
};

try {
  for (const item of prepared) {
    const visualDir = resolve(qaRoot, item.visual.id);
    mkdirSync(visualDir, {recursive: true});
    const renderedStates = [];

    for (const [name, ratio] of STATES) {
      const frame = ratio === 1
        ? Math.max(0, item.durationInFrames - 1)
        : Math.round((item.durationInFrames - 1) * ratio);
      const slug = name.toLowerCase().replace(/%/g, 'pct').replace(/\s+/g, '-');
      const output = resolve(visualDir, `${slug}.png`);
      rmSync(output, {force: true});
      const rendered = spawnSync(npx, [
        'remotion',
        'still',
        entryPath,
        item.compositionId,
        output,
        `--frame=${frame}`,
        '--log=error',
      ], {stdio: 'inherit'});
      if (rendered.status !== 0) {
        console.error(`Motion-QA-Render fehlgeschlagen: ${item.visual.id} · ${name}`);
        process.exit(rendered.status ?? 1);
      }
      renderedStates.push({name, ratio, frame, file: relative(root, output).split(sep).join('/')});
    }

    manifest.visuals.push({
      id: item.visual.id,
      type: item.visual.type,
      durationInFrames: item.durationInFrames,
      timingSource: item.timingSource,
      states: renderedStates,
    });
  }
} finally {
  rmSync(entryPath, {force: true});
}

const manifestPath = resolve(root, '06-projektdateien/motion-qa-manifest.json');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

// Jeder neue Render invalidiert eine alte Freigabe. Dadurch kann ein PASS nie
// versehentlich auf geänderte Animationsframes übertragen werden.
const reviewPath = resolve(root, '06-projektdateien/motion-qa-review.json');
const review = {
  standardId: YOUTUBE_VISUAL_QA_STANDARD_ID,
  motionQualityStandardId: YOUTUBE_MOTION_QUALITY_STANDARD_ID,
  instructions: 'Alle fünf neu gerenderten Frames visuell prüfen. PASS erst setzen, wenn jede Pflichtprüfung true ist.',
  visuals: prepared.map(({visual}) => ({
    id: visual.id,
    status: 'PENDING',
    checks: {
      startResultDifferent: false,
      mechanismReadable: false,
      safeArea: false,
      noClipping: false,
      resultReadable: false,
      financeValuesVerified: false,
      staticAlternativeRechecked: false,
      adjacentVariety: false,
    },
    note: '',
  })),
};
writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);

console.log(`\n✓ Motion-QA-Frames gerendert: ${prepared.length} Visual(s) × 5 Zustände.`);
console.log(`  Manifest: ${relative(process.cwd(), manifestPath)}`);
console.log(`  Review:   ${relative(process.cwd(), reviewPath)}`);
if (draft) console.log('  DRAFT: Fallback-Dauern wurden erlaubt. Diese QA wird von youtube:ready nicht als finale QA akzeptiert.');
else console.log('  Finale Timeline wurde verwendet. Review beginnt absichtlich wieder bei PENDING. Danach youtube:motion:qa:validate ausführen.');
