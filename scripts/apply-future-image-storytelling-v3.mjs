#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-image-storytelling-v3';
const VISUAL_FORM_REVISION = 'finanzneo-free-visual-form-v1';
const ALLOWED_VISUAL_FORMS = [
  'character-story',
  'object-story',
  'comparison',
  'chart',
  'diagram',
  'editorial-quote',
  'illustration',
  'metaphor',
  'hybrid',
];

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
  visualFormRevision: VISUAL_FORM_REVISION,
  visualFormFreedomRequired: true,
  visualFormChosenPerBeatRequired: true,
  allowedVisualForms: ALLOWED_VISUAL_FORMS,
  v9StyleLockRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  instantReadRequired: true,
  transferabilityTestRequired: true,
  recognizableFinanceContextRequired: true,
  humanOptional: true,
  realWorldObjectsOptional: true,
  intuitiveMetaphorAllowed: true,
  illustrationAllowed: true,
  editorialQuoteAllowed: true,
  comparisonAllowed: true,
  chartAllowed: true,
  diagramAllowed: true,
  hybridAllowed: true,
  textMayBePrimaryForEditorialQuote: true,
  realChartMustRemainRealChart: true,
  chartAxesLabelsWhenApplicableRequired: true,
  chartDataIntegrityRequired: true,
  premiumChartStylingRequired: true,
  powerPointExcelDefaultLookForbidden: true,
  genericCorporateLookForbidden: true,
  genericFantasyMechanismAsDefaultForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  abstractFinanceObjectAsDefaultForbidden: true,
  animationFilmRenderingRequired: true,
  phaseAQualityReferenceOnly: true,
};

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  scene.imageStorytelling = {
    visualForm: '[EINFÜGEN — character-story | object-story | comparison | chart | diagram | editorial-quote | illustration | metaphor | hybrid]',
    visualConcept: '[EINFÜGEN — konkrete Bildidee für genau diesen Sprechbeat]',
    voiceVisualMatch: '[EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]',
    instantReadTest: '[EINFÜGEN — PASS: warum versteht man die Aussage in 1–2 Sekunden?]',
    transferabilityTest: '[EINFÜGEN — PASS: warum passt das Bild nicht unverändert zu fünf anderen Finanzthemen?]',
    dataIntegrityTest: '[EINFÜGEN — bei chart/diagram: PASS mit Daten-/Achsenlogik; sonst not-applicable]',
  };
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planningBlock = `VISUAL_FORM: [EINFÜGEN — character-story | object-story | comparison | chart | diagram | editorial-quote | illustration | metaphor | hybrid]
VISUAL_CONCEPT: [EINFÜGEN — konkrete Bildidee für genau diesen Sprechbeat]
VOICEOVER_VISUAL_MATCH: [EINFÜGEN — welches sichtbare Detail zeigt exakt die gesprochene Aussage]
INSTANT_READ_TEST: [EINFÜGEN — PASS: warum versteht man die Aussage in 1–2 Sekunden?]
TRANSFERABILITY_TEST: [EINFÜGEN — PASS: warum passt dieses Bild nicht unverändert zu fünf anderen Finanzthemen?]
DATA_INTEGRITY_TEST: [EINFÜGEN — bei chart/diagram: PASS mit Daten-/Achsenlogik; sonst not-applicable]`;

const policyBlock = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT_ID}
VISUAL_FORM_REVISION: ${VISUAL_FORM_REVISION}

FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.

