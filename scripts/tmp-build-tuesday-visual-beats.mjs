#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const TARGET = 'reels/2026-08-31_bis_2026-09-06/dienstag/reel-02_konto-im-minus';
const CONTRACT = 'finanzneo-visual-beats-v1';
const read = (path) => readFileSync(resolve(path), 'utf8');
const write = (path, content) => {
  const abs = resolve(path);
  mkdirSync(resolve(abs, '..'), {recursive: true});
  writeFileSync(abs, content, 'utf8');
};
const replaceRequired = (path, before, after) => {
  let content = read(path);
  if (content.includes(after)) return;
  if (!content.includes(before)) throw new Error('Erwarteter Block fehlt in ' + path);
  content = content.replace(before, after);
  write(path, content);
};
const insertBefore = (path, marker, id, block) => {
  let content = read(path);
  if (content.includes(id)) return;
  if (!content.includes(marker)) throw new Error('Marker fehlt in ' + path + ': ' + marker);
  content = content.replace(marker, block + '\n\n' + marker);
  write(path, content);
};

// 1) Höchste Regelquelle: Timing/Visual Beats ohne feste Szenenzahl.
replaceRequired(
  'CLAUDE.md',
  '- Reel: 1080 × 1920, 9:16, 30 fps, typischerweise 60–90 Sekunden',
  '- Reel: 1080 × 1920, 9:16, 30 fps; Anfänger-Reels typischerweise ca. 45–70 Sekunden, aber Inhalt und echtes Voiceover entscheiden'
);

replaceRequired(
  'CLAUDE.md',
  `## 5. Dramaturgie und Beat-Regeln\n\n- Hook in den ersten 2 Sekunden\n- ca. 14–16 Visual-Beats als Ziel, Qualität vor Quote\n- ungefähr 60 % Bild / 40 % Animation als Richtwert, keine starre Quote\n- nie mehr als zwei Bildszenen direkt hintereinander\n- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s\n- Animation ideal 4,5–7 s\n- kurze klare Sätze, kein unnötiger Fachjargon\n- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA\n- Zahlen nur nach Prüfung; Beispielannahmen klar kennzeichnen`,
  `## 5. Dramaturgie, Timing und Visual Beats\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\n- Hook in den ersten 2 Sekunden\n- **keine feste Szenenzahl**: so wenige Szenen wie möglich, so viele wie nötig\n- Visual Beats werden unabhängig von der Szenenzahl geplant; erst gesprochene Gedanken, dann sichtbare Beats, dann Szenengruppierung\n- **1 gesprochener Gedanke = 1 sichtbarer Visual Beat**\n- ein Satz darf ein eigenes Bild bekommen; enthält er zwei Aktionen, Beispiele, einen Vergleich oder Vorher/Nachher, wird er bei Bedarf in mehrere Beats geteilt\n- mehrere Bildszenen direkt hintereinander sind erlaubt, wenn jedes neue Bild die Aussage sichtbar weiterführt\n- statischer Bildbeat ideal ca. 1,8–3,4 s; ohne neue sichtbare Information **max. 4,5 s**\n- Animationen dürfen länger sein, müssen aber währenddessen mehrere klar unterschiedliche Zustände zeigen; Kamera-Push/Zoom allein zählt nicht als neuer Beat\n- Voiceover und Visual müssen gemeinsam fortschreiten: ist die Bildaussage bereits verstanden, darf das Bild nicht unnötig stehen bleiben\n- ungefähr 60 % Bild / 40 % Animation ist nur ein Richtwert; bei einfachen Anfänger-Erklärungen sind bewusst mehr Bilder erlaubt\n- echte Wort-Zeitstempel bestimmen finale Schnitte und Szenendauern; keine künstlich gleich langen Szenen\n- kurze klare Sätze, kein unnötiger Fachjargon\n- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz; CTA nur wenn er wirklich passt\n- Zahlen nur nach Prüfung; Beispielannahmen klar kennzeichnen`
);

// 2) Produktionsstandard konsistent halten.
let production = read('reels/PRODUKTIONSSTANDARD.md');
if (!production.includes('VISUAL_BEAT_CONTRACT: ' + CONTRACT)) {
  production = production.replace(
    '## 3. Bilder / Google Flow',
    `## 3. Visual Beats und Timing\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\n- Szenenzahl ist frei und themenabhängig.\n- Erst gesprochene Gedanken definieren, dann pro Gedanken einen sichtbaren Beat planen, danach Szenen gruppieren.\n- Ein Satz darf ein eigenes Bild erhalten; zwei Aussagen/Aktionen/Beispiele in einem Satz dürfen in zwei Beats geteilt werden.\n- Statische Bildbeats ideal 1,8–3,4 s und ohne neue sichtbare Information maximal 4,5 s.\n- Mehrere Bildszenen nacheinander sind erlaubt, wenn jede die Erklärung sichtbar fortsetzt.\n- Animationen müssen während ihrer Laufzeit mehrere sichtbare Zustände durchlaufen; reine Kamera-Bewegung zählt nicht als neuer Beat.\n- Finale Schnitte folgen den echten Wort-Zeitstempeln des Nutzer-Voiceovers.\n- 60/40 Bild/Animation bleibt Richtwert, keine Quote.\n\n## 4. Bilder / Google Flow`
  );
  production = production
    .replace('## 4. Layout V5', '## 5. Layout V5')
    .replace('## 5. Animationen', '## 6. Animationen')
    .replace('## 6. SFX', '## 7. SFX')
    .replace('## 7. Playwright Visual QA', '## 8. Playwright Visual QA')
    .replace('## 8. Phase 3 / Abschluss', '## 9. Phase 3 / Abschluss')
    .replace('## 9. Publishing', '## 10. Publishing');
  write('reels/PRODUKTIONSSTANDARD.md', production);
}

// 3) Agenten lernen den neuen Rhythmus, ohne die bestehende Engine zu ersetzen.
insertBefore(
  '.agents/skills/finanzneo-reel/SKILL.md',
  '## V9 image world',
  'VISUAL_BEAT_CONTRACT: ' + CONTRACT,
  `## Visual Beat timing\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nFor new reels, do not choose a scene count first. Parse the voiceover into spoken thoughts, assign one visible beat per thought, then group beats into scenes. A sentence may receive its own Flow image. If one sentence contains two actions, examples, a comparison or a before/after change, split it into multiple visible beats when that improves comprehension.\n\nStatic image beats should normally last about 1.8–3.4 seconds and must not remain unchanged beyond 4.5 seconds once the message is already understood. Multiple consecutive image scenes are allowed when each one advances meaning. Camera push, zoom or parallax alone does not reset the beat.\n\nAnimation scenes may be longer only when the visible state keeps advancing with the voiceover. Final cuts follow real word timings from Phase 2, never equal-length scene padding. The 60/40 image-animation mix is guidance, not a quota.`
);

