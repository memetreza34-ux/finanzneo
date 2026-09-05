#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins');
const scenesRoot = resolve(root, '03-szenen');
const COVER_HOOK_ID = 'finanzneo-cover-hook-v2';

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.txt')) {
      const before = readFileSync(path, 'utf8');
      const after = before.replace(/deep-black background/gi, 'deep black background');
      if (after !== before) writeFileSync(path, after, 'utf8');
    }
  }
};
walk(scenesRoot);

const durationByScene = {
  'scene-01': 0.1,
  'scene-02': 4.1,
  'scene-03': 3.4,
  'scene-04': 4.6,
  'scene-05': 3.0,
  'scene-06': 4.8,
  'scene-07': 2.8,
  'scene-08': 6.2,
  'scene-09': 3.1,
  'scene-10': 4.7,
  'scene-11': 3.2,
  'scene-12': 4.0,
  'scene-13': 5.1,
  'scene-14': 3.5,
};

const imageBeatByScene = {
  'scene-01': {
    voiceText: 'Cover ohne Voiceover: 3 % Tagesgeld? Schau auf die Frist.',
    visualChange: 'Ein reales Tagesgeld-Angebot zeigt 3 % p.a. direkt neben einer sichtbaren Drei-Monats-Frist; nur Hero-Bild und Reel-Titel sind sichtbar.',
  },
  'scene-03': {
    voiceText: 'Viele hohe Tagesgeldzinsen sind Neukundenangebote und nur für eine begrenzte Zeit höher.',
    visualChange: 'Auf echten Tagesgeld-Unterlagen sind Neukundenstatus und Aktionsdauer gleichzeitig markiert.',
  },
  'scene-05': {
    voiceText: 'Nach Ablauf der Aktion gilt häufig der niedrigere Zinssatz für Bestandskunden.',
    visualChange: 'Das Tagesgeldkonto bleibt bestehen; auf den aktualisierten Konditionen steht nach Aktionsende der Standardzins im Mittelpunkt.',
  },
  'scene-07': {
    voiceText: '3 Prozent p.a. bedeutet 3 Prozent pro Jahr, nicht 3 Prozent in drei Monaten.',
    visualChange: 'Die Angabe 3 % p.a. liegt unmittelbar neben einem vollständigen Zwölf-Monats-Kalender und macht den Jahresbezug sichtbar.',
  },
  'scene-09': {
    voiceText: 'Danach hängt dein weiterer Ertrag davon ab, welcher Zinssatz weitergilt.',
    visualChange: 'Zwei zeitlich aufeinanderfolgende Tagesgeld-Konditionsblätter zeigen Aktionszins und danach Standardzins.',
  },
  'scene-11': {
    voiceText: 'Schau vor der Eröffnung nicht nur auf den Aktionszins.',
    visualChange: 'Eine Hand hält die Werbung, während eine zweite Hand mit einem Stift die tatsächlichen Tagesgeld-Konditionen prüft.',
  },
  'scene-12': {
    voiceText: 'Prüfe die Aktionsdauer, den Standardzins danach und ob der hohe Zins nur für Neukunden oder neues Geld gilt.',
    visualChange: 'Auf einem realen Tagesgeld-Konditionsblatt werden exakt Aktionsdauer, Standardzins und Neukunden beziehungsweise neues Geld kontrolliert.',
  },
  'scene-14': {
    voiceText: 'So vergleichst du nicht nur die Werbung, sondern die Konditionen, die über das Jahr wirklich zählen.',
    visualChange: 'Das ausgewählte Tagesgeld-Konditionsblatt liegt geprüft neben dem Jahreskalender; Aktionsdauer und Standardzins bestimmen sichtbar die Entscheidung.',
  },
};

