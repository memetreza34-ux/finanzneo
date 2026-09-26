# Visual Direction — Variante B

IMAGE_WORLD: `finanzneo-youtube-grounded-3d-black-v1` — unverändert, exakt wie letztes gutes Video.
LAYOUT: `finanzneo-youtube-framed-scene-v1` — unverändert.
MODE: `hybrid` — Animation erlaubt, aber nicht erzwungen.

## Priorität

1. Zuschauer versteht den Gedanken in 1–2 Sekunden.
2. Starke konkrete Storybilder bleiben statisch, wenn Bewegung nichts verbessert.
3. Bewegung wird für Geldfluss, Wachstum, Vergleich, Aufteilung, Wiederholung und Zeit benutzt.
4. Menschen nur für Aufmerksamkeit, Entscheidung oder Konsequenz.

## Projektgrenzen

- 18 Szenen
- exakt 4 Szenen mit Menschen: 01, 11, 12, 18
- 6 Flow-Bilder: 01, 05, 08, 11, 12, 18
- 12 Remotion-Motion-Szenen: 02, 03, 04, 06, 07, 09, 10, 13, 14, 15, 16, 17
- keine Novelty-Quote: dieselbe klare Motion darf wiederverwendet werden, wenn sie inhaltlich passt

## Abstraktionsregel

Abstraktion ist nur erlaubt, wenn der Zuschauer sofort erkennt, was sie bedeutet. Unklare rote Blöcke, symbolische Wege oder frei erfundene Metaphern ohne konkreten Anker werden verworfen. Bei Zahlen lieber Text/Chart; bei Alltag lieber konkrete 3D-Szene.

## Motion-Regel

START → CHANGE → RESULT → HOLD.

Keine Animation nur als Dekoration. Keine zufälligen Partikel, keine hektischen Kamerafahrten, keine dauernden Zooms. Frame-getrieben, deterministisch, mit `useCurrentFrame()` plus `interpolate()` oder `spring()`.

## Cover

Finales Thumbnail muss immer den exakten Text enthalten:
`MEHR GEHALT, TROTZDEM KNAPP?`

Flow liefert die Bildbasis; die finale Schrift darf im Layout gesetzt werden, damit sie garantiert korrekt ist.
