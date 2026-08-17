#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'))??null;
if(!target){
  console.error('Nutzung: npm run reel:validate -- <TARGET-REEL> [--final] [--post-render]');
  process.exit(1);
}

const lockCheck=spawnSync(process.execPath,['scripts/validate-global-image-world.mjs','--target',target],{stdio:'inherit'});
if(lockCheck.status!==0)process.exit(lockCheck.status??1);

const quality=spawnSync(process.execPath,['scripts/validate-reel-quality-contract.mjs',...args],{stdio:'inherit'});
process.exit(quality.status??0);
