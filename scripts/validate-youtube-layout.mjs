#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  YOUTUBE_BURNED_CAPTIONS_FORBIDDEN,
  YOUTUBE_FULLSCREEN_VISUALS_FORBIDDEN,
  YOUTUBE_LAYOUT_FILE,
  YOUTUBE_LAYOUT_STANDARD_ID,
  YOUTUBE_RENDER_CONTRACT_FILE,
  YOUTUBE_IMAGE_COMPONENT,
  YOUTUBE_THUMBNAIL_TIMELINE_FORBIDDEN,
  YOUTUBE_SECTION_HEADER_REQUIRED,
  YOUTUBE_SECTION_ICON_REQUIRED,
  YOUTUBE_STAGE_COMPONENT,
} from './lib/youtube-layout-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/validate-youtube-layout.mjs youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');

assert(existsSync(resolve(root, YOUTUBE_LAYOUT_FILE)), `${YOUTUBE_LAYOUT_FILE} fehlt.`);
assert(existsSync(resolve(root, YOUTUBE_RENDER_CONTRACT_FILE)), `${YOUTUBE_RENDER_CONTRACT_FILE} fehlt. Ohne Render-Contract können Bildbeats wieder als Vollbild gerendert werden.`);

let layout = null;
let index = null;
let renderContract = null;
if (existsSync(resolve(root, YOUTUBE_LAYOUT_FILE))) {
  try { layout = JSON.parse(read(YOUTUBE_LAYOUT_FILE)); }
  catch (error) { errors.push(`${YOUTUBE_LAYOUT_FILE} ist kein gültiges JSON: ${error.message}`); }
}
try { index = JSON.parse(read('04-visuals/visual-index.json')); }
catch (error) { errors.push(`04-visuals/visual-index.json ist ungültig: ${error.message}`); }
if (existsSync(resolve(root, YOUTUBE_RENDER_CONTRACT_FILE))) {
  try { renderContract = JSON.parse(read(YOUTUBE_RENDER_CONTRACT_FILE)); }
  catch (error) { errors.push(`${YOUTUBE_RENDER_CONTRACT_FILE} ist ungültig: ${error.message}`); }
}

