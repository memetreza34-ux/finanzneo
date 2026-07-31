#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {AssetManifest, Captions, ScenePlan} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';
import {runCommand} from './lib/run-command.mjs';

const config = loadFinanceConfig();
const args = process.argv.slice(2);
const reelDirArg = args.filter((arg) => !arg.startsWith('--'))[0];
if (!reelDirArg) {
  console.error('Nutzung: node scripts/render-finance-reel.mjs <projektordner> [--out=video.mp4] [--debug] [--no-render-qa]');
  process.exit(1);
}

const root = process.cwd();
const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
runCommand(process.execPath, ['scripts/check-finance-project-folder.mjs', reelDir], {cwd: root});
runCommand(process.execPath, ['scripts/check-finance-readiness.mjs', reelDir], {cwd: root});

if (!fs.existsSync(paths.scenePlan) || !fs.existsSync(paths.manifest)) throw new Error('06-projektdateien/scene-plan.json oder asset-manifest.json fehlt.');
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const manifest = AssetManifest.parse(JSON.parse(fs.readFileSync(paths.manifest, 'utf8')));
const captionsAsset = manifest.assets.find((asset) => asset.id === plan.captionsAssetId);
if (!captionsAsset) throw new Error(`Caption-Asset fehlt im Manifest: ${plan.captionsAssetId}`);
const captionsFile = path.resolve(reelDir, captionsAsset.file);
if (!fs.existsSync(captionsFile)) throw new Error(`Caption-Datei fehlt: ${captionsFile}`);
const captions = Captions.parse(JSON.parse(fs.readFileSync(captionsFile, 'utf8')));

runCommand(process.execPath, ['scripts/stage-finance-runtime-assets.mjs', reelDir], {cwd: root});
const publicBasePath = `reels/${plan.slug}`;

const outArg = args.find((arg) => arg.startsWith('--out='));
const workingOutput = path.resolve(outArg ? outArg.slice('--out='.length) : path.join(paths.videoDir, `${plan.slug}-render.mp4`));
fs.mkdirSync(path.dirname(workingOutput), {recursive: true});
const propsFile = path.join(os.tmpdir(), `finanzneo-${process.pid}-${Date.now()}.json`);
fs.writeFileSync(propsFile, JSON.stringify({plan, manifest, captions, publicBasePath, debug: args.includes('--debug')}));
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
try {
  runCommand(npx, ['remotion', 'render', 'src/index.ts', 'FinanzNeo', workingOutput, `--props=${propsFile}`, `--codec=${config.render.codec}`, `--crf=${config.render.crf}`, `--pixel-format=${config.render.pixelFormat}`, `--audio-codec=${config.render.audioCodec}`, `--audio-bitrate=${config.render.audioBitrate}`, `--x264-preset=${config.render.x264Preset}`], {cwd: path.join(root, 'channels/finanzneo')});
} finally {
  fs.rmSync(propsFile, {force: true});
}

console.log(`✓ Arbeitsrender erzeugt: ${workingOutput}`);
if (args.includes('--no-render-qa')) {
  console.log('⚠ Render-QA deaktiviert. Datei bleibt unter 06-projektdateien/render und wird nicht exportiert.');
  process.exit(0);
}
runCommand(process.execPath, ['scripts/run-finance-render-qa.mjs', workingOutput]);
runCommand(process.execPath, ['scripts/export-finance-deliverables.mjs', reelDir, `--video=${workingOutput}`]);
console.log(`✓ Vollständiges geprüftes Exportpaket: ${path.relative(root, paths.exportDir)}`);
