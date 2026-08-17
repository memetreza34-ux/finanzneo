#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const readArg=(name)=>{const i=args.indexOf(`--${name}`);return i===-1?null:args[i+1]??null;};
const targetArg=readArg('target');
const title=readArg('title')??'Neues FinanzNeo-Reel';
if(!targetArg){console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"');process.exit(1);}

const lock=JSON.parse(readFileSync('config/finanzneo-image-world-lock.json','utf8'));
if(lock.locked!==true)throw new Error('Global image-world lock is not enabled.');
const world=readFileSync(lock.worldDefinitionPath,'utf8').trim();
const WORLD_ID=lock.globalImageWorldId;

const base=spawnSync(process.execPath,['scripts/scaffold-finanzneo-reel-quality.mjs',...args],{stdio:'inherit'});
if(base.status!==0)process.exit(base.status??1);

const root=resolve(targetArg);
const read=(rel)=>readFileSync(resolve(root,rel),'utf8');
const write=(rel,content)=>writeFileSync(resolve(root,rel),content,'utf8');

const sceneIndexPath='03-szenen/scene-index.json';
const sceneIndex=JSON.parse(read(sceneIndexPath));
sceneIndex.imageWorld={
  id:WORLD_ID,
  locked:true,
  centralHeroObjectRequired:true,
  supportingSymbolsRange:[3,5],
  realisticEverydaySceneForbidden:true,
  lineNetworkMainMotifForbidden:true,
  abstractFlowMainMotifForbidden:true,
  repeatedContractWallForbidden:true,
  wealthTowersForbidden:true,
  monolithsForbidden:true,
  sterileProductAdLookForbidden:true,
  emptyBlackStudioForbidden:true
};
sceneIndex.googleFlowExecution={
  continuousAutonomousRun:true,
  userConfirmationBetweenImagesForbidden:true,
  autoRegenerateInvalidImage:true,
  completionSummaryOnlyAfterAllImages:true
};
sceneIndex.imagePresentationContract={
  sourceAspectRatio:'1:1',
  preferredSourceSize:'1080x1080',
  renderWidthPx:1000,
  renderHeightPx:1000,
  stretchToVerticalForbidden:true,
  tinyPosterForbidden:true
};
sceneIndex.cover={
  ...(sceneIndex.cover??{}),
  aspectRatio:'9:16',
  source:'google-flow',
  fileName:sceneIndex.cover?.fileName??'Bild 00 - [KURZER COVER-NAME].png',
  remotionTextForbidden:true
};
for(const scene of sceneIndex.scenes??[]){
  if(scene.type==='image'){
    scene.aspectRatio='1:1';
    scene.imagePresentation={mode:'fit-between-text',sourceAspectRatio:'1:1',renderWidthPx:1000,renderHeightPx:1000};
  }
}
write(sceneIndexPath,`${JSON.stringify(sceneIndex,null,2)}\n`);

write('README.md',`# ${title}\n\n## Global gesperrte Bildwelt\n\n- Welt: **${WORLD_ID}**\n- Cover Bild 00: 9:16, Text direkt in Google Flow\n- normale Google-Flow-Szenenbilder: strikt 1:1, bevorzugt 1080×1080\n- Remotion zeigt quadratische Bilder ungefähr 1000×1000 px ohne vertikales Strecken\n- jedes Flow-Bild: ein großes zentrales Hauptobjekt + 3–5 kleinere Finanzsymbole\n- keine realistischen Alltagsszenen und keine Linien-/Finanzfluss-Netze als Hauptmotiv\n- Google Flow erzeugt alle Pflichtbilder in einem durchgehenden Lauf ohne Weiter?-Stopp\n\n## Struktur\n\n- 01-script = finaler Voiceover-Text\n- 02-audio = genau ein finales Nutzer-Voiceover\n- 03-szenen = Bildprompts, Szenen und Nutzerbilder\n- 04-caption = eine universelle Social-Caption + echte Wort-Timings\n- 05-projektdateien = Animationen, Recherche und Technik\n\nFinale Nutzerbilder nur aus 03-szenen/00-ALLE-BILDER-HIER-REIN/, finales Audio nur aus 02-audio/. Fehlende Pflichtmedien blockieren den Final-Build.\n`);

write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md',`# ALLE FERTIGEN NUTZERBILDER HIER REIN\n\nVerbindlich:\n- Bild 00 Cover = 9:16\n- normale Flow-Szenenbilder = strikt 1:1, bevorzugt 1080×1080\n- Welt = ${WORLD_ID}\n- keine Zusatzbilder, Platzhalter oder Altversionen\n- Animationsszenen haben kein Bild; ihre Nummer bleibt reserviert\n`);

write('03-szenen/bildwelt.txt',`GLOBAL_IMAGE_WORLD_REF: ${WORLD_ID}\nSOURCE: ${lock.worldDefinitionPath}\nLOCKED: true\n\n${world}\n`);

const common=`Use the globally locked FinanzNeo world: ${WORLD_ID}.\nCreate a premium stylized 3D explainer composition with ONE large central hero object and 3–5 smaller supporting symbolic finance objects around it. Strong central focus, rich depth, clear hierarchy, deep charcoal green-black base, emerald/mint accents, gold only for money/value, warm red-orange only for warning/risk.\nDo NOT create a realistic everyday/desk/room scene. Do NOT use glowing finance lines, line networks, tubes, rails, roads or tracks as the main motif. No repeated contract-paper wall, wealth tower, monolith, sterile product ad, empty black studio shot, dashboard, sci-fi corridor, Pixar or clay.\n`;
const imagePrompt=(scene)=>`FINALER DATEINAME: ${scene.googleFlowFileName??'[DATEINAME EINFÜGEN]'}\nSTRICT SQUARE 1:1, preferably 1080×1080. Do NOT create 9:16.\nNo headline. No subtitle. Only explicitly requested short object labels.\n${common}\nSCENE IDEA:\n[DESCRIBE THE EXACT SPOKEN BEAT AS ONE CENTRAL FINANCE HERO OBJECT WITH 3–5 SUPPORTING SYMBOLS. THE MAIN IDEA MUST BE UNDERSTANDABLE WITHIN ONE SECOND.]\n`;
const coverPrompt=`GOOGLE FLOW COVER — VERTICAL 9:16\nFINALER DATEINAME: ${sceneIndex.cover.fileName}\n${common}\nCreate one vertical 9:16 cover. Google Flow itself must render the exact German cover headline requested for this Reel. No Remotion replacement headline. Use one dominant central hero object plus 3–5 supporting finance symbols. Keep the composition stylized, symbolic and premium — not realistic and not line-network based.\nCOVER-ÜBERSCHRIFT – EXAKT SO:\n[GENAUE ÜBERSCHRIFT HIER EINFÜGEN]\n`;
write('03-szenen/00-cover/cover.txt',coverPrompt);

const imageScenes=(sceneIndex.scenes??[]).filter((scene)=>scene.type==='image');
for(const scene of imageScenes){
  const path=`03-szenen/${scene.directory??`EINZELNE-SZENEN/${scene.id}`}/bildprompt.txt`.replace('03-szenen/03-szenen/','03-szenen/');
  if(existsSync(resolve(root,path)))write(path,imagePrompt(scene));
}

const sections=imageScenes.map((scene)=>`━━━━━━━━━━━━━━━━━━\n${scene.id.toUpperCase()} — STRICT 1:1\n━━━━━━━━━━━━━━━━━━\n${imagePrompt(scene)}`).join('\n');
write('03-szenen/alle-bildprompts.txt',`FINANZNEO — GOOGLE FLOW — GLOBAL LOCKED IMAGE WORLD\nFINANZNEO_WORLD_ID: ${WORLD_ID}\n\nAUTONOMOUS CONTINUOUS RUN — HARD RULE:\nGenerate ALL required images in one continuous task.\nDo NOT stop after any image.\nDo NOT ask the user Weiter?, Continue?, for confirmation, approval or feedback between images.\nFor each image internally: generate → wait until fully complete → inspect spelling, aspect ratio and motif → if wrong, regenerate automatically → apply the exact final filename → immediately continue to the next image.\nOnly after ALL required images are valid, provide one final completion summary.\n\nGLOBAL LOCKED WORLD:\n${world}\n\n━━━━━━━━━━━━━━━━━━\nCOVER — 9:16\n━━━━━━━━━━━━━━━━━━\n${coverPrompt}\n\n${sections}\n\nFINAL INTERNAL CHECK:\n- cover is 9:16\n- every normal scene image is strict 1:1\n- every image uses ${WORLD_ID}\n- every image has one large central hero object plus 3–5 supporting finance symbols\n- no realistic everyday scene\n- no line-network/finance-stream main motif\n- no user confirmation requested between images\n- only after all images pass, give one final summary\n`);

write('03-szenen/README.md',`# SZENEN — GLOBAL IMAGE WORLD LOCK\n\nVerbindliche Welt: **${WORLD_ID}**.\n\n- Cover Bild 00: 9:16, Covertext direkt in Google Flow\n- normale Flow-Bilder: strikt 1:1, bevorzugt 1080×1080\n- jedes Bild: ein großes zentrales Hauptobjekt + 3–5 kleinere Finanzsymbole\n- keine realistischen Alltagsszenen\n- keine Linien-/Finanzfluss-Netze als Hauptmotiv\n- Google Flow erzeugt alle Pflichtbilder ohne Zwischenfrage in einem autonomen Lauf\n\nQuelle: ${lock.worldDefinitionPath}\n`);

write('03-szenen/layout-contract.md',`# Global gesperrter Bild-Layoutvertrag\n\n- Reel-Canvas: 1080×1920\n- Cover: 9:16\n- normale Flow-Szenenbilder: 1:1, bevorzugt 1080×1080\n- Rendergröße normaler Bilder: ungefähr 1000×1000 px, horizontal zentriert\n- niemals 1:1 auf 9:16 strecken\n- kein kleines Poster in großer leerer Fläche\n- Bildwelt: ${WORLD_ID}\n- Bildmotiv: ein großes zentrales Hauptobjekt + 3–5 kleinere Finanzsymbole\n- Headline und Karaoke-Caption bleiben separate Remotion-Ebenen\n- Caption-Safe-Area bleibt oberhalb der Plattform-UI\n`);

write('05-projektdateien/technische-hinweise.md',`# TECHNISCHE HINWEISE\n\n- 1080×1920, 30 fps\n- globale Bildwelt: ${WORLD_ID}\n- Cover Bild 00: 9:16, Covertext direkt in Google Flow\n- normale Flow-Bilder: 1:1 / bevorzugt 1080×1080\n- quadratische Bilder ungefähr 1000×1000 px darstellen; niemals vertikal strecken\n- Headline und Untertitel separat in Remotion\n- Untertitel: genau eine kurze Einheit gleichzeitig, maximal 2 Zeilen, mindestens 42 px\n- Wortmarkierung ausschließlich nach echten Start-/End-Zeitstempeln des finalen Voiceovers\n- gleichmäßig geschätzte Wortzeiten verboten\n- native Remotion-Szenen: Start → sichtbarer Mechanismus → Ergebnis\n- Google Flow: alle Pflichtbilder autonom hintereinander, kein Weiter?-Stopp\n- Publishing: genau eine caption.txt für Instagram Reels, TikTok, Facebook Reels und Snapchat\n- keine YouTube Shorts; YouTube nur Longform unter youtube/\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n`);

const validation=spawnSync(process.execPath,['scripts/validate-global-image-world.mjs','--target',targetArg],{stdio:'inherit'});
process.exit(validation.status??0);
