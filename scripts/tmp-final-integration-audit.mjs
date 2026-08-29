#!/usr/bin/env node

import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';

const reel = 'reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen';
const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(message); };
const replaceOnce = (source, search, replacement, label) => {
  must(source.includes(search), `Migration erwartet alten Stand nicht gefunden: ${label}`);
  return source.replace(search, replacement);
};

// 1) One canonical publishing contract: one source caption, one exported caption.
{
  const path = 'scripts/lib/reel-contract.mjs';
  let source = read(path);
  const oldBlock = `// FinanzNeo veröffentlicht keine YouTube Shorts.\n// YouTube ist ausschließlich Longform unter youtube/ — siehe docs/PLATFORM-PUBLISHING.md.\nexport const PLATFORM_PUBLISHING_FILES = {\n  masterCaption: \`${'${CAPTION_DIRECTORY}'}/caption.txt\`,\n  instagramReels: \`${'${CAPTION_DIRECTORY}'}/instagram-reels.txt\`,\n  tiktok: \`${'${CAPTION_DIRECTORY}'}/tiktok.txt\`,\n  facebookReels: \`${'${CAPTION_DIRECTORY}'}/facebook-reels.txt\`,\n  snapchat: \`${'${CAPTION_DIRECTORY}'}/snapchat.txt\`,\n};\n\n// Schlüssel und Dateien, die in aktiven Reel-Projekten nicht vorkommen dürfen.\nexport const FORBIDDEN_PUBLISHING_KEYS = ['youtubeShorts'];\nexport const FORBIDDEN_PUBLISHING_FILES = [\`${'${CAPTION_DIRECTORY}'}/youtube-shorts.txt\`];`;
  const newBlock = `// Reel-Publishing nutzt genau EINE Caption-Quelle für alle Reel-Plattformen.\n// YouTube ist ausschließlich Longform unter youtube/ — siehe docs/PLATFORM-PUBLISHING.md.\nexport const PLATFORM_PUBLISHING_FILES = {\n  universalCaption: \`${'${CAPTION_DIRECTORY}'}/caption.txt\`,\n};\n\n// Alte Plattformvarianten sind verboten, damit Generator, Validator und Export\n// nicht wieder mehrere widersprüchliche Caption-Wahrheiten erzeugen.\nexport const FORBIDDEN_PUBLISHING_KEYS = [\n  'youtubeShorts',\n  'masterCaption',\n  'instagramReels',\n  'tiktok',\n  'facebookReels',\n  'snapchat',\n];\nexport const FORBIDDEN_PUBLISHING_FILES = [\n  \`${'${CAPTION_DIRECTORY}'}/youtube-shorts.txt\`,\n  \`${'${CAPTION_DIRECTORY}'}/instagram-reels.txt\`,\n  \`${'${CAPTION_DIRECTORY}'}/tiktok.txt\`,\n  \`${'${CAPTION_DIRECTORY}'}/facebook-reels.txt\`,\n  \`${'${CAPTION_DIRECTORY}'}/snapchat.txt\`,\n];`;
  source = replaceOnce(source, oldBlock, newBlock, path);
  write(path, source);
}