insertBefore(
  '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md',
  '## Motion channels',
  'VISUAL_BEAT_CONTRACT: ' + CONTRACT,
  `## Visual-beat synchronization\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nTreat an animation scene as several visible sub-beats, not one long motion. Every time the spoken thought advances, the visual should reveal a new object, state, action, consequence or result. Camera movement alone is not a new beat.\n\nDo not let a fully understood still state sit under new narration. Hold is reserved for a short readable result, not for filling time. Plan approximate beat windows first; Phase 3 retimes scene boundaries from the real voiceover without changing the sealed mechanism.`
);

insertBefore(
  '.agents/plugins/finanzneo-motion/rules/remotion-production.md',
  '## Motion density',
  'VISUAL_BEAT_CONTRACT: ' + CONTRACT,
  `## Voice-to-visual pacing\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nThe visible story must advance with the spoken story. Each meaningful spoken thought gets a visible change. An animation may contain multiple sub-beats inside one scene. Do not use camera drift, zoom or idle floating as a substitute for new information. Result holds are short readability windows, not filler.`
);

insertBefore(
  '.agents/plugins/finanzneo-motion/rules/playwright-qa.md',
  '## Hard checks',
  'VISUAL_BEAT_CONTRACT: ' + CONTRACT,
  `## Visual-beat pacing checks\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nWhen a reel has this contract, inspect the planned beat boundaries from \`05-projektdateien/visual-beats.md\`. Reject pacing when narration advances to a new thought but the visual remains materially unchanged, when a static image is held after its message is already obvious, or when a supposed new beat is only camera motion. Consecutive static images are valid when each one contributes a new explanatory state.`
);

// 4) Neues Dienstags-Reel über den normalen Generator erzeugen.
if (existsSync(resolve(TARGET))) {
  throw new Error('Ziel existiert bereits: ' + TARGET);
}
const types = 'image,image,animation,image,animation,image,image,image,image,animation,image,animation,image';
const create = spawnSync(process.execPath, [
  resolve('scripts/create-finanzneo-reel.mjs'),
  '--target', TARGET,
  '--title', 'Was passiert, wenn dein Konto ins Minus geht?',
  '--types', types,
], {stdio: 'inherit'});
if (create.status !== 0) process.exit(create.status ?? 1);

const root = resolve(TARGET);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

const sceneDefs = [
  {id:'scene-01',type:'image',headline:'Konto plötzlich im Minus?',icon:'warning',tone:'warning',seconds:3.6,file:'Bild 01 - Konto im Minus.png',labels:['Girokonto','-30 €'],voice:'Dein Konto ist im Minus? Dann gibst du Geld aus, das dir gerade nicht gehört.',idea:'Ein normales Girokonto zeigt sichtbar einen negativen Stand; daneben liegt eine gerade bezahlte Alltagsausgabe, sodass sofort klar ist: Es wurde mehr ausgegeben als vorhanden.',visual:'A real-world-grounded Girokonto situation after a normal purchase, with the account visibly below zero and the cause still present.'},
  {id:'scene-02',type:'image',headline:'Minus heißt: Geld geliehen',icon:'bank',tone:'neutral',seconds:3.2,file:'Bild 02 - Minus ist geliehenes Geld.png',labels:['Bank','Geliehen'],voice:'Das Minus ist geliehenes Geld von deiner Bank – kein kostenloses Extra.',idea:'Bank und Girokonto stehen in einer klaren Beziehung: Das fehlende Geld kommt sichtbar von der Bank zum überzogenen Konto.',visual:'A believable bank-to-account lending situation that makes the source of the negative balance obvious without an app interface.'},
  {id:'scene-03',type:'animation',headline:'So rutschst du ins Minus',icon:'arrowRight',tone:'warning',seconds:5.8,voice:'Hast du 100 Euro auf dem Konto und zahlst 130 Euro, landest du bei minus 30 Euro.',idea:'Ein Girokonto startet mit 100 €, eine 130-€-Zahlung trifft ein, vorhandenes Geld geht weg und das Konto kippt sichtbar auf -30 €.',intent:'Girokonto 100 € → Einkauf 130 € erscheint → Geld wird abgezogen → Kontostand kippt auf -30 € → Warnzustand bleibt lesbar.'},
  {id:'scene-04',type:'image',headline:'Dafür zahlst du Zinsen',icon:'percent',tone:'money',seconds:3.0,file:'Bild 04 - Dispozinsen.png',labels:['Dispo','Zinsen'],voice:'Für dieses geliehene Geld verlangt die Bank normalerweise Zinsen.',idea:'Ein überzogenes Girokonto liegt neben einer kleinen, klar als Zinsen markierten Zusatzforderung der Bank.',visual:'A real-life-grounded overdrawn account with a separate bank interest charge that visibly exists because money was borrowed.'},
  {id:'scene-05',type:'animation',headline:'Je länger, desto teurer',icon:'calendar',tone:'warning',seconds:4.5,voice:'Je länger du im Minus bleibst, desto länger zahlst du dafür Zinsen.',idea:'Das Konto bleibt im Minus, Kalenderblätter wechseln und die sichtbare Zinsbelastung wächst mit der Zeit.',intent:'Minus-Konto bleibt bestehen → Kalender wechselt mehrfach → zusätzliche Zinskosten wachsen sichtbar → Ergebnis ZEIT KOSTET.'},
  {id:'scene-06',type:'image',headline:'Die Bank kann stoppen',icon:'cross',tone:'warning',seconds:4.2,file:'Bild 06 - Zahlung kann abgelehnt werden.png',labels:['Zahlung','ABGELEHNT'],voice:'Gehst du über deinen vereinbarten Rahmen hinaus, kann die Bank eine Zahlung ablehnen.',idea:'Eine reale Kartenzahlung an einer Kasse wird sichtbar abgelehnt, weil das daneben gezeigte Girokonto seinen vereinbarten Rahmen erreicht hat.',visual:'A normal checkout situation where a payment is clearly rejected after the account has reached its agreed overdraft limit.'},
  {id:'scene-07',type:'image',headline:'Oder sie lässt es trotzdem zu',icon:'receipt',tone:'warning',seconds:4.0,file:'Bild 07 - Geduldete Ueberziehung.png',labels:['Überziehung','Zinsen'],voice:'Lässt sie die Überziehung trotzdem zu, fallen in der Regel weitere Zinsen an.',idea:'Eine Zahlung geht trotz bereits stark negativem Konto durch; daneben erscheint sichtbar eine zusätzliche Zinsbelastung.',visual:'A real-world payment that is accepted despite a deeper negative balance, with the additional interest consequence shown clearly.'},
  {id:'scene-08',type:'image',headline:'Kurz kann ein Dispo helfen',icon:'clock',tone:'neutral',seconds:3.0,file:'Bild 08 - Kurzer Engpass.png',labels:['Kurz','Dispo'],voice:'Für einen kurzen Engpass kann ein Dispo helfen.',idea:'Ein kleiner kurzfristiger Engpass wird überbrückt: eine fällige Rechnung wird bezahlt und ein nahes Gehaltsdatum ist sichtbar.',visual:'A believable short cash-gap situation with one urgent bill and an imminent salary date, making the temporary nature obvious.'},
  {id:'scene-09',type:'image',headline:'Dauerhaft wird es teuer',icon:'repeat',tone:'warning',seconds:4.0,file:'Bild 09 - Dauerhaft im Minus.png',labels:['Jeden Monat','Minus'],voice:'Landest du jeden Monat im Minus, wird daraus schnell ein teures Problem.',idea:'Mehrere Monatskalender zeigen denselben wiederkehrenden negativen Kontostand, sodass die Wiederholung sofort erkennbar ist.',visual:'A repeated monthly real-life pattern where the same account falls negative again and again, clearly showing a recurring problem.'},
  {id:'scene-10',type:'animation',headline:'Gehalt füllt erst das Minus',icon:'wallet',tone:'money',seconds:5.5,voice:'Kommt dein Gehalt, wird zuerst das Minus ausgeglichen. Erst der Rest ist wieder frei.',idea:'Ein Gehaltsstapel trifft auf ein negatives Girokonto, füllt zuerst die rote Lücke bis null und nur der verbleibende Teil bleibt frei.',intent:'Konto startet negativ → Gehalt kommt an → Geld füllt zuerst das Minus → Konto erreicht null → nur Rest bleibt als frei verfügbarer Stapel.'},
  {id:'scene-11',type:'image',headline:'Ein kleiner Puffer hilft',icon:'shield',tone:'positive',seconds:3.8,file:'Bild 11 - Puffer auf Girokonto.png',labels:['Puffer','Girokonto'],voice:'Ein kleiner Puffer auf dem Girokonto kann dich vor kleinen Überraschungen schützen.',idea:'Ein normaler kleiner Geldpuffer liegt sichtbar zwischen Girokonto und einer unerwarteten kleinen Rechnung und verhindert den negativen Kontostand.',visual:'A realistic small unexpected expense is intercepted by a modest current-account buffer before the account can fall below zero.'},
  {id:'scene-12',type:'animation',headline:'Notgroschen statt Dauer-Minus',icon:'shield',tone:'positive',seconds:5.2,voice:'Bei größeren Überraschungen ist ein Notgroschen besser, als dauerhaft Geld von der Bank zu leihen.',idea:'Eine kaputte Waschmaschine erzeugt eine Reparaturrechnung; der Notgroschen bezahlt sie sichtbar und das Girokonto bleibt geschützt.',intent:'Waschmaschine kaputt → Reparaturrechnung erscheint → Notgroschen gibt Geld frei → Rechnung bezahlt → Girokonto bleibt außerhalb des Minus.'},
  {id:'scene-13',type:'image',headline:'Merke dir das',icon:'check',tone:'positive',seconds:3.5,file:'Bild 13 - Minus Merksatz.png',labels:['Geliehen','Kurz','Teuer'],voice:'Merke: Minus heißt geliehenes Geld. Kurz okay, dauerhaft oft teuer.',idea:'Ein klarer realer Vergleich zeigt links einen kleinen kurzen Engpass und rechts ein wiederkehrend negatives Konto mit Zinskosten.',visual:'A simple real-world contrast between a short temporary overdraft and a repeated expensive overdraft, readable without narration.'},
];

