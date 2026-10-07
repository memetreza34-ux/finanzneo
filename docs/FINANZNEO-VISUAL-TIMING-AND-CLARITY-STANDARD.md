# FinanzNeo — Visual Timing & Style Standard V9

## Zweck

Dieses Dokument regelt nur Timing und die visuelle V9-Identität. Es schreibt **keine globale Bildidee, Motivlogik oder Promptstruktur** mehr vor.

## Verhältnis Bild / Animation

- Ziel ungefähr **60 % Google-Flow-Bildbeats / 40 % native Remotion-Animationsbeats**.
- Qualität steht über der Quote.
- Szenenanzahl wird aus Voiceover-Länge und Aussage abgeleitet.
- Ein Visual wird nie künstlich verlängert, nur um eine Quote oder feste Szenenzahl zu erfüllen.

## Timing

### Bildbeats

- ideal: **3,5–5,5 Sekunden**
- absolutes Maximum: **6,0 Sekunden**
- längere unveränderte Holds vermeiden

### Animationsbeats

- ideal: **4,5–7,0 Sekunden**
- Animation braucht sichtbare Entwicklung über die Zeit

## Verbindliche Bildwelt

```text
FINANZNEO_IMAGE_WORLD: finanzneo-editorial-finance-v1
```

Für statische Bilder gelten:
- einfache Editorial-Finanzillustration
- 2D / leichtes 2.5D bevorzugt
- einfaches 3D optional
- flexible Hintergründe
- ein Gedanke = eine klare Bildidee
- progressive Referenzfolgen erlaubt


## Kreative Bildprompt-Regeln

Maßgeblich ist `docs/FINANZNEO-IMAGE-WORLD.md`.

Die Bildidee soll auf den ersten Blick verständlich sein. Flow darf Metaphern, Diagramme, Timelines, Dokumente, Unternehmen/Marken, Vergleiche, Zahlenvisuals und einfache Szenen erzeugen. Es gibt keinen Schwarz-, 3D-, Alltags- oder Finanzobjekt-Zwang.

Bei progressiven Bildfolgen wird das freigegebene vorherige Bild als echte Referenz angehängt und nur eine kleine geplante Änderung vorgenommen.


## Animationen

Native Remotion-Animationen folgen `finanzneo-editorial-motion-v1`:

- Animation ist die bewegte Version der Editorial-Finance-Bildwelt
- 2D / leichtes 2.5D bevorzugt
- matte, einfache Formen und wenige große Elemente
- `EditorialMotionStage` darf innerhalb der Visualzone eine helle oder gedämpfte Fläche erzeugen
- der äußere Reel-Canvas bleibt technisch unverändert
- eine klare Hauptbewegung kann vollständig reichen
- Kamera standardmäßig still
- keine Partikel, Aurora, Grid, Hologramme oder dekorative Background-Bewegung
- keine alten Physical-Primitives als neue Default-Sprache
- Bewegung erklärt die Aussage; Background-Motion zählt niemals als Erkläranimation

## QA vor Freigabe

1. Ist die Editorial-Finance-Bildidee sofort verständlich?
2. Ist der gewählte Hintergrund für das konkrete Motiv sinnvoll?
3. Bleibt der Bildbeat innerhalb der Timing-Grenzen?
4. Zeigt jede Animation echte sichtbare Entwicklung?
5. Bleibt der Remotion-Hintergrund statisch schwarz?

Die inhaltliche Bildidee wird nicht mehr durch eine globale Promptformel validiert.
