#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-scene01-cover-export-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => {
  mkdirSync(resolve(path, '..'), {recursive: true});
  writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
};

const index = JSON.parse(read(indexPath));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const firstScene = scenes[0];

if (!firstScene || firstScene.id !== 'scene-01') {
  console.error('Cover-Vertrag kann nicht angewendet werden: scene-01 fehlt oder ist nicht die erste Szene.');
  process.exit(1);
}
if (firstScene.type !== 'image') {
  console.error('Cover-Vertrag kann nicht angewendet werden: scene-01 muss eine Bildszene sein.');
  process.exit(1);
}
if (typeof firstScene.googleFlowFileName !== 'string' || !firstScene.googleFlowFileName.trim()) {
  console.error('Cover-Vertrag kann nicht angewendet werden: scene-01.googleFlowFileName fehlt.');
  process.exit(1);
}

index.version = Math.max(Number(index.version) || 0, 28);
index.cover = {
  type: 'scene-image',
  sourceSceneId: 'scene-01',
  googleFlowFileName: firstScene.googleFlowFileName,
  planFile: '03-szenen/00-cover/cover.txt',
  aspectRatio: '1:1',
  sameAssetAsFirstScene: true,
  separateGenerationForbidden: true,
};
index.platformPublishing = {
  ...(index.platformPublishing ?? {}),
  universalCaptionSource: '04-caption/caption.txt',
  universalCaptionExport: '06-export/caption-universal.txt',
  universalCaptionForAllReelPlatforms: true,
};
index.phase3CompletionContract = {
  ...(index.phase3CompletionContract ?? {}),
  autoExportAfterPassedRenderQa: true,
  finalVideoDirectory: '06-export',
  universalCaptionSource: '04-caption/caption.txt',
  universalCaptionExport: '06-export/caption-universal.txt',
};
write(indexPath, JSON.stringify(index, null, 2));

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
const coverContract = `COVER = SZENE 01 — KEIN SEPARATER BILDJOB\n\nDie erste Reel-Szene ist automatisch das Cover. Google Flow darf KEIN zusätzliches Cover und KEIN Bild 00 erzeugen. Für Reel und Cover wird exakt dieselbe fertige Datei aus scene-01 verwendet.\n\nSOURCE_SCENE_ID: scene-01\nGOOGLE FLOW – FINALER DATEINAME:\n${firstScene.googleFlowFileName}\n\nFINANZNEO_WORLD_ID: finanzneo-connected-studio-v3\nFINANZNEO_SERIES_LOCK: finanzneo-same-world-v1\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\nGENERATED_IMAGE_ASPECT_RATIO: 1:1\n\nEXACT SHORT GERMAN OBJECT LABELS:\n- exakt dieselben Labels wie im kanonischen Bildprompt von scene-01\n\nIMAGE PROMPT:\nThis file does not define a second image and must never start a separate Google Flow generation job. The canonical cover is the exact final image already generated for scene-01. Use the scene-01 image unchanged as the Reel cover so the first visual beat and the thumbnail are identical. The underlying scene must remain a real-world-grounded explanatory situation with visible cause and effect, believable everyday objects and short German object labels only when they improve immediate understanding. It must visually explain the spoken point without requiring interpretation, while remaining clearly stylized 3D and not photorealistic.\n\nSTYLE:\nKeep the exact scene-01 stylized 3D visual language. Real-life context first, believable proportions, polished materials, never photorealistic.\n\nBACKGROUND:\nThe deep black background is mandatory and must match scene-01 exactly.\n\nCOMPOSITION:\nDo not redesign, crop into a different concept or replace scene-01 with symbolic finance icons. The cover is the same asset as the first scene.\n\nBRANDS + LOGOS:\nIf relevant, recognizable but stylized only; never use pasted real logos or screenshot-like branded UI.\n\nFORBIDDEN:\nNo separate cover generation, no Bild 00, no photorealism, no dashboard, no app UI, no flowchart, no abstract symbol-only replacement and no decorative clutter.\n`;
write(coverPath, coverContract);

const allPromptsPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (existsSync(allPromptsPath)) {
  let master = read(allPromptsPath);
  const scene01Marker = master.indexOf('SZENE 01');
  const coverMarker = master.indexOf('\nCOVER\n');
  if (scene01Marker >= 0 && coverMarker >= 0 && coverMarker < scene01Marker) {
    const coverBlockStart = master.lastIndexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', coverMarker);
    const sceneBlockStart = master.lastIndexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', scene01Marker);
    if (coverBlockStart >= 0 && sceneBlockStart > coverBlockStart) {
      const replacement = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER = SZENE 01\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN separates Cover erzeugen. KEIN Bild 00 erzeugen. Das final erzeugte Bild von scene-01 (${firstScene.googleFlowFileName}) ist automatisch gleichzeitig das Reel-Cover.\n\n`;
      master = `${master.slice(0, coverBlockStart)}${replacement}${master.slice(sceneBlockStart)}`;
    }
  }
  master = master.replace(/Bild 00[^\n]*/gi, 'KEIN Bild 00 — Cover ist scene-01');
  write(allPromptsPath, master);
}

const appendRule = (relativePath, heading, lines) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(heading)) return;
  write(path, `${current.trim()}\n\n${heading}\n\n${lines}\n`);
};

appendRule(
  'README.md',
  '## Cover- und Export-Automatik',
  '- Szene 01 ist immer eine Bildszene und automatisch das Cover; es gibt keinen separaten Cover-Bildjob.\n- Nach bestandener Phase-3-Render-QA wird der Export automatisch gestartet.\n- Das fertige Reel liegt danach in `06-export/` zusammen mit `caption-universal.txt` als Standard-Caption für alle Reel-Plattformen.',
);
appendRule(
  '03-szenen/README.md',
  '## Cover-Regel',
  `- scene-01 ist das Cover.\n- Google Flow erzeugt dafür nur ${firstScene.googleFlowFileName}.\n- Kein separates Bild 00 und kein zweiter Cover-Job.`,
);
appendRule(
  '05-projektdateien/technische-hinweise.md',
  '## Finaler Cover-/Export-Vertrag',
  '- scene-01 = Cover; dieselbe 1:1-Quelldatei wird im Reel und als Cover verwendet.\n- FINAL_RENDER_QA_PASSED löst automatisch `reel:export` aus.\n- Finalvideo: `06-export/<reel-name>.mp4`.\n- Universelle Social-Caption: `06-export/caption-universal.txt` aus `04-caption/caption.txt`.',
);

const exportReadmePath = resolve(root, '06-export/README.md');
write(exportReadmePath, `# 06-export — automatischer finaler Reel-Export\n\nDieser Ordner ist der einzige finale Ausgabeordner. Nach bestandener Phase-3-Render-QA startet der Render-Prozess automatisch den Export. Ein manueller Zwischenschritt ist nicht vorgesehen.\n\n## Pflichtdateien nach erfolgreichem Abschluss\n\n- \`${basename(root)}.mp4\` — fertiges, per Render-QA geprüftes Reel\n- \`caption-universal.txt\` — universelle Reel-Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat\n- \`cover.png\` / entsprechendes Bildformat — exakt das Bild aus scene-01, kein separat erzeugtes Cover\n- \`untertitel.srt\`\n- \`UPLOAD.md\`\n\nZusätzliche Plattformtexte oder \`bilder.zip\` dürfen ebenfalls enthalten sein, aber Video + universelle Caption + scene-01-Cover sind die zentrale Upload-Ausgabe.\n\nSolange die echte finale MP4 noch nicht gerendert und geprüft wurde, darf keine Platzhalter-MP4 erzeugt werden.\n`);

console.log('✓ Scene-01-Cover-/Auto-Export-Vertrag angewendet.');
console.log(`  Cover = scene-01 = ${firstScene.googleFlowFileName}`);
console.log('  Kein separater Cover-Bildjob / kein Bild 00.');
console.log('  Finaler Render exportiert automatisch nach 06-export/.');
console.log('  caption-universal.txt ist die Standard-Caption für alle Reel-Plattformen.');
