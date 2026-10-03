# FinanzNeo — verbindliches Projekt-Gehirn

> Höchste interne Quelle für FinanzNeo. **Aktiver Produktionsmodus ist YouTube Longform. Neue Reels sind bis auf ausdrückliche spätere Freigabe pausiert.** Für neue Videos gilt `youtube/PRODUKTIONSSTANDARD.md`; Reel-spezifische Abschnitte in dieser Datei bleiben nur für bestehende Legacy-Reels erhalten.

## 0. Aktiver Produktionsmodus — YouTube Longform

```text
ACTIVE_PRODUCTION_MODE: youtube-longform-v4
NEW_REELS_PAUSED: true
YOUTUBE_SHORTS_FORBIDDEN: true
```

Verbindlich für neue Arbeit:

- **keine neuen Reels erstellen**
- neue Videos ausschließlich als eigenständige horizontale YouTube-Longform-Projekte unter `youtube/`
- 1920×1080, 16:9, 30 fps
- Bilder und Animationen gehören sichtbar zur selben FinanzNeo-V9-Welt
- jedes normale YouTube-Projekt enthält **mindestens zwei echte Motion-/Animationsvisuals**; keine reine Slideshow
- Google Flow: zuerst 3 Thumbnail-Kandidaten parallel, danach Szenenbilder in echten parallelen 5er-Batches
- Diagramme/Charts standardmäßig frontal, gerade und sofort lesbar; keine schrägen 3D-Perspektiven

Für neue YouTube-Projekte überschreibt `youtube/PRODUKTIONSSTANDARD.md` alle späteren Reel-spezifischen Layout-/Caption-/Flow-Angaben dieser Datei.

## 1. Kanal und Format

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Ziel: Finanzgrundlagen einfach, professionell und verständlich erklären
- **Aktiv: YouTube Longform**
- 1920×1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema; kein künstliches Strecken
- YouTube Shorts verboten
- neue Reels aktuell pausiert
- bestehende Reel-Dateien bleiben als Legacy/Referenz im Repo, sind aber nicht der Produktionsweg für neue Videos

## 2. Repository-Sicherheit

- nie direkt auf `main` arbeiten
- neuer Auftrag = eigener Branch
- bestehende Reels nur ändern, wenn sie ausdrücklich Ziel des Auftrags sind
- kein Merge, Force-Push, History-Rewrite oder Löschen ohne ausdrückliche Nutzerfreigabe
- Validatoren/Gates nie abschwächen, nur damit CI grün wird
- technischer Erfolg darf niemals mit Platzhaltern oder visueller Minderqualität erkauft werden

## 3. Drei Phasen

### Phase 1 — ChatGPT

Phase 1 liefert vollständig:

- Recherche + Quellen
- geprüftes Voiceover-Skript
- Dramaturgie und Szenenplan
- Bild-/Animations-Zuordnung
- individuelle Google-Flow-Prompts
- natürliche Header + Icons
- Remotion-Spezifikationen
- produktionsreife `animation.tsx` für jede Animationsszene
- eine universelle Social-Caption

Phase 1 ist erst fertig, wenn keine kreativen Lücken/Platzhalter mehr offen sind.

### Phase 2 — Nutzer

- erzeugt finale Szenenbilder mit Google Flow
- `scene-01` ist automatisch das Cover; kein separates `Bild 00`
- legt alle finalen Bilder exakt benannt in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
- legt genau ein finales Voiceover in `02-audio/`
- erzeugt echte Wort-Zeitstempel
- Agenten ersetzen Bilder oder Voiceover nicht eigenmächtig

### Phase 3 — Antigravity oder Claude Code

`scene-index.json -> phase3Executor` bestimmt den Executor.

Phase 3 darf:

- finale Nutzerbilder integrieren
- versiegelten Phase-1-Animationscode verwenden
- Timeline, Header und Captions integrieren
- freigegebene SFX framegenau integrieren
- Playwright Visual QA, Preflight, Candidate-Render, Render-QA und Export ausführen

Phase 3 darf versiegelte Animationen nicht kreativ ersetzen, vereinfachen oder neu erfinden.

## 4. Reel-Struktur

