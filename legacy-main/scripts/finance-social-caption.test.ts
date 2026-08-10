import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
// @ts-ignore — Node-ESM-Hilfsmodul.
import {ensureFinanceProjectStructure, financeProjectPaths} from './lib/finance-project-structure.mjs';

const root = process.cwd();
const checker = path.join(root, 'scripts/check-finance-social-caption.mjs');
const tempDirs: string[] = [];
const run = (reelDir: string) => spawnSync(process.execPath, [checker, reelDir], {cwd: root, encoding: 'utf8'});
const output = (result: ReturnType<typeof run>) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

afterEach(() => {
  while (tempDirs.length) fs.rmSync(tempDirs.pop()!, {recursive: true, force: true});
});

const fixture = () => {
  const reelDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finance-social-caption-'));
  tempDirs.push(reelDir);
  fs.writeFileSync(path.join(reelDir, 'scene-plan.json'), JSON.stringify({slug: 'caption-test', scriptText: 'Test'}));
  const paths = ensureFinanceProjectStructure(reelDir, {title: 'Caption-Test', topic: 'Zinseszins'});
  return {reelDir, paths};
};

const validCaption = `# Social-Media-Caption\n\n💬 Kommentiere ZINS und ich schicke dir kostenlos die passende PDF per DM.\n\nZinseszins wird oft unterschätzt\n\nEin früher Start kann langfristig einen deutlichen Unterschied machen. Entscheidend sind Zeit, Regelmäßigkeit und realistische Annahmen.\n\nWann möchtest du mit deinem Sparplan beginnen?\n\n#Finanzen #Zinseszins #Sparen #Geldanlage #FinanzNeo\n`;

describe('Finance Social-Media-Caption-QA', () => {
  it('akzeptiert eine direkt kopierbare Caption mit genau fünf Hashtags', () => {
    const {reelDir, paths} = fixture();
    fs.writeFileSync(paths.socialCaption, validCaption);
    const result = run(reelDir);
    expect(result.status).toBe(0);
    expect(output(result)).toContain('fünf eindeutige Hashtags');
  });

  it('blockiert TODO und KEYWORD', () => {
    const {reelDir} = fixture();
    const result = run(reelDir);
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SOCIAL_CAPTION_PLACEHOLDER');
  });

  it('blockiert eine falsche Hashtag-Anzahl', () => {
    const {reelDir, paths} = fixture();
    fs.writeFileSync(paths.socialCaption, validCaption.replace(' #FinanzNeo', ''));
    const result = run(reelDir);
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SOCIAL_CAPTION_HASHTAG_COUNT');
  });

  it('blockiert eine Caption ohne Zuschauerfrage', () => {
    const {reelDir, paths} = fixture();
    fs.writeFileSync(paths.socialCaption, validCaption.replace('Wann möchtest du mit deinem Sparplan beginnen?', 'Beginne jetzt mit deinem Sparplan.'));
    const result = run(reelDir);
    expect(result.status).toBe(1);
    expect(output(result)).toContain('SOCIAL_CAPTION_QUESTION_MISSING');
  });
});
