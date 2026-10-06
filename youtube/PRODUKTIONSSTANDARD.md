# FinanzNeo — YouTube-Longform-Produktionsstandard V5

> Aktiver Standard für neue FinanzNeo-YouTube-Videos. Bei YouTube-Konflikten hat dieser Standard zusammen mit `youtube/LAYOUTSTANDARD.md` und `youtube/VISUALCLARITY.md` Vorrang vor älteren Reel-/Caption-/Flow-Regeln in `CLAUDE.md`. Neue Reels sind pausiert; YouTube Shorts sind verboten.

## Format

- eigenständiges YouTube-Longform-Video
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema
- Hook ohne langes Intro
- einfache Sprache für Finanzanfänger
- Daten, Annahmen und Rechenwege prüfbar

## Grundprinzip

`LOOK FEST — INHALT FREI — BEDEUTUNG ZUERST — KLARHEIT VOR FORM — WERKZEUG PASSEND`

Zusätzliche verbindliche Autorität: `youtube/VISUALCLARITY.md`.

Die kanonische Bildwelt wird dadurch **nicht verändert**. Visual Clarity entscheidet nur über Aussage, Bildform, Informationshierarchie und Motion.

Für jeden gesprochenen Beat wird zuerst geklärt:

1. **Was soll der Zuschauer verstehen?**
2. **Welche visuelle Form erklärt genau das am schnellsten?**
3. Erst danach: Flow-Bild, Remotion, Karte oder Hybrid.

Es gibt **keine Standard-Bildform**. Eine reale Szene ist nicht automatisch besser als ein einzelnes Objekt. Ein Mensch ist nicht automatisch besser als Hände. Ein Tisch oder Raum ist niemals Pflicht.

---

# 1. Werkzeugwahl — verbindlich

## Google Flow

Flow ist richtig, wenn ein stilisiertes 3D-Standbild den Gedanken stark und sofort verständlich visualisieren kann.

Gleichberechtigte Möglichkeiten:

- **Isolated Object** — ein einzelnes Objekt reicht
- **Object Detail** — nur das relevante Detail / Makro
- **Hands in Action** — Hände, wenn die Handlung wichtig ist
- **Character Moment** — Mensch nur, wenn die Person Bedeutung trägt
- **Everyday Scene** — echter Ort nur, wenn der Ort Bedeutung trägt
- **Comparison Scene** — zwei Seiten für einen Vergleich
- **Semantic Object Composition** — mehrere Objekte so angeordnet, dass ihre Beziehung die Aussage erklärt
- **Visual Metaphor** — einfache Metapher, wenn sie in etwa zwei Sekunden sitzt
- **Creative Idea** — jede andere klare Bildidee
- **Hybrid Scene Plate** — Flow-Basis + präzise Remotion-Information

### Bedeutungsregel für Objektanordnungen

Objekte dürfen frei im Raum stehen oder schweben. Sie brauchen keinen Tisch, Boden oder Raum.

Aber: **Die Anordnung muss Bedeutung haben.**

Gute Beispiele:

- kaputter Kopfhörer → neuer Kopfhörer → zwei Belege = zweimal kaufen
- ein heutiger Beleg → mehrere wiederkehrende Belege = Wiederholung
- Wallet links / Terminal rechts = Vergleich
- kaputtes Handy + Kostenvoranschlag = Reparaturkosten

Schlecht:

- Gegenstände in einer dekorativen S-Kurve ohne inhaltlichen Grund
- Quittungen fliegen herum, nur damit es dynamisch aussieht
- jedes Objekt liegt auf einem Tisch, nur weil „irgendwo muss es liegen“

### Kein Ort-Zwang

Ein Ort wird nur beschrieben, wenn er die Aussage verbessert. Die Prompt-Zeile für einen Ort ist **optional**.

Nicht erfinden:

- Tisch
- Küche
- Büro
- Laden
- Mensch
- Hände
- Raum

nur um das Bild „vollständig“ wirken zu lassen.

## Remotion / SVG / React

Standard für Präzision:

