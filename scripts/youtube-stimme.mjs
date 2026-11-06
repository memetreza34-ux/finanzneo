#!/usr/bin/env node
// Skript → fertige Aufnahme mit der FinanzNeo-Kanalstimme (Qwen3-TTS, lokal auf dem Mac).
// Startet scripts/youtube-stimme.py in der TTS-Umgebung außerhalb des Repos.
//
//   npm run youtube:stimme -- youtube/<Projekt> [--ueberschreiben] [--ohne-zeitstempel] [--nur-zeilen N]
//
// Einrichtung einmalig: youtube/_kanal/stimme/README.md

import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const tts = process.env.FINANZNEO_TTS_HOME ?? resolve(homedir(), 'finanzneo-tts');
const python = process.env.FINANZNEO_TTS_PYTHON ?? resolve(tts, '.venv/bin/python');
if (!existsSync(python)) {
  console.error(`✗ TTS-Umgebung fehlt (${python}). Einrichtung: youtube/_kanal/stimme/README.md`);
  process.exit(1);
}
if (!process.argv[2]) {
  console.error('Aufruf: npm run youtube:stimme -- youtube/<Projekt> [--ueberschreiben] [--ohne-zeitstempel]');
  process.exit(1);
}

const hfHome = process.env.HF_HOME ?? resolve(tts, 'hf');
const r = spawnSync(python, [resolve(dirname(fileURLToPath(import.meta.url)), 'youtube-stimme.py'), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {...process.env, HF_HOME: hfHome, HF_HUB_OFFLINE: process.env.HF_HUB_OFFLINE ?? '1', TOKENIZERS_PARALLELISM: 'false'},
});
process.exit(r.status ?? 1);
