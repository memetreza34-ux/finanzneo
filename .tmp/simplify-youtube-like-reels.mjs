#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

const project = resolve('youtube/etf-100-euro-kompletter-weg');
const ensure = (path) => mkdirSync(path, {recursive: true});
const move = (from, to) => {
  if (!existsSync(from)) return;
  ensure(dirname(to));
  if (existsSync(to)) throw new Error(`Ziel existiert bereits: ${to}`);
  renameSync(from, to);
};
const moveContents = (from, to) => {
  if (!existsSync(from)) return;
  ensure(to);
  for (const entry of readdirSync(from)) move(join(from, entry), join(to, entry));
  rmSync(from, {recursive: true, force: true});
};

for (const dir of ['01-script', '02-audio', '03-szenen', '04-caption', '05-projektdateien', '06-export']) {
  ensure(join(project, dir));
}

// Script + planning: gleiche sichtbare Top-Level-Logik wie bei Reels.
moveContents(join(project, '02-script'), join(project, '01-script'));
moveContents(join(project, '03-audio'), join(project, '02-audio'));
moveContents(join(project, '05-publishing'), join(project, '04-caption'));
moveContents(join(project, '06-projektdateien'), join(project, '05-projektdateien'));

move(join(project, '01-recherche', 'briefing.md'), join(project, '05-projektdateien', 'briefing.md'));
move(join(project, '01-recherche', 'recherche-quellen.md'), join(project, '05-projektdateien', 'recherche-quellen.md'));
rmSync(join(project, '01-recherche'), {recursive: true, force: true});

const oldVisuals = join(project, '04-visuals');
move(join(oldVisuals, '00-ALLE-BILDER-HIER-REIN'), join(project, '03-szenen', '00-ALLE-BILDER-HIER-REIN'));
move(join(oldVisuals, 'alle-bildprompts.txt'), join(project, '03-szenen', 'alle-bildprompts.txt'));
move(join(oldVisuals, 'bildwelt.txt'), join(project, '03-szenen', 'bildwelt.txt'));
move(join(oldVisuals, 'thumbnail-prompt.txt'), join(project, '03-szenen', 'thumbnail-prompt.txt'));
move(join(oldVisuals, 'visual-index.json'), join(project, '05-projektdateien', 'scene-index.json'));

const oldSingle = join(oldVisuals, 'EINZELNE-VISUALS');
if (existsSync(oldSingle)) {
  for (const entry of readdirSync(oldSingle).sort()) {
    const match = /^visual-(\d{2})$/.exec(entry);
    if (!match) throw new Error(`Unerwarteter Visual-Ordner: ${entry}`);
    move(join(oldSingle, entry), join(project, '03-szenen', `szene-${match[1]}`));
  }
  rmSync(oldSingle, {recursive: true, force: true});
}
rmSync(oldVisuals, {recursive: true, force: true});

writeFileSync(
  join(project, '06-export', 'README.md'),
  '# EXPORT\n\nHier landet der finale 1920×1080-YouTube-Render nach Phase 3.\n',
);

const OLD_TOKENS = ['01-recherche', '02-script', '03-audio', '04-visuals', '05-publishing', '06-projektdateien'];
const TEXT_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.md', '.txt', '.yml', '.yaml']);
const ext = (path) => path.slice(path.lastIndexOf('.'));

const rewritePaths = (content) => {
  let out = content;
  out = out.replaceAll('01-recherche/briefing.md', '05-projektdateien/briefing.md');
  out = out.replaceAll('01-recherche/recherche-quellen.md', '05-projektdateien/recherche-quellen.md');
  out = out.replaceAll('04-visuals/visual-index.json', '05-projektdateien/scene-index.json');
  out = out.replace(/04-visuals\/EINZELNE-VISUALS\/visual-(\d{2})\//g, '03-szenen/szene-$1/');
  out = out.replaceAll('02-script/', '01-script/');
  out = out.replaceAll('03-audio/', '02-audio/');
  out = out.replaceAll('04-visuals/', '03-szenen/');
  out = out.replaceAll('05-publishing/', '04-caption/');
  out = out.replaceAll('06-projektdateien/', '05-projektdateien/');
  return out;
};

const rewriteTree = (root, predicate = () => true) => {
  if (!existsSync(root)) return;
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) rewriteTree(path, predicate);
    else if (TEXT_EXT.has(ext(path)) && predicate(path)) {
      const before = readFileSync(path, 'utf8');
      const after = rewritePaths(before);
      if (after !== before) writeFileSync(path, after);
    }
  }
};

// Projekt selbst vollständig auf neue Pfade umbiegen.
rewriteTree(project);

// Nur YouTube-bezogene zentrale Quellen migrieren; Reel-Core bleibt tabu.
const centralRoots = ['scripts', 'tests', 'docs', '.agent', 'youtube'];
for (const centralRoot of centralRoots) {
  rewriteTree(resolve(centralRoot), (path) => {
    if (path.startsWith(project)) return false;
    const content = readFileSync(path, 'utf8');
    const hasOldToken = OLD_TOKENS.some((token) => content.includes(token));
    const youtubeRelated = /youtube/i.test(path) || /YouTube|youtube-longform|YOUTUBE_/i.test(content);
    return hasOldToken && youtubeRelated;
  });
}

