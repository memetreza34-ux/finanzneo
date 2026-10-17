import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Scaffolder erzeugt Motion V3 mit offener Technik und Viewer Change', () => {
  const target = `youtube/.tmp-motion-v3-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  const intern = resolve(target, '_intern');
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/scaffold-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Motion V3 Test',
      '--types', 'image,hybrid,animation,data',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);
    // Sichtbar sind nur die fünf Arbeitsordner, alles andere liegt in _intern/.
    assert.deepEqual(readdirSync(absolute).sort(), ['1-script', '2-bildprompts', '3-bilder-hier-rein', '4-audio-hier-rein', '5-export', '_intern']);
    assert.equal(existsSync(resolve(absolute, '1-script/script.txt')), true);
    assert.equal(existsSync(resolve(intern, '04-visuals/EINZELNE-VISUALS/visual-02/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(intern, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(intern, '04-visuals/EINZELNE-VISUALS/visual-04/data-notes.md')), true);

    const index = JSON.parse(readFileSync(resolve(intern, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.version, 3);
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.motionStandard.id, 'finanzneo-youtube-motion-v3');
    assert.equal(index.motionStandard.viewerChangeFirstRequired, true);
    assert.equal(index.motionStandard.openTechniqueSelection, true);
    assert.equal(index.motionStandard.compositionFamiliesAreExamplesOnly, true);
    assert.equal(index.motionStandard.motionSignatureRequired, true);
    assert.equal(index.motionStandard.recentMotionWindow, 4);
    assert.deepEqual(index.visuals.map((visual: {type:string}) => visual.type), ['image','hybrid','animation','data']);

    const hybrid = index.visuals[1];
    assert.equal(typeof hybrid.viewerChange, 'string');
    assert.equal(typeof hybrid.techniqueDescription, 'string');
    assert.equal(Array.isArray(hybrid.toolStack), true);
    assert.deepEqual(Object.keys(hybrid.motionSignature).sort(), ['camera','layout','transformation']);

    const remotionPlan = readFileSync(resolve(intern, '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md'), 'utf8');
    assert.match(remotionPlan, /Viewer Change/);
    assert.match(remotionPlan, /Composition Family: \[FREE DESCRIPTIVE FAMILY/);

    const prompt = readFileSync(resolve(intern, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /FINANZNEO_IMAGE_WORLD: finanzneo-editorial-finance-v1/);
    assert.match(prompt, /FLOW_AGENT_PROTOCOL: finanzneo-flow-batch5-v1/);
    assert.match(prompt, /One spoken thought becomes one simple visual idea/);
    assert.match(prompt, /must be German/);
    const alle = readFileSync(resolve(absolute, '2-bildprompts/bildprompts.txt'), 'utf8');
    // Stilvorlage zuerst: Batch 1 nur das Thumbnail, danach hängt es an jedem Bild.
    assert.match(alle, /BATCH 1 — START ALL TOGETHER: Thumbnail\n/);
    assert.match(alle, /BATCH 2 — START ALL TOGETHER: Bild 01/);
    assert.match(alle, /STYLE_REFERENCE:\nFinanzNeo Stilvorlage\.png — attach/);
    assert.match(alle, /STYLE MASTER \(WHOLE CHANNEL\)/);
    assert.match(alle, /Never photorealistic, never a photo/);
    assert.equal(index.googleFlow.batchSize, 5);
    assert.equal(index.motionStandard.contentFirstTechniqueSelection, true);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
