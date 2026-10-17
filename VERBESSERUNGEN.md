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
