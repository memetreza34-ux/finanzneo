#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const mode = valueOf('--mode');
const target = valueOf('--target');
const title = valueOf('--title');
const typesArg = valueOf('--types');
const visualCountArg = valueOf('--visual-count');

const allowedModes = ['images-only', 'hybrid'];
if (!mode || !allowedModes.includes(mode)) {
  console.error(`--mode muss enthalten: ${allowedModes.join(' | ')}`);
  process.exit(1);
}
if (!target || !title) {
  console.error('Nutzung: npm run youtube:create:mode -- --mode <images-only|hybrid> --target youtube/<Projekt> --title "Titel" [--visual-count N | --types ...]');
  process.exit(1);
}

let types = typesArg;
if (mode === 'images-only') {
  const visualCount = Number(visualCountArg);
  if (!Number.isInteger(visualCount) || visualCount < 1) {
    console.error('images-only benötigt --visual-count mit einer ganzen Zahl >= 1.');
    process.exit(1);
  }
  if (typesArg) {
    console.error('images-only erzeugt die Typen automatisch. --types bitte weglassen.');
    process.exit(1);
  }
  types = Array.from({length: visualCount}, () => 'image').join(',');
} else if (!typesArg) {
  console.error('hybrid benötigt --types, z. B. image,animation,image,data,hybrid.');
  process.exit(1);
}

const scaffold = spawnSync(process.execPath, [
  resolve('scripts/scaffold-finanzneo-youtube.mjs'),
  '--target', target,
  '--title', title,
  '--types', types,
], {encoding: 'utf8'});

if (scaffold.status !== 0) {
  process.stderr.write(scaffold.stderr || scaffold.stdout || 'Scaffolder fehlgeschlagen.\n');
  process.exit(scaffold.status ?? 1);
}

const root = resolve(target);
if (!existsSync(root)) {
  console.error(`Projektordner wurde nicht erzeugt: ${target}`);
  process.exit(1);
}

const modeContract = mode === 'images-only'
  ? {
      id: 'images-only',
      staticImageVisualsOnly: true,
      remotionExplainerVisualsAllowed: false,
      remotionAnimationAllowed: false,
      allowedVisualTypes: ['image'],
      assemblyIntent: 'static-image-sequence-with-voiceover',
      oneMainIdeaPerVisual: true,
      recommendedVoiceoverSentencesPerImage: [1, 2],
    }
  : {
      id: 'hybrid',
      staticImageVisualsOnly: false,
      remotionExplainerVisualsAllowed: true,
      remotionAnimationAllowed: true,
      allowedVisualTypes: ['image', 'hybrid', 'animation', 'data', 'real-asset'],
      assemblyIntent: 'mixed-images-assets-and-remotion',
      oneMainIdeaPerVisual: true,
      recommendedVoiceoverSentencesPerImage: [1, 2],
    };

writeFileSync(
  resolve(root, '06-projektdateien/production-mode.json'),
  `${JSON.stringify(modeContract, null, 2)}\n`,
);

const indexPath = resolve(root, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.productionMode = modeContract;
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(root, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(readmePath, `${readme.trimEnd()}\n\n## Production Mode\n\nPRODUCTION_MODE: ${mode}\n\n${mode === 'images-only'
  ? 'Dieses Projekt verwendet ausschließlich statische Flow-Bilder als Visualquelle. Keine Remotion-Erklärgrafiken, Charts, Icons, Überschriften oder Animationen. Pro Bild gilt ein Hauptgedanke und normalerweise 1–2 kurze Voiceover-Sätze.'
  : 'Dieses Projekt darf statische Bilder, echte Assets und Remotion-Erklärvisuals/Animationen kombinieren.'}\n`);

if (mode === 'images-only') {
  const replaceImageOnlyPolicy = (text) => text
    .replaceAll('REMOTION_OVERLAY_TEXT: [IMPORTANT TEXT/NUMBERS ADDED LATER, NOT GENERATED IN THE IMAGE]', 'IMAGE_ONLY_TEXT_POLICY: No Remotion overlay is used in this mode. Keep the frame understandable without explanatory overlay text or critical generated numbers. Only short physical German object labels are allowed when needed.')
    .replaceAll('Important explanatory text and numbers will be added later in Remotion.', 'No Remotion overlay will be added in this mode. Keep the frame understandable without explanatory text overlays or critical generated numbers.')
    .replaceAll('Remotion owns explanatory text and numbers.', 'This images-only production uses no Remotion explanatory layer. Keep the image self-explanatory and use only short physical German object labels when necessary.')
    .replaceAll('clear negative space for typography that will be added later', 'clear balanced negative space; no later typography layer is planned in images-only mode')
    .replaceAll('Do not generate the headline inside the image.', 'Do not generate a headline inside the image; this mode intentionally tests whether the visuals work without headline overlays.');

  const rewriteTxtFiles = (directory) => {
    for (const entry of readdirSync(directory)) {
      const path = resolve(directory, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) rewriteTxtFiles(path);
      else if (entry.endsWith('.txt')) {
        const original = readFileSync(path, 'utf8');
        const replaced = replaceImageOnlyPolicy(original);
        if (replaced !== original) writeFileSync(path, replaced);
      }
    }
  };
  rewriteTxtFiles(resolve(root, '04-visuals'));

  writeFileSync(
    resolve(root, '06-projektdateien/remotion-plan.md'),
    '# Remotion-Plan — deaktiviert\n\nPRODUCTION_MODE: images-only\n\nFür dieses Projekt sind keine Remotion-Erklärvisuals, Charts, Icons, Überschriften, Datenanimationen oder Hybrid-Szenen vorgesehen. Alle geplanten Visuals sind statische 16:9-Bilder.\n',
  );
}

console.log(scaffold.stdout.trim());
console.log(`\n✓ Production Mode gesetzt: ${mode}`);
if (mode === 'images-only') console.log('  Nur statische Bilder · keine Remotion-Erklärvisuals · keine Animationen');
