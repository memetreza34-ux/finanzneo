#!/usr/bin/env node

import {existsSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK} from './lib/reel-scene-schema.mjs';
import {
  PREMIUM_ANIMATION_LOCK,
  validatePremiumAnimationSceneMetadata,
} from './lib/premium-animation-contract.mjs';
import {
  EDITORIAL_MOTION_LOCK,
  EDITORIAL_MOTION_LIBRARY_ID,
  validateEditorialMotionSceneMetadata,
} from './lib/editorial-motion-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-animation-source-quality.mjs <Reel-Pfad>');
  process.exit(1);
}

const HYBRID_CONTRACT_ID = 'finanzneo-phase1-hybrid-motion-v2';
const LEGACY_LIBRARY_ID = 'finanzneo-finance-motion-library-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const animations = scenes.filter((scene) => scene?.type === 'animation');
const hybridV2 = index.phase1MotionDirectionContract?.id === HYBRID_CONTRACT_ID;
const editorialV1 = index.phase1AnimationCode?.visualMotionLock === EDITORIAL_MOTION_LOCK;
const activeLibraryId = editorialV1 ? EDITORIAL_MOTION_LIBRARY_ID : LEGACY_LIBRARY_ID;
const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|METAPHOR|DESCRIBE|PLACE EACH|ONE LARGE|library-best-fit|custom-build|library-slug|none|SEMANTISCHE|WAS DAS AUGE|HAUPTBEWEGUNG|KLARER|HAUPTMOTIV|NUR NÖTIGE)[^\]]*)\]|TODO|TBD|PLACEHOLDER|PHASE 1 ANIMATION CODE NOT COMPLETED/i;
const hackWords = /\b(dummy|debug|placeholder|temporary|technik-hack|wackel|wiggle|test rectangle|fake motion)\b/i;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const realWorldPrimitive = /<Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack)\b/g;
const legacyMechanicIds = new Map();

