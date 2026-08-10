import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

const repoRoot = process.cwd();
const script = path.join(repoRoot, 'scripts/new-finance-week-reel.mjs');
const roots: string[] = [];

const createEnvironment = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-one-topic-per-day-'));
  roots.push(root);
  const reelsRoot = path.join(root, 'reels');
  const legacyPublicRoot = path.join(root, 'public-reels');
  const historyFile = path.join(root, 'topic-history.json');
  fs.mkdirSync(reelsRoot, {recursive: true});
  fs.mkdirSync(legacyPublicRoot, {recursive: true});
  fs.writeFileSync(historyFile, JSON.stringify({version: 'finance-v1', topics: []}, null, 2));
  return {
    root,
    reelsRoot,
    historyFile,
    env: {
      ...process.env,
      FINANCE_REELS_ROOT: reelsRoot,
      FINANCE_LEGACY_PUBLIC_ROOT: legacyPublicRoot,
      FINANCE_TOPIC_HISTORY_FILE: historyFile,
    },
  };
};

const run = (
  env: NodeJS.ProcessEnv,
  slug: string,
  topic: string,
  title: string,
  publishDate: string,
  selectionMode = 'evergreen',
) => spawnSync(process.execPath, [
  script,
  slug,
  `--topic=${topic}`,
  `--title=${title}`,
  `--publish-date=${publishDate}`,
  `--selection-mode=${selectionMode}`,
  '--selection-reason=Automatisch gewählt, weil das Thema noch unbenutzt, anfängerrelevant und klar visualisierbar ist.',
  '--selected-by=assistant',
], {
  cwd: repoRoot,
  env,
  encoding: 'utf8',
});

const output = (result: ReturnType<typeof run>) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, {recursive: true, force: true});
});

describe('FinanzNeo: genau ein Thema pro Wochentag', () => {
  it('legt für einen Aufruf nur den konkreten Tagesordner an', () => {
    const fixture = createEnvironment();
    const result = run(
      fixture.env,
      'zinseszins-fruehstart',
      'Zinseszins durch frühen Sparstart',
      'Zinseszins Frühstart',
      '2026-07-29',
    );

    expect(result.status).toBe(0);
    expect(output(result)).toContain('Es wurde nur dieser eine Tagesordner angelegt.');

    const week = path.join(fixture.reelsRoot, '2026-07-27_bis_2026-08-02');
    expect(fs.readdirSync(week).sort()).toEqual(['03_Zinseszins-Fruehstart']);

    const statusFile = path.join(week, '03_Zinseszins-Fruehstart', '06-projektdateien', 'production-status.json');
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    expect(status.dayNumber).toBe(3);
    expect(status.topicSelection).toMatchObject({
      selectedBy: 'assistant',
      mode: 'evergreen',
    });
    expect(status.topicSelection.reason).toContain('unbenutzt');
  });

  it('blockiert ein zweites Thema am selben Tag', () => {
    const fixture = createEnvironment();
    expect(run(fixture.env, 'thema-eins', 'Erstes Thema', 'Erstes Thema', '2026-07-29').status).toBe(0);

    const second = run(fixture.env, 'thema-zwei', 'Zweites Thema', 'Zweites Thema', '2026-07-29');
    expect(second.status).toBe(1);
    expect(output(second)).toContain('Pro Tag ist genau ein Reel erlaubt');

    const week = path.join(fixture.reelsRoot, '2026-07-27_bis_2026-08-02');
    expect(fs.readdirSync(week)).toHaveLength(1);
  });

  it('legt am nächsten freien Tag genau einen weiteren Reel-Ordner an', () => {
    const fixture = createEnvironment();
    expect(run(fixture.env, 'mittwoch-thema', 'Mittwoch Thema', 'Mittwoch Thema', '2026-07-29').status).toBe(0);
    expect(run(fixture.env, 'donnerstag-thema', 'Donnerstag Thema', 'Donnerstag Thema', '2026-07-30', 'trend').status).toBe(0);

    const week = path.join(fixture.reelsRoot, '2026-07-27_bis_2026-08-02');
    expect(fs.readdirSync(week).sort()).toEqual([
      '03_Mittwoch-Thema',
      '04_Donnerstag-Thema',
    ]);

    const history = JSON.parse(fs.readFileSync(fixture.historyFile, 'utf8'));
    expect(history.topics).toHaveLength(2);
    expect(history.topics.find((entry: any) => entry.slug === 'donnerstag-thema')).toMatchObject({
      dayNumber: 4,
      selectionMode: 'trend',
      selectedBy: 'assistant',
    });
  });
});
