#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const [target, videoArg] = process.argv.slice(2);
if (!target || !videoArg) {
  console.error('Nutzung: node scripts/validate-animation-edge-bands-v1.mjs <Reel-Pfad> <Video.mp4>');
  process.exit(1);
}

const root = resolve(target);
const video = resolve(videoArg);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath) || !existsSync(video)) {
  console.error('Scene-Index oder Video fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const guard = index.reelQualityGuards;
if (guard?.id !== 'finanzneo-reel-quality-guards-v1' || guard.postRenderEdgeBandQaRequired !== true) {
  console.log('✓ Reel ohne Edge-Band-QA-V1 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const safe = guard.animationHorizontalSafeZone;
const fps = Number(index.video?.fps) || 30;
const maxRatio = Number(guard.edgeBandActivePixelRatioMax ?? 0.012);
const sampleW = 12;
const sampleH = 120;
const activeThreshold = 16;
const failures = [];

const readBand = (time, x, width) => {
  const result = spawnSync('ffmpeg', [
    '-v','error','-ss',time.toFixed(3),'-i',video,
    '-vf',`crop=${width}:${safe.bottom-safe.top}:${x}:${safe.top},scale=${sampleW}:${sampleH}:flags=area,format=gray`,
    '-frames:v','1','-f','rawvideo','-pix_fmt','gray','pipe:1',
  ], {encoding:null, maxBuffer:2*1024*1024});
  if (result.status !== 0 || !result.stdout || result.stdout.length < sampleW*sampleH) throw new Error(`Rand-Sample bei ${time.toFixed(2)} s nicht lesbar.`);
  const data = Buffer.from(result.stdout.subarray(0, sampleW*sampleH));
  let active = 0;
  for (const value of data) if (value > activeThreshold) active += 1;
  return active / data.length;
};

for (const scene of (index.scenes ?? []).filter((item) => item?.type === 'animation')) {
  for (const ratio of [0.2,0.5,0.8]) {
    const frame = Number(scene.startFrame ?? 0) + Math.max(1, Math.min(Number(scene.durationFrames ?? 1)-1, Math.round(Number(scene.durationFrames ?? 1)*ratio)));
    const time = frame / fps;
    try {
      const left = readBand(time, 0, Number(safe.left));
      const right = readBand(time, Number(safe.right), 1080-Number(safe.right));
      if (left > maxRatio) failures.push(`${scene.id} @ ${ratio}: linker Außenrand enthält ${(left*100).toFixed(2)}% aktive Pixel.`);
      if (right > maxRatio) failures.push(`${scene.id} @ ${ratio}: rechter Außenrand enthält ${(right*100).toFixed(2)}% aktive Pixel; Objekt kann abgeschnitten sein.`);
    } catch (error) {
      failures.push(`${scene.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

if (failures.length) {
  console.error('\nAnimation Edge-Band-QA nicht bestanden:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\n✓ Animation Edge-Band-QA bestanden: keine Animationsobjekte in den geschützten Außenrändern.');
