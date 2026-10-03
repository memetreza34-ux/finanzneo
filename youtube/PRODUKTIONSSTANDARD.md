# FinanzNeo — YouTube-Longform-Produktionsstandard V4

> Für neue FinanzNeo-Videos ist dies der aktive Produktionsstandard. Bei Konflikten gilt zusätzlich `CLAUDE.md`. Neue Reels sind pausiert; YouTube Shorts sind verboten.

## Format

- eigenständiges YouTube-Longform-Video, kein verlängertes Reel
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema
- Hook ohne langes Intro
- Kapitel mit klaren Zwischenzielen und Payoffs
- einfache Sprache für Finanzanfänger
- Daten, Annahmen und Rechenwege prüfbar

## Visualplanung

`FORM FREI — BILDWELT FEST`

Erlaubt sind Bilder, Animationen, Hybride und Datenvisualisierungen. Für jeden Sprechbeat wird die stärkste Darstellungsform gewählt. Menschen sind optional. Objekte, Vergleiche, echte Charts, Diagramme, Editorials, Illustrationen und klare Metaphern sind erlaubt.

### Einfache Erklärvisuals sind ausdrücklich erlaubt

Nicht jeder Beat braucht eine komplexe 3D-Szene. Wenn der Inhalt schneller verständlich wird, darf ein einzelnes einfaches Visual den ganzen Frame tragen — **aber die Render-Welt bleibt dieselbe FinanzNeo-Grounded-3D-Welt.**

Erlaubte Formen sind insbesondere:

- **Symbol-/Objekt-Fokus:** ein großes inhaltsspezifisches greifbares Objekt
- **Zahl-Fokus:** ein zentraler Betrag, Prozentsatz, Zeitpunkt oder Zielwert
- **einfacher Chart:** Balken-, Linien-, Flächen- oder Vergleichsdiagramm
- **Weg/Ziel/Metapher:** z. B. Zielscheibe, Bergpfad, Bank, Haus oder anderes klar passendes Motiv
- **UI-/App-Beispiel:** frontal und unbranded, wenn die Aussage wirklich eine Einstellung, App-Ansicht oder Transaktion erklärt
- **Asset-/Objektgruppe:** wenige konkrete Objekte zur Darstellung von Kategorien, Vermögen, Auswahl oder Trade-offs
- **Konzept-Cluster:** ein zentrales Objekt mit wenigen umliegenden Begriffen/Faktoren
- **Zitat-/Key-Statement:** nur kurz und nur wenn die exakte Aussage selbst der Inhalt ist
- **klassische Story-/Objektszene, Vergleich, Editorial, Illustration, Metapher oder Hybrid**

### Kritische Trennung: Form ≠ Bildwelt

Eine reduzierte Komposition darf **niemals** zu einer neuen flachen Bildsprache werden.

- simples Symbol = greifbares, hochwertiges stilisiertes 3D-Objekt; kein Stock-Icon
- große Zahl = hochwertige Integration mit Material/Licht/Tiefe; keine Präsentationsfolie
- einfacher Chart = mathematisch korrekt und frontal, aber mit FinanzNeo-Material/Licht/Tiefe; kein Excel-/PowerPoint-Look
- UI-Beispiel = physisches Premium-Panel/Device mit Tiefe und Kontaktschatten; kein Screenshot oder flache Dashboard-Karte
- Labels = klar und frontal, aber nicht bloß farbige Rechtecke mit Text

**Einfach bedeutet reduziert, nicht flach.**

### Auswahlregel pro Beat

1. Was muss der Zuschauer in diesem Moment verstehen?
2. Welche einfachste visuelle Form erklärt genau das am schnellsten?
3. Diese Form muss danach in der verbindlichen FinanzNeo-Grounded-3D-Welt umgesetzt werden.
4. Erst wenn ein simples Symbol, eine Zahl, ein Chart oder eine klare Metapher nicht reicht, wird die Szene komplexer.
5. Keine Komplexität nur zur Dekoration.

### Animationen sind Pflicht

Ein normales YouTube-Projekt darf keine reine Slideshow sein. Es braucht **mindestens zwei echte Motion-/Animationsvisuals**. Das ist eine Mindestanforderung, keine Zielquote. Mehr Motion wird nur eingesetzt, wenn sie tatsächlich etwas erklärt.

Jede Animation wird bereits in Phase 1 als produktionsreife `animation.tsx` geplant und folgt Motion V3: Viewer Change zuerst, Technik danach. Animation und Bild müssen wie dieselbe FinanzNeo-Serie aussehen.

