# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle. Diese Datei enthält nur aktuelle Arbeits-Prompts und wiederholt keine alten Produktionsversionen.

## 1. Vor einem Reel lesen

```text
CLAUDE.md
config/finanzneo-production-standard.json
reels/PRODUKTIONSSTANDARD.md
docs/PHASE-1-BRIEFING.md
docs/3-PHASEN-WORKFLOW.md
docs/PHASE-1-ANIMATION-CODE-STANDARD.md
docs/PHASE-3-COMPLETION-GATE.md
```

## 2. Phase 1 — Reel vorbereiten

```text
Erstelle Phase 1 für:
reels/<Woche>/<Tag>/<Reel>

Pflicht:
- Fakten prüfen und Quellen notieren
- Script in echte Sprechgedanken teilen
- pro Gedanken einen sichtbaren Visual Beat planen
- IMAGE oder ANIMATION pro Szene festlegen
- scene-01 ist Bildszene und automatisch Cover
- kein Bild 00
- natürliche Überschrift + passendes Linien-Icon ab scene-02
- Captions für jedes gesprochene Wort planen
- V9-Flow-Prompts individuell schreiben
- für jede ANIMATION die finale animation.tsx bereits in Phase 1 erstellen
- Animationsmechanik: START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → HOLD
- keine Platzhalter hinterlassen
- genau eine universelle Social-Caption in 04-caption/caption.txt
```

## 3. Google-Flow-Bildprompt — Reel V9

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Beat:
[BEAT]

Verbindlich:
- echte Alltagssituation und Ursache/Wirkung zuerst
- WORLD LOCK: finanzneo-stylized-3d-animated-black-v9
- klar stylized 3D animated, niemals fotorealistisch
- deep-black Hintergrund
- wenige große verständliche Elemente
- kurze deutsche Objektlabels nur wenn nötig
- keine Headline, keine Caption, kein CTA im Bild
- kein Dashboard, App-UI, Flowchart, Microchip-Look, Produktfoto oder Clutter
- finalen Dateinamen nennen
- Bildnummer = echte Szenennummer
```

## 4. Google Flow — Strict Single Job

```text
1. aktuellen Bildblock lesen
2. GENAU EIN Bild starten
3. vollständig warten
4. sofort exakt umbenennen
5. V9-QA
6. bei Fehler dieselbe Bildnummer wiederholen
7. erst nach PASS nächsten Bildblock starten

Nie Batch, Paralleljobs oder Queue.
scene-01 ist das Cover. Kein separater Bild-00-Job.
Animationsszenen erzeugen kein Flow-Bild.
```

## 5. Phase 3 — Reel integrieren

```text
Mach Phase 3 für:
reels/<Woche>/<Tag>/<Reel>

1. npm run reel:ready -- <Reel-Pfad>
2. Bei FAIL: STOP. Nichts ersetzen oder erfinden.
3. phase3Executor aus scene-index.json respektieren.
4. npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
5. Bildszene = exaktes Nutzerbild.
6. Animationsszene = exakte versiegelte animationSourceFile + animationExport.
   customAnimations vollständig auf den versiegelten Export binden; fehlendes Binding = harter Fehler.
7. Hintergrund immer statisch #000000.
8. Layout ausschließlich aus REEL_STYLE.
9. npm run reel:phase3:preflight -- <Reel-Pfad>
10. npm run reel:render -- <Manifest>
11. Visual QA + Post-Render-QA bestehen lassen.
12. Erst danach final exportieren.
```

Strikt verboten:

```text
Ersatzanimationen
Dummy-/Debug-Bewegung
Math.sin/Math.cos-QA-Wackeln
Remote-Assets beim Render
FNBgParticles / FNBgAurora / FNBgGrid / FNBgRadial als Reel-Hintergrund
Background-Motion als Animationsersatz
Caption-only-/Header-only-Szenen
Candidate-MP4 als final ausgeben
versiegelte animation.tsx in Phase 3 verändern
```

## 6. YouTube Longform

Vor YouTube lesen:

```text
config/finanzneo-youtube-visual-system.json
docs/YOUTUBE-PRODUCTION-MODES.md
youtube/PRODUKTIONSSTANDARD.md
docs/YOUTUBE-LONGFORM-WORKFLOW.md
```

### Mode A — images-only

```text
Fertige 16:9-Szene:
Überschrift + Icon + eingebettetes Flow-Bild.
Keine Animation.
Flow-Bild niemals fullscreen.
```

### Mode B — hybrid

```text
Dasselbe Layout wie Mode A.
Zusätzlich Remotion, Daten, Charts, Animation und echte Assets erlaubt.
Flow-Bild ebenfalls niemals fullscreen.
```

## 7. Echte Daten für Remotion

```text
Daten nie live im finalen Render laden.
Vorher mit scripts/fetch-data.mjs holen.
Lokalen Snapshot unter public/data/ speichern.
Quelle, Serien-ID, Stand und URL mitführen.
Dann npm run data:validate.
```

Details: `docs/DATA-PIPELINE.md`.
