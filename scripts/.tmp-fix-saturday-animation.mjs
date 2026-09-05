#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const path = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins/03-szenen/EINZELNE-SZENEN/scene-06/animation.tsx');
if (!existsSync(path)) throw new Error('scene-06 animation.tsx fehlt');

let source = readFileSync(path, 'utf8');
const clampLine = "const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};";
const pointLine = "const monthPoints=[{x:0,y:-1},{x:0.5,y:-0.866},{x:0.866,y:-0.5},{x:1,y:0},{x:0.866,y:0.5},{x:0.5,y:0.866},{x:0,y:1},{x:-0.5,y:0.866},{x:-0.866,y:0.5},{x:-1,y:0},{x:-0.866,y:-0.5},{x:-0.5,y:-0.866}];";

if (!source.includes('const monthPoints=')) {
  if (!source.includes(clampLine)) throw new Error('scene-06 clamp marker fehlt');
  source = source.replace(clampLine, `${pointLine}\n${clampLine}`);
}
source = source.replace(/Math\.cos\(a\)/g, 'monthPoints[i].x');
source = source.replace(/Math\.sin\(a\)/g, 'monthPoints[i].y');

if (/Math\.(?:sin|cos)\(/.test(source)) throw new Error('scene-06 enthält weiterhin Math.sin/Math.cos');
writeFileSync(path, source, 'utf8');

console.log('✓ scene-06 Jahresring nutzt 12 feste Monatspositionen statt Math.sin/Math.cos.');
console.log('✓ Optische Kreisform bleibt erhalten; keine Dauer-Wackelbewegung möglich.');
