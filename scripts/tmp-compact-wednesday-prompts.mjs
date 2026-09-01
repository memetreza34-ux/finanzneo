#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';

const root = 'reels/2026-08-31_bis_2026-09-06/mittwoch/reel-03_geld-am-monatsende';
const index = JSON.parse(readFileSync(`${root}/03-szenen/scene-index.json`, 'utf8'));

const compactPrompt = (scene, isCover = false) => {
  const labels = Array.isArray(scene.objectLabels) ? scene.objectLabels : [];
  const labelLines = labels.length ? labels.map((x) => `- ${x}`).join('\n') : '- none';
  const lines = [
    'FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1',
    'FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3',
    'GOOGLE FLOW – FINALER DATEINAME:',
    scene.googleFlowFileName,
    '',
    'BESCHRIFTUNGEN – EXAKT SO:',
    labelLines,
    '',
    'IMAGE PROMPT:',
    `Create one polished stylized 3D animated finance-explainer image for this exact spoken beat. ${scene.expectedVisual} The visible story must specifically communicate this action or consequence: ${scene.mainIdea} Ground the composition in a believable everyday situation with recognizable real-world objects, clear physical relationships and a strong focal point. Make the cause-and-effect readable immediately without narration: the viewer should clearly understand what is happening and why within one second. Use depth, scale, contact shadows and restrained cinematic lighting to make the scene feel tangible and premium. Supporting objects are allowed only when they improve the explanation. Keep all requested German object labels short, legible and naturally attached to their objects; do not add any other explanatory text. Avoid a static catalog arrangement: show a moment, action, contrast or consequence that feels like a real situation.`,
    '',
    'FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3',
    'FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1',
    'GENERATED_IMAGE_ASPECT_RATIO: 1:1',
    'PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9',
    'IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2',
  ];
  if (isCover) {
    lines.push(
      'FUTURE_COVER_HOOK: finanzneo-cover-hook-v2',
      'The Flow image itself contains KEINEN Reel-Titel, no headline, no subtitle and no CTA.',
      'Reserve calm deep-black negative space in the upper area for the exact Remotion reel title. The title is rendered later from frame 0.',
    );
  }
  lines.push(
    '',
    'STYLE + SAFETY:',
    'Use stylized 3D animated geometry, simplified premium materials and a seamless deep black background. Keep the scene real-world-grounded and non-photorealistic. Soft contact shadows and clean subject-separation lighting are required. No photorealism, product-photo look, dashboard, app UI, flowchart, floating UI tiles, microchip/circuit language, miniature diorama or decorative clutter. Keine stumpfen Symbolbilder als Haupterklärung. Bevorzuge Ursache → Wirkung, Handlung → Konsequenz oder klaren Vorher/Nachher-Kontrast. Wenn ein neuer konkreter Gedanke mehr Platz braucht, lieber ein zusätzliches Bild planen statt dieses Motiv zu überladen.',
    '',
  );
  return lines.join('\n');
};

const masterHeader = [
  'FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1',
  'FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3',
  'FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2',
  'FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1',
  '',
  'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH',
  'DIES IST KEIN BATCH-AUFTRAG',
  'MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG',
  'ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT, bis das aktuelle Bild vollständig zurückgegeben, exakt umbenannt und per QA geprüft wurde.',
  'VERBOTEN: mehrere Bilder in einem Generierungsaufruf.',
  'VERBOTEN: mehrere Bildprompts zusammenfassen.',
  'VERBOTEN: Bilder vorab in eine Queue stellen.',
  'VERBOTEN: alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen.',
  'WARTE NIEMALS AUF "WEITER". Nach erfolgreicher QA automatisch mit dem nächsten freigeschalteten Bildblock fortfahren.',
  'MAX_CONCURRENT_GENERATIONS = 1',
  'FINAL_IMAGE_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/',
  'COVER = SZENE 01',
  'KEIN separates Cover erzeugen',
  'KEIN Bild 00 erzeugen',
  '',
].join('\n');

const blocks = [];
for (const scene of index.scenes.filter((s) => s.type === 'image')) {
  const relative = String(scene.planFile).replace(/^03-szenen\//, '');
  const path = `${root}/03-szenen/${relative}`;
  const prompt = compactPrompt(scene, scene.id === 'scene-01');
  if (prompt.length > 4200) throw new Error(`${scene.id} compact prompt too long: ${prompt.length}`);
  const imagePrompt = prompt.split('IMAGE PROMPT:')[1]?.split(/\n\nFINANZNEO_WORLD_ID:/)[0]?.trim() ?? '';
  if (imagePrompt.length < 450) throw new Error(`${scene.id} IMAGE PROMPT too short: ${imagePrompt.length}`);
  writeFileSync(path, prompt, 'utf8');
  blocks.push(`## ${scene.id}\n\n${prompt}`);
}
writeFileSync(`${root}/03-szenen/alle-bildprompts.txt`, masterHeader + blocks.join('\n\n---\n\n') + '\n', 'utf8');

const first = index.scenes[0];
let cover = compactPrompt(first, true);
cover += [
  '',
  'COVER = SZENE 01',
  'KEIN SEPARATER BILDJOB',
  'No separate cover generation',
  'no Bild 00',
  'Technischer Alias: Dieses Dokument beschreibt exakt scene-01 und startet keinen zusätzlichen Google-Flow-Job.',
  '',
].join('\n');
if (cover.length > 4200) throw new Error(`cover compact prompt too long: ${cover.length}`);
writeFileSync(`${root}/03-szenen/00-cover/cover.txt`, cover, 'utf8');

console.log('✓ Mittwoch-Bildprompts kompakt: vollständig, individuell und unter 4200 Zeichen.');
console.log('✓ Master-Prompt: Strict-Single-Job-State-Machine vollständig und Batch/Queueing ausdrücklich gesperrt.');
