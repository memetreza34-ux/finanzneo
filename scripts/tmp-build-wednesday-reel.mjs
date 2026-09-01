#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT = 'reels/2026-08-31_bis_2026-09-06/mittwoch/reel-03_geld-am-monatsende';
const TITLE = 'Warum ist dein Geld am Monatsende weg?';
const TYPES = 'image,image,animation,image,image,animation,image,image,animation,image,image';

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, {stdio: 'inherit'});
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const patchFile = (path, replacements) => {
  let source = readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!source.includes(from)) throw new Error(`Patch-Marker fehlt in ${path}: ${from}`);
    source = source.replaceAll(from, to);
  }
  writeFileSync(path, source, 'utf8');
};

// 1) Offenen Future-V2-Pfadfehler beheben, ohne bestehende Reels anzufassen.
for (const path of ['scripts/apply-future-cover-hook-v2.mjs', 'scripts/apply-future-image-storytelling-v2.mjs']) {
  patchFile(path, [[
    'const path = resolve(root, relativePath);',
    "const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);",
  ]]);
}
for (const path of ['scripts/validate-future-cover-hook-v2.mjs', 'scripts/validate-future-image-storytelling-v2.mjs']) {
  patchFile(path, [[
    'const path = resolve(root, relative);',
    "const path = relative.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relative) : resolve(root, relative);",
  ]]);
}

// 2) Future-Cover-Export aus finalem Video-Frame 0 aktivieren.
if (existsSync('scripts/tmp-patch-future-cover-export.mjs')) {
  run(process.execPath, ['scripts/tmp-patch-future-cover-export.mjs']);
  rmSync('scripts/tmp-patch-future-cover-export.mjs');
}
if (existsSync('.github/workflows/tmp-verify-future-cover-hook-v2.yml')) {
  rmSync('.github/workflows/tmp-verify-future-cover-hook-v2.yml');
}

// 3) Erstes echtes V2-Reel erzeugen.
if (existsSync(ROOT)) throw new Error(`Mittwoch-Reel existiert bereits: ${ROOT}`);
run(process.execPath, ['scripts/create-finanzneo-reel.mjs', '--target', ROOT, '--title', TITLE, '--types', TYPES]);

