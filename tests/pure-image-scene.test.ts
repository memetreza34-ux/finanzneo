import fs from 'node:fs';
import path from 'node:path';
import {describe, expect, it} from 'vitest';

const root = process.cwd();
const imageScenePath = path.join(root, 'src/reels-test/FinanceImageSceneTest.tsx');
const registryPath = path.join(root, 'src/root/ExperimentCompositions.tsx');

const read = (file: string) => fs.readFileSync(file, 'utf8');

describe('pure image scene test', () => {
  it('uses image + header + captions as the complete scene structure', () => {
    const source = read(imageScenePath);

    expect(source).toContain('<Img');
    expect(source).toContain('<SceneHeader');
    expect(source).toContain('<Captions');
    expect(source).toContain("background: '#000'");
  });

  it('does not add explanatory Remotion motion on top of the image', () => {
    const source = read(imageScenePath);

    expect(source).not.toContain('useCurrentFrame');
    expect(source).not.toContain('interpolate(');
    expect(source).not.toContain('spring(');
    expect(source).not.toContain('LottieBox');
    expect(source).not.toContain('<svg');
    expect(source).not.toContain('transform:');
  });

  it('replaces the misunderstood hybrid composition in the experiment registry', () => {
    const registry = read(registryPath);

    expect(registry).toContain('ReelsTestFinanceImageScenes');
    expect(registry).not.toContain('ReelsTestFinanceImageHybridMotion');
  });
});
