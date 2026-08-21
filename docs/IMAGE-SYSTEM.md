# FinanzNeo — verbindliches Bildsystem

Dieses Dokument definiert das Bildsystem für neue FinanzNeo-Reels. Bei Widerspruch gilt `CLAUDE.md`.

Verbindlicher Stilanker:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- World ID: `finanzneo-connected-studio-v3`
- Series Lock ID: `finanzneo-same-world-v1`

## Ziel

Jedes Bild erklärt genau eine Aussage durch eine klare visuelle Handlung:

```text
Ausgangspunkt → sichtbare Veränderung → verständliches Ergebnis
```

## Visueller Stil

- Premium fintech editorial 3D render style
- eine dominante Finanzmetapher / ein großes Hauptobjekt
- optional eine stilisierte erwachsene 3D-Person mit klar sichtbarem Gesicht
- deep charcoal green-black Grundwelt
- vivid emerald/mint Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Schulden
- smooth rounded geometry, soft bevelled edges
- starkes kontrolliertes Rim Light
- nicht fotorealistisch, kein Pixar/Clay

Diese Merkmale bleiben über den gesamten Bildsatz unverändert. Der Google-Flow-Agent darf Hintergrundmaterial, Lichtsignatur, Geometriesprache, Materialfinish oder Farbrollen zwischen Bildern nicht neu interpretieren.

Das freigegebene Cover `Bild 00` ist die visuelle Stilreferenz für die Serie. Es ist keine Inhaltsvorlage: Motiv, Komposition und Labels werden nicht in Folgebilder übernommen.

## Hintergrund — verbindlich nahtlos

**Keine Prozent-Zonen verwenden.**

Das gesamte 9:16-Bild verwendet genau **einen nahtlosen Hintergrund** von oben bis unten.

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions, no top/bottom sections, no bands, no floor-wall boundary, no horizon line, no panels.
Use only one subtle continuous gradient/vignette.
Do not create a visible floor, wall or studio horizon.
Objects may cast soft contact shadows.
Place the subject near the visual center and leave generous natural empty space above and below without changing the background.
```

## Person

Wenn eine Person vorkommt:

- Gesicht klar sichtbar
- Augen, Nase und Mund erkennbar
- frontal oder natürliche 3/4-Ansicht bevorzugt
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

## Text im KI-Bild

Erlaubt:

- nur explizit vorgegebene kurze deutsche Objektlabels
- normalerweise 1–3 Wörter
- direkt am passenden Objekt

Verboten:

- Headline
- Untertitel
- ganzer Satz
- CTA
- zufällige Zusatztexte
- Fantasiewörter

## Marken

Reale Marken/Dienste dürfen verwendet werden, wenn sie für die konkrete Erklärung relevant sind. Namen korrekt schreiben; keine erfundene Partnerschaft/Empfehlung suggerieren.

## Komposition

- vertical 9:16
- Hauptmotiv groß und smartphone-lesbar
- wenige große Hauptelemente
- ein klarer Ursache-Wirkungs-Zusammenhang
- großzügige natürliche freie Fläche oberhalb/unterhalb des Motivs
- keine harte Zonenaufteilung
- keine Miniatur-Dioramen, Dashboards oder Game-Level

## Darstellung in Remotion

- `object-fit: contain`
- keine sichtbare unscharfe Kopie desselben Bildes als Hintergrund
- Source-Crop oben höchstens `0.20`
- Source-Crop unten höchstens `0.20`
- Source-Crop insgesamt höchstens `0.34`
- zusätzliche Skalierung höchstens `1.04`
- Motive und Labels nie abschneiden

## Timing

Szenenwechsel folgen Satzanfängen aus dem finalen Audio. Gleich lange Szenen sind kein Standard.

## Pflichtinhalt eines Bildprompts

Jeder Prompt enthält:

1. finalen Google-Flow-Dateinamen
2. konkrete erlaubte deutsche Labels
3. eine dominante Metapher / ein Hauptobjekt
4. sichtbare Ursache-Wirkung
5. Premium-Fintech-Editorial-3D-Stil
6. seamless-background-Regel
7. Personenregel, falls eine Person vorkommt
8. Negativregeln

## Sofort neu erzeugen

- zwei sichtbare Hintergründe/Bänder
- horizontale Trennlinie
- Boden-/Wand-Grenze oder Horizont
- gesichtslose/abgewandte Person
- Diorama/Game-Level
- falsche/zusätzliche Labels
- große Headline oder Satz
- Aussage passt nicht zum Voiceover
