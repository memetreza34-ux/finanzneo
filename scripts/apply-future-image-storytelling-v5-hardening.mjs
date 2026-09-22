#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {V5_CONTRACT_ID, V5_HARDENING_ID} from './lib/image-storytelling-v5-hardening.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v5-hardening.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageStorytellingContract?.id !== V5_CONTRACT_ID) {
  console.log('✓ Kein V5-Reel; V5-Hardening wird nicht angewendet.');
  process.exit(0);
}

Object.assign(index.imageStorytellingContract, {
  hardeningId: V5_HARDENING_ID,
  compiledDirectionInsideImagePromptRequired: true,
  explicitCreativeChoiceRequired: true,
  semanticFamilyClassesRequired: true,
  lightingVariationRequired: true,
  labelBudgetRequired: true,
  patternInterruptMustChangeVisualDimension: true,
  diversityWindowsRequired: true,
  tableDocumentPromptPlausibilityRequired: true,
  minDistinctArchetypesPerSixImages: 3,
  minDistinctCompositionFamiliesPerSixImages: 3,
  minDistinctCameraAnglesPerSixImages: 3,
  minDistinctLocationClassesPerSixImages: 3,
  minDistinctMainSubjectClassesPerSixImages: 3,
  maxLabelsWithoutJustification: 2,
});