Cover-Regel: `scene-01` ist immer Bildszene und Cover. `03-szenen/00-cover/cover.txt` ist nur technischer Alias auf diese Szene.

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Animationsszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Bildszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
└── bildprompt.txt
```

## 5. Dramaturgie und Visual Beats

- Hook in den ersten 2 Sekunden
- keine feste Szenenzahl
- 1 gesprochener Gedanke = 1 sichtbarer Visual Beat
- Voiceover und Visual müssen gemeinsam fortschreiten
- neue Future-V3-Bildbeats ideal ca. 1,8–3,0 s; ohne neue sichtbare Information hart max. 4,0 s
- Animationen dürfen länger sein, müssen aber mehrere klar unterschiedliche Zustände zeigen
- ca. 60 % Bild / 40 % Animation ist nur Richtwert
- echte Wort-Zeitstempel bestimmen finale Schnitte
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz
- Zahlen prüfen; Annahmen kennzeichnen

## 6. Bildwelt — Stylized 3D Animated Black V9

Verbindlich:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
VISUAL_FORM_REVISION: finanzneo-free-visual-form-v1
```

### Kernregel

```text
FORM FREI — BILDWELT FEST
```

V9 beschreibt **wie** FinanzNeo aussieht, nicht **welche Darstellungsform** verwendet werden muss.

Die Bildidee folgt dieser Reihenfolge:

```text
Sprechpunkt
→ was soll in 1–2 Sekunden verstanden werden?
→ stärkste Darstellungsform frei wählen
→ konkrete Bildidee bauen
→ fachliche Logik/Daten prüfen
→ V9-Art-Direction anwenden
```

Erlaubte Formen:

- `character-story`
- `object-story`
- `comparison`
- `chart`
- `diagram`
- `editorial-quote`
- `illustration`
- `metaphor`
- `hybrid`

Es gibt keinen Zwang zu Menschen, Alltagsgegenständen oder Story-Metaphern. Ein echtes Diagramm darf die stärkste Lösung sein. Ein einzelnes Objekt darf reichen. Ein Zitat-/Editorialbild darf Hauptmotiv sein. Eine Figur darf zentral sein. Kombinationen sind erlaubt.

### Was visuell fest bleibt

- klar stylized 3D bzw. hochwertige FinanzNeo-Illustrationssprache
- niemals Fotorealismus
- premium Animation-Film-/Editorial-Qualität
- tiefe schwarze Bühne
- hochwertige Materialien, Licht, Tiefe und Kontaktschatten
- Emerald = positiv / Wachstum
- Gold = Geld / Wert
- Warm Red-Orange = Kosten / Risiko / Verlust
- wichtige Inhalte groß und sofort lesbar
- gleiche visuelle DNA über das gesamte Reel
- Zuschauer soll die Hauptaussage in etwa 1–2 Sekunden erfassen können
- kein billiger Corporate-, Stock-, PowerPoint- oder Excel-Default-Look

### Menschen

Menschen sind optional.

Wenn eine Figur vorkommt, muss Pose, Reaktion oder Handlung etwas erklären. Eine generische Corporate-3D-Figur, die nur neben einem Objekt steht, ist keine gute Szene.

### Objekte

Ein oder wenige Objekte dürfen die komplette Szene tragen, wenn sie stark genug sind. Keine Person hinzufügen, nur um eine Person im Bild zu haben.

### Vergleiche

A-vs-B darf direkt, symmetrisch, räumlich oder über unterschiedliche Größen/Verläufe gezeigt werden. Der Unterschied muss sofort lesbar sein.

### Echte Charts und Diagramme

Charts sind ausdrücklich erlaubt und sollen **wirklich richtige Charts** bleiben.

Je nach Diagrammtyp gehören dazu:

- echte Achsen, wenn fachlich erforderlich
- Skalen
- Kategorien
- Zahlenwerte
- Labels
- mathematisch korrekte Proportionen
- korrekte Start-/Endwerte

Beispiele:

- Liniendiagramm: X-Achse `Jahre`, Y-Achse `Vermögen`, korrekte Kurven
- Balkendiagramm: gemeinsame Baseline, echte relative Höhen, Werte
- Kreisdiagramm: korrekte Segmentanteile und Labels; keine künstliche X-/Y-Achse

Ein Chart darf hochwertig in V9 inszeniert werden: physische 3D-Achsen, volumetrische Balken, hochwertige Linien/Ribbons, 3/4-Perspektive, Materialtiefe, Licht und Schatten. Die Datenlogik darf aber nie für Dekoration geopfert werden.

Verboten:

- Excel-/PowerPoint-Default-Look
- dünne Standardachsen mit langweiligen Standardbalken als finale Bildwelt
- generische Business-Infografik
- Dashboard-Template als Ersatz für eine Bildidee
- Datenwerte verändern, nur damit es schöner aussieht

