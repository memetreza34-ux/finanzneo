#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  YOUTUBE_APPROVED_STYLE_REFERENCES,
  YOUTUBE_FLOW_NATURAL_LOOK_MARKER,
  YOUTUBE_FLOW_VISUAL_MODES,
  YOUTUBE_IMAGE_WORLD_FILE,
  YOUTUBE_IMAGE_WORLD_LOCK,
} from './lib/youtube-contract.mjs';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

if (!target) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types ...]');
  process.exit(1);
}

const scaffold = spawnSync(process.execPath, [resolve('scripts/scaffold-finanzneo-youtube.mjs'), ...args], {stdio: 'inherit'});
if (scaffold.status !== 0) process.exit(scaffold.status ?? 1);

const projectRoot = resolve(target);
const visualsRoot = resolve(projectRoot, '04-visuals/EINZELNE-VISUALS');
const promptDirectory = resolve(projectRoot, '04-visuals/01-BILDPROMPTS');
const allPromptsPath = resolve(projectRoot, '04-visuals/alle-bildprompts.txt');
const imageWorldOldPath = resolve(projectRoot, '04-visuals/bildwelt.txt');
const imageWorldNewPath = resolve(promptDirectory, 'bildwelt.txt');
const thumbnailOldPath = resolve(projectRoot, '04-visuals/thumbnail-prompt.txt');
const thumbnailNewPath = resolve(promptDirectory, 'thumbnail-prompt.txt');

