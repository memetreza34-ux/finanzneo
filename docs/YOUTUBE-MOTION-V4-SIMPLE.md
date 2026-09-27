# FinanzNeo YouTube Motion V4 — Simple Finance / Earned Motion

`MOTION_STANDARD: finanzneo-youtube-motion-v4-simple`

## Ziel

Ein Gedanke → ein klares Visual → nur so viel Bewegung wie nötig.

Phase B erlaubt Motion, aber Motion ist **kein Ziel an sich**. Eine starke statische Lösung darf jede schwächere Animation ersetzen.

## Vor Motion immer statisch denken

Pflicht-Reihenfolge:

```text
Was muss verstanden oder erinnert werden?
→ bestes Standbild / Beispiel / Diagramm / Vergleich bestimmen
→ braucht die Aussage echte Veränderung über Zeit?
→ ist Motion deutlich stärker als die statische Alternative?
→ erst dann animieren
```

Kanonisch:
- `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`
- `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`

## Animation muss ihren Mehrwert verdienen

Motion ist sinnvoll bei:
- Veränderung über Zeit;
- Reihenfolge / Prozess;
- Aufbau oder Zerlegung;
- Geldfluss;
- zeitlichem Vergleich;
- gezielter Blickführung zwischen mehreren Zuständen.

Motion ist nicht sinnvoll, wenn:
- nur ein Objekt wackelt oder fährt, ohne neue Information;
- ein Diagramm statisch bereits alles erklärt;
- ein starkes Bild emotionaler und merkbarer ist;
- Bewegung nur eingebaut wird, weil Phase B Animation erlaubt.

**Schwache Animation → durch Bild, Diagramm, Vergleich oder statischen Explainer ersetzen.**

## Bild + Remotion nur ohne Überlappung

Hybrid ist nur zulässig, wenn Bild und Motion unterschiedliche Jobs haben.

Beispiel gut:
- Bild = konkrete Einkaufssituation;
- Motion = exakte Preisentwicklung über Zeit.

Beispiel schlecht:
- Bild = kleiner werdender Einkauf;
- Motion = nochmals kleiner werdender Einkauf.

Vor Hybrid festlegen:
- `IMAGE_JOB:`
- `MOTION_JOB:`
- `OVERLAP_CHECK:` PASS

Wenn die Jobs gleich sind: nur die stärkere Ebene behalten.

## Reine Remotion darf Full-Frame sein

Reine Animationen dürfen die komplette 1920×1080-Fläche nutzen.

- nicht in das kleine Flow-Fenster zwängen;
- Überschrift/Icon als Teil der Full-Frame-Komposition integrieren;
- kritische Inhalte mindestens ca. 64 px vom Rand;
- keine wichtigen Elemente außerhalb des Frames;
- kein unbeabsichtigtes Clipping/Cropping;
- Fläche sinnvoll nutzen, statt nur einen kleinen Block in die Mitte zu stellen.

## Keine Quoten

Es gibt keine Zielquote für Animationen oder Hybrid-Szenen.

Die Mischung folgt dem Script. Ein Video mit vielen starken Bildern und wenigen guten Animationen ist besser als ein Video mit vielen mittelmäßigen Animationen.

## Visual-Vielfalt

Motion ist nur eine Visualfamilie unter mehreren.

Abwechseln, wenn es inhaltlich hilft:
- 3D-Storybild;
- konkretes Beispiel;
- Vorher/Nachher;
- Side-by-Side-Vergleich;
- Diagramm;
- Chart;
- Beispielrechnung;
- Timeline;
- Infokarte;
- Ursache/Wirkung-Schema;
- echte Quelle;
- Motion-Prozess.

Keine mechanische Wiederholung derselben Balken-, Karten- oder Geldfluss-Animation.

## Menschen und Abstraktion

Menschen nur wenn Reaktion, Entscheidung, Aufmerksamkeit oder Konsequenz erklärt werden. Wiederholte Mensch+Fragezeichen-Schablonen vermeiden.

Abstrakte Balken/Blöcke/Schemata nur wenn sie klarer erklären. Wenn ein statisches Beispiel oder Diagramm stärker ist, dieses bevorzugen.

## Standard-Bausteine

- BigNumber
- Comparison
- Percentage
- BarChart
- LineChart
- Timeline
- MoneyFlow
- ProcessSteps
- SimpleDiagram
- HighlightText
- Allocation
- Formula

Diese Bausteine dürfen **statisch oder animiert** gedacht werden. Animation nur, wenn der zeitliche Aufbau Mehrwert hat.

## Standard-Motion

- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Meist reicht eine Hauptbewegung plus kleine Fokusbewegung.

## Source-Regeln

Produktive `animation.tsx`:
- `useCurrentFrame()`;
- sichtbare Bewegung mit `interpolate()` und/oder `spring()`;
- deterministisch;
- keine TODOs/Platzhalter;
- kein `Math.random()`, `Date.now()`, Timer oder Runtime-Fetch;
- keine CSS animation/transition als Ersatz für Remotion-Motion;
- exportiert die in `visual-index.json` genannte Komponente.

## Bildwelt

Wenn Flow genutzt wird:

`config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt`

Referenz:
`youtube/warum-dein-geld-verschwindet-images-only`

Keine Änderung der freigegebenen Bildwelt durch Hybrid-Planung.

## Qualitätsprüfung

1. Hauptgedanke in 1–2 Sekunden verständlich?
2. Was wäre die beste statische Alternative?
3. Erklärt Bewegung etwas, das statisch schlechter wäre?
4. Wenn nein: Animation entfernen.
5. Wenn Hybrid: unterschiedliche Jobs ohne semantische Doppelung?
6. Ist ein Diagramm/Beispiel/Vergleich stärker?
7. Wiederholt die Szene eine Animation der letzten Szenen?
8. Nutzt reine Motion die Fläche sinnvoll?
9. Ist nichts Wichtiges abgeschnitten?
10. Sind Texte/Zahlen groß und exakt lesbar?
11. Wenn Flow: korrekte 3D-Bildwelt und Flow-Bild nicht fullscreen?

## Kurzregel

> **Phase B = earned motion. Erst die stärkste statische Visualisierung suchen. Animation nur, wenn Bewegung wirklich besser erklärt. Hybrid nur mit getrennten Jobs.**
