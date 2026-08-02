import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — Node-ESM-Hilfsmodul.
import {ensureFinanceProjectStructure, financeProjectPaths} from './lib/finance-project-structure.mjs';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';

const root = process.cwd();
const script = path.join(root, 'scripts/export-finance-deliverables.mjs');
const tempDirs: string[] = [];
const validSocialCaption = '# Social-Media-Caption\n\n💬 Kommentiere ZINS und ich schicke dir kostenlos die passende PDF per DM.\n\nZinseszins verständlich erklärt\n\nZeit und Regelmäßigkeit können langfristig einen deutlichen Unterschied machen.\n\nWann möchtest du beginnen?\n\n#Finanzen #Zinseszins #Sparen #Geldanlage #FinanzNeo\n';

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

const markReady = (reelDir: string, slug: string) => {
  const paths = financeProjectPaths(reelDir);
  fs.mkdirSync(path.dirname(paths.readyReport), {recursive: true});
  fs.writeFileSync(paths.readyReport, JSON.stringify({version: 'finance-v1', slug, ready: true, generatedAt: new Date().toISOString(), findings: []}, null, 2));
};
const markRenderQa = (video: string, overrides: Record<string, unknown> = {}) => {
  const directory = path.join(path.dirname(video), `${path.parse(video).name}-qa`);
  fs.mkdirSync(directory, {recursive: true});
  const report = path.join(directory, 'report.json');
  fs.writeFileSync(report, JSON.stringify({version: 'finance-render-qa-v1', video: path.resolve(video), passed: true, generatedAt: new Date().toISOString(), findings: [], ...overrides}, null, 2));
  return report;
};
const prepareBasic = (reelDir: string, slug: string) => {
  const plan = createFinanceTestPlan({slug, title: 'Export Fixture'});
  const paths = ensureFinanceProjectStructure(reelDir, {title: plan.title, topic: 'Export-Test'});
  fs.writeFileSync(paths.scenePlan, JSON.stringify(plan, null, 2));
  fs.writeFileSync(paths.captionsFinal, JSON.stringify([{text: 'Test', startMs: 0, endMs: 500, timestampMs: null, confidence: 1}], null, 2));
  fs.writeFileSync(paths.socialCaption, validSocialCaption);
  return {plan, paths};
};

