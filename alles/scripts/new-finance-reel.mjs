#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {createFinanceScenePlanTemplate} from './lib/create-finance-scene-plan-template.mjs';
import {
  ensureFinanceProjectStructure,
  FINANCE_STRUCTURE_VERSION,
  imageDirectoryForScene,
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
    version: 3,
    sceneCount: plan.scenes.length,
    storageRule: 'Bei jeder Bildszene liegt genau eine Bilddatei beliebigen Namens im passenden scene-XX-Ordner. Der Ordner bestimmt die Szenennummer.',
    imageSelection: 'single-supported-file',
    supportedImageExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
    scenes: plan.scenes.map((scene, index) => {
      const number = String(index + 1).padStart(2, '0');
      const directory = `EINZELNE-SZENEN/scene-${number}`;
      const type = scene.type ?? scene.mode ?? 'image';
      return {
        id: `scene-${number}`,
        sourceId: scene.id,
        type,
        instructions: directory,
        ...(type === 'animation'
          ? {}
          : {
              directory,
              selection: 'single-supported-file',
              prompt: `${directory}/bildprompt.txt`,
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
    fs.writeFileSync(path.join(sceneDir, 'szene.md'), `# Szene ${sceneNumber}\n\n**Plan-ID:** ${scene.id}\n\n**Typ:** ${type}\n\n**Voiceover:** ${scene.voiceText}\n\n${type === 'animation'
      ? '**Animationsdatei:** `animation.md`'
      : '**Bildprompt:** `bildprompt.txt`\n\n**Bilddatei:** Lege genau eine Bilddatei beliebigen Namens in diesen Ordner. Der Ordner bestimmt die Szene.'}\n\n<!-- FINANCE_TODO_SCENE_DETAILS -->\n`);
    if (type !== 'animation') {
      fs.writeFileSync(path.join(sceneDir, 'bildprompt.txt'), 'FINANCE_TODO_COMPLETE_IMAGE_PROMPT\n');
    } else {
      fs.writeFileSync(path.join(sceneDir, 'animation.md'), '# Remotion-Animation\n\nFINANCE_TODO_COMPLETE_ANIMATION_SPEC\n');
    }
  }

  const animationScenes = plan.scenes
    .map((scene, index) => ({scene, index}))
    .filter(({scene}) => (scene.type ?? scene.mode ?? 'image') === 'animation');
  const prebuiltSourceRoot = `channels/finanzneo/src/reels/${slug}`;
  const buildManifest = {
    version: 'finanzneo-reel-build-v1',
    slug,
    status: 'awaiting-prebuild',
    codexAnimationCodingRequired: false,
    expectedSceneCount: plan.scenes.length,
    composition: {
      id: 'FINANCE_TODO_COMPOSITION_ID',
      entryPoint: `${prebuiltSourceRoot}/index.ts`,
      sourceRoot: prebuiltSourceRoot,
    },
    runtime: {
      prepareScript: 'scripts/prepare-finance-reel-runtime.mjs',
      propsFile: 'render/reel-render-props.json',
      manifestFile: 'timeline/runtime-manifest.json',
    },
    expectedSourceFiles: [
      `${prebuiltSourceRoot}/index.ts`,
      `${prebuiltSourceRoot}/Root.tsx`,
      `${prebuiltSourceRoot}/Reel.tsx`,
      `${prebuiltSourceRoot}/PrebuiltAnimations.tsx`,
    ],
    animations: animationScenes.map(({scene, index}) => ({
      sceneId: scene.id ?? `scene-${String(index + 1).padStart(2, '0')}`,
      component: 'FINANCE_TODO_PREBUILT_COMPONENT',
      source: `${prebuiltSourceRoot}/PrebuiltAnimations.tsx`,
      timing: 'relative-to-transcript-scene-duration',
      editableByCodex: false,
    })),
    additionalChecks: [],
    outputs: {
      video: '06-video/final-reel.mp4',
      cover: '00-cover/cover.png',
      contactSheet: '05-review/contact-sheet.png',
      qaReport: '05-review/codex-render-qa.json',
      buildReport: '05-review/build-report.json',
      qaDirectory: '05-review/render-qa',
    },
    prebuiltApproval: {
      approvedByPlanningAssistant: false,
      animationsImplemented: false,
      compositionImplemented: false,
      approvedAt: null,
    },
    remainingHumanInput: [
      'genau eine Audiodatei in 02-audio',
      'genau ein Bild in jedem erwarteten Bildszenenordner',
      'manuelle visuelle Freigabe nach dem Render',
    ],
  };
  fs.writeFileSync(path.join(paths.timelineDir, 'reel-build-manifest.json'), `${JSON.stringify(buildManifest, null, 2)}\n`);

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
    stage: 'planning-awaiting-prebuilt-composition',
    approvals: {topicSelected: true, scriptApproved: false, designAnchorApproved: false, assetsReviewed: false},
    required: {
      scenePlan: 'timeline/scene-plan.json',
      sources: '05-review/quellen.md',
      voiceScript: '01-voice-script/script-fliesstext.txt',
      voiceoverPrompt: '01-voice-script/voiceover-anweisung.txt',
      voiceoverDirectory: '02-audio',
      voiceoverSelection: 'single-supported-file',
      imagePromptIndex: '03-szenen/alle-bildprompts.txt',
      sceneIndex: '03-szenen/scene-index.json',
      imageStorageRule: 'Jede Bildszene enthält genau eine Bilddatei beliebigen Namens im passenden scene-XX-Ordner.',
      imagePromptManifest: 'timeline/prompt-manifest.json',
      captionsFinal: '04-caption/voiceover-final.captions.json',
      socialCaption: '04-caption/social-caption.md',
      manifest: 'timeline/asset-manifest.json',
      reelBuildManifest: 'timeline/reel-build-manifest.json',
      videoDirectory: '06-video',
      storyboard: 'timeline/storyboard.md',
      motionDesign: 'timeline/motion-design.md',
      codexPackage: 'timeline/codex-reel-package.json'
    },
    implementation: {
      prebuiltAnimationsImplemented: false,
      prebuiltCompositionImplemented: false,
      codexAnimationCodingRequired: false,
      generalFutureReelBuilderAvailable: true,
      renderCompleted: false,
      manualVisualQaCompleted: false,
      merged: false,
    },
  };
  fs.writeFileSync(paths.status, JSON.stringify(status, null, 2));

  fs.writeFileSync(path.join(target, 'AGENTS.md'), `# Allgemeiner FinanzNeo-Reel-Build\n\nDieses Projekt verwendet den allgemeinen Buildvertrag in \`timeline/reel-build-manifest.json\`.\n\n## Strikte Regel\n\nCodex darf Animationen und Composition nicht selbst entwerfen oder programmieren. Solange das Manifest \`status: awaiting-prebuild\` enthält, muss Codex stoppen und melden, dass die kreative Vorarbeit noch nicht abgeschlossen ist.\n\nNach vollständiger Vorprogrammierung wird das Manifest auf \`prebuilt-ready\` gesetzt. Dann soll Codex ausschließlich aus \`alles/\` ausführen:\n\n\`\`\`bash\nnpm run finance:reel:build -- <projektordner>\n\`\`\`\n\nNur konkrete technische Fehler minimal beheben. Keine kreative Neuentwicklung, kein Merge und keine automatische Nutzerfreigabe.\n`);

  fs.writeFileSync(path.join(target, 'README.md'), `# ${title}\n\n**Thema:** ${topic}\n\n## Produktionsstruktur\n\n- \`00-cover/\`\n- \`01-voice-script/\` — Skript und Voiceover-Anweisung\n- \`02-audio/\` — genau eine Audiodatei, Dateiname egal\n- \`03-szenen/\` — pro Bildszene genau eine Bilddatei im passenden \`scene-XX\`-Ordner, Dateiname egal\n- \`04-caption/\`\n- \`05-review/\`\n- \`06-video/\`\n- \`render/\`\n- \`timeline/\`\n\n## Allgemeiner Zukunfts-Builder\n\nJedes Reel besitzt ab Erstellung \`timeline/reel-build-manifest.json\`. Zuerst werden Composition und individuelle Animationen vollständig vorprogrammiert. Danach wird der Status auf \`prebuilt-ready\` gesetzt und Codex führt nur noch aus:\n\n\`\`\`bash\nnpm run finance:reel:build -- <projektordner>\n\`\`\`\n\nCodex darf die Animationen nicht selbst neu planen. Der Ordner bestimmt die Medienzuordnung. Bei null oder mehreren passenden Dateien stoppt die Prüfung.\n`);

  history.topics = [...(history.topics ?? []), {slug, topic, status: 'reserved', createdAt: now, projectPath: relativeTarget}];
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log(`✓ Finance-Projekt atomar vorbereitet: ${relativeTarget}`);
  console.log('  Allgemeiner Zukunfts-Builder: timeline/reel-build-manifest.json');
  console.log('  Status: awaiting-prebuild — Codex darf noch keine Animation programmieren.');
  console.log('  Medienablage: eine beliebig benannte Audiodatei in 02-audio; eine beliebig benannte Bilddatei pro Bildszenenordner.');
  console.log(`  Erstes Bildverzeichnis: ${imageDirectoryForScene(0)}`);
} catch (error) {
  if (created) fs.rmSync(target, {recursive: true, force: true});
  fs.writeFileSync(historyFile, historyOriginal);
  throw error;
}