// 2) Publishing validator: enforce universal-only at source level.
write('scripts/validate-platform-publishing.mjs', `#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  CAPTION_DIRECTORY,
  FORBIDDEN_PUBLISHING_FILES,
  FORBIDDEN_PUBLISHING_KEYS,
  PLATFORM_PUBLISHING_FILES,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-platform-publishing.mjs <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(existsSync(indexPath), \`${'${SCENE_INDEX}'} fehlt.\`);
if (!existsSync(indexPath)) {
  console.error(\`\\nPublishing-Vertrag verletzt:\\n- ${'${SCENE_INDEX}'} fehlt.\`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Universal-Caption-Vertrag wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const publishing = index.platformPublishing ?? {};
const sourcePath = PLATFORM_PUBLISHING_FILES.universalCaption;

assert(publishing.directory === CAPTION_DIRECTORY, \`platformPublishing.directory muss ${'${CAPTION_DIRECTORY}'} sein.\`);
assert(publishing.universalCaptionSource === sourcePath, \`platformPublishing.universalCaptionSource muss ${'${sourcePath}'} sein.\`);
assert(publishing.universalCaptionExport === '06-export/caption-universal.txt', 'platformPublishing.universalCaptionExport muss 06-export/caption-universal.txt sein.');
assert(publishing.universalCaptionForAllReelPlatforms === true, 'Eine universelle Caption muss für alle Reel-Plattformen gelten.');

for (const key of FORBIDDEN_PUBLISHING_KEYS) {
  assert(!Object.prototype.hasOwnProperty.call(publishing, key), \`platformPublishing.${'${key}'} ist im Universal-Caption-Vertrag verboten.\`);
}
for (const relativePath of FORBIDDEN_PUBLISHING_FILES) {
  assert(!existsSync(resolve(root, relativePath)), \`${'${relativePath}'} ist im Universal-Caption-Vertrag verboten.\`);
}

const captionPath = resolve(root, sourcePath);
assert(existsSync(captionPath), \`${'${sourcePath}'} fehlt.\`);
if (existsSync(captionPath)) {
  const content = readFileSync(captionPath, 'utf8');
  if (/\\[(?:EINFÜGEN|OPTIONAL|VOLLSTÄNDIG)/i.test(content)) warnings.push(\`${'${sourcePath}'} enthält noch Platzhalter.\`);
}

if (errors.length) {
  console.error('\\nUniversal-Caption-Vertrag verletzt:\\n');
  errors.forEach((error) => console.error(\`- ${'${error}'}\`));
  process.exit(1);
}

console.log('\\n✓ Universal-Caption-Struktur vollständig.');
console.log('  Eine Quelle: 04-caption/caption.txt');
console.log('  Ein Export: 06-export/caption-universal.txt');
console.log('  Gilt identisch für Instagram Reels · TikTok · Facebook Reels · Snapchat.');
console.log('  Keine separaten Plattform-Captiondateien.');
if (warnings.length) warnings.forEach((warning) => console.log(\`  Hinweis: ${'${warning}'}\`));
`);

// 3) Source validator: same publishing truth, plus old files/keys forbidden.
{
  const path = 'scripts/validate-reel-source-contract.mjs';
  let source = read(path);
  source = replaceOnce(
    source,
    `  IMAGE_INBOX,\n  PLATFORM_PUBLISHING_FILES,`,
    `  IMAGE_INBOX,\n  FORBIDDEN_PUBLISHING_FILES,\n  FORBIDDEN_PUBLISHING_KEYS,\n  PLATFORM_PUBLISHING_FILES,`,
    `${path} imports`,
  );
  const old = `for (const [key, expectedPath] of Object.entries(PLATFORM_PUBLISHING_FILES)) {\n  assert(index.platformPublishing?.[key] === expectedPath, \`platformPublishing.${'${key}'} muss ${'${expectedPath}'} sein.\`);\n  assert(existsSync(resolve(root, expectedPath)), \`Plattformdatei fehlt: ${'${expectedPath}'}\`);\n}\nassert(index.platformPublishing?.directory === CAPTION_DIRECTORY, \`platformPublishing.directory muss ${'${CAPTION_DIRECTORY}'} sein.\`);`;
  const replacement = `const publishing = index.platformPublishing ?? {};\nconst universalCaptionSource = PLATFORM_PUBLISHING_FILES.universalCaption;\nassert(publishing.directory === CAPTION_DIRECTORY, \`platformPublishing.directory muss ${'${CAPTION_DIRECTORY}'} sein.\`);\nassert(publishing.universalCaptionSource === universalCaptionSource, \`platformPublishing.universalCaptionSource muss ${'${universalCaptionSource}'} sein.\`);\nassert(publishing.universalCaptionExport === '06-export/caption-universal.txt', 'platformPublishing.universalCaptionExport muss 06-export/caption-universal.txt sein.');\nassert(publishing.universalCaptionForAllReelPlatforms === true, 'Eine universelle Caption muss für alle Reel-Plattformen gelten.');\nassert(existsSync(resolve(root, universalCaptionSource)), \`Universelle Caption fehlt: ${'${universalCaptionSource}'}\`);\nfor (const key of FORBIDDEN_PUBLISHING_KEYS) {\n  assert(!Object.prototype.hasOwnProperty.call(publishing, key), \`Veralteter Publishing-Key verboten: platformPublishing.${'${key}'}\`);\n}\nfor (const relativePath of FORBIDDEN_PUBLISHING_FILES) {\n  assert(!existsSync(resolve(root, relativePath)), \`Veraltete Publishing-Datei verboten: ${'${relativePath}'}\`);\n}`;
  source = replaceOnce(source, old, replacement, `${path} publishing block`);
  write(path, source);
}

