import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — Node-ESM-Hilfsmodul.
import {ensureFinanceProjectStructure} from './lib/finance-project-structure.mjs';

const root = process.cwd();
const script = path.join(root, 'scripts/ingest-finance-assets.mjs');
const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance Asset-Ingest', () => {
  it('liest den Reel-Slug und erfasst nur Runtime-Dateien aus 01, 02 und 03', async () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-assets-'));
    tempDirs.push(reelDir);
    const paths = ensureFinanceProjectStructure(reelDir);
    fs.writeFileSync(paths.scenePlan, JSON.stringify({slug: 'richtiger-reel-slug'}, null, 2));
    await sharp({create: {width: 1080, height: 1920, channels: 4, background: {r: 10, g: 30, b: 20, alpha: 1}}}).png().toFile(path.join(paths.imagesDir, '01-hook.png'));
    await sharp({create: {width: 1080, height: 1920, channels: 4, background: {r: 20, g: 20, b: 20, alpha: 1}}}).png().toFile(path.join(paths.exportDir, 'darf-nicht-eingelesen.png'));
    fs.writeFileSync(path.join(paths.imagePromptsDir, '01-hook.txt'), 'Prompt');
    fs.writeFileSync(path.join(paths.pdfDir, 'guide.pdf'), '%PDF-1.4\nfixture\n');
    fs.writeFileSync(path.join(paths.projectFilesDir, 'interne-daten.json'), '{}');

    const result = spawnSync(process.execPath, [script, reelDir], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(0);
    const manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));
    expect(manifest.slug).toBe('richtiger-reel-slug');
    expect(manifest.assets.some((asset: any) => asset.id === 'images-01-hook')).toBe(true);
    expect(manifest.assets.some((asset: any) => asset.file === '02-bilder/images/01-hook.png')).toBe(true);
    expect(manifest.assets.some((asset: any) => asset.file.startsWith('05-export/'))).toBe(false);
    expect(manifest.assets.some((asset: any) => asset.file.startsWith('02-bilder/prompts/'))).toBe(false);
    expect(manifest.assets.some((asset: any) => asset.file.startsWith('04-pdf/'))).toBe(false);
    expect(manifest.assets.some((asset: any) => asset.file.startsWith('06-projektdateien/'))).toBe(false);
  });
});
