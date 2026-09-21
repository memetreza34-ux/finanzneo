#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v3';
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
  storyMomentFirstRequired: true,
  creativeShotDesignRequired: true,
  literalRealWorldGroundingRequired: true,
  directRealWorldDepictionPreferred: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  visibleActionConflictOrConsequenceRequired: true,
  uniqueStoryDetailRequired: true,
  foregroundHeroContextPlanningRequired: true,
  differenceFromPreviousBeatsRequired: true,
  transferabilityTestRequired: true,
  metaphorFallbackOnly: true,
  metaphorNeedsExplicitJustification: true,
  genericFantasyMechanismAsDefaultForbidden: true,
  railsConveyorsGatesCagesPortalsAsDefaultForbidden: true,
  practicalEverydaySituationRequired: true,
  directMeaningWithoutCaptionRequired: true,
  genericSymbolOnlyForbidden: true,
  isolatedFinanceIconAsMainStoryForbidden: true,
  personPlusFinanceSymbolsOnEmptyBackgroundForbidden: true,
  bankShieldCoinsArrowDefaultForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  entertainmentThroughActionContrastOrConflictRequired: true,
  beforeAfterOrCauseEffectWhenHelpful: true,
  humanContextWhenHelpful: true,
  visualHookUnderOneSecondRequired: true,
  oneImagePerSentenceWhenItImprovesClarity: true,
  extraImagePreferredOverOverloadedStill: true,
  labelsSupplementalOnly: true,
};

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  if (!scene.imageStorytelling || typeof scene.imageStorytelling !== 'object') {
    scene.imageStorytelling = {};
  }
  scene.imageStorytelling = {
    ...scene.imageStorytelling,
    strategy: scene.imageStorytelling.strategy ?? 'story-moment-real-world',
    storyMoment: scene.imageStorytelling.storyMoment ?? '[EINFÜGEN — interessantester konkrete sichtbare Moment dieses Sprechbeats]',
    literalSituation: scene.imageStorytelling.literalSituation ?? '[EINFÜGEN — reale Situation, in der dieser Moment wirklich passiert]',
    visibleAction: scene.imageStorytelling.visibleAction ?? '[EINFÜGEN — sichtbare Handlung, nicht nur statische Objekte]',
    visibleConsequence: scene.imageStorytelling.visibleConsequence ?? '[EINFÜGEN — sichtbare Folge, Veränderung oder Kontrast]',
    shotType: scene.imageStorytelling.shotType ?? '[EINFÜGEN — bewusster Shot-Typ]',
    cameraPosition: scene.imageStorytelling.cameraPosition ?? '[EINFÜGEN — konkrete Kameraposition und Blickrichtung]',
    foreground: scene.imageStorytelling.foreground ?? '[EINFÜGEN — Vordergrund oder none mit Begründung]',
    hero: scene.imageStorytelling.hero ?? '[EINFÜGEN — klares Hauptmotiv]',
    contextAnchor: scene.imageStorytelling.contextAnchor ?? '[EINFÜGEN — erkennbarer Finanz-/Alltagskontext]',
    uniqueDetail: scene.imageStorytelling.uniqueDetail ?? '[EINFÜGEN — konkretes Detail, das nur zu diesem Beat passt]',
    differenceFromPreviousBeats: scene.imageStorytelling.differenceFromPreviousBeats ?? '[EINFÜGEN — sichtbare Abwechslung zu den letzten zwei Beats]',
    voiceVisualMatch: scene.imageStorytelling.voiceVisualMatch ?? '[EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]',
    transferabilityTest: scene.imageStorytelling.transferabilityTest ?? '[EINFÜGEN — PASS: warum dieses Bild nicht genauso zu fünf anderen Finanzthemen passen könnte]',
    metaphorJustification: scene.imageStorytelling.metaphorJustification ?? 'none',
  };
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_STRATEGY: story-moment-real-world
STORY_MOMENT: [EINFÜGEN — interessantester konkrete sichtbare Moment]
LITERAL_REAL_WORLD_SITUATION: [EINFÜGEN — reale Situation, in der dieser Moment wirklich passiert]
VISIBLE_ACTION: [EINFÜGEN — was passiert sichtbar]
VISIBLE_CONSEQUENCE: [EINFÜGEN — welche Folge, Veränderung oder welcher Kontrast wird sichtbar]
SHOT_TYPE: [EINFÜGEN]
CAMERA_POSITION: [EINFÜGEN]
FOREGROUND: [EINFÜGEN]
HERO: [EINFÜGEN]
REAL_WORLD_CONTEXT_ANCHOR: [EINFÜGEN — klar erkennbarer Finanz-/Alltagskontext]
UNIQUE_STORY_DETAIL: [EINFÜGEN — konkretes Detail, das nur zu diesem Beat passt]
DIFFERENCE_FROM_PREVIOUS_BEATS: [EINFÜGEN]
VOICEOVER_VISUAL_MATCH: [EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]
TRANSFERABILITY_TEST: [EINFÜGEN — PASS: warum dieses Bild nicht genauso zu fünf anderen Finanzthemen passen könnte]
METAPHOR_JUSTIFICATION: none`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}

STORY_MOMENT_FIRST_POLICY: Erst interessanter sichtbarer Moment und Shot Design, dann Style Lock.

FUTURE IMAGE STORYTELLING V3 — VERBINDLICH:
- Beginne beim exakten Sprechbeat und finde zuerst den interessantesten realen sichtbaren Moment, nicht das naheliegendste Finanzsymbol.
- Plane sichtbare Handlung, Konsequenz oder klaren Vorher/Nachher- bzw. Ursache/Wirkungs-Kontrast.
- Definiere Kamera, Vordergrund, Hero und Kontext bewusst. Eine sichere mittige Standardkomposition ist kein Default.
- Zeige einen sofort erkennbaren Finanz-/Alltagskontext wie Überweisung, Rechnung, Karte, Konto, Einkauf, Vertrag, Bankkontakt oder Zahlung, wenn dieser Kontext im Sprechbeat vorkommt.
- Nutze ein konkretes Story-Detail wie einen Betrag, Datum, offene Rechnung, Einkaufstüte, Terminal oder Haushaltsgegenstand, wenn es die Szene spezifischer und glaubwürdiger macht.
- Das Bild muss die gesprochene Aussage direkt zeigen; es darf nicht nur allgemein zum Oberthema Finanzen passen.
- SUBTITLE-OFF-TEST: Ohne Überschrift und Untertitel muss ein fremder Zuschauer ungefähr erkennen können, was gerade passiert.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert auch zu fünf anderen Finanzthemen passen, ist es zu generisch und muss neu geplant werden.
- SHOT-DIVERSITY-TEST: Wiederholt das Bild Kamera, Hauptobjekt, Personenpose und zentrale Komposition der letzten zwei Beats, muss eine klar neue sichtbare Information oder ein anderer Shot entwickelt werden.
- Person + Geld + Kalender/Schild/Münzen auf leerem Hintergrund ist als Standardidee verboten.
- Bank + Schild + Münzen + Pfeil ist keine ausreichende Hauptidee.
- Metaphern sind nur Fallback. Nutze sie erst, wenn die reale Situation visuell deutlich schlechter oder unverständlich wäre.
- Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale, Sortieranlagen, große Hebel und ähnliche Maschinen sind bei statischen Bildern KEINE Standard-Erklärung.
- Wird trotzdem eine Metapher gewählt, muss VISUAL_STRATEGY=metaphor gesetzt und METAPHOR_JUSTIFICATION konkret ausgefüllt werden.
- Ursache/Wirkung bleibt erwünscht, soll aber möglichst innerhalb einer glaubwürdigen Situation stattfinden und nicht automatisch in eine Fantasiemaschine übersetzt werden.
- Kurze deutsche Objektlabels sind nur Ergänzung. Die Situation muss ohne Label verständlich bleiben.
- Weniger, passendere Objekte schlagen eine dekorative Finanzobjekt-Sammlung.
- Ein zusätzliches gutes Bild ist besser als ein überladener oder zu lange gehaltener Still.
- Die Planwerte aus dem Bildprompt müssen inhaltlich mit scene-index.json und creativeDirection übereinstimmen.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('STORY_MOMENT:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/')
    ? resolve(root, '03-szenen', relativePath)
    : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = addPlanningBeforeImagePrompts(source);
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`)) {
    source += '\n\n' + policyBlock + '\n';
  }
  writeFileSync(path, source, 'utf8');
};

const updatePolicyFile = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}`)) {
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
console.log('✓ Story Moment first · Handlung/Konsequenz · Shot Design · Unique Detail · Voiceover-Match sind Pflicht.');
console.log('✓ Generische Symbolposter und wiederholte Standardshots sind keine zulässige Default-Lösung.');
console.log('✓ Metaphern bleiben möglich, müssen aber bewusst gewählt und konkret begründet werden.');