// 4) Scaffold: future Reels create only universal caption + timings.
{
  const path = 'scripts/scaffold-finanzneo-reel.mjs';
  let source = read(path);
  source = source.replace('04-caption = Master-/Plattform-Captions und Wort-Timings', '04-caption = universelle Caption und Wort-Timings');
  source = source.replace("write('04-caption/caption.txt', '[GEPRÜFTE MASTER-CAPTION / GEMEINSAME FAKTENBASIS EINFÜGEN]\\n');", "write('04-caption/caption.txt', '[UNIVERSELLE CAPTION FÜR ALLE REEL-PLATTFORMEN EINFÜGEN]\\n');");
  source = source
    .split('\n')
    .filter((line) => ![
      "write('04-caption/instagram-reels.txt'",
      "write('04-caption/tiktok.txt'",
      "write('04-caption/facebook-reels.txt'",
      "write('04-caption/snapchat.txt'",
    ].some((prefix) => line.trimStart().startsWith(prefix)))
    .join('\n');
  source = source.replace('produktionsreife animation.tsx und Plattformtexte vollständig', 'produktionsreife animation.tsx und eine universelle Caption vollständig');
  source = source.replace(
    'Create a clearly non-realistic stylized 3D animated finance scene. Use soft rounded geometry, simplified recognizable details, clean materials and a premium but slightly playful animated-movie feel.',
    'Create a clearly stylized 3D finance explainer scene grounded in a believable real-world situation. Keep object construction and proportions recognizable, use semi-realistic material detail and polished stylization, but never become photorealistic or stock-photo-like.',
  );
  write(path, source);
}

// 5) Cover/export contract must RESET publishing instead of preserving legacy keys.
{
  const path = 'scripts/apply-scene01-cover-export-contract.mjs';
  let source = read(path);
  const old = `index.platformPublishing = {\n  ...(index.platformPublishing ?? {}),\n  universalCaptionSource: '04-caption/caption.txt',\n  universalCaptionExport: '06-export/caption-universal.txt',\n  universalCaptionForAllReelPlatforms: true,\n};`;
  const replacement = `index.platformPublishing = {\n  directory: '04-caption',\n  universalCaptionSource: '04-caption/caption.txt',\n  universalCaptionExport: '06-export/caption-universal.txt',\n  universalCaptionForAllReelPlatforms: true,\n  platforms: ['instagram-reels', 'tiktok', 'facebook-reels', 'snapchat'],\n};`;
  source = replaceOnce(source, old, replacement, `${path} publishing reset`);
  source = source.replace(
    'Zusätzliche Plattformtexte oder `bilder.zip` dürfen ebenfalls enthalten sein, aber Video + universelle Caption + scene-01-Cover sind die zentrale Upload-Ausgabe.',
    'Es werden keine separaten Plattform-Captiondateien erzeugt. `bilder.zip` darf zusätzlich enthalten sein.',
  );
  write(path, source);
}