- exakte Zahlen
- Rechenwege
- Charts mit Achsen
- Datenverläufe
- Tabellen
- Checklisten
- Timelines
- UI-Zustände
- frame-genaue Typografie
- mathematisch exakte Vergleiche

## Karten

`src/design-system/karten.tsx` für:

- Stichwort
- belegtes Zitat
- Tabelle
- Icon-Ablauf
- Zeitstrahl
- kurze Quellen-/Beispielhinweise

## Hybrid

Hybrid nur, wenn Flow einen echten visuellen Mehrwert liefert. Hybrid darf keine schlechte Flow-Infografik retten.

---

# 2. FinanzNeo-Bildwelt — Look fest, Form frei

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-animated-black-v3`

`FLOW_IMAGE_POLICY: meaning-first-free-visual-v2`

Source Visual Language: `finanzneo-stylized-3d-animated-black-v9`

Kanonische Datei:

`config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt`

## Fest bleibt nur die Render-DNA

- stilisiertes 3D im hochwertigen Animationsfilm-Look
- niemals fotorealistisch
- weiche, glaubwürdige Materialien
- warmes natürliches Hauptlicht
- sanftes Randlicht
- tiefer schwarzer Hintergrund / Schwarzraum
- Emerald = positiv / Lösung
- Red-Orange = Kosten / Warnung
- Gold = kleiner Geld-/Wert-Akzent
- Ivory / Soft Gray = neutral

## Frei ist die Bildidee

Erlaubt ist alles, was den gesprochenen Gedanken klar unterstützt:

- Mensch
- keine Menschen
- Hände
- einzelnes Objekt
- mehrere Objekte
- Objekt im Raum
- Gegenstände ohne sichtbare Auflagefläche
- Detailaufnahme
- Makro
- Top-down
- Seitenansicht
- ganze Umgebung
- keine Umgebung
- Vergleich
- Vorher/Nachher
- Ursache/Wirkung
- visuelle Metapher
- kontrollierte schematische Objektanordnung

Keine Quote, keine Pflichtform, kein „scene first“.

## Bedeutung vor Realismus der Anordnung

Ein Bild muss nicht so physikalisch im echten Alltag existieren. Es muss **visuell sinnvoll** sein.

Entscheidend:

- Versteht man die Aussage schnell?
- Hat jedes Element einen Grund?
- Erklärt die räumliche Beziehung etwas?
- Ist die Komposition stärker als eine erzwungene reale Umgebung?

## Menschen

Menschen sind **niemals Pflicht**.

Eine Person kommt nur hinein, wenn Gesicht, Körpersprache oder soziale Handlung die Aussage verbessert.

Wenn Objekt / Hand / Detail besser ist → Person weglassen.

## Der entscheidende Moment

Nur bei Beats, die von einer Handlung leben. Sonst `DECISIVE_MOMENT: not-applicable`.

## Abwechslung

Nicht künstlich „anders“ sein, sondern nicht automatisch die letzte funktionierende Formel wiederverwenden.

Abwechslung kann entstehen durch:

- andere Bildform
- anderer Maßstab
- andere Perspektive
- anderer Fokus
- andere Objektbeziehung
- Mensch vs. kein Mensch
- Szene vs. isoliertes Objekt
- realer Moment vs. visuelle Metapher

Gleiche Welt = gleiche Render-DNA, **nicht gleiche Szenengrammatik**.

---

# 3. Natürlich — kein KI-Slop

Verboten:

- Neon-/Leuchtkanten
- Glas-/Kristall-Finanzbalken
- generische Value Blocks / Value Stacks
- zufällige Pfeile oder Finanzicons
- Rauch, Funken, Lens Flares, episches Poster-Drama
- Geldberge als Deko
- generische Finanzcollage
- überladene Hintergründe
- Plastik-/Knete-/Spielzeuglook
- erfundene Zusatzlabels
- dekorative Objekte ohne Erklärwert

Wichtig: **Nicht jede abstrakte Darstellung ist verboten.**

Eine abstraktere oder schematische Idee ist erlaubt, wenn ihre Bedeutung sofort klar ist. Verboten ist bedeutungsloser KI-Dekor.

### Schwebende Elemente

- schwebende **UI-Karten/Tiles/Panels** als generische Infografik: verboten
- frei im Raum angeordnete **echte Objekte mit klarer semantischer Beziehung**: erlaubt

---

# 4. Bild-QA — Meaning Test

Vor jedem Flow-Job:

1. Was ist der eine Gedanke dieses Beats?
2. Welche Bildform erklärt ihn am schnellsten?
3. Warum ist jedes sichtbare Objekt da?
4. Warum steht jedes Objekt genau dort?
5. Würde das Bild ohne Mensch / Tisch / Raum besser werden? Dann entfernen.
6. Ist es in ungefähr zwei Sekunden verständlich?
7. Passt der Look zur FinanzNeo-Welt?

Hard Fail:

- Aussage unklar
- Komposition nur dekorativ
- Person ohne Grund
- Umgebung ohne Grund
- Tisch/Oberfläche ohne Grund
- schwebende Objekte ohne erkennbare Beziehung
- Wiederholung der letzten Bildform ohne Grund
- KI-Slop
- Fotorealismus
- Hauptinformation zu klein
- falscher / erfundener Text
- präzise Daten werden von Flow geraten statt in Remotion gebaut

---

# 5. Prompt-Form

Prompts bleiben kurz und einheitlich im Stilrahmen, aber **nicht inhaltlich starr**.

```text
Stylized 3D animated feature film still, 16:9. [BESTE VISUELLE IDEE FÜR DIESEN SATZ: Objekt, Detail, Handlung, Szene, Vergleich, semantische Objektanordnung oder visuelle Metapher]. [OPTIONAL: Ort nur wenn er Bedeutung hat]. Only text: "[max. zwei kurze deutsche Labels]" / No text. Soft natural light, deep black background. Not photorealistic, no logos.
```

Regeln:

- Ort optional
- Mensch optional
- Oberfläche optional
- maximal 80 Wörter
- höchstens zwei Texte
- keine Stilwörter wie `premium`, `cinematic`, `epic`, `dramatic`, `hyper-detailed`
- kein langer Regelblock im Einzelprompt
- Cover darf kurzen Hook-Text haben

---

# 6. Text / Daten / UI

## Flow-Text

Nur kurze Labels, wenn sie Mehrdeutigkeit verhindern.

Keine:

- normalen Untertitel
- langen Sätze
- CTA
- Absätze
- erfundenen Logos

## Präzision

Remotion übernimmt:

- exakte Zahlen
- Achsen
- Prozentwerte
- Tabellen
- UI
- Checklisten
- mathematische Proportionen

---

# 7. Google Flow — Ausführung

`FLOW_EXECUTION_MODE: finanzneo-youtube-cover3-image5-parallel-v4`

## Phase 0

Genau ein Google-Flow-Projekt pro Video.

## Phase A — Cover

1. Exakt drei A/B/C-Kandidaten als getrennte Ein-Bild-Jobs parallel.
2. Gleiche Bildwelt, aber drei echte unterschiedliche visuelle Ideen.
3. Kurzer deutscher Hook, maximal 2 Zeilen.
4. QA.
5. Einmal Nutzerwahl A/B/C.
6. Verlierer löschen.
7. Gewinner exakt umbenennen.
8. Gewinner niemals als Style-Referenz für Szenenbilder benutzen.

## Phase B — Bilder

- nur geplante IMAGE/HYBRID-Visuals
- bis zu fünf getrennte Ein-Bild-Jobs parallel
- kein Multi-Image-Request
- sofort umbenennen
- sofort QA
- bei FAIL nur dieselbe Nummer neu erzeugen
- keine Nutzerfreigabe zwischen Batches
- finaler Inventory-QA

## Flow-Ordner

Am Ende nur:

- ausgewähltes Thumbnail
- jedes finale Szenenbild genau einmal
- keine Fehlversuche
- keine abgelehnten Cover

Danach alles nach:

`04-visuals/00-ALLE-BILDER-HIER-REIN/`

---

# 8. Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

Zusätzlich gilt `VISUAL_CLARITY_STANDARD_ID: finanzneo-youtube-clarity-v1`.

Jede Motion-Szene plant vor der Technik:

- `coreMessage`
- `visualForm`
- `twoSecondTakeaway`
- `whyThisForm`
- `essentialElements`
- `clarityPlan.start`
- `clarityPlan.change`
- `clarityPlan.result`
- `clarityPlan.resultHoldFrames >= 30`

Die Animation muss START → eine primäre Veränderung → RESULT klar lesbar machen. Das Resultat bleibt stabil stehen. Mehrere neue Informationen gleichzeitig sind zu vermeiden, wenn sie nicht zwingend zusammengehören.

- mindestens zwei echte Motion-Visuals
- keine starre Bild-/Animationsquote
- Viewer Change zuerst
- Technik danach
- Custom React / SVG / CSS 3D / Canvas / Three / Datenvisualisierung erlaubt
- bestehende Komponenten optional
- Variation nur, wenn sie der Erklärung hilft
- präzise Daten dürfen grafisch/frontal sein
- reine Slideshow verboten

---

# 9. Layout

Verbindlich zusätzlich:

`youtube/LAYOUTSTANDARD.md`

- Bilder nicht randlos als kompletter Vollbild-Hintergrund
- Motion nicht als ungestaltete Vollbildfläche
- Content in FinanzNeo-Bühne / Frame
- kurze Zwischenüberschrift + passendes Icon pro Visual Beat
- keine eingebrannten Untertitel

---

# 10. Kamera

Flow-Kamera ist **komplett content-abhängig**.

Erlaubt:

- Makro
- Close-up
- Top-down
- frontal
- seitlich
- 3/4
- isoliertes Objekt
- kontrollierte räumliche Komposition
- weitere Umgebung

Keine Pflicht zu:

- Augenhöhe
- Horizont
- Vorder-/Hintergrundtiefe
- realem Raum

Nur bei präzisen Charts/UI/Typografie gilt: gerade, korrekt, unverzerrt — und diese Inhalte gehören normalerweise zu Remotion.

---

# 11. Audio und Timing

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel
- Schnitte folgen Sprache, Beats und Kapiteln
- keine pauschal gleich langen Visuals
- **keine eingebrannten Untertitel im finalen Video**
- Wort-Timings dienen Schnitt, SRT-Export und `script-mit-zeitstempeln.txt`
- Audioziel ca. -16 LUFS, True Peak max. -1 dBTP

---

# 12. Publishing / Export

`05-publishing/` enthält Produktions-/Uploadtexte.

Finale Nutzerdateien liegen nach Phase 3 in:

`07-export/`

mit:

- finalem MP4
- Cover
- Titel
- YouTube-Beschreibung
- Zeitstempel-Skript
- externer `.srt`

---

# 13. Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf gibt Phase 3 frei.


---

# 14. Phase-3 Render-Sicherheit — verbindlich

Der Render darf die kreative Planung nicht durch eine generische Bildmontage ersetzen.

Vor jedem finalen Render:

1. `layout.json` lesen.
2. `render-contract.json` lesen.
3. IMAGE-Visuals ausschließlich über `YouTubeFramedImage` rendern.
4. MOTION/DATA ausschließlich in `YouTubeSectionFrame`.
5. Zwischenüberschrift + Icon für **jeden** Beat sichtbar rendern.
6. Flow-Bilder mit `contain` in den Content-Frame setzen; niemals randlos 1920×1080.
7. Exakte Szenenquelle über `googleFlowFileName`; keine automatische Bildreihenfolge nach Ordnerposition.
8. Thumbnail/Cover/A-B-C-Kandidat niemals in die Timeline aufnehmen.

Ein Render ist **FAIL**, wenn auch nur ein IMAGE-Beat ohne Header/Frame erscheint oder ein Thumbnail als Szenenbild verwendet wird.
