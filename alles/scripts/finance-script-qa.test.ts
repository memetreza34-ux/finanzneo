import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';

const repoRoot = process.cwd();
const scriptQa = path.join(repoRoot, 'scripts/run-finance-script-qa.mjs');
const tempDirs: string[] = [];

const writePlan = (mutate?: (plan: any) => void) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-script-qa-'));
  tempDirs.push(root);
  const plan = createFinanceTestPlan({slug: `script-qa-${path.basename(root)}`});
  mutate?.(plan);
  plan.scriptText = plan.scenes.map((scene: any) => scene.voiceText).join(' ');
  const file = path.join(root, 'scene-plan.json');
  fs.writeFileSync(file, JSON.stringify(plan, null, 2));
  return file;
};

const run = (file: string) => spawnSync(process.execPath, [scriptQa, file], {
  cwd: repoRoot,
  encoding: 'utf8',
});

const output = (result: ReturnType<typeof run>) => `${result.stdout}\n${result.stderr}`;

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance Script QA', () => {
  it('akzeptiert eine klare Frage-Hook und eine visualisierbare Finanzgeschichte', () => {
    const result = run(writePlan());
    expect(result.status).toBe(0);
    expect(output(result)).not.toContain('HOOK_TOPIC_NOT_CLEAR');
    expect(output(result)).not.toContain('META_SCRIPT_LANGUAGE');
  });

  it('akzeptiert auch eine direkte Aussage-Hook mit klarer Geldfolge', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[0].voiceText = 'Nur 0,5 Prozent mehr ETF-Gebühren können dir über 30 Jahre mehrere Tausend Euro kosten.';
    }));
    expect(result.status).toBe(0);
  });

  it('blockiert Meta-Sätze aus der alten Planungsvorlage', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[3].voiceText = 'Anschließend erklärst du den Mechanismus in drei klaren Schritten und zeigst die finanzielle Folge.';
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('META_SCRIPT_LANGUAGE');
  });

  it('blockiert eine vage Hook ohne erkennbares Finanzthema', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[0].voiceText = 'Hast du dich schon mal gefragt, warum das später richtig teuer werden kann?';
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('HOOK_VAGUE_OPENING');
    expect(output(result)).toContain('HOOK_TOPIC_NOT_CLEAR');
  });

  it('blockiert mehr als zwei Szenen ohne neues Bild oder datengetriebene Visualisierung', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[2].layout = 'text-punch';
      plan.scenes[2].variant = 'default';
      plan.scenes[3].layout = 'text-punch';
      plan.scenes[3].variant = 'default';
      plan.scenes[4].layout = 'text-punch';
      plan.scenes[4].variant = 'default';
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('TOO_MANY_SCENES_WITHOUT_NEW_VISUAL');
  });

  it('warnt vor absoluten Aussagen bei Inflation und anderen zeitabhängigen Fakten', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[2].voiceText = 'Bei Inflation steigen die Preise jedes Jahr immer genau so weiter und dein Geld verliert Kaufkraft.';
    }));
    expect(result.status).toBe(0);
    expect(output(result)).toContain('ABSOLUTE_CLAIM_WORDING');
  });
});