// 6) Canonical exporter itself is universal-only. Auto-render and manual export now share exactly one path.
{
  const path = 'scripts/export-reel.mjs';
  let source = read(path);
  const block = /\/\/ ── 4\. Captions[\s\S]*?(?=\/\/ ── 5\. Untertitel)/;
  must(block.test(source), `${path}: Caption-Block nicht gefunden.`);
  source = source.replace(block, `// ── 4. Universelle Caption ───────────────────────────────────────────────────\n// Genau dieselbe Caption wird auf Instagram Reels, TikTok, Facebook Reels und\n// Snapchat verwendet. Es gibt keine plattformspezifischen Caption-Dateien.\nconst captionQuelle = resolve(root, '04-caption/caption.txt');\nif (existsSync(captionQuelle)) {\n  copyFileSync(captionQuelle, join(exportDir, 'caption-universal.txt'));\n  gebaut.push('caption-universal.txt');\n} else {\n  fehlt.push('04-caption/caption.txt');\n}\n\n`);
  source = source.replace(
    'Die zusätzlichen Plattformdateien bleiben nur als optionale Varianten im Paket.',
    'Es werden bewusst keine separaten Plattform-Captiondateien erzeugt.',
  );
  source = source.replace(
    '- optionale Plattform-Captions für spätere Sonderanpassungen',
    '- `caption-universal.txt` — die einzige Caption für alle Reel-Plattformen',
  );
  for (const forbidden of ['caption-instagram.txt', 'caption-tiktok.txt', 'caption-facebook.txt', 'caption-snapchat.txt']) {
    must(!source.includes(forbidden), `${path}: alter Exportname bleibt aktiv: ${forbidden}`);
  }
  write(path, source);
}

// 7) package script points directly at canonical exporter; redundant wrapper disappears.
{
  const path = 'package.json';
  const pkg = JSON.parse(read(path));
  pkg.scripts['reel:export'] = 'node scripts/export-reel.mjs';
  write(path, JSON.stringify(pkg, null, 2));
}
if (existsSync('scripts/export-reel-universal-caption.mjs')) rmSync('scripts/export-reel-universal-caption.mjs');

// 8) Current Reel metadata becomes universal-only and old caption files are removed.
{
  const path = `${reel}/03-szenen/scene-index.json`;
  const index = JSON.parse(read(path));
  index.version = Math.max(Number(index.version) || 0, 30);
  index.platformPublishing = {
    directory: '04-caption',
    universalCaptionSource: '04-caption/caption.txt',
    universalCaptionExport: '06-export/caption-universal.txt',
    universalCaptionForAllReelPlatforms: true,
    platforms: ['instagram-reels', 'tiktok', 'facebook-reels', 'snapchat'],
  };
  write(path, JSON.stringify(index, null, 2));
}
for (const file of ['instagram-reels.txt', 'tiktok.txt', 'facebook-reels.txt', 'snapchat.txt']) {
  const path = `${reel}/04-caption/${file}`;
  if (existsSync(path)) rmSync(path);
}

// 9) Highest authority: explicit responsibilities, approved SFX integration and Playwright QA, one caption only.
{
  const path = 'CLAUDE.md';
  let source = read(path);
  source = source.replace('- Master-/Plattform-Captions', '- genau eine universelle Social-Caption: `04-caption/caption.txt`');
  source = replaceOnce(
    source,
    '- erzeugt echte Wort-Zeitstempel\n',
    '- erzeugt echte Wort-Zeitstempel\n- finale Flow-Bilder und das Haupt-Voiceover bleiben Nutzerverantwortung; kein Agent ersetzt oder generiert sie eigenmächtig\n',
    `${path} Phase2 responsibility`,
  );
  source = replaceOnce(
    source,
    '- Timeline, Header und Captions integrieren\n- Preflight, Candidate-Render, Render-QA und Export ausführen\n',
    '- Timeline, Header und Captions integrieren\n- bereits freigegebene SFX aus dem kanonischen Cue-Plan lokal und framegenau integrieren; optionale SFX dürfen vor dem finalen Render über den konfigurierten Sound-Skill erzeugt werden, niemals das Voiceover\n- Playwright Visual QA gegen die lokale Remotion-Preview ausführen und sichtbare Fehler an der kanonischen Quelle beheben\n- Preflight, Candidate-Render, Render-QA und Export ausführen\n',
    `${path} Phase3 tools`,
  );
  source = source.replace(
    'Phase 3 darf Animationen **nicht kreativ ersetzen, vereinfachen oder neu erfinden**.',
    'Phase 3 darf versiegelte Animationen **nicht kreativ ersetzen, vereinfachen oder neu erfinden**. Eine neue Animations-/Lottie-Idee nach dem Seal bedeutet zurück zu Phase 1, Änderung der kanonischen Quelle, erneute Validation und erneutes Seal.',
  );
  const publishing = /## 14\. Publishing[\s\S]*?(?=## 15\. Produktionsbefehle)/;
  must(publishing.test(source), `${path}: Publishing-Sektion nicht gefunden.`);
  source = source.replace(publishing, `## 14. Publishing\n\nFür alle Reel-Plattformen gibt es genau **eine** Social-Caption.\n\nKanonische Quelle:\n\n\`\`\`text\n04-caption/caption.txt\n\`\`\`\n\nFinaler Export:\n\n\`\`\`text\n06-export/caption-universal.txt\n\`\`\`\n\nDieselbe Caption wird für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet. Separate Dateien wie \`instagram-reels.txt\`, \`tiktok.txt\`, \`facebook-reels.txt\` oder \`snapchat.txt\` sind in aktiven Reel-Projekten verboten. YouTube Shorts existieren nicht; YouTube bleibt Longform unter \`youtube/\`.\n\n`);
  write(path, source);
}