if (layout) {
  assert(layout.standardId === YOUTUBE_LAYOUT_STANDARD_ID, `layout.standardId muss ${YOUTUBE_LAYOUT_STANDARD_ID} sein.`);
  assert(layout.visualFrame?.fullScreenForbidden === YOUTUBE_FULLSCREEN_VISUALS_FORBIDDEN, 'Bilder und Animationen dürfen niemals Vollbild sein.');
  assert(layout.sectionHeader?.required === YOUTUBE_SECTION_HEADER_REQUIRED, 'Jeder Visual Beat braucht eine Zwischenüberschrift.');
  assert(layout.sectionHeader?.iconRequired === YOUTUBE_SECTION_ICON_REQUIRED, 'Jede Zwischenüberschrift braucht ein passendes Icon.');
  assert(layout.captions?.burnedIn === !YOUTUBE_BURNED_CAPTIONS_FORBIDDEN, 'Eingebrannte Untertitel sind verboten.');
  assert(layout.captions?.wordTimingsUsage?.includes('cuts'), 'Wort-Timings müssen weiterhin für Schnitte verwendet werden.');
  assert(layout.captions?.wordTimingsUsage?.includes('srt-export'), 'Wort-Timings müssen weiterhin für SRT-Export verfügbar sein.');
  assert(layout.captions?.wordTimingsUsage?.includes('timestamp-script-export'), 'Wort-Timings müssen weiterhin das Skript mit Zeitstempeln erzeugen.');

  const headers = new Map((layout.visuals ?? []).map((visual) => [visual.id, visual]));
  const renderRoutes = new Map((renderContract?.visuals ?? []).map((visual) => [visual.id, visual]));

  assert(renderContract?.standardId === YOUTUBE_LAYOUT_STANDARD_ID, `render-contract.standardId muss ${YOUTUBE_LAYOUT_STANDARD_ID} sein.`);
  assert(renderContract?.fullScreenVisualsForbidden === true, 'Render-Contract muss Vollbild-Visuals verbieten.');
  assert(renderContract?.thumbnail?.timelineEligible === !YOUTUBE_THUMBNAIL_TIMELINE_FORBIDDEN, 'Thumbnail darf niemals als Timeline-Visual verwendet werden.');
  assert(renderContract?.thumbnail?.sourceFile === index?.thumbnail?.googleFlowFileName, 'Render-Contract muss exakt das geplante Thumbnail referenzieren.');
  for (const visual of index?.visuals ?? []) {
    const header = headers.get(visual.id);
    const route = renderRoutes.get(visual.id);
    assert(header, `${visual.id}: Layout-Eintrag fehlt.`);
    assert(route, `${visual.id}: Render-Route fehlt. Jeder Beat muss explizit gerahmt gerendert werden.`);
    assert(typeof header?.title === 'string' && header.title.trim().length >= 3, `${visual.id}: Zwischenüberschrift fehlt.`);
    assert(typeof header?.icon === 'string' && header.icon.trim(), `${visual.id}: passendes Icon fehlt.`);
    assert(route?.title === header?.title, `${visual.id}: Render-Titel muss exakt der Zwischenüberschrift aus layout.json entsprechen.`);
    assert(route?.icon === header?.icon, `${visual.id}: Render-Icon muss exakt layout.json entsprechen.`);
    assert(route?.fullScreen === false, `${visual.id}: Render-Route darf niemals Vollbild sein.`);

    if (visual.type === 'image') {
      assert(route?.component === YOUTUBE_IMAGE_COMPONENT, `${visual.id}: Bildbeat muss ${YOUTUBE_IMAGE_COMPONENT} verwenden.`);
      assert(route?.objectFit === 'contain', `${visual.id}: Bildbeat muss objectFit=contain verwenden, damit das Bild nicht randlos/cropped wirkt.`);
      assert(route?.sourceFile === visual.googleFlowFileName, `${visual.id}: Render-Route muss exakt das geplante Szenenbild verwenden.`);
      assert(route?.sourceFile !== index?.thumbnail?.googleFlowFileName, `${visual.id}: Thumbnail darf nicht als Szenenbild in der Timeline landen.`);
      assert(!/^YouTube Thumbnail/i.test(route?.sourceFile ?? ''), `${visual.id}: Thumbnail-Datei ist als Szenenbild verboten.`);
    }

    if (['animation', 'data', 'hybrid'].includes(visual.type)) {
      const sourceFile = visual.animationSourceFile;
      assert(typeof sourceFile === 'string' && existsSync(resolve(root, sourceFile)), `${visual.id}: animation.tsx fehlt.`);
      if (typeof sourceFile === 'string' && existsSync(resolve(root, sourceFile))) {
        const source = read(sourceFile);
        assert(source.includes(YOUTUBE_STAGE_COMPONENT), `${visual.id}: Animation muss ${YOUTUBE_STAGE_COMPONENT} verwenden; Vollbild-Animation ist verboten.`);
        assert(!/\bCaptions(?:Boxed)?\b|subtitle|untertitel/i.test(source), `${visual.id}: Animation darf keine eingebrannten Untertitel/Captions rendern.`);
      }
    }
  }
}

const timingPath = resolve(root, '03-audio/word-timings.json');
if (existsSync(timingPath)) {
  try {
    const timing = JSON.parse(read('03-audio/word-timings.json'));
    assert(timing.renderCaptions === false, 'word-timings.json muss renderCaptions=false setzen.');
    assert(timing.purpose === 'timing-and-export-only', 'word-timings.json muss purpose=timing-and-export-only setzen.');
  } catch (error) {
    errors.push(`03-audio/word-timings.json ist ungültig: ${error.message}`);
  }
}

if (errors.length) {
  console.error('\nYouTube-Layoutvertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✓ ${YOUTUBE_LAYOUT_STANDARD_ID}: framed visuals · Zwischenüberschrift+Icon · keine eingebrannten Untertitel`);
