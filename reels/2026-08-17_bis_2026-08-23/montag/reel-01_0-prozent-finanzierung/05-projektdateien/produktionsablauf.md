# Produktionsablauf

1. Google Flow mit `03-szenen/alle-bildprompts.txt` starten.
2. Flow muss Bild 00 → 01 → 04 → 07 → 10 automatisch ohne Nutzerbestätigung durchlaufen.
3. Alle fünf finalen Dateien nach `03-szenen/00-ALLE-BILDER-HIER-REIN/` legen.
4. Genau ein finales Voiceover nach `02-audio/` legen.
5. Bilder semantisch und auf 1:1/9:16 prüfen.
6. Asset-Sync ausführen.
7. Echte Wortzeiten aus finalem Audio erzeugen; niemals mathematisch schätzen.
8. Finale Szenenstarts/-dauern aus Audio ableiten.
9. TypeScript + Reel-Validator ausführen.
10. Preview rendern und vollständig visuell prüfen.
11. Fehler korrigieren.
12. Finale MP4 rendern + Audio/MP4-QA.
13. `final-qa.json` nur nach echten Checks auf passed setzen.

Status bis Bilder + Audio vorliegen: BLOCKED.