// 10) Canonical production standard rewritten to match the current system without legacy publishing rules.
write('reels/PRODUKTIONSSTANDARD.md', `# FinanzNeo-Reel-Produktionsstandard\n\n> Bei Widersprüchen gilt immer \`CLAUDE.md\`.\n\n## 1. Struktur\n\n\`\`\`text\n01-script/\n02-audio/\n03-szenen/\n04-caption/\n05-projektdateien/\n06-export/\n\`\`\`\n\n\`04-caption/\` enthält in aktiven Reels nur die universelle Publishing-Caption \`caption.txt\` und \`word-timings.json\`. Es gibt keine separaten Plattform-Captiondateien.\n\n## 2. Drei Phasen\n\n### Phase 1 — ChatGPT / Motion Authoring\n\n- Recherche + Quellen\n- einfaches, anfängerfreundliches Skript\n- Szenenplan und V9-Flow-Prompts\n- Header + Icons\n- fertige kanonische \`animation.tsx\` je Animationsszene\n- Lottie nur als gezielte Support-Ebene vor dem Animation-Seal\n- Sound-Cue-Plan\n- genau eine universelle Caption: \`04-caption/caption.txt\`\n\n### Phase 2 — Nutzer\n\n- finale Google-Flow-Bilder\n- genau ein finales Haupt-Voiceover\n- echte Wort-Timings aus diesem Voiceover\n\nKein Agent ersetzt oder generiert diese Flow-Bilder oder das Haupt-Voiceover eigenmächtig.\n\n### Phase 3 — konfigurierter Executor\n\n\`scene-index.json.phase3Executor\` entscheidet den Executor. Phase 3 integriert die finalen Nutzerassets, den versiegelten Animationscode und freigegebene lokale SFX. Sie darf zusätzlich Playwright Visual QA gegen die lokale Remotion-Preview durchführen. Eine kreative Änderung an Animation/Lottie nach dem Seal muss zurück in Phase 1 und neu versiegelt werden.\n\n## 3. Bilder / Google Flow\n\n- exakt ein Bildjob gleichzeitig\n- vollständig warten → exakt umbenennen → V9-QA → erst dann nächster Job\n- keine Batch-/Parallelgenerierung\n- scene-01 ist automatisch das Cover; kein Bild 00\n- finale Bilder liegen in \`03-szenen/00-ALLE-BILDER-HIER-REIN/\`\n\nBildwelt: \`finanzneo-stylized-3d-animated-black-v9\`. Reale Alltagssituation und klare Ursache/Wirkung zuerst; glaubwürdige Objektkonstruktion und Proportionen; semi-realistische Materialdetails in klar stilisiertem 3D; niemals fotorealistisch. Deep Black bleibt Pflicht.\n\n## 4. Layout V5\n\nQuelle ist ausschließlich \`REEL_STYLE\`:\n\n\`\`\`text\nHeader Y154\nHeader 56 px, Minimum 50 px, max. 2 Zeilen\nIcon 34 px, optisch normalisiert\nVisual Y320–1400\nCaption bottom340, max. 2 Zeilen\nTransition 3 Frames\n\`\`\`\n\nZweizeilige Header halten das Icon an der ersten Textzeile. \`AnimationStage\` clippt hart auf Y320–1400. Der produktive Hintergrund ist statisch \`#000000\`.\n\n## 5. Animationen\n\nAnimationsszenen sind kleine visuelle Geschichten:\n\n\`\`\`text\nSTART → TRIGGER → PHYSISCHE AKTION → REAKTION → ERGEBNIS → RESULT HOLD\n\`\`\`\n\nPflicht sind konkrete Realwelt-Objekte, sichtbare Ursache/Wirkung, mehrere koordinierte Motion-Channels und mindestens 15 Frames Ergebnis-Hold. Remotion bleibt Timeline-/Render-Autorität. Three/R3F, Paths, Shapes, Motion Blur und Lottie sind Support-Werkzeuge, keine Ersatzmechanik. Kartenreihen, Flowcharts, Dashboard-UI, Fortschrittsbalken als Hauptgeschichte, Partikel/Aurora/Grid-Hintergründe und Debug-/Wackel-Hacks sind verboten.\n\nNach \`reel:ready\` ist die kanonische Animation per SHA-256 versiegelt.\n\n## 6. SFX\n\nSFX bestätigen sichtbare Ereignisse framegenau. Voiceover bleibt immer dominant. Keine Placeholder-Beeps, keine Remote-Sound-URLs, keine Casino-/Jackpot-Geldsounds. Fehlende freigegebene SFX dürfen mit dem konfigurierten Sound-Skill lokal erzeugt werden; das Haupt-Voiceover bleibt unverändert Nutzerasset.\n\n## 7. Playwright Visual QA\n\nPlaywright CLI prüft die lokale Remotion-Preview. Jede Bildszene erhält mindestens einen stabilen Check; jede Animationsszene mindestens START, TRIGGER, MID, NEAR RESULT und FINAL HOLD. Geprüft werden insbesondere Header/Icon-Konsistenz, Y320–1400, Caption-Abstand, Clipping, Hero-Größe, Leerraum und sichtbare Start→Ergebnis-Veränderung. Sichtbare Fehler müssen an der kanonischen Quelle behoben werden, auch wenn TypeScript/Bundle bereits grün sind.\n\n## 8. Phase 3 / Abschluss\n\nNormale Kette:\n\n\`\`\`bash\nnpm run reel:ready -- <Reel-Pfad>\nnpm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>\nnpm run reel:phase3:preflight -- <Reel-Pfad>\nnpm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json\n\`\`\`\n\n\`reel:render\` erzeugt den Candidate, führt Post-Render-QA aus und startet nach PASS automatisch den kanonischen Export. Ein direkter \`reel:export\`-Aufruf ist nur ein kontrollierter Re-Export einer bereits geprüften finalen MP4.\n\nFINAL_COMPLETE verlangt: alle Szenen belegt, exakter Animations-Seal, Audio vorhanden, 1080×1920, korrekte Timeline, Visual-QA bestanden und vollständiges \`06-export/\`.\n\n## 9. Publishing\n\nFinaler Standard:\n\n\`\`\`text\n06-export/<reel-name>.mp4\n06-export/cover.<ext>\n06-export/caption-universal.txt\n06-export/untertitel.srt\n06-export/bilder.zip\n06-export/UPLOAD.md\n\`\`\`\n\n\`caption-universal.txt\` ist die einzige Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat. Keine separaten Plattform-Captiondateien. YouTube bleibt eigenständiges Longform unter \`youtube/\`.\n`);

