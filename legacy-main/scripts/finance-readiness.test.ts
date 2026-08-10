import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — Node-ESM-Hilfsmodul.
import {ensureFinanceProjectStructure, financeProjectPaths, promptFileName, suggestedImageFileName} from './lib/finance-project-structure.mjs';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';

const repoRoot = process.cwd();
const requiredMediaScript = path.join(repoRoot, 'scripts/check-finance-required-media.mjs');
const newReelScript = path.join(repoRoot, 'scripts/new-finance-reel.mjs');
const tempDirs: string[] = [];

// Es gibt aktuell kein automatisiertes Bildpromptsystem (Stil wird neu definiert).
// Die Fixture erzeugt Prompts/Manifest deshalb direkt, ohne die tatsächlichen Bilder zu schreiben,
// damit der Required-Media-Check absichtlich auf EXPECTED_IMAGE_MISSING läuft.
const createIncompleteFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-ready-'));
  tempDirs.push(root);
  const plan = createFinanceTestPlan({slug: `readiness-fixture-${process.pid}-${path.basename(root)}`, title: 'Readiness Fixture'});
  const paths = ensureFinanceProjectStructure(root, {title: plan.title, topic: 'ETF-Gebühren'});
  const isImageScene = (scene: any) => scene.layout === 'full-bleed' || scene.layout === 'framed-image';
  const promptEntries: any[] = [];
  const updatedScenes = plan.scenes.map((scene: any) => {
    if (!isImageScene(scene)) return scene;
    const order = promptEntries.length;
    const prompt = scene.imagePrompt;
    const promptFile = promptFileName(order, scene.id);
    const imageFile = suggestedImageFileName(order, scene.id);
    const imageAssetId = `images-${imageFile.replace(/\.[^.]+$/, '')}`;
    const expectedImageFile = path.relative(root, path.join(paths.imagesDir, imageFile)).split(path.sep).join('/');
    promptEntries.push({order: order + 1, sceneId: scene.id, spokenSentence: scene.voiceText, promptFile, expectedImageFile, imageAssetId, prompt});
    return {...scene, assetIds: [...new Set([...(scene.assetIds ?? []), imageAssetId])]};
  });
  const updatedPlan = {...plan, scenes: updatedScenes};
  fs.mkdirSync(paths.imagePromptsDir, {recursive: true});
  for (const entry of promptEntries) fs.writeFileSync(path.join(paths.imagePromptsDir, entry.promptFile), `${entry.prompt}\n`);
  fs.writeFileSync(paths.imagePromptManifest, JSON.stringify({version: 'finance-v1', promptSystem: 'test-fixture', styleVersion: 'none', slug: updatedPlan.slug, generatedAt: new Date().toISOString(), prompts: promptEntries.map(({prompt, ...entry}) => entry)}, null, 2));
  fs.writeFileSync(paths.scenePlan, JSON.stringify(updatedPlan, null, 2));
  fs.writeFileSync(paths.status, JSON.stringify({
    version: 'finance-v1',
    folderStructureVersion: 4,
    slug: plan.slug,
    topic: 'ETF-Gebühren',
    projectPath: root,
    stage: 'planning',
    approvals: {topicSelected: true, scriptApproved: true, designAnchorApproved: true, assetsReviewed: false},
  }, null, 2));
  return root;
};

const output = (result: ReturnType<typeof spawnSync>) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance Produktionssperren', () => {
  it('verlangt beim Anlegen ausdrücklich ein Thema', () => {
    const result = spawnSync(process.execPath, [newReelScript, 'test-ohne-thema'], {cwd: repoRoot, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(output(result)).toContain('--topic="Neues Thema"');
  });

  it('blockiert ein bereits verwendetes Thema vor der Ordnererstellung', () => {
    const slug = `duplicate-topic-${process.pid}`;
    const target = path.join(repoRoot, 'channels/finanzneo/reels', slug);
    fs.rmSync(target, {recursive: true, force: true});
    const result = spawnSync(process.execPath, [newReelScript, slug, '--topic=Inflation und Kaufkraft', '--title=Darf nicht entstehen'], {cwd: repoRoot, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(output(result)).toContain('Thema bereits verwendet');
    expect(fs.existsSync(target)).toBe(false);
  });

  it('blockiert fehlendes finales Voiceover, Captions und Szenenbilder', () => {
    const result = spawnSync(process.execPath, [requiredMediaScript, createIncompleteFixture()], {cwd: repoRoot, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(output(result)).toContain('VOICEOVER_WAV_MISSING');
    expect(output(result)).toContain('CAPTIONS_JSON_MISSING');
    expect(output(result)).toContain('EXPECTED_IMAGE_MISSING');
  });

  it('verdrahtet Readiness und Runtime-Staging vor Remotion und Export', () => {
    const renderSource = fs.readFileSync(path.join(repoRoot, 'scripts/render-finance-reel.mjs'), 'utf8');
    expect(renderSource).toContain('scripts/check-finance-readiness.mjs');
    expect(renderSource).toContain('scripts/stage-finance-runtime-assets.mjs');
    expect(renderSource.indexOf('check-finance-readiness.mjs')).toBeLessThan(renderSource.indexOf("'remotion'"));
    expect(renderSource.indexOf('stage-finance-runtime-assets.mjs')).toBeLessThan(renderSource.indexOf("'remotion'"));
    expect(renderSource).toContain('scripts/export-finance-deliverables.mjs');
  });

  it('legt technische Statusdateien unter 06-projektdateien ab', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-paths-'));
    tempDirs.push(root);
    const paths = financeProjectPaths(root);
    expect(path.relative(root, paths.status).split(path.sep).join('/')).toBe('06-projektdateien/production-status.json');
    expect(path.relative(root, paths.manifest).split(path.sep).join('/')).toBe('06-projektdateien/asset-manifest.json');
    expect(path.relative(root, paths.readyReport).split(path.sep).join('/')).toBe('06-projektdateien/ready-report.json');
  });
});
