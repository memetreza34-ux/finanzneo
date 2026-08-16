#!/usr/bin/env node
import {copyFileSync,existsSync,mkdirSync,readdirSync} from 'node:fs';
import {resolve,extname} from 'node:path';
const root=resolve('reels/2026-08-10_bis_2026-08-16/sonntag/reel-01_25-euro-mehr-sparrate');
const inbox=resolve(root,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const out=resolve('public/reels/25-euro-mehr-sparrate'); mkdirSync(out,{recursive:true});
const expected=[['Bild 01 - 100 vs 125 Euro.png','scene-01.png'],['Bild 04 - 24000 vs 30000 Einzahlungen.png','scene-04.png'],['Bild 07 - 46200 vs 57800 Euro.png','scene-07.png'],['Bild 10 - Kleine Rate lange Zeit.png','scene-10.png']];
for(const [src,dst] of expected){const p=resolve(inbox,src);if(!existsSync(p))throw new Error(`BLOCKED: fehlt ${p}`);copyFileSync(p,resolve(out,dst));}
const cover=resolve(inbox,'Bild 00 - 25 Euro mehr Sparrate Cover.png');if(!existsSync(cover))throw new Error(`BLOCKED: fehlt ${cover}`);copyFileSync(cover,resolve(out,'cover.png'));
console.log('✓ V21 Assets synchronisiert.');
