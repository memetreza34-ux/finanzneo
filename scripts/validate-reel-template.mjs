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
  'scripts/scaffold-finanzneo-reel-quality.mjs',
  'scripts/validate-reel-quality-contract.mjs',
  'docs/REEL-QUALITY-CONTRACT-V2.md',
  'package.json',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`Pflichtdatei fehlt: ${file}`);
}

for (const forbiddenFile of [
  'src/design-system/AdaptiveSafeFillImage.tsx',
  'scripts/scaffold-finanzneo-reel.mjs',
]) {
  if (existsSync(resolve(root, forbiddenFile))) errors.push(`Veraltete aktive Datei muss entfernt sein: ${forbiddenFile}`);
}

if (errors.length === 0) {
  const read = (path) => {
    try {
      return readFileSync(resolve(root, path), 'utf8');
    } catch (error) {
      errors.push(`Konnte Datei nicht lesen: ${path}`);
      return '';
    }
  };

  const types = read('src/production/reel-template/types.ts');
  const template = read('src/production/reel-template/ReelTemplate.tsx');
  const captions = read('src/design-system/SentenceKaraokeCaptions.tsx');
  const fullFrame = read('src/design-system/FullFrameImage.tsx');
  const demo = read('src/production/reel-template/ReelTemplateDemo.tsx');
  const experiments = read('src/root/ExperimentCompositions.tsx');
  const production = read('src/root/ProductionCompositions.tsx');
  const qualityScaffolder = read('scripts/scaffold-finanzneo-reel-quality.mjs');
  const qualityValidator = read('scripts/validate-reel-quality-contract.mjs');
  let packageJson = {};
  try {
    packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  } catch (error) {
    errors.push('Konnte package.json nicht lesen oder parsen.');
  }

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
  if (!template.includes('SentenceKaraokeCaptions')) errors.push('ReelTemplate verwendet nicht die sicheren Karaoke-Untertitel.');
  if (template.includes('AdaptiveSafeFillImage')) errors.push('AdaptiveSafeFillImage ist im ReelTemplate verboten.');
  if (template.includes('<Captions words=')) errors.push('Alte gruppenbasierte Captions-Komponente ist noch im ReelTemplate aktiv.');
  if (!template.includes('VerticalSafeAreaGuide')) errors.push('ReelTemplate besitzt kein visuelles Safe-Area-Prüfraster.');
  if (!template.includes("from '../../design-system'")) errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');

  for (const oldOverride of ['bottom={300}', 'left={64}', 'right={156}']) {
    if (template.includes(oldOverride)) errors.push(`ReelTemplate überschreibt den neuen Caption-Safe-Area-Vertrag mit Altwert: ${oldOverride}`);
  }

  if (!fullFrame.includes("objectFit: 'contain'")) errors.push('FullFrameImage muss das vollständige vertikale 9:16-Bild ohne absichtlichen Crop erhalten.');
  if (!fullFrame.includes('inset: 0')) errors.push('FullFrameImage muss die komplette Szenenfläche belegen.');
  if (!fullFrame.includes('FullFrameReadabilityScrim')) errors.push('FullFrameImage-Datei muss den kontinuierlichen Lesbarkeits-Scrim bereitstellen.');

  if (!captions.includes('const MAX_WORDS = 12')) errors.push('Caption-Komponente muss auf maximal 12 Wörter pro Einheit begrenzt sein.');
  if (!captions.includes('const MAX_CHARS = 68')) errors.push('Caption-Komponente muss auf maximal 68 Zeichen pro Einheit begrenzt sein.');
  if (!captions.includes('const MIN_FONT_SIZE = 42')) errors.push('Caption-Komponente muss mindestens 42 px effektive Schriftgröße sichern.');
  if (!captions.includes('bottom = 320')) errors.push('Caption-Komponente muss die neue sichere Bottom-Position 320 verwenden.');
  if (!captions.includes('left = 72')) errors.push('Caption-Komponente muss links 72 px Safe-Area verwenden.');
  if (!captions.includes('right = 180')) errors.push('Caption-Komponente muss rechts 180 px Safe-Area verwenden.');
  if (!captions.includes('NATURAL_PAUSE_SECONDS = 0.34')) errors.push('Caption-Komponente muss echte Sprachpausen als natürliche Splitstellen berücksichtigen.');
  if (!captions.includes('Caption unit too wide for safe area')) errors.push('Caption-Komponente muss zu breite Captions hart blockieren statt überlaufen lassen.');

  if (packageJson.scripts?.['reel:create'] !== 'node scripts/scaffold-finanzneo-reel-quality.mjs') {
    errors.push('npm run reel:create muss zwingend den einzigen Quality-V2-Scaffolder verwenden.');
  }
  // Validates the default types array with regex to allow for whitespace
  if (!/const\s+DEFAULT_TYPES\s*=\s*\['image'\s*,\s*'animation'\s*,\s*'animation'\s*,\s*'image'\s*,\s*'animation'\s*,\s*'image'\s*,\s*'animation'\s*,\s*'animation'\s*,\s*'animation'\s*,\s*'image'\]\s*;?/.test(qualityScaffolder)) errors.push('Quality-Scaffolder muss standardmäßig 6 Animationen + 4 Bildszenen erzeugen.');
  if (!/version\s*:\s*17/.test(qualityScaffolder)) errors.push('Quality-Scaffolder muss Reels direkt als scene-index Version 17 erzeugen.');
  if (!/targetAnimationShare\s*:\s*0\.60/.test(qualityScaffolder)) errors.push('Quality-Scaffolder enthält kein 60%-Animationsziel.');
  if (!/maxCharactersPerCaptionUnit\s*:\s*68/.test(qualityScaffolder)) errors.push('Quality-Scaffolder enthält nicht die 68-Zeichen-Caption-Grenze.');
  if (!qualityScaffolder.includes('final-qa.json')) errors.push('Quality-Scaffolder muss final-qa.json direkt erzeugen.');
  if (/spawnSync\(\s*process\.execPath\s*,\s*\['scripts\/scaffold-finanzneo-reel\.mjs'/.test(qualityScaffolder)) errors.push('Quality-Scaffolder darf nicht mehr vom gelöschten Alt-Scaffolder abhängen.');

  // Validates post-render check flag with regex
  if (!/const\s+postRender\s*=\s*args\.includes\('--post-render'\)/.test(qualityValidator)) errors.push('Quality-Validator besitzt keinen separaten Post-Render-QA-Modus.');
  // Validates animation share check logic with regex
  if (!/animationShare\s*>=\s*0\.55\s*&&\s*animationShare\s*<=\s*0\.65/.test(qualityValidator)) errors.push('Quality-Validator prüft die reale 55–65%-Animationslaufzeit nicht.');

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
console.log('✓ Karaoke-Captions nutzen 12 Wörter/68 Zeichen/max. 2 Zeilen/min. 42 px ohne alte Safe-Area-Overrides.');
console.log('✓ Es gibt nur noch den eigenständigen V17-Quality-Scaffolder mit 60/40-Default.');
console.log('✓ Pre-Render- und Post-Render-QA sind getrennt validiert.');