if (index.phase1AnimationCode?.required !== true) fail('phase1AnimationCode.required muss true sein.');
if (index.phase1AnimationCode?.qualityLock !== ANIMATION_QUALITY_LOCK) fail(`phase1AnimationCode.qualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
if (index.phase1AnimationCode?.phase3MayNotReplaceCanonicalAnimation !== true) fail('Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');
if (index.phase1AnimationCode?.supportingObjectCountFlexible !== true) fail('Animationskomposition braucht supportingObjectCountFlexible=true.');
if (index.phase1AnimationCode?.clarityBeforeObjectCount !== true) fail('Animationskomposition braucht clarityBeforeObjectCount=true.');

if (editorialV1) {
  if (index.phase1AnimationCode?.visualTargetWorld !== 'finanzneo-editorial-finance-v1') fail('Editorial Motion muss auf finanzneo-editorial-finance-v1 zielen.');
  if (index.phase1AnimationCode?.financeMotionLibraryId !== EDITORIAL_MOTION_LIBRARY_ID) fail(`Editorial Motion Library muss ${EDITORIAL_MOTION_LIBRARY_ID} sein.`);
  if (index.phase1AnimationCode?.editorialTwoDPreferred !== true) fail('Editorial Motion muss 2D/2.5D bevorzugen.');
  if (index.phase1AnimationCode?.fixed3DStyleForbidden !== true) fail('Fester 3D-Stil muss für Editorial Motion verboten sein.');
  if (index.phase1AnimationCode?.flexibleAnimationSurface !== true) fail('Editorial Motion braucht flexible Animationsflächen.');
  if (index.phase1AnimationCode?.pureBlackAnimationSurfaceRequired !== false) fail('Editorial Motion darf keinen schwarzen Animationsflächen-Zwang haben.');
  if (index.phase1AnimationCode?.minimumMotionNeededPreferred !== true) fail('Editorial Motion muss minimale klare Bewegung bevorzugen.');
  if (index.phase1AnimationCode?.multipleMotionChannelsRequired !== false) fail('Mehrere Motion-Channels dürfen nicht Pflicht sein.');
  if (index.phase1AnimationCode?.cameraMovementRequired !== false) fail('Kamerabewegung darf nicht Pflicht sein.');
  if (index.phase1AnimationCode?.decorativeBackgroundEffectsForbidden !== true) fail('Dekorative Animations-Hintergrundeffekte müssen verboten sein.');
} else {
  if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
  if (index.phase1AnimationCode?.sameVisualLanguageAsFlowImages !== true) fail('Legacy-Animationen müssen ihre bisherige visuelle Sprache respektieren.');
  if (index.phase1AnimationCode?.pureBlackCanvasRequired !== true) fail('Legacy-Animationen müssen den zentralen pure-black Reel-Canvas verwenden.');
  if (index.phase1AnimationCode?.transparentAnimationStageRequired !== true) fail('Legacy-Animations-Stage muss transparent bleiben.');
  if (index.phase1AnimationCode?.decorativeBackgroundEffectsForbidden !== true) fail('Dekorative Animations-Hintergrundeffekte müssen verboten sein.');
}

let librarySource = '';
if (hybridV2) {
  if (index.phase1AnimationCode?.financeMotionLibraryId !== activeLibraryId) fail(`phase1AnimationCode.financeMotionLibraryId muss ${activeLibraryId} sein.`);
  if (index.phase1AnimationCode?.financeMotionLibraryAvailable !== true) fail('Finance Motion Library muss im Hybrid-Vertrag verfügbar sein.');
  if (index.phase1AnimationCode?.libraryBestFitBeforeCustom !== true) fail('Library-Best-Fit muss vor Custom-Build geprüft werden.');
  if (index.phase1AnimationCode?.customAnimationAllowed !== true) fail('Individuelle Custom-Animationen müssen erlaubt bleiben.');
  if (index.phase1AnimationCode?.libraryReuseMayRepeatAcrossScenes !== true) fail('Passende Library-Mechaniken müssen wiederverwendbar sein.');
  if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== false) fail('PremiumPhysicalStage darf im Hybrid-Vertrag nicht verpflichtend sein.');
  if (index.phase1AnimationCode?.requirePhysicalObjects !== false) fail('Physical-Primitives dürfen im Hybrid-Vertrag nicht verpflichtend sein.');

  if (editorialV1) {
    const v2Path = resolve(process.cwd(), 'src/finance-motion/editorial-v2.tsx');
    const v1Path = resolve(process.cwd(), 'src/finance-motion/editorial-v1.tsx');
    const v2Source = existsSync(v2Path) ? readFileSync(v2Path, 'utf8') : '';
    const v1Source = existsSync(v1Path) ? readFileSync(v1Path, 'utf8') : '';
    librarySource = v2Source + '\n' + v1Source;
    if (!v2Source.includes('EDITORIAL_MOTION_V2_REGISTRY')) fail('src/finance-motion/editorial-v2.tsx bzw. EDITORIAL_MOTION_V2_REGISTRY fehlt.');
    if (!v1Source.includes('EDITORIAL_FINANCE_MOTION_REGISTRY')) fail('Legacy Editorial Motion V1 registry fehlt.');
  } else {
    const libraryPath = resolve(process.cwd(), 'src/finance-motion/index.tsx');
    librarySource = existsSync(libraryPath) ? readFileSync(libraryPath, 'utf8') : '';
    if (!librarySource.includes('FINANCE_MOTION_REGISTRY')) fail(`${libraryPath} bzw. FINANCE_MOTION_REGISTRY fehlt.`);
  }
}

const validateSharedNarratives = (id, source, editorial = false) => {
  const narrative = source.match(/ANIMATION_NARRATIVE[\s\S]{0,2400}?START:\s*([^\n]+)[\s\S]*?MECHANISM:\s*([^\n]+)[\s\S]*?RESULT:\s*([^\n]+)/i);
  if (!narrative) {
    fail(`${id}: Code braucht ANIMATION_NARRATIVE mit START, MECHANISM und RESULT.`);
  } else {
    for (const [label, text] of [['START', narrative[1]], ['MECHANISM', narrative[2]], ['RESULT', narrative[3]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: ${label}-Beschreibung ist zu vage/Platzhalter.`);
    }
  }

  if (editorial) {
    const editorialNarrative = source.match(/EDITORIAL_VISUAL_NARRATIVE[\s\S]{0,2400}?HERO:\s*([^\n]+)[\s\S]*?SUPPORT:\s*([^\n]+)[\s\S]*?SURFACE:\s*([^\n]+)[\s\S]*?SHAPE_LANGUAGE:\s*([^\n]+)/i);
    if (!editorialNarrative) {
      fail(`${id}: Code braucht EDITORIAL_VISUAL_NARRATIVE mit HERO, SUPPORT, SURFACE und SHAPE_LANGUAGE.`);
    } else {
      for (const [label, text] of [['HERO', editorialNarrative[1]], ['SUPPORT', editorialNarrative[2]], ['SURFACE', editorialNarrative[3]], ['SHAPE_LANGUAGE', editorialNarrative[4]]]) {
        if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: Editorial-${label} ist zu vage/Platzhalter.`);
      }
    }
  } else {
    const premiumNarrative = source.match(/PREMIUM_VISUAL_NARRATIVE[\s\S]{0,2400}?HERO:\s*([^\n]+)[\s\S]*?SUPPORT:\s*([^\n]+)[\s\S]*?MATERIAL:\s*([^\n]+)[\s\S]*?DEPTH:\s*([^\n]+)/i);
    if (!premiumNarrative) {
      fail(`${id}: Code braucht PREMIUM_VISUAL_NARRATIVE mit HERO, SUPPORT, MATERIAL und DEPTH.`);
    } else {
      for (const [label, text] of [['HERO', premiumNarrative[1]], ['SUPPORT', premiumNarrative[2]], ['MATERIAL', premiumNarrative[3]], ['DEPTH', premiumNarrative[4]]]) {
        if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: Premium-${label} ist zu vage/Platzhalter.`);
      }
    }
  }

  const hold = source.match(/RESULT_HOLD_FRAMES\s*=\s*(\d+)/);
  if (!hold || Number(hold[1]) < 15) fail(`${id}: RESULT_HOLD_FRAMES muss mindestens 15 Frames betragen.`);
};

