# FinanzNeo — Verbesserung nach jedem Video

> **Oberste Priorität (Arman, 17.10.2026):** Nach jedem Video wird besser gemacht. Jedes fertige Video bekommt eine Rückschau; jede Erkenntnis wird als Regel, Vorlage oder Prüfung ins System übernommen, damit das nächste Video sie automatisch erfüllt. Fertige Videos werden nicht nachträglich geflickt.

## Ablauf nach jedem Video

1. **Rückschau:** Was war gut, was schwach? (Haltezeiten, Hook, Bildwelt, Animationen, Ton, CTA, Endkarte, Länge, Nutzerfeedback, später echte YouTube-Zahlen)
2. **Ins System übernehmen:** Validator, Vorlage (`youtube:create`), Produktionsstandard oder Pipeline anpassen — nicht nur „merken“.
3. **Hier eintragen:** Video, Erkenntnis, umgesetzte Regel.
4. **Nächstes Video:** Regeln greifen automatisch; neue Erkenntnisse wieder oben anfangen.

## Log

| Datum | Video | Erkenntnis | Umgesetzt als |
|---|---|---|---|
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Teils fotorealistische Flow-Bilder, uneinheitlicher Stil | Nur handgezeichnete Illustration; Batch 1 = Thumbnail als Stilvorlage, `STYLE_REFERENCE` an jedem Bild (Vorlage + Validator) |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Standbilder bis 16 s | Standbild max. 8 s (Skript-Schätzung, Validator), Warnung ab 10 s nach echtem Audio, `akzente[]` als Lösung |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Hook 28 s bis Trick 1 | Hook max. 20 s (Validator) |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Kommentarfrage am Ende nicht eingesprochen | Kommentarfrage Pflicht im mittleren Skriptteil (Validator) |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Abruptes Ende, kein Platz für Endelemente | Automatische 15-s-Endkarte (Zusammenbau) |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Aufnahme in 3 Teilen, Nähte ungeprüft | Teile werden automatisch verbunden, Nahtstellen ausgegeben |
| 2026-10-10 | Nr. 1 Supermarkt-Tricks | Keine Musik | Optionale Hintergrundmusik −24 dB |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Positiv: Bildwelt durchgehend einheitlich (Thumbnail als Stilvorlage wirkt), Hook 15 s, Kommentarfrage Mitte, Endkarte, längstes Standbild 9,2 s statt 15,8 s | Regeln V1 bestätigt |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Animationen auf kühlem Weiß (#FAF8F2) wirkten wie ein Fremdkörper neben den cremefarbenen Flow-Bildern (#F9E9CB) | `DATEN.grund` = Flow-Creme #F9E9CB (alle YouTube-Animationen + Endkarte) |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Animationen zu klein/dünn, Inhalt klebt oben links, Text teils 28 px | Motion-Director-Regeln: Inhalt 70–85 % Breite, mittig, Hero-Zahl ≥ 96 px, Labels ≥ 40 px; `DATEN.minText` 32 |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Flow erfand Zahlen/Überschriften (Shop-Preise 449/479/499 €, „Die Zinsfalle Kreditkarten“) | Textregel in jedem Bildprompt: nur Wörter/Zahlen in Anführungszeichen, nichts erfinden (Vorlage + Plan-Generator) |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Phase-3-Executor (Gemini) benannte versiegelten Code um, weil `youtube:ready` `label:`/`start` in Code als Platzhalter meldete | Platzhalterprüfung für Code nur noch auf echte Vorlagen-Platzhalter ('[GROSS]', TODO); Motion-Director: versiegelten Code nie zum Ruhigstellen eines Checks ändern |
| 2026-10-17 | Nr. 2 0-%-Finanzierung | Haltezeit-Schätzung mit 154 W/min unterschätzte um ~10 % | Gemessen an Video 1+2: 142 W/min inkl. Pausen (real/geschätzt = 1,01); nach Phase 3 prüft der Validator die echten Zeiten (max. 10 s) |
| 2026-10-17 | Wettbewerbsanalyse (simplicissimus, Finanzfluss, Kurzgesagt) | Top-Videos starten mit Geschichte/Figur/Konflikt statt Ankündigung; unsere Hooks sagten „In diesem Video zeige ich dir …“ | V2: Hook-Ankündigung verboten, Hauptfigur (`story.protagonist`) im Hook (Validator) |
| 2026-10-17 | Wettbewerbsanalyse | Bild, Skript und Animation passten „ungefähr“, aber nicht nachweisbar exakt | V2: `keyword` je Bild muss in seinem Sprechabschnitt fallen; `bridgeObject` je Animation muss im Nachbarbild vorkommen (Validator + Motion-Director) |
| 2026-10-17 | Vergleich Video 1 vs. Video 2 | Gleiche Bildfamilie, aber Video 1 uneinheitlicher (Hintergrund #F7ECCF…#F7F0D8, wechselnder Strich und Palette); Video 2 fast überall exakt #F9E9CB — die Videos drifteten untereinander | Kanalweite Stilvorlage `youtube/_kanal/FinanzNeo Stilvorlage.png` an jedem Bild + Thumbnail (Vorlage, Plan-Generator, Validator) |
| 2026-10-17 | Arman | Kein Flow-„Charakter“ nötig | Figur über Referenzbild (`story.figurBild`, `CHARACTER_REFERENCE:`) |
| 2026-10-17 | Arman nach Stiltest | Video 1/2 und der Szenen-Test („über die Schulter“, Eisberg) sind nicht die Bildwelt, die Arman im Kopf hat; gemeint ist ruhig & minimal wie die Bilder vom 7. Oktober | Stilblock „calm & minimal“ (viel Leerraum, Metaphern, kleine Figuren, wenig Text) in Vorlage + Stilreferenz; Szenen-Stilvorlage verworfen, neue Kanal-Stilvorlage aus dem 7.-Oktober-Projekt |
| 2026-10-17 | Arman nach 6 Testbildern | „Ruhig & minimal“ wurde als „leer“ umgesetzt — Bilder zu leer | Klarstellung: Zeichenstil fest (7.-Oktober-Look), Bildaufbau frei und szenengerecht (voll oder reduziert); Stilblock getrennt in STYLE (fest) und COMPOSITION (frei) |
