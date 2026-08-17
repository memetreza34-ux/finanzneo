#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'))??null;
if(!target){
  console.error('Nutzung: node scripts/reel-render-locked.mjs <TARGET-REEL> [render options]');
  process.exit(1);
}

const lockCheck=spawnSync(process.execPath,['scripts/validate-global-image-world.mjs','--target',target],{stdio:'inherit'});
if(lockCheck.status!==0)process.exit(lockCheck.status??1);

const renderArgs=[target,...args.filter((arg)=>arg!==target)];
const render=spawnSync(process.execPath,['scripts/reel-render.mjs',...renderArgs],{stdio:'inherit'});
process.exit(render.status??0);
