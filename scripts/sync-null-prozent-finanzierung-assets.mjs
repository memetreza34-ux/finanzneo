import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();
const reel=path.join(root,'reels/2026-08-17_bis_2026-08-23/montag/reel-01_0-prozent-finanzierung');
const inbox=path.join(reel,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const out=path.join(root,'public/reels/0-prozent-finanzierung');fs.mkdirSync(out,{recursive:true});
const files={1:'Bild 01 - 0 Prozent klingt kostenlos.png',4:'Bild 04 - Drei Raten 95 Euro.png',7:'Bild 07 - Vertrag komplett pruefen.png',10:'Bild 10 - Wuerdest du es ohne Rate kaufen.png'};
for(const [scene,name] of Object.entries(files)){const src=path.join(inbox,name);if(!fs.existsSync(src))throw new Error(`BLOCKED: Pflichtbild fehlt: ${src}`);fs.copyFileSync(src,path.join(out,`scene-${String(scene).padStart(2,'0')}.png`));}
const audios=fs.existsSync(path.join(reel,'02-audio'))?fs.readdirSync(path.join(reel,'02-audio')).filter(n=>!n.toLowerCase().endsWith('.md')):[];
if(audios.length!==1)throw new Error(`BLOCKED: genau ein finales Audio erwartet, gefunden: ${audios.length}`);
const audio=audios[0];const ext=path.extname(audio)||'.mp3';fs.copyFileSync(path.join(reel,'02-audio',audio),path.join(out,`voiceover${ext}`));
console.log('0%-Finanzierung: Pflichtbilder und finales Audio synchronisiert.');
