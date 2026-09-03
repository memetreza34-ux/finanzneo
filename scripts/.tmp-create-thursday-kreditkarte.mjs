#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('target fehlt');
  process.exit(1);
}

const root = resolve(target);
const write = (rel, content) => writeFileSync(resolve(root, rel), content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const TITLE = 'Warum die kleine Kreditkartenrate teuer werden kann';
const SCRIPT = 'Eine kleine Kreditkartenrate klingt bequem – kann aber teuer werden. Der entscheidende Punkt ist die Teilzahlung. Bei Vollzahlung wird der offene Kartenbetrag zum Abrechnungstermin vollständig ausgeglichen. Bei Teilzahlung zahlst du nur einen Teil zurück. Auf den restlichen offenen Betrag können je nach Vertrag Zinsen anfallen. Beispiel: Du kaufst für 600 Euro ein und zahlst nur 100 Euro zurück. 500 Euro bleiben offen. Auf diesen Rest können weitere Zinsen kommen. Kaufst du im nächsten Monat weiter mit der Karte ein, kann der offene Saldo zusätzlich wachsen. Prüfe deshalb in deiner Abrechnung oder in den Karteneinstellungen, ob Vollzahlung oder Teilzahlung eingestellt ist. Wenn du Teilzahlung nutzt, schau auf den angegebenen Zinssatz und wie hoch deine monatliche Rate wirklich ist. Eine Kreditkarte ist praktisch – teuer kann sie werden, wenn aus einem Einkauf mehrere Monate offene Schulden werden.';

const scenes = [
  {id:'scene-01',type:'image',headline:'Warum kann die kleine Rate teuer werden?',icon:'warning',headerTone:'warning',voice:'Eine kleine Kreditkartenrate klingt bequem – kann aber teuer werden.',seconds:3.4,file:'Bild 01 - Kleine Rate grosse Kosten.png',labels:['Kleine Rate','Offener Rest'],expected:'A relatable credit-card situation where a very small monthly payment leaves a visibly large unpaid statement behind; the contrast must be obvious without UI.',visual:'Eine kleine Zahlung liegt vorne, während dahinter eine deutlich größere offene Kreditkartenabrechnung bestehen bleibt.'},
  {id:'scene-02',type:'image',headline:'Der Knackpunkt heißt Teilzahlung',icon:'repeat',headerTone:'warning',voice:'Der entscheidende Punkt ist die Teilzahlung.',seconds:2.2,file:'Bild 02 - Teilzahlung markiert.png',labels:['Teilzahlung'],expected:'A real paper credit-card statement on a desk where the repayment method “Teilzahlung” is clearly selected or stamped, next to the physical card.',visual:'Auf einer echten Papierabrechnung ist „Teilzahlung“ klar markiert; die Kreditkarte liegt daneben.'},
  {id:'scene-03',type:'animation',headline:'Vollzahlung gleicht alles aus',icon:'check',headerTone:'positive',voice:'Bei Vollzahlung wird der offene Kartenbetrag zum Abrechnungstermin vollständig ausgeglichen.',seconds:4.0,visual:'Eine offene Kartenabrechnung wird am Abrechnungstermin durch eine vollständige Zahlung aus dem Girokonto sichtbar auf „BEZAHLT“ gesetzt.',mechanic:'full-payment-clears-statement'},
  {id:'scene-04',type:'image',headline:'Teilzahlung lässt einen Rest offen',icon:'receipt',headerTone:'warning',voice:'Bei Teilzahlung zahlst du nur einen Teil zurück.',seconds:2.8,file:'Bild 04 - Nur Teil zurueckgezahlt.png',labels:['Teilzahlung','Rest offen'],expected:'A physical credit-card statement showing a large open amount while only a visibly smaller payment has been placed against it; the remainder stays marked as open.',visual:'Nur ein kleiner Teil der Abrechnung ist bezahlt; ein deutlich größerer Rest bleibt sichtbar offen.'},
  {id:'scene-05',type:'animation',headline:'Auf dem Rest können Zinsen laufen',icon:'percent',headerTone:'warning',voice:'Auf den restlichen offenen Betrag können je nach Vertrag Zinsen anfallen.',seconds:4.0,visual:'Eine offene Restabrechnung bleibt liegen, ein Kalender rückt weiter und daneben wächst sichtbar ein kleiner zusätzlicher Kostenstapel.',mechanic:'interest-accrues-on-open-balance'},
  {id:'scene-06',type:'image',headline:'600 Euro gekauft, 100 zurückgezahlt',icon:'euro',headerTone:'neutral',voice:'Beispiel: Du kaufst für 600 Euro ein und zahlst nur 100 Euro zurück.',seconds:4.1,file:'Bild 06 - 600 Einkauf 100 Rueckzahlung.png',labels:['Einkauf 600 €','Rückzahlung 100 €'],expected:'A grounded purchase scene with a physical card, shopping bag and paper statement for 600 euros, while only a separate 100-euro repayment is visibly applied.',visual:'Ein realer Einkauf über 600 Euro steht einer klar kleineren Rückzahlung von 100 Euro gegenüber.'},
  {id:'scene-07',type:'animation',headline:'500 Euro bleiben offen',icon:'coins',headerTone:'warning',voice:'500 Euro bleiben offen. Auf diesen Rest können weitere Zinsen kommen.',seconds:4.0,visual:'Von einer 600-Euro-Abrechnung werden sichtbar 100 Euro abgetragen; die Abrechnung bleibt mit 500 Euro offen und wird als Restschuld stabil gehalten.',mechanic:'partial-payment-leaves-principal'},
  {id:'scene-08',type:'image',headline:'Neue Käufe kommen oben drauf',icon:'wallet',headerTone:'warning',voice:'Kaufst du im nächsten Monat weiter mit der Karte ein,',seconds:3.3,file:'Bild 08 - Neuer Einkauf trifft alten Rest.png',labels:['Alter Rest','Neuer Einkauf'],expected:'A new everyday card purchase at a checkout is shown while an older unpaid credit-card statement is still physically present beside it.',visual:'Ein neuer Einkauf wird mit derselben Karte bezahlt, obwohl daneben noch eine alte offene Abrechnung liegt.'},
  {id:'scene-09',type:'animation',headline:'Der offene Saldo kann wachsen',icon:'chart-up',headerTone:'warning',voice:'kann der offene Saldo zusätzlich wachsen.',seconds:2.8,visual:'Eine alte Restabrechnung und eine neue Kaufabrechnung bewegen sich physisch in denselben Kartensaldo, der danach sichtbar höher steht.',mechanic:'new-purchase-adds-to-card-balance'},
  {id:'scene-10',type:'image',headline:'Prüf deine Rückzahlungsart',icon:'search',headerTone:'neutral',voice:'Prüfe deshalb in deiner Abrechnung oder in den Karteneinstellungen, ob Vollzahlung oder Teilzahlung eingestellt ist.',seconds:4.2,file:'Bild 10 - Rueckzahlungsart pruefen.png',labels:['Vollzahlung','Teilzahlung'],expected:'A person checks a real paper credit-card statement and a simple physical repayment selector, clearly comparing “Vollzahlung” and “Teilzahlung” without app-dashboard aesthetics.',visual:'Eine Person prüft die Rückzahlungsart; Vollzahlung und Teilzahlung sind als zwei klar erkennbare Optionen gegenübergestellt.'},
  {id:'scene-11',type:'image',headline:'Schau auf den Zinssatz',icon:'document',headerTone:'warning',voice:'Wenn du Teilzahlung nutzt, schau auf den angegebenen Zinssatz',seconds:3.3,file:'Bild 11 - Zinssatz in Unterlagen.png',labels:['Zinssatz'],expected:'A real credit agreement or card statement is being inspected with a magnifier, with the short German label “Zinssatz” clearly highlighted on the paper.',visual:'Ein Vertrag beziehungsweise eine Kartenabrechnung wird mit einer Lupe geprüft; der angegebene Zinssatz ist eindeutig markiert.'},
  {id:'scene-12',type:'image',headline:'Und auf deine echte Monatsrate',icon:'calendar',headerTone:'neutral',voice:'und wie hoch deine monatliche Rate wirklich ist.',seconds:2.7,file:'Bild 12 - Monatsrate sichtbar.png',labels:['Monatsrate'],expected:'A monthly calendar beside a physical repayment envelope and card statement makes the actual recurring monthly payment the focal point.',visual:'Kalender, Abrechnung und Rückzahlungsumschlag zeigen gemeinsam: Entscheidend ist die echte Monatsrate.'},
  {id:'scene-13',type:'image',headline:'Kreditkarten können praktisch sein',icon:'target',headerTone:'positive',voice:'Eine Kreditkarte ist praktisch –',seconds:1.8,file:'Bild 13 - Kreditkarte praktisch.png',labels:['Praktisch'],expected:'A grounded everyday payment moment where a person uses a credit card cleanly and successfully at a normal checkout; positive but restrained.',visual:'Eine alltägliche Kartenzahlung funktioniert bequem und unkompliziert; die Karte ist hier klar nur das praktische Werkzeug.'},
  {id:'scene-14',type:'animation',headline:'Teuer wird es über mehrere Monate',icon:'clock',headerTone:'warning',voice:'teuer kann sie werden, wenn aus einem Einkauf mehrere Monate offene Schulden werden.',seconds:4.2,visual:'Eine einzelne offene Kaufabrechnung bleibt bestehen, während mehrere Monatskalender nacheinander erscheinen und die offene Belastung sichtbar in die Länge gezogen wird.',mechanic:'single-purchase-spans-multiple-months'},
];

const STYLE = `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 1:1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2`;
const SAFETY = `STYLE + SAFETY:
Use premium stylized 3D animated geometry, believable everyday proportions, simplified but tangible materials and a seamless deep black background. Keep the result clearly non-photorealistic. Use emerald green for positive states, warm ivory/gray for neutral physical objects, subtle gold for money/value and warm red-orange only for cost or warning. Use soft contact shadows and clean subject-separation lighting. No photorealism, product-photo look, dashboard, app dashboard, website screenshot, flowchart, floating UI tiles, microchip/circuit language, miniature diorama, generic finance-icon main composition or decorative clutter. The real-life action or consequence must carry the explanation.`;
const imagePrompt = (scene,isCover=false) => `FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
GOOGLE FLOW – FINALER DATEINAME:
${scene.file}

BESCHRIFTUNGEN – EXAKT SO:
${scene.labels.map((l)=>`- ${l}`).join('\n')}

IMAGE PROMPT:
Create one polished stylized 3D animated finance-explainer image for this exact spoken beat. ${scene.expected} The visible story must specifically communicate this action or consequence: ${scene.visual} Ground the composition in a believable everyday situation with recognizable real-world objects, clear physical relationships and one strong focal point. Make the cause-and-effect readable immediately without narration. Supporting objects are allowed only when they genuinely improve understanding. Keep the requested German object labels short, legible and naturally attached to their objects. Do not add any other explanatory text. Avoid a static catalog arrangement: show a moment, action, contrast or consequence that feels physically real inside the stylized world.

${STYLE}${isCover?`\nFUTURE_COVER_HOOK: finanzneo-cover-hook-v2\nThe Flow image itself contains KEINEN Reel-Titel, no headline, no subtitle and no CTA.\nReserve calm deep-black negative space in the upper area for the exact Remotion reel title. The title is rendered later from frame 0.`:''}

${SAFETY}`;
const sceneMd = (scene) => `# ${scene.id}\n\n**Typ:** ${scene.type}\n**Zwischenüberschrift:** ${scene.headline}\n**Icon:** ${scene.icon}\n**Sprechtext:** ${scene.voice}\n\n${scene.type==='image'?`**Google-Flow-Dateiname:** ${scene.file}\n**Erlaubte kurze Objektlabels:** ${scene.labels.join(' · ')}\n**Hauptaussage:** ${scene.visual}`:`**Google Flow:** KEIN Bild ${scene.id.slice(-2)}; Nummer bleibt reserviert.\n**Animation:** Phase 1 liefert remotion.md + fertige animation.tsx.\n**Hauptaussage:** ${scene.visual}`}`;
const remotionMd = (scene) => `# Remotion-Spezifikation ${scene.id}\n\n**Zwischenüberschrift:** ${scene.headline}\n**Icon:** ${scene.icon}\n**Kanonische Codequelle:** animation.tsx\n**Quality Lock:** finanzneo-phase1-animation-code-v1\n**Premium Visual Lock:** finanzneo-premium-physical-animation-v2\n**Visuelle Zielwelt:** finanzneo-stylized-3d-animated-black-v9\n**Stage:** transparent über zentralem #000000 Reel-Canvas; sichtbare Ausgabe hart Y320–1400.\n\n## STARTZUSTAND\n${scene.id==='scene-03'?'Offene Kreditkartenabrechnung, Girokonto und Abrechnungstermin sind sichtbar; die Abrechnung ist noch nicht bezahlt.':scene.id==='scene-05'?'Eine offene Restabrechnung liegt sichtbar vor einem neuen Monatskalender; noch sind keine zusätzlichen Kosten dargestellt.':scene.id==='scene-07'?'Eine Kartenabrechnung zeigt 600 Euro offen; daneben liegt eine kleinere Rückzahlung von 100 Euro bereit.':scene.id==='scene-09'?'Ein alter offener Rest und ein neuer Einkauf liegen als zwei getrennte reale Abrechnungen vor demselben Kartensaldo.':'Eine einzelne offene Kaufabrechnung liegt sichtbar vor dem ersten Monatskalender.'}\n\n## SICHTBARER MECHANISMUS\n${scene.id==='scene-03'?'Der vollständige Geldbetrag bewegt sich vom Girokonto zur Kreditkartenabrechnung. Der offene Betrag verschwindet und die Rechnung wechselt sichtbar auf bezahlt.':scene.id==='scene-05'?'Der Kalender rückt in den nächsten Monat. Während die Restabrechnung offen bleibt, baut sich daneben ein zusätzlicher kleiner Kostenstapel auf.':scene.id==='scene-07'?'Die 100-Euro-Rückzahlung bewegt sich zur 600-Euro-Abrechnung. Danach wird der sichtbare Restbetrag auf 500 Euro reduziert und stabil gehalten.':scene.id==='scene-09'?'Alte Restabrechnung und neue Kaufabrechnung bewegen sich nacheinander in denselben Kartensaldo. Der sichtbare Saldo steigt als direkte Summe beider Belastungen.':'Nacheinander erscheinen weitere Monatskalender hinter derselben offenen Abrechnung. Die Abrechnung bleibt bestehen und wird sichtbar über mehrere Monate mitgeschleppt.'}\n\n## ERGEBNIS\n${scene.id==='scene-03'?'Die Abrechnung ist vollständig bezahlt; kein offener Rest bleibt sichtbar.':scene.id==='scene-05'?'Die Restabrechnung bleibt offen und ein klarer zusätzlicher Kostenstapel zeigt die mögliche Zinsbelastung.':scene.id==='scene-07'?'500 Euro Rest bleiben offen; die 100-Euro-Zahlung hat nur einen Teil der ursprünglichen 600 Euro entfernt.':scene.id==='scene-09'?'Der gemeinsame Kartensaldo ist sichtbar höher als zuvor und macht das Wachstum des offenen Betrags klar.':'Die gleiche offene Schuld reicht sichtbar über mehrere Monatsseiten; aus einem Einkauf ist eine länger laufende Belastung geworden.'}\n\n## RESULT HOLD\nMindestens 24 Frames stabil.\n\n## VERBOTEN\nKeine Dashboard-/App-UI als Hauptsprache, keine Partikel/Aurora/Grid-Effekte, keine generische Kartenreihe als Ersatz für die reale Handlung, kein Fortschrittsbalken als Geschichte.`;

const anim03 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: full-payment-clears-statement
 * PRIMARY_ACTION: Der vollständige offene Kartenbetrag bewegt sich physisch vom Girokonto zur Kreditkartenabrechnung und setzt sie sichtbar auf bezahlt.
 * ANIMATION_NARRATIVE
 * START: Eine offene 600-Euro-Kartenabrechnung steht neben dem Girokonto; der Abrechnungstermin ist sichtbar.
 * MECHANISM: Ein vollständiger Geldstapel bewegt sich vom Girokonto zur Abrechnung, während der offene Status verschwindet.
 * RESULT: Die Kartenabrechnung ist vollständig bezahlt und ein grüner Vollzahlung-Tag bleibt stabil sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Offene Kartenabrechnung und Girokonto tragen die zentrale Ausgleichsbewegung.
 * SUPPORT: Kalenderseite und Geldstapel verankern Abrechnungstermin und vollständige Zahlung.
 * MATERIAL: Rechnung neutral mit rotem offenen Betrag, Geld gold, Ergebnis grün, Kalender ivory.
 * DEPTH: Kalender hinten links, Girokonto rechts, Rechnung zentral vorne, Geld bewegt sich aus der rechten Tiefe zur Rechnung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const calendarIn = interpolate(frame,[2,20],[0,1],clamp);
  const paymentMove = interpolate(frame,[20,76],[0,1],clamp);
  const billSettle = interpolate(frame,[68,96],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const coinsX = 620-paymentMove*265;
  const coinsY = 760-paymentMove*55;
  const paid = billSettle>0.58;
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={505-(1-calendarIn)*50} month="ABRECHNUNG" scale={0.70} opacity={calendarIn} rotate={-5}/>
    <PhysicalAccount x={590} y={500} label="Girokonto" balance={paid?'abgebucht':'bereit'} state={paid?'normal':'protected'} scale={0.92}/>
    <PhysicalBill x={300} y={510} amount={paid?'0 €':'600 €'} label="Kartenabrechnung" paid={paid} scale={0.96+billSettle*0.03} rotate={-2}/>
    <PhysicalCoinStack x={coinsX} y={coinsY} count={7} scale={0.76-paymentMove*0.12} opacity={1-paymentMove*0.58}/>
    <div style={{position:'absolute',left:405,top:1010,opacity:resultIn,transform:\`translateY(\${(1-resultIn)*18}px)\`,color:ANIMATION_COLORS.focus}}><PhysicalTag material="positive" style={{fontSize:27}}>VOLLZAHLUNG</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;
const anim05 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: interest-accrues-on-open-balance
 * PRIMARY_ACTION: Eine offene Restabrechnung bleibt liegen, während der nächste Monat sichtbar einrückt und daneben ein zusätzlicher Kostenstapel anwächst.
 * ANIMATION_NARRATIVE
 * START: Eine offene 500-Euro-Restabrechnung liegt vor dem aktuellen Monatskalender; zusätzliche Kosten sind noch nicht sichtbar.
 * MECHANISM: Eine neue Kalenderseite rückt ein, die Restabrechnung bleibt unverändert offen und ein weiterer Geldstapel baut sich daneben auf.
 * RESULT: Der offene Rest besteht weiter und ein klarer Kosten-Tag macht mögliche Zinsen auf den Rest sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die unverändert offene Restabrechnung ist das stabile Hauptobjekt.
 * SUPPORT: Zwei Kalenderseiten und der wachsende Münzstapel zeigen Zeitablauf und zusätzliche Kosten.
 * MATERIAL: Rechnung neutral mit Warnbetrag, Kalender ivory/grün, Kostenstapel gold, Warnhinweis rot-orange.
 * DEPTH: Alte Kalenderseite hinten links, neue Seite gleitet dahinter ein, Rechnung vorne zentral, Kosten wachsen rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame,[2,18],[0,1],clamp);
  const monthShift = interpolate(frame,[24,72],[0,1],clamp);
  const costGrow = interpolate(frame,[52,96],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={70} y={520} month="MONAT 1" scale={0.67} opacity={billIn*(1-monthShift*0.30)} rotate={-7}/>
    <PhysicalCalendarPage x={120+monthShift*90} y={555-monthShift*85} month="MONAT 2" scale={0.72} opacity={monthShift} rotate={4}/>
    <PhysicalBill x={350} y={500} amount="500 €" label="Rest offen" rotate={-2} scale={0.96+(1-billIn)*0.02} opacity={billIn}/>
    <PhysicalCoinStack x={700} y={770-costGrow*70} count={Math.max(1,Math.round(1+costGrow*5))} scale={0.58+costGrow*0.18} opacity={costGrow}/>
    <div style={{position:'absolute',left:655,top:1010,opacity:resultIn,transform:\`translateY(\${(1-resultIn)*18}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:26}}>ZINSEN MÖGLICH</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;
const anim07 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: partial-payment-leaves-principal
 * PRIMARY_ACTION: Eine kleine 100-Euro-Rückzahlung wird physisch auf eine 600-Euro-Kartenabrechnung angewendet und lässt sichtbar 500 Euro Rest zurück.
 * ANIMATION_NARRATIVE
 * START: Die Kartenabrechnung zeigt 600 Euro offen; ein kleiner Rückzahlungsstapel liegt getrennt daneben.
 * MECHANISM: Der 100-Euro-Stapel bewegt sich zur Abrechnung, während der sichtbare Kartenrest von 600 auf 500 Euro wechselt.
 * RESULT: 500 Euro bleiben offen und ein stabiler Rest-offen-Tag hält das Ergebnis fest.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die Kartenabrechnung mit ihrem sinkenden, aber nicht verschwindenden Restbetrag trägt die Aussage.
 * SUPPORT: Kleiner Rückzahlungsstapel und Kartensaldo verdeutlichen Teilzahlung und verbleibende Belastung.
 * MATERIAL: Rechnung neutral/warnend, Rückzahlung gold, offener Kartensaldo rot-orange, Ergebnislabel warnend.
 * DEPTH: Rechnung vorne zentral, Rückzahlung links vorne, Kartensaldo rechts hinten; Zahlung bewegt sich sichtbar in die Rechnung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene07Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const setupIn = interpolate(frame,[2,18],[0,1],clamp);
  const paymentMove = interpolate(frame,[22,72],[0,1],clamp);
  const restSettle = interpolate(frame,[66,94],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const paymentX = 90+paymentMove*245;
  const paymentY = 800-paymentMove*80;
  const remaining = restSettle>0.52?'500 €':'600 €';
  return <PremiumPhysicalStage>
    <PhysicalBill x={340} y={500} amount={remaining} label="Kartenabrechnung" rotate={-2} scale={0.97+restSettle*0.02} opacity={setupIn}/>
    <PhysicalCoinStack x={paymentX} y={paymentY} count={3} scale={0.64-paymentMove*0.08} opacity={setupIn*(1-paymentMove*0.45)}/>
    <PhysicalAccount x={650} y={550} label="Kartensaldo" balance={remaining} state="danger" scale={0.88} opacity={setupIn} tilt={3}/>
    <div style={{position:'absolute',left:315,top:1012,opacity:resultIn,transform:\`translateY(\${(1-resultIn)*18}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:27}}>500 € REST OFFEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;
const anim09 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: new-purchase-adds-to-card-balance
 * PRIMARY_ACTION: Eine alte Restabrechnung und eine neue Kaufabrechnung bewegen sich nacheinander in denselben Kartensaldo und erhöhen ihn sichtbar.
 * ANIMATION_NARRATIVE
 * START: 500 Euro alter Rest und 120 Euro neuer Einkauf liegen als zwei getrennte Abrechnungen vor einem Kartensaldo.
 * MECHANISM: Zuerst wird der alte Rest, danach der neue Einkauf in denselben Kartensaldo gezogen; der Betrag springt erst auf 500 und dann auf 620 Euro.
 * RESULT: Der Kartensaldo steht sichtbar höher bei 620 Euro und bleibt als gewachsener offener Betrag stabil.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der zentrale Kartensaldo zeigt die direkte Summe alter und neuer Belastung.
 * SUPPORT: Zwei physische Abrechnungen liefern die konkreten Bestandteile des wachsenden Saldos.
 * MATERIAL: Alte Rechnung neutral/warnend, neuer Einkauf neutral, Kartensaldo rot-orange, Ergebnislabel warnend.
 * DEPTH: Beide Rechnungen starten links und rechts im Vordergrund und bewegen sich auf den zentralen tieferliegenden Kartensaldo zu.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=84}) => {
  const frame = useCurrentFrame();
  const oldMove = interpolate(frame,[8,36],[0,1],clamp);
  const newMove = interpolate(frame,[28,58],[0,1],clamp);
  const accountSettle = interpolate(frame,[52,68],[0,1],clamp);
  const resultIn = interpolate(frame,[62,Math.max(66,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const oldX = 70+oldMove*300;
  const oldY = 590+oldMove*35;
  const newX = 690-newMove*300;
  const newY = 600+newMove*35;
  const balance = newMove>0.62?'620 €':oldMove>0.62?'500 €':'0 €';
  return <PremiumPhysicalStage>
    <PhysicalBill x={oldX} y={oldY} amount="500 €" label="Alter Rest" rotate={-7+oldMove*5} scale={0.72-oldMove*0.10} opacity={1-oldMove*0.45}/>
    <PhysicalBill x={newX} y={newY} amount="120 €" label="Neuer Einkauf" rotate={7-newMove*5} scale={0.72-newMove*0.10} opacity={1-newMove*0.45}/>
    <PhysicalAccount x={385} y={520} label="Kartensaldo" balance={balance} state={balance==='0 €'?'normal':'danger'} scale={0.96+accountSettle*0.03}/>
    <div style={{position:'absolute',left:425,top:950,opacity:resultIn,transform:\`translateY(\${(1-resultIn)*16}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:28}}>SALDO WÄCHST</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;
const anim14 = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalBill, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: single-purchase-spans-multiple-months
 * PRIMARY_ACTION: Dieselbe offene Kaufabrechnung bleibt physisch bestehen, während nacheinander mehrere Monatskalender erscheinen und die Belastung sichtbar in die Länge gezogen wird.
 * ANIMATION_NARRATIVE
 * START: Eine einzelne offene Kaufabrechnung liegt vor dem Kalender des ersten Monats.
 * MECHANISM: Monat zwei und Monat drei erscheinen nacheinander hinter derselben weiterhin offenen Abrechnung; ein kleiner Kostenstapel wächst mit der Zeit.
 * RESULT: Die ursprüngliche Abrechnung ist nach mehreren Monaten noch offen und ein Warnhinweis macht die lange Schuldenstrecke eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Dieselbe unveränderte offene Kaufabrechnung bleibt über die gesamte Szene das Hauptmotiv.
 * SUPPORT: Drei Monatskalender und ein wachsender Münzstapel zeigen Dauer und zusätzliche Belastung.
 * MATERIAL: Rechnung neutral/warnend, Kalender ivory mit grünem Kopf, Kosten gold, Endwarnung rot-orange.
 * DEPTH: Abrechnung vorne zentral; Monatsseiten staffeln sich nach hinten; Kostenstapel wächst rechts vorne und schafft räumliche Trennung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene14Animation: React.FC<{durationFrames?:number}> = ({durationFrames=126}) => {
  const frame = useCurrentFrame();
  const billIn = interpolate(frame,[2,18],[0,1],clamp);
  const month2In = interpolate(frame,[24,54],[0,1],clamp);
  const month3In = interpolate(frame,[50,82],[0,1],clamp);
  const costGrow = interpolate(frame,[58,98],[0,1],clamp);
  const resultIn = interpolate(frame,[94,Math.max(102,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <PremiumPhysicalStage>
    <PhysicalCalendarPage x={60} y={575} month="MONAT 1" scale={0.60} opacity={billIn} rotate={-8}/>
    <PhysicalCalendarPage x={145} y={525} month="MONAT 2" scale={0.64} opacity={month2In} rotate={-2}/>
    <PhysicalCalendarPage x={230} y={475} month="MONAT 3" scale={0.68} opacity={month3In} rotate={4}/>
    <PhysicalBill x={430} y={500} amount="OFFEN" label="Ein Einkauf" rotate={-2} scale={0.98} opacity={billIn}/>
    <PhysicalCoinStack x={720} y={790-costGrow*85} count={Math.max(1,Math.round(1+costGrow*6))} scale={0.56+costGrow*0.20} opacity={costGrow}/>
    <div style={{position:'absolute',left:455,top:1010,opacity:resultIn,transform:\`translateY(\${(1-resultIn)*18}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material="warning" style={{fontSize:26}}>MEHRERE MONATE OFFEN</PhysicalTag></div>
  </PremiumPhysicalStage>;
};`;
const animationSources = {'scene-03':anim03,'scene-05':anim05,'scene-07':anim07,'scene-09':anim09,'scene-14':anim14};

write('README.md', `# ${TITLE}\n\nEinfache Struktur:\n- 01-script = Voiceover-Skript\n- 02-audio = finales Voiceover\n- 03-szenen = Cover, V9-Bildprompts, Szenen und Nutzerbilder\n- 04-caption = universelle Caption und Wort-Timings\n- 05-projektdateien = Recherche, Timeline, Phase-3-Handoff\n- 06-export = fertiges Upload-Paket\n\n3 Phasen:\n1. Phase 1 erstellt Recherche, Skript, V9-Bildprompts und jede Animation als fertige animation.tsx.\n2. Nutzer erstellt Flow-Bilder, finales Audio und echte Wortzeiten.\n3. Der konfigurierte Executor integriert exakt diese Assets/Animationen und rendert nur über Preflight + QA.\n\nReel-Canvas: immer statisch #000000, keine Partikel/Aurora/Grid/Glow-Hintergründe.\nV5: Header Y154 / 56 px / max 2 Zeilen, Visual Y320–1400, Caption bottom340.\n\n## Cover- und Export-Automatik\n- Szene 01 ist immer eine Bildszene und automatisch das Cover; es gibt keinen separaten Cover-Bildjob.\n- Das Flow-Bild selbst enthält keinen Reel-Titel; Remotion rendert den exakten Titel ab Frame 0.\n- Nach bestandener Phase-3-Render-QA wird der Export automatisch gestartet.`);
write('01-script/script-fliess-text.txt', SCRIPT);
write('04-caption/caption.txt', `Eine kleine Kreditkartenrate kann bequem wirken – entscheidend ist aber, ob deine Karte auf Vollzahlung oder Teilzahlung eingestellt ist. Bei Teilzahlung bleibt ein offener Betrag bestehen; je nach Vertrag können darauf Zinsen anfallen. Wer zusätzlich weiter mit der Karte einkauft, kann den offenen Saldo weiter erhöhen. Prüfe deshalb Rückzahlungsart, angegebenen Zinssatz und deine tatsächliche Monatsrate.\n\nQuellen: BaFin und Verbraucherzentrale. Stand September 2026. Keine individuelle Finanzberatung.`);
write('05-projektdateien/recherche-quellen.md', `# RECHERCHE UND QUELLEN\n\n## BaFin — Kontenvergleich: Kreditkarte\nAbruf: 03. September 2026\nhttps://kontenvergleich.bafin.de/de/glossar/kreditkarte\n\nVerwendete Kernaussagen:\n- Kreditkartenumsätze können zu einem vereinbarten Termin vollständig oder teilweise abgebucht werden.\n- Ob für die Kreditinanspruchnahme Zinsen berechnet werden, richtet sich nach der Kreditvereinbarung.\n\n## Verbraucherzentrale — Girokonto: Was Sie darüber wissen sollten\nAbruf: 03. September 2026\nhttps://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/girokonto-was-sie-darueber-wissen-sollten-4990\n\nVerwendete Kernaussagen:\n- Bei herkömmlicher vollständiger Abrechnung wird die komplette Summe fällig.\n- Bei Revolving-/Raten-Kreditkarten wird nur ein Teil des Saldos zurückgezahlt.\n- Für die Teilzahlungsfunktion können hohe Zinsen und Kosten anfallen.\n- Teilzahlung kann das Risiko erhöhen, den Überblick zu verlieren und sich zu überschulden.\n\n## Verbraucherzentrale — Kreditkarte oder Debitkarte? Das sind die Unterschiede\nStand: 04. März 2026\nhttps://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredit-schulden-insolvenz/kreditkarte-oder-debitkarte-das-sind-die-unterschiede-65038\n\nDas Reel nennt bewusst keinen pauschalen Zinssatz, weil Konditionen je nach Kartenvertrag variieren. Keine individuelle Finanzberatung.`);
write('05-projektdateien/szenenplan.md', `# SZENENPLAN\n\nIMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2\n\nCover Hook V2: Szene 01 ist Hero-Bild plus exakter Reel-Titel ab Frame 0; keine Untertitel bis Szene 02.\nNeue konkrete Gedanken bekommen einen eigenen Visual Beat statt eines überladenen Standbilds.\n\n${scenes.map((s)=>`- ${s.id} | ${s.type} | ${s.headline} | ${s.icon} | ${s.seconds.toFixed(1)} s | ${s.voice}`).join('\n')}`);
write('05-projektdateien/visual-beats.md', `# Visual Beats\n\nVISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2\n\nLieber ein zusätzliches gutes Bild planen als mehrere konkrete Gedanken in ein überladenes Stillbild zu pressen.\n\n${scenes.map((s)=>`## ${s.id} — ${s.headline}\n\nSprechtext: ${s.voice}\n\nDauer: ${s.seconds.toFixed(1)} s\n\n- Beat 1: ${s.voice} | Sichtbar: ${s.visual} | 0.0–${s.seconds.toFixed(1)} s`).join('\n\n')}`);
write('05-projektdateien/animationen.md', `# ANIMATIONEN\n\nPhase 1 liefert für jede Animationsszene die kanonische, produktionsreife animation.tsx.\nVisuell verbindlich: V9 stylized 3D animated, transparente PremiumPhysicalStage über pure-black Reel-Canvas, reale Ursache → Wirkung, Result-Hold >= 24 Frames.\n\n${scenes.filter((s)=>s.type==='animation').map((s)=>`- ${s.id}: ${s.mechanic} — ${s.visual}`).join('\n')}`);
for (const scene of scenes) {
  const dir=`03-szenen/EINZELNE-SZENEN/${scene.id}`;
  write(`${dir}/szene.md`,sceneMd(scene));
  if(scene.type==='image') write(`${dir}/bildprompt.txt`,imagePrompt(scene,scene.id==='scene-01'));
  else {write(`${dir}/remotion.md`,remotionMd(scene));write(`${dir}/animation.tsx`,animationSources[scene.id]);}
}
write('03-szenen/00-cover/cover.txt', `COVER = SZENE 01\nKEIN separates Cover erzeugen\nKEIN Bild 00 erzeugen\n\nQuelle für Cover-Bild: ${scenes[0].file}\nReel-Titel in Remotion ab Frame 0: ${TITLE}\n\n${imagePrompt(scenes[0],true)}`);
const aggregate=`FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1\nFLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3\nFLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2\nFLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1\n\nSTRICT SINGLE-JOB STATE MACHINE — VERBINDLICH\nDIES IST KEIN BATCH-AUFTRAG\nMAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG\nALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT, bis das aktuelle Bild vollständig zurückgegeben, exakt umbenannt und per QA geprüft wurde.\nVERBOTEN: mehrere Bilder in einem Generierungsaufruf.\nVERBOTEN: mehrere Bildprompts zusammenfassen.\nVERBOTEN: Bilder vorab in eine Queue stellen.\nVERBOTEN: alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen.\nWARTE NIEMALS AUF \"WEITER\". Nach erfolgreicher QA automatisch mit dem nächsten freigeschalteten Bildblock fortfahren.\nMAX_CONCURRENT_GENERATIONS = 1\nFINAL_IMAGE_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/\nCOVER = SZENE 01\nKEIN separates Cover erzeugen\nKEIN Bild 00 erzeugen\n\n${scenes.map((scene)=>scene.type==='image'?`## ${scene.id}\n\n${imagePrompt(scene,scene.id==='scene-01')}`:`## ${scene.id}\n\nREMOTION-ANIMATION — KEIN BILD ${scene.id.slice(-2)} ERZEUGEN. Nummer ${scene.id.slice(-2)} bleibt reserviert.`).join('\n\n---\n\n')}\n\nABSCHLUSS:\nBeende den Auftrag erst, wenn jedes erwartete Bild einzeln erzeugt, exakt umbenannt und nach V9 geprüft wurde. Danach müssen alle Bilder gemeinsam in 03-szenen/00-ALLE-BILDER-HIER-REIN/ liegen.`;
write('03-szenen/alle-bildprompts.txt',aggregate);
const indexPath=resolve(root,'03-szenen/scene-index.json');
const index=JSON.parse(readFileSync(indexPath,'utf8'));
index.title=TITLE;index.sceneCount=scenes.length;index.imageSceneCount=scenes.filter((s)=>s.type==='image').length;index.animationSceneCount=scenes.filter((s)=>s.type==='animation').length;
index.cover={...index.cover,type:'scene-image',sourceSceneId:'scene-01',googleFlowFileName:scenes[0].file,planFile:'03-szenen/00-cover/cover.txt',aspectRatio:'1:1',sameAssetAsFirstScene:true,separateGenerationForbidden:true,renderedTitleOverlayRequired:true,finalExportSource:'final-video-frame-0'};
let startFrame=0;
index.scenes=index.scenes.map((existing,i)=>{const scene=scenes[i];const durationFrames=Math.round(scene.seconds*30);const common={...existing,id:scene.id,type:scene.type,startFrame,durationFrames,cutReason:'voice-sentence-or-meaningful-phrase-start',headline:scene.headline,icon:scene.icon,accent:'finance-green',headerTone:scene.headerTone,plannedDurationSeconds:scene.seconds,targetSeconds:scene.seconds,audioTrigger:scene.voice,mainIdea:scene.visual,visualBeats:[{id:`${scene.id}-beat-01`,kind:scene.type,voiceText:scene.voice,visualChange:scene.visual,startSecond:0,endSecond:scene.seconds}]};startFrame+=durationFrames;if(scene.type==='image')return{...common,planFile:`EINZELNE-SZENEN/${scene.id}/bildprompt.txt`,googleFlowFileName:scene.file,objectLabels:scene.labels,expectedVisual:scene.expected,imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true},...(scene.id==='scene-01'?{coverHook:true,captionEnabled:false,subtitleMode:'off',titleMode:'reel-title-overlay',titleVisibleFromFrame:0,coverTitle:TITLE}:{})};return{...common,planFile:`EINZELNE-SZENEN/${scene.id}/remotion.md`,animationIntent:scene.visual};});
writeFileSync(indexPath,`${JSON.stringify(index,null,2)}\n`,'utf8');
const timelinePath=resolve(root,'05-projektdateien/timeline.json');const timeline=JSON.parse(readFileSync(timelinePath,'utf8'));timeline.title=TITLE;timeline.sceneCount=scenes.length;timeline.scenes=scenes.map((s)=>({id:s.id,type:s.type,plannedDurationSeconds:s.seconds,headline:s.headline,voiceText:s.voice,timingStatus:'planned-until-real-word-timestamps'}));writeFileSync(timelinePath,`${JSON.stringify(timeline,null,2)}\n`,'utf8');
console.log(`✓ Phase-1-Inhalt für ${TITLE} geschrieben.`);
console.log(`✓ ${scenes.filter((s)=>s.type==='image').length} Bildszenen + ${scenes.filter((s)=>s.type==='animation').length} Animationsszenen.`);
