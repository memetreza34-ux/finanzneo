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
const placeholder = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|METAPHOR|DESCRIBE|PLACE EACH|ONE LARGE)[^\]]*)\]|TODO|TBD|PLACEHOLDER|PHASE 1 ANIMATION CODE NOT COMPLETED/i;
const hackWords = /\b(dummy|debug|placeholder|temporary|technik-hack|wackel|wiggle|test rectangle|fake motion)\b/i;
const realWorldPrimitive = /<Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack)\b/g;
const mechanicIds = new Map();
const techniqueIds = new Map();
const freeRemotion = index.phase1AnimationCode?.creativeRemotionFreedom === true;

if (index.phase1AnimationCode?.required !== true) fail('phase1AnimationCode.required muss true sein.');
if (index.phase1AnimationCode?.qualityLock !== ANIMATION_QUALITY_LOCK) fail(`phase1AnimationCode.qualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
if (index.phase1AnimationCode?.phase3MayNotReplaceCanonicalAnimation !== true) fail('Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');
if (freeRemotion) {
  if (index.phase1AnimationCode?.customCompositionAllowed !== true) fail('Remotion-Freedom verlangt customCompositionAllowed=true.');
  if (index.phase1AnimationCode?.physicalPrimitivesOptional !== true) fail('Remotion-Freedom verlangt physicalPrimitivesOptional=true.');
  if (index.phase1AnimationCode?.safeStageRequired !== true) fail('Remotion-Freedom verlangt safeStageRequired=true.');
  if (index.phase1AnimationCode?.visualTechniqueIdRequired !== true) fail('Remotion-Freedom verlangt visualTechniqueIdRequired=true.');
  if (index.phase1AnimationCode?.uniqueVisualTechniquePerAnimationRequired !== true) fail('Remotion-Freedom verlangt uniqueVisualTechniquePerAnimationRequired=true.');
} else {
  if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== true) fail('PremiumPhysicalStage muss für den alten Animationsvertrag verpflichtend sein.');
  if (index.phase1AnimationCode?.requirePhysicalObjects !== true) fail('Mindestens ein echtes physisches Hauptobjekt muss im alten Animationsvertrag verpflichtend sein.');
}
if (index.phase1AnimationCode?.supportingObjectCountFlexible !== true) fail('Animationskomposition braucht supportingObjectCountFlexible=true.');
if (index.phase1AnimationCode?.clarityBeforeObjectCount !== true) fail('Animationskomposition braucht clarityBeforeObjectCount=true.');
if (index.phase1AnimationCode?.sameVisualLanguageAsFlowImages !== true) fail('Animationen müssen dieselbe visuelle Sprache wie Flow-Bilder verwenden.');
if (index.phase1AnimationCode?.pureBlackCanvasRequired !== true) fail('Animationen müssen den zentralen pure-black Reel-Canvas verwenden.');
if (index.phase1AnimationCode?.transparentAnimationStageRequired !== true) fail('Animations-Stage muss transparent bleiben.');
if (index.phase1AnimationCode?.decorativeBackgroundEffectsForbidden !== true) fail('Dekorative Animations-Hintergrundeffekte müssen verboten sein.');

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
  if (!statSync(sourcePath).isFile() || statSync(sourcePath).size < 2200) {
    fail(`${id}: animation.tsx ist zu klein/leer; der Vertrag erwartet eine ausgearbeitete visuelle Geschichte, keinen Karten-/Balken-Prototyp.`);
    continue;
  }

  const source = readFileSync(sourcePath, 'utf8');
  if (placeholder.test(source)) fail(`${id}: animation.tsx enthält Platzhalter/TODO.`);
  if (hackWords.test(source)) fail(`${id}: animation.tsx enthält Platzhalter-/Hack-Sprache.`);
  if (/Math\.(?:sin|cos)\s*\(/.test(source)) fail(`${id}: Math.sin/Math.cos als Dauer-Wackelbewegung ist im Produktionscode gesperrt.`);
  if (/\b(?:color|background(?:Color)?)\s*:\s*['"](?:black|#000(?:000)?)['"]/i.test(source)) fail(`${id}: Szene darf keinen eigenen schwarzen Hintergrund/Schwarz-Inhalt definieren; der zentrale Canvas ist bereits #000000.`);
  if (!source.includes(scene.animationExport)) fail(`${id}: Export ${scene.animationExport} ist im kanonischen Code nicht auffindbar.`);
  if (!/useCurrentFrame/.test(source)) fail(`${id}: Animation muss useCurrentFrame nutzen und sichtbar zeitgesteuert sein.`);
  if (!/ANIMATION_COLORS/.test(source)) fail(`${id}: Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
  if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: kein nachvollziehbarer zeitlicher Animationsfortschritt gefunden.`);

  if (freeRemotion) {
    if (!/(?:PremiumPhysicalStage|AnimationStage)/.test(source)) fail(`${id}: freie Remotion-Animation muss AnimationStage oder PremiumPhysicalStage für die Safe-Zone verwenden.`);
  } else if (!/PremiumPhysicalStage/.test(source)) {
    fail(`${id}: alter Animationsvertrag verlangt PremiumPhysicalStage.`);
  }
  const genericObjects = [...source.matchAll(/<PhysicalObject\b/g)].length;
  const concreteObjects = [...source.matchAll(realWorldPrimitive)].length;
  if (!freeRemotion) {
    if (genericObjects + concreteObjects < 1) fail(`${id}: Animation braucht mindestens ein physisches Hauptmotiv.`);
    if (concreteObjects < 2) fail(`${id}: mindestens zwei konkrete Realwelt-Objekte/-Instanzen sind im alten Vertrag nötig.`);
    if (genericObjects >= 3 && concreteObjects < 3) fail(`${id}: drei oder mehr generische PhysicalObject-Karten dominieren die Szene.`);
    if (/<PhysicalRail\b/.test(source) && concreteObjects < 3) fail(`${id}: PhysicalRail darf im alten Vertrag nicht die primäre Animation ersetzen.`);
  }
  if (!freeRemotion && !/(?:material=['"](?:neutral|money|warning|positive)['"]|Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack))/.test(source)) {
    fail(`${id}: Legacy-Animation braucht semantische Materialrollen oder konkrete Realwelt-Primitives.`);
  }
  if (freeRemotion && !/ANIMATION_COLORS/.test(source)) {
    fail(`${id}: freie Remotion-Animation muss weiterhin die zentrale ANIMATION_COLORS-Semantik verwenden.`);
  }
  // Nur tatsächliche JSX-Komponentennutzung blockieren. Qualitätskommentare wie
  // "kein Dashboard" oder "kein Flowchart" sind ausdrücklich erlaubt und sollen
  // nicht als verbotene UI-Komponente fehlinterpretiert werden.
  if (/<(?:Flowchart|Dashboard|ControlPanel|WindowMock|IconTile)\b/.test(source)) {
    fail(`${id}: Dashboard-/Flowchart-/UI-Komponenten sind als Hauptsprache gesperrt.`);
  }
  if (/<(?:FNBgAurora|FNBgParticles|FNBgGrid|FNBgRadial|ParticleField|Particles)\b/.test(source)) {
    fail(`${id}: Partikel/Aurora/Grid/Radial-Hintergrundkomponenten sind in Reel-Animationen verboten.`);
  }
  if (/background\s*:\s*['"`]radial-gradient|backgroundImage\s*:/i.test(source)) {
    fail(`${id}: eigener dekorativer Gradient/Grid-Hintergrund ist verboten; PremiumPhysicalStage bleibt transparent.`);
  }

  const mechanicId = source.match(/MECHANIC_ID:\s*([a-z0-9-]+)/i)?.[1];
  if (!mechanicId) {
    fail(`${id}: MECHANIC_ID fehlt; jede Animation braucht eine eindeutig benannte eigene Mechanik.`);
  } else if (mechanicIds.has(mechanicId)) {
    fail(`${id}: MECHANIC_ID "${mechanicId}" dupliziert ${mechanicIds.get(mechanicId)}; jede Animationsszene braucht eine andere Mechanik.`);
  } else {
    mechanicIds.set(mechanicId, id);
  }
  if (freeRemotion) {
    const techniqueId = source.match(/VISUAL_TECHNIQUE_ID:\s*([a-z0-9-]+)/i)?.[1];
    if (!techniqueId) {
      fail(`${id}: VISUAL_TECHNIQUE_ID fehlt; jede freie Remotion-Szene braucht eine eigene Haupttechnik.`);
    } else if (techniqueIds.has(techniqueId)) {
      fail(`${id}: VISUAL_TECHNIQUE_ID "${techniqueId}" dupliziert ${techniqueIds.get(techniqueId)}; Haupttechniken im selben Reel müssen variieren.`);
    } else {
      techniqueIds.set(techniqueId, id);
    }
  }
  if (!/PRIMARY_ACTION:\s*[^\n]{18,}/i.test(source)) {
    fail(`${id}: PRIMARY_ACTION fehlt/ist zu kurz; die physische Hauptaktion muss explizit beschrieben sein.`);
  }

  const motionChannels = [...source.matchAll(/const\s+[A-Za-z0-9_]+\s*=\s*(?:interpolate|spring)\s*\(/g)].length;
  if (motionChannels < 3) {
    fail(`${id}: nur ${motionChannels} echte Motion-Channels gefunden; hochwertige Animation braucht mehrere koordinierte Zustandsänderungen statt einer einzigen Progress-Variable.`);
  }

  const narrative = source.match(/ANIMATION_NARRATIVE[\s\S]{0,2200}?START:\s*([^\n]+)[\s\S]*?MECHANISM:\s*([^\n]+)[\s\S]*?RESULT:\s*([^\n]+)/i);
  if (!narrative) {
    fail(`${id}: Code braucht ANIMATION_NARRATIVE mit START, MECHANISM und RESULT.`);
  } else {
    for (const [label, text] of [['START', narrative[1]], ['MECHANISM', narrative[2]], ['RESULT', narrative[3]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: ${label}-Beschreibung ist zu vage/Platzhalter.`);
    }
  }

  const premiumNarrative = source.match(/PREMIUM_VISUAL_NARRATIVE[\s\S]{0,2200}?HERO:\s*([^\n]+)[\s\S]*?SUPPORT:\s*([^\n]+)[\s\S]*?MATERIAL:\s*([^\n]+)[\s\S]*?DEPTH:\s*([^\n]+)/i);
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

console.log(`\n✓ ${animations.length} kanonische Phase-1-Animation(en) erfüllen den cinematischen V9-Animationsvertrag.`);
console.log(freeRemotion ? '✓ Remotion-Freedom: eigene Mechanik + eigene visuelle Haupttechnik je Szene; Physical*-Primitives sind optional.' : '✓ Jede Animation nutzt die alte Realwelt-Primitive-Mechanik mit Start → Aktion → Ergebnis.');
console.log('✓ Generische Kartenreihen und Fortschrittsbalken können die visuelle Erklärung nicht mehr ersetzen.');
console.log('✓ Mehrere koordinierte Motion-Channels sind Pflicht; reine Deko-Bewegung zählt nicht als Mechanik.');
console.log('✓ PremiumPhysicalStage bleibt auf zentralem pure-black Canvas; Partikel/Aurora/Grid/Gradient-Hintergründe sind gesperrt.');
