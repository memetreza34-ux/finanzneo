#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  SERIES_LOCK_MARKER,
  WORLD_ID_MARKER,
} from './lib/reel-contract.mjs';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK} from './lib/flow-autonomy.mjs';

const target = 'reels/2026-08-31_bis_2026-09-06/montag/reel-01_girokonto-oder-tagesgeld';
const root = resolve(target);
const title = 'Girokonto oder Tagesgeld?';
const types = 'image,image,animation,image,image,animation,image,image,animation,animation';

if (existsSync(root)) rmSync(root, {recursive: true, force: true});

const create = spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-reel.mjs'),
  '--target', target,
  '--title', title,
  '--types', types,
], {stdio: 'inherit'});
if (create.status !== 0) process.exit(create.status ?? 1);

const write = (relativePath, content) => {
  const path = resolve(root, relativePath);
  mkdirSync(resolve(path, '..'), {recursive: true});
  writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
};

const sceneData = [
  {
    id:'scene-01', type:'image', headline:'Zwei Konten, zwei Aufgaben', icon:'wallet', headerTone:'default', targetSeconds:5,
    audio:'Viele lassen ihr ganzes Geld auf einem Konto. Dabei haben Girokonto und Tagesgeld zwei verschiedene Aufgaben.',
    mainIdea:'Ein normaler Alltag zeigt zwei klar getrennte Geldplätze: Girokonto für laufende Zahlungen und Tagesgeld für Rücklagen.',
    file:'Bild 01 - Zwei Konten zwei Aufgaben.png', labels:['Girokonto','Tagesgeld'],
    image:'Create one coherent everyday finance scene with a simple home desk or entryway setting. Show a recognizable everyday Girokonto object on the left connected to ordinary daily items such as a debit card, rent envelope and grocery receipt. On the right show a clearly separate Tagesgeld reserve container with money intentionally set aside. The visual point must be understood immediately: these are two different places for two different jobs, not two versions of the same account.',
    expected:'A believable stylized-3D everyday setup where Girokonto is visibly tied to daily payments while Tagesgeld is clearly separated as reserve money; no dashboard or abstract icon comparison.'
  },
  {
    id:'scene-02', type:'image', headline:'Das Girokonto ist für heute', icon:'bank', headerTone:'money', targetSeconds:5,
    audio:'Das Girokonto ist für deinen Alltag. Hier kommen Gehalt rein und Miete, Einkäufe oder Rechnungen gehen raus.',
    mainIdea:'Ein Girokonto steht mitten im Alltag und ist sichtbar mit Gehalt, Miete, Einkäufen und Rechnungen verbunden.',
    file:'Bild 02 - Girokonto Alltag.png', labels:['Girokonto','Gehalt','Miete'],
    image:'Create a grounded everyday scene centered on one physical Girokonto object. Show salary arriving as a simple money envelope labeled “Gehalt”, while a rent envelope labeled “Miete” and a normal grocery receipt sit nearby as outgoing everyday obligations. The account must feel like the active hub of normal life, not like a savings vault.',
    expected:'A real-life-grounded Girokonto scene with salary coming in and normal household spending around it, instantly readable without app UI.'
  },
  {
    id:'scene-03', type:'animation', headline:'Hier bewegt sich dein Geld', icon:'repeat', headerTone:'money', targetSeconds:5,
    audio:'Das Geld bewegt sich dort ständig: rein, raus, bezahlen. Genau dafür ist das Girokonto gemacht.',
    mainIdea:'Gehalt fließt sichtbar ins Girokonto; danach verlassen zwei Geldstapel das Konto und bezahlen Miete und Einkauf.',
    mechanic:'giro-salary-in-daily-payments-out',
    intent:'Gehalt kommt als echter Geldstapel ins Girokonto → Miete und Einkauf erscheinen → zwei Teilbeträge verlassen das Girokonto → beide Alltagsausgaben werden bezahlt → Girokonto bleibt als aktives Alltagskonto sichtbar.'
  },
  {
    id:'scene-04', type:'image', headline:'Tagesgeld ist für später', icon:'clock', headerTone:'positive', targetSeconds:4.5,
    audio:'Tagesgeld ist anders. Dort parkst du Rücklagen und kannst trotzdem täglich auf das Geld zugreifen.',
    mainIdea:'Tagesgeld wird als ruhig geparkte, erreichbare Rücklage gezeigt und klar vom Alltagskonto getrennt.',
    file:'Bild 04 - Tagesgeld Ruecklage.png', labels:['Tagesgeld','Rücklage'],
    image:'Create a calm stylized 3D reserve scene. Show a transparent or semi-open physical money container labeled “Tagesgeld” holding a clearly visible reserve. Add one simple access cue such as an open path or reachable handle, but do not turn the scene into a diagram. The money should look intentionally parked and available, not locked away for years.',
    expected:'A calm, accessible reserve labeled Tagesgeld/Rücklage, clearly separate from daily spending and not portrayed as a long-term locked product.'
  },
  {
    id:'scene-05', type:'image', headline:'Dafür eignet es sich', icon:'target', headerTone:'positive', targetSeconds:5,
    audio:'Zum Beispiel für deinen Notgroschen oder Geld, das du in ein paar Monaten brauchst.',
    mainIdea:'Zwei konkrete Rücklagenzwecke liegen neben einem Tagesgeldkonto: Notgroschen und eine geplante Ausgabe in einigen Monaten.',
    file:'Bild 05 - Ruecklagen Beispiele.png', labels:['Notgroschen','Später'],
    image:'Create one believable reserve-planning scene. Show a Tagesgeld reserve in the center. Beside it, show a small emergency-fund jar or envelope labeled “Notgroschen” and one concrete planned-future object such as a laptop replacement or travel suitcase tagged only “Später”. Keep both examples physically grounded and easy to understand; this is about money needed as reserve or within the next months.',
    expected:'Concrete beginner-friendly use cases for Tagesgeld: emergency reserve and a planned medium-term expense, shown as real objects rather than abstract finance cards.'
  },
  {
    id:'scene-06', type:'animation', headline:'Der Unterschied ist einfach', icon:'arrowRight', headerTone:'positive', targetSeconds:4.5,
    audio:'Der Unterschied ist einfach: Girokonto bedeutet Alltag. Tagesgeld bedeutet Rücklage.',
    mainIdea:'Alltagsausgaben ziehen sichtbar Geld aus dem Girokonto, während der getrennte Tagesgeld-Reservetank ruhig stehen bleibt.',
    mechanic:'daily-spending-moves-giro-reserve-stays',
    intent:'Girokonto und Tagesgeld stehen nebeneinander → Gehalt landet zunächst im Girokonto → eine Alltagsrechnung zieht Geld aus dem Girokonto → der Tagesgeld-Reservetank bleibt stabil → Ergebnis zeigt ALLTAG links und RÜCKLAGE rechts.'
  },
  {
    id:'scene-07', type:'image', headline:'Tagesgeld kann Zinsen bringen', icon:'percent', headerTone:'money', targetSeconds:5.5,
    audio:'Auf Tagesgeld bekommst du oft Zinsen. Wie hoch sie sind, hängt von der Bank und dem Angebot ab.',
    mainIdea:'Ein Tagesgeld-Reservetopf erhält einen kleinen zusätzlichen Geldbetrag als Zins, ohne einen festen Zinssatz zu behaupten.',
    file:'Bild 07 - Tagesgeld Zinsen.png', labels:['Tagesgeld','Zinsen'],
    image:'Create a clear stylized 3D scene with a physical Tagesgeld reserve container holding money. Add a small but visible additional coin amount arriving above or beside it, labeled only “Zinsen”. Do not show a percentage, guaranteed rate or bank brand. The viewer should understand that Tagesgeld can earn interest, while the exact amount can vary.',
    expected:'Tagesgeld reserve plus a modest additional interest amount; no fixed rate, no guaranteed return, no bank advertisement.'
  },
  {
    id:'scene-08', type:'image', headline:'Nicht für tägliche Einkäufe', icon:'cross', headerTone:'warning', targetSeconds:4.5,
    audio:'Wichtig: Tagesgeld ist nicht für Kartenzahlungen oder deine täglichen Einkäufe gedacht.',
    mainIdea:'Eine Alltagssituation an einer Kasse zeigt, dass die normale Zahlung über das Girokonto läuft und Tagesgeld nicht die Bezahlkarte ersetzt.',
    file:'Bild 08 - Nicht fuer Kartenzahlung.png', labels:['Girokonto','Tagesgeld'],
    image:'Create a simple checkout scene in the same stylized 3D world. A normal debit-card payment connected to “Girokonto” is being used for groceries. Keep a separate “Tagesgeld” reserve physically off to the side and clearly not connected to the payment terminal. The message must be obvious without a red prohibition sign dominating the scene: daily card payments belong to the Girokonto, not the Tagesgeld reserve.',
    expected:'A real checkout/payment situation where Girokonto handles the purchase and Tagesgeld remains separate; no app UI and no abstract prohibition-only composition.'
  },
  {
    id:'scene-09', type:'animation', headline:'Trenn dein Geld automatisch', icon:'repeat', headerTone:'positive', targetSeconds:5.5,
    audio:'Ein einfacher Start: Gehalt kommt aufs Girokonto. Ein fester Betrag geht automatisch aufs Tagesgeld.',
    mainIdea:'Nach Gehaltseingang trennt sich ein fester Geldstapel sichtbar vom Girokonto und wandert jeden Monat in den Tagesgeld-Reservetank.',
    mechanic:'salary-arrives-fixed-share-moves-to-savings',
    intent:'Monatsanfang erscheint → Gehalt landet im Girokonto → ein klar abgegrenzter Geldstapel löst sich → bewegt sich sichtbar zum Tagesgeld → Reservefüllstand steigt → Ergebnis AUTO GETRENNT.'
  },
  {
    id:'scene-10', type:'animation', headline:'Giro heute, Tagesgeld später', icon:'check', headerTone:'positive', targetSeconds:6,
    audio:'So bleibt dein Alltagsgeld getrennt von deiner Rücklage. Merke dir: Giro für heute, Tagesgeld für später.',
    mainIdea:'Eine heutige Alltagsrechnung wird aus dem Girokonto bezahlt, während ein zweiter Geldstapel beim Tagesgeld sichtbar für später stehen bleibt.',
    mechanic:'today-bill-uses-giro-future-money-stays',
    intent:'HEUTE-Kalender und Einkauf erscheinen beim Girokonto → Giro-Geld bezahlt den Einkauf → SPÄTER-Kalender bleibt beim Tagesgeld → Rücklage bleibt unberührt → Schlussbild stellt HEUTE und SPÄTER klar gegenüber.'
  },
];

