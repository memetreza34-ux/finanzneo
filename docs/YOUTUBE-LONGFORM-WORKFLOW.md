# FinanzNeo — YouTube-Longform in drei Phasen

> Bei Widersprüchen gilt `CLAUDE.md`. Für YouTube-Motion gilt `docs/YOUTUBE-MOTION-V4-SIMPLE.md`. Für Visualwahl gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

YouTube-Longform ist ein eigenständiges Format. Ein Reel wird weder gestreckt noch als YouTube Short gespiegelt.

## Leitprinzip

```text
Sprechpunkt
→ Was muss verstanden werden?
→ einfachste Visualform
→ Remotion ODER echtes Asset ODER begründetes Flow-Bild
→ nur notwendige Bewegung
```

FinanzNeo Longform soll wie ein klarer Finance-Explainer funktionieren: seriöse, anfängerfreundliche Erklärung; konkrete Beispiele; große lesbare Informationen; wenige visuelle Elemente; einfache wiederverwendbare Motion.

## Phase 1 — ChatGPT bereitet vollständig vor

ChatGPT erstellt im YouTube-Projektordner ohne offene Platzhalter:

- Briefing, Lernziel, Kernversprechen und konkrete Zuschauerfrage
- geprüfte Recherche, Quellen, Datenstand, Annahmen und Rechenwege
- Hook, Kapitel-Dramaturgie und Retention-Plan
- vollständiges deutsches Voiceover-Skript
- gesprochene Gedanken und sichtbare Visual Beats
- für jeden Beat zuerst `message`: Was muss der Zuschauer verstehen?
- danach die einfachste Visualart: `animation`, `data`, `image`, `hybrid` oder `real-asset`
- `assetSource`: `remotion`, `real-asset` oder `google-flow`
- `reason`: Warum ist genau diese Darstellung die einfachste klare Erklärung?
- bei Flow zusätzlich `flowReason`
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

Nur bei konkreten Alltagssituationen, die als Bild schneller verstanden werden, z. B. kaputtes Haushaltsgerät + Rechnung, Einkauf/Inflation oder Miet-/Versicherungssituation.

Pflichtfrage vor Flow:

> Kann Text, Zahl, Icon, Chart, Diagramm, Screenshot oder echtes Asset diesen Punkt gleich gut oder besser erklären?

**Ja → kein Flow. Nein → Flow mit konkreter `flowReason`.**

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

Wichtig: Diese Datei enthält nur Thumbnail und **bereits als notwendig eingestufte Flow-Bilder**. Nicht jeder Sprechpunkt braucht ein KI-Bild.

Flow arbeitet strikt:

```text
GENAU EIN BILD
→ VOLLSTÄNDIG WARTEN
→ EXAKT UMBENENNEN
→ KLARHEIT + EINFACHHEIT + 16:9 + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

- Bildwelt: `finanzneo-youtube-simple-editorial-v1`
- einfache 2D/2.5D-Editorial-Illustration
- wenige große Objekte
- kein obligatorischer schwarzer 3D-Raum
- keine Headline oder wichtige Zahl im generierten Bild
- erklärende Texte/Zahlen später in Remotion
- keine Fake-App, Fake-Website oder KI-Nachbildung realer Dokumente
- Fehlerhafte Bildnummer wiederholen; nie Batch/parallel
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
