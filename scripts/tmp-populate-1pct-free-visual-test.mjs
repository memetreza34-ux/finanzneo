#!/usr/bin/env node
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test');
const write = (rel, content) => {
  const path = resolve(root, rel);
  mkdirSync(resolve(path, '..'), {recursive: true});
  writeFileSync(path, content.endsWith('\n') ? content : content + '\n', 'utf8');
};

const script = `Ein Prozent Kosten klingt nach fast nichts. Bei deinem Investment kann genau dieses eine Prozent über Jahrzehnte aber Zehntausende Euro Unterschied machen. Nehmen wir ein einfaches Beispiel: Du startest mit 10.000 Euro und investierst 300 Euro im Monat. Variante A bringt im Schnitt 7 Prozent pro Jahr, Variante B nach Kosten vereinfachend nur 6 Prozent. Am Anfang sieht der Unterschied klein aus. Nach fünf Jahren liegen die Ergebnisse noch relativ nah beieinander. Aber mit jedem weiteren Jahr arbeitet der Zinseszinseffekt gegen die teurere Variante. Nach 30 Jahren wären aus denselben Einzahlungen ungefähr 447.000 Euro bei 7 Prozent geworden. Bei 6 Prozent sind es nur rund 362.000 Euro. Das sind etwa 85.600 Euro Unterschied – obwohl nur ein Prozentpunkt fehlt. Deshalb lohnt es sich, bei Fonds, Depot und Beratung auf laufende Kosten zu schauen. Nicht jede Gebühr ist schlecht. Aber kleine Prozentzahlen können über lange Zeit sehr groß werden. Vereinfachtes Rechenbeispiel, ohne Steuern.`;
write('01-script/script-fliess-text.txt', script);

const POLICY = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
VISUAL_FORM_REVISION: finanzneo-free-visual-form-v1
FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.

FINANZNEO WORLD:
- Deep Black als ruhige Bühne.
- Premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache.
- Emerald = positiv/Wachstum, Gold = Geld/Wert, Warm Red-Orange = Kosten/Warnung, Ivory/Soft Gray = neutral.
- Starke Tiefe, saubere Materialien, hochwertige Lichtsetzung, klare mobile Lesbarkeit.
- Kein Fotorealismus, kein Corporate-Stock-Look, kein PowerPoint-/Excel-Default.