const durations = [150,150,150,135,150,135,165,135,165,180];
let startFrame = 0;
sceneData.forEach((scene, index) => {
  scene.durationFrames = durations[index];
  scene.startFrame = startFrame;
  startFrame += durations[index];
});

const script = sceneData.map((scene) => scene.audio).join(' ');
write('01-script/script-fliess-text.txt', script);

write('04-caption/caption.txt', `Girokonto und Tagesgeld haben zwei unterschiedliche Aufgaben. Das Girokonto ist für Gehalt, Miete, Einkäufe und andere Zahlungen im Alltag. Tagesgeld ist für Rücklagen und Geld, das du nicht täglich ausgeben willst. Tagesgeldkonten sind nicht für den normalen Zahlungsverkehr gedacht und bieten in der Regel Zinsen; die Höhe kann sich je nach Bank und Angebot ändern.\n\nQuelle: Verbraucherzentrale und BaFin, Stand 2026. Keine individuelle Finanz- oder Anlageberatung.`);

write('05-projektdateien/recherche-quellen.md', `# Recherche und Quellen\n\n## Kernaussagen\n\n- Ein Girokonto ist ein Zahlungskonto und wird für alltägliche Zahlungsvorgänge genutzt.\n- Tagesgeld ist nicht für den normalen Zahlungsverkehr gedacht.\n- Über Tagesgeld kann grundsätzlich täglich verfügt werden.\n- Tagesgeldkonten bieten in der Regel Zinsen; die Zinshöhe kann sich ändern.\n- Tagesgeld eignet sich deshalb für eine Liquiditätsreserve bzw. kurzfristig verfügbare Rücklagen.\n\n## Quellen\n\n1. Verbraucherzentrale: „Finanzglossar – Durchblick von A wie Aktien bis Z wie Zins“, Abschnitt Tagesgeldkonto. Abruf 30.08.2026. https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/finanzglossar-durchblick-von-a-wie-aktien-bis-z-wie-zins-15907\n2. Verbraucherzentrale: „Girokonto: Was Sie darüber wissen sollten“, Stand 10.12.2025. https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/girokonto-was-sie-darueber-wissen-sollten-4990\n3. BaFin-Kontenvergleich: Glossar „Zahlungskonto“ / Hinweise zu Girokonten. Abruf 30.08.2026. https://kontenvergleich.bafin.de/de/glossar/zahlungskonto\n\n## Sprachregel\n\nDas Reel richtet sich an komplette Anfänger. Keine Produkt- oder Bankempfehlung, kein konkreter Zinssatz, keine Aussage über garantierte Rendite. Technische Begriffe werden vermieden, solange Alltagssprache reicht.`);