Für `chart` und `diagram` ist `DATA_INTEGRITY_TEST: PASS ...` Pflicht.

### Editorial / Zitat / Typografie

Text darf Hauptmotiv sein, wenn das die stärkste Form ist.

Erlaubt:

- kurze starke Aussage
- physische 3D-Typografie
- Magazin-/Editorial-Komposition
- Typografie + visuelle Metapher

Nicht erlaubt:

- generische Social-Media-Template-Karte
- langer Textabsatz
- langweilige Standardtypografie ohne Bildidee

### Illustration / Metapher

Freie Illustration, intuitive Metapher und Übertreibung sind erlaubt.

Sie dürfen kein Rätsel sein.

Abstrakte Begriffe wie `capital body`, `wealth tower`, `value block`, `investment block`, `fee token`, Fantasie-Klammern oder erfundene Finanzmaschinen sind keine automatische Standardsprache. Wenn sie bewusst genutzt werden, dann nur als `illustration`, `metaphor` oder `hybrid` und nur bei bestandenem Instant-Read-Test.

### Hybrid

Kombinationen sind ausdrücklich erwünscht, wenn sie stärker erklären:

- Figur + echtes Chart
- Objekt + Diagramm
- Editorial-Zitat + Metapher
- Vergleich + Datenvisualisierung

### Abwechslung

Es gibt keine Pflichtquote pro Bildart. Der Sprechbeat entscheidet.

Aufeinanderfolgende Szenen sollen nicht unnötig dieselbe Kompositionsidee wiederholen.

Mögliche Mischung:

```text
Figur
→ Objekt
→ echtes Chart
→ Metapher
→ Vergleich
→ Editorial
→ Figur + Chart
```

### Prompt-QA

Neue Bildszenen dokumentieren:

```text
VISUAL_FORM
VISUAL_CONCEPT
VOICEOVER_VISUAL_MATCH
INSTANT_READ_TEST
TRANSFERABILITY_TEST
DATA_INTEGRITY_TEST
```

`DATA_INTEGRITY_TEST`:

- bei `chart` / `diagram`: `PASS - ...`
- bei allen anderen Formen: `not-applicable`

Bild verwerfen und dieselbe Nummer neu erzeugen, wenn:

- es hübsch ist, aber den Sprechpunkt nicht erklärt
- es generisch zu vielen Finanzthemen passen würde
- ein Chart fachlich falsch oder wie ein Standard-Office-Chart aussieht
- eine Figur nur dekorativ herumsteht
- Text wie ein billiges Social-Template wirkt
- es fotorealistisch, katalogartig oder cluttered wird
- die Szene sichtbar nicht zur FinanzNeo-Welt gehört

Die frühere YouTube-Phase-A-DNA bleibt Qualitätsreferenz für Modellierung, Licht, Tiefe, Kamera, Figuren und hochwertige 3D-Inszenierung, begrenzt aber nicht die Darstellungsform.

## 7. Google Flow — Cover Parallel V2 + Scene Single Job

```text
FLOW_EXECUTION_MODE: finanzneo-flow-cover-parallel-then-single-v4
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v2
FLOW_COVER_WORKFLOW: finanzneo-flow-cover-parallel-5pack-v2
FLOW_COVER_CONCURRENCY: 3
FLOW_SCENE_CONCURRENCY: 1
```

### Cover-Phase

Vor allen Szenenbildern werden exakt drei Cover-Kandidaten **gleichzeitig** erzeugt:

```text
Cover A ┐
Cover B ├→ drei getrennte Einzelbild-Jobs gleichzeitig
Cover C ┘
→ QA
→ Nutzer wählt A/B/C
→ gewähltes Cover = scene-01
```

Verbindlich:

- A/B/C sind drei getrennte Jobs, kein Kontaktbogen, keine Collage und kein gemeinsamer Multi-Image-Request
- jedes Cover entsteht direkt in der FinanzNeo-V9-Bildwelt
- Cover-Text muss den tatsächlichen Videoinhalt kurz verdichten
- maximal 2 Zeilen, ideal 2–5 Wörter
- keine langen Sätze
- kein generischer Clickbait ohne direkten Inhaltsbezug
- keine erfundenen Zahlen oder Aussagen
- die drei Cover sollen sichtbar unterschiedliche Ideen/Kompositionen testen
- nach A/B/C genau einmal auf die Nutzerwahl warten
- das gewählte Cover wird finaler Cover-Asset und `scene-01`; kein separates `Bild 00`

