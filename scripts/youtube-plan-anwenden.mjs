#!/usr/bin/env node
// Phase 1: Wendet den Visual-Plan eines YouTube-Projekts an.
//
//   node scripts/youtube-plan-anwenden.mjs youtube/<Projekt>
//
// Quelle: _intern/06-projektdateien/visual-plan.mjs mit `title`, `thumbnail {file, prompt}`, optional
// `story {protagonist, reason}` und `visuals[]`. Bild-Visuals: {type:'image', chapter, cue, beat, keyword,
// name, expected, prompt, labels, ref?, change?, akzente?}. Motion-Visuals: {type:'animation'|'data',
// chapter, cue, beat, bridgeObject, brief}. Beleg-Visuals (echter Quellen-Screenshot, docs/YOUTUBE-BELEG-SZENEN.md):
// {type:'beleg', chapter, cue, beat, quelle, quellenArt, url, markierungen:[{text, cue}], entfernen?}.
// Erklär-Folien (docs/YOUTUBE-BILDMIX-UND-COVER.md): {type:'folie', chapter, cue, beat, folie:{titel?, icon?, <eine Form>}}
// Formen: begriff · ablauf · vergleich · zahl · zeilen · metapher · wolke · zitat; Icons aus `npm run youtube:icons -- --liste`.
// Metapher-Sticker (metapher/wolke): {sticker, motiv} — fehlt der Sticker in public/sticker/, bekommt Flow einen Sticker-Auftrag. Cover: thumbnail.cover = {zeilen:[..], marker, ton?, kicker?}.
// keyword/bridgeObject prüft youtube:validate (Qualitätsregeln V2), Belege V3.
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
  YOUTUBE_CHARACTER_REFERENCE_MARKER,
  YOUTUBE_CHANNEL_STYLE_FILE,
  YOUTUBE_CHANNEL_STYLE_PATH,
  youtubeStyleReferenceText,
  internWurzel,
} from './lib/youtube-contract.mjs';
import {folieSticker} from './lib/youtube-folie.mjs';
import {YOUTUBE_STICKER_STIL, stickerVorhanden, youtubeStickerFlowDatei} from './lib/youtube-sticker.mjs';
import {YOUTUBE_BELEG_BILD, YOUTUBE_BELEG_DATEN, YOUTUBE_BELEG_PLAN, YOUTUBE_BELEG_STANDARD_ID} from './lib/youtube-beleg.mjs';

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
const repo = resolve(import.meta.dirname, '..');
// Metapher-Sticker: eigener Flow-Auftrag mit festem Sticker-Stil, ohne Stilvorlage der Szenenbilder.
const stickerStep = (fileName) => `${YOUTUBE_FLOW_PROTOCOL_MARKER}
ONE STICKER OF THE CURRENT BATCH — SEE BATCH HEADER

FINAL FILE NAME:
${fileName}

Generate this sticker together with the other images of its batch (at most ${YOUTUBE_FLOW_BATCH_SIZE} in parallel). Rename it immediately to the exact final file name above. This is NOT a scene image: do NOT attach the style master or any reference. Verify: one simple metaphor at first glance, sticker style below, pure white background, square 1:1, no text unless quoted. If a check fails, regenerate it before the next batch starts. Never render the file name inside the image.
`;
const fileOf = (n) => `YouTube Bild ${nr(n)} - ${visuals[n - 1].name}.png`;
// Akzent-Karten erscheinen oben links auf dem Bild (YouTubeVideo → Akzente). Video 3: Sie lagen
// teils auf Jonas' Kopf — deshalb hält das Bild diese Ecke frei.
const AKZENT_FREIRAUM = 'FREE CORNER: Keep the top-left corner (left third of the width, top quarter of the height) calm and empty — no faces, people, labels or key objects there. Small note cards are placed there later in the video.';
const indexVorab = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
const kanalStil = indexVorab.imageWorld?.styleMaster === 'kanal';
if (kanalStil && !existsSync(resolve(YOUTUBE_CHANNEL_STYLE_PATH))) {
  console.error(`Kanal-Stilvorlage fehlt: ${YOUTUBE_CHANNEL_STYLE_PATH}`);
  process.exit(1);
}
const styleReference = kanalStil
  ? `${YOUTUBE_STYLE_REFERENCE_MARKER}\n${youtubeStyleReferenceText(YOUTUBE_CHANNEL_STYLE_FILE)}\n`
  : `${YOUTUBE_STYLE_REFERENCE_MARKER}
${thumbnail.file} — attach the approved thumbnail to EVERY image as a style reference. Copy only its illustration style: line weight, flat shapes, color palette and level of detail. Never copy its composition, objects or headline text.
`;

