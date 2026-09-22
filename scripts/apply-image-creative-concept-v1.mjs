#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {V5_CONTRACT_ID, V5_HARDENING_ID} from './lib/image-storytelling-v5-hardening.mjs';
import {IMAGE_CREATIVE_CONCEPT_ID} from './lib/image-creative-concept-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-image-creative-concept-v1.mjs <Reel-Pfad>');
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
  console.log('✓ Kein gehärtetes V5-Reel; Creative Concept V1 wird nicht angewendet.');
  process.exit(0);
}

for (const key of [
  'stagingId', 'dynamicStagingRequired', 'frameOccupancyRequired', 'explicitCauseEffectQuotaRequired',
  'humanReactionRequired', 'spatialPressureRequired', 'impactCompositionQuotaRequired',
  'catalogArrangementForbidden', 'minExplicitCauseEffectPerSixImages',
  'maxImagesWithoutImpactComposition', 'minDistinctStagingModesPerSixImages',
]) delete contract[key];

Object.assign(contract, {
  creativeConceptId: IMAGE_CREATIVE_CONCEPT_ID,
  creativeConceptRequired: true,
  entertainmentFirstButRelevant: true,
  singleIconicObjectAllowed: true,
  peopleOptional: true,
  visualMetaphorAllowed: true,
  controlledFantasyAllowed: true,
  thoughtVisualizationAllowed: true,
  conceptTypeQuotaForbidden: true,
  strongestConceptWins: true,
});

