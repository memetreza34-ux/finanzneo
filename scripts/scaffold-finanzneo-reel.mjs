#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  CAPTION_DIRECTORY,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  PLATFORM_PUBLISHING_FILES,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  REEL_VIDEO_ASPECT_RATIO,
  SUBTITLE_MODE,
  WORLD_ID as CONTRACT_WORLD_ID,
} from './lib/reel-contract.mjs';

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

const WORLD_ID = CONTRACT_WORLD_ID;
const num = (index) => String(index + 1).padStart(2, '0');
const sceneFileName = (index) => `Bild ${num(index)} - [KURZER SZENENNAME].png`;
const coverFileName = 'Bild 00 - [KURZER COVER-NAME].png';

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nFORMAT LOCK:\nCreate a square 1:1 source image only. Width and height must be equal. No portrait or vertical format.\n\nSAME-WORLD LOCK:\nKeep the exact same FinanzNeo art direction across the complete image series. Preserve the same deep charcoal green-black background material and gradient character, emerald rim-light signature, rounded geometry language, bevel softness, matte/glass material finish, color roles, contrast level and premium editorial 3D rendering quality in every image. Do not reinterpret the series as a new style between images. Subjects may change, but they must always look as if they exist in the same visual universe. If a recurring person is specified, preserve the same stylized appearance across all of that person's scenes.\n\nVERBINDLICHER BILDSTIL:\nPremium fintech editorial 3D render style. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for euro coins, cash and financial value. Warm red-orange only for loss, debt, danger or blocked money. Use smooth rounded 3D geometry, soft bevelled edges, premium matte and glass materials, confident high-contrast studio lighting with bold emerald rim light.\n\nVISUAL LANGUAGE:\nUse ONE dominant visual metaphor and only a few supporting elements. A stylized anonymous 3D adult person may stand beside the metaphor only when useful. If a person appears, the face must be clearly visible with stylized eyes, nose and mouth; prefer front-facing or a natural three-quarter view. No faceless mannequin, hidden face or back-view-only person.\n\nTEXT RULE:\nNo headline. No subtitle. No explanatory sentence. Only explicitly requested short German object labels, normally 1–3 words, directly near the objects they describe.\n\nBACKGROUND RULE:\nUse ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image. Keep the same continuous material, tone and gradient from edge to edge. NO horizontal divisions. NO separate zones. NO dark band at any edge. NO floor-wall boundary. NO horizon line. NO studio wall split. NO panel background. NO layered backdrop. Use only one subtle continuous gradient or vignette. Do not create a visible floor, wall or studio horizon. Objects may cast soft contact shadows. Place the main subject around the visual center and leave balanced natural breathing room around it WITHOUT changing the background.\n\nFORBIDDEN:\nNo portrait or vertical source image, no percentage-based zones, no photorealism, no real identifiable human, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no clutter, no giant typography, no full sentence, no random labels, no Pixar, no clay.\n`;

const FLOW_AGENT_BLOCK = `${FLOW_AGENT_PROTOCOL_MARKER}\n\nSTRIKTER ARBEITSMODUS FÜR DEN GOOGLE-FLOW-KI-AGENTEN:\n1. Lies die gesamte Datei einmal, arbeite danach aber strikt von oben nach unten immer nur am aktuellen Bildblock.\n2. Erzeuge GENAU EIN Bild. Starte niemals mehrere Bilder gleichzeitig und bereite das nächste Bild nicht vor.\n3. Warte, bis dieses eine Bild vollständig erzeugt ist.\n4. Benenne es SOFORT exakt mit dem beim Bildblock angegebenen finalen Dateinamen um.\n5. Prüfe, ob die Datei unter exakt diesem Namen vorhanden ist.\n6. Prüfe Motiv, erlaubte Labels, sichtbares Gesicht falls Person, nahtlosen Einzelhintergrund und Same-World-Lock.\n7. Wenn eine Prüfung scheitert: Erzeuge DIESELBE Bildnummer neu, ersetze die fehlerhafte Datei und wiederhole Schritt 3 bis 6. Gehe nicht weiter.\n8. Erst nach bestandener Prüfung und korrekter Umbenennung darf der nächste Bildblock beginnen.\n9. Bei "KEIN BILD XX ERZEUGEN" die Nummer ohne Generierung überspringen.\n10. Nach Abschluss müssen alle erzeugten und exakt benannten Bilder gemeinsam in 03-szenen/00-ALLE-BILDER-HIER-REIN/ liegen. Keine Szenen-Unterordner anlegen.\n`;

