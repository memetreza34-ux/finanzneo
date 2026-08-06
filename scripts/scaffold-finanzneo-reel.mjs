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

write('README.md', `# ${title}\n\nNeue Reel-Struktur nach dem verbindlichen Ein-Quellen-Vertrag.\n\n- Bildszene: nur bildprompt.txt\n- Remotion-Szene: nur remotion.md\n- motionprompt.txt und placeholder.svg in Szenenordnern sind verboten\n- einfache Bildbewegung wird zentral im Remotion-Code definiert\n`);
write('00-cover/cover.txt', '[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n');
write('00-cover/README.md', '# Cover\n\nPrompt in cover.txt; finales Coverbild direkt in diesen Ordner.\n');
write('01-voice-script/script.txt', '[VOLLSTÄNDIGES SPRECHSKRIPT EINFÜGEN]\n');
write('01-voice-script/voiceover-prompt.txt', '[VOICEOVER-REGIE EINFÜGEN]\n');
write('02-audio/README.md', '# Audio\n\nFinales Voiceover hier ablegen.\n');
write('04-caption/social-caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('05-review/checkliste.md', '# Checkliste\n\n- [ ] Quellen geprüft\n- [ ] Zahlen geprüft\n- [ ] pro Szene exakt eine Produktionsquelle\n- [ ] keine motionprompt-Dateien\n- [ ] keine placeholder.svg in Szenenordnern\n- [ ] finale Bilder vorhanden\n- [ ] finaler Render geprüft\n');
write('05-review/quellen.md', '# Quellen\n\n[QUELLEN EINFÜGEN]\n');
write('06-video/README.md', '# Finales Video\n\nFinalen Export hier ablegen.\n');
write('render/README.md', '# Test-Render\n');
write('timeline/README.md', '# Timeline\n\nDauern nach finalem Voiceover festlegen.\n');
write('timeline/timeline.json', `${JSON.stringify({version: 1, title, fps: 30, scenes: types.map((type, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`, type, durationFrames: 0}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const id = `scene-${String(index + 1).padStart(2, '0')}`;
  const directory = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${directory}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? '**Produktionsquelle:** bildprompt.txt\n\nDas finale Bild später direkt in diesen Ordner legen. Der Ordner bleibt bis dahin absichtlich ohne Bilddatei. Bildbewegung wird zentral im Remotion-Code gesteuert. Keine motionprompt.txt und keine placeholder.svg anlegen.\n' : '**Produktionsquelle:** remotion.md\n\nAnimation vollständig programmieren. Kein bildprompt.txt, keine motionprompt.txt und keine Bilddatei anlegen.\n'}`);

  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, `[VOLLSTÄNDIGEN BILDPROMPT FÜR ${id} EINFÜGEN]\n`);
    return {id, type, directory: `EINZELNE-SZENEN/${id}`, planFile: `EINZELNE-SZENEN/${id}/bildprompt.txt`, assetState: 'missing-until-final-image'};
  }

  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- sichtbare Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- Ablaufphasen: [EINFÜGEN]\n- Datei: src/reels/[slug]/[Komponente].tsx\n`);
  return {id, type, directory: `EINZELNE-SZENEN/${id}`, planFile: `EINZELNE-SZENEN/${id}/remotion.md`};
});

write('03-szenen/README.md', `# Szenen\n\nVerbindlicher Vertrag:\n\n- Bildszene enthält bildprompt.txt und szene.md; das finale Bild kommt später direkt dazu.\n- Remotion-Szene enthält remotion.md und szene.md.\n- motionprompt.txt, alle-motionprompts.txt und placeholder.svg in Szenenordnern sind verboten.\n- Eine Szene darf nie bildprompt.txt und remotion.md gleichzeitig enthalten.\n- Technische Render-Fallbacks gehören ausschließlich zentral nach public/ oder direkt in den Remotion-Code.\n`);
write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS\n\nCOVER\n=====\n[VOLLSTÄNDIGEN COVER-PROMPT EINFÜGEN]\n\n${imageSceneIds.map((id) => `${id.toUpperCase()}\n${'='.repeat(id.length)}\n[VOLLSTÄNDIGEN BILDPROMPT EINFÜGEN]\n`).join('\n')}`);
write('03-szenen/scene-index.json', `${JSON.stringify({version: 2, title, sceneCount: scenes.length, imageSceneCount: imageSceneIds.length, animationSceneCount: animationSceneIds.length, sourceContract: 'exactly-one-of-bildprompt-or-remotion', forbiddenFiles: ['motionprompt.txt', 'alle-motionprompts.txt', 'placeholder.svg'], imageMotionOwner: 'central-remotion-code', technicalFallbackLocation: 'public-or-remotion-code-only', scenes}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen · keine Platzhalter in Szenenordnern`);
