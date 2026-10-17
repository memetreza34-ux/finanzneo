#!/usr/bin/env node
// Phase 1: Wendet den Visual-Plan eines YouTube-Projekts an.
//
//   node scripts/youtube-plan-anwenden.mjs youtube/<Projekt>
//
// Quelle: _intern/06-projektdateien/visual-plan.mjs mit `title`, `thumbnail {file, prompt}`, optional
// `story {protagonist, reason}` und `visuals[]`. Bild-Visuals: {type:'image', chapter, cue, beat, keyword,
// name, expected, prompt, labels, ref?, change?, akzente?}. Motion-Visuals: {type:'animation'|'data',
// chapter, cue, beat, bridgeObject, brief}. keyword/bridgeObject prüft youtube:validate (Qualitätsregeln V2).
//
// Schreibt Visual-Index, alle Einzel-Bildprompts, die Flow-Übergabe (Batch 1 = nur Thumbnail
// als Stilvorlage, Fortsetzungen immer in einem späteren Batch als ihre Referenz), die Motion-
// Ordner (remotion.md-Brief, data-notes.md) und den leeren Zeitplan. Bereits ausgearbeitete
// Motion-Einträge (viewerChange gesetzt) bleiben erhalten — der Plan darf also erneut laufen.

import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {
  ALL_PROMPTS,
  IMAGE_INBOX,
  VISUAL_INDEX,
  YOUTUBE_FLOW_BATCH_SIZE,
  YOUTUBE_FLOW_PROTOCOL_MARKER,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_STYLE_REFERENCE_MARKER,
  internWurzel,
} from './lib/youtube-contract.mjs';

const projekt = process.argv[2];
if (!projekt) {
  console.error('Aufruf: node scripts/youtube-plan-anwenden.mjs youtube/<Projekt>');
  process.exit(1);
}
const root = internWurzel(projekt);
const planPfad = resolve(root, '06-projektdateien/visual-plan.mjs');
if (!existsSync(planPfad)) {
  console.error(`Visual-Plan fehlt: ${planPfad}`);
  process.exit(1);
}
const {title, thumbnail, visuals, story} = await import(`${pathToFileURL(planPfad).href}?t=${Date.now()}`);

const write = (rel, content) => {
  const p = resolve(root, rel);
  mkdirSync(resolve(p, '..'), {recursive: true});
  writeFileSync(p, content);
};
const nr = (i) => String(i).padStart(2, '0');
const styleBlock = readFileSync(resolve(root, '04-visuals/bildwelt.txt'), 'utf8').replace(/^FINANZNEO YOUTUBE IMAGE WORLD\n\n/, '');
const flowStep = (fileName) => `${YOUTUBE_FLOW_PROTOCOL_MARKER}
ONE IMAGE OF THE CURRENT BATCH — SEE BATCH HEADER

FINAL FILE NAME:
${fileName}

Generate this image together with the other images of its batch (at most ${YOUTUBE_FLOW_BATCH_SIZE} in parallel). Rename it immediately to the exact final file name above as soon as it returns. Verify that the visual matches the script beat, reads clearly at first glance, follows the Editorial Finance image world, uses horizontal 16:9 and contains only German text. If REFERENCE_IMAGE points to an approved prior visual, attach that exact file before generating and preserve its composition while making only the planned change; such an image always belongs to a later batch than its reference. If any check fails, regenerate the same image number before the next batch starts. Never render the file name inside the image.
`;
const fileOf = (n) => `YouTube Bild ${nr(n)} - ${visuals[n - 1].name}.png`;
const styleReference = `${YOUTUBE_STYLE_REFERENCE_MARKER}
${thumbnail.file} — attach the approved thumbnail to EVERY image as a style reference. Copy only its illustration style: line weight, flat shapes, color palette and level of detail. Never copy its composition, objects or headline text.
`;

const index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
const alt = new Map((index.visuals ?? []).map((v) => [v.id, v]));
const blocks = new Map();

