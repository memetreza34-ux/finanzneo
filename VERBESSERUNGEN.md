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
