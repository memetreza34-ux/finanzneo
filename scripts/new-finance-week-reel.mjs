#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureFinanceProjectStructure,
  financeProjectPaths,
  FINANCE_STRUCTURE_VERSION,
  sanitizeReelFolderTitle,
} from './lib/finance-project-structure.mjs';

const args = process.argv.slice(2);
const slugArg = args.find((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : undefined;
};

const publishDate = option('publish-date');
const topic = option('topic');
const title = option('title') ?? slugArg;
const selectionMode = option('selection-mode') ?? 'evergreen';
const selectionReason = option('selection-reason') ?? 'Automatisch als noch nicht verwendetes, verständliches und gut visualisierbares Finanzthema ausgewählt.';
const selectedBy = option('selected-by') ?? 'assistant';
const allowedSelectionModes = new Set(['trend', 'evergreen', 'user']);
const allowedSelectors = new Set(['assistant', 'user']);

if (!slugArg || !topic || !publishDate) {
  console.error('Nutzung: npm run finance:new -- <slug> --topic="Neues Thema" --title="Titel" --publish-date=YYYY-MM-DD [--selection-mode=trend|evergreen|user] [--selection-reason="Grund"]');
  process.exit(1);
}
if (!allowedSelectionModes.has(selectionMode)) throw new Error('--selection-mode muss trend, evergreen oder user sein.');
if (!allowedSelectors.has(selectedBy)) throw new Error('--selected-by muss assistant oder user sein.');
if (!selectionReason || selectionReason.length < 12) throw new Error('--selection-reason muss die Themenwahl konkret begründen.');
if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) throw new Error('--publish-date muss YYYY-MM-DD verwenden.');
const parsedDate = new Date(`${publishDate}T00:00:00Z`);
if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== publishDate) throw new Error(`Ungültiges Veröffentlichungsdatum: ${publishDate}`);

const slug = slugArg.trim().toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-+|-+$/g, '');
if (!slug) throw new Error('Der Slug ist leer oder ungültig.');
const germanDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const mondayOffset = (parsedDate.getUTCDay() + 6) % 7;
const dayNumber = mondayOffset + 1;
const dayName = germanDays[mondayOffset];
const weekStart = new Date(parsedDate);
weekStart.setUTCDate(parsedDate.getUTCDate() - mondayOffset);
const weekEnd = new Date(weekStart);
weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
const dateString = (date) => date.toISOString().slice(0, 10);
const weekFolder = `${dateString(weekStart)}_bis_${dateString(weekEnd)}`;
const slotPrefix = `${String(dayNumber).padStart(2, '0')}_`;
const reelFolder = `${slotPrefix}${sanitizeReelFolderTitle(title)}`;

const root = process.cwd();
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(root, 'channels', 'finanzneo', 'reels'));
const legacyPublicRoot = path.resolve(process.env.FINANCE_LEGACY_PUBLIC_ROOT ?? path.join(root, 'channels', 'finanzneo', 'public', 'reels'));
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(root, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
const weekTarget = path.join(reelsRoot, weekFolder);
const finalTarget = path.join(weekTarget, reelFolder);
const tempTarget = path.join(reelsRoot, slug);
const relativeFinal = path.relative(root, finalTarget).split(path.sep).join('/');

let history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : {version: 'finance-v1', topics: []};
let historyEntry = (history.topics ?? []).find((item) => item.slug === slug);
if (historyEntry?.topic && historyEntry.topic !== topic) throw new Error(`Der Slug "${slug}" gehört bereits zu "${historyEntry.topic}".`);

const readProjectSlug = (directory) => {
  const candidates = [
    path.join(directory, '06-projektdateien', 'production-status.json'),
    path.join(directory, 'production-status.json'),
    path.join(directory, '06-projektdateien', 'scene-plan.json'),
    path.join(directory, 'scene-plan.json'),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    try {
      const value = JSON.parse(fs.readFileSync(file, 'utf8')).slug;
      if (typeof value === 'string' && value.trim()) return value.trim();
    } catch {
      // Ungültiges JSON wird später durch die Vertragsprüfung gemeldet.
    }
  }
  return undefined;
};

const findLegacyPublicProject = () => {
  if (!fs.existsSync(legacyPublicRoot) || !fs.statSync(legacyPublicRoot).isDirectory()) return undefined;
  const direct = path.join(legacyPublicRoot, slug);
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory() && readProjectSlug(direct) === slug) return direct;
  for (const first of fs.readdirSync(legacyPublicRoot, {withFileTypes: true})) {
    if (!first.isDirectory()) continue;
    const firstPath = path.join(legacyPublicRoot, first.name);
    if (readProjectSlug(firstPath) === slug) return firstPath;
    for (const second of fs.readdirSync(firstPath, {withFileTypes: true})) {
      if (!second.isDirectory()) continue;
      const secondPath = path.join(firstPath, second.name);
      if (readProjectSlug(secondPath) === slug) return secondPath;
    }
  }
  return undefined;
};