const durationFrames = [108,96,174,90,135,126,120,90,120,165,114,156,105];
let startFrame = 0;
const byId = Object.fromEntries(sceneDefs.map((scene) => [scene.id, scene]));
index.title = 'Was passiert, wenn dein Konto ins Minus geht?';
index.sceneCount = sceneDefs.length;
index.imageSceneCount = sceneDefs.filter((s) => s.type === 'image').length;
index.animationSceneCount = sceneDefs.filter((s) => s.type === 'animation').length;
index.targetImageShare = index.imageSceneCount / index.sceneCount;
index.targetAnimationShare = index.animationSceneCount / index.sceneCount;
index.timelineRules = {...index.timelineRules, equalLengthScenesForbiddenByDefault:true, timingSource:'04-caption/word-timings.json'};

const animationBeats = {
  'scene-03': [
    ['Kontostand: 100 Euro.', 'Das Girokonto startet sichtbar bei 100 €.', 0, 1.1],
    ['Du zahlst 130 Euro.', 'Eine reale 130-€-Einkaufsrechnung tritt in den Vordergrund.', 1.1, 2.4],
    ['Das Geld geht ab.', 'Der verfügbare Geldstapel bewegt sich vom Konto zur Rechnung.', 2.4, 4.1],
    ['Du landest bei minus 30 Euro.', 'Das Konto kippt sichtbar auf -30 € und wechselt in den Warnzustand.', 4.1, 5.8],
  ],
  'scene-05': [
    ['Du bleibst im Minus.', 'Das rote Minuskonto bleibt als Ausgangszustand bestehen.', 0, 1.3],
    ['Zeit vergeht.', 'Mehrere Monatskalender wechseln nacheinander sichtbar.', 1.3, 2.8],
    ['Du zahlst länger Zinsen.', 'Ein wachsender Zinskosten-Stapel erscheint neben dem weiterhin negativen Konto.', 2.8, 4.5],
  ],
  'scene-10': [
    ['Dein Konto ist noch im Minus.', 'Das Girokonto startet sichtbar mit negativem Stand.', 0, 1.4],
    ['Dann kommt dein Gehalt.', 'Ein Gehalts-Geldstapel landet am Konto und füllt zuerst die rote Lücke.', 1.4, 3.5],
    ['Erst der Rest ist frei.', 'Nach Erreichen von null trennt sich nur der verbleibende Geldstapel als frei verfügbar ab.', 3.5, 5.5],
  ],
  'scene-12': [
    ['Eine größere Überraschung kommt.', 'Eine kaputte Waschmaschine und Reparaturrechnung erscheinen als echter Notfall.', 0, 1.4],
    ['Der Notgroschen bezahlt.', 'Geld verlässt den Reservebehälter und bewegt sich zur Reparaturrechnung.', 1.4, 3.6],
    ['Das Girokonto bleibt geschützt.', 'Die Rechnung wechselt auf bezahlt und das Girokonto bleibt sichtbar außerhalb des Minus.', 3.6, 5.2],
  ],
};

