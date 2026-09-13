# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt immer `CLAUDE.md`.

## 1. Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
```

`04-caption/` enthält nur `caption.txt` und `word-timings.json`. Es gibt keine separaten Plattform-Captiondateien.

## 2. Drei Phasen

### Phase 1 — ChatGPT / Motion Authoring
- Recherche + Quellen
- anfängerfreundliches Skript
- Szenenplan und V9-Flow-Prompts
- Header + Icons
- fertige kanonische `animation.tsx` je Animationsszene
- Sound-Cue-Plan
- genau eine universelle Caption: `04-caption/caption.txt`

### Phase 2 — Nutzer
- finale Google-Flow-Bilder
- genau ein finales Haupt-Voiceover
- echte Wort-Timings aus diesem Voiceover

### Phase 3 — konfigurierter Executor
Phase 3 integriert Nutzerassets, versiegelten Animationscode und SFX. Kreative Änderungen nach dem Animation-Seal müssen zurück in Phase 1.

## 3. Harte Szenentyp-Regel

Für Reels ist jede Szene **exakt IMAGE oder ANIMATION**.

### IMAGE
- Flow-Bild als Hauptvisual
- Titel/Header/Icon gemäß Szenenposition
- audio-synchrone Captions
- kurze funktionale Objektlabels erlaubt
- **keine erklärende Remotion-Hauptanimation über dem Bild**

### ANIMATION
- eigenständige, individuell aus dem Sprechpunkt entwickelte Remotion-Hauptanimation
- Header/Icon + Captions
- SVG, Icons, Lottie, Shapes und Charts dürfen unterstützen
- **kein Flow-Bild als Hauptvisual**

Ein Bild+Animation-Hybrid als Reel-Hauptvisual ist verboten. Support-Werkzeuge machen aus einer wiederholten Hauptmechanik keine neue Animation.

## 4. Visual Beats und Timing

VISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

- Szenenzahl ist themenabhängig.
- Erst Sprechgedanke → sichtbares Verständnisziel → Visual Beat.
- Future-V3-Bildbeats ideal 1,8–3,0 s; ab 3,6 s Split prüfen; ohne neue Information max. 4,0 s.
- Mehrere Bildszenen nacheinander sind erlaubt.
- Finale Schnitte folgen echten Wort-Zeitstempeln.
- 60/40 Bild/Animation bleibt nur Richtwert.

## 5. Cover Hook V3 und Captions

Neue Reels verwenden `finanzneo-cover-hook-v3`.

**Frame 0 ist bereits das fertige Cover:**

- Hero-Bild ist im allerersten Videoframe vollständig sichtbar (`opacity = 1`)
- exakter Reel-Titel ist ebenfalls ab Frame 0 sichtbar
- kein schwarzer Vorlauf
- kein Hero-Bild-Fade-in
- keine Cover-Entrance-Transition
- die generischen `imageEnterFrames` anderer Bildszenen werden auf scene-01 nicht angewendet; `scene01ImageEnterFrames = 0`
- kein normaler SceneHeader und kein Header-Icon in scene-01
- **Captions beginnen mit dem ersten gesprochenen Wort, auch in scene-01**
- gesprochenes Voiceover ohne Captions ist verboten

Ein Titel auf schwarzem Hintergrund, bei dem das Hero-Bild erst nach einigen Frames erscheint, ist ein harter Fehler und darf nicht exportiert werden.

Ab scene-02: normaler SceneHeader + Icon + Captions.

## 6. Bilder / Google Flow

- exakt ein Bildjob gleichzeitig
- warten → umbenennen → V9-QA → erst dann nächster Job
- keine Batch-/Parallelgenerierung
- scene-01 ist automatisch das Cover; kein Bild 00
- finale Bilder liegen in `03-szenen/00-ALLE-BILDER-HIER-REIN/`

Bildwelt: `finanzneo-stylized-3d-animated-black-v9`. Reale Alltagssituation und Ursache/Wirkung zuerst; klar stilisiertes 3D; niemals fotorealistisch; Deep Black Pflicht.

## 7. Layout und Safe-Zone

```text
Header Y154
Header 56 px, Minimum 50 px, max. 2 Zeilen
Icon 34 px
Visual Y320–1400
Caption bottom340, max. 2 Zeilen
Animation X72–1008
Transition 3 Frames
```

`AnimationStage` clippt vertikal auf Y320–1400. Quality Guards V1 schützen zusätzlich horizontal X72–1008 plus perspektivischen Innenabstand. Der produktive Hintergrund bleibt statisch `#000000`.

## 8. Animationen

Animationsszenen folgen:

```text
Sprechpunkt
→ Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ Technik
→ START → AKTION → REAKTION → ERGEBNIS → RESULT HOLD
```

Pflicht: konkrete Ursache/Wirkung, mehrere koordinierte Motion-Channels, mindestens 15 Frames Ergebnis-Hold. Keine feste Animationsbibliothek als kreatives Auswahlmenü.

Quality Guards V1 lesen zusätzlich die **echte `animation.tsx`**. Unterschiedliche `MECHANIC_ID`, Labels, Icons oder Lotties reichen nicht, wenn tatsächliche Hauptobjekte und Komposition sichtbar gleich bleiben. Wiederholung braucht konkrete inhaltliche Begründung.

## 9. SFX

SFX bestätigen sichtbare Ereignisse framegenau. Voiceover bleibt dominant. Keine Placeholder-Beeps, Remote-Sound-URLs oder Casino-/Jackpot-Geldsounds.

## 10. Playwright Visual QA

Playwright Visual QA prüft Bild- und Animationsszenen. Geprüft werden Header/Icon, Y320–1400, Caption-Abstand, Hero-Größe, Leerraum, sichtbare Start→Ergebnis-Veränderung und Clipping.

Zusätzlich prüft die finale Candidate-QA bei neuen Reels die horizontalen Außenbänder. Sichtbarer Animationsinhalt außerhalb der Safe-Zone kann den Export blockieren.

Für Cover Hook V3 wird der visuelle Kern **exakt bei Frame 0** geprüft und mit einem frühen stabilen Cover-Frame verglichen. So kann ein schwarzer Startframe oder versteckter Bild-Fade-in nicht mehr durch eine spätere Stichprobe bestehen.

## 11. Phase 3 / Abschluss

```bash
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` erzeugt Candidate → Audio-Mastering → Render-QA → Presentation/Occupancy-QA → Edge-Band-QA → exakte Frame-0-Hero-QA → finalen Export.

FINAL_COMPLETE verlangt: alle Szenen belegt, Animations-Seal korrekt, Audio vorhanden, 1080×1920, echte Timings, Visual-QA bestanden, vollständiges Hero-Bild ab Frame 0, keine abgeschnittenen Animationsobjekte und vollständiges `06-export/`.

## 12. Publishing

```text
06-export/<reel-name>.mp4
06-export/cover.<ext>
06-export/caption-universal.txt
06-export/untertitel.srt
06-export/bilder.zip
06-export/UPLOAD.md
```

`caption-universal.txt` ist die einzige Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat. Keine separaten Plattform-Captiondateien. YouTube bleibt eigenständiges Longform unter `youtube/`.
