#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v5.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v5';
const SEQUENCE_ID = 'finanzneo-visual-sequence-plan-v1';
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
  legacyV3V4Compatible: true,
  imageWorldLockPreserved: IMAGE_WORLD_LOCK,
  sequencePlanningRequiredBeforePrompts: true,
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
  energyArcRequired: true,
  archetypeRotationRequired: true,
  locationRotationRequired: true,
  compositionRotationRequired: true,
  humanPresenceRotationRequired: true,
  mainSubjectRotationRequired: true,
  maxSameVisualModeInRow: 2,
  maxSameShotScaleInRow: 2,
  maxSameCameraAngleInRow: 2,
  maxSameLocationFamilyInRow: 2,
  maxSameMainSubjectFamilyInRow: 2,
  maxSameCompositionFamilyInRow: 1,
  maxSameArchetypeInRow: 1,
  maxTableDocumentScenesPerSixImages: 2,
  maxImagesWithoutPatternInterrupt: 2,
  firstTwoNeedHighEnergyScene: true,
  groundedMetaphorAllowed: true,
  groundedMetaphorNeedsExplicitJustification: true,
  abstractRiddleForbidden: true,
  genericFinanceIconAsMainStoryForbidden: true,
  staticCatalogCompositionForbidden: true,
  worldStyleOverrideForbidden: true,
  photorealismForbidden: true,
  labelsSupplementalOnly: true,
};

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
index.visualSequencePlan = {
  id: SEQUENCE_ID,
  contractId: CONTRACT_ID,
  status: 'PLAN_BEFORE_PROMPTS',
  imageSceneOrder: imageScenes.map((scene) => scene.id),
  rules: {
    planWholeSequenceBeforeIndividualPrompts: true,
    storyArcRequired: true,
    energyScale: [1, 5],
    firstTwoNeedEnergyAtLeast: 4,
    maxSameCompositionFamilyInRow: 1,
    maxSameArchetypeInRow: 1,
    maxSameLocationFamilyInRow: 2,
    maxSameMainSubjectFamilyInRow: 2,
    maxSameCameraAngleInRow: 2,
    maxTableDocumentScenesPerSixImages: 2,
    maxImagesWithoutPatternInterrupt: 2,
    cameraDirectionOverridesGenericStyleFraming: true,
    locationMustServeVoiceBeat: true,
    noveltyMustBeSequenceRelative: true,
  },
};

