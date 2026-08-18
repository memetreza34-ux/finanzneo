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
const defaultFinalFolder=`FINAL - ${String(title).replace(/[\\/:*?"<>|]/g,'').trim()}`;

sceneIndex.imageWorld={
  id:WORLD_ID,
  locked:true,
  stylizedInfographic3DRequired:true,
  centralHeroObjectRequired:true,
  recognizableSimplifiedTopicObjectsRequired:true,
  supportingObjectRange:[3,6],
  physicalTagsRequiredWhenLabelsUsed:true,
  naturalAsymmetryRequired:true,
  photorealismForbidden:true,
  realisticProductPhotographyForbidden:true,
  leatherTextureForbidden:true,
  woodGrainForbidden:true,
  realisticMetalWearForbidden:true,
  realisticEverydaySceneForbidden:true,
  floatingUiTilesForbidden:true,
  microchipVisualLanguageForbidden:true,
  gameBoardCompositionForbidden:true,
  satelliteModuleOrbitForbidden:true,
  symmetricalFourCornerLayoutForbidden:true,
  digitalCentralScreenForbidden:true,
  genericIconButtonsAsMainObjectsForbidden:true,
  lineNetworkMainMotifForbidden:true,
  abstractFlowMainMotifForbidden:true,
  repeatedContractWallForbidden:true,
  wealthTowersForbidden:true,
  monolithsForbidden:true,
  sterileProductAdLookForbidden:true,
  emptyBlackStudioForbidden:true
};

