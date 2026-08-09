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

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nBILDSTIL:\nPremium stylized 3D CGI finance illustration, vertical 9:16. Dunkler hochwertiger Anthrazit-/Tiefgrün-Look, kontrolliertes smaragdgrünes Licht, weiche Bodenschatten, hochwertige Materialien. Gold nur für Geld/Wert, Rot nur für Risiko/Schulden/Verlust. Ein großes dominantes Hauptmotiv, keine winzigen Dioramen, keine Neon-Tunnel, keine Sci-Fi-Korridore, kein Pixar, kein Clay.\n\nTEXTREGEL:\nNIEMALS Überschrift. NIEMALS Untertitel. NIEMALS ganzer Satz. Nur kurze deutsche Objekt-Beschriftungen, normalerweise 1–3 Wörter, direkt am passenden Objekt, klein bis mittelgroß. Keine englischen Wörter, keine Fantasietexte, keine zusätzlichen zufälligen Labels, keine Logos oder App-UI.\n`;

const flowInstruction = (fileName) => `GOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nWICHTIG:\nErzeuge GENAU EIN Bild. Danach SOFORT exakt wie oben umbenennen, Motiv + Beschriftungen + Dateiname prüfen und erst dann das nächste Bild erzeugen. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}\n${STYLE_BLOCK}\nBESCHRIFTUNGEN – EXAKT SO:\n- [1–3 WÖRTER DIREKT AM OBJEKT]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nSZENENINHALT:\n[KONKRETES GROSSES HAUPTMOTIV + KLARE HANDLUNG EINFÜGEN]\n\nBILDAUSSAGE:\n[VOLLSTÄNDIGEN SPRECHSATZ / KERNAUSSAGE EINFÜGEN]\n\nKOMPOSITION:\n[2–5 GROSSE KLARE ELEMENTE; LABELS DIREKT AN OBJEKTEN; KEINE HEADLINE]\n`;

const coverPrompt = `${flowInstruction('Bild 00 - [KURZER COVER-NAME].png')}\n${STYLE_BLOCK}\nCOVER-REGEL:\nKeine klassische Überschrift. Das Thema muss über Motiv + kurze Objekt-Beschriftungen verständlich werden.\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [THEMA ALS KURZES OBJEKT-LABEL]\n- [OPTIONALE KURZE STRUKTUR-LABELS]\n\nSZENENINHALT:\n[STARKES GROSSES COVER-HAUPTMOTIV, DAS DAS THEMA DIREKT ERKLÄRT]\n`;

const worldPrompt = `FINANZNEO WORLD REFERENCE\n\nFINANZNEO_WORLD_ID: ${WORLD_ID}\n\nPremium stylized 3D CGI finance illustration. Dark charcoal-to-deep-green environment, controlled emerald rim lighting, soft floor shadows, polished materials, gold only for money/value, red only for risk. Large clear hero objects. No tiny diorama, no neon tunnel, no sci-fi corridor, no Pixar, no clay. Text style: only small-to-medium short German object labels, never headline/subtitle/sentence.\n`;

const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Fließtext fürs Voiceover\n- 02-audio = fertiges Audio\n- 03-szenen = Cover, Bildprompts, Szenen, fertige Nutzerbilder\n- 04-caption = Caption + Wort-Timings\n- 05-projektdateien = Animationen, Recherche, Technik\n\nDer Nutzer erstellt alle tatsächlichen Bilder selbst. Antigravity generiert keine Bilder.\n`);

write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nErst wenn alle Bilder einzeln erzeugt, sofort korrekt benannt und geprüft sind, alle gemeinsam hier hineinlegen. Animationsszenen erhalten kein Bild; ihre Nummer bleibt reserviert.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nGoogle Flow: 1 Bild erzeugen → sofort umbenennen → Motiv + kurze deutsche Objekt-Labels prüfen → erst dann nächstes Bild. Keine Überschrift, kein Untertitel und kein ganzer Satz im generierten Bild.\n');
write('04-caption/caption.txt', '[SOCIAL CAPTION EINFÜGEN]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:1,fps:30,subtitleMode:'sentence-with-audio-synced-active-word',activeWordColor:'finance-green',sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- 1080 × 1920\n- 30 fps\n- Bilder: Premium Dark 3D Finance\n- nur kurze deutsche Objekt-Beschriftungen\n- keine Headline/Untertitel/Sätze im KI-Bild\n- Bilddarstellung in Remotion: contain\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
write('05-projektdateien/timeline.json', `${JSON.stringify({version:1,title,fps:30,timingSource:'04-caption/word-timings.json',cutRule:'voice-sentence-start',scenes:types.map((type,index)=>({id:`scene-${num(index)}`,type,startFrame:0,durationFrames:0,cutReason:'voice-sentence-start'}))}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const number = num(index);
  const id = `scene-${number}`;
  const dir = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${dir}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n\n**Sprechtext:** [EINFÜGEN]\n\n${type === 'image' ? `**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Erlaubte Objekt-Beschriftungen:** [EINFÜGEN]\n` : `**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n`}`);

  const common = {id,type,startFrame:0,durationFrames:0,cutReason:'voice-sentence-start',directory:`EINZELNE-SZENEN/${id}`,headline:'[EINFÜGEN]',accent:'[EINFÜGEN]',icon:'[EINFÜGEN]'};
  if (type === 'image') {
    write(`${dir}/bildprompt.txt`, imagePrompt(id, index));
    return {...common,planFile:`EINZELNE-SZENEN/${id}/bildprompt.txt`,googleFlowFileName:sceneFileName(index),objectLabels:['[EINFÜGEN]'],expectedVisual:'[EINFÜGEN]',imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true}};
  }
  write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n`);
  return {...common,planFile:`EINZELNE-SZENEN/${id}/remotion.md`};
});

const allSections = types.map((type,index) => {
  const number = num(index);
  if (type === 'animation') return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`, index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nVERBINDLICH:\n1 Bild erzeugen → sofort umbenennen → Motiv + Objekt-Labels prüfen → erst dann nächstes Bild.\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nNIEMALS Headline/Untertitel/Satz im generierten Bild. Nur die direkt am Prompt festgelegten kurzen deutschen Objekt-Beschriftungen.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn alle benötigten Bilder fertig, korrekt benannt und geprüft sind, alle gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:9,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{generationMode:'one-image-at-a-time',fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false},
  imageWorld:{id:WORLD_ID,style:'premium-dark-3d-finance',objectLabelsOnly:true,headlinesInGeneratedImagesForbidden:true,subtitlesInGeneratedImagesForbidden:true,sentencesInGeneratedImagesForbidden:true,tinyDioramaForbidden:true,neonTunnelForbidden:true},
  timelineRules:{timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,equalLengthScenesForbiddenByDefault:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  imagePresentationContract:{imageFit:'contain',maxIntentionalImageScale:1.04,maxSourceCropPerSide:0.2,maxSourceCropTotal:0.34,blurredImageBackgroundForbidden:true},
  scenes
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Bilder: Premium Dark 3D · nur kurze deutsche Objekt-Beschriftungen · keine Headline/Sätze');
console.log('  Antigravity generiert keine Bilder; der Nutzer erstellt sie selbst.');
