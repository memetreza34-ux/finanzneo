#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v3';
const STORY_MOMENT_REVISION = 'finanzneo-readable-story-moment-v1';
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
  storyMomentRevision: STORY_MOMENT_REVISION,
  literalFirstRequired: true,
  directRealWorldDepictionPreferred: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  metaphorFallbackOnly: false,
  metaphorNeedsExplicitJustification: true,
  intuitiveMetaphorAllowed: true,
  intuitiveMetaphorMayBeatLiteralWhenClearer: true,
  familiarObjectsOrCharactersRequired: true,
  instantStoryReadRequired: true,
  exaggeratedPhysicalStoryAllowed: true,
  familiarObjectMetaphorRequired: true,
  animationFilmStoryFrameRequired: true,
  genericFantasyMechanismAsDefaultForbidden: true,
  railsConveyorsGatesCagesPortalsAsDefaultForbidden: true,
  practicalEverydaySituationRequired: true,
  directMeaningWithoutCaptionRequired: true,
  visibleActionConflictOrConsequenceRequired: true,
  genericSymbolOnlyForbidden: true,
  isolatedFinanceIconAsMainStoryForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  entertainmentThroughActionContrastOrConflictRequired: true,
  beforeAfterOrCauseEffectWhenHelpful: true,
  humanContextWhenHelpful: true,
  visualHookUnderOneSecondRequired: true,
  oneImagePerSentenceWhenItImprovesClarity: true,
  extraImagePreferredOverOverloadedStill: true,
  labelsSupplementalOnly: true,
  animationFilmRenderingRequired: true,
  groundedStoryMomentRequired: true,
  abstractFinanceObjectAsDefaultForbidden: true,
  phaseAQualityReferenceOnly: true,
};

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  if (!scene.imageStorytelling || typeof scene.imageStorytelling !== 'object') {
    scene.imageStorytelling = {
      strategy: 'literal',
      literalSituation: '[EINFÜGEN — reale/erkennbare Ausgangslage oder bekannte Dinge, auf denen die Szene basiert]',
      contextAnchor: '[EINFÜGEN — bekannte Figur/Gegenstände, die die Bedeutung tragen]',
      storyMoment: '[EINFÜGEN — was passiert sichtbar im eingefrorenen Animationsfilm-Moment?]',
      voiceVisualMatch: '[EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]',
      instantReadTest: '[EINFÜGEN — PASS: warum versteht man die Szene in 1–2 Sekunden ohne Untertitel?]',
      transferabilityTest: '[EINFÜGEN — PASS: warum passt das Bild nicht unverändert zu fünf anderen Finanzthemen?]',
      metaphorJustification: 'none',
    };
  }
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_STRATEGY: literal
LITERAL_REAL_WORLD_SITUATION: [EINFÜGEN — reale/erkennbare Ausgangslage oder bekannte Dinge]
REAL_WORLD_CONTEXT_ANCHOR: [EINFÜGEN — bekannte Figur/Gegenstände, die die Bedeutung tragen]
VISUAL_STORY_MOMENT: [EINFÜGEN — konkrete sichtbare Handlung/Reaktion/Ursache-Wirkung im eingefrorenen Moment]
VOICEOVER_VISUAL_MATCH: [EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]
INSTANT_READ_TEST: [EINFÜGEN — PASS: warum versteht man die Szene in 1–2 Sekunden ohne Untertitel?]
TRANSFERABILITY_TEST: [EINFÜGEN — PASS: warum passt dieses Bild nicht unverändert zu fünf anderen Finanzthemen?]
METAPHOR_JUSTIFICATION: none`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}
STORY_MOMENT_REVISION: ${STORY_MOMENT_REVISION}

FAMILIAR_STORY_FIRST_POLICY: Familiar things, clear story, creative when useful.

FUTURE IMAGE STORYTELLING V3 — STORY-MOMENT-REVISION VERBINDLICH:
- Beginne beim exakten Sprechbeat: Was soll der Zuschauer in 1–2 Sekunden verstehen?
- Wähle bekannte Figuren und/oder bekannte reale Gegenstände als Bedeutungsträger: z. B. Person, Geld, Rechnung, Kassenzettel, Karte, Konto, Smartphone, Kalender, Vertrag, Fernseher, Sofa, Einkauf, Waschmaschine.
- Baue daraus einen klaren eingefrorenen STORY-MOMENT wie aus einem hochwertigen 3D-Animationsfilm. Es muss sichtbar etwas passieren: Handlung, Reaktion, Ursache/Wirkung, Konflikt, Vorher/Nachher oder Progression.
- V9 beschreibt die RENDERING-WELT: premium stylized 3D animation-film, sichtbar stilisiert, hochwertig modelliert, tiefschwarze Bühne. V9 ersetzt keine Storyidee.
- Eine intuitive Metapher oder Übertreibung ist ausdrücklich erlaubt und darf die wörtliche Darstellung schlagen, wenn sie schneller und klarer erklärt. Beispiel: kleiner Ratenzettel vorne, riesiger Gesamtkassenzettel dahinter.
- Eine Metapher darf KEIN Rätsel sein. Bekannte Dinge müssen die Bedeutung tragen und INSTANT_READ_TEST muss PASS sein.
- SUBTITLE-OFF-TEST: Ohne Überschrift und Untertitel muss ein fremder Zuschauer ungefähr erkennen können, was gerade passiert.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert auch zu fünf anderen Finanzthemen passen, ist es zu generisch und muss neu geplant werden.
- ABSTRAKTE FINANZKÖRPER sind KEINE Standardsprache: capital body, wealth tower, value block, investment block, fee token und ähnliche erfundene Wertobjekte dürfen bekannte Dinge nicht ersetzen. Wenn sie ausnahmsweise Hauptmotiv werden, muss VISUAL_STRATEGY=metaphor gesetzt und METAPHOR_JUSTIFICATION konkret ausgefüllt werden.
- Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale, Sortieranlagen, große Hebel und ähnliche Maschinen sind KEINE Standard-Erklärung. Nur nutzen, wenn ihre Bedeutung ohne Erklärung sofort intuitiv ist und bekannte Dinge die Szene tragen.
- Ursache/Wirkung soll sichtbar in einer verständlichen kleinen Geschichte stattfinden.
- Wenige große, gut modellierte Hero-Objekte sind besser als viele kleine Symbole. Starke 3/4-, diagonale oder Vordergrund/Mittelgrund/Hintergrund-Kompositionen sind erwünscht, wenn sie die Story klarer machen.
- Figuren dürfen ausdrücklich zentral sein. Keine generische Corporate-3D-Stockfigur, die nur neben einem Gegenstand steht: Pose, Reaktion oder Handlung muss die Aussage mittragen.
- Kurze deutsche Objektlabels sind nur Ergänzung. Die Situation muss ohne Label grundsätzlich funktionieren.
- Ein zusätzliches gutes Bild ist besser als ein überladener oder nur ungefähr passender Still.
- Die frühere YouTube-Phase-A-DNA darf als Qualitätsreferenz für Modellierung, Licht, Tiefe, Kamera und Story-Moment dienen, aber NICHT als separater Reel-Vertrag.
- Die Planwerte aus Bildprompt und scene-index.json müssen identisch sein; Prompt und Index dürfen sich nicht widersprechen.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('VISUAL_STORY_MOMENT:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/')
    ? resolve(root, '03-szenen', relativePath)
    : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = addPlanningBeforeImagePrompts(source);
  if (!source.includes(`STORY_MOMENT_REVISION: ${STORY_MOMENT_REVISION}`)) {
    source += '\n\n' + policyBlock + '\n';
  }
  writeFileSync(path, source, 'utf8');
};

const updatePolicyFile = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`STORY_MOMENT_REVISION: ${STORY_MOMENT_REVISION}`)) {
    source += '\n\n' + policyBlock + '\n';
    writeFileSync(path, source, 'utf8');
  }
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
console.log('✓ Story-Moment-Revision: ' + STORY_MOMENT_REVISION);
console.log('✓ Bekannte Figuren/Gegenstände + sofort verständliche Story + intuitive Metaphern wenn sie besser erklären.');
