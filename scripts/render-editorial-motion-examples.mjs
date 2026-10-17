#!/usr/bin/env node

import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const examples = [
  ['EditorialMotion01Transfer','01-transfer.mp4'],
  ['EditorialMotion02BudgetSplit','02-budget-split.mp4'],
  ['EditorialMotion03SalaryGrowth','03-salary-growth.mp4'],
  ['EditorialMotion04FeeDrag','04-fee-drag.mp4'],
  ['EditorialMotion05PortfolioSplit','05-portfolio-split.mp4'],
  ['EditorialMotion06Rebalancing','06-rebalancing.mp4'],
  ['EditorialMotion07Diversification','07-diversification.mp4'],
  ['EditorialMotion08LoanPaydown','08-loan-paydown.mp4'],
  ['EditorialMotion09DepositProtection','09-deposit-protection.mp4'],
  ['EditorialMotion10ScenarioCompare','10-scenario-compare.mp4'],
  ['EditorialMotion11Timeline','11-timeline.mp4'],
  ['EditorialMotion12CompoundGrowth','12-compound-growth.mp4'],
  ['EditorialMotion13MountainGoal','13-mountain-goal.mp4'],
  ['EditorialMotion14LateFee','14-late-fee.mp4'],
];

const outDir='out/editorial-motion-v1';
mkdirSync(outDir,{recursive:true});

for(const [composition,file] of examples){
  console.log('\n▶ Rendering '+composition+' → '+file);
  const result=spawnSync(
    process.platform==='win32'?'npx.cmd':'npx',
    ['remotion','render','src/index.ts',composition,`${outDir}/${file}`],
    {stdio:'inherit'}
  );
  if(result.status!==0){
    console.error('\n✗ Render failed: '+composition);
    process.exit(result.status ?? 1);
  }
}

console.log('\n✓ 14 Editorial Motion examples rendered to '+outDir);
