#!/usr/bin/env node
// Erzeugt die Remotion-Composition eines YouTube-Projekts.
//
// Die Szenen stehen in visual-index.json, die Schnitte kommen aus den Wortzeiten
// und die Animationen liegen als versiegelte animation.tsx im Projekt. Remotion
// braucht daraus eine registrierte Composition — dieses Skript schreibt sie.
//
// Generiert, nicht von Hand gepflegt: sonst driftet die Composition von den
// Projektdaten weg, genau wie früher die Flow-Handoff-Datei.

import {existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {loadYouTubeProject} from './lib/youtube-project';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:phase3:build -- youtube/<Woche>/<Thema>');
  process.exit(1);
}

let project;
try {
  project = loadYouTubeProject(target);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const outDirectory = resolve('src/youtube/projects');
mkdirSync(outDirectory, {recursive: true});

const fileSafe = project.slug.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const componentName = `Video${fileSafe.replace(/-([a-z0-9])/gi, (_, c: string) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')}`;
const outFile = resolve(outDirectory, `${fileSafe}.tsx`);

const importPath = (from: string, to: string) => {
  const raw = relative(from, to).split(sep).join('/').replace(/\.tsx?$/, '');
  return raw.startsWith('.') ? raw : `./${raw}`;
};

const motionScenes = project.timeline.scenes.filter((scene) => scene.type !== 'image');
const imports: string[] = [];
const bindings: string[] = [];

for (const scene of motionScenes) {
  const visual = project.index.visuals.find((entry) => entry.id === scene.id);
  const exportName = visual?.animationExport;
  if (!exportName) {
    console.error(`\n✗ ${scene.id}: animationExport fehlt im Visual-Index.`);
    process.exit(1);
  }
  const sourceFile = resolve(project.root, '04-projekt/VISUALS', scene.id, 'animation.tsx');
  if (!existsSync(sourceFile)) {
    console.error(`\n✗ ${scene.id}: animation.tsx fehlt unter 04-projekt/VISUALS/${scene.id}/.`);
    process.exit(1);
  }
  imports.push(`import {${exportName}} from '${importPath(outDirectory, sourceFile)}';`);
  bindings.push(`  '${scene.id}': ${exportName},`);
}

const lines = [
  '// GENERIERT von scripts/youtube-build-composition.ts — nicht von Hand bearbeiten.',
  `// Quelle: ${project.slug}`,
  `// Neu bauen: npm run youtube:phase3:build -- youtube/${project.slug}`,
  '',
  "import React from 'react';",
  `import {YouTubeVideo} from '${importPath(outDirectory, resolve('src/youtube/YouTubeVideo'))}';`,
  `import type {YouTubeTimeline} from '${importPath(outDirectory, resolve('src/youtube/timeline'))}';`,
  `import timelineJson from './${fileSafe}.timeline.json';`,
  ...imports,
  '',
  'const timeline = timelineJson as YouTubeTimeline;',
  '',
  `export const ${componentName}Frames = timeline.durationInFrames;`,
  `export const ${componentName}Id = '${project.compositionId}';`,
  '',
  `export const ${componentName}: React.FC = () => (`,
  '  <YouTubeVideo',
  '    timeline={timeline}',
  `    assetBase="${project.assetBase}"`,
  project.audioFileName ? `    audioFileName="${project.audioFileName}"` : '    // kein Voiceover gefunden',
  '    animations={{',
  ...bindings,
  '    }}',
  '  />',
  ');',
  '',
];

writeFileSync(resolve(outDirectory, `${fileSafe}.timeline.json`), `${JSON.stringify(project.timeline, null, 2)}\n`);
writeFileSync(outFile, lines.join('\n'));

// Registry neu aufbauen, damit gelöschte Projekte nicht als tote Imports bleiben.
const projectFiles = readdirSync(outDirectory)
  .filter((entry) => entry.endsWith('.tsx') && entry !== 'index.tsx')
  .sort();

const registryLines = [
  '// GENERIERT von scripts/youtube-build-composition.ts — nicht von Hand bearbeiten.',
  '',
  "import React from 'react';",
  "import {Composition} from 'remotion';",
  "import {YOUTUBE_FORMAT} from '../layout';",
];
const entries: string[] = [];
for (const file of projectFiles) {
  const base = file.replace(/\.tsx$/, '');
  const name = `Video${base.replace(/-([a-z0-9])/gi, (_, c: string) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')}`;
  registryLines.push(`import {${name}, ${name}Frames, ${name}Id} from './${base}';`);
  entries.push([
    '    <Composition',
    `      key={${name}Id}`,
    `      id={${name}Id}`,
    `      component={${name}}`,
    `      durationInFrames={${name}Frames}`,
    '      fps={YOUTUBE_FORMAT.fps}',
    '      width={YOUTUBE_FORMAT.width}',
    '      height={YOUTUBE_FORMAT.height}',
    '    />',
  ].join('\n'));
}
registryLines.push(
  '',
  'export const YouTubeProjectCompositions: React.FC = () => (',
  '  <>',
  entries.join('\n\n'),
  '  </>',
  ');',
  '',
);
writeFileSync(resolve(outDirectory, 'index.tsx'), registryLines.join('\n'));

// Verwaiste Timeline-Dateien entfernen.
for (const entry of readdirSync(outDirectory)) {
  if (!entry.endsWith('.timeline.json')) continue;
  const base = entry.replace(/\.timeline\.json$/, '');
  if (!projectFiles.includes(`${base}.tsx`)) unlinkSync(resolve(outDirectory, entry));
}

console.log(`\n✓ Composition gebaut: ${project.compositionId}`);
console.log(`  Szenen        ${project.timeline.scenes.length} (${motionScenes.length} mit Animation)`);
console.log(`  Dauer         ${(project.timeline.durationInFrames / project.timeline.fps).toFixed(1)} s`);
console.log(`  Datei         src/youtube/projects/${fileSafe}.tsx`);
if (project.timeline.notes.length > 0) {
  console.log(`\n${project.timeline.notes.length} Hinweis(e) zur Szenenzuordnung — vor dem Render lesen:`);
  project.timeline.notes.forEach((note) => console.log(`  - ${note}`));
}
