#!/usr/bin/env node
import {existsSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

if (!target) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types ...]');
  process.exit(1);
}

const scaffold = spawnSync(
  process.execPath,
  [resolve('scripts/scaffold-finanzneo-youtube.mjs'), ...args],
  {stdio: 'inherit'},
);

if (scaffold.status !== 0) {
  process.exit(scaffold.status ?? 1);
}

const projectRoot = resolve(target);
const legacyPromptPath = resolve(projectRoot, '04-visuals/alle-bildprompts.txt');
const masterPromptPath = resolve(projectRoot, 'GOOGLE-FLOW-PROMPT.txt');

if (!existsSync(legacyPromptPath)) {
  console.error('Interner Scaffold-Flow-Prompt fehlt; Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}

renameSync(legacyPromptPath, masterPromptPath);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — Nutzerübergabe\n\nDer Nutzer kopiert **nur eine einzige Datei** vollständig in den Google-Flow-Agenten:\n\n\`GOOGLE-FLOW-PROMPT.txt\`\n\nDieser eine Master-Prompt enthält Cover A/B/C, die einmalige Cover-Auswahl, alle Szenenbild-Jobs, Dateinamen, QA und die komplette V9-Bildwelt. Dateien unter \`04-visuals/EINZELNE-VISUALS/\` sowie \`04-visuals/thumbnail-prompt.txt\` sind interne Produktions-/Validatorquellen und werden nicht manuell in Flow kopiert.\n`,
);

console.log('✓ Google Flow: genau ein nutzerseitiger Master-Prompt erzeugt: GOOGLE-FLOW-PROMPT.txt');