describe('Finance Exportpaket', () => {
  it('exportiert alle fertigen Dateien flach unter 05-export und entfernt Altdateien', () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-export-'));
    tempDirs.push(reelDir);
    const plan = createFinanceTestPlan({slug: 'export-fixture', title: 'Export Fixture'});
    plan.scenes.at(-1)!.voiceText = 'Kommentiere PDF für die kostenlose Checkliste.';
    plan.scenes.at(-1)!.content.ctaBenefit = 'kostenlose PDF-Checkliste';
    plan.scriptText = plan.scenes.map((scene: any) => scene.voiceText).join(' ');
    const paths = ensureFinanceProjectStructure(reelDir, {title: plan.title, topic: 'Export-Test'});
    fs.writeFileSync(paths.scenePlan, JSON.stringify(plan, null, 2));
    fs.writeFileSync(paths.captionsFinal, JSON.stringify([
      {text: 'Dein', startMs: 0, endMs: 300, timestampMs: null, confidence: 1},
      {text: 'Geld', startMs: 300, endMs: 600, timestampMs: null, confidence: 1},
      {text: 'arbeitet', startMs: 600, endMs: 1000, timestampMs: null, confidence: 1},
      {text: 'weiter', startMs: 1000, endMs: 1400, timestampMs: null, confidence: 1},
    ], null, 2));
    fs.writeFileSync(paths.socialCaption, validSocialCaption);
    fs.writeFileSync(path.join(paths.pdfDir, 'checkliste.pdf'), '%PDF-1.4\nfixture\n%%EOF\n');
    markReady(reelDir, plan.slug);
    fs.writeFileSync(path.join(paths.exportDir, 'veraltet.srt'), 'alt');
    fs.writeFileSync(path.join(paths.exportDir, 'veraltet.pdf'), 'alt');
    fs.writeFileSync(path.join(paths.exportDir, 'veraltet.mp4'), 'alt');
    const video = path.join(paths.videoDir, 'source.mp4');
    fs.writeFileSync(video, 'non-empty-video-fixture');
    markRenderQa(video);

    const result = spawnSync(process.execPath, [script, reelDir, `--video=${video}`], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(0);
    for (const file of [
      path.join(paths.exportDir, 'export-fixture.mp4'),
      path.join(paths.exportDir, 'voiceover-final.captions.json'),
      path.join(paths.exportDir, 'voiceover-final.srt'),
      path.join(paths.exportDir, 'voiceover-final.vtt'),
      path.join(paths.exportDir, 'social-caption.md'),
      path.join(paths.exportDir, 'social-caption.txt'),
      path.join(paths.exportDir, 'checkliste.pdf'),
      path.join(paths.exportDir, 'export-manifest.json'),
    ]) expect(fs.statSync(file).size).toBeGreaterThan(0);
    expect(fs.existsSync(path.join(paths.exportDir, 'veraltet.srt'))).toBe(false);
    expect(fs.existsSync(path.join(paths.exportDir, 'veraltet.pdf'))).toBe(false);
    expect(fs.existsSync(path.join(paths.exportDir, 'veraltet.mp4'))).toBe(false);
    expect(fs.readFileSync(path.join(paths.exportDir, 'voiceover-final.srt'), 'utf8')).toContain('00:00:00,000 --> 00:00:01,400');
    expect(fs.readFileSync(path.join(paths.exportDir, 'voiceover-final.vtt'), 'utf8')).toContain('WEBVTT');
    expect(fs.readFileSync(path.join(paths.exportDir, 'social-caption.txt'), 'utf8')).toContain('💬 Kommentiere ZINS');
  });

  it('blockiert Export ohne grünen Readiness-Bericht', () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-export-not-ready-'));
    tempDirs.push(reelDir);
    const {paths} = prepareBasic(reelDir, 'export-not-ready');
    const video = path.join(paths.videoDir, 'source.mp4');
    fs.writeFileSync(video, 'video');
    const result = spawnSync(process.execPath, [script, reelDir, `--video=${video}`], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('ready-report.json fehlt');
  });

  it('blockiert einen veralteten Readiness-Bericht nach Caption-Änderung', () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-export-stale-ready-'));
    tempDirs.push(reelDir);
    const {plan, paths} = prepareBasic(reelDir, 'export-stale-ready');
    markReady(reelDir, plan.slug);
    fs.writeFileSync(paths.captionsFinal, JSON.stringify([{text: 'Neu', startMs: 0, endMs: 500, timestampMs: null, confidence: 1}], null, 2));
    const future = new Date(Date.now() + 2000);
    fs.utimesSync(paths.captionsFinal, future, future);
    const video = path.join(paths.videoDir, 'source.mp4');
    fs.writeFileSync(video, 'video');
    const result = spawnSync(process.execPath, [script, reelDir, `--video=${video}`], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('READY ist veraltet');
  });

  it('blockiert einen Render-QA-Bericht für ein anderes Video', () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-export-wrong-qa-'));
    tempDirs.push(reelDir);
    const {plan, paths} = prepareBasic(reelDir, 'export-wrong-qa');
    markReady(reelDir, plan.slug);
    const video = path.join(paths.videoDir, 'source.mp4');
    fs.writeFileSync(video, 'video');
    markRenderQa(video, {video: path.join(paths.videoDir, 'anderes.mp4')});
    const result = spawnSync(process.execPath, [script, reelDir, `--video=${video}`], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('gehört nicht zum angegebenen Video');
  });

  it('blockiert eine versprochene PDF, wenn keine gültige PDF vorhanden ist', () => {
    const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-export-missing-pdf-'));
    tempDirs.push(reelDir);
    const {plan, paths} = prepareBasic(reelDir, 'export-missing-pdf');
    plan.scenes.at(-1)!.voiceText = 'Kommentiere PDF für die kostenlose Checkliste.';
    plan.scriptText = plan.scenes.map((scene: any) => scene.voiceText).join(' ');
    fs.writeFileSync(paths.scenePlan, JSON.stringify(plan, null, 2));
    fs.writeFileSync(path.join(paths.pdfDir, 'falsch.pdf'), 'keine echte PDF');
    markReady(reelDir, plan.slug);
    const video = path.join(paths.videoDir, 'source.mp4');
    fs.writeFileSync(video, 'video');
    markRenderQa(video);
    const result = spawnSync(process.execPath, [script, reelDir, `--video=${video}`], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('keine gültige PDF');
  });
});
