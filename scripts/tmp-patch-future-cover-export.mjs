#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/export-reel.mjs';
let source = readFileSync(path, 'utf8');

const oldCover = `// ── 2. Cover = exakt scene-01 ───────────────────────────────────────────────
const bilderOrdner = resolve(root, '03-szenen/00-ALLE-BILDER-HIER-REIN');
const firstScene = Array.isArray(index.scenes) ? index.scenes[0] : null;
let coverExportName = 'cover.png';
if (!firstScene || firstScene.id !== 'scene-01' || firstScene.type !== 'image') {
  fehlt.push('scene-01 muss als Bildszene das Cover liefern');
} else if (existsSync(bilderOrdner)) {
  const erwarteterCoverName = String(firstScene.googleFlowFileName ?? '').trim();
  const dateien = readdirSync(bilderOrdner);
  const coverDatei = dateien.find((f) => f.toLowerCase() === erwarteterCoverName.toLowerCase())
    ?? dateien.find((f) => /^Bild 01\\b/i.test(f) && /\\.(png|jpe?g|webp)$/i.test(f));

  if (coverDatei && /\\.(png|jpe?g|webp)$/i.test(coverDatei)) {
    const extension = coverDatei.slice(coverDatei.lastIndexOf('.'));
    coverExportName = \`cover\${extension}\`;
    copyFileSync(join(bilderOrdner, coverDatei), join(exportDir, coverExportName));
    gebaut.push(\`\${coverExportName} (identisch mit scene-01)\`);
  } else {
    fehlt.push(\`Cover = scene-01 (\${erwarteterCoverName || 'Bild 01'}) im Bilderordner\`);
  }
} else {
  fehlt.push('Bilderordner 03-szenen/00-ALLE-BILDER-HIER-REIN');
}
`;

const newCover = `// ── 2. Cover = scene-01; Future V2 exportiert den sichtbaren Frame 0 ─────────
const bilderOrdner = resolve(root, '03-szenen/00-ALLE-BILDER-HIER-REIN');
const firstScene = Array.isArray(index.scenes) ? index.scenes[0] : null;
const futureCoverHook = index.coverHookContract?.id === 'finanzneo-cover-hook-v2';
let coverExportName = 'cover.png';
if (!firstScene || firstScene.id !== 'scene-01' || firstScene.type !== 'image') {
  fehlt.push('scene-01 muss als Bildszene das Cover liefern');
} else if (futureCoverHook) {
  // V2: Das Flow-Bild enthält absichtlich keinen Titel. Der exakte Titel wird
  // in Remotion ab Frame 0 gerendert. Deshalb muss das Upload-Cover aus der
  // bereits per SHA-256 geprüften finalen MP4 kommen, nicht aus dem Rohbild.
  const coverPfad = join(exportDir, coverExportName);
  const frame = spawnSync('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', '-ss', '0', '-i', videoZiel,
    '-frames:v', '1', coverPfad,
  ], {encoding: 'utf8'});
  if (frame.status === 0 && existsSync(coverPfad)) {
    gebaut.push('cover.png (gerenderter finaler Frame 0 mit Reel-Titel)');
  } else {
    fehlt.push('Future-Cover konnte nicht aus finalem Video-Frame 0 erzeugt werden');
  }
} else if (existsSync(bilderOrdner)) {
  // Legacy/V1 unverändert: scene-01-Rohbild bleibt das Cover.
  const erwarteterCoverName = String(firstScene.googleFlowFileName ?? '').trim();
  const dateien = readdirSync(bilderOrdner);
  const coverDatei = dateien.find((f) => f.toLowerCase() === erwarteterCoverName.toLowerCase())
    ?? dateien.find((f) => /^Bild 01\\b/i.test(f) && /\\.(png|jpe?g|webp)$/i.test(f));

  if (coverDatei && /\\.(png|jpe?g|webp)$/i.test(coverDatei)) {
    const extension = coverDatei.slice(coverDatei.lastIndexOf('.'));
    coverExportName = \`cover\${extension}\`;
    copyFileSync(join(bilderOrdner, coverDatei), join(exportDir, coverExportName));
    gebaut.push(\`\${coverExportName} (identisch mit scene-01)\`);
  } else {
    fehlt.push(\`Cover = scene-01 (\${erwarteterCoverName || 'Bild 01'}) im Bilderordner\`);
  }
} else {
  fehlt.push('Bilderordner 03-szenen/00-ALLE-BILDER-HIER-REIN');
}
`;

if (!source.includes(oldCover)) throw new Error('Kanonischer Cover-Exportblock nicht gefunden; Patch abgebrochen.');
source = source.replace(oldCover, newCover);

const oldUploadCover = `## Cover

- \\`\${coverExportName}\\` ist exakt dasselbe Bild wie scene-01.
- Es wurde KEIN separates Cover und KEIN Bild 00 erzeugt.`;
const newUploadCover = `## Cover

\${futureCoverHook
  ? '- `cover.png` ist Frame 0 der final geprüften MP4 inklusive Remotion-Reel-Titel.\\n- Szene 01 enthält im Video keine Untertitel; der Titel ist ab Frame 0 sichtbar.'
  : \`- \\`\${coverExportName}\\` ist exakt dasselbe Bild wie scene-01.\`}
- Es wurde KEIN separater Flow-Cover-Job und KEIN Bild 00 erzeugt.`;
if (!source.includes(oldUploadCover)) throw new Error('UPLOAD-Coverblock nicht gefunden; Patch abgebrochen.');
source = source.replace(oldUploadCover, newUploadCover);

source = source.replace(
  "console.log('\\n✓ FINAL_COMPLETE — 06-export enthält das geprüfte Reel, scene-01 als Cover und die universelle Reel-Caption.');",
  "console.log('\\n✓ FINAL_COMPLETE — 06-export enthält das geprüfte Reel, das vertragskonforme scene-01-Cover und die universelle Reel-Caption.');",
);

writeFileSync(path, source, 'utf8');
console.log('✓ Export rückwärtskompatibel erweitert: Future Cover Hook V2 -> finaler Frame 0; Legacy/V1 unverändert.');
