#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-reel-quality-guards-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-reel-quality-guards-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.reelQualityGuards = {
  id: ID,
  appliesToNewReelsOnly: true,
  creativeDirectorRequired: true,
  boringSceneQaRequiredBeforeSeal: true,
  genericFinancePosterForbidden: true,
  personPlusFinanceSymbolsOnEmptyBackgroundForbidden: true,
  bankShieldCoinsArrowDefaultForbidden: true,
  staticObjectCatalogForbidden: true,
  labelsMayNotCarryMainMeaning: true,
  visibleActionConsequenceOrContrastRequired: true,
  shotDiversityRequired: true,
  uniqueStoryDetailRequired: true,
  flatInfographicAnimationAsDefaultForbidden: true,
  zoomPanKenBurnsDoesNotCountAsNewBeat: true,
  sceneTypeExclusive: true,
  imageAnimationHybridMainVisualForbidden: true,
  sourceBasedAnimationDiversityRequired: true,
  metadataOnlyDiversityForbidden: true,
  actualPrimitiveReuseLimited: true,
  horizontalAnimationSafeZoneRequired: true,
  animationHorizontalSafeZone: {left: 72, right: 1008, top: 320, bottom: 1400, perspectiveGuardPx: 24},
  postRenderEdgeBandQaRequired: true,
  edgeBandActivePixelRatioMax: 0.012,
};
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
const policy = `# Reel Quality Guards V1\n\nREEL_QUALITY_GUARDS: ${ID}\n\n## Boring-Scene-Guard\nTechnische Korrektheit ist kein PASS. Person + Finanzsymbole + leerer Hintergrund, Bank + Schild + Münzen + Pfeil, statische Objektkataloge und nur durch Labels verständliche Szenen sind als Default verboten. Jede Szene braucht sichtbare Handlung, Konsequenz oder klaren Kontrast sowie ein beat-spezifisches Story-Detail. Wiederholte Shot-Logik braucht klar neue sichtbare Information. Ken-Burns/Zoom/Pan allein zählt nicht als neuer Visual Beat.\n\n## Szene ist exklusiv\n- IMAGE: Story Moment + Flow-Bild als Hauptvisual + Titel/Header/Caption. Keine erklärende Remotion-Hauptanimation darüber.\n- ANIMATION: START → Aktion/Ursache → Veränderung → RESULTAT als eigenständige Remotion-Hauptanimation. Kein Flow-Bild als Hauptvisual.\n\n## Tatsächliche Animations-Diversität\nNicht nur motionDesign-Metadaten vergleichen. Der Validator liest die echte animation.tsx. Dieselben konkreten Physical-Primitives dürfen nicht drei der letzten vier Animationsszenen dominieren; stark überlappende direkte Nachbarszenen brauchen eine konkrete repetitionJustification. Karten, Chips, Icons, Balken und Rahmenbewegung sind keine automatische Premium-Hauptmechanik.\n\n## Horizontale Safe-Zone\nAnimations-Hauptobjekte bleiben inklusive perspektivischem Sicherheitsrand innerhalb X=72–1008. Statisch prüfbare JSX-Objekte werden vor Render validiert. Im finalen MP4 werden zusätzlich die äußeren Randbänder der Visualzone gesampelt; sichtbare Animationsinhalte dort sind ein FAIL.\n`;
writeFileSync(resolve(projectDir, 'reel-quality-guards-v1.md'), policy, 'utf8');

const handoffPath = resolve(projectDir, 'ANTIGRAVITY-AUFTRAG.md');
if (existsSync(handoffPath)) {
  const current = readFileSync(handoffPath, 'utf8');
  if (!current.includes(`REEL_QUALITY_GUARDS: ${ID}`)) writeFileSync(handoffPath, `${current.trim()}\n\n${policy}`, 'utf8');
}

console.log(`✓ Reel Quality Guards gesetzt: ${ID}`);
console.log('✓ Creative Director + Boring-Scene-Guard · IMAGE xor ANIMATION · echte Source-Diversität · horizontale Safe-Zone + Render-Rand-QA.');