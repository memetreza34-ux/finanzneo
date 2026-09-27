import assert from 'node:assert/strict';
import {readFileSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

const runCreator = (args: string[]) => spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-youtube-mode.mjs'),
  ...args,
], {encoding: 'utf8'});

const runMotionValidator = (target: string) => spawnSync(process.execPath, [
  resolve('scripts/validate-youtube-animation-quality.mjs'),
  target,
], {encoding: 'utf8'});

test('motion quality validator blocks unresolved Phase-B plans and accepts resolved mechanisms', () => {
  const target = `youtube/.tmp-motion-quality-validator-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);

  try {
    const create = runCreator([
      '--mode', 'hybrid',
      '--target', target,
      '--title', 'Motion Quality Validator Test',
      '--types', 'animation,hybrid,data',
    ]);
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const unresolved = runMotionValidator(target);
    assert.notEqual(unresolved.status, 0);
    assert.match(unresolved.stderr || unresolved.stdout, /motionQuality\.staticAlternative ist noch nicht konkret geplant/);
    assert.match(unresolved.stderr || unresolved.stdout, /animation\.tsx enthält noch einen Platzhalter/);

    const indexPath = resolve(absolute, '04-visuals/visual-index.json');
    const index = JSON.parse(readFileSync(indexPath, 'utf8'));

    for (const visual of index.visuals) {
      visual.viewerChange = 'A visible financial value changes from the initial state to a clearly different result.';
      visual.reason = 'The movement explains the change over time more clearly than a single still frame.';
      visual.motionPreset = 'BAR_GROW';
      visual.advancedReason = '';
      visual.motionQuality.staticAlternative = 'A static before-and-after comparison with the same two approved values.';
      visual.motionQuality.motionValue = 'Motion shows the transition between the two states and makes the direction of change explicit.';
      visual.motionQuality.toolRoute = 'MotionComparisonBars';
      visual.motionQuality.whyThisTool = 'The beat compares two financial values on a shared scale, so the existing comparison mechanism is the simplest clear route.';
      visual.motionQuality.mechanism = {
        start: 'The initial financial value is visible on a common scale.',
        trigger: 'The narration introduces the change.',
        action: 'The comparison bar grows to the approved result value.',
        reactionChange: 'The second value remains visible as the reference.',
        result: 'The final difference is immediately readable.',
        resultHold: 'The final comparison remains stable long enough to read.',
      };
      visual.motionQuality.representativeStates = ['START', '25%', '50%', '75%', 'RESULT HOLD'];
      visual.motionQuality.replaceWithStaticIfNotStronger = true;
      if (visual.type === 'hybrid') {
        visual.motionQuality.imageJob = 'The Flow image provides the concrete real-world context.';
        visual.motionQuality.motionJob = 'Remotion shows the exact numeric change over time.';
        visual.motionQuality.semanticOverlapForbidden = true;
      }

      const source = `import React from 'react';\nimport {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';\n\nexport const ${visual.animationExport}: React.FC = () => {\n  const frame = useCurrentFrame();\n  const progress = interpolate(frame, [0, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});\n  return <AbsoluteFill style={{backgroundColor: '#000000', justifyContent: 'center', padding: 96}}><div style={{height: 64, width: \`${'${'}20 + progress * 70}%\`, backgroundColor: '#35C67A', borderRadius: 18}} /></AbsoluteFill>;\n};\n`;
      writeFileSync(resolve(absolute, visual.animationSourceFile), source);
    }

    writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

    const resolved = runMotionValidator(target);
    assert.equal(resolved.status, 0, resolved.stderr || resolved.stdout);
    assert.match(resolved.stdout, /finanzneo-youtube-motion-quality-v1/);
    assert.match(resolved.stdout, /finanzneo-youtube-visual-qa-16x9-v1/);
  } finally {
    rmSync(absolute, {recursive: true, force: true});
  }
});
