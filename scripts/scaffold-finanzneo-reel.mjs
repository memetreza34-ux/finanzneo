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
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields} from './lib/flow-autonomy.mjs';
import {DEFAULT_PHASE3_EXECUTOR} from './lib/reel-scene-schema.mjs';

const STYLIZED_3D_LOCK_ID = 'finanzneo-stylized-3d-editorial-v5';
const PHYSICAL_EXPLAINER_LOCK_ID = 'finanzneo-physical-explainer-editorial-v7';

// Standard sind 15 Beats: 9 Bild, 6 Animation (60/40).
const DEFAULT_TYPES = [
  'image', 'animation', 'image', 'animation', 'image',
  'animation', 'image', 'image', 'animation', 'image',
  'animation', 'image', 'image', 'animation', 'image',
];
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
if (types.length < 5 || types.length > 20 || types.some((t) => !['image', 'animation'].includes(t))) {
  console.error('Szenentypen: 5–20 Einträge, nur image oder animation.');
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

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n${SERIES_LOCK_MARKER}\nSTYLIZED_3D_LOCK: ${STYLIZED_3D_LOCK_ID}\nPHYSICAL_EXPLAINER_LOCK: ${PHYSICAL_EXPLAINER_LOCK_ID}\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nFORMAT LOCK:\nCreate a square 1:1 source image only. Width and height must be equal. No portrait or vertical format. Bild 00 is also a square 1:1 Flow source image; 9:16 is created only in Remotion.\n\nWRITTEN SAME-WORLD LOCK:\nKeep the same written FinanzNeo art direction in every image: deep charcoal green-black seamless world, premium dark-emerald polymer/brushed metal, warm cream modeled card surfaces, chunky gold value details, restrained glass, smooth rounded geometry, soft bevels, cinematic soft key light and controlled emerald rim light. Every scene gets its own fresh composition. Kein vorheriges Bild als Bildreferenz verwenden; keine Bildreferenz hochladen oder anhängen.\n\nVERBINDLICHER BILDSTIL:\nCreate a CLEARLY STYLIZED premium 3D CGI financial editorial explainer using recognizable everyday objects. Use chunky substantial volume, rounded forms, simplified slightly exaggerated proportions, clear foreground/midground/background depth, strong soft contact shadows and mild depth-of-field. The scene must instantly read as designed 3D CGI, not as a photographed office still-life.\n\nPHYSICAL EXPLAINER COMPOSITION:\nUse ONE large PHYSICAL hero object as the dominant subject and 3–6 supporting recognizable physical objects that are specific to the topic. Arrange them naturally and asymmetrically with overlap and contact shadows. Prefer concrete everyday objects over generic icons. Do not arrange modules in four corners or in a circular orbit.\n\nTEXT RULE:\nNo headline. No subtitle. No explanatory sentence. No CTA. Only explicitly requested short German object labels, normally 1–3 words, attached physically as a tag, plaque, sticker or small sign on/near the relevant object. Never render labels as floating UI badges or glowing chips.\n\nBACKGROUND RULE:\nUse ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image. Keep the same continuous material, tone and gradient from edge to edge. NO horizontal divisions. NO separate zones. NO floor-wall boundary. NO horizon line. NO studio wall split. NO panel background. Use only one subtle continuous gradient or vignette. Objects may cast soft contact shadows without creating a visible floor plane.\n\nFORBIDDEN:\nNOT photorealistic. No realistic office/stationery/product photography. No real identifiable human. No dashboard, app screen, control panel, floating UI cards, tiles, chips, app widgets or HUD elements. No microchip or circuit-board visual language. No gameboard, satellite-module orbit, four-corner mini-tile layout, glowing line network, abstract finance-flow network, tiny isometric diorama, neon tunnel, sci-fi corridor, repeated contract walls, wealth towers, monoliths, sterile product-ad composition, giant typography, full sentence, random labels, Pixar, clay or toy look.\n`;

const flowInstruction = (fileName) => `${FLOW_AGENT_PROTOCOL_MARKER}\nAKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN\n\nGOOGLE FLOW – FINALER DATEINAME:\n${fileName}\n\nErzeuge jetzt ausschließlich dieses eine Bild. Warte vollständig, benenne es SOFORT exakt wie oben um und prüfe danach Motiv + Labels + Physical-Explainer-Komposition + klaren Stylized-3D-Look + Hintergrund + Dateiname. Keine Bildreferenz verwenden. Jede Szene bekommt eine eigene frische Komposition. Bei einem Fehler Erzeuge DIESELBE Bildnummer neu. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nBILDPROMPT:\nCreate a CLEARLY STYLIZED premium 3D CGI scene for ${id}. Show [ONE LARGE RECOGNIZABLE PHYSICAL FINANCIAL HERO OBJECT] with 3–6 supporting recognizable physical objects specific to the topic. [DESCRIBE ONE CLEAR CAUSE-AND-EFFECT ACTION]. Make the idea understandable in under two seconds. If a person is useful, include a stylized adult with a clearly visible face; otherwise prefer the physical objects alone. Include only the specified short German physical object labels.\n\n${STYLE_BLOCK}\n`;

const coverPrompt = `${flowInstruction(coverFileName)}\nCOVER-REGEL:\nKeine klassische Überschrift. Thema über EIN starkes physisches stylized-3D-Hauptmotiv + 3–6 konkrete unterstützende Objekte + wenige kurze Objektlabels erklären. Auch Bild 00 bleibt als Google-Flow-Quelle strikt 1:1.\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES THEMA-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nBILDPROMPT:\nCreate a CLEARLY STYLIZED premium 3D CGI cover using one instantly understandable PHYSICAL financial hero object and 3–6 recognizable supporting physical objects. Use chunky modeled objects, visible depth and a strong cause/effect relationship. Include only the specified short German physical object labels. If a person is useful, the stylized face must be clearly visible.\n\n${STYLE_BLOCK}\n`;

const worldPrompt = `FINANZNEO WORLD REFERENCE — WRITTEN STYLE LOCK ONLY\n\n${STYLE_BLOCK}`;

const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Fließtext fürs Voiceover\n- 02-audio = fertiges Audio\n- 03-szenen = Cover, Bildprompts, Szenen, fertige Nutzerbilder\n- 04-caption = Master-Caption, Reel-Plattformtexte und Wort-Timings\n- 05-projektdateien = Animationen, Recherche, Technik\n- 06-export = fertiges Upload-Paket (erzeugt \`npm run reel:export\`, nicht von Hand pflegen)\n\n3 Phasen:\n1. ChatGPT vervollständigt Recherche, Skript, Szenenplan, Prompts, Zwischenüberschriften/Icons und Captions.\n2. Der Nutzer erstellt Google-Flow-Bilder und finales Audio; danach echte Wort-Zeitstempel.\n3. Mit \`npm run reel:ready -- ${targetArg}\` prüfen. Bei Erfolg baut der in scene-index festgelegte Executor das Reel ohne Zwischenfragen und schließt mit einem sicheren \`reel:export\` ab.\n\nZiel: ungefähr 60 % Bildbeats / 40 % native Remotion-Animationen, aber kein statisches Bild länger als 6 Sekunden.\n`);
write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nGoogle Flow: genau ein Bild erzeugen → vollständig warten → sofort exakt umbenennen → Physical-Explainer + Stylized-3D-Look + Aussage + Labels + Hintergrund prüfen → erst dann das nächste Bild. Keine Bildreferenzen. Animationsszenen erhalten kein Bild.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nEinzige Bild-Übergabedatei: `alle-bildprompts.txt`. Keine Bildreferenzen. Jede Bildszene eigenständig, aber mit identischem ausgeschriebenem Same-World-, Stylized-3D- und Physical-Explainer-Lock. Jede Reel-Szene braucht eine kurze, mittige, grüne Zwischenüberschrift, die die Szenenaussage trifft, plus ein eigenes passendes Icon.\n');
write('04-caption/caption.txt', '[GEPRÜFTE MASTER-CAPTION / GEMEINSAME FAKTENBASIS EINFÜGEN]\n');
write('04-caption/instagram-reels.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n\nANGEHEFTETER KOMMENTAR:\n[OPTIONAL]\n');
write('04-caption/tiktok.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/facebook-reels.txt', 'REEL-TEXT:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/snapchat.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[OPTIONAL]\n\nQUELLEN / HINWEIS:\n[NUR WENN NÖTIG]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:30,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', '# ANIMATIONEN\n\nJede Animation: STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS. Farben: weiß neutral, grün Fokus/Lösung, rot Problem/Warnung, gold Geld/Wert; kein schwarzer Text auf dunklem Hintergrund.\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\nFür jede Szene festlegen: Typ, Sprechbeat, Zwischenüberschrift, Icon, Hauptaussage. Bildbeats max. 6 Sekunden.\n\nVerbindlich:\n- Zwischenüberschrift mittig und in FinanzNeo-Grün; sie sagt, worum es in DIESER Szene geht (nicht das Reel-Thema)\n- jede Szene bekommt ein eigenes, inhaltlich passendes Icon\n- Untertitel enden an der Szenengrenze: kein Wort der nächsten Szene darf vorher sichtbar sein\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1: Inhalt, Fakten, Skript, Szenen, Prompts, Zwischenüberschriften/Icons und Plattformtexte vollständig\n- [ ] Phase 2: alle exakt benannten Bilder, genau ein finales Voiceover und echte Wort-Zeitstempel vorhanden\n- [ ] Phase 3: \`npm run reel:ready -- ${targetArg}\` erfolgreich; technische Produktion und QA abgeschlossen\n`);
write('05-projektdateien/technische-hinweise.md', '# TECHNISCHE HINWEISE\n\n- Reel: 1080 × 1920, 9:16, 30 fps\n- Flow-Bilder inklusive Cover: 1:1, contain, keine Bildreferenz\n- Stylized 3D V5 + Physical Explainer Editorial V7\n- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s\n- jede Szene: SceneHeader + passendes Icon\n- Captions: aktives Wort grün, Rest weiß, satzbasiert, kein Jump/Scale\n- Animation: START → MECHANISMUS → ERGEBNIS\n- Animationsfarben: weiß/grün/rot/gold; kein Schwarz auf dunkel\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
write('05-projektdateien/timeline.json', `${JSON.stringify({version:2,title,fps:30,timingSource:'04-caption/word-timings.json',cutRule:'voice-sentence-or-meaningful-phrase-start',sceneCount:types.length,scenes:[]}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const number = num(index);
  const id = `scene-${number}`;
  const dir = `03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${dir}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n**Zwischenüberschrift:** [EINFÜGEN — mittig, grün, sagt die Kernaussage DIESER Szene]\n**Icon:** [EINFÜGEN — eigenes, inhaltlich passendes Icon]\n**Sprechtext:** [EINFÜGEN — nur die Wörter dieser Szene; kein Vorgreifen]\n\n${type === 'image' ? `**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Erlaubte kurze Objektlabels:** [EINFÜGEN]\n` : `**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n**Animation:** START → MECHANISMUS → ERGEBNIS; kein schwarzer Text auf dunklem Hintergrund.\n`}`);

  const common = {
    id,
    type,
    startFrame:0,
    durationFrames:0,
    cutReason:'voice-sentence-or-meaningful-phrase-start',
    directory:`EINZELNE-SZENEN/${id}`,
    headline:'[EINFÜGEN]',
    icon:'[EINFÜGEN]',
    accent:'finance-green',
    headerTone:'default',
  };

  if (type === 'image') {
    write(`${dir}/bildprompt.txt`, imagePrompt(id, index));
    return {
      ...common,
      planFile:`EINZELNE-SZENEN/${id}/bildprompt.txt`,
      googleFlowFileName:sceneFileName(index),
      objectLabels:['[EINFÜGEN]'],
      expectedVisual:'[EINFÜGEN]',
      imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true},
    };
  }

  write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n**Zwischenüberschrift:** [EINFÜGEN — mittig, grün, sagt die Kernaussage DIESER Szene]\n**Icon:** [EINFÜGEN — eigenes, inhaltlich passendes Icon]\n\n## STARTZUSTAND\n[EINFÜGEN]\n\n## SICHTBARER MECHANISMUS\n[EINFÜGEN]\n\n## ERGEBNIS\n[EINFÜGEN]\n\n## FARBEN\n- neutral: weiß\n- Fokus/Lösung: grün\n- Problem/Warnung: rot\n- Geld/Wert: gold\n- schwarzer Text auf dunklem Hintergrund: VERBOTEN\n\nAnimation muss ohne Ton grundlegend verständlich sein.\n`);
  return {...common,planFile:`EINZELNE-SZENEN/${id}/remotion.md`};
});

