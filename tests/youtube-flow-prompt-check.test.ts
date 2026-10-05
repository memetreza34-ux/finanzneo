import assert from 'node:assert/strict';
import test from 'node:test';
import {YOUTUBE_FLOW_PROMPT_MAX_WORDS} from '../scripts/lib/youtube-contract.mjs';
import {countFlowPrompts, findAbstractFlowPromptTerms, findFlowPromptFormIssues} from '../scripts/lib/youtube-flow-prompt-check.mjs';

test('Flow-Prompt-Check findet die abstrakten Cover-Motive aus dem ersten Notgroschen-Lauf', () => {
  const prompts = [
    'Stylized 3D animated feature film still, 16:9. A broken washing machine with a large repair slip, a safe green emergency-money stack on one side and a visibly reduced investment value block on the other. Deep black background.',
    'Stylized 3D animated feature film still, 16:9. A large physical 3.000-euro value stack is missing one red-orange fifth. Deep black background, no chart axes, no dashboard.',
    'Stylized 3D animated feature film still, 16:9. Red glowing glass bars fall behind a repair bill. Deep black background.',
  ].join('\n');
  const labels = findAbstractFlowPromptTerms(prompts).map((finding) => finding.term.toLowerCase());
  assert.ok(labels.includes('investment value block'));
  assert.ok(labels.includes('value stack'));
  assert.ok(labels.includes('glowing'));
  assert.ok(labels.includes('glass bars'));
});

test('Flow-Prompt-Check lässt konkrete Motive und Verbotslisten durch', () => {
  const prompts = [
    'Stylized 3D animated feature film still, 16:9. A modern washing machine in a small laundry corner has its door open; beside it lies a cream repair slip "Reparatur 800 €". Warm soft light, deep black background, no glowing bars, no value blocks, smoke or lens flares. Not photorealistic, no logos.',
    'Stylized 3D animated feature film still, 16:9. An unbranded credit card lies on a cream statement — not a glass chart, not a neon sign. Only text: "Teilzahlung".',
    '- KI-SLOP VERBOTEN: glowing or neon edges, glass or crystal bars/blocks/arrows, value blocks or value stacks as symbols',
  ].join('\n');
  assert.deepEqual(findAbstractFlowPromptTerms(prompts), []);
});

test('Flow-Prompt-Check verlangt dieselbe kurze Stilklammer für jeden Bildprompt', () => {
  const uniform = 'Stylized 3D animated feature film still, 16:9. A washing machine with its door open, a repair bill beside it. Small laundry corner. Only text: "Reparatur 800 €". Soft natural light, deep black background. Not photorealistic, no logos.';
  assert.deepEqual(findFlowPromptFormIssues(uniform), []);
  assert.equal(countFlowPrompts(`Regeltext erwähnt Stylized 3D animated feature film still nur.\n${uniform}`), 1);

  const old = 'Stylized 3D animated feature film still, 16:9, YouTube thumbnail. A premium cinematic hero shot of a card on four labels "A", "B", "C", "D". Warm soft light, deep black background. Not photorealistic, no logos, no people.';
  const issues = findFlowPromptFormIssues(old).join('\n');
  assert.match(issues, /beginnt nicht exakt/);
  assert.match(issues, /endet nicht exakt/);
  assert.match(issues, /verlangt 4 Texte/);
  assert.match(issues, /Hochglanz-Wort „premium“/);

  const long = `Stylized 3D animated feature film still, 16:9. ${'A calm kitchen table with ordinary things. '.repeat(12)}Soft natural light, deep black background. Not photorealistic, no logos.`;
  assert.match(findFlowPromptFormIssues(long).join('\n'), new RegExp(`Wörter, erlaubt sind ${YOUTUBE_FLOW_PROMPT_MAX_WORDS}`));
});