## Bildwelt

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-v9-front-readable-v2`

Kanonische Datei:

`config/finanzneo-image-worlds/finanzneo-youtube-v9-front-readable-v2.txt`

Verbindlicher Approved Anchor:

`APPROVED_YOUTUBE_ANCHOR: finanzneo-youtube-grounded-3d-black-v1`

Die bereits genehmigte Grounded-3D-YouTube-Welt ist die **visuelle Stilautorität**. `front-readable-v2` ergänzt Frontlesbarkeit und Formfreiheit; es ersetzt diese Welt nicht.

Verbindlich:

- Premium clearly stylized 3D animation-film / hochwertige Illustration
- greifbare physische Objekte mit glaubwürdigen Proportionen
- semi-realistische, aber sichtbar stilisierte Materialhinweise für Papier/Kunststoff/Metall/Glas
- sichtbare Materialstärke bei Karten, Dokumenten, Panels und Tiles, wenn physisch passend
- echte räumliche Tiefe
- sauberes Premium-Studiolicht
- klare Highlights und Trennung zum Hintergrund
- lesbare Kontaktschatten
- subtile geerdete Reflexionen, wenn sinnvoll
- Deep Black dominant
- Emerald positiv, Red-Orange Risiko/Kosten, Ivory/Grau neutral, Gold nur als kleiner Geld-/Wert-Akzent
- reduzierte Symbol-, Zahlen-, Chart-, UI-, Metapher- und Statement-Visuals bleiben Teil **derselben** Welt
- kein Fotorealismus
- kein Corporate-Stock-Look
- keine generische Gold-Luxus-KI-Finanzwelt
- kein Cover oder anderes Bild wird Style-Referenz; die schriftliche Grounded-V9-Welt ist die einzige Style-Autorität

### Hard-Fail gegen falsche Bildwelt

Ein Flow-Bild wird verworfen und unter derselben Nummer regeneriert, wenn es wie eines der folgenden aussieht — auch wenn Text und Zahlen korrekt sind:

- flache 2D-Infografik
- bloße farbige Rechtecke mit Text
- schwebende Textkarten auf Schwarz
- generische Präsentationsfolie
- Stock-/Vector-/Clipart-Look
- Canva-/Social-Template-Look
- Screenshot-/Dashboard-Look
- PowerPoint-/Excel-Chart-Look
- sterile schwebende Boxen ohne Materialtiefe oder Kontaktschatten
- generische schwarze Finanzgrafik, die nicht wie die genehmigte FinanzNeo-3D-Serie wirkt

### Kamera und Darstellung

Standard ist **normal, frontal bzw. nahe frontal, auf Augenhöhe und mit geradem Horizont**. Milde 3/4-Perspektive nur bei echten Story-Szenen, wenn sie die Handlung klarer macht. Keine schrägen Effekthascherei-Kameras.

### Charts und Diagramme

Charts/Diagramme bleiben echte Charts und werden **frontal** gezeigt:

- Kamera gerade vor dem Diagramm
- keine schräge 3D-Perspektive
- keine gekippten Ebenen
- keine verzerrten Achsen
- X-/Y-Achsen gerade, wenn sie fachlich dazugehören
- Skalen, Werte, Labels und Proportionen korrekt
- Kreisdiagramme mit korrekten Segmenten
- V9-Material/Licht/Tiefe darf hochwertig sein, aber Datenlesbarkeit gewinnt immer
- kein PowerPoint-/Excel-Look

### UI, Text und Quote Cards

- UI-Beispiele nur dann, wenn die UI selbst etwas erklärt
- frontal, unbranded und groß lesbar
- als gestaltetes physisches Premium-Panel/Device mit Materialstärke und Kontaktschatten, nicht als Screenshot
- normale Szenenbilder bleiben textarm
- kurze Begriffe oder Labels sind erlaubt
- eine kurze Quote-/Key-Statement-Komposition ist erlaubt, wenn genau diese Aussage der Inhalt des Beats ist
- keine langen Absätze oder Social-Media-Template-Optik

## Google Flow — Thumbnail 3 parallel, Bilder 5 parallel

`FLOW_EXECUTION_MODE: finanzneo-youtube-cover3-image5-parallel-v4`

### Style-Suffix ist in jedem Subjob Pflicht

Der Master-Prompt muss den Grounded-3D-Style-Lock nicht nur einmal global nennen. **Jeder einzelne Thumbnail- und Szenenbild-Job erhält den vollständigen verpflichtenden Style-Suffix mit:**

- Grounded stylized 3D
- greifbaren physischen Objekten
- Materialstärke und realer Tiefe
- Studiolicht/Highlights
- Kontaktschatten
- Deep-Black-Welt
- explizitem Verbot flacher Infografik-/Slide-/Dashboard-Optik

Der Szene-Prompt darf diesen Style-Suffix nie ersetzen.

### Phase A — 3 Thumbnail-Kandidaten gleichzeitig

1. Exakt drei Kandidaten A/B/C als **drei getrennte Einzelbild-Jobs gleichzeitig** starten.
2. Jeder Kandidat nutzt direkt `finanzneo-youtube-v9-front-readable-v2` plus den Grounded-3D-Style-Lock.
3. Alle drei müssen sichtbar unterschiedliche Kompositionen testen, aber dieselbe Welt behalten.
4. Jeder Kandidat enthält kurzen deutschen Hook-Text: max. 2 Zeilen, ideal 2–5 Wörter.
5. Der Text beschreibt den echten Videoinhalt; keine langen Sätze, keine erfundenen Aussagen.
6. Typografie sauber/front-facing, nicht als riesige goldene 3D-Schrift.
7. Wenn A/B/C vorhanden sind, genau einmal Nutzerwahl A/B/C.
8. Gewählten Kandidaten exakt als finales Thumbnail umbenennen; die beiden anderen nicht in den finalen Ordner übernehmen.
9. Das gewählte Thumbnail ist **keine Style-Vorlage** für die Szenenbilder.

### Phase B — Szenenbilder in echten parallelen 5er-Batches

Nach der Thumbnail-Auswahl werden die IMAGE-/HYBRID-Quellbilder in Reihenfolge in Blöcke mit maximal 5 Bildern aufgeteilt.

Für jeden Block:

1. Bis zu **5 getrennte Einzelbild-Jobs gleichzeitig starten**.
2. Kein Multi-Image-Prompt und keine Collage: jeder Job enthält genau einen vollständigen Bildprompt, den Grounded-3D-Style-Suffix und erzeugt genau ein Bild.
3. Sobald ein Ergebnis zurückkommt: sofort exakt umbenennen, in `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen und QA durchführen.
4. Fehlerhaftes oder stilistisch flaches Bild nur unter derselben Nummer neu erzeugen; korrekte Bilder nicht neu generieren.
5. Der nächste 5er-Block darf erst starten, wenn **alle Jobs des aktuellen Blocks PASS** haben.
6. Zwischen Blöcken keine weitere Nutzerfreigabe.
7. Animations-/Data-Visuals ohne Flow-Quellbild werden übersprungen und behalten ihre Visualnummer.
8. Am Ende vollständiger Inventory-QA: alle erwarteten Dateien exakt, keine Dubletten, keine fehlenden/falschen Nummern.

