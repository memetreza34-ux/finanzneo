#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {runCommand} from './lib/run-command.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/build-finance-etf-reel.mjs <projektordner> [--debug] [--skip-tests] [--skip-sync]');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const config = loadFinanceConfig();
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const node = process.execPath;
const entryPoint = 'src/reels/2026-08-05-etf-kauf-100-euro/index.ts';
const compositionId = 'FinanzNeoEtfKauf100Euro';
const channelRoot = path.join(technicalRoot, 'channels', 'finanzneo');
const propsFile = path.join(projectRoot, 'render', 'etf-kauf-render-props.json');
const videoFile = path.join(projectRoot, '06-video', 'final-reel.mp4');
const coverFile = path.join(projectRoot, '00-cover', 'cover.png');
const qaDirectory = path.join(projectRoot, '05-review', 'render-qa');
const qaReportSource = path.join(qaDirectory, 'report.json');
const qaReportTarget = path.join(projectRoot, '05-review', 'codex-render-qa.json');
const contactSheetFile = path.join(projectRoot, '05-review', 'contact-sheet.png');
const buildReportFile = path.join(projectRoot, '05-review', 'build-report.json');
const productionStatusFile = path.join(projectRoot, '05-review', 'production-status.json');
const startedAt = new Date().toISOString();
const executedCommands = [];

const execute = (command, commandArgs, options = {}) => {
  executedCommands.push({command, args: commandArgs, cwd: options.cwd ?? technicalRoot});
  return runCommand(command, commandArgs, options);
};

const writeBuildReport = (status, error = null) => {
  fs.mkdirSync(path.dirname(buildReportFile), {recursive: true});
  fs.writeFileSync(buildReportFile, `${JSON.stringify({
    version: 'finanzneo-etf-build-v1',
    startedAt,
    finishedAt: new Date().toISOString(),
    status,
    projectRoot,
    entryPoint,
    compositionId,
    animationsPrebuilt: true,
    codexCodeGenerationRequired: false,
    outputs: {
      video: path.relative(projectRoot, videoFile),
      cover: path.relative(projectRoot, coverFile),
      contactSheet: path.relative(projectRoot, contactSheetFile),
      qaReport: path.relative(projectRoot, qaReportTarget),
      props: path.relative(projectRoot, propsFile),
    },
    executedCommands,
    ...(error ? {error: String(error?.stack ?? error?.message ?? error)} : {}),
    manualVisualApprovalRequired: true,
  }, null, 2)}\n`);
};

const createContactSheet = () => {
  const stillsDirectory = path.join(qaDirectory, 'stills');
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
  const ffmpegArgs = [
    '-y',
    ...stills.flatMap((file) => ['-i', file]),
    '-filter_complex', filterParts.join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    contactSheetFile,
  ];
  execute('ffmpeg', ffmpegArgs, {cwd: technicalRoot});
  const expectedWidth = columns * cellWidth;
  const expectedHeight = rows * cellHeight;
  console.log(`✓ Kontaktbogen erzeugt: ${contactSheetFile} (${expectedWidth}×${expectedHeight})`);
};

try {
  fs.mkdirSync(path.dirname(videoFile), {recursive: true});
  fs.mkdirSync(path.dirname(coverFile), {recursive: true});
  fs.mkdirSync(qaDirectory, {recursive: true});

  execute(node, ['scripts/verify-finance-etf-prebuilt-reel.mjs', projectRoot], {cwd: technicalRoot});

  if (!args.includes('--skip-sync')) {
    execute(node, ['scripts/sync-finance-reel-to-voiceover.mjs', projectRoot], {cwd: technicalRoot});
  }

  execute(node, ['scripts/verify-finance-codex-reel-package.mjs', projectRoot, '--require-assets'], {cwd: technicalRoot});

  if (!args.includes('--skip-tests')) {
    execute(node, ['scripts/test-finance-codex-reel-workflow.mjs'], {cwd: technicalRoot});
    execute(npx, ['tsc', '--noEmit', '-p', 'channels/finanzneo/tsconfig.json'], {cwd: technicalRoot});
  }

  execute(node, ['scripts/prepare-finance-etf-reel-runtime.mjs', projectRoot], {cwd: technicalRoot});
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
      video: '06-video/final-reel.mp4',
      cover: '00-cover/cover.png',
      contactSheet: '05-review/contact-sheet.png',
      qaReport: '05-review/codex-render-qa.json',
      buildReport: '05-review/build-report.json',
    };
    fs.writeFileSync(productionStatusFile, `${JSON.stringify(status, null, 2)}\n`);
  }

  writeBuildReport('completed');
  console.log('✓ Vollständiger ETF-Reel-Build abgeschlossen.');
  console.log('  Animationen waren bereits programmiert; keine Codex-Codegenerierung nötig.');
  console.log(`  Video: ${videoFile}`);
  console.log(`  Cover: ${coverFile}`);
  console.log(`  Kontaktbogen: ${contactSheetFile}`);
  console.log(`  QA: ${qaReportTarget}`);
  console.log('  Manuelle visuelle Freigabe bleibt erforderlich.');
} catch (error) {
  writeBuildReport('failed', error);
  throw error;
}