### Kein Cover als Style-Vorlage

Das gewählte Cover ist **ausdrücklich keine Style-Referenz** für die späteren Bilder.

Die einzige Style-Autorität bleibt:

```text
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
```

Damit gilt:

- Cover A/B/C orientieren sich direkt an V9
- alle Szenenbilder orientieren sich direkt an V9
- kein Cover wird als Bildreferenz an spätere Prompts übergeben
- kein späteres Szenenbild wird neuer Style-Anker
- keine Bild-zu-Bild-Style-Referenzen im kanonischen Flow
- Bildideen bleiben frei; nur die gemeinsame V9-DNA bleibt fest

### Szenenbilder nach der Cover-Wahl

Nach der Nutzerwahl gilt wieder strikt Single Job:

```text
aktuellen Szenenbildblock lesen
→ GENAU EIN Szenenbild starten
→ intern auf Ergebnis warten
→ sofort exakt umbenennen
→ in finalen Bildordner legen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu erzeugen
→ bei PASS nächstes Bild freischalten
```

Die restlichen IMAGE-Szenen werden organisatorisch in 5er-Blöcke geteilt. Ein 5er-Block ist niemals ein Parallel-Batch.

Verboten nach der Cover-Phase:

- parallele Szenenbild-Jobs
- Queue späterer Szenenbilder
- Kontaktbogen/Galerie als Ersatz
- mehrere Szenenbildprompts in einem Request
- Nutzer-„weiter“ zwischen Bildern oder 5er-Blöcken
- spätes Sammel-Umbenennen statt Sofort-Rename
- Cover oder Szenenbild als Style-Referenz verwenden

Nach dem letzten Bild ist ein vollständiger Inventory-/Dateinamen-QA Pflicht; alle finalen Flow-Bilder liegen gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`.

## 8. Finales Reel-Layout V5

Einzige technische Wahrheit: `src/brand/tokens.ts -> REEL_STYLE`.

```text
Header               Y = 154
Header Text          56 px, Minimum 50 px
Header Icon          34 px
Header Zeilen        maximal 2
Visualzone           Y = 320–1400
Untertitel           bottom = 340
Caption Font         50 px, Minimum 40 px
Caption Zeilen       maximal 2
Szenenübergang       3 Frames
```

Header:

- Weiß `#FFFFFF`
- Sentence Case
- semantische Farbe primär im Linien-Icon
- keine Capsule / Chip / Pill / Box
- max. zwei Zeilen

`AnimationStage` clippt produktive Animationen hart auf Y320–1400. Kein Animationsinhalt im Header- oder Caption-Bereich.

## 9. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- aktives Wort grün, Rest weiß
- max. zwei Zeilen
- 50 px, Minimum 40 px
- Weight 800
- kein Stroke, Jump oder Scale-Pop
- `bottom = 340`
- kein Wort der nächsten Szene darf vorgreifen

## 10. Reel-Hintergrund — Pure Black V1

Der einzige produktive Reel-Hintergrund ist:

```text
#000000
statisch
```

Verboten als Reel-Hintergrund:

- Partikel
- Aurora
- Grid
- Glow-Feld
- dekorative Vignette/Gradient-Fläche
- Hintergrundbewegung

Hintergrundbewegung zählt niemals als Szenenanimation oder QA-Nachweis.

## 11. Phase-1-Animationscode

Basis-Lock:

```text
finanzneo-phase1-animation-code-v1
```

Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Visuelles Ziel bleibt V9. Auch Animationen folgen **Form frei — Bildwelt fest**.

### Eine Welt statt Motion-Sonderstil

Animation und Flow-Bild müssen wie dieselbe Serie aussehen.

Reihenfolge:

```text
SPRECHPUNKT
→ VERSTÄNDNISZIEL
→ STÄRKSTE DARSTELLUNGSFORM FREI WÄHLEN
→ HAUPTMECHANIK
→ FINANCE MOTION LIBRARY AUF SEMANTISCHEN FIT PRÜFEN
→ SAME-WORLD-PASS PRÜFEN
→ DIREKTER LIBRARY-EINSATZ ODER CUSTOM-BUILD
```

Die Finance Motion Library ist ein **Mechanik-Werkzeugkasten, keine Art-Direction**.

Eine Animation darf Figurenszene, Objektmechanik, Vergleich, echtes animiertes Chart/Diagramm, Illustration, Metapher oder Hybrid sein.

