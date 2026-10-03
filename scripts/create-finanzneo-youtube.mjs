#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
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

const visualWorldLock = `FINANZNEO GROUNDED 3D STYLE LOCK — HÖCHSTE VISUELLE REGEL\n\nAPPROVED_YOUTUBE_ANCHOR: finanzneo-youtube-grounded-3d-black-v1\nYOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-v9-front-readable-v2\n\nWICHTIG: Ein tiefer schwarzer Hintergrund allein ist NICHT die FinanzNeo-Bildwelt. Jeder generierte Job muss sichtbar in derselben bereits genehmigten grounded stylized-3D black world liegen: premium animation-film 3D, greifbare physische Objekte, glaubwürdige Proportionen, semi-realistische aber stilisierte Materialien, sichtbare Materialstärke, echte räumliche Tiefe, weiches Premium-Studiolicht, klare Highlights, Kontaktschatten und zurückhaltende Bodenreflexionen.\n\nFORM FREE — WORLD FIXED: Die Komposition darf simpel sein, die Render-Welt nicht. Symbol, Zahl, Chart, UI, Metapher, Asset-Gruppe, Concept Cluster oder Statement sind erlaubt, aber sie müssen dieselbe physische Material-/Licht-/Tiefenwirkung behalten.\n\nHARD FAIL / REGENERATE auch bei korrekten Zahlen oder Texten:\n- flat 2D infographic\n- plain colored rectangles with text\n- floating text cards on black\n- generic presentation slide\n- stock/vector icon or foreign clipart style\n- screenshot/dashboard card\n- Canva/social-template look\n- PowerPoint/Excel chart look\n- sterile floating boxes without physical depth/contact shadow\n\nMANDATORY STYLE SUFFIX FOR EVERY SUBJOB:\nRender inside the approved FinanzNeo grounded stylized-3D black world: premium animation-film 3D, tangible physical objects with believable proportions, semi-realistic stylized materials, visible thickness, real depth, soft premium studio lighting, readable highlights, soft contact shadows and subtle grounded reflections on a deep seamless black world. Emerald is positive/solution, warm red-orange is cost/risk/debt, ivory/soft gray neutral, gold only a small value accent. The composition may be simple, but NEVER render it as a flat infographic, presentation slide, stock icon, screenshot, dashboard card, Canva graphic or plain colored rectangles with text. If the result is flat, it is a FAIL and must be regenerated.\n\nThe Flow agent MUST include this style suffix in every separate thumbnail and scene-image generation job. A scene-specific prompt may never replace this style lock.\n`;

const simpleVisualForms = `FINANZNEO SIMPLE EXPLAINER FORMS — VERBINDLICH\n\nDie Bildwelt bleibt fest, aber die visuelle Form ist frei. Nicht jeder Beat braucht eine komplexe 3D-Szene. Wähle die EINFACHSTE Form, die den Punkt sofort verständlich macht. Erlaubt sind:\n- SYMBOL / OBJECT FOCUS: ein großes inhaltsspezifisches, greifbares 3D-Objekt\n- NUMBER FOCUS: zentraler Betrag/Prozentsatz/Zielwert mit derselben Material-/Lichtwelt\n- SIMPLE CHART: frontal, mathematisch korrekt und in V9-Material/Licht, nicht PowerPoint\n- ROUTE / GOAL / METAPHOR: z. B. Zielscheibe, Bergpfad, Bank, Haus, Fahrzeug\n- UI / APP EXAMPLE: frontal, unbranded, als physisches Premium-Panel/Device, kein Screenshot\n- ASSET / OBJECT GROUP: wenige kohärente physische Objekte\n- CONCEPT CLUSTER: zentrales Objekt mit wenigen Faktoren\n- QUOTE / KEY STATEMENT: kurze Aussage in einer hochwertigen physischen/editorialen V9-Komposition\n- klassische Story-/Objektszene, Vergleich, Editorial, Illustration, Metapher oder Hybrid\n\nEINFACH BEDEUTET NICHT FLACH. Die Form wird reduziert, nicht die FinanzNeo-Renderwelt.\n`;

const masterPrompt = readFileSync(masterPromptPath, 'utf8');
const expandedVisualForms = masterPrompt.replace(
  'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
  'VISUAL_FORM: [character-story | object-story | symbol-object | number-focus | comparison | chart | diagram | ui-example | quote-card | asset-group | concept-cluster | editorial | illustration | metaphor | hybrid]',
);
writeFileSync(masterPromptPath, `${visualWorldLock}\n\n${simpleVisualForms}\n\n${expandedVisualForms}`);

// Make the same grounded-3D authority visible in every internal prompt source too.
const imageWorldPath = resolve(projectRoot, '04-visuals/bildwelt.txt');
writeFileSync(imageWorldPath, `FINANZNEO YOUTUBE IMAGE WORLD\n\n${visualWorldLock}\n\n${simpleVisualForms}`);

const thumbnailPromptPath = resolve(projectRoot, '04-visuals/thumbnail-prompt.txt');
if (existsSync(thumbnailPromptPath)) {
  const existing = readFileSync(thumbnailPromptPath, 'utf8');
  writeFileSync(thumbnailPromptPath, `${visualWorldLock}\n\n${existing}`);
}

const visualsRoot = resolve(projectRoot, '04-visuals/EINZELNE-VISUALS');
if (existsSync(visualsRoot)) {
  for (const entry of readdirSync(visualsRoot, {withFileTypes:true})) {
    if (!entry.isDirectory()) continue;
    const imagePromptPath = resolve(visualsRoot, entry.name, 'bildprompt.txt');
    if (!existsSync(imagePromptPath)) continue;
    const existing = readFileSync(imagePromptPath, 'utf8');
    writeFileSync(imagePromptPath, `${visualWorldLock}\n\n${existing}`);
  }
}

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — Nutzerübergabe\n\nDer Nutzer kopiert **nur eine einzige Datei** vollständig in den Google-Flow-Agenten:\n\n\`GOOGLE-FLOW-PROMPT.txt\`\n\nDieser Master-Prompt enthält Cover A/B/C, einmalige Cover-Auswahl, alle Szenenbild-Jobs, Dateinamen, QA sowie den harten Grounded-3D-Style-Lock. Einfache Symbol-, Zahlen-, Chart-, UI-, Metapher-, Asset-, Concept-Cluster- und Statement-Visuals sind erlaubt, dürfen aber niemals in flache Infografik-/Slide-/Dashboard-Optik wechseln. Dateien unter \`04-visuals/EINZELNE-VISUALS/\` sowie \`04-visuals/thumbnail-prompt.txt\` sind interne Produktions-/Validatorquellen und werden nicht manuell in Flow kopiert.\n`,
);

console.log('✓ Google Flow: genau ein nutzerseitiger Master-Prompt erzeugt: GOOGLE-FLOW-PROMPT.txt');
console.log('✓ Bildwelt: approved grounded stylized-3D black world ist harte Style-Autorität.');
console.log('✓ Style-Lock wurde zusätzlich in bildwelt.txt, thumbnail-prompt.txt und alle Bildprompt-Quellen geschrieben.');
console.log('✓ Visualformen: simpel oder komplex erlaubt; flache Infografik-/Slide-Drift ist verboten.');
