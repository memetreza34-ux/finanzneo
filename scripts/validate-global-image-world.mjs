#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const LOCK_PATH='config/finanzneo-image-world-lock.json';
const EXPECTED_ID='finanzneo-stylized-finance-explainer-v8';
const EXPECTED_WORLD_PATH='config/finanzneo-image-worlds/finanzneo-stylized-finance-explainer-v8.txt';
const args=process.argv.slice(2);
const targetIndex=args.indexOf('--target');
const targetArg=targetIndex>=0?args[targetIndex+1]:(args.find((arg)=>!arg.startsWith('--'))??null);
const fail=(message)=>{console.error(`IMAGE-WORLD LOCK FAIL: ${message}`);process.exitCode=1;};
const read=(path)=>readFileSync(path,'utf8');

if(!existsSync(LOCK_PATH)){fail(`missing ${LOCK_PATH}`);process.exit(1);}
let lock;
try{lock=JSON.parse(read(LOCK_PATH));}catch{fail(`${LOCK_PATH} is invalid JSON`);process.exit(1);}

if(lock.locked!==true)fail('global image-world lock must remain locked=true');
if(lock.globalImageWorldId!==EXPECTED_ID)fail(`globalImageWorldId must be ${EXPECTED_ID}`);
if(lock.worldDefinitionPath!==EXPECTED_WORLD_PATH)fail(`worldDefinitionPath must be ${EXPECTED_WORLD_PATH}`);
if(lock.coverAspectRatio!=='9:16')fail('coverAspectRatio must be 9:16');
if(lock.sceneImageAspectRatio!=='1:1')fail('sceneImageAspectRatio must be 1:1');
if(lock.preferredSceneImageSize!=='1080x1080')fail('preferredSceneImageSize must be 1080x1080');
if(lock.sceneRenderSizePx!==1000)fail('sceneRenderSizePx must be 1000');

for(const key of [
  'stylizedInfographic3DRequired','centralHeroObjectRequired','recognizableSimplifiedTopicObjectsRequired',
  'physicalTagsRequiredWhenLabelsUsed','naturalAsymmetryRequired','photorealismForbidden',
  'realisticEverydaySceneForbidden','realisticProductPhotographyForbidden','leatherTextureForbidden',
  'woodGrainForbidden','realisticMetalWearForbidden','floatingUiTilesForbidden','microchipVisualLanguageForbidden',
  'gameBoardCompositionForbidden','satelliteModuleOrbitForbidden','symmetricalFourCornerLayoutForbidden',
  'digitalCentralScreenForbidden','genericIconButtonsAsMainObjectsForbidden','lineNetworkMainMotifForbidden',
  'abstractFlowMainMotifForbidden','repeatedContractWallForbidden','wealthTowersForbidden','monolithsForbidden',
  'sterileProductAdLookForbidden','emptyBlackStudioForbidden','tinyPosterCompositionForbidden'
]){
  if(lock.rules?.[key]!==true)fail(`${key} must be true`);
}
if(lock.rules?.supportingObjectsMin!==3||lock.rules?.supportingObjectsMax!==6)fail('supporting object range must remain 3–6');

for(const key of [
  'singleImageAtATimeRequired','renameBeforeNextImageRequired','singleFinalOutputFolderRequired',
  'verifyRenamedFileBeforeNextImageRequired','userConfirmationBetweenImagesForbidden',
  'autoRegenerateInvalidImage','completionSummaryOnlyAfterAllImages'
]){
  if(lock.googleFlow?.[key]!==true)fail(`googleFlow.${key} must be true`);
}

if(!existsSync(EXPECTED_WORLD_PATH))fail(`missing world definition ${EXPECTED_WORLD_PATH}`);
else{
  const world=read(EXPECTED_WORLD_PATH);
  for(const required of [
    EXPECTED_ID,
    'premium stylized 3D infographic illustration',
    'photorealism',
    'leather texture',
    'wood grain',
    'Generate exactly ONE image only',
    'Rename the valid image to its exact required final filename',
    'single final output folder',
    'Never ask `Weiter?`'
  ]){
    if(!world.toLowerCase().includes(required.toLowerCase()))fail(`world definition missing required marker: ${required}`);
  }
}

for(const requiredPath of [
  'scripts/scaffold-finanzneo-reel-locked.mjs','scripts/validate-reel-locked.mjs','scripts/reel-render-locked.mjs',
  '.agents/rules/finanzneo-image-world-lock.md','.github/workflows/validate-image-world.yml','docs/GLOBAL-IMAGE-WORLD-LOCK.md'
]){
  if(!existsSync(requiredPath))fail(`missing enforcement file ${requiredPath}`);
}

