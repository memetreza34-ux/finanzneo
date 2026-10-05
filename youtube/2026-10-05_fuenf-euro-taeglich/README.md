# Was dich 5 € am Tag wirklich kosten

Eigenständiges FinanzNeo-YouTube-Longform-Projekt nach V4 + Layoutstandard V1. Ziel: ungefähr 2 Minuten, 1920×1080, 30 fps.

## Wichtig für den Nutzer

Die Ordner `01-recherche` bis `06-projektdateien` sind interne Produktionsordner für Skript, Bilder, Animationen, Audio und QA.

**Nach Fertigstellung musst du nur noch `07-export/` öffnen.** Dort liegen das fertige Video, das Cover, Titel, YouTube-Beschreibung und das komplette Skript mit Zeitstempeln.

## Formatmix

- 8 Visual Beats
- 2 Google-Flow-Szenenbilder: visual-01, visual-06
- 6 Remotion-/Data-Animationen: visual-02, visual-03, visual-04, visual-05, visual-07, visual-08
- keine Slideshow
- keine starre Bild-/Animationsquote
- Flow nur für konkrete reale Szenen, wenn Flow wirklich die beste Darstellung ist
- Rechenwege, Zeitakkumulation, Listen und Schlussmechanik ausschließlich in Remotion

## Layoutstandard V1

`06-projektdateien/layout.json` ist verbindlich.

- **nie Bild oder Animation als Vollbild**
- jedes Visual sitzt in einem gerahmten Content-Bereich
- über jedem Visual steht eine kurze **Zwischenüberschrift mit passendem Icon**
- **keine eingebrannten Untertitel** im fertigen Video
- Wort-Zeitstempel bleiben für Schnitte, `.srt` und das Zeitstempel-Skript im Export

## Bildprinzip

Jeder Sprechbeat wird einzeln betrachtet. Gleicher Look bedeutet nicht gleiche Szene.

Menschen sind **niemals Pflicht**. Ein passendes Bild darf Menschen, Hände, Gegenstände, Maschinen, Fahrzeuge, Räume, Dokumente, Details oder eine andere verständliche Alltagssituation zeigen. Entscheidend ist nur:

1. passt es exakt zum gesprochenen Beat,
2. gehört es klar zur gleichen FinanzNeo-Bildwelt,
3. ist es keine Wiederholung der letzten guten Bildidee,
4. ist es natürlich und sofort verständlich.

Für visual-01 reicht deshalb bewusst ein enger Kaufmoment mit Händen; kein Gesicht wird erzwungen. Visual-06 darf dagegen eine echte Personenhandlung zeigen, weil die Übergabe dort die Aussage trägt.

## Google Flow

Der Nutzer kopiert nur:

`04-visuals/alle-bildprompts.txt`

Zuerst Thumbnail A/B/C parallel. Nach einmaliger Auswahl folgen nur visual-01 und visual-06 als zwei getrennte Ein-Bild-Jobs.

## Phase 2

Noch erforderlich:
- gewähltes Thumbnail
- zwei finale Flow-Szenenbilder
- genau ein finales Voiceover
- echte Wort-Zeitstempel

Danach darf `youtube:ready` Phase 3 freigeben.

## Finaler Export

Phase 3 schreibt die fertigen Upload-Dateien nach:

`07-export/`

Dort ist die einfache Endstruktur:
- `01-video-und-cover/` → `final-video.mp4` + `cover.png`
- `02-youtube/` → Titel + Beschreibung
- `03-untertitel/` → Zeitstempel-Skript + `.srt` **nur als Exportdateien, nicht ins Bild eingebrannt**

Die Zeitstempel werden erst mit dem finalen Voiceover verbindlich.
