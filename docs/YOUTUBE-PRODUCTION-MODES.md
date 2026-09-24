# FinanzNeo — YouTube Production Modes

FinanzNeo YouTube Longform unterstützt zwei Produktionsarten. Beide verwenden dieselbe feste Szenen-Layoutlogik. Der Unterschied ist ausschließlich, ob Bewegung/Animation erlaubt ist.

## Gemeinsamer Szenen-Lock — gilt IMMER

Jede YouTube-Szene ist ein fertiger 16:9-Frame mit klarer Hierarchie:

1. kurze Szenenüberschrift im oberen Bereich;
2. direkt daneben ein passendes, einfaches Icon;
3. darunter bzw. daneben das eigentliche FinanzNeo-Visual in einem klar begrenzten Bildfenster;
4. das Flow-Bild darf niemals den kompletten 16:9-Frame als Vollbild-Hintergrund ausfüllen.

Kanonische Layoutregeln:
- `sceneHeadingRequired: true`
- `sceneIconRequired: true`
- `flowImageFullscreenForbidden: true`
- `flowImagePlacement: contained-visual-window`
- tiefe schwarze FinanzNeo-Grundfläche bleibt als sichtbarer Rahmen/Hintergrund erhalten
- Flow-Visual bleibt groß genug für schnelle Verständlichkeit, aber es ist immer eindeutig ein Element innerhalb des gesamten Video-Frames
- Überschrift und Icon gehören zur Video-Szene und nicht zum generierten Flow-Bild
- das Flow-Bild selbst enthält weiterhin keine Headline oder dekorative UI
- Layout darf pro Szene leicht variieren, aber niemals in ein Vollbild-Flow-Bild wechseln

Empfohlene statische Standardgeometrie für 1920 × 1080:
- Außenabstand mindestens ca. 72 px
- Headerzone ca. 150–190 px hoch
- Icon ca. 56–72 px
- Visualfenster maximal ca. 78 % der Framebreite und ca. 70 % der Framehöhe
- Visualfenster darf links, rechts oder zentral sitzen, solange Header + Icon klar getrennt bleiben und das Bild nie fullscreen wird

## Mode A — `images-only`

Ziel: Ein vollständiges YouTube-Video ohne Animation testen.

Wichtig: `images-only` bedeutet **nicht** rohe Vollbildbilder. Es bedeutet **fertige statische YouTube-Szenen**.

Regeln:
- pro Szene genau ein statisches Flow-Visual als Hauptbild
- jede Szene enthält trotzdem die gemeinsame Überschrift + Icon + eingebettetes Visualfenster
- keine Bewegung innerhalb der Szene
- keine animierten Zahlen, Charts, Icons, Texte oder Kameraeffekte
- statische Layout-Komposition ist ausdrücklich erlaubt und erforderlich
- Google-Flow-Bilder bleiben in `finanzneo-youtube-grounded-3d-black-v1`
- normalerweise 1–2 kurze Voiceover-Sätze pro Bild
- ein dominanter Gedanke pro Bild
- sichtbares Visual Storytelling statt statischem Produktkatalog
- keine `animation`, `data` oder `hybrid` Visualtypen
- kurze deutsche Beschriftungen sind nur als physischer Teil eines wichtigen, sonst missverständlichen Objekts im Flow-Bild erlaubt
- finaler Schnitt darf normale harte Cuts oder statische Bildwechsel verwenden; keine Szenenanimation

Der Zweck dieses Modes ist zu testen, ob starke statische Layout-Szenen mit hochwertigen Flow-Bildern, Überschrift und Icon ein komplettes YouTube-Video tragen können.

## Mode B — `hybrid`

Ziel: Exakt dieselbe visuelle Grundstruktur wie Mode A, aber Bewegung und zusätzliche Erkläranimationen sind erlaubt.

Gemeinsam mit Mode A:
- gleiche Headerzone
- gleiche Überschrift-Logik
- gleiche Icon-Logik
- gleiches eingebettetes Visualfenster
- Flow-Bild niemals fullscreen
- gleiche FinanzNeo-3D-Bildwelt

Zusätzlich erlaubt:
- Animationen innerhalb des Layouts
- Remotion-Zahlen, Charts und Diagramme
- animierte Icons und Überschriften
- echte statische Assets
- Hybrid-Szenen

Die Animation ergänzt das bestehende Layout; sie ersetzt es nicht durch ein anderes Vollbild-System.

## Gemeinsame Inhaltsregeln

Beide Modes behalten:
- 16:9 YouTube Longform
- ein dominanter Gedanke pro Visual
- Flow meist 1–2 kurze Voiceover-Sätze pro Bild
- Multi-Idea-Beats werden geteilt
- gleiche premium stylized 3D FinanzNeo-Welt
- deep-black Grundwelt
- sichtbare Ursache/Wirkung, Spannung, Entwicklung oder räumliche Beziehung
- kein permanentes Tisch-/Katalog-Layout
- kein permanentes Floating-Template
- kurze deutsche Objektlabels nur wenn nötig
- ein gemeinsamer `alle-bildprompts.txt` Handoff darf viele Bildblöcke enthalten; Flow erzeugt trotzdem strikt Bild für Bild

## CLI

### Mode A — statische Szenen

```bash
npm run youtube:create:mode -- --mode images-only --target youtube/<projekt> --title "<Titel>" --visual-count 20
```

Der Wrapper erzeugt ausschließlich `image`-Visuals, verbietet Animationen und aktiviert den festen Static-Layout-Lock mit Überschrift, Icon und niemals fullscreen dargestelltem Flow-Bild.

### Mode B — gleiche Szenenwelt + Animation

```bash
npm run youtube:create:mode -- --mode hybrid --target youtube/<projekt> --title "<Titel>" --types image,animation,image,data,hybrid
```

Die konkrete Visualzahl ist in beiden Modes nicht global festgelegt. Sie folgt dem Script und den Sprechpunkten.