const sceneData = [
  {
    id:'scene-01', type:'image', headline:TITLE, icon:'wallet', tone:'warning', seconds:3.8,
    voice:'Dein Gehalt kommt rein – und kurz vor Monatsende ist fast nichts mehr übrig?',
    file:'Bild 01 - Monatsende fast leer.png', labels:['Monatsende','Fast leer'],
    expected:'A relatable end-of-month everyday situation: salary was paid earlier, but now the wallet/account reserve is visibly almost empty while a calendar shows month end.',
    visual:'Eine Person sieht kurz vor Monatsende auf fast leeres Geld; Kalender und wenige verbleibende Münzen machen den Moment sofort klar.',
    subject:'a relatable person at the end of the month with only a few coins left beside a calendar',
    cause:'show a clear month-end consequence: several ordinary receipts sit nearby while only a small amount of money remains; keep calm black negative space above for the Remotion title',
  },
  {
    id:'scene-02', type:'image', headline:'Erstmal Überblick schaffen', icon:'search', tone:'neutral', seconds:3.5,
    voice:'Dann fehlt dir vielleicht vor allem der Überblick über deine Ausgaben.',
    file:'Bild 02 - Überblick über Ausgaben.png', labels:['Ausgaben','Überblick'],
    expected:'A person at a table sorting real receipts, bills and notes into a simple understandable overview, without app UI or dashboard graphics.',
    visual:'Eine Person sortiert echte Rechnungen und Kassenzettel auf einem Tisch; aus Chaos wird sichtbar Ordnung.',
    subject:'a person sorting everyday receipts and bills on a table into a clear simple overview',
    cause:'show the transition from scattered expense papers on one side to a neat small stack on the other; no dashboard or app interface',
  },
  {
    id:'scene-03', type:'animation', headline:'Was kommt wirklich rein?', icon:'euro', tone:'positive', seconds:5.4,
    voice:'Schreib zuerst auf, wie viel Geld jeden Monat wirklich auf deinem Konto ankommt.',
    visual:'Ein Gehalts-Geldstapel bewegt sich sichtbar zum Girokonto; danach steht der echte Monatsbetrag stabil fest.',
    beats:[
      ['Gehalt kommt auf dem Konto an.','Ein goldener Geldstapel erscheint links und bewegt sich Richtung Girokonto.',0,1.9],
      ['Der Betrag landet im Girokonto.','Das Konto nimmt den Geldstapel sichtbar auf und der Kontostand wechselt auf 2.400 €.',1.9,3.7],
      ['Das ist deine echte Einnahme für den Monat.','Ein klarer Ergebnis-Tag NETTO 2.400 € bleibt stabil sichtbar.',3.7,5.4],
    ],
  },
  {
    id:'scene-04', type:'image', headline:'Feste Kosten zuerst abziehen', icon:'receipt', tone:'neutral', seconds:4.1,
    voice:'Danach ziehst du die festen Kosten ab: Miete, Strom, Handy, Versicherungen und Abos.',
    file:'Bild 04 - Feste Kosten.png', labels:['Miete','Feste Kosten'],
    expected:'A real household table with apartment keys, electricity bill, phone, insurance folder and subscription remote grouped as unavoidable recurring costs.',
    visual:'Wohnungsschlüssel, Stromrechnung, Handy, Versicherungsordner und Abo-Fernbedienung liegen als klare feste Monatskosten zusammen.',
    subject:'a believable household table with apartment keys, an electricity bill, a phone, an insurance folder and a streaming remote',
    cause:'group the objects as recurring monthly costs with one clear rent bill leading the composition; every object must have a visible purpose',
  },
  {
    id:'scene-05', type:'image', headline:'Der Rest ist dein Alltagsbudget', icon:'wallet', tone:'positive', seconds:4.1,
    voice:'Was übrig bleibt, ist dein Geld für Essen, Freizeit, Tanken und andere tägliche Ausgaben.',
    file:'Bild 05 - Alltagsbudget.png', labels:['Alltag','Budget'],
    expected:'A remaining money stack physically sits between groceries, fuel and leisure objects, making the available everyday budget obvious.',
    visual:'Ein begrenzter Geldstapel liegt zwischen Einkaufstasche, Tankbeleg und Freizeitobjekt und zeigt: Das ist der Rest für den Alltag.',
    subject:'a limited remaining money stack between groceries, a fuel receipt and a simple leisure object',
    cause:'make the remaining stack visibly smaller than the earlier salary amount and clearly connect it to everyday spending choices',
  },
  {
    id:'scene-06', type:'animation', headline:'Mach daraus ein Wochenbudget', icon:'calendar', tone:'positive', seconds:5.6,
    voice:'Teile diesen Betrag grob durch vier. So weißt du, wie viel du pro Woche ausgeben kannst.',
    visual:'Ein Monatsbudget wird physisch in vier gleich große Wochenstapel aufgeteilt und vier Kalenderwochen zugeordnet.',
    beats:[
      ['Ein Monatsbudget liegt als ein Stapel bereit.','Ein Konto mit 800 € steht zentral, daneben ein gemeinsamer Geldstapel.',0,1.8],
      ['Der Betrag wird auf vier Wochen verteilt.','Vier Wochenkarten erscheinen nacheinander und je ein Geldstapel wandert zu ihnen.',1.8,4.0],
      ['Am Ende hat jede Woche 200 €.','Vier gleich große Stapel bleiben stabil und der Ergebnis-Tag 200 € / WOCHE erscheint.',4.0,5.6],
    ],
  },
  {
    id:'scene-07', type:'image', headline:'Kleine Ausgaben mitschreiben', icon:'list', tone:'neutral', seconds:3.7,
    voice:'Jetzt kommt der Teil, den viele vergessen: Schreib auch kleine Ausgaben auf.',
    file:'Bild 07 - Kleine Ausgaben notieren.png', labels:['Kaffee 4 €','Snack 3 €'],
    expected:'A small notebook beside a coffee receipt and snack receipt, with a hand actively recording the tiny purchases.',
    visual:'Eine Hand trägt Kaffee und Snack direkt in eine einfache Notizliste ein; kleine Belege liegen daneben.',
    subject:'a hand writing two small everyday purchases into a simple paper notebook beside the matching receipts',
    cause:'show the action of recording the purchases, not just stationery; the tiny amounts should feel easy to overlook',
  },
  {
    id:'scene-08', type:'image', headline:'Einzeln wirkt es harmlos', icon:'coins', tone:'neutral', seconds:4.2,
    voice:'Ein Kaffee hier, ein Snack dort und ein spontaner Kauf wirken einzeln harmlos.',
    file:'Bild 08 - Kleine spontane Käufe.png', labels:['4 €','3 €'],
    expected:'Three ordinary small purchases are shown as separate real-world moments: coffee, snack and a small spontaneous parcel, each visually inexpensive by itself.',
    visual:'Kaffee, Snack und kleines spontanes Paket stehen getrennt mit kleinen Preisen; jeder einzelne Kauf wirkt unauffällig.',
    subject:'three separate ordinary small purchases: a takeaway coffee, a snack and a small spontaneous parcel',
    cause:'keep each purchase visually modest and separated so every single price feels harmless on its own; no decorative pile',
  },
  {
    id:'scene-09', type:'animation', headline:'Zusammen wird daraus viel', icon:'coins', tone:'warning', seconds:5.8,
    voice:'Zusammen können genau diese kleinen Käufe am Monatsende überraschend viel Geld kosten.',
    visual:'Mehrere kleine Rechnungen erscheinen nacheinander; jede zieht Geld aus dem Konto, bis der gemeinsame Monatsbetrag deutlich sichtbar ist.',
    beats:[
      ['Die ersten kleinen Käufe erscheinen.','Kaffee- und Snack-Rechnung kommen nacheinander ins Bild und ziehen erste Münzen ab.',0,2.0],
      ['Weitere spontane Käufe kommen dazu.','Lieferung und kleiner Einkauf erscheinen; der Geldstapel schrumpft weiter und der Kostenstapel wächst.',2.0,4.2],
      ['Viele kleine Beträge ergeben zusammen 44 €.','Das Ergebnis 44 € WEG bleibt deutlich und stabil sichtbar.',4.2,5.8],
    ],
  },
  {
    id:'scene-10', type:'image', headline:'Einmal pro Woche prüfen', icon:'search', tone:'positive', seconds:4.0,
    voice:'Prüfe einmal pro Woche deine Ausgaben und ändere zuerst nur einen echten Geldfresser.',
    file:'Bild 10 - Wöchentlicher Check.png', labels:['Wochencheck','Lieferdienst'],
    expected:'A weekly review at a kitchen table where several receipts are calmly checked and one clearly expensive repeat category is singled out.',
    visual:'Mehrere Wochenbelege werden geprüft; ein wiederkehrender Lieferdienst-Beleg ist klar als erster Geldfresser markiert.',
    subject:'a calm weekly review of real receipts at a kitchen table with one repeated delivery receipt singled out',
    cause:'show one clear expensive habit being selected for change while the other receipts remain neutral; avoid charts and dashboards',
  },
  {
    id:'scene-11', type:'image', headline:'Dann planst du den nächsten Monat', icon:'calendar', tone:'positive', seconds:4.2,
    voice:'Dann weißt du, wo dein Geld bleibt – und kannst den nächsten Monat besser planen.',
    file:'Bild 11 - Nächsten Monat planen.png', labels:['Nächster Monat','Plan'],
    expected:'A relaxed person prepares the next month with a simple calendar, a small weekly budget envelope and neatly sorted receipts.',
    visual:'Die Belege sind geordnet, ein Kalender für den nächsten Monat liegt bereit und ein Wochenbudget ist sichtbar vorbereitet.',
    subject:'a relaxed person preparing next month with a paper calendar, sorted receipts and one simple weekly budget envelope',
    cause:'show the practical result of clarity: organized receipts behind, next-month calendar ahead, and a prepared weekly amount ready to use',
  },
];

