# FinanzNeo V5.1 Dynamic Staging – Praxistest V1

## Zweck

Dieser Test prüft die neue V5.1-Staging-Schicht an einem anderen Finanzthema als dem bisherigen Gehalts-/Lifestyle-Test.

**Thema:** Was passiert, wenn Waschmaschine und Auto gleichzeitig kaputtgehen – und du keinen Notgroschen hast?

Der Test soll zeigen, ob FinanzNeo jetzt sichtbar weniger nach schwarzem Studio, Katalog-Anordnung oder sauber nebeneinander gelegten Erklärgegenständen aussieht und stattdessen mehr echte Handlung, räumlichen Druck und Ursache→Wirkung erzeugt.

## Unverändert

- Bildwelt: `finanzneo-stylized-3d-animated-black-v9`
- 1:1-Quellbilder
- clearly stylized 3D, nie photorealistisch
- Deep Black bleibt die verbindende Welt
- Emerald Green = positiv / geschützt
- Warm Red-Orange = Kosten / Druck / Verlust
- Strict Single Job in Google Flow
- keine Animation, kein Voiceover, keine Captions, kein Publishing

## Neu im Test

V5.1 verlangt pro Bild zusätzlich bewusste Entscheidungen für:

- Frame Occupancy
- Dynamic Staging
- Cause/Effect Strength
- Human Reaction
- Spatial Pressure
- Impact Composition

Die Bilder dürfen nicht als kleine Objektgruppe in viel leerem Schwarz enden. Reale lokale Umgebungen dürfen mehr Frame-Fläche tragen, müssen aber an den Rändern organisch in die FinanzNeo-Deep-Black-Welt übergehen.

## Google Flow

Für den Test nur diese Datei verwenden:

`alle-bildprompts.txt`

Den kompletten Inhalt **einmal** in Google Flow einfügen.

Trotz eines einzigen Masterprompts gilt strikt:

1. Bild 01 erzeugen.
2. Ergebnis vollständig abwarten.
3. Bild 01 visuell prüfen.
4. Bei Fehler nur Bild 01 regenerieren.
5. Bei PASS exakt umbenennen.
6. Erst dann Bild 02 erzeugen.
7. Bis Bild 08 genauso fortfahren.

Keine Batch-Generierung, keine Collage, kein Kontaktbogen, kein paralleles Queueing.

## Die 8 Bilder

| # | Rolle | Kerninszenierung |
|---|---|---|
| 01 | Hook | Defekte Waschmaschine: Wasser drängt in den Vordergrund, Person reagiert sofort |
| 02 | Eskalation | Auto in echter Werkstatt: Reparaturkosten dominieren den Raum, Besitzer unter Druck |
| 03 | Konsequenz | POV: zwei Reparaturforderungen überdecken und verdrängen die kleine verfügbare Rücklage |
| 04 | Peak | Letztes Geld wird aus einem fast leeren Notfall-Umschlag gezogen, beide Reparaturen beanspruchen es gleichzeitig |
| 05 | Kontrast | Zwei reale Lebenssituationen: ohne Reserve vs. mit Notgroschen – sichtbar andere Reaktion |
| 06 | Lösung | Notgroschen wird aktiv für eine echte Reparatur verwendet, nicht als statischer grüner Ordner gezeigt |
| 07 | Verhalten | POV: direkt nach Geldeingang wandert Geld zuerst in den Notgroschen; Freizeit bleibt zurück |
| 08 | Payoff | Breite Wohnszene: Problem gelöst, Reserve wird wieder aufgebaut, Person sichtbar erleichtert |

## Erwartete Verbesserung gegenüber V5

Der Test gilt visuell nur dann als Fortschritt, wenn:

- kein Bild wie ein isoliertes Produkt-/Studio-Showcase wirkt,
- die Hauptaktion einen großen Teil des Frames sinnvoll nutzt,
- Cause/Effect in mindestens sechs der acht Bilder sofort sichtbar ist,
- Menschen/Hände tatsächlich reagieren und nicht neutral posieren,
- mindestens mehrere Bilder mit starkem Vordergrund, POV, Low-Angle oder Environment-Wide arbeiten,
- reale Orte erkennbar sind, ohne die V9-Deep-Black-Welt zu verlieren,
- relevante Objekte handeln/kollidieren/verdrängen/blockieren statt nur ordentlich nebeneinander zu liegen,
- die acht Bilder als Sequenz klar verschieden wirken.

## Ausgabedateien

1. `Bild 01 - Waschmaschine faellt aus.png`
2. `Bild 02 - Auto wird teuer.png`
3. `Bild 03 - Zwei Kosten eine Ruecklage.png`
4. `Bild 04 - Notgroschen fehlt.png`
5. `Bild 05 - Mit oder ohne Reserve.png`
6. `Bild 06 - Notgroschen faengt Reparatur ab.png`
7. `Bild 07 - Ruecklage zuerst.png`
8. `Bild 08 - Ruecklage wird neu aufgebaut.png`

Nach der Generierung werden die acht Ergebnisse gegen `evaluation-scorecard.md` und die neue V5.1-Vision-QA bewertet.
