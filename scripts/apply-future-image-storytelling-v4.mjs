#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v4.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v4';
const IMAGE_WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.imageStorytellingContract = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyV3Compatible: true,
  imageWorldLockPreserved: IMAGE_WORLD_LOCK,
  groundedAnchorRequired: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  creativeDirectionRequired: true,
  visualPurposeRequired: true,
  storyActionRequired: true,
  conflictOrConsequenceRequired: true,
  visualHookUnderOneSecondRequired: true,
  shotScaleRequired: true,
  cameraAngleRequired: true,
  depthPlanRequired: true,
  emotionalBeatRequired: true,
  causeEffectRequired: true,
  patternInterruptDecisionRequired: true,
  motionHintRequired: true,
  noveltyCheckRequired: true,
  visualDiversityAcrossSequenceRequired: true,
  maxSameVisualModeInRow: 2,
  maxSameShotScaleInRow: 2,
  groundedMetaphorAllowed: true,
  groundedMetaphorNeedsExplicitJustification: true,
  abstractRiddleForbidden: true,
  genericFinanceIconAsMainStoryForbidden: true,
  staticCatalogCompositionForbidden: true,
  worldStyleOverrideForbidden: true,
  photorealismForbidden: true,
  labelsSupplementalOnly: true,
};

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  scene.imageStorytelling = {
    strategy: 'literal',
    visualMode: 'cinematic-literal',
    literalSituation: '[EINFÜGEN — konkrete reale Situation, die im Sprechbeat tatsächlich passiert]',
    contextAnchor: '[EINFÜGEN — klar erkennbarer Finanz-/Alltagskontext]',
    voiceVisualMatch: '[EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]',
    transferabilityTest: '[EINFÜGEN — PASS: warum dieses Bild nicht unverändert zu fünf anderen Finanzthemen passt]',
    visualPurpose: '[EINFÜGEN — verstehen / fühlen / vergleichen / Gefahr erkennen / Ergebnis sehen]',
    storyAction: '[EINFÜGEN — sichtbare Handlung oder Veränderung im Bild]',
    tensionOrConsequence: '[EINFÜGEN — sichtbarer Konflikt, Preis, Risiko, Gegensatz oder Konsequenz]',
    visualHook: '[EINFÜGEN — was innerhalb der ersten Sekunde Aufmerksamkeit erzeugt]',
    shotScale: 'medium',
    cameraAngle: 'eye-level',
    depthPlan: '[EINFÜGEN — Vordergrund / Hauptmotiv / Hintergrund mit klarer Tiefenstaffelung]',
    emotionalBeat: '[EINFÜGEN — z. B. Überraschung, Druck, Erleichterung, Neugier]',
    causeEffect: '[EINFÜGEN — Ursache und sichtbare Wirkung im selben Frame oder klarer Vergleich]',
    patternInterrupt: '[EINFÜGEN — none oder konkreter visueller Rhythmuswechsel]',
    motionHint: '[EINFÜGEN — z. B. slow push-in, parallax, pan, rack-focus; nur als Schnitt-/Motion-Hinweis]',
    noveltyCheck: '[EINFÜGEN — PASS: was an Komposition, Perspektive oder Handlung gegenüber den letzten Bildern neu ist]',
    metaphorJustification: 'none',
  };
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_STRATEGY: literal
VISUAL_MODE: cinematic-literal
LITERAL_REAL_WORLD_SITUATION: [EINFÜGEN — konkrete reale Situation, die im Sprechbeat tatsächlich passiert]
REAL_WORLD_CONTEXT_ANCHOR: [EINFÜGEN — klar erkennbarer Finanz-/Alltagskontext]
VOICEOVER_VISUAL_MATCH: [EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]
TRANSFERABILITY_TEST: [EINFÜGEN — PASS: warum dieses Bild nicht unverändert zu fünf anderen Finanzthemen passt]
VISUAL_PURPOSE: [EINFÜGEN — verstehen / fühlen / vergleichen / Gefahr erkennen / Ergebnis sehen]
STORY_ACTION: [EINFÜGEN — sichtbare Handlung oder Veränderung]
TENSION_OR_CONSEQUENCE: [EINFÜGEN — sichtbarer Konflikt, Preis, Risiko, Gegensatz oder Konsequenz]
VISUAL_HOOK: [EINFÜGEN — stärkstes sofort sichtbares Element]
SHOT_SCALE: medium
CAMERA_ANGLE: eye-level
DEPTH_PLAN: [EINFÜGEN — Vordergrund / Hauptmotiv / Hintergrund]
EMOTIONAL_BEAT: [EINFÜGEN — gewünschte Zuschauerreaktion]
CAUSE_EFFECT: [EINFÜGEN — Ursache und sichtbare Wirkung]
PATTERN_INTERRUPT: [EINFÜGEN — none oder konkreter Rhythmuswechsel]
MOTION_HINT: [EINFÜGEN — dezenter Bewegungs-/Schnitthinweis]
NOVELTY_CHECK: [EINFÜGEN — PASS: konkrete Abwechslung zu den letzten Bildern]
METAPHOR_JUSTIFICATION: none`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}
IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}
REAL_WORLD_ANCHOR_REQUIRED: true

GROUNDED CINEMATIC STORYTELLING V4 — VERBINDLICH:
- Die bestehende FinanzNeo-V9-Bildwelt bleibt unangetastet. Diese Regeln ändern NUR Regie, Bildidee, Handlung und Kamera innerhalb derselben Welt.
- Grounded first, not literal-only: Starte immer bei der echten finanziellen Situation, aber inszeniere sie so stark wie möglich. Eine wörtliche Katalog-Komposition ist kein Qualitätsziel.
- Wähle für jeden Sprechbeat bewusst einen VISUAL_MODE: cinematic-literal, cause-effect, comparison, scale, object-story, pov oder grounded-metaphor.
- Die reale Finanz-/Alltagssituation muss auch bei kreativer Inszenierung innerhalb von ungefähr 1 Sekunde erkennbar bleiben. Keine abstrakten Rätsel.
- Jede Bildszene braucht eine sichtbare STORY_ACTION und TENSION_OR_CONSEQUENCE. Das Bild soll etwas passieren lassen oder eine klare Folge zeigen, nicht nur Gegenstände nebeneinanderstellen.
- Nutze Perspektive, Größenverhältnisse, Vordergrund, Tiefe, Kontrast und Nähe als Unterhaltungsmittel. Kreativität entsteht zuerst durch Regie, nicht durch Stilbruch.
- VISUAL_HOOK beschreibt das eine Element, das den Blick sofort festhält. Es darf groß, nah, überraschend oder kontrastreich sein, solange die Aussage korrekt bleibt.
- VARIETY-RULE: derselbe VISUAL_MODE und dieselbe SHOT_SCALE höchstens zweimal direkt hintereinander. Danach muss sich die visuelle Grammatik ändern.
- Erlaubte SHOT_SCALE-Werte: extreme-wide, wide, medium, close-up, extreme-close-up, macro.
- Erlaubte CAMERA_ANGLE-Werte: eye-level, low-angle, high-angle, top-down, over-shoulder, pov, dutch-subtle.
- PATTERN_INTERRUPT ist bei Hook, Wendepunkt, überraschender Zahl, Kapitelwechsel oder wichtigem Payoff bewusst zu prüfen. "none" ist erlaubt, aber muss eine Entscheidung sein.
- MOTION_HINT ist nur Regie für spätere Bildbewegung/Schnitt: z. B. slow push-in, parallax, pan, rack-focus oder hold. Er verändert nicht die Quellbildwelt.
- GROUNDED-METAPHOR ist erlaubt, wenn eine echte Alltagssituation oder ein konkretes Finanzobjekt als verständlicher Anker erhalten bleibt. Rein abstrakte Symbolrätsel bleiben verboten.
- Bei grounded-metaphor muss METAPHOR_JUSTIFICATION konkret erklären, warum diese Inszenierung schneller verständlich oder emotional stärker ist als die direkte Darstellung.
- TRANSFERABILITY_TEST bleibt Pflicht: Ein Bild, das unverändert zu fünf anderen Finanzthemen passen würde, ist zu generisch.
- NOVELTY_CHECK bleibt Pflicht: Er muss konkret benennen, wodurch das Bild gegenüber den letzten Szenen neu wirkt.
- Kurze deutsche Objektlabels bleiben nur Ergänzung. Kein Titel, CTA oder Erklärsatz im generierten Bild.
- Deep Black, stilisiertes 3D, Farbrollen, Licht, Materialgefühl, Same-World-Lock, Markenregeln, 1:1-Format und Google-Flow-Single-Job aus V9 bleiben vollständig erhalten.
- Niemals die globale Bildwelt überschreiben, abschwächen oder durch Fotorealismus, UI-Look, Flowchart-Look oder generische Finance-Icons ersetzen.
- Alle Planwerte müssen identisch in scene-index.json unter scene.imageStorytelling und im zugehörigen Bildprompt stehen.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('VISUAL_PURPOSE:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/')
    ? resolve(root, '03-szenen', relativePath)
    : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = source.replace(/IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3/g, `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`);
  source = addPlanningBeforeImagePrompts(source);
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`)) {
    source += '\n\n' + policyBlock + '\n';
  } else if (!source.includes('GROUNDED CINEMATIC STORYTELLING V4')) {
    source += '\n\n' + policyBlock + '\n';
  }
  writeFileSync(path, source, 'utf8');
};

const updatePolicyFile = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = source.replace(/IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3/g, `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`);
  if (!source.includes('GROUNDED CINEMATIC STORYTELLING V4')) {
    source += '\n\n' + policyBlock + '\n';
  }
  writeFileSync(path, source, 'utf8');
};

updatePromptFile('03-szenen/alle-bildprompts.txt');
updatePromptFile('03-szenen/00-cover/cover.txt');
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type === 'image' && typeof scene.planFile === 'string') updatePromptFile(scene.planFile);
}
updatePolicyFile('03-szenen/bildwelt.txt');
updatePolicyFile('05-projektdateien/szenenplan.md');
updatePolicyFile('05-projektdateien/ANTIGRAVITY-AUFTRAG.md');

console.log('✓ Future Image Storytelling gesetzt: ' + CONTRACT_ID);
console.log('✓ V9-Bildwelt bleibt unverändert; V4 verbessert nur Regie, Handlung, Kamera, Hooks und visuelle Vielfalt.');
console.log('✓ Grounded first, nicht literal-only · abstrakte Rätsel bleiben verboten.');
