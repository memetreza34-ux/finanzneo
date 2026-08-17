import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const reel=path.join(root,'reels/2026-08-17_bis_2026-08-23/montag/reel-01_0-prozent-finanzierung');
const index=JSON.parse(fs.readFileSync(path.join(reel,'03-szenen/scene-index.json'),'utf8'));const prompt=fs.readFileSync(path.join(reel,'03-szenen/alle-bildprompts.txt'),'utf8');
const fail=(m)=>{throw new Error(`V22 FAIL: ${m}`)};
if(index.version!==22)fail('scene-index version muss 22 sein');if(index.sceneCount!==10||index.imageSceneCount!==4||index.animationSceneCount!==6)fail('10 Szenen / 4 Bilder / 6 Animationen erwartet');
if(index.imageWorld?.id!=='finanzneo-tangible-finance-editorial-v4')fail('falsche Bildwelt');if(!index.googleFlowExecution?.continuousAutonomousRun||!index.googleFlowExecution?.userConfirmationBetweenImagesForbidden)fail('Flow muss ohne Zwischenbestätigung durchlaufen');
for(const s of index.scenes){if(s.type==='animation'&&!s.animationMechanism)fail(`${s.id}: animationMechanism fehlt`);if(s.type==='image'&&s.aspectRatio!=='1:1')fail(`${s.id}: Bild muss 1:1 sein`);}
for(const forbidden of ['ask the user `Weiter?`','wealth towers','abstract tubes'])if(!prompt.toLowerCase().includes(forbidden.toLowerCase()))fail(`Prompt muss harte Regel enthalten: ${forbidden}`);
if(!prompt.includes('Only after ALL five images are valid'))fail('Flow-Abschluss darf erst nach allen Bildern erfolgen');
console.log('V22 source contract OK: 0%-Finanzierung.');
