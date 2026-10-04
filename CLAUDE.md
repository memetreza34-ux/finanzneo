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
- Bildwelt: **Look fest — Inhalt frei** (§6): Standbilder im stilisierten 3D-Animationsfilm-Look auf tiefem Schwarz; Menschen, Hände, echte Gegenstände und Orte, wenn es passt
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
YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-animated-black-v3
GENERATED_IMAGE_ASPECT_RATIO: 1:1
YOUTUBE_GENERATED_IMAGE_ASPECT_RATIO: 16:9
VISUAL_FORM_REVISION: finanzneo-free-visual-form-v1
```

Kanonische Bildwelt-Datei für YouTube: `config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt`.

### Kernregel

```text
LOOK FEST — INHALT FREI
```

Form frei heißt: Im Bild darf alles vorkommen, wenn es den Sprechpunkt visuell unterstützt — Gegenstände, Orte, kreative Ideen, ab und zu Menschen. Zitate, Stichworte und Tabellen kommen als Remotion-Karten. Fest ist der Look. **Nichts auf Krampf:** Die meisten Bilder brauchen keine Person und keine Geschichte.

Festgelegt von Arman am 04.10.2026 nach mehreren Fehlversuchen. Freigegebene Referenzen sind echte Flow-Bilder:

- Reel „Kurse schwanken“ (20.09.2026) — Figuren und Hände im Alltagsmoment
- YouTube „Notgroschen“ (17.09.2026) — echte Gegenstände auf tiefem Schwarz

### Der Look — immer gleich

Jedes Bild sieht aus wie ein **Standbild aus einem hochwertigen stilisierten 3D-Animationsfilm über Geld im Alltag**:

- stilisiertes 3D im Animationsfilm-Look, niemals fotorealistisch
- wenn eine Person vorkommt: sympathische stilisierte Erwachsene mit ausdrucksstarkem Gesicht und klarer Körpersprache; keine reale identifizierbare Person
- echte Alltagsgegenstände mit glaubwürdigen Proportionen und erkennbaren Details: Handy, Rechnung, Brief, Bankkarte, Geldbörse, Waschmaschine, Auto, Kalender
- halbrealistische Materialien, weich und sauber stilisiert gerendert
- warmes Hauptlicht, sanftes Randlicht gegen das Schwarz, weiche Kontaktschatten
- tiefes nahtloses Schwarz; ein kleiner echter Ort (Küchentisch, Waschecke, Flur, Ladentheke, Autoinnenraum) darf da sein, wenn er hilft, und läuft ins Schwarz aus

### Der Inhalt — frei, wenn es passt

Es gibt keine Objektliste und keine Quote. Wähle, was den Sprechpunkt am schnellsten erklärt:

- `character-moment` — eine Figur reagiert, zögert, entscheidet, zahlt, liest
- `hands-in-action` — Daumen über einem Knopf, Hand zieht eine Karte
- `object-story` — ein starker echter Gegenstand trägt die Idee
- `everyday-scene` — wenige echte Gegenstände an einem kleinen echten Ort
- `comparison-scene` — zwei echte Situationen nebeneinander
- `creative-idea` — Übertreibung oder eine Bildidee aus echten Gegenständen; kreativ ist erwünscht, solange es auf einen Blick lesbar ist

Keine Figur und keine Geschichte einbauen, nur damit sie da sind — die meisten Bilder brauchen beides nicht.

### Der entscheidende Moment — ab und zu

Nur wenn der Sprechpunkt von etwas handelt, das passiert, zeigt das Bild diese Sekunde: Der Daumen ist kurz vor dem Tippen, der Brief rutscht gerade aus dem Umschlag. Die meisten Bilder brauchen das nicht — ein starker Gegenstand, eine einfache Szene oder ein Zitat reicht.

Technisches Feld in jedem Bildprompt (darf `not-applicable` sein):

```text
DECISIVE_MOMENT: <was in genau dieser Sekunde passiert — oder not-applicable>
```

### Prompt-Form

Jeder Bildprompt ist ein kurzer **englischer** Absatz in immer derselben Form: Look („Stylized 3D animated feature film still, 16:9“), was im Bild ist, optional der Moment, Ort, erlaubte deutsche Labels („Only text: …“), „warm soft light, deep black background“, „not photorealistic, no logos“. Nur die Labels im Bild sind deutsch. Keine langen Regelblöcke im Einzelprompt.

### Szenenvarianz

Gleiche Welt heißt gleicher Look, nicht gleiche Szene. Jedes Bild zeigt eine sichtbar andere Situation, einen anderen Ort, Abstand oder Blickwinkel als das Bild davor. Deko wie Tasse, Brille oder ruhende Hand kommt höchstens einmal pro Video vor.

### Zahlen und Diagramme

Die Bilder sollen passen, nicht auf Krampf — beim Inhalt gibt es keine Einschränkung, kreative Ideen und Zitate sind erwünscht. **Diagramme mit Achsen, Charts, exakte Zahlen, Tabellen, Checklisten und UI baut Remotion** (entschieden von Arman am 04.10.2026 nach dem Vergleich Flow-Diagramm vs. Remotion-Diagramm).

### Karten (Remotion) — erlaubter eigener Visual-Typ

Nach dem Vorbild Finanzbär (04.10.2026 von Arman freigegeben): ruhige Karten auf Schwarz aus `src/design-system/karten.tsx` — `StichwortKarte`, `ZitatKarte`, `TabellenKarte`, `IconAblauf`, `Zeitstrahl`, dazu `KartenHinweis` für Beispielrechnung/Quelle. Inter, weiße Schrift, grüne Hervorhebung; Elemente erscheinen nacheinander im Sprechrhythmus. Zahlen kommen aus der Zentralrechnung, Zitate müssen belegt sein. Referenz: Composition `DemoKartenBaukasten`.

Zitate, Stichworte und Tabellen gehören in diese Karten statt in Flow — dort stimmt jeder Buchstabe.

### Deutsche Labels

Kurze deutsche Labels direkt am Gegenstand sind erwünscht, wenn sie Mehrdeutigkeit verhindern: `Notgroschen`, `Girokonto`, `Reparatur 280 €`, `Teilzahlung`, `Restschuld`. Zitate kommen als `ZitatKarte` aus dem Karten-Baukasten, nicht als Flow-Bild. Sonst keine Headline, kein Untertitel, kein CTA, kein Satz.

### Farbrollen

- Emerald Green = positiv / Lösung / Sparen
- Warm Red-Orange = Kosten / Warnung / Verlust
- Gold = kleiner Geld-/Wert-Akzent
- Warm Ivory + Soft Gray = neutral
- natürliche Haut- und Kleidungsfarben sind erlaubt
- Deep Black = Hintergrund; kein dunkelgrün-schwarzer Monochrom-Look

### Streng verboten

- Fotorealismus / Stockfoto-Look
- die alte grün-goldene Symbolwelt als Hauptidee: Bankgebäude, Schild, Tresor, Münzberge, leuchtende Icons
- abstrakte Finanzskulpturen statt echter Situation: Schuldenklammer, Zinsmagnet, Zahlungs-Token, Geldband, Wertblock, „chunky“ CGI-Objekte ohne Alltagsbezug
- Chart, Diagramm, flache Infografik, Dashboard, App-/Settings-UI, Checkliste oder Progress-Bar als Flow-Bild
- erfundene oder falsch zugeordnete Zitate
- schwebende Karten, Tiles oder Panels; Flowchart
- heller Studio-, weißer oder farbiger Hintergrund
- winzige Miniatur-/Diorama-Darstellung
- Spielzeug-, Plastik- oder Knete-Look
- aufgeräumter Endzustand statt Moment
- reale identifizierbare Personen, flach aufgeklebte echte Logos
- Clutter und Deko ohne Erklärwert

### Bild-QA

Bild verwerfen und **dieselbe Bildnummer neu erzeugen**, wenn:

- es nicht wie ein Standbild aus einem stilisierten 3D-Animationsfilm aussieht
- es fotorealistisch wird
- eine Person oder Geschichte ohne Grund eingebaut ist
- die echte Alltagssituation fehlt oder man ein Symbolrätsel entschlüsseln muss
- es in grün-goldene Symbole oder abstrakte Finanzskulpturen zurückfällt
- der Hintergrund nicht tief schwarz ist oder das Bild grün-monochrom wird
- das Hauptmotiv zu klein ist
- es Ort und Blickwinkel des vorigen Bildes wiederholt
- notwendige deutsche Labels fehlen oder falsch zugeordnet sind

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

- generische Karten-/Kästchenreihe (der Karten-Baukasten aus §6 ist ausdrücklich erlaubt)
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- langweilige Dashboard-/Control-Panel-Komposition
- generische Corporate-Infografik
- reine Texttafel mit Fade/Scale ohne Editorial-Idee — außer Stichwort-/Zitat-Karten aus dem Karten-Baukasten (§6)
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