if(existsSync('package.json')){
  let pkg;
  try{pkg=JSON.parse(read('package.json'));}catch{fail('package.json is invalid JSON');}
  if(pkg){
    if(pkg.scripts?.['reel:create']!=='node scripts/scaffold-finanzneo-reel-locked.mjs')fail('package.json reel:create must use locked scaffolder');
    if(pkg.scripts?.['reel:validate']!=='node scripts/validate-reel-locked.mjs')fail('package.json reel:validate must use locked validator wrapper');
    if(pkg.scripts?.['validate:image-world']!=='node scripts/validate-global-image-world.mjs')fail('package.json missing canonical validate:image-world command');
    if(pkg.scripts?.['reel:preview']!=='node scripts/reel-render-locked.mjs')fail('package.json reel:preview must use locked render wrapper');
    if(pkg.scripts?.['reel:render']!=='node scripts/reel-render-locked.mjs')fail('package.json reel:render must use locked render wrapper');
    if(pkg.scripts?.['reel:qa']!=='node scripts/reel-render-locked.mjs --post-render')fail('package.json reel:qa must use locked render wrapper');
  }
}

if(targetArg){
  const target=resolve(targetArg);
  const rel=relative(resolve('reels'),target);
  if(rel.startsWith('..')||rel===''||rel.split(sep).includes('..'))fail(`target must be inside reels/: ${targetArg}`);
  else{
    const sceneIndexPath=resolve(target,'03-szenen/scene-index.json');
    const worldRefPath=resolve(target,'03-szenen/bildwelt.txt');
    const allPromptsPath=resolve(target,'03-szenen/alle-bildprompts.txt');

    if(!existsSync(sceneIndexPath))fail(`missing ${sceneIndexPath}`);
    else{
      try{
        const sceneIndex=JSON.parse(read(sceneIndexPath));
        if(sceneIndex.imageWorld?.id!==EXPECTED_ID)fail(`target imageWorld.id must be ${EXPECTED_ID}`);
        for(const key of ['stylizedInfographic3DRequired','photorealismForbidden','realisticProductPhotographyForbidden','leatherTextureForbidden','woodGrainForbidden','floatingUiTilesForbidden','gameBoardCompositionForbidden']){
          if(sceneIndex.imageWorld?.[key]!==true)fail(`target imageWorld.${key} must be true`);
        }
        const flow=sceneIndex.googleFlowExecution??{};
        for(const key of ['singleImageAtATimeRequired','renameBeforeNextImageRequired','moveToFinalFolderBeforeNextImageRequired','verifyRenamedFileBeforeNextImageRequired','userConfirmationBetweenImagesForbidden']){
          if(flow[key]!==true)fail(`target googleFlowExecution.${key} must be true`);
        }
        if(!flow.finalOutputFolder)fail('target googleFlowExecution.finalOutputFolder is required');
        if(sceneIndex.cover?.aspectRatio&&sceneIndex.cover.aspectRatio!=='9:16')fail('target cover aspect ratio must be 9:16');
        for(const scene of sceneIndex.scenes??[])if(scene.type==='image'&&scene.aspectRatio!=='1:1')fail(`${scene.id} image aspectRatio must be 1:1`);
      }catch(error){fail(`invalid target scene-index.json: ${error.message}`);}
    }

    if(!existsSync(worldRefPath))fail('target missing 03-szenen/bildwelt.txt');
    else if(!read(worldRefPath).includes(EXPECTED_ID))fail(`target bildwelt.txt must reference ${EXPECTED_ID}`);

    if(!existsSync(allPromptsPath))fail('target missing 03-szenen/alle-bildprompts.txt');
    else{
      const prompt=read(allPromptsPath).toLowerCase();
      for(const required of [
        EXPECTED_ID,
        'generate exactly one image only',
        'rename immediately',
        'only after verification',
        'final output folder',
        'photorealism',
        'wood grain',
        'leather'
      ]){
        if(!prompt.includes(required.toLowerCase()))fail(`target alle-bildprompts.txt missing: ${required}`);
      }
      for(const forbiddenOldId of [
        'finanzneo-tangible-finance-editorial-v4','finanzneo-finanzfluss-editorial-v5','finanzneo-connected-studio-v3',
        'finanzneo-central-object-editorial-v6','finanzneo-physical-explainer-editorial-v7'
      ]){
        if(prompt.includes(forbiddenOldId))fail(`target prompt contains forbidden old world ID: ${forbiddenOldId}`);
      }
    }
  }
}

if(process.exitCode)process.exit(process.exitCode);
console.log(`IMAGE-WORLD LOCK PASS: ${EXPECTED_ID}${targetArg?` | target=${targetArg}`:''}`);
