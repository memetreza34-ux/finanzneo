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

Für jeden Sprechbeat wird zuerst bestimmt, was der Zuschauer sehen und verstehen soll. Danach wird das Werkzeug gewählt. Google Flow rendert hochwertige Szenen/Illustrationen. Remotion/SVG/React übernimmt präzise Daten-, Text-, Checklisten-, Timeline- und UI-Grafiken.

**Wichtig:** Google Flow ist kein Infografik-Generator. Ein Beat darf nicht nur deshalb zu Flow werden, weil er statisch ist.

---

# 1. Werkzeugwahl — verbindlich

## Google Flow: nur gerenderte Szenen und 3D-Illustrationen

### A) Grounded Scene

Für reale, sofort erkennbare Situationen und Gegenstände:

- Kreditkarte + Abrechnung
- Rechnung / Beleg / Vertrag / Kalender
- reale Haushalts- oder Konsumobjekte
- sichtbare physische Ursache/Wirkung
- dokumentarisch-editoriale Objektgeschichten

### B) Editorial 3D Illustration

Für eine einzelne zusammenhängende gerenderte Illustration/Metapher, wenn keine reale Szene nötig ist:

- ein klarer physischer Weg / eine Schranke / eine Waage
- ein einzelnes Objekt, das sichtbar seinen Zustand verändert
- eine bildfüllende stilisierte 3D-Metapher mit sofort verständlicher Aussage

Auch hier gilt: **eine Szene, kein Layout aus Informationsmodulen.**

## Nicht mit Google Flow als finales Erklärbild erzeugen

Wenn der Kern des Beats hauptsächlich aus präzisen Informationen besteht, gehört er in Remotion/SVG/React:

- exakte Zahlenaufteilung
- Chart oder Datenverlauf
- Checkliste
- Timeline
- Tabelle
- mehrere Textzeilen
- UI-/Settings-Zustand
- mathematisch exakter Vergleich

Flow darf bei einem Hybrid nur eine **textarme Szenen-/Illustrations-Basis** erzeugen. Präzise Zahlen, Labels, UI-Zustände und Daten legt Remotion darüber.

## Remotion / SVG / React verwenden

Code-basierte Visuals sind die Standardwahl für:

- animierte Rechenaufteilung
- dynamische Charts / Datenverläufe
- sequenzielle Checklisten
- Timelines
- UI-Zustandswechsel
- frame-genaue Typografie
- exakte Zahlen und mathematische Proportionen
- Vergleiche, bei denen Text und Werte fehlerfrei sein müssen

## Hybrid

Hybrid nur, wenn das Flow-Bild als echte gerenderte Szene einen visuellen Mehrwert bringt. Ein Hybrid darf nicht benutzt werden, um eine Flow-Infografik nachträglich zu animieren.

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
- klar stilisiert, niemals fotorealistisch
- tiefer nahtloser Schwarz-/Charcoal-Green-Hintergrund
- Emerald = positiv / Lösung / Wachstum
- warmes Rot-Orange = Risiko / Kosten / Schuld
- Ivory / Soft Gray = neutral
- Gold nur sparsam für Geld/Wert
- sauberes Premium-Studiolicht
- erkennbare Materialität und Kontaktschatten
- wichtige Motive groß und nah
- niemals childish clay / toy / Pixar
- niemals generische Gold-Luxus-Finanz-KI

## Grounded Scene

- reale Objekte und glaubwürdige Proportionen
- ein klares Hauptmotiv oder eine klare Handlung
- medium-close Editorial-Framing
- natürliche Perspektive
- sinnvolle Tiefe und Überlappung
- weiche Kontaktschatten
- lokale Umgebung darf in die dunkle Welt auslaufen

## Editorial 3D Illustration

- ein zusammenhängendes bildfüllendes Motiv
- klarer räumlicher Aufbau
- starke Silhouette
- kein Karten-/Modul-/Dashboard-Aufbau
- keine textlastige Erklärung im generierten Bild
- Metapher nur, wenn sie sofort verständlich ist

## Text in Szenenbildern

