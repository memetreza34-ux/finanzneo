#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = 'reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

index.version = Math.max(Number(index.version ?? 0) + 1, 29);
index.rebuild = {
  mode: 'in-place-existing-reel',
  reelPath: target,
  newReelCreationForbidden: true,
  preserveExistingSceneIds: true,
  preserveScriptMeaning: true,
  preserveImageSceneNumbers: true,
  canonicalAnimationSourcesRebuilt: true,
  rebuiltOn: '2026-08-29',
};

const updates = {
  'scene-01': {
    mainIdea: 'Eine konkrete Haushaltspanne mit kaputter Waschmaschine und Nachzahlung setzt das normale Girokonto sichtbar unter Druck.',
    expectedVisual: 'A believable stylized-3D household laundry situation: broken washing machine, repair invoice and utility Nachzahlung visibly pressure a normal Girokonto; coherent real-life scene on seamless deep black, no icon arrangement or UI.',
  },
  'scene-02': {
    mainIdea: 'Eine reale Reparaturrechnung wird sichtbar aus dem griffbereiten Notgroschen bezahlt, während das Girokonto unangetastet bleibt.',
    animationIntent: 'Kaputte Waschmaschine → Reparaturrechnung fällt in die Szene → Geld verlässt den Notgroschen → Rechnung wird BEZAHLT → Girokonto bleibt geschützt.',
  },
  'scene-03': {
    mainIdea: 'Urlaub, Shopping und neues Handy bleiben als freiwillige Wünsche sichtbar vom Notgroschen getrennt.',
    expectedVisual: 'A coherent stylized-3D household finance scene: separate Notgroschen reserve on one side; suitcase, shopping bag and new phone grouped as optional wants on the other side with one restrained stop cue; no floating icon grid.',
  },
  'scene-04': {
    mainIdea: 'Der Notgroschen fängt eine offene Rechnung physisch ab, bevor sie das knappe Girokonto in den Dispo drückt.',
    animationIntent: 'Offene Rechnung nähert sich Girokonto/Dispo → Notgroschen fährt in den Zahlungsweg → Geld erreicht die Rechnung → DISPO verschwindet → Girokonto ist geschützt.',
  },
  'scene-05': {
    mainIdea: 'Zwei bis drei Monatsnettoeinkommen werden als reale, getrennt zurückgelegte Reserve nachvollziehbar.',
    expectedVisual: 'A believable stylized-3D household finance desk with salary document and separate Notgroschen reserve containing three clearly separated saved monthly-net-income portions labeled Monatsnetto 1–3; physical money/document context, not abstract blocks.',
  },
  'scene-06': {
    mainIdea: 'Miete, Fixkosten und Mobilität erhöhen nacheinander sichtbar die individuell benötigte Reserve.',
    animationIntent: 'Miete → Fixkosten → Mobilität kommen als reale Rechnungen hinzu → Reservebehälter und Zielgeld wachsen nach jeder Verpflichtung → DEIN ZIEL bleibt stabil sichtbar.',
  },
  'scene-07': {
    mainIdea: 'Der Notgroschen ist separat geschützt und zugleich über normale Bankzugänge schnell erreichbar.',
    expectedVisual: 'A stylized-3D household banking setup with separate Notgroschen reserve, generic account document/card and phone as access object; protected but immediately reachable, no detailed app UI, vault-only metaphor or dashboard.',
  },
  'scene-08': {
    mainIdea: 'Tagesgeld wird als separates, sicheres und kurzfristig erreichbares Konto für den Notgroschen gezeigt.',
    expectedVisual: 'A coherent stylized-3D banking desk with separate Tagesgeld account/document holding the Notgroschen beside normal everyday banking objects; safe and accessible physical account situation, no app screen or abstract bank icon.',
  },
  'scene-09': {
    mainIdea: 'Drei Monatswechsel bringen jeweils eine eigene Einzahlung in die Reserve und bauen den ersten Puffer sichtbar auf.',
    animationIntent: 'Januar + 50 € → Einzahlung in Reserve; Februar + 50 € → zweite Einzahlung; März + 50 € → dritte Einzahlung → ERSTER PUFFER ist erreicht.',
  },
  'scene-10': {
    mainIdea: 'Direkt nach dem Gehalt wird ein fester Betrag automatisch als Reserve zurückgelegt.',
    expectedVisual: 'A stylized-3D salary day desk scene with payslip/calendar context and a clearly separated portion of real money already routed into the Notgroschen reserve immediately after salary arrival; no banking UI or flowchart.',
  },
  'scene-11': {
    mainIdea: 'Gehalt landet auf dem Girokonto; ein sichtbarer Anteil wird auf Tagesgeld getrennt, während Alltagskosten beim Giro bleiben.',
    animationIntent: 'Gehalt fällt aufs Girokonto → ein eigener Geldanteil trennt sich und wandert zum Tagesgeld → Miete/Einkauf treffen nur das Girokonto → Tagesgeld bleibt SEPARAT.',
  },
  'scene-12': {
    mainIdea: 'Nach einer echten Entnahme wird der teilweise geleerte Notgroschen wieder systematisch aufgefüllt.',
    expectedVisual: 'A believable stylized-3D emergency reserve after use: partly emptied Notgroschen container beside a paid emergency bill, with new money visibly being added back into the reserve; coherent household context, no generic repeat icon as the main explanation.',
  },
  'scene-13': {
    mainIdea: 'Eine reale unerwartete Rechnung bleibt unangenehm, wird mit vorhandener Rücklage aber ohne neue Schulden bezahlt.',
    expectedVisual: 'A stylized-3D household bill beside an existing Notgroschen reserve and a normal account; the bill is still visibly costly but can be paid without overdraft/credit, shown through concrete objects rather than a debt pit or shield metaphor.',
  },
  'scene-14': {
    mainIdea: 'Eine Haushaltspanne baut Zeitdruck auf; die Reserve bezahlt die Rechnung, stoppt den Countdown und öffnet Entscheidungsraum.',
    animationIntent: 'Kaputte Waschmaschine + offene Rechnung + Countdown → Geld verlässt Notgroschen → Rechnung wird bezahlt → Countdown stoppt → Zeit und ruhige Entscheidungsoptionen erscheinen.',
  },
  'scene-15': {
    mainIdea: 'Die drei Regeln werden an einer konkreten Notgroschen-Situation gezeigt: sicher, erreichbar und nur für notwendige Überraschungen.',
    expectedVisual: 'A coherent stylized-3D final household finance scene centered on a separate Notgroschen account/reserve with ordinary bank-access objects and one genuine unexpected bill; labels Sicher, Verfügbar and Nur für Notfälle attach to real objects, not three abstract symbols.',
  },
};

