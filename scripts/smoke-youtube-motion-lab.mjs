#!/usr/bin/env node
import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const outputRoot = resolve('out/.youtube-motion-lab-smoke');
const frames = [60, 180, 300, 420, 540, 660, 780, 900, 1020];
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

rmSync(outputRoot, {recursive: true, force: true});
mkdirSync(outputRoot, {recursive: true});

try {
  for (const frame of frames) {
    const output = resolve(outputRoot, `frame-${String(frame).padStart(4, '0')}.png`);
    const result = spawnSync(npx, [
      'remotion',
      'still',
      'src/index.ts',
      'YouTubeFinanceMotionLab',
      output,
      `--frame=${frame}`,
      '--log=error',
    ], {stdio: 'inherit'});

    if (result.status !== 0 || !existsSync(output)) {
      console.error(`YouTube-Finance-Motion-Lab Smoke fehlgeschlagen bei Frame ${frame}.`);
      process.exit(result.status ?? 1);
    }
  }

  console.log(`✓ YouTube-Finance-Motion-Lab: ${frames.length} repräsentative 16:9-Frames erfolgreich gerendert.`);
} finally {
  rmSync(outputRoot, {recursive: true, force: true});
}
