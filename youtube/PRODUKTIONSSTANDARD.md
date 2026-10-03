# FinanzNeo — YouTube-Longform-Produktionsstandard V4

> Aktiver Standard für neue FinanzNeo-YouTube-Videos. Bei Konflikten gilt zusätzlich `CLAUDE.md`. Neue Reels sind pausiert; YouTube Shorts sind verboten.

## Format

- eigenständiges YouTube-Longform-Video
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema
- Hook ohne langes Intro
- einfache Sprache für Finanzanfänger
- Daten, Annahmen und Rechenwege prüfbar

## Grundprinzip

`FORM FREI — BILDWELT FEST — WERKZEUG PASSEND`

Für jeden Sprechbeat werden zuerst Aussage und gewünschte Zuschauerwirkung bestimmt. Danach wird entschieden, ob ein statisches Flow-Bild, ein Simple-Explainer-Bild, Remotion-Motion oder eine Kombination die klarste Lösung ist.

Nicht jeder Beat braucht komplexes 3D. Ein simples Visual darf simpel bleiben. Gleichzeitig darf ein einfaches Visual niemals automatisch zu Dashboard, Tile-System oder künstlichem 3D-Panel werden.

---

# 1. Werkzeugwahl — verbindlich

## Google Flow kann zwei Arten statischer Visuals erzeugen

### A) Grounded Scene

Für reale, sofort erkennbare Situationen und Gegenstände:

- Kreditkarte + Abrechnung
- Rechnung / Beleg / Vertrag / Kalender
- reale Haushalts- oder Konsumobjekte
- sichtbare physische Ursache/Wirkung
- dokumentarisch-editoriale Objektmetaphern

### B) Simple Explainer

Für reduzierte statische Erklärungen, wenn sie schneller verständlich sind:

- große Zahl
- einzelnes Symbol
- einfacher Chart oder Diagramm
- Vergleich
- Zielscheibe / Weg / Berg / Zielmetapher
- Asset-Gruppe
- Concept Cluster
- kurze Aussage / Quote
- einfache UI-/Settings-Erklärung, wenn genau dieser Zustand der Inhalt ist

**Wichtig:** Simple Explainer ist weiterhin FinanzNeo. Er darf klarer, frontaler und reduzierter sein, muss aber dieselbe Farb-, Licht-, Qualitäts- und Markenlogik behalten.

## Remotion / SVG / React verwenden

Code-basierte Visuals sind besonders sinnvoll, wenn echte Bewegung oder Frame-genaue Präzision zentral ist:

- animierte Rechenaufteilung
- dynamische Charts / Datenverläufe
- sequenzielle Checklisten
- Timelines
- UI-Zustandswechsel
- frame-genaue Typografie
- komplexe Vergleiche mit mehreren Zuständen

Ein statisches Zahlen-/Symbol-/Chartbild darf trotzdem Flow sein, wenn Flow die klarere Still-Image-Lösung ist. Es wird nicht mehr allein wegen seiner Einfachheit aus Flow ausgeschlossen.

## Hybrid

Hybrid nur, wenn ein Flow-Quellbild einen echten visuellen Vorteil bietet und Remotion danach eine sinnvolle Veränderung darauf ausführt.

---