for (const scene of index.scenes ?? []) {
  Object.assign(scene, updates[scene.id] ?? {});
}

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const premiumBlock = `\n## Verbindlicher Rebuild-Vertrag\nPremium Visual Lock: finanzneo-premium-physical-animation-v2\nVisual Target World: finanzneo-stylized-3d-animated-black-v9\n\n- Dieses ist das BESTEHENDE Reel; keinen neuen Reel-Ordner anlegen.\n- Die vorhandene animation.tsx ist die kanonische Phase-1-Codequelle.\n- Reale Gegenstände + physische Ursache/Wirkung tragen die Szene.\n- Keine Kartenreihe, kein Fortschrittsbalken und keine reine Texttafel als Ersatz.\n- Mehrere koordinierte Motion-Channels.\n- Ergebnis mindestens 15 Frames stabil.\n- Phase 3 darf die Animation weder ersetzen noch vereinfachen.\n`;

const remotion = {
  'scene-02': `# Dafür ist der Notgroschen da\n\nVoiceover: Ein Notgroschen ist Geld, das nur für echte, unerwartete Ausgaben griffbereit bleibt.\n\nMECHANIC_ID: emergency-reserve-pays-real-bill\n\nSTART: Kaputte Waschmaschine + normale Alltagssituation + offene Reparaturrechnung.\nMECHANISMUS: Geld verlässt den Notgroschen und bewegt sich sichtbar zur Reparaturrechnung; Reservestand sinkt kontrolliert.\nERGEBNIS: Rechnung = BEZAHLT, Girokonto = unangetastet/geschützt.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
  'scene-04': `# Der Puffer stoppt Schulden\n\nVoiceover: Kommt plötzlich eine Rechnung, nutzt du zuerst den Puffer statt Dispo oder Konsumkredit.\n\nMECHANIC_ID: buffer-intercepts-before-overdraft\n\nSTART: Offene Rechnung bewegt sich auf knappes Girokonto und roten DISPO zu.\nMECHANISMUS: Notgroschen fährt dazwischen; Geld verlässt die Reserve und bezahlt die Rechnung vor dem Konto.\nERGEBNIS: Rechnung bezahlt, DISPO verschwindet, Girokonto geschützt.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
  'scene-06': `# Die richtige Höhe ist individuell\n\nVoiceover: Die passende Höhe hängt trotzdem von deinen Ausgaben, Verpflichtungen und deiner Lebenssituation ab.\n\nMECHANIC_ID: obligations-raise-reserve-target\n\nSTART: Kleiner Notgroschen, noch keine sichtbaren Verpflichtungen.\nMECHANISMUS: Miete, Fixkosten und Mobilität kommen nacheinander als reale Rechnungen hinzu; Reserve und Zielgeld wachsen nach jedem Schritt.\nERGEBNIS: Höhere individuelle Reserve + DEIN ZIEL.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
  'scene-09': `# Starte mit einem ersten Puffer\n\nVoiceover: Baue zuerst einen kleinen Puffer auf und vergrößere ihn danach Schritt für Schritt.\n\nMECHANIC_ID: monthly-deposits-fill-reserve\n\nSTART: Fast leerer Notgroschen + Januar + erste 50-Euro-Einzahlung.\nMECHANISMUS: Januar, Februar, März; pro Monat bewegt sich ein eigener Geldstapel in die Reserve und erhöht den Füllstand.\nERGEBNIS: ERSTER PUFFER erreicht.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
  'scene-11': `# Trenne Puffer und Alltag\n\nVoiceover: Auf einem separaten Konto bleibt der Notgroschen sichtbar getrennt von deinem täglichen Budget.\n\nMECHANIC_ID: salary-splits-into-separate-reserve\n\nSTART: Girokonto + Tagesgeld getrennt; Gehalt kommt zuerst aufs Girokonto.\nMECHANISMUS: Ein Teil des Gehalts löst sich und wandert aufs Tagesgeld; danach treffen Miete und Einkauf nur das Girokonto.\nERGEBNIS: Tagesgeld/Notgroschen bleibt SEPARAT und geschützt.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
  'scene-14': `# Der Puffer kauft dir Zeit\n\nVoiceover: Der Notgroschen gibt dir Zeit für eine ruhige Entscheidung statt finanzieller Panik.\n\nMECHANIC_ID: reserve-stops-countdown-and-opens-options\n\nSTART: Kaputte Waschmaschine + offene Rechnung + laufender roter Countdown.\nMECHANISMUS: Geld verlässt den Notgroschen, bezahlt die Rechnung und stoppt den Countdown.\nERGEBNIS: Zeit-/Entscheidungsraum öffnet sich; Reparieren, Preise vergleichen und Ersatz planen werden erst danach sichtbar.\n\nKanonische Quelle: animation.tsx\n${premiumBlock}`,
};

