#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {mkdtempSync, readFileSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {ensureBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {
  FINANCE_MOTION_CORE_IDS,
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  FINANCE_MOTION_QA_LOCAL_FRAMES,
} from '../src/finance-motion/lab-config';

const ENTRY = 'src/index.ts';
const SCALE = 0.5;
// Dieselben Schwellen und Stichproben wie die Future-V3-Render-QA
// (validate-future-production-render-v3.mjs): Ausschnitt X92–988 / Y390–1230,
// Graustufe > 18, Stichproben bei 20/50/80 % der Szene.
const OCCUPANCY_CROP = {x: 92, y: 390, width: 896, height: 840};
const OCCUPANCY_SAMPLES = [0.2, 0.5, 0.8] as const;
const MIN_PEAK = 0.15;
const MIN_MEDIAN = 0.12;

// Ein einziges Bundle pro Lauf in einem eigenen Temp-Ordner, der am Ende
// gelöscht wird. Früher legte jeder Frame ein eigenes Bundle an und ließ es
// liegen — ein Lauf hinterließ so mehrere Gigabyte.
const workDir = mkdtempSync(join(tmpdir(), 'finanzneo-finance-motion-qa-'));
const failures: string[] = [];

const hashFile = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

const activeRatio = (path: string): number => {
  const crop = Object.values(OCCUPANCY_CROP).map((value) => Math.round(value * SCALE));
  const [x, y, width, height] = crop;
  const result = spawnSync(
    'ffmpeg',
    ['-v', 'error', '-i', path, '-vf', `crop=${width}:${height}:${x}:${y},scale=96:104:flags=area,format=gray`, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', 'pipe:1'],
    {encoding: null, maxBuffer: 1024 * 1024},
  );
  if (result.error || result.status !== 0 || !result.stdout) throw new Error(`ffmpeg konnte ${path} nicht lesen.`);
  const bytes = result.stdout.subarray(0, 96 * 104);
  let active = 0;
  for (const value of bytes) if (value > 18) active += 1;
  return active / bytes.length;
};

const run = async () => {
  await ensureBrowser();
  const serveUrl = await bundle({entryPoint: resolve(ENTRY), outDir: join(workDir, 'bundle')});

  const checkLab = async (compositionId: string, ids: readonly string[], measureOccupancy: boolean) => {
    const composition = await selectComposition({serveUrl, id: compositionId});
    console.log(`\n${compositionId}: ${ids.length} Mechaniken × ${FINANCE_MOTION_QA_LOCAL_FRAMES.length} Checkpoints`);

    for (const [index, id] of ids.entries()) {
      const still = async (localFrame: number) => {
        const output = join(workDir, `${compositionId}-${String(index + 1).padStart(2, '0')}-${id}-${localFrame}.png`);
        await renderStill({composition, serveUrl, frame: index * FINANCE_MOTION_LAB_SEGMENT_FRAMES + localFrame, output, scale: SCALE});
        return output;
      };

      const hashes: string[] = [];
      for (const localFrame of FINANCE_MOTION_QA_LOCAL_FRAMES) {
        const output = await still(localFrame);
        const size = statSync(output).size;
        if (size < 4000) failures.push(`${compositionId}/${id}@${localFrame}: Render ist verdächtig klein (${size} Bytes).`);
        hashes.push(hashFile(output));
      }
      if (new Set(hashes).size !== hashes.length) {
        failures.push(`${compositionId}/${id}: Setup/Aktion/Ergebnis sind nicht in allen Checkpoints visuell verschieden.`);
      }

      let occupancyNote = '';
      if (measureOccupancy) {
        const ratios: number[] = [];
        for (const sample of OCCUPANCY_SAMPLES) {
          ratios.push(activeRatio(await still(Math.round(FINANCE_MOTION_LAB_SEGMENT_FRAMES * sample))));
        }
        const sorted = [...ratios].sort((left, right) => left - right);
        const peak = sorted[sorted.length - 1];
        const median = sorted[Math.floor(sorted.length / 2)];
        if (peak < MIN_PEAK) failures.push(`${compositionId}/${id}: Hauptmechanik zu klein (Peak ${peak.toFixed(3)} < ${MIN_PEAK}).`);
        if (median < MIN_MEDIAN) failures.push(`${compositionId}/${id}: zu wenig aktive Visualfläche (Median ${median.toFixed(3)} < ${MIN_MEDIAN}).`);
        occupancyNote = ` · Belegung Peak ${peak.toFixed(2)} / Median ${median.toFixed(2)}`;
      }

      if (!failures.some((failure) => failure.startsWith(`${compositionId}/${id}`))) {
        console.log(`✓ ${id}: Setup → Aktion → Ergebnis unterscheiden sich sichtbar${occupancyNote}.`);
      }
    }
  };

  await checkLab('ReelsTestFinanceMotionCore', FINANCE_MOTION_CORE_IDS, true);
  await checkLab('ReelsTestFinanceMotionLibraryV1', FINANCE_MOTION_LAB_IDS, false);
};

run()
  .catch((error: unknown) => {
    failures.push(`QA abgebrochen: ${error instanceof Error ? error.message : String(error)}`);
  })
  .finally(() => {
    rmSync(workDir, {recursive: true, force: true});
    if (failures.length > 0) {
      console.error('\nFinance Motion QA fehlgeschlagen:\n');
      for (const failure of failures) console.error(`- ${failure}`);
      process.exit(1);
    }
    console.log(`\n✓ ${FINANCE_MOTION_CORE_IDS.length} Kern-Mechaniken bestehen Multi-Frame- und Belegungs-QA.`);
    console.log(`✓ Alle ${FINANCE_MOTION_LAB_IDS.length} Library-Mechaniken bestehen die Multi-Frame-QA.`);
  });