Wichtig: 5er-Batch bedeutet **fünf parallele getrennte Ein-Bild-Jobs**, nicht ein Auftrag, der fünf Bilder in einer Ausgabe erzeugt.

## Thumbnail-Qualität

Thumbnail und Szenenbilder gehören in dieselbe Grounded-V9-Welt. Ein Thumbnail darf auffälliger komponiert sein, aber nicht in einen separaten Stil wechseln. Verwerfen, wenn es wie generische goldene Finanz-KI, flache Infografik oder Präsentationsfolie aussieht, wenn Gold die Welt dominiert, wenn der Text zu lang ist oder wenn Motiv/Text das Thema nicht direkt kommunizieren.

## Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

- mindestens zwei Motion-Visuals pro Projekt
- keine feste Obergrenze oder starre Quote
- Viewer Change zuerst
- produktionsreife `animation.tsx` in Phase 1
- Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Datenvisualisierung und Bild+Motion-Hybrid erlaubt
- bestehende Komponenten nur als Werkzeug, nie als Stilzwang
- Motion muss dieselbe V9-Material-/Licht-/Farbwelt tragen

## Audio und Timing

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel
- Schnitte folgen Sprache, Visual Beats und Kapiteln
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ca. -16 LUFS, True Peak max. -1 dBTP

## Publishing

`05-publishing/` enthält Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords/Tags, Hashtags, Thumbnail-Brief, Quellen/Disclaimer, Pinned Comment, Community-Post, Upload-Checkliste und Social-Promo-Texte.

## Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf gibt Phase 3 frei.
