#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {sanitizeReelFolderTitle} from './lib/finance-project-structure.mjs';

const args = process.argv.slice(2);
const slugArg = args.find((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : undefined;
};
const publishDate = option('publish-date');
const topic = option('topic');
const title = option('title') ?? slugArg;
if (!slugArg || !topic || !publishDate) {
  console.error('Nutzung: npm run finance:new -- <slug> --topic="Thema" --title="Titel" --publish-date=YYYY-MM-DD');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) throw new Error('--publish-date muss YYYY-MM-DD verwenden.');
const date = new Date(`${publishDate}T00:00:00Z`);
if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== publishDate) throw new Error(`Ungültiges Veröffentlichungsdatum: ${publishDate}`);

const root = process.cwd();
const slug = slugArg.trim().toLocaleLowerCase('de-DE').replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-+|-+$/g, '');
const mondayOffset = (date.getUTCDay() + 6) % 7;
const start = new Date(date);
start.setUTCDate(date.getUTCDate() - mondayOffset);
const end = new Date(start);
end.setUTCDate(start.getUTCDate() + 6);
const iso = (value) => value.toISOString().slice(0, 10);
const weekFolder = `${iso(start)}_bis_${iso(end)}`;
const dayNumber = mondayOffset + 1;
const dayPrefix = `${String(dayNumber).padStart(2, '0')}_`;
const reelFolder = `${dayPrefix}${sanitizeReelFolderTitle(title)}`;
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(root, 'channels', 'finanzneo', 'reels'));
const weekDir = path.join(reelsRoot, weekFolder);
const finalTarget = path.join(weekDir, reelFolder);
const tempTarget = path.join(reelsRoot, slug);
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(root, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
if (!fs.existsSync(historyFile)) throw new Error(`Themenregister fehlt: ${historyFile}`);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readSlug = (directory) => {
  const files = [path.join(directory, '06-projektdateien', 'production-status.json'), path.join(directory, '06-projektdateien', 'scene-plan.json')];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      const value = readJson(file).slug;
      if (typeof value === 'string' && value.trim()) return value.trim();
    } catch {
      // Der normale Ordnercheck meldet beschädigte Daten präzise.
    }
  }
  return undefined;
};

const occupiedDay = fs.existsSync(weekDir)
  ? fs.readdirSync(weekDir, {withFileTypes: true}).find((entry) => entry.isDirectory() && entry.name.startsWith(dayPrefix))
  : undefined;
if (occupiedDay) {
  const occupiedPath = path.join(weekDir, occupiedDay.name);
  const existingSlug = readSlug(occupiedPath);
  if (existingSlug !== slug) throw new Error(`${occupiedDay.name} belegt diesen Wochentag bereits mit einem anderen Reel.`);
  console.log(`✓ Reel für diesen Tag existiert bereits und bleibt unverändert: ${path.relative(root, occupiedPath)}`);
  process.exit(0);
}

const historyBackup = fs.readFileSync(historyFile, 'utf8');
const tempExisted = fs.existsSync(tempTarget);
const weekExisted = fs.existsSync(weekDir);
const rollback = () => {
  fs.writeFileSync(historyFile, historyBackup);
  if (fs.existsSync(finalTarget)) fs.rmSync(finalTarget, {recursive: true, force: true});
  if (!tempExisted && fs.existsSync(tempTarget)) fs.rmSync(tempTarget, {recursive: true, force: true});
  if (!weekExisted && fs.existsSync(weekDir) && fs.readdirSync(weekDir).length === 0) fs.rmdirSync(weekDir);
};
const result = spawnSync(process.execPath, ['scripts/new-finance-week-reel.mjs', ...args], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'pipe',
  env: process.env,
  maxBuffer: 16 * 1024 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error || result.status !== 0) {
  rollback();
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

try {
  if (!fs.existsSync(finalTarget)) throw new Error(`Erstellung meldete Erfolg, aber Zielordner fehlt: ${finalTarget}`);
  const statusFile = path.join(finalTarget, '06-projektdateien', 'production-status.json');
  const planFile = path.join(finalTarget, '06-projektdateien', 'scene-plan.json');
  if (!fs.existsSync(statusFile) || !fs.existsSync(planFile)) throw new Error('Erstelltes Projekt besitzt keinen vollständigen Status oder Szenenplan.');
  const status = readJson(statusFile);
  const plan = readJson(planFile);
  const expectedProjectPath = path.relative(root, finalTarget).split(path.sep).join('/');
  for (const [label, actual, expected] of [
    ['Slug im Status', status.slug, slug],
    ['Slug im Szenenplan', plan.slug, slug],
    ['Thema', status.topic, topic],
    ['Veröffentlichungsdatum', status.publishDate, publishDate],
    ['Wochenordner', status.weekFolder, weekFolder],
    ['Tagesnummer', status.dayNumber, dayNumber],
    ['Projektpfad', status.projectPath, expectedProjectPath],
  ]) if (actual !== expected) throw new Error(`${label} ist inkonsistent: erwartet „${expected}“, gefunden „${actual}“.`);
  const history = readJson(historyFile);
  const entry = (history.topics ?? []).find((item) => item.slug === slug && item.projectPath === expectedProjectPath);
  if (!entry || entry.topic !== topic) throw new Error('Themenregister enthält das neue Reel nicht mit korrektem Thema und Projektpfad.');
  const folderCheck = spawnSync(process.execPath, ['scripts/check-finance-project-folder.mjs', finalTarget], {cwd: root, encoding: 'utf8'});
  if (folderCheck.stdout) process.stdout.write(folderCheck.stdout);
  if (folderCheck.stderr) process.stderr.write(folderCheck.stderr);
  if (folderCheck.error || folderCheck.status !== 0) throw folderCheck.error ?? new Error('Projektordnerprüfung ist fehlgeschlagen.');
} catch (error) {
  rollback();
  throw error;
}
console.log(`✓ Transaktion und Metadatenprüfung abgeschlossen: ${path.relative(root, finalTarget)}`);
