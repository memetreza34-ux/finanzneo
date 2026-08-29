#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const manual = process.argv.includes('--manual');
const marker = resolve(root, '.cache/finanzneo-motion-bootstrap.json');
const remotionSkill = resolve(root, '.agents/skills/remotion-best-practices/SKILL.md');
const soundSkill = resolve(root, '.agents/skills/sound-effects/SKILL.md');

const install = (source, skill = '*') => {
  const args = ['-y', 'skills', 'add', source, '-a', 'antigravity', '-s', skill, '-y', '--copy'];
  return spawnSync('npx', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 110_000,
  });
};

const ensureSkills = () => {
  const messages = [];
  let ok = true;

  if (!existsSync(remotionSkill)) {
    const result = install('remotion-dev/skills', '*');
    if (result.status !== 0) {
      ok = false;
      messages.push(`Remotion Skills konnten nicht installiert werden: ${(result.stderr || result.stdout || 'unbekannter Fehler').trim().slice(0, 500)}`);
    } else {
      messages.push('Offizielle Remotion Agent Skills wurden für Antigravity installiert.');
    }
  } else {
    messages.push('Offizielle Remotion Agent Skills sind bereits vorhanden.');
  }

  if (!existsSync(soundSkill)) {
    const result = install('elevenlabs/skills', 'sound-effects');
    if (result.status !== 0) {
      ok = false;
      messages.push(`ElevenLabs sound-effects Skill konnte nicht installiert werden: ${(result.stderr || result.stdout || 'unbekannter Fehler').trim().slice(0, 500)}`);
    } else {
      messages.push('ElevenLabs sound-effects Agent Skill wurde für Antigravity installiert.');
    }
  } else {
    messages.push('ElevenLabs sound-effects Agent Skill ist bereits vorhanden.');
  }

  mkdirSync(dirname(marker), {recursive: true});
  writeFileSync(marker, JSON.stringify({
    checkedAt: new Date().toISOString(),
    ok,
    remotion: existsSync(remotionSkill),
    soundEffects: existsSync(soundSkill),
  }, null, 2));

  return {ok, messages};
};

if (manual) {
  const result = ensureSkills();
  for (const message of result.messages) console.log(message);
  if (!result.ok) {
    console.error('\nMindestens ein optionaler Agent Skill konnte nicht installiert werden. Repo-Regeln und bestehende Produktion bleiben unverändert.');
    process.exitCode = 1;
  }
} else {
  let input = {};
  try {
    const raw = readFileSync(0, 'utf8').trim();
    input = raw ? JSON.parse(raw) : {};
  } catch {
    input = {};
  }

  // Bootstrap only once at the beginning of an Antigravity task. Never delay every tool call.
  if (typeof input.invocationNum === 'number' && input.invocationNum > 0) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  if (existsSync(remotionSkill) && existsSync(soundSkill)) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }

  const result = ensureSkills();
  const message = result.ok
    ? 'FinanzNeo Motion Stack bereit: offizielle Remotion Agent Skills + ElevenLabs sound-effects Skill sind installiert. CLAUDE.md und FinanzNeo-Regeln bleiben die höhere Autorität.'
    : `FinanzNeo Motion Bootstrap unvollständig. ${result.messages.join(' ')} Bei Bedarf manuell ausführen: npm run antigravity:motion:bootstrap`;

  process.stdout.write(JSON.stringify({
    injectSteps: [{ephemeralMessage: message}],
  }));
}
