#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const V2 = 'finanzneo-image-storytelling-v2';
const V3 = 'finanzneo-image-storytelling-v3';
const STORY_MOMENT_REVISION = 'finanzneo-readable-story-moment-v1';
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

const revisedStoryMoment = c.storyMomentRevision === STORY_MOMENT_REVISION;
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

if (revisedStoryMoment) {
  if (c.metaphorFallbackOnly !== false) fail('Story-Moment-Revision verlangt metaphorFallbackOnly=false: intuitive Metaphern dürfen die literal-Darstellung schlagen.');
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
  fail('Legacy-V3 ohne Story-Moment-Revision erwartet metaphorFallbackOnly=true.');
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
  if (!source.includes('TRANSFERABILITY-TEST')) fail(relative + ' enthält den Transferability-Test nicht.');
  if (!source.includes('Förderbänder, Schienen, Schranken, Käfige')) fail(relative + ' enthält das Verbot generischer Fantasiemechaniken nicht.');
  if (!source.includes('ABSTRAKTE FINANZKÖRPER')) fail(relative + ' enthält die Sperre gegen abstrakte Finanzkörper als Standardsprache nicht.');
  if (revisedStoryMoment) {
    if (!source.includes('STORY_MOMENT_REVISION: ' + STORY_MOMENT_REVISION)) fail(relative + ' enthält den Story-Moment-Revision-Marker nicht.');
    if (!source.includes('Familiar things, clear story, creative when useful')) fail(relative + ' enthält die Familiar-Story-First-Regel nicht.');
    if (!source.includes('intuitive Metapher') && !source.includes('intuitive Metaphern')) fail(relative + ' erlaubt intuitive, sofort verständliche Metaphern nicht ausdrücklich.');
  } else if (!source.includes('Literal first, creative second')) {
    fail(relative + ' enthält für Legacy-V3 die Literal-first-Regel nicht.');
  }
}

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image') continue;
  const prefix = scene.id ?? 'Bildszene';
  const meta = scene.imageStorytelling;
  if (!meta || typeof meta !== 'object') {
    fail(prefix + ': imageStorytelling-Metadaten fehlen.');
  } else {
    if (!['literal', 'metaphor'].includes(meta.strategy)) fail(prefix + ': imageStorytelling.strategy muss literal oder metaphor sein.');
    if (!nonPlaceholder(meta.literalSituation, 18)) fail(prefix + ': reale/erkennbare Ausgangslage fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.contextAnchor, 12)) fail(prefix + ': bekannte Figur/Gegenstände bzw. Kontextanker fehlen/ist Platzhalter.');
    if (!nonPlaceholder(meta.voiceVisualMatch, 18)) fail(prefix + ': direkte Verbindung zwischen Voiceover und sichtbarem Detail fehlt/ist Platzhalter.');
    if (!nonPlaceholder(meta.transferabilityTest, 20) || !/^PASS\b/i.test(meta.transferabilityTest.trim())) {
      fail(prefix + ': transferabilityTest muss mit PASS beginnen und konkret begründen, warum das Bild themenspezifisch ist.');
    }
    if (revisedStoryMoment) {
      if (!nonPlaceholder(meta.storyMoment, 18)) fail(prefix + ': sichtbarer Story-Moment fehlt/ist Platzhalter.');
      if (!nonPlaceholder(meta.instantReadTest, 20) || !/^PASS\b/i.test(meta.instantReadTest.trim())) {
        fail(prefix + ': instantReadTest muss PASS + konkrete Begründung enthalten.');
      }
    }
    if (meta.strategy === 'metaphor') {
      if (!nonPlaceholder(meta.metaphorJustification, 20) || /^none$/i.test(meta.metaphorJustification.trim())) {
        fail(prefix + ': Metapher gewählt, aber METAPHOR_JUSTIFICATION fehlt.');
      }
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
  if (!nonPlaceholder(transferability, 20) || !/^PASS\b/i.test(transferability)) {
    fail(prefix + ': TRANSFERABILITY_TEST muss PASS + konkrete Begründung enthalten.');
  }
  if (revisedStoryMoment) {
    if (!nonPlaceholder(storyMoment, 18)) fail(prefix + ': VISUAL_STORY_MOMENT fehlt/ist Platzhalter.');
    if (!nonPlaceholder(instantReadTest, 20) || !/^PASS\b/i.test(instantReadTest)) fail(prefix + ': INSTANT_READ_TEST muss PASS + konkrete Begründung enthalten.');
  }
  if (strategy === 'metaphor') {
    if (!nonPlaceholder(metaphorJustification, 20) || /^none$/i.test(metaphorJustification)) fail(prefix + ': Metapher braucht eine konkrete METAPHOR_JUSTIFICATION.');
  } else if (metaphorJustification.toLowerCase() !== 'none') {
    fail(prefix + ': literal verlangt METAPHOR_JUSTIFICATION: none.');
  }

  if (strategy === 'literal' && abstractFinanceDefault.test(source)) {
    fail(prefix + ': abstrakte Finanzkörper wie capital body/wealth tower/value block sind als literal-Hauptidee gesperrt; bekannte Situation nutzen oder bewusst strategy=metaphor begründen.');
  }

  if (meta && typeof meta === 'object') {
    if (strategy !== meta.strategy) fail(prefix + ': Prompt und scene-index widersprechen sich bei strategy.');
    if (literalSituation !== meta.literalSituation) fail(prefix + ': Prompt und scene-index widersprechen sich bei literalSituation.');
    if (contextAnchor !== meta.contextAnchor) fail(prefix + ': Prompt und scene-index widersprechen sich bei contextAnchor.');
    if (voiceMatch !== meta.voiceVisualMatch) fail(prefix + ': Prompt und scene-index widersprechen sich bei voiceVisualMatch.');
    if (transferability !== meta.transferabilityTest) fail(prefix + ': Prompt und scene-index widersprechen sich beim transferabilityTest.');
    if (metaphorJustification !== meta.metaphorJustification) fail(prefix + ': Prompt und scene-index widersprechen sich bei metaphorJustification.');
    if (revisedStoryMoment) {
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
if (revisedStoryMoment) {
  console.log('✓ Story-Moment-Revision aktiv: bekannte Figuren/Gegenstände + klare kleine Geschichte + intuitive Metaphern erlaubt.');
  console.log('✓ INSTANT_READ_TEST und Transferability-Test bestanden.');
} else {
  console.log('✓ Legacy-V3 bleibt rückwärtskompatibel.');
}
console.log('✓ Abstrakte Finanzkörper bleiben als unmarkierter literal-Default gesperrt.');
