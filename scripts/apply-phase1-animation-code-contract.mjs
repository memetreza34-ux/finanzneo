#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK, canonicalSceneDirectory} from './lib/reel-scene-schema.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-phase1-animation-code-contract.mjs <Reel-Pfad>');
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

const exportNameFor = (sceneId) => {
  const n = String(sceneId ?? '').match(/(\d+)/)?.[1] ?? '00';
  return `Scene${n.padStart(2, '0')}Animation`;
};

for (const scene of scenes) {
  if (scene?.type !== 'animation') continue;
  const directory = canonicalSceneDirectory(scene);
  if (!directory) throw new Error(`${scene.id}: Szenenordner kann nicht abgeleitet werden.`);

  const relativeSource = `${directory}/animation.tsx`;
  const exportName = exportNameFor(scene.id);
  scene.animationSourceFile = relativeSource;
  scene.animationExport = exportName;
  scene.animationIntent = scene.animationIntent ?? '[EINFÜGEN — sichtbare Finanzmechanik: Start -> Hauptaktion/Ursache -> Ergebnis]';
  scene.animationQualityLock = ANIMATION_QUALITY_LOCK;

  const sourcePath = resolve(root, '03-szenen', relativeSource);
  if (!existsSync(sourcePath)) {
    mkdirSync(dirname(sourcePath), {recursive: true});
    writeFileSync(sourcePath, `import React from 'react';\n\n/**\n * PHASE-1 CANONICAL ANIMATION SOURCE\n * Diese Datei MUSS in Phase 1 produktionsreif ersetzt werden.\n * Phase 3 darf die versiegelte Quelle nicht kreativ austauschen.\n *\n * Implementierungsreihenfolge:\n * 1. sichtbare Mechanik aus dem Sprechpunkt herleiten\n * 2. Finance Motion Library auf echten Best-Fit prüfen\n * 3. library-best-fit parametrisieren ODER custom-build umsetzen\n *\n * MOTION_SOURCE: [library-best-fit|custom-build]\n * FINANCE_MOTION_ID: [library-slug|none]\n * MECHANIC_ID: [SEMANTISCHE-MECHANIK]\n * FOCAL_PATH: [WAS DAS AUGE VON START BIS PAYOFF VERFOLGT]\n * PRIMARY_ACTION: [HAUPTBEWEGUNG, DIE DIE FINANZAUSSAGE ERKLÄRT]\n * CAMERA_ROLE: [still|follow|push|reframe + konkrete Begründung]\n * PAYOFF: [KLARER SICHTBARER ENDZUSTAND]\n *\n * ANIMATION_NARRATIVE\n * START: [KLARER STARTZUSTAND]\n * MECHANISM: [SICHTBARE URSACHE/AUSWIRKUNG]\n * RESULT: [EINDEUTIGER ENDZUSTAND]\n *\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: [HAUPTMOTIV]\n * SUPPORT: [NUR NÖTIGE SUPPORT-ELEMENTE]\n * MATERIAL: [SEMANTISCHE MATERIAL-/FARBROLLEN]\n * DEPTH: [RÄUMLICHE STAFFELUNG, WENN SINNVOLL]\n *\n * RESULT_HOLD_FRAMES = mindestens 15\n */\nexport const ${exportName}: React.FC<{durationFrames?: number}> = () => {\n  throw new Error('PHASE 1 ANIMATION CODE NOT COMPLETED');\n};\n`, 'utf8');
  }
}

index.phase1AnimationCode = {
  required: true,
  qualityLock: ANIMATION_QUALITY_LOCK,
  canonicalSourceRequiredForEveryAnimation: true,
  phase3MayNotReplaceCanonicalAnimation: true,
  financeMotionLibraryId: 'finanzneo-editorial-motion-library-v1',
  libraryBestFitPreferred: true,
  libraryUseNeverForced: true,
  customAnimationAllowed: true,
  reusableMechanicsMayRepeat: true,
  placeholderMotionForbidden: true,
  decorativeMotionDoesNotCountAsExplanation: true,
  mathSinCosCompletionHackForbidden: true,
  semanticMechanismRequired: true,
  uniqueMechanismPerAnimationRequired: false,
  clarityBeforeObjectCount: true,
  labelsSupplementalOnly: true,
  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
  motionDirectorMarkersRequired: ['MOTION_SOURCE', 'FINANCE_MOTION_ID', 'MECHANIC_ID', 'FOCAL_PATH', 'PRIMARY_ACTION', 'CAMERA_ROLE', 'PAYOFF'],
  narrativeMarkersRequired: ['START', 'MECHANISM', 'RESULT', 'HERO', 'SUPPORT', 'SURFACE', 'SHAPE_LANGUAGE'],
  resultHoldFramesMin: 15,
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`✓ Phase-1-Animationscode-Vertrag gesetzt: ${scenes.filter((s) => s?.type === 'animation').length} Animation(en).`);
console.log('  Editorial Motion Library zuerst prüfen; bei fehlendem Best-Fit individuelle Animation bauen.');
console.log('  Animationen bleiben simpel: keine Pflicht für Physical-Primitives, 3D, Kamerafahrt oder künstlich viele Motion-Channels.');
