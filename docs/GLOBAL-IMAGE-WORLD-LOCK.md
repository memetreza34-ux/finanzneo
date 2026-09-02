# Globaler FinanzNeo Image-World-Lock

Für neue Reel-Quellbilder gilt ein globaler, maschinenlesbarer Bildwelt-Lock. Die Zielwelt ist bewusst **nicht realistisch** und **nicht produktfotoartig**.

## Kanonische Bildwelt

- Basiswelt: `finanzneo-connected-studio-v3`
- Same-World-Lock: `finanzneo-same-world-v1`
- Aktueller Bildwelt-Lock: `finanzneo-stylized-3d-animated-black-v9`
- Lock-Datei: `config/finanzneo-image-world-lock.json`
- Weltdefinition: `config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt`

## Format

Alle Google-Flow-Quellbilder sind strikt `1:1`, einschließlich `Bild 00`. Das finale Reel bleibt `9:16`; die vertikale Komposition entsteht erst in Remotion.

## Stylized 3D Animated Black V9

- klar nicht realistisch / nicht photorealistisch
- soft rounded shapes
- vereinfachte, erkennbare Details
- clean materials
- premium, freundlich und leicht verspielt
- Inhalt und Verständlichkeit vor Deko
- gleiche Welt über die Serie, freie Komposition je Szene

## Schwarzer Flow-Hintergrund ist Pflicht

Jedes Flow-Bild braucht einen **nahtlosen tiefschwarzen Hintergrund**:

- clean und minimal
- keine helle Studiowelt
- keine Boden-Wand-Grenze
- kein Horizont
- keine farbigen Hintergrundzonen

## Keine feste Objektanzahl

Es gibt **keine Mindest- oder Höchstzahl** für Support-Objekte.

- ein Hauptobjekt kann reichen
- mehrere Objekte sind erlaubt, wenn sie die Aussage verbessern
- keine Props nur zum Auffüllen
- Klarheit und Inhalt entscheiden

## Marken und Logos

Wenn Marke, Bank, App oder Logo relevant ist:

- Kernidentität erkennbar halten
- aber als vereinfachtes stylized-3D-Element derselben Welt darstellen
- rounded Formen, passendes Material und Licht
- kein flach aufgeklebtes echtes Logo
- kein Website-/App-Screenshot
- keine photorealistische Marken-UI oder Produktdarstellung

## Farb- und Lichtlogik

- Emerald Green = positiv / bevorzugt
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

Licht: clean soft studio lighting, klare Highlights, lesbare Schatten, gute Trennung vom Schwarz und weiche Kontaktschatten.

## Text im KI-Bild

- keine Headline
- kein Untertitel
- kein erklärender Satz
- kein CTA
- nur ausdrücklich verlangte kurze deutsche Labels

## Streng verboten

- Realismus / Photorealismus
- echter Produktfoto-Look
- flach aufgeklebte echte Logos / Screenshot-Marken-UI
- Dashboard / App UI
- Flowchart als Hauptkomposition
- kleine Kästen, floating Info-Cards oder dichte technische Layouts
- Microchip-/Circuit-Board-Look
- Miniatur-Diorama
- unnötiger Clutter

## Prompt-Länge

Einzelprompts bleiben **mittel-lang**:

1. konkrete Bildidee
2. kurzer V9-Style-Block
3. schwarzer Hintergrund
4. erlaubte Labels
5. kurze Forbidden-Liste

Die Bildidee darf nicht unter einem riesigen Regelblock verschwinden.

## Qualitätsregel

Neu erzeugen, wenn:

- Bild realistisch/produktfotoartig aussieht
- Hintergrund nicht tiefschwarz ist
- Aussage nicht in ca. 1–2 Sekunden verständlich ist
- unnötiger Clutter entsteht
- Szene wie Dashboard/UI/Flowchart wirkt
- Marke wie aufgeklebt oder screenshotartig aussieht
- Bild sichtbar aus der V9-Welt fällt

## Google Flow: Strict Single Job

Autonom bedeutet **nicht Batch**.

1. maximal ein laufender Bildjob
2. nur aktueller Bildblock
3. auf vollständige Rückgabe warten
4. sofort exakt umbenennen
5. QA für dieses Bild
6. erst danach nächsten Bildblock freischalten
7. Fehler: nur dieselbe Bildnummer neu
8. keine Nutzer-Zwischenfreigabe / kein `Weiter?`

Verboten: parallele Generierung, Queueing späterer Bilder, späteres Sammel-Umbenennen, Kontaktbogen/Galerie/Collage als Ersatz für Einzelbilder.

Ablaufvertrag: `finanzneo-flow-strict-single-job-v3`.

## Wichtig: Flow-Schwarz vs. Remotion-Schwarz

Beides ist schwarz, aber technisch getrennt:

- **Flow-Bild:** V9-Prompt verlangt deep black im 1:1-Quellbild.
- **Remotion-Reel:** der zentrale Canvas ist unabhängig davon statisch `#000000` und darf keine Partikel/Aurora/Grid/Glow-Hintergründe hinzufügen.

Die Remotion-Regel wird durch `npm run validate:reel-background` geprüft.

## Prüfung

```bash
npm run validate:image-world
npm run validate:reel-background
npm run reel:validate -- <Reel-Pfad>
```

Neue Reels werden über `npm run reel:create` erstellt und erben V9 automatisch.
