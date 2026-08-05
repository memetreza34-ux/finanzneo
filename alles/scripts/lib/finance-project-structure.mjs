import fs from 'node:fs';
import path from 'node:path';

export const FINANCE_STRUCTURE_VERSION = 4;

export const financeProjectPaths = (reelDir) => ({
  projectDir: reelDir,

  scriptAudioDir: path.join(reelDir, '01-script-audio'),
  scriptMarkdown: path.join(reelDir, '01-script-audio', 'script.md'),
  voiceScript: path.join(reelDir, '01-script-audio', 'script-fliesstext.txt'),
  voicePrompt: path.join(reelDir, '01-script-audio', 'voiceover.txt'),
  audioDir: path.join(reelDir, '01-script-audio', 'audio'),
  voiceoverFinal: path.join(reelDir, '01-script-audio', 'audio', 'voiceover-final.wav'),
  sfxDir: path.join(reelDir, '01-script-audio', 'audio', 'sfx'),

  imagesSectionDir: path.join(reelDir, '02-bilder'),
  imagePromptIndex: path.join(reelDir, '02-bilder', 'bildprompts.md'),
  imagePromptsDir: path.join(reelDir, '02-bilder', 'prompts'),
  imagesDir: path.join(reelDir, '02-bilder', 'images'),

  captionsDir: path.join(reelDir, '03-caption'),
  captionsFinal: path.join(reelDir, '03-caption', 'voiceover-final.captions.json'),
  socialCaption: path.join(reelDir, '03-caption', 'social-caption.md'),

  pdfDir: path.join(reelDir, '04-pdf'),
  pdfContent: path.join(reelDir, '04-pdf', 'inhalt.md'),

  exportDir: path.join(reelDir, '05-export'),
  exportVideoDir: path.join(reelDir, '05-export'),
  exportCaptionsDir: path.join(reelDir, '05-export'),
  exportPdfDir: path.join(reelDir, '05-export'),

  projectFilesDir: path.join(reelDir, '06-projektdateien'),
  scenePlan: path.join(reelDir, '06-projektdateien', 'scene-plan.json'),
  status: path.join(reelDir, '06-projektdateien', 'production-status.json'),
  sources: path.join(reelDir, '06-projektdateien', 'sources.md'),
  imagePromptManifest: path.join(reelDir, '06-projektdateien', 'prompt-manifest.json'),
  manifest: path.join(reelDir, '06-projektdateien', 'asset-manifest.json'),
  readyReport: path.join(reelDir, '06-projektdateien', 'ready-report.json'),
  qaReport: path.join(reelDir, '06-projektdateien', 'qa-report.json'),
  storyboard: path.join(reelDir, '06-projektdateien', 'storyboard.md'),
  motionDesign: path.join(reelDir, '06-projektdateien', 'motion-design.md'),
  videoDir: path.join(reelDir, '06-projektdateien', 'render'),
  dataDir: path.join(reelDir, '06-projektdateien', 'data'),
});

export const financeRequiredDirectories = (reelDir) => {
  const p = financeProjectPaths(reelDir);
  return [
    reelDir,
    p.scriptAudioDir,
    p.audioDir,
    p.sfxDir,
    p.imagesSectionDir,
    p.imagePromptsDir,
    p.imagesDir,
    p.captionsDir,
    p.pdfDir,
    p.exportDir,
    p.projectFilesDir,
    p.videoDir,
    p.dataDir,
  ];
};

