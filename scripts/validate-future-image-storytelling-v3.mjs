#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const V2 = 'finanzneo-image-storytelling-v2';
const V3 = 'finanzneo-image-storytelling-v3';
const LEGACY_STORY_MOMENT_REVISION = 'finanzneo-readable-story-moment-v1';
const FREE_VISUAL_FORM_REVISION = 'finanzneo-free-visual-form-v1';
const ALLOWED_VISUAL_FORMS = new Set([
  'character-story',
  'object-story',
  'comparison',
  'chart',
  'diagram',
  'editorial-quote',
  'illustration',
  'metaphor',
  'hybrid',
]);

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.imageStorytellingContract;
if (!c) {
  console.log('✓ Reel ohne Future-Image-Storytelling bleibt rückwärtskompatibel.');
  process.exit(0);
}
if (c.id === V2) {
  console.log('✓ Bestehendes Image-Storytelling-V2-Reel bleibt unverändert rückwärtskompatibel.');
  process.exit(0);
}

const freeVisualForm = c.visualFormRevision === FREE_VISUAL_FORM_REVISION;
const legacyStoryMoment = c.storyMomentRevision === LEGACY_STORY_MOMENT_REVISION;
const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const abstractFinanceDefault = /\b(?:capital body|wealth tower|value block|investment block|fee token|capital tower|wealth structure)\b/i;
const nonPlaceholder = (value, min = 8) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const readMarker = (source, marker) => {
  const line = source.split(/\r?\n/).find((item) => item.startsWith(marker + ':'));
  return line ? line.slice(marker.length + 1).trim() : '';
};

if (c.id !== V3) fail('Unbekannter imageStorytellingContract.id: ' + String(c.id));

if (freeVisualForm) {
  for (const key of [
    'appliesToNewReelsOnly',
    'visualFormFreedomRequired',
    'visualFormChosenPerBeatRequired',
    'v9StyleLockRequired',
    'exactVoiceBeatVisualMatchRequired',
    'instantReadRequired',
    'transferabilityTestRequired',
    'recognizableFinanceContextRequired',
    'humanOptional',
    'realWorldObjectsOptional',
    'intuitiveMetaphorAllowed',
    'illustrationAllowed',
    'editorialQuoteAllowed',
    'comparisonAllowed',
    'chartAllowed',
    'diagramAllowed',
    'hybridAllowed',
    'textMayBePrimaryForEditorialQuote',
    'realChartMustRemainRealChart',
    'chartAxesLabelsWhenApplicableRequired',
    'chartDataIntegrityRequired',
    'premiumChartStylingRequired',
    'powerPointExcelDefaultLookForbidden',
    'genericCorporateLookForbidden',
    'genericFantasyMechanismAsDefaultForbidden',
    'decorativeObjectPileForbidden',
    'staticCatalogCompositionForbidden',
    'abstractFinanceObjectAsDefaultForbidden',
    'animationFilmRenderingRequired',
    'phaseAQualityReferenceOnly',
  ]) {
    if (c[key] !== true) fail('imageStorytellingContract.' + key + ' muss in Free-Visual-Form-V1 true sein.');
  }
  const allowed = Array.isArray(c.allowedVisualForms) ? c.allowedVisualForms : [];
  for (const form of ALLOWED_VISUAL_FORMS) {
    if (!allowed.includes(form)) fail('allowedVisualForms fehlt: ' + form);
  }
} else {
  for (const key of [
    'appliesToNewReelsOnly',
    'literalFirstRequired',
    'directRealWorldDepictionPreferred',
    'recognizableFinanceContextRequired',
    'exactVoiceBeatVisualMatchRequired',
    'transferabilityTestRequired',
    'metaphorNeedsExplicitJustification',
    'genericFantasyMechanismAsDefaultForbidden',
    'railsConveyorsGatesCagesPortalsAsDefaultForbidden',
    'practicalEverydaySituationRequired',
    'directMeaningWithoutCaptionRequired',
    'visibleActionConflictOrConsequenceRequired',
    'genericSymbolOnlyForbidden',
    'isolatedFinanceIconAsMainStoryForbidden',
    'decorativeObjectPileForbidden',
    'staticCatalogCompositionForbidden',
    'entertainmentThroughActionContrastOrConflictRequired',
    'beforeAfterOrCauseEffectWhenHelpful',
    'humanContextWhenHelpful',
    'visualHookUnderOneSecondRequired',
    'oneImagePerSentenceWhenItImprovesClarity',
    'extraImagePreferredOverOverloadedStill',
    'labelsSupplementalOnly',
    'animationFilmRenderingRequired',
    'groundedStoryMomentRequired',
    'abstractFinanceObjectAsDefaultForbidden',
    'phaseAQualityReferenceOnly',
  ]) {
    if (c[key] !== true) fail('imageStorytellingContract.' + key + ' muss true sein.');
  }

  if (legacyStoryMoment) {
    if (c.metaphorFallbackOnly !== false) fail('Story-Moment-Revision verlangt metaphorFallbackOnly=false.');
    for (const key of [
      'intuitiveMetaphorAllowed',
      'intuitiveMetaphorMayBeatLiteralWhenClearer',
      'familiarObjectsOrCharactersRequired',
      'instantStoryReadRequired',
      'exaggeratedPhysicalStoryAllowed',
      'familiarObjectMetaphorRequired',
      'animationFilmStoryFrameRequired',
    ]) {
      if (c[key] !== true) fail('imageStorytellingContract.' + key + ' muss in der Story-Moment-Revision true sein.');
    }
  } else if (c.metaphorFallbackOnly !== true) {
    fail('Legacy-V3 ohne Revision erwartet metaphorFallbackOnly=true.');
  }
}

