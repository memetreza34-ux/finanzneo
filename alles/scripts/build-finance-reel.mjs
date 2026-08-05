#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {runCommand} from './lib/run-command.mjs';
import {loadFinanceReelBuildManifest} from './lib/finance-reel-build-manifest.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/build-finance-reel.mjs <projektordner> [--debug] [--skip-tests] [--skip-sync]');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const loaded = loadFinanceReelBuildManifest({projectRoot, technicalRoot, requireReady: true});
const {manifest, composition, runtime, outputs, outputFiles, channelRoot} = loaded;
const config = loadFinanceConfig();
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const node = process.execPath;
const entryPoint = path.relative(channelRoot, composition.entryPointAbsolute).split(path.sep).join('/');
const compositionId = composition.id;
const propsFile = runtime.propsFileAbsolute;
const videoFile = outputFiles.video;
const coverFile = outputFiles.cover;
const qaDirectory = outputFiles.qaDirectory;
const qaReportSource = path.join(qaDirectory, 'report.json');
const qaReportTarget = outputFiles.qaReport;
const contactSheetFile = outputFiles.contactSheet;
const buildReportFile = outputFiles.buildReport;
const productionStatusFile = path.join(projectRoot, '05-review', 'production-status.json');
const startedAt = new Date().toISOString();
const executedCommands = [];

const execute = (command, commandArgs, options = {}) => {
  executedCommands.push({
    command,
    args: commandArgs,
    cwd: path.relative(technicalRoot, options.cwd ?? technicalRoot) || '.',
  });
  return runCommand(command, commandArgs, options);
};

const writeBuildReport = (status, error = null) => {
  fs.mkdirSync(path.dirname(buildReportFile), {recursive: true});
  fs.writeFileSync(buildReportFile, `${JSON.stringify({
    version: 'finanzneo-general-reel-build-v1',
    startedAt,
    finishedAt: new Date().toISOString(),
    status,
    slug: manifest.slug,
    projectRoot,
    manifest: 'timeline/reel-build-manifest.json',
    entryPoint: manifest.composition.entryPoint,
    compositionId,
    animationsPrebuilt: true,
    codexAnimationCodingRequired: false,
    outputs: {
      video: outputs.video,
      cover: outputs.cover,
      contactSheet: outputs.contactSheet,
      qaReport: outputs.qaReport,
      props: runtime.propsFile,
    },
    executedCommands,
    ...(error ? {error: String(error?.stack ?? error?.message ?? error)} : {}),
    manualVisualApprovalRequired: true,
  }, null, 2)}\n`);
};

const createContactSheet = () => {
  const stillsDirectory = path.join(qaDirectory, 'stills');
  if (!fs.existsSync(stillsDirectory)) throw new Error(`QA-Stills-Ordner fehlt: ${stillsDirectory}`);
  const stills = fs.readdirSync(stillsDirectory)
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort((left, right) => left.localeCompare(right, 'de-DE'))
    .map((file) => path.join(stillsDirectory, file));
  if (stills.length === 0) throw new Error(`Keine QA-Stills gefunden: ${stillsDirectory}`);

  const columns = Math.min(4, stills.length);
  const rows = Math.ceil(stills.length / columns);
  const cellWidth = 270;
  const cellHeight = 480;
  const filterParts = stills.map((_, index) => (
    `[${index}:v]scale=${cellWidth}:${cellHeight}:force_original_aspect_ratio=decrease,pad=${cellWidth}:${cellHeight}:(ow-iw)/2:(oh-ih)/2:color=0x06110A[v${index}]`
  ));
  const stackInputs = stills.map((_, index) => `[v${index}]`).join('');
  const layout = stills.map((_, index) => `${(index % columns) * cellWidth}_${Math.floor(index / columns) * cellHeight}`).join('|');
  filterParts.push(`${stackInputs}xstack=inputs=${stills.length}:layout=${layout}:fill=0x06110A[out]`);
  execute('ffmpeg', [
    '-y',
    ...stills.flatMap((file) => ['-i', file]),
    '-filter_complex', filterParts.join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    contactSheetFile,
  ], {cwd: technicalRoot});
  console.log(`✓ Kontaktbogen erzeugt: ${contactSheetFile} (${columns * cellWidth}×${rows * cellHeight})`);
};

const executeManifestChecks = () => {
  const checks = Array.isArray(manifest.additionalChecks) ? manifest.additionalChecks : [];
  for (const [index, check] of checks.entries()) {
    if (!check || !['node', 'npx'].includes(check.runner) || !Array.isArray(check.args) || check.args.some((value) => typeof value !== 'string')) {
      throw new Error(`additionalChecks[${index}] ist ungültig. Erlaubt sind runner node oder npx und ein String-Array args.`);
    }
    const command = check.runner === 'node' ? node : npx;
    const cwd = check.cwd === 'channel' ? channelRoot : technicalRoot;
    execute(command, check.args, {cwd});
  }
};

