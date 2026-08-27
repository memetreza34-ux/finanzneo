# FinanzNeo Phase 3 — Hard Completion Gate

Ein technisch erfolgreiches Remotion-Render ist **kein** fertiges Reel.

Dieses Dokument verhindert genau diese Fehlerklasse:

- MP4 existiert, aber Bildszenen sind leer
- nur Untertitel/SceneHeader sind sichtbar
- einzelne Nutzerbilder wurden nicht eingebunden
- Animationsszenen wurden geplant, aber nicht wirklich gebaut
- eine Ersatz-/Debugbewegung wird als fertige Animation ausgegeben
- Phase 3 ersetzt die kreative Phase-1-Animation durch einen eigenen Hack
- ein alter oder anderer Render wird exportiert

## Statusmodell

```text
READY_FOR_PHASE3
→ PHASE1_ANIMATIONS_SEALED
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

`reel:ready` prüft Phase 1 + 2 und versiegelt jede produktionsreife Phase-1-Animationsquelle in:

```text
05-projektdateien/phase1-animation-seal.json
```

Der Seal enthält den SHA-256-Hash jeder kanonischen `animation.tsx`.

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

Phase 1 ist Eigentümer der kreativen Animation. Phase 3 integriert sie nur.

Pflicht:

- `implemented: true`
- `componentPath` zeigt **exakt** auf `scene.animationSourceFile`
- `componentExport` entspricht **exakt** `scene.animationExport`
- Datei existiert und enthält den produktionsreifen Phase-1-Code
- SHA-256 stimmt mit `phase1-animation-seal.json` überein
- `animationQualityLock = finanzneo-phase1-animation-code-v1`
- `startFrame` + `durationFrames`
- `visualLayerRequired: true`
- `captionOnlyForbidden: true`

Phase 3 darf **keine Ersatzkomponente** anlegen und keinen Phase-1-Code ändern, nur um QA/Frame-Diff zu bestehen.

Zusätzlich müssen Audio-, Caption- und SceneHeader-Layer im Manifest als implementiert bestätigt sein.

Erst danach:

```json
"status": "READY_TO_RENDER"
```

## 3. Preflight vor jedem produktiven Render

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
```

Der Preflight blockiert unter anderem:

- fehlende Szene
- falsche Reihenfolge
- `implemented: false`
- fehlendes Bildasset
- fehlende Animationskomponente
- Animationskomponente weicht von `animationSourceFile` ab
- falscher `componentExport`
- Phase-1-Animationshash wurde nach `reel:ready` verändert
- fehlender Animations-Seal
- leere/TODO-/Placeholder-Animationsdatei
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

V5-Visualzone:

```text
Y = 320–1480
```

Header und Caption werden aus dem QA-Sample bewusst ausgeschlossen, damit eine Caption-/Header-only-Szene nicht als belegt durchgeht.

### Bildszene

Ein Frame aus dem visuellen Kern wird geprüft. Ein fast leerer dunkler Hintergrund mit nur Untertitel/Headline reicht nicht.

### Animationsszene

Mehrere Frames werden geprüft:

- sichtbare Struktur im visuellen Kern
- messbare Veränderung zwischen den Frames

Wichtig: Diese Bewegungskontrolle ist **nur ein technisches Zusatzgate**. Sie ersetzt nicht den Phase-1-Animationscode-Vertrag. Sinnlose Dauerbewegung, Debug-Boxen oder Wackel-Hacks bleiben verboten, auch wenn sie Pixel verändern.

Zusätzlich werden geprüft:

- 1080×1920
- Audio-Stream vorhanden
- Videodauer passt zur Produktions-Timeline
- alle geplanten Szenen im QA-Bericht
- exakter SHA-256-Hash des Videos
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

Ein Phase-3-Agent darf **nicht** „fertig“, „final“ oder „done“ melden, solange nicht alle Punkte erfüllt sind:

```text
reel:ready                 PASS
Phase-1-Animations-Seal    vorhanden
phase3 manifest            READY_TO_RENDER
phase3 preflight           PASS
candidate render           SUCCESS
post-render visual QA      PASSED
final MP4                  freigegeben
reel:export                PASS
06-export/                 vollständig
```

Insbesondere gilt:

> Untertitel allein sind niemals eine vollständige Szene, wenn `scene-index.json` ein Bild oder eine Animation verlangt.

> Eine vorhandene MP4-Datei ist kein Fertigkeitsnachweis.

> Eine bewegte Ersatzkomponente ist keine gültige Animation. Für Animationsszenen zählt ausschließlich der versiegelte Phase-1-Animationscode.