index.scenes = index.scenes.map((scene, i) => {
  const def = byId[scene.id];
  if (!def) throw new Error('Szenendefinition fehlt: ' + scene.id);
  const frames = durationFrames[i];
  const base = {
    ...scene,
    type:def.type,
    startFrame,
    durationFrames:frames,
    headline:def.headline,
    icon:def.icon,
    accent:'finance-green',
    headerTone:def.tone,
    audioTrigger:def.voice,
    targetSeconds:def.seconds,
    plannedDurationSeconds:def.seconds,
    mainIdea:def.idea,
  };
  startFrame += frames;

  if (def.type === 'image') {
    return {
      ...base,
      googleFlowFileName:def.file,
      objectLabels:def.labels,
      expectedVisual:def.visual,
      imagePresentation:{scale:1.01,sourceCropTop:0,sourceCropBottom:0,cropSafe:true},
      visualBeats:[{
        id:def.id + '-beat-01',kind:'image',voiceText:def.voice,visualChange:def.idea,startSecond:0,endSecond:def.seconds,
      }],
    };
  }

  const beats = animationBeats[def.id].map((beat, beatIndex) => ({
    id:def.id + '-beat-' + String(beatIndex + 1).padStart(2,'0'),
    kind:'animation-phase',voiceText:beat[0],visualChange:beat[1],startSecond:beat[2],endSecond:beat[3],
  }));
  return {
    ...base,
    animationIntent:def.intent,
    visualBeats:beats,
  };
});

index.cover = {
  type:'scene-image',sourceSceneId:'scene-01',googleFlowFileName:sceneDefs[0].file,
  planFile:'03-szenen/00-cover/cover.txt',aspectRatio:'1:1',sameAssetAsFirstScene:true,separateGenerationForbidden:true,
};
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const scriptText = sceneDefs.map((s) => s.voice).join(' ');
write(TARGET + '/01-script/script-fliess-text.txt', scriptText + '\n');
write(TARGET + '/01-script/script-szenenweise.txt', sceneDefs.map((s,i) => 'Szene ' + String(i+1).padStart(2,'0') + ' — ' + s.headline + '\n' + s.voice).join('\n\n') + '\n');
write(TARGET + '/02-audio/README.md', '# AUDIO HIER REIN\n\nHier genau **eine** finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel erzeugen. Die finalen Wortzeiten ersetzen die Plansekunden; Bilder und Haupt-Voiceover bleiben Nutzerinputs.\n');

const styleTail = `\n\nFINANZNEO_WORLD_ID: finanzneo-connected-studio-v3\nFINANZNEO_SERIES_LOCK: finanzneo-same-world-v1\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\nGENERATED_IMAGE_ASPECT_RATIO: 1:1\n\nSTYLE:\nClearly stylized 3D animated finance-explainer world, real-world-grounded and believable, with recognizable everyday object construction and semi-realistic material detail. Premium, clean and simple. Never photorealistic.\n\nBACKGROUND:\nOne seamless deep black background, clean and uninterrupted.\n\nCOMPOSITION:\nMake the main explanatory action large and immediately readable. The viewer should clearly understand the message within 1–2 seconds without narration. Supporting objects only when they improve cause-and-effect clarity.\n\nCOLORS + LIGHT:\nEmerald for positive/protected, warm ivory/soft gray for neutral objects, subtle gold for money, warm red-orange for warning/cost. Clean soft lighting and contact shadows.\n\nTEXT:\nNo headline, subtitle, CTA or explanatory sentence. Only the exact short German object labels listed above.\n\nFORBIDDEN:\nNo photorealism, no stock/product photo look, no dashboard, no app UI, no flowchart, no floating info cards, no tiny-box composition, no microchip/circuit language, no miniature diorama, no clutter.\n`;

const promptCore = {
  'scene-01': 'Create a real-world-grounded stylized 3D everyday payment scene immediately after someone has spent slightly more than was available. Show a substantial physical Girokonto account slab as the main object with a clearly readable negative state “-30 €”. Beside it, include one believable recently paid everyday receipt or shopping item so the cause is obvious: spending exceeded the available money. The relationship must visually explain cause-and-effect, not merely show finance symbols. Keep the negative account prominent and easy to read at a glance, with restrained warning color only where needed. The viewer should immediately understand that the account has fallen below zero.',
  'scene-02': 'Create a believable stylized 3D bank-and-account situation that visually explains where the missing money comes from. Place a recognizable physical bank building or bank counter on one side and a Girokonto account object on the other. Show a small controlled stream or stack of money moving from the bank toward the already overdrawn account, making the relationship unmistakable: the negative balance is borrowed money from the bank. Keep the scene grounded in normal banking reality, not an abstract arrow diagram. The viewer should immediately understand the lending relationship without reading a paragraph.',
  'scene-04': 'Create a real-world-grounded stylized 3D scene with an overdrawn Girokonto as the main object and a separate small bank charge beside it marked “Zinsen”. The negative account should remain clearly visible while the extra interest charge appears as an additional consequence, not as part of the original purchase. Use a modest gold money cue for value and warm red-orange only for cost. The visual relationship must clearly explain: because money was borrowed through the overdraft, the bank charges interest. Avoid rate percentages, guarantees or promotional banking imagery.',
  'scene-06': 'Create a believable stylized 3D checkout scene in a normal shop. Show a payment terminal, a shopping basket or groceries, and a payment card attempting a purchase. Nearby, show a physical Girokonto account object already at its agreed limit. The payment terminal or receipt should clearly show the short label “ABGELEHNT”, making the cause-and-effect immediately understandable: the account cannot go further and the bank may reject the payment. Keep the composition physical and real-life, not an app screen or abstract warning symbol.',
  'scene-07': 'Create a real-world-grounded stylized 3D payment scene where a purchase is visibly accepted even though the Girokonto is already more deeply negative. The payment itself should look completed, while a separate additional bank cost marked “Zinsen” appears beside the overdrawn account. The viewer should clearly understand the sequence without narration: the bank allowed the deeper overdraft, but this creates another interest cost. Do not show a specific interest rate. Keep the objects large, simple and physically related rather than arranged like an infographic dashboard.',
  'scene-08': 'Create a believable stylized 3D short-term cash-gap scene. Show one urgent everyday bill that is due now, a Girokonto using a small Dispo amount to cover it, and a nearby calendar showing that salary is arriving soon. The key visual message is temporary bridging: the gap is short and has a clear end point. Keep the number of objects low and the relationship obvious. The viewer should immediately understand why a short overdraft can help for a brief gap, without implying that permanent overdraft use is good or free.',
  'scene-09': 'Create a real-world-grounded stylized 3D recurring-money-problem scene. Show the same Girokonto falling into a negative state across several clearly separated monthly calendar moments, for example three consecutive months. Each month should visibly repeat the same negative outcome, with small accumulated cost cues becoming more noticeable. The visual should immediately explain repetition: this is not one short emergency but a pattern that returns every month. Keep the account and calendars large and readable, with no dashboard, chart or abstract flowchart layout.',
  'scene-11': 'Create a believable stylized 3D everyday scene where a small unexpected expense approaches a Girokonto, but a modest visible cash buffer inside or directly beside the account absorbs the cost before the balance can fall below zero. The main relationship should read instantly: a small reserve on the current account protects against a small surprise. Use a normal household receipt or minor repair cost as the cause, the buffer as the protection, and a stable non-negative Girokonto as the result. Avoid a giant emergency fund or investment imagery.',
  'scene-13': 'Create a clean real-world-grounded stylized 3D comparison using two simple everyday situations, not cards or panels. On the left, show one small short-lived overdraft with a nearby soon-arriving salary cue and the label “Kurz”. On the right, show the same type of Girokonto repeatedly negative across multiple months with visible interest costs and the label “Teuer”. The viewer should immediately understand the memory rule: a brief gap can be temporary, while repeated long overdraft use becomes costly. Keep the physical objects large and the contrast simple.',
};