const allSections = types.map((type,index) => {
  const number = num(index);
  if (type === 'animation') return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`, index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt', `${AUTONOMY_BLOCK}\nFINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN\n\n${FLOW_AGENT_BLOCK}\n\nBILDNUMMERIERUNG:\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nJede Szene bekommt eine eigene frische Komposition. Keine Bildreferenz verwenden.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende den Auftrag erst, wenn jedes erwartete Bild einzeln erzeugt, exakt umbenannt und geprüft wurde. Danach müssen alle Bilder gemeinsam hier liegen:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:19,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  targetImageShare:0.6,
  targetAnimationShare:0.4,
  video:{aspectRatio:REEL_VIDEO_ASPECT_RATIO,width:1080,height:1920,fps:30},
  cover:{type:'image',googleFlowFileName:coverFileName,planFile:'03-szenen/00-cover/cover.txt',aspectRatio:'1:1'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  phase3Executor:DEFAULT_PHASE3_EXECUTOR,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,generationMode:'one-image-at-a-time',strictSequential:true,waitForCurrentImage:true,renameBeforeNext:true,qaBeforeNext:true,retrySameImageOnFailure:true,fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false,...flowAutonomyFields()},
  timingStandard:{imageSceneIdealSeconds:[3.5,5.5],imageSceneAbsoluteMaxSeconds:6,animationSceneIdealSeconds:[4.5,7],splitOrAnimateIfImageExceedsMax:true},
  clarityStandard:{mustReadInUnderSeconds:2,oneMainIdeaPerBeat:true,everydayMetaphorRequired:true,sceneHeaderRequired:true,sceneIconRequired:true,animationStartMechanismResultRequired:true,blackTextOnDarkForbidden:true},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,stylized3DLockId:STYLIZED_3D_LOCK_ID,physicalExplainerLockId:PHYSICAL_EXPLAINER_LOCK_ID,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,squareGeneratedImagesRequired:true,referencePromptFile:'03-szenen/bildwelt.txt',styleReferenceStrategy:'written-style-lock-only',referenceImageUse:'forbidden',style:'premium-stylized-3d-cgi-physical-financial-editorial-explainer',sameWorldAcrossSeriesRequired:true,stylizedPersonAllowed:true,visibleFaceRequiredWhenPersonPresent:true,objectLabelsOnly:true,physicalHeroObjectRequired:true,recognizableTopicObjectsRequired:true,supportingObjectsMin:3,supportingObjectsMax:6,physicalTagsRequiredWhenLabelsUsed:true,naturalAsymmetryRequired:true,seamlessSingleBackgroundRequired:true,percentageZonesForbidden:true,floorWallBoundaryForbidden:true,horizonLineForbidden:true,backgroundBandsForbidden:true,headlinesInGeneratedImagesForbidden:true,subtitlesInGeneratedImagesForbidden:true,sentencesInGeneratedImagesForbidden:true,tinyDioramaForbidden:true,neonTunnelForbidden:true,photorealisticOfficeLookForbidden:true,floatingUiTilesForbidden:true,microchipVisualLanguageForbidden:true,gameBoardCompositionForbidden:true,satelliteModuleOrbitForbidden:true,symmetricalFourCornerLayoutForbidden:true,digitalCentralScreenForbidden:true,genericIconButtonsAsMainObjectsForbidden:true,lineNetworkMainMotifForbidden:true,abstractFlowMainMotifForbidden:true},
  platformPublishing:{directory:CAPTION_DIRECTORY,...PLATFORM_PUBLISHING_FILES},
  timelineRules:{timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,cutsFollowSentenceStartsAndMeaningfulPhraseStarts:true,equalLengthScenesForbiddenByDefault:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  imagePresentationContract:{imageFit:'contain',maxIntentionalImageScale:1.04,maxSourceCropPerSide:0.2,maxSourceCropTotal:0.34,blurredImageBackgroundForbidden:true},
  subtitleDisplay:{mode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,normalWordColor:'white',maxLines:2,noDeadGaps:true,holdDuringPauses:true,noWordJump:true,noWordScale:true,goldActiveWordForbidden:true,blackTextForbidden:true,clipToSceneBoundary:true,crossSceneSpillForbidden:true,textStrokeForbidden:true,fontWeight:800,fontSize:50},
  sceneHeader:{required:true,align:'center',defaultIconColor:'finance-green',headlineColor:'finance-green',uniqueIconPerScene:true,mustStateSceneMessage:true,samePositionAcrossReel:true},
  animationColors:{neutral:'white',focus:'finance-green',warning:'red',money:'gold',blackOnDarkForbidden:true},
  layout:{headlineY:118,visualTop:390,visualBottom:1560,subtitleBottom:285,subtitleLeft:72,subtitleRight:140},
  transitionContract:{continuityFramesMax:4,imageEnterFrames:4,fadeToBlackForbidden:true},
  scenes
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log('  Bildwelt: Stylized 3D V5 + Physical Explainer Editorial V7 · keine Bildreferenzen · Cover/Szenen 1:1 · nahtloser Hintergrund');
console.log('  Reel-UI: mittige grüne Zwischenüberschrift + eigenes Icon je Szene · Captions grün/weiß');
console.log('  Untertitel: enden an der Szenengrenze · kein Vorgreifen · Weight 800 · 50 px · kein Stroke');
console.log('  Animationen: Start → Mechanismus → Ergebnis · weiß/grün/rot/gold · kein Schwarz auf dunkel');
console.log(`  Phase-3-Prüfung: npm run reel:ready -- ${targetArg}`);