const existingSlot = fs.existsSync(weekTarget)
  ? fs.readdirSync(weekTarget, {withFileTypes: true}).find((entry) => entry.isDirectory() && entry.name.startsWith(slotPrefix))
  : undefined;
if (existingSlot) {
  const occupied = path.join(weekTarget, existingSlot.name);
  const existingSlug = readProjectSlug(occupied);
  if (existingSlug !== slug) throw new Error(`${dayName} ist bereits durch ${existingSlot.name} belegt. Pro Tag ist genau ein Reel erlaubt.`);
  ensureFinanceProjectStructure(occupied, {title, topic});
  if (path.resolve(occupied) !== path.resolve(finalTarget)) fs.renameSync(occupied, finalTarget);
}

const required = {
  scenePlan: '06-projektdateien/scene-plan.json',
  sources: '06-projektdateien/sources.md',
  voiceScript: '01-script-audio/script-fliesstext.txt',
  voiceoverPrompt: '01-script-audio/voiceover.txt',
  imagePromptIndex: '02-bilder/bildprompts.md',
  imagePromptManifest: '06-projektdateien/prompt-manifest.json',
  voiceoverFinal: '01-script-audio/audio/voiceover-final.wav',
  captionsFinal: '03-caption/voiceover-final.captions.json',
  socialCaption: '03-caption/social-caption.md',
  manifest: '06-projektdateien/asset-manifest.json',
  pdfDirectory: '04-pdf',
  exportDirectory: '05-export',
  storyboard: '06-projektdateien/storyboard.md',
  motionDesign: '06-projektdateien/motion-design.md',
};

const writeMetadata = (target) => {
  const p = ensureFinanceProjectStructure(target, {title, topic});
  const status = JSON.parse(fs.readFileSync(p.status, 'utf8'));
  Object.assign(status, {
    folderStructureVersion: FINANCE_STRUCTURE_VERSION,
    slug,
    topic,
    title,
    publishDate,
    weekFolder,
    dayNumber,
    dayName,
    reelFolder,
    dayFolder: reelFolder,
    projectPath: relativeFinal,
    sourceCodePath: `channels/finanzneo/src/reels/${publishDate}-${slug}`,
    publicRuntimePath: `channels/finanzneo/public/reels/${slug}`,
    outPath: `channels/finanzneo/out/reels/${publishDate}-${slug}`,
    topicSelection: {
      selectedBy,
      mode: selectionMode,
      reason: selectionReason,
      selectedAt: new Date().toISOString(),
    },
    required: {...(status.required ?? {}), ...required},
  });
  fs.writeFileSync(p.status, JSON.stringify(status, null, 2));

  history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : history;
  historyEntry = (history.topics ?? []).find((item) => item.slug === slug);
  if (!historyEntry) {
    historyEntry = {slug, topic, status: 'reserved', createdAt: new Date().toISOString()};
    history.topics = [...(history.topics ?? []), historyEntry];
  }
  Object.assign(historyEntry, {
    publishDate,
    weekFolder,
    dayNumber,
    dayName,
    reelFolder,
    projectPath: relativeFinal,
    selectedBy,
    selectionMode,
    selectionReason,
  });
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
};

