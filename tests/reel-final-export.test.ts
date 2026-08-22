import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {analyzeReelFinalExport} from '../scripts/lib/reel-final-export.mjs';

const createRoot = () => mkdtempSync(join(tmpdir(), 'finanzneo-reel-export-'));
const write = (root: string, relativePath: string) => {
  const path = join(root, relativePath);
  mkdirSync(join(path, '..'), {recursive: true});
  writeFileSync(path, Buffer.from('media'));
};

test('Finaler Reel-Export verlangt Video und Cover gemeinsam in 06-export', () => {
  const root = createRoot();
  try {
    write(root, '06-export/reel.mp4');
    write(root, '06-export/cover.png');
    const result = analyzeReelFinalExport(root);
    assert.equal(result.ready, true);
    assert.deepEqual(result.blockers, []);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Finaler Reel-Export blockiert ein fehlendes Cover', () => {
  const root = createRoot();
  try {
    write(root, '06-export/reel.mp4');
    const result = analyzeReelFinalExport(root);
    assert.equal(result.ready, false);
    assert.ok(result.blockers.includes('Finales Cover fehlt oder ist leer: 06-export/cover.png'));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Finaler Reel-Export blockiert zusätzliche Videoentwürfe', () => {
  const root = createRoot();
  try {
    write(root, '06-export/reel.mp4');
    write(root, '06-export/cover.png');
    write(root, '06-export/entwurf.mp4');
    const result = analyzeReelFinalExport(root);
    assert.equal(result.ready, false);
    assert.ok(result.blockers.includes('06-export/ muss genau ein MP4 enthalten; gefunden: 2.'));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
