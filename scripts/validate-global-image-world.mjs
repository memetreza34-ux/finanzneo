#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const LOCK_PATH='config/finanzneo-image-world-lock.json';
const EXPECTED_ID='finanzneo-central-object-editorial-v6';
const args=process.argv.slice(2);
const targetIndex=args.indexOf('--target');
const targetArg=targetIndex>=0?args[targetIndex+1]:(args.find((arg)=>!arg.startsWith('--'))??null);
const fail=(message)=>{console.error(`IMAGE-WORLD LOCK FAIL: ${message}`);process.exitCode=1;};
const read=(path)=>readFileSync(path,'utf8');

if(!existsSync(LOCK_PATH)){
  fail(`missing ${LOCK_PATH}`);
  process.exit(1);
}

let lock;
try{lock=JSON.parse(read(LOCK_PATH));}catch{fail(`${LOCK_PATH} is invalid JSON`);process.exit(1);}
if(lock.locked!==true)fail('global image-world lock must remain locked=true');
if(lock.globalImageWorldId!==EXPECTED_ID)fail(`globalImageWorldId must be ${EXPECTED_ID}`);
if(lock.worldDefinitionPath!=='config/finanzneo-image-worlds/finanzneo-central-object-editorial-v6.txt')fail('unexpected worldDefinitionPath');
if(lock.coverAspectRatio!=='9:16')fail('coverAspectRatio must be 9:16');
if(lock.sceneImageAspectRatio!=='1:1')fail('sceneImageAspectRatio must be 1:1');
if(lock.rules?.centralHeroObjectRequired!==true)fail('centralHeroObjectRequired must be true');
if(lock.rules?.lineNetworkMainMotifForbidden!==true)fail('lineNetworkMainMotifForbidden must be true');
if(lock.googleFlow?.continuousAutonomousRunRequired!==true)fail('continuousAutonomousRunRequired must be true');
if(lock.googleFlow?.userConfirmationBetweenImagesForbidden!==true)fail('userConfirmationBetweenImagesForbidden must be true');

const worldPath=lock.worldDefinitionPath;
if(!existsSync(worldPath))fail(`missing world definition ${worldPath}`);
else{
  const world=read(worldPath);
  for(const required of [EXPECTED_ID,'ONE large central hero object','3–5 smaller supporting symbolic finance objects','STRICTLY FORBIDDEN','Normal Google-Flow scene images: strict square 1:1']){
    if(!world.includes(required))fail(`world definition missing required marker: ${required}`);
  }
}

for(const requiredPath of ['scripts/scaffold-finanzneo-reel-locked.mjs','scripts/validate-reel-locked.mjs','.agents/rules/finanzneo-image-world-lock.md']){
  if(!existsSync(requiredPath))fail(`missing enforcement file ${requiredPath}`);
}

if(existsSync('package.json')){
  let pkg;
  try{pkg=JSON.parse(read('package.json'));}catch{fail('package.json is invalid JSON');}
  if(pkg){
    if(pkg.scripts?.['reel:create']!=='node scripts/scaffold-finanzneo-reel-locked.mjs')fail('package.json reel:create must use locked scaffolder');
    if(pkg.scripts?.['reel:validate']!=='node scripts/validate-reel-locked.mjs')fail('package.json reel:validate must use locked validator wrapper');
    if(pkg.scripts?.['validate:image-world']!=='node scripts/validate-global-image-world.mjs')fail('package.json missing canonical validate:image-world command');
  }
}

if(targetArg){
  const target=resolve(targetArg);
  const rel=relative(resolve('reels'),target);
  if(rel.startsWith('..')||rel===''||rel.split(sep).includes('..')){
    fail(`target must be inside reels/: ${targetArg}`);
  }else{
    const sceneIndexPath=resolve(target,'03-szenen/scene-index.json');
    const worldRefPath=resolve(target,'03-szenen/bildwelt.txt');
    const allPromptsPath=resolve(target,'03-szenen/alle-bildprompts.txt');
    if(!existsSync(sceneIndexPath))fail(`missing ${sceneIndexPath}`);
    else{
      try{
        const sceneIndex=JSON.parse(read(sceneIndexPath));
        if(sceneIndex.imageWorld?.id!==EXPECTED_ID)fail(`target imageWorld.id must be ${EXPECTED_ID}`);
        if(sceneIndex.imageWorld?.centralHeroObjectRequired!==true)fail('target centralHeroObjectRequired must be true');
        if(sceneIndex.imageWorld?.lineNetworkMainMotifForbidden!==true)fail('target lineNetworkMainMotifForbidden must be true');
        if(sceneIndex.cover?.aspectRatio && sceneIndex.cover.aspectRatio!=='9:16')fail('target cover aspect ratio must be 9:16');
        if(sceneIndex.googleFlowExecution?.continuousAutonomousRun!==true)fail('target Google Flow must use continuousAutonomousRun=true');
        if(sceneIndex.googleFlowExecution?.userConfirmationBetweenImagesForbidden!==true)fail('target must forbid user confirmation between images');
        for(const scene of sceneIndex.scenes??[]){
          if(scene.type==='image' && scene.aspectRatio!=='1:1')fail(`${scene.id} image aspectRatio must be 1:1`);
        }
      }catch(error){fail(`invalid target scene-index.json: ${error.message}`);}
    }
    if(!existsSync(worldRefPath))fail('target missing 03-szenen/bildwelt.txt');
    else if(!read(worldRefPath).includes(EXPECTED_ID))fail(`target bildwelt.txt must reference ${EXPECTED_ID}`);
    if(!existsSync(allPromptsPath))fail('target missing 03-szenen/alle-bildprompts.txt');
    else{
      const prompt=read(allPromptsPath);
      for(const required of [EXPECTED_ID,'Do NOT stop after any image','one large central hero object']){
        if(!prompt.toLowerCase().includes(required.toLowerCase()))fail(`target alle-bildprompts.txt missing: ${required}`);
      }
      for(const forbidden of ['finanzneo-tangible-finance-editorial-v4','finanzneo-finanzfluss-editorial-v5','finanzneo-connected-studio-v3']){
        if(prompt.includes(forbidden))fail(`target prompt contains forbidden old world ID: ${forbidden}`);
      }
    }
  }
}

if(process.exitCode){process.exit(process.exitCode);}
console.log(`IMAGE-WORLD LOCK PASS: ${EXPECTED_ID}${targetArg?` | target=${targetArg}`:''}`);
