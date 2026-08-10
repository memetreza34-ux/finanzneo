#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'finanzneo-scaffold-'));
const reelsRoot = path.join(temporary, 'reels');
const historyFile = path.join(temporary, 'topic-history.json');
fs.mkdirSync(reelsRoot, {recursive: true});
fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topicSelectionVersion: 2, rules: {}, topics: []}, null, 2));
const env = {...process.env, FINANCE_REELS_ROOT: reelsRoot, FINANCE_TOPIC_HISTORY_FILE: historyFile};
const run = (args, expectedStatus = 0) => {
  const result = spawnSync(process.execPath, ['scripts/safe-new-finance-week-reel.mjs', ...args], {cwd: root, env, encoding: 'utf8'});
  if (result.status !== expectedStatus) throw new Error(`Unerwarteter Exit ${result.status}; erwartet ${expectedStatus}.\n${result.stdout}\n${result.stderr}`);
  return result;
};
try {
  const firstArgs = ['scaffold-test-a', '--topic=ETF-Kosten Test A', '--title=ETF Kosten Test A', '--publish-date=2099-12-28', '--selection-mode=evergreen', '--selection-reason=Transaktionaler Scaffold-Test mit vollständiger Metadatenprüfung'];
  run(firstArgs);
  const weekDir = path.join(reelsRoot, '2099-12-28_bis_2100-01-03');
  const firstProject = path.join(weekDir, '01_ETF-Kosten-Test-A');
  if (!fs.existsSync(firstProject)) throw new Error('Erstes Projekt wurde nicht erstellt.');
  const firstStatus = fs.statSync(path.join(firstProject, '06-projektdateien', 'production-status.json')).mtimeMs;
  run(firstArgs);
  const secondStatus = fs.statSync(path.join(firstProject, '06-projektdateien', 'production-status.json')).mtimeMs;
  if (firstStatus !== secondStatus) throw new Error('Idempotenter zweiter Aufruf hat ein bestehendes Reel verändert.');

  const historyBeforeConflict = fs.readFileSync(historyFile, 'utf8');
  const conflict = run(['scaffold-test-b', '--topic=ETF-Kosten Test B', '--title=Anderes Reel', '--publish-date=2099-12-28', '--selection-mode=evergreen', '--selection-reason=Absichtlich belegter Wochentag'], 1);
  if (!/belegt diesen Wochentag/i.test(`${conflict.stdout}\n${conflict.stderr}`)) throw new Error('Belegter Wochentag wurde nicht klar gemeldet.');
  if (fs.readFileSync(historyFile, 'utf8') !== historyBeforeConflict) throw new Error('Fehlgeschlagene Erstellung hat das Themenregister verändert.');
  if (fs.readdirSync(weekDir, {withFileTypes: true}).filter((entry) => entry.isDirectory()).length !== 1) throw new Error('Fehlgeschlagene Erstellung hat einen zusätzlichen Reel-Ordner hinterlassen.');

  const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  if (history.topics.length !== 1 || history.topics[0].slug !== 'scaffold-test-a') throw new Error('Themenregister enthält nach dem Test unerwartete Einträge.');
  console.log('✓ Transaktionaler Finance-Scaffold-Test bestanden: Erstellung, Idempotenz, belegter Tag und Rollback.');
} finally {
  fs.rmSync(temporary, {recursive: true, force: true});
}
