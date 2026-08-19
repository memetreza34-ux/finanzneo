#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  CAPTION_DIRECTORY,
  PLATFORM_PUBLISHING_FILES,
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

// Gemeinsame Weltbeschreibung. Die Textregel ist NICHT enthalten, weil sie
// sich zwischen Cover und Szenenbild unterscheidet.
const STYLE_BLOCK = `FINANZNEO_WORLD_ID: ${WORLD_ID}

VERBINDLICHER BILDSTIL:
Premium fintech editorial 3D render style with rich material detail. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for euro coins, cash and financial value. Warm red-orange only for loss, debt, danger or blocked money. Use smooth rounded 3D geometry, soft bevelled edges, premium matte, metal, glass and paper materials, confident high-contrast studio lighting with bold emerald rim light. Objects are believable and detailed in construction — real seams, edges, wear and material behaviour — but the image clearly stays a premium 3D illustration and never a photograph.

VISUAL LANGUAGE:
Use ONE dominant visual metaphor as the hero of the image. Group a few supporting objects tightly around it so the scene feels full and lived-in, never an empty product shot. Every supporting object must carry part of the spoken sentence; nothing is decoration. Default is objects and metaphors only, without any person. A single stylized hand interacting with an object is allowed and does not count as a person. Only if a human presence genuinely improves the explanation, a stylized anonymous 3D adult person may stand beside the metaphor — then the face must be clearly visible with stylized eyes, nose and mouth, front-facing or in a natural three-quarter view. No faceless mannequin, hidden face or back-view-only person.

BACKGROUND RULE:
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image. Keep the same continuous material, tone and gradient from the top edge to the bottom edge. NO horizontal divisions. NO visible top section. NO visible bottom section. NO separate zones. NO dark band at the top or bottom. NO floor-wall boundary. NO horizon line. NO studio wall split. NO room, NO walls, NO table, NO shelf, NO furniture. NO panel background. NO layered backdrop. Use only one subtle continuous gradient or vignette. Objects group tightly together and cast soft contact shadows directly onto the background. Fill the usable frame generously with the grouped scene so it never looks empty, while keeping the upper and lower edges free of important detail.

FORBIDDEN:
No percentage-based top/middle/bottom zones, no photorealism, no real camera photo, no real identifiable human, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no random labels, no Pixar, no clay, no cartoon simplification.
`;

// Szenenbild: KEIN Satz im Bild. Voiceover und Remotion-Untertitel tragen die
// Aussage — ein Satz im Bild würde mit beiden konkurrieren.
const SCENE_TEXT_RULE = `TEXT RULE – SEHR WICHTIG:
No headline. No subtitle. No sentence. No paragraph. No CTA. No title text of any kind anywhere in the image.
The ONLY text allowed are the short German object labels listed below, placed small, clearly legible, in a clean sans-serif, directly next to the object they describe and never overlapping it.
Nothing else: no invented words, no extra labels, no numbers, no dates, no readable text on papers or screens, no brand names unless explicitly requested.
`;

// Cover: trägt Headline + Subline und sagt damit direkt, worum es geht.
const COVER_TEXT_RULE = `TEXT RULE – COVER:
Bake exactly ONE bold German headline (3-7 words) and ONE lighter subline directly below it into the UPPER THIRD of the image. Never place them in the lower third, because Remotion renders the subtitles there. No third text block, no CTA, no paragraph. Additionally only the explicitly requested short German object labels, placed small and directly near the objects they describe.
`;

const flowInstruction = (fileName) => `GOOGLE FLOW – FINALER DATEINAME:
\`${fileName}\`

WICHTIG:
Erzeuge GENAU EIN Bild. Danach SOFORT exakt wie oben umbenennen, Motiv + Beschriftungen + Hintergrund + Dateiname prüfen und OHNE Rückfrage direkt mit dem nächsten Prompt weitermachen. Nicht anhalten, nicht auf Bestätigung warten. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.
`;

// Szenenprompt. Der gesprochene Satz wird in Blöcke zerlegt, damit das
// Bildmodell keinen Teil der Aussage weglässt.
const imagePrompt = (id, index) => `${flowInstruction(sceneFileName(index))}
${STYLE_BLOCK}
GESPROCHENER SATZ DIESER SZENE:
[HIER DEN VOICEOVER-SATZ EINTRAGEN — das Bild muss ihn vollständig erzählen]

BILDPROMPT – NACH SATZTEILEN GEGLIEDERT:

HERO — [WELCHER SATZTEIL]:
[ONE LARGE DOMINANT VISUAL METAPHOR FOR ${id}], described with believable material detail, large and slightly angled in the center.

[ZWEITER BLOCK] — [WELCHER SATZTEIL]:
[SUPPORTING OBJECT THAT CARRIES THIS PART OF THE SENTENCE, WITH ITS VISIBLE CAUSE-AND-EFFECT]

[DRITTER BLOCK] — [WELCHER SATZTEIL]:
[SUPPORTING OBJECT THAT CARRIES THIS PART OF THE SENTENCE]

Everything is grouped tightly around the hero as one connected still life. Every object serves the same sentence.

${SCENE_TEXT_RULE}
BESCHRIFTUNGEN – EXAKT DIESE, SONST KEIN TEXT:
- '[KURZES DEUTSCHES LABEL]' [WO GENAU IM BILD]
- '[OPTIONALES ZWEITES LABEL]' [WO GENAU IM BILD]

Vertical 9:16.
`;

