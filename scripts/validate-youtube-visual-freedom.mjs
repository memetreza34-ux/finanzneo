#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  ALL_PROMPTS,
  SUBTITLE_MODE,
  WORD_TIMING_PURPOSE,
  WORD_TIMINGS,
  YOUTUBE_FLOW_IMAGE_POLICY_ID,
  YOUTUBE_FLOW_MEANING_FIRST_MARKER,
  YOUTUBE_RENDER_CAPTIONS,
  YOUTUBE_FLOW_VISUAL_MODES,
} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/validate-youtube-visual-freedom.mjs youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');

let index = null;
try {
  index = JSON.parse(read('04-visuals/visual-index.json'));
} catch (error) {
  errors.push(`04-visuals/visual-index.json ungültig: ${error.message}`);
}

if (index) {
  const world = index.imageWorld ?? {};
  assert(world.visualDecisionPolicy === YOUTUBE_FLOW_IMAGE_POLICY_ID, `imageWorld.visualDecisionPolicy muss ${YOUTUBE_FLOW_IMAGE_POLICY_ID} sein.`);
  assert(world.meaningFirstRequired === true, 'Bedeutung-zuerst muss Pflicht sein.');
  assert(world.sceneFirst === false, 'scene-first muss deaktiviert sein.');
  assert(world.placeRequired === false, 'Ein Ort darf niemals Pflicht sein.');
  assert(world.realSceneRequired === false, 'Eine reale Alltagsszene darf niemals Pflicht sein.');
  assert(world.peopleRequired === false, 'Menschen dürfen niemals Pflicht sein.');
  assert(world.semanticObjectCompositionsAllowed === true, 'Semantische Objektanordnungen müssen erlaubt sein.');
  assert(world.visualMetaphorsAllowed === true, 'Klare visuelle Metaphern müssen erlaubt sein.');

  const modes = new Set(world.flowVisualModes ?? []);
  for (const mode of ['isolated-object', 'semantic-object-composition', 'visual-metaphor']) {
    assert(modes.has(mode), `Flow-Visualmodus fehlt: ${mode}`);
  }
  for (const mode of YOUTUBE_FLOW_VISUAL_MODES) {
    if (mode === 'object-story') continue;
    assert(modes.has(mode), `Aktueller Flow-Visualmodus fehlt: ${mode}`);
  }
}

if (existsSync(resolve(root, ALL_PROMPTS))) {
  const prompts = read(ALL_PROMPTS);
  assert(prompts.includes(`FLOW_IMAGE_POLICY: ${YOUTUBE_FLOW_IMAGE_POLICY_ID}`), 'Master-Prompt nutzt nicht die Meaning-first-Policy.');
  assert(prompts.includes(YOUTUBE_FLOW_MEANING_FIRST_MARKER), `Master-Prompt braucht Marker „${YOUTUBE_FLOW_MEANING_FIRST_MARKER}“.`);
  assert(!/FLOW_IMAGE_POLICY:\s*scene-first/i.test(prompts), 'scene-first Policy ist im Master-Prompt verboten.');
  assert(!/Jedes Bild ist eine einfache reale Alltagssituation/i.test(prompts), 'Master-Prompt darf keine reale Alltagsszene für jedes Bild erzwingen.');
  assert(!/real everyday situation is missing/i.test(prompts), 'QA darf keine reale Alltagsszene erzwingen.');
  assert(!/\[PLACE\s*[—-]\s*SHORT\]/i.test(prompts), 'Ort darf kein Pflicht-Platzhalter im Prompt sein.');
}

const layoutPath = '06-projektdateien/layout.json';
if (existsSync(resolve(root, layoutPath))) {
  try {
    const layout = JSON.parse(read(layoutPath));
    const policy = layout.imagePolicy ?? {};
    assert(policy.meaningFirst === true, 'layout.imagePolicy.meaningFirst muss true sein.');
    assert(policy.sceneFirst === false, 'layout.imagePolicy.sceneFirst muss false sein.');
    assert(policy.peopleRequired === false, 'layout.imagePolicy.peopleRequired muss false sein.');
    assert(policy.placeRequired === false, 'layout.imagePolicy.placeRequired muss false sein.');
    assert(policy.semanticObjectCompositionsAllowed === true, 'layout muss semantische Objektanordnungen erlauben.');
    assert(policy.visualMetaphorsAllowed === true, 'layout muss klare visuelle Metaphern erlauben.');
  } catch (error) {
    errors.push(`${layoutPath} ungültig: ${error.message}`);
  }
}

if (existsSync(resolve(root, WORD_TIMINGS))) {
  try {
    const timing = JSON.parse(read(WORD_TIMINGS));
    assert(timing.renderCaptions === YOUTUBE_RENDER_CAPTIONS, 'Eingebrannte Captions müssen deaktiviert sein.');
    assert(timing.purpose === WORD_TIMING_PURPOSE, `word-timings purpose muss ${WORD_TIMING_PURPOSE} sein.`);
    assert(timing.subtitleMode === SUBTITLE_MODE, `subtitleMode muss ${SUBTITLE_MODE} sein.`);
  } catch (error) {
    errors.push(`${WORD_TIMINGS} ungültig: ${error.message}`);
  }
}

if (errors.length) {
  console.error('\nYouTube Visual-Freedom-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✓ ${YOUTUBE_FLOW_IMAGE_POLICY_ID}: Bedeutung zuerst · Form frei · Ort/Mensch/Szene optional · keine eingebrannten Captions`);