const animationBeatsByScene = {
  'scene-02': [
    {startSecond:0,endSecond:1.25,voiceText:'3 Prozent Tagesgeld klingt stark.',visualChange:'Das physische Tagesgeld-Angebot mit großem 3-%-Aktionszins steht sofort als Hauptobjekt im Fokus.'},
    {startSecond:1.25,endSecond:2.85,voiceText:'Aber prüf zuerst, wie lange dieser Zins wirklich gilt.',visualChange:'Eine Papierlasche des Angebots klappt auf und enthüllt die konkrete Drei-Monats-Frist neben einem Kalender.'},
    {startSecond:2.85,endSecond:4.1,voiceText:'Entscheidend ist die Verbindung aus Zinssatz und Laufzeit.',visualChange:'Aktionszins und 3-Monate-Frist bleiben gleichzeitig sichtbar; ein Frist-prüfen-Hinweis schließt die Mechanik ab.'},
  ],
  'scene-04': [
    {startSecond:0,endSecond:1.45,voiceText:'Nach Ablauf der Aktion',visualChange:'Das Tagesgeldkonto steht mit Aktionszins neben der ersten von drei Kalenderseiten.'},
    {startSecond:1.45,endSecond:3.25,voiceText:'läuft die befristete Phase aus.',visualChange:'Drei Kalenderseiten blättern nacheinander ab und die Aktionsphase verschwindet mit dem letzten Monatswechsel.'},
    {startSecond:3.25,endSecond:4.6,voiceText:'Dann gilt häufig der niedrigere Zinssatz für Bestandskunden.',visualChange:'Am selben Konto wird der Aktionszins sichtbar durch das Feld Standardzins ersetzt und stabil gehalten.'},
  ],
  'scene-06': [
    {startSecond:0,endSecond:1.4,voiceText:'3 Prozent p.a. bedeutet 3 Prozent pro Jahr.',visualChange:'Das Tagesgeldkonto mit 3 % p.a. erscheint zunächst ohne Zeitmaß als Ausgangspunkt.'},
    {startSecond:1.4,endSecond:3.3,voiceText:'Die Bezugsgröße ist ein vollständiges Jahr.',visualChange:'Zwölf Monatssegmente bauen sich zu einem vollständigen Jahresring um das Konto auf.'},
    {startSecond:3.3,endSecond:4.8,voiceText:'Drei Monate sind nur ein Teil dieses Jahres.',visualChange:'Nur drei der zwölf Segmente werden hervorgehoben; eine Kalenderseite markiert sichtbar das Vierteljahr.'},
  ],
  'scene-08': [
    {startSecond:0,endSecond:1.8,voiceText:'Beispiel: 10.000 Euro zu 3 Prozent p.a. für drei Monate.',visualChange:'10.000 Euro liegen konstant auf einem Tagesgeldkonto; daneben beginnt Monat eins.'},
    {startSecond:1.8,endSecond:4.6,voiceText:'Über drei Monate entsteht nur der zeitanteilige Zins.',visualChange:'Monat eins, zwei und drei wechseln nacheinander; nach jedem Monatswechsel kommt ein kleiner separater Gold-Zinsstapel hinzu.'},
    {startSecond:4.6,endSecond:6.2,voiceText:'Vereinfacht gerechnet sind das rund 75 Euro, wenn der Betrag konstant bleibt.',visualChange:'Die drei Zinsanteile stehen gesammelt neben dem unveränderten 10.000-Euro-Guthaben; ungefähr 75 Euro wird als Ergebnis gehalten.'},
  ],
  'scene-10': [
    {startSecond:0,endSecond:1.35,voiceText:'Eine große Prozentzahl in der Werbung wirkt attraktiv.',visualChange:'Das große Tagesgeld-Werbeblatt mit 3 % p.a. dominiert zunächst fast allein die Szene.'},
    {startSecond:1.35,endSecond:3.25,voiceText:'Aber die Konditionen müssen über ein ganzes Jahr betrachtet werden.',visualChange:'Das Werbeblatt rückt zur Seite und hinter ihm klappt ein vollständiger Zwölf-Monats-Kalender auf.'},
    {startSecond:3.25,endSecond:4.7,voiceText:'Nur die Aktionsmonate tragen den hohen Startzins; danach zählt der Standardzins.',visualChange:'Die ersten Monate werden als Aktion markiert, die restlichen Monate als Standardzins; der Jahresvergleich bleibt sichtbar.'},
  ],
  'scene-13': [
    {startSecond:0,endSecond:1.45,voiceText:'Zwei Tagesgeldangebote können mit unterschiedlichen Startzahlen werben.',visualChange:'Angebot A liegt wegen des größeren Startzinses sichtbar vor Angebot B.'},
    {startSecond:1.45,endSecond:3.55,voiceText:'Für den Vergleich müssen Aktionsdauer und Anschlusszins sichtbar werden.',visualChange:'Bei beiden Angeboten erscheinen Kalender- beziehungsweise Konditionsfelder für Aktionsdauer und Standardzins.'},
    {startSecond:3.55,endSecond:5.1,voiceText:'Danach vergleichst du vollständige Konditionen statt nur die größte Werbezahl.',visualChange:'Beide Angebotsblätter ordnen sich auf dieselbe Prüfebene; der Fokus wechselt sichtbar von Startzins zu vollständigen Konditionen.'},
  ],
};

