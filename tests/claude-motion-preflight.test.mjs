import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(path,'utf8');
const brief = JSON.parse(read('tests/claude-motion/brief.json'));

test('Claude motion brief is mathematically consistent and fixed-size', () => {
  assert.equal(brief.monthly_cents * brief.months, brief.yearly_cents);
  assert.equal(brief.monthly_cents, 999);
  assert.equal(brief.months, 12);
  assert.equal(brief.yearly_cents, 11988);
  assert.equal(brief.duration_frames, 360);
  assert.equal(brief.fps, 30);
  assert.equal(brief.width, 1920);
  assert.equal(brief.height, 1080);
});

test('separate experiment composition and render QA are documented', () => {
  const text=read('tests/claude-motion/README.md');
  const script=read('scripts/qa-claude-motion-test.mjs');
  assert.match(text,/ClaudeMotionSubscriptionYearTest/);
  assert.match(text,/ExperimentCompositions.tsx/);
  assert.match(script,/ffprobe/);
  assert.match(script,/technical-report.json/);
  assert.match(script,/src\/root\/ProductionCompositions.tsx/);
});

test('model-pinned agent and explicit invocation skill are present', () => {
  const agent=read('.claude/agents/finanzneo-motion-director.md');
  const skill=read('.claude/skills/finanzneo-motion-test/SKILL.md');
  assert.match(agent,/^model: claude-opus-5-5$/m);
  assert.match(skill,/^disable-model-invocation: true$/m);
  assert.match(skill,/tests\/claude-motion\/README.md/);
});