if (!existsSync(allPromptsPath)) {
  console.error('04-visuals/alle-bildprompts.txt fehlt; vollständiger Flow-Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}
mkdirSync(promptDirectory, {recursive: true});

// Bildwelt A+B (2026-10-04): Look fest, Inhalt frei. Kanonische Quelle ist
// YOUTUBE_IMAGE_WORLD_FILE; dieser Text ist ihre ausführbare Kurzfassung für Flow.
const visualSystemRules = `FINANZNEO GOOGLE FLOW MASTER — VERBINDLICH

DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG. NICHT nur erklären oder Prompts zurückgeben: die geforderten Bildjobs tatsächlich starten.

STYLE_AUTHORITY: ${YOUTUBE_IMAGE_WORLD_LOCK}
SOURCE_VISUAL_LANGUAGE: finanzneo-stylized-3d-animated-black-v9
APPROVED_STYLE_REFERENCES: ${YOUTUBE_APPROVED_STYLE_REFERENCES}
FLOW_IMAGE_POLICY: scene-first-no-infographic-v1
PRECISION_GRAPHICS_OWNER: REMOTION

BILDWELT: LOOK FEST — INHALT FREI.
Jedes Flow-Bild unterstützt den Sprechpunkt visuell, im Look eines hochwertigen stilisierten 3D-Animationsfilms auf tiefem Schwarz. Die meisten Bilder brauchen keine Person und keine Geschichte: ein starker Gegenstand, eine einfache Szene oder ein Zitat reicht. Alles darf vorkommen, wenn es passt — nichts auf Krampf.

LOOK — IMMER:
- stylized 3D animated-feature-film rendering, never photorealistic
- when a person appears: appealing stylized adult character with an expressive face; no real identifiable person
- real everyday objects with believable proportions and recognizable details: phone, bill, letter, bank card, wallet, washing machine, car, calendar
- semi-realistic material cues rendered soft and clean
- warm cinematic key light, gentle rim light separating the subject from the black, soft contact shadows
- deep seamless black world; a small local set may exist when it helps and dissolves into black
- Emerald = positiv/Lösung, warmes Red-Orange = Kosten/Warnung, Gold = kleiner Geld-Akzent, Ivory/Soft Gray = neutral; natürliche Haut- und Kleidungsfarben sind erlaubt

${YOUTUBE_FLOW_NATURAL_LOOK_MARKER}:
Jedes Bild wirkt wie ein ruhiges Standbild aus einem Animationsfilm, nicht wie ein KI-Poster. Einfach, natürlich, sofort verständlich.
- natural and calm: few real objects, believable everyday arrangement, natural proportions, natural colors, soft natural light
- real things in a real situation, never an abstract symbol that must be decoded
- clean but not plastic-shiny; no over-sharpened hyper-detail, no oversaturated colors
- text only exactly the requested words; no extra invented labels, no garbled lettering
- KI-SLOP VERBOTEN: glowing or neon edges, glass or crystal bars/blocks/arrows, value blocks or value stacks as symbols, falling bars or arrows, dramatic red glow, smoke, sparks, lens flares, heavy fog, epic poster drama, banknote piles as decoration, cluttered backgrounds

ENTSCHEIDENDER MOMENT — NUR AB UND ZU: Nur wenn der Sprechpunkt von etwas handelt, das passiert, zeigt das Bild diese Sekunde. Keine Geschichte und keine Person erfinden, nur damit eine da ist.

ABWECHSLUNG: Jedes Bild zeigt eine sichtbar andere Situation, einen anderen Ort oder Blickwinkel als das vorige.

TEXT: kurze deutsche Objektlabels direkt am Gegenstand, wenn sie helfen. Keine Sätze, kein Logo.

KREATIV IST ERWÜNSCHT: Übertreibung und Bildideen aus echten Gegenständen, solange es auf einen Blick lesbar ist. ZITATE, STICHWORTE, TABELLEN: Remotion-Karten mit exaktem Text (src/design-system/karten.tsx), nicht Flow.\n\nDIAGRAMME UND ZAHLEN: Charts, Diagramme mit Achsen, exakte Zahlen, Tabellen, Checklisten und UI-Zustände baut Remotion, nicht Flow.\n\nPROMPTS: Jeder Bildprompt ist ein kurzer englischer Absatz in immer derselben Form; nur die Labels im Bild sind deutsch.

HARD FAIL — DENSELBEN JOB NEU GENERIEREN: fotorealistisch; grün-goldene Symbolwelt (Bankgebäude, Schild, Tresor, Münzberge, leuchtende Icons) als Hauptidee; abstrakte Finanzskulpturen statt echter Situation (Schuldenklammer, Zinsmagnet, Zahlungs-Token, Geldband, Wertblock, Wertstapel); KI-Poster-Look (Glas-/Leuchtbalken, Neon, Rauch, Funken, Drama, erfundene Mini-Labels); dunkelgrün-schwarzer Monochrom-Look; Chart, Diagramm, flache Infografik, Dashboard, UI, Checkliste oder Progress-Bar; Zitat oder längerer Text im Bild; schwebende Karten oder Tiles; heller oder farbiger Hintergrund; Mini-Diorama; Hauptmotiv zu klein; Spielzeug-, Plastik- oder Knete-Look; Person oder Geschichte ohne Grund; dieselbe Szene wie das vorige Bild.
`;

const oldImagePrompt = 'Show [THE EXACT CONTENT-SPECIFIC VISUAL]. If this is a chart or diagram, show it straight-on from the front with undistorted axes/labels/proportions. Include only these short German object labels if needed: [LABELS].';
const imagePromptTemplate = `IMAGE PROMPT
Stylized 3D animated feature film still, 16:9. [WHAT IS IN THE FRAME]. [OPTIONAL DECISIVE MOMENT: WHAT IS HAPPENING — ONLY IF A MOMENT REALLY FITS]. [PLACE, ONLY AS MUCH AS NEEDED]. Only text: [SHORT GERMAN TEXT, OR NONE]. Warm soft light, deep black background. Not photorealistic, no logos.

QA
PASS only if it looks like it belongs to the stylized 3D animated-film world on black and the idea is clear in about two seconds.`;

const allPrompts = readFileSync(allPromptsPath, 'utf8');
const master = allPrompts.replaceAll(oldImagePrompt, imagePromptTemplate);
writeFileSync(allPromptsPath, `${visualSystemRules}\n\n${master}`);

// Internal prompt sources live together under 04-visuals/01-BILDPROMPTS/.
// The user-facing complete master prompt deliberately stays at 04-visuals/alle-bildprompts.txt.
if (existsSync(imageWorldOldPath)) {
  const existing = readFileSync(imageWorldOldPath, 'utf8').replaceAll(oldImagePrompt, imagePromptTemplate);
  writeFileSync(imageWorldOldPath, `${visualSystemRules}\n\n${existing}`);
  renameSync(imageWorldOldPath, imageWorldNewPath);
}
if (existsSync(thumbnailOldPath)) {
  const existing = readFileSync(thumbnailOldPath, 'utf8');
  writeFileSync(thumbnailOldPath, `${visualSystemRules}\n\n${existing}`);
  renameSync(thumbnailOldPath, thumbnailNewPath);
}

if (existsSync(visualsRoot)) {
  for (const entry of readdirSync(visualsRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const oldPromptPath = resolve(visualsRoot, entry.name, 'bildprompt.txt');
    if (!existsSync(oldPromptPath)) continue;
    const newPromptDir = resolve(promptDirectory, entry.name);
    const newPromptPath = resolve(newPromptDir, 'bildprompt.txt');
    mkdirSync(newPromptDir, {recursive: true});
    const existing = readFileSync(oldPromptPath, 'utf8').replaceAll(oldImagePrompt, imagePromptTemplate);
    writeFileSync(oldPromptPath, `${visualSystemRules}\n\n${existing}`);
    renameSync(oldPromptPath, newPromptPath);
  }
}

const indexPath = resolve(projectRoot, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageWorld.referencePromptFile = '04-visuals/01-BILDPROMPTS/bildwelt.txt';
index.imageWorld.imageWorldFile = YOUTUBE_IMAGE_WORLD_FILE;
index.imageWorld.primaryApprovedStyleAnchor = 'finanzneo-stylized-3d-animated-black-v9';
index.imageWorld.approvedStyleReferences = YOUTUBE_APPROVED_STYLE_REFERENCES;
delete index.imageWorld.legacyPromptDna;
index.imageWorld.flowVisualModes = [...YOUTUBE_FLOW_VISUAL_MODES];
index.imageWorld.decisiveMomentRequired = true;
index.imageWorld.sceneSpecificColorsAllowed = true;
index.imageWorld.peopleAllowedWhenUseful = true;
index.imageWorld.precisionGraphicsOwner = 'remotion';
index.imageWorld.flowInfographicLayoutsForbidden = true;
index.thumbnail.planFile = '04-visuals/01-BILDPROMPTS/thumbnail-prompt.txt';
for (const visual of index.visuals ?? []) {
  const newImagePrompt = `04-visuals/01-BILDPROMPTS/${visual.id}/bildprompt.txt`;
  if (visual.type === 'image') visual.planFile = newImagePrompt;
  if (visual.type === 'hybrid') visual.imagePlanFile = newImagePrompt;
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — genau eine Datei kopieren\n\nKopiere **genau diese Datei vollständig und 1:1** in den Google-Flow-Agenten:\n\n\`04-visuals/alle-bildprompts.txt\`\n\nDiese Datei ist immer der vollständige ausführbare Master-Prompt. Sie darf niemals durch einen Hinweis, Redirect oder Platzhalter ersetzt werden. Jeder Bildprompt ist ein kurzer englischer Absatz in immer derselben Form: Look, was im Bild ist, optional der Moment, Ort, erlaubter deutscher Text, Licht und tiefschwarzer Hintergrund. Bildwelt: Look fest, Inhalt frei — jedes Bild sieht aus wie ein Standbild aus einem stilisierten 3D-Animationsfilm auf tiefem Schwarz; Menschen, Hände, echte Alltagsgegenstände und kleine Orte dürfen vorkommen, wenn sie den Sprechpunkt erklären. Präzise Daten-/UI-Grafiken bleiben Remotion-owned. Interne Stil-/Thumbnail-/Einzelpromptquellen liegen unter \`04-visuals/01-BILDPROMPTS/\`.\n`,
);

console.log('✓ Google Flow: vollständiger Nutzer-Master-Prompt = 04-visuals/alle-bildprompts.txt');
console.log('✓ Prompts: ein kurzer englischer Absatz pro Bild, immer gleiche Form — Look, Motiv, Moment, Ort, Labels, Licht, Schwarz.');
console.log(`✓ Bildwelt: ${YOUTUBE_IMAGE_WORLD_LOCK} — Animationsfilm-Look auf Schwarz, Inhalt frei; Präzisionsgrafiken gehören Remotion.`);
