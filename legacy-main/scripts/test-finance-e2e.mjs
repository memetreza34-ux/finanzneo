#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {AssetManifest, Captions, ScenePlan, normalizeWords} from './lib/finance-contracts.mjs';
import {createFinanceTestPlan} from './lib/create-finance-test-plan.mjs';
import {financeProjectPaths, promptFileName, suggestedImageFileName} from './lib/finance-project-structure.mjs';
import {runCommand} from './lib/run-command.mjs';

const root = process.cwd();
const slug = `ci-finance-e2e-${process.pid}`;
const topic = `ETF-Gebühren E2E ${process.pid}`;
const publishDate = '2099-12-28';
const weekDir = path.join(root, 'channels/finanzneo/reels/2099-12-28_bis_2100-01-03');
const reelDir = path.join(weekDir, '01_ETF-Gebuehren-E2E-Fixture');
const runtimeDir = path.join(root, 'channels/finanzneo/public/reels', slug);
const historyFile = path.join(root, 'channels/finanzneo/engine/topic-history.json');
const historyBackup = fs.readFileSync(historyFile, 'utf8');
const keep = process.argv.includes('--keep');
const run = (command, args, options = {}) => runCommand(command, args, options);
const clean = () => {
  fs.writeFileSync(historyFile, historyBackup);
  if (!keep) {
    fs.rmSync(reelDir, {recursive: true, force: true});
    fs.rmSync(runtimeDir, {recursive: true, force: true});
    if (fs.existsSync(weekDir) && fs.readdirSync(weekDir).length === 0) fs.rmdirSync(weekDir);
  }
};
process.on('exit', clean);
fs.rmSync(reelDir, {recursive: true, force: true});
fs.rmSync(runtimeDir, {recursive: true, force: true});

run(process.execPath, ['scripts/new-finance-week-reel.mjs', slug, `--topic=${topic}`, '--title=ETF-Gebühren E2E Fixture', `--publish-date=${publishDate}`, '--selection-mode=evergreen', '--selection-reason=Technische End-to-End-Fixture für sämtliche FinanzNeo-Produktionsgates']);
const paths = financeProjectPaths(reelDir);
run(process.execPath, ['scripts/check-finance-project-folder.mjs', reelDir]);

const plan = createFinanceTestPlan({slug, title: 'ETF-Gebühren über 30 Jahre', topic});
plan.sources = [{
  id: 'fixture-source',
  title: 'Technische E2E-Rechenfixture',
  url: 'https://example.com/finance-e2e-fixture',
  claim: '0,5 Prozent von 10.000 Euro entsprechen 50 Euro.',
  publishedAt: '2099-12-27',
  accessedAt: '2099-12-27',
  claimIds: ['claim-fixture-cost'],
}];
const numberScene = plan.scenes.find((scene) => scene.id === 'zahl');
if (!numberScene) throw new Error('Zahl-Szene fehlt in der zentralen E2E-Fixture.');
numberScene.claimIds = ['claim-fixture-cost'];
plan.scriptText = plan.scenes.map((scene) => scene.voiceText).join(' ');
ScenePlan.parse(plan);
const voiceSegments = plan.scenes.map((scene) => scene.voiceText);

