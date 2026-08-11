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
  'src/design-system/FullFrameImage.tsx',
  'src/design-system/SentenceKaraokeCaptions.tsx',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`Pflichtdatei fehlt: ${file}`);
}

if (existsSync(resolve(root, 'src/design-system/AdaptiveSafeFillImage.tsx'))) {
  errors.push('Veraltete Datei AdaptiveSafeFillImage.tsx muss entfernt sein.');
}

if (errors.length === 0) {
  const types = readFileSync(resolve(root, 'src/production/reel-template/types.ts'), 'utf8');
  const template = readFileSync(resolve(root, 'src/production/reel-template/ReelTemplate.tsx'), 'utf8');
  const captions = readFileSync(resolve(root, 'src/design-system/SentenceKaraokeCaptions.tsx'), 'utf8');
  const fullFrame = readFileSync(resolve(root, 'src/design-system/FullFrameImage.tsx'), 'utf8');
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
  if (beatTypes[0] !== 'hook') errors.push('Der erste Demo-Beat ist kein Hook.');
  if (beatTypes[beatTypes.length - 1] !== 'cta') errors.push('Der letzte Demo-Beat ist kein CTA.');

  for (const beatType of ['hook', 'explain', 'number', 'compare', 'checklist', 'cta']) {
    if (!beatTypes.includes(beatType)) errors.push(`Demo enthält keinen ${beatType}-Beat.`);
  }

  if (!types.includes('validateReelConfig')) errors.push('Konfigurationsvalidator fehlt in types.ts.');
  if (!types.includes('60') || !types.includes('90')) errors.push('60–90-Sekunden-Grenzen fehlen im Konfigurationsvalidator.');
  for (const obsolete of ['objectFit?:', 'focalX?:', 'focalY?:']) {
    if (types.includes(obsolete)) errors.push(`ImageBeat enthält veraltetes Framing-Feld: ${obsolete}`);
  }

  if (!template.includes('FinanceBackground')) errors.push('ReelTemplate verwendet nicht den verbindlichen FinanzNeo-Hintergrund für native Szenen.');
  if (!template.includes('SAFE_AREA')) errors.push('ReelTemplate verwendet nicht die zentralen Safe-Area-Tokens.');
  if (!template.includes('FullFrameImage')) errors.push('ReelTemplate verwendet FullFrameImage nicht für Nutzerbilder.');
  if (!template.includes('FullFrameReadabilityScrim')) errors.push('ReelTemplate verwendet keinen kontinuierlichen FullFrameReadabilityScrim.');
  if (!template.includes('SentenceKaraokeCaptions')) errors.push('ReelTemplate verwendet nicht die satzbasierten Karaoke-Untertitel.');
  if (template.includes('AdaptiveSafeFillImage')) errors.push('AdaptiveSafeFillImage ist im ReelTemplate verboten.');
  if (template.includes('<Captions words=')) errors.push('Alte gruppenbasierte Captions-Komponente ist noch im ReelTemplate aktiv.');
  if (!template.includes('VerticalSafeAreaGuide')) errors.push('ReelTemplate besitzt kein visuelles Safe-Area-Prüfraster.');
  if (!template.includes("from '../../design-system'")) errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');

  if (!fullFrame.includes("objectFit: 'contain'")) errors.push('FullFrameImage muss das vollständige vertikale 9:16-Bild ohne absichtlichen Crop erhalten.');
  if (!fullFrame.includes("inset: 0")) errors.push('FullFrameImage muss die komplette Szenenfläche belegen.');
  if (!fullFrame.includes('FullFrameReadabilityScrim')) errors.push('FullFrameImage-Datei muss den kontinuierlichen Lesbarkeits-Scrim bereitstellen.');

  if (!captions.includes('Exactly one spoken sentence')) errors.push('Caption-Komponente dokumentiert die Ein-Satz-Regel nicht.');
  if (captions.includes("background:'rgba") || captions.includes('background: \'rgba')) errors.push('Caption-Komponente darf keine undurchsichtige Caption-Karte erzeugen.');

  if (!experiments.includes('id="ReelTemplateDemo"')) errors.push('ReelTemplateDemo ist nicht unter Experiments registriert.');
  if (production.includes('ReelTemplateDemo')) errors.push('ReelTemplateDemo darf nicht unter Production registriert sein.');
  if (!demo.includes('showSafeAreaGuide: true')) errors.push('Die Demo muss das Safe-Area-Raster sichtbar zeigen.');

  console.log(`Geprüfte Demo-Dauer: ${durationSeconds.toFixed(1)} Sekunden (${totalFrames} Frames).`);
}

if (errors.length > 0) {
  console.error('\nReel-Vorlagen-Prüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('✓ ReelTemplateDemo liegt korrekt unter Experiments.');
console.log('✓ Nutzerbilder sind full-frame-no-crop; kein mittlerer Bildcontainer/Crop-Vertrag bleibt aktiv.');
console.log('✓ Satzbasierte Karaoke-Untertitel sind auf genau einen Satz und maximal zwei Zeilen ausgelegt.');