for (const scene of imageScenes) {
  scene.imageStorytelling = {
    strategy: 'literal',
    visualMode: 'cinematic-literal',
    sequenceRole: '[EINFÜGEN — hook / detail / escalation / contrast / reveal / bridge / payoff]',
    energyLevel: 3,
    visualArchetype: '[EINFÜGEN — character-action / pov / macro-object / environment / comparison / scale-reveal / cause-effect / before-after / object-story / grounded-metaphor]',
    locationFamily: '[EINFÜGEN — konkrete Ortsfamilie, z. B. Küche / Supermarkt / Arbeitsplatz / Werkstatt / Straße / Wohnung]',
    humanPresence: '[EINFÜGEN — none / hands-only / single-person / multi-person]',
    compositionFamily: '[EINFÜGEN — face-led / object-led / environment-led / comparison / process / scale-reveal / before-after]',
    mainSubjectFamily: '[EINFÜGEN — z. B. Rechnung / Einkauf / Fahrzeug / Konto-Dokument / Person / Haushaltsobjekt]',
    tableDocumentScene: false,
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
    patternInterrupt: '[EINFÜGEN — none oder konkreter Rhythmuswechsel]',
    motionHint: '[EINFÜGEN — z. B. slow push-in, parallax, pan, rack-focus; nur als Schnitt-/Motion-Hinweis]',
    noveltyCheck: '[EINFÜGEN — PASS: konkrete Abwechslung zur bisherigen SEQUENZ, nicht nur zur letzten Szene]',
    metaphorJustification: 'none',
  };
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_STRATEGY: literal
VISUAL_MODE: cinematic-literal
SEQUENCE_ROLE: [EINFÜGEN — hook / detail / escalation / contrast / reveal / bridge / payoff]
ENERGY_LEVEL: 3
VISUAL_ARCHETYPE: [EINFÜGEN — character-action / pov / macro-object / environment / comparison / scale-reveal / cause-effect / before-after / object-story / grounded-metaphor]
LOCATION_FAMILY: [EINFÜGEN — konkrete Ortsfamilie]
HUMAN_PRESENCE: [EINFÜGEN — none / hands-only / single-person / multi-person]
COMPOSITION_FAMILY: [EINFÜGEN — face-led / object-led / environment-led / comparison / process / scale-reveal / before-after]
MAIN_SUBJECT_FAMILY: [EINFÜGEN — konkretes Hauptmotiv]
TABLE_DOCUMENT_SCENE: false
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
NOVELTY_CHECK: [EINFÜGEN — PASS: konkrete Abwechslung zur bisherigen Sequenz]
METAPHOR_JUSTIFICATION: none`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}
VISUAL_SEQUENCE_PLAN: ${SEQUENCE_ID}
IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}
REAL_WORLD_ANCHOR_REQUIRED: true

SEQUENCE-FIRST VISUAL STORYTELLING V5 — VERBINDLICH:
- Die bestehende FinanzNeo-V9-Bildwelt bleibt unangetastet. V5 ändert nur Regie, Sequenzrhythmus, Bildidee, Handlung und Kamera.
- SEQUENCE FIRST: Bevor der erste finale Bildprompt geschrieben wird, muss die gesamte Reihenfolge der IMAGE-Szenen als visuelle Dramaturgie geplant werden. Erst danach werden Einzelprompts finalisiert.
- Plane nicht sechs gute Einzelbilder, sondern eine zusammenhängende Bildfolge mit Rollen wie Hook, Detail, Eskalation, Kontrast, Reveal, Bridge und Payoff.
- ENERGY_LEVEL 1–5 ist Pflicht. Unter den ersten zwei IMAGE-Szenen muss mindestens eine Energie >= 4 haben. Die Folge soll bewusste Peaks und ruhigere Beats enthalten, nicht sechs gleich laute Bilder.
- VISUAL_ARCHETYPE rotiert aktiv zwischen character-action, pov, macro-object, environment, comparison, scale-reveal, cause-effect, before-after, object-story und grounded-metaphor.
- Keine zwei direkt aufeinanderfolgenden IMAGE-Szenen dürfen dieselbe COMPOSITION_FAMILY oder denselben VISUAL_ARCHETYPE verwenden.
- LOCATION_FAMILY darf höchstens zweimal direkt hintereinander gleich sein. Ortswechsel sind kein Selbstzweck: jeder Ort muss die gesprochene Aussage natürlicher oder stärker machen.
- HUMAN_PRESENCE wird bewusst variiert. Nicht jede Finanzszene braucht eine sitzende Person. none, hands-only, single-person und multi-person sind je nach Inhalt erlaubt.
- TABLE_DOCUMENT_SCENE muss ehrlich gesetzt werden. In jedem gleitenden Fenster aus sechs IMAGE-Szenen sind höchstens zwei Szenen erlaubt, deren Hauptbildsprache aus Person/Tisch/Dokumenten besteht.
- MAIN_SUBJECT_FAMILY soll sich sichtbar verändern. Dieselbe Hauptmotiv-Familie höchstens zweimal direkt hintereinander. Wiederhole nicht ständig Rechnung, Ordner, Umschlag oder Smartphone, wenn ein anderes reales Objekt die Aussage besser tragen kann.
- CAMERA_ANGLE und SHOT_SCALE werden aus der Sequenz heraus gewählt. Eine konkrete Szenen-Kamera hat Vorrang vor generischer Stilformulierung; der V9-Look bestimmt Rendering, nicht einen festen Kamerawinkel.
- Grounded first, not literal-only: Die reale Finanz-/Alltagssituation bleibt in ca. 1 Sekunde verständlich, darf aber stark inszeniert werden.
- STORY_ACTION und TENSION_OR_CONSEQUENCE bleiben Pflicht. Gegenstände dürfen die Konsequenz physisch sichtbar machen: verdrängen, blockieren, schrumpfen, wachsen, wiederkehren, sich stapeln, getrennt werden oder verschwinden.
- PATTERN_INTERRUPT: Es dürfen nie mehr als zwei IMAGE-Szenen ohne echten visuellen Rhythmuswechsel aufeinanderfolgen. Ein Interrupt kann Perspektive, Maßstab, Location, Personenzahl, Vergleichsform oder starke Cause/Effect-Inszenierung ändern.
- VISUAL_HOOK muss innerhalb der ersten Sekunde lesbar sein und darf über Nähe, Größenverhältnis, Konflikt, Kontrast oder ungewöhnliche reale Perspektive entstehen.
- NOVELTY_CHECK ist sequenzrelativ: Er muss erklären, was gegenüber den bisherigen Bildern dieses Reels neu ist. "Andere Farbe" oder nur ein anderes Label reicht nicht.
- TRANSFERABILITY_TEST bleibt Pflicht: Ein Bild, das unverändert zu fünf anderen Finanzthemen passen würde, ist zu generisch.
- GROUNDED-METAPHOR ist nur mit konkretem Realweltanker erlaubt; abstrakte Rätsel bleiben verboten.
- Kurze deutsche Objektlabels bleiben Ergänzung. Das Bild muss ohne lange Texterklärung funktionieren.
- Deep Black, stylized 3D, Farbrollen, Materialgefühl, Markenregeln, 1:1-Format, Same-World-Lock und Google-Flow-Single-Job aus V9 bleiben vollständig erhalten.
- Niemals V9 überschreiben, Fotorealismus einführen oder in UI-, Dashboard-, Flowchart- oder generische Finance-Icon-Bildsprache wechseln.
- Alle Planwerte müssen identisch in scene-index.json und im zugehörigen Bildprompt stehen.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('SEQUENCE_ROLE:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const replaceOldContractMarker = (source) => source
  .replace(/IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3/g, `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`)
  .replace(/IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v4/g, `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`);

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/')
    ? resolve(root, '03-szenen', relativePath)
    : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = replaceOldContractMarker(source);
  source = addPlanningBeforeImagePrompts(source);
  if (!source.includes('SEQUENCE-FIRST VISUAL STORYTELLING V5')) source += '\n\n' + policyBlock + '\n';
  writeFileSync(path, source, 'utf8');
};

const updatePolicyFile = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = replaceOldContractMarker(source);
  if (!source.includes('SEQUENCE-FIRST VISUAL STORYTELLING V5')) source += '\n\n' + policyBlock + '\n';
  writeFileSync(path, source, 'utf8');
};

updatePromptFile('03-szenen/alle-bildprompts.txt');
updatePromptFile('03-szenen/00-cover/cover.txt');
for (const scene of imageScenes) {
  if (typeof scene.planFile === 'string') updatePromptFile(scene.planFile);
}
updatePolicyFile('03-szenen/bildwelt.txt');
updatePolicyFile('05-projektdateien/szenenplan.md');
updatePolicyFile('05-projektdateien/ANTIGRAVITY-AUFTRAG.md');

const sequencePlanPath = resolve(root, '05-projektdateien/VISUAL-SEQUENCE-PLAN.md');
const rows = imageScenes.map((scene, i) =>
  `| ${i + 1} | ${scene.id ?? `image-${i + 1}`} | [Rolle] | [1–5] | [Archetyp] | [Location] | [Human] | [Composition] | [Main Subject] | [ja/nein] | [Interrupt/none] |`
).join('\n');
const sequenceDoc = `# Visual Sequence Plan V1

VISUAL_SEQUENCE_PLAN: ${SEQUENCE_ID}
IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}
IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}

