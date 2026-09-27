# FinanzNeo — YouTube-Longform in drei Phasen

> Bei Widersprüchen gilt `CLAUDE.md`. Für Flow-Storyboard/Prompting gilt `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`. Für YouTube-Motion gilt `docs/YOUTUBE-MOTION-V4-SIMPLE.md`. Für Visualwahl gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

YouTube-Longform ist ein eigenständiges Format. Ein Reel wird weder gestreckt noch als YouTube Short gespiegelt.

## Leitprinzip

```text
Sprechpunkt
→ genau ein Hauptgedanke
→ normalerweise 1–2 kurze Sätze pro Flow-Bild
→ einfachste Visualform
→ Remotion ODER echtes Asset ODER begründetes Flow-Bild
→ nur notwendige Bewegung
```

FinanzNeo Longform soll wie ein klarer Finance-Explainer funktionieren: seriöse, anfängerfreundliche Erklärung; konkrete Beispiele; große lesbare Informationen; wenige visuelle Elemente; einfache wiederverwendbare Motion.

**Simple-first betrifft die Erklärlogik und Komposition. Wenn Google Flow gewählt wird, bleibt die freigegebene premium stylized 3D FinanzNeo-Bildwelt verbindlich. Simple bedeutet nicht langweilig.**

## Phase 1 — ChatGPT bereitet vollständig vor

ChatGPT erstellt im YouTube-Projektordner ohne offene Platzhalter:

- Briefing, Lernziel, Kernversprechen und konkrete Zuschauerfrage
- geprüfte Recherche, Quellen, Datenstand, Annahmen und Rechenwege
- Hook, Kapitel-Dramaturgie und Retention-Plan
- vollständiges deutsches Voiceover-Skript
- gesprochene Gedanken und sichtbare Visual Beats
- für jeden Beat zuerst `message`: Was muss der Zuschauer verstehen?
- für Flow-Beats normalerweise nur 1–2 kurze Voiceover-Sätze mit genau einem dominanten Gedanken
- längere Multi-Idea-Blöcke in mehrere Visuals aufteilen
- danach die einfachste Visualart: `animation`, `data`, `image`, `hybrid` oder `real-asset`
- `assetSource`: `remotion`, `real-asset` oder `google-flow`
- `reason`: Warum ist genau diese Darstellung die einfachste klare Erklärung?
- bei Flow zusätzlich `flowReason`
- bei jedem Flow-Bild eine sichtbare kleine visuelle Geschichte / Ursache-Wirkung statt statischer Produktshot-Anordnung
- für jedes Motion-Visual produktionsreife `animation.tsx`
- Thumbnail-Prompt und Thumbnail-Brief
- vollständiges Publishing-Paket

### Visual-Auswahl

#### Remotion — Default

Nutzen für:

- große Zahlen
- Prozente
- Vergleiche
- Balken/Charts
- Entwicklungen
- Zeitachsen
- Sparraten/Gebühren
- Aufteilungen
- Geldflüsse
- Prozesse
- Rechenbeispiele

#### Echtes Asset

Nutzen für:

- Website
- App
- offizielles Dokument
- Factsheet
- Quellentabelle
- Logo
- reales Produkt

Keine KI-Imitation, wenn das echte Asset verfügbar ist.

#### Google Flow — Ausnahme

Nur bei konkreten Situationen, die als Bild schneller verstanden werden, z. B. Einkauf/Inflation, Miet- oder Nebenkosten, Autoreparatur, Arbeitsplatz/Gehalt oder Versicherungs-/Vertragssituation.

Pflichtfrage vor Flow:

> Kann Text, Zahl, Icon, Chart, Diagramm, Screenshot oder echtes Asset diesen Punkt gleich gut oder besser erklären?

**Ja → kein Flow. Nein → Flow mit konkreter `flowReason`.**

Wenn Flow gewählt wird, wird die Szene als **premium stylized 3D animation-film frame** in der freigegebenen FinanzNeo-Welt gebaut. Keine flache 2D-/Corporate-Illustration.

### Flow-Szenengröße

Kanonische Regel:

> **1 Flow-Bild = 1 Hauptgedanke = normalerweise 1–2 kurze Sätze.**

Wenn sich ein Beat nicht in einem kurzen Satz zusammenfassen lässt, wird er aufgeteilt. Dadurch entstehen lieber mehr einfache, klare Bilder statt weniger überladener Bilder.

### Flow-Storytelling

Vor jedem Flow-Prompt bestimmen:

1. Was ist die sichtbare Ursache?
2. Was ist die sichtbare Folge?
3. Welche physische/räumliche Beziehung macht das verständlich?

Erlaubt und erwünscht sind z. B. Ziehen, Drücken, Blockieren, Schützen, Stapeln, Wachsen, Öffnen, Umwickeln, Ketten, räumliche Progression, diagonale Komposition oder ein echtes lokales Umfeld.

Nicht als Default: Objekt + Dokument + Objekt sauber auf einem Tisch, statischer Produktshot, symmetrische Katalogszene oder grundlos schwebende Props.

### Flow-Prompt-Format

Jeder finale Bildblock ist copy/paste-ready und enthält mindestens:

