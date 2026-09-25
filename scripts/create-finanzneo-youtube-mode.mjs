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
const phaseAAllowedTypes = new Set(['image', 'hybrid', 'data', 'real-asset']);
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
  if (typesArg && visualCountArg) {
    console.error('Phase A: entweder --visual-count für reine 3D-Storybilder ODER --types für eine gemischte statische Planung verwenden, nicht beides.');
    process.exit(1);
  }

  if (typesArg) {
    const requested = typesArg.split(',').map((value) => value.trim()).filter(Boolean);
    if (requested.length === 0) {
      console.error('Phase A: --types darf nicht leer sein.');
      process.exit(1);
    }
    const forbidden = requested.filter((type) => !phaseAAllowedTypes.has(type));
    if (forbidden.length > 0) {
      console.error(`Phase A erlaubt nur statische Typen: ${[...phaseAAllowedTypes].join(', ')}. Verboten/ungültig: ${forbidden.join(', ')}`);
      process.exit(1);
    }
    types = requested.join(',');
  } else {
    const visualCount = Number(visualCountArg);
    if (!Number.isInteger(visualCount) || visualCount < 1) {
      console.error('Phase A benötigt entweder --visual-count mit einer ganzen Zahl >= 1 oder --types mit einer statischen Mischung.');
      process.exit(1);
    }
    types = Array.from({length: visualCount}, () => 'image').join(',');
  }
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

const phaseAContract = {
  id: 'images-only',
  semanticName: 'phase-a-static',
  animationDisabledOnly: true,
  staticImageVisualsOnly: false,
  staticSceneLayoutRequired: true,
  staticLayoutAssemblyAllowed: true,
  remotionExplainerVisualsAllowed: true,
  staticRemotionExplainerVisualsAllowed: true,
  staticDataVisualsAllowed: true,
  staticHybridOverlaysAllowed: true,
  remotionAnimationAllowed: false,
  allowedVisualTypes: ['image', 'hybrid', 'data', 'real-asset'],
  forbiddenVisualTypes: ['animation'],
  allowedStaticVisualKinds: ['3d-story', '3d-explainer', 'static-data', 'real-asset'],
  assemblyIntent: 'static-framed-layout-sequence-with-voiceover',
  oneMainIdeaPerVisual: true,
  recommendedVoiceoverSentencesPerImage: [1, 2],
  exactTextAndNumbersInStaticLayoutAllowed: true,
  flowImageRequiredForEveryScene: false,
  recommendedMixExampleFor20: {'3d-story': 13, '3d-explainer': 4, 'static-data': 3},
  mixIsHardQuota: false,
  layoutContractId: sharedLayoutContract.id,
};

const modeContract = mode === 'images-only'
  ? phaseAContract
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

const staticKindForType = (type) => {
  if (type === 'hybrid') return '3d-explainer';
  if (type === 'data') return 'static-data';
  if (type === 'real-asset') return 'real-asset';
  return '3d-story';
};

const staticExplainerSource = (visual) => `import React from 'react';\nimport {AbsoluteFill} from 'remotion';\n\n/**\n * PHASE A STATIC\n * Keine Frame-Bewegung. Ersetze den Platzhalter durch die geplante statische\n * Erklärgrafik. Bevorzugte Bausteine: StaticNumber, StaticArrow, StaticLabels,\n * StaticCompare und StaticMiniChart aus src/design-system.\n */\nexport const ${visual.animationExport}: React.FC = () => (\n  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>\n    <div>[EINFÜGEN: STATISCHE PHASE-A-ERKLÄRUNG]</div>\n  </AbsoluteFill>\n);\n`;

const staticExplainerPlan = (visual) => `# Static-Remotion-Spezifikation ${visual.id}\n\nPRODUCTION_MODE: images-only\nMOTION_PRESET: STATIC\nANIMATION_DISABLED: true\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Message: [WHAT MUST THE VIEWER UNDERSTAND?]\n- Static Visual Kind: ${staticKindForType(visual.type)}\n- Exact Text / Numbers: [ONLY THE EXACT SHORT CONTENT THAT IMPROVES COMPREHENSION]\n- Layout: [WHERE THE STATIC EXPLAINER SITS INSIDE THE CONTAINED VISUAL WINDOW]\n- Reason: [WHY THIS STATIC EXPLAINER IS CLEARER THAN A PURE 3D STORY]\n\nErlaubt: statische Zahl, Pfeil, Labels, Vergleich, Mini-Chart, Formel, Markierung oder echtes Asset.\nVerboten: useCurrentFrame(), interpolate(), spring(), CSS animation/transition, Fade, Zoom, Count-up, Chart-Grow oder jede andere Frame-zu-Frame-Bewegung.\nDie Szenenüberschrift + das Icon bleiben außerhalb des Visualfensters.\n`;

