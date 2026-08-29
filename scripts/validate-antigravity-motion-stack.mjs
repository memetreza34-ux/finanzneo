#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const requiredFiles = [
  '.agents/plugins/finanzneo-motion/plugin.json',
  '.agents/plugins/finanzneo-motion/mcp_config.json',
  '.agents/plugins/finanzneo-motion/hooks.json',
  '.agents/plugins/finanzneo-motion/skills/lottie-motion/SKILL.md',
  '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md',
  '.agents/plugins/finanzneo-motion/skills/sound-design/SKILL.md',
  '.agents/plugins/finanzneo-motion/rules/lottie-motion.md',
  '.agents/plugins/finanzneo-motion/rules/remotion-production.md',
  '.agents/plugins/finanzneo-motion/rules/sound-design.md',
  'scripts/antigravity-motion-bootstrap.mjs',
  'public/lottie/README.md',
  'public/sounds/README.md',
  'src/brand/components/Lottie.tsx',
  'reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen/05-projektdateien/sound-design.md',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) fail(`Pflichtdatei fehlt: ${file}`);
}

if (!errors.length) {
  let plugin;
  let mcp;
  let hooks;
  try {
    plugin = JSON.parse(read('.agents/plugins/finanzneo-motion/plugin.json'));
    mcp = JSON.parse(read('.agents/plugins/finanzneo-motion/mcp_config.json'));
    hooks = JSON.parse(read('.agents/plugins/finanzneo-motion/hooks.json'));
  } catch (error) {
    fail(`Plugin-/MCP-/Hook-JSON ist ungültig: ${error.message}`);
  }

  if (plugin && plugin.name !== 'finanzneo-motion') fail('plugin.json muss name="finanzneo-motion" verwenden.');

  const lottieServer = mcp?.mcpServers?.['lottiefiles-creator'];
  if (!lottieServer) fail('Lottie Creator MCP fehlt in mcp_config.json.');
  if (lottieServer && lottieServer.command !== 'npx') fail('Lottie Creator MCP muss lokal über npx laufen.');
  if (lottieServer && !Array.isArray(lottieServer.args)) fail('Lottie Creator MCP args fehlen.');
  if (lottieServer && !lottieServer.args?.includes('@lottiefiles/creator-mcp@latest')) {
    fail('Lottie Creator MCP muss @lottiefiles/creator-mcp@latest verwenden.');
  }

  const preInvocation = hooks?.['finanzneo-motion-bootstrap']?.PreInvocation;
  if (!Array.isArray(preInvocation) || preInvocation.length !== 1) {
    fail('Antigravity Motion Bootstrap braucht genau einen PreInvocation-Hook.');
  } else {
    const hook = preInvocation[0];
    if (hook.type !== 'command') fail('Motion Bootstrap Hook muss type="command" sein.');
    if (hook.command !== 'node scripts/antigravity-motion-bootstrap.mjs') {
      fail('Motion Bootstrap Hook zeigt nicht auf scripts/antigravity-motion-bootstrap.mjs.');
    }
    if (typeof hook.timeout !== 'number' || hook.timeout < 60) fail('Motion Bootstrap Hook braucht ausreichend Installations-Timeout.');
  }

  const bootstrap = read('scripts/antigravity-motion-bootstrap.mjs');
  if (!bootstrap.includes("remotion-dev/skills")) fail('Bootstrap installiert die offiziellen Remotion Skills nicht.');
  if (!bootstrap.includes("elevenlabs/skills")) fail('Bootstrap installiert den ElevenLabs Skills-Katalog nicht.');
  if (!bootstrap.includes("sound-effects")) fail('Bootstrap installiert den ElevenLabs sound-effects Skill nicht.');
  if (!bootstrap.includes("antigravity")) fail('Bootstrap zielt nicht auf den Antigravity-Agenten.');

  const lottie = read('src/brand/components/Lottie.tsx');
  if (!/loop\s*=\s*false/.test(lottie)) fail('LottieBox muss standardmäßig deterministisch ohne Endlos-Loop laufen (loop=false).');

  const director = read('.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md');
  for (const marker of ['START', 'TRIGGER', 'PHYSICAL ACTION', 'RESULT HOLD', 'useCurrentFrame()', 'Lottie', 'Sound']) {
    if (!director.includes(marker)) fail(`remotion-director Skill fehlt Pflichtmarker: ${marker}`);
  }

  const soundSkill = read('.agents/plugins/finanzneo-motion/skills/sound-design/SKILL.md');
  for (const marker of ['Voiceover', 'ELEVENLABS_API_KEY', 'public/sounds/', 'frame', 'casino']) {
    if (!soundSkill.toLowerCase().includes(marker.toLowerCase())) fail(`sound-design Skill fehlt Pflichtmarker: ${marker}`);
  }

  const soundPlan = read('reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen/05-projektdateien/sound-design.md');
  for (const scene of ['scene-02', 'scene-04', 'scene-06', 'scene-09', 'scene-11', 'scene-14']) {
    if (!soundPlan.includes(scene)) fail(`Notgroschen Soundplan fehlt ${scene}.`);
  }

  // Protect against accidentally committing common secret shapes. Mentioning the
  // environment variable name in documentation is allowed; literal key values are not.
  const secretScanFiles = [
    '.agents/plugins/finanzneo-motion/mcp_config.json',
    '.agents/plugins/finanzneo-motion/hooks.json',
    '.agents/plugins/finanzneo-motion/skills/sound-design/SKILL.md',
    '.agents/plugins/finanzneo-motion/rules/sound-design.md',
    'scripts/antigravity-motion-bootstrap.mjs',
  ];
  for (const file of secretScanFiles) {
    const content = read(file);
    if (/\bsk_[A-Za-z0-9_-]{20,}\b/.test(content)) fail(`${file}: möglicher API-Key wurde versioniert.`);
    const envAssignment = content.match(/["']?ELEVENLABS_API_KEY["']?\s*[:=]\s*["']([^"']+)["']/);
    if (envAssignment && !/^\$\{|^<|^process\.env\b/.test(envAssignment[1])) {
      fail(`${file}: ELEVENLABS_API_KEY darf keinen literal gespeicherten Wert haben.`);
    }
  }
}

if (errors.length) {
  console.error('\nAntigravity Motion Stack verletzt:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\n✓ Antigravity FinanzNeo Motion Stack vollständig.');
console.log('✓ Lottie Creator MCP + Remotion Director + Sound Design Skills/Rules vorhanden.');
console.log('✓ Antigravity PreInvocation-Bootstrap für offizielle Remotion Skills und ElevenLabs sound-effects konfiguriert.');
console.log('✓ Lottie rendert standardmäßig ohne Endlos-Loop.');
console.log('✓ Notgroschen-Reel besitzt einen framegenauen Sound-Cue-Plan für alle 6 Animationsszenen.');
console.log('✓ Keine versionierten API-Key-Muster gefunden.');
