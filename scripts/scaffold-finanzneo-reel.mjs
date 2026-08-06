#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES = ['image','image','image','animation','image','animation','image','animation','animation','image'];
const args = process.argv.slice(2);
const readArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1] ?? null;
};

const targetArg = readArg('target');
const title = readArg('title') ?? 'Neues FinanzNeo-Reel';
const typeArg = readArg('types');
const types = typeArg ? typeArg.split(',').map((value) => value.trim()) : DEFAULT_TYPES;

if (!targetArg) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,image,animation]');
  process.exit(1);
}
if (types.length < 5 || types.length > 12 || types.some((type) => !['image', 'animation'].includes(type))) {
  console.error('Die Szenentypen müssen aus 5 bis 12 Einträgen bestehen und dürfen nur image oder animation enthalten.');
  process.exit(1);
}

const root = resolve(targetArg);
const reelsRoot = resolve('reels');
const relativeToReels = relative(reelsRoot, root);
if (relativeToReels.startsWith('..') || relativeToReels === '' || relativeToReels.split(sep).includes('..')) {
  console.error('Das Ziel muss ein neuer Projektordner unter reels/ sein.');
  process.exit(1);
}
if (existsSync(root)) {
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write = (path, content) => {
  const absolute = resolve(root, path);
  mkdirSync(resolve(absolute, '..'), {recursive: true});
  writeFileSync(absolute, content, 'utf8');
};

const imageSceneIds = types.flatMap((type, index) => type === 'image' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);
const animationSceneIds = types.flatMap((type, index) => type === 'animation' ? [`scene-${String(index + 1).padStart(2, '0')}`] : []);

write('README.md', `# ${title}\n\nVerbindlicher Standard:\n\n- Bildszene: nur bildprompt.txt\n- Remotion-Szene: nur remotion.md\n- Überschrift oben, Motiv oberhalb der Mitte, Untertitel unten\n- ein vollständiger Satz gleichzeitig; aktuelles Wort audio-synchron grün\n- Vordergrundbilder mit contain; maximale bewusste Vergrößerung 1.05\n- motionprompt.txt und placeholder.svg in Szenenordnern sind verboten\n`);
write('00-cover/cover.txt', '[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n');
write('00-cover/README.md', '# Cover\n\nPrompt in cover.txt; finales Coverbild direkt in diesen Ordner.\n');
write('01-voice-script/script.txt', '[VOLLSTÄNDIGES SPRECHSKRIPT EINFÜGEN]\n');
write('01-voice-script/voiceover-prompt.txt', '[VOICEOVER-REGIE EINFÜGEN]\n');
write('02-audio/README.md', '# Audio\n\nFinales Voiceover hier ablegen. Wortzeiten müssen aus genau dieser finalen Datei erzeugt werden.\n');
write('04-caption/README.md', '# Untertitel\n\nImmer einen vollständigen Satz anzeigen. Nur das aktuell gesprochene Wort ist FinanzNeo-grün. Wortzeiten liegen in word-timings.json.\n');
write('04-caption/word-timings.json', `${JSON.stringify({version: 1, fps: 30, subtitleMode: 'sentence-with-audio-synced-active-word', activeWordColor: 'finance-green', sentences: []}, null, 2)}\n`);
write('04-caption/social-caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('05-review/checkliste.md', '# Checkliste\n\n- [ ] Quellen und Zahlen geprüft\n- [ ] pro Szene exakt eine Produktionsquelle\n- [ ] keine motionprompt- oder placeholder-Dateien\n- [ ] Bildinhalt stimmt mit expectedVisual überein\n- [ ] Vordergrundbilder vollständig sichtbar (contain)\n- [ ] Wortzeiten stammen aus finalem Audio\n- [ ] pro Zeitpunkt genau ein Satz, aktuelles Wort grün\n- [ ] finaler Render vollständig angesehen\n');
write('05-review/quellen.md', '# Quellen\n\n[QUELLEN EINFÜGEN]\n');
write('06-video/README.md', '# Finales Video\n\nFinalen Export hier ablegen.\n');
write('render/README.md', '# Test-Render\n');
write('timeline/README.md', '# Timeline\n\nDauern nach finalem Voiceover festlegen.\n');
write('timeline/timeline.json', `${JSON.stringify({version: 1, title, fps: 30, scenes: types.map((type, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`, type, durationFrames: 0}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const id = `scene-${String(index + 1).padStart(2, '0')}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Überschrift:** [EINFÜGEN]\n\n**Schwerpunktzeile:** [EINFÜGEN]\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? '**Produktionsquelle:** bildprompt.txt\n\n**Expected Visual:** [EINFÜGEN]\n\nFinales Bild direkt in diesen Ordner. Vordergrund in Remotion mit contain, maximale bewusste Vergrößerung 1.05.\n' : '**Produktionsquelle:** remotion.md\n\nAnimation vollständig programmieren. Keine Bild- oder Motionprompt-Datei anlegen.\n'}`);

  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, `[VOLLSTÄNDIGEN BILDPROMPT FÜR ${id} EINFÜGEN]\n`);
    return {id, type, directory: `EINZELNE-SZENEN/${id}`, planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`, expectedVisual: '[EINFÜGEN]', assetState: 'missing-until-final-image'};
  }

  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- sichtbare Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- Ablaufphasen: [EINFÜGEN]\n- Datei: src/reels/[slug]/[Komponente].tsx\n`);
  return {id, type, directory: `EINZELNE-SZENEN/${id}`, planFile: `EINZELNE-SZENEN/${id}/remotion.md`};
});

write('03-szenen/README.md', '# Szenen\n\n- Bildszene: bildprompt.txt + szene.md + später genau ein finales Bild.\n- Remotion-Szene: remotion.md + szene.md.\n- Keine motionprompt.txt, alle-motionprompts.txt oder placeholder.svg.\n- Vordergrundbilder vollständig mit contain anzeigen.\n- Bildzuordnung vor dem Render anhand von expectedVisual kontrollieren.\n');
write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS\n\nCOVER\n=====\n[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n\n${imageSceneIds.map((id) => `${id.toUpperCase()}\n${'='.repeat(id.length)}\n[VOLLSTÄNDIGEN BILDPROMPT EINFÜGEN]\n`).join('\n')}`);
write('03-szenen/scene-index.json', `${JSON.stringify({
  version: 3,
  title,
  sceneCount: scenes.length,
  imageSceneCount: imageSceneIds.length,
  animationSceneCount: animationSceneIds.length,
  sourceContract: 'exactly-one-of-bildprompt-or-remotion',
  subtitleMode: 'sentence-with-audio-synced-active-word',
  activeWordColor: 'finance-green',
  wordTimingFile: '04-caption/word-timings.json',
  imageFit: 'contain',
  maxIntentionalImageScale: 1.05,
  backgroundFill: 'optional-blurred-cover-copy',
  forbiddenFiles: ['motionprompt.txt', 'alle-motionprompts.txt', 'placeholder.svg'],
  imageMotionOwner: 'central-remotion-code',
  technicalFallbackLocation: 'public-or-remotion-code-only',
  scenes,
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Karaoke-Captions vorbereitet · Vordergrundbilder contain · keine Szenen-Platzhalter');