const indexPath = resolve(ROOT, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.version = 29;
index.title = TITLE;
index.cover.googleFlowFileName = sceneData[0].file;
let start = 0;
index.scenes = index.scenes.map((scene, i) => {
  const d = sceneData[i];
  const durationFrames = Math.round(d.seconds * 30);
  const beats = d.beats
    ? d.beats.map((b, bi) => ({id:`${d.id}-beat-${String(bi+1).padStart(2,'0')}`,kind:'animation-phase',voiceText:b[0],visualChange:b[1],startSecond:b[2],endSecond:b[3]}))
    : [{id:`${d.id}-beat-01`,kind:'image',voiceText:d.voice,visualChange:d.visual,startSecond:0,endSecond:d.seconds}];
  const next = {
    ...scene,
    startFrame:start,
    durationFrames,
    headline:d.headline,
    icon:d.icon,
    accent:'finance-green',
    headerTone:d.tone,
    plannedDurationSeconds:d.seconds,
    targetSeconds:d.seconds,
    audioTrigger:d.voice,
    mainIdea:d.visual,
    visualBeats:beats,
  };
  if (d.type === 'image') {
    next.googleFlowFileName = d.file;
    next.objectLabels = d.labels;
    next.expectedVisual = d.expected;
    next.imagePresentation = {scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true};
  }
  start += durationFrames;
  return next;
});
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const fullScript = sceneData.map((s) => s.voice).join(' ');
writeFileSync(resolve(ROOT, '01-script/script-fliess-text.txt'), fullScript + '\n', 'utf8');

const replacePrompt = (path, d) => {
  let p = readFileSync(path, 'utf8');
  const short = d.file.replace(/^Bild \d+ - /, '').replace(/\.png$/, '');
  p = p
    .replaceAll('[KURZER SZENENNAME]', short)
    .replaceAll('[KURZES DEUTSCHES OBJEKT-LABEL]', d.labels[0])
    .replaceAll('[OPTIONALES ZWEITES KURZES LABEL]', d.labels[1])
    .replaceAll('[CLEAR MAIN SUBJECT OR ACTION]', d.subject)
    .replaceAll('[DESCRIBE THE SIMPLE VISUAL CAUSE/EFFECT OR SITUATION]', d.cause);
  if (/\[[^\]]+\]/.test(p)) throw new Error(`Bildprompt enthält Rest-Platzhalter: ${path}`);
  writeFileSync(path, p, 'utf8');
  return p;
};