const coverPrompt = `${flowInstruction('Bild 00 - [KURZER COVER-NAME].png')}
${STYLE_BLOCK}
COVER-REGEL – TEXT IST PFLICHT:
Das Cover trägt IMMER Text. Die Headline muss direkt und ohne Umweg sagen, worum es in diesem Reel geht — jemand soll beim Draufschauen in einer Sekunde das Thema erfassen. Keine vagen Andeutungen, keine reine Neugier-Formel ohne Inhalt.

Muster:
Headline nennt die konkrete Sache oder Zahl, Subline stellt die Frage oder den Nutzen dahinter.
Beispiel: Headline "25 € MEHR IM MONAT" · Subline "Was macht das in 20 Jahren?"
Beispiel: Headline "INFLATION FRISST DEIN GELD" · Subline "Was 10.000 € in 20 Jahren noch wert sind."

${COVER_TEXT_RULE}
HEADLINE + SUBLINE – EXAKT SO INS BILD EINBRENNEN:
Headline: [BENENNT DAS THEMA DES REELS DIREKT, 3-7 WÖRTER]
Subline: [EIN KURZER SATZ, DER DAS THEMA KONKRETISIERT ODER DIE FRAGE STELLT]

BESCHRIFTUNGEN – OPTIONAL:
- [OPTIONALE KURZE STRUKTUR-LABELS]

BILDPROMPT:
[ONE LARGE DOMINANT COVER METAPHOR] as the clear hero of the image, described with believable material detail, large and centered. [SHOW THE CORE IDEA OF THE REEL IN ONE CLEAR VISUAL]. Bake the headline and subline above into the upper third of the image.

Vertical 9:16.
`;

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
write('04-caption/word-timings.json', `${JSON.stringify({version:1,fps:30,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,sentences:[]}, null, 2)}\n`);
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

write('03-szenen/alle-bildprompts.txt', `FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\n════════════════════════════════════════\nAUFTRAG FÜR DEN GOOGLE-FLOW-AGENTEN\n════════════════════════════════════════\n\nArbeite diese Datei in EINEM Durchgang komplett von oben nach unten ab.\nErzeuge alle unten stehenden Bilder nacheinander, ohne anzuhalten.\n\nABLAUF PRO BILD:\n1. Prompt lesen\n2. GENAU EIN Bild erzeugen\n3. Sofort exakt auf den direkt am Prompt angegebenen Dateinamen umbenennen\n4. Kurz prüfen: Motiv, Beschriftungen, nahtloser Hintergrund, Dateiname\n5. OHNE Rückfrage sofort mit dem nächsten Prompt weitermachen\n\nNICHT TUN:\n- nicht zwischendurch anhalten oder pausieren\n- nicht nach Bestätigung oder Freigabe fragen\n- keine Zwischenfragen stellen\n- keinen Prompt überspringen oder zusammenfassen\n- nicht mehrere Prompts in einem Bild kombinieren\n\nERST GANZ AM ENDE, wenn ALLE Bilder erzeugt und umbenannt sind:\nMelde dich einmal mit der Liste aller erzeugten Dateinamen.\nLege danach alle Bilder gemeinsam in den Ordner:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n\nVERBINDLICH:\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert und erhalten KEIN Bild.\nBildwelt: eine starke Premium-Fintech-3D-Metapher, kurze deutsche Labels, EIN nahtloser Hintergrund ohne Bänder/Zonen.\nNur das Cover trägt Headline und Subline. Alle Szenenbilder tragen KEINEN Satz, nur Beschriftungen.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn alle benötigten Bilder fertig, korrekt benannt und geprüft sind, alle gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('03-szenen/scene-index.json', `${JSON.stringify({
  version:12,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{generationMode:'one-image-at-a-time',fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false},
  imageWorld:{id:WORLD_ID,referencePromptFile:'03-szenen/bildwelt.txt',style:'premium-fintech-editorial-3d-metaphor',stylizedPersonAllowed:true,visibleFaceRequiredWhenPersonPresent:true,coverHeadlineRequired:true,coverSublineRequired:true,coverTextZone:'upper-third',sentencesInSceneImagesForbidden:true,sceneObjectLabelsOnly:true,seamlessSingleBackgroundRequired:true,percentageZonesForbidden:true,floorWallBoundaryForbidden:true,horizonLineForbidden:true,backgroundBandsForbidden:true,ctaTextInGeneratedImagesForbidden:true,paragraphsInGeneratedImagesForbidden:true,tinyDioramaForbidden:true,neonTunnelForbidden:true},
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