// Hauptfigur ohne Flow-„Charakter“: Die Figur wird einmal festgelegt (story.figurBild = 'Thumbnail' oder eine
// Bildnummer). Jedes Bild mit `figur: true` hängt genau dieses freigegebene Bild als Figur-Referenz an.
const figurBild = story?.protagonist ? story.figurBild ?? null : null;
const figurDatei = figurBild === 'Thumbnail' ? thumbnail.file : (typeof figurBild === 'number' ? fileOf(figurBild) : null);
const characterReference = (n) => (figurDatei && visuals[n - 1].figur && figurBild !== n ? `${YOUTUBE_CHARACTER_REFERENCE_MARKER}
${figurDatei} — attach this approved image as character reference. The person called ${story.protagonist} is exactly the same character as in that image: same face, hair, clothes, colors and proportions. Never invent a new person for ${story.protagonist}.
` : '');

const index = indexVorab;
const alt = new Map((index.visuals ?? []).map((v) => [v.id, v]));
const blocks = new Map();
const stickerJobs = new Map();

index.title = title;
if (story) index.story = story;
index.thumbnail.googleFlowFileName = thumbnail.file;
// Cover V1: Flow zeichnet nur das Motiv rechts, den Text setzt youtube:cover exakt.
if (thumbnail.cover) index.thumbnail.cover = thumbnail.cover;
const coverMotiv = thumbnail.cover
  ? `\nCOVER LAYOUT (FinanzNeo Cover V1): NO TEXT, NO LETTERS, NO NUMBERS anywhere in this image — the headline is added later. Put the main subject large and close in the RIGHT 45 % of the frame with a clear facial expression or one strong object. Keep the LEFT 55 % completely empty plain warm cream background without objects, lines or shadows.\n`
  : '';
const thumbBlock = `${flowStep(thumbnail.file)}
${kanalStil ? styleReference : ''}${story?.protagonist && story.figurBild === 'Thumbnail' ? `The person in this thumbnail is ${story.protagonist}, the protagonist of the video. This thumbnail becomes the character reference for every image that shows ${story.protagonist}.\n` : ''}
REFERENCE_IMAGE:
NONE

THUMBNAIL PROMPT:
Soft hand-drawn 2D editorial illustration, not a photo. ${thumbnail.prompt}
${coverMotiv}
TEXT IN THIS IMAGE: Only the exact words and numbers written in quotes in the prompt may appear in the image. Never invent extra prices, numbers, brand names, headlines or captions.

${kanalStil ? '' : 'This thumbnail is the STYLE MASTER of the whole video: every later image attaches it as a style reference.'}

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
${styleReference}${characterReference(n)}
REFERENCE_IMAGE:
${v.ref ? fileOf(v.ref) : 'NONE'}

IMAGE PROMPT:
Soft hand-drawn 2D editorial illustration, not a photo. ${v.prompt}
${v.akzente?.length ? `\n${AKZENT_FREIRAUM}\n` : ''}
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
      ...(v.figur ? {figur: true} : {}),
      objectLabels: v.labels,
      ...(v.akzente ? {akzente: v.akzente} : {}),
    };
  }
  if (v.type === 'folie') {
    // Neue Sticker (noch nicht in der Bibliothek) gehen als eigener Auftrag an Flow.
    const neu = folieSticker(v.folie).filter((st) => !stickerVorhanden(repo, st.name));
    for (const st of neu) {
      if (stickerJobs.has(st.name)) continue;
      stickerJobs.set(st.name, `${stickerStep(youtubeStickerFlowDatei(st.name))}
STICKER MOTIF:
${st.motiv}

${YOUTUBE_STICKER_STIL}
`);
    }
    return {...base, startCue: v.cue, folie: v.folie, ...(neu.length ? {stickerFlowFileNames: neu.map((st) => youtubeStickerFlowDatei(st.name))} : {})};
  }
  if (v.type === 'beleg') {
    write(`${dir}/beleg.md`, `# Beleg ${id}\n\nBELEG_STANDARD: ${YOUTUBE_BELEG_STANDARD_ID}\n\n- Kapitel: ${v.chapter}\n- Sprechtext-Bezug: ${v.beat}\n- Quelle: ${v.quelle} (${v.quellenArt})\n- URL: ${v.url}\n${(v.markierungen ?? []).map((m) => `- Markierung bei „${m.cue}“: „${m.text}“`).join('\n')}\n\nScreenshot und Textpositionen erzeugt \`npm run youtube:belege -- youtube/<Projekt>\` (${YOUTUBE_BELEG_BILD}, ${YOUTUBE_BELEG_DATEN}).\n`);
    return {
      ...base,
      planFile: `${dir}/${YOUTUBE_BELEG_PLAN}`,
      startCue: v.cue,
      quelle: v.quelle,
      quellenArt: v.quellenArt,
      url: v.url,
      markierungen: v.markierungen,
      ...(v.entfernen?.length ? {entfernen: v.entfernen} : {}),
      belegFile: `${dir}/${YOUTUBE_BELEG_BILD}`,
      belegDatenFile: `${dir}/${YOUTUBE_BELEG_DATEN}`,
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
  // Figur-Bild (falls Bildnummer) liegt wie eine normale Referenz immer in einem früheren Batch.
  const figurMin = v.figur && typeof figurBild === 'number' && figurBild !== n ? batchOf.get(figurBild) + 1 : 1;
  let b = Math.max(cur, v.ref ? batchOf.get(v.ref) + 1 : 1, figurMin);
  while (batches[b] && batches[b].length >= YOUTUBE_FLOW_BATCH_SIZE) b++;
  batches[b] ??= [];
  batches[b].push(n);
  batchOf.set(n, b);
  while (batches[cur] && batches[cur].length >= YOUTUBE_FLOW_BATCH_SIZE) cur++;
}
// Sticker hängen an keiner Referenz: freie Plätze ab Batch 2 füllen.
for (const name of stickerJobs.keys()) {
  let b = 1;
  while (batches[b] && batches[b].length >= YOUTUBE_FLOW_BATCH_SIZE) b++;
  batches[b] ??= [];
  batches[b].push(`sticker:${name}`);
}