Object.assign(index.visualSequencePlan.rules, {
  compiledDirectionInsideImagePromptRequired: true,
  minDistinctArchetypesPerSixImages: 3,
  minDistinctCompositionFamiliesPerSixImages: 3,
  minDistinctCameraAnglesPerSixImages: 3,
  minDistinctLocationClassesPerSixImages: 3,
  minDistinctMainSubjectClassesPerSixImages: 3,
  maxLabelsWithoutJustification: 2,
});

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
for (const scene of imageScenes) {
  const meta = scene.imageStorytelling ?? {};
  Object.assign(meta, {
    strategy: '[EINFÜGEN — literal / metaphor]',
    visualMode: '[EINFÜGEN — cinematic-literal / cause-effect / comparison / scale / object-story / pov / grounded-metaphor]',
    energyLevel: 0,
    locationClass: '[EINFÜGEN — home / retail / work / transport / banking / street / food / services / leisure / other]',
    mainSubjectClass: '[EINFÜGEN — money / bill / purchase / account / vehicle / housing / subscription / savings / person / device / document / other]',
    tableDocumentScene: null,
    shotScale: '[EINFÜGEN — extreme-wide / wide / medium / close-up / extreme-close-up / macro]',
    cameraAngle: '[EINFÜGEN — eye-level / low-angle / high-angle / top-down / over-shoulder / pov / dutch-subtle]',
    patternInterruptType: '[EINFÜGEN — none / camera-change / scale-change / location-change / human-change / comparison / cause-effect / reveal]',
    lightingVariation: '[EINFÜGEN — soft-key / side-key / top-light / rim-heavy / warm-practical / dramatic-low-key]',
    labelBudget: null,
    labelBudgetJustification: '[EINFÜGEN — none bei 0–2 Labels; ab 3 konkrete Begründung]',
    metaphorJustification: '[EINFÜGEN — none oder bei grounded-metaphor konkrete Begründung]',
  });
  scene.imageStorytelling = meta;
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const extraPlanning = `LOCATION_CLASS: [EINFÜGEN — home / retail / work / transport / banking / street / food / services / leisure / other]\nMAIN_SUBJECT_CLASS: [EINFÜGEN — money / bill / purchase / account / vehicle / housing / subscription / savings / person / device / document / other]\nPATTERN_INTERRUPT_TYPE: [EINFÜGEN — none / camera-change / scale-change / location-change / human-change / comparison / cause-effect / reveal]\nLIGHTING_VARIATION: [EINFÜGEN — soft-key / side-key / top-light / rim-heavy / warm-practical / dramatic-low-key]\nLABEL_BUDGET: [EINFÜGEN — 0 / 1 / 2 / 3]\nLABEL_BUDGET_JUSTIFICATION: [EINFÜGEN — none bei 0–2; ab 3 konkrete Begründung]`;

const hardeningPolicy = `IMAGE_STORYTELLING_HARDENING: ${V5_HARDENING_ID}\n\nV5 HARDENING V1 — VERBINDLICH:\n- Nach der Sequenzplanung muss der finale IMAGE PROMPT mit dem kanonischen Compiler erzeugt werden: npm run reel:image-prompts:compile -- <Reel-Pfad>.\n- Google Flow darf nicht nur Metadaten sehen: Kamera, Archetyp, Handlung, Ort, Hauptmotiv, Spannung, Cause/Effect, Licht und Label-Budget müssen als V5_COMPILED_DIRECTION direkt im IMAGE PROMPT stehen.\n- Keine kreativen Defaultwerte akzeptieren. VISUAL_MODE, ENERGY_LEVEL, SHOT_SCALE, CAMERA_ANGLE, TABLE_DOCUMENT_SCENE, LOCATION_CLASS, MAIN_SUBJECT_CLASS, LIGHTING_VARIATION und PATTERN_INTERRUPT_TYPE müssen bewusst gewählt werden.\n- LOCATION_CLASS und MAIN_SUBJECT_CLASS sind kanonische Kategorien; freie *_FAMILY-Texte bleiben nur die konkrete Unterform.\n- In jedem vollständigen 6-IMAGE-Fenster mindestens 3 unterschiedliche Archetypen, 3 Composition Families, 3 Camera Angles, 3 Location Classes und 3 Main Subject Classes. Bei 4–5 IMAGE-Szenen gilt dieselbe Mindestvielfalt 3 über die gesamte Sequenz.\n- PATTERN_INTERRUPT_TYPE muss real sichtbar sein: camera-change ändert CAMERA_ANGLE, scale-change ändert SHOT_SCALE, location-change ändert LOCATION_CLASS, human-change ändert HUMAN_PRESENCE.\n- LIGHTING_VARIATION verändert nur die Lichtregie innerhalb V9; Deep Black, Farbrollen und stylized 3D bleiben gesperrt.\n- LABEL_BUDGET ist 0–3. 0–2 brauchen keine Begründung; 3 braucht eine konkrete LABEL_BUDGET_JUSTIFICATION.\n- TABLE_DOCUMENT_SCENE=false darf nicht mit einem Prompt kollidieren, dessen Hauptsprache klar Person/Tisch/Dokumente ist.\n- Der freie Prompt darf die geplante Regie nicht wieder in eine generische Person-am-Tisch-, Katalog- oder Finance-Icon-Komposition zurückdrehen.`;

const hardenPrompt = (source) => {
  let next = source
    .replace(/^VISUAL_STRATEGY:.*$/gm, 'VISUAL_STRATEGY: [EINFÜGEN — literal / metaphor]')
    .replace(/^VISUAL_MODE:.*$/gm, 'VISUAL_MODE: [EINFÜGEN — cinematic-literal / cause-effect / comparison / scale / object-story / pov / grounded-metaphor]')
    .replace(/^ENERGY_LEVEL:.*$/gm, 'ENERGY_LEVEL: 0')
    .replace(/^TABLE_DOCUMENT_SCENE:.*$/gm, 'TABLE_DOCUMENT_SCENE: [EINFÜGEN — true / false]')
    .replace(/^SHOT_SCALE:.*$/gm, 'SHOT_SCALE: [EINFÜGEN — extreme-wide / wide / medium / close-up / extreme-close-up / macro]')
    .replace(/^CAMERA_ANGLE:.*$/gm, 'CAMERA_ANGLE: [EINFÜGEN — eye-level / low-angle / high-angle / top-down / over-shoulder / pov / dutch-subtle]')
    .replace(/^METAPHOR_JUSTIFICATION:.*$/gm, 'METAPHOR_JUSTIFICATION: [EINFÜGEN — none oder konkrete Begründung]')
    .replace(/^(LOCATION_CLASS|MAIN_SUBJECT_CLASS|PATTERN_INTERRUPT_TYPE|LIGHTING_VARIATION|LABEL_BUDGET|LABEL_BUDGET_JUSTIFICATION):.*\r?\n?/gm, '');

  // Masterdateien enthalten mehrere IMAGE-PROMPT-Blöcke. Deshalb werden die
  // Hardening-Marker bewusst vor JEDEM Prompt neu eingesetzt, nicht nur einmal global.
  next = next.replace(/(^|\n)IMAGE PROMPT:/g, `$1${extraPlanning}\n\nIMAGE PROMPT:`);

  if (!next.includes(`IMAGE_STORYTELLING_HARDENING: ${V5_HARDENING_ID}`)) next += `\n\n${hardeningPolicy}\n`;
  return next;
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  writeFileSync(path, hardenPrompt(readFileSync(path, 'utf8')), 'utf8');
};

for (const scene of imageScenes) if (typeof scene.planFile === 'string') updatePromptFile(scene.planFile);
updatePromptFile('03-szenen/00-cover/cover.txt');
updatePromptFile('03-szenen/alle-bildprompts.txt');

for (const relativePath of ['03-szenen/bildwelt.txt', '05-projektdateien/szenenplan.md', '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/VISUAL-SEQUENCE-PLAN.md']) {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) continue;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_HARDENING: ${V5_HARDENING_ID}`)) source += `\n\n${hardeningPolicy}\n`;
  writeFileSync(path, source, 'utf8');
}

console.log(`✓ V5-Hardening gesetzt: ${V5_HARDENING_ID}`);
console.log('✓ Keine kreativen Defaults: Kamera, Energie, Licht, Klassen, Label-Budget und Interrupt müssen bewusst geplant werden.');
console.log('✓ Jeder IMAGE-PROMPT-Block in Einzeldateien und Masterdatei enthält die Hardening-Marker.');
console.log('✓ Nächster Pflichtschritt nach fertiger Planung: reel:image-prompts:compile.');
