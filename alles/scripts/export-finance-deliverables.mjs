#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {Captions, ScenePlan} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {financeProjectPaths, isValidPdfFile, planRequiresPdf} from './lib/finance-project-structure.mjs';

const args = process.argv.slice(2);
const reelDirArg = args.find((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
if (!reelDirArg) {
  console.error('Nutzung: node scripts/export-finance-deliverables.mjs <projektordner> [--video=/pfad/video.mp4] [--render-qa-report=/pfad/report.json]');
  process.exit(1);
}

const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
const config = loadFinanceConfig();
if (!fs.existsSync(paths.readyReport)) throw new Error('06-projektdateien/ready-report.json fehlt. Export ist erst nach finance:ready erlaubt.');
const readyReport = JSON.parse(fs.readFileSync(paths.readyReport, 'utf8'));
if (readyReport.ready !== true) throw new Error('ready-report.json ist nicht grün. Kein finales Exportpaket erlaubt.');
for (const file of [paths.scenePlan, paths.captionsFinal, paths.socialCaption]) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) throw new Error(`Pflichtdatei fehlt oder ist leer: ${path.relative(reelDir, file)}`);
}
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const captions = Captions.parse(JSON.parse(fs.readFileSync(paths.captionsFinal, 'utf8')));

const readyMtime = fs.statSync(paths.readyReport).mtimeMs;
const promptManifest = fs.existsSync(paths.imagePromptManifest) ? JSON.parse(fs.readFileSync(paths.imagePromptManifest, 'utf8')) : {prompts: []};
const criticalFiles = [
  paths.scenePlan,
  paths.status,
  paths.sources,
  paths.scriptMarkdown,
  paths.voiceScript,
  paths.voicePrompt,
  paths.voiceoverFinal,
  paths.captionsFinal,
  paths.socialCaption,
  paths.imagePromptIndex,
  paths.imagePromptManifest,
  paths.storyboard,
  paths.motionDesign,
  ...(promptManifest.prompts ?? []).flatMap((entry) => [path.join(paths.imagePromptsDir, entry.promptFile), path.resolve(reelDir, entry.expectedImageFile)]),
  ...(fs.existsSync(paths.pdfDir) ? fs.readdirSync(paths.pdfDir).filter((name) => name.toLowerCase().endsWith('.pdf')).map((name) => path.join(paths.pdfDir, name)) : []),
].filter(Boolean);
const changedAfterReady = criticalFiles.filter((file) => fs.existsSync(file) && fs.statSync(file).mtimeMs > readyMtime + 25);
if (changedAfterReady.length) throw new Error(`READY ist veraltet. Danach wurden kritische Dateien geändert: ${changedAfterReady.map((file) => path.relative(reelDir, file)).join(', ')}.`);

const videoArg = option('video');
let sourceVideo = videoArg ? path.resolve(videoArg) : undefined;
if (!sourceVideo) {
  const candidates = fs.existsSync(paths.videoDir)
    ? fs.readdirSync(paths.videoDir).filter((name) => name.toLowerCase().endsWith('.mp4')).map((name) => path.join(paths.videoDir, name)).filter((file) => fs.statSync(file).isFile() && fs.statSync(file).size > 0)
    : [];
  sourceVideo = candidates.length ? candidates.sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs).at(-1) : undefined;
}
if (!sourceVideo || !fs.existsSync(sourceVideo) || !fs.statSync(sourceVideo).isFile() || fs.statSync(sourceVideo).size === 0) throw new Error('Finales MP4 für den Export fehlt oder ist leer.');

