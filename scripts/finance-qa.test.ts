import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';

type QaReport = {
  passed: boolean;
  findings: Array<{severity: string; code: string; sceneId?: string}>;
};

const repoRoot = process.cwd();
const qaScript = path.join(repoRoot, 'scripts/run-finance-qa.mjs');
const tempDirs: string[] = [];

const createFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-qa-unit-'));
  tempDirs.push(root);

  const plan = createFinanceTestPlan({slug: `qa-fixture-${path.basename(root)}`});
  const referencedIds = new Set<string>();
  for (const scene of plan.scenes) {
    for (const id of scene.assetIds ?? []) referencedIds.add(id);
    for (const phase of scene.visualPhases ?? []) {
      if (phase.assetId) referencedIds.add(phase.assetId);
    }
  }

  const manifest = {
    version: 'finance-v1',
    slug: plan.slug,
    root: '.',
    generatedAt: new Date(0).toISOString(),
    assets: [...referencedIds].map((id) => ({
      id,
      kind: 'image',
      role: 'scene-image',
      file: `images/${id}.png`,
      extension: '.png',
      bytes: 1,
      width: 1080,
      height: 1920,
    })),
  };

  const planFile = path.join(root, 'scene-plan.json');
  const manifestFile = path.join(root, 'asset-manifest.json');
  const reportFile = path.join(root, 'qa-report.json');
  fs.writeFileSync(planFile, JSON.stringify(plan, null, 2));
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

  return {root, plan, manifest, planFile, manifestFile, reportFile};
};

const runQa = (planFile: string, manifestFile: string, reportFile: string) => {
  const result = spawnSync(process.execPath, [
    qaScript,
    planFile,
    manifestFile,
    '--visual-only',
    `--out=${reportFile}`,
  ], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  const report = JSON.parse(fs.readFileSync(reportFile, 'utf8')) as QaReport;
  return {result, report};
};

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance V1 QA-Regeln', () => {
  it('besteht mit einer gültigen visuellen Fixture', () => {
    const fixture = createFixture();
    const {result, report} = runQa(fixture.planFile, fixture.manifestFile, fixture.reportFile);

    expect(result.status).toBe(0);
    expect(report.passed).toBe(true);
    expect(report.findings.some((finding) => finding.code === 'VISUAL_PREFLIGHT')).toBe(true);
  });

  it('erkennt einen nicht belegten Claim', () => {
    const fixture = createFixture();
    fixture.plan.sources = [{
      id: 'source-1',
      title: 'Testquelle',
      url: 'https://example.com/source',
      accessedAt: '2026-07-26',
      claimIds: [],
    }];
    fixture.plan.scenes[0].claimIds = ['claim-ohne-quelle'];
    fs.writeFileSync(fixture.planFile, JSON.stringify(fixture.plan, null, 2));

    const {result, report} = runQa(fixture.planFile, fixture.manifestFile, fixture.reportFile);

    expect(result.status).toBe(1);
    expect(report.passed).toBe(false);
    expect(report.findings).toContainEqual(expect.objectContaining({
      severity: 'error',
      code: 'UNSOURCED_CLAIM',
      sceneId: fixture.plan.scenes[0].id,
    }));
  });

  it('erkennt eine falsche strukturierte Rechnung', () => {
    const fixture = createFixture();
    fixture.plan.scenes[7].content.calculation = {
      input: 10000,
      operation: 'multiply',
      operand: 0.0025,
      result: 250,
      currency: 'EUR',
      tolerance: 0.01,
    };
    fs.writeFileSync(fixture.planFile, JSON.stringify(fixture.plan, null, 2));

    const {result, report} = runQa(fixture.planFile, fixture.manifestFile, fixture.reportFile);

    expect(result.status).toBe(1);
    expect(report.findings).toContainEqual(expect.objectContaining({
      severity: 'error',
      code: 'CALCULATION_MISMATCH',
      sceneId: fixture.plan.scenes[7].id,
    }));
  });
});
