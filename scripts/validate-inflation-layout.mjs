#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target=process.argv[2]||'reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft';
const index=JSON.parse(readFileSync(resolve(target,'03-szenen/scene-index.json'),'utf8'));
const errors=[];
const ok=(condition,message)=>{if(!condition)errors.push(message)};
const p=index.imagePresentationContract||{};
const l=index.layout||{};
const cover=index.coverHeadline||{};

ok(Number(index.version)>=19,'scene-index muss V19 oder neuer sein');
ok(p.mode==='full-frame-no-crop','Bildmodus muss full-frame-no-crop sein');
ok(p.fullCanvas===true,'Bildszenen müssen die volle 1080x1920-Fläche nutzen');
ok(p.intentionalCropForbidden===true,'Absichtlicher Crop muss verboten bleiben');
ok(p.tinyCenteredPosterForbidden===true,'Kleine Poster-Komposition muss verboten sein');
ok(Number(p.minimumHeroWidthPx)>=820,'Flow-Hero muss mindestens 820 px Zielbreite haben');
ok(l.imageScenesFullFrame===true,'Bildszenen müssen full-frame sein');
ok(Number(l.subtitleBottom)>=400,'Untertitel müssen gegenüber V18 sichtbar höher stehen');
ok(Number(l.animationVisualTop)<=250,'Animationsfläche beginnt zu tief');
ok(Number(l.animationVisualBottom)>=1380,'Animationsfläche endet zu früh');
ok(cover.source==='google-flow','Cover-Text muss aus Google Flow kommen');
ok(cover.remotionCoverTextForbidden===true,'Remotion-Cover-Text muss verboten sein');
ok(cover.textMustBeGeneratedInsideImage===true,'Cover-Typografie muss im Flow-Bild liegen');
ok(cover.exactText==='10.000 € AUF DEM KONTO','Cover-Headline stimmt nicht');
ok(cover.subheadline==='WIE VIEL KAUFKRAFT BLEIBT?','Cover-Subheadline stimmt nicht');
ok(index.scenes.every(s=>s.headline&&s.subheadline),'Jede Szene braucht Headline + Subheadline');
ok(index.scenes.filter(s=>s.type==='animation').length===6,'Es werden 6 Animationen erwartet');
ok(index.scenes.filter(s=>s.type==='image').length===4,'Es werden 4 Bildszenen erwartet');
ok(index.scenes.filter(s=>s.type==='animation').every(s=>String(s.animationMechanism||'').length>40),'Jede Animation braucht einen konkreten Start-Aktion-Ergebnis-Mechanismus');

if(errors.length){for(const error of errors)console.error('✗',error);process.exit(1)}
console.log('✓ Inflation/Kaufkraft V19 Layout- und Cover-Vertrag erfüllt.');
