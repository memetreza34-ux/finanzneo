#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target=process.argv[2]||'reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft';
const index=JSON.parse(readFileSync(resolve(target,'03-szenen/scene-index.json'),'utf8'));
const errors=[]; const ok=(c,m)=>{if(!c)errors.push(m)};
const p=index.imagePresentationContract||{}; const l=index.layout||{};
ok(p.mode==='fit-between-text','mode muss fit-between-text sein');
ok(p.visualTop===300&&p.visualBottom===1320,'VisualViewport muss exakt Y=300–1320 sein');
ok(p.visualClipRequired===true,'VisualViewport muss geclippt sein');
ok(p.headerOverlapForbidden===true&&p.captionOverlapForbidden===true,'Header/Caption-Overlap muss verboten sein');
ok(l.headerBottom<l.visualTop,'Header und Visual überlappen');
ok(l.visualBottom<1920-l.subtitleBottom,'Visual und Caption überlappen');
ok(l.imageScenesFullFrame===false,'Bildszenen dürfen im neuen Teststandard nicht full-frame sein');
ok(index.scenes.every(s=>s.headline&&s.subheadline),'Jede Szene braucht Headline + Subheadline');
ok(index.scenes.filter(s=>s.type==='animation').length===6,'Es werden 6 Animationen erwartet');
ok(index.scenes.filter(s=>s.type==='image').length===4,'Es werden 4 Bildszenen erwartet');
if(errors.length){for(const e of errors)console.error('✗',e);process.exit(1)}
console.log('✓ Inflation/Kaufkraft Layout Contract erfüllt.');