FREE VISUAL FORM:
- Pro Sprechbeat frei die stärkste Form wählen: character-story, object-story, comparison, chart, diagram, editorial-quote, illustration, metaphor oder hybrid.
- Kein Zwang zu Menschen, Alltagsobjekten oder Metaphern.
- Aufeinanderfolgende Szenen nicht unnötig mit derselben Kompositionsidee bauen.
- CHART/DIAGRAM muss ein echtes Diagramm bleiben: korrekte Achsen/Skalen/Labels/Proportionen, soweit fachlich erforderlich; 3D-Inszenierung darf die Datenlogik nie verfälschen.
- POWERPOINT-/EXCEL-DEFAULT ist verboten: keine langweiligen Standardbalken, dünnen Defaultachsen oder flachen Corporate-Templates.
- TRANSFERABILITY_TEST: Bild muss spezifisch für den Sprechbeat sein.
`;
write('03-szenen/bildwelt.txt', `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3\nFINANZNEO_SERIES_LOCK: finanzneo-same-world-v1\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\nGENERATED_IMAGE_ASPECT_RATIO: 1:1\n\n${POLICY}`);

const scenes = [
  {
    id:'scene-01', type:'image', headline:'Was kostet 1 %?', icon:'percent', file:'Bild 01 - Ein Prozent wirkt klein.png',
    voice:'Ein Prozent Kosten klingt nach fast nichts.',
    form:'metaphor', labels:['1 %'],
    concept:'Ein winziger roter 1-%-Gebührenzettel liegt groß im Vordergrund; dahinter ziehen sich viele identische kleine Gebührenzettel in die schwarze Tiefe und sammeln sich zu einem deutlich größeren Papierberg.',
    match:'Der einzelne kleine 1-%-Zettel wirkt harmlos, die Masse derselben Zettel im Hintergrund zeigt sofort die langfristige Wirkung.',
    instant:'PASS - kleiner Einzelzettel vorne und großer angesammelter Gebührenberg hinten lesen sich sofort als klein einmal, groß über Zeit.',
    transfer:'PASS - die wiederholten 1-%-Gebührenzettel sind spezifisch für laufende Investmentkosten über viele Jahre.', data:'not-applicable',
    prompt:`Create a premium stylized 3D animated-film finance cover on a seamless deep-black stage. In the lower foreground place one very small, perfectly readable warm red-orange paper fee slip marked only “1 %”. Behind it, let dozens of identical small 1-% fee slips recede through strong cinematic depth and accumulate into a much larger pile in the distance. The first slip must feel almost harmless; the accumulated pile must feel surprisingly substantial. Use elegant paper materials, subtle edge wear, soft contact shadows, restrained emerald accents and warm ivory neutrals. Reserve calm deep-black negative space in the upper area for the Remotion title. Strong 3/4 perspective, premium studio lighting, high-end animated-film rendering. No person, no dashboard, no chart, no fantasy machine, no abstract capital block, no headline inside the generated image, no clutter, no photorealism.`
  },
  {
    id:'scene-02', type:'image', headline:'Klein wirkt harmlos', icon:'receipt', file:'Bild 02 - Klein wirkt harmlos.png',
    voice:'Bei deinem Investment kann genau dieses eine Prozent über Jahrzehnte aber Zehntausende Euro Unterschied machen.',
    form:'editorial-quote', labels:['1 %','über Jahrzehnte'],
    concept:'Große hochwertige 3D-Typografie „1 %“ steht als Hauptmotiv auf schwarzer Bühne; direkt dahinter läuft eine lange Reihe kleiner Jahresmarken in die Tiefe, sodass die kleine Zahl visuell mit langer Zeit verbunden wird.',
    match:'Die riesige lesbare 1-%-Typografie stellt die kleine Prozentzahl in den Mittelpunkt; die lange räumliche Jahresfolge zeigt, warum Zeit sie relevant macht.',
    instant:'PASS - 1 % plus klarer langer Zeithorizont vermittelt sofort kleine Zahl mit langfristiger Wirkung.',
    transfer:'PASS - die Kombination aus 1 % und langem Investitionszeithorizont gehört konkret zur Gebührenaussage.', data:'not-applicable',
    prompt:`Create a premium editorial 3D finance illustration on a seamless deep-black stage. The hero is elegant physical 3D typography reading exactly “1 %”, rendered in warm ivory with refined beveled depth and subtle material highlights. Behind it, a long sequence of small physical year markers recedes into the black distance, ending with one small label “über Jahrzehnte”. The typography must feel integrated into the same high-end stylized 3D animated-film world, not like a flat social-media template. Add restrained gold value accents and a subtle warm red-orange cost accent. Strong depth, asymmetric composition, cinematic light and contact shadows. No dashboard, no stock icons, no PowerPoint style, no corporate template, no photorealism, no extra text.`
  },
  {
    id:'scene-03', type:'animation', headline:'Unser Beispiel', icon:'wallet',
    voice:'Nehmen wir ein einfaches Beispiel: Du startest mit 10.000 Euro und investierst 300 Euro im Monat.'
  },
  {
    id:'scene-04', type:'image', headline:'7 % gegen 6 %', icon:'trending-up', file:'Bild 04 - Sieben gegen sechs Prozent.png',
    voice:'Variante A bringt im Schnitt 7 Prozent pro Jahr, Variante B nach Kosten vereinfachend nur 6 Prozent.',
    form:'chart', labels:['Jahre','Vermögen','7 %','6 %','30'],
    concept:'Ein echtes hochwertig inszeniertes Liniendiagramm mit X-Achse Jahre 0–30 und Y-Achse Vermögen; zwei korrekt startende Linien 7 % und 6 % trennen sich mit zunehmender Laufzeit sichtbar.',
    match:'Die zwei beschrifteten Renditelinien zeigen exakt den einen Prozentpunkt Unterschied und seine Entwicklung über Zeit.',
    instant:'PASS - Achsen, 7-%- und 6-%-Linie machen den Vergleich ohne Zusatzinterpretation sofort klar.',
    transfer:'PASS - zwei konkrete Renditepfade 7 % versus 6 % über 30 Jahre passen spezifisch zum Rechenbeispiel.',
    data:'PASS - X-Achse zeigt 0 bis 30 Jahre, Y-Achse Vermögen; beide Reihen basieren auf 10.000 € Start plus 300 € monatlich bei 7 % bzw. 6 % nominaler Jahresrendite mit monatlicher Verzinsung.',
    prompt:`Create a real, mathematically coherent premium 3D line chart in the FinanzNeo visual world on a seamless deep-black stage. Use a clearly readable horizontal x-axis labeled “Jahre” with 0, 5, 10, 15, 20, 25, 30 and a vertical y-axis labeled “Vermögen”. Show two clean lines starting from the same 10.000 € starting value: an emerald line labeled “7 %” and a warm-ivory line labeled “6 %”. Both include the same 300 € monthly contribution assumption and separate gradually, with a visibly wider gap toward year 30. Render axes as refined physical 3D elements with subtle depth, lines as elegant dimensional ribbons, and milestone points as small gold markers. Maintain correct chart geometry and readable labels. Cinematic 3/4 camera but not so oblique that data becomes distorted. No Excel/PowerPoint look, no dashboard UI, no decorative icons, no fantasy bars, no photorealism.`
  },
  {
    id:'scene-05', type:'image', headline:'Am Anfang fast gleich', icon:'equal', file:'Bild 05 - Gleicher Start.png',
    voice:'Am Anfang sieht der Unterschied klein aus.',
    form:'comparison', labels:['7 %','6 %'],
    concept:'Zwei identische transparente Investmentbehälter stehen nebeneinander, beide fast gleich hoch gefüllt; links 7 %, rechts 6 %, gleiche Basis und nur ein sehr kleiner sichtbarer Unterschied.',
    match:'Die nahezu gleich hohen Füllstände zeigen direkt, dass der Effekt am Anfang kaum auffällt.',
    instant:'PASS - zwei gleiche Behälter mit fast identischem Füllstand lesen sich sofort als kleiner Anfangsunterschied.',
    transfer:'PASS - die Labels 7 % und 6 % verbinden den kleinen sichtbaren Abstand eindeutig mit dem Renditevergleich.', data:'not-applicable',
    prompt:`Create a premium stylized 3D comparison scene on a seamless deep-black stage. Show two identical transparent investment jars or account vessels side by side on the same baseline, both containing recognizable gold coins and value slips. Label the left vessel “7 %” and the right vessel “6 %”. Their fill levels should be almost equal, with only a subtle advantage on the 7-% side. Keep the vessels large, refined and highly readable, with elegant glass-like stylized materials, warm gold value, emerald accent on the 7-% side, neutral ivory on the 6-% side. Cinematic 3/4 perspective, premium lighting and contact shadows. No dashboard, no flat bar chart, no random icons, no person, no photorealism.`
  },
  {
    id:'scene-06', type:'image', headline:'Nach fünf Jahren', icon:'calendar', file:'Bild 06 - Nach fünf Jahren.png',
    voice:'Nach fünf Jahren liegen die Ergebnisse noch relativ nah beieinander.',
    form:'comparison', labels:['5 Jahre','35.654 €','34.420 €'],
    concept:'Ein großer physischer Kalenderblock „5 Jahre“ steht hinter zwei sauberen Geldstapeln; links 35.654 €, rechts 34.420 €, beide sichtbar ähnlich groß und nur leicht unterschiedlich.',
    match:'Die exakten Fünfjahreswerte liegen optisch eng beieinander und illustrieren den noch kleinen Abstand.',
    instant:'PASS - Kalender plus zwei fast gleich große beschriftete Geldstapel zeigen sofort fünf Jahre und geringen Unterschied.',
    transfer:'PASS - die konkreten Werte 35.654 € und 34.420 € machen die Szene spezifisch für dieses Rechenbeispiel.', data:'not-applicable',
    prompt:`Create a premium stylized 3D comparison on a seamless deep-black stage. Place a substantial physical calendar block labeled “5 Jahre” in the rear center. In front, show two refined stacks of euro-value slips or coins on one baseline: left labeled “35.654 €”, right labeled “34.420 €”. The left stack should be only slightly taller, accurately reflecting the small difference after five years. Keep both hero stacks large and close enough for immediate comparison. Use emerald accent on the left, warm ivory/soft gray on the right, gold only for actual money/value. High-end animated-film materials, cinematic depth, soft studio lighting. No chart axes, no dashboard, no tiny diorama, no photorealism, no extra text.`
  },
  {
    id:'scene-07', type:'animation', headline:'Der Abstand wächst', icon:'split',
    voice:'Aber mit jedem weiteren Jahr arbeitet der Zinseszinseffekt gegen die teurere Variante.'
  },
  {
    id:'scene-08', type:'image', headline:'Nach 30 Jahren', icon:'bar-chart-3', file:'Bild 08 - Endvermoegen nach dreissig Jahren.png',
    voice:'Nach 30 Jahren wären aus denselben Einzahlungen ungefähr 447.000 Euro bei 7 Prozent geworden.',
    form:'chart', labels:['Endvermögen','7 %','6 %','447.156 €','361.580 €'],
    concept:'Ein echtes vertikales Balkendiagramm auf gemeinsamer Basis zeigt 447.156 € bei 7 % und 361.580 € bei 6 %; korrekte relative Balkenhöhen, echte Y-Achse Endvermögen.',
    match:'Der hohe 7-%-Balken mit 447.156 € zeigt direkt den Endwert nach 30 Jahren und stellt ihn korrekt dem 6-%-Wert gegenüber.',
    instant:'PASS - zwei echte beschriftete Balken mit Endwerten machen den 30-Jahre-Unterschied sofort sichtbar.',
    transfer:'PASS - die konkreten Endwerte und 7-/6-%-Kategorien gehören exakt zum Gebührenbeispiel.',
    data:'PASS - beide Balken teilen dieselbe Nullbasis und Y-Skala; 447.156 € zu 361.580 € wird proportional korrekt dargestellt, basierend auf 10.000 € Start plus 300 € monatlich über 30 Jahre.',
    prompt:`Create a real premium 3D vertical bar chart on a seamless deep-black stage. Use a clear y-axis labeled “Endvermögen” and a shared zero baseline. Two bars only: an emerald 7-% bar reaching exactly “447.156 €” and a warm-ivory 6-% bar reaching exactly “361.580 €”. Their relative heights must be mathematically proportional on the same scale. Make the bars refined physical 3D columns with subtle material depth and warm-gold money accents, not plain PowerPoint rectangles. Keep category labels “7 %” and “6 %” clear at the base and values large above each bar. Premium cinematic lighting, controlled 3/4 perspective that preserves data readability. No Excel/PowerPoint default style, no dashboard, no random icons, no person, no photorealism.`
  },
  {
    id:'scene-09', type:'image', headline:'Nur 6 % Rendite', icon:'arrow-down-right', file:'Bild 09 - Sechs Prozent Endwert.png',
    voice:'Bei 6 Prozent sind es nur rund 362.000 Euro.',
    form:'illustration', labels:['6 %','≈ 362.000 €'],
    concept:'Ein einzelner großer stilisierter Investmentordner mit 6-%-Label steht neben einem klaren Endwert ≈ 362.000 € aus goldenen Wertscheinen; bewusst kein Diagramm, sondern ruhiger visueller Fokus auf den niedrigeren Endwert.',
    match:'6-%-Label und klarer Endwert ≈ 362.000 € setzen genau die zweite Zahl des Rechenbeispiels ins Zentrum.',
    instant:'PASS - 6 % plus großer Endwert sind in einem Blick lesbar.',
    transfer:'PASS - der konkrete 6-%-Endwert 362.000 € ist spezifisch für diese Beispielrechnung.', data:'not-applicable',
    prompt:`Create a premium stylized 3D finance illustration on a seamless deep-black stage. Hero object: one elegant physical investment folder or account book with a clear “6 %” tab. Beside and partly emerging from it, arrange a substantial but clean stack of gold value slips, with one integrated physical label reading exactly “≈ 362.000 €”. Keep the composition asymmetric and cinematic, with the account book large in the foreground and value stack creating depth. Warm ivory and soft gray for the folder, restrained red-orange detail to signal the cost drag, gold only for value. No chart, no dashboard, no corporate stock composition, no person, no photorealism, no extra labels.`
  },
  {
    id:'scene-10', type:'image', headline:'85.600 € Unterschied', icon:'coins', file:'Bild 10 - Fuenfundachtzigtausend Unterschied.png',
    voice:'Das sind etwa 85.600 Euro Unterschied – obwohl nur ein Prozentpunkt fehlt.',
    form:'editorial-quote', labels:['85.600 €','nur 1 Prozentpunkt'],
    concept:'Große physische 3D-Typografie „85.600 €“ steht im Zentrum; darunter klein „nur 1 Prozentpunkt“, flankiert von zwei subtilen Endwert-Markern 447k und 362k, ohne Dashboard-Look.',
    match:'Die große Differenzzahl und der kleine Hinweis auf nur einen Prozentpunkt stellen den überraschenden Gegensatz direkt gegenüber.',
    instant:'PASS - 85.600 € groß und „nur 1 Prozentpunkt“ klein vermitteln die Kernbotschaft sofort.',
    transfer:'PASS - 85.600 € Differenz bei einem Prozentpunkt ist die spezifische Pointe dieses Rechenbeispiels.', data:'not-applicable',
    prompt:`Create a premium editorial 3D finance composition on a seamless deep-black stage. Main hero: large physical beveled 3D typography reading exactly “85.600 €” in warm gold, occupying most of the composition. Directly below, much smaller refined ivory text reads “nur 1 Prozentpunkt”. Add two subtle physical endpoint markers at the sides, “447k” in emerald and “362k” in warm ivory, connected only by spatial alignment—not a dashboard. Use cinematic depth, premium materials, soft rim lighting and clean contact shadows. It should feel like a high-end animated-film editorial frame, not a social template. No PowerPoint, no card UI, no person, no extra sentence, no photorealism.`
  },
  {
    id:'scene-11', type:'animation', headline:'Kosten wirklich prüfen', icon:'search',
    voice:'Deshalb lohnt es sich, bei Fonds, Depot und Beratung auf laufende Kosten zu schauen.'
  },
  {
    id:'scene-12', type:'image', headline:'Kleine Zahl, große Wirkung', icon:'check-circle-2', file:'Bild 12 - Kosten im Blick behalten.png',
    voice:'Nicht jede Gebühr ist schlecht. Aber kleine Prozentzahlen können über lange Zeit sehr groß werden. Vereinfachtes Rechenbeispiel, ohne Steuern.',
    form:'hybrid', labels:['Kosten prüfen','langfristig denken'],
    concept:'Ein hochwertiger Investmentordner liegt offen; links ein kleiner sauberer Kostenbeleg, rechts ein deutlich größerer goldener langfristiger Vermögensstapel; zwei kurze integrierte Labels „Kosten prüfen“ und „langfristig denken“ verbinden Handlung und Konsequenz.',
    match:'Kostenbeleg und langfristiger Vermögensstapel zeigen gemeinsam, dass Gebühren bewertet werden sollen, ohne jede Gebühr pauschal schlecht darzustellen.',
    instant:'PASS - Kostenbeleg plus großer langfristiger Vermögenswert und zwei kurze Handlungslabels ergeben eine klare Abschlussbotschaft.',
    transfer:'PASS - die Kombination aus laufenden Kosten und langfristigem Investmentbezug schließt genau dieses Gebührenvideo ab.', data:'not-applicable',
    prompt:`Create a premium hybrid stylized 3D finance closing scene on a seamless deep-black stage. Show one open high-quality investment folder as the central anchor. On the left page sits a small clear fee statement with the short physical label “Kosten prüfen”. On the right, a larger refined stack of warm-gold value slips rises upward with the short physical label “langfristig denken”. The composition should communicate balanced evaluation: fees are something to examine because long-term value matters, not that every fee is automatically bad. Use elegant ivory paper, emerald positive accents, restrained red-orange only on the cost line, cinematic 3/4 depth and premium animated-film lighting. No dashboard, no chart, no stock character, no clutter, no photorealism, no extra text.`
  }
];

const promptPolicyTail = `\nIMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3\nVISUAL_FORM_REVISION: finanzneo-free-visual-form-v1\nFREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.\nCHART/DIAGRAM: echte Datenvisualisierung mit fachlich korrekten Achsen/Skalen/Labels/Proportionen, soweit der Typ sie braucht.\nPOWERPOINT-/EXCEL-DEFAULT: verboten.\nTRANSFERABILITY_TEST muss spezifisch zum Sprechbeat sein.\n`;

const makePrompt = (s) => `FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
AKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN

GOOGLE FLOW – FINALER DATEINAME:
${s.file}

Erzeuge ausschließlich dieses eine Bild. Warte vollständig auf das Ergebnis, benenne es sofort exakt wie oben um und prüfe Aussage, erlaubte Labels, V9-Stil, tiefschwarze Bühne und Dateiname. Bei Fehler ausschließlich dieselbe Bildnummer neu erzeugen. Erst nach PASS zum nächsten Bild.

BESCHRIFTUNGEN – EXAKT SO:
${s.labels.map((x)=>'- '+x).join('\n')}

VISUAL_FORM: ${s.form}
VISUAL_CONCEPT: ${s.concept}
VOICEOVER_VISUAL_MATCH: ${s.match}
INSTANT_READ_TEST: ${s.instant}
TRANSFERABILITY_TEST: ${s.transfer}
DATA_INTEGRITY_TEST: ${s.data}

IMAGE PROMPT:
${s.prompt}

FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1

STYLE LOCK:
Premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache auf nahtloser deep-black Bühne. Starke Tiefe, saubere Materialien, weiche Kontaktschatten, hochwertige Lichtsetzung. Emerald für positiv/Wachstum, Gold für Geld/Wert, Warm Red-Orange für Kosten/Warnung, Ivory/Soft Gray neutral. Kein Fotorealismus, kein Corporate-Stock-Look, kein PowerPoint-/Excel-Default.
${promptPolicyTail}`;

const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.title = 'Was 1 % Kosten wirklich ausmacht';
index.cover.googleFlowFileName = scenes[0].file;

let cursor = 0;
const durations = [3.6,5.4,5.2,5.6,3.3,4.5,5.6,5.2,3.8,5.1,5.8,6.0];
for (const s of scenes) {
  const scene = index.scenes.find((x)=>x.id===s.id);
  if (!scene) throw new Error('Scene missing: '+s.id);
  scene.headline = s.headline;
  scene.icon = s.icon;
  scene.expectedVisual = s.type === 'image' ? s.concept : 'Produktionsreife Custom-Animation passend zum Sprechbeat: '+s.voice;
  scene.plannedDurationSeconds = durations[Number(s.id.slice(-2))-1];
  scene.visualBeats = [{
    id: s.id+'-beat-01', kind:s.type, voiceText:s.voice,
    visualChange: s.type === 'image' ? s.concept : 'Startzustand verändert sich durch eine sichtbare Mechanik bis zum eindeutigen Payoff.',
    startSecond: Number(cursor.toFixed(1)), endSecond:Number((cursor+scene.plannedDurationSeconds).toFixed(1))
  }];
  cursor += scene.plannedDurationSeconds;
  if (s.type === 'image') {
    scene.googleFlowFileName = s.file;
    scene.objectLabels = s.labels;
    scene.imageStorytelling = {
      visualForm:s.form, visualConcept:s.concept, voiceVisualMatch:s.match,
      instantReadTest:s.instant, transferabilityTest:s.transfer, dataIntegrityTest:s.data
    };
  } else {
    scene.animationIntent = 'Zeige exakt: '+s.voice+' Die Mechanik muss ohne Caption verständlich sein und in der gleichen FinanzNeo-V9-Welt bleiben.';
  }
}
writeFileSync(indexPath, JSON.stringify(index,null,2)+'\n','utf8');

const imagePrompts = [];
for (const s of scenes.filter((x)=>x.type==='image')) {
  const n = s.id.slice(-2);
  const text = makePrompt(s);
  write(`03-szenen/EINZELNE-SZENEN/${s.id}/bildprompt.txt`, text);
  write(`03-szenen/EINZELNE-SZENEN/${s.id}/szene.md`, `# ${s.id}\n\n**Typ:** image\n**Zwischenüberschrift:** ${s.headline}\n**Icon:** ${s.icon}\n**Sprechtext:** ${s.voice}\n**Visual Form:** ${s.form}\n**Visual:** ${s.concept}\n**Flow-Datei:** ${s.file}\n`);
  imagePrompts.push(`==================== ${s.id} ====================\n\n${text}`);
}
write('03-szenen/alle-bildprompts.txt', `FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3\nFLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1\nMAX_CONCURRENT_GENERATIONS: 1\n\nImmer nur den nächsten Bildblock erzeugen, vollständig warten, exakt umbenennen, QA, dann weiter. Animationsnummern 03, 07 und 11 bleiben reserviert.\n\n${imagePrompts.join('\n\n')}\n`);
write('03-szenen/00-cover/cover.txt', makePrompt(scenes[0]));

