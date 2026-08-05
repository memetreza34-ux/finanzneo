import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

const root = process.cwd();
const script = path.join(root, 'scripts/new-finance-week-reel.mjs');
const tempRoots: string[] = [];

const createEnvironment = () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-week-'));
  tempRoots.push(temp);
  const reelsRoot = path.join(temp, 'reels');
  const legacyPublicRoot = path.join(temp, 'public-reels');
  const historyFile = path.join(temp, 'topic-history.json');
  fs.mkdirSync(reelsRoot, {recursive: true});
  fs.mkdirSync(legacyPublicRoot, {recursive: true});
  fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topics: []}, null, 2));
  return {
    reelsRoot,
    legacyPublicRoot,
    historyFile,
    env: {
      ...process.env,
      FINANCE_REELS_ROOT: reelsRoot,
      FINANCE_LEGACY_PUBLIC_ROOT: legacyPublicRoot,
      FINANCE_TOPIC_HISTORY_FILE: historyFile,
    },
  };
};
const run = (args: string[], env: NodeJS.ProcessEnv) => spawnSync(process.execPath, [script, ...args], {cwd: root, encoding: 'utf8', env});

afterEach(() => {
  while (tempRoots.length) fs.rmSync(tempRoots.pop()!, {recursive: true, force: true});
});

const days = [
  ['2026-07-27', '01', 'Montag'],
  ['2026-07-28', '02', 'Dienstag'],
  ['2026-07-29', '03', 'Mittwoch'],
  ['2026-07-30', '04', 'Donnerstag'],
  ['2026-07-31', '05', 'Freitag'],
  ['2026-08-01', '06', 'Samstag'],
  ['2026-08-02', '07', 'Sonntag'],
] as const;

const requiredDirectories = [
  '01-script-audio',
  '01-script-audio/audio',
  '01-script-audio/audio/sfx',
  '02-bilder',
  '02-bilder/prompts',
  '02-bilder/images',
  '03-caption',
  '04-pdf',
  '05-export',
  '06-projektdateien',
  '06-projektdateien/data',
  '06-projektdateien/render',
];
const requiredFiles = [
  'README.md',
  '01-script-audio/script.md',
  '01-script-audio/script-fliesstext.txt',
  '01-script-audio/voiceover.txt',
  '02-bilder/bildprompts.md',
  '03-caption/social-caption.md',
  '04-pdf/inhalt.md',
  '06-projektdateien/scene-plan.json',
  '06-projektdateien/production-status.json',
  '06-projektdateien/sources.md',
  '06-projektdateien/storyboard.md',
  '06-projektdateien/motion-design.md',
];

