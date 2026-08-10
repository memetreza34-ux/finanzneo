# FinanzNeo — verbindliches Bildsystem

> Bei Widerspruch gilt `CLAUDE.md`.

## Bildwelt

- World ID: `finanzneo-connected-studio-v3`
- Premium fintech editorial 3D
- eine dominante Finanzmetapher / Hero-Objekt
- optional stilisierte erwachsene Person; Gesicht klar sichtbar
- deep charcoal green-black
- emerald/mint Akzente
- Gold für Geld/Wert
- Rot-Orange für Verlust/Risiko/Schulden
- smooth rounded geometry, soft bevelled edges
- kein Fotorealismus, Pixar oder Clay

## Hintergrund

Jedes 9:16-Nutzerbild verwendet genau einen nahtlosen Hintergrund von oben bis unten.

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions.
No visible top/bottom sections.
No separate zones or panels.
No bands.
No floor-wall boundary.
No horizon line.
Do not create a visible floor, wall or studio horizon.
Leave natural empty space by reducing content, not by changing the background.
```

Keine Prozent-Zonen.

## Personen

Wenn eine Person vorkommt:

- Gesicht klar sichtbar
- Augen/Nase/Mund erkennbar
- frontal oder natürliche 3/4-Ansicht
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

## Text im KI-Bild

Erlaubt: explizit vorgegebene kurze deutsche Objektlabels, normalerweise 1–3 Wörter.

Verboten: Headline, Untertitel, erklärender Satz, CTA, zufällige Zusatztexte.

## Marken

Reale Marken/Dienste sind erlaubt, wenn sie für die konkrete Aussage relevant sind, korrekt geschrieben werden und keine Partnerschaft suggeriert wird.

## Google-Flow-Komposition

- vertical 9:16
- Hauptmotiv groß und smartphone-lesbar
- wenige große Hauptelemente
- klare Ursache-Wirkung
- natürliche freie Hintergrundfläche oberhalb/unterhalb
- keine Dioramen, Dashboards, Game-Level, Neon-Tunnel oder Sci-Fi-Korridore

## Darstellung in Remotion — adaptive-safe-fill

Die alte `object-fit: contain`-Standarddarstellung ist verboten.

Verbindlich:

- Nutzerbild füllt die verfügbare Visual-Fläche maximal
- kein kleines Poster/Inlay innerhalb des Hochkant-Reels
- kein sichtbarer rechteckiger Bildrand
- keine unscharfe Kopie des Bildes als Hintergrund
- leere nahtlose Hintergrundfläche zuerst croppen
- Gesicht, Objektlabels, Hero-Objekt und Geld/Wert schützen
- pro Szene `focalX`/`focalY` nutzen
- keine alte 1.04-Scale-Grenze
- keine alten 0.20/0.34-Crop-Grenzen

Verbindliche Komponente für neue produktive Bildszenen:

```text
src/design-system/AdaptiveSafeFillImage.tsx
```

Richt-Visualbereich bei 1080×1920:

```text
Y ≈ 210–1515
```

Das Bild soll nahezu den kompletten Raum zwischen Headline und Caption nutzen.

## Timing und Untertitel

- Szenenwechsel an echten Satzanfängen des finalen Audios
- Wortmarkierung ausschließlich über echte `start/end`-Zeitstempel
- keine gleichmäßig geschätzten Wortzeiten
- bevorzugt ein vollständiger Satz sichtbar
- maximal zwei sehr kurze Sätze
- hart maximal zwei Zeilen
- Satzwechsel beim ersten Wort des nächsten Satzes
- kurze Pausen ohne Caption-Lücke

## Pflichtinhalt eines Bildprompts

1. finaler Google-Flow-Dateiname
2. erlaubte kurze deutsche Labels
3. dominante Metapher / Hero-Objekt
4. sichtbare Ursache-Wirkung
5. Premium-Fintech-Editorial-3D-Stil
6. nahtlose Hintergrundregel
7. Personenregel, falls nötig
8. Negativregeln

## Sofort neu erzeugen

- zwei sichtbare Hintergründe/Bänder
- horizontale Trennlinie
- Floor-Wall-Grenze/Horizont
- gesichtslose/abgewandte Person
- falsche/zusätzliche Labels
- große KI-Headline/Satz
- Diorama/Game-Level
- Aussage passt nicht zum Voiceover

## Render-QA

Neu framen/reparieren, wenn im Reel:

- das Nutzerbild klein wie ein Poster wirkt
- unnötig große leere Flächen zwischen Headline, Motiv und Caption entstehen
- Gesicht/Label/Hero-Objekt abgeschnitten ist
- Bildrand sichtbar wird
- Caption in Plattform-UI gerät
