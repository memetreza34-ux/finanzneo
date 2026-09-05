#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins');
const index = JSON.parse(readFileSync(resolve(root, '03-szenen/scene-index.json'), 'utf8'));

const compactTail = `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1

STYLE:
Premium real-life, real-world-grounded stylized 3D animation with believable object proportions, soft rounded geometry, polished materials, clean studio lighting and soft contact shadows. The viewer must immediately understand the concrete financial situation and its cause-and-effect relationship without narration.

BACKGROUND:
One seamless deep black background with strong subject separation. No horizon or decorative effects.

TEXT:
Only the explicitly requested short German object labels. No headline, subtitle, CTA or long generated explanation.

FORBIDDEN:
No photorealism or photorealistic product-photo look. No dashboard, app UI, website screenshot, flowchart, floating UI cards, generic finance-icon arrangement, miniature diorama or decorative clutter.

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
Literal first, creative second.
TRANSFERABILITY-TEST: The concrete real-world finance situation must stay specific to this spoken point.
Förderbänder, Schienen, Schranken, Käfige and fantasy machines are not default explanations for static images; use the real situation first.
`;

const additions = {
  'scene-07': ' Arrange the contract and twelve-month calendar as one believable checking situation: the paper edge should physically overlap the calendar, a pen may rest beside the annual term, and the twelve month tabs must be clearly countable at a glance. The composition should feel like someone verifying what “p.a.” means before choosing the account.',
  'scene-11': ' Make the two documents visibly different in purpose: the advertising leaflet is bolder and simpler, while the conditions sheet is denser but still stylized and readable. The pointing pen and hand position must make the checking action unmistakable, so the viewer sees advertising being compared against real terms rather than two random papers.',
  'scene-12': ' Keep all three checks on one believable bank document rather than separate floating cards. The pen tip should move visually from the duration field to the standard-rate field and then to the customer-condition field, creating a clear reading order while the paper remains the single main subject.',
};

const compact = (path, sceneId, isCover = false) => {
  if (!existsSync(path)) throw new Error('Prompt fehlt: ' + path);
  let source = readFileSync(path, 'utf8');
  const worldMarker = '\n\nFINANZNEO_WORLD_ID:';
  const worldAt = source.indexOf(worldMarker);
  if (worldAt < 0) throw new Error('FINANZNEO_WORLD_ID fehlt: ' + path);
  let head = source.slice(0, worldAt).trimEnd();

  if (additions[sceneId]) {
    const imageAt = head.indexOf('IMAGE PROMPT:');
    if (imageAt < 0) throw new Error('IMAGE PROMPT fehlt: ' + path);
    head += additions[sceneId];
  }

  if (isCover && !/BESCHRIFTUNGEN – EXAKT SO:/i.test(head)) {
    const marker = 'VISUAL_STRATEGY:';
    const labelBlock = 'BESCHRIFTUNGEN – EXAKT SO:\n- Tagesgeld\n- 3 % p.a.\n- 3 Monate\n\n';
    head = head.replace(marker, labelBlock + marker);
  }

  let suffix = compactTail;
  if (isCover) {
    suffix += `\nCOVER_HOOK_CONTRACT: finanzneo-cover-hook-v2\nTECHNISCHER COVER-ALIAS — KEIN SEPARATER BILDJOB\nNo separate cover generation.\nno Bild 00.\n`;
  }
  const output = head + '\n\n' + suffix;
  if (output.length > 4200) throw new Error(`${sceneId} bleibt zu lang: ${output.length}`);
  const imagePrompt = output.split('IMAGE PROMPT:')[1]?.split(/\n\nFINANZNEO_WORLD_ID:/)[0]?.trim() ?? '';
  if (imagePrompt.length < 450) throw new Error(`${sceneId} IMAGE PROMPT zu kurz: ${imagePrompt.length}`);
  writeFileSync(path, output, 'utf8');
  console.log(`✓ ${sceneId}: ${output.length} Zeichen gesamt · ${imagePrompt.length} Zeichen Motivprompt`);
};

for (const scene of index.scenes ?? []) {
  if (scene.type !== 'image') continue;
  const relative = String(scene.planFile).replace(/^03-szenen\//, '');
  compact(resolve(root, '03-szenen', relative), scene.id, false);
}
compact(resolve(root, '03-szenen/00-cover/cover.txt'), 'scene-01-cover', true);

console.log('✓ V9-Prompts kompakt gehalten: weniger Boilerplate, Motivinformation bleibt dominant.');
