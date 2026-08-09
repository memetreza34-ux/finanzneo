#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES = ['image','image','animation','image','animation','image','animation','animation','image','image'];
const args = process.argv.slice(2);
const readArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1] ?? null;
};

const targetArg = readArg('target');
const title = readArg('title') ?? 'Neues FinanzNeo-Reel';
const typeArg = readArg('types');
const types = typeArg ? typeArg.split(',').map((v) => v.trim()) : DEFAULT_TYPES;

if (!targetArg) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,image,animation]');
  process.exit(1);
}
if (types.length < 5 || types.length > 12 || types.some((t) => !['image', 'animation'].includes(t))) {
  console.error('Szenentypen: 5–12 Einträge, nur image oder animation.');
  process.exit(1);
}

const root = resolve(targetArg);
const rel = relative(resolve('reels'), root);
if (rel.startsWith('..') || rel === '' || rel.split(sep).includes('..')) {
  console.error('Ziel muss ein neuer Ordner unter reels/ sein.');
  process.exit(1);
}
if (existsSync(root)) {
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write = (path, content) => {
  const abs = resolve(root, path);
  mkdirSync(resolve(abs, '..'), {recursive: true});
  writeFileSync(abs, content, 'utf8');
};

const WORLD_ID = 'finanzneo-connected-studio-v3';
const num = (index) => String(index + 1).padStart(2, '0');
const sceneFileName = (index) => `Bild ${num(index)} - [KURZER SZENENNAME].png`;

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nBILDSTIL:\nPremium high-end 3D CGI editorial finance illustration, vertical 9:16, bright clean commercial quality, realistic proportions with polished stylization, crisp details, soft premium shadows, warm off-white or light-gray environment. FinanzNeo green = Schutz/Fortschritt, gold = Geld/Wert, red = Risiko/Schulden. Large smartphone-readable hero objects.\n\nVERBOTEN:\nNo dark black background, no neon tunnel, no sci-fi corridor, no green glowing tunnel world, no tiny isometric diorama, no miniature game level, no floating miniature platform, no clutter, no dashboard, no excessive glow, no Pixar, no clay, no childish cartoon.\n\nKOMPOSITION:\nOne large obvious hero concept. Main objects approximately 70–85% of usable width. Maximum 3–5 clear main elements. The message must be understandable within one second on a smartphone.\n`;

const googleFlowInstruction = (fileName) => `GOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nWICHTIG:\nErzeuge GENAU EIN Bild. Danach SOFORT exakt wie oben umbenennen, Motiv + deutschen Text + Dateiname prüfen und erst dann das nächste Bild erzeugen. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${googleFlowInstruction(sceneFileName(index))}\n${STYLE_BLOCK}\nDEUTSCHER TEXT – EXAKT SO INS BILD:\n\`[KURZER DEUTSCHER BILDTEXT FÜR ${id}]\`\n\nTEXTREGEL:\nGroß, fett, moderne Sans-Serif-Schrift. Nur dieser eine deutsche Text. Keine englischen Wörter, keine Zusatzlabels, keine Schreibfehler.\n\nSZENENINHALT:\n[KONKRETES HAUPTMOTIV + KLARE HANDLUNG EINFÜGEN]\n\nBILDAUSSAGE:\n[VOLLSTÄNDIGEN SPRECHSATZ / KERNAUSSAGE EINFÜGEN]\n\nKOMPOSITION:\n[2–5 GROSSE KLARE ELEMENTE; KEIN ABSTRAKTES MINIATURSYSTEM]\n`;

const coverPrompt = `${googleFlowInstruction('Bild 00 - [KURZER COVER-NAME].png')}\n${STYLE_BLOCK}\nDEUTSCHER COVER-TEXT – EXAKT SO INS BILD:\n\`[THEMA]\`\n\`[KURZE ZWEITE ZEILE]\`\n\nTEXTREGEL:\nCover-Titel zwingend sichtbar, groß und sofort verständlich. Zwei kurze deutsche Zeilen. Keine weiteren Wörter oder Zahlen.\n\nSZENENINHALT:\n[STARKES GROSSES COVER-HAUPTMOTIV, DAS DAS THEMA DIREKT ERKLÄRT]\n`;

const worldPrompt = `FINANZNEO WORLD REFERENCE\n\nFINANZNEO_WORLD_ID: ${WORLD_ID}\n\nCreate a bright premium 3D CGI editorial finance style reference. Warm off-white/light-gray environment, crisp commercial quality, soft premium shadows, realistic proportions with polished stylization, FinanzNeo green accents, gold only for money/value, red only for risk. Large clear objects, simple composition, smartphone readability. No dark black background, no neon tunnel, no sci-fi corridor, no tiny diorama, no floating miniature platform, no Pixar, no clay. Leave a calm area for short bold German typography.\n`;

const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Fließtext fürs Voiceover\n- 02-audio = fertiges Audio\n- 03-szenen = Cover, Bildprompts, Szenen, fertige Nutzerbilder\n- 04-caption = Caption + Wort-Timings\n- 05-projektdateien = Animationen, Recherche, Technik\n\nDer Nutzer erstellt alle tatsächlichen Bilder selbst. Antigravity generiert keine Bilder.\n`);

write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nErst wenn alle Bilder einzeln erzeugt, sofort korrekt benannt und geprüft sind, alle gemeinsam hier hineinlegen. Animationsszenen erhalten kein Bild; ihre Nummer bleibt reserviert.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nGoogle Flow: 1 Bild erzeugen → sofort umbenennen → Text/Motiv prüfen → erst dann nächstes Bild. Cover braucht immer einen klaren deutschen Titel. Jede Bildszene braucht genau einen kurzen deutschen Bildtext.\n');
write('04-caption/caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:1,fps:30,subtitleMode:'sentence-with-audio-synced-active-word',activeWordColor:'finance-green',sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- 1080 × 1920\n- 30 fps\n- Bilder: heller Premium-3D/CGI-Editorial-Look\n- jedes Bild: kurzer deutscher Text\n- Cover: klarer deutscher Titel\n- keine Neon-Tunnel-/Miniatur-Diorama-Welt\n- Bilddarstellung in Remotion: contain\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
write('05-projektdateien/timeline.json', `${JSON.stringify({version:1,title,fps:30,timingSource:'04-caption/word-timings.json',cutRule:'voice-sentence-start',scenes:types.map((type,index)=>({id:`scene-${num(index)}`,type,startFrame:0,durationFrames:0,cutReason:'voice-sentence-start'}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const number = num(index);
  const id = `scene-${number}`;
  const dir = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${dir}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? `**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Deutscher Bildtext:** [EINFÜGEN]\n` : `**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n`}`);

  const common = {id,type,startFrame:0,durationFrames:0,cutReason:'voice-sentence-start',directory:`EINZELNE-SZENEN/${id}`,headline:'[EINFÜGEN]',accent:'[EINFÜGEN]',icon:'[EINFÜGEN]'};
  if (type === 'image') {
    write(`${dir}/bildprompt.txt`, imagePrompt(id, index));
    return {...common,planFile:`EINZELNE-SZENEN/${id}/bildprompt.txt`,googleFlowFileName:sceneFileName(index),imageText:'[EINFÜGEN]',expectedVisual:'[EINFÜGEN]',imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true}};
  }
  write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n`);
  return {...common,planFile:`EINZELNE-SZENEN/${id}/remotion.md`};
});

const allSections = types.map((type,index) => {
  const number = num(index);
  if (type === 'animation') return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`, index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nVERBINDLICH:\n1 Bild erzeugen → sofort umbenennen → Motiv + deutschen Text prüfen → erst dann nächstes Bild.\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nJedes Bild enthält genau den direkt am Prompt festgelegten deutschen Bildtext. Cover braucht immer einen klaren deutschen Titel.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn alle benötigten Bilder fertig, korrekt benannt und geprüft sind, alle gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:8,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{generationMode:'one-image-at-a-time',fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false},
  imageWorld:{id:WORLD_ID,style:'bright-premium-3d-editorial',germanImageTextRequired:true,coverGermanTitleRequired:true,darkNeonTunnelForbidden:true,tinyDioramaForbidden:true,noEmptyBackground:true},
  timelineRules:{timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,equalLengthScenesForbiddenByDefault:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  imagePresentationContract:{imageFit:'contain',maxIntentionalImageScale:1.04,maxSourceCropPerSide:0.2,maxSourceCropTotal:0.34,blurredImageBackgroundForbidden:true},
  scenes
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Bilder: heller Premium-3D/CGI-Editorial-Look · kurzer deutscher Text · Cover mit deutschem Titel');
console.log('  Antigravity generiert keine Bilder; der Nutzer erstellt sie selbst.');
