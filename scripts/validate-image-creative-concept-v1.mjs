#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {V5_CONTRACT_ID, V5_HARDENING_ID, buildCompiledDirection} from './lib/image-storytelling-v5-hardening.mjs';
import {IMAGE_CREATIVE_CONCEPT_ID, CONCEPT_MODES, CREATIVE_CONCEPT_START, CREATIVE_CONCEPT_END} from './lib/image-creative-concept-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-image-creative-concept-v1.mjs <Reel-Pfad>');
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
if (contract?.id !== V5_CONTRACT_ID || contract?.hardeningId !== V5_HARDENING_ID) {
  console.log('✓ Kein gehärtetes V5-Reel; Creative Concept V1 übersprungen.');
  process.exit(0);
}
if (contract?.creativeConceptId !== IMAGE_CREATIVE_CONCEPT_ID) {
  console.log('✓ Legacy-V5-Reel ohne Creative Concept V1; Validator übersprungen.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const textOk = (value, min = 12) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);

for (const key of [
  'creativeConceptRequired', 'entertainmentFirstButRelevant', 'singleIconicObjectAllowed', 'peopleOptional',
  'visualMetaphorAllowed', 'controlledFantasyAllowed', 'thoughtVisualizationAllowed',
  'conceptTypeQuotaForbidden', 'strongestConceptWins',
]) {
  if (contract[key] !== true) fail(`imageStorytellingContract.${key} muss true sein.`);
}

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
let sameConceptRun = 0;
let previousConcept = null;

for (const scene of imageScenes) {
  const meta = scene.imageStorytelling ?? {};
  const id = scene.id ?? 'IMAGE';
  if (!CONCEPT_MODES.has(String(meta.conceptMode))) fail(`${id}: conceptMode ist ungültig/noch nicht geplant.`);
  for (const [key, min] of [
    ['viewerThought', 12], ['entertainmentHook', 14], ['memorabilityHook', 14],
    ['realityAnchor', 12], ['whyThisConcept', 18],
  ]) {
    if (!textOk(meta[key], min)) fail(`${id}: ${key} fehlt, ist zu allgemein oder enthält noch einen Platzhalter.`);
  }

  const fantasyLevel = Number(meta.fantasyLevel);
  if (!Number.isInteger(fantasyLevel) || fantasyLevel < 0 || fantasyLevel > 3) {
    fail(`${id}: fantasyLevel muss 0–3 sein.`);
  } else if (fantasyLevel === 0) {
    if (String(meta.fantasyJustification).trim().toLowerCase() !== 'none') fail(`${id}: bei FANTASY_LEVEL=0 muss fantasyJustification exakt none sein.`);
  } else if (!textOk(meta.fantasyJustification, 20) || /^none$/i.test(String(meta.fantasyJustification))) {
    fail(`${id}: FANTASY_LEVEL ${fantasyLevel} braucht eine konkrete fantasyJustification.`);
  }

  if (meta.conceptMode === 'controlled-fantasy' && fantasyLevel < 1) fail(`${id}: controlled-fantasy braucht FANTASY_LEVEL >= 1.`);
  if (meta.conceptMode === 'thought-visualization' && fantasyLevel < 1) fail(`${id}: thought-visualization braucht FANTASY_LEVEL >= 1.`);

  if (meta.conceptMode === previousConcept) sameConceptRun += 1;
  else sameConceptRun = 1;
  previousConcept = meta.conceptMode;
  if (sameConceptRun > 2) fail(`${id}: derselbe CONCEPT_MODE darf höchstens zweimal direkt hintereinander vorkommen.`);

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
  if (!source.includes(CREATIVE_CONCEPT_START) || !source.includes(CREATIVE_CONCEPT_END)) {
    fail(`${id}: Creative-Concept-Regie fehlt im finalen IMAGE PROMPT. reel:image-prompts:compile ausführen.`);
  } else if (!source.includes(buildCompiledDirection(meta))) {
    fail(`${id}: kompilierte Creative-Concept-Regie ist veraltet oder widerspricht scene-index.json.`);
  }
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) fail('03-szenen/alle-bildprompts.txt fehlt.');
else {
  const master = readFileSync(masterPath, 'utf8');
  const count = (master.match(new RegExp(CREATIVE_CONCEPT_START, 'g')) ?? []).length;
  if (count < imageScenes.length) fail(`alle-bildprompts.txt enthält nur ${count} Creative-Concept-Blöcke für ${imageScenes.length} IMAGE-Szenen.`);
}

if (errors.length) {
  console.error('\nCREATIVE CONCEPT V1 verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log(`\n✓ Creative Concept erfüllt: ${IMAGE_CREATIVE_CONCEPT_ID}`);
console.log('✓ Keine starre Bildtyp-Quote: Ein starkes Einzelobjekt, reale Szene, Metapher oder kontrollierte Fantasie kann jeweils die beste Lösung sein.');
console.log('✓ Viewer Thought, Entertainment Hook, Memorability, Reality Anchor und Fantasy-Plausibilität sind geprüft.');
console.log('✓ Creative-Concept-Regie steht direkt im finalen IMAGE PROMPT.');
