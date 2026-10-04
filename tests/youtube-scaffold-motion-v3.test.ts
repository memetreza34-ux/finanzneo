import assert from 'node:assert/strict';
import {existsSync, readFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';

test('YouTube-Ersteller erzeugt Motion V3 und den Flow-Master der Bildwelt A+B', () => {
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
    assert.equal(index.imageWorld.styleLockId, 'finanzneo-youtube-animated-black-v3');
    assert.equal(index.imageWorld.imageWorldFile, 'config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt');
    assert.equal(index.imageWorld.primaryApprovedStyleAnchor, 'finanzneo-stylized-3d-animated-black-v9');
    assert.match(index.imageWorld.approvedStyleReferences, /Kurse schwanken/);
    assert.match(index.imageWorld.approvedStyleReferences, /Notgroschen/);
    assert.equal('legacyPromptDna' in index.imageWorld, false);
    assert.equal(index.imageWorld.decisiveMomentRequired, true);
    assert.deepEqual(index.imageWorld.flowVisualModes, [
      'character-moment',
      'hands-in-action',
      'object-story',
      'everyday-scene',
      'comparison-scene',
      'creative-idea',
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
    assert.match(prompt, /STYLE_AUTHORITY: finanzneo-youtube-animated-black-v3/);
    assert.match(prompt, /LOOK FEST — INHALT FREI/);
    assert.match(prompt, /animated-feature-film/);
    assert.match(prompt, /DECISIVE_MOMENT:/);
    assert.match(prompt, /IMAGE PROMPT\nStylized 3D animated feature film still, 16:9\. \[WHAT IS IN THE FRAME\]\. \[OPTIONAL DECISIVE MOMENT: /);
    assert.match(prompt, /Only text: \[SHORT GERMAN TEXT/);
    assert.doesNotMatch(prompt, /Expressive faces, real everyday objects/);
    assert.match(prompt, /character-moment/);
    assert.match(prompt, /real everyday objects/);
    assert.match(prompt, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.doesNotMatch(prompt, /LEGACY_PROMPT_DNA|premium-physical-editorial-v8|stylized-3d-editorial-v5/);
    assert.doesNotMatch(prompt, /chunky/i);
    assert.doesNotMatch(prompt, /Pixar/i);
    assert.doesNotMatch(prompt, /SIMPLE EXPLAINER/i);

    const imageWorld = readFileSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/bildwelt.txt'), 'utf8');
    assert.match(imageWorld, /YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-animated-black-v3/);
    assert.match(imageWorld, /LOOK FEST — INHALT FREI/);
    assert.match(imageWorld, /grün-goldene Symbolwelt/);
    assert.match(imageWorld, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.doesNotMatch(imageWorld, /LEGACY_PROMPT_DNA|chunky|Pixar/i);
    assert.doesNotMatch(imageWorld, /SIMPLE EXPLAINER/i);

    const flowPath = resolve(absolute, '04-visuals/alle-bildprompts.txt');
    assert.equal(existsSync(flowPath), true);
    const flow = readFileSync(flowPath, 'utf8');
    assert.match(flow, /DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG/);
    assert.match(flow, /STYLE_AUTHORITY: finanzneo-youtube-animated-black-v3/);
    assert.match(flow, /APPROVED_STYLE_REFERENCES: .*Kurse schwanken.*Notgroschen/);
    assert.match(flow, /ENTSCHEIDENDER MOMENT — NUR AB UND ZU/);
    assert.match(flow, /ZITATE, STICHWORTE, TABELLEN: Remotion-Karten/);
    assert.match(flow, /IMAGE PROMPT\nStylized 3D animated feature film still, 16:9\./);
    assert.match(flow, /Prompts in English, one short paragraph, same shape every time/);
    assert.match(flow, /character-moment/);
    assert.match(flow, /PRECISION_GRAPHICS_OWNER: REMOTION/);
    assert.doesNotMatch(flow, /LEGACY_PROMPT_DNA|premium-physical-editorial-v8|chunky|Pixar/i);
    assert.doesNotMatch(flow, /Büro-\/Papier-Stillleben/);
    assert.doesNotMatch(flow, /SIMPLE EXPLAINER/i);
    assert.match(flow, /PHASE 0 — EIN GOOGLE-FLOW-ORDNER PRO VIDEO\n1\. Work in exactly ONE Google Flow project \(folder\) for this video\. Name it: FinanzNeo – Motion V3 Test/);
    assert.match(flow, /NICHT GEWÄHLTE COVER LÖSCHEN: delete the two non-selected candidates/);
    assert.match(flow, /Generate exactly the IMAGE\/HYBRID jobs planned below — no more, no less/);
    assert.match(flow, /delete the failed result from the Flow folder and regenerate only that same number/);
    assert.match(flow, /FERTIGER FLOW-ORDNER\n1\. The Flow folder contains exactly the selected thumbnail plus every planned scene image/);
    assert.match(flow, /NATÜRLICH — KEIN KI-LOOK:/);
    assert.match(flow, /KI-SLOP VERBOTEN: glowing or neon edges, glass or crystal bars/);
    assert.doesNotMatch(flow, /discard the other two from the final folder/);
    assert.doesNotMatch(flow, /NICHT MEHR HIER ARBEITEN/);
    assert.doesNotMatch(flow, /vollständigen.*liegen jetzt/i);

    assert.equal(existsSync(resolve(absolute, '04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, 'GOOGLE-FLOW-PROMPT.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/bildwelt.txt')), false);
    assert.equal(existsSync(resolve(absolute, '04-visuals/thumbnail-prompt.txt')), false);

    const readme = readFileSync(resolve(absolute, 'README.md'), 'utf8');
    assert.match(readme, /genau diese Datei vollständig und 1:1/i);
    assert.match(readme, /04-visuals\/alle-bildprompts\.txt/);
    assert.match(readme, /kurzer englischer Absatz in immer derselben Form/);
    assert.match(readme, /optional der Moment/);
    assert.match(readme, /Look fest, Inhalt frei/);
  } finally {
    rmSync(absolute, {recursive:true, force:true});
  }
});