const writeIfMissing = (file, content) => {
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

export const sanitizeReelFolderTitle = (value) => transliterateGerman(value ?? 'Reel')
  .trim()
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'Reel';

export const promptFileName = (index, sceneId) => `${String(index + 1).padStart(2, '0')}-${sanitizeSceneId(sceneId)}.txt`;
export const suggestedImageFileName = (index, sceneId) => `${String(index + 1).padStart(2, '0')}-${sanitizeSceneId(sceneId)}.png`;

export const planRequiresPdf = (plan) => {
  if (!plan) return false;
  const text = [
    plan.scriptText,
    plan.payoff,
    ...((plan.scenes ?? []).flatMap((scene) => [
      scene.voiceText,
      scene.content?.ctaBenefit,
      scene.content?.headline,
      scene.content?.body,
    ])),
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

const migrateOldStructure = (reelDir, p) => {
  moveFile(path.join(reelDir, 'scene-plan.json'), p.scenePlan);
  moveFile(path.join(reelDir, 'production-status.json'), p.status);
  moveFile(path.join(reelDir, 'sources.md'), p.sources);
  moveFile(path.join(reelDir, 'asset-manifest.json'), p.manifest);
  moveFile(path.join(reelDir, 'ready-report.json'), p.readyReport);
  moveFile(path.join(reelDir, 'qa-report.json'), p.qaReport);
  moveFile(path.join(reelDir, 'voiceover-prompt.md'), p.voicePrompt);
  moveFile(path.join(reelDir, 'image-prompts.md'), p.imagePromptIndex);

  moveFile(path.join(reelDir, 'voice', 'script.txt'), p.voiceScript);
  moveFile(path.join(reelDir, 'voice', 'voiceover-prompt.md'), p.voicePrompt);
  moveDirectoryContents(path.join(reelDir, 'audio'), p.audioDir);
  moveFile(path.join(reelDir, 'image-prompts', '00_alle-bildprompts.md'), p.imagePromptIndex);
  moveFile(path.join(reelDir, 'image-prompts', 'prompt-manifest.json'), p.imagePromptManifest);
  moveDirectoryContents(path.join(reelDir, 'image-prompts'), p.imagePromptsDir, (entry) => entry.isDirectory() || entry.name.toLowerCase().endsWith('.txt'));
  moveDirectoryContents(path.join(reelDir, 'images'), p.imagesDir);
  moveDirectoryContents(path.join(reelDir, 'captions'), p.captionsDir);
  moveDirectoryContents(path.join(reelDir, 'pdf'), p.pdfDir);
  moveDirectoryContents(path.join(reelDir, 'export'), p.exportDir);
  moveDirectoryContents(path.join(reelDir, 'video'), p.videoDir);
  moveDirectoryContents(path.join(reelDir, 'data'), p.dataDir);
};

export const ensureFinanceProjectStructure = (reelDir, {title = 'FinanzNeo-Reel', topic = 'Noch nicht festgelegt'} = {}) => {
  const p = financeProjectPaths(reelDir);
  for (const directory of financeRequiredDirectories(reelDir)) fs.mkdirSync(directory, {recursive: true});
  migrateOldStructure(reelDir, p);

  let scriptText = '<!-- FINANCE_TODO_FINAL_SCRIPT -->\nFinales Skript nach Freigabe hier einfügen.\n';
  if (fs.existsSync(p.scenePlan)) {
    try {
      const plan = JSON.parse(fs.readFileSync(p.scenePlan, 'utf8'));
      if (typeof plan.scriptText === 'string' && plan.scriptText.trim()) scriptText = `${plan.scriptText.trim()}\n`;
    } catch {
      // Die Vertragsprüfung meldet ungültiges JSON später präzise.
    }
  }

  writeIfMissing(p.voiceScript, scriptText);
  writeIfMissing(p.scriptMarkdown, `# Skript — ${title}\n\n**Thema:** ${topic}\n\n## Hook\n\n<!-- FINANCE_TODO_FINAL_SCRIPT -->\n\n## Szenenaufteilung\n\nDie finale Szenenaufteilung aus \`06-projektdateien/scene-plan.json\` hier verständlich dokumentieren.\n`);
  writeIfMissing(p.voicePrompt, `Sprich auf Deutsch, seriös, klar und direkt. Keine Begrüßung, kein Musikbett und keine künstliche Dramatik. Hook, Zahlen, Wendepunkt und Payoff deutlich betonen. Kurze natürliche Pausen.\n\n<!-- FINANCE_TODO_FINAL_SCRIPT -->\n${scriptText}`);
  writeIfMissing(p.imagePromptIndex, `# Bildprompts — ${title}\n\n**Thema:** ${topic}\n\n<!-- FINANCE_TODO_DESIGN_ANCHOR -->\nDesignanker noch nicht freigegeben.\n\n<!-- FINANCE_TODO_SCENE_PROMPTS -->\nDie einzelnen kopierbaren Prompts werden in \`prompts/\` erzeugt.\n`);
  writeIfMissing(p.sources, `# Quellen — ${title}\n\n**Thema:** ${topic}\n\nPrimärquellen, Abrufdatum und Claim-IDs dokumentieren.\n`);
  writeIfMissing(p.socialCaption, `<!-- FINANCE_TODO_SOCIAL_CAPTION -->\n💬 Kommentiere KEYWORD und ich schicke dir kostenlos die passende PDF per DM.\n\nStarke Überschrift\n\nKurze Zusammenfassung mit echtem Mehrwert.\n\nWelche Frage beantwortest du in den Kommentaren?\n\n#Finanzen #Geld #Finanzwissen #Investieren #FinanzNeo\n`);
  writeIfMissing(p.pdfContent, `# PDF-Inhalt — ${title}\n\n**Thema:** ${topic}\n\nHier den vollständigen Inhalt des Lead-Magnets planen. Die fertige PDF ebenfalls in diesen Ordner legen.\n`);
  writeIfMissing(p.storyboard, `# Storyboard — ${title}\n\nSzenen, Timing, Texte, Bilder und Übergänge aus \`scene-plan.json\` verständlich dokumentieren.\n`);
  writeIfMissing(p.motionDesign, `# Motion Design — ${title}\n\nPro Szene Bewegung, Zustandsänderung, Fokus, Übergang und SFX dokumentieren.\n`);
  writeIfMissing(path.join(p.audioDir, '00_AUDIO_HIER_EINFUEGEN.md'), '# Audio\n\nFinales Voiceover exakt als `voiceover-final.wav` hier einfügen. SFX gehören in `sfx/`.\n');
  writeIfMissing(path.join(p.imagesDir, '00_BILDER_HIER_EINFUEGEN.md'), '# Bilder\n\nDie fertigen Bilder mit den Dateinamen aus `../bildprompts.md` hier einfügen.\n');
  writeIfMissing(path.join(p.captionsDir, '00_CAPTION_INFO.md'), '# Caption\n\nWort-Untertitel: `voiceover-final.captions.json`. Social-Media-Caption: `social-caption.md`.\n');
  writeIfMissing(path.join(p.exportDir, '00_EXPORT_HIER.md'), '# Export\n\nHier landen das finale MP4, Social Caption, Untertitel und PDF gemeinsam.\n');

  return p;
};
