#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {ALL_PROMPTS, VISUAL_INDEX, WORLD_ID} from './lib/youtube-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-youtube-visual-direction-v1.mjs <YouTube-Projekt>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-youtube-visual-direction-v1';
const root = resolve(target);
const indexPath = resolve(root, VISUAL_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${VISUAL_INDEX} fehlt.`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.visualDirection = {
  id: CONTRACT_ID,
  appliesToNewProjectsOnly: true,
  imageWorldPreserved: WORLD_ID,
  existingLiteralFirstMarkersPreserved: true,
  groundedAnchorRequired: true,
  cinematicStagingEncouraged: true,
  storyActionRequired: true,
  tensionOrConsequenceRequired: true,
  visualHookRequired: true,
  shotScaleRequired: true,
  cameraAngleRequired: true,
  depthPlanRequired: true,
  emotionalBeatRequired: true,
  causeEffectRequired: true,
  patternInterruptDecisionRequired: true,
  motionHintRequired: true,
  noveltyCheckRequired: true,
  abstractRiddleForbidden: true,
  styleOverrideForbidden: true,
  maxSameVisualModeInRow: 2,
  maxSameShotScaleInRow: 2,
};
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_PURPOSE: [EINFÜGEN — verstehen / fühlen / vergleichen / Gefahr erkennen / Ergebnis sehen]
VISUAL_MODE: [cinematic-literal / cause-effect / comparison / scale / object-story / pov / grounded-metaphor]
STORY_ACTION: [EINFÜGEN — sichtbare Handlung oder Veränderung]
TENSION_OR_CONSEQUENCE: [EINFÜGEN — sichtbarer Konflikt, Preis, Risiko, Gegensatz oder Konsequenz]
VISUAL_HOOK: [EINFÜGEN — das stärkste sofort sichtbare Element]
SHOT_SCALE: [extreme-wide / wide / medium / close-up / extreme-close-up / macro]
CAMERA_ANGLE: [eye-level / low-angle / high-angle / top-down / over-shoulder / pov / dutch-subtle]
DEPTH_PLAN: [EINFÜGEN — Vordergrund / Hauptmotiv / Hintergrund]
EMOTIONAL_BEAT: [EINFÜGEN — gewünschte Zuschauerreaktion]
CAUSE_EFFECT: [EINFÜGEN — Ursache und sichtbare Wirkung]
PATTERN_INTERRUPT: [EINFÜGEN — none oder konkreter Rhythmuswechsel]
MOTION_HINT: [EINFÜGEN — slow push-in / pan / parallax / rack-focus / hold]
NOVELTY_CHECK: [EINFÜGEN — PASS: konkrete Abwechslung gegenüber den letzten Visuals]`;

const policyBlock = `YOUTUBE_VISUAL_DIRECTION: ${CONTRACT_ID}
IMAGE_WORLD_PRESERVED: ${WORLD_ID}

FINANZNEO YOUTUBE VISUAL DIRECTION V1 — VERBINDLICH:
- Die bestehende FinanzNeo-YouTube-Bildwelt, 16:9, Same-World-Lock, Deep Black, Farbrollen, Licht und Flow-Single-Job bleiben vollständig erhalten.
- Die vorhandenen Literal-first-Marker bleiben aus Kompatibilitätsgründen bestehen. Sie bedeuten: reale Situation zuerst verstehen — NICHT: langweilige wörtliche Komposition erzwingen.
- Nach dem realen Anker wird die stärkste lesbare Inszenierung gewählt: cinematic-literal, cause-effect, comparison, scale, object-story, pov oder grounded-metaphor.
- Jede Bildidee braucht STORY_ACTION sowie TENSION_OR_CONSEQUENCE. Keine statische Sammlung aus Finanzobjekten als Hauptidee.
- VISUAL_HOOK muss innerhalb ungefähr einer Sekunde lesbar sein. Nutze Größe, Nähe, Perspektive, Kontrast, Vordergrund und klare Konsequenzen statt Stilbruch.
- Reale Finanz-/Alltagskontexte bleiben sofort erkennbar. Grounded-metaphor darf den realen Anker verstärken, aber nie in ein abstraktes Rätsel verwandeln.
- VARIETY: derselbe VISUAL_MODE und dieselbe SHOT_SCALE höchstens zweimal direkt hintereinander. Danach Perspektive oder visuelle Grammatik wechseln.
- Pattern Interrupts gezielt bei Hook, Wendepunkt, überraschender Zahl, Kapitelwechsel und Payoff prüfen. Nicht jede Szene braucht einen Effekt.
- MOTION_HINT beschreibt nur spätere Bewegung/Schnitt und ändert weder Bildwelt noch Quellbildformat.
- NOVELTY_CHECK muss konkret erklären, wodurch Komposition, Perspektive oder Handlung gegenüber den letzten Visuals neu wirkt.
- Daten, Beträge und Finanzmechanismen müssen fachlich korrekt bleiben; Unterhaltung darf niemals die Aussage verfälschen.
- Keine Fotorealistik, kein UI-/Dashboard-Look, kein Flowchart-Look, keine generischen Finance-Icons, keine abstrakten Symbolrätsel.`;

const addPlanning = (source) => {
  if (source.includes('VISUAL_PURPOSE:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const update = (relativePath, {planning = false, thumbnail = false} = {}) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (planning) source = addPlanning(source);
  if (thumbnail && !source.includes('THUMBNAIL_VISUAL_HOOK:')) {
    source = source.replace(/(^|\n)THUMBNAIL PROMPT:/, `$1THUMBNAIL_VISUAL_HOOK: [EINFÜGEN — ein sofort lesbarer Blickfang]\nTHUMBNAIL_TENSION: [EINFÜGEN — klarer Gegensatz, Risiko oder Versprechen]\nTHUMBNAIL_SHOT: [EINFÜGEN — konkrete Perspektive und Größenverteilung]\n\nTHUMBNAIL PROMPT:`);
  }
  if (!source.includes(`YOUTUBE_VISUAL_DIRECTION: ${CONTRACT_ID}`)) source += '\n\n' + policyBlock + '\n';
  writeFileSync(path, source, 'utf8');
};

update(ALL_PROMPTS, {planning: true});
update('04-visuals/bildwelt.txt');
update('04-visuals/thumbnail-prompt.txt', {thumbnail: true});
update('06-projektdateien/visual-plan.md');
update('02-script/retention-plan.md');

for (const visual of Array.isArray(index.visuals) ? index.visuals : []) {
  const imagePlan = visual?.type === 'hybrid' ? visual.imagePlanFile : visual?.planFile;
  if (typeof imagePlan === 'string' && imagePlan.endsWith('/bildprompt.txt')) update(imagePlan, {planning: true});
}

console.log(`✓ YouTube Visual Direction gesetzt: ${CONTRACT_ID}`);
console.log(`✓ Bildwelt ${WORLD_ID} bleibt erhalten; ergänzt wurden nur Regie, Hook, Handlung, Kamera und Vielfalt.`);