// 11) Publishing documentation rewritten around one canonical caption.
write('docs/PLATFORM-PUBLISHING.md', `# FinanzNeo — Plattform-Publishing\n\n\`CLAUDE.md\` bleibt die höchste Regelquelle.\n\n## Reel-Plattformen\n\nDasselbe 9:16-Reel und dieselbe Caption werden standardmäßig auf folgenden Plattformen verwendet:\n\n- Instagram Reels\n- TikTok\n- Facebook Reels\n- Snapchat\n\nYouTube Shorts werden nicht erzeugt. YouTube ist ausschließlich eigenständiges Longform unter \`youtube/\`.\n\n## Kanonische Caption\n\nAktives Reel-Projekt:\n\n\`\`\`text\n04-caption/\n├── caption.txt\n└── word-timings.json\n\`\`\`\n\n- \`caption.txt\` = einzige Publishing-Caption für alle vier Reel-Plattformen\n- \`word-timings.json\` = echte Wortzeiten für eingebrannte/optionale Untertitel, keine zweite Social-Caption\n\nSeparate Instagram-, TikTok-, Facebook- oder Snapchat-Captiondateien sind verboten. Dadurch gibt es nur eine inhaltliche Wahrheit und keinen Drift zwischen Plattformen.\n\n## Finaler Export\n\nNach bestandener Render-QA kopiert der kanonische Export \`04-caption/caption.txt\` nach:\n\n\`\`\`text\n06-export/caption-universal.txt\n\`\`\`\n\nDiese eine Datei wird auf Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet. Es werden keine separaten Plattform-Captiondateien erzeugt.\n\n## Inhaltliche Regeln\n\nDie Caption darf nur geprüfte Aussagen enthalten. Quellen-/Datenstand-Hinweise, Werbe-/Affiliate-Kennzeichnung und CTA werden nur ergänzt, wenn sie für das Reel tatsächlich nötig sind. Keine erfundenen Renditen, Garantien, irreführenden Versprechen oder zufälligen Trend-Hashtags.\n\nAktuelle Plattformlimits werden bei Bedarf vor Veröffentlichung anhand offizieller Quellen geprüft und nicht dauerhaft als fragile Zahlen in den Repo-Vertrag geschrieben.\n`);

