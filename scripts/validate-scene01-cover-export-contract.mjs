#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-scene01-cover-export-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
const coverAliasPath = resolve(root, '03-szenen/00-cover/cover.txt');
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (path) => readFileSync(path, 'utf8');

assert(existsSync(indexPath), '03-szenen/scene-index.json fehlt.');
assert(existsSync(masterPath), '03-szenen/alle-bildprompts.txt fehlt.');
assert(existsSync(coverAliasPath), '03-szenen/00-cover/cover.txt als technischer scene-01-Alias fehlt.');

if (!existsSync(indexPath)) {
  console.error('\nScene-01-Cover-/Export-Vertrag verletzt:\n- scene-index.json fehlt.');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(read(indexPath));
} catch (error) {
  console.error(`\nScene-01-Cover-/Export-Vertrag verletzt:\n- scene-index.json ungültig: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Scene-01-Cover-/Auto-Export-Vertrag wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const firstScene = scenes[0];
assert(firstScene?.id === 'scene-01', 'Erste Szene muss scene-01 sein.');
assert(firstScene?.type === 'image', 'scene-01 muss eine Bildszene sein, weil sie automatisch das Cover ist.');
assert(typeof firstScene?.googleFlowFileName === 'string' && firstScene.googleFlowFileName.trim(), 'scene-01.googleFlowFileName fehlt.');

const cover = index.cover ?? {};
assert(cover.type === 'scene-image', 'cover.type muss scene-image sein.');
assert(cover.sourceSceneId === 'scene-01', 'cover.sourceSceneId muss scene-01 sein.');
assert(cover.sameAssetAsFirstScene === true, 'Cover muss exakt dasselbe Asset wie scene-01 verwenden.');
assert(cover.separateGenerationForbidden === true, 'Separater Cover-Bildjob muss verboten sein.');
assert(cover.aspectRatio === '1:1', 'Cover/scene-01-Quellbild muss 1:1 sein.');
assert(cover.googleFlowFileName === firstScene?.googleFlowFileName, 'cover.googleFlowFileName muss exakt scene-01.googleFlowFileName entsprechen.');

const publishing = index.platformPublishing ?? {};
assert(publishing.universalCaptionSource === '04-caption/caption.txt', 'Universelle Caption muss aus 04-caption/caption.txt kommen.');
assert(publishing.universalCaptionExport === '06-export/caption-universal.txt', 'Universelle Caption muss nach 06-export/caption-universal.txt exportiert werden.');
assert(publishing.universalCaptionForAllReelPlatforms === true, 'Universelle Caption muss als Standard für alle Reel-Plattformen markiert sein.');

const phase3 = index.phase3CompletionContract ?? {};
assert(phase3.autoExportAfterPassedRenderQa === true, 'Nach bestandener Render-QA muss der Export automatisch starten.');
assert(phase3.finalVideoDirectory === '06-export', 'Finalvideo muss automatisch in 06-export landen.');
assert(phase3.universalCaptionSource === '04-caption/caption.txt', 'Phase 3 muss die universelle Caption aus 04-caption/caption.txt beziehen.');
assert(phase3.universalCaptionExport === '06-export/caption-universal.txt', 'Phase 3 muss die universelle Caption nach 06-export/caption-universal.txt exportieren.');

if (existsSync(masterPath)) {
  const master = read(masterPath);
  assert(/COVER = SZENE 01/i.test(master), 'Flow-Master muss explizit COVER = SZENE 01 festlegen.');
  assert(/KEIN separates Cover erzeugen/i.test(master), 'Flow-Master muss einen separaten Cover-Job ausdrücklich verbieten.');
  assert(/KEIN Bild 00 erzeugen/i.test(master), 'Flow-Master muss Bild 00 ausdrücklich verbieten.');
  assert(!/GOOGLE FLOW – FINALER DATEINAME:\s*\n\s*Bild 00\b/i.test(master), 'Flow-Master enthält noch einen echten Bild-00-Generierungsauftrag.');
  if (typeof firstScene?.googleFlowFileName === 'string') {
    assert(master.includes(firstScene.googleFlowFileName), 'Flow-Master enthält den exakten scene-01-Dateinamen nicht.');
  }
}

if (existsSync(coverAliasPath)) {
  const alias = read(coverAliasPath);
  assert(/KEIN SEPARATER BILDJOB/i.test(alias), '00-cover/cover.txt muss als technischer Alias und nicht als Bildjob markiert sein.');
  assert(/No separate cover generation|no Bild 00/i.test(alias), 'Cover-Alias muss separate Generierung ausdrücklich verbieten.');
}

const renderScript = resolve('scripts/render-validated.mjs');
const exportScript = resolve('scripts/export-reel.mjs');
assert(existsSync(renderScript), 'scripts/render-validated.mjs fehlt.');
assert(existsSync(exportScript), 'scripts/export-reel.mjs fehlt.');
if (existsSync(renderScript)) {
  const source = read(renderScript);
  assert(source.includes("resolve('scripts/export-reel.mjs')"), 'render-validated.mjs muss nach bestandener QA automatisch export-reel.mjs starten.');
  assert(source.includes('FINAL_RENDER_QA_PASSED'), 'Automatischer Export darf erst nach FINAL_RENDER_QA_PASSED erfolgen.');
}
if (existsSync(exportScript)) {
  const source = read(exportScript);
  assert(source.includes("const captionQuelle = resolve(root, '04-caption/caption.txt')"), 'export-reel.mjs muss caption-universal.txt ausschließlich aus 04-caption/caption.txt bauen.');
  for (const oldExport of ['caption-instagram.txt', 'caption-tiktok.txt', 'caption-facebook.txt', 'caption-snapchat.txt']) {
    assert(!source.includes(oldExport), `export-reel.mjs darf keine alte Plattform-Caption erzeugen: ${oldExport}`);
  }
  assert(source.includes("firstScene.id !== 'scene-01'"), 'export-reel.mjs muss scene-01 als Coverquelle erzwingen.');
  assert(!source.includes("/^Bild 00"), 'export-reel.mjs darf nicht mehr nach Bild 00 als Cover suchen.');
}

if (errors.length) {
  console.error('\nScene-01-Cover-/Export-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Scene-01-Cover-/Auto-Export-Vertrag erfüllt.');
console.log(`✓ Cover = scene-01 = ${firstScene.googleFlowFileName}`);
console.log('✓ Kein separater Cover-Job und kein Bild 00.');
console.log('✓ FINAL_RENDER_QA_PASSED startet automatisch den Export nach 06-export/.');
console.log('✓ caption-universal.txt ist die Standard-Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat.');
