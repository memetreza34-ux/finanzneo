# Kreditkarten-Teilzahlung: Wie aus 2.000 € ein teurer Kredit wird

Eigenständiges YouTube-Longform-Projekt nach FinanzNeo V4. Kein Reel und kein YouTube Short.

## GOOGLE FLOW — NUR DIESE EINE DATEI

Der Nutzer kopiert **genau eine einzige Datei vollständig und 1:1** in den Google-Flow-Agenten:

`04-visuals/alle-bildprompts.txt`

Diese Datei ist der **vollständige ausführbare Google-Flow-Master-Prompt**. Sie darf niemals nur ein Hinweis, Redirect oder Platzhalter sein.

Sie enthält:
- den direkten Ausführungsbefehl für Google Flow
- die komplette FinanzNeo-Bildwelt
- Cover A/B/C als drei getrennte Bildjobs
- genau eine Cover-Auswahl A/B/C
- danach nur die tatsächlich benötigten Flow-Szenenbilder
- exakte Dateinamen
- horizontales 16:9
- QA und automatische Regeneration bei falscher Bildwelt

## Bildwelt — Scene First

Google Flow ist in FinanzNeo ein **Szenen-Renderer**, kein Infografik-, Dashboard- oder UI-Generator.

Erlaubte Flow-Bildklassen:

1. **Grounded Scene** — reale, sofort verständliche Objekte/Situationen als hochwertiges stilisiertes 3D.
2. **Editorial 3D Illustration** — eine zusammenhängende, bildfüllende gerenderte Illustration oder sofort verständliche Metapher.

Präzise Zahlenaufteilungen, Charts, Checklisten, Timelines, Tabellen und UI-Zustände werden in **Remotion/SVG/React** gebaut. Ein statischer Beat wird nicht automatisch zu einem Flow-Bild.

Für Flow gilt außerdem:
- Szene muss auch ohne Text funktionieren
- wichtige Motive groß und nah
- Materialität, Tiefe, Licht und Kontaktschatten
- kein ungefragtes FinanzNeo-Logo oder Wasserzeichen
- keine schwebenden Cards/Tiles
- keine Progress-Bar-/Checklisten-/Settings-Grafik
- kein Canva-/PowerPoint-/Social-Card-Look
- kein Fotorealismus

Interne Promptquellen liegen gesammelt unter:

`04-visuals/01-BILDPROMPTS/`

Diese internen Dateien werden **nicht** einzeln in Google Flow kopiert.

## Dieses konkrete Video

Nach der Cover-Auswahl erzeugt Google Flow nur diese zwei Szenenbilder:

1. `YouTube Bild 01 - Karte und Monatsabrechnung.png`
2. `YouTube Bild 05 - Kleine Rate grosse Restschuld.png`

Bild 01 ist eine echte **Grounded Scene** mit Kreditkarte und Monatsabrechnung.

Bild 05 ist eine textarme **Grounded-Scene-Hybridbasis**: räumliche Abrechnung/Papiertrail. Die exakten Werte `1.200 € gezahlt` und `1.069,72 € offen` werden anschließend in Remotion eingeblendet.

Nicht mehr von Google Flow erzeugt werden:
- Visual 03: exakte 100-€-Aufteilung → Remotion/SVG
- Visual 07: drei Kreditkarten-Checks → Remotion
- Visual 08: Teilzahlung/Vollzahlung-Einstellung → Remotion

Visual 02, 03, 04, 05-Motion, 06, 07 und 08 werden als echte Motion-/Data-Visuals in Remotion/SVG/React umgesetzt.

## Produktionsphasen

Phase 1 enthält Recherche, Skript, Visualplanung, den vollständigen Google-Flow-Master-Prompt, interne Bildpromptquellen, produktionsreife Motion-/Data-Visuals und das Publishing-Paket.

Phase 2 ergänzt das ausgewählte Thumbnail, die zwei benötigten Flow-Szenenbilder, genau ein finales Voiceover und echte Wort-Timings.

Phase 3 integriert die versiegelte Motion und rendert nach vollständigem Readiness-PASS.
