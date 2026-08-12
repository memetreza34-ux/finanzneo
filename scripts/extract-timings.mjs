import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit/04-caption/word-timings.json', 'utf8'));

fs.writeFileSync('src/reels/zinseszins/word-timings.ts', 'export const ZINSESZINS_WORD_TIMINGS = ' + JSON.stringify(data.sentences, null, 2) + ';');
console.log('Successfully wrote word-timings.ts');