const imagePrompts = [];
for (const d of sceneData.filter((s) => s.type === 'image')) {
  const path = resolve(ROOT, '03-szenen', `EINZELNE-SZENEN/${d.id}/bildprompt.txt`);
  const prompt = replacePrompt(path, d);
  imagePrompts.push(`## ${d.id} — ${d.file}\n\n${prompt}`);
}
writeFileSync(resolve(ROOT, '03-szenen/alle-bildprompts.txt'), imagePrompts.join('\n\n---\n\n') + '\n', 'utf8');
writeFileSync(resolve(ROOT, '03-szenen/00-cover/cover.txt'), readFileSync(resolve(ROOT, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt'), 'utf8'), 'utf8');

for (const d of sceneData) {
  const path = resolve(ROOT, '03-szenen', `EINZELNE-SZENEN/${d.id}/szene.md`);
  writeFileSync(path, `# ${d.id}\n\n**Typ:** ${d.type}\n**Zwischenüberschrift:** ${d.headline}\n**Icon:** ${d.icon}\n**Sprechtext:** ${d.voice}\n**Hauptvisual:** ${d.visual}\n**Geplante Dauer:** ${d.seconds.toFixed(1)} s\n`, 'utf8');
}

const anim03 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-arrives-before-budgeting
 * PRIMARY_ACTION: Ein echter Gehaltsstapel bewegt sich physisch zum Girokonto und setzt den sichtbaren Monatsbetrag auf 2.400 Euro.
 * ANIMATION_NARRATIVE
 * START: Monatskalender und leeres Girokonto warten auf den Zahlungseingang.
 * MECHANISM: Ein goldener Gehaltsstapel fährt von links zum Konto, wird aufgenommen und der Kontostand steigt sichtbar.
 * RESULT: Das Konto zeigt stabil 2.400 € und der Tag NETTO 2.400 € macht den verfügbaren Monatsbetrag eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Girokonto und ankommender Gehaltsstapel tragen die Hauptaktion.
 * SUPPORT: Monatskalender verankert den Betrag zeitlich.
 * MATERIAL: Konto neutral, Geld gold, Ergebnis grün, Kalender ivory.
 * DEPTH: Kalender links hinten, Konto zentral, Geld bewegt sich aus dem Vordergrund zum Konto.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=162}) => {
  const frame = useCurrentFrame();
  const calendarIn = interpolate(frame,[4,24],[0,1],clamp);
  const salaryMove = interpolate(frame,[24,86],[0,1],clamp);
  const accountSettle = interpolate(frame,[72,110],[0,1],clamp);
  const result = interpolate(frame,[106,Math.max(116,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinX = 120 + salaryMove*330;
  const coinY = 780 - salaryMove*120;
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={510-(1-calendarIn)*70} month="MONAT" scale={0.72} opacity={calendarIn} rotate={-5} />
    <PhysicalAccount x={420} y={520} label="Girokonto" balance={accountSettle>0.55?'2.400 €':'0 €'} state="normal" scale={0.98+accountSettle*0.02} />
    <PhysicalCoinStack x={coinX} y={coinY} count={8} scale={0.78-salaryMove*0.08} opacity={1-salaryMove*0.42} />
    <div style={{position:'absolute',left:405,top:980,opacity:result,transform:\`translateY(\${(1-result)*18}px)\`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>NETTO 2.400 €</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
`;

const anim06 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: monthly-budget-splits-into-four-weeks
 * PRIMARY_ACTION: Ein Monatsbudget von 800 Euro wird sichtbar in vier gleich große Geldstapel auf vier Kalenderwochen verteilt.
 * ANIMATION_NARRATIVE
 * START: Ein Girokonto zeigt 800 € verfügbares Alltagsbudget.
 * MECHANISM: Vier Wochenkarten erscheinen; nacheinander wandern vier gleich große Geldstapel vom Monatsbudget zu Woche 1 bis Woche 4.
 * RESULT: Vier identische Wochenstapel bleiben stehen und 200 € / WOCHE wird klar sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die physische Aufteilung eines Monatsbetrags in vier Wochenbeträge.
 * SUPPORT: Vier Kalenderseiten geben jedem Stapel eine eindeutige Woche.
 * MATERIAL: Geld gold, Kalender ivory, Ergebnis grün, Konto neutral.
 * DEPTH: Konto zentral hinten, Wochenkarten in einer breiten Reihe, Geldstapel im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene06Animation: React.FC<{durationFrames?:number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const weeksIn = interpolate(frame,[8,42],[0,1],clamp);
  const split1 = interpolate(frame,[38,72],[0,1],clamp);
  const split2 = interpolate(frame,[52,88],[0,1],clamp);
  const split3 = interpolate(frame,[66,104],[0,1],clamp);
  const split4 = interpolate(frame,[80,120],[0,1],clamp);
  const result = interpolate(frame,[116,Math.max(126,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const xs = [100,315,530,745];
  const moves = [split1,split2,split3,split4];
  return <PremiumPhysicalStage>
    <PhysicalAccount x={385} y={470} label="Monatsbudget" balance="800 €" state="normal" scale={1-result*0.04} />
    {xs.map((x,i)=><React.Fragment key={x}>
      <PhysicalCalendarPage x={x} y={735-(1-weeksIn)*55} month={\`WOCHE \${i+1}\`} scale={0.56} opacity={weeksIn} rotate={(i-1.5)*2.5} />
      <PhysicalCoinStack x={x+58} y={980-(1-moves[i])*120} count={4} scale={0.58} opacity={moves[i]} />
    </React.Fragment>)}
    <div style={{position:'absolute',left:400,top:1120,opacity:result,transform:\`translateY(\${(1-result)*15}px)\`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>200 € / WOCHE</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
`;

const anim09 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: small-purchases-accumulate-into-visible-cost
 * PRIMARY_ACTION: Vier kleine Alltagskäufe erscheinen nacheinander, ziehen sichtbar Geld aus dem Konto und addieren sich zu 44 Euro Monatskosten.
 * ANIMATION_NARRATIVE
 * START: Ein Konto zeigt 100 € frei verfügbares Geld.
 * MECHANISM: Kaffee, Snack, Lieferung und kleiner Einkauf erscheinen zeitversetzt; mit jedem Kauf wandern Münzen aus dem Konto und der Rest schrumpft.
 * RESULT: Das Konto steht bei 56 € und der Ergebnis-Tag 44 € WEG zeigt die Summe der kleinen Käufe.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konto plus nacheinander eintreffende kleine Rechnungen zeigen Ursache und Wirkung.
 * SUPPORT: Bewegter Geldstapel macht jeden Abfluss physisch sichtbar.
 * MATERIAL: Konto neutral, Rechnungen ivory, Geld gold, Warn-Ergebnis rot-orange.
 * DEPTH: Konto links, Rechnungen gestaffelt rechts, Geld bewegt sich dazwischen im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 26;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=174}) => {
  const frame = useCurrentFrame();
  const coffee = interpolate(frame,[8,32],[0,1],clamp);
  const snack = interpolate(frame,[28,54],[0,1],clamp);
  const delivery = interpolate(frame,[50,80],[0,1],clamp);
  const shop = interpolate(frame,[74,108],[0,1],clamp);
  const drain = interpolate(frame,[24,120],[0,1],clamp);
  const result = interpolate(frame,[116,Math.max(126,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalAccount x={250} y={520} label="Alltagsgeld" balance={drain>0.82?'56 €':drain>0.55?'75 €':drain>0.25?'93 €':'100 €'} state={result>0.5?'warning':'normal'} scale={1-drain*0.035} />
    <PhysicalCoinStack x={430+drain*180} y={820+drain*45} count={5} scale={0.68-drain*0.08} opacity={1-drain*0.52} />
    <PhysicalBill x={650} y={500-(1-coffee)*55} label="Kaffee" amount="4 €" rotate={-6} scale={0.55} opacity={coffee} paid={drain>0.22} />
    <PhysicalBill x={765} y={650-(1-snack)*55} label="Snack" amount="3 €" rotate={5} scale={0.55} opacity={snack} paid={drain>0.42} />
    <PhysicalBill x={640} y={820-(1-delivery)*55} label="Lieferung" amount="12 €" rotate={-3} scale={0.55} opacity={delivery} paid={drain>0.64} />
    <PhysicalBill x={770} y={960-(1-shop)*55} label="Spontankauf" amount="25 €" rotate={6} scale={0.55} opacity={shop} paid={drain>0.82} />
    <div style={{position:'absolute',left:285,top:1070,opacity:result,transform:\`translateY(\${(1-result)*16}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:28}}>44 € WEG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
`;

const animations = {'scene-03':anim03,'scene-06':anim06,'scene-09':anim09};
for (const [id, code] of Object.entries(animations)) {
  const dir = resolve(ROOT, '03-szenen', `EINZELNE-SZENEN/${id}`);
  writeFileSync(resolve(dir, 'animation.tsx'), code, 'utf8');
  const d = sceneData.find((s) => s.id === id);
  writeFileSync(resolve(dir, 'remotion.md'), `# ${id} — Remotion\n\n**Sprechtext:** ${d.voice}\n\n**Mechanik:** ${d.visual}\n\n**Timing:** START → sichtbare physische Aktion → eindeutiges Ergebnis. Ergebnis mindestens 24 Frames stabil halten.\n\n**Visual-Lock:** finanzneo-premium-physical-animation-v2 · PremiumPhysicalStage · pure black central canvas · keine Kartenreihen oder Fortschrittsbalken als Haupterklärung.\n`, 'utf8');
}

const beatLines = ['# Visual Beats','','VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2',''];
for (const d of sceneData) {
  beatLines.push(`## ${d.id} — ${d.headline}`,'',`Sprechtext: ${d.voice}`,'',`Dauer: ${d.seconds.toFixed(1)} s`,'');
  const beats = d.beats ?? [[d.voice,d.visual,0,d.seconds]];
  beats.forEach((b,i)=>beatLines.push(`- Beat ${i+1}: ${b[0]} | Sichtbar: ${b[1]} | ${Number(b[2]).toFixed(1)}–${Number(b[3]).toFixed(1)} s`));
  beatLines.push('');
}
writeFileSync(resolve(ROOT, '05-projektdateien/visual-beats.md'), beatLines.join('\n') + '\n', 'utf8');

const storyRules = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2\n\nKeine stumpfen Symbolbilder. Alltag, Handlung oder Konsequenz tragen die Aussage. Ursache → Wirkung ist die bevorzugte Erklärlogik. Wenn ein Satz mehrere sichtbare Gedanken braucht, ist ein zusätzliches Bild besser als ein überladenes Stillleben.`;
const plan = ['# SZENENPLAN','',storyRules,'','Cover Hook V2: Szene 01 ist Hero-Bild plus exakter Reel-Titel ab Frame 0; keine Untertitel bis Szene 02.',''];
for (const d of sceneData) plan.push(`- ${d.id} | ${d.type} | ${d.headline} | ${d.icon} | ${d.seconds.toFixed(1)} s | ${d.voice}`);
writeFileSync(resolve(ROOT, '05-projektdateien/szenenplan.md'), plan.join('\n') + '\n', 'utf8');

writeFileSync(resolve(ROOT, '05-projektdateien/animationen.md'), `# ANIMATIONEN\n\n- scene-03: salary-arrives-before-budgeting — Gehalt landet physisch auf dem Girokonto.\n- scene-06: monthly-budget-splits-into-four-weeks — Monatsbudget teilt sich sichtbar in vier Wochen.\n- scene-09: small-purchases-accumulate-into-visible-cost — kleine Käufe addieren sich sichtbar zu 44 €.\n\nAlle drei nutzen finanzneo-premium-physical-animation-v2, PremiumPhysicalStage, START → MECHANISMUS → ERGEBNIS und einen stabilen Result-Hold.\n`, 'utf8');

writeFileSync(resolve(ROOT, '05-projektdateien/recherche-quellen.md'), `# RECHERCHE UND QUELLEN\n\n## Verbraucherzentrale — Haushaltsbuch führen: Überblick über Ihre Finanzen\nStand: 06. August 2026\nhttps://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/haushaltsbuch-fuehren-ueberblick-ueber-ihre-finanzen-52179\n\nVerwendete Kernaussagen:\n- regelmäßige Einnahmen zuerst erfassen\n- feste Ausgaben ermitteln und abziehen\n- Einnahmen minus feste Ausgaben ergibt das verfügbare Budget für veränderliche Ausgaben\n- dieses Budget kann grob durch vier geteilt werden, um ein Wochenbudget zu erhalten\n- auch kleine und variable Ausgaben vollständig notieren\n- regelmäßig Bilanz ziehen und konkrete Sparmöglichkeiten erkennen\n\n## Verbraucherzentrale — Budgetplaner\nStand: 26. November 2024\nhttps://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredit-schulden-insolvenz/wie-viel-geld-ist-am-monatsende-uebrig-unser-interaktiver-budgetplaner-101497\n\nKeine individuelle Finanzberatung. Das Reel erklärt eine einfache Methode für mehr Überblick.\n`, 'utf8');

writeFileSync(resolve(ROOT, '04-caption/caption.txt'), `Am Monatsende ist das Geld fast weg? Ein einfacher Überblick hilft: regelmäßige Einnahmen notieren, feste Kosten abziehen und den Rest als Budget für Essen, Freizeit und andere tägliche Ausgaben sehen. Die Verbraucherzentrale empfiehlt, dieses verfügbare Budget grob durch vier zu teilen, um ein Wochenbudget zu bekommen. Kleine Ausgaben ebenfalls notieren und regelmäßig prüfen. So erkennst du schneller, wo dein Geld bleibt.\n\nQuelle: Verbraucherzentrale, Stand August 2026. Keine individuelle Finanzberatung.\n`, 'utf8');

writeFileSync(resolve(ROOT, '05-projektdateien/sound-plan.md'), `# SOUND PLAN\n\n- scene-01: sehr kurzer softer money-drop beim sichtbaren Hook, Voiceover sofort starten\n- scene-03: leiser Coin-Move beim Gehaltseingang, kurzer positiver Settle beim Ergebnis\n- scene-06: vier dezente Coin-Settle-Sounds beim Aufteilen auf die Wochen\n- scene-09: vier kurze Receipt-/Coin-Impacts; letzter Impact etwas kräftiger beim Ergebnis 44 € WEG\n- übrige Bildszenen: keine unnötigen Effekte; Voiceover bleibt klar im Vordergrund\n\nKeine Musikpflicht. SFX nur unterstützend und framegenau.\n`, 'utf8');

const timeline = {version:2,title:TITLE,fps:30,timingSource:'04-caption/word-timings.json',cutRule:'voice-sentence-or-meaningful-phrase-start',sceneCount:sceneData.length,scenes:sceneData.map((d,i)=>({id:d.id,type:d.type,plannedDurationSeconds:d.seconds,startFrame:index.scenes[i].startFrame,durationFrames:index.scenes[i].durationFrames}))};
writeFileSync(resolve(ROOT, '05-projektdateien/timeline.json'), JSON.stringify(timeline, null, 2) + '\n', 'utf8');

console.log(`✓ Mittwoch-Reel Phase 1 gebaut: ${ROOT}`);
console.log(`✓ Thema: ${TITLE}`);
console.log('✓ 11 Szenen · 8 Bilder · 3 reale Remotion-Animationen · Future Cover Hook V2 · Image Storytelling V2 · Visual Beats V2.');