- standardmäßig kein Text
- kurze deutsche Objektlabels nur, wenn sie wirklich nötig und an ein Objekt gebunden sind
- kein Titel, Untertitel, CTA oder Absatz
- kein automatisch erzeugtes FinanzNeo-Logo / Wasserzeichen / Markenlabel
- exakte Zahlen und längere Texte gehören Remotion

## Charts / Diagramme / Daten

Werden standardmäßig in Remotion/SVG/React gebaut:

- gerade Frontansicht
- korrekte Achsen
- mathematisch korrekte Werte und Proportionen
- keine Perspektivverzerrung

## UI / Settings

Werden standardmäßig in Remotion/React gebaut:

- fiktiv/unbranded
- gerade und lesbar
- frame-genau
- kein Flow-Screenshot und kein dickes schwebendes Control-Panel

---

# 3. Globaler Flow-Hard-Fail

Sofort verwerfen und denselben Job neu generieren bei:

- flacher Infografik / Slide / Poster
- Social-Media-Card-Look
- Dashboard-/Control-Panel-/HUD-Look
- Checklistenlayout als generiertes Bild
- Settings-/UI-Layout als generiertes Bild
- Progress-Bar als Hauptmotiv
- Chart-/Datengrafik als generiertes Bild
- Zahlenvergleich in Rechtecken/Tiles/Cards
- kleine schwebende Tiles/Karten/Module
- künstliche dicke Plaketten für Werte oder Text
- FinanzNeo-Logo/Wasserzeichen ohne ausdrückliche Anweisung
- sterile Produktaufnahme
- winzige isometrische/Diorama-Perspektive
- Canva-/PowerPoint-/Stock-Vector-Look
- generische Finance-Icon-Collage
- abstrakte Finanzmaschine ohne verständliche Aussage
- Trophy-/Plinth-/Gold-Luxury-Staging
- Fotorealismus
- childish clay/toy/Pixar
- unnötige visuelle Komplexität
- Bild funktioniert nur, wenn man viel Text liest

Qualitätsfrage: **Würde das Bild ohne seine Texte immer noch wie eine hochwertige gerenderte Szene funktionieren?** Wenn nein, gehört es nicht als finales Flow-Szenenbild in FinanzNeo.

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
- nur geplante Scene-Jobs ausführen
- jeden Job QA-prüfen
- bei FAIL nur denselben Bildjob wiederholen

## Phase A — Cover

1. Exakt drei Kandidaten A/B/C als drei getrennte Ein-Bild-Jobs gleichzeitig starten.
2. Alle verwenden dieselbe FinanzNeo-Bildwelt.
3. Unterschiedliche Szenen/Kompositionen sind erwünscht.
4. Kurzer deutscher Hook, maximal 2 Zeilen, ideal 2–5 Wörter.
5. Alle drei QA-prüfen.
6. Danach genau einmal A/B/C vom Nutzer wählen lassen.
7. Nur den Gewinner final übernehmen.
8. Der Gewinner wird niemals Style-Referenz für Szenenbilder.

## Phase B — Szenenbilder

- nur Visuals mit tatsächlichem Flow-Szenenbedarf
- bis zu fünf getrennte Ein-Bild-Jobs parallel
- niemals ein Multi-Image-Request
- jedes Ergebnis sofort exakt umbenennen
- jedes Ergebnis sofort QA-prüfen
- bei Fehler nur dieselbe Bildnummer neu generieren
- nächster Batch erst, wenn der aktuelle Batch vollständig PASS ist
- keine weitere Nutzerfreigabe zwischen Batches
- finaler Inventory-QA

`IMAGE_BATCH_SIZE = 5` ist eine maximale Batchgröße, keine Pflicht, fünf Bilder zu erzeugen.

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
- Präzisionsgrafiken dürfen bewusst grafisch und frontal sein; sie müssen nicht wie Flow-Bilder aussehen, aber farblich/typografisch zur Serie passen

Ein normales YouTube-Projekt darf keine reine Slideshow sein.

---

# 7. Kamera und Präzision

Bei präzisen Charts, Daten, UI und Typografie:

- gerade Achsen
- korrekte Skalen
- mathematisch korrekte Werte
- lesbare Labels
- keine Perspektivverzerrung, wenn Genauigkeit darunter leidet

Flow-Szenen dürfen eine sanfte 3/4-Editorial-Kamera verwenden.

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
