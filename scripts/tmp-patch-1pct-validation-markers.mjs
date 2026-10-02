#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test');
const indexPath = resolve(root,'03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath,'utf8'));

const sceneFixes = {
  'scene-04': {headline:'Ein Prozentpunkt trennt die Renditen', icon:'chart-up'},
  'scene-05': {icon:'coins'},
  'scene-07': {icon:'trending'},
  'scene-08': {icon:'chart-bar'},
  'scene-09': {icon:'euro'},
  'scene-12': {icon:'check'},
};
const durations = {
  'scene-01':3.4,'scene-02':4.0,'scene-03':5.2,'scene-04':4.0,
  'scene-05':3.3,'scene-06':4.0,'scene-07':5.6,'scene-08':4.0,
  'scene-09':3.8,'scene-10':4.0,'scene-11':5.8,'scene-12':4.0,
};
const animationBeats = {
  'scene-03': [
    ['Startkapital ist da.','Der Investmentordner steht mit 10.000 € Startkapital und einem ersten Goldwertstapel.'],
    ['Dann kommen jeden Monat 300 Euro dazu.','Mehrere 300-€-Monatsumschläge gleiten nacheinander in den Ordner und erhöhen den Wertstapel sichtbar.'],
    ['Start und Sparrate arbeiten zusammen.','Der gewachsene Stapel bleibt stabil; Startkapital plus wiederkehrende Sparrate sind als gemeinsames Investment sichtbar.'],
  ],
  'scene-07': [
    ['Beide Varianten starten gleich.','Zwei identische Depots stehen auf derselben Basis und erhalten sichtbar dieselben Einzahlungen.'],
    ['Mit jedem Jahr öffnet sich der Abstand.','Der 7-%-Goldstapel wächst pro Zeitstufe stärker als der 6-%-Stapel; der sichtbare Abstand nimmt kontinuierlich zu.'],
    ['Am Ende ist der Unterschied deutlich.','Der finale Höhenabstand bleibt stabil und macht den langfristigen Zinseszinseffekt klar.'],
  ],
  'scene-11': [
    ['Kosten stehen in den Unterlagen.','Fonds-, Depot- und Beratungsdokument liegen groß und noch unmarkiert auf der Bühne.'],
    ['Man muss die laufenden Kosten finden.','Eine große Lupe fährt über die Dokumente und hebt TER, Depotkosten und Service nacheinander warm rot-orange hervor.'],
    ['Die relevanten Kosten sind geprüft.','Alle drei Kostenpositionen bleiben markiert und ein grüner Prüfhaken erscheint als stabiler Payoff.'],
  ],
};

for (const scene of index.scenes ?? []) {
  const fix = sceneFixes[scene.id];
  if (fix) Object.assign(scene,fix);
  const duration = durations[scene.id];
  if (!duration) continue;
  scene.plannedDurationSeconds = duration;
  if (scene.type === 'image') {
    const old = Array.isArray(scene.visualBeats) && scene.visualBeats[0] ? scene.visualBeats[0] : {};
    scene.visualBeats = [{
      id:`${scene.id}-beat-01`,
      kind:'image',
      voiceText:String(old.voiceText || scene.headline),
      visualChange:String(old.visualChange || scene.expectedVisual),
      startSecond:0,
      endSecond:duration,
    }];
  } else {
    const beats = animationBeats[scene.id];
    const split1 = Number((duration*0.23).toFixed(2));
    const split2 = Number((duration*0.76).toFixed(2));
    scene.visualBeats = beats.map((b,i)=>({
      id:`${scene.id}-beat-${String(i+1).padStart(2,'0')}`,
      kind:'animation',
      voiceText:b[0],
      visualChange:b[1],
      startSecond:i===0?0:(i===1?split1:split2),
      endSecond:i===0?split1:(i===1?split2:duration),
    }));
  }
}
writeFileSync(indexPath,JSON.stringify(index,null,2)+'\n','utf8');

const beatPlan = `# Visual Beats — Was 1 % Kosten wirklich ausmacht

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2

Grundregel: Ein gesprochener Gedanke bekommt einen klaren sichtbaren Beat. Statische Bilder bleiben kurz; Animationen zeigen mehrere echte Zustände. Echte Wort-Timings bestimmen später die finalen Schnitte.

Lieber ein zusätzliches gutes Bild als einen überladenen Still oder ein Standbild, das nach verstandener Aussage unnötig lange stehen bleibt.

## Geplanter Ablauf
- scene-01 IMAGE 3,4 s — kleiner 1-%-Zettel gegen angesammelte Gebühren über Zeit.
- scene-02 IMAGE 4,0 s — editorialer 1-%-Zeithorizont.
- scene-03 ANIMATION 5,2 s — 10.000 € Start → 300-€-Monatsumschläge → gewachsener Wertstapel.
- scene-04 IMAGE 4,0 s — echtes 7-%-gegen-6-%-Liniendiagramm.
- scene-05 IMAGE 3,3 s — am Anfang nahezu gleiche Füllstände.
- scene-06 IMAGE 4,0 s — Fünfjahresvergleich 35.654 € gegen 34.420 €.
- scene-07 ANIMATION 5,6 s — gleiche Einzahlung → zunehmende Wachstumsdifferenz → sichtbarer Gap.
- scene-08 IMAGE 4,0 s — echtes Endvermögens-Balkendiagramm.
- scene-09 IMAGE 3,8 s — ruhiger Fokus auf den 6-%-Endwert.
- scene-10 IMAGE 4,0 s — editorialer Payoff 85.600 € Unterschied.
- scene-11 ANIMATION 5,8 s — Dokumente → Lupe scannt Kosten → Prüfhaken.
- scene-12 IMAGE 4,0 s — ausgewogener Abschluss: Kosten prüfen, langfristig denken.
`;
writeFileSync(resolve(root,'05-projektdateien/visual-beats.md'),beatPlan,'utf8');

const paths = [
  '03-szenen/alle-bildprompts.txt','03-szenen/bildwelt.txt','03-szenen/00-cover/cover.txt',
  ...index.scenes.filter((s)=>s.type==='image').map((s)=>'03-szenen/'+String(s.planFile).replace(/^03-szenen\//,'')),
];
for (const rel of paths) {
  const path = resolve(root,rel);
  if (!existsSync(path)) continue;
  let source = readFileSync(path,'utf8');
  if (!source.toLowerCase().includes('deep black background')) source += '\nBACKGROUND_LOCK: Use one seamless deep black background.\n';
  writeFileSync(path,source.endsWith('\n')?source:source+'\n','utf8');
}

const masterPath = resolve(root,'03-szenen/alle-bildprompts.txt');
let master = readFileSync(masterPath,'utf8');
if (!/MAX_CONCURRENT_GENERATIONS\s*=\s*1/.test(master)) master = 'MAX_CONCURRENT_GENERATIONS=1\n'+master;
if (!master.includes('00-ALLE-BILDER-HIER-REIN')) master = 'FINAL_IMAGE_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/\n'+master;
if (!/COVER = SZENE 01/i.test(master)) master = 'COVER = SZENE 01\n'+master;
if (!/KEIN separates Cover erzeugen/i.test(master)) master = 'KEIN separates Cover erzeugen.\n'+master;
if (!/KEIN Bild 00 erzeugen/i.test(master)) master = 'KEIN Bild 00 erzeugen.\n'+master;
writeFileSync(masterPath,master.endsWith('\n')?master:master+'\n','utf8');

const coverHookMarker = 'FUTURE_COVER_HOOK: finanzneo-cover-hook-v3\n';
const coverPath = resolve(root,'03-szenen/00-cover/cover.txt');
let cover = readFileSync(coverPath,'utf8');
const aliasHeader = 'COVER_ALIAS: SZENE 01\nKEIN SEPARATER BILDJOB.\nNo separate cover generation.\nno Bild 00.\n';
if (!/KEIN SEPARATER BILDJOB/i.test(cover)) cover = aliasHeader + cover;
if (!cover.includes('finanzneo-cover-hook-v3')) cover = coverHookMarker + cover;
writeFileSync(coverPath,cover.endsWith('\n')?cover:cover+'\n','utf8');

const scene01Path = resolve(root,'03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt');
let scene01 = readFileSync(scene01Path,'utf8');
if (!scene01.includes('finanzneo-cover-hook-v3')) scene01 = coverHookMarker + scene01;
writeFileSync(scene01Path,scene01.endsWith('\n')?scene01:scene01+'\n','utf8');

console.log('✓ Test reel timing, visual beats, headers/icons and production markers normalized.');
