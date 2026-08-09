# Produktionsplan – Notgroschen in drei Stufen

## Format
- 1080 × 1920
- 30 fps
- Ziel: ca. 60 Sekunden
- 10 Szenen
- 6 Bildszenen + 4 Remotion-Animationen
- keine Musik
- keine SFX
- Satzwechsel bestimmen die Szenenschnitte nach finalem Voiceover

## Szenenübersicht

| Szene | Typ | Inhalt | Bilddatei / Animation |
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

## Google-Flow-Bildproduktion

Google Flow arbeitet ausschließlich Bild für Bild:

`PROMPT → 1 BILD → SOFORT UMBENENNEN → PRÜFEN → NÄCHSTES BILD`

Animationsszenen erzeugen kein Bild und ihre Nummer bleibt reserviert.

Nach Abschluss aller Bilder kommen die bereits richtig benannten Bilder gemeinsam nach:

`00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Keine Verteilung durch Google Flow auf einzelne Szenenordner.

## Remotion

Die produktive Composition ist bereits als `NotgroschenStufenplan` vorgesehen.

Implementierte Animationen im Source-Code:
- `TargetRangeAnimation`
- `ThreeStageAnimation`
- `ExampleTargetAnimation`
- `SavingsTimelineAnimation`

Source:
`src/reels/notgroschen/NotgroschenStufenplan.tsx`

## Untertitel
- immer genau ein vollständiger Satz
- aktuelles gesprochenes Wort FinanzNeo-grün
- Rest weiß
- maximal zwei Zeilen
- keine Wort-Skalierung oder Sprünge
- echte Zeitstempel erst aus finalem Voiceover

## Noch tatsächlich auszuführen
1. Bildwelt-Referenz erzeugen.
2. Cover und sechs Bildszenen in Google Flow einzeln erzeugen und jeweils sofort umbenennen.
3. Alle fertigen Bilder am Ende gemeinsam in den Sammelordner legen.
4. Finales Voiceover erzeugen/aufnehmen und in den Audioordner legen.
5. Echte Wort-Zeitstempel aus genau diesem Audio erzeugen.
6. Assets synchronisieren.
7. TypeScript/Validatoren ausführen.
8. Preview rendern und vollständig prüfen.
9. Kontaktbogen prüfen.
10. Finales MP4 rendern und Audio-Lautheit messen.

Ohne diese Ausführung darf das Reel nicht als final gerendert oder visuell freigegeben bezeichnet werden.
