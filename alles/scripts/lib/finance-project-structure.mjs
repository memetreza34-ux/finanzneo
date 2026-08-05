import fs from 'node:fs';
import path from 'node:path';

export const FINANCE_STRUCTURE_VERSION = 5;

export const financeProjectPaths = (reelDir) => ({
  projectDir: reelDir,

  coverDir: path.join(reelDir, '00-cover'),
  coverText: path.join(reelDir, '00-cover', 'cover.txt'),

  voiceScriptDir: path.join(reelDir, '01-voice-script'),
  scriptAudioDir: path.join(reelDir, '01-voice-script'),
  scriptMarkdown: path.join(reelDir, '01-voice-script', 'script.md'),
  voiceScript: path.join(reelDir, '01-voice-script', 'script-fliesstext.txt'),
  voicePrompt: path.join(reelDir, '01-voice-script', 'voiceover-anweisung.txt'),

  audioDir: path.join(reelDir, '02-audio'),
  voiceoverFinal: path.join(reelDir, '02-audio', 'voiceover-final.wav'),
  sfxDir: path.join(reelDir, '02-audio', 'sfx'),

  scenesDir: path.join(reelDir, '03-szenen'),
  imagesSectionDir: path.join(reelDir, '03-szenen'),
  allImagePrompts: path.join(reelDir, '03-szenen', 'alle-bildprompts.txt'),
  imagePromptIndex: path.join(reelDir, '03-szenen', 'alle-bildprompts.txt'),
  imageDropDir: path.join(reelDir, '03-szenen', 'BILDER-HIER-EINFUEGEN'),
  imagesDir: path.join(reelDir, '03-szenen', 'BILDER-HIER-EINFUEGEN'),
  individualScenesDir: path.join(reelDir, '03-szenen', 'EINZELNE-SZENEN'),
  imagePromptsDir: path.join(reelDir, '03-szenen', 'EINZELNE-SZENEN'),
  sceneIndex: path.join(reelDir, '03-szenen', 'scene-index.json'),

  captionsDir: path.join(reelDir, '04-caption'),
  captionsFinal: path.join(reelDir, '04-caption', 'voiceover-final.captions.json'),
  socialCaption: path.join(reelDir, '04-caption', 'social-caption.md'),

  reviewDir: path.join(reelDir, '05-review'),
  status: path.join(reelDir, '05-review', 'production-status.json'),
  sources: path.join(reelDir, '05-review', 'quellen.md'),
  pdfDir: path.join(reelDir, '05-review'),
  pdfContent: path.join(reelDir, '05-review', 'fachlicher-inhalt.md'),
  readyReport: path.join(reelDir, '05-review', 'ready-report.json'),
  qaReport: path.join(reelDir, '05-review', 'qa-report.json'),

  finalVideoDir: path.join(reelDir, '06-video'),
  exportDir: path.join(reelDir, '06-video'),
  exportVideoDir: path.join(reelDir, '06-video'),
  exportCaptionsDir: path.join(reelDir, '06-video'),
  exportPdfDir: path.join(reelDir, '06-video'),

  renderDir: path.join(reelDir, 'render'),
  videoDir: path.join(reelDir, 'render'),

  timelineDir: path.join(reelDir, 'timeline'),
  projectFilesDir: path.join(reelDir, 'timeline'),
  scenePlan: path.join(reelDir, 'timeline', 'scene-plan.json'),
  codexPackage: path.join(reelDir, 'timeline', 'codex-reel-package.json'),
  storyboard: path.join(reelDir, 'timeline', 'storyboard.md'),
  motionDesign: path.join(reelDir, 'timeline', 'motion-design.md'),
  imagePromptManifest: path.join(reelDir, 'timeline', 'prompt-manifest.json'),
  manifest: path.join(reelDir, 'timeline', 'asset-manifest.json'),
  dataDir: path.join(reelDir, 'timeline', 'data'),
});

export const financeRequiredDirectories = (reelDir) => {
  const p = financeProjectPaths(reelDir);
  return [
    reelDir,
    p.coverDir,
    p.voiceScriptDir,
    p.audioDir,
    p.sfxDir,
    p.scenesDir,
    p.imageDropDir,
    p.individualScenesDir,
    p.captionsDir,
    p.reviewDir,
    p.finalVideoDir,
    p.renderDir,
    p.timelineDir,
    p.dataDir,
  ];
};

const writeIfMissing = (file, content) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
};

const moveFile = (from, to) => {
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) return;
  fs.mkdirSync(path.dirname(to), {recursive: true});
  if (!fs.existsSync(to)) {
    fs.renameSync(from, to);
    return;
  }
  const extension = path.extname(to);
  const stem = extension ? to.slice(0, -extension.length) : to;
  let backup = `${stem}-alt${extension}`;
  let counter = 2;
  while (fs.existsSync(backup)) {
    backup = `${stem}-alt-${counter}${extension}`;
    counter += 1;
  }
  fs.renameSync(from, backup);
};