const labelsForPrompt = Object.fromEntries(sceneDefs.filter((s)=>s.type==='image').map((s)=>[s.id,s.labels]));
const makePrompt = (def) => {
  const labels = labelsForPrompt[def.id].map((label) => '- ' + label).join('\n');
  return `FLOW_AGENT_PROTOCOL: finanzneo-flow-agent-protocol-v1\nAKTUELLER EINZELSCHRITT — NICHT VORSPRINGEN\n\nGOOGLE FLOW – FINALER DATEINAME:\n${def.file}\n\nErzeuge ausschließlich dieses eine Bild. Vollständig warten → sofort exakt umbenennen → Aussage + erlaubte Labels + V9-Stil + deep black prüfen → erst nach PASS nächstes Bild. Keine Bildreferenz.\n\nBESCHRIFTUNGEN – EXAKT SO:\n${labels}\n\nIMAGE PROMPT:\n${promptCore[def.id]}${styleTail}`;
};

const imageDefs = sceneDefs.filter((s)=>s.type==='image');
for (const def of imageDefs) {
  const dir = TARGET + '/03-szenen/EINZELNE-SZENEN/' + def.id;
  write(dir + '/bildprompt.txt', makePrompt(def));
  write(dir + '/szene.md', `# ${def.id}\n\n**Typ:** Bild\n**Zwischenüberschrift:** ${def.headline}\n**Icon:** ${def.icon}\n**Sprechtext:** ${def.voice}\n**Geplante Dauer:** ${def.seconds.toFixed(1)} s\n**Visual Beat:** ${def.idea}\n**Google-Flow-Datei:** ${def.file}\n`);
}

const coverPrompt = `COVER = SZENE 01\nKEIN SEPARATER BILDJOB. No separate cover generation; no Bild 00.\nKEIN separates Cover erzeugen.\nKEIN Bild 00 erzeugen.\nDas Cover verwendet exakt dasselbe Asset wie scene-01.\n\n${makePrompt(sceneDefs[0])}`;
write(TARGET + '/03-szenen/00-cover/cover.txt', coverPrompt);

const masterHeader = `# GOOGLE FLOW — ALLE BILDPROMPTS\n\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\nCOVER = SZENE 01\nKEIN separates Cover erzeugen.\nKEIN Bild 00 erzeugen.\n\nArbeitsweise: immer exakt ein Bildjob. Jeder Prompt beschreibt eine real-world-grounded Alltagssituation in stylized 3D auf deep black und muss die Aussage visually explain / clearly understand within 1–2 seconds. Never photorealistic. No dashboard. No flowchart.\n\nFINALER BILDERORDNER:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`;
write(TARGET + '/03-szenen/alle-bildprompts.txt', masterHeader + '\n\n' + imageDefs.map((def)=>'===== ' + def.id + ' =====\n\n' + makePrompt(def)).join('\n\n'));
write(TARGET + '/03-szenen/00-ALLE-BILDER-HIER-REIN/README.md', '# ALLE FERTIGEN BILDER HIER REIN\n\nGenau diese 9 Nutzerbilder werden benötigt:\n\n' + imageDefs.map((d)=>'- ' + d.file).join('\n') + '\n\nGoogle Flow weiterhin streng einzeln: erzeugen → warten → exakt umbenennen → V9-QA → nächstes Bild.\n');

