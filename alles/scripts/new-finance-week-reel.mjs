#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureFinanceProjectStructure,
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

const slug = sanitizeReelFolderTitle(slugArg);
const germanDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const mondayOffset = (parsedDate.getUTCDay() + 6) % 7;
const dayNumber = mondayOffset + 1;
const dayName = germanDays[mondayOffset];
const weekdayFolder = dayName.toLocaleLowerCase('de-DE');
const weekStart = new Date(parsedDate);
weekStart.setUTCDate(parsedDate.getUTCDate() - mondayOffset);
const weekEnd = new Date(weekStart);
weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
const dateString = (date) => date.toISOString().slice(0, 10);
const weekFolder = `${dateString(weekStart)}_bis_${dateString(weekEnd)}`;
const reelFolder = `reel-01_${slug}`;

const technicalRoot = process.cwd();
const repositoryRoot = path.resolve(technicalRoot, '..');
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(repositoryRoot, 'reels'));
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(technicalRoot, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
const weekTarget = path.join(reelsRoot, weekFolder);
const weekdayTarget = path.join(weekTarget, weekdayFolder);
const finalTarget = path.join(weekdayTarget, reelFolder);
const tempTarget = path.join(reelsRoot, `.tmp-${slug}`);
const relativeFinal = path.relative(repositoryRoot, finalTarget).split(path.sep).join('/');

if (!fs.existsSync(historyFile)) throw new Error(`Themenregister fehlt: ${historyFile}`);
let history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
let historyEntry = (history.topics ?? []).find((item) => item.slug === slug);
if (historyEntry?.topic && historyEntry.topic !== topic) throw new Error(`Der Slug "${slug}" gehört bereits zu "${historyEntry.topic}".`);

const readProjectSlug = (directory) => {
  const candidates = [
    path.join(directory, '05-review', 'production-status.json'),
    path.join(directory, 'timeline', 'scene-plan.json'),
    path.join(directory, 'timeline', 'codex-reel-package.json'),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    try {
      const value = JSON.parse(fs.readFileSync(file, 'utf8')).slug;
      if (typeof value === 'string' && value.trim()) return value.trim();
    } catch {
      // Die spätere Vertragsprüfung meldet beschädigte JSON-Dateien präzise.
    }
  }
  return undefined;
};

const existingReels = fs.existsSync(weekdayTarget)
  ? fs.readdirSync(weekdayTarget, {withFileTypes: true}).filter((entry) => entry.isDirectory() && entry.name.startsWith('reel-'))
  : [];
if (existingReels.length > 1) throw new Error(`${dayName} enthält mehr als einen Reel-Ordner. Pro Tag ist genau ein Reel vorgesehen.`);
if (existingReels.length === 1) {
  const occupied = path.join(weekdayTarget, existingReels[0].name);
  const existingSlug = readProjectSlug(occupied);
  if (existingSlug !== slug) throw new Error(`${dayName} ist bereits durch ${existingReels[0].name} belegt. Pro Tag ist genau ein Reel erlaubt.`);
  ensureFinanceProjectStructure(occupied, {title, topic});
  if (path.resolve(occupied) !== path.resolve(finalTarget)) fs.renameSync(occupied, finalTarget);
}

const required = {
  scenePlan: 'timeline/scene-plan.json',
  sources: '05-review/quellen.md',
  voiceScript: '01-voice-script/script-fliesstext.txt',
  voiceoverPrompt: '01-voice-script/voiceover-anweisung.txt',
  imagePromptIndex: '03-szenen/alle-bildprompts.txt',
  sceneIndex: '03-szenen/scene-index.json',
  imagePromptManifest: 'timeline/prompt-manifest.json',
  voiceoverFinal: '02-audio/voiceover-final.wav',
  captionsFinal: '04-caption/voiceover-final.captions.json',
  socialCaption: '04-caption/social-caption.md',
  manifest: 'timeline/asset-manifest.json',
  videoDirectory: '06-video',
  storyboard: 'timeline/storyboard.md',
  motionDesign: 'timeline/motion-design.md',
  codexPackage: 'timeline/codex-reel-package.json',
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
    weekdayFolder,
    reelFolder,
    projectPath: relativeFinal,
    sourceCodePath: `alles/channels/finanzneo/src/reels/${publishDate}-${slug}`,
    publicRuntimePath: `alles/channels/finanzneo/public/reels/${slug}`,
    outPath: `alles/channels/finanzneo/out/reels/${publishDate}-${slug}`,
    topicSelection: {
      selectedBy,
      mode: selectionMode,
      reason: selectionReason,
      selectedAt: new Date().toISOString(),
    },
    required: {...(status.required ?? {}), ...required},
  });
  fs.writeFileSync(p.status, JSON.stringify(status, null, 2));

  history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
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
    weekdayFolder,
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
try {
  if (!fs.existsSync(tempTarget)) {
    const forwardedArgs = args.filter((arg) => !arg.startsWith('--publish-date='));
    const result = spawnSync(process.execPath, ['scripts/new-finance-reel.mjs', `.tmp-${slug}`, ...forwardedArgs.filter((arg) => arg !== slugArg)], {
      cwd: technicalRoot,
      encoding: 'utf8',
      env: {...process.env, FINANCE_REELS_ROOT: reelsRoot},
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
    createdTemp = true;
  }

  ensureFinanceProjectStructure(tempTarget, {title, topic});
  fs.mkdirSync(weekdayTarget, {recursive: true});
  fs.renameSync(tempTarget, finalTarget);
  movedToFinal = true;

  const temporaryRelative = path.relative(repositoryRoot, tempTarget).split(path.sep).join('/');
  const textExtensions = new Set(['.json', '.md', '.txt', '.mjs', '.js', '.ts', '.tsx']);
  const rewriteReferences = (directory) => {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) rewriteReferences(file);
      else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
        const current = fs.readFileSync(file, 'utf8');
        const updated = current.split(temporaryRelative).join(relativeFinal).split(`.tmp-${slug}`).join(slug);
        if (updated !== current) fs.writeFileSync(file, updated);
      }
    }
  };
  rewriteReferences(finalTarget);
  writeMetadata(finalTarget);

  const dayProjects = fs.readdirSync(weekdayTarget, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('reel-'));
  if (dayProjects.length !== 1 || dayProjects[0].name !== reelFolder) {
    throw new Error(`${dayName} muss genau einen Reel-Ordner enthalten; gefunden: ${dayProjects.map((entry) => entry.name).join(', ') || 'keiner'}.`);
  }
} catch (error) {
  if (movedToFinal && fs.existsSync(finalTarget)) {
    fs.mkdirSync(path.dirname(tempTarget), {recursive: true});
    fs.renameSync(finalTarget, tempTarget);
  }
  if (createdTemp && fs.existsSync(tempTarget)) fs.rmSync(tempTarget, {recursive: true, force: true});
  throw error;
}

console.log(`✓ Finance-Reel korrekt angelegt: ${relativeFinal}`);
console.log(`  ${dayName}: ${reelFolder}`);
console.log(`  Themenwahl: ${selectionMode} — ${selectionReason}`);
console.log('  Struktur: Woche → Wochentag → Reel-Thema');
console.log('  Projekt: 00-cover bis 06-video sowie render und timeline');