for (const [id, content] of Object.entries(remotion)) {
  writeFileSync(resolve(root, `03-szenen/EINZELNE-SZENEN/${id}/remotion.md`), content.endsWith('\n') ? content : `${content}\n`);
}

const scenePlan = `# Szenenplan — Notgroschen richtig aufbauen — IN-PLACE REBUILD\n\nDieses Dokument beschreibt den Neuaufbau des BESTEHENDEN Reels. Der Pfad, die 15 Szenen-IDs, das Skript und die Nummerierung bleiben erhalten. Kein neues Reel erzeugen.\n\n01 | image | 4.5 s | Unerwartet wird schnell teuer | kaputte Waschmaschine + Reparatur + Nachzahlung setzen Girokonto real sichtbar unter Druck\n02 | animation | 5.0 s | Dafür ist der Notgroschen da | Waschmaschine → Rechnung → Geld aus Notgroschen → BEZAHLT → Girokonto geschützt\n03 | image | 4.0 s | Das ist kein Notfall | Notgroschen räumlich getrennt von Urlaub, Shopping und neuem Handy\n04 | animation | 5.0 s | Der Puffer stoppt Schulden | Rechnung Richtung Giro/Dispo → Puffer fängt ab → bezahlt → Dispo verschwindet\n05 | image | 5.0 s | Wie groß sollte er sein? | reale Gehalts-/Reserve-Situation zeigt zwei bis drei Monatsnettos\n06 | animation | 5.0 s | Die richtige Höhe ist individuell | Miete + Fixkosten + Mobilität → Reserve-Ziel wächst sichtbar\n07 | image | 4.0 s | Das Geld muss verfügbar bleiben | separates geschütztes Guthaben + normale schnelle Bankzugänge\n08 | image | 4.0 s | Tagesgeld passt dafür gut | reales separates Tagesgeldkonto für Notgroschen, sicher und erreichbar\n09 | animation | 5.0 s | Starte mit einem ersten Puffer | Januar/Februar/März + je 50 € → Reserve füllt sich stufenweise\n10 | image | 4.0 s | Automatisiere deinen Aufbau | Gehaltstag + fester Betrag wird direkt in Reserve zurückgelegt\n11 | animation | 5.0 s | Trenne Puffer und Alltag | Gehalt aufs Giro → Anteil aufs Tagesgeld → Alltagsrechnungen bleiben beim Giro\n12 | image | 4.0 s | Nach Nutzung wieder auffüllen | echte Entnahme + teilweise leere Reserve + neue Einzahlungen füllen sie wieder\n13 | image | 4.0 s | Eine Rechnung bleibt eine Rechnung | reale Rechnung wird mit vorhandener Rücklage bezahlt, ohne neue Schulden\n14 | animation | 5.0 s | Der Puffer kauft dir Zeit | Waschmaschine + Rechnung + Countdown → Reserve bezahlt → Countdown stoppt → Entscheidungsspielraum\n15 | image | 4.0 s | Drei Regeln zum Merken | konkrete Reserve zeigt: sicher, schnell verfügbar, nur für notwendige Überraschungen\n\nLayout bleibt zentral: Header Y154 / 56 px / max. 2 Zeilen; Icon erster Textzeile zugeordnet; Visual Y320–1400; Caption bottom340.\n`;
writeFileSync(resolve(root, '05-projektdateien/szenenplan.md'), scenePlan);