const animationSources = {
  'scene-03': `import React from 'react';\nimport {interpolate, useCurrentFrame} from 'remotion';\nimport {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';\n\n/**\n * MECHANIC_ID: spend-more-than-balance-creates-overdraft\n * PRIMARY_ACTION: Ein 100-Euro-Girokonto bezahlt sichtbar einen 130-Euro-Einkauf und kippt dadurch auf minus 30 Euro.\n * ANIMATION_NARRATIVE\n * START: Girokonto zeigt 100 €, Geldstapel liegt verfügbar daneben.\n * MECHANISM: 130-€-Einkaufsrechnung erscheint; Geld bewegt sich zur Rechnung; die Zahlung übersteigt das Guthaben.\n * RESULT: Konto wechselt sichtbar auf -30 € und Warnzustand.\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: Girokonto und 130-€-Rechnung tragen die Ursache/Wirkung.\n * SUPPORT: Geldstapel macht den Abfluss physisch sichtbar.\n * MATERIAL: Neutral für Konto, Ivory für Rechnung, Gold für Geld, Rot nur für Minus.\n * DEPTH: Konto zentral hinten, Rechnung rechts vorne, Geld bewegt sich dazwischen.\n */\nexport const RESULT_HOLD_FRAMES = 24;\nconst clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};\nexport const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=174}) => {\n  const frame = useCurrentFrame();\n  const billIn = interpolate(frame,[20,55],[0,1],clamp);\n  const payment = interpolate(frame,[48,112],[0,1],clamp);\n  const deficit = interpolate(frame,[96,132],[0,1],clamp);\n  const result = interpolate(frame,[128,Math.max(136,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);\n  const coinX = 285 + payment*360;\n  const coinY = 790 + payment*60;\n  return <PremiumPhysicalStage>\n    <PhysicalAccount x={350} y={520} label=\"Girokonto\" balance={deficit>0.55?'−30 €':'100 €'} state={deficit>0.55?'danger':'normal'} scale={1-deficit*0.035} tilt={deficit*2.5} />\n    <PhysicalCoinStack x={coinX} y={coinY} count={5} scale={0.72-payment*0.08} opacity={1-payment*0.58} />\n    <PhysicalBill x={690} y={690-(1-billIn)*90} label=\"Einkauf\" amount=\"130 €\" rotate={5} scale={0.76} opacity={billIn} paid={payment>0.78} />\n    <div style={{position:'absolute',left:405,top:950,opacity:result,transform:\`translateY(\${(1-result)*18}px)\`,color:ANIMATION_COLORS.warning}}><PhysicalTag material=\"warning\" style={{fontSize:27}}>MINUS 30 €</PhysicalTag></div>\n  </PremiumPhysicalStage>;\n};\n`,
  'scene-05': `import React from 'react';\nimport {interpolate, useCurrentFrame} from 'remotion';\nimport {ANIMATION_COLORS, PhysicalAccount, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';\n\n/**\n * MECHANIC_ID: overdraft-time-adds-interest-cost\n * PRIMARY_ACTION: Ein dauerhaft negatives Girokonto bleibt stehen, während mehrere Monatsblätter wechseln und ein sichtbarer Zinskosten-Stapel wächst.\n * ANIMATION_NARRATIVE\n * START: Girokonto steht bei -30 €.\n * MECHANISM: Monatsblätter erscheinen nacheinander; mit vergehender Zeit wächst ein separater Geld-/Kostenstapel.\n * RESULT: Das Konto ist weiter negativ und ZEIT KOSTET bleibt sichtbar.\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: Negatives Girokonto plus vergehende Monate.\n * SUPPORT: Wachsender Kostenstapel zeigt die Zinsfolge.\n * MATERIAL: Rot für Minus, Ivory für Kalender, Gold als Geldwert, Warnfarbe für Ergebnis.\n * DEPTH: Konto zentral, Kalender gestaffelt links, Kostenstapel rechts vorne.\n */\nexport const RESULT_HOLD_FRAMES = 22;\nconst clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};\nexport const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {\n  const frame = useCurrentFrame();\n  const month1 = interpolate(frame,[10,30],[0,1],clamp);\n  const month2 = interpolate(frame,[32,58],[0,1],clamp);\n  const month3 = interpolate(frame,[60,84],[0,1],clamp);\n  const costGrow = interpolate(frame,[36,98],[0,1],clamp);\n  const result = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);\n  return <PremiumPhysicalStage>\n    <PhysicalAccount x={385} y={560} label=\"Girokonto\" balance=\"−30 €\" state=\"danger\" scale={0.98+result*0.02} />\n    <PhysicalCalendarPage x={45} y={700-(1-month1)*70} month=\"MONAT 1\" scale={0.64} opacity={month1} rotate={-6} />\n    <PhysicalCalendarPage x={115} y={760-(1-month2)*70} month=\"MONAT 2\" scale={0.64} opacity={month2} rotate={0} />\n    <PhysicalCalendarPage x={185} y={820-(1-month3)*70} month=\"MONAT 3\" scale={0.64} opacity={month3} rotate={6} />\n    <PhysicalCoinStack x={760} y={780-costGrow*95} count={Math.max(2,Math.round(2+costGrow*5))} scale={0.62+costGrow*0.12} opacity={0.35+costGrow*0.65} />\n    <div style={{position:'absolute',left:705,top:1000,opacity:result,color:ANIMATION_COLORS.warning}}><PhysicalTag material=\"warning\" style={{fontSize:27}}>ZEIT KOSTET</PhysicalTag></div>\n  </PremiumPhysicalStage>;\n};\n`,
  'scene-10': `import React from 'react';\nimport {interpolate, useCurrentFrame} from 'remotion';\nimport {ANIMATION_COLORS, PhysicalAccount, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';\n\n/**\n * MECHANIC_ID: salary-fills-overdraft-before-free-money\n * PRIMARY_ACTION: Ein Gehaltsstapel trifft auf ein negatives Girokonto, füllt zuerst das Minus bis null und nur der Rest bleibt frei verfügbar.\n * ANIMATION_NARRATIVE\n * START: Girokonto ist sichtbar im Minus.\n * MECHANISM: Gehalt kommt an; ein großer Teil verschwindet physisch in der roten Kontolücke; der Kontostand stabilisiert sich bei null.\n * RESULT: Nur ein kleiner verbleibender Geldstapel steht als REST FREI daneben.\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: Negatives Girokonto und Gehaltsstapel.\n * SUPPORT: Verbleibender Rest macht den Unterschied sichtbar.\n * MATERIAL: Rot für Minus, Gold für Gehalt, Emerald erst nach Ausgleich.\n * DEPTH: Gehalt links vorne, Konto zentral, freier Rest rechts vorne.\n */\nexport const RESULT_HOLD_FRAMES = 24;\nconst clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};\nexport const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=165}) => {\n  const frame = useCurrentFrame();\n  const salaryIn = interpolate(frame,[18,62],[0,1],clamp);\n  const fillMinus = interpolate(frame,[52,108],[0,1],clamp);\n  const restOut = interpolate(frame,[104,136],[0,1],clamp);\n  const result = interpolate(frame,[132,Math.max(140,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);\n  const salaryX = 30 + salaryIn*360;\n  const salaryY = 720 - salaryIn*45;\n  return <PremiumPhysicalStage>\n    <PhysicalAccount x={390} y={550} label=\"Girokonto\" balance={fillMinus>0.82?'0 €':'−250 €'} state={fillMinus>0.82?'protected':'danger'} scale={0.97+fillMinus*0.03} />\n    <PhysicalCoinStack x={salaryX} y={salaryY} count={7} scale={0.78-fillMinus*0.18} opacity={1-fillMinus*0.62} />\n    <div style={{position:'absolute',left:80,top:560,opacity:salaryIn*(1-fillMinus*0.7),color:ANIMATION_COLORS.money}}><PhysicalTag material=\"money\" style={{fontSize:25}}>GEHALT</PhysicalTag></div>\n    <PhysicalCoinStack x={760+restOut*35} y={760-restOut*45} count={3} scale={0.46+restOut*0.28} opacity={restOut} />\n    <div style={{position:'absolute',left:750,top:970,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material=\"positive\" style={{fontSize:27}}>REST FREI</PhysicalTag></div>\n  </PremiumPhysicalStage>;\n};\n`,
  'scene-12': `import React from 'react';\nimport {interpolate, useCurrentFrame} from 'remotion';\nimport {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PhysicalWasher, PremiumPhysicalStage} from '../../../../../../../src/design-system';\n\n/**\n * MECHANIC_ID: emergency-fund-prevents-long-overdraft\n * PRIMARY_ACTION: Eine kaputte Waschmaschine erzeugt eine Reparaturrechnung, die sichtbar aus dem Notgroschen statt aus einem neuen Minus bezahlt wird.\n * ANIMATION_NARRATIVE\n * START: Waschmaschine fällt aus; Girokonto steht stabil bereit.\n * MECHANISM: Reparaturrechnung erscheint; Notgroschen öffnet Geld; Geldstapel bewegt sich zur Rechnung.\n * RESULT: Rechnung ist bezahlt und Girokonto bleibt geschützt außerhalb des Minus.\n * PREMIUM_VISUAL_NARRATIVE\n * HERO: Waschmaschine, Reparaturrechnung und Reserve bilden eine reale Notfallsituation.\n * SUPPORT: Girokonto zeigt das vermiedene Minus.\n * MATERIAL: Ivory Maschine/Rechnung, Gold Reserve/Geld, Emerald für geschützten Ausgang.\n * DEPTH: Maschine links hinten, Rechnung Mitte vorne, Reserve rechts, Girokonto unten mittig.\n */\nexport const RESULT_HOLD_FRAMES = 24;\nconst clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};\nexport const Scene12Animation: React.FC<{durationFrames?:number}> = ({durationFrames=156}) => {\n  const frame = useCurrentFrame();\n  const emergency = interpolate(frame,[8,36],[0,1],clamp);\n  const billIn = interpolate(frame,[26,58],[0,1],clamp);\n  const pay = interpolate(frame,[54,112],[0,1],clamp);\n  const protect = interpolate(frame,[104,132],[0,1],clamp);\n  const result = interpolate(frame,[128,Math.max(136,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);\n  const coinX = 720 - pay*300;\n  const coinY = 760 + pay*35;\n  return <PremiumPhysicalStage>\n    <PhysicalWasher x={40} y={520+(1-emergency)*55} broken scale={0.82} opacity={emergency} />\n    <PhysicalBill x={360} y={670-(1-billIn)*90} label=\"Reparatur\" amount=\"280 €\" scale={0.72} opacity={billIn} paid={pay>0.78} />\n    <PhysicalReserveTank x={760} y={500} width={220} height={340} fill={0.72-pay*0.24} label=\"Notgroschen\" scale={0.94+pay*0.06} />\n    <PhysicalCoinStack x={coinX} y={coinY} count={4} scale={0.58} opacity={billIn*(1-pay*0.32)} />\n    <PhysicalAccount x={390} y={990} label=\"Girokonto\" balance=\"geschützt\" state=\"protected\" scale={0.88+protect*0.05} opacity={0.55+protect*0.45} />\n    <div style={{position:'absolute',left:685,top:1000,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material=\"positive\" style={{fontSize:25}}>KEIN DAUER-MINUS</PhysicalTag></div>\n  </PremiumPhysicalStage>;\n};\n`,
};

