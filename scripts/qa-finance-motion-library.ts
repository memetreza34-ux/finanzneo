#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {mkdtempSync, readFileSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  FINANCE_MOTION_QA_LOCAL_FRAMES,
} from '../src/finance-motion/lab-config';

const ENTRY = 'src/index.ts';
const COMPOSITION = 'ReelsTestFinanceMotionLibraryV1';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const outDir = mkdtempSync(join(tmpdir(), 'finanzneo-finance-motion-qa-'));
const failures: string[] = [];

const hashFile = (path: string) =>
  createHash('sha256').update(readFileSync(path)).digest('hex');

const browser = spawnSync(npx, ['remotion', 'browser', 'ensure'], {encoding: 'utf8'});
if (browser.status !== 0) {
  console.error('Remotion-Browser konnte für Finance-Motion-QA nicht vorbereitet werden.');
  console.error(`${browser.stdout ?? ''}${browser.stderr ?? ''}`.trim());
  process.exit(1);
}

console.log(`Finance Motion QA: ${FINANCE_MOTION_LAB_IDS.length} Mechaniken × ${FINANCE_MOTION_QA_LOCAL_FRAMES.length} Checkpoints`);

try {
  for (const [index, id] of FINANCE_MOTION_LAB_IDS.entries()) {
    const hashes: string[] = [];

    for (const localFrame of FINANCE_MOTION_QA_LOCAL_FRAMES) {
      const globalFrame = index * FINANCE_MOTION_LAB_SEGMENT_FRAMES + localFrame;
      const output = resolve(outDir, `${String(index + 1).padStart(2, '0')}-${id}-${localFrame}.png`);
      const result = spawnSync(
        npx,
        [
          'remotion',
          'still',
          ENTRY,
          COMPOSITION,
          output,
          `--frame=${globalFrame}`,
          '--scale=0.5',
          '--log=error',
        ],
        {encoding: 'utf8'},
      );

      if (result.status !== 0) {
        failures.push(`${id}@${localFrame}: Render fehlgeschlagen: ${`${result.stdout ?? ''}${result.stderr ?? ''}`.trim()}`);
        continue;
      }

      const size = statSync(output).size;
      if (size < 4000) {
        failures.push(`${id}@${localFrame}: Render ist verdächtig klein (${size} Bytes).`);
      }
      hashes.push(hashFile(output));
    }

    if (hashes.length === FINANCE_MOTION_QA_LOCAL_FRAMES.length && new Set(hashes).size !== hashes.length) {
      failures.push(`${id}: Setup/Aktion/Ergebnis sind nicht in allen Checkpoints visuell verschieden.`);
    }

    if (!failures.some((failure) => failure.startsWith(`${id}@`) || failure.startsWith(`${id}:`))) {
      console.log(`✓ ${id}: Setup → Aktion → Ergebnis unterscheiden sich sichtbar.`);
    }
  }
} finally {
  rmSync(outDir, {recursive: true, force: true});
}

if (failures.length > 0) {
  console.error('\nFinance Motion QA fehlgeschlagen:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\n✓ Alle ${FINANCE_MOTION_LAB_IDS.length} Finance-Motion-Mechaniken bestehen die Multi-Frame-QA.`);
