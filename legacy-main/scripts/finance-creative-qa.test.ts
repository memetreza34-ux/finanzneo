import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';

const repoRoot = process.cwd();
const qaScript = path.join(repoRoot, 'scripts/run-finance-creative-qa.mjs');
const tempDirs: string[] = [];

const writePlan = (mutate?: (plan: any) => void) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-creative-qa-'));
  tempDirs.push(root);
  const plan = createFinanceTestPlan({slug: `creative-fixture-${path.basename(root)}`});
  mutate?.(plan);
  plan.scriptText = plan.scenes.map((scene: any) => scene.voiceText).join(' ');
  const file = path.join(root, 'scene-plan.json');
  fs.writeFileSync(file, JSON.stringify(plan, null, 2));
  return file;
};

const run = (file: string) => spawnSync(process.execPath, [qaScript, file], {
  cwd: repoRoot,
  encoding: 'utf8',
});
const output = (result: ReturnType<typeof run>) => `${result.stdout}\n${result.stderr}`;

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance Creative QA — image-first-lite', () => {
  it('akzeptiert den zentralen statischen Testplan', () => {
    const result = run(writePlan());
    expect(result.status).toBe(0);
    expect(output(result)).toContain('image-first-lite');
  });

  it('blockiert fehlende Zwischenüberschrift und fehlendes Icon', () => {
    const result = run(writePlan((plan) => {
      delete plan.scenes[0].content.kicker;
      delete plan.scenes[0].content.icon;
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SCENE_HEADER_MISSING');
    expect(output(result)).toContain('SCENE_ICON_MISSING');
  });

  it('blockiert eine Headline, die das Voiceover wörtlich wiederholt', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[0].content.headline = 'Was kosten dich nur 0,5 Prozent mehr';
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('HEADLINE_DUPLICATES_VOICE');
  });

  it('blockiert komplexe Übergänge', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[1].transition = 'push';
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('LITE_TRANSITION_NOT_CUT');
  });

  it('blockiert mehrere visuelle Phasen', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[2].visualPhases = [
        {at: 0, action: 'Bild zeigen'},
        {at: 0.6, action: 'zweite Animation'},
      ];
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('LITE_MULTIPLE_PHASES');
  });

  it('blockiert weniger als acht eigenständige Bilder', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[0].layout = 'text-punch';
      plan.scenes[0].assetIds = [];
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('TOO_FEW_IMAGE_LED_SCENES');
  });

  it('blockiert mehr als zwei unterstützende Details', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[1].content.steps = ['Detail eins', 'Detail zwei', 'Detail drei'];
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SUPPORT_DETAILS_OVERLOAD');
  });

  it('blockiert doppelte unterstützende Details', () => {
    const result = run(writePlan((plan) => {
      plan.scenes[1].content.steps = ['Gleicher Wert', 'Gleicher Wert'];
    }));
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SUPPORT_DETAILS_DUPLICATE');
  });
});