for (const def of sceneDefs.filter((s)=>s.type==='animation')) {
  const dir = TARGET + '/03-szenen/EINZELNE-SZENEN/' + def.id;
  write(dir + '/animation.tsx', animationSources[def.id]);
  const beats = animationBeats[def.id].map((b,i)=>'- Beat ' + (i+1) + ' (' + b[2].toFixed(1) + '–' + b[3].toFixed(1) + ' s): ' + b[1]).join('\n');
  write(dir + '/remotion.md', `# ${def.id} — Remotion\n\nMECHANIC_ID: ${def.id === 'scene-03' ? 'spend-more-than-balance-creates-overdraft' : def.id === 'scene-05' ? 'overdraft-time-adds-interest-cost' : def.id === 'scene-10' ? 'salary-fills-overdraft-before-free-money' : 'emergency-fund-prevents-long-overdraft'}\n\n**Sprechtext:** ${def.voice}\n**Geplante Dauer:** ${def.seconds.toFixed(1)} s\n**Hauptmechanik:** ${def.intent}\n\nVISUAL BEATS:\n${beats}\n\nKeine neue visuelle Information darf nur durch Kamera-Zoom vorgetäuscht werden. Ergebnis kurz lesbar halten, danach nächste Szene.\n`);
  write(dir + '/szene.md', `# ${def.id}\n\n**Typ:** Animation\n**Zwischenüberschrift:** ${def.headline}\n**Icon:** ${def.icon}\n**Sprechtext:** ${def.voice}\n**Geplante Dauer:** ${def.seconds.toFixed(1)} s\n**Mechanik:** ${def.intent}\n`);
}

write(TARGET + '/05-projektdateien/visual-beats.md', `# Visual Beats\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nDieses Reel hat bewusst keine feste 10-Szenen-Struktur. Es besitzt 13 Szenen, 9 Nutzerbilder und 4 Animationen. Statische Bilder bleiben kurz; Animationsszenen enthalten mehrere sichtbare Zustände.\n\n` + sceneDefs.map((def)=>{
  const scene = index.scenes.find((s)=>s.id===def.id);
  return `## ${def.id} — ${def.headline}\nGeplant: ${def.seconds.toFixed(1)} s · ${def.type === 'image' ? '1 statischer Beat' : scene.visualBeats.length + ' Animations-Beats'}\n\n` + scene.visualBeats.map((b)=>`- ${b.startSecond.toFixed(1)}–${b.endSecond.toFixed(1)} s — VO: “${b.voiceText}” → VISUAL: ${b.visualChange}`).join('\n');
}).join('\n\n') + '\n\nFinale Grenzen werden nach dem echten Nutzer-Voiceover mit word-timings.json neu gesetzt; der Beat-Inhalt bleibt dabei erhalten.\n');

write(TARGET + '/05-projektdateien/szenenplan.md', `# SZENENPLAN\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\nZiel: Anfänger verstehen jeden Gedanken sofort. Szenenzahl ist Ergebnis des Voiceovers, nicht Vorgabe. Mehrere Bilder nacheinander sind hier bewusst erlaubt, weil jedes Bild einen neuen Gedanken trägt.\n\n| Szene | Typ | Plan | Header | Sprechpunkt |\n|---|---|---:|---|---|\n${sceneDefs.map((d,i)=>`| ${String(i+1).padStart(2,'0')} | ${d.type === 'image' ? 'Bild' : 'Animation'} | ${d.seconds.toFixed(1)} s | ${d.headline} | ${d.voice} |`).join('\n')}\n\nGesamtplanung: ${(durationFrames.reduce((a,b)=>a+b,0)/30).toFixed(1)} s vor echten Wort-Timings. 9 Bilder / 4 Animationen.\n`);

