#!/usr/bin/env node

import {resolve} from 'node:path';
import {
  REEL_BACKGROUND_CONTRACT_ID,
  REEL_BACKGROUND_HEX,
  validateCentralReelBackgroundContract,
} from './lib/reel-background-contract.mjs';

const errors = validateCentralReelBackgroundContract(resolve('.'));
if (errors.length) {
  console.error(`\nReel-Background-Vertrag ${REEL_BACKGROUND_CONTRACT_ID} verletzt:\n`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ ${REEL_BACKGROUND_CONTRACT_ID}`);
console.log(`✓ Reel-Canvas bleibt statisch ${REEL_BACKGROUND_HEX}.`);
console.log('✓ Keine Aurora, Partikel, Grid, Glow, Vignette oder animierte Hintergrundbewegung im zentralen Reel-Pfad.');