const commonPrompt = `\n${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nSTYLE:\nUse premium real-world-grounded stylized 3D. Keep recognizable everyday proportions, polished materials and soft rounded construction. The result must be clearly stylized and cinematic, never photorealistic, never a toy-like icon pack.\n\nBACKGROUND:\nUse one seamless deep black background. Any real-life context must fade naturally into the black world. No bright room, floor-wall boundary, horizon, colored background zone, particles, aurora or grid.\n\nCOMPOSITION:\nOne clear main situation per image. Supporting objects are flexible and appear only when they improve understanding. Real-world cause/effect and object relationships must be readable in 1–2 seconds.\n\nBRANDS + LOGOS:\nNo real bank branding. Generic but recognizable financial objects only. Never paste screenshots, apps, websites or flat logos.\n\nCOLORS + LIGHT:\nEmerald green for positive/separated reserve states, warm ivory and soft gray for neutral objects, subtle gold for money/value, warm red-orange only for warnings or costs. Clean soft lighting and contact shadows.\n\nTEXT:\nOnly the explicitly requested short German object labels may appear. No headline, subtitle, CTA, long sentence or tiny body copy.\n\nFORBIDDEN:\nNo photorealism, no dashboard, no app UI, no flowchart, no small boxes connected by thin lines, no generic card rows, no abstract icon-only replacement, no miniature diorama and no decorative clutter.\n`;

const makePrompt = (scene) => `${FLOW_AGENT_PROTOCOL_MARKER}\n${FLOW_EXECUTION_MODE_MARKER}\n${FLOW_STATE_MACHINE_MARKER}\n${FLOW_STRUCTURE_LOCK_MARKER}\nMAX_CONCURRENT_GENERATIONS = 1\n\nAKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN\n\nGOOGLE FLOW – FINALER DATEINAME:\n${scene.file}\n\nErzeuge ausschließlich dieses eine Bild. Warte intern vollständig auf das Ergebnis, benenne es sofort exakt um und prüfe Motiv, erlaubte Labels, V9-Stil, tiefschwarzen Hintergrund und Dateiname. Keine Bildreferenz verwenden. Bei Fehler ausschließlich dieselbe Bildnummer neu erzeugen. Erst nach PASS darf das nächste Bild starten.\n\nBESCHRIFTUNGEN – EXAKT SO:\n${scene.labels.map((label) => `- ${label}`).join('\n')}\n\nIMAGE PROMPT:\n${scene.image}\n${commonPrompt}`;

