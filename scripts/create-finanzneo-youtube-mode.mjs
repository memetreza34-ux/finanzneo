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

const sharedLayoutContract = {
  id: 'finanzneo-youtube-framed-scene-v1',
  frameWidth: 1920,
  frameHeight: 1080,
  sceneHeadingRequired: true,
  sceneIconRequired: true,
  flowImageFullscreenForbidden: true,
  flowImagePlacement: 'contained-visual-window',
  deepBlackFrameBackgroundVisible: true,
  headingAndIconOutsideFlowImage: true,
  recommendedOuterMarginPx: 72,
  recommendedHeaderHeightPx: [150, 190],
  recommendedIconSizePx: [56, 72],
  recommendedVisualWindowMaxWidthRatio: 0.78,
  recommendedVisualWindowMaxHeightRatio: 0.70,
};

const modeContract = mode === 'images-only'
  ? {
      id: 'images-only',
      staticImageVisualsOnly: true,
      staticSceneLayoutRequired: true,
      staticLayoutAssemblyAllowed: true,
      remotionExplainerVisualsAllowed: false,
      remotionAnimationAllowed: false,
      allowedVisualTypes: ['image'],
      assemblyIntent: 'static-framed-layout-sequence-with-voiceover',
      oneMainIdeaPerVisual: true,
      recommendedVoiceoverSentencesPerImage: [1, 2],
      layoutContractId: sharedLayoutContract.id,
    }
  : {
      id: 'hybrid',
      staticImageVisualsOnly: false,
      staticSceneLayoutRequired: true,
      staticLayoutAssemblyAllowed: true,
      remotionExplainerVisualsAllowed: true,
      remotionAnimationAllowed: true,
      allowedVisualTypes: ['image', 'hybrid', 'animation', 'data', 'real-asset'],
      assemblyIntent: 'animated-framed-layout-with-images-assets-and-remotion',
      oneMainIdeaPerVisual: true,
      recommendedVoiceoverSentencesPerImage: [1, 2],
      layoutContractId: sharedLayoutContract.id,
    };

writeFileSync(
  resolve(root, '06-projektdateien/production-mode.json'),
  `${JSON.stringify(modeContract, null, 2)}\n`,
);
writeFileSync(
  resolve(root, '06-projektdateien/layout-contract.json'),
  `${JSON.stringify(sharedLayoutContract, null, 2)}\n`,
);

const indexPath = resolve(root, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.productionMode = modeContract;
index.layoutContract = sharedLayoutContract;
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(root, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(readmePath, `${readme.trimEnd()}\n\n## Production Mode\n\nPRODUCTION_MODE: ${mode}\nLAYOUT_CONTRACT: ${sharedLayoutContract.id}\n\n${mode === 'images-only'
  ? 'Dieses Projekt verwendet statische Flow-Bilder ohne Animation. Jede fertige Szene behält trotzdem das normale FinanzNeo-YouTube-Layout: kurze Überschrift + passendes Icon + eingebettetes Visualfenster. Das Flow-Bild darf niemals fullscreen als kompletter Hintergrund verwendet werden.'
  : 'Dieses Projekt verwendet dieselbe feste FinanzNeo-YouTube-Szenenstruktur mit Überschrift + Icon + eingebettetem Visualfenster; zusätzlich dürfen Elemente animiert und mit Remotion-Erklärvisuals kombiniert werden. Flow-Bilder bleiben auch hier niemals fullscreen.'}\n`);

if (mode === 'images-only') {
  const replaceImageOnlyPolicy = (text) => text
    .replaceAll('REMOTION_OVERLAY_TEXT: [IMPORTANT TEXT/NUMBERS ADDED LATER, NOT GENERATED IN THE IMAGE]', 'STATIC_LAYOUT_TEXT: A short scene heading and one matching icon are added later by the static layout assembler outside the Flow image. Do not generate the scene heading or icon into the Flow image itself.')
    .replaceAll('Important explanatory text and numbers will be added later in Remotion.', 'Do not bake explanatory overlay text into the Flow image. The final static scene adds only its short heading and matching icon outside the contained visual window.')
    .replaceAll('Remotion owns explanatory text and numbers.', 'The final static layout owns the scene heading and icon. The Flow image remains a contained story visual and never becomes the full-screen frame.')
    .replaceAll('clear negative space for typography that will be added later', 'balanced composition for use inside a contained visual window; the final scene heading and icon live outside the Flow image')
    .replaceAll('Do not generate the headline inside the image.', 'Do not generate the scene heading or icon inside the Flow image; the static layout adds them outside the visual window.');

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
    '# Static-Layout-Plan — Animation deaktiviert\n\nPRODUCTION_MODE: images-only\nLAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v1\n\nKeine Szene darf animiert werden. Die statische Endszene wird jedoch immer als vollständiger 1920 × 1080 YouTube-Frame zusammengesetzt: kurze Überschrift + passendes Icon + eingebettetes Flow-Visual auf sichtbarer deep-black FinanzNeo-Grundfläche. Das Flow-Bild darf niemals den kompletten Frame als Vollbild-Hintergrund ausfüllen. Statische Layout-Komposition ist erlaubt und erforderlich; Frame-Bewegung, Zahlenanimationen, Chartanimationen, Icon-Animationen und Kamerabewegung sind verboten.\n',
  );
}

console.log(scaffold.stdout.trim());
console.log(`\n✓ Production Mode gesetzt: ${mode}`);
console.log(`  Layout: ${sharedLayoutContract.id} · Überschrift + Icon · Flow-Bild niemals fullscreen`);
if (mode === 'images-only') console.log('  Statische Szenen · keine Animation · normales FinanzNeo-YouTube-Layout bleibt erhalten');