const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const bar = '████████████████████████████████████';
let body = '';
let batchNr = 0;
for (const members of batches) {
  if (!members?.length) continue;
  batchNr++;
  const titel = (m) => (m === 'Thumbnail' ? 'Thumbnail' : String(m).startsWith('sticker:') ? `Sticker ${m.slice(8)}` : `Bild ${nr(m)}`);
  body += `${bar}\nBATCH ${batchNr} — START ALL TOGETHER: ${members.map(titel).join(', ')}\n${bar}\n\n`;
  for (const m of members) {
    if (m === 'Thumbnail') body += `${line}\nTHUMBNAIL\n${line}\n\n${thumbBlock}\n`;
    else if (String(m).startsWith('sticker:')) body += `${line}\nSTICKER ${m.slice(8)}\n${line}\n\n${stickerJobs.get(m.slice(8))}\n`;
    else body += `${line}\nVISUAL ${nr(m)} — IMAGE\n${line}\n\n${blocks.get(m)}\n`;
  }
}
const motion = visuals.map((v, i) => (['image', 'beleg', 'folie'].includes(v.type) ? null : nr(i + 1))).filter(Boolean);
const folien = visuals.map((v, i) => (v.type === 'folie' ? nr(i + 1) : null)).filter(Boolean);
const belege = visuals.map((v, i) => (v.type === 'beleg' ? nr(i + 1) : null)).filter(Boolean);
const reserviert = visuals.map((v, i) => (v.type === 'image' ? null : nr(i + 1))).filter(Boolean);
body += `${line}\nRESERVED NUMBERS — REMOTION, NOT FLOW\n${line}\n\nDO NOT GENERATE IMAGES ${reserviert.join(', ')}. These numbers are built in Remotion (animations, explainer slides and real source screenshots). Keep the numbers reserved; never close the numbering gap.\n\n`;

const inbox = IMAGE_INBOX.replace(/^\.\.\//, '');
write(ALL_PROMPTS, `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT

${YOUTUBE_FLOW_PROTOCOL_MARKER}

${kanalStil ? `STYLE MASTER (WHOLE CHANNEL):
Before you start, open ${YOUTUBE_CHANNEL_STYLE_PATH} (file name: "${YOUTUBE_CHANNEL_STYLE_FILE}"). Attach it to EVERY scene image of this file, including the thumbnail, as STYLE_REFERENCE. Exception: STICKER blocks never attach it — they follow the sticker style written in their block. Every image of every FinanzNeo video must look like it was drawn by the same illustrator as this file.
Batch 1 contains ONLY the thumbnail. Generate it, wait until it is complete, rename it and verify it. Never start batch 2 before the thumbnail is approved.` : `STYLE MASTER FIRST:
Batch 1 contains ONLY the thumbnail. Generate it, wait until it is complete, rename it and verify it is a soft hand-drawn illustration (no photo look). Every later scene image attaches this approved thumbnail as STYLE_REFERENCE (STICKER blocks never do). Never start batch 2 before the thumbnail is approved.`}

BATCH WORKFLOW (MAX. ${YOUTUBE_FLOW_BATCH_SIZE} IMAGES IN PARALLEL):
1. Read the full file once. Images are grouped into numbered BATCH blocks of up to ${YOUTUBE_FLOW_BATCH_SIZE}.
2. Start every image of the current batch at the same time, each as its own single-image job. Never put several prompts into one request and never make a collage or contact sheet.
3. As soon as an image returns, rename it immediately to the exact final file name stated in its block.
4. Verify every image of the batch (STICKER blocks: their own sticker checks instead): soft hand-drawn illustration in the style master's style (reject anything photorealistic), script-beat fit, first-glance clarity, Editorial Finance style, 16:9 format, German-only text and file name. For a continuation visual, also verify that the approved reference composition is preserved and only the planned change was made.
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
console.log(`✓ Plan angewendet: ${visuals.length} Visuals · ${blocks.size} Bilder + ${stickerJobs.size} Sticker + Thumbnail in ${batchNr} Batches · Motion: ${motion.join(', ') || '—'} · Belege: ${belege.join(', ') || '—'} · Folien: ${folien.join(', ') || '—'} · neue Sticker: ${[...stickerJobs.keys()].join(', ') || '—'}`);
