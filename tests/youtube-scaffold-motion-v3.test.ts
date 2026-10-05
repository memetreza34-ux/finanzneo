import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {
  YOUTUBE_FLOW_IMAGE_POLICY_ID,
  YOUTUBE_FLOW_MEANING_FIRST_MARKER,
  YOUTUBE_FLOW_VISUAL_MODES,
} from '../scripts/lib/youtube-contract.mjs';

test('YouTube-Ersteller erzeugt Motion V3 plus meaning-first Flow-Master', () => {
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
    assert.equal(existsSync(resolve(absolute, '06-projektdateien/layout.json')), true);

    const index = JSON.parse(readFileSync(resolve(absolute, '04-visuals/visual-index.json'), 'utf8'));
    assert.equal(index.version, 3);
    assert.equal(index.fixedVisualCount, false);
    assert.equal(index.fixedImageAnimationRatio, false);
    assert.equal(index.imageWorld.styleLockId, 'finanzneo-youtube-animated-black-v3');
    assert.equal(index.imageWorld.imageWorldFile, 'config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt');
    assert.equal(index.imageWorld.primaryApprovedStyleAnchor, 'finanzneo-stylized-3d-animated-black-v9');
    assert.match(index.imageWorld.approvedStyleReferences, /Kurse schwanken/);
    assert.match(index.imageWorld.approvedStyleReferences, /Notgroschen/);
    assert.equal('legacyPromptDna' in index.imageWorld, false);
    assert.equal(index.imageWorld.visualDecisionPolicy, YOUTUBE_FLOW_IMAGE_POLICY_ID);
    assert.equal(index.imageWorld.meaningFirstRequired, true);
    assert.equal(index.imageWorld.sceneFirst, false);
    assert.equal(index.imageWorld.placeRequired, false);
    assert.equal(index.imageWorld.realSceneRequired, false);
    assert.equal(index.imageWorld.peopleRequired, false);
    assert.equal(index.imageWorld.semanticObjectCompositionsAllowed, true);
    assert.equal(index.imageWorld.visualMetaphorsAllowed, true);
    assert.equal(index.imageWorld.decisiveMomentRequired, false);
    assert.deepEqual(index.imageWorld.flowVisualModes, [...YOUTUBE_FLOW_VISUAL_MODES]);
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
    assert.match(prompt, /STYLE_AUTHORITY: finanzneo-youtube-animated-black-v3/);
    assert.match(prompt, new RegExp(YOUTUBE_FLOW_MEANING_FIRST_MARKER));
    assert.match(prompt, /FLOW_IMAGE_POLICY: meaning-first-free-visual-v2/);
    assert.match(prompt, /KEIN scene-first/i);
    assert.match(prompt, /SEMANTISCHE ANORDNUNG/);
    assert.match(prompt, /OPTIONAL LOCATION/i);
    assert.match(prompt, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.doesNotMatch(prompt, /LEGACY_PROMPT_DNA|premium-physical-editorial-v8|stylized-3d-editorial-v5|SIMPLE EXPLAINER/i);

    const imageWorld = readFileSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/bildwelt.txt'), 'utf8');
    assert.match(imageWorld, /STYLE_AUTHORITY: finanzneo-youtube-animated-black-v3/);
    assert.match(imageWorld, new RegExp(YOUTUBE_FLOW_MEANING_FIRST_MARKER));
    assert.match(imageWorld, /semantic object composition/i);
    assert.match(imageWorld, /visual metaphor/i);
    assert.match(imageWorld, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.doesNotMatch(imageWorld, /FLOW_IMAGE_POLICY:\s*scene-first-no-infographic-v1|SIMPLE EXPLAINER/i);

    const flowPath = resolve(absolute, '04-visuals/alle-bildprompts.txt');
    assert.equal(existsSync(flowPath), true);
    const flow = readFileSync(flowPath, 'utf8');
    assert.match(flow, /DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG/);
    assert.match(flow, /STYLE_AUTHORITY: finanzneo-youtube-animated-black-v3/);
    assert.match(flow, new RegExp(YOUTUBE_FLOW_MEANING_FIRST_MARKER));
    assert.match(flow, /FLOW_IMAGE_POLICY: meaning-first-free-visual-v2/);
    assert.match(flow, /KEIN scene-first/i);
    assert.match(flow, /SEMANTISCHE ANORDNUNG/);
    assert.match(flow, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.match(flow, /PHASE 0 — EIN GOOGLE-FLOW-ORDNER PRO VIDEO/);
    assert.match(flow, /NICHT GEWÄHLTE COVER LÖSCHEN/);
    assert.match(flow, /Generate exactly the IMAGE\/HYBRID jobs planned below — no more, no less/);
    assert.match(flow, /FERTIGER FLOW-ORDNER/);
    assert.match(flow, /NATÜRLICH — KEIN KI-LOOK/);
    assert.doesNotMatch(flow, /FLOW_IMAGE_POLICY:\s*scene-first-no-infographic-v1|LEGACY_PROMPT_DNA|premium-physical-editorial-v8|SIMPLE EXPLAINER/i);
    assert.doesNotMatch(flow, /NICHT MEHR HIER ARBEITEN/);

    assert.equal(existsSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, 'GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/bildwelt.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/thumbnail-prompt.txt')), false);

    const readme = readFileSync(resolve(absolute, 'README.md'), 'utf8');
    assert.match(readme, /genau diese Datei vollständig und 1:1/i);
    assert.match(readme, /04-visuals\/alle-bildprompts\.txt/);
    assert.match(readme, /Bedeutung zuerst, Form frei/i);
    assert.match(readme, /Person, ein Ort oder eine reale Szene sind niemals Pflicht/i);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
