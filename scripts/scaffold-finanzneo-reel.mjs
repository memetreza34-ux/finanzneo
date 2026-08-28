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
import {
  ANIMATION_QUALITY_LOCK,
  DEFAULT_PHASE3_EXECUTOR,
} from './lib/reel-scene-schema.mjs';

const STYLIZED_3D_LOCK_ID = 'finanzneo-stylized-3d-editorial-v5';
const ANIMATED_WORLD_LOCK_ID = 'finanzneo-stylized-3d-animated-black-v9';
const LAYOUT_VERSION = 'finanzneo-reel-layout-v5';
const REEL_BACKGROUND_CONTRACT = 'finanzneo-pure-black-background-v1';
const V5_LAYOUT = {
  headlineY: 154,
  visualTop: 320,
  visualBottom: 1480,
  subtitleBottom: 340,
  subtitleLeft: 72,
  subtitleRight: 140,
};

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
const animationExportName = (index) => `Scene${num(index)}Animation`;

const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}\n${SERIES_LOCK_MARKER}\nSTYLIZED_3D_LOCK: ${STYLIZED_3D_LOCK_ID}\nPREMIUM_VISUAL_WORLD_LOCK: ${ANIMATED_WORLD_LOCK_ID}\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nSTYLE:\nCreate a clearly non-realistic stylized 3D animated finance scene. Use soft rounded geometry, simplified recognizable details, clean materials and a premium but slightly playful animated-movie feel. Keep the main idea easy to understand within 1–2 seconds.\n\nBACKGROUND:\nUse one seamless deep black background as a strict requirement. Keep it clean, minimal and uninterrupted. No floor-wall boundary, horizon, bright studio environment or colored background zones.\n\nCOMPOSITION:\nContent and clarity come first. Use a clear main subject or main action. Supporting objects have NO fixed count; add only what genuinely helps the explanation. Avoid decorative clutter.\n\nBRANDS + LOGOS:\nIf a brand, bank, app or logo is relevant, keep its identity recognizable but reinterpret it in the same stylized 3D animated world. Never paste a flat real-world logo, website screenshot, app screenshot or photorealistic branded UI into the scene.\n\nCOLORS + LIGHT:\nUse emerald green for positive elements, warm ivory and soft gray for neutral surfaces, subtle gold for money/value and warm red-orange only for warning/cost. Use clean soft studio lighting, readable shadows and soft contact shadows.\n\nTEXT:\nNo headline, subtitle, CTA or explanatory sentence. Only explicitly requested short German labels may appear.\n\nFORBIDDEN:\nNo realism or photorealism, no product-photo look, no flat pasted real logo, no screenshot-like brand UI, no dashboard, no app UI, no flowchart, no tiny boxes, no floating info cards, no microchip/circuit look, no miniature diorama and no clutter.\n`;

const flowInstruction = (fileName) => `${FLOW_AGENT_PROTOCOL_MARKER}\nAKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN\n\nGOOGLE FLOW – FINALER DATEINAME:\n${fileName}\n\nErzeuge ausschließlich dieses eine Bild. Warte vollständig auf das Ergebnis, benenne es SOFORT exakt wie oben um und prüfe Motiv + erlaubte Labels + V9-Stil + tiefschwarzen Hintergrund + Dateiname. Keine Bildreferenz verwenden. Bei Fehler ausschließlich DIESELBE Bildnummer neu erzeugen. Erst nach PASS darf das nächste Bild starten. Der Dateiname darf nicht sichtbar im Bild erscheinen.\n`;

const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nIMAGE PROMPT:\nCreate a clear stylized 3D animated finance scene for ${id}. Show [CLEAR MAIN SUBJECT OR ACTION] and [DESCRIBE THE SIMPLE VISUAL CAUSE/EFFECT OR SITUATION]. Use supporting objects only when they improve understanding. Make the idea understandable within 1–2 seconds. Include only the specified short German labels.\n\n${STYLE_BLOCK}`;

const coverPrompt = `${flowInstruction(coverFileName)}\nCOVER-REGEL:\nKeine klassische Headline. Das Thema mit einer sofort verständlichen stylized-3D-animierten Hauptidee zeigen. Support-Objekte nur, wenn sie helfen. Bild 00 bleibt strikt 1:1.\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES THEMA-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nIMAGE PROMPT:\nCreate a clear stylized 3D animated finance cover with [ONE STRONG MAIN IDEA OR ACTION]. Keep the composition simple and instantly understandable. Add only useful supporting objects and only the specified short German labels.\n\n${STYLE_BLOCK}`;

