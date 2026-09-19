#!/usr/bin/env node
// Rendert die Phase-1-Animationen, bevor Phase 2 überhaupt anfängt.
//
// Die produktive Composition entsteht erst in Phase 3 und braucht dafür echte
// Wortzeiten — also das fertige Voiceover. Ohne diesen Schritt sieht die erste
// Animation niemand, bevor der Nutzer 19 Bilder erzeugt und sechs Minuten
// eingesprochen hat. Beim Notgroschen-Video war der Validator grün und die Szene
// trotzdem eine Texttafel; grün heißt nicht ansehnlich.
//
// Die Vorschau setzt deshalb feste Platzhalterzeiten: jede Animationsszene läuft
// gleich lang, hintereinander, mit ihrer Kennung im Bild. Sie ist ausdrücklich
// kein Schnitt und keine Timeline — nur ein Blick auf die Mechanik.

import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const [target, ...rest] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:phase1:preview -- youtube/<Woche>/<Thema> [--frames 90]');
  process.exit(1);
}

const framesArgIndex = rest.indexOf('--frames');
/**
 * Voreinstellung großzügig, nicht knapp.
 *
 * Eine Animation baut ihren Endzustand oft erst nach 150 bis 190 Frames auf. Mit
 * einer zu kurzen Kachel sieht man sie immer nur mittendrin und hält sie für
 * leer — beim ersten Lauf lagen zehn von fünfzehn Szenen scheinbar unter acht
 * Prozent Füllung, weil die Vorschau bei 90 Frames abgeschnitten hat.
 */
const framesPerScene = framesArgIndex >= 0 ? Number(rest[framesArgIndex + 1]) : 210;
if (!Number.isFinite(framesPerScene) || framesPerScene < 30) {
  console.error('--frames braucht eine Zahl ab 30.');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '04-projekt/visual-index.json');
if (!existsSync(indexPath)) {
  console.error(`\n✗ visual-index.json fehlt unter ${target}.`);
  process.exit(1);
}

type Visual = {
  id: string;
  type: string;
  headline?: string;
  mechanicId?: string;
  animationExport?: string;
};

const index = JSON.parse(readFileSync(indexPath, 'utf8')) as {visuals: Visual[]};
const motion = index.visuals.filter((visual) => visual.type !== 'image');
if (motion.length === 0) {
  console.error('\n✗ Keine Motion-Szenen im Visual-Index.');
  process.exit(1);
}

const outDirectory = resolve('src/youtube/projects');
const slug = relative(resolve('youtube'), root).split(sep).join('/');
const fileSafe = `${slug.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-preview`;
const componentName = `Preview${fileSafe.replace(/-([a-z0-9])/gi, (_, c: string) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')}`;

const importPath = (from: string, to: string) => {
  const raw = relative(from, to).split(sep).join('/').replace(/\.tsx?$/, '');
  return raw.startsWith('.') ? raw : `./${raw}`;
};

const imports: string[] = [];
const entries: string[] = [];

for (const visual of motion) {
  if (!visual.animationExport) {
    console.error(`\n✗ ${visual.id}: animationExport fehlt.`);
    process.exit(1);
  }
  const sourceFile = resolve(root, '04-projekt/VISUALS', visual.id, 'animation.tsx');
  if (!existsSync(sourceFile)) {
    console.error(`\n✗ ${visual.id}: animation.tsx fehlt.`);
    process.exit(1);
  }
  imports.push(`import {${visual.animationExport}} from '${importPath(outDirectory, sourceFile)}';`);
  const caption = `${visual.id} · ${visual.type} · ${(visual.headline ?? '').replace(/'/g, '')}`;
  entries.push(`  {id: '${visual.id}', caption: '${caption}', mechanic: '${visual.mechanicId ?? ''}', Component: ${visual.animationExport}},`);
}