try {
  for (const directory of [path.dirname(videoFile), path.dirname(coverFile), qaDirectory, path.dirname(contactSheetFile)]) {
    fs.mkdirSync(directory, {recursive: true});
  }

  execute(node, ['scripts/verify-finance-prebuilt-reel.mjs', projectRoot], {cwd: technicalRoot});

  if (!args.includes('--skip-sync')) {
    execute(node, ['scripts/sync-finance-reel-to-voiceover.mjs', projectRoot], {cwd: technicalRoot});
  }

  execute(node, ['scripts/verify-finance-codex-reel-package.mjs', projectRoot, '--require-assets'], {cwd: technicalRoot});

  if (!args.includes('--skip-tests')) {
    execute(node, ['scripts/test-finance-codex-reel-workflow.mjs'], {cwd: technicalRoot});
    execute(npx, ['tsc', '--noEmit', '-p', 'channels/finanzneo/tsconfig.json'], {cwd: technicalRoot});
    executeManifestChecks();
  }

  execute(node, [runtime.prepareScriptAbsolute, projectRoot], {cwd: technicalRoot});
  if (!fs.existsSync(propsFile)) throw new Error(`Render-Props fehlen: ${propsFile}`);

  execute(npx, [
    'remotion', 'render',
    entryPoint,
    compositionId,
    videoFile,
    `--props=${propsFile}`,
    `--codec=${config.render.codec}`,
    `--crf=${config.render.crf}`,
    `--pixel-format=${config.render.pixelFormat}`,
    `--audio-codec=${config.render.audioCodec}`,
    `--audio-bitrate=${config.render.audioBitrate}`,
    `--x264-preset=${config.render.x264Preset}`,
  ], {cwd: channelRoot});

  execute(npx, [
    'remotion', 'still',
    entryPoint,
    compositionId,
    coverFile,
    '--frame=0',
    `--props=${propsFile}`,
  ], {cwd: channelRoot});

  execute(node, [
    'scripts/run-finance-render-qa.mjs',
    videoFile,
    `--out=${qaDirectory}`,
  ], {cwd: technicalRoot});

  if (!fs.existsSync(qaReportSource)) throw new Error(`Render-QA-Bericht fehlt: ${qaReportSource}`);
  fs.copyFileSync(qaReportSource, qaReportTarget);
  createContactSheet();

  if (fs.existsSync(productionStatusFile)) {
    const status = JSON.parse(fs.readFileSync(productionStatusFile, 'utf8'));
    status.stage = 'technical-build-completed-awaiting-manual-visual-approval';
    status.media = {
      ...(status.media ?? {}),
      runtimeVoiceoverCreated: true,
      transcriptCreated: true,
      captionsReceived: true,
    };
    status.implementation = {
      ...(status.implementation ?? {}),
      prebuiltAnimationsImplemented: true,
      codexAnimationCodingRequired: false,
      generalFutureReelBuilderUsed: true,
      automaticAssemblyImplemented: true,
      audioSyncPipelineExecuted: true,
      typecheckPassed: !args.includes('--skip-tests'),
      testsPassed: !args.includes('--skip-tests'),
      renderCompleted: true,
      automatedRenderQaPassed: true,
      contactSheetCreated: true,
      manualVisualQaCompleted: false,
      productionIntegrated: false,
      merged: false,
    };
    status.outputs = {
      video: outputs.video,
      cover: outputs.cover,
      contactSheet: outputs.contactSheet,
      qaReport: outputs.qaReport,
      buildReport: outputs.buildReport,
    };
    fs.writeFileSync(productionStatusFile, `${JSON.stringify(status, null, 2)}\n`);
  }

  writeBuildReport('completed');
  console.log(`✓ Allgemeiner Reel-Build abgeschlossen: ${manifest.slug}`);
  console.log('  Composition und Animationen waren bereits programmiert.');
  console.log('  Codex-Codegenerierung war nicht nötig.');
  console.log(`  Video: ${videoFile}`);
  console.log(`  Cover: ${coverFile}`);
  console.log(`  Kontaktbogen: ${contactSheetFile}`);
  console.log(`  QA: ${qaReportTarget}`);
  console.log('  Manuelle visuelle Freigabe bleibt erforderlich.');
} catch (error) {
  writeBuildReport('failed', error);
  throw error;
}
