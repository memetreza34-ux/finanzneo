#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  V5_CONTRACT_ID,
  V5_HARDENING_ID,
  LOCATION_CLASSES,
  MAIN_SUBJECT_CLASSES,
  LIGHTING_VARIATIONS,
  PATTERN_INTERRUPT_TYPES,
  V5_COMPILED_START,
  V5_COMPILED_END,
  buildCompiledDirection,
} from './lib/image-storytelling-v5-hardening.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v5-hardening.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.imageStorytellingContract;
if (contract?.id !== V5_CONTRACT_ID) {
  console.log('✓ Kein V5-Reel; V5-Hardening-Validator übersprungen.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const validText = (value, min = 3) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);

if (contract.hardeningId !== V5_HARDENING_ID) fail(`imageStorytellingContract.hardeningId muss ${V5_HARDENING_ID} sein.`);
for (const key of [
  'compiledDirectionInsideImagePromptRequired',
  'explicitCreativeChoiceRequired',
  'semanticFamilyClassesRequired',
  'lightingVariationRequired',
  'labelBudgetRequired',
  'patternInterruptMustChangeVisualDimension',
  'diversityWindowsRequired',
  'tableDocumentPromptPlausibilityRequired',
]) {
  if (contract[key] !== true) fail(`imageStorytellingContract.${key} muss true sein.`);
}
for (const [key, expected] of [
  ['minDistinctArchetypesPerSixImages', 3],
  ['minDistinctCompositionFamiliesPerSixImages', 3],
  ['minDistinctCameraAnglesPerSixImages', 3],
  ['minDistinctLocationClassesPerSixImages', 3],
  ['minDistinctMainSubjectClassesPerSixImages', 3],
  ['maxLabelsWithoutJustification', 2],
]) {
  if (Number(contract[key]) !== expected) fail(`imageStorytellingContract.${key} muss ${expected} sein.`);
}

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
const tableWords = /\b(table|desk|tisch|schreibtisch)\b/i;
const documentWords = /\b(invoice|bill|document|paper|receipt|rechnung|beleg|dokument|brief|unterlagen)\b/i;

for (let i = 0; i < imageScenes.length; i += 1) {
  const scene = imageScenes[i];
  const id = scene.id ?? `IMAGE-${i + 1}`;
  const meta = scene.imageStorytelling ?? {};

  if (!LOCATION_CLASSES.has(String(meta.locationClass))) fail(`${id}: locationClass ist ungültig/noch nicht geplant.`);
  if (!MAIN_SUBJECT_CLASSES.has(String(meta.mainSubjectClass))) fail(`${id}: mainSubjectClass ist ungültig/noch nicht geplant.`);
  if (!LIGHTING_VARIATIONS.has(String(meta.lightingVariation))) fail(`${id}: lightingVariation ist ungültig/noch nicht geplant.`);
  if (!PATTERN_INTERRUPT_TYPES.has(String(meta.patternInterruptType))) fail(`${id}: patternInterruptType ist ungültig/noch nicht geplant.`);

  const labelBudget = Number(meta.labelBudget);
  if (!Number.isInteger(labelBudget) || labelBudget < 0 || labelBudget > 3) fail(`${id}: labelBudget muss 0–3 sein.`);
  if (labelBudget <= 2) {
    if (String(meta.labelBudgetJustification).trim().toLowerCase() !== 'none') fail(`${id}: bei LABEL_BUDGET 0–2 muss labelBudgetJustification exakt none sein.`);
  } else if (!validText(meta.labelBudgetJustification, 20) || /^none$/i.test(meta.labelBudgetJustification)) {
    fail(`${id}: LABEL_BUDGET 3 braucht eine konkrete labelBudgetJustification.`);
  }

  if (typeof scene.planFile !== 'string') {
    fail(`${id}: planFile fehlt.`);
    continue;
  }
  const promptPath = resolve(root, '03-szenen', scene.planFile.replace(/^03-szenen\//, ''));
  if (!existsSync(promptPath)) {
    fail(`${id}: Bildprompt fehlt.`);
    continue;
  }
  const source = readFileSync(promptPath, 'utf8');
  const compiled = buildCompiledDirection(meta);
  if (!source.includes(V5_COMPILED_START) || !source.includes(V5_COMPILED_END)) fail(`${id}: V5_COMPILED_DIRECTION fehlt. Führe reel:image-prompts:compile aus.`);
  else if (!source.includes(compiled)) fail(`${id}: V5_COMPILED_DIRECTION ist veraltet oder widerspricht scene-index.json. Neu kompilieren.`);

  const imagePromptStart = source.indexOf('IMAGE PROMPT:');
  const styleStart = source.indexOf('\n\nSTYLE:', imagePromptStart);
  const body = imagePromptStart >= 0 ? source.slice(imagePromptStart, styleStart >= 0 ? styleStart : source.length) : '';
  if (meta.tableDocumentScene === false && tableWords.test(body) && documentWords.test(body)) {
    fail(`${id}: TABLE_DOCUMENT_SCENE=false kollidiert mit Tisch/Schreibtisch + Dokument/Rechnung im eigentlichen IMAGE PROMPT.`);
  }

  if (i > 0 && meta.patternInterruptType !== 'none') {
    const prev = imageScenes[i - 1].imageStorytelling ?? {};
    const changed = {
      'camera-change': meta.cameraAngle !== prev.cameraAngle,
      'scale-change': meta.shotScale !== prev.shotScale,
      'location-change': meta.locationClass !== prev.locationClass,
      'human-change': meta.humanPresence !== prev.humanPresence,
      'comparison': meta.visualArchetype === 'comparison' || meta.compositionFamily === 'comparison',
      'cause-effect': meta.visualArchetype === 'cause-effect' || meta.visualMode === 'cause-effect',
      'reveal': meta.sequenceRole === 'reveal',
    }[meta.patternInterruptType];
    if (!changed) fail(`${id}: PATTERN_INTERRUPT_TYPE=${meta.patternInterruptType} behauptet einen Wechsel, der in den Planwerten nicht stattfindet.`);
  }
}

const distinctCount = (window, key) => new Set(window.map((scene) => String(scene.imageStorytelling?.[key] ?? '')).filter(Boolean)).size;
const diversityRules = [
  ['visualArchetype', 3, 'Archetypen'],
  ['compositionFamily', 3, 'Composition Families'],
  ['cameraAngle', 3, 'Camera Angles'],
  ['locationClass', 3, 'Location Classes'],
  ['mainSubjectClass', 3, 'Main Subject Classes'],
];

const checkDiversityWindow = (window, label) => {
  for (const [key, min, name] of diversityRules) {
    const count = distinctCount(window, key);
    if (count < min) fail(`${label}: nur ${count} unterschiedliche ${name}; mindestens ${min} erforderlich.`);
  }
};

if (imageScenes.length >= 6) {
  for (let start = 0; start <= imageScenes.length - 6; start += 1) {
    checkDiversityWindow(imageScenes.slice(start, start + 6), `6-IMAGE-Fenster ab ${imageScenes[start]?.id ?? start}`);
  }
} else if (imageScenes.length >= 4) {
  checkDiversityWindow(imageScenes, `gesamte ${imageScenes.length}-IMAGE-Sequenz`);
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) fail('03-szenen/alle-bildprompts.txt fehlt.');
else {
  const master = readFileSync(masterPath, 'utf8');
  const compiledCount = (master.match(new RegExp(V5_COMPILED_START, 'g')) ?? []).length;
  if (compiledCount < imageScenes.length) fail(`alle-bildprompts.txt enthält nur ${compiledCount} kompilierte V5-Blöcke für ${imageScenes.length} IMAGE-Szenen.`);
}

if (errors.length) {
  console.error('\nV5-Hardening verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log(`\n✓ V5-Hardening erfüllt: ${V5_HARDENING_ID}`);
console.log('✓ V5-Regie steht direkt im IMAGE PROMPT und entspricht scene-index.json.');
console.log('✓ Sequenzfenster erzwingen echte Vielfalt bei Archetyp, Komposition, Kamera, Ort und Hauptmotiv.');
console.log('✓ Pattern Interrupts, Lighting Variation, Label Budget und Table/Document-Plausibilität geprüft.');
