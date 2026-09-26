# FinanzNeo YouTube Motion V4 — Simple Finance / Balanced Hybrid

`MOTION_STANDARD: finanzneo-youtube-motion-v4-simple`

## Ziel

Ein Gedanke → ein klares Visual → nur so viel Bewegung wie nötig.

Phase B ist nicht automatisch Remotion-first. Die Toolwahl folgt dem Inhalt und der Visual-Selection-Regel.

## Visualwahl in Phase B

Vor Motion immer prüfen:

```text
Was muss verstanden oder erinnert werden?
→ konkrete Situation/Emotion? → Bild
→ Situation + exakte Veränderung/Zahl? → Bild + Remotion
→ Zahl/Prozess/Entwicklung allein klarer? → reine Remotion
→ reale Quelle nötig? → echtes Asset
```

Kanonisch: `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Reine Remotion darf Full-Frame sein

Reine Animationen dürfen die komplette 1920×1080-Fläche nutzen.

- nicht in das kleine Flow-Fenster zwängen;
- Überschrift/Icon als Teil der Full-Frame-Komposition integrieren;
- kritische Inhalte mindestens ca. 64 px vom Rand;
- keine wichtigen Elemente außerhalb des Frames;
- kein unbeabsichtigtes Clipping/Cropping;
- Fläche sinnvoll nutzen, statt nur einen kleinen Block in die Mitte zu stellen.

## Bild + Remotion

Hybrid ist eine vollwertige Hauptform und ausdrücklich erwünscht, wenn beides hilft.

- Flow-Bild liefert konkrete Situation / Erinnerung / Emotion;
- Remotion liefert exakte Zahl, Pfeil, Geldfluss, Highlight, Vergleich oder zeitliche Veränderung;
- Flow-Bild selbst bleibt contained und nie fullscreen;
- Remotion darf über das Bildfenster hinaus die komplette Szene nutzen;
- Bild und Motion als eine Komposition planen.

Hybrid nicht nur nutzen, um ein Bild grundlos zu bewegen.

## Balance

Keine harte Quote. Weiche Orientierung:
- 25–40 % Bild;
- 30–50 % Bild + Remotion;
- 20–35 % reine Remotion.

Wenn der Inhalt anderes verlangt, abweichen. Ziel: kein monotones Remotion-only-Video.

## Menschen und Abstraktion

Menschen nur wenn Reaktion, Entscheidung, Aufmerksamkeit oder Konsequenz erklärt werden. Wiederholte Mensch+Fragezeichen-Schablonen vermeiden.

Abstrakte Balken/Blöcke/Schemata nur wenn sie klarer erklären. Wenn ohne Voiceover unklar, konkreten Anker ergänzen oder Bild+Remotion wählen.

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
2. Bewegung erklärt oder fokussiert wirklich etwas?
3. Wäre Bild+Remotion merkbarer als reine Remotion?
4. Ist die Szene unnötig abstrakt?
5. Wird ein Mensch nur bei echtem Mehrwert eingesetzt?
6. Nutzt reine Motion die Fläche sinnvoll?
7. Ist nichts Wichtiges abgeschnitten?
8. Sind Texte/Zahlen groß und exakt lesbar?
9. Wenn Flow: korrekte 3D-Bildwelt und Flow-Bild nicht fullscreen?

## Kurzregel

> Phase B = content-first: Bild, Bild+Remotion und reine Remotion bewusst mischen. Reine Motion darf Full-Frame sein. Flow bleibt contained. Motion erklärt, statt nur zu dekorieren.
