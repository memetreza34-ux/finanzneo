#!/usr/bin/env node

import {existsSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK} from './lib/reel-scene-schema.mjs';
import {
  PREMIUM_ANIMATION_LOCK,
  validatePremiumAnimationSceneMetadata,
} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-animation-source-quality.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const animations = scenes.filter((scene) => scene?.type === 'animation');
const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|METAPHOR|DESCRIBE|PLACE EACH|ONE LARGE|library-best-fit|custom-build|library-slug|none|SEMANTISCHE|WAS DAS AUGE|HAUPTBEWEGUNG|KLARER|HAUPTMOTIV|NUR NÖTIGE)[^\]]*)\]|TODO|TBD|PLACEHOLDER|PHASE 1 ANIMATION CODE NOT COMPLETED/i;
const hackWords = /\b(dummy|debug|placeholder|temporary|technik-hack|wackel|wiggle|test rectangle|fake motion)\b/i;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (index.phase1AnimationCode?.required !== true) fail('phase1AnimationCode.required muss true sein.');
if (index.phase1AnimationCode?.qualityLock !== ANIMATION_QUALITY_LOCK) fail(`phase1AnimationCode.qualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
if (index.phase1AnimationCode?.phase3MayNotReplaceCanonicalAnimation !== true) fail('Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');
if (index.phase1AnimationCode?.financeMotionLibraryAvailable !== true) fail('Finance Motion Library muss im Animationsvertrag verfügbar sein.');
if (index.phase1AnimationCode?.libraryBestFitBeforeCustom !== true) fail('Library-Best-Fit muss vor Custom-Build geprüft werden.');
if (index.phase1AnimationCode?.customAnimationAllowed !== true) fail('Individuelle Custom-Animationen müssen erlaubt bleiben.');
if (index.phase1AnimationCode?.libraryReuseMayRepeatAcrossScenes !== true) fail('Passende Library-Mechaniken müssen wiederverwendbar sein.');
if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== false) fail('PremiumPhysicalStage darf nicht mehr verpflichtend sein.');
if (index.phase1AnimationCode?.requirePhysicalObjects !== false) fail('Physical-Primitives dürfen nicht mehr verpflichtend sein.');
if (index.phase1AnimationCode?.supportingObjectCountFlexible !== true) fail('Animationskomposition braucht supportingObjectCountFlexible=true.');
if (index.phase1AnimationCode?.clarityBeforeObjectCount !== true) fail('Animationskomposition braucht clarityBeforeObjectCount=true.');
if (index.phase1AnimationCode?.sameVisualLanguageAsFlowImages !== true) fail('Animationen müssen dieselbe visuelle Sprache wie Flow-Bilder respektieren.');
if (index.phase1AnimationCode?.pureBlackCanvasRequired !== true) fail('Animationen müssen den zentralen pure-black Reel-Canvas verwenden.');
if (index.phase1AnimationCode?.transparentAnimationStageRequired !== true) fail('Animations-Stage muss transparent bleiben.');
if (index.phase1AnimationCode?.decorativeBackgroundEffectsForbidden !== true) fail('Dekorative Animations-Hintergrundeffekte müssen verboten sein.');

const libraryPath = resolve(process.cwd(), 'src/finance-motion/index.tsx');
const librarySource = existsSync(libraryPath) ? readFileSync(libraryPath, 'utf8') : '';
if (!librarySource.includes('FINANCE_MOTION_REGISTRY')) fail('src/finance-motion/index.tsx bzw. FINANCE_MOTION_REGISTRY fehlt.');

for (const scene of animations) {
  const id = scene.id ?? 'unbekannte Animation';
  errors.push(...validatePremiumAnimationSceneMetadata(scene));
  if (scene.animationQualityLock !== ANIMATION_QUALITY_LOCK) fail(`${id}: animationQualityLock fehlt/falsch.`);
  if (typeof scene.animationSourceFile !== 'string' || !scene.animationSourceFile.trim()) {
    fail(`${id}: animationSourceFile fehlt.`);
    continue;
  }
  if (typeof scene.animationExport !== 'string' || !scene.animationExport.trim()) fail(`${id}: animationExport fehlt.`);
  if (typeof scene.animationIntent !== 'string' || scene.animationIntent.trim().length < 18 || placeholder.test(scene.animationIntent)) {
    fail(`${id}: animationIntent ist leer, zu vage oder Platzhalter.`);
  }

  const sourcePath = resolve(root, '03-szenen', scene.animationSourceFile.replace(/^03-szenen\//, ''));
  if (!existsSync(sourcePath)) {
    fail(`${id}: kanonische Phase-1-Animationsdatei fehlt: ${scene.animationSourceFile}`);
    continue;
  }
  if (!statSync(sourcePath).isFile()) {
    fail(`${id}: animation.tsx ist keine Datei.`);
    continue;
  }

  const source = readFileSync(sourcePath, 'utf8');
  if (placeholder.test(source)) fail(`${id}: animation.tsx enthält Platzhalter/TODO.`);
  if (hackWords.test(source)) fail(`${id}: animation.tsx enthält Platzhalter-/Hack-Sprache.`);
  if (/Math\.(?:sin|cos)\s*\(/.test(source)) fail(`${id}: Math.sin/Math.cos als Dauer-Wackelbewegung ist im Produktionscode gesperrt.`);
  if (/\b(?:color|background(?:Color)?)\s*:\s*['"](?:black|#000(?:000)?)['"]/i.test(source)) fail(`${id}: Szene darf keinen eigenen schwarzen Hintergrund definieren; der zentrale Canvas ist bereits #000000.`);
  if (!source.includes(scene.animationExport)) fail(`${id}: Export ${scene.animationExport} ist im kanonischen Code nicht auffindbar.`);

  const motionSource = source.match(/MOTION_SOURCE:\s*(library-best-fit|custom-build)/i)?.[1]?.toLowerCase();
  const financeMotionId = source.match(/FINANCE_MOTION_ID:\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
  if (!motionSource) fail(`${id}: MOTION_SOURCE muss library-best-fit oder custom-build angeben.`);
  if (!financeMotionId) fail(`${id}: FINANCE_MOTION_ID fehlt.`);

  if (motionSource === 'library-best-fit') {
    if (!financeMotionId || financeMotionId === 'none' || !slug.test(financeMotionId)) {
      fail(`${id}: library-best-fit braucht eine gültige FINANCE_MOTION_ID.`);
    } else if (!librarySource.includes(`id:'${financeMotionId}'`) && !librarySource.includes(`id: '${financeMotionId}'`)) {
      fail(`${id}: FINANCE_MOTION_ID "${financeMotionId}" ist nicht in FINANCE_MOTION_REGISTRY registriert.`);
    }
    if (!/finance-motion/.test(source)) fail(`${id}: library-best-fit muss aus src/finance-motion importieren.`);
    if (statSync(sourcePath).size < 900) fail(`${id}: Library-Wrapper ist zu klein; Narrative, Parameter und Motion-Regie müssen vollständig dokumentiert sein.`);
  }

  if (motionSource === 'custom-build') {
    if (financeMotionId !== 'none') fail(`${id}: custom-build muss FINANCE_MOTION_ID: none setzen.`);
    if (statSync(sourcePath).size < 2200) fail(`${id}: Custom-animation.tsx ist zu klein/leer; individuelle Animation braucht eine ausgearbeitete visuelle Geschichte.`);
    if (!/useCurrentFrame/.test(source)) fail(`${id}: Custom-Animation muss useCurrentFrame nutzen und framegenau sein.`);
    if (!/ANIMATION_COLORS/.test(source)) fail(`${id}: Custom-Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
    if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: Custom-Animation hat keinen nachvollziehbaren zeitlichen Animationsfortschritt.`);
  }

  // Nur tatsächliche JSX-Komponentennutzung blockieren. Qualitätskommentare wie
  // "kein Dashboard" oder "kein Flowchart" sind erlaubt.
  if (/<(?:Flowchart|Dashboard|ControlPanel|WindowMock|IconTile)\b/.test(source)) {
    fail(`${id}: Dashboard-/Flowchart-/UI-Komponenten sind als Hauptsprache gesperrt.`);
  }
  if (/<(?:FNBgAurora|FNBgParticles|FNBgGrid|FNBgRadial|ParticleField|Particles)\b/.test(source)) {
    fail(`${id}: Partikel/Aurora/Grid/Radial-Hintergrundkomponenten sind in Reel-Animationen verboten.`);
  }
  if (/background\s*:\s*['"`]radial-gradient|backgroundImage\s*:/i.test(source)) {
    fail(`${id}: eigener dekorativer Gradient/Grid-Hintergrund ist verboten; Animations-Stage bleibt transparent.`);
  }

  const requiredDirection = [
    ['MECHANIC_ID', /MECHANIC_ID:\s*([^\n]+)/i, 4],
    ['FOCAL_PATH', /FOCAL_PATH:\s*([^\n]+)/i, 18],
    ['PRIMARY_ACTION', /PRIMARY_ACTION:\s*([^\n]+)/i, 18],
    ['CAMERA_ROLE', /CAMERA_ROLE:\s*([^\n]+)/i, 10],
    ['PAYOFF', /PAYOFF:\s*([^\n]+)/i, 16],
  ];
  for (const [label, regex, min] of requiredDirection) {
    const value = source.match(regex)?.[1]?.trim();
    if (!value || value.length < min || placeholder.test(value)) fail(`${id}: ${label} fehlt/ist zu vage.`);
  }

  const narrative = source.match(/ANIMATION_NARRATIVE[\s\S]{0,2400}?START:\s*([^\n]+)[\s\S]*?MECHANISM:\s*([^\n]+)[\s\S]*?RESULT:\s*([^\n]+)/i);
  if (!narrative) {
    fail(`${id}: Code braucht ANIMATION_NARRATIVE mit START, MECHANISM und RESULT.`);
  } else {
    for (const [label, text] of [['START', narrative[1]], ['MECHANISM', narrative[2]], ['RESULT', narrative[3]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: ${label}-Beschreibung ist zu vage/Platzhalter.`);
    }
  }

  const premiumNarrative = source.match(/PREMIUM_VISUAL_NARRATIVE[\s\S]{0,2400}?HERO:\s*([^\n]+)[\s\S]*?SUPPORT:\s*([^\n]+)[\s\S]*?MATERIAL:\s*([^\n]+)[\s\S]*?DEPTH:\s*([^\n]+)/i);
  if (!premiumNarrative) {
    fail(`${id}: Code braucht PREMIUM_VISUAL_NARRATIVE mit HERO, SUPPORT, MATERIAL und DEPTH.`);
  } else {
    for (const [label, text] of [['HERO', premiumNarrative[1]], ['SUPPORT', premiumNarrative[2]], ['MATERIAL', premiumNarrative[3]], ['DEPTH', premiumNarrative[4]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: Premium-${label} ist zu vage/Platzhalter.`);
    }
  }

  const hold = source.match(/RESULT_HOLD_FRAMES\s*=\s*(\d+)/);
  if (!hold || Number(hold[1]) < 15) fail(`${id}: RESULT_HOLD_FRAMES muss mindestens 15 Frames betragen.`);
}

if (errors.length) {
  console.error('\nPhase-1-Animationscode verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ ${animations.length} kanonische Phase-1-Animation(en) erfüllen den Hybrid-Animationsvertrag.`);
console.log('✓ Library-Best-Fit darf wiederverwendet und parametrisiert werden; Custom-Build bleibt erlaubt.');
console.log('✓ Qualität wird über Focal Path, Hauptaktion, Kamera-Rolle, Payoff und Start -> Mechanismus -> Ergebnis geprüft.');
console.log('✓ Physical-Primitives und künstlich viele Motion-Channels sind keine Pflicht mehr.');