const scenePlan = scenes.map((s,i)=>`${String(i+1).padStart(2,'0')}. ${s.type.toUpperCase()} — ${s.headline}\n   Sprechbeat: ${s.voice}\n   Visual: ${s.type==='image' ? s.concept : 'Custom-Animation mit klarer Start→Mechanik→Payoff-Logik.'}`).join('\n\n');
write('05-projektdateien/szenenplan.md', `# Szenenplan — Was 1 % Kosten wirklich ausmacht\n\nZiel: ca. 60 Sekunden, 12 Visual Beats, 9 Bilder + 3 Animationen. Form frei, Bildwelt fest.\n\n${scenePlan}\n\n${POLICY}`);
write('05-projektdateien/recherche-quellen.md', `# Recherche und Rechenbasis\n\n## Vereinfachtes Rechenbeispiel\n- Startkapital: 10.000 €\n- Monatliche Einzahlung: 300 €\n- Laufzeit: 30 Jahre / 360 Monate\n- Vergleich: 7 % p.a. vs. 6 % p.a.\n- Rechenweise: monatliche Verzinsung mit Jahreszins/12, Einzahlung jeweils monatlich; keine Steuern, Inflation oder schwankenden Renditen modelliert.\n\nErgebnisse der deterministischen Modellrechnung:\n- nach 5 Jahren: ca. 35.654 € vs. 34.420 €\n- nach 30 Jahren: ca. 447.156 € vs. 361.580 €\n- Differenz nach 30 Jahren: ca. 85.576 €, im Voiceover gerundet auf 85.600 €\n\nDiese Zahlen sind ein vereinfachtes Illustrationsbeispiel und keine Renditeprognose.\n`);
write('04-caption/caption.txt', `1 Prozent klingt klein. Über Jahrzehnte kann genau dieser Unterschied aber Zehntausende Euro ausmachen. Das Beispiel ist bewusst vereinfacht und keine Renditeprognose. Kosten bei Fonds, Depot und Beratung deshalb immer im Verhältnis zur Leistung und zur langfristigen Wirkung prüfen.\n\n#Finanzen #Investieren #ETF #Gebühren #Zinseszins`);
write('05-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [x] Phase 1: Skript, Szenenplan, 9 individuelle Flow-Prompts, Header/Icons und 3 produktionsreife animation.tsx erstellt\n- [ ] Phase 2: 9 exakt benannte Flow-Bilder + finales Voiceover + echte Wort-Zeitstempel\n- [ ] Phase 3: Assets integrieren, Animation-Seal, Preflight, Candidate-Render, Render-QA, Export\n`);
write('README.md', `# Was 1 % Kosten wirklich ausmacht\n\nTestreel für FinanzNeo Free Visual Form V1.\n\n- 12 Szenen\n- 9 Flow-Bilder\n- 3 Custom-Remotion-Animationen\n- Bildformen bewusst gemischt: Metapher, Editorial, echte Charts, Vergleich, Illustration, Hybrid\n- Bildwelt: finanzneo-stylized-3d-animated-black-v9\n- Phase 2 benötigt noch finale Bilder, Voiceover und Wort-Timings\n`);

const remotionContract = `\n## FINANCE MOTION LIBRARY + CUSTOM ANIMATIONSVERTRAG\nPremium Visual Lock: finanzneo-premium-physical-animation-v2\nFinance Motion Library: finanzneo-finance-motion-library-v1\nVisual Target World: finanzneo-stylized-3d-animated-black-v9\n\nCustom-Build gewählt, weil die konkrete Story-Mechanik wichtiger ist als direkte Library-Wiederverwendung. animation.tsx liefert nur transparenten Visual-Inhalt; Canvas, Header und Caption gehören dem globalen Reel-Layout. Ergebnis mindestens 15 Frames stabil.\n`;

const anim3 = String.raw`import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: startkapital-plus-monatliche-sparrate
 * FOCAL_PATH: 10.000-Euro-Startstapel -> monatliche 300-Euro-Umschläge -> wachsendes Investmentkonto
 * PRIMARY_ACTION: Vier Monatsumschläge gleiten nacheinander in dasselbe Investmentkonto und erhöhen sichtbar den Wertstapel.
 * CAMERA_ROLE: still — ruhige 3/4-Bühne, damit Einzahlungen und wachsender Stapel sofort lesbar bleiben.
 * PAYOFF: Das Konto steht stabil mit Startkapital plus wiederkehrender Sparrate; 300 €/Monat ist als Mechanik verstanden.
 *
 * ANIMATION_NARRATIVE
 * START: Ein physischer Investmentordner zeigt 10.000 € Startkapital und einen goldenen Anfangsstapel.
 * MECHANISM: Mehrere echte Monatsumschläge mit 300 € kommen nacheinander hinein; mit jedem Umschlag wächst der Goldstapel.
 * RESULT: Der Ordner enthält sichtbar Startkapital plus wiederkehrende Einzahlungen und bleibt im Endzustand stabil.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Großer stilisierter Investmentordner mit sichtbarem Goldwertstapel.
 * SUPPORT: Vier Monatsumschläge und ein kleiner Kalenderstreifen erklären die Wiederholung.
 * MATERIAL: Warmes Ivory-Papier, Emerald-Akzent, Gold nur für Wert, Red-Orange nicht benötigt.
 * DEPTH: Umschläge starten vorne links, wandern in die mittlere Kontobühne und stapeln Wert nach hinten oben.
 */
export const RESULT_HOLD_FRAMES = 18;

const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames=156}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config:{damping:16, stiffness:120}});
  const deposits = [28,50,72,94];
  const completed = deposits.reduce((sum,start)=>sum + (frame >= start + 14 ? 1 : 0),0);
  const stackHeight = 170 + completed * 42;

  return <div style={{width:'100%',height:'100%',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'relative',width:860,height:760,transform:'perspective(1100px) rotateX(3deg) rotateY(-4deg) scale('+ (0.9+intro*0.1) +')',transformOrigin:'center'}}>
      <div style={{position:'absolute',left:260,top:155,width:420,height:470,borderRadius:38,background:'linear-gradient(145deg,#F6F1E7,#D8D1C5)',boxShadow:'0 28px 60px rgba(0,0,0,.38), inset 0 2px 0 rgba(255,255,255,.75)',border:'1px solid rgba(255,255,255,.28)'}}>
        <div style={{position:'absolute',left:34,top:30,fontSize:28,fontWeight:800,color:'#18231D'}}>INVESTMENT</div>
        <div style={{position:'absolute',right:34,top:32,fontSize:24,fontWeight:800,color:ANIMATION_COLORS.focus}}>10.000 €</div>
        <div style={{position:'absolute',left:72,bottom:58,width:276,height:Math.min(300,stackHeight),borderRadius:22,background:'linear-gradient(180deg,#FFD86A,#C8951D)',boxShadow:'0 18px 34px rgba(255,200,61,.16)',transition:'none'}} />
        {Array.from({length:completed+4}).map((_,i)=><div key={i} style={{position:'absolute',left:88,bottom:66+i*28,width:244,height:13,borderRadius:8,background:i%2===0?'#FFE49A':'#FFC83D',boxShadow:'0 4px 8px rgba(0,0,0,.18)'}} />)}
        <div style={{position:'absolute',left:92,bottom:22,fontSize:23,fontWeight:800,color:'#273129'}}>Start + Sparrate</div>
      </div>

      {deposits.map((start,i)=>{
        const p = interpolate(frame,[start,start+16],[0,1],clamp);
        const x = interpolate(p,[0,1],[-30,315]);
        const y = 238 + i*70 - p*i*18;
        const opacity = interpolate(frame,[start-4,start,start+15,start+22],[0,1,1,0],clamp);
        return <div key={start} style={{position:'absolute',left:x,top:y,width:210,height:92,borderRadius:18,background:'linear-gradient(145deg,#FFF9EE,#E6DDCF)',border:'2px solid rgba(0,210,106,.45)',boxShadow:'0 14px 28px rgba(0,0,0,.35)',opacity,transform:'rotate(-4deg) scale('+(0.96+p*0.04)+')',display:'flex',alignItems:'center',justifyContent:'center',color:'#15221A',fontSize:26,fontWeight:900}}>
          300 € <span style={{fontSize:17,marginLeft:8,color:'#5A6B61'}}>Monat {i+1}</span>
        </div>;
      })}

      <div style={{position:'absolute',left:315,top:646,width:310,height:62,borderRadius:20,border:'1px solid rgba(255,255,255,.16)',background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,opacity:interpolate(frame,[100,118],[0,1],clamp)}}>
        300 € / Monat
      </div>
    </div>
  </div>;
};
`;

const anim7 = String.raw`import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: zwei-depots-zinseszins-abstand
 * FOCAL_PATH: zwei gleich startende Depots -> identische Einzahlungen -> zunehmend unterschiedliche Goldstapel
 * PRIMARY_ACTION: Beide Depots erhalten dieselben Einzahlungen, aber der 7-%-Stapel wächst pro Zeitstufe sichtbar stärker als der 6-%-Stapel.
 * CAMERA_ROLE: push — sehr leichter visueller Push auf den wachsenden Abstand, ohne die Bühnenposition zu verändern.
 * PAYOFF: Zwei klar beschriftete Depots enden mit deutlich sichtbarem Abstand trotz gleicher Einzahlungen.
 *
 * ANIMATION_NARRATIVE
 * START: Zwei identische Depots stehen mit gleichem Startwert nebeneinander.
 * MECHANISM: Gleiche Goldmünzen fallen in beide Depots; zusätzliche Wachstumsstufen entstehen links schneller und der Abstand öffnet sich.
 * RESULT: Das 7-%-Depot endet sichtbar höher als das 6-%-Depot, während die identische Einzahlung erkennbar bleibt.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei große transparente Depotbehälter mit echten Goldmünzstapeln.
 * SUPPORT: Monatsmünzen und ein kleiner 30-Jahre-Zeitmarker erklären gleiche Einzahlung und Zeit.
 * MATERIAL: Glasartig stilisierte Behälter, Emerald links, Ivory rechts, Gold nur für Geld/Wert.
 * DEPTH: Beide Behälter liegen auf einer gemeinsamen Basis; ein räumlicher Gap-Marker entsteht zwischen ihren Endhöhen.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene07Animation: React.FC<{durationFrames?: number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:17, stiffness:110}});
  const t = interpolate(frame,[22,132],[0,1],clamp);
  const leftH = 150 + t*300;
  const rightH = 150 + t*232;
  const gap = Math.max(0,leftH-rightH);
  const coinFrames = [30,52,74,96,118];

  const Jar = ({left,label,height,accent}:{left:number;label:string;height:number;accent:string}) => <div style={{position:'absolute',left,top:150,width:300,height:500,borderRadius:42,border:'3px solid rgba(255,255,255,.26)',background:'linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.035))',boxShadow:'inset 0 0 55px rgba(255,255,255,.04), 0 26px 48px rgba(0,0,0,.34)',overflow:'hidden',transform:'scale('+ (0.92+enter*0.08) +')'}}>
    <div style={{position:'absolute',top:24,left:0,right:0,textAlign:'center',fontSize:34,fontWeight:900,color:accent}}>{label}</div>
    <div style={{position:'absolute',left:42,bottom:42,width:216,height,borderRadius:28,background:'linear-gradient(180deg,#FFE49A,#D4A11C)',boxShadow:'0 -8px 28px rgba(255,200,61,.22)'}} />
    {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:58,bottom:52+i*Math.max(16,height/14),width:184,height:12,borderRadius:7,background:i%2===0?'#FFC83D':'#FFE49A',opacity:i*18 < height ? 1 : 0}} />)}
  </div>;

  return <div style={{width:'100%',height:'100%',position:'relative',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'absolute',left:70,top:50,width:940,height:780,transform:'perspective(1200px) rotateX(2deg) scale('+(1+interpolate(t,[0,1],[0,.025]))+')'}}>
      <Jar left={90} label='7 %' height={leftH} accent={ANIMATION_COLORS.focus} />
      <Jar left={550} label='6 %' height={rightH} accent='#F4FAF6' />

      {coinFrames.map((start,i)=>{
        const p=interpolate(frame,[start,start+16],[0,1],clamp);
        const opacity=interpolate(frame,[start-3,start,start+13,start+20],[0,1,1,0],clamp);
        return <React.Fragment key={start}>
          {[250,710].map((x,j)=><div key={x} style={{position:'absolute',left:x-24,top:80+p*150,width:50,height:50,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#FFE49A,#C78C13)',boxShadow:'0 8px 16px rgba(0,0,0,.28)',opacity,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#6A4A00'}}>€</div>)}
        </React.Fragment>;
      })}

      <div style={{position:'absolute',left:438,top:266,right:438,height:Math.max(8,gap),borderLeft:'3px solid '+ANIMATION_COLORS.warning,opacity:interpolate(frame,[85,118],[0,1],clamp)}} />
      <div style={{position:'absolute',left:390,top:245-gap/2,width:130,textAlign:'center',fontSize:20,fontWeight:900,color:ANIMATION_COLORS.warning,opacity:interpolate(frame,[96,126],[0,1],clamp)}}>Abstand wächst</div>
      <div style={{position:'absolute',left:374,top:688,width:210,height:58,borderRadius:18,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800}}>gleiche Einzahlung</div>
    </div>
  </div>;
};
`;

const anim11 = String.raw`import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: kostenpositionen-auf-dokumenten-pruefen
 * FOCAL_PATH: Fondsblatt -> Depotblatt -> Beratungsblatt -> markierte Kostenzeilen -> grüner Prüfstatus
 * PRIMARY_ACTION: Eine große Lupenlinse fährt nacheinander über drei reale Dokumente und hebt TER, Depotkosten und Servicekosten hervor.
 * CAMERA_ROLE: follow — die Aufmerksamkeit folgt der Lupe von links nach rechts über die drei Dokumente.
 * PAYOFF: Alle relevanten Kostenzeilen sind sichtbar markiert und ein klarer grüner Haken bestätigt den Prüfschritt.
 *
 * ANIMATION_NARRATIVE
 * START: Drei hochwertige Dokumente für Fonds, Depot und Beratung liegen noch unmarkiert nebeneinander.
 * MECHANISM: Eine physische Lupe wandert über jedes Dokument; die jeweilige laufende Kostenzeile leuchtet kurz warm rot-orange auf.
 * RESULT: TER, Depotkosten und Servicekosten sind sichtbar identifiziert; anschließend erscheint ein grüner Prüfhaken.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Große stilisierte Lupe über echten Papierdokumenten statt Dashboard-Karten.
 * SUPPORT: Drei Kostenzeilen und ein finaler Haken, sonst keine zusätzlichen UI-Elemente.
 * MATERIAL: Ivory-Papier, Emerald-Prüfstatus, Warm Red-Orange für Kosten, Glaslinse mit subtiler Reflexion.
 * DEPTH: Dokumente liegen leicht gestaffelt in 3/4-Perspektive; die Lupe schwebt darüber und erzeugt klare Vordergrundtiefe.
 */
export const RESULT_HOLD_FRAMES = 18;
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene11Animation: React.FC<{durationFrames?: number}> = ({durationFrames=174}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:17, stiffness:105}});
  const positions = [180,430,680];
  const scan = interpolate(frame,[24,132],[0,2],clamp);
  const lensX = scan < 1 ? interpolate(scan,[0,1],[positions[0],positions[1]],clamp) : interpolate(scan,[1,2],[positions[1],positions[2]],clamp);
  const labels = ['TER','Depotkosten','Service'];

  return <div style={{width:'100%',height:'100%',position:'relative',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'absolute',left:55,top:130,width:970,height:650,transform:'perspective(1200px) rotateX(3deg) scale('+(0.94+enter*0.06)+')'}}>
      {positions.map((x,i)=>{
        const active = interpolate(frame,[30+i*38,40+i*38,58+i*38],[0,1,1],clamp);
        return <div key={x} style={{position:'absolute',left:x-120,top:150+i*18,width:250,height:360,borderRadius:24,background:'linear-gradient(145deg,#FFF9EE,#DDD5C9)',boxShadow:'0 24px 42px rgba(0,0,0,.38)',transform:'rotate('+(i-1)*2+'deg)'}}>
          <div style={{position:'absolute',left:22,top:24,fontSize:27,fontWeight:900,color:'#19221D'}}>{['Fonds','Depot','Beratung'][i]}</div>
          {[0,1,2,3].map((r)=><div key={r} style={{position:'absolute',left:22,top:82+r*48,width:206,height:14,borderRadius:7,background:r===2?'rgba(255,51,51,'+(0.18+active*0.52)+')':'rgba(30,45,36,.13)'}} />)}
          <div style={{position:'absolute',left:24,top:172,fontSize:20,fontWeight:900,color:active>0.45?ANIMATION_COLORS.warning:'#5A6B61'}}>{labels[i]}</div>
        </div>;
      })}

      <div style={{position:'absolute',left:lensX-82,top:252,width:164,height:164,borderRadius:'50%',border:'12px solid #F4FAF6',background:'rgba(255,255,255,.05)',boxShadow:'0 18px 30px rgba(0,0,0,.35), inset 0 0 24px rgba(255,255,255,.08)'}}>
        <div style={{position:'absolute',right:-64,bottom:-48,width:92,height:18,borderRadius:12,background:'#F4FAF6',transform:'rotate(44deg)',transformOrigin:'left center'}} />
      </div>

      <div style={{position:'absolute',left:422,top:560,width:130,height:130,borderRadius:'50%',background:ANIMATION_COLORS.focus,display:'flex',alignItems:'center',justifyContent:'center',fontSize:78,fontWeight:900,color:'#06210F',opacity:interpolate(frame,[138,154],[0,1],clamp),transform:'scale('+interpolate(frame,[138,152],[.7,1],clamp)+')'}}>✓</div>
    </div>
  </div>;
};
`;

const animations = [
  {id:'scene-03', code:anim3, exportName:'Scene03Animation', start:'10.000 € Startkapital im Investmentordner.', mechanism:'Mehrere 300-€-Monatsumschläge wandern nacheinander hinein und erhöhen den sichtbaren Goldwertstapel.', result:'Startkapital plus wiederkehrende 300-€-Sparrate ist als ein gemeinsames Investment sichtbar.', headline:'Unser Beispiel', icon:'wallet'},
  {id:'scene-07', code:anim7, exportName:'Scene07Animation', start:'Zwei identische Depots starten auf gleicher Höhe.', mechanism:'Beide bekommen dieselben Einzahlungen; der 7-%-Wertstapel wächst mit jeder Zeitstufe stärker als der 6-%-Stapel.', result:'Der Abstand zwischen beiden Depots ist am Ende deutlich sichtbar.', headline:'Der Abstand wächst', icon:'split'},
  {id:'scene-11', code:anim11, exportName:'Scene11Animation', start:'Fonds-, Depot- und Beratungsdokument liegen unmarkiert vor.', mechanism:'Eine große Lupe fährt über die Dokumente und hebt TER, Depotkosten und Servicekosten nacheinander hervor.', result:'Alle Kostenpositionen sind identifiziert und ein grüner Prüfhaken erscheint.', headline:'Kosten wirklich prüfen', icon:'search'}
];

for (const a of animations) {
  const s = scenes.find((x)=>x.id===a.id);
  write(`03-szenen/EINZELNE-SZENEN/${a.id}/animation.tsx`, a.code);
  write(`03-szenen/EINZELNE-SZENEN/${a.id}/remotion.md`, `# Remotion-Spezifikation ${a.id}\n\n**Zwischenüberschrift:** ${a.headline}\n**Icon:** ${a.icon}\n**Kanonische Codequelle:** animation.tsx\n**Quality Lock:** finanzneo-phase1-animation-code-v1\n**Visuelle Zielwelt:** finanzneo-stylized-3d-animated-black-v9\n**Stage:** transparent über zentralem #000000 Reel-Canvas; Visualzone Y320–1400.\n\n## STARTZUSTAND\n${a.start}\n\n## SICHTBARER MECHANISMUS\n${a.mechanism}\n\n## ERGEBNIS\n${a.result}\n\n## RESULT HOLD\nMindestens 15 Frames stabil.\n${remotionContract}`);
  write(`03-szenen/EINZELNE-SZENEN/${a.id}/szene.md`, `# ${a.id}\n\n**Typ:** animation\n**Zwischenüberschrift:** ${a.headline}\n**Icon:** ${a.icon}\n**Sprechtext:** ${s.voice}\n**Animation:** ${a.start} ${a.mechanism} ${a.result}\n`);
}

write('05-projektdateien/animationen.md', `# Animationen\n\n## scene-03 — Unser Beispiel\n10.000 € Startkapital + wiederkehrende 300-€-Monatsumschläge. Custom-Build.\n\n## scene-07 — Der Abstand wächst\nZwei gleiche Depots erhalten identische Einzahlungen; 7 % wächst sichtbar schneller als 6 %. Custom-Build.\n\n## scene-11 — Kosten wirklich prüfen\nLupe scannt Fonds-, Depot- und Beratungsdokument und markiert TER, Depotkosten, Service. Custom-Build.\n\nAlle drei animation.tsx liefern nur transparenten Visual-Inhalt und nutzen den globalen Reel-Canvas/Header/Caption.\n`);

console.log('✓ Testreel Phase 1 vollständig befüllt: 9 Bilder + 3 Animationen.');
