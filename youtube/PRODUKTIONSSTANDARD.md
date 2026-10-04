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

Für jeden Sprechbeat wird zuerst bestimmt, was der Zuschauer sehen und verstehen soll. Danach wird das Werkzeug gewählt. Google Flow rendert hochwertige stylized-3D-Szenen, Objektgeschichten, Figurenmomente und physische Metaphern. Remotion/SVG/React übernimmt präzise Daten-, Text-, Checklisten-, Timeline- und UI-Grafiken.

**Wichtig:** Google Flow ist kein Infografik-Generator. Das bedeutet aber NICHT, dass Flow nur realistische Gegenstände auf einem dunklen Tisch zeigen darf. Die alte erfolgreiche FinanzNeo-Promptlogik mit konkreten 3D-Ideen ist verbindlich.

---

# 1. Werkzeugwahl — verbindlich

## Google Flow: premium stylized 3D CGI

Flow darf innerhalb derselben Bildwelt frei die beste Darstellungsform wählen:

- Grounded Scene
- Character Story
- Object Story
- Physical Metaphor
- Editorial 3D Illustration
- Environmental Scene
- Comparison Scene
- Transformation Scene
- Hybrid Scene Plate

### Wann Flow richtig ist

Wenn eine bildhafte 3D-Idee den Sprechbeat schnell erklärt:

- konkrete Alltagssituation
- Figur mit klarer Handlung
- ein dominantes Objekt mit sichtbarer Ursache/Wirkung
- kleine-vs-große Größenkontraste
- Lupe enthüllt etwas
- Gegenstände werden gestapelt, geteilt, gestempelt, geöffnet, gezogen, gewogen oder verwandelt
- mehrere bekannte Alltagsobjekte bilden eine zusammenhängende Szene
- eine physische Metapher erklärt den Finanzpunkt sofort

### Nicht als generisches Flow-Infografikbild erzeugen

Wenn der Kern des Beats hauptsächlich aus präzisen Informationen besteht, gehört er in Remotion/SVG/React:

- exakte Zahlenaufteilung
- dichter Chart oder Datenverlauf
- lange Checkliste
- Timeline
- Tabelle
- mehrere Textzeilen
- exakter UI-/Settings-Zustand
- mathematisch exakter Vergleich

Flow darf bei einem Hybrid eine starke 3D-Szenenbasis liefern. Präzise Zahlen, Labels, UI-Zustände und Daten kann Remotion darüberlegen.

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

Hybrid nur, wenn das Flow-Bild als echte stylized-3D-Szene einen visuellen Mehrwert bringt. Ein Hybrid darf nicht benutzt werden, um eine schlechte Flow-Infografik nachträglich zu retten.

---