Direkter Library-Einsatz ist nur zulässig, wenn:

1. die Mechanik den gesprochenen Punkt wirklich erklärt und
2. das Resultat sichtbar zur V9-Serie passt.

Wenn eine Library-Komponente wie langweilige Dashboard-/Corporate-Infografik oder unverständliche Value-Geometrie wirkt, wird die Mechanik individuell in der V9-Welt umgesetzt.

### Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE URSACHE / HAUPTAKTION
→ REAKTION / VERÄNDERUNG
→ EINDEUTIGER PAYOFF
→ Ergebnis mindestens 15 Frames stabil
```

Pflichtmetadaten im Code:

- `MOTION_SOURCE`
- `FINANCE_MOTION_ID`
- `MECHANIC_ID`
- `FOCAL_PATH`
- `PRIMARY_ACTION`
- `CAMERA_ROLE`
- `PAYOFF`
- `ANIMATION_NARRATIVE` mit START / MECHANISM / RESULT
- `PREMIUM_VISUAL_NARRATIVE` mit HERO / SUPPORT / MATERIAL / DEPTH
- `RESULT_HOLD_FRAMES >= 15`

Custom-Build nutzt framebasierte Remotion-Logik (`useCurrentFrame`, `interpolate`, `spring` o. ä.) und zentrale `ANIMATION_COLORS`.

### animation.tsx besitzt nicht das Reel-Shell

`animation.tsx` liefert **nur transparenten visuellen Inhalt** für `AnimationStage`.

Verboten innerhalb einer Szenenanimation:

- eigener schwarzer Vollbild-Canvas
- lokale `SceneShell`
- eigener globaler Header
- eigene globale Caption
- eigener dekorativer Hintergrund

Header, Caption, Canvas und Safe-Zone-Clipping werden exakt einmal vom zentralen Reel-Layout gerendert.

### Verbotene Hauptsprache

- generische Karten-/Kästchenreihe
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- langweilige Dashboard-/Control-Panel-Komposition
- generische Corporate-Infografik
- reine Texttafel mit Fade/Scale ohne Editorial-Idee
- kleine Boxen mit dünnen Verbindungslinien
- unverständliche abstrakte Value-Geometrie
- Partikel/Aurora/Grid als Szenenhintergrund
- `Math.sin` / `Math.cos` als Frame-Diff-Hack
- Dummy-/Placeholder-Komponenten
- Library-Nutzung nur weil ein Baustein existiert

Technische Tests sind Pflicht, beweisen aber nicht allein die visuelle Qualität. Eine globale Stil-Promotion braucht einen echten visuellen Test mit realen Flow-Bildern und Animationen im finalen Reel-Layout.

## 12. Phase-3-Seal und Dispatch

`npm run reel:ready -- <Reel-Pfad>` versiegelt jede kanonische `animation.tsx` per SHA-256.

Phase 3 verlangt danach:

- exakten `componentPath`
- exakten Export
- unveränderten Hash
- vollständiges Binding

Fehlt ein Binding: Render hart abbrechen. Kein Ersatzvisual.

## 13. Phase-3-Completion-Gate

Eine vorhandene MP4 bedeutet nicht fertig.

```text
reel:ready
→ Phase-1-Animation-Seal
→ Phase-3-Preflight
→ Candidate Render
→ Post-Render-QA
→ Final MP4
→ reel:export
→ FINAL_COMPLETE
```

Post-Render-QA prüft mindestens:

- jede Szene hat echten visuellen Inhalt
- Header + Caption + Schwarz allein zählen nicht
- Bildszene zeigt wirklich Nutzerbild
- Animationsszene zeigt echte Mechanik/Veränderung
- freie Randbereiche bleiben schwarz
- Audio, Auflösung und Timeline stimmen
- Future-V3-Candidate wird auf -16 LUFS / -1 dBTP gemastert und gemessen

## 14. Publishing

Für alle Reel-Plattformen gibt es genau eine Social-Caption.

Kanonische Quelle:

```text
04-caption/caption.txt
```

Finaler Export:

```text
06-export/caption-universal.txt
```

Dieselbe Caption gilt für Instagram Reels, TikTok, Facebook Reels und Snapchat. YouTube bleibt Longform unter `youtube/`.

## 15. Produktionsbefehle

```bash
npm run reel:create -- --target <Reel-Pfad> --title "Titel"
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:export -- <Reel-Pfad>
```

Kein Agent darf einen fehlgeschlagenen Gate umgehen.
