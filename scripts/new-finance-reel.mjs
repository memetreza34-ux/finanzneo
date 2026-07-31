#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {createFinanceScenePlanTemplate} from './lib/create-finance-scene-plan-template.mjs';
import {ensureFinanceProjectStructure, FINANCE_STRUCTURE_VERSION} from './lib/finance-project-structure.mjs';

const args = process.argv.slice(2);
const slugArg = args.find((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : undefined;
};
if (!slugArg || !option('topic')) {
  console.error('Nutzung: node scripts/new-finance-reel.mjs <slug> --topic="Neues Thema" [--title="Arbeitstitel"]');
  process.exit(1);
}

const slug = slugArg.trim().toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-+|-+$/g, '');
if (!slug) throw new Error('Der Slug ist leer oder ungültig.');
const topic = option('topic');
const title = option('title') ?? slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
const normalizeTopic = (value) => value.toLocaleLowerCase('de-DE').replace(/[^a-z0-9äöüß]+/gi, ' ').trim().replace(/\s+/g, ' ');
const stopwords = new Set(['und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'einer', 'von', 'für', 'mit', 'bei', 'im', 'in', 'zu']);
const tokens = (value) => new Set(normalizeTopic(value).split(' ').filter((token) => token && !stopwords.has(token)));
const similarity = (left, right) => {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  const smaller = Math.min(a.size, b.size);
  return smaller >= 2 && intersection === smaller ? 1 : intersection / union;
};

const root = process.cwd();
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(root, 'channels', 'finanzneo', 'reels'));
const target = path.join(reelsRoot, slug);
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(root, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
if (fs.existsSync(target)) throw new Error(`Reel-Projekt "${slug}" existiert bereits.`);
if (!fs.existsSync(historyFile)) throw new Error(`Themenregister fehlt: ${historyFile}`);

const historyOriginal = fs.readFileSync(historyFile, 'utf8');
const history = JSON.parse(historyOriginal);
const normalizedTopic = normalizeTopic(topic);
const duplicate = (history.topics ?? []).find((entry) => entry.slug === slug || normalizeTopic(entry.topic ?? '') === normalizedTopic || similarity(entry.topic ?? '', topic) >= 0.72);
if (duplicate) throw new Error(`Thema bereits verwendet, reserviert oder zu ähnlich: "${duplicate.topic}" (${duplicate.slug}).`);

let created = false;
try {
  fs.mkdirSync(target, {recursive: false});
  created = true;
  const plan = createFinanceScenePlanTemplate({slug, title, topic});
  ScenePlan.parse(plan);
  const paths = ensureFinanceProjectStructure(target, {title, topic});
  fs.writeFileSync(paths.scenePlan, JSON.stringify(plan, null, 2));
  fs.writeFileSync(paths.scriptMarkdown, `# Skript — ${title}\n\n**Thema:** ${topic}\n\nAlle FINANCE_TODO-Felder müssen im selben Arbeitsdurchlauf durch natürliche, konkrete und belegbare Inhalte ersetzt werden. Vor der Bildphase müssen Skript-QA und Content-Ready grün sein.\n\n${plan.scenes.map((scene, index) => `## ${index + 1}. ${scene.id}\n\n${scene.voiceText}`).join('\n\n')}\n`);
  fs.writeFileSync(paths.voiceScript, `${plan.scriptText}\n`);
  fs.writeFileSync(paths.voicePrompt, 'NOCH NICHT FREIGEGEBEN\n\nFINANCE_TODO_FINAL_SCRIPT\n');

  const now = new Date().toISOString();
  const relativeTarget = path.relative(root, target).split(path.sep).join('/');
  const status = {
    version: 'finance-v1',
    folderStructureVersion: FINANCE_STRUCTURE_VERSION,
    slug,
    topic,
    title,
    createdAt: now,
    projectPath: relativeTarget,
    stage: 'planning',
    approvals: {topicSelected: true, scriptApproved: false, designAnchorApproved: false, assetsReviewed: false},
    required: {
      scenePlan: '06-projektdateien/scene-plan.json',
      sources: '06-projektdateien/sources.md',
      voiceScript: '01-script-audio/script-fliesstext.txt',
      voiceoverPrompt: '01-script-audio/voiceover.txt',
      imagePromptIndex: '02-bilder/bildprompts.md',
      imagePromptManifest: '06-projektdateien/prompt-manifest.json',
      voiceoverFinal: '01-script-audio/audio/voiceover-final.wav',
      captionsFinal: '03-caption/voiceover-final.captions.json',
      socialCaption: '03-caption/social-caption.md',
      manifest: '06-projektdateien/asset-manifest.json',
      pdfDirectory: '04-pdf',
      exportDirectory: '05-export',
      storyboard: '06-projektdateien/storyboard.md',
      motionDesign: '06-projektdateien/motion-design.md',
    },
  };
  fs.writeFileSync(paths.status, JSON.stringify(status, null, 2));

  const readme = `# ${title}\n\n**Thema:** ${topic}\n\n## Produktionsstruktur\n\n1. \`01-script-audio/\` — Skript, Voiceover-Text und Audio\n2. \`02-bilder/\` — Bildprompt-Übersicht, einzelne Prompts und Bilder\n3. \`03-caption/\` — Wort-Untertitel und Social-Media-Caption\n4. \`04-pdf/\` — PDF-Inhalt und fertige PDF\n5. \`05-export/\` — finales MP4, Caption, Untertitel und PDF\n6. \`06-projektdateien/\` — Storyboard, Motion Design und technische Dateien\n\n## Verbindlich\n\n- Alle \`FINANCE_TODO\`-Felder vollständig ersetzen.\n- Für jede Bildszene konkrete reale Objekte, räumlichen Aufbau und Ursache → Wirkung festlegen.\n- Kein Text, keine Labels und keine Zahlen im generierten Bild.\n- Audio exakt als \`01-script-audio/audio/voiceover-final.wav\`.\n- Vor Render: \`npm run finance:content-ready -- <projektordner>\` und \`npm run finance:ready -- <projektordner>\`.\n`;
  fs.writeFileSync(path.join(target, 'README.md'), readme);

  history.topics = [...(history.topics ?? []), {slug, topic, status: 'reserved', createdAt: now, projectPath: relativeTarget}];
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log(`✓ Finance-Projekt atomar vorbereitet: ${relativeTarget}`);
  console.log('  Erst alle Skript-, Quellen-, Bildbrief- und Content-Felder ausarbeiten; danach Freigaben setzen.');
} catch (error) {
  if (created) fs.rmSync(target, {recursive: true, force: true});
  fs.writeFileSync(historyFile, historyOriginal);
  throw error;
}
