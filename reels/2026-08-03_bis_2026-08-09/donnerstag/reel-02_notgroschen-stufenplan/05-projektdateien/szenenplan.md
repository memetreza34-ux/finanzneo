# Produktionsplan – Notgroschen in drei Stufen

## Format
- 1080 × 1920
- 30 fps
- Ziel: ca. 60 Sekunden
- 10 Szenen
- 6 Bildszenen + 4 Remotion-Animationen
- keine Musik
- keine SFX
- Szenenschnitte folgen dem finalen Voiceover

## Szenenübersicht

| Szene | Typ | Inhalt | Datei / Animation |
|---|---|---|---|
| Cover | Bild | Waschmaschine, Reparatur, Schutz vor Schulden | `Bild 00 - Cover Notgroschen.png` |
| 01 | Bild | Defekt wird ohne Puffer zur Schuldenfalle | `Bild 01 - Defekt wird Schuldenfalle.png` |
| 02 | Bild | Notgroschen fängt den finanziellen Schock ab | `Bild 02 - Notgroschen faengt Schock ab.png` |
| 03 | Animation | 2–3 Monatsgehälter als Daumenregel + individuelle Anpassung | `TargetRangeAnimation` |
| 04 | Bild | erster erreichbarer Mini-Puffer | `Bild 04 - Erster 500 Euro Puffer.png` |
| 05 | Animation | 500 € → 1 Monat notwendige Ausgaben → persönliches Ziel | `ThreeStageAnimation` |
| 06 | Bild | echter Notfall gegen normalen Konsum unterscheiden | `Bild 06 - Echter Notfall oder Konsum.png` |
| 07 | Animation | Beispielrechnung bei 1.800 € netto | `ExampleTargetAnimation` |
| 08 | Animation | 150 € monatlich bis 500 € / 3.600 € | `SavingsTimelineAnimation` |
| 09 | Bild | getrennt, aber kurzfristig erreichbar | `Bild 09 - Puffer getrennt erreichbar.png` |
| 10 | Bild | nach Nutzung wieder auffüllen | `Bild 10 - Notgroschen wieder auffuellen.png` |

## Google Flow

Google Flow arbeitet immer so:

`PROMPT LESEN → GENAU 1 BILD ERZEUGEN → SOFORT UMBENENNEN → PRÜFEN → NÄCHSTES BILD`

Animationsszenen erzeugen kein Bild. Ihre Nummer bleibt reserviert.

Erst wenn alle benötigten Bilder fertig und korrekt benannt sind, kommen sie gemeinsam nach:

`03-szenen/00-ALLE-BILDER-HIER-REIN/`

Google Flow verteilt die Bilder nicht selbst auf einzelne Szenenordner.

## Remotion

Produktive Composition: `NotgroschenStufenplan`

Animationen:
- `TargetRangeAnimation`
- `ThreeStageAnimation`
- `ExampleTargetAnimation`
- `SavingsTimelineAnimation`

Source: `src/reels/notgroschen/NotgroschenStufenplan.tsx`

## Noch auszuführen
1. Bildwelt-Referenz erzeugen.
2. Cover und Bildszenen in Google Flow einzeln erzeugen und sofort umbenennen.
3. Alle fertigen Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/` legen.
4. Voiceover aus `01-script/script-fliess-text.txt` erzeugen und in `02-audio/` legen.
5. Echte Wort-Zeitstempel erzeugen.
6. Bilder technisch einsortieren/synchronisieren.
7. Validator und Typecheck ausführen.
8. Preview rendern und prüfen.
9. Finales MP4 rendern und Audio messen.
