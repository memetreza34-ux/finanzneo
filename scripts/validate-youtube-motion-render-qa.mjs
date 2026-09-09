#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {requiresYouTubeMotion} from './lib/youtube-motion-contract.mjs';
import {MOTION_RENDER_QA, VISUAL_INDEX, YOUTUBE_VIDEO_FPS, YOUTUBE_VIDEO_HEIGHT, YOUTUBE_VIDEO_WIDTH} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:motion:qa -- youtube/<Projekt>');
  process.exit(1);
}
const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const indexPath = resolve(root, VISUAL_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${VISUAL_INDEX} fehlt.`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const motion = (index.visuals ?? []).filter(requiresYouTubeMotion);
if (!motion.length) {
  console.error('Keine Motion-Visuals gefunden.');
  process.exit(1);
}

const tmpDir = resolve(root, '.motion-render-qa');
rmSync(tmpDir, {recursive: true, force: true});
mkdirSync(tmpDir, {recursive: true});
const entryPath = resolve(root, '.motion-render-qa-entry.tsx');

const imports = motion.map((visual, i) => {
  const importPath = `./${visual.animationSourceFile.replace(/\\/g, '/').replace(/\.tsx$/, '')}`;
  return `import {${visual.animationExport} as Motion${i}} from '${importPath}';`;
}).join('\n');
const comps = motion.map((visual, i) => `<Composition id="QAMotion${String(i + 1).padStart(2, '0')}" component={Motion${i}} durationInFrames={${Number(visual.previewDurationFrames)}} fps={${YOUTUBE_VIDEO_FPS}} width={${YOUTUBE_VIDEO_WIDTH}} height={${YOUTUBE_VIDEO_HEIGHT}} />`).join('\n');
writeFileSync(entryPath, `import React from 'react';\nimport {Composition, registerRoot} from 'remotion';\n${imports}\nconst Root: React.FC = () => <>${comps}</>;\nregisterRoot(Root);\n`);

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {encoding: 'utf8', ...options});
  if (result.status !== 0) {
    console.error(result.stdout ?? '');
    console.error(result.stderr ?? '');
    throw new Error(`${command} fehlgeschlagen (${result.status}).`);
  }
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
};
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const brightnessOf = (path) => {
  const text = run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', path, '-vf', 'signalstats,metadata=print:file=-', '-frames:v', '1', '-f', 'null', '-']);
  const match = text.match(/lavfi\.signalstats\.YAVG=([0-9.]+)/);
  return match ? Number(match[1]) : NaN;
};
const ssimOf = (a, b) => {
  const text = run('ffmpeg', ['-hide_banner', '-loglevel', 'info', '-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-']);
  const matches = [...text.matchAll(/All:([0-9.]+)/g)];
  return matches.length ? Number(matches.at(-1)[1]) : NaN;
};

const failures = [];
const report = [];
try {
  for (let i = 0; i < motion.length; i += 1) {
    const visual = motion[i];
    const duration = Number(visual.previewDurationFrames);
    const frames = [0, 0.25, 0.5, 0.75, 0.96].map((ratio) => Math.min(duration - 1, Math.round((duration - 1) * ratio)));
    const files = [];
    for (let j = 0; j < frames.length; j += 1) {
      const file = resolve(tmpDir, `${visual.id}-${j}.png`);
      run(npx, ['remotion', 'still', entryPath, `QAMotion${String(i + 1).padStart(2, '0')}`, file, `--frame=${frames[j]}`], {stdio: ['ignore', 'pipe', 'pipe']});
      files.push(file);
    }

    const brightness = files.map(brightnessOf);
    const ssim = [];
    for (let j = 1; j < files.length; j += 1) ssim.push(ssimOf(files[j - 1], files[j]));
    const nonBlank = brightness.filter((value) => Number.isFinite(value) && value > 2).length;
    const changedPairs = ssim.filter((value) => Number.isFinite(value) && value < 0.992).length;
    const averageSsim = ssim.filter(Number.isFinite).reduce((sum, value) => sum + value, 0) / Math.max(1, ssim.filter(Number.isFinite).length);

    if (nonBlank < 4) failures.push(`${visual.id}: ${nonBlank}/5 QA-Frames besitzen ausreichend sichtbaren Inhalt; mindestens 4 nötig.`);
    if (changedPairs < 2) failures.push(`${visual.id}: nur ${changedPairs}/4 QA-Übergänge verändern das Bild deutlich. Motion ist visuell zu statisch.`);
    if (Number.isFinite(averageSsim) && averageSsim > 0.995) failures.push(`${visual.id}: durchschnittliche Frame-Ähnlichkeit ${averageSsim.toFixed(4)} ist zu hoch.`);

    report.push({
      id: visual.id,
      qualityTier: visual.qualityTier,
      previewDurationFrames: duration,
      sampledFrames: frames,
      brightness: brightness.map((value) => Number.isFinite(value) ? Number(value.toFixed(3)) : null),
      adjacentSsim: ssim.map((value) => Number.isFinite(value) ? Number(value.toFixed(5)) : null),
      changedPairs,
      passed: nonBlank >= 4 && changedPairs >= 2 && (!Number.isFinite(averageSsim) || averageSsim <= 0.995),
    });
  }
} catch (error) {
  failures.push(error.message);
} finally {
  rmSync(entryPath, {force: true});
  rmSync(tmpDir, {recursive: true, force: true});
}

if (failures.length) {
  console.error('\nYouTube Motion V3 Render-QA verletzt:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const out = resolve(root, MOTION_RENDER_QA);
mkdirSync(resolve(out, '..'), {recursive: true});
writeFileSync(out, `${JSON.stringify({
  version: 'finanzneo-youtube-motion-render-qa-v1',
  motionStandardId: index.motionStandard?.id ?? null,
  generatedAt: new Date().toISOString(),
  sampleStrategy: '0-25-50-75-96-percent',
  report,
}, null, 2)}\n`);

console.log(`\n✓ YouTube Motion V3 Render-QA erfüllt: ${motion.length} Motion-Visuals.`);
console.log(`  QA-Bericht: ${MOTION_RENDER_QA}`);