// 12) Contract test protects the universal-only model.
{
  const path = 'tests/reel-contract.test.ts';
  let source = read(path);
  const old = `test('Reel-Vertrag enthält genau die erlaubten Plattformdateien', () => {\n  assert.deepEqual(Object.keys(PLATFORM_PUBLISHING_FILES).sort(), [\n    'facebookReels',\n    'instagramReels',\n    'masterCaption',\n    'snapchat',\n    'tiktok',\n  ]);\n  assert.ok(FORBIDDEN_PUBLISHING_FILES.includes('04-caption/youtube-shorts.txt'));\n});`;
  const replacement = `test('Reel-Vertrag erzwingt genau eine universelle Caption', () => {\n  assert.deepEqual(Object.keys(PLATFORM_PUBLISHING_FILES), ['universalCaption']);\n  assert.equal(PLATFORM_PUBLISHING_FILES.universalCaption, '04-caption/caption.txt');\n  for (const oldFile of [\n    '04-caption/youtube-shorts.txt',\n    '04-caption/instagram-reels.txt',\n    '04-caption/tiktok.txt',\n    '04-caption/facebook-reels.txt',\n    '04-caption/snapchat.txt',\n  ]) {\n    assert.ok(FORBIDDEN_PUBLISHING_FILES.includes(oldFile));\n  }\n});`;
  source = replaceOnce(source, old, replacement, path);
  write(path, source);
}

// 13) Production-ready output no longer instructs a redundant manual export in the normal chain.
{
  const path = 'scripts/check-reel-production-ready.mjs';
  let source = read(path);
  const old = `console.log('  5. Post-Render-QA muss PASSED sein; erst dann entsteht die finale MP4.');\nconsole.log(\`  6. npm run reel:export -- ${'${target}'} <Final-MP4>\`);\nconsole.log('  Erst ein erfolgreicher Export erlaubt den Status FINAL_COMPLETE.');`;
  const replacement = `console.log('  5. Post-Render-QA muss PASSED sein; danach startet der kanonische Export automatisch.');\nconsole.log('  6. Playwright Visual QA + Audio/SFX-Prüfung müssen für die finale Freigabe dokumentiert sein.');\nconsole.log('  Ein direkter reel:export-Aufruf ist nur für kontrollierten Re-Export einer bereits geprüften finalen MP4.');\nconsole.log('  Erst ein erfolgreicher Auto-Export nach 06-export erlaubt den Status FINAL_COMPLETE.');`;
  source = replaceOnce(source, old, replacement, path);
  write(path, source);
}

