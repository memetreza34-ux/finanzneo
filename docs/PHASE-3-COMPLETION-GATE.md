# FinanzNeo Phase 3 — Hard Completion Gate

Ein technisch erfolgreiches Remotion-Render ist **kein** fertiges Reel.

Dieses Dokument verhindert genau diese Fehlerklasse:

- MP4 existiert, aber Bildszenen sind leer
- nur Untertitel/SceneHeader sind sichtbar
- einzelne Nutzerbilder wurden nicht eingebunden
- Animationsszenen wurden geplant, aber nicht wirklich gebaut
- eine statische/leere Ersatzfläche wird als Animation ausgegeben
- ein alter oder anderer Render wird exportiert

## Statusmodell

Phase 3 läuft verbindlich durch diese Zustände:

```text
READY_FOR_PHASE3
→ IMPLEMENTING
→ READY_TO_RENDER
→ PHASE3_CANDIDATE
→ RENDER_QA_PASSED
→ FINAL_RENDER
→ FINAL_COMPLETE
```

`FINAL_COMPLETE` darf ausschließlich nach erfolgreichem `reel:export` gemeldet werden.

## 1. Vor der Implementierung

Phase 2 muss vollständig sein:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Danach einmalig das Produktionsmanifest erzeugen:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
```

Datei:

```text
05-projektdateien/phase3-production-manifest.json
```

## 2. Jede Szene muss einzeln belegt werden

Im Produktionsmanifest existiert für jede `scene-index.json`-Szene exakt ein Eintrag.

### Bildszene

Pflicht:

- `implemented: true`
- korrekter `sourceImageFileName`
- echter existierender `assetPath`
- `startFrame` + `durationFrames`
- `visualLayerRequired: true`
- `captionOnlyForbidden: true`

### Animationsszene

Pflicht:

- `implemented: true`
- echter `componentPath`
- echter `componentExport`
- Komponentendatei existiert und enthält keinen TODO/Platzhalter
- `startFrame` + `durationFrames`
- `visualLayerRequired: true`
- `captionOnlyForbidden: true`

Zusätzlich müssen Audio-, Caption- und SceneHeader-Layer im Manifest als implementiert bestätigt sein.

Erst danach:

```json
"status": "READY_TO_RENDER"
```

## 3. Preflight vor jedem Finalrender

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
```

Der Preflight blockiert unter anderem:

- fehlende Szene
- falsche Reihenfolge
- `implemented: false`
- fehlendes Bildasset
- fehlende Animationskomponente
- leere/TODO-Animationsdatei
- fehlende Start-/Dauerframes
- Timeline-Lücken
- fehlende Audio-/Caption-/Header-Layer

## 4. Finalrender nur über `reel:render`

Verboten für produktive Reels:

```bash
npx remotion render ...
```

als finalen Abschluss direkt zu verwenden.

Stattdessen:

```bash
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

Der Render läuft zunächst nur als:

```text
*.phase3-candidate.mp4
```

Eine Candidate-Datei ist **niemals** ein finales Reel.

## 5. Automatische Post-Render-Visual-QA

Nach erfolgreichem Candidate-Render prüft das System automatisch jede Szene.

### Für jede Bildszene

Ein Frame aus der mittleren Visualzone wird geprüft. Die Visualzone muss echte Bildstruktur besitzen. Ein fast leerer dunkler Hintergrund mit nur Untertiteln/Headline reicht nicht.

### Für jede Animationsszene

Mehrere Frames innerhalb der Szene werden geprüft:

- sichtbare Struktur in der Visualzone
- messbare Veränderung zwischen den Frames

Eine praktisch statische/leere Animationsszene besteht die QA nicht.

Zusätzlich werden geprüft:

- 1080×1920
- Videodauer passt zur Produktions-Timeline
- alle geplanten Szenen sind im QA-Bericht enthalten
- exakter SHA-256-Hash des geprüften Videos
- Hash von `scene-index.json`
- Hash des Produktionsmanifests

QA-Bericht:

```text
05-projektdateien/phase3-render-qa.json
```

Bei Fehler:

```text
status = FAILED
Reel = NOT_COMPLETE
Candidate wird nicht als Finaldatei freigegeben
```

Bei Erfolg:

```text
status = PASSED
Candidate wird erst danach zum finalen MP4 umbenannt
```

## 6. Export ist ein zweites Hard Gate

```bash
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Export wird blockiert, wenn:

- Render-QA fehlt
- QA nicht `PASSED` ist
- eine Szene im QA-Bericht fehlt/failed ist
- Video-Hash nicht exakt zum geprüften Render passt
- `scene-index.json` nach QA verändert wurde
- Produktionsmanifest nach QA verändert wurde

Damit kann weder ein alter Render noch eine unvollständige MP4 versehentlich als Upload-Paket ausgegeben werden.

## 7. Fertig-Meldung

Ein Phase-3-Agent darf **nicht** schreiben „fertig“, „final“, „done“ oder einen MP4-Pfad als Endergebnis ausgeben, solange nicht alle folgenden Punkte erfüllt sind:

```text
reel:ready              PASS
phase3 manifest         READY_TO_RENDER
phase3 preflight        PASS
candidate render        SUCCESS
post-render visual QA   PASSED
final MP4               freigegeben
reel:export             PASS
06-export/              vollständig
```

Insbesondere gilt:

> Untertitel allein sind niemals eine vollständige Szene, wenn `scene-index.json` ein Bild oder eine Animation verlangt.

> Eine vorhandene MP4-Datei ist kein Fertigkeitsnachweis.