const flowInstruction = (fileName) => {
  const styleReference = fileName.startsWith('Bild 00')
    ? 'Nach bestandener QA ist dieses Cover die verbindliche visuelle Stilreferenz für alle folgenden Bilder. Nutze nur seine Bildwelt, Materialien, Geometriesprache, Farbrollen und Lichtsignatur als Referenz.'
    : 'Vergleiche die Bildwelt mit dem freigegebenen Bild 00 und halte dessen Stil, Materialien, Geometriesprache, Farbrollen und Lichtsignatur konstant. Übernimm NICHT Motiv, Komposition oder Labels des Covers.';

  return `${FLOW_AGENT_PROTOCOL_MARKER}\nAKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN\n\nGOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nErzeuge jetzt ausschließlich dieses eine Bild. Warte auf das Ergebnis, benenne es sofort exakt wie oben um und prüfe erst danach Motiv + Beschriftungen + Gesicht (falls Person) + Hintergrund + Same-World-Lock + Dateiname. ${styleReference} Bei einem Fehler dieselbe Bildnummer neu erzeugen. Erst nach bestandener Prüfung das nächste Bild beginnen. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;
};

const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nBILDPROMPT:\nShow [ONE LARGE DOMINANT VISUAL METAPHOR FOR ${id}]. [DESCRIBE ONE CLEAR CAUSE-AND-EFFECT ACTION USING ONLY A FEW LARGE OBJECTS]. Optionally include a stylized adult person only when the person improves the explanation; if included, keep the face clearly visible in front-facing or natural three-quarter view. Include German object labels: [PLACE EACH SHORT LABEL DIRECTLY BESIDE THE RELEVANT OBJECT].\n\n${STYLE_BLOCK}\n`;

const coverPrompt = `${flowInstruction(coverFileName)}\nCOVER-REGEL:\nKeine klassische Überschrift. Thema über EIN starkes Hauptmotiv + wenige kurze Objekt-Beschriftungen erklären.\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [THEMA ALS KURZES OBJEKT-LABEL]\n- [OPTIONALE KURZE STRUKTUR-LABELS]\n\nBILDPROMPT:\nShow [ONE LARGE DOMINANT COVER METAPHOR] that communicates the core idea of the reel in one clear visual. Optionally include a stylized adult person only when useful; if included, keep the face clearly visible. Include only the specified short German object labels directly beside their objects.\n\n${STYLE_BLOCK}\n`;

const worldPrompt = `FINANZNEO WORLD REFERENCE\n\n${STYLE_BLOCK}`;

const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Fließtext fürs Voiceover\n- 02-audio = fertiges Audio\n- 03-szenen = Cover, Bildprompts, Szenen, fertige Nutzerbilder\n- 04-caption = Master-Caption, Reel-Plattformtexte und Wort-Timings\n- 05-projektdateien = Animationen, Recherche, Technik\n\n3 Phasen:\n1. ChatGPT vervollständigt Recherche, Skript, Szenenplan, Prompts und Captions.\n2. Der Nutzer erstellt Google-Flow-Bilder und finales Audio; danach echte Wort-Zeitstempel.\n3. Mit \`npm run reel:ready -- ${targetArg}\` prüfen. Bei Erfolg baut Antigravity das Reel ohne Zwischenfragen.\n\nDer Nutzer erstellt alle tatsächlichen Bilder selbst. Antigravity generiert keine Bilder.\n\nYouTube Shorts werden nicht erzeugt. YouTube ist ausschließlich ein separater Longform-Bereich unter youtube/.\n`);
write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nDer Google-Flow-Agent arbeitet ausschließlich aus `03-szenen/alle-bildprompts.txt`: genau ein Bild erzeugen → vollständig abwarten → sofort exakt umbenennen → prüfen → erst dann das nächste Bild. Bei Fehlern dieselbe Bildnummer neu erzeugen. Nach Abschluss liegen alle Bilder gemeinsam in diesem Ordner. Animationsszenen erhalten kein Bild; ihre Nummer bleibt reserviert.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nEinzige Übergabedatei an den Google-Flow-KI-Agenten: `alle-bildprompts.txt`. Ablauf: genau 1 Bild erzeugen → vollständig abwarten → sofort exakt umbenennen → Motiv + Labels + Gesicht + nahtlosen Hintergrund + Same-World-Lock prüfen → erst dann nächstes Bild. Bei Fehlern dieselbe Nummer neu erzeugen. Keine Prozent-Zonen; ein durchgehender Hintergrund von oben bis unten.\n');
write('04-caption/caption.txt', '[GEPRÜFTE MASTER-CAPTION / GEMEINSAME FAKTENBASIS EINFÜGEN]\n');
write('04-caption/instagram-reels.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n\nANGEHEFTETER KOMMENTAR:\n[OPTIONAL]\n');
write('04-caption/tiktok.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/facebook-reels.txt', 'REEL-TEXT:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/snapchat.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[OPTIONAL]\n\nQUELLEN / HINWEIS:\n[NUR WENN NÖTIG]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:30,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1: Inhalt, Fakten, Skript, Szenen, Prompts und Plattformtexte vollständig\n- [ ] Phase 2: alle exakt benannten Bilder, genau ein finales Voiceover und echte Wort-Zeitstempel vorhanden\n- [ ] Phase 3: \`npm run reel:ready -- ${targetArg}\` erfolgreich; technische Produktion und QA abgeschlossen\n\nDie Checkboxen sind Dokumentation. Technische Autorität für den Start von Phase 3 ist ausschließlich \`reel:ready\`.\n`);
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- Reel-Video: 1080 × 1920, 9:16\n- Google-Flow-Quellbilder: immer quadratisch 1:1\n- 30 fps\n- Premium Fintech Editorial 3D\n- eine starke Metapher pro Bild\n- Person optional; wenn vorhanden Gesicht sichtbar\n- nur kurze deutsche Objekt-Beschriftungen\n- ein einziger nahtloser Hintergrund; keine Prozent-Zonen/Bänder\n- keine Headline/Untertitel/Sätze im KI-Bild\n- 1:1-Bilddarstellung im 9:16-Reel: contain\n- Publishing-Dateien nur für Instagram Reels, TikTok, Facebook Reels und Snapchat in 04-caption\n- keine YouTube Shorts; YouTube ausschließlich Longform unter youtube/\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
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

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN\n\n${FLOW_AGENT_BLOCK}\n\nBILDNUMMERIERUNG:\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nBildwelt: eine starke Premium-Fintech-3D-Metapher, optional Person mit sichtbarem Gesicht, kurze deutsche Labels, EIN nahtloser Hintergrund ohne Bänder/Zonen und EIN unveränderter Same-World-Lock für die gesamte Serie.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende den Auftrag erst, wenn jedes erwartete Bild einzeln erzeugt, exakt umbenannt und geprüft wurde. Danach müssen alle Bilder gemeinsam hier liegen:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:12,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  video:{aspectRatio:REEL_VIDEO_ASPECT_RATIO,width:1080,height:1920,fps:30},
  cover:{type:'image',googleFlowFileName:coverFileName,planFile:'03-szenen/00-cover/cover.txt'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,generationMode:'one-image-at-a-time',strictSequential:true,waitForCurrentImage:true,renameBeforeNext:true,qaBeforeNext:true,retrySameImageOnFailure:true,fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,squareGeneratedImagesRequired:true,referencePromptFile:'03-szenen/bildwelt.txt',styleReferenceStrategy:'approved-cover-style-only',style:'premium-fintech-editorial-3d-metaphor',sameWorldAcrossSeriesRequired:true,stylizedPersonAllowed:true,visibleFaceRequiredWhenPersonPresent:true,objectLabelsOnly:true,seamlessSingleBackgroundRequired:true,percentageZonesForbidden:true,floorWallBoundaryForbidden:true,horizonLineForbidden:true,backgroundBandsForbidden:true,headlinesInGeneratedImagesForbidden:true,subtitlesInGeneratedImagesForbidden:true,sentencesInGeneratedImagesForbidden:true,tinyDioramaForbidden:true,neonTunnelForbidden:true},
  platformPublishing:{directory:CAPTION_DIRECTORY,...PLATFORM_PUBLISHING_FILES},
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
console.log(`  Phase-3-Prüfung: npm run reel:ready -- ${targetArg}`);