// Scaffolder: Szenen direkt unter 03-szenen, kein EINZELNE-VISUALS-Zwischenordner.
const scaffoldPath = resolve('scripts/scaffold-finanzneo-youtube.mjs');
let scaffold = readFileSync(scaffoldPath, 'utf8');
scaffold = scaffold.replace(
  "const directory = `03-szenen/EINZELNE-VISUALS/${id}`;",
  "const directory = `03-szenen/szene-${number}`;",
);
if (!scaffold.includes("write('06-export/README.md'")) {
  scaffold = scaffold.replace(
    "\nconsole.log(`\\n✓ YouTube-Longform-Projekt angelegt: ${targetArg}`);",
    "\nwrite('06-export/README.md', '# EXPORT\\n\\nHier landet der finale 1920×1080-YouTube-Render nach Phase 3.\\n');\n\nconsole.log(`\\n✓ YouTube-Longform-Projekt angelegt: ${targetArg}`);",
  );
}
writeFileSync(scaffoldPath, scaffold);

// Validator: exakt die gleiche sichtbare Hauptstruktur wie ein Reel.
const validatorPath = resolve('scripts/validate-youtube.mjs');
let validator = readFileSync(validatorPath, 'utf8');
validator = validator.replace(
  /const requiredDirectories = \[[^\n]+\];/,
  "const requiredDirectories = ['01-script', '02-audio', '03-szenen', '04-caption', '05-projektdateien', '06-export', IMAGE_INBOX];",
);
writeFileSync(validatorPath, validator);

// Contract: visuelles Indexfile gehört wie technische Reel-Metadaten in 05-projektdateien.
const contractPath = resolve('scripts/lib/youtube-contract.mjs');
let contract = readFileSync(contractPath, 'utf8');
contract = contract.replace("export const VISUAL_INDEX = '03-szenen/visual-index.json';", "export const VISUAL_INDEX = '05-projektdateien/scene-index.json';");
writeFileSync(contractPath, contract);

// Scaffolder schreibt den Index ebenfalls an den Contract-Pfad statt hart codiert.
scaffold = readFileSync(scaffoldPath, 'utf8');
scaffold = scaffold.replace("write('03-szenen/visual-index.json',", "write(VISUAL_INDEX,");
if (!scaffold.includes('VISUAL_INDEX,')) {
  scaffold = scaffold.replace('  SUBTITLE_MODE,\n', '  SUBTITLE_MODE,\n  VISUAL_INDEX,\n');
}
writeFileSync(scaffoldPath, scaffold);

// Falls VISUAL_INDEX Import wegen vorhandenem String noch fehlt, sauber ergänzen.
scaffold = readFileSync(scaffoldPath, 'utf8');
if (scaffold.includes('write(VISUAL_INDEX,') && !/\bVISUAL_INDEX,/.test(scaffold.split('} from')[0])) {
  scaffold = scaffold.replace('  SUBTITLE_MODE,\n', '  SUBTITLE_MODE,\n  VISUAL_INDEX,\n');
  writeFileSync(scaffoldPath, scaffold);
}

// Sichtbare README des konkreten Projekts klar und knapp halten.
writeFileSync(
  join(project, 'README.md'),
  '# Was passiert mit deinen 100 € im ETF?\n\nFinanzNeo YouTube Longform · 16:9 · ca. 8–10 Minuten · Motion V2.\n\n## Struktur wie bei den Reels\n\n- `01-script/` – Voiceover, Dramaturgie, Retention\n- `02-audio/` – finales Voiceover + Wort-Timings\n- `03-szenen/` – Bildprompts, Flow-Bilder und alle 28 Szenen\n- `04-caption/` – YouTube-Publishing + Social-Promos\n- `05-projektdateien/` – Quellen, Scene-Index, Timeline, Motion-Seal und Produktionspläne\n- `06-export/` – finaler Render\n\nPhase 1 ist vollständig. Phase 2 benötigt nur die finalen 16:9-Bilder, genau ein Voiceover und echte Wort-Timestamps.\n',
);

// Harte Nachkontrolle: alte YouTube-Top-Level-Pfade dürfen in aktiven YouTube-Quellen nicht mehr vorkommen.
const leftovers = [];
for (const root of [project, resolve('scripts'), resolve('tests'), resolve('docs'), resolve('.agent'), resolve('youtube')]) {
  if (!existsSync(root)) continue;
  const visit = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) visit(path);
      else if (TEXT_EXT.has(ext(path))) {
        const content = readFileSync(path, 'utf8');
        const relevant = path.startsWith(project) || /youtube/i.test(path) || /YouTube|youtube-longform|YOUTUBE_/i.test(content);
        if (!relevant) continue;
        for (const token of OLD_TOKENS) if (content.includes(`${token}/`)) leftovers.push(`${path}: ${token}/`);
      }
    }
  };
  visit(root);
}
if (leftovers.length) throw new Error(`Alte YouTube-Struktur noch referenziert:\n${[...new Set(leftovers)].join('\n')}`);

console.log('YouTube-Struktur erfolgreich auf Reel-Layout migriert.');