const indexPath = resolve(root, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.productionMode = modeContract;
index.layoutContract = sharedLayoutContract;

if (mode === 'images-only') {
  index.phaseA = {
    id: 'finanzneo-youtube-phase-a-static-v1',
    animationAllowed: false,
    imageWorldUnchanged: true,
    imageWorldId: 'finanzneo-youtube-grounded-3d-black-v1',
    allowedStaticVisualKinds: phaseAContract.allowedStaticVisualKinds,
    exactTextAndNumbersUseStaticRemotion: true,
    recommendedMixExampleFor20: phaseAContract.recommendedMixExampleFor20,
    mixIsHardQuota: false,
  };

  for (const visual of index.visuals ?? []) {
    visual.phaseAVisualKind = staticKindForType(visual.type);
    if (visual.type === 'hybrid' || visual.type === 'data') {
      visual.animationDisabled = true;
      visual.motionPreset = 'STATIC';
      visual.viewerChange = 'No frame-to-frame movement; meaning is conveyed by the static composition.';
      visual.advancedReason = '';
      visual.toolStack = ['Remotion', 'static'];
      if (visual.animationSourceFile) {
        writeFileSync(resolve(root, visual.animationSourceFile), staticExplainerSource(visual));
      }
      if (visual.planFile) {
        writeFileSync(resolve(root, visual.planFile), staticExplainerPlan(visual));
      }
    }
  }
}

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(root, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(readmePath, `${readme.trimEnd()}\n\n## Production Mode\n\nPRODUCTION_MODE: ${mode}\nLAYOUT_CONTRACT: ${sharedLayoutContract.id}\n\n${mode === 'images-only'
  ? 'Phase A ist vollständig statisch: keine Animation. Die normale FinanzNeo-YouTube-Struktur und die bestehende 3D-Bildwelt bleiben unverändert. Erlaubt sind 3D-Storybilder, Flow-Bilder mit statischen Remotion-Labels/Pfeilen/Zahlen, statische Daten-/Vergleichsgrafiken und echte Assets. Jede Szene behält Überschrift + Icon + eingebettetes Visualfenster; Flow-Bilder sind niemals fullscreen.'
  : 'Dieses Projekt verwendet dieselbe feste FinanzNeo-YouTube-Szenenstruktur mit Überschrift + Icon + eingebettetem Visualfenster; zusätzlich dürfen Elemente animiert und mit Remotion-Erklärvisuals kombiniert werden. Flow-Bilder bleiben auch hier niemals fullscreen.'}\n`);

if (mode === 'images-only') {
  const replaceImageOnlyPolicy = (text) => text
    .replaceAll('REMOTION_OVERLAY_TEXT: [IMPORTANT TEXT/NUMBERS ADDED LATER, NOT GENERATED IN THE IMAGE]', 'STATIC_REMOTION_OVERLAY: [OPTIONAL EXACT SHORT LABELS / NUMBERS / ARROWS ADDED LATER WITHOUT ANIMATION. IF USED, RESERVE CLEAN NEGATIVE SPACE IN THE COMPOSITION.]')
    .replaceAll('Important explanatory text and numbers will be added later in Remotion.', 'Important exact explanatory text, numbers or arrows may be added later as static Remotion overlays without animation. If such an overlay is planned, reserve the exact clean negative-space area requested by the storyboard.')
    .replaceAll('Remotion owns explanatory text and numbers.', 'The final static video layout owns exact explanatory text and numbers. Flow remains the 3D story visual and may reserve clean negative space for a planned static overlay.')
    .replaceAll('clear negative space for typography that will be added later', 'scene-specific clean negative space for exact static typography that will be added later by the video layout')
    .replaceAll('Do not generate the headline inside the image.', 'Do not generate the scene heading or icon inside the Flow image. Exact explanatory text or numbers are added later by the static video layout when planned.');

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
    '# Static-Layout-Plan — Animation deaktiviert\n\nPRODUCTION_MODE: images-only\nLAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v1\nIMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1 (unverändert)\n\nPhase A unterscheidet sich nur durch fehlende Bewegung. Jede Endszene bleibt ein vollständiger 1920 × 1080 YouTube-Frame mit kurzer Überschrift + passendem Icon + eingebettetem Visualfenster auf sichtbarer deep-black FinanzNeo-Grundfläche. Flow-Bilder dürfen niemals fullscreen sein.\n\nErlaubte statische Erklärmittel: exakte kurze Labels, Zahlen, Pfeile, Markierungen, Vergleiche, Formeln, Mini-Charts und echte Assets. Dafür die statischen Design-System-Bausteine StaticNumber, StaticArrow, StaticLabels, StaticCompare und StaticMiniChart bevorzugen.\n\nVerboten: jede Frame-zu-Frame-Bewegung, useCurrentFrame() für sichtbare Motion, interpolate(), spring(), Count-up, Fade, Slide, Zoom, Chart-Grow, Icon-Animation und Kamerabewegung. Normale harte Cuts zwischen statischen Szenen sind erlaubt.\n',
  );
}

console.log(scaffold.stdout.trim());
console.log(`\n✓ Production Mode gesetzt: ${mode}`);
console.log(`  Layout: ${sharedLayoutContract.id} · Überschrift + Icon · Flow-Bild niemals fullscreen`);
if (mode === 'images-only') console.log('  Phase A Static · gleiche Bildwelt · statische 3D-/Explainer-/Data-Visuals erlaubt · keine Animation');