const worldPrompt = `FINANZNEO STYLIZED 3D ANIMATED BLACK WORLD — V9\n\n${STYLE_BLOCK}\nPROMPT POLICY:\nKeep individual image prompts medium length. Scene idea first, style second. No fixed supporting-object quota.`;
const imageSceneIds = types.flatMap((t, i) => t === 'image' ? [`scene-${num(i)}`] : []);
const animationSceneIds = types.flatMap((t, i) => t === 'animation' ? [`scene-${num(i)}`] : []);

write('README.md', `# ${title}\n\nEinfache Struktur:\n- 01-script = Voiceover-Skript\n- 02-audio = finales Voiceover\n- 03-szenen = Cover, V9-Bildprompts, Szenen und Nutzerbilder\n- 04-caption = Master-/Plattform-Captions und Wort-Timings\n- 05-projektdateien = Recherche, Timeline, Phase-3-Handoff\n- 06-export = fertiges Upload-Paket\n\n3 Phasen:\n1. Phase 1 erstellt Recherche, Skript, V9-Bildprompts und jede Animation als fertige animation.tsx.\n2. Nutzer erstellt Flow-Bilder, finales Audio und echte Wortzeiten.\n3. Der konfigurierte Executor integriert exakt diese Assets/Animationen und rendert nur über Preflight + QA.\n\nReel-Canvas: immer statisch #000000, keine Partikel/Aurora/Grid/Glow-Hintergründe.\nV5: Header Y154, Visual Y320–1480, Caption bottom340.\n`);
write('01-script/script-fliess-text.txt', '[VOLLSTÄNDIGEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nGoogle Flow: genau ein Bild erzeugen → vollständig warten → exakt umbenennen → V9-Stil + Aussage + Labels + tiefschwarzen Hintergrund prüfen → erst dann nächstes Bild. Keine Bildreferenzen. Animationsszenen erhalten kein Bild.\n');
write('03-szenen/00-cover/cover.txt', coverPrompt);
write('03-szenen/bildwelt.txt', worldPrompt);
write('03-szenen/README.md', '# SZENEN\n\nV5: normale mittige Header aus natürlichem Text + passendem Linien-Icon. Keine Capsule/Chip/Pill, kein erzwungenes ALL CAPS. Header Y154, Visual Y320–1480, Caption bottom340. Bildszenen besitzen bildprompt.txt; Animationsszenen besitzen remotion.md UND eine in Phase 1 vollständig fertigzustellende animation.tsx.\n');
write('04-caption/caption.txt', '[GEPRÜFTE MASTER-CAPTION / GEMEINSAME FAKTENBASIS EINFÜGEN]\n');
write('04-caption/instagram-reels.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n\nANGEHEFTETER KOMMENTAR:\n[OPTIONAL]\n');
write('04-caption/tiktok.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/facebook-reels.txt', 'REEL-TEXT:\n[EINFÜGEN]\n\nCTA:\n[EINFÜGEN ODER ENTFERNEN]\n\nQUELLEN / HINWEIS:\n[EINFÜGEN WENN NÖTIG]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write('04-caption/snapchat.txt', 'CAPTION:\n[EINFÜGEN]\n\nCTA:\n[OPTIONAL]\n\nQUELLEN / HINWEIS:\n[NUR WENN NÖTIG]\n');
write('04-caption/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:30,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write('05-projektdateien/animationen.md', `# ANIMATIONEN\n\nPhase 1 besitzt die kreative und technische Verantwortung. Pro Animationsszene: remotion.md + produktionsreife animation.tsx. Lock: ${ANIMATION_QUALITY_LOCK}.\n\nVisuell: V9 stylized 3D animated auf transparentem Stage über zentralem pure-black Canvas. Keine Partikel/Aurora/Grid/Glow-Hintergründe.\n\nPflicht: STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS → Ergebnis mindestens 15 Frames stabil. Keine Dummy-/Debug-/Wackel-/Math.sin-/Math.cos-Bewegung zum Bestehen von QA.\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n`);
write('05-projektdateien/recherche-quellen.md', '# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md', '# SZENENPLAN\n\nFür jede Szene: Typ, Sprechbeat, natürliche Zwischenüberschrift, Icon, Hauptaussage. Bildbeats max. 6 Sekunden.\n\nV5:\n- Header mittig, normale Schreibweise, neutral weißer Text + semantisch gefärbtes Icon\n- keine Capsule/Chip/Pill und kein erzwungenes ALL CAPS\n- Header Y154; Visual Y320–1480; Caption bottom340\n- Untertitel enden an Szenengrenzen\n- Animationsszene besitzt fertige animation.tsx aus Phase 1\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1: Inhalt, Fakten, Skript, Szenen, V9-Prompts, Header/Icons, produktionsreife animation.tsx und Plattformtexte vollständig\n- [ ] Phase 2: alle exakt benannten Bilder, genau ein finales Voiceover und echte Wort-Zeitstempel vorhanden\n- [ ] Phase 3: \`npm run reel:ready -- ${targetArg}\` erfolgreich; Animations-Seal vorhanden; Preflight/Render-QA/Export abgeschlossen\n`);
write('05-projektdateien/technische-hinweise.md', `# TECHNISCHE HINWEISE\n\n- Reel: 1080 × 1920, 9:16, 30 fps\n- Flow-Bilder inklusive Cover: 1:1, keine Bildreferenz\n- Bildwelt: ${ANIMATED_WORLD_LOCK_ID}\n- Flow-Hintergrund: deep black\n- Remotion-Reel-Canvas: #000000 statisch (${REEL_BACKGROUND_CONTRACT})\n- keine Partikel/Aurora/Grid/Glow/Vignette als Reel-Hintergrund\n- Header: Y154, normaler weißer Text + einfaches Icon\n- Visual: Y320–1480\n- Captions: bottom340, aktives Wort grün, Rest weiß\n- Animation: fertige Phase-1-animation.tsx, START → MECHANISMUS → ERGEBNIS, Result-Hold >=15 Frames\n- Animation-Hacks/Debug-Platzhalter verboten\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n`);
write('05-projektdateien/timeline.json', `${JSON.stringify({version:2,title,fps:30,timingSource:'04-caption/word-timings.json',cutRule:'voice-sentence-or-meaningful-phrase-start',sceneCount:types.length,scenes:[]}, null, 2)}\n`);

const scenes = types.map((type, index) => {
  const number = num(index);
  const id = `scene-${number}`;
  const dir = `03-szenen/EINZELNE-SZENEN/${id}`;
  const common = {
    id,
    type,
    startFrame:0,
    durationFrames:0,
    cutReason:'voice-sentence-or-meaningful-phrase-start',
    directory:`EINZELNE-SZENEN/${id}`,
    headline:'[EINFÜGEN — natürliche Aussage/Frage in normaler Schreibweise]',
    icon:'[EINFÜGEN]',
    accent:'finance-green',
    headerTone:'default',
  };

  write(`${dir}/szene.md`, `# ${id}\n\n**Typ:** ${type}\n**Zwischenüberschrift:** [EINFÜGEN — natürliche Aussage/Frage; normaler weißer Text + einfaches Icon]\n**Icon:** [EINFÜGEN — inhaltlich passend]\n**Sprechtext:** [EINFÜGEN — nur Wörter dieser Szene]\n\n${type === 'image' ? `**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Erlaubte kurze Objektlabels:** [EINFÜGEN]\n` : `**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n**Animation:** Phase 1 liefert remotion.md + fertige animation.tsx.\n`}`);

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

  const animationExport = animationExportName(index);
  const animationSourceFile = `EINZELNE-SZENEN/${id}/animation.tsx`;
  write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n**Zwischenüberschrift:** [EINFÜGEN — normale Schreibweise; Plain Header]\n**Icon:** [EINFÜGEN]\n**Kanonische Codequelle:** animation.tsx\n**Quality Lock:** ${ANIMATION_QUALITY_LOCK}\n**Visuelle Zielwelt:** ${ANIMATED_WORLD_LOCK_ID}\n**Stage:** transparent über zentralem #000000 Reel-Canvas; keine dekorativen Hintergrundeffekte.\n\n## STARTZUSTAND\n[EINFÜGEN]\n\n## SICHTBARER MECHANISMUS\n[EINFÜGEN]\n\n## ERGEBNIS\n[EINFÜGEN]\n\n## RESULT HOLD\nMindestens 15 Frames stabil.\n\n## VERBOTEN\nDummy/Placeholder/Debug-Boxen, wackelnde Rechtecke, Math.sin/Math.cos als künstlicher Frame-Diff, Hintergrundpartikel/Aurora/Grid/Glow, reine Dauerbewegung ohne Aussage, "erst Tests bestehen, später hübsch machen".\n`);
  write(`03-szenen/${animationSourceFile}`, `import React from 'react';\n\n/**\n * PHASE-1 CANONICAL ANIMATION SOURCE\n * Vor Abschluss von Phase 1 vollständig durch produktionsreifen Code ersetzen.\n * Phase 3 darf diese Quelle später nicht kreativ ersetzen oder verändern.\n *\n * ANIMATION_NARRATIVE\n * START: [EINFÜGEN — konkreter visueller Ausgangszustand]\n * MECHANISM: [EINFÜGEN — konkrete sichtbare Ursache-Wirkungs-Veränderung]\n * RESULT: [EINFÜGEN — eindeutiger visueller Endzustand]\n */\nexport const RESULT_HOLD_FRAMES = 15;\n\nexport const ${animationExport}: React.FC<{durationFrames?: number}> = () => {\n  throw new Error('PHASE 1 ANIMATION CODE NOT COMPLETED');\n};\n`);

  return {
    ...common,
    planFile:`EINZELNE-SZENEN/${id}/remotion.md`,
    animationSourceFile,
    animationExport,
    animationIntent:'[EINFÜGEN — konkrete sichtbare Kette: Startzustand → Mechanismus → Ergebnis]',
    animationQualityLock:ANIMATION_QUALITY_LOCK,
  };
});

const allSections = types.map((type,index) => {
  const number = num(index);
  if (type === 'animation') return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`, index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt', `${AUTONOMY_BLOCK}\nFINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN\n\n${FLOW_AGENT_BLOCK}\n\nPREMIUM_VISUAL_WORLD_LOCK: ${ANIMATED_WORLD_LOCK_ID}\nBILDNUMMERIERUNG:\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert. Jede Szene bekommt eine frische Komposition. Keine Bildreferenz. Keine feste Objektanzahl.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBeende den Auftrag erst, wenn jedes erwartete Bild einzeln erzeugt, exakt umbenannt und nach V9 geprüft wurde. Danach müssen alle Bilder gemeinsam hier liegen:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:26,
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
  phase1AnimationCode:{required:true,qualityLock:ANIMATION_QUALITY_LOCK,canonicalSourceRequiredForEveryAnimation:true,phase3MayNotReplaceCanonicalAnimation:true,placeholderMotionForbidden:true,decorativeMotionDoesNotCountAsExplanation:true,mathSinCosCompletionHackForbidden:true,narrativeMarkersRequired:['START','MECHANISM','RESULT'],resultHoldFramesMin:15},
  reelBackground:{contractId:REEL_BACKGROUND_CONTRACT,color:'#000000',staticRequired:true,decorativeEffectsForbidden:true,particlesForbidden:true,auroraForbidden:true,gridForbidden:true,glowBackgroundForbidden:true},
  layoutVersion:LAYOUT_VERSION,
  layout:V5_LAYOUT,
  timingStandard:{imageSceneIdealSeconds:[3.5,5.5],imageSceneAbsoluteMaxSeconds:6,animationSceneIdealSeconds:[4.5,7],splitOrAnimateIfImageExceedsMax:true},
  clarityStandard:{mustReadInUnderSeconds:2,oneMainIdeaPerBeat:true,sceneHeaderRequired:true,sceneIconRequired:true,animationStartMechanismResultRequired:true,blackTextOnDarkForbidden:true},
  imageWorld:{
    id:WORLD_ID,
    seriesLockId:SERIES_LOCK_ID,
    stylized3DLockId:STYLIZED_3D_LOCK_ID,
    physicalExplainerLockId:ANIMATED_WORLD_LOCK_ID,
    premiumVisualWorldLockId:ANIMATED_WORLD_LOCK_ID,
    animatedWorldLockId:ANIMATED_WORLD_LOCK_ID,
    generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,
    squareGeneratedImagesRequired:true,
    referencePromptFile:'03-szenen/bildwelt.txt',
    styleReferenceStrategy:'written-style-lock-only',
    referenceImageUse:'forbidden',
    style:'stylized-3d-animated-black-v9',
    sameWorldAcrossSeriesRequired:true,
    supportingObjectCountFlexible:true,
    supportingObjectsOnlyWhenHelpful:true,
    clarityBeforeObjectCount:true,
    contentFirstCompositionRequired:true,
    nonPhotorealisticRequired:true,
    stylized3DAnimatedRequired:true,
    softRoundedGeometryRequired:true,
    simplifiedDetailsRequired:true,
    premiumPlayfulBalanceRequired:true,
    clearMainSubjectOrActionRequired:true,
    deepBlackBackgroundRequired:true,
    cleanMinimalBackgroundRequired:true,
    subjectSeparationLightingRequired:true,
    softContactShadowsRequired:true,
    brandMarksRecognizableButStylizedRequired:true,
    flatPastedRealLogoForbidden:true,
    screenshotLikeBrandUiForbidden:true,
    objectLabelsOnly:true,
    headlinesInGeneratedImagesForbidden:true,
    subtitlesInGeneratedImagesForbidden:true,
    sentencesInGeneratedImagesForbidden:true,
    dashboardCompositionForbidden:true,
    appUiCompositionForbidden:true,
    flowchartMainCompositionForbidden:true,
    smallBoxesThinLinesForbidden:true,
    floatingUiTilesForbidden:true,
    microchipVisualLanguageForbidden:true,
    miniatureDioramaForbidden:true,
    photorealismForbidden:true,
    productPhotoLookForbidden:true,
    clutterForbidden:true,
  },
  platformPublishing:{directory:CAPTION_DIRECTORY,...PLATFORM_PUBLISHING_FILES},
  timelineRules:{timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,cutsFollowSentenceStartsAndMeaningfulPhraseStarts:true,equalLengthScenesForbiddenByDefault:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  imagePresentationContract:{imageFit:'contain',maxIntentionalImageScale:1.04,maxSourceCropPerSide:0.2,maxSourceCropTotal:0.34,blurredImageBackgroundForbidden:true},
  subtitleDisplay:{mode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,normalWordColor:'white',maxLines:2,noDeadGaps:true,holdDuringPauses:true,noWordJump:true,noWordScale:true,goldActiveWordForbidden:true,blackTextForbidden:true,clipToSceneBoundary:true,crossSceneSpillForbidden:true,textStrokeForbidden:true,fontWeight:800,fontSize:50,bottom:340},
  sceneHeader:{required:true,align:'center',presentation:'plain',headlineColor:'white',defaultIconColor:'finance-green',semanticColorLivesOnIcon:true,capsuleForbidden:true,uppercaseTransformForbidden:true,uniqueIconPerScene:true,mustStateSceneMessage:true,samePositionAcrossReel:true},
  animationColors:{neutral:'white',focus:'finance-green',warning:'red',money:'gold',blackOnDarkForbidden:true},
  transitionContract:{continuityFrames:3,continuityFramesMax:3,imageEnterFrames:4,fadeToBlackForbidden:true},
  scenes
}, null, 2)}\n`);

console.log(`✓ Reel-Gerüst erstellt: ${root}`);
console.log(`  ${imageSceneIds.length} Bildszenen · ${animationSceneIds.length} Remotion-Szenen`);
console.log(`  Bildwelt: ${ANIMATED_WORLD_LOCK_ID} · 1:1 · deep black · keine feste Objektanzahl · Marken erkennbar aber stilisiert`);
console.log(`  Reel-Hintergrund: ${REEL_BACKGROUND_CONTRACT} · statisch #000000 · keine Partikel/Aurora/Grid/Glow-Effekte`);
console.log('  Reel V5: Header Y154 · Plain white text + icon · Visual Y320–1480 · Caption bottom340');
console.log(`  Animationen: Phase 1 liefert kanonische animation.tsx · ${ANIMATION_QUALITY_LOCK} · keine QA-Wackel-Hacks`);
console.log(`  Phase-3-Prüfung: npm run reel:ready -- ${targetArg}`);
