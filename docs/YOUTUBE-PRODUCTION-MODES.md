# FinanzNeo — YouTube Production Modes V2

## Gemeinsame Basis

Beide Modi verwenden dieselbe freigegebene Bildwelt:

`finanzneo-youtube-grounded-3d-black-v1`

Referenzprojekt für den Stil:

`youtube/warum-dein-geld-verschwindet-images-only`

Die Bildwelt wird nicht neu erfunden. Flow-Bilder bleiben premium stylized 3D animation-film, deep-black FinanzNeo-Welt, wenige große lesbare Elemente, keine Photorealistik, kein Corporate-3D, kein Katalog-/Tabletop-Default.

## Thumbnail — harte Regel

Ein finales YouTube-Thumbnail ist **niemals textlos** und wird ab jetzt direkt mit seinem finalen Hook-Text erzeugt.

- kurze starke Headline, normalerweise 2–6 Wörter;
- der exakte Text wird bereits im Flow-Thumbnail-Prompt fest vorgegeben;
- Motiv und Headline werden von Anfang an gemeinsam komponiert; kein leeres Typografie-Feld für später;
- fehlender, falsch geschriebener, verzerrter oder unlesbarer Text = dasselbe Thumbnail neu erzeugen;
- erst nach korrekt lesbarer Headline darf zum nächsten Flow-Bild weitergegangen werden;
- die Regel, dass wichtige Texte/Zahlen in Remotion entstehen, gilt weiterhin für **In-Video-Erklärtext**; das Thumbnail ist die bewusste Ausnahme.

## Phase A — `images-only`

Phase A bleibt vollständig statisch.

Erlaubt:
- `image` / 3D-Storybild;
- `hybrid` / 3D-Bild + statische Remotion-Labels, Pfeile, Zahlen oder Vergleiche;
- `data` / statische Zahl, Rechnung, Mini-Chart oder Schema;
- `real-asset`.

Nicht erlaubt:
- Frame-zu-Frame-Bewegung;
- animierte Charts/Zahlen;
- Kamerafahrten, Fades, Zooms, Slides oder andere Motion.

Flow-Bilder bleiben im eingebetteten Visualfenster und niemals fullscreen.

## Phase B — `hybrid`

Phase B ist **nicht einfach „mehr Remotion“**. Pro Sprechpunkt wird die stärkste Form gewählt:

1. **Bild** — konkrete 3D-Szene, wenn Situation, Emotion oder Alltag die beste Denkstütze ist.
2. **Bild + Remotion** — Bild liefert Kontext, Remotion ergänzt eine andere, nicht redundante Aufgabe.
3. **Reine Remotion** — Zahl, Vergleich, Entwicklung, Prozess oder Aufteilung ist ohne Bild klarer.
4. **Echtes Asset** — Realität oder Quellenbeleg ist wichtig.

Es gibt keine Motion- oder Hybrid-Quote. Der Inhalt entscheidet.

## Menschen-Regel

Menschen/Figuren nur verwenden, wenn ihre **Reaktion, Entscheidung, Aufmerksamkeit oder Konsequenz** die Aussage klarer macht. Keine wiederholte `Mensch + Fragezeichen`-Schablone und nicht automatisch mehrere Menschenszenen hintereinander.

## Abstraktions-Regel

Abstrakte Balken, Blöcke, Wege und Schemen sind erlaubt, aber nur wenn sie wirklich erklären. Wenn ein konkretes Beispiel, Diagramm oder Storybild dieselbe Aussage schneller vermittelt, gewinnt die statische Lösung.

## Vollfläche bei Animationen

Für Phase B gilt:

- reine Remotion-Animationen und Datenszenen dürfen die **komplette 1920×1080-Fläche** als Motion-Canvas nutzen;
- sie werden nicht künstlich in das kleine Flow-Visualfenster gezwängt;
- Überschrift und Icon dürfen innerhalb der Full-Frame-Komposition in der oberen Safe Area liegen und dürfen die Motion-Fläche nicht unnötig verkleinern;
- wichtige Texte, Zahlen und Hauptobjekte bleiben mindestens ca. 64 px von allen Außenkanten entfernt;
- nichts Wichtiges darf unbeabsichtigt abgeschnitten oder geclippt sein;
- die komplette Fläche ist verfügbar, aber nicht jedes Element muss bis an den Rand reichen — Lesbarkeit entscheidet.

Für `image + Remotion`:
- das Flow-Bild selbst bleibt contained und nicht fullscreen;
- Remotion-Elemente dürfen bei Bedarf über das Bildfenster hinaus die ganze Szene nutzen;
- Overlay und Bild werden als eine gemeinsame Komposition geplant;
- Bild und Motion müssen verschiedene Jobs haben.

## Entscheidungsregel

```text
Was muss der Zuschauer verstehen oder erinnern?
→ konkrete Situation / Emotion / Alltag? → BILD
→ konkrete Situation + zusätzliche zeitliche/exakte Erklärung? → BILD + REMOTION
→ Zahl / Vergleich / Prozess / Entwicklung ohne Kontextbild klarer? → REMOTION
→ reale Quelle / Website / Dokument nötig? → REAL ASSET
```

## Kurzregel

> Phase A = statisch. Phase B = stärkstes Medium pro Beat. Reine Animation darf Full-Frame sein; Flow-Bilder bleiben contained. Thumbnail wird direkt mit finaler korrekter Schrift erzeugt.
