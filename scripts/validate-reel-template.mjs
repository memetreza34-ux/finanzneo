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
  'src/brand/components/ReelStage.tsx',
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
  if (!template.includes('SceneContinuityFrame')) errors.push('Continuity zwischen Szenen fehlt.');
  if (!template.includes('CONTENT_TOP = REEL_STYLE.visual.top')) errors.push('ReelTemplate liest Visual-Top nicht aus REEL_STYLE.');
  if (!template.includes('FORMAT.vertical.height - REEL_STYLE.visual.bottom')) errors.push('ReelTemplate liest Visual-Bottom nicht aus REEL_STYLE.');
  if (/<Captions[^/>]*(?:bottom|left|right|size)=\{/.test(template)) errors.push('ReelTemplate überschreibt Caption-Maße lokal.');
  if (!template.includes('VerticalSafeAreaGuide')) errors.push('ReelTemplate besitzt kein Safe-Area-Prüfraster.');
  if (!template.includes("from '../../design-system'")) errors.push('ReelTemplate importiert nicht aus dem zentralen Designsystem.');

  // V5-Layout exakt.
  if (!/caption:\s*\{[\s\S]*?bottom:\s*340\b/.test(tokens)) errors.push('V5 Caption bottom=340 fehlt in REEL_STYLE.');
  if (!/header:\s*\{[\s\S]*?top:\s*154\b/.test(tokens)) errors.push('V5 Header top=154 fehlt in REEL_STYLE.');
  if (!/visual:\s*\{[\s\S]*?top:\s*320\b[\s\S]*?bottom:\s*1480\b/.test(tokens)) errors.push('V5 Visualzone 320–1480 fehlt in REEL_STYLE.');
  if (!tokens.includes("presentation: 'plain'")) errors.push('V5 Header muss presentation=plain sein.');
  if (!tokens.includes('headlineColor: C.whiteSoft')) errors.push('V5 Headertext muss neutral weiß sein.');

  if (template.includes('highlight={C.gold}')) errors.push('Goldenes Karaoke-Active-Word ist verboten.');
  if (template.includes('perGroup={3}')) errors.push('Alte 3-Wort-Caption-Gruppen sind verboten.');

  if (!captions.includes('active ? C.accentLt : C.white')) errors.push('Captions erzwingen nicht hellgrün für aktiv und weiß für Rest.');
  if (!captions.includes('REEL_STYLE')) errors.push('Captions liest Maße nicht aus REEL_STYLE.');
  if (!captions.includes('bottom = S.bottom') || !captions.includes('size = S.fontSize')) errors.push('Captions nutzt nicht zentrale Position/Größe.');
  if (!captions.includes('background: background ?')) errors.push('Caption-Backplate fehlt.');
  if (/WebkitTextStroke/.test(captions)) errors.push('WebkitTextStroke ist auf Untertiteln verboten.');

  const captionWeight = tokens.match(/caption:\s*\{[\s\S]*?fontWeight:\s*(\d+)/);
  if (captionWeight && Number(captionWeight[1]) > 800) errors.push(`Untertitel-Schriftstärke ${captionWeight[1]} ist zu fett.`);
  const captionSize = tokens.match(/caption:\s*\{[\s\S]*?fontSize:\s*(\d+)/);
  if (captionSize && Number(captionSize[1]) > 54) errors.push(`Untertitel-Grundgröße ${captionSize[1]} px ist zu groß.`);
  if (captions.includes('translateY(-6px)')) errors.push('Caption-Word-Jump ist verboten.');
  if (!captions.includes('holdSeconds')) errors.push('Caption-Hold über kurze Pausen fehlt.');

  // Plain Header V5: normale Typografie, keine Kapsel/UI-Box.
  if (!sceneHeader.includes('REEL_STYLE')) errors.push('SceneHeader liest Maße nicht aus REEL_STYLE.');
  if (!sceneHeader.includes('Icon')) errors.push('SceneHeader verwendet kein Icon.');
  if (!sceneHeader.includes('iconColorForTone')) errors.push('SceneHeader besitzt keine semantische Icon-Farblogik.');
  if (!sceneHeader.includes("justifyContent: 'center'")) errors.push('SceneHeader muss mittig zentriert sein.');
  if (!sceneHeader.includes("textTransform: 'none'")) errors.push('SceneHeader muss automatische ALL-CAPS-Transformation verhindern.');
  if (/background:\s*['"]rgba\(/.test(sceneHeader) || /borderRadius\s*:/.test(sceneHeader) || /border\s*:/.test(sceneHeader)) {
    errors.push('V5 SceneHeader darf keine Capsule/Box mit Background/Border/Radius rendern.');
  }
  if (!sceneHeader.includes('color: H.headlineColor')) errors.push('SceneHeader muss neutralen Headertext aus REEL_STYLE rendern.');

  const continuity = tokens.match(/continuityFrames:\s*(\d+)/);
  if (!continuity) errors.push('REEL_STYLE.transition.continuityFrames fehlt.');
  else if (Number(continuity[1]) !== 3) errors.push(`V5 Szenenübergang muss 3 Frames sein, aktuell ${continuity[1]}.`);
  if (!tokens.includes('fadeToBlackForbidden: true')) errors.push('Fade-to-black muss zentral verboten sein.');

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
console.log('✓ Reel V5: Plain Header Y154 · Visual 320–1480 · Caption bottom340.');
console.log('✓ Captions sind crisp, grün/weiß und zentral gesteuert.');
console.log('✓ Continuity bleibt bei 3 Frames; semantische Animationsfarben sind eingebunden.');
console.log('✓ Finalrender ist auf H.264 CRF14 + PNG-Zwischenframes + AAC320k abgesichert.');
