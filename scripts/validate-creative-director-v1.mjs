#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/validate-creative-director-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-creative-director-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('✗ Creative Director: 03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.creativeDirectorContract?.id !== ID) {
  console.log('↷ Creative Director V1: Legacy/anderer Standard — keine V1-Prüfung erforderlich.');
  process.exit(0);
}

const failures = [];
const requiredContractFlags = [
  'storyMomentBeforeStyleLockRequired',
  'actionConsequenceOrContrastRequired',
  'shotDesignRequired',
  'shotDiversityRequired',
  'uniqueStoryDetailRequired',
  'boringSceneQaRequiredBeforeSeal',
];
for (const key of requiredContractFlags) {
  if (index.creativeDirectorContract[key] !== true) failures.push(`creativeDirectorContract.${key} muss true sein.`);
}

const requiredFields = [
  'visualGoal',
  'viewerQuestion',
  'storyMoment',
  'primaryAction',
  'visibleConsequence',
  'shotType',
  'cameraPosition',
  'foreground',
  'hero',
  'context',
  'uniqueDetail',
  'differenceFromPreviousBeats',
  'boringSceneRisk',
];

const isUnfinished = (value) => {
  if (typeof value !== 'string') return true;
  const text = value.trim();
  if (!text) return true;
  return /EINFÜGEN|TODO|TBD|PLACEHOLDER|UNREVIEWED/i.test(text);
};

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
if (scenes.length === 0) failures.push('scene-index.json enthält keine Szenen.');

for (const scene of scenes) {
  const id = scene?.id ?? '[ohne id]';
  const plan = scene?.creativeDirection;
  if (!plan || typeof plan !== 'object') {
    failures.push(`${id}: creativeDirection fehlt.`);
    continue;
  }
  for (const field of requiredFields) {
    if (isUnfinished(plan[field])) failures.push(`${id}: creativeDirection.${field} ist noch nicht produktionsreif.`);
  }
  if (plan.boringSceneStatus !== 'PASS') {
    failures.push(`${id}: BORING_SCENE_STATUS muss vor Seal explizit PASS sein.`);
  }

  const sceneFile = resolve(root, '03-szenen/EINZELNE-SZENEN', id, 'szene.md');
  if (!existsSync(sceneFile)) {
    failures.push(`${id}: szene.md fehlt.`);
    continue;
  }
  const source = readFileSync(sceneFile, 'utf8');
  if (!source.includes(`CREATIVE_DIRECTION_STANDARD: ${ID}`)) {
    failures.push(`${id}: szene.md enthält den Creative-Director-Vertrag nicht.`);
  }
}

if (failures.length > 0) {
  console.error('\n✗ Creative Director V1 FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error('\nRegel: Story Moment + Handlung/Konsequenz + Shot Design + Unique Detail zuerst ausarbeiten; Style Lock erst danach.');
  process.exit(1);
}

console.log('✓ Creative Director V1 PASS');
console.log(`  ${scenes.length} Szenen: Story Moment, Handlung/Konsequenz, Shot Design, Unique Detail und Boring-Scene-PASS vollständig.`);