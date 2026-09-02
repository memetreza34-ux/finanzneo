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
  visualBottom: 1400,
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
  fontSize: 56,
  minFontSize: 50,
  maxLines: 2,
  iconSize: 34,
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
index.visualSafeZone = {
  top: 320,
  bottom: 1400,
  hardClipAnimations: true,
  headerIntrusionForbidden: true,
  captionIntrusionForbidden: true,
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log('✓ Reel-V5-Layout gesetzt: Header Y154 · 56 px · max 2 Zeilen · Visual 320–1400 · Caption bottom 340.');
console.log('✓ Animationen müssen hart innerhalb der Visualzone bleiben.');
