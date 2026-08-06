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

write('README.md', `# ${title}\n\nVerbindlicher Aufbau:\n\n- Überschrift oben\n- Visual im Bereich Y=300–1410\n- Untertitel separat darunter\n- maximal ein vollständiger Satz pro Untertitel-Cue\n- Bildszene nur mit bildprompt.txt\n- Remotion-Szene nur mit remotion.md\n`);
write('00-cover/cover.txt', '[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n');
write('00-cover/README.md', '# Cover\n\nPrompt in cover.txt; finales Coverbild direkt in diesen Ordner.\n');
write('01-voice-script/script.txt', '[VOLLSTÄNDIGES SPRECHSKRIPT EINFÜGEN]\n');
write('01-voice-script/voiceover-prompt.txt', '[VOICEOVER-REGIE EINFÜGEN]\n');
write('02-audio/README.md', '# Audio\n\nFinales Voiceover hier ablegen.\n');
write('04-caption/social-caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('05-review/checkliste.md', '# Checkliste\n\n- [ ] Quellen und Zahlen geprüft\n- [ ] Überschrift immer oben\n- [ ] Visual endet oberhalb der Untertitel\n- [ ] pro Untertitel-Cue höchstens ein Satz\n- [ ] Bildinhalt stimmt mit expectedVisual überein\n- [ ] finaler Render vollständig geprüft\n');
write('05-review/quellen.md', '# Quellen\n\n[QUELLEN EINFÜGEN]\n');
write('06-video/README.md', '# Finales Video\n\nFinalen Export hier ablegen.\n');
write('render/README.md', '# Test-Render\n');
write('timeline/README.md', '# Timeline\n\nStandard: 180 Frames pro Szene; nach finalem Voiceover präzise anpassen.\n');
write('timeline/timeline.json', `${JSON.stringify({version: 2, title, fps: 30, scenes: types.map((type, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`, type, durationFrames: 180}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const id = `scene-${String(index + 1).padStart(2, '0')}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Überschrift oben:** [ZEILE 1]\n\n**Schwerpunktzeile:** [ZEILE 2]\n\n**Untertitel-Cues:** pro Cue genau ein vollständiger Satz.\n\n**Erwartetes Visual:** [EINDEUTIG BESCHREIBEN]\n\n${type === 'image' ? '**Produktionsquelle:** bildprompt.txt\n\nDas finale Bild später direkt in diesen Ordner legen. Bild ohne eigene Überschrift oder erklärenden Text generieren.\n' : '**Produktionsquelle:** remotion.md\n\nAnimation vollständig programmieren; wichtige Elemente müssen oberhalb der Untertitelzone bleiben.\n'}`);

  const common = {
    id,
    type,
    durationFrames: 180,
    directory: `EINZELNE-SZENEN/${id}`,
    headline: '[ZEILE 1]',
    accent: '[ZEILE 2]',
    subtitles: [{fromFrame: 0, toFrame: 180, text: '[EINEN VOLLSTÄNDIGEN SATZ EINFÜGEN]'}],
  };

  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, `[VOLLSTÄNDIGEN BILDPROMPT FÜR ${id} EINFÜGEN]\n\nTEXT IN IMAGE:\nNo text.\n`);
    return {...common, planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`, expectedVisual: '[EINDEUTIGER BILDINHALT]'};
  }

  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- sichtbare Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- alle wichtigen Elemente innerhalb Y=300–1410\n- Datei: src/reels/[slug]/[Komponente].tsx\n`);
  return {...common, planFile: `EINZELNE-SZENEN/${id}/remotion.md`, remotionComponent: '[KOMPONENTE]'};
});

write('03-szenen/README.md', '# Szenen\n\n- Überschrift oben.\n- Visual Y=300–1410.\n- Untertitel separat darunter.\n- Maximal ein vollständiger Satz pro Cue.\n- Bildszene: bildprompt.txt.\n- Remotion-Szene: remotion.md.\n- Keine Motionprompts oder Platzhalter in Szenenordnern.\n');
write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS\n\nCOVER\n=====\n[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n\n${imageSceneIds.map((id) => `${id.toUpperCase()}\n${'='.repeat(id.length)}\n[VOLLSTÄNDIGEN BILDPROMPT OHNE TEXT EINFÜGEN]\n`).join('\n')}`);
write('03-szenen/scene-index.json', `${JSON.stringify({version: 3, title, sceneCount: scenes.length, imageSceneCount: imageSceneIds.length, animationSceneCount: animationSceneIds.length, sourceContract: 'exactly-one-of-bildprompt-or-remotion', layoutContract: 'headline-top_visual-above-center_subtitle-bottom_one-sentence', subtitleRule: 'one-complete-sentence-per-cue', layout: {headlineTop: 92, visualTop: 300, visualBottom: 1410, subtitleBottom: 180}, forbiddenFiles: ['motionprompt.txt', 'alle-motionprompts.txt', 'placeholder.svg'], imageMotionOwner: 'central-remotion-code', scenes}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen · Layoutvertrag aktiv`);
