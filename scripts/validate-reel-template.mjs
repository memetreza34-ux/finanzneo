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

  if (!types.includes('validateReelConfig')) {
    errors.push('Konfigurationsvalidator fehlt in types.ts.');
  }
  if (!types.includes('60') || !types.includes('90')) {
    errors.push('60–90-Sekunden-Grenzen fehlen im Konfigurationsvalidator.');
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
  if (!template.includes('VerticalSafeAreaGuide')) {
    errors.push('ReelTemplate besitzt kein visuelles Safe-Area-Prüfraster.');
  }
  if (!template.includes("from '../../design-system'")) {
    errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');
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
console.log('✓ Safe Areas, Untertitel und Designsystem sind eingebunden.');
