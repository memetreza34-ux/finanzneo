import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import test from 'node:test';
import {
  YOUTUBE_VISUAL_CLARITY_STANDARD_ID,
  validateYouTubeVisualClarity,
} from '../scripts/lib/youtube-visual-clarity-contract.mjs';

test('visual clarity contract keeps visual form free but requires one clear takeaway', () => {
  const visual = {
    id: 'visual-01',
    type: 'image',
    coreMessage: 'Eine Ausgabe wiederholt sich.',
    visualForm: 'custom schema illustration',
    twoSecondTakeaway: 'Einmal klein, oft groß.',
    whyThisForm: 'Das Schema zeigt Wiederholung sofort.',
    essentialElements: ['ein Einzelkauf', 'wiederholte Käufe'],
  };
  assert.equal(YOUTUBE_VISUAL_CLARITY_STANDARD_ID, 'finanzneo-youtube-clarity-v1');
  assert.deepEqual(validateYouTubeVisualClarity(visual), []);
});

test('motion clarity requires a stable result hold', () => {
  const visual = {
    id: 'visual-02',
    type: 'animation',
    coreMessage: 'Zwei Käufe werden teurer.',
    visualForm: 'comparison schema',
    twoSecondTakeaway: '20 + 20 > 35.',
    whyThisForm: 'Die Rechnung erklärt den Unterschied.',
    essentialElements: ['20', '20', '40', '35'],
    clarityPlan: {start:'20', change:'zweiter Kauf', result:'40 gegen 35', resultHoldFrames:12},
  };
  const errors = validateYouTubeVisualClarity(visual);
  assert.ok(errors.some((error) => error.includes('resultHoldFrames')));
});

test('current 2-minute finance video passes the executable clarity validator', () => {
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/validate-youtube-visual-clarity.mjs'), 'youtube/2026-10-06_billig-kaufen'],
    {encoding: 'utf8'},
  );
  assert.equal(
    result.status,
    0,
    `visual clarity validator failed:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
  );
});
