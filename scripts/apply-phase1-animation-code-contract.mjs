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
  scene.animationIntent = scene.animationIntent ?? '[EINFÜGEN — konkrete reale Situation: Startzustand → physische Hauptaktion → sichtbare Ursache/Wirkung → Ergebnis]';
  scene.animationQualityLock = ANIMATION_QUALITY_LOCK;

  const sourcePath = resolve(root, '03-szenen', relativeSource);
  if (!existsSync(sourcePath)) {
    mkdirSync(dirname(sourcePath), {recursive: true});
    writeFileSync(sourcePath, `import React from 'react';\n\n/**\n * PHASE-1 CANONICAL ANIMATION SOURCE\n * Diese Datei MUSS in Phase 1 individuell für genau diesen Sprechpunkt durch\n * produktionsreifen Code ersetzt werden. Der Placeholder darf niemals gerendert werden.\n * Phase 3 darf diese Quelle nicht kreativ ersetzen oder vereinfachen.\n *\n * Qualitätsziel:\n * - reale stylized-3D-Situation statt generischer Kartenreihe\n * - mindestens zwei konkrete Realwelt-Objekte/-Instanzen\n * - mehrere koordinierte Motion-Channels\n * - keine Lade-/Fortschrittsbalken als eigentliche Erklärung\n * - Labels nur unterstützend\n *\n * MECHANIC_ID: [EINDEUTIGE-MECHANIK-FÜR-DIESE-SZENE]\n * PRIMARY_ACTION: [KONKRETE PHYSISCHE HAUPTAKTION]\n *\n * ANIMATION_NARRATIVE\n * START: [KONKRETER REALER STARTZUSTAND]\n * MECHANISM: [SICHTBARE PHYSISCHE URSACHE/WIRKUNG]\n * RESULT: [EINDEUTIGER SICHTBARER ENDZUSTAND]\n *\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: [REALES HAUPTMOTIV]\n * SUPPORT: [NUR NÖTIGE REALE SUPPORT-OBJEKTE]\n * MATERIAL: [SEMANTISCHE MATERIAL-/FARBROLLEN]\n * DEPTH: [RÄUMLICHE STAFFELUNG UND KONTAKTSCHATTEN]\n */\nexport const ${exportName}: React.FC<{durationFrames?: number}> = () => {\n  throw new Error('PHASE 1 ANIMATION CODE NOT COMPLETED');\n};\n`, 'utf8');
  }
}

index.phase1AnimationCode = {
  required: true,
  qualityLock: ANIMATION_QUALITY_LOCK,
  canonicalSourceRequiredForEveryAnimation: true,
  phase3MayNotReplaceCanonicalAnimation: true,
  placeholderMotionForbidden: true,
  decorativeMotionDoesNotCountAsExplanation: true,
  mathSinCosCompletionHackForbidden: true,
  realWorldMechanismRequired: true,
  uniqueMechanismPerAnimationRequired: true,
  physicalCauseEffectRequired: true,
  labelsSupplementalOnly: true,
  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
  narrativeMarkersRequired: ['MECHANIC_ID', 'PRIMARY_ACTION', 'START', 'MECHANISM', 'RESULT', 'HERO', 'SUPPORT', 'MATERIAL', 'DEPTH'],
  resultHoldFramesMin: 15,
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`✓ Phase-1-Animationscode-Vertrag gesetzt: ${scenes.filter((s) => s?.type === 'animation').length} Animation(en).`);
console.log('  Jede Animation muss eine eigene reale Mechanik, konkrete Gegenstände und mehrere koordinierte Bewegungen besitzen.');
