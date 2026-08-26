#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-reel-layout-v5.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error(`scene-index.json fehlt: ${relative(resolve('.'), indexPath)}`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.layoutVersion = 'finanzneo-reel-layout-v5';
index.layout = {
  headlineY: 154,
  visualTop: 320,
  visualBottom: 1480,
  subtitleBottom: 340,
  subtitleLeft: 72,
  subtitleRight: 140,
};
index.sceneHeader = {
  ...(index.sceneHeader ?? {}),
  required: true,
  align: 'center',
  presentation: 'plain',
  headlineColor: 'white',
  defaultIconColor: 'finance-green',
  semanticColorLivesOnIcon: true,
  capsuleForbidden: true,
  uppercaseTransformForbidden: true,
  uniqueIconPerScene: true,
  mustStateSceneMessage: true,
  samePositionAcrossReel: true,
};
index.subtitleDisplay = {
  ...(index.subtitleDisplay ?? {}),
  bottom: 340,
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`✓ Reel-V5-Layout gesetzt: Header Y154 · Visual 320–1480 · Caption bottom 340 · plain Header.`);
