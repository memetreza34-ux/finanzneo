#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  financeProjectPaths,
  financeRequiredDirectories,
  FINANCE_STRUCTURE_VERSION,
} from './lib/finance-project-structure.mjs';

const reelDirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/check-finance-project-folder.mjs <reel-ordner>');
  process.exit(1);
}

const technicalRoot = process.cwd();
const repositoryRoot = path.resolve(technicalRoot, '..');
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(repositoryRoot, 'reels'));
const reelDir = path.resolve(reelDirArg);
const relative = path.relative(reelsRoot, reelDir);
const parts = relative.split(path.sep).filter(Boolean);
const weekPattern = /^(\d{4}-\d{2}-\d{2})_bis_(\d{4}-\d{2}-\d{2})$/;
const reelPattern = /^reel-(\d{2})_(.+)$/;
const dayNames = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];

const fail = (message) => {
  console.error(`✗ FINANCE_FOLDER_INVALID: ${message}`);
  console.error('  Erwartet: reels/YYYY-MM-DD_bis_YYYY-MM-DD/wochentag/reel-01_thema');
  console.error('  Beispiel: reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-ist-ein-etf');
  process.exit(1);
};

if (relative.startsWith('..') || path.isAbsolute(relative)) fail('Projekt liegt außerhalb des Reel-Hauptordners.');
if (parts.length !== 3) fail(`Falsche Ordnertiefe: ${relative.split(path.sep).join('/')}.`);
const [weekFolder, weekdayFolder, reelFolder] = parts;
const weekMatch = weekFolder.match(weekPattern);
const reelMatch = reelFolder.match(reelPattern);
if (!weekMatch) fail(`Ungültiger Wochenordner: ${weekFolder}.`);
if (!dayNames.includes(weekdayFolder)) fail(`Ungültiger Wochentagsordner: ${weekdayFolder}.`);
if (!reelMatch) fail(`Ungültiger Reel-Ordner: ${reelFolder}. Erwartet wird reel-01_thema.`);
if (!reelMatch[2].trim()) fail('Der Reel-Name hinter reel-01_ fehlt.');

const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail(`Ungültiges Datum: ${value}.`);
  return date;
};
const start = parseDate(weekMatch[1]);
const end = parseDate(weekMatch[2]);
const expectedEnd = new Date(start);
expectedEnd.setUTCDate(start.getUTCDate() + 6);
if (expectedEnd.toISOString().slice(0, 10) !== weekMatch[2]) fail(`Wochenordner umfasst nicht exakt sieben Tage: ${weekFolder}.`);
if (start.getUTCDay() !== 1 || end.getUTCDay() !== 0) fail(`Wochenordner muss Montag bis Sonntag abbilden: ${weekFolder}.`);

if (!fs.existsSync(reelDir) || !fs.statSync(reelDir).isDirectory()) fail(`Projektordner nicht gefunden: ${relative}.`);
const p = financeProjectPaths(reelDir);
for (const directory of financeRequiredDirectories(reelDir)) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) fail(`Pflichtordner fehlt: ${path.relative(reelDir, directory)}.`);
}
for (const file of [
  p.coverText,
  p.sceneIndex,
  p.status,
  p.sources,
  p.scriptMarkdown,
  p.voiceScript,
  p.voicePrompt,
  p.allImagePrompts,
  p.socialCaption,
  p.pdfContent,
  p.storyboard,
  p.motionDesign,
  path.join(reelDir, 'README.md'),
]) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) fail(`Pflichtdatei fehlt oder ist leer: ${path.relative(reelDir, file)}.`);
}
const hasScenePlan = fs.existsSync(p.scenePlan) && fs.statSync(p.scenePlan).isFile() && fs.statSync(p.scenePlan).size > 0;
const hasCodexPackage = fs.existsSync(p.codexPackage) && fs.statSync(p.codexPackage).isFile() && fs.statSync(p.codexPackage).size > 0;
if (!hasScenePlan && !hasCodexPackage) fail('In timeline/ fehlt sowohl scene-plan.json als auch codex-reel-package.json.');

for (const legacy of ['01-script-audio', '02-bilder', '03-caption', '04-pdf', '05-export', '06-projektdateien', 'voice', 'image-prompts', 'images', 'captions', 'pdf', 'export', 'video', 'data']) {
  if (fs.existsSync(path.join(reelDir, legacy))) fail(`Veralteter Hauptordner gefunden: ${legacy}/.`);
}
for (const legacyFile of ['scene-plan.json', 'production-status.json', 'sources.md', 'asset-manifest.json', 'ready-report.json', 'qa-report.json']) {
  if (fs.existsSync(path.join(reelDir, legacyFile))) fail(`Technische Datei liegt noch im Projektroot: ${legacyFile}.`);
}

const status = JSON.parse(fs.readFileSync(p.status, 'utf8'));
if ((status.folderStructureVersion ?? 0) < FINANCE_STRUCTURE_VERSION) fail(`folderStructureVersion ist veraltet: ${status.folderStructureVersion ?? 'fehlt'}.`);
if (status.weekFolder !== weekFolder) fail(`production-status.weekFolder stimmt nicht: ${status.weekFolder ?? 'fehlt'}.`);
if (status.weekdayFolder !== weekdayFolder) fail(`production-status.weekdayFolder stimmt nicht: ${status.weekdayFolder ?? 'fehlt'}.`);
if (status.reelFolder !== reelFolder) fail(`production-status.reelFolder stimmt nicht: ${status.reelFolder ?? 'fehlt'}.`);
const expectedProjectPath = path.relative(repositoryRoot, reelDir).split(path.sep).join('/');
if (status.projectPath !== expectedProjectPath) fail(`production-status.projectPath stimmt nicht: ${status.projectPath ?? 'fehlt'}.`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(status.publishDate ?? '')) fail('production-status.publishDate fehlt oder ist ungültig.');
const publish = parseDate(status.publishDate);
const offsetDays = Math.round((publish.getTime() - start.getTime()) / 86400000);
const expectedWeekday = dayNames[offsetDays];
if (offsetDays < 0 || offsetDays > 6 || expectedWeekday !== weekdayFolder) {
  fail(`publishDate ${status.publishDate} passt nicht zum Wochentagsordner ${weekdayFolder}.`);
}
if (status.dayNumber !== offsetDays + 1) fail(`production-status.dayNumber stimmt nicht: ${status.dayNumber ?? 'fehlt'}.`);

console.log(`✓ FINANCE_FOLDER_OK: ${expectedProjectPath}`);
console.log(`  ${weekdayFolder} · ${reelFolder}`);
