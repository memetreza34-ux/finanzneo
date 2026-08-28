# Globaler FinanzNeo Image-World-Lock

Für neue Reel-Quellbilder gilt ein globaler, maschinenlesbarer Bildwelt-Lock.
Die Zielwelt ist jetzt bewusst **nicht realistisch** und **nicht produktfotoartig**.

## Kanonische Bildwelt

- Basiswelt: `finanzneo-connected-studio-v3`
- Same-World-Lock: `finanzneo-same-world-v1`
- Aktueller Bildwelt-Lock: `finanzneo-stylized-3d-animated-black-v9`
- Lock-Datei: `config/finanzneo-image-world-lock.json`
- Weltdefinition: `config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt`

## Format

Alle Google-Flow-Quellbilder für Reels sind strikt `1:1`, einschließlich `Bild 00`.
Das finale Reel bleibt `9:16`; die vertikale Komposition entsteht erst in Remotion.

## Stylized 3D Animated Black V9

Die Bilder sollen wie hochwertige 3D-Animationsfilm-Frames wirken:

- klar nicht realistisch / nicht photorealistisch
- soft rounded shapes
- vereinfachte, gut erkennbare Details
- clean materials
- premium, freundlich und leicht verspielt
- Inhalt und Verständlichkeit vor Deko
- gleiche Welt über die Serie, aber freie Komposition je Szene

## Schwarzer Hintergrund ist Pflicht

Jedes Flow-Bild braucht einen **nahtlosen tiefschwarzen Hintergrund**.

- clean und minimal
- keine helle Studiowelt
- keine Boden-Wand-Grenze
- kein Horizont
- keine farbigen Hintergrundzonen

## Keine feste Objektanzahl

Es gibt **keine Mindest- oder Höchstzahl** für Support-Objekte.

- 1 Hauptobjekt kann reichen
- mehrere Objekte sind erlaubt, wenn sie die Aussage wirklich verbessern
- keine Props nur zum Auffüllen
- Klarheit und Inhalt entscheiden

## Farb- und Lichtlogik

- Emerald Green = positiv / bevorzugt
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

Licht: clean soft studio lighting, klare Highlights, lesbare Schatten, gute Trennung vom schwarzen Hintergrund und weiche Kontaktschatten.

## Text im KI-Bild

- keine Headline
- kein Untertitel
- kein erklärender Satz
- kein CTA
- nur ausdrücklich verlangte kurze deutsche Labels

## Streng verboten

- Realismus / Photorealismus
- echter Produktfoto-Look
- Dashboard / App UI
- Flowchart als Hauptkomposition
- kleine Kästen, floating Info-Cards oder dichte technische Layouts
- Microchip-/Circuit-Board-Look
- Miniatur-Diorama
- unnötiger Clutter

## Prompt-Länge

Einzelprompts bleiben **mittel-lang**.

Reihenfolge:
1. konkrete Bildidee
2. kurzer V9-Style-Block
3. schwarzer Hintergrund
4. erlaubte Labels
5. kurze Forbidden-Liste

Die Bildidee darf nicht unter einem riesigen Regelblock verschwinden.

## Qualitätsregel

Ein Bild wird verworfen und neu erzeugt, wenn:

- es realistisch oder wie ein Produktfoto aussieht
- der Hintergrund nicht tiefschwarz ist
- die Aussage nicht innerhalb ungefähr 1–2 Sekunden verständlich ist
- unnötiger Clutter entsteht
- die Szene wie Dashboard/UI/Flowchart wirkt
- sie sichtbar aus der V9-Animationswelt fällt

## Google Flow: Strict Single-Job State Machine

Autonom bedeutet **nicht Batch**.

Für jedes Bildset gilt zwingend:
1. Maximal ein laufender Bildgenerierungsjob (`concurrency = 1`).
2. Nur der aktuelle Bildblock ist ausführbar.
3. Auf die vollständige Rückgabe warten.
4. Datei sofort exakt umbenennen.
5. QA ausschließlich für dieses Bild.
6. Erst danach nächsten Bildblock freischalten.
7. Bei Fehler nur dieselbe Bildnummer neu erzeugen.
8. Keine Nutzer-Zwischenfreigabe und kein `Weiter?`.

Hart verboten:
- mehrere Bilder in einem Generierungsaufruf
- parallele Generierung
- Queueing späterer Bilder
- alle Bilder zuerst erzeugen und später gesammelt umbenennen
- Kontaktbogen, Galerie, Collage oder Multi-Panel als Ersatz für Einzelbilder

Der Ablaufvertrag heißt `finanzneo-flow-strict-single-job-v3`.

## Prüfung

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
```

Neue Reels werden über `npm run reel:create` erstellt. Dieser Wrapper wendet automatisch **Stylized 3D Animated Black V9** an.