const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const iconMap = {
  'scene-03': 'document',
  'scene-08': 'coins',
  'scene-09': 'repeat',
  'scene-10': 'chart-bar',
  'scene-13': 'repeat',
};
for (const scene of index.scenes ?? []) {
  if (iconMap[scene.id]) scene.icon = iconMap[scene.id];
  if (scene.id === 'scene-08') scene.headline = '10.000 €: rund 75 € Zinsen';
  const planned = durationByScene[scene.id];
  if (!planned) throw new Error('Dauer fehlt für ' + scene.id);
  scene.targetSeconds = planned;
  scene.plannedDurationSeconds = planned;
  if (scene.type === 'image') {
    const beat = imageBeatByScene[scene.id];
    if (!beat) throw new Error('Bildbeat fehlt für ' + scene.id);
    scene.visualBeats = [{
      id: scene.id + '-beat-01',
      kind: 'image',
      voiceText: beat.voiceText,
      visualChange: beat.visualChange,
      startSecond: 0,
      endSecond: planned,
    }];
  } else {
    const beats = animationBeatsByScene[scene.id];
    if (!beats) throw new Error('Animationsbeats fehlen für ' + scene.id);
    scene.visualBeats = beats.map((beat, i) => ({
      id: `${scene.id}-beat-${String(i + 1).padStart(2, '0')}`,
      kind: 'animation-phase',
      ...beat,
    }));
  }
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const visualBeatsPath = resolve(root, '05-projektdateien/visual-beats.md');
const beatLines = (index.scenes ?? []).map((scene) => {
  const lines = [`## ${scene.id} — ${scene.headline}`, `Geplante Dauer: ${scene.plannedDurationSeconds.toFixed(1)} s`];
  for (const beat of scene.visualBeats) {
    lines.push(`- ${beat.startSecond.toFixed(2)}–${beat.endSecond.toFixed(2)} s · ${beat.voiceText} → ${beat.visualChange}`);
  }
  return lines.join('\n');
}).join('\n\n');
writeFileSync(visualBeatsPath, `# Visual Beats — Samstag Tagesgeld\n\nVISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2\n\nPlanungsprinzip:\n- Ein gesprochener Gedanke bekommt eine konkrete neue sichtbare Information.\n- Bilder bleiben bei genau einem statischen Beat.\n- Animationen zeigen mehrere echte Zustände; Kamera-Push oder Zoom allein zählt nicht als neuer Beat.\n- Lieber ein zusätzliches gutes Bild als ein überladener oder nach der verstandenen Aussage unnötig lange stehender Still.\n- Die unten stehenden Sekunden sind Phase-1-Planwerte; echte Wort-Timings aus dem finalen Voiceover bestimmen Phase 3.\n\n${beatLines}\n`, 'utf8');

const scene08Md = resolve(root, '03-szenen/EINZELNE-SZENEN/scene-08/szene.md');
if (existsSync(scene08Md)) {
  const source = readFileSync(scene08Md, 'utf8').replace('10.000 € für 3 Monate: grob 75 €', '10.000 €: rund 75 € Zinsen');
  writeFileSync(scene08Md, source, 'utf8');
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) throw new Error('Master-Prompt fehlt');
let master = readFileSync(masterPath, 'utf8');
const masterMarkers = `\n\nFINAL_COLLECTION_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/\nCOVER = SZENE 01\nKEIN separates Cover erzeugen\nKEIN Bild 00 erzeugen\n`;
if (!master.includes('COVER = SZENE 01')) master += masterMarkers;
writeFileSync(masterPath, master, 'utf8');

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (!existsSync(coverPath)) throw new Error('Cover-Alias fehlt');
let cover = readFileSync(coverPath, 'utf8');
const coverMarkers = `\n\nCOVER_HOOK_CONTRACT: ${COVER_HOOK_ID}\nTECHNISCHER COVER-ALIAS — KEIN SEPARATER BILDJOB\nNo separate cover generation.\nno Bild 00.\n`;
if (!cover.includes(COVER_HOOK_ID)) cover += coverMarkers;
writeFileSync(coverPath, cover, 'utf8');

const scene01Path = resolve(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt');
if (!existsSync(scene01Path)) throw new Error('scene-01 Bildprompt fehlt');
let scene01 = readFileSync(scene01Path, 'utf8');
if (!scene01.includes(COVER_HOOK_ID)) {
  scene01 += `\n\nCOVER_HOOK_CONTRACT: ${COVER_HOOK_ID}\n`;
  writeFileSync(scene01Path, scene01, 'utf8');
}

const research = `# Recherche und Quellen – Tagesgeld-Aktionszins\n\nStand: 05.09.2026\n\n## Geprüfte Kernaussagen\n\n- Tagesgeld-Angebote mit besonders hohem Zinssatz richten sich häufig an Neukunden und der höhere Zinssatz ist oft zeitlich begrenzt.\n- Nach Ablauf einer solchen Aktion kann für das bestehende Tagesgeldkonto ein niedrigerer Bestandskunden- beziehungsweise Standardzins gelten.\n- Bei Angebotsvergleichen sollen deshalb nicht nur der beworbene Aktionszins, sondern auch Aktionsdauer und Anschlusskonditionen berücksichtigt werden.\n- Topkonditionen können außerdem an Bedingungen wie Neukundenstatus oder neues Geld geknüpft sein.\n- Das Rechenbeispiel 10.000 € × 3 % p.a. × 3/12 = 75 € ist ausdrücklich eine vereinfachte proportionale Illustration und keine konkrete Bankkondition.\n\n## Quellen\n\n1. Verbraucherzentrale – „Zinsen für Tagesgeld und Festgeld: So finden Sie sicher das beste Angebot“, Stand 20.01.2026\n   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/zinsen-fuer-tagesgeld-und-festgeld-so-finden-sie-sicher-das-beste-angebot-102422\n2. Verbraucherzentrale – „Geldanlage und Inflation: Wie lege ich Geld bei geringen Zinsen an?“, Stand 26.01.2026\n   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/geldanlage-und-inflation-wie-lege-ich-geld-bei-geringen-zinsen-an-11534\n\nKeine konkrete Bankempfehlung. Keine individuelle Finanzberatung.\n`;
writeFileSync(resolve(root, '05-projektdateien/recherche-quellen.md'), research, 'utf8');

console.log('✓ Exakte Source-Contract-Marker ergänzt: deep black background + finaler Bilderordner.');
console.log('✓ Kanonische scene-01 Cover-/Alias-Marker und Cover-Hook V2 erhalten.');
console.log('✓ Alle Szenen verwenden gültige FinanzNeo-Icons; scene-08-Headline gekürzt.');
console.log('✓ Visual-Beat-Plan vollständig: 8 Bildbeats + 18 Animationsphasen = 26 Beats.');
console.log('✓ Kanonische recherche-quellen.md mit geprüften Aussagen befüllt.');