if (fs.existsSync(finalTarget)) {
  const existingSlug = readProjectSlug(finalTarget);
  if (existingSlug && existingSlug !== slug) throw new Error(`${reelFolder} gehört bereits zu einem anderen Reel.`);
  writeMetadata(finalTarget);
  console.log(`✓ Reel liegt bereits korrekt: ${relativeFinal}`);
  process.exit(0);
}

let createdTemp = false;
let movedToFinal = false;
let migratedFromPublic;
let migratedFromPublicRelative;
try {
  if (!fs.existsSync(tempTarget)) {
    const legacyPublicProject = findLegacyPublicProject();
    if (legacyPublicProject) {
      fs.mkdirSync(reelsRoot, {recursive: true});
      migratedFromPublic = legacyPublicProject;
      migratedFromPublicRelative = path.relative(root, legacyPublicProject).split(path.sep).join('/');
      fs.renameSync(legacyPublicProject, tempTarget);
      console.log(`→ Altes Produktionsprojekt aus public erkannt und übernommen: ${migratedFromPublicRelative}`);
    } else {
      const forwardedArgs = args.filter((arg) => !arg.startsWith('--publish-date='));
      const result = spawnSync(process.execPath, ['scripts/new-finance-reel.mjs', ...forwardedArgs], {cwd: root, encoding: 'utf8', env: process.env});
      if (result.error) throw result.error;
      if (result.status !== 0) {
        if (result.stdout) process.stdout.write(result.stdout);
        if (result.stderr) process.stderr.write(result.stderr);
        process.exit(result.status ?? 1);
      }
      createdTemp = true;
    }
  }

  ensureFinanceProjectStructure(tempTarget, {title, topic});
  fs.mkdirSync(weekTarget, {recursive: true});
  fs.renameSync(tempTarget, finalTarget);
  movedToFinal = true;

  const temporaryRelative = path.relative(root, tempTarget).split(path.sep).join('/');
  const replacements = [temporaryRelative, migratedFromPublicRelative].filter(Boolean);
  const textExtensions = new Set(['.json', '.md', '.txt', '.mjs', '.js', '.ts', '.tsx']);
  const rewriteReferences = (directory) => {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) rewriteReferences(file);
      else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
        const current = fs.readFileSync(file, 'utf8');
        const updated = replacements.reduce((value, previous) => value.split(previous).join(relativeFinal), current);
        if (updated !== current) fs.writeFileSync(file, updated);
      }
    }
  };
  rewriteReferences(finalTarget);
  writeMetadata(finalTarget);

  const dayFolders = fs.readdirSync(weekTarget, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(slotPrefix));
  if (dayFolders.length !== 1 || dayFolders[0].name !== reelFolder) {
    throw new Error(`${dayName} muss genau einen Reel-Ordner enthalten; gefunden: ${dayFolders.map((entry) => entry.name).join(', ') || 'keiner'}.`);
  }
} catch (error) {
  if (movedToFinal && fs.existsSync(finalTarget)) {
    fs.mkdirSync(path.dirname(tempTarget), {recursive: true});
    fs.renameSync(finalTarget, tempTarget);
  }
  if (migratedFromPublic && fs.existsSync(tempTarget) && !fs.existsSync(migratedFromPublic)) {
    fs.mkdirSync(path.dirname(migratedFromPublic), {recursive: true});
    fs.renameSync(tempTarget, migratedFromPublic);
  } else if (createdTemp && fs.existsSync(tempTarget)) {
    fs.rmSync(tempTarget, {recursive: true, force: true});
  }
  throw error;
}

console.log(`✓ Finance-Reel korrekt angelegt: ${relativeFinal}`);
console.log(`  ${dayName}: ${reelFolder}`);
console.log(`  Themenwahl: ${selectionMode} — ${selectionReason}`);
console.log('  Es wurde nur dieser eine Tagesordner angelegt.');
console.log('  Struktur: 01-script-audio → 02-bilder → 03-caption → 04-pdf → 05-export → 06-projektdateien');
