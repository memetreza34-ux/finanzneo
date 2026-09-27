# FinanzNeo — YouTube-Longform-Produktionsstandard V2

> Bei Widersprüchen gilt `CLAUDE.md`. Für Script+Visual-Planung gilt `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`. Für Visualwahl gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`. Für Modi/Layout gilt `docs/YOUTUBE-PRODUCTION-MODES.md`. Für Flow-Storyboard gilt `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`. Für Motion gilt `docs/YOUTUBE-MOTION-V4-SIMPLE.md`.

## Ziel

FinanzNeo ist ein seriöser Simple-Finance-Explainer mit klaren, merkbaren Visuals. Der Zuschauer soll einen Gedanken schnell verstehen und erinnern können. Toolwahl ist nachgeordnet.

## Format

- YouTube Longform, 1920×1080, 30 fps
- Länge folgt dem Thema, keine Füllpassagen
- Hook ohne langes Intro
- einfache Sprache
- konkrete Beispiele
- Zahlen/Annahmen prüfbar dokumentieren

## Script und Visual gemeinsam planen

Das Skript wird nicht erst final geschrieben und danach bebildert.

Jeder Beat muss vor dem Script-Lock bereits eine Visualidee besitzen:

```text
Kernaussage
→ stärkste statische Lösung suchen
→ Bild / Beispiel / Vergleich / Diagramm / Rechnung prüfen
→ nur dann Animation prüfen
→ Hybrid nur bei klarer Aufgabenteilung
→ Voiceover + Visual gemeinsam finalisieren
```

Pflichtfragen pro Beat:
- Was soll verstanden oder erinnert werden?
- Was ist die beste statische Visualisierung?
- Braucht der Gedanke wirklich Bewegung?
- Wenn Motion: was erklärt Bewegung zusätzlich?
- Wenn Hybrid: welche Aufgabe hat das Bild, welche die Motion?
- Wiederholt die Szene unnötig die letzten Szenen?

Kanonisch: `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`.

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

Phase B / `hybrid` bedeutet **Motion ist erlaubt, nicht vorgeschrieben**.

Mögliche Hauptformen:

1. **Starkes Bild** — Alltag, Emotion, Situation, konkrete Ursache/Wirkung
2. **Statischer Explainer** — Diagramm, Vergleich, Rechnung, Chart, Vorher/Nachher, Infokarte
3. **Bild + Remotion** — nur wenn Bild und Motion unterschiedliche Aufgaben haben
4. **Reine Remotion** — nur wenn Veränderung, Prozess oder Reihenfolge in Bewegung klarer ist
5. **Echtes Asset** — Quelle/Website/Dokument/realer Beleg

Es gibt **keine Zielquote** für diese Formen. Keine Animation und kein Hybrid werden eingebaut, nur um eine Mischung zu erfüllen.

## Animation-Gate

Vor jeder Animation muss geprüft werden:

> Ist diese Aussage in Bewegung klarer als als starkes Standbild, Diagramm, Beispiel oder Vergleich?

Animation behalten nur, wenn Bewegung echten Mehrwert liefert, z. B.:
- Veränderung über Zeit
- Reihenfolge / Prozess
- Aufbau / Zerlegung / Verschiebung
- Geldfluss
- zeitlicher Vergleich
- gezielte Blickführung zwischen Zuständen

Wenn eine statische Lösung gleich gut oder besser ist, **statische Lösung wählen**.

Schwache Animationen werden ersetzt, nicht verteidigt.

## Bild + Remotion — Overlap-Guard

Hybrid ist nur gut, wenn die Ebenen verschiedene Jobs haben.

Beispiel gut:
- Bild = konkrete Einkaufssituation
- Remotion = exakter Preisunterschied / Verlauf

Beispiel schlecht:
- Bild zeigt bereits, dass der Einkauf schrumpft
- Animation zeigt darüber nochmals denselben schrumpfenden Einkauf

Regel:

> **Wenn Bild und Motion dieselbe Bedeutung tragen, nur das stärkere Medium behalten.**

Keine Doppel-Erklärung. Keine Overlay-Fläche nur damit sich etwas bewegt.

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
- statisches Diagramm/Beispiel bevorzugen, wenn Bewegung keinen Mehrwert hat
- mehrere abstrakte Schemata direkt hintereinander vermeiden, wenn das Video dadurch monoton oder schwer merkbar wird

## Visual-Vielfalt

Nicht dieselbe Visual-Logik mechanisch wiederholen.

Erlaubte Familien unter anderem:
- 3D-Storybild
- konkretes Beispiel
- Vorher/Nachher
- Side-by-Side-Vergleich
- Diagramm
- Chart
- Beispielrechnung
- Timeline
- Infokarte
- Ursache/Wirkung-Schema
- echte Quelle
- Animation bei echter zeitlicher Veränderung

Vielfalt dient Verständnis und Rhythmus, nicht bloßer Neuheit.

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
- Bild und Motion nur kombinieren, wenn ihre Aufgaben nicht überlappen
- wenn Overlay nur wiederholt, was das Bild bereits erklärt: Overlay entfernen

## Visualplanung

```text
Sprechpunkt
→ Was muss verstanden oder erinnert werden?
→ stärkste statische Form bestimmen
→ konkrete Szene besser? → Bild
→ Beispiel/Vergleich/Diagramm besser? → statischer Explainer
→ braucht der Gedanke echte zeitliche Veränderung? → Remotion prüfen
→ Bild + Motion nur bei klar getrennter Aufgabe
→ reale Quelle nötig? → echtes Asset
→ danach erst Sprechtext final locken
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
3. Wurde Visualform schon beim Script geplant?
4. Ist die stärkste statische Alternative geprüft?
5. Verdient eine Animation ihre Bewegung wirklich?
6. Wenn Hybrid: haben Bild und Motion verschiedene Jobs?
7. Überlappen sich Bild und Motion semantisch? Dann eines entfernen.
8. Ist ein Diagramm/Beispiel/Vergleich stärker als die Animation?
9. Braucht die Szene wirklich einen Menschen?
10. Wiederholt die Szene unnötig die Visual-Logik der letzten Szenen?
11. Wenn Remotion: Fläche sinnvoll genutzt, nichts abgeschnitten?
12. Wenn Flow: exakt freigegebene Bildwelt?
13. Wenn Thumbnail: finale Schrift sichtbar und lesbar?
14. Exakte Texte/Zahlen korrekt?

## Validierung

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

`youtube:ready` bleibt Gate vor Phase 3.
