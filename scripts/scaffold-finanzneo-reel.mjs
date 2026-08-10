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

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nVERBINDLICHER BILDSTIL:\nPremium fintech editorial 3D render style. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for euro coins, cash and financial value. Warm red-orange only for loss, debt, danger or blocked money. Use smooth rounded 3D geometry, soft bevelled edges, premium matte and glass materials, confident high-contrast studio lighting with bold emerald rim light.\n\nVISUAL LANGUAGE:\nUse ONE dominant visual metaphor and only a few supporting elements. A stylized anonymous 3D adult person may stand beside the metaphor when useful. If a person appears, the face must be clearly visible with stylized eyes, nose and mouth; prefer front-facing or a natural three-quarter view. No faceless mannequin, hidden face or back-view-only person.\n\nTEXT RULE:\nNo headline. No subtitle. No explanatory sentence. Only explicitly requested short German object labels, normally 1–3 words, directly near the objects they describe.\n\nBACKGROUND RULE:\nUse ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image. Keep the same continuous material, tone and gradient from the top edge to the bottom edge. NO horizontal divisions. NO visible top section. NO visible bottom section. NO separate zones. NO dark band at the top or bottom. NO floor-wall boundary. NO horizon line. NO studio wall split. NO panel background. NO layered backdrop. Use only one subtle continuous gradient or vignette. Do not create a visible floor, wall or studio horizon. Objects may cast soft contact shadows. Place the main subject around the visual center and leave generous natural empty space above and below WITHOUT changing the background.\n\nFORBIDDEN:\nNo percentage-based top/middle/bottom zones, no photorealism, no real identifiable human, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no clutter, no giant typography, no full sentence, no random labels, no Pixar, no clay.\n`;

const flowInstruction = (fileName) => `GOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nWICHTIG:\nErzeuge GENAU EIN Bild. Danach SOFORT exakt wie oben umbenennen, Motiv + Beschriftungen + Gesicht (falls Person) + Hintergrund + Dateiname prüfen und erst dann das nächste Bild erzeugen. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}\n${STYLE_BLOCK}\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nBILDPROMPT:\nA stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE DOMINANT VISUAL METAPHOR FOR ${id}]. [DESCRIBE ONE CLEAR CAUSE-AND-EFFECT ACTION USING ONLY A FEW LARGE OBJECTS]. Include German object labels: [PLACE EACH SHORT LABEL DIRECTLY BESIDE THE RELEVANT OBJECT]. ${STYLE_BLOCK}\n`;

const coverPrompt = `${flowInstruction('Bild 00 - [KURZER COVER-NAME].png')}\n${STYLE_BLOCK}\nCOVER-REGEL:\nKeine klassische Überschrift. Thema über EIN starkes Hauptmotiv + wenige kurze Objekt-Beschriftungen erklären.\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [THEMA ALS KURZES OBJEKT-LABEL]\n- [OPTIONALE KURZE STRUKTUR-LABELS]\n\nBILDPROMPT:\nA stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE DOMINANT COVER METAPHOR]. [SHOW THE CORE IDEA OF THE REEL IN ONE CLEAR VISUAL]. Include only the specified short German object labels directly beside their objects. ${STYLE_BLOCK}\n`;

const worldPrompt = `FINANZNEO WORLD REFERENCE\n\n${STYLE_BLOCK}`;

const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Fließtext fürs Voiceover\n- 02-audio = fertiges Audio\n- 03-szenen = Cover, Bildprompts, Szenen, fertige Nutzerbilder\n- 04-caption = Master-Caption, Reel-Plattformtexte und Wort-Timings\n- 05-projektdateien = Animationen, Recherche, Technik\n\nDer Nutzer erstellt alle tatsächlichen Bilder selbst. Antigravity generiert keine Bilder.\n\nYouTube Shorts werden nicht erzeugt. YouTube ist ausschließlich ein separater Longform-Bereich unter youtube/.\n`);
write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nErst wenn alle Bilder einzeln erzeugt, sofort korrekt benannt und geprüft sind, alle gemeinsam hier hineinlegen. Animationsszenen erhalten kein Bild; ihre Nummer bleibt reserviert.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nGoogle Flow: 1 Bild erzeugen → sofort umbenennen → Motiv + Labels + Gesicht + nahtlosen Hintergrund prüfen → erst dann nächstes Bild. Keine Prozent-Zonen; ein durchgehender Hintergrund von oben bis unten.\n');
write('04-caption/caption.txt', '[GEPRÜFTE MASTER-CAPTION / GEMEINSAME FAKTENBASIS EINFÜGEN]\n');
write('04-caption/instagram-reels.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n\nANGEHEFTETER KOMMENTAR:\n[OPTIONAL]\n');
write('04-caption/tiktok.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/facebook-reels.txt', 'REEL-TEXT:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/snapchat.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[OPTIONAL]\n\nQUELLEN / HINWEIS:\n[NUR WENN NÖTIG]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:1,fps:30,subtitleMode:'sentence-with-audio-synced-active-word',activeWordColor:'finance-green',sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- 1080 × 1920\n- 30 fps\n- Premium Fintech Editorial 3D\n- eine starke Metapher pro Bild\n- Person optional; wenn vorhanden Gesicht sichtbar\n- nur kurze deutsche Objekt-Beschriftungen\n- ein einziger nahtloser Hintergrund; keine Prozent-Zonen/Bänder\n- keine Headline/Untertitel/Sätze im KI-Bild\n- Bilddarstellung in Remotion: contain\n- Publishing-Dateien nur für Instagram Reels, TikTok, Facebook Reels und Snapchat in 04-caption\n- keine YouTube Shorts; YouTube ausschließlich Longform unter youtube/\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
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

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nVERBINDLICH:\n1 Bild erzeugen → sofort umbenennen → Motiv + Objekt-Labels + Gesicht + nahtlosen Hintergrund prüfen → erst dann nächstes Bild.\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nBildwelt: eine starke Premium-Fintech-3D-Metapher, optional Person mit sichtbarem Gesicht, kurze deutsche Labels, EIN nahtloser Hintergrund ohne Bänder/Zonen.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn alle benötigten Bilder fertig, korrekt benannt und geprüft sind, alle gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:12,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{generationMode:'one-image-at-a-time',fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false},
  imageWorld:{id:WORLD_ID,referencePromptFile:'03-szenen/bildwelt.txt',style:'premium-fintech-editorial-3d-metaphor',stylizedPersonAllowed:true,visibleFaceRequiredWhenPersonPresent:true,objectLabelsOnly:true,seamlessSingleBackgroundRequired:true,percentageZonesForbidden:true,floorWallBoundaryForbidden:true,horizonLineForbidden:true,backgroundBandsForbidden:true,headlinesInGeneratedImagesForbidden:true,subtitlesInGeneratedImagesForbidden:true,sentencesInGeneratedImagesForbidden:true,tinyDioramaForbidden:true,neonTunnelForbidden:true},
  platformPublishing:{directory:'04-caption',masterCaption:'04-caption/caption.txt',instagramReels:'04-caption/instagram-reels.txt',tiktok:'04-caption/tiktok.txt',facebookReels:'04-caption/facebook-reels.txt',snapchat:'04-caption/snapchat.txt'},
  timelineRules:{timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,equalLengthScenesForbiddenByDefault:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  imagePresentationContract:{imageFit:'contain',maxIntentionalImageScale:1.04,maxSourceCropPerSide:0.2,maxSourceCropTotal:0.34,blurredImageBackgroundForbidden:true},
  scenes
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Bilder: Premium Fintech Editorial 3D · sichtbares Gesicht bei Personen · EIN nahtloser Hintergrund');
console.log('  Publishing: Instagram Reels · TikTok · Facebook Reels · Snapchat');
console.log('  YouTube: ausschließlich eigenständige Longform-Videos unter youtube/');
console.log('  Antigravity generiert keine Bilder; der Nutzer erstellt sie selbst.');