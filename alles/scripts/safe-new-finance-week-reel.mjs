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
if (!slugArg || !topic || !publishDate) {
  console.error('Nutzung: npm run finance:new -- <slug> --topic="Thema" --title="Titel" --publish-date=YYYY-MM-DD');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) throw new Error('--publish-date muss YYYY-MM-DD verwenden.');
const date = new Date(`${publishDate}T00:00:00Z`);
if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== publishDate) throw new Error(`Ungültiges Veröffentlichungsdatum: ${publishDate}`);

const technicalRoot = process.cwd();
const repositoryRoot = path.resolve(technicalRoot, '..');
const slug = sanitizeReelFolderTitle(slugArg);
const mondayOffset = (date.getUTCDay() + 6) % 7;
const start = new Date(date);
start.setUTCDate(date.getUTCDate() - mondayOffset);
const end = new Date(start);
end.setUTCDate(start.getUTCDate() + 6);
const iso = (value) => value.toISOString().slice(0, 10);
const weekFolder = `${iso(start)}_bis_${iso(end)}`;
const dayNumber = mondayOffset + 1;
const dayNames = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
const weekdayFolder = dayNames[mondayOffset];
const reelFolder = `reel-01_${slug}`;
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(repositoryRoot, 'reels'));
const weekDir = path.join(reelsRoot, weekFolder);
const weekdayDir = path.join(weekDir, weekdayFolder);
const finalTarget = path.join(weekdayDir, reelFolder);
const tempTarget = path.join(reelsRoot, `temp-${slug}`);
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(technicalRoot, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
if (!fs.existsSync(historyFile)) throw new Error(`Themenregister fehlt: ${historyFile}`);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readSlug = (directory) => {
  const files = [
    path.join(directory, '05-review', 'production-status.json'),
    path.join(directory, 'timeline', 'scene-plan.json'),
    path.join(directory, 'timeline', 'codex-reel-package.json'),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      const value = readJson(file).slug;
      if (typeof value === 'string' && value.trim()) return value.trim();
    } catch {
      // Der Ordnercheck meldet beschädigte Daten präzise.
    }
  }
  return undefined;
};

if (fs.existsSync(finalTarget)) {
  const existingSlug = readSlug(finalTarget);
  if (existingSlug !== slug) throw new Error(`${weekdayFolder} ist bereits mit einem anderen Reel belegt.`);
  console.log(`✓ Reel für diesen Tag existiert bereits und bleibt unverändert: ${path.relative(repositoryRoot, finalTarget)}`);
  process.exit(0);
}

if (fs.existsSync(weekdayDir)) {
  const occupied = fs.readdirSync(weekdayDir, {withFileTypes: true}).find((entry) => entry.isDirectory() && entry.name.startsWith('reel-'));
  if (occupied) throw new Error(`${weekdayFolder} ist bereits durch ${occupied.name} belegt. Pro Tag ist genau ein Reel erlaubt.`);
}

const historyBackup = fs.readFileSync(historyFile, 'utf8');
const weekExisted = fs.existsSync(weekDir);
const weekdayExisted = fs.existsSync(weekdayDir);
const rollback = () => {
  fs.writeFileSync(historyFile, historyBackup);
  if (fs.existsSync(finalTarget)) fs.rmSync(finalTarget, {recursive: true, force: true});
  if (fs.existsSync(tempTarget)) fs.rmSync(tempTarget, {recursive: true, force: true});
  if (!weekdayExisted && fs.existsSync(weekdayDir) && fs.readdirSync(weekdayDir).length === 0) fs.rmdirSync(weekdayDir);
  if (!weekExisted && fs.existsSync(weekDir) && fs.readdirSync(weekDir).length === 0) fs.rmdirSync(weekDir);
};

const result = spawnSync(process.execPath, ['scripts/new-finance-week-reel.mjs', ...args], {
  cwd: technicalRoot,
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
  const statusFile = path.join(finalTarget, '05-review', 'production-status.json');
  const planFile = path.join(finalTarget, 'timeline', 'scene-plan.json');
  const sceneIndexFile = path.join(finalTarget, '03-szenen', 'scene-index.json');
  if (![statusFile, planFile, sceneIndexFile].every((file) => fs.existsSync(file))) {
    throw new Error('Erstelltes Projekt besitzt keinen vollständigen Status, Szenenplan oder Szenenindex.');
  }
  const status = readJson(statusFile);
  const plan = readJson(planFile);
  const expectedProjectPath = path.relative(repositoryRoot, finalTarget).split(path.sep).join('/');
  for (const [label, actual, expected] of [
    ['Slug im Status', status.slug, slug],
    ['Slug im Szenenplan', plan.slug, slug],
    ['Thema', status.topic, topic],
    ['Veröffentlichungsdatum', status.publishDate, publishDate],
    ['Wochenordner', status.weekFolder, weekFolder],
    ['Tagesnummer', status.dayNumber, dayNumber],
    ['Wochentagsordner', status.weekdayFolder, weekdayFolder],
    ['Reel-Ordner', status.reelFolder, reelFolder],
    ['Projektpfad', status.projectPath, expectedProjectPath],
  ]) if (actual !== expected) throw new Error(`${label} ist inkonsistent: erwartet „${expected}“, gefunden „${actual}“.`);

  const history = readJson(historyFile);
  const entry = (history.topics ?? []).find((item) => item.slug === slug && item.projectPath === expectedProjectPath);
  if (!entry || entry.topic !== topic) throw new Error('Themenregister enthält das neue Reel nicht mit korrektem Thema und Projektpfad.');

  const folderCheck = spawnSync(process.execPath, ['scripts/check-finance-project-folder.mjs', finalTarget], {
    cwd: technicalRoot,
    encoding: 'utf8',
    env: process.env,
  });
  if (folderCheck.stdout) process.stdout.write(folderCheck.stdout);
  if (folderCheck.stderr) process.stderr.write(folderCheck.stderr);
  if (folderCheck.error || folderCheck.status !== 0) throw folderCheck.error ?? new Error('Projektordnerprüfung ist fehlgeschlagen.');
} catch (error) {
  rollback();
  throw error;
}
console.log(`✓ Transaktion und Metadatenprüfung abgeschlossen: ${path.relative(repositoryRoot, finalTarget)}`);
