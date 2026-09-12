# FinanzNeo Future Reel Presentation V1

`FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1`

Dieser Standard gilt nur für **neu erzeugte Reels**. Er schützt das tatsächlich sichtbare Zuschauererlebnis und ergänzt Visual Selection V1, Reel Layout V5, Future Production V3 und die bestehenden Phase-3-Gates.

## 1. Feste Reel-Hierarchie

### Szene 01

Szene 01 ist der Cover-Hook:

- Hero-Bild
- exakter Reel-Titel ab Frame 0
- kein normaler `SceneHeader`
- kein Standard-Icon
- keine Captions
- keine zweite Erklärungstext-Schicht

### Ab Szene 02

Jede normale Szene braucht im echten Render:

- oben den FinanzNeo-`SceneHeader`
- ein inhaltlich passendes Icon
- das Hauptvisual in der zentralen Visualzone
- unten echte audio-synchrone `Captions`

Metadaten im `scene-index.json` reichen nicht. Phase 3 prüft, dass `SceneHeader`, `Captions` und `Audio` tatsächlich in der finalen Composition gemountet sind. Die Render-QA prüft zusätzlich sichtbare Pixel in Header- und Caption-Zone.

## 2. Keine kleinen Quadratkarten

Flow-Bilder bleiben als Quelle 1:1. Im fertigen 9:16-Reel dürfen sie aber nicht wie kleine quadratische Karten in viel leerem Schwarz wirken.

Regel:

- Hauptmotiv groß und klar
- Visualzone sinnvoll nutzen
- schwarzer Leerraum nur, wenn er der Komposition dient
- Render-QA misst die reale aktive Visualfläche von Bildszenen
- Mindestwert für neue Presentation-V1-Reels: `activePixelRatio >= 0.10` im visuellen Kern

## 3. Content-first vor Motion-Diversität

Die kreative Herleitung einer Animationsszene wird **nicht** von diesem Diversitätsvalidator erfunden. Sie muss vorher nach `docs/FUTURE-REEL-PHASE1-MOTION-DIRECTION-V1.md` stattfinden.

Verbindliche Reihenfolge:

```text
Sprechpunkt
→ Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ motionDesign
→ animation.tsx
```

Erst nachdem die inhaltlich passende Mechanik gewählt wurde, prüft Presentation V1, ob das Reel sichtbar in unnötige Wiederholungen abrutscht.

Damit gilt ausdrücklich:

- nicht zuerst eine andere Animation suchen, nur um anders auszusehen
- nicht zuerst eine vorhandene Komponente auswählen
- nicht aus einer festen Animationsliste verteilen
- zuerst die beste Erklärung entwickeln
- Wiederverwendung ist erlaubt, wenn sie inhaltlich der beste Fit ist und begründet wurde

## 4. Motion-Diversität

Eine neue `MECHANIC_ID` allein bedeutet **nicht**, dass eine Animation für den Zuschauer neu wirkt.

Jede Animationsszene dokumentiert deshalb:

- `viewerChange`
- `visualMode`
- `visualTechniqueId`
- `compositionFamilyId`
- `heroObjectFamily`
- `primaryAction`
- `motionSignature.camera`
- `motionSignature.layout`
- `motionSignature.transformation`
- `supportTools`
- optional `repetitionJustification`

Die sichtbare Motion-Signatur ist:

```text
camera + layout + transformation
```

Innerhalb der vorherigen vier Animationsszenen darf dieselbe Signatur nicht ohne konkrete inhaltliche Begründung wiederholt werden.

Dieselbe dominierende `heroObjectFamily` darf innerhalb der vorherigen vier Animationsszenen nicht zum dritten Mal Hauptsprache sein, außer ein Vergleich oder eine bewusste Kontinuität verlangt es.

Mehr als zwei identische `compositionFamilyId` direkt hintereinander brauchen ebenfalls eine konkrete Begründung.

## 5. Lottie, Icons und SVG

Lottie, Icons und SVG bleiben ausdrücklich erlaubt.

Sie zählen aber als **Support-Werkzeuge** und nicht automatisch als neue Hauptanimation.

Beispiel:

> Account + Rechnung + Münzen bewegen sich wieder gleich, diesmal mit einer Lupe-Lottie.

Das ist **keine neue Haupttechnik**.

Eine neue Haupttechnik entsteht erst, wenn sich die sichtbare Erklärung wirklich ändert: andere Hauptaktion, anderes Layout, andere Transformation oder andere räumliche/zeitliche Logik.

## 6. Strukturreferenz

Für die Zuschauer-Hierarchie darf folgende bestehende Composition als Referenz gelesen werden:

`src/reels/einlagensicherung-100000/EinlagensicherungReel.tsx`

Dort ist die gewünschte Grundstruktur klar:

```text
Visual
+ SceneHeader / Icon pro normaler Szene
+ globale audio-synchrone Captions
```

Nur diese **Struktur** dient als Referenz. Legacy-Hintergrund, alte Farben oder alte Bildwelt werden nicht übernommen. Neue Reels bleiben im aktuellen V9-/Pure-Black-System.

## 7. Drei harte Prüfzeitpunkte

### Phase 1

`validate-future-reel-phase1-motion-direction-v1.mjs` prüft zuerst die Content-first-Herleitung jeder Animationsszene.

`validate-future-reel-presentation-v1.mjs` blockiert danach fehlende Präsentationsmetadaten und visuell wiederholte Motion-Pläne.

### Phase 3 Preflight

Die finale Composition muss nachweisbar `Audio`, `SceneHeader` und `Captions` rendern. Echte `word-timings.json` müssen vorhanden sein.

### Finaler Candidate

Die Render-QA prüft am echten Video:

- Cover-Titel im oberen Bereich
- keine Caption in Szene 01
- sichtbarer Header ab Szene 02
- sichtbare Caption ab Szene 02
- ausreichend große Bildszenen
- weiterhin Animation-Occupancy, Audio und alle bestehenden QA-Gates

## Kurzregel

> **Ab Szene 02 immer Header + Icon + echte Caption. Hauptvisual groß. Animationen werden zuerst individuell aus dem Inhalt hergeleitet und danach auf sichtbare Wiederholung geprüft. Lottie, Icons und SVG dürfen unterstützen, aber eine Support-Änderung zählt nicht als neue Hauptanimation.**