fs.writeFileSync(paths.scenePlan, JSON.stringify(plan, null, 2));
fs.writeFileSync(paths.scriptMarkdown, `# Skript — ETF-Gebühren über 30 Jahre\n\n${voiceSegments.map((text, index) => `## Szene ${index + 1}\n\n${text}`).join('\n\n')}\n`);
fs.writeFileSync(paths.voiceScript, `${plan.scriptText}\n`);
fs.writeFileSync(paths.voicePrompt, `Sprich seriös, klar und auf Deutsch. Betone die Hook als direkte Frage und den Payoff als klare Antwort.\n\n${plan.scriptText}\n`);
fs.writeFileSync(paths.sources, '# Quellen — ETF-Gebühren E2E\n\n## claim-fixture-cost\n\n- Aussage: 0,5 Prozent von 10.000 Euro entsprechen 50 Euro.\n- Quelle: technische Rechenfixture\n- URL: https://example.com/finance-e2e-fixture\n- Abgerufen: 2099-12-27\n');
fs.writeFileSync(paths.socialCaption, '# ETF-Kosten wirken länger als gedacht\n\n💬 Kommentiere KOSTEN und ich schicke dir kostenlos die ETF-Kosten-Checkliste per DM.\n\nSchon kleine laufende Gebühren reduzieren Kapital und mögliche zukünftige Rendite. Vergleiche deshalb Kostenquote, Sparrate und Laufzeit gemeinsam.\n\nWelche Kostenquote prüfst du zuerst?\n\n#Finanzen #ETF #Gebühren #Sparen #FinanzNeo\n');
fs.writeFileSync(paths.pdfContent, '# PDF-Inhalt — ETF-Kosten-Checkliste\n\n1. Kostenquote notieren.\n2. Sparrate und Laufzeit festlegen.\n3. Kosten in Euro berechnen.\n4. Produkte mit denselben Annahmen vergleichen.\n5. Keine Rendite garantieren.\n');
fs.writeFileSync(paths.storyboard, `# Storyboard — ETF-Gebühren E2E\n\n${plan.scenes.map((scene, index) => `${index + 1}. **${scene.id}** — ${scene.durationSec}s — ${scene.voiceText} — ${scene.layout}/${scene.variant}`).join('\n')}\n`);
fs.writeFileSync(paths.motionDesign, `# Einfacher Schnittplan — ETF-Gebühren E2E\n\n${plan.scenes.map((scene, index) => `${index + 1}. **${scene.id}** — Bild ab Frame 0 — Übergang: ${scene.transition} — Icon: ${scene.content.icon ?? 'kein Icon'} — Headline: ${scene.content.headline ?? ''}`).join('\n')}\n`);
const status = JSON.parse(fs.readFileSync(paths.status, 'utf8'));
status.title = plan.title;
status.productionMode = 'image-first-lite';
status.approvals = {topicSelected: true, scriptApproved: true, designAnchorApproved: true, assetsReviewed: false};
status.stage = 'script-approved';
fs.writeFileSync(paths.status, JSON.stringify(status, null, 2));

run(process.execPath, ['scripts/run-finance-script-qa.mjs', paths.scenePlan]);
run(process.execPath, ['scripts/run-finance-creative-qa.mjs', paths.scenePlan]);

// Es gibt aktuell kein automatisiertes Bildpromptsystem (Stil wird neu definiert).
// Die Fixture (createFinanceTestPlan) liefert scene.imagePrompt bereits als fertigen Text;
// hier wird daraus nur Manifest/Dateien gebaut, um die übrige Pipeline (Assets, Render, Export) zu prüfen.
const isImageScene = (scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image';
const imageScenes = plan.scenes.filter(isImageScene);
const promptEntries = [];
const updatedScenes = plan.scenes.map((scene) => {
  if (!isImageScene(scene)) return scene;
  const order = promptEntries.length;
  const prompt = scene.imagePrompt;
  const promptFile = promptFileName(order, scene.id);
  const imageFile = suggestedImageFileName(order, scene.id);
  const imageAssetId = `images-${imageFile.replace(/\.[^.]+$/, '')}`;
  const expectedImageFile = path.relative(reelDir, path.join(paths.imagesDir, imageFile)).split(path.sep).join('/');
  promptEntries.push({order: order + 1, sceneId: scene.id, spokenSentence: scene.voiceText, promptFile, expectedImageFile, imageAssetId, prompt});
  return {...scene, assetIds: [...new Set([...(scene.assetIds ?? []), imageAssetId])]};
});
const planWithPrompts = {...plan, scenes: updatedScenes};
ScenePlan.parse(planWithPrompts);
fs.mkdirSync(paths.imagePromptsDir, {recursive: true});
fs.mkdirSync(paths.imagesDir, {recursive: true});
for (const entry of promptEntries) fs.writeFileSync(path.join(paths.imagePromptsDir, entry.promptFile), `${entry.prompt}\n`);
fs.writeFileSync(paths.scenePlan, JSON.stringify(planWithPrompts, null, 2));
fs.writeFileSync(paths.imagePromptManifest, JSON.stringify({version: 'finance-v1', promptSystem: 'e2e-fixture', styleVersion: 'none', slug: planWithPrompts.slug, generatedAt: new Date().toISOString(), prompts: promptEntries.map(({prompt, ...entry}) => entry)}, null, 2));
const promptSections = promptEntries.map((entry) => `## ${entry.order}. ${entry.sceneId}\n\n**Promptdatei:** \`prompts/${entry.promptFile}\`  \n**Bild hier ablegen:** \`${entry.expectedImageFile}\`\n\n\`\`\`text\n${entry.prompt}\n\`\`\``).join('\n\n');
fs.writeFileSync(paths.imagePromptIndex, `# Bildprompts — ${planWithPrompts.title}\n\n${promptSections}\n`);

run(process.execPath, ['scripts/run-finance-with-folder-check.mjs', 'scripts/check-finance-content-package.mjs', reelDir]);
const builtPlan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const promptManifest = JSON.parse(fs.readFileSync(paths.imagePromptManifest, 'utf8'));
if (promptManifest.prompts.length !== 8) throw new Error('E2E erwartet acht einzelne Bildprompts.');
if (builtPlan.scenes.some((scene) => scene.transition !== 'cut')) throw new Error('E2E erwartet ausschließlich harte Schnitte.');
if (builtPlan.scenes.some((scene) => scene.visualPhases.length > 1)) throw new Error('E2E erwartet höchstens einen Bildzustand pro Szene.');

const totalDuration = builtPlan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
run('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', String(totalDuration), '-c:a', 'pcm_s24le', paths.voiceoverFinal]);
const captions = [];
let cursorMs = 0;
for (const scene of builtPlan.scenes) {
  const sceneWords = normalizeWords(scene.voiceText);
  const sceneDurationMs = scene.durationSec * 1000;
  sceneWords.forEach((word, index) => captions.push({text: word, startMs: cursorMs + (sceneDurationMs * index) / sceneWords.length, endMs: cursorMs + (sceneDurationMs * (index + 1)) / sceneWords.length, timestampMs: null, confidence: 1}));
  cursorMs += sceneDurationMs;
}
Captions.parse(captions);
fs.writeFileSync(paths.captionsFinal, JSON.stringify(captions, null, 2));
const colors = [{r: 45, g: 76, b: 55, alpha: 1}, {r: 55, g: 88, b: 64, alpha: 1}, {r: 38, g: 68, b: 49, alpha: 1}];
for (const [index, entry] of promptManifest.prompts.entries()) await sharp({create: {width: 1080, height: 1920, channels: 4, background: colors[index % colors.length]}}).png().toFile(path.join(reelDir, entry.expectedImageFile));
fs.writeFileSync(path.join(paths.pdfDir, 'etf-gebuehren-checkliste.pdf'), '%PDF-1.4\n% Finance E2E fixture\n1 0 obj<</Type/Catalog>>endobj\n%%EOF\n');

run(process.execPath, ['scripts/run-finance-with-folder-check.mjs', 'scripts/ingest-finance-assets.mjs', reelDir]);
run(process.execPath, ['scripts/align-finance-plan.mjs', paths.scenePlan, paths.captionsFinal, paths.voiceoverFinal]);
const finalStatus = JSON.parse(fs.readFileSync(paths.status, 'utf8'));
finalStatus.approvals.assetsReviewed = true;
fs.writeFileSync(paths.status, JSON.stringify(finalStatus, null, 2));
run(process.execPath, ['scripts/run-finance-with-folder-check.mjs', 'scripts/check-finance-readiness.mjs', reelDir]);
const readyReport = JSON.parse(fs.readFileSync(paths.readyReport, 'utf8'));
if (readyReport.ready !== true) throw new Error('E2E-Ready-Bericht ist nicht grün.');

const alignedPlan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const manifest = AssetManifest.parse(JSON.parse(fs.readFileSync(paths.manifest, 'utf8')));
if (manifest.assets.filter((asset) => asset.kind === 'image').length !== 8) throw new Error('E2E erwartet acht analysierte Bilder.');
run(process.execPath, ['scripts/stage-finance-runtime-assets.mjs', reelDir]);
const propsFile = path.join(os.tmpdir(), `finanzneo-e2e-props-${process.pid}.json`);
const frameFile = path.join(os.tmpdir(), `finanzneo-e2e-frame-${process.pid}.png`);
fs.writeFileSync(propsFile, JSON.stringify({plan: alignedPlan, manifest, captions, publicBasePath: `reels/${slug}`, debug: false}));
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
try {
  run(npx, ['remotion', 'still', 'src/index.ts', 'FinanzNeo', frameFile, '--frame=0', `--props=${propsFile}`], {cwd: path.join(root, 'channels/finanzneo')});
  if (!fs.existsSync(frameFile) || fs.statSync(frameFile).size === 0) throw new Error('Kontrollframe wurde nicht erzeugt.');
} finally {
  fs.rmSync(propsFile, {force: true});
  fs.rmSync(frameFile, {force: true});
}

const dummyVideo = path.join(paths.videoDir, 'e2e-final.mp4');
fs.writeFileSync(dummyVideo, 'non-empty-e2e-video-fixture');
const renderQaDir = path.join(paths.videoDir, 'e2e-final-qa');
fs.mkdirSync(renderQaDir, {recursive: true});
fs.writeFileSync(path.join(renderQaDir, 'report.json'), JSON.stringify({version: 'finance-render-qa-v1', video: path.resolve(dummyVideo), passed: true, generatedAt: new Date().toISOString(), findings: []}, null, 2));
run(process.execPath, ['scripts/export-finance-deliverables.mjs', reelDir, `--video=${dummyVideo}`]);
for (const file of [path.join(paths.exportDir, `${slug}.mp4`), path.join(paths.exportDir, 'voiceover-final.captions.json'), path.join(paths.exportDir, 'voiceover-final.srt'), path.join(paths.exportDir, 'voiceover-final.vtt'), path.join(paths.exportDir, 'social-caption.md'), path.join(paths.exportDir, 'social-caption.txt'), path.join(paths.exportDir, 'etf-gebuehren-checkliste.pdf'), path.join(paths.exportDir, 'export-manifest.json')]) if (!fs.existsSync(file) || fs.statSync(file).size === 0) throw new Error(`Exportdatei fehlt: ${file}`);
console.log('✓ FinanzNeo-End-to-End-Test bestanden: Scaffold → neutrale Bildprompts (kein Stilsystem) → Assets → READY → Kontrollframe → Export.');
