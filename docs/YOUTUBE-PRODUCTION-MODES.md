# FinanzNeo — YouTube Production Modes

FinanzNeo YouTube Longform unterstützt mehrere Produktionsarten. Die Bildwelt, Script-Beat-Regeln und Flow-Qualität bleiben gleich; nur die erlaubten Visualquellen unterscheiden sich.

## Mode A — `images-only`

Ziel: Ein vollständiges YouTube-Video nur aus statischen Bildern testen.

Regeln:
- pro Visual genau ein statisches 16:9-Bild
- Google-Flow-Bilder in `finanzneo-youtube-grounded-3d-black-v1`
- normalerweise 1–2 kurze Voiceover-Sätze pro Bild
- ein dominanter Gedanke pro Bild
- sichtbares Visual Storytelling statt statischem Produktkatalog
- keine Remotion-Erklärgrafik
- keine Remotion-Zahlen, Charts, Icons, Überschriften oder Animationen
- keine `animation`, `data` oder `hybrid` Visualtypen
- wichtige Zahlen werden im Script erklärt oder der Beat wird so formuliert, dass das Bild ohne eingeblendete Zahl funktioniert
- kurze deutsche Beschriftungen sind nur als physischer Teil eines wichtigen, sonst missverständlichen Objekts erlaubt
- finaler Bildschnitt darf als normaler Videoschnitt erfolgen; die Visualquelle bleibt vollständig statisch

Der Zweck dieses Modes ist ausdrücklich zu testen, ob FinanzNeo auch mit starken, gut inszenierten Bildern allein ein unterhaltsames YouTube-Video tragen kann.

## Mode B — `hybrid`

Ziel: Bilder mit Remotion-Erklärvisuals und Animationen kombinieren.

Erlaubt:
- Google-Flow-Bilder
- echte statische Assets
- Remotion-Zahlen, Überschriften, Icons, Charts und Diagramme
- Animationen und Hybrid-Szenen

Die bestehende Simple-first-Entscheidungslogik gilt: Remotion für exakte Daten/Erklärung, echte Assets wenn Realität wichtig ist, Flow für konkrete physische Story-Momente.

## Gemeinsame Regeln

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

### Nur Bilder

```bash
npm run youtube:create:mode -- --mode images-only --target youtube/<projekt> --title "<Titel>" --visual-count 20
```

Der Wrapper erzeugt ausschließlich `image`-Visuals und markiert das Projekt als `images-only`.

### Bilder + Animation

```bash
npm run youtube:create:mode -- --mode hybrid --target youtube/<projekt> --title "<Titel>" --types image,animation,image,data,hybrid
```

Die konkrete Visualzahl ist in beiden Modes nicht global festgelegt. Sie folgt dem Script und den Sprechpunkten.
