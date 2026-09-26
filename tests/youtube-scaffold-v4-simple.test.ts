import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Scaffolder erzeugt V4 mit 1-Gedanke-Flow-Storytelling, Shared-Handoff und stylized-3D-Welt', () => {
  const target = `youtube/.tmp-motion-v4-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/scaffold-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Simple Finance V4 Test',
      '--types', 'image,hybrid,animation,data,real-asset',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);

    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-04/data-notes.md')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-05/asset-plan.md')), true);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.version, 4);
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.visualProfile.id, 'finanzneo-youtube-simple-finance-v1');
    assert.equal(index.visualProfile.simplestVisualFirst, true);
    assert.equal(index.visualProfile.oneMainIdeaPerVisual, true);
    assert.deepEqual(index.visualProfile.recommendedFlowVoiceoverSentences, [1,2]);
    assert.equal(index.visualProfile.splitMultiIdeaBeats, true);
    assert.equal(index.visualProfile.remotionDefault, true);
    assert.equal(index.visualProfile.flowRequiresJustification, true);
    assert.equal(index.visualProfile.realAssetsPreferred, true);
    assert.equal(index.visualProfile.reusablePatternsAllowed, true);
    assert.equal(index.visualProfile.flowVisualStorytellingRequired, true);
    assert.equal(index.visualProfile.staticCatalogDefaultForbidden, true);

    assert.equal(index.googleFlow.sharedHandoffMayContainMultipleImageBlocks, true);
    assert.equal(index.googleFlow.fixedImageBlockCount, false);
    assert.equal(index.googleFlow.strictSequential, true);
    assert.equal(index.googleFlow.stopAfterFinalPlannedImage, true);

    assert.equal(index.motionStandard.id, 'finanzneo-youtube-motion-v4-simple');
    assert.equal(index.motionStandard.repetitionAllowed, true);
    assert.equal(index.motionStandard.varietyQuota, false);
    assert.equal(index.motionStandard.advancedMotionNeedsReason, true);
    assert.equal(index.imageWorld.id, 'finanzneo-youtube-grounded-3d-black-v1');
    assert.equal(index.imageWorld.stylized3D, true);
    assert.equal(index.imageWorld.simpleComposition, true);
    assert.equal(index.imageWorld.visualStorytellingRequired, true);
    assert.equal(index.imageWorld.deepBlackWorld, true);
    assert.equal(index.imageWorld.remotionOwnsTextAndNumbers, true);
    assert.deepEqual(index.visuals.map((visual: {type:string}) => visual.type), ['image','hybrid','animation','data','real-asset']);

    const image = index.visuals[0];
    assert.equal(image.assetSource, 'google-flow');
    assert.equal(image.flowAllowed, true);
    assert.equal(typeof image.flowReason, 'string');
    assert.equal(typeof image.visualStory, 'string');

    const animation = index.visuals[2];
    assert.equal(animation.assetSource, 'remotion');
    assert.equal(animation.flowAllowed, false);
    assert.equal(typeof animation.viewerChange, 'string');
    assert.equal(typeof animation.motionPreset, 'string');

    const realAsset = index.visuals[4];
    assert.equal(realAsset.assetSource, 'real-asset');
    assert.equal(realAsset.flowAllowed, false);
    assert.match(realAsset.planFile, /asset-plan\.md$/);

    const remotionPlan = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-03/remotion.md'), 'utf8');
    assert.match(remotionPlan, /Viewer Change/);
    assert.match(remotionPlan, /Motion Preset/);
    assert.match(remotionPlan, /Do not invent complexity for variety/);

    const prompt = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /finanzneo-youtube-grounded-3d-black-v1/);
    assert.match(prompt, /stylized 3D animation-film/i);
    assert.match(prompt, /deep seamless black/i);
    assert.match(prompt, /FLOW_NECESSITY_REASON:/);
    assert.match(prompt, /VOICEOVER CONTEXT:/);
    assert.match(prompt, /VISUAL STORYTELLING:/);
    assert.match(prompt, /1-2 short Voiceover sentences/i);
    assert.match(prompt, /static tabletop|catalog/i);
    assert.match(prompt, /REMOTION_OVERLAY_TEXT:/);
    assert.doesNotMatch(prompt, /Simple editorial finance illustration/);

    const allPrompts = readFileSync(resolve(absolute, '04-visuals/alle-bildprompts.txt'), 'utf8');
    assert.match(allPrompts, /ONE shared Google Flow handoff/);
    assert.match(allPrompts, /3, 5, 10 or more planned image blocks/);
    assert.match(allPrompts, /exactly ONE image/i);
    assert.match(allPrompts, /Only after PASS continue/i);
    assert.match(allPrompts, /After the final planned image, STOP/);
    assert.match(allPrompts, /one dominant idea/i);
    assert.match(allPrompts, /1-2 short Voiceover sentences/i);
    assert.match(allPrompts, /visual storytelling|cause-effect/i);
    assert.match(allPrompts, /premium stylized 3D/i);
    assert.match(allPrompts, /NO FLOW IMAGE/);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