const imageScenes = sceneData.filter((scene) => scene.type === 'image');
for (const scene of imageScenes) {
  write(`03-szenen/EINZELNE-SZENEN/${scene.id}/bildprompt.txt`, makePrompt(scene));
}

write('03-szenen/00-cover/cover.txt', `COVER = SZENE 01 — KEIN SEPARATER BILDJOB\n\nDie erste Reel-Szene ist automatisch das Cover. Google Flow darf KEIN zusätzliches Cover und KEIN Bild 00 erzeugen. Für Reel und Cover wird exakt dieselbe fertige Datei aus scene-01 verwendet.\n\nSOURCE_SCENE_ID: scene-01\nGOOGLE FLOW – FINALER DATEINAME:\n${sceneData[0].file}\n\n${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nEXACT SHORT GERMAN OBJECT LABELS:\n- exakt dieselben Labels wie im kanonischen Bildprompt von scene-01\n\nIMAGE PROMPT:\nThis file is a technical alias only. The cover is exactly the final scene-01 image showing two clearly separated money jobs: Girokonto for everyday payments and Tagesgeld for reserve money. Do not start another generation job and do not redesign the composition.\n\nFORBIDDEN:\nNo separate cover generation, no Bild 00, no photorealism, no dashboard, no app UI, no flowchart and no abstract icon-only replacement.`);

write('03-szenen/alle-bildprompts.txt', `${AUTONOMY_BLOCK}${FLOW_AGENT_BLOCK}\n${imageScenes.map((scene, index) => `\n===== BILDBLOCK ${index + 1}/${imageScenes.length} · ${scene.id} =====\n\n${makePrompt(scene)}`).join('\n')}\n\nABSCHLUSS:\nErst nachdem alle ${imageScenes.length} Einzelbilder nacheinander erzeugt, exakt umbenannt und geprüft wurden, ist die Bildphase abgeschlossen. Szene 01 ist gleichzeitig das Cover. Kein Bild 00 erzeugen.`);

for (const scene of sceneData) {
  const base = `# ${scene.id}\n\n**Typ:** ${scene.type}\n**Zwischenüberschrift:** ${scene.headline}\n**Icon:** ${scene.icon}\n**Sprechtext:** ${scene.audio}\n**Hauptaussage:** ${scene.mainIdea}\n`;
  if (scene.type === 'image') {
    write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `${base}\n**Google-Flow-Datei:** ${scene.file}\n**Bildprompt:** bildprompt.txt\n`);
  } else {
    write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `${base}\n**Animation:** animation.tsx\n**Mechanik:** ${scene.mechanic}\n`);
    write(`03-szenen/EINZELNE-SZENEN/${scene.id}/remotion.md`, `# ${scene.id} — Remotion\n\nANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1\nPREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2\nVISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9\n\n## Sprechtext\n${scene.audio}\n\n## Mechanik\nMECHANIC_ID: ${scene.mechanic}\n\nPRIMARY_ACTION: ${scene.intent}\n\n## Pflicht\n- START → MECHANISMUS → RESULT muss ohne Ton verständlich sein.\n- Reale physische Objekte tragen die Erklärung.\n- Mehrere koordinierte Motion-Channels mit unterschiedlicher Bewegungsphysik.\n- Ergebnis mindestens 15 Frames stabil halten.\n- Pure-black Canvas kommt zentral; AnimationStage bleibt transparent.\n- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.\n- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.\n- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.`);
  }
}

