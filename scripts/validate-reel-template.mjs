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
  'scripts/render-validated.mjs',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`Pflichtdatei fehlt: ${file}`);
}

if (errors.length === 0) {
  const types = readFileSync(resolve(root, 'src/production/reel-template/types.ts'), 'utf8');
  const template = readFileSync(resolve(root, 'src/production/reel-template/ReelTemplate.tsx'), 'utf8');
  const demo = readFileSync(resolve(root, 'src/production/reel-template/ReelTemplateDemo.tsx'), 'utf8');
  const tokens = readFileSync(resolve(root, 'src/brand/tokens.ts'), 'utf8');
  const captions = readFileSync(resolve(root, 'src/brand/components/Captions.tsx'), 'utf8');
  const sceneHeader = readFileSync(resolve(root, 'src/brand/components/SceneHeader.tsx'), 'utf8');
  const mechanismCue = readFileSync(resolve(root, 'src/brand/components/MechanismCue.tsx'), 'utf8');
  const renderValidated = readFileSync(resolve(root, 'scripts/render-validated.mjs'), 'utf8');
  const experiments = readFileSync(resolve(root, 'src/root/ExperimentCompositions.tsx'), 'utf8');
  const production = readFileSync(resolve(root, 'src/root/ProductionCompositions.tsx'), 'utf8');

  const durations = [...demo.matchAll(/durationInFrames:\s*(\d+)/g)].map((match) => Number(match[1]));
  const totalFrames = durations.reduce((sum, value) => sum + value, 0);
  const durationSeconds = totalFrames / 30;
  if (durationSeconds < 60 || durationSeconds > 90) errors.push(`ReelTemplateDemo muss 60–90 Sekunden dauern, aktuell ${durationSeconds.toFixed(1)} Sekunden.`);

  const beatTypes = [...demo.matchAll(/type:\s*'([^']+)'/g)].map((match) => match[1]);
  if (beatTypes[0] !== 'hook') errors.push('Der erste Demo-Beat ist kein Hook.');
  if (beatTypes[beatTypes.length - 1] !== 'cta') errors.push('Der letzte Demo-Beat ist kein CTA.');
  for (const beatType of ['hook', 'explain', 'number', 'compare', 'checklist', 'cta']) {
    if (!beatTypes.includes(beatType)) errors.push(`Demo enthält keinen ${beatType}-Beat.`);
  }

  const iconCount = [...demo.matchAll(/icon:\s*'[^']+'/g)].length;
  if (iconCount < beatTypes.length) errors.push('Jeder Demo-Beat benötigt ein SceneHeader-Icon.');

  if (!types.includes('validateReelConfig')) errors.push('Konfigurationsvalidator fehlt in types.ts.');
  if (!types.includes('60') || !types.includes('90')) errors.push('60–90-Sekunden-Grenzen fehlen im Konfigurationsvalidator.');
  if (!types.includes('Maximal 6,0 s')) errors.push('6-Sekunden-Maximum für Bildbeats fehlt im Konfigurationsvalidator.');
  if (!types.includes('icon: IconName')) errors.push('ReelBeatBase erzwingt kein Icon für jede Szene.');

  if (!template.includes('FinanceBackground')) errors.push('ReelTemplate verwendet nicht den verbindlichen FinanzNeo-Hintergrund.');
  if (!template.includes('SceneHeader')) errors.push('ReelTemplate verwendet keine einheitliche Zwischenüberschrift mit Icon.');
  if (!template.includes('ANIMATION_COLORS')) errors.push('ReelTemplate verwendet nicht die semantische Animationspalette.');
  if (!template.includes('SceneContinuityFrame')) errors.push('Premium-Continuity zwischen Szenen fehlt.');
  if (!template.includes('CONTENT_TOP = 390') || !template.includes('CONTENT_BOTTOM = 360')) errors.push('Premium-V3-Hauptvisualzone ist nicht korrekt nach unten gesetzt.');
  if (/<Captions[^/>]*(?:bottom|left|right|size)=\{/.test(template)) errors.push('ReelTemplate überschreibt Caption-Maße lokal; sie kommen zentral aus REEL_STYLE.');
  if (!tokens.includes('bottom: 285') || !tokens.includes('left: 72') || !tokens.includes('right: 140')) errors.push('Premium-Captionposition fehlt in REEL_STYLE.caption.');
  if (!template.includes('VerticalSafeAreaGuide')) errors.push('ReelTemplate besitzt kein visuelles Safe-Area-Prüfraster.');
  if (!template.includes("from '../../design-system'")) errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');

  if (template.includes('highlight={C.gold}')) errors.push('Goldenes Karaoke-Active-Word ist verboten.');
  if (template.includes('perGroup={3}')) errors.push('Alte 3-Wort-Caption-Gruppen sind verboten.');
  if (template.includes('bottom={292}') || template.includes('bottom={320}')) errors.push('Alte Captionposition ist verboten; Premium V3 nutzt bottom=285.');

  if (!captions.includes('active ? C.accentLt : C.white')) errors.push('Captions erzwingen nicht hellgrün für das aktive Wort und weiß für den Rest.');
  if (!captions.includes('REEL_STYLE')) errors.push('Captions liest die Maße nicht aus dem zentralen REEL_STYLE.');
  if (!captions.includes('bottom = S.bottom') || !captions.includes('size = S.fontSize')) errors.push('Captions nutzt nicht die zentralen Standardwerte für Position und Größe.');
  if (!captions.includes('background: background ?')) errors.push('Premium-Caption-Backplate fehlt.');
  if (/WebkitTextStroke/.test(captions)) errors.push('WebkitTextStroke ist auf Untertiteln verboten: Glyphen laufen zu.');

  const captionWeight = tokens.match(/fontWeight:\s*(\d+)/);
  if (captionWeight && Number(captionWeight[1]) > 800) errors.push(`Untertitel-Schriftstärke ${captionWeight[1]} ist zu fett (max. 800).`);
  const captionSize = tokens.match(/caption:\s*\{[\s\S]*?fontSize:\s*(\d+)/);
  if (captionSize && Number(captionSize[1]) > 54) errors.push(`Untertitel-Grundgröße ${captionSize[1]} px ist zu groß (max. 54).`);
  if (captions.includes('0 0 18px') || captions.includes('0 0 24px')) errors.push('Weicher Caption-Glow ist verboten; Untertitel müssen crisp sein.');
  if (captions.includes('translateY(-6px)')) errors.push('Caption-Word-Jump ist verboten.');
  if (!captions.includes('holdSeconds')) errors.push('Caption-Hold über kurze Pausen fehlt.');
  if (!tokens.includes('holdSeconds:')) errors.push('REEL_STYLE.caption.holdSeconds fehlt.');

  if (!sceneHeader.includes('REEL_STYLE')) errors.push('SceneHeader liest die Maße nicht aus dem zentralen REEL_STYLE.');
  if (!tokens.includes('top: 118')) errors.push('SceneHeader-Position Y≈118 fehlt in REEL_STYLE.header.');
  if (!sceneHeader.includes('Icon') || !sceneHeader.includes('color: accent')) errors.push('SceneHeader muss Icon + Headline in Akzentfarbe rendern.');
  if (!sceneHeader.includes("justifyContent: 'center'")) errors.push('SceneHeader muss mittig zentriert sein.');
  if (!tokens.includes("align: 'center'")) errors.push('REEL_STYLE.header.align muss center sein.');
  if (!/background: 'rgba\(4, 17, 10, 0\.78\)'|background: 'rgba\(3, 16, 9, 0\.80\)'/.test(sceneHeader)) errors.push('Premium-Header-Kapsel fehlt.');

  // Übergänge dürfen nicht wieder träge werden.
  const continuity = tokens.match(/continuityFrames:\s*(\d+)/);
  if (!continuity) errors.push('REEL_STYLE.transition.continuityFrames fehlt.');
  else if (Number(continuity[1]) > 4) errors.push(`Szenenübergang ist mit ${continuity[1]} Frames zu träge (max. 4).`);
  if (!tokens.includes('fadeToBlackForbidden: true')) errors.push('Fade-to-black muss zentral verboten sein.');
  if (!existsSync(resolve(root, 'src/brand/components/ReelStage.tsx'))) errors.push('Zentrale ReelStage-Komponente (SceneTransition/AnimationStage) fehlt.');

  if (!mechanismCue.includes('warning') || !mechanismCue.includes('money')) errors.push('MechanismCue besitzt keine semantischen Warn-/Geldfarben.');

  if (!renderValidated.includes("'--crf=14'")) errors.push('Finalrender verwendet nicht CRF 14.');
  if (!renderValidated.includes("'--image-format=png'")) errors.push('Finalrender verwendet keine PNG-Zwischenframes.');
  if (!renderValidated.includes("'--audio-bitrate=320k'")) errors.push('Finalrender verwendet nicht AAC 320k.');

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
console.log('✓ Premium-V3-Layout sitzt tiefer und nutzt einheitliche SceneHeader.');
console.log('✓ Captions V3 sind crisp, grün/weiß, ohne Glow-/Jump-/Scale-Regression.');
console.log('✓ Premium-Continuity und semantische Animationsfarben sind eingebunden.');
console.log('✓ Finalrender ist auf H.264 CRF14 + PNG-Zwischenframes + AAC320k abgesichert.');
