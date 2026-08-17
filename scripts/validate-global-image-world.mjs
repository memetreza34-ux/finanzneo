#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const LOCK_PATH='config/finanzneo-image-world-lock.json';
const EXPECTED_ID='finanzneo-physical-explainer-editorial-v7';
const EXPECTED_WORLD_PATH='config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt';
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

for(const key of ['physicalHeroObjectRequired','recognizableTopicObjectsRequired','physicalTagsRequiredWhenLabelsUsed','naturalAsymmetryRequired','realisticEverydaySceneForbidden','floatingUiTilesForbidden','microchipVisualLanguageForbidden','gameBoardCompositionForbidden','satelliteModuleOrbitForbidden','symmetricalFourCornerLayoutForbidden','digitalCentralScreenForbidden','genericIconButtonsAsMainObjectsForbidden','lineNetworkMainMotifForbidden','abstractFlowMainMotifForbidden','repeatedContractWallForbidden','wealthTowersForbidden','monolithsForbidden','sterileProductAdLookForbidden','emptyBlackStudioForbidden','tinyPosterCompositionForbidden']){
  if(lock.rules?.[key]!==true)fail(`${key} must be true`);
}
if(lock.rules?.supportingObjectsMin!==3||lock.rules?.supportingObjectsMax!==6)fail('supporting object range must remain 3–6');
if(lock.googleFlow?.continuousAutonomousRunRequired!==true)fail('continuousAutonomousRunRequired must be true');
if(lock.googleFlow?.userConfirmationBetweenImagesForbidden!==true)fail('userConfirmationBetweenImagesForbidden must be true');
if(lock.googleFlow?.autoRegenerateInvalidImage!==true)fail('autoRegenerateInvalidImage must be true');

const worldPath=lock.worldDefinitionPath;
if(!existsSync(worldPath))fail(`missing world definition ${worldPath}`);
else{
  const world=read(worldPath);
  for(const required of [EXPECTED_ID,'ONE large PHYSICAL hero object','3–6 RECOGNIZABLE, TOPIC-SPECIFIC physical objects','microchip or circuit-board visual language','floating cards, tiles, chips, buttons','game-board / board-game layout','normal Google-Flow scene images: strict square 1:1','Never ask `Weiter?`']){
    if(!world.includes(required))fail(`world definition missing required marker: ${required}`);
  }
}

for(const requiredPath of ['scripts/scaffold-finanzneo-reel-locked.mjs','scripts/validate-reel-locked.mjs','scripts/reel-render-locked.mjs','.agents/rules/finanzneo-image-world-lock.md','.github/workflows/validate-image-world.yml','docs/GLOBAL-IMAGE-WORLD-LOCK.md']){
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
    if(!String(pkg.scripts?.validate??'').includes('validate:image-world'))fail('global npm validate must include validate:image-world');
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
        if(sceneIndex.imageWorld?.physicalHeroObjectRequired!==true)fail('target physicalHeroObjectRequired must be true');
        if(sceneIndex.imageWorld?.recognizableTopicObjectsRequired!==true)fail('target recognizableTopicObjectsRequired must be true');
        for(const key of ['floatingUiTilesForbidden','microchipVisualLanguageForbidden','gameBoardCompositionForbidden','satelliteModuleOrbitForbidden','symmetricalFourCornerLayoutForbidden','lineNetworkMainMotifForbidden'])if(sceneIndex.imageWorld?.[key]!==true)fail(`target ${key} must be true`);
        if(sceneIndex.cover?.aspectRatio && sceneIndex.cover.aspectRatio!=='9:16')fail('target cover aspect ratio must be 9:16');
        if(sceneIndex.googleFlowExecution?.continuousAutonomousRun!==true)fail('target Google Flow must use continuousAutonomousRun=true');
        if(sceneIndex.googleFlowExecution?.userConfirmationBetweenImagesForbidden!==true)fail('target must forbid user confirmation between images');
        for(const scene of sceneIndex.scenes??[])if(scene.type==='image'&&scene.aspectRatio!=='1:1')fail(`${scene.id} image aspectRatio must be 1:1`);
      }catch(error){fail(`invalid target scene-index.json: ${error.message}`);}
    }
    if(!existsSync(worldRefPath))fail('target missing 03-szenen/bildwelt.txt');
    else if(!read(worldRefPath).includes(EXPECTED_ID))fail(`target bildwelt.txt must reference ${EXPECTED_ID}`);
    if(!existsSync(allPromptsPath))fail('target missing 03-szenen/alle-bildprompts.txt');
    else{
      const prompt=read(allPromptsPath);
      for(const required of [EXPECTED_ID,'Do NOT stop after any image','PHYSICAL hero object','floating UI cards'])if(!prompt.toLowerCase().includes(required.toLowerCase()))fail(`target alle-bildprompts.txt missing: ${required}`);
      for(const forbiddenOldId of ['finanzneo-tangible-finance-editorial-v4','finanzneo-finanzfluss-editorial-v5','finanzneo-connected-studio-v3','finanzneo-central-object-editorial-v6'])if(prompt.includes(forbiddenOldId))fail(`target prompt contains forbidden old world ID: ${forbiddenOldId}`);
    }
  }
}

if(process.exitCode)process.exit(process.exitCode);
console.log(`IMAGE-WORLD LOCK PASS: ${EXPECTED_ID}${targetArg?` | target=${targetArg}`:''}`);