## Arbeitsreihenfolge

1. Voice-/Sprechbeats lesen.
2. ZUERST diese gesamte Tabelle für alle IMAGE-Szenen ausfüllen.
3. Sequenz auf Wiederholungen, Energy Arc, Pattern Interrupts und Table/Document-Quote prüfen.
4. Erst danach einzelne Bildprompts final schreiben.
5. V9-Bildwelt niemals ändern.

| # | Scene | Sequence Role | Energy | Archetype | Location | Human | Composition | Main Subject | Table+Docs | Pattern Interrupt |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
${rows || '| - | keine IMAGE-Szene | - | - | - | - | - | - | - | - | - |'}

## Harte V5-Gates

- gleiche Composition direkt hintereinander: verboten
- gleicher Archetype direkt hintereinander: verboten
- gleiche Location mehr als 2 IMAGE-Szenen direkt: verboten
- gleiche Camera Angle mehr als 2 IMAGE-Szenen direkt: verboten
- Person/Tisch/Dokumente als Hauptsprache: max. 2 in jedem 6-IMAGE-Fenster
- mehr als 2 IMAGE-Szenen ohne Pattern Interrupt: verboten
- unter den ersten 2 IMAGE-Szenen mindestens eine mit Energy >= 4
- konkrete Szenen-Kamera schlägt generisches Framing aus Stiltext
- V9 Rendering/Deep Black/1:1/Single-Job bleiben unverändert
`;
writeFileSync(sequencePlanPath, sequenceDoc, 'utf8');

console.log('✓ Future Image Storytelling gesetzt: ' + CONTRACT_ID);
console.log('✓ Visual Sequence Plan gesetzt: ' + SEQUENCE_ID);
console.log('✓ V9-Bildwelt bleibt unverändert; V5 plant zuerst die ganze Bildfolge und erst danach Einzelprompts.');
console.log('✓ Anti-Wiederholung: Archetyp, Composition, Location, Kamera, Main Subject und Table/Document-Muster werden sequenzweit gesteuert.');