const lines = [
  '// GENERIERT von scripts/youtube-preview-animations.ts — nicht von Hand bearbeiten.',
  `// Quelle: ${slug}`,
  `// Neu bauen: npm run youtube:phase1:preview -- youtube/${slug}`,
  '//',
  '// Vorschau mit Platzhalterzeiten, kein Schnitt. Jede Szene läuft gleich lang,',
  '// damit die Mechanik sichtbar wird, bevor es echte Wortzeiten gibt.',
  '',
  "import React from 'react';",
  "import {AbsoluteFill, Sequence} from 'remotion';",
  `import {YouTubeAnimationFrame, YouTubeStage} from '${importPath(outDirectory, resolve('src/youtube/components'))}';`,
  ...imports,
  '',
  `const FRAMES_PER_SCENE = ${framesPerScene};`,
  '',
  'const SCENES = [',
  ...entries,
  '];',
  '',
  `export const ${componentName}Frames = SCENES.length * FRAMES_PER_SCENE;`,
  `export const ${componentName}Id = 'YouTubePreview-${fileSafe}';`,
  '',
  `export const ${componentName}: React.FC = () => (`,
  '  <YouTubeStage>',
  '    {SCENES.map((scene, index) => (',
  '      <Sequence key={scene.id} from={index * FRAMES_PER_SCENE} durationInFrames={FRAMES_PER_SCENE}>',
  '        <AbsoluteFill>',
  '          <div style={{',
  "            position: 'absolute', left: 60, top: 54, fontSize: 34, fontWeight: 900,",
  "            color: '#F7F7F2', fontFamily: 'Arial, Helvetica, sans-serif',",
  '          }}>{scene.caption}</div>',
  '          <div style={{',
  "            position: 'absolute', left: 60, top: 100, fontSize: 24, fontWeight: 700,",
  "            color: '#8A9299', fontFamily: 'Arial, Helvetica, sans-serif',",
  '          }}>{scene.mechanic}</div>',
  '          <YouTubeAnimationFrame>',
  '            <scene.Component />',
  '          </YouTubeAnimationFrame>',
  '        </AbsoluteFill>',
  '      </Sequence>',
  '    ))}',
  '  </YouTubeStage>',
  ');',
  '',
];

writeFileSync(resolve(outDirectory, `${fileSafe}.tsx`), lines.join('\n'));

// Registry der Vorschauen neu aufbauen.
//
// Vorschauen gehören nicht zur Produktion — sie tragen Platzhalterzeiten und
// eine eingeblendete Kennung. Sie stehen deshalb in einer eigenen Datei, die
// unter den Experimenten eingebunden ist, und nicht in der Produktions-Registry,
// die `youtube:phase3:build` schreibt.
const previewFiles = readdirSync(outDirectory)
  .filter((entry) => entry.endsWith('-preview.tsx'))
  .sort();

const registry: string[] = [
  '// GENERIERT von scripts/youtube-preview-animations.ts — nicht von Hand bearbeiten.',
  '',
  "import React from 'react';",
  "import {Composition} from 'remotion';",
  "import {YOUTUBE_FORMAT} from '../layout';",
];
const previewTags: string[] = [];

for (const file of previewFiles) {
  const base = file.replace(/\.tsx$/, '');
  const name = `Preview${base.replace(/-([a-z0-9])/gi, (_, c: string) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')}`;
  registry.push(`import {${name}, ${name}Frames, ${name}Id} from './${base}';`);
  previewTags.push(
    '    <Composition',
    `      key={${name}Id}`,
    `      id={${name}Id}`,
    `      component={${name}}`,
    `      durationInFrames={${name}Frames}`,
    '      fps={YOUTUBE_FORMAT.fps}',
    '      width={YOUTUBE_FORMAT.width}',
    '      height={YOUTUBE_FORMAT.height}',
    '    />',
  );
}

registry.push(
  '',
  'export const YouTubePreviewCompositions: React.FC = () => (',
  '  <>',
  ...previewTags,
  '  </>',
  ');',
  '',
);
writeFileSync(resolve(outDirectory, 'previews.tsx'), registry.join('\n'));

console.log(`\n✓ Vorschau gebaut: YouTubePreview-${fileSafe}`);
console.log(`  Szenen        ${motion.length} à ${framesPerScene} Frames`);
console.log(`  Datei         src/youtube/projects/${fileSafe}.tsx`);
console.log('');
console.log('  Rendern:');
console.log(`  npx remotion render src/index.ts YouTubePreview-${fileSafe} out/preview-${fileSafe}.mp4`);
