# Produktionsablauf

1. Mit `03-szenen/alle-bildprompts.txt` exakt fünf Bilder in Google Flow erzeugen.
2. Cover-Typografie prüfen; bei Fehlern Cover neu generieren.
3. Alle fünf Bilder in `03-szenen/00-ALLE-BILDER-HIER-REIN/` ablegen.
4. Genau ein finales Voiceover aus `01-script/voiceover.txt` in `02-audio/` ablegen.
5. Assets synchronisieren: `node scripts/sync-kreditkarte-teilzahlung-assets.mjs`.
6. Aus finalem Audio echte Wortzeitstempel erstellen; keine gleichmäßigen Schätzzeiten.
7. Caption-Einheiten max. 12 Wörter / 68 Zeichen / 2 Zeilen erzeugen.
8. Szenenschnitte an gesprochenen Satz-/Gedankenstarts auflösen und `timeline.json` auf `final-audio-aligned` setzen.
9. `node scripts/prepare-kreditkarte-teilzahlung-runtime.mjs` ausführen.
10. Quality Contract im Finalmodus prüfen.
11. Storyboard/Preview vollständig ansehen.
12. Finalrender erstellen.
13. MP4 vollständig ansehen, semantische Bild-QA, Caption-QA, Audio etwa -16 LUFS und True Peak <= -1 dBTP prüfen.
14. Erst danach `final-qa.json` auf passed setzen und Post-Render-QA ausführen.

Kein Publishing und kein Merge ohne ausdrückliche Freigabe.
