#!/usr/bin/env node
import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const jobs=[
  ['EditorialV2SalaryCurve','01-salary-curve.mp4'],
  ['EditorialV2BudgetDonut','02-budget-donut.mp4'],
  ['EditorialV2CompoundCurve','03-compound-curve.mp4'],
  ['EditorialV2Diversification','04-diversification-network.mp4'],
  ['EditorialV2LoanPaydown','05-loan-paydown.mp4'],
  ['EditorialV2TaxBrackets','06-tax-brackets.mp4'],
];
const out='out/editorial-motion-v2';
mkdirSync(out,{recursive:true});

for(const [id,file] of jobs){
  console.log('\n▶ '+id);
  const r=spawnSync(process.platform==='win32'?'npx.cmd':'npx',
    ['remotion','render','src/index.ts',id,`${out}/${file}`],
    {stdio:'inherit'});
  if(r.status!==0) process.exit(r.status ?? 1);
}
console.log('\n✓ Editorial Motion V2 examples rendered.');