# 2. FinanzNeo-Bildwelt

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-v9-front-readable-v2`

Source Visual Language:

`finanzneo-stylized-3d-animated-black-v9`

Primärer genehmigter Stilanker:

`finanzneo-premium-physical-editorial-v8`

Legacy Prompt DNA:

`finanzneo-stylized-3d-editorial-v5`

Kanonische Datei:

`config/finanzneo-image-worlds/finanzneo-youtube-v9-front-readable-v2.txt`

## Immer gleich

Die Konstanz entsteht durch die **Render-/Formensprache**, nicht durch eine starre Liste erlaubter Objekte oder Farben:

- clearly stylized premium 3D CGI / Editorial-Qualität
- klar stilisiert, niemals fotorealistisch
- chunky, substanzielle volumetrische Formen
- leicht vereinfachte bzw. überzeichnete Proportionen, wenn es der Klarheit hilft
- glatte Geometrie, weiche Bevels, sichtbare Dicke und Gewicht
- hochwertige Materialien passend zur Szene
- cinematografisches Licht
- weiche aber sichtbare Kontaktschatten
- klare Vordergrund-/Mittelgrund-/Hintergrundtiefe
- sinnvolle Überlappungen und sichtbare Handlung
- niemals childish clay / toy / Pixar
- niemals generisches Corporate-3D oder Gold-Luxus-Finanz-KI

## Farben — frei passend zum Inhalt

FinanzNeo ist **kein Farbkorsett**.

Wiederkehrende Anker:
- Deep Charcoal / Green-Black als häufige Grundatmosphäre
- Emerald/Mint für positive Richtung/Lösung
- warmes Red-Orange für Kosten/Risiko/Schuld/Warnung
- Gold/Brass für Geld/Wert
- Warm Ivory/Cream für neutrale Informationsflächen

Zusätzlich ausdrücklich erlaubt:
- Blau / Cyan
- Gelb
- Orange / Rot
- Violett
- natürliche Hauttöne
- Kleidungsfarben
- Umwelt-/Produktfarben
- alle anderen scene-spezifischen Farben, wenn sie die Aussage klarer machen

Nicht jedes Objekt künstlich in Markenfarben umfärben. Die Szene darf bunt sein, wenn sie dadurch besser funktioniert.

## Objekte / Figuren / Umgebungen

Es gibt keine feste Objekt-Whitelist.

Erlaubt sind alle passenden:
- Alltagsobjekte
- Finanzobjekte
- Fahrzeuge
- Gebäude
- Landschaften
- Räume
- Geschäfte
- Haushaltsgegenstände
- Geräte
- Symbole
- Figuren
- Hände / Teilfiguren
- komplette stylized Adult Characters

Menschen sind erlaubt, wenn sie die Aussage besser erklären. Sichtbares Gesicht = Augen, Nase und Mund; keine reale identifizierbare Person.

## Alte erfolgreiche Promptlogik — Pflicht

Jeder individuelle Flow-Bildprompt folgt dieser Reihenfolge:

1. `MAIN IDEA`
2. `SCENE`
3. `FULL STYLE LOCK`
4. `BACKGROUND / ENVIRONMENT`
5. `ALLOWED TEXT`
6. `PERSON RULE`
7. `NEGATIVE`
8. `QA`

### MAIN IDEA

Genau eine Aussage. In ungefähr zwei Sekunden verständlich.

### SCENE

Hier wird die **konkrete Bildidee erfunden**. Nicht nur den Sprechertext umformulieren.

Beschreiben:
- welches Objekt / welche Figur der Hero ist
- welche unterstützenden Elemente vorkommen
- was physisch passiert
- welche Größenverhältnisse gelten
- wie die Tiefenstaffelung aussieht
- was das Auge zuerst sieht
- wie Ursache und Wirkung visuell zusammenhängen

Die früheren erfolgreichen FinanzNeo-Prompts nutzten z. B. Lupe, Wallet, Kalender, Calculator, Kopfhörer, Smartphone, SIM-Karte, Contract Folder, Tags, Coins, Shopping Basket, Fuel Nozzle usw. Diese Beispiele sind **keine Whitelist**.

## Text in Flow-Szenenbildern

Kurze deutsche Objektlabels, Preise, Prozentwerte oder kurze Fragen sind erlaubt, wenn sie Teil der Szene sind und helfen.

- kein langer Titel im normalen Szenenbild
- kein Absatz
- keine CTA-Sätze
- Text bevorzugt auf/in einem physischen 3D-Objekt integriert
- kein automatisch erzeugtes FinanzNeo-Logo / Wasserzeichen / Markenlabel
- datenintensive Präzisionsgrafiken gehören Remotion

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

- Fotorealismus / Stockfoto
- realistisches langweiliges Büro-/Papier-Stillleben
- flacher Infografik / Slide / Poster
- Social-Media-Card-Look
- Dashboard-/Control-Panel-/HUD-Look
- Checklistenlayout als generiertes Bild
- Settings-/UI-Layout als generiertes Bild
- Progress-Bar als Hauptmotiv
- Chart-/Datengrafik als generiertes Bild
- Zahlenvergleich in Rechtecken/Tiles/Cards
- kleine schwebende Tiles/Karten/Module
- generische Finance-Icon-Collage
- generisches Corporate-3D
- sterile Produktaufnahme
- winzige isometrische/Diorama-Perspektive
- riesige leere schwarze Fläche mit kleinem Motiv
- Trophy-/Plinth-/Gold-Luxury-Staging
- childish clay/toy/Pixar
- Bild hat keine Handlung, Beziehung, Transformation oder klaren Größenkontrast
- Prompt paraphrasiert nur den Sprechertext statt eine konkrete Bildidee zu erfinden

Qualitätsfragen:

1. Ist genau eine Hauptaussage sofort klar?
2. Sieht es eindeutig nach premium stylized 3D CGI aus?
3. Ist die Bildidee konkret statt generisch?
4. Helfen die gewählten Objekte/Figuren/Farben der Aussage?
5. Sind Tiefe, Kontakt, Überlappung oder Handlung sichtbar?

Wenn eine Antwort nein ist: denselben Job neu generieren.

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

Jeder enthaltene einzelne Bildjob muss selbstständig genug sein, dass Google Flow den Bildstil nicht aus einem vorherigen Bild erraten muss.

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
- Motion nutzt dieselbe FinanzNeo-Premium-Logik; die exakte Farbwahl darf content-spezifisch sein
- Präzisionsgrafiken dürfen bewusst grafisch und frontal sein; sie müssen nicht wie Flow-Bilder aussehen, aber klar zur Serie gehören

Ein normales YouTube-Projekt darf keine reine Slideshow sein.

---

# 7. Kamera und Präzision

Bei präzisen Charts, Daten, UI und Typografie:

- gerade Achsen
- korrekte Skalen
- mathematisch korrekte Werte
- lesbare Labels
- keine Perspektivverzerrung, wenn Genauigkeit darunter leidet

Flow-Szenen dürfen die Kamera frei passend zur Bildidee wählen: frontal, near-frontal, gentle 3/4 oder kontrolliert weiter für Umgebungen. Kein winziger entfernte Isometrie.

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
