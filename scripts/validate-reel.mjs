#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'));
const final=args.includes('--final')||args.includes('--require-final-assets');

if(!target){
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner> [--final]');
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
run('scripts/validate-reel-source-contract.mjs',[target,...finalArg]);
run('scripts/validate-reel-quality-contract.mjs',[target,...finalArg]);
run('scripts/validate-platform-publishing.mjs',[target,...finalArg]);

console.log(`\n✓ Gesamter Reel-Validator erfolgreich${final?' (FINAL-ASSET-, QUALITY- UND CAPTION-MODUS)':''}.`);