for (const scene of animations) {
  const id = scene.id ?? 'unbekannte Animation';
  if (editorialV1) errors.push(...validateEditorialMotionSceneMetadata(scene));
  else errors.push(...validatePremiumAnimationSceneMetadata(scene));
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
  if (!editorialV1 && /\b(?:color|background(?:Color)?)\s*:\s*['"](?:black|#000(?:000)?)['"]/i.test(source)) fail(`${id}: Legacy-Szene darf keinen eigenen schwarzen Hintergrund definieren; der zentrale Canvas ist bereits #000000.`);
  if (editorialV1 && /PremiumPhysicalStage|<Physical(?:Object|Tag|Rail|Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack)\b/.test(source)) {
    fail(`${id}: neue Editorial-Motion darf nicht auf die alten PremiumPhysical-/Physical-Primitives zurückfallen.`);
  }
  if (!source.includes(scene.animationExport)) fail(`${id}: Export ${scene.animationExport} ist im kanonischen Code nicht auffindbar.`);

  if (/<(?:Flowchart|Dashboard|ControlPanel|WindowMock|IconTile)\b/.test(source)) {
    fail(`${id}: Dashboard-/Flowchart-/UI-Komponenten sind als Hauptsprache gesperrt.`);
  }
  if (/<(?:FNBgAurora|FNBgParticles|FNBgGrid|FNBgRadial|ParticleField|Particles)\b/.test(source)) {
    fail(`${id}: Partikel/Aurora/Grid/Radial-Hintergrundkomponenten sind in Reel-Animationen verboten.`);
  }
  if (/background\s*:\s*['"`]radial-gradient|backgroundImage\s*:/i.test(source)) {
    fail(`${id}: eigener dekorativer Gradient/Grid-Hintergrund ist verboten; Animations-Stage bleibt transparent.`);
  }

  if (!hybridV2) {
    // Legacy-Reels behalten exakt ihre bisherige visuelle Qualitätslogik. So
    // werden bestehende Seals nicht rückwirkend auf neue Library-Marker migriert.
    if (statSync(sourcePath).size < 2200) fail(`${id}: animation.tsx ist zu klein/leer; Legacy-Vertrag erwartet eine ausgearbeitete visuelle Geschichte.`);
    if (!/useCurrentFrame/.test(source)) fail(`${id}: Animation muss useCurrentFrame nutzen und sichtbar zeitgesteuert sein.`);
    if (!/ANIMATION_COLORS/.test(source)) fail(`${id}: Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
    if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: kein nachvollziehbarer zeitlicher Animationsfortschritt gefunden.`);
    if (!/PremiumPhysicalStage/.test(source)) fail(`${id}: Legacy-Animation muss PremiumPhysicalStage verwenden.`);

    const genericObjects = [...source.matchAll(/<PhysicalObject\b/g)].length;
    const concreteObjects = [...source.matchAll(realWorldPrimitive)].length;
    if (genericObjects + concreteObjects < 1) fail(`${id}: Legacy-Animation braucht mindestens ein physisches Hauptmotiv.`);
    if (concreteObjects < 2) fail(`${id}: Legacy-Animation braucht mindestens zwei konkrete Realwelt-Objekte/-Instanzen.`);
    if (genericObjects >= 3 && concreteObjects < 3) fail(`${id}: generische PhysicalObject-Karten dominieren die Legacy-Szene.`);
    if (/<PhysicalRail\b/.test(source) && concreteObjects < 3) fail(`${id}: PhysicalRail darf im Legacy-Vertrag nicht die primäre Animation ersetzen.`);
    if (!/(?:material=['"](?:neutral|money|warning|positive)['"]|Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack))/.test(source)) {
      fail(`${id}: Legacy-Animation braucht semantische Materialrollen oder konkrete Realwelt-Primitives.`);
    }

    const mechanicId = source.match(/MECHANIC_ID:\s*([a-z0-9-]+)/i)?.[1];
    if (!mechanicId) {
      fail(`${id}: MECHANIC_ID fehlt.`);
    } else if (legacyMechanicIds.has(mechanicId)) {
      fail(`${id}: MECHANIC_ID "${mechanicId}" dupliziert ${legacyMechanicIds.get(mechanicId)}.`);
    } else {
      legacyMechanicIds.set(mechanicId, id);
    }
    if (!/PRIMARY_ACTION:\s*[^\n]{18,}/i.test(source)) fail(`${id}: PRIMARY_ACTION fehlt/ist zu kurz.`);

    const motionChannels = [...source.matchAll(/const\s+[A-Za-z0-9_]+\s*=\s*(?:interpolate|spring)\s*\(/g)].length;
    if (motionChannels < 3) fail(`${id}: Legacy-Vertrag erwartet mehrere koordinierte Motion-Channels.`);
    validateSharedNarratives(id, source, editorialV1);
    continue;
  }

  const motionSource = source.match(/MOTION_SOURCE:\s*(library-best-fit|custom-build)/i)?.[1]?.toLowerCase();
  const financeMotionId = source.match(/FINANCE_MOTION_ID:\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
  if (!motionSource) fail(`${id}: MOTION_SOURCE muss library-best-fit oder custom-build angeben.`);
  if (!financeMotionId) fail(`${id}: FINANCE_MOTION_ID fehlt.`);

  if (motionSource === 'library-best-fit') {
    if (!financeMotionId || financeMotionId === 'none' || !slug.test(financeMotionId)) {
      fail(`${id}: library-best-fit braucht eine gültige FINANCE_MOTION_ID.`);
    } else if (!librarySource.includes(`id: '${financeMotionId}'`) && !librarySource.includes(`id:'${financeMotionId}'`)) {
      fail(`${id}: FINANCE_MOTION_ID "${financeMotionId}" ist nicht in FINANCE_MOTION_REGISTRY registriert.`);
    }
    if (editorialV1) {
      if (!/finance-motion\/editorial-v(?:1|2)/.test(source)) fail(`${id}: Editorial library-best-fit muss aus src/finance-motion/editorial-v2 (bevorzugt) oder editorial-v1 importieren.`);
    } else if (!/finance-motion/.test(source)) {
      fail(`${id}: library-best-fit muss aus src/finance-motion importieren.`);
    }
    if (statSync(sourcePath).size < 900) fail(`${id}: Library-Wrapper ist zu klein; Narrative, Parameter und Motion-Regie müssen vollständig dokumentiert sein.`);
  }

  if (motionSource === 'custom-build') {
    if (financeMotionId !== 'none') fail(`${id}: custom-build muss FINANCE_MOTION_ID: none setzen.`);
    if (statSync(sourcePath).size < 2200) fail(`${id}: Custom-animation.tsx ist zu klein/leer; individuelle Animation braucht eine ausgearbeitete visuelle Geschichte.`);
    if (!/useCurrentFrame/.test(source)) fail(`${id}: Custom-Animation muss useCurrentFrame nutzen und framegenau sein.`);
    if (editorialV1) {
      if (!/EDITORIAL_MOTION_COLORS/.test(source)) fail(`${id}: Editorial Custom-Animation muss EDITORIAL_MOTION_COLORS verwenden.`);
    } else if (!/ANIMATION_COLORS/.test(source)) {
      fail(`${id}: Custom-Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
    }
    if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: Custom-Animation hat keinen nachvollziehbaren zeitlichen Animationsfortschritt.`);
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

  validateSharedNarratives(id, source, editorialV1);
}

if (errors.length) {
  console.error('\nPhase-1-Animationscode verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (hybridV2) {
  console.log(`\n✓ ${animations.length} kanonische Phase-1-Animation(en) erfüllen den Hybrid-Animationsvertrag.`);
  console.log(`✓ Aktive Motion-Welt: ${editorialV1 ? EDITORIAL_MOTION_LOCK : PREMIUM_ANIMATION_LOCK}.`);
  console.log('✓ Library-Best-Fit darf wiederverwendet und parametrisiert werden; Custom-Build bleibt erlaubt.');
  console.log('✓ Qualität wird über Focal Path, Hauptaktion, Payoff und Start -> Mechanismus -> Ergebnis geprüft.');
} else {
  console.log(`\n✓ ${animations.length} Legacy-Animation(en) erfüllen weiterhin ihren bisherigen Qualitätsvertrag.`);
  console.log('✓ Keine rückwirkende Migration auf Finance-Motion-Library-Marker.');
}
