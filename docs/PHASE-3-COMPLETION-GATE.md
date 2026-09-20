# FinanzNeo Phase 3 — Hard Completion Gate

Ein technisch erfolgreicher Remotion-Render ist **kein** fertiges Reel.

Dieses Gate verhindert insbesondere:

- MP4 existiert, aber Bild-/Animationsszenen sind leer
- nur Untertitel oder Header sind sichtbar
- Nutzerbild wurde nicht eingebunden
- Phase-1-Animation wurde vergessen/ersetzt
- Motion-Core-Reel wurde ohne echte Art-Direction-/Playwright-Sichtprüfung freigegeben
- künstliche Hintergrundbewegung lässt eine leere Szene technisch „bewegt“ wirken
- Partikel/Aurora/Grid werden als Reel-Hintergrund benutzt
- ein alter Candidate-Render wird als final exportiert

## Statusmodell

```text
READY_FOR_PHASE3
→ PHASE1_ANIMATIONS_SEALED
→ IMPLEMENTING
→ VISUAL_QA_PASSED
→ READY_TO_RENDER
→ PHASE3_CANDIDATE
→ RENDER_QA_PASSED
→ FINAL_RENDER
→ FINAL_COMPLETE
```

`FINAL_COMPLETE` ausschließlich nach erfolgreichem `reel:export`.

## 1. Readiness

```bash
npm run reel:ready -- <Reel-Pfad>
```

Phase 1 + Phase 2 müssen vollständig sein. `reel:ready` versiegelt jede kanonische Phase-1-`animation.tsx` per SHA-256.

Fehlende Bilder, finales Audio, Timings oder Animationen werden **nicht** in Phase 3 ersetzt.

Danach:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
```

## 2. Jede Szene einzeln belegen

### Bildszene

Pflicht:

- `implemented: true`
- exakter `sourceImageFileName`
- echter existierender `assetPath`
- `startFrame` + `durationFrames`
- sichtbares Bildvisual
- kein Caption-/Header-only-Ersatz

### Animationsszene

Pflicht:

- `implemented: true`
- `componentPath` = exaktes `scene.animationSourceFile`
- `componentExport` = exaktes `scene.animationExport`
- SHA-256 stimmt mit Phase-1-Seal überein
- echtes Binding in der Composition
- `startFrame` + `durationFrames`

Phase 3 darf keine Ersatzanimation anlegen und den versiegelten Phase-1-Code nicht verändern.

## 3. Pure-Black-Background-Vertrag

Für Reels gilt technisch immer:

```text
Canvas = #000000
statisch
```

Erlaubt sind nur die eigentlichen Szenenobjekte/Bilder/Header/Captions auf diesem Canvas.

Als Hintergrund verboten:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- Partikelfelder
- bewegte Grids
- Aurora-/Glow-Felder
- Hintergrund-Gradienten/Vignetten
- dekorative Hintergrundanimation

Der zentrale `FinanceBackground` ignoriert alte `standard/data/premium`-Varianten und rendert immer Schwarz. Die Props bleiben nur aus Kompatibilitätsgründen bestehen.

## 4. Motion-Core Visual-QA-Gate

Neue Reels mit `finanzneo-motion-core-v1` besitzen:

```text
05-projektdateien/visual-qa.md
```

Vor dem produktiven Render muss die tatsächliche Produktions-Composition in Remotion Studio/Playwright visuell geprüft werden.

Pflichtmarker nach echter Prüfung:

```text
MOTION_ART_DIRECTION=PASS
PLAYWRIGHT_VISUAL_QA=PASS
```

Zusätzlich darf keine Szenenzeile in `visual-qa.md` auf `PENDING` oder `FAIL` stehen.

Der Motion Art Director prüft insbesondere Hero-Größe, Proportionen, Materialität, Tiefe, Perspektive, optische Zentrierung, Blickführung, Kamera und RESULT HOLD.

Playwright Visual QA prüft Animationen mindestens an START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD sowie Bildszenen an einem stabilen repräsentativen Frame.

Diese Marker dürfen niemals nur gesetzt werden, um den Preflight grün zu bekommen.

Legacy-Reels ohne Motion-Core-V1-Marker werden dadurch nicht rückwirkend blockiert.

## 5. Preflight

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
```

Blockiert unter anderem:

- fehlende/unvollständige Szene
- falsches/fehlendes Bildasset
- fehlende Animationsbindung
- falscher Export/Pfad
- veränderter Phase-1-Hash
- Timeline-Lücken
- fehlende Audio-/Caption-/Header-Layer
- verbotene Reel-Hintergrundkomponenten in der Produktions-Composition
- bei Motion-Core-V1: fehlendes Art-Direction-/Playwright-PASS oder offene QA-Szenenzeilen

Bei FAIL darf kein produktiver Render gestartet werden.

## 6. Render nur über Gate

```bash
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

Direktes `npx remotion render ...` ist kein finaler Produktionsabschluss.

Zuerst entsteht nur:

```text
*.phase3-candidate.mp4
```

## 7. Post-Render-QA

Der QA-Sampler schließt Header und Captions aus und prüft den eigentlichen visuellen Kern.

Für jede Bildszene:

- messbare visuelle Struktur
- ausreichend aktive/helle Pixel im Visualbereich
- kein fast komplett schwarzer/leer wirkender Kern

Für jede Animationsszene:

- mehrere strukturierte Samples
- echte Veränderung zwischen Samples
- ausreichend aktive Visualfläche

Zusätzlich prüft ein freier Randbereich jeder Szene:

- Hintergrund bleibt nahe reinem Schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergrundbewegung

Außerdem:

- 1080×1920
- Audio-Stream vorhanden
- Timeline-Dauer korrekt
- exakte Video-/Index-/Manifest-Hashes

QA-Bericht:

```text
05-projektdateien/phase3-render-qa.json
```

Bei Fehler bleibt das Reel `NOT_COMPLETE`; Candidate wird nicht freigegeben.

## 8. Export

```bash
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Export blockiert bei fehlender/fehlgeschlagener QA oder Hash-Abweichung.

## 9. Fertig bedeutet wirklich fertig

```text
reel:ready                 PASS
Phase-1-Animations-Seal    vorhanden
Manifest                   READY_TO_RENDER
Motion Art Direction       PASS (Motion-Core V1)
Playwright Visual QA       PASS (Motion-Core V1)
phase3 preflight           PASS
Candidate render           SUCCESS
Post-render QA             PASSED
Final MP4                  freigegeben
reel:export                PASS
06-export/                 vollständig
```

> Untertitel, Header oder schwarzer Hintergrund allein sind niemals ein gültiges Szenenvisual.

> Hintergrundbewegung ist niemals ein Ersatz für eine Animation.

> Eine vorhandene MP4-Datei ist kein Fertigkeitsnachweis.
