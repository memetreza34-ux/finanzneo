import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

const root = process.cwd();
const checker = path.join(root, 'scripts/check-finance-project-folder.mjs');
const tempDirs: string[] = [];
const output = (result: ReturnType<typeof spawnSync>) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

describe('Finance Ordnersperre', () => {
  it('blockiert Produktionsprojekte unter public/reels', () => {
    const publicProject = path.join(root, 'channels/finanzneo/public/reels', `legacy-folder-${process.pid}`);
    tempDirs.push(publicProject);
    fs.mkdirSync(publicProject, {recursive: true});
    const result = spawnSync(process.execPath, [checker, publicProject], {cwd: root, encoding: 'utf8'});
    expect(result.status).toBe(1);
    expect(output(result)).toContain('FINANCE_FOLDER_INVALID');
    expect(output(result)).toContain('außerhalb von channels/finanzneo/reels');
  });

  it('blockiert reine Wochentagsordner wie 03_Mittwoch', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-folder-gate-'));
    tempDirs.push(temp);
    const reelsRoot = path.join(temp, 'reels');
    const project = path.join(reelsRoot, '2026-07-27_bis_2026-08-02', '03_Mittwoch');
    fs.mkdirSync(project, {recursive: true});
    const result = spawnSync(process.execPath, [checker, project], {
      cwd: root,
      encoding: 'utf8',
      env: {...process.env, FINANCE_REELS_ROOT: reelsRoot},
    });
    expect(result.status).toBe(1);
    expect(output(result)).toContain('FINANCE_FOLDER_INVALID');
    expect(output(result)).toContain('verständlicher Reel-Name');
  });
});
