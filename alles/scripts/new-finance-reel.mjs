#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {createFinanceScenePlanTemplate} from './lib/create-finance-scene-plan-template.mjs';
import {
  ensureFinanceProjectStructure,
  FINANCE_STRUCTURE_VERSION,
  suggestedImageFileName,
} from './lib/finance-project-structure.mjs';

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

const slug = slugArg.trim().toLocaleLowerCase('de-DE').replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-+|-+$/g, '');
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

const technicalRoot = process.cwd();
const repositoryRoot = path.resolve(technicalRoot, '..');
const reelsRoot = path.resolve(process.env.FINANCE_REELS_ROOT ?? path.join(repositoryRoot, 'reels'));
const target = path.join(reelsRoot, slug);
const historyFile = path.resolve(process.env.FINANCE_TOPIC_HISTORY_FILE ?? path.join(technicalRoot, 'channels', 'finanzneo', 'engine', 'topic-history.json'));
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
  fs.writeFileSync(paths.scriptMarkdown, `# Skript — ${title}\n\n**Thema:** ${topic}\n\nAlle FINANCE_TODO-Felder müssen im selben Arbeitsdurchlauf durch natürliche, konkrete und belegbare Inhalte ersetzt werden.\n\n${plan.scenes.map((scene, index) => `## ${index + 1}. ${scene.id}\n\n${scene.voiceText}`).join('\n\n')}\n`);
  fs.writeFileSync(paths.voiceScript, `${plan.scriptText}\n`);
  fs.writeFileSync(paths.voicePrompt, 'NOCH NICHT FREIGEGEBEN\n\nFINANCE_TODO_FINAL_SCRIPT\n');

  const sceneIndex = {
    version: 2,
    sceneCount: plan.scenes.length,
    storageRule: 'Bilddatei und bildprompt.txt liegen im selben Szenenordner.',
    scenes: plan.scenes.map((scene, index) => {
      const number = String(index + 1).padStart(2, '0');
      const sceneFolder = `EINZELNE-SZENEN/scene-${number}`;
      const type = scene.type ?? scene.mode ?? 'image';
      return {
        id: `scene-${number}`,
        sourceId: scene.id,
        type,
        instructions: sceneFolder,
        ...(type === 'animation'
          ? {}
          : {
              prompt: `${sceneFolder}/bildprompt.txt`,
              asset: `${sceneFolder}/${suggestedImageFileName(index, scene.id)}`,
            }),
      };
    }),
  };
  fs.writeFileSync(paths.sceneIndex, JSON.stringify(sceneIndex, null, 2));

  for (let index = 0; index < plan.scenes.length; index += 1) {
    const scene = plan.scenes[index];
    const sceneNumber = String(index + 1).padStart(2, '0');
    const sceneDir = path.join(paths.individualScenesDir, `scene-${sceneNumber}`);
    const type = scene.type ?? scene.mode ?? 'image';
    fs.mkdirSync(sceneDir, {recursive: true});
    const imageFile = suggestedImageFileName(index, scene.id);
    fs.writeFileSync(path.join(sceneDir, 'szene.md'), `# Szene ${sceneNumber}\n\n**Plan-ID:** ${scene.id}\n\n**Typ:** ${type}\n\n**Voiceover:** ${scene.voiceText}\n\n${type === 'animation' ? '**Animationsdatei:** `animation.md`' : `**Bildprompt:** \`bildprompt.txt\`\n\n**Bilddatei:** \`${imageFile}\``}\n\n<!-- FINANCE_TODO_SCENE_DETAILS -->\n`);
    if (type !== 'animation') {
      fs.writeFileSync(path.join(sceneDir, 'bildprompt.txt'), 'FINANCE_TODO_COMPLETE_IMAGE_PROMPT\n');
    } else {
      fs.writeFileSync(path.join(sceneDir, 'animation.md'), '# Remotion-Animation\n\nFINANCE_TODO_COMPLETE_ANIMATION_SPEC\n');
    }
  }

  const now = new Date().toISOString();
  const relativeTarget = path.relative(repositoryRoot, target).split(path.sep).join('/');
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
      scenePlan: 'timeline/scene-plan.json',
      sources: '05-review/quellen.md',
      voiceScript: '01-voice-script/script-fliesstext.txt',
      voiceoverPrompt: '01-voice-script/voiceover-anweisung.txt',
      voiceoverFinal: '01-voice-script/voiceover-final.wav',
      imagePromptIndex: '03-szenen/alle-bildprompts.txt',
      sceneIndex: '03-szenen/scene-index.json',
      imageStorageRule: 'Jedes Bild liegt direkt neben dem zugehörigen bildprompt.txt.',
      imagePromptManifest: 'timeline/prompt-manifest.json',
      captionsFinal: '04-caption/voiceover-final.captions.json',
      socialCaption: '04-caption/social-caption.md',
      manifest: 'timeline/asset-manifest.json',
      videoDirectory: '06-video',
      storyboard: 'timeline/storyboard.md',
      motionDesign: 'timeline/motion-design.md',
      codexPackage: 'timeline/codex-reel-package.json'
    },
  };
  fs.writeFileSync(paths.status, JSON.stringify(status, null, 2));

  fs.writeFileSync(path.join(target, 'README.md'), `# ${title}\n\n**Thema:** ${topic}\n\n## Produktionsstruktur\n\n- \`00-cover/\`\n- \`01-voice-script/\` — Skript und \`voiceover-final.wav\`\n- \`03-szenen/\` — Prompt und Bild gemeinsam pro Szenenordner\n- \`04-caption/\`\n- \`05-review/\`\n- \`06-video/\`\n- \`render/\`\n- \`timeline/\`\n\nDas Voiceover gehört direkt nach \`01-voice-script/voiceover-final.wav\`. Jede Bilddatei gehört in denselben Ordner wie ihr \`bildprompt.txt\`. Es werden weder \`02-audio/\` noch \`BILDER-HIER-EINFUEGEN/\` angelegt.\n`);

  history.topics = [...(history.topics ?? []), {slug, topic, status: 'reserved', createdAt: now, projectPath: relativeTarget}];
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log(`✓ Finance-Projekt atomar vorbereitet: ${relativeTarget}`);
  console.log('  Medienablage: Voiceover beim Skript; jedes Bild direkt beim Szenenprompt.');
} catch (error) {
  if (created) fs.rmSync(target, {recursive: true, force: true});
  fs.writeFileSync(historyFile, historyOriginal);
  throw error;
}
