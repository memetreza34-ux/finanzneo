# Produktionsablauf V21

1. Google Flow mit `03-szenen/alle-bildprompts.txt` ausführen.
2. Cover als 9:16, Bilder 01/04/07/10 strikt als 1:1 erzeugen.
3. Fünf Bilder in `03-szenen/00-ALLE-BILDER-HIER-REIN/` legen.
4. Genau ein finales Voiceover in `02-audio/` legen.
5. Echte Wortzeiten aus finalem Audio erzeugen; `timingStatus=final-audio-aligned`.
6. Finale 10-Szenen-Timeline aus echten Satz-/Sprachgrenzen erstellen.
7. `node scripts/validate-25-euro-sparrate-v21.mjs`
8. `node scripts/sync-25-euro-sparrate-assets.mjs`
9. Voiceover nach `public/reels/25-euro-mehr-sparrate/voiceover.<ext>` synchronisieren.
10. `node scripts/prepare-25-euro-sparrate-runtime.mjs`
11. Typecheck + Preview der Composition `Sparrate25Storyboard`.
12. Finalrender der Composition `Sparrate25`.
13. Vollständige MP4-, Audio-, Bildformat- und Caption-QA.

Kein finaler Renderstatus ohne reale Medien und reale Timings.