const qaReportArg = option('render-qa-report');
const qaReportFile = path.resolve(qaReportArg ?? path.join(path.dirname(sourceVideo), `${path.parse(sourceVideo).name}-qa`, 'report.json'));
if (!fs.existsSync(qaReportFile) || !fs.statSync(qaReportFile).isFile()) throw new Error(`Render-QA-Bericht fehlt: ${qaReportFile}`);
const renderQa = JSON.parse(fs.readFileSync(qaReportFile, 'utf8'));
if (renderQa.passed !== true) throw new Error('Render-QA-Bericht ist nicht grün.');
if (path.resolve(renderQa.video ?? '') !== path.resolve(sourceVideo)) throw new Error('Render-QA-Bericht gehört nicht zum angegebenen Video.');
if (fs.statSync(qaReportFile).mtimeMs + 25 < fs.statSync(sourceVideo).mtimeMs) throw new Error('Render-QA-Bericht ist älter als das Video.');

fs.mkdirSync(paths.exportDir, {recursive: true});
for (const entry of fs.readdirSync(paths.exportDir)) fs.rmSync(path.join(paths.exportDir, entry), {recursive: true, force: true});

const finalVideo = path.join(paths.exportDir, `${plan.slug}.mp4`);
fs.copyFileSync(sourceVideo, finalVideo);
fs.copyFileSync(paths.captionsFinal, path.join(paths.exportDir, 'voiceover-final.captions.json'));

const groupSize = Math.max(1, config.captions?.perGroup ?? 4);
const groups = [];
for (let index = 0; index < captions.length; index += groupSize) {
  const items = captions.slice(index, index + groupSize);
  groups.push({startMs: items[0].startMs, endMs: items.at(-1).endMs, text: items.map((item) => item.text).join(' ').replace(/\s+/g, ' ').trim()});
}
const srtTime = (ms) => {
  const value = Math.max(0, Math.round(ms));
  const hours = Math.floor(value / 3600000);
  const minutes = Math.floor((value % 3600000) / 60000);
  const seconds = Math.floor((value % 60000) / 1000);
  const millis = value % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
};
const vttTime = (ms) => srtTime(ms).replace(',', '.');
fs.writeFileSync(path.join(paths.exportDir, 'voiceover-final.srt'), groups.map((group, index) => `${index + 1}\n${srtTime(group.startMs)} --> ${srtTime(group.endMs)}\n${group.text}\n`).join('\n'));
fs.writeFileSync(path.join(paths.exportDir, 'voiceover-final.vtt'), `WEBVTT\n\n${groups.map((group) => `${vttTime(group.startMs)} --> ${vttTime(group.endMs)}\n${group.text}\n`).join('\n')}`);

const socialMarkdown = fs.readFileSync(paths.socialCaption, 'utf8');
const socialText = socialMarkdown
  .split(/\r?\n/)
  .filter((line) => !/^\s*#\s/.test(line) && !/^\s*<!--/.test(line) && !/^\s*-->/.test(line))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();
fs.copyFileSync(paths.socialCaption, path.join(paths.exportDir, 'social-caption.md'));
fs.writeFileSync(path.join(paths.exportDir, 'social-caption.txt'), `${socialText}\n`);

const pdfFiles = fs.existsSync(paths.pdfDir) ? fs.readdirSync(paths.pdfDir).filter((name) => name.toLowerCase().endsWith('.pdf') && isValidPdfFile(path.join(paths.pdfDir, name))) : [];
if (planRequiresPdf(plan) && !pdfFiles.length) throw new Error('PDF-CTA erkannt, aber keine gültige PDF unter 04-pdf/.');
for (const file of pdfFiles) fs.copyFileSync(path.join(paths.pdfDir, file), path.join(paths.exportDir, file));

const exported = fs.readdirSync(paths.exportDir).filter((name) => name !== 'export-manifest.json').sort();
fs.writeFileSync(path.join(paths.exportDir, 'export-manifest.json'), JSON.stringify({version: 'finance-v1', slug: plan.slug, readyReportGeneratedAt: readyReport.generatedAt, renderQaReport: path.relative(reelDir, qaReportFile).split(path.sep).join('/'), generatedAt: new Date().toISOString(), files: exported}, null, 2));
console.log(`✓ 05-export vollständig: ${exported.length} Datei(en).`);
for (const file of exported) console.log(`  ${file}`);
