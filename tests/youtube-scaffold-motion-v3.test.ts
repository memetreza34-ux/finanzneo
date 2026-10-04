import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Ersteller erzeugt Motion V3 und legacy-DNA Flow-Master', () => {
  const target = `youtube/.tmp-motion-v3-${process.pid}-${Date.now()}`;
  const absolute = resolve(target);
  try {
    const run = spawnSync(process.execPath, [
      resolve('scripts/create-finanzneo-youtube.mjs'),
      '--target', target,
      '--title', 'Motion V3 Test',
      '--types', 'image,hybrid,animation,data',
    ], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr || run.stdout);

    assert.equal(existsSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/visual-01/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/visual-02/bildprompt.txt')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/bildprompt.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/animation.tsx')), true);
    assert.equal(existsSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-04/data-notes.md')), true);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.version, 3);
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.imageWorld.primaryApprovedStyleAnchor, 'finanzneo-premium-physical-editorial-v8');
    assert.equal(index.imageWorld.legacyPromptDna, 'finanzneo-stylized-3d-editorial-v5');
    assert.deepEqual(index.imageWorld.flowVisualModes, [
      'grounded-scene',
      'character-story',
      'object-story',
      'physical-metaphor',
      'editorial-3d-illustration',
      'environmental-scene',
      'comparison-scene',
      'transformation-scene',
      'hybrid-scene-plate',
    ]);
    assert.equal(index.imageWorld.sceneSpecificColorsAllowed, true);
    assert.equal(index.imageWorld.peopleAllowedWhenUseful, true);
    assert.equal(index.imageWorld.precisionGraphicsOwner, 'remotion');
    assert.equal(index.imageWorld.flowInfographicLayoutsForbidden, true);
    assert.equal(index.imageWorld.referencePromptFile, '04-visuals/01-BILDPROMPTS/bildwelt.txt');
    assert.equal(index.thumbnail.planFile, '04-visuals/01-BILDPROMPTS/thumbnail-prompt.txt');
    assert.equal(index.motionStandard.id, 'finanzneo-youtube-motion-v3');
    assert.equal(index.motionStandard.viewerChangeFirstRequired, true);
    assert.equal(index.motionStandard.contentFirstTechniqueSelection, true);
    assert.equal(index.motionStandard.openTechniqueSelection, true);
    assert.equal(index.motionStandard.compositionFamiliesAreExamplesOnly, true);
    assert.equal(index.motionStandard.motionSignatureRequired, true);
    assert.equal(index.motionStandard.recentMotionWindow, 4);
    assert.deepEqual(index.visuals.map((visual: {type:string}) => visual.type), ['image','hybrid','animation','data']);
    assert.equal(index.visuals[0].planFile, '04-visuals/01-BILDPROMPTS/visual-01/bildprompt.txt');
    assert.equal(index.visuals[1].imagePlanFile, '04-visuals/01-BILDPROMPTS/visual-02/bildprompt.txt');

    const hybrid = index.visuals[1];
    assert.equal(typeof hybrid.viewerChange, 'string');
    assert.equal(typeof hybrid.techniqueDescription, 'string');
    assert.equal(Array.isArray(hybrid.toolStack), true);
    assert.deepEqual(Object.keys(hybrid.motionSignature).sort(), ['camera','layout','transformation']);

    const remotionPlan = readFileSync(resolve(absolute, '04-visuals/EINZELNE-VISUALS/visual-02/remotion.md'), 'utf8');
    assert.match(remotionPlan, /Viewer Change/);
    assert.match(remotionPlan, /Composition Family: \[FREE DESCRIPTIVE FAMILY/);

    const prompt = readFileSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/visual-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /finanzneo-premium-physical-editorial-v8/);
    assert.match(prompt, /LEGACY_PROMPT_DNA: finanzneo-stylized-3d-editorial-v5/);
    assert.match(prompt, /grounded-scene/i);
    assert.match(prompt, /character-story/i);
    assert.match(prompt, /physical-metaphor/i);
    assert.match(prompt, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.match(prompt, /scene-appropriate colors/i);
    assert.match(prompt, /MENSCHEN\/FIGUREN SIND ERLAUBT/);
    assert.doesNotMatch(prompt, /SIMPLE EXPLAINER/i);

    const imageWorld = readFileSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/bildwelt.txt'), 'utf8');
    assert.match(imageWorld, /finanzneo-premium-physical-editorial-v8/);
    assert.match(imageWorld, /LEGACY_PROMPT_DNA: finanzneo-stylized-3d-editorial-v5/);
    assert.match(imageWorld, /grounded-scene/i);
    assert.match(imageWorld, /editorial-3d-illustration/i);
    assert.match(imageWorld, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.match(imageWorld, /FARBEN SIND NICHT AUF/i);
    assert.doesNotMatch(imageWorld, /SIMPLE EXPLAINER/i);

    const flowPath = resolve(absolute, '04-visuals/alle-bildprompts.txt');
    assert.equal(existsSync(flowPath), true);
    const flow = readFileSync(flowPath, 'utf8');
    assert.match(flow, /DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG/);
    assert.match(flow, /finanzneo-premium-physical-editorial-v8/);
    assert.match(flow, /LEGACY_PROMPT_DNA: finanzneo-stylized-3d-editorial-v5/);
    assert.match(flow, /MAIN IDEA -> SCENE -> FULL STYLE LOCK/);
    assert.match(flow, /character-story/i);
    assert.match(flow, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.match(flow, /scene-appropriate colors/i);
    assert.match(flow, /MENSCHEN\/FIGUREN SIND ERLAUBT/);
    assert.doesNotMatch(flow, /SIMPLE EXPLAINER/i);
    assert.doesNotMatch(flow, /NICHT MEHR HIER ARBEITEN/);
    assert.doesNotMatch(flow, /vollständigen.*liegen jetzt/i);

    assert.equal(existsSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, 'GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/bildwelt.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/thumbnail-prompt.txt')), false);

    const readme = readFileSync(resolve(absolute, 'README.md'), 'utf8');
    assert.match(readme, /genau diese Datei vollständig und 1:1/i);
    assert.match(readme, /04-visuals\/alle-bildprompts\.txt/);
    assert.match(readme, /MAIN IDEA → SCENE → FULL STYLE LOCK/);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
