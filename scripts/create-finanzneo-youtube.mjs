#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
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
const promptDirectory = resolve(projectRoot, '04-visuals/01-BILDPROMPTS');
const masterPromptPath = resolve(promptDirectory, 'GOOGLE-FLOW-PROMPT.txt');

if (!existsSync(legacyPromptPath)) {
  console.error('Interner Scaffold-Flow-Prompt fehlt; Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}

mkdirSync(promptDirectory, {recursive: true});
renameSync(legacyPromptPath, masterPromptPath);

const routingRules = `FINANZNEO ENGINE ROUTING — VERBINDLICH\n\nBevor du einen Google-Flow-Bildjob planst, entscheide zuerst das richtige Werkzeug.\n\nGOOGLE FLOW nur für PHYSICAL / EDITORIAL / REAL-LIFE Szenen mit greifbaren Objekten, Material und räumlicher Ursache/Wirkung.\n\nREMOTION / SVG / REACT bevorzugen für:\n- exakte Zahlen oder Rechenaufteilungen\n- Charts / Graphen\n- Checklisten und mehrere Textlabels\n- UI- oder Settings-Ansichten\n- Quotes / Key Statements\n- Timelines\n- text-/datengetriebene Vergleiche\n- einfache Symbole, die sauber in Code gebaut werden können\n\nWICHTIG: Ein einfaches Visual darf einfach bleiben. Nicht künstlich in eine 3D-Tile-, Dashboard- oder Panel-Szene verwandeln.\n\nFLOW STYLE AUTHORITY:\nPRIMARY_APPROVED_STYLE_ANCHOR: finanzneo-premium-physical-editorial-v8\nGROUNDING_REFERENCE: finanzneo-youtube-grounded-3d-black-v1\n\nJeder echte Flow-Szenenjob braucht EIN dominantes physisches Hero-Objekt (ca. 45–65 % der nutzbaren Fläche), medium-close Editorial-Kamera, echte Materialstärke, Tiefenhierarchie, weiche Kontaktschatten und einen nahtlosen deep-charcoal-green-black Hintergrund mit subtiler Tonalität. Kein kleines Motiv in riesiger schwarzer Leere. Keine Floating Tiles, Dashboards, UI-Panels, Dioramen, Canva-/PowerPoint-Optik oder sterile Produktaufnahme.\n`;

const masterPrompt = readFileSync(masterPromptPath, 'utf8');
const expandedVisualForms = masterPrompt.replace(
  'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
  'VISUAL_FORM: [physical-editorial-scene | character-story | object-story | metaphor | comparison | hybrid]',
);
writeFileSync(masterPromptPath, `${routingRules}\n\n${expandedVisualForms}`);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — Nutzerübergabe\n\nDer Nutzer kopiert **nur eine einzige Datei** vollständig in den Google-Flow-Agenten:\n\n\`04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt\`\n\nAlle Bildprompts liegen damit im Visual-Bereich und nicht mehr lose im Projekt-Root. Der Master-Prompt enthält Cover A/B/C, die einmalige Cover-Auswahl, alle tatsächlich für Flow vorgesehenen Szenenbild-Jobs, Dateinamen und QA. Präzise Zahlen-, Chart-, Checklist-, UI-, Quote- und Timeline-Visuals werden bevorzugt in Remotion/SVG/React gebaut statt als künstliche Flow-Infografik. Dateien unter \`04-visuals/EINZELNE-VISUALS/\` sowie \`04-visuals/thumbnail-prompt.txt\` sind interne Produktions-/Validatorquellen.\n`,
);

console.log('✓ Google Flow: Nutzer-Master-Prompt liegt in 04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt');
console.log('✓ Routing: precision-first Remotion · physical/editorial Google Flow.');
console.log('✓ Bildwelt: Premium Physical Editorial V8 ist primärer Flow-Stilanker.');