write(TARGET + '/05-projektdateien/recherche-quellen.md', `# RECHERCHE UND QUELLEN\n\nStand: 30.08.2026\n\n## Kernaussagen\n- Ein eingeräumter Dispo ist geliehenes Geld der Bank; dafür fallen vereinbarte Zinsen an.\n- Bei einer geduldeten Überziehung kann die Bank eine Zahlung ablehnen oder sie trotzdem zulassen; bei Zulassung fallen in der Regel Zinsen an.\n- Dispo-/Überziehungszinsen unterscheiden sich je Bank stark; deshalb nennt das Reel bewusst keinen festen Zinssatz.\n\n## Primär-/Verbraucherquellen\n1. BaFin Kontenvergleich — Eingeräumte Kontoüberziehung: https://kontenvergleich.bafin.de/de-simple/glossar/eingeraeumte-konto-ueberziehung\n2. BaFin Kontenvergleich — Geduldete Kontoüberziehung: https://kontenvergleich.bafin.de/de-simple/glossar/geduldete-konto-ueberziehung\n3. Verbraucherzentrale — Girokonto-Checkliste / Dispo und geduldete Überziehung: https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/welches-girokonto-ist-das-beste-fuer-mich-checkliste-95567\n\nKeine individuelle Finanz- oder Kreditberatung.\n`);

write(TARGET + '/04-caption/caption.txt', `Konto im Minus bedeutet meist: Du nutzt geliehenes Geld der Bank und dafür können Zinsen anfallen. Für einen kurzen Engpass kann ein Dispo helfen. Wenn du aber regelmäßig oder lange im Minus bleibst, kann es teuer werden. Ein kleiner Puffer und ein Notgroschen können helfen, unnötige Überziehungen zu vermeiden.\n\nQuellen: BaFin Kontenvergleich und Verbraucherzentrale, Stand 2026. Keine individuelle Finanz- oder Kreditberatung.\n`);

write(TARGET + '/05-projektdateien/sound-plan.md', `# SFX-PLAN\n\nVoiceover bleibt dominant. SFX nur an sichtbaren Ereignissen.\n\n## scene-03\n- Frame ~24: Rechnung/Purchase erscheint → kurzer paper/receipt whoosh\n- Frame ~58: Geld setzt sich in Bewegung → subtle money movement\n- Frame ~112: Konto kippt ins Minus → kurzer restrained warning impact\n\n## scene-05\n- Frames ~18 / 44 / 70: Kalenderwechsel → dezente page flips\n- Frame ~92: Kostenstapel erreicht Ergebnis → kleiner warning tick\n\n## scene-10\n- Frame ~26: Gehalt kommt → soft money movement\n- Frame ~94: Minus erreicht fast null → restrained account settle\n- Frame ~132: Rest wird frei → positive confirmation click\n\n## scene-12\n- Frame ~18: Waschmaschine fällt aus → soft mechanical stop\n- Frame ~38: Rechnung erscheint → paper impact\n- Frame ~70: Geld verlässt Notgroschen → subtle cash movement\n- Frame ~116: Rechnung bezahlt / Giro geschützt → clean confirmation\n`);

write(TARGET + '/05-projektdateien/visual-qa.md', `# PLAYWRIGHT VISUAL QA\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT}\n\n## Bildszenen\nPrüfe je mindestens einen stabilen Frame: 01, 02, 04, 06, 07, 08, 09, 11, 13.\n\nZusätzlich prüfen:\n- Kein statisches Bild bleibt nach seiner Aussage unnötig stehen.\n- Die Bilder 06→07→08→09 dürfen direkt aufeinander folgen, weil jeder Wechsel einen neuen Gedanken zeigt.\n- Hauptmotiv groß genug; keine übermäßige tote schwarze Fläche.\n- Header/Icon optisch konsistent.\n\n## Animationsszenen\n- scene-03: ca. 0.3 s / 1.7 s / 3.2 s / 4.8 s / final hold\n- scene-05: ca. 0.3 s / 1.8 s / 3.4 s / final hold\n- scene-10: ca. 0.3 s / 2.2 s / 4.2 s / final hold\n- scene-12: ca. 0.3 s / 2.0 s / 4.0 s / final hold\n\nFAIL wenn der gesprochene Gedanke wechselt, aber sichtbar nur Kamera/Zoom weiterläuft.\n`);

write(TARGET + '/05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `# ANTIGRAVITY — PHASE 3\n\n1. Nutzer liefert exakt die 9 Flow-Bilder aus 03-szenen/00-ALLE-BILDER-HIER-REIN/.\n2. Nutzer liefert genau ein finales Voiceover in 02-audio/.\n3. Erzeuge/übernehme echte Wort-Zeitstempel aus diesem Voiceover.\n4. Retiming folgt VISUAL_BEAT_CONTRACT ${CONTRACT}: Satz-/Gedankenwechsel und sichtbarer Beat bleiben gekoppelt; keine künstlich gleich langen Szenen.\n5. Nutze exakt die versiegelten animation.tsx-Dateien; Mechanik nach Seal nicht kreativ ersetzen.\n6. SFX nur nach sound-plan.md und framegenau.\n7. Playwright-QA nach visual-qa.md; sichtbarer Timing-/Layoutfehler = FAIL.\n8. Danach Preflight → Candidate → Render-QA → automatischer Export nach 06-export/.\n\nAntigravity erzeugt weder die finalen Google-Flow-Bilder noch das Haupt-Voiceover.\n`);

const timelineScenes = index.scenes.map((scene)=>({
  id:scene.id,type:scene.type,startFrame:scene.startFrame,durationFrames:scene.durationFrames,plannedDurationSeconds:scene.plannedDurationSeconds,visualBeats:scene.visualBeats,
}));
write(TARGET + '/05-projektdateien/timeline.json', JSON.stringify({version:3,title:index.title,fps:30,timingSource:'04-caption/word-timings.json',visualBeatContract:CONTRACT,plannedDurationSeconds:durationFrames.reduce((a,b)=>a+b,0)/30,scenes:timelineScenes}, null, 2) + '\n');

write(TARGET + '/README.md', `# Was passiert, wenn dein Konto ins Minus geht?\n\nDienstags-Reel der Woche 31.08.–06.09.2026.\n\n- 13 individuelle Szenen\n- 9 Nutzerbilder / 4 Remotion-Animationen\n- Visual-Beat-v1: ein gesprochener Gedanke = ein sichtbarer Beat\n- geplante Dauer vor echtem Voiceover: ${(durationFrames.reduce((a,b)=>a+b,0)/30).toFixed(1)} s\n- V9 stylized 3D / pure black / Layout V5\n- scene-01 = Cover, kein Bild 00\n- genau eine Universal-Caption\n- Nutzer erstellt Bilder + Haupt-Voiceover; Antigravity integriert, synchronisiert SFX, prüft und rendert\n`);

console.log('✓ Visual-Beat-Regeln global verankert und Dienstags-Reel aufgebaut: ' + TARGET);
console.log('  13 Szenen · 9 Bilder · 4 Animationen · 53,3 s Plan vor echtem Voiceover.');
