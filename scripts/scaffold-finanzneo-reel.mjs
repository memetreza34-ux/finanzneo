#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const args = process.argv.slice(2);
const readArg = (name) => { const index = args.indexOf(`--${name}`); return index === -1 ? null : args[index + 1] ?? null; };
const targetArg = readArg('target');
const title = readArg('title') ?? 'Neues FinanzNeo-Reel';
const typeArg = readArg('types');
const types = typeArg ? typeArg.split(',').map((value) => value.trim()) : DEFAULT_TYPES;

if (!targetArg) { console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"'); process.exit(1); }
if (types.length < 5 || types.length > 12 || types.some((type) => !['image', 'animation'].includes(type))) { console.error('Ungültige Szenentypen.'); process.exit(1); }
const root = resolve(targetArg);
const relativeToReels = relative(resolve('reels'), root);
if (relativeToReels.startsWith('..') || relativeToReels === '' || relativeToReels.split(sep).includes('..')) { console.error('Ziel muss unter reels/ liegen.'); process.exit(1); }
if (existsSync(root)) { console.error(`Ziel existiert bereits: ${root}`); process.exit(1); }
const write = (path, content) => { const absolute = resolve(root, path); mkdirSync(resolve(absolute, '..'), {recursive: true}); writeFileSync(absolute, content, 'utf8'); };
const imageSceneIds = types.flatMap((type, index) => type === 'image' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);
const animationSceneIds = types.flatMap((type, index) => type === 'animation' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);

write('README.md', `# ${title}\n\n- Bildszene nur mit bildprompt.txt\n- Remotion-Szene nur mit remotion.md\n- Überschrift oben mit passendem Icon\n- Visual Y=270–1350\n- Untertitel mit 320 px unterer Safe-Area und 150 px rechter UI-Safe-Area\n- genau ein Satz, aktuelles Wort grün, keine Caption-Lücken\n- maximal zwei ausgewogene Untertitelzeilen\n- Vordergrund contain; Scale maximal 1.06\n- sichere Leerraum-Crops pro Seite maximal 0.22, insgesamt maximal 0.36\n`);
write('00-cover/cover.txt', '[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n');
write('00-cover/README.md', '# Cover\n\nPrompt in cover.txt; finales Coverbild direkt in diesen Ordner.\n');
write('01-voice-script/script.txt', '[VOLLSTÄNDIGES SPRECHSKRIPT EINFÜGEN]\n');
write('01-voice-script/voiceover-prompt.txt', '[VOICEOVER-REGIE EINFÜGEN]\n');
write('02-audio/README.md', '# Audio\n\nFinales Voiceover hier ablegen. Wortzeiten aus genau dieser Datei erzeugen.\n');
write('04-caption/README.md', '# Untertitel\n\nEin Satz sichtbar. Aktuelles Wort grün. Keine Lücken. Algorithmisch auf höchstens zwei ausgewogene Zeilen teilen.\n');
write('04-caption/word-timings.json', `${JSON.stringify({version: 1, fps: 30, subtitleMode: 'sentence-with-audio-synced-active-word', activeWordColor: 'finance-green', sentences: []}, null, 2)}\n`);
write('04-caption/social-caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('05-review/checkliste.md', '# Checkliste\n\n- [ ] Quellen und Zahlen geprüft\n- [ ] passendes Icon pro Überschrift\n- [ ] Bilder wirken ähnlich groß\n- [ ] nur leerer Quellraum beschnitten\n- [ ] sourceCropTop/sourceCropBottom je <= 0.22 und zusammen <= 0.36\n- [ ] keine Bildbeschriftung, Zahl oder Motivkante abgeschnitten\n- [ ] Untertitel oberhalb der Plattform-Totzone\n- [ ] höchstens zwei Untertitelzeilen\n- [ ] finalen Render vollständig angesehen\n');
write('05-review/quellen.md', '# Quellen\n\n[QUELLEN EINFÜGEN]\n');
write('06-video/README.md', '# Finales Video\n');
write('render/README.md', '# Test-Render\n');
write('timeline/README.md', '# Timeline\n');
write('timeline/timeline.json', `${JSON.stringify({version: 1, title, fps: 30, scenes: types.map((type, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`, type, durationFrames: 0}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const id = `scene-${String(index + 1).padStart(2, '0')}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Überschrift:** [EINFÜGEN]\n\n**Schwerpunktzeile:** [EINFÜGEN]\n\n**Passendes Icon:** [EINFÜGEN]\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? '**Expected Visual:** [EINFÜGEN]\n\n**Bilddarstellung:** scale=1.02, sourceCropTop=0, sourceCropBottom=0, cropSafe=false\n' : '**Remotion-Komponente:** [EINFÜGEN]\n'}`);
  const common = {id, type, directory: `EINZELNE-SZENEN/${id}`, headline: '[EINFÜGEN]', accent: '[EINFÜGEN]', icon: '[EINFÜGEN]'};
  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, `[VOLLSTÄNDIGEN BILDPROMPT FÜR ${id} EINFÜGEN]\n`);
    return {...common, planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`, expectedVisual: '[EINFÜGEN]', imagePresentation: {scale: 1.02, sourceCropTop: 0, sourceCropBottom: 0, cropSafe: false}};
  }
  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Ablauf: [EINFÜGEN]\n`);
  return {...common, planFile: `EINZELNE-SZENEN/${id}/remotion.md`};
});

write('03-szenen/README.md', '# Szenen\n\nBildszene: bildprompt.txt. Remotion-Szene: remotion.md. Icon, expectedVisual und sichere Source-Crops im scene-index pflegen.\n');
write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS\n\nCOVER\n=====\n[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n\n${imageSceneIds.map((id) => `${id.toUpperCase()}\n${'='.repeat(id.length)}\n[VOLLSTÄNDIGEN BILDPROMPT EINFÜGEN]\n`).join('\n')}`);
write('03-szenen/scene-index.json', `${JSON.stringify({version: 5, title, sceneCount: scenes.length, imageSceneCount: imageSceneIds.length, animationSceneCount: animationSceneIds.length, headlineIconRule: 'matching-icon-centered-next-to-accent-same-visual-size', subtitleMode: 'sentence-with-audio-synced-active-word', activeWordColor: 'finance-green', wordTimingFile: '04-caption/word-timings.json', subtitleDisplay: {maxLines: 2, balancedLines: true, holdDuringPauses: true, noDeadGaps: true}, layout: {headlineTop: 78, visualTop: 270, visualBottom: 1350, subtitleBottom: 320, subtitleLeft: 62, subtitleRight: 150}, imageFit: 'contain', maxIntentionalImageScale: 1.06, maxSourceCropPerSide: 0.22, maxSourceCropTotal: 0.36, forbiddenFiles: ['motionprompt.txt','alle-motionprompts.txt','placeholder.svg'], scenes}, null, 2)}\n`);
console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen · Zwei-Zeilen- und Source-Crop-Vertrag aktiv`);