const antigravity = `# Antigravity — Phase 3 — bestehendes Reel neu aufbauen\n\nProjekt: ${target}\n\n## IN-PLACE-LOCK\n\nDieses Reel existiert bereits und wurde in Phase 1 neu aufgebaut.\n\n- KEIN neues Reel anlegen.\n- KEINEN zweiten Reel-Ordner erzeugen.\n- KEINE neuen scene-IDs erzeugen.\n- Genau diesen bestehenden Pfad weiterverwenden.\n- Skript/Aussagen und Reihenfolge der 15 Szenen bleiben erhalten.\n- Die aktuellen Dateien unter 03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx sind die einzige kanonische Animationsquelle.\n- Alte Shield-/Karten-/Balken-Ersatzanimationen dürfen nicht rekonstruiert werden.\n\nVor Phase 3 muss reel:ready erfolgreich sein. Verwende ausschließlich finale Nutzerbilder aus 03-szenen/00-ALLE-BILDER-HIER-REIN/ und exakt die versiegelten Phase-1-animation.tsx. Keine Ersatzanimation. Header Y154, Visual Y320–1400, Caption bottom340. Schwarzer Hintergrund, Header oder Caption allein zählen niemals als Szenenvisual. Fehlt Bild, Audio, Timing, Binding oder Hash: hart abbrechen statt Fallback.\n\n## Verbindliche Endkette\n\n1. Bestehende Composition dieses Reels vollständig implementieren/aktualisieren.\n2. Candidate ausschließlich über reel:render erzeugen.\n3. Render-QA vollständig ausführen und PASS verlangen.\n4. Erst nach PASS final exportieren:\n\nnpm run reel:export -- ${target} <exakte-geprüfte-mp4>\n\n5. Phase 3 ist erst abgeschlossen, wenn 06-export/ vollständig aufgebaut wurde.\n\n## Pflichtinhalt von 06-export\n\n- reel-02_notgroschen-richtig-aufbauen.mp4\n- caption-universal.txt\n- caption-instagram.txt\n- caption-tiktok.txt\n- caption-facebook.txt\n- caption-snapchat.txt\n- untertitel.srt\n- Cover-Datei\n- bilder.zip\n- UPLOAD.md\n\nDie fertige MP4 darf niemals durch eine Candidate-Datei, einen Platzhalter oder eine ungeprüfte Renderdatei ersetzt werden.\n`;
writeFileSync(resolve(root, '05-projektdateien/ANTIGRAVITY-AUFTRAG.md'), antigravity);

const animationOverviewPath = resolve(root, '05-projektdateien/animationen.md');
let overview = readFileSync(animationOverviewPath, 'utf8');
const rebuildMarker = '## IN-PLACE REBUILD 2026-08-29';
if (!overview.includes(rebuildMarker)) {
  overview += `\n${rebuildMarker}\n\nDas bestehende Reel wurde am selben Pfad neu aufgebaut. Alle sechs kanonischen animation.tsx wurden überschrieben; es existiert kein zweites Reel. Scene-index, Remotion-Spezifikationen und Phase-3-Auftrag verweisen auf diese neuen Dateien.\n`;
  writeFileSync(animationOverviewPath, overview.endsWith('\n') ? overview : `${overview}\n`);
}

console.log('✓ Bestehendes Notgroschen-Reel in-place synchronisiert.');
console.log('✓ Kein neues Reel erzeugt; 15 bestehende Szenen bleiben erhalten.');