# 2. FinanzNeo-Bildwelt

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-v9-front-readable-v2`

Source Visual Language:

`finanzneo-stylized-3d-animated-black-v9`

Primärer genehmigter Stilanker:

`finanzneo-premium-physical-editorial-v8`

Grounding-Referenz:

`finanzneo-youtube-grounded-3d-black-v1`

Kanonische Datei:

`config/finanzneo-image-worlds/finanzneo-youtube-v9-front-readable-v2.txt`

## Immer gleich

- erwachsene hochwertige stylized-3D-/Editorial-Qualität
- tiefer nahtloser Schwarz-/Charcoal-Green-Hintergrund
- Emerald = positiv / Lösung / Wachstum
- warmes Rot-Orange = Risiko / Kosten / Schuld
- Ivory / Soft Gray = neutral
- Gold nur sparsam für Geld/Wert
- sauberes Premium-Studiolicht
- gute Hierarchie und sofortige Verständlichkeit
- niemals Fotorealismus
- niemals childish clay / toy / Pixar
- niemals generische Gold-Luxus-Finanz-KI

## Mode A — Grounded Scene

- reale Objekte, glaubwürdige Proportionen
- ein klares Hauptmotiv
- medium-close Editorial-Framing
- natürliche Perspektive
- sinnvolle Tiefe und Überlappung
- weiche Kontaktschatten
- lokale Umgebung darf in die dunkle Welt auslaufen

Nicht erzwingen:
- künstliche dicke Plaketten für Zahlen/Text
- sterile Produktaufnahme
- Mini-Diorama
- kleines Objekt in riesiger schwarzer Leere

## Mode B — Simple Explainer

- frontal oder nahezu frontal
- große nutzbare Bildfläche
- klare visuelle Hierarchie
- polierte 2.5D-/Editorial-Tiefenwirkung erlaubt
- Zahl/Symbol/Chart darf selbst das Hauptvisual sein
- keine Pflicht, aus abstrakten Informationen physische Gegenstände zu bauen

Nicht erzwingen:
- Tiles
- Cards
- Panels
- Blocks
- Pedestals
- Floating Widgets

## Charts / Diagramme / Daten

- gerade Frontansicht
- keine schrägen Achsen
- keine 3/4-Chart-Perspektive
- mathematisch korrekte Werte und Proportionen
- kein Excel-/PowerPoint-Default-Look
- keine dekorativen Fantasy-3D-Balken

## UI / Settings

- nur wenn der UI-Zustand selbst der Inhalt ist
- fiktiv/unbranded
- gerade und lesbar
- kein Screenshot-Realismus
- kein dickes schwebendes Control-Panel nur deshalb, weil die Welt 3D ist

---

# 3. Globaler Bild-Hard-Fail

Sofort verwerfen und denselben Job neu generieren bei:

- Hauptinformation zu klein
- überwiegend leerer schwarzer Frame
- kleine schwebende Tiles/Karten/Module
- Dashboard-/Control-Panel-/HUD-Look ohne Inhaltsgrund
- künstliche dicke Plaketten/Blöcke für Werte oder Text
- sterile Produktaufnahme
- winzige isometrische/Diorama-Perspektive
- Canva-/PowerPoint-/Stock-Vector-Look
- generische Finance-Icon-Collage
- abstrakte Finanzmaschine ohne verständliche Aussage
- Trophy-/Plinth-/Gold-Luxury-Staging
- Fotorealismus
- childish clay/toy/Pixar
- unnötiger visueller Komplexität
- Bild versteht man erst nach langem Lesen

FinanzNeo soll an konsistenter Farbwelt, Rendering, Licht, Hierarchie und Erklärqualität erkennbar sein — nicht daran, dass alles zwanghaft ein dickes 3D-Objekt ist.

---

# 4. Prompt-Struktur

Der Nutzer kopiert **genau eine einzige Datei vollständig und 1:1** in Google Flow:

`04-visuals/alle-bildprompts.txt`

Diese Datei ist immer der vollständige ausführbare Master-Prompt.

Sie darf niemals ersetzt werden durch:

- Redirect
- Hinweistext
- Platzhalter
- „nicht mehr hier arbeiten“-Datei
- Verweis auf einen anderen Master-Prompt

Interne Promptquellen liegen gesammelt unter:

`04-visuals/01-BILDPROMPTS/`

Dort dürfen Bildwelt, Thumbnail-Prompt und einzelne interne Bildpromptquellen liegen. Der Nutzer kopiert diese Dateien nicht einzeln.

---

# 5. Google Flow — Ausführung

`FLOW_EXECUTION_MODE: finanzneo-youtube-cover3-image5-parallel-v4`

Der Master-Prompt muss ausdrücklich verlangen:

- Bilder tatsächlich generieren
- nicht nur Prompts erklären oder zurückgeben
- jeden Job QA-prüfen
- bei FAIL nur denselben Bildjob wiederholen

## Phase A — Cover

1. Exakt drei Kandidaten A/B/C als drei getrennte Ein-Bild-Jobs gleichzeitig starten.
2. Alle verwenden dieselbe FinanzNeo-Bildwelt.
3. Unterschiedliche Kompositionen sind erwünscht.
4. Kurzer deutscher Hook, maximal 2 Zeilen, ideal 2–5 Wörter.
5. Alle drei QA-prüfen.
6. Danach genau einmal A/B/C vom Nutzer wählen lassen.
7. Nur den Gewinner final übernehmen.
8. Der Gewinner wird niemals Style-Referenz für Szenenbilder.

## Phase B — Szenenbilder

- bis zu fünf getrennte Ein-Bild-Jobs parallel
- niemals ein Multi-Image-Request
- jedes Ergebnis sofort exakt umbenennen
- jedes Ergebnis sofort QA-prüfen
- bei Fehler nur dieselbe Bildnummer neu generieren
- nächster Batch erst, wenn der aktuelle Batch vollständig PASS ist
- keine weitere Nutzerfreigabe zwischen Batches
- finaler Inventory-QA

---

# 6. Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

- mindestens zwei echte Motion-/Animationsvisuals pro Projekt
- keine starre Obergrenze oder Quote
- Viewer Change zuerst, Technik danach
- produktionsreife `animation.tsx` bereits in Phase 1
- Custom React, SVG, CSS 3D, Canvas, Three.js/R3F und Datenvisualisierung erlaubt
- bestehende Komponenten sind Werkzeuge, keine Stilpflicht
- Variation muss in echter Kamera/Layout/Transformation bestehen, nicht nur in neuen Namen
- Motion nutzt dieselbe FinanzNeo-Farb-/Typografie-/Premium-Logik

Ein normales YouTube-Projekt darf keine reine Slideshow sein.

---

# 7. Kamera und Präzision

Bei präzisen Charts, Daten, UI und Typografie:

- gerade Achsen
- korrekte Skalen
- mathematisch korrekte Werte
- lesbare Labels
- keine Perspektivverzerrung, wenn Genauigkeit darunter leidet

Grounded Scenes dürfen eine sanfte 3/4-Editorial-Kamera verwenden. Simple Explainer bleiben standardmäßig frontal oder nahezu frontal.

---

# 8. Audio und Timing

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel
- Schnitte folgen Sprache, Visual Beats und Kapiteln
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ca. -16 LUFS, True Peak max. -1 dBTP

---

# 9. Publishing

`05-publishing/` enthält Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords/Tags, Hashtags, Thumbnail-Brief, Quellen/Disclaimer, Pinned Comment, Community-Post, Upload-Checkliste und Social-Promo-Texte.

---

# 10. Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf gibt Phase 3 frei.