const animation03 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: giro-salary-in-daily-payments-out
 * PRIMARY_ACTION: Gehalt landet physisch im Girokonto; danach verlassen zwei sichtbare Geldstapel das Konto und bezahlen Miete und Einkauf.
 * ANIMATION_NARRATIVE
 * START: Das Girokonto steht als Alltagskonto bereit, Gehalt nähert sich von links.
 * MECHANISM: Gehalt landet im Konto; Miete und Einkauf erscheinen; zwei getrennte Geldstapel bewegen sich zu den Ausgaben.
 * RESULT: Beide Alltagsausgaben sind bezahlt und das Girokonto bleibt als aktiver Zahlungsort sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Girokonto und reale Geldbewegung tragen die Erklärung.
 * SUPPORT: Miete und Einkauf zeigen konkrete Alltagsausgaben.
 * MATERIAL: Neutraler Kontokörper, Gold für Geld, Ivory für Rechnungen, Emerald nur für bezahlte Resultate.
 * DEPTH: Gehalt links vorne, Girokonto zentral, Ausgaben links/rechts tiefer im Raum.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=150}) => {
  const frame = useCurrentFrame();
  const salaryIn = interpolate(frame,[4,38],[0,1],clamp);
  const billsIn = interpolate(frame,[30,58],[0,1],clamp);
  const rentPay = interpolate(frame,[58,96],[0,1],clamp);
  const shopPay = interpolate(frame,[68,106],[0,1],clamp);
  const result = interpolate(frame,[104,Math.max(112,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const salaryX = 40 + salaryIn*360;
  const salaryY = 650 - salaryIn*55;
  const rentX = 435 - rentPay*255;
  const rentY = 760 + rentPay*165;
  const shopX = 510 + shopPay*265;
  const shopY = 760 + shopPay*165;

  return <PremiumPhysicalStage>
    <PhysicalAccount x={385} y={560} label="Girokonto" balance={result>0.55?'Alltag':'Gehalt'} state={result>0.55?'protected':'normal'} scale={0.96+salaryIn*0.04} />
    <PhysicalCoinStack x={salaryX} y={salaryY} count={6} scale={0.82-salaryIn*0.08} opacity={1-result*0.72} />
    <PhysicalBill x={65} y={845-(1-billsIn)*85} label="Miete" amount="900 €" scale={0.72} opacity={billsIn} paid={rentPay>0.72} />
    <PhysicalBill x={745} y={845-(1-billsIn)*65} label="Einkauf" amount="120 €" rotate={6} scale={0.72} opacity={billsIn} paid={shopPay>0.72} />
    <PhysicalCoinStack x={rentX} y={rentY} count={4} scale={0.62} opacity={billsIn*(1-rentPay*0.42)} />
    <PhysicalCoinStack x={shopX} y={shopY} count={3} scale={0.58} opacity={billsIn*(1-shopPay*0.42)} />
    <div style={{position:'absolute',left:420,top:1030,opacity:result,transform:\`translateY(\${(1-result)*14}px)\`,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:25}}>ALLTAG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;

const animation06 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: daily-spending-moves-giro-reserve-stays
 * PRIMARY_ACTION: Eine konkrete Alltagsrechnung zieht Geld aus dem Girokonto, während die getrennte Tagesgeld-Rücklage sichtbar stabil bleibt.
 * ANIMATION_NARRATIVE
 * START: Girokonto links und Tagesgeld rechts stehen getrennt bereit.
 * MECHANISM: Gehalt stärkt kurz das Girokonto; eine Alltagsrechnung erscheint und zieht einen Geldstapel aus dem Girokonto. Die Reserve rechts bewegt sich nicht mit.
 * RESULT: Links steht ALLTAG, rechts RÜCKLAGE; der Unterschied ist körperlich sichtbar statt nur beschriftet.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das belastete Girokonto und der stabile Reservebehälter bilden den klaren Kontrast.
 * SUPPORT: Eine reale Alltagsrechnung zeigt, warum sich Geld links bewegt.
 * MATERIAL: Neutral/Gold links, Emerald/Gold rechts, Warnfarbe nur an der offenen Rechnung.
 * DEPTH: Giro und Rechnung links vorne, Reserve rechts leicht zurückgesetzt.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const salary = interpolate(frame,[4,30],[0,1],clamp);
  const billIn = interpolate(frame,[26,52],[0,1],clamp);
  const payment = interpolate(frame,[50,88],[0,1],clamp);
  const reserveSettle = interpolate(frame,[70,98],[0,1],clamp);
  const result = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const inX = 30 + salary*230;
  const outX = 300 - payment*145;
  const outY = 760 + payment*135;

  return <PremiumPhysicalStage>
    <PhysicalAccount x={145} y={585} label="Girokonto" balance={payment>0.7?'Alltag':'Gehalt'} scale={0.96+salary*0.04-payment*0.025} />
    <PhysicalCoinStack x={inX} y={690-salary*45} count={5} scale={0.65} opacity={1-payment*0.75} />
    <PhysicalBill x={35} y={875-(1-billIn)*70} label="Einkauf" amount="75 €" scale={0.68} opacity={billIn} paid={payment>0.7} />
    <PhysicalCoinStack x={outX} y={outY} count={3} scale={0.55} opacity={billIn*(1-payment*0.45)} />
    <PhysicalReserveTank x={690} y={555-reserveSettle*8} width={250} height={380} fill={0.72} label="Tagesgeld" scale={0.96+reserveSettle*0.04} />
    <div style={{position:'absolute',left:180,top:1025,opacity:result,color:ANIMATION_COLORS.secondaryText}}><PhysicalTag style={{fontSize:24}}>ALLTAG</PhysicalTag></div>
    <div style={{position:'absolute',left:735,top:1025,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:24}}>RÜCKLAGE</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;

const animation09 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-arrives-fixed-share-moves-to-savings
 * PRIMARY_ACTION: Nach dem Gehaltseingang löst sich ein fester Geldstapel vom Girokonto und wandert automatisch in den Tagesgeld-Reservetank.
 * ANIMATION_NARRATIVE
 * START: Monatsanfang, Girokonto und Tagesgeld stehen getrennt bereit.
 * MECHANISM: Gehalt landet im Girokonto; danach trennt sich ein kleinerer Geldstapel und bewegt sich sichtbar in den Tagesgeldbehälter.
 * RESULT: Der Tagesgeld-Füllstand ist gestiegen und AUTO GETRENNT bestätigt nur das sichtbare Ergebnis.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Physische Trennung eines Geldstapels zwischen den beiden Konten.
 * SUPPORT: Monatsblatt macht den wiederkehrenden Ablauf konkret.
 * MATERIAL: Ivory Kalender, neutraler Girokörper, Gold Geld, Emerald für das erreichte Trenn-Ergebnis.
 * DEPTH: Kalender hinten links, Giro mittig links, Bewegungsweg durch die Mitte, Reserve rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=165}) => {
  const frame = useCurrentFrame();
  const monthIn = interpolate(frame,[2,24],[0,1],clamp);
  const salaryIn = interpolate(frame,[18,52],[0,1],clamp);
  const split = interpolate(frame,[52,78],[0,1],clamp);
  const transfer = interpolate(frame,[72,118],[0,1],clamp);
  const fill = 0.46 + transfer*0.20;
  const result = interpolate(frame,[112,Math.max(122,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const salaryX = 65 + salaryIn*285;
  const savingsX = 430 + transfer*330;
  const savingsY = 785 - split*35 - transfer*70;

  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={55} y={470-(1-monthIn)*55} month="MONAT" amount="Gehalt" scale={0.82} opacity={monthIn} rotate={-5+monthIn*5} />
    <PhysicalAccount x={300} y={625} label="Girokonto" balance="Gehalt" scale={0.96+salaryIn*0.04} />
    <PhysicalCoinStack x={salaryX} y={720-salaryIn*35} count={6} scale={0.68} opacity={1-split*0.68} />
    <PhysicalCoinStack x={savingsX} y={savingsY} count={4} scale={0.62} opacity={split} />
    <PhysicalReserveTank x={740} y={545} width={235} height={390} fill={fill} label="Tagesgeld" scale={0.97+transfer*0.03} />
    <div style={{position:'absolute',left:650,top:1015,opacity:result,transform:\`translateY(\${(1-result)*14}px)\`,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:24}}>AUTO GETRENNT</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;

const animation10 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: today-bill-uses-giro-future-money-stays
 * PRIMARY_ACTION: Eine heutige Alltagsausgabe wird aus dem Girokonto bezahlt, während die Tagesgeld-Rücklage physisch stehen bleibt und mit SPÄTER verknüpft wird.
 * ANIMATION_NARRATIVE
 * START: HEUTE steht beim Girokonto, SPÄTER beim Tagesgeld; beide Geldbereiche sind getrennt.
 * MECHANISM: Eine Einkaufsrechnung erscheint bei HEUTE, ein Geldstapel verlässt das Girokonto und bezahlt sie. Die Reserve rechts bleibt unverändert.
 * RESULT: Einkauf ist bezahlt; HEUTE/Giro und SPÄTER/Tagesgeld bleiben als zwei klare Aufgaben sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konkrete heutige Zahlung links gegen sichtbar unangetastete Rücklage rechts.
 * SUPPORT: Kalenderblätter benennen nur den Zeitbezug.
 * MATERIAL: Ivory Kalender/Rechnung, Gold Geld, neutraler Girokörper, Emerald nur für abgeschlossene Zahlung und Reserve.
 * DEPTH: HEUTE links oben, Giro und Rechnung links unten; SPÄTER und Reserve rechts als stabile zweite Ebene.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame = useCurrentFrame();
  const calendars = interpolate(frame,[2,28],[0,1],clamp);
  const billIn = interpolate(frame,[28,60],[0,1],clamp);
  const pay = interpolate(frame,[58,108],[0,1],clamp);
  const reserveEmphasis = interpolate(frame,[88,126],[0,1],clamp);
  const result = interpolate(frame,[118,Math.max(130,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const payX = 330 - pay*145;
  const payY = 770 + pay*150;

  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={65} y={420-(1-calendars)*55} month="HEUTE" scale={0.72} opacity={calendars} />
    <PhysicalCalendarPage x={785} y={420-(1-calendars)*55} month="SPÄTER" scale={0.72} opacity={calendars} />
    <PhysicalAccount x={120} y={625} label="Girokonto" balance="Alltag" scale={0.96+pay*0.025} />
    <PhysicalBill x={45} y={905-(1-billIn)*70} label="Einkauf" amount="65 €" scale={0.67} opacity={billIn} paid={pay>0.7} />
    <PhysicalCoinStack x={payX} y={payY} count={3} scale={0.56} opacity={billIn*(1-pay*0.42)} />
    <PhysicalReserveTank x={720} y={600-reserveEmphasis*10} width={245} height={380} fill={0.72} label="Tagesgeld" scale={0.96+reserveEmphasis*0.04} />
    <div style={{position:'absolute',left:105,top:1035,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:23}}>BEZAHLT</PhysicalTag></div>
    <div style={{position:'absolute',left:745,top:1035,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:23}}>BLEIBT LIEGEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;

write('03-szenen/EINZELNE-SZENEN/scene-03/animation.tsx', animation03);
write('03-szenen/EINZELNE-SZENEN/scene-06/animation.tsx', animation06);
write('03-szenen/EINZELNE-SZENEN/scene-09/animation.tsx', animation09);
write('03-szenen/EINZELNE-SZENEN/scene-10/animation.tsx', animation10);

write('05-projektdateien/szenenplan.md', `# Szenenplan — Girokonto oder Tagesgeld?\n\nZielgruppe: komplette Finanz-Anfänger. Eine Aussage pro Szene, Alltagssprache, keine unnötigen Fachbegriffe.\n\n| Szene | Typ | Header | Kernidee |\n|---|---|---|---|\n${sceneData.map((scene) => `| ${scene.id} | ${scene.type} | ${scene.headline} | ${scene.mainIdea} |`).join('\n')}\n\n## Produktionslogik\n\n- 10 Szenen, davon 6 Bildszenen und 4 Remotion-Animationen = exakt 60/40.\n- Ziel vor echtem Audio: ca. 50,5 Sekunden. Reale Szenegrenzen werden in Phase 2/3 an das finale Voiceover angepasst.\n- Szene 01 ist gleichzeitig das Cover. Kein Bild 00.\n- Bildwelt bleibt V9 stylized 3D auf tiefschwarz.\n- Animationen nutzen reale Objekte und sichtbare Ursache/Wirkung.\n- Finale Captions folgen echten Wort-Zeitstempeln; keine geratenen Timings.`);

write('05-projektdateien/animationen.md', `# Animationen\n\nAlle vier Animationsszenen sind bereits als kanonische Phase-1-animation.tsx angelegt. Phase 3 darf sie integrieren und an echte Szenendauern anbinden, aber nicht durch neue generische Mechaniken ersetzen.\n\n## scene-03 — giro-salary-in-daily-payments-out\nGehalt hinein → Miete/Einkauf erscheinen → Geld hinaus → bezahlt.\n\n## scene-06 — daily-spending-moves-giro-reserve-stays\nAlltagsausgabe belastet Girokonto → Tagesgeld bleibt stabil → ALLTAG/RÜCKLAGE.\n\n## scene-09 — salary-arrives-fixed-share-moves-to-savings\nGehalt ins Girokonto → fester Teil trennt sich → Tagesgeld füllt sich.\n\n## scene-10 — today-bill-uses-giro-future-money-stays\nHEUTE-Ausgabe wird aus Giro bezahlt → SPÄTER-Rücklage bleibt unangetastet.\n\nPflicht für alle: START → MECHANISMUS → RESULT, mindestens 15 Frames Result-Hold, mehrere Motion-Channels, PremiumPhysicalStage, pure-black Canvas zentral, keine Karten-/Balken-/Dashboard-Ersatzanimation.`);

write('05-projektdateien/sound-design.md', `# Sound Design — Girokonto oder Tagesgeld?\n\nVoiceover bleibt immer dominant. SFX werden erst in Phase 3 erzeugt/eingebaut und müssen exakt an die tatsächlichen finalen Frames angepasst werden. Keine Placeholder-Beeps und keine Casino-/Jackpot-Geldsounds.\n\n## scene-03\n- Gehalt landet: kurzer weicher money-land / paper-cash impact.\n- Miete und Einkauf erscheinen: zwei dezente paper impacts, leicht unterschiedlich.\n- Geld verlässt Girokonto: sehr leiser controlled money movement.\n- BEZAHLT-Moment: zwei kurze confirmation clicks.\n\n## scene-06\n- Alltagsrechnung erscheint: soft paper drop.\n- Geld verlässt Girokonto: subtle money movement.\n- Tagesgeld bleibt stabil: kein Dauer-Sound; am Result nur ein sehr dezenter positive settle click.\n\n## scene-09\n- Monatsblatt: kurzer page flip.\n- Gehalt landet: soft money impact.\n- Fester Teil trennt sich: kleiner mechanical split/click.\n- Transfer ins Tagesgeld: clean short whoosh + soft money land.\n- AUTO GETRENNT: leiser confirmation click.\n\n## scene-10\n- HEUTE/SPÄTER erscheinen: zwei sehr subtile page flips.\n- Einkauf erscheint: paper impact.\n- Zahlung: money movement + soft confirmation.\n- Schluss: kurzer clean settle sound, keine Fanfare.\n\n## Mix\n- SFX deutlich unter dem Voiceover.\n- Keine Musik/SFX, die Verständlichkeit verdecken.\n- Finale Lautheit des gesamten Reels weiterhin ungefähr -16 LUFS, True Peak höchstens -1 dBTP.`);

write('05-projektdateien/visual-qa.md', `# Playwright Visual QA — Girokonto oder Tagesgeld?\n\n## Pflichtchecks\n\n### Alle Bildszenen\nJe einen stabilen Frame prüfen: scene-01, scene-02, scene-04, scene-05, scene-07, scene-08.\n\nPrüfen: Header-Icon-Größe, Header-Abstand, Visual Y320–1400, Caption-Zone frei, Hauptidee in 1–2 Sekunden lesbar, keine ungewollte UI-/Dashboard-Optik, keine übermäßige schwarze Leere.\n\n### Alle Animationen\nFür scene-03, scene-06, scene-09 und scene-10 jeweils START / TRIGGER / MID / NEAR RESULT / FINAL HOLD prüfen.\n\nZusätzlich:\n- sichtbare physische Ursache/Wirkung,\n- Start und Ergebnis klar verschieden,\n- Geldbewegungen groß genug,\n- Tagesgeld in scene-06 und scene-10 sichtbar stabil,\n- keine Objekte schneiden Header oder Caption,\n- Result-Hold mindestens 15 Frames,\n- keine generische Kartenreihe/Progress-Bar als Erklärung.\n\nSichtbarer Fehler = FAIL, auch wenn TypeScript, Bundle oder Smoke-Render technisch grün sind.`);

write('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `# Antigravity-Auftrag — Girokonto oder Tagesgeld?\n\n## Verantwortung\n\nPhase 1 ist fertig vorbereitet: Skript, 6 Flow-Bildprompts, 4 kanonische Remotion-Animationen, Recherche, Universal-Caption, Sound- und Visual-QA-Pläne.\n\nDer Nutzer liefert in Phase 2:\n1. exakt die 6 Google-Flow-Bilder in 03-szenen/00-ALLE-BILDER-HIER-REIN/,\n2. genau eine finale Voiceover-Datei in 02-audio/.\n\nAntigravity darf diese beiden Aufgaben NICHT übernehmen.\n\n## Danach\n\n1. echte Wort-Zeitstempel aus dem finalen Voiceover erzeugen/übernehmen;\n2. Szenegrenzen auf echte Sprache legen;\n3. vorhandene animation.tsx exakt integrieren, nicht durch andere Ideen ersetzen;\n4. Lottie nur als Mikro-Ergänzung, falls sie den bestehenden Mechanismus verbessert;\n5. SFX anhand sound-design.md framegenau erzeugen/einbauen;\n6. Playwright Visual QA nach visual-qa.md durchführen;\n7. Phase-3-Preflight, Render-QA und Hash-Gate vollständig bestehen;\n8. automatisch nach 06-export/ exportieren.\n\n## Unveränderliche Regeln\n\n- V9 stylized 3D animated black world.\n- Pure-black Reel-Canvas #000000.\n- Header V5 und feste Safe-Zones.\n- Szene 01 = Cover, kein Bild 00.\n- Eine Universal-Caption für alle Reel-Plattformen.\n- Keine separaten Plattform-Captions.\n- Voiceover bleibt dominant.\n- Keine neue generische Karten-/Balken-/Dashboard-Animation.\n- Nach Animation-Seal keine kreative Ersetzung der Phase-1-Animationen.`);

write('05-projektdateien/timeline.json', JSON.stringify({
  version: 2,
  title,
  fps: 30,
  timingSource: '04-caption/word-timings.json',
  cutRule: 'voice-sentence-or-meaningful-phrase-start',
  sceneCount: sceneData.length,
  planningOnlyUntilFinalAudio: true,
  scenes: sceneData.map((scene) => ({id:scene.id,startFrame:scene.startFrame,durationFrames:scene.durationFrames,targetSeconds:scene.durationFrames/30,audioTrigger:scene.audio})),
}, null, 2));

write('05-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [x] Phase 1: Recherche, einfaches Anfänger-Skript, 10 Szenen, 6 V9-Bildprompts, 4 produktionsreife animation.tsx, Universal-Caption, SFX-Plan und Visual-QA-Plan fertig.\n- [ ] Phase 2: Nutzer erzeugt 6 Bilder in Google Flow und legt genau ein finales Voiceover in 02-audio/ ab. Danach echte Wort-Zeitstempel erzeugen.\n- [ ] Phase 3: Antigravity integriert Assets, SFX und echte Timings; Playwright Visual QA + Render-QA + Hash-Gate + Export bestehen.`);

const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.version = Math.max(Number(index.version) || 0, 31);
index.title = title;
index.sceneCount = sceneData.length;
index.imageSceneCount = imageScenes.length;
index.animationSceneCount = sceneData.length - imageScenes.length;
index.targetImageShare = 0.6;
index.targetAnimationShare = 0.4;
index.actualImageShare = 0.6;
index.actualAnimationShare = 0.4;
index.cover = {
  type:'scene-image', sourceSceneId:'scene-01', googleFlowFileName:sceneData[0].file,
  planFile:'03-szenen/00-cover/cover.txt', aspectRatio:'1:1', sameAssetAsFirstScene:true, separateGenerationForbidden:true,
};
index.beginnerLanguageStandard = {
  audience:'complete-finance-beginners',
  oneIdeaPerSentence:true,
  everydayLanguageRequired:true,
  jargonOnlyIfNecessary:true,
  replayShouldNotBeRequiredForUnderstanding:true,
};
index.scenes = sceneData.map((scene, position) => {
  const existing = index.scenes[position] ?? {};
  const common = {
    ...existing,
    id: scene.id,
    type: scene.type,
    startFrame: scene.startFrame,
    durationFrames: scene.durationFrames,
    headline: scene.headline,
    icon: scene.icon,
    headerTone: scene.headerTone,
    audioTrigger: scene.audio,
    targetSeconds: scene.targetSeconds,
    mainIdea: scene.mainIdea,
    cutReason:'voice-sentence-or-meaningful-phrase-start',
  };
  if (scene.type === 'image') {
    return {
      ...common,
      planFile:`03-szenen/EINZELNE-SZENEN/${scene.id}/bildprompt.txt`,
      expectedVisual:scene.expected,
      googleFlowFileName:scene.file,
      imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true},
    };
  }
  return {
    ...common,
    planFile:`03-szenen/EINZELNE-SZENEN/${scene.id}/remotion.md`,
    animationSourceFile:`EINZELNE-SZENEN/${scene.id}/animation.tsx`,
    animationExport:`Scene${scene.id.slice(-2)}Animation`,
    animationIntent:scene.intent,
    animationQualityLock:'finanzneo-phase1-animation-code-v1',
    animationPremiumVisualLock:'finanzneo-premium-physical-animation-v2',
  };
});
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(`✓ Phase-1-Reel fertig aufgebaut: ${target}`);
console.log('  10 Szenen · 6 Bilder · 4 Animationen · 60/40');
console.log('  Nächster manueller Schritt: 6 Flow-Bilder + 1 finales Voiceover.');