const moveDirectoryContents = (from, to, filter = () => true) => {
  if (!fs.existsSync(from) || !fs.statSync(from).isDirectory()) return;
  fs.mkdirSync(to, {recursive: true});
  for (const entry of fs.readdirSync(from, {withFileTypes: true})) {
    if (!filter(entry)) continue;
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) moveDirectoryContents(source, target);
    else moveFile(source, target);
  }
  if (fs.existsSync(from) && fs.readdirSync(from).length === 0) fs.rmdirSync(from);
};

export const sanitizeSceneId = (value) => String(value ?? 'szene')
  .toLocaleLowerCase('de-DE')
  .replace(/[^a-z0-9äöüß]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'szene';

const transliterateGerman = (value) => String(value ?? '')
  .replace(/Ä/g, 'Ae')
  .replace(/Ö/g, 'Oe')
  .replace(/Ü/g, 'Ue')
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/ß/g, 'ss');

export const sanitizeReelFolderTitle = (value) => transliterateGerman(value ?? 'reel')
  .trim()
  .toLocaleLowerCase('de-DE')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'reel';

export const promptFileName = (index, sceneId) => `scene-${String(index + 1).padStart(2, '0')}-${sanitizeSceneId(sceneId)}.txt`;
export const suggestedImageFileName = (index, sceneId) => `scene-${String(index + 1).padStart(2, '0')}-${sanitizeSceneId(sceneId)}.png`;

export const planRequiresPdf = (plan) => {
  if (!plan) return false;
  const text = [
    plan.scriptText,
    plan.payoff,
    ...((plan.scenes ?? []).flatMap((scene) => [scene.voiceText, scene.content?.headline, scene.content?.body])),
  ].filter(Boolean).join(' ').toLocaleLowerCase('de-DE');
  return /\b(pdf|checkliste|guide|vorlage|e-?book|planer|leitfaden)\b/.test(text);
};

export const isValidPdfFile = (file) => {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.statSync(file).size < 5) return false;
  const descriptor = fs.openSync(file, 'r');
  try {
    const header = Buffer.alloc(5);
    const bytesRead = fs.readSync(descriptor, header, 0, header.length, 0);
    return bytesRead === 5 && header.toString('ascii') === '%PDF-';
  } finally {
    fs.closeSync(descriptor);
  }
};

const migrateLegacyStructure = (reelDir, p) => {
  moveFile(path.join(reelDir, '01-script-audio', 'script.md'), p.scriptMarkdown);
  moveFile(path.join(reelDir, '01-script-audio', 'script-fliesstext.txt'), p.voiceScript);
  moveFile(path.join(reelDir, '01-script-audio', 'voiceover.txt'), p.voicePrompt);
  moveDirectoryContents(path.join(reelDir, '01-script-audio', 'audio'), p.audioDir);

  moveFile(path.join(reelDir, '02-bilder', 'ALLE-BILDPROMPTS-ZUM-KOPIEREN.md'), p.allImagePrompts);
  moveFile(path.join(reelDir, '02-bilder', 'bildprompts.md'), p.allImagePrompts);
  moveDirectoryContents(path.join(reelDir, '02-bilder', 'images'), p.imageDropDir);

  const oldPrompts = path.join(reelDir, '02-bilder', 'prompts');
  if (fs.existsSync(oldPrompts)) {
    const files = fs.readdirSync(oldPrompts, {withFileTypes: true}).filter((entry) => entry.isFile());
    files.forEach((entry, index) => {
      const sceneDir = path.join(p.individualScenesDir, `scene-${String(index + 1).padStart(2, '0')}`);
      moveFile(path.join(oldPrompts, entry.name), path.join(sceneDir, 'bildprompt.txt'));
    });
    if (fs.existsSync(oldPrompts) && fs.readdirSync(oldPrompts).length === 0) fs.rmdirSync(oldPrompts);
  }

  moveDirectoryContents(path.join(reelDir, '03-caption'), p.captionsDir);
  moveDirectoryContents(path.join(reelDir, '04-pdf'), p.reviewDir);
  moveDirectoryContents(path.join(reelDir, '05-export'), p.finalVideoDir);

  moveFile(path.join(reelDir, '06-projektdateien', 'production-status.json'), p.status);
  moveFile(path.join(reelDir, '06-projektdateien', 'sources.md'), p.sources);
  moveFile(path.join(reelDir, '06-projektdateien', 'storyboard.md'), p.storyboard);
  moveFile(path.join(reelDir, '06-projektdateien', 'motion-design.md'), p.motionDesign);
  moveFile(path.join(reelDir, '06-projektdateien', 'scene-plan.json'), p.scenePlan);
  moveFile(path.join(reelDir, '06-projektdateien', 'codex-reel-package.json'), p.codexPackage);
  moveFile(path.join(reelDir, '06-projektdateien', 'prompt-manifest.json'), p.imagePromptManifest);
  moveFile(path.join(reelDir, '06-projektdateien', 'asset-manifest.json'), p.manifest);
  moveDirectoryContents(path.join(reelDir, '06-projektdateien', 'render'), p.renderDir);
  moveDirectoryContents(path.join(reelDir, '06-projektdateien', 'data'), p.dataDir);
};

