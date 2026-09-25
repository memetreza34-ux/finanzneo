# FinanzNeo — YouTube Production Modes

FinanzNeo YouTube Longform unterstützt zwei Produktionsarten. **Die Bildwelt, das Grundlayout und die visuelle Markenlogik bleiben in beiden Modi gleich.** Der wichtigste Unterschied ist Bewegung: Phase A bleibt vollständig statisch, Phase B darf animieren.

## Gemeinsamer Szenen-Lock — gilt IMMER

Jede YouTube-Szene ist ein fertiger 16:9-Frame mit klarer Hierarchie:

1. kurze Szenenüberschrift im oberen Bereich;
2. direkt daneben ein passendes, einfaches Icon;
3. darunter bzw. daneben das eigentliche FinanzNeo-Visual in einem klar begrenzten Bildfenster;
4. ein Flow-Bild darf niemals den kompletten 16:9-Frame als Vollbild-Hintergrund ausfüllen.

Kanonische Layoutregeln:
- `sceneHeadingRequired: true`
- `sceneIconRequired: true`
- `flowImageFullscreenForbidden: true`
- `flowImagePlacement: contained-visual-window`
- tiefe schwarze FinanzNeo-Grundfläche bleibt sichtbar
- Überschrift und Icon liegen außerhalb des Flow-Bildes
- das Layout darf pro Szene leicht variieren, aber nie in ein Vollbild-Flow-Bild wechseln

Empfohlene Geometrie für 1920 × 1080:
- Außenabstand mindestens ca. 72 px
- Headerzone ca. 150–190 px
- Icon ca. 56–72 px
- Visualfenster maximal ca. 78 % der Framebreite und ca. 70 % der Framehöhe

## Mode A — `images-only` / Phase A Static

Der CLI-Name `images-only` bleibt aus Kompatibilitätsgründen bestehen. Inhaltlich bedeutet Phase A ab jetzt aber **nicht mehr „nur rohe Bilder“**, sondern:

> **Alles bleibt statisch. Keine Animation. Sonst darf die Szene die sinnvollste statische Erklärform nutzen.**

Die freigegebene Flow-Bildwelt bleibt unverändert: `finanzneo-youtube-grounded-3d-black-v1`.

### Erlaubte statische Visual-Arten

**1. `3d-story`**
- klassisches premium stylized 3D Flow-Bild
- ein klarer Finanzgedanke
- sichtbare Ursache/Wirkung oder räumliche Beziehung
- Überschrift + Icon außerhalb des Bildes

**2. `3d-explainer`**
- dasselbe 3D-Flow-Bild
- zusätzlich dürfen exakte statische Remotion-Elemente erklären: kurze Labels, Pfeile, Zahlen, Gleichungen, Markierungen oder Vergleiche
- Flow soll bei geplanten Overlays gezielt saubere freie Fläche lassen
- exakte Texte/Zahlen werden nicht dem Bildgenerator überlassen

**3. `static-data`**
- statische Remotion-Grafik im normalen eingebetteten Visualfenster
- z. B. Zahl, Vergleich, Mini-Chart, einfache Rechnung, Ablauf oder Aufteilung
- kein Flow-Bild nötig, wenn eine statische Grafik den Punkt klarer erklärt
- keinerlei Bewegung

**4. `real-asset`**
- echtes Dokument, Screenshot oder anderes legitimes Asset
- statisch in derselben Szenenstruktur

### Harte Phase-A-Regeln

- **keine Bewegung innerhalb der Szene**
- kein `useCurrentFrame()` für sichtbare Bewegung
- kein `interpolate()` oder `spring()` für sichtbare Bewegung
- keine animierten Zahlen, Charts, Icons, Texte, Zooms, Fades oder Kamerafahrten
- statische Remotion-Texte, Pfeile, Zahlen, Vergleiche und Mini-Charts sind ausdrücklich erlaubt
- normale harte Cuts zwischen statischen Szenen sind erlaubt
- Flow-Bild niemals fullscreen
- Überschrift + Icon bleiben immer Teil des Video-Layouts
- wichtige exakte Texte/Zahlen gehören in das statische Layout, nicht in Flow
- die bestehende FinanzNeo-3D-Bildwelt wird **nicht** verändert

### Startmischung, keine Quote

Für ein Video mit ungefähr 20 Szenen ist ein sinnvoller Startpunkt:
- ca. 13 × `3d-story`
- ca. 4 × `3d-explainer`
- ca. 3 × `static-data`

Das ist **keine feste Quote**. Der Sprechpunkt entscheidet. Wenn 18 starke Storybilder besser sind, werden 18 Storybilder verwendet.

## Mode B — `hybrid`

Mode B nutzt dieselbe Szenenstruktur und dieselbe FinanzNeo-Bildwelt, erlaubt zusätzlich Bewegung.

Gemeinsam mit Phase A:
- gleiche Headerzone
- gleiche Überschrift-Logik
- gleiche Icon-Logik
- gleiches eingebettetes Visualfenster
- Flow-Bild niemals fullscreen
- gleiche premium stylized 3D FinanzNeo-Welt

Zusätzlich erlaubt:
- Remotion-Animationen
- animierte Zahlen, Charts und Diagramme
- animierte Icons und Überschriften
- Hybrid-Szenen
- echte Assets

## Entscheidungsregel pro Sprechpunkt

Für jeden Beat:

```text
Was muss der Zuschauer in 1–2 Sekunden verstehen?
→ 3D-Story reicht? → 3d-story
→ 3D-Bild + exakte kurze Erklärung besser? → 3d-explainer
→ Zahl/Vergleich/Chart allein klarer? → static-data
→ echtes Asset nötig? → real-asset
```

In Phase A bleibt das Ergebnis immer statisch.

## Flow + statische Remotion-Overlays

Wenn ein `3d-explainer` geplant ist:
- Flow-Prompt nennt bewusst die benötigte freie Fläche;
- Bildgenerator erzeugt keine Headline, Untertitel oder wichtige Erklärzahl;
- Remotion setzt die exakten Inhalte später statisch darüber;
- das Overlay darf die Bildgeschichte ergänzen, aber nicht das ganze Bild mit UI überdecken.

Beispiel:

```text
5 € × 20 = 100 €
```

oder:

```text
2.500 € → 3.000 €  Gehalt
1.900 € → 2.400 €  Ausgaben
```

## CLI

### Phase A — nur 3D-Storybilder

```bash
npm run youtube:create:mode -- --mode images-only --target youtube/<projekt> --title "<Titel>" --visual-count 20
```

### Phase A — gemischte statische Visuals

```bash
npm run youtube:create:mode -- --mode images-only --target youtube/<projekt> --title "<Titel>" --types image,image,hybrid,data,image,real-asset
```

In Phase A ist der Typ `animation` verboten. `hybrid` bedeutet hier: Flow-Bild + statische Remotion-Erklärung, **ohne Animation**. `data` bedeutet hier: statische Daten-/Erklärgrafik.

### Mode B — Animation erlaubt

```bash
npm run youtube:create:mode -- --mode hybrid --target youtube/<projekt> --title "<Titel>" --types image,animation,image,data,hybrid
```

## Kurzregel

> **Phase A = normales FinanzNeo-YouTube-Layout + dieselbe Bildwelt + die beste statische Erklärform. Der einzige harte Unterschied zu Phase B: keine Animation.**