FUTURE IMAGE STORYTELLING V3 — FREE VISUAL FORM VERBINDLICH:
- Beginne beim exakten Sprechbeat: Was soll der Zuschauer in 1–2 Sekunden verstehen?
- Wähle danach FREI die stärkste Darstellungsform. Erlaubt sind: character-story, object-story, comparison, chart, diagram, editorial-quote, illustration, metaphor und hybrid.
- Es gibt KEINEN Zwang zu Menschen, Alltagsobjekten, Story-Szenen oder Metaphern. Ein echtes Diagramm darf die beste Lösung sein. Ein einzelnes Objekt darf die beste Lösung sein. Ein starkes Zitat-/Editorialbild darf die beste Lösung sein.
- Die Freiheit betrifft die FORM, nicht die Qualität: Jede Szene muss exakt zum Sprechbeat passen, in 1–2 Sekunden lesbar sein und wie dieselbe FinanzNeo-Serie wirken.
- V9 bleibt der STYLE-LOCK: deep-black Bühne, premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache, starke Tiefe, saubere Materialien, Emerald/Gold/Red-Orange in ihren Rollen, niemals billiger Corporate-/PowerPoint-/Stock-Look.
- CHARACTER-STORY: Figur nur einsetzen, wenn Pose, Reaktion oder Handlung wirklich etwas erklärt. Keine Corporate-3D-Figur, die nur dekorativ danebensteht.
- OBJECT-STORY: Ein oder wenige bekannte Objekte dürfen allein tragen, wenn die Aussage sofort verständlich ist.
- COMPARISON: A-vs-B darf direkt, symmetrisch oder räumlich inszeniert werden, solange der Unterschied sofort lesbar ist.
- CHART/DIAGRAM: Es muss ein ECHTES Diagramm bleiben. Reale Achsen, Skalen, Werte, Kategorien, Labels und mathematisch korrekte Proportionen verwenden, soweit der Diagrammtyp sie braucht. Ein Kreisdiagramm braucht keine erfundene X-/Y-Achse; ein Linien-/Balkendiagramm schon, wenn fachlich erforderlich.
- CHART/DIAGRAM darf hochwertig 3D inszeniert werden: physische Achsen, volumetrische Balken, elegante 3D-Linien, Materialtiefe, Licht und Schatten. Aber niemals Datenlogik für Dekoration opfern.
- EDITORIAL-QUOTE: Text darf Hauptmotiv sein, wenn der Sprechbeat davon profitiert. Typografie muss Teil der FinanzNeo-Welt sein und darf nicht wie eine Standard-Social-Template-Karte aussehen.
- ILLUSTRATION: freie erklärende Illustration ist erlaubt, auch ohne Mensch und ohne reale Mini-Szene, solange Bedeutung und Finanzbezug sofort klar sind.
- METAPHOR: intuitive Metaphern und Übertreibungen sind erlaubt. Sie dürfen kein Rätsel sein.
- HYBRID: Kombinationen sind ausdrücklich erlaubt, z. B. Figur + echtes Chart, Objekt + Diagramm, Zitat + visuelle Metapher oder Vergleich + Datenvisualisierung.
- Abstrakte Fantasie-Finanzkörper wie capital body, wealth tower, value block, investment block oder fee token sind KEINE automatische Standardsprache. Nur nutzen, wenn sie bewusst als verständliche Illustration/Metapher geplant sind und den Instant-Read-Test bestehen.
- Keine Bildart bekommt eine feste Quote. Nicht künstlich pro Video zwei Menschen, zwei Charts usw. erzwingen. Der Sprechbeat entscheidet.
- Abwechslung ist erwünscht: aufeinanderfolgende Szenen sollen nicht unnötig dieselbe Kompositionsidee wiederholen.
- POWERPOINT-/EXCEL-DEFAULT ist verboten: keine dünnen Standardachsen, langweiligen Standardbalken, generischen Diagrammvorlagen oder flachen Corporate-Infografiken als finale Bildwelt.
- SUBTITLE-OFF-TEST: Ohne Untertitel muss die Hauptaussage grundsätzlich erkennbar sein; bei Editorial-Quote darf der bewusst integrierte Haupttext Teil der Aussage sein.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert zu fünf anderen Finanzthemen passen, ist es zu generisch.
- DATA_INTEGRITY_TEST: Bei chart/diagram muss dieser mit PASS beginnen und konkret bestätigen, dass Werte, Proportionen, Achsen/Labels und Aussage fachlich zusammenpassen. Bei allen anderen Formen exakt: not-applicable.
- Die frühere YouTube-Phase-A-DNA bleibt Qualitätsreferenz für Licht, Tiefe, Kamera, Figuren und hochwertige 3D-Inszenierung, aber sie begrenzt NICHT die Darstellungsform.
- Prompt und scene-index.json müssen bei VISUAL_FORM, VISUAL_CONCEPT, VOICEOVER_VISUAL_MATCH, INSTANT_READ_TEST, TRANSFERABILITY_TEST und DATA_INTEGRITY_TEST identisch sein.`;

const addPlanningBeforeImagePrompts = (source) => {
  if (source.includes('VISUAL_FORM:')) return source;
  return source.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planningBlock}\n\nIMAGE PROMPT:`);
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/')
    ? resolve(root, '03-szenen', relativePath)
    : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  source = addPlanningBeforeImagePrompts(source);
  if (!source.includes(`VISUAL_FORM_REVISION: ${VISUAL_FORM_REVISION}`)) {
    source += '\n\n' + policyBlock + '\n';
  }
  writeFileSync(path, source, 'utf8');
};

const updatePolicyFile = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`VISUAL_FORM_REVISION: ${VISUAL_FORM_REVISION}`)) {
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
console.log('✓ Visual-Form-Revision: ' + VISUAL_FORM_REVISION);
console.log('✓ Form frei: Mensch, Objekt, Vergleich, echtes Chart/Diagramm, Editorial, Illustration, Metapher oder Hybrid.');
console.log('✓ Bildwelt fest: FinanzNeo V9 + Instant-Read + fachlich korrekte Datenvisualisierung.');