const sequenceRules = index.visualSequencePlan?.rules;
if (sequenceRules) {
  for (const key of [
    'dynamicStagingRequired', 'minExplicitCauseEffectPerSixImages', 'maxImagesWithoutImpactComposition',
    'minDistinctStagingModesPerSixImages', 'blackWorldMustNotBecomeDeadSpace',
    'activeCauseEffectPreferredOverObjectDisplay',
  ]) delete sequenceRules[key];
  Object.assign(sequenceRules, {
    strongestConceptWins: true,
    conceptTypeQuotaForbidden: true,
    singleIconicObjectAllowed: true,
    controlledFantasyAllowedWhenImmediatelyReadable: true,
    entertainmentMustServeVoiceBeat: true,
  });
}

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
for (const scene of imageScenes) {
  const meta = scene.imageStorytelling ?? {};
  for (const key of [
    'frameOccupancyClass', 'stagingMode', 'causeEffectStrength', 'humanReaction',
    'humanReactionJustification', 'spatialPressure', 'impactComposition',
  ]) delete meta[key];
  Object.assign(meta, {
    conceptMode: '[EINFÜGEN — single-iconic-object / object-interaction / character-moment / pov-moment / real-environment / comparison / visual-metaphor / controlled-fantasy / thought-visualization / cause-effect / reveal / payoff]',
    viewerThought: '[EINFÜGEN — exakter Gedanke oder Gefühl, das beim Zuschauer sofort entstehen soll]',
    entertainmentHook: '[EINFÜGEN — was dieses Bild interessant genug macht, um den Scroll zu stoppen]',
    memorabilityHook: '[EINFÜGEN — welches konkrete visuelle Detail nach dem Reel im Kopf bleiben soll]',
    realityAnchor: '[EINFÜGEN — reales Finanz-/Alltagsdetail, das die Bedeutung sofort erdet]',
    fantasyLevel: -1,
    fantasyJustification: '[EINFÜGEN — none bei 0; bei 1–3 warum die Fantasie die Aussage klarer/stärker macht]',
    whyThisConcept: '[EINFÜGEN — warum genau diese Bildidee stärker ist als eine generische Erklärszene]',
  });
  scene.imageStorytelling = meta;
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planning = `CONCEPT_MODE: [EINFÜGEN — single-iconic-object / object-interaction / character-moment / pov-moment / real-environment / comparison / visual-metaphor / controlled-fantasy / thought-visualization / cause-effect / reveal / payoff]\nVIEWER_THOUGHT: [EINFÜGEN — exakter Gedanke oder Gefühl]\nENTERTAINMENT_HOOK: [EINFÜGEN — konkreter Scroll-Stop]\nMEMORABILITY_HOOK: [EINFÜGEN — konkretes Detail, das im Kopf bleibt]\nREALITY_ANCHOR: [EINFÜGEN — reales Finanz-/Alltagsdetail]\nFANTASY_LEVEL: [EINFÜGEN — 0 / 1 / 2 / 3]\nFANTASY_JUSTIFICATION: [EINFÜGEN — none bei 0; sonst konkrete Begründung]\nWHY_THIS_CONCEPT: [EINFÜGEN — warum dies die stärkste Bildidee für den Beat ist]`;

const policy = `IMAGE_CREATIVE_CONCEPT: ${IMAGE_CREATIVE_CONCEPT_ID}\n\nCREATIVE CONCEPT V1 — VERBINDLICH:\n- ENTERTAINMENT-FIRST, ABER PASSEND: Das Bild muss zuerst zum exakten Sprechbeat passen und danach so interessant, clever oder emotional wie möglich inszeniert werden.\n- Es gibt KEINE Pflichtquote für Cause/Effect, Personen, mehrere Objekte, Impact-Shots oder Fantasie. Die stärkste Bildidee gewinnt.\n- Ein einziges stark inszeniertes Objekt ist vollständig erlaubt. Mehrere Objekte sind erlaubt. Menschen sind optional. Eine reale Umgebung ist erlaubt.\n- VISUAL_METAPHOR, CONTROLLED_FANTASY und THOUGHT_VISUALIZATION sind ausdrücklich erlaubt, wenn der Zuschauer die Finanzbedeutung in ca. 1–2 Sekunden versteht.\n- Fantasie darf reale Größenverhältnisse, räumliche Logik oder Symbolik kreativ überhöhen, aber niemals zu einem abstrakten Rätsel werden. FANTASY_LEVEL 1–3 braucht eine konkrete Begründung und einen REALITY_ANCHOR.\n- Frage vor jedem Bild: Was soll der Zuschauer spontan denken oder fühlen? Welche eine visuelle Idee macht diesen Beat merkbar?\n- ENTERTAINMENT_HOOK kann aus Neugier, Konflikt, visueller Pointe, ungewöhnlicher Perspektive, Größenkontrast, Emotion, Humor-light, Überraschung oder einem starken Einzelobjekt entstehen.\n- MEMORABILITY_HOOK muss ein konkretes sichtbares Element sein, kein allgemeines Adjektiv wie "cinematic" oder "premium".\n- Nicht automatisch Menschen, Tische, Dokumente, Ordner oder Zusatzobjekte hinzufügen. Keine Props nur zur Dekoration oder um ein Schema zu erfüllen.\n- Minimalismus ist erlaubt, wenn das Motiv stark ist. Komplexität ist erlaubt, wenn sie die Aussage verbessert.\n- V9 bleibt vollständig gesperrt: stylized 3D, Deep Black, Farbrollen, Materialien, 1:1 und Single-Job bleiben unverändert.\n- Der finale Google-Flow-Prompt muss die Creative-Concept-Regie über den bestehenden Compiler direkt enthalten.\n- Nach Flow bewertet die Vision-QA zusätzlich Concept Clarity, Entertainment Value, Memorability und Viewer-Thought-Match.`;

const updatePrompt = (source) => {
  let next = source
    .replace(/^(FRAME_OCCUPANCY_CLASS|STAGING_MODE|CAUSE_EFFECT_STRENGTH|HUMAN_REACTION|HUMAN_REACTION_JUSTIFICATION|SPATIAL_PRESSURE|IMPACT_COMPOSITION):.*\r?\n?/gm, '')
    .replace(/^(CONCEPT_MODE|VIEWER_THOUGHT|ENTERTAINMENT_HOOK|MEMORABILITY_HOOK|REALITY_ANCHOR|FANTASY_LEVEL|FANTASY_JUSTIFICATION|WHY_THIS_CONCEPT):.*\r?\n?/gm, '');
  next = next.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planning}\n\nIMAGE PROMPT:`);
  if (!next.includes(`IMAGE_CREATIVE_CONCEPT: ${IMAGE_CREATIVE_CONCEPT_ID}`)) next += `\n\n${policy}\n`;
  return next;
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  writeFileSync(path, updatePrompt(readFileSync(path, 'utf8')), 'utf8');
};

for (const scene of imageScenes) if (typeof scene.planFile === 'string') updatePromptFile(scene.planFile);
updatePromptFile('03-szenen/00-cover/cover.txt');
updatePromptFile('03-szenen/alle-bildprompts.txt');

for (const relativePath of ['03-szenen/bildwelt.txt', '05-projektdateien/szenenplan.md', '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/VISUAL-SEQUENCE-PLAN.md']) {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) continue;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_CREATIVE_CONCEPT: ${IMAGE_CREATIVE_CONCEPT_ID}`)) source += `\n\n${policy}\n`;
  writeFileSync(path, source, 'utf8');
}

console.log(`✓ Creative Concept gesetzt: ${IMAGE_CREATIVE_CONCEPT_ID}`);
console.log('✓ Ein Objekt, mehrere Objekte, Mensch, reale Szene, Metapher, kontrollierte Fantasie und Thought Visualization sind frei wählbar.');
console.log('✓ Keine Concept-Quoten: Die stärkste passende und unterhaltsame Bildidee gewinnt.');
console.log('✓ V9 bleibt unverändert. Nach finaler Planung reel:image-prompts:compile ausführen.');
