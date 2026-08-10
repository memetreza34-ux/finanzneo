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

const root = process.cwd();
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(root, 'channels', 'finanzneo', 'reels'));
const reelDir = path.resolve(reelDirArg);
const relative = path.relative(reelsRoot, reelDir);
const parts = relative.split(path.sep).filter(Boolean);
const weekPattern = /^(\d{4}-\d{2}-\d{2})_bis_(\d{4}-\d{2}-\d{2})$/;
const reelPattern = /^(0[1-7])_(.+)$/;
const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const fail = (message) => {
  console.error(`✗ FINANCE_FOLDER_INVALID: ${message}`);
  console.error('  Erwartet: channels/finanzneo/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Name');
  console.error('  Beispiel: channels/finanzneo/reels/2026-07-27_bis_2026-08-02/01_Inflation-und-Kaufkraft');
  process.exit(1);
};

if (relative.startsWith('..') || path.isAbsolute(relative)) fail('Projekt liegt außerhalb von channels/finanzneo/reels.');
if (parts.length !== 2) fail(`Falsche Ordnertiefe: ${relative.split(path.sep).join('/')}.`);
const [weekFolder, reelFolder] = parts;
const weekMatch = weekFolder.match(weekPattern);
const reelMatch = reelFolder.match(reelPattern);
if (!weekMatch) fail(`Ungültiger Wochenordner: ${weekFolder}.`);
if (!reelMatch) fail(`Ungültiger Reel-Ordner: ${reelFolder}. Nummer und Reel-Name sind Pflicht.`);
const reelName = reelMatch[2].trim();
if (!reelName) fail('Der Reel-Name hinter der Tagesnummer fehlt.');
if (dayNames.some((day) => day.toLocaleLowerCase('de-DE') === reelName.toLocaleLowerCase('de-DE'))) {
  fail(`Der Ordner ${reelFolder} enthält nur den Wochentag. Hinter der Nummer muss ein verständlicher Reel-Name stehen.`);
}

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
  p.scenePlan,
  p.status,
  p.sources,
  p.scriptMarkdown,
  p.voiceScript,
  p.voicePrompt,
  p.imagePromptIndex,
  p.socialCaption,
  p.pdfContent,
  p.storyboard,
  p.motionDesign,
  path.join(reelDir, 'README.md'),
]) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size === 0) fail(`Pflichtdatei fehlt oder ist leer: ${path.relative(reelDir, file)}.`);
}

for (const legacy of ['voice', 'audio', 'image-prompts', 'images', 'captions', 'pdf', 'export', 'video', 'data']) {
  if (fs.existsSync(path.join(reelDir, legacy))) fail(`Veralteter Hauptordner gefunden: ${legacy}/. Inhalte in die nummerierten Produktionsordner verschieben.`);
}
for (const legacyFile of ['scene-plan.json', 'production-status.json', 'sources.md', 'asset-manifest.json', 'ready-report.json', 'qa-report.json']) {
  if (fs.existsSync(path.join(reelDir, legacyFile))) fail(`Technische Datei liegt noch im Projektroot: ${legacyFile}. Sie gehört nach 06-projektdateien/.`);
}

const status = JSON.parse(fs.readFileSync(p.status, 'utf8'));
if ((status.folderStructureVersion ?? 0) < FINANCE_STRUCTURE_VERSION) fail(`folderStructureVersion ist veraltet: ${status.folderStructureVersion ?? 'fehlt'}.`);
if (status.weekFolder !== weekFolder) fail(`production-status.weekFolder stimmt nicht: ${status.weekFolder ?? 'fehlt'}.`);
if ((status.reelFolder ?? status.dayFolder) !== reelFolder) fail(`production-status.reelFolder stimmt nicht: ${status.reelFolder ?? status.dayFolder ?? 'fehlt'}.`);
const expectedProjectPath = path.relative(root, reelDir).split(path.sep).join('/');
if (status.projectPath !== expectedProjectPath) fail(`production-status.projectPath stimmt nicht: ${status.projectPath ?? 'fehlt'}.`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(status.publishDate ?? '')) fail('production-status.publishDate fehlt oder ist ungültig.');
const publish = parseDate(status.publishDate);
const dayNumber = Number(reelMatch[1]);
const offsetDays = Math.round((publish.getTime() - start.getTime()) / 86400000);
if (offsetDays !== dayNumber - 1) fail(`publishDate ${status.publishDate} passt nicht zu Tagesnummer ${reelMatch[1]} (${dayNames[dayNumber - 1]}).`);

console.log(`✓ FINANCE_FOLDER_OK: ${expectedProjectPath}`);
console.log(`  ${dayNames[dayNumber - 1]} · ${reelName}`);