sceneIndex.googleFlowExecution={
  finalOutputFolder:defaultFinalFolder,
  singleImageAtATimeRequired:true,
  renameBeforeNextImageRequired:true,
  moveToFinalFolderBeforeNextImageRequired:true,
  verifyRenamedFileBeforeNextImageRequired:true,
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

write('README.md',`# ${title}\n\n## Global gesperrte Bildwelt\n\n- Welt: **${WORLD_ID}**\n- Look: stilisierte hochwertige 3D-Finanz-Infografik, nicht fotorealistisch\n- großes zentrales Erklär-Objekt + 3–6 vereinfachte erkennbare Themenobjekte\n- matte, glatte, vereinfachte Geometrie; Dunkelgrün/Mint/Creme/Gold\n- verboten: Leder, Holzmaserung, fotorealistische Produkte, echte Schreibtisch-/Shop-Szenen\n- verboten: UI-Kacheln, Chips, Gameboards, Satelliten-Orbits, Liniennetzwerke\n- Cover Bild 00: 9:16, Text direkt in Google Flow\n- normale Flow-Bilder: strikt 1:1, bevorzugt 1080×1080\n- Google Flow: exakt EIN Bild erzeugen → warten → prüfen → ggf. neu erzeugen → umbenennen → in EINEN finalen Ordner legen → prüfen → erst dann nächstes Bild\n- kein Weiter?-Stopp\n\n## Struktur\n\n- 01-script = finaler Voiceover-Text\n- 02-audio = genau ein finales Nutzer-Voiceover\n- 03-szenen = Bildprompts, Szenen und Nutzerbilder\n- 04-caption = eine universelle Social-Caption + echte Wort-Timings\n- 05-projektdateien = Animationen, Recherche und Technik\n`);

write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md',`# ALLE FERTIGEN NUTZERBILDER HIER REIN\n\nVerbindlich:\n- Bild 00 Cover = 9:16\n- normale Flow-Szenenbilder = strikt 1:1, bevorzugt 1080×1080\n- Welt = ${WORLD_ID}\n- keine Zusatzbilder, Platzhalter oder Altversionen\n- Animationsszenen haben kein Bild; ihre Nummer bleibt reserviert\n`);

write('03-szenen/bildwelt.txt',`GLOBAL_IMAGE_WORLD_REF: ${WORLD_ID}\nSOURCE: ${lock.worldDefinitionPath}\nLOCKED: true\n\n${world}\n`);

const common=`Use the globally locked FinanzNeo world: ${WORLD_ID}.\nCreate a clean premium stylized 3D finance-infographic illustration, NOT a photograph. Use ONE large chunky explanatory hero object plus 3–6 simplified recognizable topic objects. Rounded geometry, clean matte surfaces, reduced detail, dark charcoal-green background, mint/emerald structure accents, cream and muted gold. Labels only as small physical paper/price tags or printed plaques.\nSTRICTLY FORBIDDEN: photorealism, realistic product photography, leather texture, wood grain, realistic aged/scratched metal, realistic desk/shop/office scene, luxury product-ad look, digital central screen, floating UI cards/tiles/chips/buttons, microchip/circuit-board, four-corner mini modules, satellite orbit, game-board, dashboard/HUD, glowing line network, abstract finance streams, tubes, rails, roads or tracks.\n`;

const fileLoop=(fileName)=>`FILE WORKFLOW FOR THIS IMAGE:\nGenerate exactly ONE image only → wait until completely finished → inspect → if invalid regenerate THIS SAME image → rename immediately to ${fileName} → move/save into the single final output folder → verify the exact renamed file exists there → ONLY THEN generate the next required image. Never ask Weiter?.\n`;

const imagePrompt=(scene)=>`FINALER DATEINAME: ${scene.googleFlowFileName??'[DATEINAME EINFÜGEN]'}\nSTRICT SQUARE 1:1, preferably 1080×1080. Do NOT create 9:16.\nNo headline. No subtitle. Only explicitly requested short physical labels.\n${common}\n${fileLoop(scene.googleFlowFileName??'[DATEINAME EINFÜGEN]')}\nSCENE IDEA:\n[DESCRIBE THE EXACT SPOKEN BEAT AS ONE LARGE STYLIZED EXPLAINER OBJECT PLUS 3–6 SIMPLIFIED RECOGNIZABLE TOPIC OBJECTS. THE MAIN IDEA MUST BE UNDERSTANDABLE WITHIN ONE SECOND.]\n`;

const coverPrompt=`GOOGLE FLOW COVER — VERTICAL 9:16\nFINALER DATEINAME: ${sceneIndex.cover.fileName}\n${common}\nCreate one vertical 9:16 cover. Google Flow itself must render the exact German cover headline requested for this Reel. No Remotion replacement headline.\n${fileLoop(sceneIndex.cover.fileName)}\nCOVER-ÜBERSCHRIFT – EXAKT SO:\n[GENAUE ÜBERSCHRIFT HIER EINFÜGEN]\n`;
write('03-szenen/00-cover/cover.txt',coverPrompt);

const imageScenes=(sceneIndex.scenes??[]).filter((scene)=>scene.type==='image');
for(const scene of imageScenes){
  const path=`03-szenen/${scene.directory??`EINZELNE-SZENEN/${scene.id}`}/bildprompt.txt`.replace('03-szenen/03-szenen/','03-szenen/');
  if(existsSync(resolve(root,path)))write(path,imagePrompt(scene));
}

const requiredFiles=[sceneIndex.cover.fileName,...imageScenes.map((scene)=>scene.googleFlowFileName).filter(Boolean)];
const sections=imageScenes.map((scene)=>`━━━━━━━━━━━━━━━━━━\n${scene.id.toUpperCase()} — STRICT 1:1\n━━━━━━━━━━━━━━━━━━\n${imagePrompt(scene)}`).join('\n');
write('03-szenen/alle-bildprompts.txt',`FINANZNEO — GOOGLE FLOW — GLOBAL LOCKED IMAGE WORLD\nFINANZNEO_WORLD_ID: ${WORLD_ID}\nFINAL OUTPUT FOLDER: ${defaultFinalFolder}\n\nHARD FILE WORKFLOW:\nCreate the final output folder first. Process required images strictly ONE AT A TIME.\nFor EACH image: generate exactly ONE image only → wait until completely finished → inspect → regenerate the SAME image until valid → rename immediately to exact final filename → move/save it into the single final output folder → verify exact filename exists there → ONLY AFTER VERIFICATION start the next image.\nDo NOT batch-generate several images before renaming the previous one.\nDo NOT ask Weiter?, Continue?, approval or confirmation between images.\nOnly after all required files are together in the one final folder may you give a completion summary.\n\nREQUIRED FILE ORDER:\n${requiredFiles.map((f,i)=>`${i+1}. ${f}`).join('\n')}\n\nGLOBAL LOCKED WORLD:\n${world}\n\n━━━━━━━━━━━━━━━━━━\nCOVER — 9:16\n━━━━━━━━━━━━━━━━━━\n${coverPrompt}\n\n${sections}\n\nFINAL FOLDER CHECK:\n- exactly one final output folder\n- every required final filename is present there\n- cover is 9:16\n- every normal scene image is strict 1:1\n- every image uses ${WORLD_ID}\n- no photorealism, leather, wood grain or realistic product-ad drift\n- no UI/chip/game-board/orbit/line-network drift\n- no user confirmation requested between images\nOnly now provide the final completion summary.\n`);

write('03-szenen/README.md',`# SZENEN — GLOBAL IMAGE WORLD LOCK\n\nVerbindliche Welt: **${WORLD_ID}**.\n\n- Cover: 9:16\n- normale Flow-Bilder: 1:1\n- stilisierte 3D-Finanz-Infografik, nicht fotorealistisch\n- keine Leder-/Holz-/Produktfoto-Optik\n- keine UI-Kacheln/Chips/Gameboards/Orbits/Liniennetze\n- Google Flow erzeugt immer nur EIN Bild, benennt es um und legt es in den finalen Ordner, bevor das nächste Bild startet\n`);

write('03-szenen/layout-contract.md',`# Global gesperrter Bild-Layoutvertrag\n\n- Reel-Canvas: 1080×1920\n- Cover: 9:16\n- normale Flow-Szenenbilder: 1:1, bevorzugt 1080×1080\n- Rendergröße normaler Bilder: ungefähr 1000×1000 px, horizontal zentriert\n- niemals 1:1 auf 9:16 strecken\n- Bildwelt: ${WORLD_ID}\n- Headline und Karaoke-Caption bleiben separate Remotion-Ebenen\n`);

const validation=spawnSync(process.execPath,['scripts/validate-global-image-world.mjs','--target',targetArg],{stdio:'inherit'});
process.exit(validation.status??0);
