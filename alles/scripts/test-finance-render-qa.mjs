#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-render-qa-'));
const video = path.join(tempRoot, 'fixture.mp4');
const qaDir = path.join(tempRoot, 'qa');
const run = (command, args) => {
  const result = spawnSync(command, args, {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} fehlgeschlagen: ${result.status}`);
};

try {
  run('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', 'color=c=0x12351f:s=1080x1920:r=30:d=60',
    '-f', 'lavfi',
    '-i', 'sine=frequency=440:sample_rate=48000:duration=60',
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
    '-t', '60',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '35',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    video,
  ]);

  run(process.execPath, ['scripts/run-finance-render-qa.mjs', video, `--out=${qaDir}`]);
  const reportFile = path.join(qaDir, 'report.json');
  if (!fs.existsSync(reportFile)) throw new Error('Render-QA-Bericht wurde nicht erzeugt.');
  const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  if (!report.passed) throw new Error(`Render-QA-Fixture ist fehlgeschlagen: ${JSON.stringify(report.findings)}`);
  if (report.metrics.controlFrameCount !== 8) throw new Error('Es wurden nicht acht Kontrollframes erzeugt.');
  console.log('✓ Synthetischer Finance-Render-QA-Test bestanden.');
} finally {
  fs.rmSync(tempRoot, {recursive: true, force: true});
}
