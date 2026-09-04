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
  literalFirstRequired: true,
  directRealWorldDepictionPreferred: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  metaphorFallbackOnly: true,
  metaphorNeedsExplicitJustification: true,
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
};

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  if (!scene.imageStorytelling || typeof scene.imageStorytelling !== 'object') {
    scene.imageStorytelling = {
      strategy: 'literal',
      literalSituation: '[EINFÜGEN — konkrete reale Situation, die im Sprechbeat wirklich passiert]',
      contextAnchor: '[EINFÜGEN — klar erkennbarer Finanz-/Alltagskontext]',
      voiceVisualMatch: '[EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]',
      transferabilityTest: '[EINFÜGEN — PASS: warum dieses Bild nicht genauso zu fünf anderen Finanzthemen passen könnte]',
      metaphorJustification: 'none',
    };
  }
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_STRATEGY: literal
LITERAL_REAL_WORLD_SITUATION: [EINFÜGEN — konkrete reale Situation, die im Sprechbeat wirklich passiert]
REAL_WORLD_CONTEXT_ANCHOR: [EINFÜGEN — klar erkennbarer Finanz-/Alltagskontext]
VOICEOVER_VISUAL_MATCH: [EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]
TRANSFERABILITY_TEST: [EINFÜGEN — PASS: warum dieses Bild nicht genauso zu fünf anderen Finanzthemen passen könnte]
METAPHOR_JUSTIFICATION: none`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}

LITERAL_FIRST_POLICY: Literal first, creative second.

FUTURE IMAGE STORYTELLING V3 — VERBINDLICH:
- Beginne beim exakten Sprechbeat: Was passiert in der echten Welt wirklich? Diese Situation ist die erste Wahl für das Bild.
- Zeige einen sofort erkennbaren Finanz-/Alltagskontext wie Überweisung, Rechnung, Karte, Konto, Einkauf, Vertrag, Bankkontakt oder Zahlung, wenn dieser Kontext im Sprechbeat vorkommt.
- Das Bild muss die gesprochene Aussage direkt zeigen; es darf nicht nur allgemein zum Oberthema Finanzen passen.
- SUBTITLE-OFF-TEST: Ohne Überschrift und Untertitel muss ein fremder Zuschauer ungefähr erkennen können, was gerade erklärt wird.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert auch zu fünf anderen Finanzthemen passen, ist es zu generisch und muss neu geplant werden.
- Metaphern sind nur Fallback. Nutze sie erst, wenn die reale Situation visuell deutlich schlechter oder unverständlich wäre.
- Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale, Sortieranlagen, große Hebel und ähnliche Maschinen sind bei statischen Bildern KEINE Standard-Erklärung.
- Wird trotzdem eine Metapher gewählt, muss VISUAL_STRATEGY=metaphor gesetzt und METAPHOR_JUSTIFICATION konkret ausgefüllt werden.
- Ursache/Wirkung bleibt erwünscht, aber sie soll möglichst innerhalb der realen Situation stattfinden und nicht automatisch in eine Fantasiemaschine übersetzt werden.
- Kurze deutsche Objektlabels sind nur Ergänzung. Die Situation muss ohne Label verständlich bleiben.
- Weniger, passendere Objekte schlagen eine dekorative Finanzobjekt-Sammlung.
- Ein zusätzliches gutes Bild ist besser als ein überladener oder nur ungefähr passender Still.
- Die fünf Planwerte aus dem Bildprompt müssen identisch in scene-index.json unter scene.imageStorytelling stehen; Prompt und Index dürfen sich nicht widersprechen.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('LITERAL_REAL_WORLD_SITUATION:')) return source;
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
console.log('✓ Literal first, creative second · reale Situation + Kontextanker + Voiceover-Match + Transferability-Test sind Pflicht.');
console.log('✓ Metaphern bleiben möglich, müssen aber bewusst gewählt und konkret begründet werden.');