// 14) Export/Cover validator now prevents a future regression to four exported captions.
{
  const path = 'scripts/validate-scene01-cover-export-contract.mjs';
  let source = read(path);
  const old = `  assert(source.includes("'caption-universal.txt': '04-caption/caption.txt'"), 'export-reel.mjs muss caption-universal.txt aus 04-caption/caption.txt bauen.');\n  assert(source.includes("firstScene.id !== 'scene-01'"), 'export-reel.mjs muss scene-01 als Coverquelle erzwingen.');`;
  const replacement = `  assert(source.includes("const captionQuelle = resolve(root, '04-caption/caption.txt')"), 'export-reel.mjs muss caption-universal.txt ausschließlich aus 04-caption/caption.txt bauen.');\n  for (const oldExport of ['caption-instagram.txt', 'caption-tiktok.txt', 'caption-facebook.txt', 'caption-snapchat.txt']) {\n    assert(!source.includes(oldExport), \`export-reel.mjs darf keine alte Plattform-Caption erzeugen: ${'${oldExport}'}\`);\n  }\n  assert(source.includes("firstScene.id !== 'scene-01'"), 'export-reel.mjs muss scene-01 als Coverquelle erzwingen.');`;
  source = replaceOnce(source, old, replacement, path);
  write(path, source);
}

// 15) Active-rule validator now explicitly protects the current publishing/QA integration.
{
  const path = 'scripts/validate-active-reel-rules.mjs';
  let source = read(path);
  source = replaceOnce(
    source,
    "  'docs/PHASE-3-COMPLETION-GATE.md',\n  'docs/SCENE-INDEX-SCHEMA.md',",
    "  'docs/PHASE-3-COMPLETION-GATE.md',\n  'docs/PLATFORM-PUBLISHING.md',\n  'docs/SCENE-INDEX-SCHEMA.md',",
    `${path} active docs`,
  );
  source = replaceOnce(
    source,
    "  ['docs/PHASE-3-COMPLETION-GATE.md', ['Post-Render', 'Caption-/Header-only', 'FINAL_COMPLETE']],",
    "  ['docs/PHASE-3-COMPLETION-GATE.md', ['Post-Render', 'Caption-/Header-only', 'FINAL_COMPLETE']],\n  ['docs/PLATFORM-PUBLISHING.md', ['caption-universal.txt', 'keine separaten Plattform-Captiondateien']],\n  ['reels/PRODUKTIONSSTANDARD.md', ['caption-universal.txt', 'Playwright Visual QA', 'Keine separaten Plattform-Captiondateien']],\n  ['CLAUDE.md', ['caption-universal.txt', 'Playwright Visual QA']],",
    `${path} required markers`,
  );
  write(path, source);
}

// 16) Remove the old branch-only validation workflow; normal PR CI + reel:validate are authoritative.
if (existsSync('.github/workflows/verify-current-reel-contract.yml')) rmSync('.github/workflows/verify-current-reel-contract.yml');

// Final local consistency assertions before tests even start.
const currentCaptionFiles = ['caption.txt', 'word-timings.json'].filter((f) => existsSync(`${reel}/04-caption/${f}`));
must(currentCaptionFiles.length === 2, 'Aktuelles Reel braucht caption.txt + word-timings.json.');
for (const oldFile of ['instagram-reels.txt', 'tiktok.txt', 'facebook-reels.txt', 'snapchat.txt']) {
  must(!existsSync(`${reel}/04-caption/${oldFile}`), `Alte Captiondatei blieb bestehen: ${oldFile}`);
}
const finalIndex = JSON.parse(read(`${reel}/03-szenen/scene-index.json`));
must(finalIndex.platformPublishing?.universalCaptionSource === '04-caption/caption.txt', 'scene-index universalCaptionSource falsch.');
must(finalIndex.platformPublishing?.universalCaptionForAllReelPlatforms === true, 'scene-index Universal-Caption-Flag fehlt.');
for (const oldKey of ['masterCaption', 'instagramReels', 'tiktok', 'facebookReels', 'snapchat']) {
  must(!Object.prototype.hasOwnProperty.call(finalIndex.platformPublishing ?? {}, oldKey), `scene-index enthält alten Publishing-Key: ${oldKey}`);
}

console.log('✓ Final integration migration applied.');
console.log('✓ Universal caption is now the single publishing truth.');
console.log('✓ Auto-render and manual export share scripts/export-reel.mjs.');
console.log('✓ User owns Flow images + main voiceover; SFX and Playwright QA are controlled Phase-3 support.');