- `FINAL FILE NAME`
- `VOICEOVER CONTEXT`
- `SCENE`
- `IMPORTANT GERMAN OBJECT LABELS`
- `OBJECTS`
- `VISUAL STORYTELLING`
- `COMPOSITION`
- `MATERIALS`
- `BACKGROUND`
- `LIGHTING`
- `COLOR LANGUAGE`
- `TEXT`
- `FORBIDDEN`

Keine Produktions-Platzhalter bleiben stehen.

### Motion V4 Simple

Motion beginnt mit:

1. `viewerChange` — Was sieht der Zuschauer konkret passieren?
2. `reason` — Warum erklärt diese Bewegung den Punkt?
3. `motionPreset` — einfachste passende Bewegung.

Bevorzugte Presets:

`FADE_IN`, `SLIDE_UP`, `SLIDE_LEFT`, `SCALE_IN`, `COUNT_UP`, `BAR_GROW`, `LINE_DRAW`, `HIGHLIGHT`, `SLOW_ZOOM`.

Wiederverwendbare Muster wie BigNumber, Comparison, Percentage, BarChart, LineChart, Timeline, MoneyFlow, ProcessSteps, SimpleDiagram, Allocation und Formula sind ausdrücklich erwünscht.

Es gibt **keine Variety-/Novelty-Quote**. Wenn derselbe Balkentyp später erneut die beste Erklärung ist, darf er wiederverwendet werden.

Fortgeschrittene Motion benötigt `advancedReason`.

Vor Phase 2:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der V4-Seal bindet Motion-Quelle per SHA-256 sowie Viewer Change, Reason und Motion Preset.

## Phase 2 — Nutzer erstellt nur benötigte Bilder und Audio

Dem Google-Flow-Agenten wird ausschließlich gegeben:

```text
04-visuals/alle-bildprompts.txt
```

Diese Datei ist **ein gemeinsamer Flow-Handoff** und darf mehrere fertige Bildblöcke enthalten. 3, 5, 10 oder mehr Bildblöcke sind möglich; die Anzahl folgt dem Skript und ist nicht fest.

Wichtig: Diese Datei enthält nur Thumbnail und **bereits als notwendig eingestufte Flow-Bilder**. Nicht jeder Sprechpunkt braucht ein KI-Bild.

Flow arbeitet strikt sequenziell:

```text
BILD 01 ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ EXAKT UMBENENNEN
→ KLARHEIT + STORYTELLING + STYLIZED-3D-BILDWELT + 16:9 + DATEINAME PRÜFEN
→ BEI FEHLER BILD 01 ERNEUT ERZEUGEN
→ ERST NACH PASS ZU BILD 02
→ ...
→ NACH DEM LETZTEN GEPLANTEN BILD STOPPEN
```

Nie mehrere Bilder parallel erzeugen. Nie zusätzliche Bilder erfinden.

- Bildwelt: `finanzneo-youtube-grounded-3d-black-v1`
- premium stylized 3D animation-film rendering
- klar animierter 3D-Look, nicht fotorealistisch
- keine flache Editorial-/Corporate-Vektorillustration
- wenige große Objekte und ein dominanter Gedanke
- pro Flow-Bild normalerweise 1–2 kurze Voiceover-Sätze
- sichtbare kleine Geschichte / räumliche Beziehung statt Produktkatalog-Anordnung
- tiefe schwarze FinanzNeo-Welt als dominanter Hintergrund
- nur wenig lokaler Alltagskontext; Umgebung löst sich in Schwarz auf
- weiche hochwertige Geometrie, semi-realistische Materialien, Studio-Licht und Kontakt-Schatten
- kurze deutsche Objektlabels nur bei wichtigen unklaren Objekten
- keine Headline oder wichtige Zahl im generierten Bild
- erklärende Texte/Zahlen später in Remotion
- keine Fake-App, Fake-Website oder KI-Nachbildung realer Dokumente
- fehlerhafte Bildnummer wiederholen
- fertige Flow-Bilder gemeinsam nach `04-visuals/00-ALLE-BILDER-HIER-REIN/`
- alle Flow-Bilder und Thumbnail horizontal 16:9

Echte Assets werden an den im `visual-index.json` geplanten lokalen Pfad gelegt und mit Quelle/Herkunft dokumentiert.

Zusätzlich:

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel in `03-audio/word-timings.json`

Antigravity erzeugt keine fehlenden Nutzerbilder und kein Ersatz-Voiceover.

## Phase 3 — Integration, Retiming, QA und Render

Start:

```bash
npm run youtube:ready -- youtube/<Projekt>
```

Bei erfolgreicher Prüfung:

1. finales Audio, Flow-Bilder und echte Assets einlesen
2. Phase-1-Motion-V4-Seal prüfen
3. Timeline aus Voiceover, Gedanken und Kapiteln ableiten
4. versiegelte Motion integrieren und zum echten Audio retimen
5. erklärende Texte/Zahlen, Untertitel und freigegebene lokale SFX integrieren
6. 1920 × 1080 bei 30 fps rendern
7. Validator, Tests, Typecheck und Render-QA ausführen
8. Bildsatz, Assets, Thumbnail, MP4, Ton und Lautheit prüfen
9. Kapitel-Zeitstempel und Upload-Paket finalisieren

Phase 3 darf eine versiegelte Erklärung nicht heimlich durch eine andere kreative Mechanik ersetzen. Wenn die Visualidee geändert werden muss: zurück zu Phase 1, erneut validieren und versiegeln.

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt mit exakten Pfaden.
