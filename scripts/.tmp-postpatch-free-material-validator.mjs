import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/validate-animation-source-quality.mjs';
let source = readFileSync(path, 'utf8');
const oldBlock = `  if (!/(?:material=['\"](?:neutral|money|warning|positive)['\"]|Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack))/.test(source)) {
    fail(\`${'${id}'}: Animation braucht semantische Materialrollen oder konkrete Realwelt-Primitives.\`);
  }`;
const newBlock = `  if (!freeRemotion && !/(?:material=['\"](?:neutral|money|warning|positive)['\"]|Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack))/.test(source)) {
    fail(\`${'${id}'}: Legacy-Animation braucht semantische Materialrollen oder konkrete Realwelt-Primitives.\`);
  }
  if (freeRemotion && !/ANIMATION_COLORS/.test(source)) {
    fail(\`${'${id}'}: freie Remotion-Animation muss weiterhin die zentrale ANIMATION_COLORS-Semantik verwenden.\`);
  }`;
if (!source.includes(oldBlock)) throw new Error('Primitive-only Material-Gate nicht gefunden.');
source = source.replace(oldBlock, newBlock);
writeFileSync(path, source, 'utf8');
console.log('✓ Material-Gate ist im Freedom-Modus primitive-unabhängig; Legacy bleibt unverändert streng.');
