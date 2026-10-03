#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/create-finanzneo-reel.mjs';
let source = readFileSync(path, 'utf8');
const pattern = /\nconst NEW_REELS_PAUSED = true;\nif \(NEW_REELS_PAUSED\) \{\n  console\.error\('Neue Reels sind aktuell pausiert\.[\s\S]*?\n\}\n/;
const next = source.replace(pattern, '\n');
if (next === source) throw new Error('temporary Reel hard-stop block not found');
writeFileSync(path, next, 'utf8');
console.log('✓ Legacy Reel tooling kept intact; YouTube remains the documented active production mode.');