export const ensureFinanceProjectStructure = (reelDir, {title = 'FinanzNeo-Reel', topic = 'Noch nicht festgelegt'} = {}) => {
  const p = financeProjectPaths(reelDir);
  for (const directory of financeRequiredDirectories(reelDir)) fs.mkdirSync(directory, {recursive: true});
  migrateLegacyStructure(reelDir, p);

  let scriptText = '<!-- FINANCE_TODO_FINAL_SCRIPT -->\nFinales Skript nach Freigabe hier einfügen.\n';
  if (fs.existsSync(p.scenePlan)) {
    try {
      const plan = JSON.parse(fs.readFileSync(p.scenePlan, 'utf8'));
      if (typeof plan.scriptText === 'string' && plan.scriptText.trim()) scriptText = `${plan.scriptText.trim()}\n`;
    } catch {
      // Die Vertragsprüfung meldet ungültiges JSON später präzise.
    }
  }

  writeIfMissing(p.coverText, `COVER-TEXT\nFINANCE_TODO_COVER\n\nUNTERZEILE\nFINANCE_TODO_SUBLINE\n`);
  writeIfMissing(p.voiceScript, scriptText);
  writeIfMissing(p.scriptMarkdown, `# Skript — ${title}\n\n**Thema:** ${topic}\n\n## Hook\n\n<!-- FINANCE_TODO_FINAL_SCRIPT -->\n\n## Szenen\n\nDie finale Aufteilung steht in \`../timeline/scene-plan.json\`.\n`);
  writeIfMissing(p.voicePrompt, `Sprich auf Deutsch, klar, modern und direkt. Keine Begrüßung und keine künstliche Dramatik.\n\n<!-- FINANCE_TODO_FINAL_SCRIPT -->\n${scriptText}`);
  writeIfMissing(p.allImagePrompts, `# Alle Bildprompts — ${title}\n\n**Thema:** ${topic}\n\n<!-- FINANCE_TODO_SCENE_PROMPTS -->\n`);
  writeIfMissing(p.sceneIndex, JSON.stringify({version: 1, sceneCount: 0, scenes: []}, null, 2));
  writeIfMissing(p.sources, `# Quellen — ${title}\n\n**Thema:** ${topic}\n\nPrimärquellen, Abrufdatum und verwendete Aussagen dokumentieren.\n`);
  writeIfMissing(p.socialCaption, `<!-- FINANCE_TODO_SOCIAL_CAPTION -->\n\nKurze, sachliche Caption mit passenden Hashtags.\n`);
  writeIfMissing(p.pdfContent, `# Fachlicher Inhalt — ${title}\n\n**Thema:** ${topic}\n\nFachliche Kernaussagen und Erklärungen dokumentieren.\n`);
  writeIfMissing(p.storyboard, `# Storyboard — ${title}\n\nSzenen, Timing, Texte, Bilder und Übergänge dokumentieren.\n`);
  writeIfMissing(p.motionDesign, `# Motion Design — ${title}\n\nPro Szene Bewegung, Fokus, Übergang und Animationsablauf dokumentieren.\n`);

  writeIfMissing(path.join(p.audioDir, 'README.md'), '# Audio hier einfügen\n\nFinales Voiceover exakt als `voiceover-final.wav` ablegen.\n');
  writeIfMissing(path.join(p.imageDropDir, 'README.md'), '# Bilder hier einfügen\n\nDie fertigen Szenenbilder mit den Namen aus `../scene-index.json` ablegen.\n');
  writeIfMissing(path.join(p.individualScenesDir, 'README.md'), '# Einzelne Szenen\n\nFür jede Szene einen eigenen Ordner `scene-01`, `scene-02` usw. anlegen.\n');
  writeIfMissing(path.join(p.captionsDir, 'README.md'), '# Caption\n\nWortuntertitel als `voiceover-final.captions.json`, Social Caption als `social-caption.md`.\n');
  writeIfMissing(path.join(p.reviewDir, 'README.md'), '# Review\n\nQuellen, Status, Kontaktbogen und QA-Berichte.\n');
  writeIfMissing(path.join(p.finalVideoDir, 'README.md'), '# Fertiges Video\n\nFinales Reel als `final-reel.mp4` ablegen.\n');
  writeIfMissing(path.join(p.renderDir, 'README.md'), '# Render\n\nTemporäre Renderausgaben und Stills.\n');
  writeIfMissing(path.join(p.timelineDir, 'README.md'), '# Timeline\n\nStoryboard, Motion-Plan, Szenenplan und Codex-Paket.\n');

  return p;
};
