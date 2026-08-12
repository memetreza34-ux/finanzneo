#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'));
const final=args.includes('--final')||args.includes('--require-final-assets');
const postRender=args.includes('--post-render');

if(!target){
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner> [--final] [--post-render]');
  process.exit(1);
}
if(postRender&&!final){
  console.error('--post-render darf nur zusammen mit --final verwendet werden.');
  process.exit(1);
}

const run=(script,scriptArgs)=>{
  const result=spawnSync(process.execPath,[script,...scriptArgs],{stdio:'inherit'});
  if(result.error){
    console.error(`Validator konnte nicht gestartet werden: ${script}`);
    console.error(result.error.message);
    process.exit(1);
  }
  if(result.status!==0)process.exit(result.status??1);
};

const finalArg=final?['--final']:[];
const qualityArgs=[target,...finalArg,...(postRender?['--post-render']:[])];
run('scripts/validate-reel-source-contract.mjs',[target,...finalArg]);
run('scripts/validate-reel-quality-contract.mjs',qualityArgs);
run('scripts/validate-platform-publishing.mjs',[target,...finalArg]);

const mode=postRender?'POST-RENDER-FINAL-QA':final?'PRE-RENDER-FINAL':'BASIS';
console.log(`\n✓ Gesamter Reel-Validator erfolgreich (${mode}).`);
