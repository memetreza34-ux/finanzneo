# FinanzNeo — YouTube-Longform-Produktionsstandard V2

> Bei Widersprüchen gilt `CLAUDE.md`. Für Visualwahl gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`. Für Modi/Layout gilt `docs/YOUTUBE-PRODUCTION-MODES.md`. Für Flow-Storyboard gilt `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`. Für Motion gilt `docs/YOUTUBE-MOTION-V4-SIMPLE.md`.

## Ziel

FinanzNeo ist ein seriöser Simple-Finance-Explainer mit klaren, merkbaren Visuals. Der Zuschauer soll einen Gedanken schnell verstehen und erinnern können. Toolwahl ist nachgeordnet.

## Format

- YouTube Longform, 1920×1080, 30 fps
- Länge folgt dem Thema, keine Füllpassagen
- Hook ohne langes Intro
- einfache Sprache
- konkrete Beispiele
- Zahlen/Annahmen prüfbar dokumentieren

## Gemeinsame Bildwelt

`IMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1`

Referenzprojekt:

`youtube/warum-dein-geld-verschwindet-images-only`

Pflicht:
- premium stylized 3D animation-film rendering
- deep-black FinanzNeo-Welt
- hochwertige gerundete Geometrie
- sichtbar stilisiert, niemals photorealistisch
- stilisierte Figuren nur wenn sinnvoll
- keine blanken Faceless-Mannequins
- kein Corporate-3D-/Katalog-/Tabletop-Default

Die Bildwelt wird nicht verändert, nur weil sich die Visual-Logik ändert.

## Thumbnail — Pflicht vor Export

Ein finales Thumbnail ohne Schrift ist nicht freigabefähig.

- kurze starke Headline, normalerweise 2–6 Wörter
- Headline muss im finalen `thumbnail.png` sichtbar sein
- bevorzugt exakte Typografie im finalen Thumbnail-Layout
- Flow darf kurze Headline nur erzeugen, wenn sie exakt korrekt ist
- falscher/fehlender/unlesbarer Text = neu bauen

## Phase A — statisch

Phase A / `images-only` enthält keine Frame-Animation.

Erlaubt:
- 3D-Storybild
- 3D-Bild + statische Remotion-Info
- statische Zahl/Vergleich/Chart/Scheme
- echtes Asset

Flow-Bilder bleiben in einem contained Visualfenster, niemals fullscreen.

## Phase B — Hybrid

Phase B / `hybrid` ist **nicht „Remotion zuerst“**. Pro Beat wird die beste Form gewählt:

1. **Bild** — Alltag, Emotion, Situation, konkrete Ursache/Wirkung
2. **Bild + Remotion** — Bild liefert Kontext, Remotion erklärt Zahl/Pfeil/Geldfluss/Veränderung
3. **Reine Remotion** — Zahl, Prozess, Vergleich, Entwicklung oder Aufteilung ist ohne Bild klarer
4. **Echtes Asset** — Quelle/Website/Dokument/realer Beleg

### Weiche Balance

Kein harter Zwang, aber typischer Startpunkt:
- 25–40 % Bild
- 30–50 % Bild + Remotion
- 20–35 % reine Remotion

Wenn der Inhalt anderes verlangt, darf die Mischung abweichen. Ziel ist, reine Remotion nicht automatisch dominieren zu lassen.

## Menschen-Regel

Menschen nur, wenn Reaktion, Entscheidung, Aufmerksamkeit oder Konsequenz den Gedanken klarer macht.

- kein Mensch als Dekoration
- keine wiederholte `Mensch + Fragezeichen`-Schablone
- nicht mehrere ähnliche Menschenszenen direkt hintereinander
- weiche Orientierung: ungefähr maximal 40 % Menschenszenen, außer die Story braucht mehr

## Abstraktions-Guard

Abstrakte Balken, Blöcke, Wege und Schemen sind Werkzeuge, kein Default.

- nur verwenden, wenn sie schneller erklären
- wenn ohne Voiceover unklar: konkreten Anker ergänzen
- Bild + Remotion bevorzugen, wenn konkrete Szene + exakte Erklärung zusammen stärker sind
- mehrere abstrakte Schemata direkt hintereinander vermeiden, wenn das Video dadurch monoton oder schwer merkbar wird

## Full-Frame-Regel für Phase B

### Reine Remotion

Reine Remotion-Animationen dürfen die **komplette 1920×1080-Fläche** nutzen.

- nicht künstlich in das kleine Flow-Fenster zwängen
- Überschrift/Icon dürfen in die Full-Frame-Komposition integriert werden
- kritische Inhalte mindestens ca. 64 px vom Rand
- nichts Wichtiges darf abgeschnitten, geclippt oder außerhalb des Frames animiert werden
- volle Fläche soll sinnvoll genutzt werden, nicht nur zentral ein kleiner Block schweben

### Bild + Remotion

- Flow-Bild selbst bleibt contained, nie fullscreen
- Remotion darf über das Bildfenster hinaus in die gesamte Szene greifen
- Pfeile, Zahlen, Highlights, Geldfluss und Labels dürfen Bild und restlichen Frame verbinden
- Bild und Motion werden als eine gemeinsame Komposition geplant

## Visualplanung

```text
Sprechpunkt
→ Was muss verstanden oder erinnert werden?
→ konkrete Szene besser? → Bild
→ konkrete Szene + zeitliche/exakte Erklärung besser? → Bild + Remotion
→ Zahl/Prozess/Entwicklung allein klarer? → Remotion
→ reale Quelle nötig? → echtes Asset
```

Es gibt keine feste Visualzahl. Ein Flow-Bild trägt normalerweise 1 dominanten Gedanken und 1–2 kurze Voiceover-Sätze.

## Flow-Prompting

Jeder finale Flow-Block enthält:
1. `FINAL FILE NAME`
2. `VOICEOVER CONTEXT`
3. `SCENE`
4. `IMPORTANT GERMAN OBJECT LABELS`
5. `OBJECTS`
6. `VISUAL STORYTELLING`
7. `COMPOSITION`
8. `MATERIALS`
9. `BACKGROUND`
10. `LIGHTING`
11. `COLOR LANGUAGE`
12. `TEXT`
13. `FORBIDDEN`

Flow soll Situation/Story erzeugen, nicht exakte Erklärungstypografie.

## Motion

Motion bleibt deterministisch und frame-getrieben:
- `useCurrentFrame()`
- `interpolate()` und/oder `spring()`
- keine CSS animation/transition als Render-Motion
- kein Runtime-Fetch, `Math.random()`, `Date.now()`, Timer

Bevorzugte einfache Presets:
- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Fortgeschrittene Motion nur mit inhaltlichem Grund.

## Audio

Für beide Modi:
- Voiceover ca. 1,10×
- unnötig lange Pausen kürzen
- verarbeitetes Voiceover ist Timing-Autorität
- Wort-Timings/Captions/Visual-Timeline daraus ableiten
- Musik/SFX nicht mitbeschleunigen
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## QA vor Freigabe

1. Hauptaussage in 1–2 Sekunden verständlich?
2. Nur ein dominanter Gedanke?
3. Braucht die Szene wirklich einen Menschen?
4. Ist das Visual unnötig abstrakt?
5. Wäre Bild + Remotion stärker als nur Bild oder nur Remotion?
6. Wenn Remotion: Fläche sinnvoll genutzt, nichts abgeschnitten?
7. Wenn Flow: exakt freigegebene Bildwelt?
8. Wenn Thumbnail: finale Schrift sichtbar und lesbar?
9. Exakte Texte/Zahlen korrekt?
10. Wiederholt die Szene unnötig die letzten Visuals?

## Validierung

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

`youtube:ready` bleibt Gate vor Phase 3.