const globalPaths = [
  '03-szenen/alle-bildprompts.txt',
  '03-szenen/bildwelt.txt',
  '03-szenen/00-cover/cover.txt',
  '05-projektdateien/szenenplan.md',
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
];
for (const relative of globalPaths) {
  const path = resolve(root, relative);
  if (!existsSync(path)) {
    fail(relative + ' fehlt.');
    continue;
  }
  const source = readFileSync(path, 'utf8');
  if (!source.includes('IMAGE_STORYTELLING_CONTRACT: ' + V3)) fail(relative + ' enthält den V3-Marker nicht.');
  if (!source.includes('TRANSFERABILITY_TEST') && !source.includes('TRANSFERABILITY-TEST')) fail(relative + ' enthält den Transferability-Test nicht.');
  if (freeVisualForm) {
    if (!source.includes('VISUAL_FORM_REVISION: ' + FREE_VISUAL_FORM_REVISION)) fail(relative + ' enthält den Free-Visual-Form-Marker nicht.');
    if (!source.includes('FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.')) fail(relative + ' enthält die Form-frei/Bildwelt-fest-Regel nicht.');
    if (!source.includes('CHART/DIAGRAM')) fail(relative + ' enthält die echte Chart-/Diagramm-Regel nicht.');
    if (!source.includes('POWERPOINT-/EXCEL-DEFAULT')) fail(relative + ' sperrt langweilige Standardcharts nicht.');
  }
}

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  const prefix = scene.id ?? 'Bildszene';
  const meta = scene.imageStorytelling;

  if (freeVisualForm) {
    if (!meta || typeof meta !== 'object') {
      fail(prefix + ': imageStorytelling-Metadaten fehlen.');
      continue;
    }

    if (!ALLOWED_VISUAL_FORMS.has(meta.visualForm)) fail(prefix + ': visualForm ist nicht erlaubt: ' + String(meta.visualForm));
    if (!nonPlaceholder(meta.visualConcept, 18)) fail(prefix + ': visualConcept fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.voiceVisualMatch, 18)) fail(prefix + ': voiceVisualMatch fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.instantReadTest, 20) || !/^PASS\b/i.test(meta.instantReadTest.trim())) fail(prefix + ': instantReadTest muss mit PASS beginnen.');
    if (!nonPlaceholder(meta.transferabilityTest, 20) || !/^PASS\b/i.test(meta.transferabilityTest.trim())) fail(prefix + ': transferabilityTest muss mit PASS beginnen.');

    const isDataViz = meta.visualForm === 'chart' || meta.visualForm === 'diagram';
    if (isDataViz) {
      if (!nonPlaceholder(meta.dataIntegrityTest, 20) || !/^PASS\b/i.test(meta.dataIntegrityTest.trim())) {
        fail(prefix + ': chart/diagram braucht dataIntegrityTest mit PASS + konkreter Daten-/Achsenbegründung.');
      }
    } else if (String(meta.dataIntegrityTest).trim().toLowerCase() !== 'not-applicable') {
      fail(prefix + ': außerhalb chart/diagram muss dataIntegrityTest exakt not-applicable sein.');
    }

    if (typeof scene.planFile !== 'string') {
      fail(prefix + ': planFile fehlt.');
      continue;
    }
    const promptPath = resolve(root, '03-szenen', scene.planFile);
    if (!existsSync(promptPath)) {
      fail(prefix + ': Bildprompt fehlt: ' + scene.planFile);
      continue;
    }
    const source = readFileSync(promptPath, 'utf8');
    if (!source.includes('IMAGE_STORYTELLING_CONTRACT: ' + V3)) fail(prefix + ': Bildprompt enthält den V3-Marker nicht.');

    const visualForm = readMarker(source, 'VISUAL_FORM');
    const visualConcept = readMarker(source, 'VISUAL_CONCEPT');
    const voiceMatch = readMarker(source, 'VOICEOVER_VISUAL_MATCH');
    const instantReadTest = readMarker(source, 'INSTANT_READ_TEST');
    const transferability = readMarker(source, 'TRANSFERABILITY_TEST');
    const dataIntegrityTest = readMarker(source, 'DATA_INTEGRITY_TEST');

    if (!ALLOWED_VISUAL_FORMS.has(visualForm)) fail(prefix + ': VISUAL_FORM ist nicht erlaubt.');
    if (!nonPlaceholder(visualConcept, 18)) fail(prefix + ': VISUAL_CONCEPT fehlt/ist Platzhalter.');
    if (!nonPlaceholder(voiceMatch, 18)) fail(prefix + ': VOICEOVER_VISUAL_MATCH fehlt/ist Platzhalter.');
    if (!nonPlaceholder(instantReadTest, 20) || !/^PASS\b/i.test(instantReadTest)) fail(prefix + ': INSTANT_READ_TEST muss PASS + Begründung enthalten.');
    if (!nonPlaceholder(transferability, 20) || !/^PASS\b/i.test(transferability)) fail(prefix + ': TRANSFERABILITY_TEST muss PASS + Begründung enthalten.');

    const sourceIsDataViz = visualForm === 'chart' || visualForm === 'diagram';
    if (sourceIsDataViz) {
      if (!nonPlaceholder(dataIntegrityTest, 20) || !/^PASS\b/i.test(dataIntegrityTest)) fail(prefix + ': chart/diagram braucht DATA_INTEGRITY_TEST: PASS ...');
    } else if (dataIntegrityTest.toLowerCase() !== 'not-applicable') {
      fail(prefix + ': außerhalb chart/diagram muss DATA_INTEGRITY_TEST: not-applicable sein.');
    }

    if (!['metaphor', 'illustration', 'hybrid'].includes(visualForm) && abstractFinanceDefault.test(source)) {
      fail(prefix + ': erfundene abstrakte Finanzkörper sind für diese VISUAL_FORM nicht erlaubt; bewusst metaphor/illustration/hybrid wählen oder verständlicher planen.');
    }

    if (visualForm !== meta.visualForm) fail(prefix + ': Prompt und scene-index widersprechen sich bei visualForm.');
    if (visualConcept !== meta.visualConcept) fail(prefix + ': Prompt und scene-index widersprechen sich bei visualConcept.');
    if (voiceMatch !== meta.voiceVisualMatch) fail(prefix + ': Prompt und scene-index widersprechen sich bei voiceVisualMatch.');
    if (instantReadTest !== meta.instantReadTest) fail(prefix + ': Prompt und scene-index widersprechen sich bei instantReadTest.');
    if (transferability !== meta.transferabilityTest) fail(prefix + ': Prompt und scene-index widersprechen sich bei transferabilityTest.');
    if (dataIntegrityTest !== meta.dataIntegrityTest) fail(prefix + ': Prompt und scene-index widersprechen sich bei dataIntegrityTest.');
    continue;
  }

  // Rückwärtskompatibilität für bisherige V3-Varianten.
  if (!meta || typeof meta !== 'object') {
    fail(prefix + ': imageStorytelling-Metadaten fehlen.');
  } else {
    if (!['literal', 'metaphor'].includes(meta.strategy)) fail(prefix + ': imageStorytelling.strategy muss literal oder metaphor sein.');
    if (!nonPlaceholder(meta.literalSituation, 18)) fail(prefix + ': reale/erkennbare Ausgangslage fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.contextAnchor, 12)) fail(prefix + ': Kontextanker fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.voiceVisualMatch, 18)) fail(prefix + ': direkte Verbindung zwischen Voiceover und sichtbarem Detail fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.transferabilityTest, 20) || !/^PASS\b/i.test(meta.transferabilityTest.trim())) fail(prefix + ': transferabilityTest muss mit PASS beginnen.');
    if (legacyStoryMoment) {
      if (!nonPlaceholder(meta.storyMoment, 18)) fail(prefix + ': sichtbarer Story-Moment fehlt/ist Platzhalter.');
      if (!nonPlaceholder(meta.instantReadTest, 20) || !/^PASS\b/i.test(meta.instantReadTest.trim())) fail(prefix + ': instantReadTest muss PASS + Begründung enthalten.');
    }
    if (meta.strategy === 'metaphor') {
      if (!nonPlaceholder(meta.metaphorJustification, 20) || /^none$/i.test(meta.metaphorJustification.trim())) fail(prefix + ': Metapher gewählt, aber METAPHOR_JUSTIFICATION fehlt.');
    } else if (String(meta.metaphorJustification).trim().toLowerCase() !== 'none') {
      fail(prefix + ': bei literal muss metaphorJustification exakt none sein.');
    }
  }

  if (typeof scene.planFile !== 'string') {
    fail(prefix + ': planFile fehlt.');
    continue;
  }
  const promptPath = resolve(root, '03-szenen', scene.planFile);
  if (!existsSync(promptPath)) {
    fail(prefix + ': Bildprompt fehlt: ' + scene.planFile);
    continue;
  }
  const source = readFileSync(promptPath, 'utf8');
  if (!source.includes('IMAGE_STORYTELLING_CONTRACT: ' + V3)) fail(prefix + ': Bildprompt enthält den V3-Marker nicht.');

  const strategy = readMarker(source, 'VISUAL_STRATEGY');
  const literalSituation = readMarker(source, 'LITERAL_REAL_WORLD_SITUATION');
  const contextAnchor = readMarker(source, 'REAL_WORLD_CONTEXT_ANCHOR');
  const storyMoment = readMarker(source, 'VISUAL_STORY_MOMENT');
  const voiceMatch = readMarker(source, 'VOICEOVER_VISUAL_MATCH');
  const instantReadTest = readMarker(source, 'INSTANT_READ_TEST');
  const transferability = readMarker(source, 'TRANSFERABILITY_TEST');
  const metaphorJustification = readMarker(source, 'METAPHOR_JUSTIFICATION');

  if (!['literal', 'metaphor'].includes(strategy)) fail(prefix + ': VISUAL_STRATEGY muss literal oder metaphor sein.');
  if (!nonPlaceholder(literalSituation, 18)) fail(prefix + ': LITERAL_REAL_WORLD_SITUATION fehlt/ist Platzhalter.');
  if (!nonPlaceholder(contextAnchor, 12)) fail(prefix + ': REAL_WORLD_CONTEXT_ANCHOR fehlt/ist Platzhalter.');
  if (!nonPlaceholder(voiceMatch, 18)) fail(prefix + ': VOICEOVER_VISUAL_MATCH fehlt/ist Platzhalter.');
  if (!nonPlaceholder(transferability, 20) || !/^PASS\b/i.test(transferability)) fail(prefix + ': TRANSFERABILITY_TEST muss PASS + Begründung enthalten.');
  if (legacyStoryMoment) {
    if (!nonPlaceholder(storyMoment, 18)) fail(prefix + ': VISUAL_STORY_MOMENT fehlt/ist Platzhalter.');
    if (!nonPlaceholder(instantReadTest, 20) || !/^PASS\b/i.test(instantReadTest)) fail(prefix + ': INSTANT_READ_TEST muss PASS + Begründung enthalten.');
  }
  if (strategy === 'metaphor') {
    if (!nonPlaceholder(metaphorJustification, 20) || /^none$/i.test(metaphorJustification)) fail(prefix + ': Metapher braucht eine konkrete METAPHOR_JUSTIFICATION.');
  } else if (metaphorJustification.toLowerCase() !== 'none') {
    fail(prefix + ': literal verlangt METAPHOR_JUSTIFICATION: none.');
  }
  if (strategy === 'literal' && abstractFinanceDefault.test(source)) fail(prefix + ': abstrakte Finanzkörper sind als literal-Hauptidee gesperrt.');

  if (meta && typeof meta === 'object') {
    if (strategy !== meta.strategy) fail(prefix + ': Prompt und scene-index widersprechen sich bei strategy.');
    if (literalSituation !== meta.literalSituation) fail(prefix + ': Prompt und scene-index widersprechen sich bei literalSituation.');
    if (contextAnchor !== meta.contextAnchor) fail(prefix + ': Prompt und scene-index widersprechen sich bei contextAnchor.');
    if (voiceMatch !== meta.voiceVisualMatch) fail(prefix + ': Prompt und scene-index widersprechen sich bei voiceVisualMatch.');
    if (transferability !== meta.transferabilityTest) fail(prefix + ': Prompt und scene-index widersprechen sich beim transferabilityTest.');
    if (metaphorJustification !== meta.metaphorJustification) fail(prefix + ': Prompt und scene-index widersprechen sich bei metaphorJustification.');
    if (legacyStoryMoment) {
      if (storyMoment !== meta.storyMoment) fail(prefix + ': Prompt und scene-index widersprechen sich beim storyMoment.');
      if (instantReadTest !== meta.instantReadTest) fail(prefix + ': Prompt und scene-index widersprechen sich beim instantReadTest.');
    }
  }
}

if (errors.length) {
  console.error('\nFuture-Image-Storytelling-V3 verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('\n✓ Future-Image-Storytelling erfüllt: ' + V3);
if (freeVisualForm) {
  console.log('✓ Free Visual Form V1 aktiv: Darstellungsform frei, FinanzNeo-V9-Bildwelt fest.');
  console.log('✓ Mensch, Objekt, Vergleich, echtes Chart/Diagramm, Editorial, Illustration, Metapher und Hybrid sind erlaubt.');
  console.log('✓ Charts/Diagramme bestehen zusätzlich DATA_INTEGRITY_TEST.');
} else if (legacyStoryMoment) {
  console.log('✓ Story-Moment-Revision bleibt rückwärtskompatibel.');
} else {
  console.log('✓ Legacy-V3 bleibt rückwärtskompatibel.');
}
