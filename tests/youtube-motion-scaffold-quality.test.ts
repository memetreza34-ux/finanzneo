import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const runCreator = (args: string[]) => spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-youtube-mode.mjs'),
  ...args,
], {encoding: 'utf8'});

test('hybrid scaffold starts from motion routing instead of weak fade-card defaults', () => {
  const target = `youtube/.tmp-motion-quality-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);

  try {
    const run = runCreator([
      '--mode', 'hybrid',
      '--target', target,
      '--title', 'Motion Quality Scaffold Test',
      '--types', 'animation,hybrid,data',
    ]);

    assert.equal(run.status, 0, run.stderr || run.stdout);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.phaseB.motionQualityStandardId, 'finanzneo-youtube-motion-quality-v1');
    assert.equal(index.phaseB.visualQaStandardId, 'finanzneo-youtube-visual-qa-16x9-v1');
    assert.equal(index.phaseB.reuseExistingMotionStackFirst, true);
    assert.deepEqual(index.phaseB.representativeMotionStatesRequired, ['START', '25%', '50%', '75%', 'RESULT HOLD']);

    const qaPath = resolve(absolute, '06-projektdateien/motion-qa.md');
    assert.equal(existsSync(qaPath), true);
    const qa = readFileSync(qaPath, 'utf8');
    assert.match(qa, /finanzneo-youtube-visual-qa-16x9-v1/);
    assert.match(qa, /START/);
    assert.match(qa, /RESULT HOLD/);
    assert.match(qa, /Standbild, Diagramm oder Vergleich/);

    for (const visual of index.visuals) {
      assert.equal(visual.motionQuality.standardId, 'finanzneo-youtube-motion-quality-v1');
      assert.equal(visual.motionQuality.visualQaStandardId, 'finanzneo-youtube-visual-qa-16x9-v1');
      assert.equal(visual.motionQuality.replaceWithStaticIfNotStronger, true);
      assert.deepEqual(visual.motionQuality.representativeStates, ['START', '25%', '50%', '75%', 'RESULT HOLD']);
      assert.deepEqual(visual.toolStack, ['Remotion', 'existing-finanzneo-motion-stack-first']);

      const source = readFileSync(resolve(absolute, visual.animationSourceFile), 'utf8');
      assert.match(source, /useCurrentFrame\s*\(/);
      assert.match(source, /\bspring\s*\(/);
      assert.match(source, /\binterpolate\s*\(/);
      assert.match(source, /MotionNumber/);
      assert.match(source, /MotionComparisonBars/);
      assert.match(source, /MotionLineChart/);
      assert.match(source, /MotionMoneyFlow/);
      assert.match(source, /MotionBeforeAfter/);
      assert.match(source, /START → TRIGGER → ACTION → REACTION\/CHANGE → RESULT → HOLD/);
      assert.match(source, /SCRIPT BEAT/);
      assert.doesNotMatch(source, /\[EINFÜGEN\]/);
      assert.doesNotMatch(source, /opacity:\s*progress/);

      const plan = readFileSync(resolve(absolute, visual.planFile), 'utf8');
      assert.match(plan, /MOTION_QUALITY_STANDARD: finanzneo-youtube-motion-quality-v1/);
      assert.match(plan, /YOUTUBE_VISUAL_QA_STANDARD: finanzneo-youtube-visual-qa-16x9-v1/);
      assert.match(plan, /STATIC_ALTERNATIVE/);
      assert.match(plan, /MOTION_VALUE/);
      assert.match(plan, /START:/);
      assert.match(plan, /TRIGGER:/);
      assert.match(plan, /ACTION:/);
      assert.match(plan, /REACTION_CHANGE:/);
      assert.match(plan, /RESULT:/);
      assert.match(plan, /RESULT_HOLD:/);
      assert.match(plan, /MotionNumber/);
      assert.match(plan, /Paths\/Shapes/);
      assert.match(plan, /Three\/R3F/);
      assert.match(plan, /Lottie micro-animation/);
    }

    const scriptPlan = readFileSync(resolve(absolute, '06-projektdateien/script-visual-plan.md'), 'utf8');
    assert.match(scriptPlan, /MOTION_MECHANISM/);
    assert.match(scriptPlan, /TOOL_ROUTE/);
    assert.match(scriptPlan, /REPRESENTATIVE_STATES/);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});