describe('Finance Wochen- und Reel-Struktur wie im KI-Kanal', () => {
  it.each(days)('legt %s im Tagesplatz %s als benannten Reel-Ordner an', (date, number, dayName) => {
    const {reelsRoot, env} = createEnvironment();
    const slug = `reel-${dayName.toLowerCase()}`;
    const title = `Test ${dayName}`;
    const reelFolder = `${number}_Test-${dayName}`;
    const result = run([slug, `--topic=Einmaliges Thema ${dayName}`, `--title=${title}`, `--publish-date=${date}`], env);
    expect(result.status).toBe(0);
    const target = path.join(reelsRoot, '2026-07-27_bis_2026-08-02', reelFolder);
    expect(fs.existsSync(path.join(reelsRoot, slug))).toBe(false);
    for (const directory of requiredDirectories) expect(fs.statSync(path.join(target, directory)).isDirectory()).toBe(true);
    for (const file of requiredFiles) expect(fs.statSync(path.join(target, file)).isFile()).toBe(true);
    const status = JSON.parse(fs.readFileSync(path.join(target, '06-projektdateien', 'production-status.json'), 'utf8'));
    expect(status.folderStructureVersion).toBe(4);
    expect(status.publishDate).toBe(date);
    expect(status.dayNumber).toBe(Number(number));
    expect(status.dayName).toBe(dayName);
    expect(status.reelFolder).toBe(reelFolder);
    expect(status.projectPath).toContain(`2026-07-27_bis_2026-08-02/${reelFolder}`);
    expect(status.required.socialCaption).toBe('03-caption/social-caption.md');
    expect(status.required.voiceoverFinal).toBe('01-script-audio/audio/voiceover-final.wav');
    expect(status.required.imagePromptIndex).toBe('02-bilder/bildprompts.md');
  });

  it('blockiert ein zweites Reel am selben Tagesplatz unabhängig vom Namen', () => {
    const {env} = createEnvironment();
    expect(run(['erstes-reel', '--topic=Erstes einmaliges Tagesthema', '--title=Erstes Reel', '--publish-date=2026-07-29'], env).status).toBe(0);
    const second = run(['zweites-reel', '--topic=Zweites einmaliges Tagesthema', '--title=Zweites Reel', '--publish-date=2026-07-29'], env);
    expect(second.status).toBe(1);
    expect(`${second.stdout}\n${second.stderr}`).toContain('genau ein Reel');
  });

  it('migriert einen alten Slug-Ordner unter reels verlustfrei', () => {
    const {reelsRoot, historyFile, env} = createEnvironment();
    const slug = 'zinseszins-fruehstart';
    const topic = 'Zinseszins und früher Sparbeginn';
    const legacy = path.join(reelsRoot, slug);
    fs.mkdirSync(legacy, {recursive: true});
    fs.writeFileSync(path.join(legacy, 'scene-plan.json'), JSON.stringify({slug, title: 'Zinseszins', scriptText: 'Bleibt erhalten.', marker: 'bleibt-erhalten'}, null, 2));
    fs.writeFileSync(path.join(legacy, 'production-status.json'), JSON.stringify({version: 'finance-v1', slug, topic, stage: 'planning', approvals: {}}, null, 2));
    fs.writeFileSync(path.join(legacy, 'voiceover-prompt.md'), 'Alter Voiceover-Prompt');
    fs.writeFileSync(path.join(legacy, 'image-prompts.md'), 'Alte Bildprompts');
    fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topics: [{slug, topic, status: 'reserved'}]}, null, 2));

    const result = run([slug, `--topic=${topic}`, '--title=Zinseszins', '--publish-date=2026-07-30'], env);
    expect(result.status).toBe(0);
    const target = path.join(reelsRoot, '2026-07-27_bis_2026-08-02', '04_Zinseszins');
    expect(JSON.parse(fs.readFileSync(path.join(target, '06-projektdateien', 'scene-plan.json'), 'utf8')).marker).toBe('bleibt-erhalten');
    expect(fs.readFileSync(path.join(target, '01-script-audio', 'voiceover.txt'), 'utf8')).toContain('Alter Voiceover-Prompt');
    expect(fs.readFileSync(path.join(target, '02-bilder', 'bildprompts.md'), 'utf8')).toContain('Alte Bildprompts');
    expect(fs.existsSync(path.join(target, 'scene-plan.json'))).toBe(false);
  });

  it('migriert den konkreten alten public-Wochenordner 03_Mittwoch nach reels/03_Reel-Name', () => {
    const {reelsRoot, legacyPublicRoot, historyFile, env} = createEnvironment();
    const slug = 'zinseszins-fruehstart';
    const topic = 'Zinseszins und früher Sparbeginn';
    const legacy = path.join(legacyPublicRoot, '2026-07-27_bis_2026-08-02', '03_Mittwoch');
    fs.mkdirSync(path.join(legacy, 'audio'), {recursive: true});
    fs.mkdirSync(path.join(legacy, 'images'), {recursive: true});
    fs.writeFileSync(path.join(legacy, 'scene-plan.json'), JSON.stringify({slug, title: 'Zinseszins Frühstart', scriptText: 'Public-Inhalt bleibt erhalten.', marker: 'public-migration'}, null, 2));
    fs.writeFileSync(path.join(legacy, 'production-status.json'), JSON.stringify({version: 'finance-v1', slug, topic, stage: 'planning', approvals: {}}, null, 2));
    fs.writeFileSync(path.join(legacy, 'audio', 'voiceover-final.wav'), 'audio-fixture');
    fs.writeFileSync(path.join(legacy, 'images', '01-hook.png'), 'image-fixture');
    fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topics: [{slug, topic, status: 'reserved'}]}, null, 2));

    const result = run([slug, `--topic=${topic}`, '--title=Zinseszins Frühstart', '--publish-date=2026-07-29'], env);
    expect(result.status).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('Altes Produktionsprojekt aus public erkannt');
    const target = path.join(reelsRoot, '2026-07-27_bis_2026-08-02', '03_Zinseszins-Fruehstart');
    expect(fs.existsSync(legacy)).toBe(false);
    expect(JSON.parse(fs.readFileSync(path.join(target, '06-projektdateien', 'scene-plan.json'), 'utf8')).marker).toBe('public-migration');
    expect(fs.readFileSync(path.join(target, '01-script-audio', 'audio', 'voiceover-final.wav'), 'utf8')).toBe('audio-fixture');
    expect(fs.readFileSync(path.join(target, '02-bilder', 'images', '01-hook.png'), 'utf8')).toBe('image-fixture');
  });
});