index.title = title;
if (story) index.story = story;
index.thumbnail.googleFlowFileName = thumbnail.file;
const thumbBlock = `${flowStep(thumbnail.file)}
REFERENCE_IMAGE:
NONE

THUMBNAIL PROMPT:
Soft hand-drawn 2D editorial illustration, not a photo. ${thumbnail.prompt}

TEXT IN THIS IMAGE: Only the exact words and numbers written in quotes in the prompt may appear in the image. Never invent extra prices, numbers, brand names, headlines or captions.

This thumbnail is the STYLE MASTER of the whole video: every later image attaches it as a style reference.

${styleBlock}`;
write('04-visuals/thumbnail-prompt.txt', thumbBlock);

// Ordner früherer Planstände, die es nicht mehr gibt, entfernen.
for (const id of alt.keys()) {
  if (Number(id.slice(-2)) > visuals.length) rmSync(resolve(root, '04-visuals/EINZELNE-VISUALS', id), {recursive: true, force: true});
}

index.visuals = visuals.map((v, i) => {
  const n = i + 1;
  const id = `visual-${nr(n)}`;
  const dir = `04-visuals/EINZELNE-VISUALS/${id}`;
  const base = {id, type: v.type, chapter: v.chapter, scriptBeat: v.beat};
  if (v.type === 'image') {
    const block = `${flowStep(fileOf(n))}
${styleReference}
REFERENCE_IMAGE:
${v.ref ? fileOf(v.ref) : 'NONE'}

IMAGE PROMPT:
Soft hand-drawn 2D editorial illustration, not a photo. ${v.prompt}

TEXT IN THIS IMAGE: Only the exact words and numbers written in quotes in the prompt may appear in the image. Never invent extra prices, numbers, brand names, headlines or captions.

${styleBlock}`;
    write(`${dir}/bildprompt.txt`, block);
    blocks.set(n, block);
    return {
      ...base,
      googleFlowFileName: fileOf(n),
      expectedVisual: v.expected,
      imageSequence: v.ref ? {mode: 'continuation', referenceVisualId: `visual-${nr(v.ref)}`, plannedChange: v.change} : {mode: 'independent', referenceVisualId: null, plannedChange: null},
      planFile: `${dir}/bildprompt.txt`,
      startCue: v.cue,
      ...(v.keyword ? {keyword: v.keyword} : {}),
      objectLabels: v.labels,
      ...(v.akzente ? {akzente: v.akzente} : {}),
    };
  }
  const vorher = alt.get(id);
  if (vorher && vorher.type === v.type && vorher.viewerChange && !String(vorher.viewerChange).startsWith('[')) {
    return {...vorher, ...base, startCue: v.cue, contentBrief: v.brief, ...(v.bridgeObject ? {bridgeObject: v.bridgeObject} : {})};
  }
  if (!existsSync(resolve(root, `${dir}/remotion.md`))) {
    write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Kapitel: ${v.chapter}\n- Sprechtext-Bezug: ${v.beat}\n- Inhaltlicher Brief (Phase 1 Content): ${v.brief}\n\n[MOTION DIRECTOR: VIEWER CHANGE, KONZEPTE A/B/C, KEYFRAMES UND MECHANIK EINTRAGEN]\n`);
  }
  if (v.type === 'data' && !existsSync(resolve(root, `${dir}/data-notes.md`))) write(`${dir}/data-notes.md`, `# Daten / Rechenweg\n\n${v.brief}\n`);
  return {
    ...base,
    planFile: `${dir}/remotion.md`,
    animationSourceFile: `${dir}/animation.tsx`,
    animationExport: `YouTubeVisual${nr(n)}Animation`,
    contentBrief: v.brief,
    startCue: v.cue,
    ...(v.bridgeObject ? {bridgeObject: v.bridgeObject} : {}),
    ...(v.type === 'data' ? {dataNotesFile: `${dir}/data-notes.md`} : {}),
  };
});

// Batches: 1 = Thumbnail allein; danach höchstens 5, Fortsetzung immer nach ihrer Referenz.
const batches = [['Thumbnail'], []];
const batchOf = new Map();
let cur = 1;
for (const [i, v] of visuals.entries()) {
  if (v.type !== 'image') continue;
  const n = i + 1;
  let b = Math.max(cur, v.ref ? batchOf.get(v.ref) + 1 : 1);
  while (batches[b] && batches[b].length >= YOUTUBE_FLOW_BATCH_SIZE) b++;
  batches[b] ??= [];
  batches[b].push(n);
  batchOf.set(n, b);
  while (batches[cur] && batches[cur].length >= YOUTUBE_FLOW_BATCH_SIZE) cur++;
}

const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const bar = '████████████████████████████████████';
let body = '';
let batchNr = 0;
for (const members of batches) {
  if (!members?.length) continue;
  batchNr++;
  body += `${bar}\nBATCH ${batchNr} — START ALL TOGETHER: ${members.map((m) => (m === 'Thumbnail' ? 'Thumbnail' : `Bild ${nr(m)}`)).join(', ')}\n${bar}\n\n`;
  for (const m of members) {
    body += m === 'Thumbnail'
      ? `${line}\nTHUMBNAIL\n${line}\n\n${thumbBlock}\n`
      : `${line}\nVISUAL ${nr(m)} — IMAGE\n${line}\n\n${blocks.get(m)}\n`;
  }
}
const motion = visuals.map((v, i) => (v.type === 'image' ? null : nr(i + 1))).filter(Boolean);
body += `${line}\nRESERVED NUMBERS — REMOTION, NOT FLOW\n${line}\n\nDO NOT GENERATE IMAGES ${motion.join(', ')}. These numbers are animations built in Remotion. Keep the numbers reserved; never close the numbering gap.\n\n`;

const inbox = IMAGE_INBOX.replace(/^\.\.\//, '');
write(ALL_PROMPTS, `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT

${YOUTUBE_FLOW_PROTOCOL_MARKER}

STYLE MASTER FIRST:
Batch 1 contains ONLY the thumbnail. Generate it, wait until it is complete, rename it and verify it is a soft hand-drawn illustration (no photo look). Every later image attaches this approved thumbnail as STYLE_REFERENCE. Never start batch 2 before the thumbnail is approved.

BATCH WORKFLOW (MAX. ${YOUTUBE_FLOW_BATCH_SIZE} IMAGES IN PARALLEL):
1. Read the full file once. Images are grouped into numbered BATCH blocks of up to ${YOUTUBE_FLOW_BATCH_SIZE}.
2. Start every image of the current batch at the same time, each as its own single-image job. Never put several prompts into one request and never make a collage or contact sheet.
3. As soon as an image returns, rename it immediately to the exact final file name stated in its block.
4. Verify every image of the batch: soft hand-drawn illustration in the thumbnail's style (reject anything photorealistic), script-beat fit, first-glance clarity, Editorial Finance style, 16:9 format, German-only text and file name. For a continuation visual, also verify that the approved reference composition is preserved and only the planned change was made.
5. Regenerate every failed image (same image number, replace the failed file) before the next batch starts.
6. Start the next batch only after all images of the current batch pass. A continuation image is never in the same batch as its reference.
7. Skip non-image blocks without closing the numbering gap.
8. At the end, place every generated and correctly named image together in ${inbox}/.

${body}${line}
FINISH
${line}

Finish only after every expected image has been generated in its batch, renamed immediately and verified. All final files must be together in ${inbox}/.
`);

const tl = JSON.parse(readFileSync(resolve(root, '06-projektdateien/timeline.json'), 'utf8'));
tl.title = title;
tl.visuals = index.visuals.map((v) => ({id: v.id, type: v.type, startFrame: 0, durationFrames: 0}));
write('06-projektdateien/timeline.json', `${JSON.stringify(tl, null, 2)}\n`);
write(VISUAL_INDEX, `${JSON.stringify(index, null, 2)}\n`);
console.log(`✓ Plan angewendet: ${visuals.length} Visuals · ${blocks.size} Bilder + Thumbnail in ${batchNr} Batches · Motion: ${motion.join(', ') || '—'}`);
