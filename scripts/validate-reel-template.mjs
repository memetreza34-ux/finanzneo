#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('.');
const errors = [];

const requiredFiles = [
  'src/production/reel-template/types.ts',
  'src/production/reel-template/ReelTemplate.tsx',
  'src/production/reel-template/ReelTemplateDemo.tsx',
  'src/production/reel-template/index.ts',
  'src/production/reel-template/README.md',
  'src/brand/components/Captions.tsx',
  'src/brand/components/SceneHeader.tsx',
  'src/brand/components/MechanismCue.tsx',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    errors.push(`Pflichtdatei fehlt: ${file}`);
  }
}

if (errors.length === 0) {
  const types = readFileSync(resolve(root, 'src/production/reel-template/types.ts'), 'utf8');
  const template = readFileSync(resolve(root, 'src/production/reel-template/ReelTemplate.tsx'), 'utf8');
  const demo = readFileSync(resolve(root, 'src/production/reel-template/ReelTemplateDemo.tsx'), 'utf8');
  const captions = readFileSync(resolve(root, 'src/brand/components/Captions.tsx'), 'utf8');
  const sceneHeader = readFileSync(resolve(root, 'src/brand/components/SceneHeader.tsx'), 'utf8');
  const mechanismCue = readFileSync(resolve(root, 'src/brand/components/MechanismCue.tsx'), 'utf8');
  const experiments = readFileSync(resolve(root, 'src/root/ExperimentCompositions.tsx'), 'utf8');
  const production = readFileSync(resolve(root, 'src/root/ProductionCompositions.tsx'), 'utf8');

  const durations = [...demo.matchAll(/durationInFrames:\s*(\d+)/g)].map((match) => Number(match[1]));
  const totalFrames = durations.reduce((sum, value) => sum + value, 0);
  const durationSeconds = totalFrames / 30;

  if (durationSeconds < 60 || durationSeconds > 90) {
    errors.push(`ReelTemplateDemo muss 60–90 Sekunden dauern, aktuell ${durationSeconds.toFixed(1)} Sekunden.`);
  }

  const beatTypes = [...demo.matchAll(/type:\s*'([^']+)'/g)].map((match) => match[1]);
  if (beatTypes[0] !== 'hook') {
    errors.push('Der erste Demo-Beat ist kein Hook.');
  }
  if (beatTypes[beatTypes.length - 1] !== 'cta') {
    errors.push('Der letzte Demo-Beat ist kein CTA.');
  }

  const requiredBeatTypes = ['hook', 'explain', 'number', 'compare', 'checklist', 'cta'];
  for (const beatType of requiredBeatTypes) {
    if (!beatTypes.includes(beatType)) {
      errors.push(`Demo enthält keinen ${beatType}-Beat.`);
    }
  }

  const iconCount = [...demo.matchAll(/icon:\s*'[^']+'/g)].length;
  if (iconCount < beatTypes.length) {
    errors.push('Jeder Demo-Beat benötigt ein SceneHeader-Icon.');
  }

  if (!types.includes('validateReelConfig')) {
    errors.push('Konfigurationsvalidator fehlt in types.ts.');
  }
  if (!types.includes('60') || !types.includes('90')) {
    errors.push('60–90-Sekunden-Grenzen fehlen im Konfigurationsvalidator.');
  }
  if (!types.includes('Maximal 6,0 s')) {
    errors.push('6-Sekunden-Maximum für Bildbeats fehlt im Konfigurationsvalidator.');
  }
  if (!types.includes('icon: IconName')) {
    errors.push('ReelBeatBase erzwingt kein Icon für jede Szene.');
  }

  if (!template.includes('FinanceBackground')) {
    errors.push('ReelTemplate verwendet nicht den verbindlichen FinanzNeo-Hintergrund.');
  }
  if (!template.includes('SAFE_AREA')) {
    errors.push('ReelTemplate verwendet nicht die zentralen Safe-Area-Tokens.');
  }
  if (!template.includes('Captions')) {
    errors.push('ReelTemplate unterstützt keine zentralen Untertitel.');
  }
  if (!template.includes('SceneHeader')) {
    errors.push('ReelTemplate verwendet keine einheitliche Zwischenüberschrift mit Icon.');
  }
  if (!template.includes('ANIMATION_COLORS')) {
    errors.push('ReelTemplate verwendet nicht die semantische, dunkelhintergrund-sichere Animationspalette.');
  }
  if (!template.includes('VerticalSafeAreaGuide')) {
    errors.push('ReelTemplate besitzt kein visuelles Safe-Area-Prüfraster.');
  }
  if (!template.includes("from '../../design-system'")) {
    errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');
  }

  // Regressionen aus dem Jahreskosten-Test ausdrücklich blockieren.
  if (template.includes('highlight={C.gold}')) {
    errors.push('Goldenes Karaoke-Active-Word ist verboten; Active-Word muss FinanzNeo-grün sein.');
  }
  if (template.includes('perGroup={3}')) {
    errors.push('Alte 3-Wort-Caption-Gruppen sind verboten; Captions müssen satzbasiert sein.');
  }
  if (template.includes('bottom={292}')) {
    errors.push('Alte Caption-Position bottom=292 ist verboten; Standard ist 320.');
  }
  if (!template.includes('bottom={320}')) {
    errors.push('ReelTemplate setzt Caption bottom=320 nicht explizit.');
  }

  if (!captions.includes('active ? C.accent : C.white')) {
    errors.push('Captions erzwingen nicht grün für das aktive Wort und weiß für den Rest.');
  }
  if (captions.includes("translateY(-6px)")) {
    errors.push('Caption-Word-Jump ist verboten.');
  }
  if (captions.includes('0.9 + popIn')) {
    errors.push('Caption-Scale-Pop ist verboten.');
  }
  if (!captions.includes('HOLD_SECONDS')) {
    errors.push('Caption-Hold über kurze Pausen fehlt.');
  }

  if (!sceneHeader.includes('Icon') || !sceneHeader.includes('color: C.white')) {
    errors.push('SceneHeader muss Icon + weiße Headline rendern.');
  }
  if (!mechanismCue.includes("warning") || !mechanismCue.includes("money")) {
    errors.push('MechanismCue besitzt keine semantischen Warn-/Geldfarben.');
  }

  if (!experiments.includes('id="ReelTemplateDemo"')) {
    errors.push('ReelTemplateDemo ist nicht unter Experiments registriert.');
  }
  if (production.includes('ReelTemplateDemo')) {
    errors.push('ReelTemplateDemo darf nicht unter Production registriert sein.');
  }

  if (!demo.includes('showSafeAreaGuide: true')) {
    errors.push('Die Demo muss das Safe-Area-Raster sichtbar zeigen.');
  }

  console.log(`Geprüfte Demo-Dauer: ${durationSeconds.toFixed(1)} Sekunden (${totalFrames} Frames).`);
}

if (errors.length > 0) {
  console.error('\nReel-Vorlagen-Prüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('✓ ReelTemplateDemo liegt korrekt unter Experiments.');
console.log('✓ Hook, Erklär-, Zahlen-, Vergleichs-, Checklisten- und CTA-Beats sind vorhanden.');
console.log('✓ Jede Szene besitzt ein Icon/SceneHeader-System.');
console.log('✓ Captions sind satzbasiert, Active-Word grün, Rest weiß, ohne Word-Jump/Scale-Pop.');
console.log('✓ Animationspalette und MechanismCue sind für dunkle Szenen abgesichert.');
